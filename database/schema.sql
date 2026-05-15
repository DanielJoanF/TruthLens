-- Enable pgvector extension for future semantic search with embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- Users table
-- References Supabase auth.users for authentication
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    plan TEXT DEFAULT 'free'
);

-- Analysis History table
-- Stores user analysis history for extracted content
CREATE TABLE analysis_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    url TEXT,
    content TEXT NOT NULL,
    ai_summary TEXT,
    credibility_score INTEGER,
    risk_level TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Sources table
-- Stores domain credibility to help score new analyses
CREATE TABLE sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    domain TEXT UNIQUE NOT NULL,
    credibility_rating INTEGER,
    notes TEXT,
    last_checked TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Claims table
-- Stores extracted claims associated with a specific analysis
CREATE TABLE claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    analysis_id UUID REFERENCES analysis_history(id) ON DELETE CASCADE,
    claim_text TEXT NOT NULL,
    verification_status TEXT,
    confidence_score FLOAT
);

-- Embeddings table
-- Stores vector representations of content for semantic search
CREATE TABLE embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content TEXT NOT NULL,
    vector vector(1536),
    source TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Performance Indexes
CREATE INDEX idx_analysis_history_user_id ON analysis_history(user_id);
CREATE INDEX idx_sources_domain ON sources(domain);
CREATE INDEX idx_claims_analysis_id ON claims(analysis_id);
