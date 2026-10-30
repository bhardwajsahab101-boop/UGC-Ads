export interface RawInquiryInput {
  name?: unknown;
  email?: unknown;
  brandName?: unknown;
  company?: unknown;
  website?: unknown;
  productCategory?: unknown;
  category?: unknown;
  packageInterest?: unknown;
  package_interest?: unknown;
  projectNeeds?: unknown;
  project_details?: unknown;
  budget?: unknown;
  // Honeypot field for bot protection
  website_hp?: unknown;
  confirm_company_hp?: unknown;
}

export interface SanitizedInquiryData {
  name: string;
  email: string;
  company: string;
  website: string;
  category: string;
  package_interest: string;
  project_details: string;
  budget: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
  data?: SanitizedInquiryData;
}

/**
 * Strips HTML tags, trims whitespace, and removes dangerous control characters.
 */
export function sanitizeString(val: unknown, maxLength: number): string {
  if (typeof val !== 'string') return '';
  return val
    .replace(/<[^>]*>/g, '') // remove HTML tags
    .replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\u007F]/g, '') // remove control chars
    .trim()
    .slice(0, maxLength);
}

/**
 * Validates email format according to standard RFC patterns.
 */
export function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  // Standard robust email pattern
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email);
}

/**
 * Validates and normalizes website / product URL.
 */
export function normalizeAndValidateUrl(rawUrl: string): { isValid: boolean; normalizedUrl: string } {
  let url = rawUrl.trim();
  if (!url) return { isValid: false, normalizedUrl: '' };

  // Add https:// protocol if omitted
  if (!/^https?:\/\//i.test(url)) {
    url = `https://${url}`;
  }

  try {
    const parsed = new URL(url);
    const hasValidHostname = parsed.hostname.includes('.') && parsed.hostname.length >= 4;
    return {
      isValid: hasValidHostname && ['http:', 'https:'].includes(parsed.protocol),
      normalizedUrl: parsed.toString(),
    };
  } catch {
    return { isValid: false, normalizedUrl: rawUrl };
  }
}

const ALLOWED_CATEGORIES = new Set([
  'Skincare',
  'Cosmetics',
  'Makeup',
  'Pet Products',
  'Wellness & Lifestyle',
  'Other DTC Product',
]);

/**
 * Performs comprehensive server-side validation and sanitization.
 */
export function validateInquiryInput(input: RawInquiryInput): ValidationResult {
  const errors: Record<string, string> = {};

  // Check honeypot fields first (bots that autofill hidden fields)
  const honeypot1 = input.website_hp;
  const honeypot2 = input.confirm_company_hp;
  if ((typeof honeypot1 === 'string' && honeypot1.trim().length > 0) ||
      (typeof honeypot2 === 'string' && honeypot2.trim().length > 0)) {
    errors.spam = 'Spam submission detected.';
    return { isValid: false, errors };
  }

  // Name
  const name = sanitizeString(input.name, 100);
  if (!name) {
    errors.name = 'Please provide your full name.';
  } else if (name.length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  // Email
  const email = sanitizeString(input.email, 254).toLowerCase();
  if (!email) {
    errors.email = 'Please provide your work email address.';
  } else if (!isValidEmail(email)) {
    errors.email = 'Please provide a valid work email address.';
  }

  // Company / Brand Name
  const company = sanitizeString(input.company || input.brandName, 150);
  if (!company) {
    errors.company = 'Please provide your brand or company name.';
  } else if (company.length < 2) {
    errors.company = 'Brand name must be at least 2 characters.';
  }

  // Website / Product URL
  const rawWebsite = sanitizeString(input.website, 255);
  let website = '';
  if (!rawWebsite) {
    errors.website = 'Please provide your website or product URL.';
  } else {
    const urlCheck = normalizeAndValidateUrl(rawWebsite);
    if (!urlCheck.isValid) {
      errors.website = 'Please provide a valid website or product link (e.g. https://yourbrand.com).';
    } else {
      website = urlCheck.normalizedUrl;
    }
  }

  // Category
  const rawCategory = sanitizeString(input.category || input.productCategory, 80);
  const category = ALLOWED_CATEGORIES.has(rawCategory) ? rawCategory : 'Other DTC Product';

  // Package Interest (Optional)
  const package_interest = sanitizeString(
    input.package_interest || input.packageInterest,
    120
  ) || 'Creative Test Pack ($79)';

  // Budget (Optional)
  const budget = sanitizeString(input.budget, 80) || 'Unspecified';

  // Project Details / Requirements
  const project_details = sanitizeString(input.project_details || input.projectNeeds, 3000);
  if (!project_details) {
    errors.project_details = 'Please describe your project requirements and target creative goals.';
  } else if (project_details.length < 15) {
    errors.project_details = 'Please provide at least 15 characters describing what creative you need.';
  }

  if (Object.keys(errors).length > 0) {
    return { isValid: false, errors };
  }

  return {
    isValid: true,
    errors: {},
    data: {
      name,
      email,
      company,
      website,
      category,
      package_interest,
      project_details,
      budget,
    },
  };
}
