'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { ArrowDown, ArrowUpRight, Play, Pause, Sparkles, CheckCircle2, Volume2, VolumeX } from 'lucide-react';

export default function Hero() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  return (
    <section className="hero-section" aria-label="Introduction">
      <div className="container hero-container">
        
        {/* Left Column: Editorial Headline & Actions */}
        <div className="hero-copy">
          <div className="hero-badge">
            <span className="hero-badge-dot"></span>
            <span>{siteConfig.heroBadge}</span>
          </div>

          <h1 className="hero-title">
            Product ads that feel native.{' '}
            <span className="hero-title-accent">Creative that feels considered.</span>
          </h1>

          <p className="hero-subtext">
            {siteConfig.heroSubheadline}
          </p>

          <div className="hero-cta-group">
            <a href="#work" className="btn-primary">
              <span>View Our Work</span>
              <ArrowDown size={16} aria-hidden="true" />
            </a>

            <a href="#contact" className="btn-secondary">
              <span>Start a Project</span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </a>
          </div>

          <div className="hero-pillars">
            <div className="pillar-item">
              <CheckCircle2 size={16} className="pillar-icon" aria-hidden="true" />
              <span>AI-assisted creator visuals</span>
            </div>
            <div className="pillar-item">
              <CheckCircle2 size={16} className="pillar-icon" aria-hidden="true" />
              <span>Human creative direction</span>
            </div>
            <div className="pillar-item">
              <CheckCircle2 size={16} className="pillar-icon" aria-hidden="true" />
              <span>US Skincare & Pet DTC focus</span>
            </div>
          </div>
        </div>

        {/* Right Column: Prominent Visual Composition */}
        <div className="hero-visual-wrapper">
          <div className="hero-art-composition">
            {/* Background Studio Showcase Image */}
            <div className="hero-backdrop-frame">
              <Image
                src="/media/studio_hero_visual.jpg"
                alt="LumeFlow Creative advertising studio desk displaying cosmetic bottles and color grading monitor"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 55vw"
                style={{ objectFit: 'cover' }}
              />
              <div className="hero-backdrop-gradient" />
            </div>

            {/* Overlapping Floating Creator-Style Ad Preview Card */}
            <div className="floating-creator-card">
              <div className="creator-card-header">
                <span className="badge-spec">Spec Ad Preview</span>
                <span className="creator-format">9:16 Vertical</span>
              </div>

              <div className="creator-media-box">
                <Image
                  src="/media/spec_skincare_hydration.jpg"
                  alt="Creator-style skincare routine spec ad demonstration"
                  fill
                  priority
                  sizes="(max-width: 768px) 70vw, 280px"
                  style={{ objectFit: 'cover' }}
                />

                {/* Simulated Social UGC Interface Overlay */}
                <div className="ugc-overlay">
                  <div className="ugc-overlay-top">
                    <span className="ugc-tag">#HydrationRoutine</span>
                    <button
                      type="button"
                      onClick={() => setIsMuted(!isMuted)}
                      className="ugc-sound-btn"
                      aria-label={isMuted ? 'Unmute sound preview' : 'Mute sound preview'}
                    >
                      {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    </button>
                  </div>

                  <div className="ugc-overlay-bottom">
                    <div className="ugc-creator-info">
                      <p className="ugc-handle">@emily.skinjourney</p>
                      <p className="ugc-caption">“Why is nobody talking about this barrier prep? 💧”</p>
                    </div>

                    <div className="ugc-waveform-bar">
                      <span className={`wave-bar ${isPlaying ? 'wave-anim' : ''}`}></span>
                      <span className={`wave-bar ${isPlaying ? 'wave-anim wave-delay-1' : ''}`}></span>
                      <span className={`wave-bar ${isPlaying ? 'wave-anim wave-delay-2' : ''}`}></span>
                      <span className={`wave-bar ${isPlaying ? 'wave-anim wave-delay-3' : ''}`}></span>
                      <span className="ugc-track-label">Original Audio • Commercial Licensable</span>
                    </div>
                  </div>

                  {/* Play / Pause Toggle Button */}
                  <button
                    type="button"
                    className="ugc-center-play"
                    onClick={() => setIsPlaying(!isPlaying)}
                    aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
                  >
                    {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                </div>
              </div>

              {/* Floating Pill Descriptor */}
              <div className="creator-card-footer">
                <div className="spec-indicator">
                  <span className="spec-pulse-dot"></span>
                  <span>Interactive Concept Demo</span>
                </div>
                <a href="#work" className="spec-view-link">
                  View Spec Details →
                </a>
              </div>
            </div>

            {/* Small Floating Assurance Card */}
            <div className="assurance-floating-badge">
              <Sparkles size={16} className="assurance-icon" />
              <div>
                <strong>3–5 Day Turnaround</strong>
                <p>From brief to ad-ready 9:16 cuts</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
