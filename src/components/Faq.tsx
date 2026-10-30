'use client';

import React, { useState } from 'react';
import { siteConfig } from '@/config/site';
import { ChevronDown, HelpCircle, ArrowUpRight } from 'lucide-react';

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First item open by default

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="section-warm faq-section" aria-label="Frequently Asked Questions">
      <div className="container">
        {/* Section Header */}
        <div className="faq-header">
          <div className="section-tag">
            <HelpCircle size={14} aria-hidden="true" />
            <span>Questions & Answers</span>
          </div>
          <h2 className="section-title">
            Everything you need to know before starting.
          </h2>
          <p className="section-subtitle">
            Clear, transparent answers about our production methods, deliverables, usage terms, and turnaround expectations.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="faq-accordion-wrapper">
          {siteConfig.faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className={`faq-item ${isOpen ? 'open' : ''}`}
              >
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => toggleItem(index)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-question-${index}`}
                >
                  <span className="faq-question-text">{faq.question}</span>
                  <span className={`faq-chevron ${isOpen ? 'rotate' : ''}`}>
                    <ChevronDown size={18} aria-hidden="true" />
                  </span>
                </button>

                <div
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  className="faq-answer-container"
                  style={{
                    maxHeight: isOpen ? '400px' : '0',
                    opacity: isOpen ? 1 : 0,
                    pointerEvents: isOpen ? 'auto' : 'none',
                  }}
                >
                  <div className="faq-answer-inner">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Extra Question Footer */}
        <div className="faq-footer-card">
          <div className="faq-footer-copy">
            <h3>Have a specific creative question not listed here?</h3>
            <p>We are happy to review your specific product link and discuss creative feasibility.</p>
          </div>
          <a href="#contact" className="btn-warm-dark">
            <span>Ask Our Creative Director</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
