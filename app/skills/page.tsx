import Link from 'next/link';
import { ArrowLeft, Play, Sparkles } from 'lucide-react';
import { PublicFooter } from '../components/public-footer';
import { PublicHeader } from '../components/public-header';
import { SkillsSection } from '../components/skills-section';
import { requireApprovedMember } from '../lib/authz';

export const dynamic = 'force-dynamic';

export default async function SkillsPage() {
  const currentMember = await requireApprovedMember();

  return (
    <div className="public-page-root">
      <PublicHeader isAuthenticated={Boolean(currentMember)} />

      <div className="page-hero-banner">
        <div className="section-container">
          <div className="breadcrumb">
            <Link href="/portal"><ArrowLeft size={14} /> Back to Portal</Link>
            <span>/</span>
            <span>Skills & Drills Vault</span>
          </div>
          <span className="section-pill">
            <Sparkles size={14} /> RVR U13 MAJOR 1 · SKILLS VAULT
          </span>
          <h1>Master Your Football Technique</h1>
          <p>
            Pro 1v1 skills tutorials, explosive first-touch drills, and finishing techniques tailored for our U13 Major 1 squad.
          </p>
        </div>
      </div>

      <SkillsSection />
      <PublicFooter />
    </div>
  );
}
