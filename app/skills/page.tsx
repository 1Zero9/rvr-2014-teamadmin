import Link from 'next/link';
import { ArrowLeft, Play, Sparkles } from 'lucide-react';
import { PublicFooter } from '../components/public-footer';
import { PublicHeader } from '../components/public-header';
import { SkillsSection } from '../components/skills-section';
import { getCurrentMember } from '../lib/authz';

export const dynamic = 'force-dynamic';

export default async function SkillsPage() {
  const currentMember = await getCurrentMember();

  return (
    <div className="public-page-root">
      <PublicHeader isAuthenticated={Boolean(currentMember)} />

      <div className="page-hero-banner">
        <div className="section-container">
          <div className="breadcrumb">
            <Link href="/"><ArrowLeft size={14} /> Back to Hub</Link>
            <span>/</span>
            <span>Skills & Drills Vault</span>
          </div>
          <span className="section-pill">
            <Sparkles size={14} /> FOOTBALL SKILLS VAULT
          </span>
          <h1>Master Your Football Technique</h1>
          <p>
            Curated football skills, footwork drills, and tactical habits specifically calibrated for 2014 youth development.
          </p>
        </div>
      </div>

      <SkillsSection />
      <PublicFooter />
    </div>
  );
}
