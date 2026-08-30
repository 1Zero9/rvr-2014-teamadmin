'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Lock, Menu, Trophy, X } from 'lucide-react';

export function PublicHeader({ isAuthenticated }: { isAuthenticated?: boolean }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Fixtures & Table', href: '/fixtures' },
    { label: 'Skills Vault', href: '/skills' },
    { label: 'Training & Kit', href: '/training' },
    { label: 'Speed & S&C', href: '/sc' },
    { label: 'Game Fuel', href: '/nutrition' },
    { label: 'Pitch GPS', href: '/venues' },
    { label: 'Cups & Blitzes', href: '/tournaments' },
    { label: 'Photos', href: '/photos' },
  ];

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
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="nav-item">
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action Button */}
        <div className="header-actions">
          <Link
            href={isAuthenticated ? '/portal' : '/login'}
            className="portal-cta-btn"
          >
            <Lock size={14} />
            <span>Admin Portal</span>
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
              <Link
                key={link.label}
                href={link.href}
                className="mobile-nav-item"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={isAuthenticated ? '/portal' : '/login'}
              className="mobile-portal-btn"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Lock size={15} />
              <span>{isAuthenticated ? 'Open Admin Portal' : 'Admin Portal Login'}</span>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
