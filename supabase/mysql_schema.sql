-- GTA CPR Curriculum Database Schema for MySQL
-- Run this in MySQL to create all tables

-- Drop existing tables if they exist (BE CAREFUL - this deletes data!)
-- Uncomment these lines if you want to start fresh:
-- DROP TABLE IF EXISTS outputs;
-- DROP TABLE IF EXISTS scenarios;
-- DROP TABLE IF EXISTS curriculum_modules;
-- DROP TABLE IF EXISTS curricula;
-- DROP TABLE IF EXISTS clauses;
-- DROP TABLE IF EXISTS standards;
-- DROP TABLE IF EXISTS rfps;

-- RFPs Table
CREATE TABLE IF NOT EXISTS rfps (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(255) NOT NULL,
    organization VARCHAR(255) NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'uploaded',
    clauses_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Clauses Table
CREATE TABLE IF NOT EXISTS clauses (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    rfp_id VARCHAR(36),
    text TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    standard_match VARCHAR(255),
    page_number INT,
    section VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (rfp_id) REFERENCES rfps(id) ON DELETE CASCADE
);

-- Standards Table
CREATE TABLE IF NOT EXISTS standards (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    tags JSON,
    requirements JSON,
    file_url TEXT,
    file_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Curricula Table
CREATE TABLE IF NOT EXISTS curricula (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    rfp_id VARCHAR(36),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    total_duration_minutes INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (rfp_id) REFERENCES rfps(id) ON DELETE CASCADE
);

-- Curriculum Modules Table
CREATE TABLE IF NOT EXISTS curriculum_modules (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    curriculum_id VARCHAR(36),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    learning_objectives JSON,
    duration_minutes INT NOT NULL,
    sequence_order INT NOT NULL,
    topics JSON,
    activities JSON,
    assessment JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (curriculum_id) REFERENCES curricula(id) ON DELETE CASCADE
);

-- Outputs Table
CREATE TABLE IF NOT EXISTS outputs (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    curriculum_id VARCHAR(36),
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    file_url TEXT,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (curriculum_id) REFERENCES curricula(id) ON DELETE CASCADE
);

-- Scenarios Table
CREATE TABLE IF NOT EXISTS scenarios (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    curriculum_id VARCHAR(36),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    setup_instructions TEXT,
    patient_information JSON,
    expected_actions JSON,
    evaluation_criteria JSON,
    duration_minutes INT,
    difficulty VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (curriculum_id) REFERENCES curricula(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clauses_rfp_id ON clauses(rfp_id);
CREATE INDEX IF NOT EXISTS idx_curricula_rfp_id ON curricula(rfp_id);
CREATE INDEX IF NOT EXISTS idx_curriculum_modules_curriculum_id ON curriculum_modules(curriculum_id);
CREATE INDEX IF NOT EXISTS idx_outputs_curriculum_id ON outputs(curriculum_id);
CREATE INDEX IF NOT EXISTS idx_scenarios_curriculum_id ON scenarios(curriculum_id);

-- Show all tables
SHOW TABLES;

-- Success message
SELECT 'Database schema created successfully!' AS Status;


