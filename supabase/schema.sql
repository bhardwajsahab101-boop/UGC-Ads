-- ============================================================================
-- LumeFlow Creative Studio: Lead Capture & Daily Digest Database Schema
-- Supabase PostgreSQL Migration with Row Level Security (RLS)
-- ============================================================================

-- 1. Create the leads table (or update if already existing)
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    company TEXT NOT NULL,
    website TEXT,
    category TEXT NOT NULL,
    package_interest TEXT,
    project_details TEXT NOT NULL,
    budget TEXT,
    status TEXT NOT NULL DEFAULT 'new',
    digested_at TIMESTAMPTZ,
    ip_hash TEXT,
    user_agent TEXT,
    CONSTRAINT leads_status_check CHECK (status IN ('new', 'contacted', 'in_review', 'proposal_sent', 'qualified', 'closed', 'archived'))
);

-- Ensure digested_at column exists if table was created previously
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS digested_at TIMESTAMPTZ;

-- 2. Add performance & search indexes
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads (status);
CREATE INDEX IF NOT EXISTS idx_leads_email ON public.leads (email);
CREATE INDEX IF NOT EXISTS idx_leads_category ON public.leads (category);
CREATE INDEX IF NOT EXISTS idx_leads_digested_at ON public.leads (digested_at) WHERE digested_at IS NULL;

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 4. RLS Security Policies:
-- Write-only policy for inbound leads (allows server & public forms to insert, but NEVER select/read)
DROP POLICY IF EXISTS "Allow public insert of leads" ON public.leads;
CREATE POLICY "Allow public insert of leads"
    ON public.leads
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Allow service_role full administrative access (read, update, delete, digest marking)
DROP POLICY IF EXISTS "Service role full access to leads" ON public.leads;
CREATE POLICY "Service role full access to leads"
    ON public.leads
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 5. Optional Digest Execution Audit Log Table
CREATE TABLE IF NOT EXISTS public.digest_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    lead_count INT NOT NULL,
    lead_ids UUID[] NOT NULL,
    recipient TEXT NOT NULL,
    resend_message_id TEXT,
    idempotency_key TEXT UNIQUE,
    status TEXT NOT NULL DEFAULT 'sent'
);

ALTER TABLE public.digest_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role access to digest logs" ON public.digest_logs;
CREATE POLICY "Service role access to digest logs"
    ON public.digest_logs
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 6. Helpful table comments for Supabase Dashboard
COMMENT ON TABLE public.leads IS 'Inbound studio inquiries from the LumeFlow Creative contact form';
COMMENT ON COLUMN public.leads.status IS 'Lead pipeline status: new, contacted, in_review, proposal_sent, qualified, closed, archived';
COMMENT ON COLUMN public.leads.digested_at IS 'Timestamp when this lead was included in the daily email digest to official.launchstack@gmail.com';
COMMENT ON TABLE public.digest_logs IS 'Audit log of daily email digest dispatches via Resend';
