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
            <Apple size={14} /> MATCHDAY FUELING
          </span>
          <h1>Player Nutrition & Hydration Blueprint</h1>
          <p>
            When to eat, what to drink, and how to recover fast — calibrated specifically for youth football performance.
          </p>
        </div>
      </div>

      <NutritionSection />
      <PublicFooter />
    </div>
  );
}
