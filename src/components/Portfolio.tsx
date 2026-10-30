'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { siteConfig } from '@/config/site';
import { SpecProject } from '@/types';
import { Play, X, Layers, ArrowUpRight, Sparkles, Film, ExternalLink, RefreshCw } from 'lucide-react';

export default function Portfolio() {
  const [activeCategory, setActiveCategory] = useState<'All' | 'Skincare' | 'Makeup' | 'Pet Products'>('All');
  const [selectedProject, setSelectedProject] = useState<SpecProject | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [sourceMode, setSourceMode] = useState<Record<string, 'local' | 'drive'>>({});
  const [modalSourceMode, setModalSourceMode] = useState<'local' | 'drive'>('local');

  const filteredProjects = activeCategory === 'All'
    ? siteConfig.portfolioProjects
    : siteConfig.portfolioProjects.filter((p) => p.category === activeCategory);

  const startPlayback = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPlayingId(id);
  };

  const stopPlayback = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPlayingId(null);
  };

  const toggleSourceMode = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSourceMode((prev) => ({
      ...prev,
      [id]: prev[id] === 'drive' ? 'local' : 'drive',
    }));
  };

  return (
    <section id="work" className="section-dark portfolio-section" aria-label="Selected Concept Work">
      <div className="container">
        {/* Section Header */}
        <div className="portfolio-header">
          <div className="portfolio-header-left">
            <div className="section-tag">
              <Film size={14} aria-hidden="true" />
              <span>Selected Portfolio</span>
            </div>
            <h2 className="section-title">
              Creator concepts built for social feeds.
            </h2>
            <p className="section-subtitle">
              Explore our completed AI UGC video-ad samples designed for modern skincare, beauty, and pet brands. Every project demonstrates authentic creator framing, deliberate lighting, and conversion-focused pacing.
            </p>
          </div>

          {/* Category Filter Tabs */}
          <div className="portfolio-filters" role="tablist" aria-label="Project Categories">
            {(['All', 'Skincare', 'Makeup', 'Pet Products'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                role="tab"
                aria-selected={activeCategory === cat}
                className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat === 'All' ? `All Concepts (${siteConfig.portfolioProjects.length})` : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Concept Demo Disclaimer Notice */}
        <div className="spec-disclaimer-banner">
          <div className="spec-disclaimer-badge">Concept Demo</div>
          <p className="spec-disclaimer-text">
            <strong>Portfolio Notice:</strong> The videos below are in-house concept demonstrations (&ldquo;Concept Demo&rdquo;) produced to showcase creative direction, AI-assisted visual fidelity, and script structuring for social ads. No paid brand endorsement or client affiliation is implied.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="portfolio-grid">
          {filteredProjects.map((project) => {
            const isPlaying = playingId === project.id;
            const isDriveMode = sourceMode[project.id] === 'drive';

            return (
              <article key={project.id} className="portfolio-card">
                {/* Media Preview Box (9:16 Vertical Aspect Ratio) */}
                <div className="card-media-wrapper">
                  <div className="card-aspect-ratio">
                    {isPlaying ? (
                      /* Active Video Player */
                      <div className="card-video-active-container">
                        {isDriveMode && project.drivePreviewUrl ? (
                          <iframe
                            src={project.drivePreviewUrl}
                            title={`${project.title} Google Drive Preview`}
                            className="card-video-element"
                            allow="autoplay; encrypted-media; fullscreen"
                            allowFullScreen
                          />
                        ) : (
                          <video
                            key={project.videoUrl}
                            src={project.videoUrl}
                            poster={project.imagePoster}
                            controls
                            autoPlay
                            playsInline
                            className="card-video-element"
                            onError={() => {
                              // If local file playback fails, fallback to Google Drive embed
                              setSourceMode((prev) => ({ ...prev, [project.id]: 'drive' }));
                            }}
                          >
                            Your browser does not support HTML5 video.
                          </video>
                        )}

                        {/* Video Header Controls */}
                        <div className="card-video-top-bar">
                          <span className="badge-spec">{project.badge}</span>
                          <div className="card-video-actions">
                            {project.drivePreviewUrl && (
                              <button
                                type="button"
                                className="btn-switch-source"
                                onClick={(e) => toggleSourceMode(project.id, e)}
                                title={isDriveMode ? 'Switch to Local MP4' : 'Switch to Drive Embed'}
                              >
                                <RefreshCw size={12} />
                                <span>{isDriveMode ? 'Local MP4' : 'Drive Embed'}</span>
                              </button>
                            )}
                            <button
                              type="button"
                              className="btn-close-video"
                              onClick={stopPlayback}
                              aria-label="Close video player"
                              title="Close video"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Poster / Thumbnail Preview */
                      <>
                        <Image
                          src={project.imagePoster}
                          alt={`${project.title} - ${project.conceptHeadline}`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          style={{ objectFit: 'cover' }}
                          className="card-media-image"
                        />

                        {/* Badge Overlays */}
                        <div className="card-top-badges">
                          <span className="badge-spec">{project.badge}</span>
                          <span className="card-format-pill">{project.intendedFormat.split('(')[0].trim()}</span>
                        </div>

                        {/* Hover & Active Play Overlay */}
                        <div className="card-media-overlay">
                          <button
                            type="button"
                            className="card-play-btn"
                            onClick={(e) => startPlayback(project.id, e)}
                            aria-label={`Play video ad for ${project.title}`}
                          >
                            <Play size={22} className="play-icon-offset" />
                          </button>

                          <div className="card-overlay-info">
                            <span className="card-creator-tag">{project.creatorHandle}</span>
                            <p className="card-hook-text">&ldquo;{project.visualHook}&rdquo;</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Card Content & Metadata */}
                <div className="card-content">
                  <div className="card-meta-line">
                    <span className="card-category">{project.category}</span>
                    <span className="card-audio-pill" title={project.audioTrack}>{project.audioTrack}</span>
                  </div>

                  <h3 className="card-title">{project.title}</h3>
                  <p className="card-headline">{project.conceptHeadline}</p>
                  <p className="card-description">{project.description}</p>

                  <div className="card-footer-meta">
                    {project.driveUrl && (
                      <a
                        href={project.driveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="card-drive-pill"
                        title="View original asset on Google Drive"
                      >
                        <ExternalLink size={12} />
                        <span>Google Drive Asset</span>
                      </a>
                    )}
                  </div>

                  <div className="card-actions">
                    <button
                      type="button"
                      className="btn-inspect-concept"
                      onClick={() => {
                        setSelectedProject(project);
                        setModalSourceMode('local');
                      }}
                    >
                      <Layers size={15} aria-hidden="true" />
                      <span>View Storyboard Breakdown</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Storyboard & Concept Breakdown Modal */}
        {selectedProject && (
          <div
            className="modal-backdrop"
            onClick={() => setSelectedProject(null)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <div className="modal-badge-group">
                    <span className="badge-spec">{selectedProject.badge}</span>
                    <span className="modal-category">{selectedProject.category}</span>
                  </div>
                  <h3 id="modal-title" className="modal-title">{selectedProject.title}</h3>
                  <p className="modal-subtitle">{selectedProject.conceptHeadline}</p>
                </div>
                <button
                  type="button"
                  className="modal-close-btn"
                  onClick={() => setSelectedProject(null)}
                  aria-label="Close modal"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="modal-body-grid">
                {/* Media Column with Interactive Player */}
                <div className="modal-media-col">
                  <div className="modal-video-box">
                    {modalSourceMode === 'drive' && selectedProject.drivePreviewUrl ? (
                      <iframe
                        src={selectedProject.drivePreviewUrl}
                        title={`${selectedProject.title} Drive Preview`}
                        className="modal-video-element"
                        allow="autoplay; encrypted-media; fullscreen"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        key={selectedProject.videoUrl}
                        src={selectedProject.videoUrl}
                        poster={selectedProject.imagePoster}
                        controls
                        playsInline
                        preload="metadata"
                        className="modal-video-element"
                        onError={() => setModalSourceMode('drive')}
                      >
                        Your browser does not support HTML5 video.
                      </video>
                    )}
                  </div>

                  {/* Player Toolbar */}
                  <div className="modal-player-toolbar">
                    {selectedProject.drivePreviewUrl && (
                      <button
                        type="button"
                        className="btn-source-toggle"
                        onClick={() => setModalSourceMode((prev) => (prev === 'drive' ? 'local' : 'drive'))}
                      >
                        <RefreshCw size={12} />
                        <span>Mode: {modalSourceMode === 'drive' ? 'Drive Embed' : 'Local MP4'}</span>
                      </button>
                    )}
                    {selectedProject.driveUrl && (
                      <a
                        href={selectedProject.driveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-drive-external"
                      >
                        <ExternalLink size={12} />
                        <span>Open in Google Drive</span>
                      </a>
                    )}
                  </div>

                  <div className="modal-media-notes">
                    <p><strong>Format:</strong> {selectedProject.intendedFormat}</p>
                    <p><strong>Creator Handle:</strong> {selectedProject.creatorHandle}</p>
                    <p><strong>Audio Cue:</strong> {selectedProject.audioTrack}</p>
                  </div>
                </div>

                {/* Strategy & Storyboard Column */}
                <div className="modal-details-col">
                  <div className="modal-section-block">
                    <h4 className="modal-section-heading">Creative Strategy</h4>
                    <p className="modal-strategy-text">{selectedProject.creativeStrategy}</p>
                  </div>

                  <div className="modal-section-block">
                    <h4 className="modal-section-heading">Visual Hook Breakdown</h4>
                    <div className="hook-highlight-box">
                      <Sparkles size={16} className="hook-icon" aria-hidden="true" />
                      <p>{selectedProject.visualHook}</p>
                    </div>
                  </div>

                  <div className="modal-section-block">
                    <h4 className="modal-section-heading">Second-by-Second Storyboard</h4>
                    <div className="storyboard-timeline">
                      {selectedProject.storyboard.map((frame, index) => (
                        <div key={index} className="storyboard-row">
                          <div className="storyboard-phase">
                            <span className="phase-pill">{frame.phase}</span>
                          </div>
                          <div className="storyboard-desc">
                            <p>{frame.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="modal-cta-box">
                    <p>Want a similar creative test package for your brand?</p>
                    <a
                      href="#contact"
                      className="btn-primary"
                      onClick={() => setSelectedProject(null)}
                    >
                      <span>Discuss a Concept for Your Brand</span>
                      <ArrowUpRight size={16} aria-hidden="true" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
