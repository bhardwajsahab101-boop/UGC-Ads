import { Resend } from 'resend';
import { SanitizedInquiryData } from './validation';
import { siteConfig } from '@/config/site';

export interface StoredLeadRecord {
  id: string;
  created_at: string;
  name: string;
  email: string;
  company: string;
  website?: string | null;
  category: string;
  package_interest?: string | null;
  project_details: string;
  budget?: string | null;
  status: string;
}

export interface NotificationResult {
  sent: boolean;
  messageId?: string;
  error?: string;
  statusCode?: number;
  errorName?: string;
  reason?: 'unconfigured' | 'failed' | 'success';
}

/**
 * Returns the configured recipient email address.
 * Reads from CONTACT_NOTIFICATION_EMAIL, defaulting to official.launchstack@gmail.com.
 */
export function getNotificationRecipient(): string {
  const configured = process.env.CONTACT_NOTIFICATION_EMAIL?.trim();
  if (configured) {
    return configured;
  }
  return 'official.launchstack@gmail.com';
}

/**
 * Sends a daily digest email containing all new inquiries received since the last digest.
 * Conserves Resend free-plan quota by replacing per-inquiry emails with a single batched summary.
 */
export async function sendDailyDigestNotification(
  leads: StoredLeadRecord[],
  idempotencyKey?: string
): Promise<NotificationResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey.includes('your_resend_api_key')) {
    console.warn('[Digest] RESEND_API_KEY is not configured. Digest skipped; leads remain preserved in Supabase.');
    return { sent: false, reason: 'unconfigured' };
  }

  if (leads.length === 0) {
    return { sent: false, reason: 'unconfigured' };
  }

  const recipient = getNotificationRecipient();
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'LumeFlow Studio <onboarding@resend.dev>';
  const dateFormatted = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const subject = `[Daily Digest] ${leads.length} New Studio Inquir${leads.length === 1 ? 'y' : 'ies'} — ${dateFormatted}`;

  // Plain-text fallback version
  const textContent = [
    `LUMEFLOW CREATIVE STUDIO — DAILY INQUIRY DIGEST`,
    `============================================================`,
    `Total New Inquiries: ${leads.length}`,
    `Generated At:        ${new Date().toUTCString()}`,
    `Review in Supabase:  https://supabase.com/dashboard/project/gwyrtiaeyexlriuwwoyu/editor`,
    `============================================================`,
    ``,
    ...leads.map((lead, idx) => [
      `[#${idx + 1}] ${lead.company} (${lead.category})`,
      `Client Name:      ${lead.name}`,
      `Work Email:       ${lead.email}`,
      `Website:          ${lead.website || 'N/A'}`,
      `Package Interest: ${lead.package_interest || 'N/A'}`,
      `Budget:           ${lead.budget || 'N/A'}`,
      `Submitted:        ${new Date(lead.created_at).toLocaleString()}`,
      `Lead ID:          ${lead.id}`,
      ``,
      `--- REQUIREMENTS ---`,
      lead.project_details,
      `------------------------------------------------------------`,
      ``,
    ].join('\n')),
    `Manage your lead pipeline in the Supabase Table Editor:`,
    `https://supabase.com/dashboard/project/gwyrtiaeyexlriuwwoyu/editor`,
  ].join('\n');

  // Rich HTML template matching LumeFlow Creative design tokens
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${subject}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #090a0c; color: #f8fafc; margin: 0; padding: 24px; line-height: 1.5;">
      <div style="max-width: 680px; margin: 0 auto; background: #101216; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 12px; overflow: hidden;">
        
        <!-- Digest Header Banner -->
        <div style="background: linear-gradient(135deg, rgba(204, 255, 0, 0.12) 0%, rgba(16, 18, 22, 1) 100%); border-bottom: 2px solid #ccff00; padding: 28px 28px 24px 28px;">
          <div style="display: inline-block; background: rgba(204, 255, 0, 0.12); color: #ccff00; border: 1px solid rgba(204, 255, 0, 0.3); padding: 3px 10px; border-radius: 4px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px;">
            Daily Lead Digest
          </div>
          <h1 style="margin: 0 0 6px 0; color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.02em;">
            ${leads.length} New Studio Inquir${leads.length === 1 ? 'y' : 'ies'}
          </h1>
          <p style="margin: 0; color: #9aa4b2; font-size: 14px;">
            Digest for ${dateFormatted} &bull; Batched to conserve email quota
          </p>
        </div>

        <!-- Quick CTA Bar -->
        <div style="background: rgba(255, 255, 255, 0.03); border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding: 16px 28px; text-align: right;">
          <a href="https://supabase.com/dashboard/project/gwyrtiaeyexlriuwwoyu/editor" target="_blank" style="display: inline-block; background: #ccff00; color: #090a0c; text-decoration: none; font-size: 13px; font-weight: 700; padding: 8px 18px; border-radius: 6px;">
            Open Supabase Table Editor &rarr;
          </a>
        </div>

        <!-- Inquiries List -->
        <div style="padding: 28px;">
          ${leads.map((lead, index) => `
            <div style="background: #15181e; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; padding: 20px; margin-bottom: 20px;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 12px;">
                <div>
                  <span style="font-size: 11px; font-weight: 700; color: #ccff00; text-transform: uppercase; letter-spacing: 0.04em;">Lead #${index + 1} &bull; ${lead.category}</span>
                  <h3 style="margin: 4px 0 0 0; color: #f8fafc; font-size: 18px; font-weight: 700;">${lead.company}</h3>
                </div>
                <div style="text-align: right;">
                  <span style="font-size: 11px; color: #64748b;">${new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              <table style="width: 100%; border-collapse: collapse; font-size: 13px; margin-bottom: 14px;">
                <tr>
                  <td style="padding: 4px 0; color: #9aa4b2; width: 130px;"><strong>Client Contact:</strong></td>
                  <td style="padding: 4px 0; color: #f8fafc;">${lead.name} &bull; <a href="mailto:${lead.email}" style="color: #ccff00; text-decoration: none;">${lead.email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #9aa4b2;"><strong>Website Link:</strong></td>
                  <td style="padding: 4px 0;"><a href="${lead.website || '#'}" target="_blank" style="color: #60a5fa; text-decoration: underline;">${lead.website || 'Not provided'}</a></td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #9aa4b2;"><strong>Package / Budget:</strong></td>
                  <td style="padding: 4px 0; color: #cbd5e1;">${lead.package_interest || 'N/A'} &bull; <span style="color: #ccff00;">${lead.budget || 'N/A'}</span></td>
                </tr>
              </table>

              <div style="background: rgba(0, 0, 0, 0.4); border-left: 3px solid #ccff00; border-radius: 4px; padding: 12px; margin-top: 10px;">
                <div style="font-size: 11px; font-weight: 700; color: #9aa4b2; text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 4px;">Requirements &amp; Goals:</div>
                <div style="font-size: 13px; color: #e2e8f0; line-height: 1.55; white-space: pre-wrap;">${lead.project_details}</div>
              </div>

              <div style="margin-top: 12px; font-size: 11px; color: #64748b;">
                Lead ID: <code>${lead.id}</code> &bull; <a href="mailto:${lead.email}?subject=Re:%20${encodeURIComponent(lead.company)}%20Video%20Ad%20Inquiry%20-%20LumeFlow%20Creative" style="color: #cbd5e1; text-decoration: underline;">Reply directly to ${lead.name}</a>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Footer -->
        <div style="background: #090a0c; border-top: 1px solid rgba(255, 255, 255, 0.08); padding: 20px 28px; text-align: center; font-size: 12px; color: #64748b;">
          <p style="margin: 0 0 6px 0;">This scheduled digest was sent to <strong>${recipient}</strong> to conserve your Resend API quota.</p>
          <p style="margin: 0;">LumeFlow Creative &bull; Next.js 16 + Supabase Backend</p>
        </div>

      </div>
    </body>
    </html>
  `;

  try {
    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send(
      {
        from: fromEmail,
        to: [recipient],
        subject,
        text: textContent,
        html: htmlContent,
        headers: idempotencyKey ? { 'X-Entity-Ref-ID': idempotencyKey } : undefined,
      },
      idempotencyKey ? { idempotencyKey } : undefined
    );

    if (error) {
      console.error('[Digest] Resend digest delivery failed:', error.message);
      return { sent: false, error: error.message, reason: 'failed' };
    }

    console.info(`[Digest] Daily digest delivered to ${recipient} (Message ID: ${data?.id}, Count: ${leads.length})`);
    return { sent: true, messageId: data?.id, reason: 'success' };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown digest notification error';
    console.error('[Digest] Unexpected digest exception:', errorMsg);
    return { sent: false, error: errorMsg, reason: 'failed' };
  }
}

/**
 * Optional individual notification (preserved for manual testing or ad-hoc alerts).
 */
export async function sendLeadNotification(
  lead: SanitizedInquiryData,
  leadId: string
): Promise<NotificationResult> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey || apiKey.includes('your_resend_api_key')) {
    console.info('[Notification] RESEND_API_KEY is not configured. Email notification skipped (lead is preserved in Supabase).');
    return { sent: false, reason: 'unconfigured' };
  }

  const recipient = getNotificationRecipient();
  const fromEmail = process.env.RESEND_FROM_EMAIL || 'LumeFlow Studio <onboarding@resend.dev>';

  try {
    const resend = new Resend(apiKey);

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [recipient],
      replyTo: lead.email,
      template: {
        id: 'lead-notification',
        variables: {
          CLIENT_NAME: lead.name || 'Valued Lead',
          CLIENT_EMAIL: lead.email,
          COMPANY: lead.company || 'Not specified',
          WEBSITE: lead.website || 'Not provided',
          CATEGORY: lead.category || 'General',
          PACKAGE_INTEREST: lead.package_interest || 'General Inquiry',
          BUDGET: lead.budget || 'Not specified',
          PROJECT_DETAILS: lead.project_details || 'No details provided',
          LEAD_ID: leadId,
        },
      },
    });

    if (error) {
      const statusCode = (error as { statusCode?: number }).statusCode;
      const errorName = error.name || 'ResendError';
      console.error(
        `[Notification] Resend lead-notification delivery failed (Status: ${statusCode || 'unknown'}, Error: ${errorName}): ${error.message}`
      );
      return {
        sent: false,
        error: error.message,
        statusCode,
        errorName,
        reason: 'failed',
      };
    }

    console.info(
      `[Notification] Resend lead-notification accepted (Message ID: ${data?.id}, Recipient: ${recipient})`
    );
    return { sent: true, messageId: data?.id, reason: 'success' };
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : 'Unknown lead notification error';
    console.error('[Notification] Unexpected exception during lead notification:', errorMsg);
    return { sent: false, error: errorMsg, reason: 'failed' };
  }
}
