import Image from 'next/image';
import Link from 'next/link';
import {
  Apple,
  Award,
  CalendarDays,
  Camera,
  CheckCircle2,
  ChevronRight,
  Compass,
  Dumbbell,
  Flame,
  Globe,
  Lock,
  MapPin,
  Play,
  Shield,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from 'lucide-react';
import { GallerySection } from './components/gallery-section';
import { NutritionSection } from './components/nutrition-section';
import { PublicFooter } from './components/public-footer';
import { PublicHeader } from './components/public-header';
import { SCSection } from './components/sc-section';
import { SkillsSection } from './components/skills-section';
import { TournamentsSection } from './components/tournaments-section';
import { TrainingSection } from './components/training-section';
import { VenuesSection } from './components/venues-section';
import { getCurrentMember } from './lib/authz';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const currentMember = await getCurrentMember();

  return (
    <div className="public-page-root">
      {/* Sticky Top Navigation */}
      <PublicHeader isAuthenticated={Boolean(currentMember)} />

      {/* Hero Section */}
      <section className="hero-section">
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
            Rivervalley Rangers <span>2014 Team Hub</span>
          </h1>

          <p className="hero-subtitle">
            The dedicated platform for player development, matchday preparation, technical drills, nutrition guides, pitch navigation, and tournament updates.
          </p>

          <div className="hero-cta-group">
            <a href="#skills" className="hero-btn primary">
              <Play size={16} fill="currentColor" /> Explore Skills Vault
            </a>
            <a href="#venues" className="hero-btn secondary">
              <Compass size={16} /> Pitch Venues & Directions
            </a>
            <Link
              href={currentMember ? '/portal' : '/login'}
              className="hero-btn portal-btn"
            >
              <Lock size={15} />
              <span>{currentMember ? 'Open Team Portal' : 'Team Portal & Accounts'}</span>
              <ChevronRight size={16} />
            </Link>
          </div>

          {/* Quick Stats / Highlights Bar */}
          <div className="hero-highlights-bar">
            <div className="highlight-stat">
              <div className="stat-icon blue">
                <Play size={20} />
              </div>
              <div>
                <strong>Video Skills Library</strong>
                <span>8 Master Drills with Coaching Cues</span>
              </div>
            </div>

            <div className="highlight-stat">
              <div className="stat-icon green">
                <Zap size={20} />
              </div>
              <div>
                <strong>Youth S & C Program</strong>
                <span>FIFA 11+ Dynamic Activation & Agility</span>
              </div>
            </div>

            <div className="highlight-stat">
              <div className="stat-icon amber">
                <Apple size={20} />
              </div>
              <div>
                <strong>Matchday Fueling</strong>
                <span>Pre-Match Timelines & Hydration Blueprint</span>
              </div>
            </div>

            <div className="highlight-stat">
              <div className="stat-icon purple">
                <MapPin size={20} />
              </div>
              <div>
                <strong>Interactive Pitch GPS</strong>
                <span>5 Venues with Surface & Footwear Guides</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 1. Skills & Drills Vault */}
      <SkillsSection />

      {/* 2. Training Information & Kit Checklist */}
      <TrainingSection />

      {/* 3. Strength & Conditioning */}
      <SCSection />

      {/* 4. Matchday Nutrition & Hydration */}
      <NutritionSection />

      {/* 5. Pitch Venues & GPS Navigation */}
      <VenuesSection />

      {/* 6. Cups & Tournaments Central */}
      <TournamentsSection />

      {/* 7. Photo Gallery */}
      <GallerySection />

      {/* Portal Access Callout Banner */}
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

      {/* Public Footer */}
      <PublicFooter />
    </div>
  );
}
