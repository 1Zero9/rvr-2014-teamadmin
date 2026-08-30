import Link from 'next/link';
import { Apple, ArrowLeft, Droplets } from 'lucide-react';
import { NutritionSection } from '../components/nutrition-section';
import { PublicFooter } from '../components/public-footer';
import { PublicHeader } from '../components/public-header';
import { getCurrentMember } from '../lib/authz';

export const dynamic = 'force-dynamic';

export default async function NutritionPage() {
  const currentMember = await getCurrentMember();

  return (
    <div className="public-page-root">
      <PublicHeader isAuthenticated={Boolean(currentMember)} />

      <div className="page-hero-banner">
        <div className="section-container">
          <div className="breadcrumb">
            <Link href="/"><ArrowLeft size={14} /> Back to Hub</Link>
            <span>/</span>
            <span>Nutrition & Hydration</span>
          </div>
          <span className="section-pill">
            <Apple size={14} /> RVR U13 MAJOR 1 · PLAYER FUEL
          </span>
          <h1>Matchday Fueling & Hydration Guide</h1>
          <p>
            Pre-match carbohydrate meals, halftime energy snacks, and optimal hydration targets for our U13 players.
          </p>
        </div>
      </div>

      <NutritionSection />
      <PublicFooter />
    </div>
  );
}
