import { MatchRecord, LeagueStanding } from './matches-data';

export interface DdslDivisionData {
  leagueName: string;
  leagueUrl: string;
  leagueId: string;
  syncedAt: string;
  rvrMatches: MatchRecord[];
  allDivisionMatches: MatchRecord[];
  standings: LeagueStanding[];
  /** Set when the live fetch/parse failed. Callers must show this plainly -
   * never substitute fabricated matches or standings for it. A youth
   * football result is either the real DDSL record or clearly marked as
   * unavailable, never a plausible-looking guess. */
  error?: string;
}

function slug(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 24);
}

export async function fetchLiveDdslLeagueData(leagueId: string = '218148'): Promise<DdslDivisionData> {
  const url = `https://ddsl.ie/league/${leagueId}/`;
  
  try {
    const res = await fetch(url, {
      next: { revalidate: 300 }, // Cache for 5 minutes in Next.js
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
      },
    });

    if (!res.ok) {
      throw new Error(`DDSL server returned HTTP ${res.status}`);
    }

    const html = await res.text();
    const now = new Date().toISOString();

    // 1. Extract League Title
    const titleMatch = html.match(/<h2>(.*?)<\/h2>/i);
    const leagueName = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : '13 Major 1 Boys Sat';

    // 2. Parse all match rows with data-* attributes
    const parsedMatches: MatchRecord[] = [];
    const rowRegex = /<tr class="table-body ([^"]*desktop-view[^"]*)"([^>]*)>/gi;
    let m;

    while ((m = rowRegex.exec(html)) !== null) {
      const attrStr = m[2];
      const getAttr = (name: string) => {
        const match = attrStr.match(new RegExp(`data-${name}="([^"]*)"`, 'i'));
        return match ? match[1].trim() : '';
      };

      const hometeam = getAttr('hometeam');
      const awayteam = getAttr('awayteam');
      const date = getAttr('date') || 'TBC';
      const time = getAttr('time') || '00:00';
      const homescore = getAttr('homescore');
      const awayscore = getAttr('awayscore');
      const venue = getAttr('venue') || 'TBC';
      const compname = getAttr('compname') || leagueName;
      const referee = getAttr('referee');
      const comment = getAttr('comment');

      if (hometeam && awayteam) {
        const isCompleted = homescore !== '' && awayscore !== '';
        const isRvrHome = hometeam.toLowerCase().includes('river valley') || hometeam.toLowerCase().includes('rivervalley');
        const isRvrAway = awayteam.toLowerCase().includes('river valley') || awayteam.toLowerCase().includes('rivervalley');
        
        let opponent = awayteam;
        let homeAway: 'home' | 'away' | 'neutral' = 'neutral';
        let rvrGoals: number | null = null;
        let opponentGoals: number | null = null;

        if (isRvrHome) {
          opponent = awayteam;
          homeAway = 'home';
          if (isCompleted) {
            rvrGoals = parseInt(homescore, 10);
            opponentGoals = parseInt(awayscore, 10);
          }
        } else if (isRvrAway) {
          opponent = hometeam;
          homeAway = 'away';
          if (isCompleted) {
            rvrGoals = parseInt(awayscore, 10);
            opponentGoals = parseInt(homescore, 10);
          }
        } else {
          // Division match not involving RVR directly
          if (isCompleted) {
            rvrGoals = parseInt(homescore, 10);
            opponentGoals = parseInt(awayscore, 10);
          }
        }

        const parsedHomeScore = homescore !== '' ? parseInt(homescore, 10) : null;
        const parsedAwayScore = awayscore !== '' ? parseInt(awayscore, 10) : null;

        // A match's id must survive from the moment it's picked in the
        // screenshot importer to when its result is looked up again later -
        // it used to be a plain row counter (`ddsl-${leagueId}-${idx++}`),
        // which reassigns to a different real fixture every time DDSL's
        // page reorders (new fixture added, a result posted, etc). That
        // silently detached recorded results/stats from the match they
        // were actually for. Derive it from the fixture itself instead.
        parsedMatches.push({
          id: `ddsl-${leagueId}-${slug(date)}-${slug(hometeam)}-${slug(awayteam)}`,
          opponent: isRvrHome || isRvrAway ? opponent : `${hometeam} vs ${awayteam}`,
          homeTeam: hometeam,
          awayTeam: awayteam,
          homeScore: parsedHomeScore,
          awayScore: parsedAwayScore,
          competition: compname,
          matchDate: date,
          kickoffTime: time === '00:00' ? 'TBC' : time,
          venue: venue,
          homeAway: homeAway,
          status: isCompleted ? 'completed' : 'upcoming',
          rvrGoals: rvrGoals,
          opponentGoals: opponentGoals,
          scorers: isCompleted && (isRvrHome || isRvrAway) && (rvrGoals ?? 0) > 0 ? 'Official DDSL Record' : null,
          potm: referee ? `Ref: ${referee}` : null,
          matchNotes: comment || (referee ? `Official Referee: ${referee}` : null),
          ddslMatchId: `DDSL-${leagueId}-${date.replace(/\s+/g, '')}-${hometeam.substring(0, 4)}`,
          syncedAt: now,
          createdAt: now,
        });
      }
    }

    // Filter RVR specific matches
    const rvrMatches = parsedMatches.filter(
      (m) => m.homeAway === 'home' || m.homeAway === 'away'
    );

    // 3. Compute Real Live League Standings from all completed division matches
    const teamsMap = new Map<string, {
      team: string;
      p: number;
      w: number;
      d: number;
      l: number;
      gf: number;
      ga: number;
      gd: number;
      pts: number;
      form: ('W' | 'D' | 'L')[];
      isRvr: boolean;
    }>();

    // Initialise all division teams seen in matches - using each match's own
    // parsed homeTeam/awayTeam directly rather than re-locating them in the
    // raw HTML by searching near the venue string, which broke whenever two
    // matches shared a venue (a real, frequent case: home fixtures share a
    // ground) and was never needed since the fields are already on `m`.
    parsedMatches.forEach((m) => {
      [m.homeTeam, m.awayTeam].forEach((t) => {
        if (t && !teamsMap.has(t)) {
          const isRvr = t.toLowerCase().includes('river valley') || t.toLowerCase().includes('rivervalley');
          teamsMap.set(t, {
            team: t,
            p: 0,
            w: 0,
            d: 0,
            l: 0,
            gf: 0,
            ga: 0,
            gd: 0,
            pts: 0,
            form: [],
            isRvr: isRvr,
          });
        }
      });
    });

    // Populate stats from EVERY completed match in the division, not just
    // ones RVR played at home. The previous version only processed matches
    // where m.homeAway === 'home' (RVR's own home fixtures), so every other
    // team's record - and RVR's own away results - never got counted: a
    // real division of 141 parsed matches produced a standings table where
    // 8 of 11 teams showed zero games played. Credit both the home and away
    // side of every completed match directly from the match's own
    // homeTeam/awayTeam fields (already parsed above) - no need to re-scan
    // the raw HTML by proximity to the venue string, which was fragile and
    // is no longer used.
    const completedMatches = parsedMatches.filter(
      (m) => m.status === 'completed' && m.homeScore !== null && m.awayScore !== null,
    );
    completedMatches.forEach((m) => {
      const homeTeam = teamsMap.get(m.homeTeam!);
      const awayTeam = teamsMap.get(m.awayTeam!);
      if (!homeTeam || !awayTeam) return;

      const homeGoals = m.homeScore!;
      const awayGoals = m.awayScore!;

      homeTeam.p += 1;
      awayTeam.p += 1;
      homeTeam.gf += homeGoals;
      homeTeam.ga += awayGoals;
      awayTeam.gf += awayGoals;
      awayTeam.ga += homeGoals;

      if (homeGoals > awayGoals) {
        homeTeam.w += 1;
        homeTeam.pts += 3;
        homeTeam.form.push('W');
        awayTeam.l += 1;
        awayTeam.form.push('L');
      } else if (homeGoals === awayGoals) {
        homeTeam.d += 1;
        homeTeam.pts += 1;
        homeTeam.form.push('D');
        awayTeam.d += 1;
        awayTeam.pts += 1;
        awayTeam.form.push('D');
      } else {
        homeTeam.l += 1;
        homeTeam.form.push('L');
        awayTeam.w += 1;
        awayTeam.pts += 3;
        awayTeam.form.push('W');
      }
    });

    // Convert teamsMap to sorted standings
    const standingsArray: LeagueStanding[] = Array.from(teamsMap.values()).map((t) => ({
      pos: 0,
      team: t.team,
      p: t.p,
      w: t.w,
      d: t.d,
      l: t.l,
      gf: t.gf,
      ga: t.ga,
      gd: t.gf - t.ga,
      pts: t.pts,
      form: t.form,
      isRvr: t.isRvr,
    }));

    // If only 1 result recorded yet, ensure standard DDSL 13 Major 1 table ordering
    standingsArray.sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.gd !== a.gd) return b.gd - a.gd;
      if (b.gf !== a.gf) return b.gf - a.gf;
      return a.team.localeCompare(b.team);
    });

    standingsArray.forEach((t, i) => {
      t.pos = i + 1;
    });

    return {
      leagueName,
      leagueUrl: url,
      leagueId,
      syncedAt: now,
      rvrMatches: rvrMatches.length > 0 ? rvrMatches : parsedMatches,
      allDivisionMatches: parsedMatches,
      standings: standingsArray,
    };
  } catch (error) {
    // No fabricated matches or standings on failure - a real youth football
    // result is either the genuine DDSL record or clearly marked as
    // unavailable, never a plausible-looking invented one (this used to
    // return hardcoded fake scores, a made-up referee name and an invented
    // result attributed to a real opponent). Callers must check `error` and
    // show it plainly rather than rendering empty arrays as "no matches."
    console.error('Error scraping DDSL live league data:', error);
    const now = new Date().toISOString();
    return {
      leagueName: '',
      leagueUrl: url,
      leagueId,
      syncedAt: now,
      rvrMatches: [],
      allDivisionMatches: [],
      standings: [],
      error: error instanceof Error ? error.message : 'Failed to load DDSL league data',
    };
  }
}
