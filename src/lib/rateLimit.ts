// In-memory rate limiting & duplicate submission protection
// Designed for server-side Next.js route handlers

interface RateRecord {
  timestamps: number[];
  lastPayloadHash?: string;
  lastSubmissionTime?: number;
}

const ipMap = new Map<string, RateRecord>();

// Maximum submissions allowed within the sliding window
const MAX_SUBMISSIONS_PER_WINDOW = 5;
const WINDOW_DURATION_MS = 10 * 60 * 1000; // 10 minutes
const DUPLICATE_COOLDOWN_MS = 60 * 1000; // 60 seconds

/**
 * Creates a fast simple hash of key payload contents to detect immediate duplicates.
 */
function createPayloadHash(email: string, company: string, details: string): string {
  const normalized = `${email.toLowerCase()}|${company.toLowerCase()}|${details.toLowerCase().slice(0, 80)}`;
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash << 5) - hash + normalized.charCodeAt(i);
    hash |= 0;
  }
  return hash.toString(36);
}

/**
 * Cleans up records older than the sliding window to prevent unbounded memory usage.
 */
function cleanupExpiredRecords(now: number) {
  if (ipMap.size > 2000) {
    for (const [key, record] of ipMap.entries()) {
      record.timestamps = record.timestamps.filter((t) => now - t < WINDOW_DURATION_MS);
      if (record.timestamps.length === 0) {
        ipMap.delete(key);
      }
    }
  }
}

export interface RateLimitCheckResult {
  isAllowed: boolean;
  status: number;
  message?: string;
}

/**
 * Checks if the request should be rate-limited or rejected as a duplicate.
 */
export function checkRateLimit(
  clientIp: string,
  email: string,
  company: string,
  details: string
): RateLimitCheckResult {
  const now = Date.now();
  cleanupExpiredRecords(now);

  const ipKey = clientIp || 'unknown-client';
  const record = ipMap.get(ipKey) || { timestamps: [] };

  // Filter timestamps within the current sliding window
  record.timestamps = record.timestamps.filter((t) => now - t < WINDOW_DURATION_MS);

  // 1. Check submission volume limit
  if (record.timestamps.length >= MAX_SUBMISSIONS_PER_WINDOW) {
    return {
      isAllowed: false,
      status: 429,
      message: 'Too many submissions from this connection. Please wait a few minutes before trying again.',
    };
  }

  // 2. Check for accidental duplicate submissions within cooldown period
  const payloadHash = createPayloadHash(email, company, details);
  if (
    record.lastPayloadHash === payloadHash &&
    record.lastSubmissionTime &&
    now - record.lastSubmissionTime < DUPLICATE_COOLDOWN_MS
  ) {
    return {
      isAllowed: false,
      status: 429,
      message: 'An identical inquiry was just received. Please allow our team time to review before resubmitting.',
    };
  }

  return { isAllowed: true, status: 200 };
}

/**
 * Records a successful submission for rate-limiting tracking.
 */
export function recordSubmission(
  clientIp: string,
  email: string,
  company: string,
  details: string
): void {
  const now = Date.now();
  const ipKey = clientIp || 'unknown-client';
  const record = ipMap.get(ipKey) || { timestamps: [] };

  record.timestamps.push(now);
  record.lastPayloadHash = createPayloadHash(email, company, details);
  record.lastSubmissionTime = now;

  ipMap.set(ipKey, record);
}
