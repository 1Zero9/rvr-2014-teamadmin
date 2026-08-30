import Link from 'next/link';
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  Clock,
  ExternalLink,
  HeartPulse,
  Scale,
  ShieldCheck,
  Trophy,
} from 'lucide-react';
import { AccessPending, PortalPage } from '../components/portal-page';
import { StaffManager } from '../components/staff-manager';
import { canManageAccounts, requireApprovedMember } from '../lib/authz';
import { getCoachingStaffFromDb } from '../lib/staff-server';

export const dynamic = 'force-dynamic';

export default async function InformationPage() {
  const member = await requireApprovedMember();
  if (!member.approved) return <AccessPending member={member} />;

  const staffList = await getCoachingStaffFromDb();
  const canEdit = canManageAccounts(member.role);

  return (
    <PortalPage
      member={member}
      active="/information"
      eyebrow="TEAM HANDBOOK"
      title="RVR U13 Major 1 Squad Information"
    >
      <div className="squad-handbook-grid">
        {/* Dynamic & Editable Coaching / Staff Section */}
        <StaffManager initialStaff={staffList} canEdit={canEdit} />

        {/* Matchday Protocols */}
        <section className="handbook-card">
          <div className="handbook-card-head">
            <div className="head-icon green">
              <Clock size={20} />
            </div>
            <div>
              <h3>Matchday & Training Schedule</h3>
              <p>Punctuality, arrival protocols, and equipment checklist.</p>
            </div>
          </div>

          <div className="handbook-content-stack">
            <div className="handbook-item">
              <strong>⏰ Matchday Arrival: 45 Minutes Before Kick-Off</strong>
              <p>
                Mandatory arrival in full club tracksuit. Allows 35 minutes for team talk, tactical walk-through, and complete FIFA 11+ dynamic warm-up.
              </p>
            </div>

            <div className="handbook-item">
              <strong>⚽ Training Slots (Tues & Thurs)</strong>
              <p>
                Tuesday 6:30 PM (All-Weather / Astro) & Thursday 6:30 PM (Rivervalley Pitch 1). Shin guards and full water bottles mandatory.
              </p>
            </div>

            <div className="handbook-item">
              <strong>🌧 Weather & Pitch Status</strong>
              <p>
                Fingal County Council and DDSL pitch inspections occur by 8:30 AM on matchday. Immediate updates posted to squad WhatsApp and website ticker.
              </p>
            </div>
          </div>
        </section>

        {/* DDSL League & Cup Rules */}
        <section className="handbook-card">
          <div className="handbook-card-head">
            <div className="head-icon gold">
              <Trophy size={20} />
            </div>
            <div>
              <h3>DDSL U13 Competition Rules</h3>
              <p>Official DDSL 13 Major 1 match format and regulations.</p>
            </div>
          </div>

          <div className="handbook-content-stack">
            <div className="handbook-item">
              <strong>⏱ Match Duration & Ball Size</strong>
              <p>
                Two 30-minute halves (60 mins total). <strong>Size 4 football</strong> used for all U13 league and cup fixtures.
              </p>
            </div>

            <div className="handbook-item">
              <strong>🔄 Substitutions & Offside</strong>
              <p>
                Full offside rule applies. Rolling substitutions permitted at breaks in play with referee permission.
              </p>
            </div>

            <div className="handbook-item">
              <strong>🏆 Cup Ties: Extra-Time & Penalties</strong>
              <p>
                If level after 60 mins in cup ties: 2 x 10 mins extra time. If still tied, straight to best-of-5 penalty shootout.
              </p>
            </div>
          </div>
        </section>

        {/* Player & Parent Code of Respect */}
        <section className="handbook-card full-width">
          <div className="handbook-card-head">
            <div className="head-icon purple">
              <Scale size={20} />
            </div>
            <div>
              <h3>Player & Parent Code of Respect</h3>
              <p>Core values of Rivervalley Rangers AFC: Respect the Game, the Referees, and Each Other.</p>
            </div>
          </div>

          <div className="code-rules-grid">
            <div className="code-rule-box">
              <div className="code-rule-icon">🤝</div>
              <h4>Positive Sideline Support</h4>
              <p>Encourage all players, applaud good play from both teams, and let the coaches give tactical instructions from the technical area.</p>
            </div>

            <div className="code-rule-box">
              <div className="code-rule-icon">⚖️</div>
              <h4>Respect the Match Officials</h4>
              <p>Referees (especially young developing referees) must be treated with 100% courtesy and respect. Zero tolerance for sideline dissent.</p>
            </div>

            <div className="code-rule-box">
              <div className="code-rule-icon">🛡️</div>
              <h4>Player Commitment & Sportsmanship</h4>
              <p>Shake hands with opponents and officials after every game, win, draw or loss. Celebrate victories with humility and accept defeats with dignity.</p>
            </div>
          </div>
        </section>

        {/* Emergency & First Aid */}
        <section className="handbook-card">
          <div className="handbook-card-head">
            <div className="head-icon red">
              <HeartPulse size={20} />
            </div>
            <div>
              <h3>Medical & Concussion Protocols</h3>
              <p>Player safety is the absolute #1 priority.</p>
            </div>
          </div>

          <div className="handbook-content-stack">
            <div className="handbook-item alert-box">
              <strong>🧠 Concussion Protocol (If in Doubt, Sit Them Out)</strong>
              <p>
                Any player sustaining a suspected head impact will be substituted immediately and will not return to play without medical clearance.
              </p>
            </div>
            <div className="handbook-item">
              <strong>🩹 First Aid & Defibrillator</strong>
              <p>
                Team First Aid kit present at all training and matches. AED defibrillator located at Rivervalley Community Centre and Clubhouse.
              </p>
            </div>
          </div>
        </section>

        {/* Official Links */}
        <section className="handbook-card">
          <div className="handbook-card-head">
            <div className="head-icon cyan">
              <BookOpen size={20} />
            </div>
            <div>
              <h3>Official Club & League Portals</h3>
              <p>Direct links to DDSL and Rivervalley Rangers registries.</p>
            </div>
          </div>

          <div className="handbook-links-list">
            <a href="https://ddsl.ie/league/218148/" target="_blank" rel="noreferrer" className="handbook-link-item">
              <div>
                <strong>DDSL League 218148 Table & Schedule</strong>
                <small>Official live division standings & referee appointments</small>
              </div>
              <ExternalLink size={14} />
            </a>

            <a href="https://www.rivervalleyrangers.ie/" target="_blank" rel="noreferrer" className="handbook-link-item">
              <div>
                <strong>Rivervalley Rangers Official Website</strong>
                <small>Main club news, events, and club shop</small>
              </div>
              <ExternalLink size={14} />
            </a>

            <a href="https://www.rivervalleyrangers.ie/safeguarding" target="_blank" rel="noreferrer" className="handbook-link-item">
              <div>
                <strong>FAI & Club Safeguarding Policy</strong>
                <small>Child protection rules and welfare contacts</small>
              </div>
              <ExternalLink size={14} />
            </a>
          </div>
        </section>
      </div>
    </PortalPage>
  );
}
