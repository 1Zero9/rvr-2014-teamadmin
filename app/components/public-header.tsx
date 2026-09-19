'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Camera, Menu, ShieldCheck, X } from 'lucide-react';

export function PublicHeader(_props: { isAuthenticated?: boolean } = {}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`public-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <Link href="/" className="public-brand">
          <div className="crest-box">
            <Image
              src="/rvr-white.png"
              width={42}
              height={42}
              alt="Rivervalley Rangers AFC crest"
              priority
            />
          </div>
          <div className="brand-text">
            <div className="brand-title">
              <strong>RVR U13</strong>
              <span className="squad-tag">MAJOR 1 · 2014</span>
            </div>
            <small>Rivervalley Rangers AFC · Swords</small>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-nav" aria-label="Public navigation">
          <Link href="/" className="nav-item">
            <Camera size={15} />
            <span>Squad Photos</span>
          </Link>
          <Link href="/portal" className="nav-item portal-nav-highlight">
            <ShieldCheck size={15} />
            <span>Team workspace</span>
          </Link>
        </nav>

        {/* Action Button */}
        <div className="header-actions">
          <Link
            href="/portal"
            className="portal-cta-btn"
          >
            <ShieldCheck size={15} />
            <span>Open workspace</span>
          </Link>

          <button
            type="button"
            className="mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <nav>
            <Link
              href="/"
              className="mobile-nav-item"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Camera size={16} />
              <span>Squad Photos Gallery</span>
            </Link>
            <Link
              href="/portal"
              className="mobile-nav-item"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ShieldCheck size={16} />
              <span>Team workspace</span>
            </Link>
            <Link
              href="/portal"
              className="mobile-portal-btn"
              onClick={() => setMobileMenuOpen(false)}
            >
              <ShieldCheck size={16} />
              <span>Open workspace</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
