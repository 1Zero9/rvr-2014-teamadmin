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
import { getMatchesFromDb } from './lib/matches';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const currentMember = await getCurrentMember();
  const allMatches = await getMatchesFromDb();

  const latestResult = allMatches.find((m) => m.status === 'completed');
  const nextFixture = allMatches.find((m) => m.status === 'upcoming');

  const HUB_SECTIONS = [
    {
      id: 'fixtures',
      title: 'Fixtures & Results',
      badge: 'Live DDSL Centre',
      pillColor: 'amber',
      icon: Trophy,
      desc: 'Real-time DDSL match outcomes, goalscorers, upcoming kick-offs, and official division league table.',
      highlights: ['Automated DDSL Match Sync', 'Full Division Standings & Form', 'Goalscorers & Player of Match'],
      href: '/fixtures',
      btnText: 'View Fixtures & Standings',
    },
    {
      id: 'skills',
      title: 'Skills & Drills Vault',
      badge: 'Video Masterclass',
      pillColor: 'blue',
      icon: Play,
      desc: 'Step-by-step video drills for ball mastery, 1v1 moves, sharp first touches, and precision finishing.',
      highlights: ['8 Curated Video Drills', 'Coaching Cues & Key Points', 'Target Repetitions & Sets'],
      href: '/skills',
      btnText: 'Explore Skills Vault',
    },
    {
      id: 'training',
      title: 'Training & Kit Checklist',
      badge: 'Weekly Protocols',
      pillColor: 'green',
      icon: Calendar,
      desc: 'Session timetable, arrival expectations, live pitch weather status, and interactive gear checklist.',
      highlights: ['Tuesday & Thursday Slots', 'Live Pitch & Weather Alert', 'Interactive Gear Checklist'],
      href: '/training',
      btnText: 'View Training Schedule',
    },
    {
      id: 'sc',
      title: 'Strength & Conditioning',
      badge: 'Youth Athletic Dev',
      pillColor: 'purple',
      icon: Zap,
      desc: 'Age-appropriate athletic training focusing on FIFA 11+ dynamic activation, speed mechanics, and core stability.',
      highlights: ['FIFA 11+ Dynamic Warm-up', 'Acceleration & Agility Ladders', 'Injury Prevention & Recovery'],
      href: '/sc',
      btnText: 'Open S&C Program',
    },
    {
      id: 'nutrition',
      title: 'Nutrition & Hydration',
      badge: 'Matchday Fueling',
      pillColor: 'amber',
      icon: Apple,
      desc: 'Sports nutrition blueprint: 3-hour pre-game meal ideas, hydration timelines, and half-time energy snacks.',
      highlights: ['4-Phase Meal Timeline', 'Pre-Match Fuel Options', 'Matchday Do’s & Don’ts'],
      href: '/nutrition',
      btnText: 'Read Nutrition Guide',
    },
    {
      id: 'venues',
      title: 'Pitch Venues & GPS',
      badge: 'Interactive Directory',
      pillColor: 'blue',
      icon: Compass,
      desc: 'Directions, pitch surfaces, footwear recommendations, and 1-tap Google Maps navigation for all pitches.',
      highlights: ['Rivervalley Park Pitches 1 & 2', 'ALSAA, AUL & Brookdale', 'One-Tap GPS Navigation'],
      href: '/venues',
      btnText: 'Open Pitch Locations',
    },
    {
      id: 'tournaments',
      title: 'Cups & Tournaments',
      badge: 'DDSL Central',
      pillColor: 'amber',
      icon: Medal,
      desc: 'Knockout cup format, extra time rules, penalty shootout protocols, blitzes, and squad travel preparation.',
      highlights: ['DDSL Cup Knockout Rules', 'Fingal Blitzes & Tours', 'Squad Travel Packing List'],
      href: '/tournaments',
      btnText: 'Check Cup Schedules',
    },
    {
      id: 'photos',
      title: 'Photos & Highlights',
      badge: 'Squad Moments',
      pillColor: 'green',
      icon: Camera,
      desc: 'Matchday action shots, tournament victory celebrations, and team milestones from the 2026/27 season.',
      highlights: ['Matchday Action Snaps', 'Trophy Presentations', 'Interactive Lightbox Viewer'],
      href: '/photos',
      btnText: 'View Photo Gallery',
    },
  ];

  return (
    <div className="public-page-root">
      {/* Sticky Top Header */}
      <PublicHeader isAuthenticated={Boolean(currentMember)} />

      {/* Hero Section with Squad Image Background & Fade-out */}
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
              <Trophy size={13} /> DDSL 2026/27 SEASON
            </span>
            <span className="hero-pill location">
              <MapPin size={13} /> SWORDS, DUBLIN
            </span>
            <span className="hero-pill squad">
              <Users size={13} /> 2014 SQUAD HUB
            </span>
          </div>

          <h1 className="hero-title">
            Rivervalley Rangers <span>2014 Squad Hub</span>
          </h1>

          <p className="hero-subtitle">
            The dedicated platform for player development, matchday preparation, technical drills, nutrition guides, pitch navigation, and tournament updates.
          </p>

          <div className="hero-cta-group">
            <Link href="/fixtures" className="hero-btn hero-btn-primary">
              <Trophy size={16} /> Fixtures & Results
            </Link>
            <Link href="/skills" className="hero-btn hero-btn-secondary">
              <Play size={16} fill="currentColor" /> Skills Vault
            </Link>
            <Link href="/venues" className="hero-btn hero-btn-secondary">
              <Compass size={16} /> Pitch GPS
            </Link>
            <Link
              href={currentMember ? '/portal' : '/login'}
              className="hero-btn hero-btn-portal"
            >
              <Lock size={15} />
              <span>{currentMember ? 'Open Team Portal' : 'Team Portal & Accounts'}</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          {/* Quick Highlights Bar */}
          <div className="hero-highlights-bar">
            <div className="highlight-stat">
              <div className="stat-icon amber">
                <Trophy size={20} />
              </div>
              <div>
                <strong>DDSL Results Live</strong>
                <span>Division Table & Scores</span>
              </div>
            </div>

            <div className="highlight-stat">
              <div className="stat-icon blue">
                <Play size={20} />
              </div>
              <div>
                <strong>Video Skills Library</strong>
                <span>8 Master Drills with Cues</span>
              </div>
            </div>

            <div className="highlight-stat">
              <div className="stat-icon green">
                <Zap size={20} />
              </div>
              <div>
                <strong>Youth S & C Program</strong>
                <span>FIFA 11+ & Agility Training</span>
              </div>
            </div>

            <div className="highlight-stat">
              <div className="stat-icon purple">
                <MapPin size={20} />
              </div>
              <div>
                <strong>Interactive Pitch GPS</strong>
                <span>5 Venues with Directions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Matchday Strip */}
      <section className="matchday-live-strip">
        <div className="section-container">
          <div className="matchday-strip-inner">
            {/* Latest Result Item */}
            {latestResult && (
              <div className="ticker-card result">
                <div className="ticker-badge win">
                  <span>LATEST RESULT</span>
                </div>
                <div className="ticker-content">
                  <div className="ticker-scoreline">
                    <strong>
                      {latestResult.homeAway === 'home'
                        ? `RVR AFC ${latestResult.rvrGoals} - ${latestResult.opponentGoals} ${latestResult.opponent}`
                        : `${latestResult.opponent} ${latestResult.opponentGoals} - ${latestResult.rvrGoals} RVR AFC`}
                    </strong>
                    <span className="ticker-ft-tag">FT (WON)</span>
                  </div>
                  {latestResult.scorers && (
                    <small className="ticker-scorers">
                      ⚽ {latestResult.scorers}
                    </small>
                  )}
                </div>
              </div>
            )}

            {/* Next Fixture Item */}
            {nextFixture && (
              <div className="ticker-card fixture">
                <div className="ticker-badge next">
                  <span>NEXT FIXTURE</span>
                </div>
                <div className="ticker-content">
                  <div className="ticker-scoreline">
                    <strong>vs {nextFixture.opponent}</strong>
                    <span className="ticker-time-tag">
                      {nextFixture.matchDate} · {nextFixture.kickoffTime}
                    </span>
                  </div>
                  <small className="ticker-venue">
                    📍 {nextFixture.venue}
                  </small>
                </div>
              </div>
            )}

            <div className="ticker-action-wrap">
              <Link href="/fixtures" className="ticker-full-btn">
                <span>All Fixtures & Table</span>
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
            <h2>Explore Everything for RVR 2014</h2>
            <p>
              Select any section below to access comprehensive training guides, video tutorials, nutrition plans, and matchday tools.
            </p>
          </div>

          <div className="hub-cards-grid">
            {HUB_SECTIONS.map((sec) => {
              const IconComponent = sec.icon;
              return (
                <article className="hub-feature-card" key={sec.id}>
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

      {/* Featured Matchday Spotlight Banner */}
      <section className="public-section alt-bg">
        <div className="section-container">
          <div className="spotlight-banner">
            <div className="spotlight-content">
              <span className="spotlight-tag">MATCHDAY READINESS</span>
              <h2>Are You Prepared for This Weekend?</h2>
              <p>
                Make sure you have your hydration started 24 hours prior, your shin guards and boots packed, and check your pitch location arrival time.
              </p>
              <div className="spotlight-buttons">
                <Link href="/fixtures" className="spotlight-btn primary">
                  <Trophy size={16} /> Check Fixture & Pitch
                </Link>
                <Link href="/training" className="spotlight-btn secondary">
                  <Calendar size={16} /> Check Kit Checklist
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
                <small>Rivervalley Rangers AFC · 2014 Squad</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Private Portal Callout */}
      <section className="portal-callout-section">
        <div className="section-container">
          <div className="portal-callout-card">
            <div className="callout-icon-wrap">
              <Lock size={32} />
            </div>
            <div className="callout-text">
              <span className="callout-tag">RESTRICTED ACCESS FOR RVR FAMILIES</span>
              <h3>Private Team Portal & Financial Accounts</h3>
              <p>
                Are you an RVR 2014 coach, parent, or club administrator? Access the private squad fund ledger, record expenses, review season contributions, and vote on upcoming team outings.
              </p>
            </div>
            <div className="callout-actions">
              <Link
                href={currentMember ? '/portal' : '/login'}
                className="callout-btn"
              >
                <Lock size={16} />
                <span>{currentMember ? 'Go to Dashboard' : 'Log In to Team Portal'}</span>
                <ChevronRight size={16} />
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
