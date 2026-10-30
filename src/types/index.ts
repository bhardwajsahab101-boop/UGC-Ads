export interface SpecProject {
  id: string;
  category: 'Skincare' | 'Makeup' | 'Pet Products' | 'Cosmetics';
  title: string;
  badge: 'Spec Ad' | 'Concept Demo';
  conceptHeadline: string;
  description: string;
  intendedFormat: string;
  visualHook: string;
  creativeStrategy: string;
  storyboard: {
    phase: string;
    description: string;
    duration: string;
  }[];
  mediaType: 'image' | 'video';
  imagePoster: string;
  videoUrl?: string; // Local MP4 URL if available
  driveId?: string; // Google Drive file ID
  driveUrl?: string; // Google Drive direct view URL
  drivePreviewUrl?: string; // Google Drive iframe preview URL
  creatorHandle: string;
  audioTrack: string;
}

export interface StudioService {
  id: string;
  number: string;
  title: string;
  shortDesc: string;
  deliverables: string[];
  idealFor: string;
  turnaroundTime: string;
}

export interface ProcessStep {
  step: string;
  title: string;
  action: string;
  deliverable: string;
  details: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface PricingOffer {
  packageName: string;
  tagline: string;
  startingPrice: number;
  currency: string;
  quantity: string;
  statusNotice: string;
  includedItems: string[];
  scopeTerms: string[];
  ctaText: string;
  secondaryCtaText: string;
}

export interface StudioAdvantage {
  title: string;
  description: string;
}
