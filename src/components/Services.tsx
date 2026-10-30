'use client';

import React from 'react';
import { siteConfig } from '@/config/site';
import { Check, ArrowUpRight, Sparkles, Sliders, PenTool, Video } from 'lucide-react';

export default function Services() {
  const getIcon = (id: string) => {
    switch (id) {
      case 'ai-ugc-ads':
        return <Video size={22} className="service-icon" />;
      case 'creative-variations':
        return <Sliders size={22} className="service-icon" />;
      case 'concept-development':
        return <PenTool size={22} className="service-icon" />;
      default:
        return <Sparkles size={22} className="service-icon" />;
    }
  };

  return (
    <section id="services" className="section-warm services-section" aria-label="Our Services">
      <div className="container">
        {/* Section Header */}
        <div className="services-header">
          <div className="section-tag">
            <span>Capabilities & Deliverables</span>
          </div>
          <h2 className="section-title">
            Structured creative services for growth-stage brands.
          </h2>
          <p className="section-subtitle">
            Every deliverable blends AI-assisted generative visual workflows with senior human creative direction, manual editing, and strict quality control before you receive final files.
          </p>
        </div>

        {/* Services 3-Column Grid */}
        <div className="services-grid">
          {siteConfig.services.map((service) => (
            <div key={service.id} className="service-card">
              <div className="service-card-top">
                <div className="service-number-badge">{service.number}</div>
                <div className="service-icon-box">{getIcon(service.id)}</div>
              </div>

              <h3 className="service-card-title">{service.title}</h3>
              <p className="service-card-desc">{service.shortDesc}</p>

              <div className="service-divider" />

              <div className="service-deliverables-block">
                <h4 className="deliverables-heading">Practical Deliverables:</h4>
                <ul className="deliverables-list">
                  {service.deliverables.map((item, idx) => (
                    <li key={idx} className="deliverable-item">
                      <Check size={16} className="deliverable-check" aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="service-footer-block">
                <div className="service-meta-row">
                  <span className="meta-label">Ideal For:</span>
                  <span className="meta-value">{service.idealFor}</span>
                </div>
                <div className="service-meta-row">
                  <span className="meta-label">Turnaround:</span>
                  <span className="meta-value highlight">{service.turnaroundTime}</span>
                </div>
              </div>

              <div className="service-cta-wrapper">
                <a href="#contact" className="service-card-cta">
                  <span>Inquire for this Service</span>
                  <ArrowUpRight size={15} aria-hidden="true" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Transparency Box */}
        <div className="services-human-assurance">
          <div className="assurance-inner">
            <div className="assurance-badge">
              <Sparkles size={16} aria-hidden="true" />
              <span>Human-Directed Craft</span>
            </div>
            <div className="assurance-text">
              <h4>The LumeFlow Hybrid Model</h4>
              <p>
                We do not output unvetted automated files. Generative AI accelerates scene ideation and visual variation; human creative directors guide the story, write the hooks, time the cuts, balance sound, and review typography to protect your brand reputation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
