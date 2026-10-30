import { SpecProject, StudioService, ProcessStep, FaqItem, PricingOffer, StudioAdvantage } from '@/types';

export const siteConfig = {
  // Brand & Studio Identity
  brandName: 'LumeFlow Creative',
  tagline: 'AI UGC-Style Video Advertising Studio',
  descriptor: 'AI-assisted creator-style video ads with human creative direction & review',
  
  // Contact & Inquiries (Easily update this email address)
  contactEmail: 'hello@yourdomain.com',
  studioLocation: 'United States',
  businessHours: 'Monday – Friday, 9am – 6pm EST',

  // Core Messaging
  coreMessage: 'Creator-style product ads, made for modern e-commerce brands.',
  supportingMessage:
    'Scroll-stopping video concepts, product-focused storytelling, and human-reviewed creative execution — designed to help brands test their next advertising idea.',
  
  heroBadge: 'Creative Studio for US E-Commerce',
  heroHeadline: 'Product ads that feel native. Creative that feels considered.',
  heroSubheadline:
    'We combine AI-assisted visual generation with human creative direction to produce creator-style short-form video ads for direct-to-consumer skincare and pet brands. Test fresh hooks without booking costly live production shoots.',

  // Navigation Links
  navLinks: [
    { label: 'Work', href: '#work' },
    { label: 'Services', href: '#services' },
    { label: 'Process', href: '#process' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Contact', href: '#contact' },
  ],

  // Speculative Demo Portfolio Projects
  // Clearly labelled as Concept Demo so visitors are never misled
  portfolioProjects: [
    {
      id: 'concept-skincare-hydration',
      category: 'Skincare',
      title: 'Hydration, Made Simple',
      badge: 'Concept Demo',
      conceptHeadline: 'Daily Moisture Barrier & Deep Hydration Routine',
      description:
        'A relatable, conversational UGC-style vanity demo addressing skin dryness concerns and highlighting lightweight, non-greasy all-day barrier hydration.',
      intendedFormat: 'Vertical 9:16 Short-Form (TikTok, Reels, Shorts)',
      visualHook: '“Does your skin ever feel dry?” — Candid mirror check and instant hydration payoff',
      creativeStrategy:
        'Hooks the viewer with an immediate problem-aware question, demonstrating texture absorption and clean moisture finish without greasy residue.',
      storyboard: [
        {
          phase: '00–03s Hook',
          description: 'Candid mirror check showing bare morning skin; creator asks “Does your skin ever feel dry, even after moisturizing?”',
          duration: '3 sec',
        },
        {
          phase: '03–08s Texture Demo',
          description: 'Smooth moisturizer application, demonstrating water-light texture absorption and soft dewy bounce.',
          duration: '5 sec',
        },
        {
          phase: '08–13s Routine Context',
          description: 'Creator gently massages moisturizer in, smiling naturally with glowing skin under clean bathroom lighting.',
          duration: '5 sec',
        },
        {
          phase: '13–18s Call to Action',
          description: 'Hydrated, calm skin finish held next to product with subtle non-intrusive on-screen bundle prompt.',
          duration: '5 sec',
        },
      ],
      mediaType: 'video',
      imagePoster: '/media/poster_skincare_hydration.png',
      videoUrl: '/videos/skincare-hydration.mp4',
      driveId: '1bb8ElEkykhny5fU8VX_bfafqDZKCIIFA',
      driveUrl: 'https://drive.google.com/file/d/1bb8ElEkykhny5fU8VX_bfafqDZKCIIFA/view',
      drivePreviewUrl: 'https://drive.google.com/file/d/1bb8ElEkykhny5fU8VX_bfafqDZKCIIFA/preview',
      creatorHandle: '@maya.skinminimalism',
      audioTrack: 'Trending Clean Bedroom Pop (Commercial Licensable)',
    },
    {
      id: 'concept-makeup-pop-of-color',
      category: 'Makeup',
      title: 'Your Everyday Pop of Color',
      badge: 'Concept Demo',
      conceptHeadline: 'Effortless Liquid Blush Glow & Quick Cheek Revival',
      description:
        'A vibrant, high-energy creator beauty showcase demonstrating how a single drop of liquid blush revives dull makeup with an effortless, radiant blush.',
      intendedFormat: 'Vertical 9:16 Short-Form (TikTok & Instagram Reels)',
      visualHook: '“When my makeup feels a little dull...” — Holding the Blush & Glow bottle with instant cheek dab',
      creativeStrategy:
        'Targets busy cosmetics shoppers wanting a 10-second makeup glow. Showcases high-pigment blending and natural dewy finish.',
      storyboard: [
        {
          phase: '00–03s Hook',
          description: 'Creator smiles into camera holding up the blush bottle: “When my makeup feels a little dull, this liquid blush is my secret pop of color.”',
          duration: '3 sec',
        },
        {
          phase: '03–08s Application & Dab',
          description: 'Gentle dotting onto cheek apples with fingertip tap and seamless blending demonstration.',
          duration: '5 sec',
        },
        {
          phase: '08–13s Glow Payoff',
          description: 'Natural light angle shift revealing radiant, sun-kissed flush that blends with foundation.',
          duration: '5 sec',
        },
        {
          phase: '13–18s Call to Action',
          description: 'Side-by-side cheek finish comparison with seasonal shade collection callout.',
          duration: '5 sec',
        },
      ],
      mediaType: 'video',
      imagePoster: '/media/poster_makeup_blush.png',
      videoUrl: '/videos/makeup-pop-of-color.mp4',
      driveId: '1Nin9XvdxevJagr9M8xRSu7sAhyiqUiSn',
      driveUrl: 'https://drive.google.com/file/d/1Nin9XvdxevJagr9M8xRSu7sAhyiqUiSn/view?usp=sharing',
      drivePreviewUrl: 'https://drive.google.com/file/d/1Nin9XvdxevJagr9M8xRSu7sAhyiqUiSn/preview',
      creatorHandle: '@chloe.beautyblend',
      audioTrack: 'Upbeat Lo-Fi Summer Groove (Commercial Licensable)',
    },
    {
      id: 'concept-pet-playtime',
      category: 'Pet Products',
      title: 'Made for Playtime',
      badge: 'Concept Demo',
      conceptHeadline: 'Puppy-Tested Durable Bone Toy Living Room Engagement',
      description:
        'An engaging pet-parent demonstration showing an active golden retriever puppy excitedly interacting with a durable, plush floral bone toy.',
      intendedFormat: 'Vertical 9:16 Short-Form (Meta & TikTok Ads)',
      visualHook: 'Puppy locked eyes on the floral BARC bone toy ready to pounce and play',
      creativeStrategy:
        'Captivates pet parents with high emotional resonance, highlighting safe materials, soft mouth feel, and durable playtime longevity.',
      storyboard: [
        {
          phase: '00–03s Hook',
          description: 'Owner holds floral BARC bone toy in front of attentive golden retriever pup wagging tail with anticipation.',
          duration: '3 sec',
        },
        {
          phase: '03–09s Play & Chew Demo',
          description: 'Puppy gleefully grabbing the bone toy, demonstrating texture chew resistance and soft plush bounce.',
          duration: '6 sec',
        },
        {
          phase: '09–14s Comfort & Quality',
          description: 'Close-up of durable reinforced stitching and pet-safe eco-friendly materials.',
          duration: '5 sec',
        },
        {
          phase: '14–18s Call to Action',
          description: 'Content pup cuddling with toy on living room rug with first-order bundle discount.',
          duration: '4 sec',
        },
      ],
      mediaType: 'video',
      imagePoster: '/media/poster_pet_playtime.png',
      videoUrl: '/videos/pet-playtime.mp4',
      driveId: '12UW9881gmjqgQJ514MPEWODcWjxjHYoe',
      driveUrl: 'https://drive.google.com/file/d/12UW9881gmjqgQJ514MPEWODcWjxjHYoe/view?usp=sharing',
      drivePreviewUrl: 'https://drive.google.com/file/d/12UW9881gmjqgQJ514MPEWODcWjxjHYoe/preview',
      creatorHandle: '@barc.adventures',
      audioTrack: 'Playful Indie Acoustic Bounce (Commercial Licensable)',
    },
  ] as SpecProject[],

  // Services
  services: [
    {
      id: 'ai-ugc-ads',
      number: '01',
      title: 'AI UGC-Style Video Ads',
      shortDesc:
        'Creator-inspired short-form video concepts, authentic product demonstrations, dynamic hooks, and conversion-focused calls to action.',
      deliverables: [
        'Vertical 9:16 format optimized for TikTok, Instagram Reels, and YouTube Shorts',
        'Candid creator-style framing and natural lighting aesthetics',
        'Dynamic on-screen captions & native platform typography styling',
        'Commercial royalty-free audio curation & sound leveling',
        'Human creative direction and manual quality review before delivery',
      ],
      idealFor: 'Skincare, cosmetics, and pet DTC brands wanting social-native product ads.',
      turnaroundTime: 'Typically 3–5 business days following creative approval.',
    },
    {
      id: 'creative-variations',
      number: '02',
      title: 'Product Creative Variations',
      shortDesc:
        'Alternative hooks, visual angles, scripts, and creative concepts that brands can test against their baseline paid social campaigns.',
      deliverables: [
        'Multiple hook variations (problem-aware, curiosity-driven, routine-focused)',
        'Alternate visual pacing and call-to-action endings',
        'Testing-ready naming conventions for Meta Ads Manager & TikTok Ads',
        'Modular assets structured to isolate what hook drives watch-time',
        'Human review to ensure visual coherence across all variations',
      ],
      idealFor: 'Growth marketers running paid social experiments seeking winner hooks.',
      turnaroundTime: 'Typically 2–4 business days for variation packs.',
    },
    {
      id: 'concept-development',
      number: '03',
      title: 'Creative Concept Development',
      shortDesc:
        'Product research, audience-aware messaging, storyboard planning, and ad scripting tailored specifically to your product line.',
      deliverables: [
        'Comprehensive angle brief based on customer reviews and common objections',
        'Script breakdowns including dialogue, on-screen text, and visual cues',
        'Storyboard outlines showing second-by-second pacing',
        'Strategic recommendations for testing ad angles on social platforms',
        'Human creative director consultation on brand alignment',
      ],
      idealFor: 'Founders who know their product features but need compelling ad narratives.',
      turnaroundTime: 'Typically 2–3 business days.',
    },
  ] as StudioService[],

  // Introductory Offer & Pricing
  introOffer: {
    packageName: 'Creative Test Pack',
    tagline: 'An approachable starting package for small & growing DTC brands to test fresh social creative.',
    startingPrice: 79,
    currency: '$',
    quantity: '3 Short-Form Video Ads',
    statusNotice:
      'Proposed introductory offer for new brand collaborations. Final scope, duration, deliverable formats, usage rights, and timeline are confirmed in an agreed project brief prior to kickoff.',
    includedItems: [
      '3 complete creator-style short-form video ads (vertical 9:16)',
      '3 distinct hook approaches or creative visual angles',
      'Product-focused storytelling highlighting benefits & everyday usage',
      'Native social captions, on-screen text overlays & platform-ready styling',
      'Curated commercial-safe audio tracks',
      'Human creative director review for visual polish & brand coherence',
      '1 clearly defined revision round included per video',
      'Agreed delivery timeline confirmed upon receipt of product assets',
    ],
    scopeTerms: [
      'Pricing covers AI-assisted creator generation and human post-production review.',
      'No physical filming or shipping of physical inventory required for digital assets.',
      'Usage rights are explicitly outlined in the written project agreement.',
      'Standard turnaround timeline begins after receiving required brand details.',
    ],
    ctaText: 'Discuss Your Project',
    secondaryCtaText: 'Need a custom package? Let’s talk',
  } as PricingOffer,

  // 4-Step Process
  processSteps: [
    {
      step: '01',
      title: 'Discover',
      action: 'Product Deep-Dive & Audience Mapping',
      deliverable: 'Creative Alignment Brief',
      details:
        'We study your product, target demographic, unique value proposition, customer reviews, and key objections. You share your brand guidelines, product photography, and current creative goals.',
    },
    {
      step: '02',
      title: 'Develop',
      action: 'Hooks, Scripts & Storyboard Concepts',
      deliverable: 'Script & Concept Deck for Approval',
      details:
        'We prepare 3 tailored hook angles and complete second-by-second scripts with visual cues. You review the creative direction and approve concepts before any asset generation begins.',
    },
    {
      step: '03',
      title: 'Produce',
      action: 'AI-Assisted Generation & Post-Production',
      deliverable: 'Draft Video Cuts',
      details:
        'Using specialized generative visual workflows guided by human art direction, we generate the creator-style clips, apply captions, balance sound design, and color-grade for social screens.',
    },
    {
      step: '04',
      title: 'Review & Deliver',
      action: 'Refinement, Revision & Final File Hand-off',
      deliverable: 'High-Resolution 9:16 Video Files',
      details:
        'You review the deliverables with our team. We implement your agreed revision round, perform final quality checks, and deliver polished MP4 files ready to upload directly to your ad accounts.',
    },
  ] as ProcessStep[],

  // Honest Studio Advantages (Why Work With Us)
  advantages: [
    {
      title: 'Flexible Creative Concepts',
      description:
        'Explore multiple visual environments, seasonal themes, and lifestyle aesthetics without booking expensive studio locations or hiring production crews.',
    },
    {
      title: 'Product-Focused Storytelling',
      description:
        'Every frame emphasizes how your product works, feels, and solves problems for your buyer. We focus on real customer objections rather than hollow aesthetic filler.',
    },
    {
      title: 'Streamlined Production Workflow',
      description:
        'From approved script to delivered video files in days rather than weeks. Rapid turnaround lets your marketing team test new creative ideas quickly.',
    },
    {
      title: 'Human Review Before Delivery',
      description:
        'No unvetted AI exports. Every visual sequence, caption, and audio track is reviewed, timed, and refined by human creative directors to uphold brand standards.',
    },
    {
      title: 'Clear Communication & Defined Deliverables',
      description:
        'You always know what is being produced, what files you will receive, and when they will be delivered. No hidden fees or ambiguous timelines.',
    },
    {
      title: 'Approachable Starting Package for Smaller Brands',
      description:
        'Independent founders and emerging brands can test fresh video ads with our introductory Creative Test Pack ($79 for 3 ads) without hefty agency retainers.',
    },
  ] as StudioAdvantage[],

  // Comprehensive FAQ Section
  faqs: [
    {
      question: 'What is an AI UGC-style video ad?',
      answer:
        'An AI UGC-style video ad is a short-form video that mimics the casual, authentic look and feel of user-generated content (UGC) — such as unboxings, routine demonstrations, and product reviews — created using modern AI-assisted visual generation combined with human art direction, video editing, captions, and sound design.',
    },
    {
      question: 'Are the videos filmed with real creators?',
      answer:
        'No. We do not dispatch products to human influencers or hire traditional filming sets. Instead, we use advanced AI generative visual tools directed by human creative specialists to produce creator-style aesthetic scenes. This allows for rapid angle testing and flexibility while keeping costs accessible for growing e-commerce brands.',
    },
    {
      question: 'What types of products can you work with?',
      answer:
        'We specialize primarily in US skincare, cosmetics, and beauty products (serums, moisturizers, cleansers, creams, lip treatments) and pet products (dog and cat toys, grooming supplies, wellness supplements, everyday accessories). We also consider other lifestyle and consumer goods on a case-by-case basis.',
    },
    {
      question: 'What do I need to provide before production?',
      answer:
        'To get started, we typically need your product link or website, 3–5 high-resolution product photos (transparent background PNGs or clean lifestyle shots), your target customer description, key benefits or ingredients, and any existing brand guidelines you’d like us to follow.',
    },
    {
      question: 'How long does a project take?',
      answer:
        'Our standard introductory package typically takes 3 to 5 business days from the moment we receive your product assets and approve the creative script. Specific delivery schedules will always be mutually agreed upon in your project brief before work starts.',
    },
    {
      question: 'Can I request different hooks or creative variations?',
      answer:
        'Yes. In fact, testing multiple hooks is one of the strongest benefits of our workflow. Our Creative Test Pack includes 3 distinct creative concepts or hook variations, and we also offer dedicated Creative Variation Packs for ongoing split-testing on Meta and TikTok.',
    },
    {
      question: 'Are revisions included?',
      answer:
        'Yes. We include one clearly defined revision round per video to adjust timing, captions, on-screen text, music balance, or minor visual pacing. Additional rounds or full structural script changes after approval can be arranged for a modest fee.',
    },
    {
      question: 'Can I use the videos in paid advertising?',
      answer:
        'Yes. Permitted commercial usage, digital advertising rights, and platform terms will be clearly specified in your project agreement. All background music and sound effects we select are sourced from royalty-free, commercial-safe audio libraries.',
    },
    {
      question: 'How do we start?',
      answer:
        'Simply complete the project inquiry form below or email us directly at hello@yourdomain.com. We will review your product line, recommend the right creative angles, and send you a formal project brief to get underway.',
    },
  ] as FaqItem[],

  // Privacy Notice
  privacyNotice:
    'Privacy Notice: We respect your privacy. The information you provide is solely used to evaluate your creative project and respond with a personalized proposal. We never sell, share, or spam your contact details.',
};
