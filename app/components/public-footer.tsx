import Image from 'next/image';
import Link from 'next/link';
import { ExternalLink, Lock, ShieldCheck, Heart, MapPin, Trophy } from 'lucide-react';

export function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="footer-top">
        <div className="footer-container">
          <div className="footer-brand-col">
            <div className="footer-brand">
              <Image
                src="/rvr-white.png"
                width={56}
                height={56}
                alt="Rivervalley Rangers AFC crest"
              />
              <div>
                <strong>Rivervalley Rangers AFC</strong>
                <span>2014 Boys & Girls Squad Hub</span>
              </div>
            </div>
            <p className="footer-desc">
              Dedicated to youth football excellence, sportsmanship, player development, and community spirit in Swords, County Dublin.
            </p>
            <div className="footer-location">
              <MapPin size={15} />
              <span>Rivervalley Park, Swords, Co. Dublin</span>
            </div>
          </div>

          <div className="footer-links-col">
            <h4>Squad Quick Links</h4>
            <ul>
              <li><a href="#skills">Skills & Drills Vault</a></li>
              <li><a href="#training">Training & Kit Guide</a></li>
              <li><a href="#sc">Strength & Conditioning</a></li>
              <li><a href="#nutrition">Matchday Nutrition</a></li>
              <li><a href="#venues">Pitch Venues & GPS</a></li>
              <li><a href="#tournaments">Cups & Tournaments</a></li>
              <li><a href="#photos">Photo Gallery</a></li>
            </ul>
          </div>

          <div className="footer-links-col">
            <h4>Club & League Resources</h4>
            <ul>
              <li>
                <a href="https://www.rivervalleyrangers.ie/" target="_blank" rel="noreferrer">
                  <span>RVR Official Club Site</span>
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://ddsl.ie/" target="_blank" rel="noreferrer">
                  <span>DDSL Official Portal</span>
                  <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <a href="https://www.rivervalleyrangers.ie/pitch-locations" target="_blank" rel="noreferrer">
                  <span>Club Pitch Guide</span>
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
                <h4>Team Portal & Accounts</h4>
              </div>
              <p>
                Access private squad finances, season contributions, expense claims, and super admin controls.
              </p>
              <Link href="/login" className="footer-login-btn">
                <Lock size={14} /> Log In to Team Portal
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-container">
          <p>© {new Date().getFullYear()} Rivervalley Rangers AFC 2014 Squad. All rights reserved.</p>
          <p className="footer-motto">
            Play with Passion · Play with Respect ⚽
          </p>
        </div>
      </div>
    </footer>
  );
}
