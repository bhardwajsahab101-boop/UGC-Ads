import { NextRequest, NextResponse } from 'next/server';
import { validateInquiryInput } from '@/lib/validation';
import { checkRateLimit, recordSubmission } from '@/lib/rateLimit';
import { getSupabaseAdminClient, checkSupabaseConfig } from '@/lib/supabaseServer';
import { sendLeadNotification } from '@/lib/notifications';

// Helper to extract client IP address safely
function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') || '127.0.0.1';
}

export async function POST(req: NextRequest) {
  try {
    // 1. Verify Content-Type
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        { ok: false, error: 'Invalid content type. Expected application/json.' },
        { status: 415 }
      );
    }

    // 2. Parse JSON body safely
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return NextResponse.json(
        { ok: false, error: 'Malformed JSON payload.' },
        { status: 400 }
      );
    }

    if (!rawBody || typeof rawBody !== 'object') {
      return NextResponse.json(
        { ok: false, error: 'Request body must be a valid JSON object.' },
        { status: 400 }
      );
    }

    const clientIp = getClientIp(req);

    // 3. Server-side Validation & Honeypot Spam Protection
    const validation = validateInquiryInput(rawBody as Record<string, unknown>);
    if (!validation.isValid || !validation.data) {
      if (validation.errors.spam) {
        // Return 400 for bot submissions without giving bot-makers hints
        return NextResponse.json(
          { ok: false, error: 'Submission rejected.' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        {
          ok: false,
          error: 'Please correct the highlighted errors.',
          details: validation.errors,
        },
        { status: 400 }
      );
    }

    const data = validation.data;

    // 4. Rate Limiting & Duplicate Submission Prevention
    const rateCheck = checkRateLimit(clientIp, data.email, data.company, data.project_details);
    if (!rateCheck.isAllowed) {
      return NextResponse.json(
        { ok: false, error: rateCheck.message },
        { status: rateCheck.status }
      );
    }

    // 5. Database Verification (Supabase)
    const supabaseConfig = checkSupabaseConfig();
    if (!supabaseConfig.isConfigured) {
      console.warn('[Contact API] Supabase is not configured:', supabaseConfig.error);
      return NextResponse.json(
        {
          ok: false,
          error: 'The inquiry storage service is not yet configured. Please configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
          configured: false,
        },
        { status: 503 }
      );
    }

    const supabase = getSupabaseAdminClient();
    if (!supabase) {
      return NextResponse.json(
        { ok: false, error: 'Database service unavailable. Please try again shortly.' },
        { status: 503 }
      );
    }

    // 6. Insert lead into Supabase leads table
    const userAgent = req.headers.get('user-agent')?.slice(0, 250) || null;

    const { data: insertedLead, error: dbError } = await supabase
      .from('leads')
      .insert({
        name: data.name,
        email: data.email,
        company: data.company,
        website: data.website,
        category: data.category,
        package_interest: data.package_interest,
        project_details: data.project_details,
        budget: data.budget,
        status: 'new',
        user_agent: userAgent,
      })
      .select('id, created_at')
      .single();

    if (dbError) {
      console.error('[Contact API] Supabase database insert error:', dbError.message);
      return NextResponse.json(
        {
          ok: false,
          error: 'We were unable to save your inquiry to our database. Please contact us directly or try again later.',
        },
        { status: 500 }
      );
    }

    // Record submission for rate limiting
    recordSubmission(clientIp, data.email, data.company, data.project_details);

    const leadId = insertedLead?.id || 'unknown';

    // 7. Send notification email via Resend (lead-notification template)
    // Non-blocking for the user: Lead remains securely saved in Supabase even if email delivery fails.
    try {
      const notificationResult = await sendLeadNotification(data, leadId);
      if (notificationResult.sent) {
        console.info(
          `[Contact API] Notification email accepted by Resend (Message ID: ${notificationResult.messageId}) for lead ID: ${leadId}`
        );
      } else {
        console.warn(
          `[Contact API] Notification email attempt failed (Status: ${notificationResult.statusCode || 'N/A'}, Error: ${notificationResult.error || 'unknown'}), but lead ${leadId} was securely saved to Supabase.`
        );
      }
    } catch (notifyErr) {
      const notifyErrMsg = notifyErr instanceof Error ? notifyErr.message : 'Unknown notification error';
      console.warn(`[Contact API] Unexpected error sending lead notification for lead ${leadId}: ${notifyErrMsg}`);
    }

    // 8. Return success response
    return NextResponse.json(
      {
        ok: true,
        message: 'Your inquiry has been submitted successfully! We will review your product and respond within 24 business hours.',
        leadId,
      },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown server error';
    console.error('[Contact API] Unhandled server error in contact API:', message);
    return NextResponse.json(
      { ok: false, error: 'An unexpected server error occurred. Please try again later.' },
      { status: 500 }
    );
  }
}
