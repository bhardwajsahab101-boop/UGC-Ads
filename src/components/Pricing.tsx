'use client';

import React from 'react';
import { siteConfig } from '@/config/site';
import { Check, ShieldAlert, ArrowUpRight, MessageSquare, Info } from 'lucide-react';

export default function Pricing() {
  const offer = siteConfig.introOffer;

  const handleSelectPackage = (pkgName: string) => {
    // Dispatch custom event so the Contact form auto-selects this package
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('selectPackage', { detail: pkgName }));
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <section id="pricing" className="section-dark pricing-section" aria-label="Introductory Offer and Pricing">
      <div className="container">
        {/* Section Header */}
        <div className="pricing-header text-center">
          <div className="section-tag" style={{ justifyContent: 'center' }}>
            <span>Introductory Offer</span>
          </div>
          <h2 className="section-title">
            Test fresh ad creative without agency retainers.
          </h2>
          <p className="section-subtitle mx-auto">
            A low-friction starter package crafted specifically for small and growing e-commerce brands looking to validate new hook angles.
          </p>
        </div>

        {/* Pricing Card Showcase */}
        <div className="pricing-showcase-wrapper">
          <div className="pricing-card featured">
            {/* Top Badge */}
            <div className="pricing-card-header">
              <div>
                <span className="badge-spec">Starter Collaboration</span>
                <h3 className="pricing-package-name">{offer.packageName}</h3>
                <p className="pricing-package-tagline">{offer.tagline}</p>
              </div>

              <div className="pricing-figure-block">
                <div className="price-number">
                  <span className="currency">{offer.currency}</span>
                  <span className="amount">{offer.startingPrice}</span>
                  <span className="unit">USD</span>
                </div>
                <div className="price-caption">Starting price for {offer.quantity}</div>
              </div>
            </div>

            {/* Introductory Notice Banner */}
            <div className="pricing-status-notice">
              <Info size={16} className="notice-icon" aria-hidden="true" />
              <p>{offer.statusNotice}</p>
            </div>

            <div className="pricing-card-body">
              <div className="pricing-features-col">
                <h4 className="features-col-title">What&apos;s Included:</h4>
                <ul className="pricing-features-list">
                  {offer.includedItems.map((item, idx) => (
                    <li key={idx} className="pricing-feature-item">
                      <Check size={18} className="feature-check" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pricing-terms-col">
                <h4 className="features-col-title">Scope & Transparency:</h4>
                <ul className="pricing-terms-list">
                  {offer.scopeTerms.map((term, idx) => (
                    <li key={idx} className="pricing-term-item">
                      <span className="term-bullet" aria-hidden="true">•</span>
                      <span>{term}</span>
                    </li>
                  ))}
                </ul>

                <div className="pricing-commitment-note">
                  <ShieldAlert size={16} aria-hidden="true" />
                  <p>
                    <strong>No Hidden Traps:</strong> We do not lock you into multi-month contracts or claim exaggerated virality. You receive 3 polished video files to test on your own ad accounts.
                  </p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pricing-card-footer">
              <button
                type="button"
                className="btn-primary btn-large"
                onClick={() => handleSelectPackage('Creative Test Pack ($79)')}
              >
                <span>{offer.ctaText}</span>
                <ArrowUpRight size={17} aria-hidden="true" />
              </button>

              <button
                type="button"
                className="btn-secondary"
                onClick={() => handleSelectPackage('Custom Package')}
              >
                <MessageSquare size={16} aria-hidden="true" />
                <span>{offer.secondaryCtaText}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Small Note on Custom Bundles */}
        <div className="pricing-footnote text-center">
          <p>
            Running higher ad spend or need 10+ hook variations across multiple SKUs?{' '}
            <a href="#contact" onClick={() => handleSelectPackage('Custom High-Volume Bundle')}>
              Request a custom studio package →
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
