'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Lock, Menu, X, Trophy, Shield, Sparkles } from 'lucide-react';

export function PublicHeader({ isAuthenticated }: { isAuthenticated?: boolean }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Skills & Drills', href: '#skills' },
    { label: 'Training & Kit', href: '#training' },
    { label: 'S & C', href: '#sc' },
    { label: 'Nutrition', href: '#nutrition' },
    { label: 'Pitch Venues', href: '#venues' },
    { label: 'Cups & Tournaments', href: '#tournaments' },
    { label: 'Photos', href: '#photos' },
  ];

  return (
    <header className={`public-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <Link href="/" className="public-brand">
          <div className="crest-box">
            <Image
              src="/rvr-white.png"
              width={44}
              height={44}
              alt="Rivervalley Rangers AFC crest"
              priority
            />
          </div>
          <div className="brand-text">
            <div className="brand-title">
              <strong>RVR 2014</strong>
              <span className="squad-tag">DDSL SQUAD</span>
            </div>
            <small>Rivervalley Rangers AFC · Swords</small>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-nav" aria-label="Public navigation">
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className="nav-item">
              {link.label}
            </a>
          ))}
        </nav>

        {/* Action Button */}
        <div className="header-actions">
          <Link
            href={isAuthenticated ? '/portal' : '/login'}
            className="portal-cta-btn"
          >
            <Lock size={15} />
            <span>{isAuthenticated ? 'Open Team Portal' : 'Team Portal & Accounts'}</span>
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
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="mobile-nav-item"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <Link
              href={isAuthenticated ? '/portal' : '/login'}
              className="mobile-portal-btn"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Lock size={16} />
              <span>{isAuthenticated ? 'Team Portal Dashboard' : 'Team Portal & Accounts Login'}</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
