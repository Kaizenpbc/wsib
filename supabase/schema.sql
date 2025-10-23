-- GTA CPR Curriculum Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- RFPs Table
CREATE TABLE IF NOT EXISTS rfps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'uploaded',
    clauses_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clauses Table
CREATE TABLE IF NOT EXISTS clauses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfp_id UUID REFERENCES rfps(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    standard_match VARCHAR(255),
    page_number INTEGER,
    section VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Standards Table
CREATE TABLE IF NOT EXISTS standards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    tags TEXT[],
    requirements JSONB,
    file_url TEXT,
    file_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Curricula Table
CREATE TABLE IF NOT EXISTS curricula (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rfp_id UUID REFERENCES rfps(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    total_duration_minutes INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Curriculum Modules Table
CREATE TABLE IF NOT EXISTS curriculum_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    curriculum_id UUID REFERENCES curricula(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    learning_objectives TEXT[],
    duration_minutes INTEGER NOT NULL,
    sequence_order INTEGER NOT NULL,
    topics JSONB,
    activities JSONB,
    assessment JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Outputs Table
CREATE TABLE IF NOT EXISTS outputs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    curriculum_id UUID REFERENCES curricula(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    file_url TEXT,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Scenarios Table
CREATE TABLE IF NOT EXISTS scenarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    curriculum_id UUID REFERENCES curricula(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    setup_instructions TEXT,
    patient_information JSONB,
    expected_actions TEXT[],
    evaluation_criteria JSONB,
    duration_minutes INTEGER,
    difficulty VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clauses_rfp_id ON clauses(rfp_id);
CREATE INDEX IF NOT EXISTS idx_curricula_rfp_id ON curricula(rfp_id);
CREATE INDEX IF NOT EXISTS idx_curriculum_modules_curriculum_id ON curriculum_modules(curriculum_id);
CREATE INDEX IF NOT EXISTS idx_outputs_curriculum_id ON outputs(curriculum_id);
CREATE INDEX IF NOT EXISTS idx_scenarios_curriculum_id ON scenarios(curriculum_id);

-- Storage buckets (run these in Supabase dashboard or via SQL editor)
-- insert into storage.buckets (id, name) values ('rfp-uploads', 'rfp-uploads');
-- insert into storage.buckets (id, name) values ('generated-outputs', 'generated-outputs');

-- Storage policies (adjust as needed for your auth setup)
-- create policy "Public Access" on storage.objects for select using ( bucket_id = 'rfp-uploads' );
-- create policy "Public Access" on storage.objects for select using ( bucket_id = 'generated-outputs' );

