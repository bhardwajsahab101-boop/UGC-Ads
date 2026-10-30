'use client';

import React, { useState, useEffect } from 'react';
import { siteConfig } from '@/config/site';
import { Mail, Check, AlertCircle, Copy, Send, Clock, ShieldCheck, Loader2, Database, ExternalLink } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  brandName: string;
  website: string;
  productCategory: string;
  packageInterest: string;
  projectNeeds: string;
  budget: string;
  // Honeypot field for bot spam detection
  website_hp: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  brandName?: string;
  website?: string;
  productCategory?: string;
  projectNeeds?: string;
  general?: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    brandName: '',
    website: '',
    productCategory: 'Skincare',
    packageInterest: 'Creative Test Pack ($79)',
    projectNeeds: '',
    budget: '$79 - $250 (Starter Test)',
    website_hp: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [serverError, setServerError] = useState<string | null>(null);
  const [savedLeadId, setSavedLeadId] = useState<string | null>(null);
  const [submittedSnapshot, setSubmittedSnapshot] = useState<FormData | null>(null);
  const [copied, setCopied] = useState(false);

  // Listen for package selection from Pricing component
  useEffect(() => {
    const handlePackageSelect = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (customEvent.detail) {
        setFormData((prev) => ({
          ...prev,
          packageInterest: customEvent.detail,
        }));
      }
    };

    window.addEventListener('selectPackage', handlePackageSelect);
    return () => window.removeEventListener('selectPackage', handlePackageSelect);
  }, []);

  // Client-side pre-validation
  const validateClient = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please provide your full name.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please provide your work email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid work email address.';
    }

    if (!formData.brandName.trim()) {
      newErrors.brandName = 'Please provide your brand or company name.';
    } else if (formData.brandName.trim().length < 2) {
      newErrors.brandName = 'Brand name must be at least 2 characters.';
    }

    if (!formData.website.trim()) {
      newErrors.website = 'Please provide your product link or website.';
    } else if (!formData.website.includes('.') || formData.website.trim().length < 4) {
      newErrors.website = 'Please provide a valid website or product link (e.g. yourbrand.com).';
    }

    if (!formData.projectNeeds.trim()) {
      newErrors.projectNeeds = 'Please describe your project requirements and creative goals.';
    } else if (formData.projectNeeds.trim().length < 15) {
      newErrors.projectNeeds = 'Please share a bit more detail (at least 15 characters).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    // 1. Client-side validation check
    if (!validateClient()) {
      return;
    }

    // 2. Set submitting state & prevent duplicate triggers
    setStatus('submitting');

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        company: formData.brandName.trim(),
        brandName: formData.brandName.trim(),
        website: formData.website.trim(),
        category: formData.productCategory,
        productCategory: formData.productCategory,
        package_interest: formData.packageInterest,
        packageInterest: formData.packageInterest,
        project_details: formData.projectNeeds.trim(),
        projectNeeds: formData.projectNeeds.trim(),
        budget: formData.budget,
        website_hp: formData.website_hp, // Honeypot field
      };

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.ok) {
        // Submission rejected or server error
        setStatus('error');
        setServerError(
          data?.error || `Submission failed with status ${response.status}. Please try again.`
        );

        if (data?.details && typeof data.details === 'object') {
          setErrors((prev) => ({
            ...prev,
            ...data.details,
          }));
        }
        return;
      }

      // Confirmed database save!
      setSavedLeadId(data.leadId || 'confirmed');
      setSubmittedSnapshot({ ...formData });
      setStatus('success');
      setErrors({});
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Network error';
      setStatus('error');
      setServerError(`Connection error: ${msg}. Please check your connection and try again.`);
    }
  };

  const handleCopySummary = async () => {
    if (!submittedSnapshot) return;
    const textToCopy = [
      `To: ${siteConfig.contactEmail}`,
      `Subject: [Project Inquiry] ${submittedSnapshot.brandName} - ${submittedSnapshot.packageInterest}`,
      ``,
      `--- PROJECT DETAILS ---`,
      `Client Name: ${submittedSnapshot.name}`,
      `Work Email: ${submittedSnapshot.email}`,
      `Brand / Company: ${submittedSnapshot.brandName}`,
      `Website: ${submittedSnapshot.website}`,
      `Category: ${submittedSnapshot.productCategory}`,
      `Package: ${submittedSnapshot.packageInterest}`,
      `Budget: ${submittedSnapshot.budget}`,
      ``,
      `--- REQUIREMENTS ---`,
      submittedSnapshot.projectNeeds,
      ``,
      `Reference ID: ${savedLeadId || 'N/A'}`,
    ].join('\n');

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopied(true);
    }
  };

  const handleResetForm = () => {
    setStatus('idle');
    setServerError(null);
    setSavedLeadId(null);
    setSubmittedSnapshot(null);
    setFormData({
      name: '',
      email: '',
      brandName: '',
      website: '',
      productCategory: 'Skincare',
      packageInterest: 'Creative Test Pack ($79)',
      projectNeeds: '',
      budget: '$79 - $250 (Starter Test)',
      website_hp: '',
    });
    setErrors({});
  };

  const isSubmitting = status === 'submitting';

  return (
    <section id="contact" className="section-dark contact-section" aria-label="Project Inquiry">
      <div className="container">
        <div className="contact-grid">
          
          {/* Left Column: Context & Studio Details */}
          <div className="contact-info-col">
            <div className="section-tag">
              <Mail size={14} aria-hidden="true" />
              <span>Project Inquiry</span>
            </div>

            <h2 className="section-title">
              Let&apos;s discuss your next product creative.
            </h2>

            <p className="section-subtitle">
              Tell us about your product and the ad angles you want to test. We review incoming product links and reply with a realistic creative assessment, storyboard proposal, and confirmed timeline.
            </p>

            <div className="contact-details-box">
              <div className="contact-detail-row">
                <div className="detail-icon-circle">
                  <Mail size={18} />
                </div>
                <div>
                  <span className="detail-label">Studio Direct Email</span>
                  <a href={`mailto:${siteConfig.contactEmail}`} className="detail-link">
                    {siteConfig.contactEmail}
                  </a>
                </div>
              </div>

              <div className="contact-detail-row">
                <div className="detail-icon-circle">
                  <Clock size={18} />
                </div>
                <div>
                  <span className="detail-label">Typical Response Time</span>
                  <p className="detail-text">Within 24 business hours (Mon–Fri)</p>
                </div>
              </div>

              <div className="contact-detail-row">
                <div className="detail-icon-circle">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <span className="detail-label">No Obligation Review</span>
                  <p className="detail-text">We verify product feasibility before you commit to any package</p>
                </div>
              </div>
            </div>

            {/* Config Notice */}
            <div className="config-help-pill">
              <p>
                <strong>Inquiry Pipeline:</strong> Leads are securely stored in Supabase with end-to-end Row Level Security.
              </p>
            </div>
          </div>

          {/* Right Column: Form or Success Screen */}
          <div className="contact-form-col">
            <div className="contact-form-card">
              
              {status !== 'success' ? (
                <form onSubmit={handleSubmit} noValidate>
                  <div className="form-header-box">
                    <h3 className="form-heading">Start a Creative Inquiry</h3>
                    <p className="form-subheading">Fill in your brand info below to initiate project discussion.</p>
                  </div>

                  {/* Server Error Alert Banner */}
                  {serverError && (
                    <div className="form-server-error-banner" role="alert" aria-live="assertive">
                      <AlertCircle size={18} className="error-icon" aria-hidden="true" />
                      <div className="error-content">
                        <strong>Submission Issue:</strong>
                        <p>{serverError}</p>
                      </div>
                    </div>
                  )}

                  {/* Honeypot Spam Protection (Hidden from legitimate users) */}
                  <div style={{ display: 'none' }} aria-hidden="true">
                    <label htmlFor="website_hp">Leave this field blank</label>
                    <input
                      id="website_hp"
                      name="website_hp"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={formData.website_hp}
                      onChange={(e) => setFormData({ ...formData, website_hp: e.target.value })}
                    />
                  </div>

                  <div className="form-row-2">
                    {/* Name */}
                    <div className="form-field">
                      <label htmlFor="contact-name" className="form-label">
                        Your Name <span className="req">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        required
                        disabled={isSubmitting}
                        className={`form-input ${errors.name ? 'input-error' : ''}`}
                        placeholder="e.g. Sarah Jenkins"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData({ ...formData, name: e.target.value });
                          if (errors.name) setErrors({ ...errors, name: undefined });
                        }}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'err-name' : undefined}
                      />
                      {errors.name && <span id="err-name" className="field-error-msg">{errors.name}</span>}
                    </div>

                    {/* Email */}
                    <div className="form-field">
                      <label htmlFor="contact-email" className="form-label">
                        Work Email <span className="req">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        required
                        disabled={isSubmitting}
                        className={`form-input ${errors.email ? 'input-error' : ''}`}
                        placeholder="sarah@yourbrand.com"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData({ ...formData, email: e.target.value });
                          if (errors.email) setErrors({ ...errors, email: undefined });
                        }}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'err-email' : undefined}
                      />
                      {errors.email && <span id="err-email" className="field-error-msg">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="form-row-2">
                    {/* Brand Name */}
                    <div className="form-field">
                      <label htmlFor="contact-brand" className="form-label">
                        Brand / Company Name <span className="req">*</span>
                      </label>
                      <input
                        id="contact-brand"
                        type="text"
                        required
                        disabled={isSubmitting}
                        className={`form-input ${errors.brandName ? 'input-error' : ''}`}
                        placeholder="e.g. Lumina Botanicals"
                        value={formData.brandName}
                        onChange={(e) => {
                          setFormData({ ...formData, brandName: e.target.value });
                          if (errors.brandName) setErrors({ ...errors, brandName: undefined });
                        }}
                        aria-invalid={!!errors.brandName}
                        aria-describedby={errors.brandName ? 'err-brand' : undefined}
                      />
                      {errors.brandName && <span id="err-brand" className="field-error-msg">{errors.brandName}</span>}
                    </div>

                    {/* Website / Product URL */}
                    <div className="form-field">
                      <label htmlFor="contact-website" className="form-label">
                        Website or Product Link <span className="req">*</span>
                      </label>
                      <input
                        id="contact-website"
                        type="url"
                        required
                        disabled={isSubmitting}
                        className={`form-input ${errors.website ? 'input-error' : ''}`}
                        placeholder="https://yourbrand.com/product"
                        value={formData.website}
                        onChange={(e) => {
                          setFormData({ ...formData, website: e.target.value });
                          if (errors.website) setErrors({ ...errors, website: undefined });
                        }}
                        aria-invalid={!!errors.website}
                        aria-describedby={errors.website ? 'err-website' : undefined}
                      />
                      {errors.website && <span id="err-website" className="field-error-msg">{errors.website}</span>}
                    </div>
                  </div>

                  <div className="form-row-2">
                    {/* Product Category */}
                    <div className="form-field">
                      <label htmlFor="contact-category" className="form-label">
                        Product Category
                      </label>
                      <select
                        id="contact-category"
                        disabled={isSubmitting}
                        className="form-select"
                        value={formData.productCategory}
                        onChange={(e) => setFormData({ ...formData, productCategory: e.target.value })}
                      >
                        <option value="Skincare">Skincare (Serum, Moisturizer, Cleanser)</option>
                        <option value="Cosmetics">Cosmetics & Beauty</option>
                        <option value="Pet Products">Pet Products (Toys, Care, Supplies)</option>
                        <option value="Wellness & Lifestyle">Wellness & Lifestyle</option>
                        <option value="Other DTC Product">Other Consumer Product</option>
                      </select>
                    </div>

                    {/* Package Selection */}
                    <div className="form-field">
                      <label htmlFor="contact-package" className="form-label">
                        Package of Interest
                      </label>
                      <select
                        id="contact-package"
                        disabled={isSubmitting}
                        className="form-select"
                        value={formData.packageInterest}
                        onChange={(e) => setFormData({ ...formData, packageInterest: e.target.value })}
                      >
                        <option value="Creative Test Pack ($79)">Creative Test Pack ($79 for 3 ads)</option>
                        <option value="Product Creative Variations Pack">Product Creative Variations Pack</option>
                        <option value="Concept Development & Scripting">Concept Development & Scripting</option>
                        <option value="Custom High-Volume Bundle">Custom Bundle / Multiple SKUs</option>
                      </select>
                    </div>
                  </div>

                  {/* Project Needs / Objectives */}
                  <div className="form-field">
                    <label htmlFor="contact-needs" className="form-label">
                      What do you need? <span className="req">*</span>
                    </label>
                    <textarea
                      id="contact-needs"
                      rows={4}
                      required
                      disabled={isSubmitting}
                      className={`form-textarea ${errors.projectNeeds ? 'input-error' : ''}`}
                      placeholder="Briefly describe your product, target audience, current ad challenges, or specific hook angles you would like to test..."
                      value={formData.projectNeeds}
                      onChange={(e) => {
                        setFormData({ ...formData, projectNeeds: e.target.value });
                        if (errors.projectNeeds) setErrors({ ...errors, projectNeeds: undefined });
                      }}
                      aria-invalid={!!errors.projectNeeds}
                      aria-describedby={errors.projectNeeds ? 'err-needs' : undefined}
                    />
                    {errors.projectNeeds && <span id="err-needs" className="field-error-msg">{errors.projectNeeds}</span>}
                  </div>

                  {/* Optional Budget */}
                  <div className="form-field">
                    <label htmlFor="contact-budget" className="form-label">
                      Optional Project Budget Range
                    </label>
                    <select
                      id="contact-budget"
                      disabled={isSubmitting}
                      className="form-select"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    >
                      <option value="$79 - $250 (Starter Test)">$79 – $250 (Creative Starter Test)</option>
                      <option value="$250 - $500 (Multi-Angle Variations)">$250 – $500 (Multi-Angle Variations)</option>
                      <option value="$500 - $1,500 (Comprehensive Catalog Test)">$500 – $1,500 (Full Catalog Ad Rollout)</option>
                      <option value="Custom / Flexible">Custom / Ongoing Monthly Testing</option>
                    </select>
                  </div>

                  {/* Privacy Notice */}
                  <div className="privacy-notice-box">
                    <p>{siteConfig.privacyNotice}</p>
                  </div>

                  {/* Submit Action */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary btn-submit"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={16} className="submit-spinner" aria-hidden="true" />
                        <span>Sending Inquiry to Studio...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} aria-hidden="true" />
                        <span>Submit Project Inquiry</span>
                      </>
                    )}
                  </button>

                  <p className="client-side-explanation">
                    Your inquiry is saved directly into our secure studio database. We respect your privacy and will never share your contact details.
                  </p>
                </form>
              ) : (
                /* Confirmed Success Screen */
                <div className="submission-success-card" role="alert" aria-live="polite">
                  <div className="success-badge-circle">
                    <Check size={32} />
                  </div>
                  <h3 className="success-heading">Inquiry Received &amp; Saved!</h3>
                  <p className="success-text">
                    Thank you, <strong>{submittedSnapshot?.name}</strong>! Your inquiry for <strong>{submittedSnapshot?.brandName}</strong> has been securely logged in our studio database.
                  </p>

                  {savedLeadId && (
                    <div className="lead-reference-badge">
                      <Database size={13} aria-hidden="true" />
                      <span>Reference ID: <code>{savedLeadId}</code></span>
                    </div>
                  )}

                  <div className="next-steps-card">
                    <h4 className="next-steps-title">What happens next?</h4>
                    <ol className="next-steps-list">
                      <li>
                        <strong>Product Assessment:</strong> We inspect your website link and examine hooks for {submittedSnapshot?.productCategory}.
                      </li>
                      <li>
                        <strong>Concept Proposal:</strong> We email you at <code>{submittedSnapshot?.email}</code> within 24 business hours with initial hook angles.
                      </li>
                      <li>
                        <strong>Production Kickoff:</strong> Upon your brief approval, we produce your high-resolution 9:16 ads.
                      </li>
                    </ol>
                  </div>

                  <div className="action-buttons-group" style={{ width: '100%', marginBottom: '1.5rem' }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={handleCopySummary}
                      style={{ flex: 1 }}
                    >
                      {copied ? <Check size={16} color="#ccff00" /> : <Copy size={16} />}
                      <span>{copied ? 'Details Copied!' : 'Copy Inquiry Summary'}</span>
                    </button>
                    <a
                      href={`mailto:${siteConfig.contactEmail}?subject=Direct Follow-up: ${encodeURIComponent(submittedSnapshot?.brandName || '')}&body=Reference ID: ${savedLeadId}`}
                      className="btn-secondary"
                      style={{ flex: 1 }}
                    >
                      <Mail size={16} />
                      <span>Email Directly</span>
                    </a>
                  </div>

                  <button
                    type="button"
                    className="btn-link-reset"
                    onClick={handleResetForm}
                  >
                    ← Submit Another Inquiry
                  </button>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
