import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseAdminClient, checkSupabaseConfig } from '@/lib/supabaseServer';
import { sendDailyDigestNotification, getNotificationRecipient, StoredLeadRecord } from '@/lib/notifications';

// Helper to verify authorization token from headers or query param
function verifyCronAuth(req: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;

  // In production, CRON_SECRET is strictly required
  if (!cronSecret) {
    // In local dev without CRON_SECRET set, permit execution with warning
    if (process.env.NODE_ENV !== 'production') {
      return true;
    }
    return false;
  }

  // 1. Check Authorization: Bearer <secret> (Used by Vercel Cron & standard webhooks)
  const authHeader = req.headers.get('authorization');
  if (authHeader) {
    const [scheme, token] = authHeader.split(' ');
    if (scheme?.toLowerCase() === 'bearer' && token === cronSecret) {
      return true;
    }
  }

  // 2. Check x-cron-secret header
  const customHeader = req.headers.get('x-cron-secret');
  if (customHeader === cronSecret) {
    return true;
  }

  // 3. Check query param: /api/cron/digest?key=<secret>
  const url = new URL(req.url);
  const queryKey = url.searchParams.get('key');
  if (queryKey === cronSecret) {
    return true;
  }

  return false;
}

async function handleDigestExecution(req: NextRequest) {
  // 1. Verify cron authorization
  if (!verifyCronAuth(req)) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized. Invalid or missing CRON_SECRET token.' },
      { status: 401 }
    );
  }

  // 2. Verify Supabase configuration
  const supabaseConfig = checkSupabaseConfig();
  if (!supabaseConfig.isConfigured) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Database is not configured. Leads cannot be queried.',
      },
      { status: 503 }
    );
  }

  const supabase = getSupabaseAdminClient();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, error: 'Supabase admin client unavailable.' },
      { status: 503 }
    );
  }

  try {
    // 3. Query all pending inquiries that have not been included in a digest yet
    // Filters for leads where digested_at is null
    const { data: pendingLeads, error: queryError } = await supabase
      .from('leads')
      .select('*')
      .is('digested_at', null)
      .order('created_at', { ascending: true });

    if (queryError) {
      console.error('[Cron Digest] Failed to query pending leads:', queryError.message);
      const isMissingColumn = queryError.message.toLowerCase().includes('digested_at');
      return NextResponse.json(
        {
          ok: false,
          error: isMissingColumn
            ? "Database migration required: column 'digested_at' does not exist in 'leads'. Please execute the SQL migration in supabase/schema.sql."
            : 'Failed to query pending leads from database.',
          details: queryError.message,
        },
        { status: 500 }
      );
    }

    const leads = (pendingLeads || []) as StoredLeadRecord[];

    // 4. If zero pending leads, exit early to conserve email quota!
    if (leads.length === 0) {
      return NextResponse.json({
        ok: true,
        message: 'No new inquiries found since last digest. Email skipped to conserve Resend quota.',
        count: 0,
      });
    }

    // 5. Generate duplicate-prevention idempotency key based on lead IDs & date
    const sortedIds = leads.map((l) => l.id).sort().join(',');
    const idempotencyKey = `digest-${leads.length}-${Buffer.from(sortedIds).toString('base64').slice(0, 32)}`;

    // 6. Send the compiled daily digest email via Resend
    const result = await sendDailyDigestNotification(leads, idempotencyKey);

    if (!result.sent) {
      console.error('[Cron Digest] Digest notification delivery failed:', result.error);
      return NextResponse.json(
        {
          ok: false,
          error: result.error || 'Failed to send digest email.',
          leadCount: leads.length,
          leadsPreservedInDb: true,
        },
        { status: 500 }
      );
    }

    // 7. Atomically mark these leads as digested so scheduled retries DO NOT re-send duplicate emails
    const leadIds = leads.map((l) => l.id);
    const nowTimestamp = new Date().toISOString();

    const { error: updateError } = await supabase
      .from('leads')
      .update({ digested_at: nowTimestamp })
      .in('id', leadIds);

    if (updateError) {
      console.warn('[Cron Digest] Email was sent but failed to update digested_at flag:', updateError.message);
    }

    // Optional: Log execution record to digest_logs if table exists
    try {
      await supabase.from('digest_logs').insert({
        lead_count: leads.length,
        lead_ids: leadIds,
        resend_message_id: result.messageId,
        idempotency_key: idempotencyKey,
        recipient: getNotificationRecipient(),
      });
    } catch {
      // Ignored if optional audit table does not exist
    }

    return NextResponse.json({
      ok: true,
      message: `Daily digest successfully delivered to ${getNotificationRecipient()}`,
      count: leads.length,
      resendMessageId: result.messageId,
      digestedAt: nowTimestamp,
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown cron error';
    console.error('[Cron Digest] Unhandled error during digest execution:', errorMsg);
    return NextResponse.json(
      { ok: false, error: 'Internal server error executing digest.' },
      { status: 500 }
    );
  }
}

// Support both GET (Vercel Cron standard) and POST (webhooks / manual triggers)
export async function GET(req: NextRequest) {
  return handleDigestExecution(req);
}

export async function POST(req: NextRequest) {
  return handleDigestExecution(req);
}
