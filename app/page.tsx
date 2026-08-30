import Image from 'next/image';
import Link from 'next/link';
import {
  Apple,
  Award,
  Calendar,
  Camera,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  Droplets,
  Dumbbell,
  ExternalLink,
  Flame,
  Globe,
  Lock,
  MapPin,
  Medal,
  Play,
  RefreshCw,
  Shield,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import { PublicFooter } from './components/public-footer';
import { PublicHeader } from './components/public-header';
import { getCurrentMember } from './lib/authz';
import { fetchLiveDdslLeagueData } from './lib/ddsl-live';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const currentMember = await getCurrentMember();
  const liveDdslData = await fetchLiveDdslLeagueData('218148');

  const latestResult = liveDdslData.rvrMatches.find((m) => m.status === 'completed') || {
    opponent: 'Greystones United AFC',
    matchDate: '29 Aug 2026',
    venue: 'Rivervalley Park',
    homeAway: 'home' as const,
    rvrGoals: 1,
    opponentGoals: 0,
    matchNotes: 'Opening Matchday Victory · Mick O\'Beirne (Ref)',
  };

  const nextFixture = liveDdslData.rvrMatches.find((m) => m.status === 'upcoming') || {
    opponent: 'Rosemount Mulvey FC',
    matchDate: 'Sat 5th Sept 2026',
    kickoffTime: '10:30 AM',
    venue: 'Rivervalley Park - Pitch 1',
  };

  const HUB_SECTIONS = [
    {
      id: 'fixtures',
      title: 'Fixtures & League Table',
      badge: 'Live DDSL 218148',
      pillColor: 'gold',
      icon: Trophy,
      desc: 'Official DDSL match outcomes, verified full-time scores, upcoming kick-offs, and live division standings.',
      highlights: ['13 Major 1 Boys Sat Table', '1-0 Win vs Greystones United', 'Full Division Fixture List'],
      href: '/fixtures',
      btnText: 'View Match Centre & Table',
    },
    {
      id: 'skills',
      title: 'Skills & Video Drills',
      badge: 'Masterclass',
      pillColor: 'cyan',
      icon: Play,
      desc: 'High-energy video tutorials for 1v1 moves, sharp turns, quick footwork, and top-corner finishing.',
      highlights: ['8 Essential Youth Drills', 'Pro Coaching Cues & Steps', 'Repetition & Daily Challenges'],
      href: '/skills',
      btnText: 'Open Skills Vault',
    },
    {
      id: 'training',
      title: 'Training & Match Kit',
      badge: 'Squad Protocols',
      pillColor: 'green',
      icon: Calendar,
      desc: 'Weekly training timetable, pitch allocations, weather notifications, and interactive kit checklist.',
      highlights: ['Tuesday & Thursday Slots', 'Arrival & Warmup Times', 'Interactive Gear Checklist'],
      href: '/training',
      btnText: 'Check Schedule & Kit',
    },
    {
      id: 'sc',
      title: 'Speed, Agility & S&C',
      badge: 'Athletic Dev',
      pillColor: 'purple',
      icon: Zap,
      desc: 'Youth athletic development: FIFA 11+ dynamic activation, speed ladder footwork, and core stability.',
      highlights: ['FIFA 11+ Injury Prevention', 'Speed Ladder & Acceleration', 'Post-Match Recovery Routines'],
      href: '/sc',
      btnText: 'Start S&C Workout',
    },
    {
      id: 'nutrition',
      title: 'Matchday Fuel & Food',
      badge: 'Player Fuel',
      pillColor: 'orange',
      icon: Apple,
      desc: 'What to eat before kick-off, halftime energy boosters, hydration targets, and fast muscle recovery meals.',
      highlights: ['3-Hour Pre-Match Meals', 'Halftime Energy Snacks', 'Hydration Targets & Rules'],
      href: '/nutrition',
      btnText: 'Read Fueling Blueprint',
    },
    {
      id: 'venues',
      title: 'Pitch Venues & GPS',
      badge: '1-Tap Navigation',
      pillColor: 'blue',
      icon: Compass,
      desc: 'Directions, pitch surfaces, footwear recommendations, and one-tap Google/Apple Maps for home and away pitches.',
      highlights: ['Rivervalley Park Pitches 1 & 2', 'ALSAA, AUL & Brookdale', 'One-Tap Maps Directions'],
      href: '/venues',
      btnText: 'Open Pitch Directory',
    },
    {
      id: 'tournaments',
      title: 'Cups & Tournament Blitzes',
      badge: 'Knockout Glory',
      pillColor: 'gold',
      icon: Medal,
      desc: 'DDSL All-Dublin Cup knockout format, extra-time rules, summer blitzes, and squad tour packing lists.',
      highlights: ['DDSL Cup Extra-Time Rules', 'Summer Blitz Schedules', 'Squad Travel Packing Guide'],
      href: '/tournaments',
      btnText: 'View Cup Info',
    },
    {
      id: 'photos',
      title: 'Squad Moments & Photos',
      badge: 'Matchday Action',
      pillColor: 'green',
      icon: Camera,
      desc: 'Match action photos, goal celebrations, tournament victories, and squad memories from the 2026/27 season.',
      highlights: ['Matchday Action Snaps', 'Trophy & Blitz Celebrations', 'Interactive Photo Lightbox'],
      href: '/photos',
      btnText: 'View Photo Gallery',
    },
  ];

  return (
    <div className="public-page-root">
      {/* Top Header */}
      <PublicHeader isAuthenticated={Boolean(currentMember)} />

      {/* Hero Section with Vibrant Youth Sport Styling */}
      <section className="hero-section hero-with-bg">
        <div
          className="hero-bg-image"
          style={{ backgroundImage: `url('/hero-squad.jpg')` }}
        />
        <div className="hero-gradient-overlay" />
        <div className="hero-overlay" />

        <div className="hero-container">
          <div className="hero-badge-row">
            <span className="hero-pill season">
              <Trophy size={13} /> 13 MAJOR 1 BOYS SAT
            </span>
            <span className="hero-pill location">
              <MapPin size={13} /> SWORDS, DUBLIN
            </span>
            <span className="hero-pill squad">
              <Flame size={13} /> 2014 SQUAD
            </span>
          </div>

          <h1 className="hero-title">
            Rivervalley Rangers <span>U13 MAJOR 1</span>
          </h1>

          <p className="hero-subtitle">
            The official player development and matchday hub for the RVR 2014 squad. Skills drills, live DDSL scores, match preparation, and team directions.
          </p>

          <div className="hero-cta-group">
            <Link href="/fixtures" className="hero-btn hero-btn-primary">
              <Trophy size={16} /> Fixtures & Standings
            </Link>
            <Link href="/skills" className="hero-btn hero-btn-cyan">
              <Play size={16} fill="currentColor" /> Skills Vault
            </Link>
            <Link href="/venues" className="hero-btn hero-btn-secondary">
              <Compass size={16} /> Pitch GPS
            </Link>
            <Link
              href={currentMember ? '/portal' : '/login'}
              className="hero-btn hero-btn-portal"
            >
              <Lock size={14} />
              <span>{currentMember ? 'Team Portal' : 'Parent & Coach Portal'}</span>
              <ChevronRight size={15} />
            </Link>
          </div>

          {/* Quick Highlights Bar */}
          <div className="hero-highlights-bar">
            <div className="highlight-stat gold">
              <div className="stat-icon gold">
                <Trophy size={20} />
              </div>
              <div>
                <strong>DDSL 13 Major 1</strong>
                <span>Position 5 (3 pts · 1 Win)</span>
              </div>
            </div>

            <div className="highlight-stat cyan">
              <div className="stat-icon cyan">
                <Play size={20} />
              </div>
              <div>
                <strong>Video Skills Library</strong>
                <span>8 Master Drills with Cues</span>
              </div>
            </div>

            <div className="highlight-stat green">
              <div className="stat-icon green">
                <Zap size={20} />
              </div>
              <div>
                <strong>Speed & S&C Drills</strong>
                <span>FIFA 11+ Warmup & Agility</span>
              </div>
            </div>

            <div className="highlight-stat orange">
              <div className="stat-icon orange">
                <Apple size={20} />
              </div>
              <div>
                <strong>Game Day Fuel</strong>
                <span>Pre-Match Meals & Timeline</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Matchday Strip */}
      <section className="matchday-live-strip">
        <div className="section-container">
          <div className="matchday-strip-inner">
            {/* Latest Result */}
            <div className="ticker-card result">
              <div className="ticker-badge win">
                <span>⚽ LATEST RESULT</span>
              </div>
              <div className="ticker-content">
                <div className="ticker-scoreline">
                  <strong>
                    {latestResult.homeAway === 'home'
                      ? `River Valley Rangers ${latestResult.rvrGoals} - ${latestResult.opponentGoals} ${latestResult.opponent}`
                      : `${latestResult.opponent} ${latestResult.opponentGoals} - ${latestResult.rvrGoals} River Valley Rangers`}
                  </strong>
                  <span className="ticker-ft-tag">FT · WON 🏆</span>
                </div>
                <small className="ticker-scorers">
                  📍 {latestResult.venue} · 29 Aug 2026
                </small>
              </div>
            </div>

            {/* Next Fixture */}
            <div className="ticker-card fixture">
              <div className="ticker-badge next">
                <span>⚡ NEXT MATCH</span>
              </div>
              <div className="ticker-content">
                <div className="ticker-scoreline">
                  <strong>vs {nextFixture.opponent}</strong>
                  <span className="ticker-time-tag">
                    {nextFixture.matchDate}
                  </span>
                </div>
                <small className="ticker-venue">
                  📍 {nextFixture.venue}
                </small>
              </div>
            </div>

            <div className="ticker-action-wrap">
              <Link href="/fixtures" className="ticker-full-btn">
                <span>View Full League Table</span>
                <ChevronRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Hub Sections Directory */}
      <section className="public-section">
        <div className="section-container">
          <div className="section-head">
            <div className="section-pill">
              <Sparkles size={14} /> SQUAD RESOURCE DIRECTORY
            </div>
            <h2>Everything You Need for RVR U13</h2>
            <p>
              Matchday prep, video skills tutorials, nutrition guides, pitch navigation, and tournament updates for players, parents, and coaches.
            </p>
          </div>

          <div className="hub-cards-grid">
            {HUB_SECTIONS.map((sec) => {
              const IconComponent = sec.icon;
              return (
                <article className={`hub-feature-card ${sec.pillColor}`} key={sec.id}>
                  <div className="hub-card-header">
                    <div className={`hub-card-icon ${sec.pillColor}`}>
                      <IconComponent size={22} />
                    </div>
                    <span className={`hub-card-badge ${sec.pillColor}`}>
                      {sec.badge}
                    </span>
                  </div>

                  <h3>{sec.title}</h3>
                  <p>{sec.desc}</p>

                  <ul className="hub-highlights-list">
                    {sec.highlights.map((hl, i) => (
                      <li key={i}>
                        <CheckCircle2 size={13} />
                        <span>{hl}</span>
                      </li>
                    ))}
                  </ul>

                  <Link href={sec.href} className="hub-card-cta">
                    <span>{sec.btnText}</span>
                    <ChevronRight size={16} />
                  </Link>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Matchday Locker Room Readiness Callout */}
      <section className="public-section alt-bg">
        <div className="section-container">
          <div className="spotlight-banner locker-room">
            <div className="spotlight-content">
              <span className="spotlight-tag">⚡ MATCHDAY LOCKER ROOM</span>
              <h2>Ready for Game Day?</h2>
              <p>
                Get hydrated the day before, pack your molded boots and shin guards, check your arrival time, and fuel up with complex carbs 3 hours prior to kickoff!
              </p>
              <div className="spotlight-buttons">
                <Link href="/fixtures" className="spotlight-btn primary">
                  <Trophy size={16} /> Check Next Fixture & Pitch
                </Link>
                <Link href="/training" className="spotlight-btn secondary">
                  <Calendar size={16} /> Match Kit Checklist
                </Link>
                <Link href="/nutrition" className="spotlight-btn cyan">
                  <Apple size={16} /> Pre-Match Fuel Plan
                </Link>
              </div>
            </div>
            <div className="spotlight-visual">
              <div className="spotlight-crest-box">
                <Image
                  src="/rvr-crest.png"
                  width={110}
                  height={110}
                  alt="Rivervalley Rangers Crest"
                />
                <small className="font-bold text-slate-800">RVR U13 Major 1 · 2014 Boys</small>
                <span className="text-[11px] text-blue-600 font-semibold block mt-1">Up the Valley! ⚽</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Private Portal Callout - Kept Clean & Serious for Parents/Coaches */}
      <section className="portal-callout-section">
        <div className="section-container">
          <div className="portal-callout-card">
            <div className="callout-icon-wrap">
              <Lock size={30} />
            </div>
            <div className="callout-text">
              <span className="callout-tag">RESTRICTED TEAM ACCESS</span>
              <h3>Parent & Coach Financial Portal</h3>
              <p>
                Access private squad finances, track season player registration contributions, submit referee and coach expense claims, and review club admin reports.
              </p>
            </div>
            <div className="callout-actions">
              <Link
                href={currentMember ? '/portal' : '/login'}
                className="callout-btn"
              >
                <Lock size={15} />
                <span>{currentMember ? 'Open Portal Dashboard' : 'Log In to Team Portal'}</span>
                <ChevronRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
