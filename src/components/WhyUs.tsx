'use client';

import React from 'react';
import { siteConfig } from '@/config/site';
import { ShieldCheck, Target, Zap, Eye, MessagesSquare, Tag } from 'lucide-react';

export default function WhyUs() {
  const getAdvantageIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Zap size={22} className="advantage-icon" />;
      case 1:
        return <Target size={22} className="advantage-icon" />;
      case 2:
        return <Eye size={22} className="advantage-icon" />;
      case 3:
        return <ShieldCheck size={22} className="advantage-icon" />;
      case 4:
        return <MessagesSquare size={22} className="advantage-icon" />;
      case 5:
        return <Tag size={22} className="advantage-icon" />;
      default:
        return <ShieldCheck size={22} className="advantage-icon" />;
    }
  };

  return (
    <section className="section-dark why-us-section" aria-label="Why Work With Us">
      <div className="container">
        {/* Section Header */}
        <div className="why-us-header">
          <div className="section-tag">
            <span>Studio Principles</span>
          </div>
          <h2 className="section-title">
            Built for modern brand founders, not agency bureaucracy.
          </h2>
          <p className="section-subtitle">
            We are an independent, focused creative studio dedicated to helping emerging e-commerce brands test social video concepts without excessive overhead, delays, or inflated promises.
          </p>
        </div>

        {/* 6 Advantages Grid */}
        <div className="advantages-grid">
          {siteConfig.advantages.map((adv, idx) => (
            <div key={idx} className="advantage-card">
              <div className="advantage-icon-wrapper">
                {getAdvantageIcon(idx)}
              </div>
              <h3 className="advantage-title">{adv.title}</h3>
              <p className="advantage-desc">{adv.description}</p>
            </div>
          ))}
        </div>

        {/* Honesty Statement Banner */}
        <div className="honesty-statement-card">
          <div className="honesty-inner">
            <div className="honesty-tag">Our Creative Promise</div>
            <h3 className="honesty-title">
              &ldquo;No inflated ROAS claims, no fake reviews, no fabricated case studies.&rdquo;
            </h3>
            <p className="honesty-desc">
              Advertising success depends on product-market fit, offer positioning, pricing, and media spend. Our role is strictly to provide sharp, product-focused creator concepts and high-fidelity video execution so your marketing team can test real advertising hypotheses.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
