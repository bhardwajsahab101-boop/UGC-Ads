'use client';

import React from 'react';
import { siteConfig } from '@/config/site';
import { ArrowUp, Mail, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const [currentYear, setCurrentYear] = React.useState(2026);

  React.useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer className="site-footer" aria-label="Site Footer">
      <div className="container">
        
        {/* Top Footer Section */}
        <div className="footer-top-grid">
          <div className="footer-brand-col">
            <a href="#" className="brand-mark" aria-label={`${siteConfig.brandName} Home`}>
              <div className="brand-symbol">LF</div>
              <span>{siteConfig.brandName}</span>
            </a>
            <p className="footer-positioning">
              {siteConfig.descriptor}. Crafted for direct-to-consumer skincare, beauty, and pet product brands testing fresh social advertising creative.
            </p>
            <div className="footer-contact-link">
              <Mail size={15} aria-hidden="true" />
              <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
            </div>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-nav-list">
              {siteConfig.navLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="footer-link">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-services-col">
            <h4 className="footer-heading">Creative Formats</h4>
            <ul className="footer-nav-list">
              <li><span>9:16 Vertical Creator Ads</span></li>
              <li><span>Product Routine &amp; Texture Specs</span></li>
              <li><span>Hook Testing Variations</span></li>
              <li><span>Script &amp; Storyboard Decks</span></li>
            </ul>
          </div>

          <div className="footer-back-col">
            <button
              type="button"
              className="btn-back-to-top"
              onClick={scrollToTop}
              aria-label="Back to top of page"
            >
              <span>Back to Top</span>
              <ArrowUp size={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="footer-divider" />

        {/* Spec Disclaimer & Legal */}
        <div className="footer-bottom-flex">
          <div className="footer-legal-copy">
            <p className="copyright-line">
              &copy; {currentYear} {siteConfig.brandName}. All rights reserved.
            </p>
            <p className="disclaimer-line">
              <ShieldCheck size={14} className="inline-icon" aria-hidden="true" />
              <span>
                Demonstration Notice: Showcase concepts are non-commissioned speculative demo ads created solely to demonstrate creative direction and AI-assisted UGC video production capabilities. No brand endorsement or affiliation is implied.
              </span>
            </p>
          </div>

          <div className="footer-badges">
            <span className="footer-meta-pill">Made for US E-Commerce</span>
            <span className="footer-meta-pill">Human Art Directed</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
