'use client';

import React from 'react';

import { siteConfig } from '@/config/site';
import { Compass, Lightbulb, Clapperboard, CheckCheck, ArrowRight } from 'lucide-react';

export default function Process() {
  const getStepIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Compass size={20} />;
      case 1:
        return <Lightbulb size={20} />;
      case 2:
        return <Clapperboard size={20} />;
      case 3:
        return <CheckCheck size={20} />;
      default:
        return <ArrowRight size={20} />;
    }
  };

  return (
    <section id="process" className="section-warm process-section" aria-label="Our Production Process">
      <div className="container">
        {/* Section Header */}
        <div className="process-header">
          <div className="section-tag">
            <span>Production Workflow</span>
          </div>
          <h2 className="section-title">
            From product brief to finished files in four clear stages.
          </h2>
          <p className="section-subtitle">
            A transparent, low-overhead process designed to keep turnaround rapid while preserving complete creative alignment at every milestone.
          </p>
        </div>

        {/* 4-Step Process Timeline Grid */}
        <div className="process-grid">
          {siteConfig.processSteps.map((step, idx) => (
            <div key={step.step} className="process-card">
              <div className="process-step-indicator">
                <span className="process-num">{step.step}</span>
                <span className="process-step-icon">{getStepIcon(idx)}</span>
              </div>

              <div className="process-card-content">
                <span className="process-step-phase">Stage {step.step}</span>
                <h3 className="process-step-title">{step.title}</h3>
                <h4 className="process-step-action">{step.action}</h4>
                <p className="process-step-desc">{step.details}</p>

                <div className="process-deliverable-tag">
                  <span className="tag-label">Milestone Output:</span>
                  <span className="tag-val">{step.deliverable}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Simple Process Callout */}
        <div className="process-reassurance-box">
          <p>
            <strong>No Endless Back-and-Forth:</strong> You approve the creative script and hook angles before production begins, so you always know exactly what the final videos will say.
          </p>
        </div>
      </div>
    </section>
  );
}
