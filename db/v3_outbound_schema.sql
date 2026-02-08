-- GCMS v3.0 Outbound Stack Schema
-- This migration creates the core tables for the login-first, gated-progress architecture

-- ============================================================================
-- ENUMS
-- ============================================================================

-- Application progress states (enforces linear progression)
CREATE TYPE app_status AS ENUM (
    'eligibility_pending',  -- Student uploads passport, dean's letter, USMLE
    'payment_pending',      -- Admin approved eligibility, payment required
    'compliance_pending',   -- Payment verified, upload AAMC/immunization/insurance
    'visa_pending',         -- Compliance verified, visa documentation in progress
    'ready_to_travel'       -- All gates passed, student cleared for rotation
);

-- Document verification states
CREATE TYPE verification_status AS ENUM (
    'pending',
    'verified',
    'rejected'
);

-- ============================================================================
-- PROGRAMS TABLE
-- ============================================================================

CREATE TABLE programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    location TEXT NOT NULL,
    country TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('active', 'waitlist')),
    price NUMERIC(10, 2),
    content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed the 3 programs
INSERT INTO programs (name, slug, location, country, status, price, content_json) VALUES
(
    'University of Wisconsin',
    'wisconsin',
    'Madison, Wisconsin',
    'USA',
    'active',
    3000.00,
    '{
        "images": [
            "https://images.unsplash.com/photo-1519494026892-80ba456adc66?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ],
        "pros": [
            "Top-Tier Academic Research Institution",
            "Midwest Safety Profile with Low Crime Rates",
            "Strong Ophthalmology & Internal Medicine Departments",
            "Department Chair-Signed Letters of Recommendation",
            "Active Clinical Exposure in Teaching Hospital"
        ],
        "cons": [
            "Severe Winter Weather (Nov-Mar)",
            "Smaller City Feel Compared to Coastal Hubs",
            "Limited Public Transportation"
        ],
        "description": "The University of Wisconsin-Madison is a premier public research university with a world-class medical school. Clinical rotations here are strictly merit-based and provide hands-on exposure in a top-tier academic medical center. Letters of recommendation are signed by the Department Chair, carrying significant weight in residency applications.",
        "departments": ["Internal Medicine", "Surgery", "Ophthalmology", "Pediatrics"],
        "duration": "4 weeks",
        "housing": "On-campus housing available"
    }'
),
(
    'Johns Hopkins University',
    'hopkins',
    'Baltimore, Maryland',
    'USA',
    'waitlist',
    4500.00,
    '{
        "images": [
            "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1519167758481-83f29da73ddc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1582719366811-dcf8f6c0e733?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ],
        "pros": [
            "#1 Ranked Hospital in the United States",
            "Global Brand Recognition for Residency Applications",
            "Historic Prestige in Medical Education",
            "Access to Cutting-Edge Research Facilities",
            "Strong International Medical Graduate Support"
        ],
        "cons": [
            "High Cost of Living in Baltimore",
            "Baltimore Safety Concerns (Housing Guidance Required)",
            "Highly Competitive Rotation Spots",
            "Limited Hands-On Experience Due to High Demand"
        ],
        "description": "Johns Hopkins Hospital is consistently ranked as the #1 hospital in the United States. A rotation here provides unparalleled exposure to world-class medicine and significantly strengthens residency applications. Due to extremely high demand, spots are currently waitlist-only.",
        "departments": ["Oncology", "Cardiology", "Neurosurgery", "Emergency Medicine"],
        "duration": "4 weeks",
        "housing": "Housing assistance provided"
    }'
),
(
    'University of Edinburgh',
    'edinburgh',
    'Edinburgh, Scotland',
    'UK',
    'waitlist',
    3500.00,
    '{
        "images": [
            "https://images.unsplash.com/photo-1555604421-68c7e5e7be51?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1504893524553-b855bce32c67?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
        ],
        "pros": [
            "NHS System Exposure (Different from US Model)",
            "Historic Prestige - Oldest Medical School in English-Speaking World",
            "Safe, Walkable City with Rich Culture",
            "Strong GMC Recognition for UK Practice Pathway",
            "Beautiful Campus with Modern Facilities"
        ],
        "cons": [
            "Stricter 'Hands-Off' Patient Rules in NHS",
            "Longer Visa Processing Time for UK",
            "Limited Direct US Residency Advantage",
            "Observership-Heavy vs. Clinical Participation"
        ],
        "description": "The University of Edinburgh Medical School is one of the oldest and most prestigious in the world. Rotations provide exposure to the NHS system, which is valuable for students considering UK practice pathways. The city is consistently ranked as one of the safest and most beautiful in Europe.",
        "departments": ["General Medicine", "Surgery", "Geriatrics", "Public Health"],
        "duration": "4 weeks",
        "housing": "University accommodation available"
    }'
);

-- ============================================================================
-- APPLICATIONS TABLE (Core of Gated Progress System)
-- ============================================================================

CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL,  -- Clerk user ID
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    current_step app_status NOT NULL DEFAULT 'eligibility_pending',
    payment_id TEXT,  -- Stripe Payment Intent ID
    payment_verified BOOLEAN DEFAULT FALSE,
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure one application per user per program
    UNIQUE(user_id, program_id)
);

-- Index for fast user lookups
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_program_id ON applications(program_id);

-- ============================================================================
-- DOCUMENTS TABLE (The Vault)
-- ============================================================================

CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    type TEXT NOT NULL,  -- 'passport', 'deans_letter', 'usmle', 'aamc_form', 'immunization', 'insurance'
    file_url TEXT NOT NULL,  -- Supabase Storage URL
    file_name TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    verified BOOLEAN DEFAULT FALSE,
    verification_status verification_status DEFAULT 'pending',
    admin_notes TEXT,
    verified_by TEXT,  -- Clerk user ID of admin
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure one document of each type per application
    UNIQUE(application_id, type)
);

CREATE INDEX idx_documents_application_id ON documents(application_id);
CREATE INDEX idx_documents_verification_status ON documents(verification_status);

-- ============================================================================
-- WAITLIST TABLE
-- ============================================================================

CREATE TABLE waitlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    user_id TEXT,  -- Optional Clerk user ID if logged in
    user_name TEXT,
    notify_when_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Prevent duplicate waitlist entries
    UNIQUE(program_id, email)
);

CREATE INDEX idx_waitlist_program_id ON waitlist(program_id);

-- ============================================================================
-- CASE LOGS TABLE (For Professor Interface)
-- ============================================================================

CREATE TABLE case_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,  -- Student Clerk user ID
    diagnosis TEXT NOT NULL,
    procedure_performed TEXT NOT NULL,
    date_of_procedure DATE NOT NULL,
    notes TEXT,
    verified BOOLEAN DEFAULT FALSE,
    verified_by TEXT,  -- Professor Clerk user ID
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_case_logs_application_id ON case_logs(application_id);
CREATE INDEX idx_case_logs_verified ON case_logs(verified);

-- ============================================================================
-- TRIGGER: Auto-update updated_at timestamps
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_case_logs_updated_at BEFORE UPDATE ON case_logs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- RLS POLICIES (Row-Level Security)
-- ============================================================================

-- Enable RLS
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_logs ENABLE ROW LEVEL SECURITY;

-- Programs: Public read access
CREATE POLICY "Programs are viewable by everyone" ON programs
    FOR SELECT USING (true);

-- Applications: Users can only see their own applications
CREATE POLICY "Users can view own applications" ON applications
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create own applications" ON applications
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own applications" ON applications
    FOR UPDATE USING (auth.uid()::text = user_id);

-- Documents: Users can only see their own documents
CREATE POLICY "Users can view own documents" ON documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM applications
            WHERE applications.id = documents.application_id
            AND applications.user_id = auth.uid()::text
        )
    );

CREATE POLICY "Users can create own documents" ON documents
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM applications
            WHERE applications.id = documents.application_id
            AND applications.user_id = auth.uid()::text
        )
    );

-- Waitlist: Anyone can join
CREATE POLICY "Anyone can join waitlist" ON waitlist
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view waitlist entries" ON waitlist
    FOR SELECT USING (true);

-- Case Logs: Users can view and create their own logs
CREATE POLICY "Users can view own case logs" ON case_logs
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can create own case logs" ON case_logs
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View: Application with program details
CREATE VIEW application_details AS
SELECT 
    a.id,
    a.user_id,
    a.current_step,
    a.payment_verified,
    a.created_at,
    a.updated_at,
    p.name as program_name,
    p.slug as program_slug,
    p.location as program_location,
    p.price as program_price,
    COUNT(d.id) as documents_uploaded,
    COUNT(CASE WHEN d.verification_status = 'verified' THEN 1 END) as documents_verified
FROM applications a
JOIN programs p ON a.program_id = p.id
LEFT JOIN documents d ON a.id = d.application_id
GROUP BY a.id, p.name, p.slug, p.location, p.price;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE programs IS 'University programs available for clinical rotations';
COMMENT ON TABLE applications IS 'Student applications to programs - tracks gated progress';
COMMENT ON TABLE documents IS 'Document vault for all uploaded files with verification status';
COMMENT ON TABLE waitlist IS 'Waitlist for programs not yet accepting applications';
COMMENT ON TABLE case_logs IS 'Clinical case logs submitted by students for professor verification';
COMMENT ON TYPE app_status IS 'Linear progression states for application gating';
