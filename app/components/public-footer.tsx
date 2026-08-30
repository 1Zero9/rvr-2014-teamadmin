import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Lock, MapPin, Trophy } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="footer-top">
        <div className="footer-container">
          <div className="footer-brand-col">
            <div className="footer-brand">
              <Image
                src="/rvr-white.png"
                width={52}
                height={52}
                alt="Rivervalley Rangers AFC crest"
              />
              <div>
                <strong>Rivervalley Rangers AFC</strong>
                <span className="text-amber-400 font-bold">U13 Major 1 (2014 Squad)</span>
              </div>
            </div>
            <p className="footer-desc">
              Home of the RVR 2014 boys. Dedicated to skills, hard work, fair play, and matchday teamwork in Swords, Co. Dublin.
            </p>
            <div className="footer-location">
              <MapPin size={15} />
              <span>Rivervalley Park, Swords, Co. Dublin</span>
            </div>
          </div>

          <div className="footer-links-col">
            <h4>Squad Sections</h4>
            <ul>
              <li><Link href="/fixtures">⚽ Fixtures & DDSL Standings</Link></li>
              <li><Link href="/skills">🔥 Skills & Video Drills</Link></li>
              <li><Link href="/training">🏃 Training & Kit Checklist</Link></li>
              <li><Link href="/sc">⚡ Speed, Agility & S&C</Link></li>
              <li><Link href="/nutrition">🍎 Game Day Fuel & Nutrition</Link></li>
              <li><Link href="/venues">📍 Pitch Venues & GPS</Link></li>
              <li><Link href="/tournaments">🏆 Cups & Blitzes</Link></li>
              <li><Link href="/photos">📸 Squad Photo Gallery</Link></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>Official Links</h4>
            <ul>
              <li>
                <a href="https://ddsl.ie/league/218148/" target="_blank" rel="noreferrer">
                  <span>DDSL 13 Major 1 Table</span>
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://www.rivervalleyrangers.ie/" target="_blank" rel="noreferrer">
                  <span>RVR Official Club Site</span>
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://www.rivervalleyrangers.ie/safeguarding" target="_blank" rel="noreferrer">
                  <span>Child Safeguarding</span>
                  <ExternalLink size={12} />
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-portal-col">
            <div className="footer-portal-card">
              <div className="footer-portal-head">
                <Lock size={18} />
                <h4>Admin Portal</h4>
              </div>
              <p>
                Private squad funds, referee fees, season contributions, and coach expense claims.
              </p>
              <Link href="/login" className="footer-login-btn">
                <Lock size={14} /> Open Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-container">
          <p>© {new Date().getFullYear()} Rivervalley Rangers AFC · U13 Major 1 (2014 Squad).</p>
          <p className="footer-motto">
            Play with Passion · Play with Respect · Up the Valley! ⚽
          </p>
        </div>
      </div>
    </footer>
  );
}
