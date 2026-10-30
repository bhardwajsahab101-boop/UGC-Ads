'use client';

import React, { useState, useEffect } from 'react';
import { siteConfig } from '@/config/site';
import { Menu, X, ArrowUpRight } from 'lucide-react';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  return (
    <header className="site-header" style={{
      borderBottomColor: scrolled ? 'rgba(255, 255, 255, 0.14)' : 'rgba(255, 255, 255, 0.08)',
      backgroundColor: scrolled ? 'rgba(11, 13, 14, 0.94)' : 'rgba(11, 13, 14, 0.85)',
    }}>
      <div className="container nav-inner">
        <a href="#" className="brand-mark" aria-label={`${siteConfig.brandName} Home`}>
          <div className="brand-symbol">LF</div>
          <span>{siteConfig.brandName}</span>
        </a>

        <nav className="nav-menu" aria-label="Main Navigation">
          {siteConfig.navLinks.map((link) => (
            <a key={link.label} href={link.href} className="nav-link">
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <div className="nav-status" title="Studio Status">
            <span className="status-dot" aria-hidden="true"></span>
            <span>Independent Video Studio</span>
          </div>

          <a href="#contact" className="btn-primary" style={{ padding: '0.625rem 1.125rem', fontSize: '0.875rem' }}>
            <span>Start a Project</span>
            <ArrowUpRight size={15} aria-hidden="true" />
          </a>

          <button
            type="button"
            className="mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Mobile menu">
          {siteConfig.navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contact"
            className="btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            onClick={() => setMobileOpen(false)}
          >
            Start a Project
          </a>
        </div>
      )}
    </header>
  );
}
