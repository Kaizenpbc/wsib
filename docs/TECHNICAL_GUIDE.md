# 🔧 WSIB Curriculum Designer - Technical Documentation

## Architecture Overview

### System Components

```
┌─────────────────────────────────────────┐
│         Frontend (React/Vite)           │
│         Port: 5173                      │
└────────────────┬────────────────────────┘
                 │ HTTP/REST API
┌────────────────▼────────────────────────┐
│    Backend API (FastAPI/Python)         │
│    Container: wsib_backend              │
│    Port: 8000                          │
└────────────────┬────────────────────────┘
                 │ SQLAlchemy ORM
┌────────────────▼────────────────────────┐
│    MySQL Database                       │
│    Container: wsib_mysql                │
│    Port: 13306 (external)               │
│    Port: 3306 (internal)                │
└─────────────────────────────────────────┘
```

### Technology Stack

**Frontend:**
- React 18.2
- TypeScript
- Vite (build tool)
- TailwindCSS (styling)
- Axios (HTTP client)
- React Router (navigation)

**Backend:**
- Python 3.12
- FastAPI (web framework)
- SQLAlchemy (ORM)
- PyMySQL (MySQL connector)
- Pydantic (validation)
- python-pptx (PowerPoint generation)
- ReportLab (PDF generation)

**Database:**
- MySQL 8.0
- Docker containerized
- Persistent volume storage

**Infrastructure:**
- Docker Compose
- Volume persistence
- Network isolation

---

## Database Schema

### Tables

**1. rfps** - Request for Proposals
```sql
CREATE TABLE rfps (
    id VARCHAR(36) PRIMARY KEY,
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
```

**2. clauses** - Parsed requirements
```sql
CREATE TABLE clauses (
    id VARCHAR(36) PRIMARY KEY,
    rfp_id VARCHAR(36),
    text TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    priority VARCHAR(50) NOT NULL,
    standard_match VARCHAR(255),
    page_number INT,
    section VARCHAR(255),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (rfp_id) REFERENCES rfps(id) ON DELETE CASCADE
);
```

**3. standards** - Training standards
```sql
CREATE TABLE standards (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    tags JSON,
    requirements JSON,
    file_url TEXT,
    file_name VARCHAR(255),
    created_at TIMESTAMP
);
```

**4. curricula** - Generated curricula
```sql
CREATE TABLE curricula (
    id VARCHAR(36) PRIMARY KEY,
    rfp_id VARCHAR(36),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    total_duration_minutes INT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (rfp_id) REFERENCES rfps(id) ON DELETE CASCADE
);
```

**5. brds** - Business Requirements Documents
```sql
CREATE TABLE brds (
    id VARCHAR(36) PRIMARY KEY,
    rfp_id VARCHAR(36),
    rfp_title VARCHAR(255) NOT NULL,
    executive_summary TEXT,
    business_objectives JSON,
    functional_requirements JSON,
    non_functional_requirements JSON,
    scope TEXT,
    stakeholders JSON,
    success_criteria JSON,
    constraints JSON,
    assumptions JSON,
    created_at TIMESTAMP,
    FOREIGN KEY (rfp_id) REFERENCES rfps(id) ON DELETE CASCADE
);
```

**6. outputs** - Generated files
**7. curriculum_modules** - Module details
**8. scenarios** - Practice scenarios

---

## API Endpoints

### Base URL
```
http://localhost:8000
```

### RFP Endpoints

**GET /api/rfps** - List all RFPs
**GET /api/rfps/{id}** - Get specific RFP
**POST /api/rfps** - Upload new RFP (multipart/form-data)
**PATCH /api/rfps/{id}** - Update RFP

### Curriculum Endpoints

**GET /api/curricula** - List curricula
**POST /api/curriculum/chat** - Conversational curriculum builder
**POST /api/curriculum/generate** - Generate curriculum (legacy)

### BRD Endpoints

**GET /api/brd** - List BRDs
**POST /api/brd/generate** - Generate BRD from RFP
**GET /api/brd/{id}** - Get BRD
**GET /api/brd/{id}/download** - Download BRD as PDF

### Output Endpoints

**POST /api/outputs/ppt-chat** - PowerPoint chat interface
**POST /api/outputs/generate-ppt** - Generate PowerPoint
**POST /api/outputs/generate-student-manual** - Generate student manual
**POST /api/outputs/generate-instructor-manual** - Generate instructor manual
**POST /api/outputs/generate-scenarios** - Generate practice scenarios
**POST /api/outputs/generate-test-questions** - Generate test questions

### File Serving

**GET /api/files/uploads/{filename}** - Serve uploaded files
**GET /api/files/outputs/{type}/{filename}** - Serve generated files

---

## Services & Business Logic

### Instructional Designer Service
**Location:** `backend/app/services/instructional_designer.py`

**Purpose:** Applies professional instructional design principles

**Features:**
- Bloom's Taxonomy progression
- ADDIE model implementation
- 70-20-10 learning model
- Module structuring
- Learning objective generation
- Activity design
- Assessment creation

**Methods:**
- `design_curriculum_structure()` - Main entry point
- `_create_learning_objectives()` - SMART objectives
- `_design_activities()` - Engaging activities
- `_design_assessment()` - Appropriate assessments

### BRD Extractor Service
**Location:** `backend/app/services/brd_extractor.py`

**Purpose:** Extract business requirements from RFP clauses

**Methods:**
- `extract_from_rfp()` - Main extraction
- `_is_functional_requirement()` - Categorize requirements
- `_extract_business_objective()` - Identify objectives
- `_identify_stakeholders()` - Find stakeholders
- `_define_scope()` - Create scope statement

### RFP Parser Service
**Location:** `backend/app/services/rfp_parser.py`

**Purpose:** Parse uploaded documents and extract clauses

**Supports:**
- PDF parsing
- Word document parsing
- ZIP file extraction

### Storage Services

**Local Storage:** `backend/app/services/local_storage.py`
- Saves uploaded files to disk
- Serves files on request

**Database:** SQLAlchemy ORM with MySQL
- Connection pooling
- Session management
- Automatic migrations

---

## Configuration

### Environment Variables

**Backend (.env file):**
```env
# MySQL Database
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=root123
MYSQL_DATABASE=gta_cpr_curriculum

# API
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:5173

# Storage
STORAGE_TYPE=local

# OpenAI (optional)
OPENAI_API_KEY=
```

**Frontend (.env file - optional):**
```env
VITE_BACKEND_API_URL=http://localhost:8000
```

### Docker Configuration

**docker-compose.yml:**
- MySQL service with health checks
- Backend service with volume mounts
- Network configuration
- Auto-restart policies

---

## Development

### Running in Development Mode

**Backend:**
```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### Adding New Features

**1. New API Endpoint:**
- Create router in `backend/app/routers/`
- Add to `main.py`
- Restart backend

**2. New Database Table:**
- Add model to `backend/app/db_models.py`
- Restart backend (auto-creates table)

**3. New Frontend Page:**
- Create in `frontend/src/pages/`
- Add route in `App.tsx`
- Add to navigation in `Layout.tsx`

### Testing

**Backend Health:**
```bash
curl http://localhost:8000/health
```

**Database Connection:**
```bash
docker-compose exec mysql mysql -uroot -proot123 gta_cpr_curriculum -e "SHOW TABLES;"
```

**API Documentation:**
```
http://localhost:8000/docs
```

---

## Deployment

### Docker Deployment

**Production mode:**
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Environment-Specific Configs

Create separate `.env` files:
- `.env.development`
- `.env.production`

### Backup & Restore

**Backup Database:**
```bash
docker-compose exec mysql mysqldump -uroot -proot123 gta_cpr_curriculum > backup.sql
```

**Restore Database:**
```bash
docker-compose exec -T mysql mysql -uroot -proot123 gta_cpr_curriculum < backup.sql
```

**Backup Files:**
```bash
cp -r backend/local_storage backup/local_storage_$(date +%Y%m%d)
```

---

## Troubleshooting

### Backend Won't Start

**Check logs:**
```bash
docker-compose logs backend
```

**Common issues:**
- MySQL not ready: Wait 10 seconds and retry
- Port 8000 in use: Stop other services
- Import errors: Check Python dependencies

### Frontend Errors

**Clear cache:**
```bash
cd frontend
rm -rf node_modules
npm install
```

**Rebuild:**
```bash
npm run build
```

### Database Issues

**Can't connect:**
- Ensure MySQL container is running: `docker-compose ps`
- Check password in `.env` file
- Verify port 13306 is not in use

**Tables missing:**
- Backend auto-creates tables on startup
- Restart backend: `docker-compose restart backend`

---

## Performance Optimization

### Database Indexes

Key indexes created automatically:
- `idx_clauses_rfp_id`
- `idx_curricula_rfp_id`
- `idx_curriculum_modules_curriculum_id`

### Caching

- SQLAlchemy connection pooling
- Static file serving
- Frontend build optimization

### Scalability

Current setup handles:
- Hundreds of RFPs
- Thousands of clauses
- Multiple concurrent users (with additional configuration)

---

## Security

### Authentication

Currently: No authentication (local development)
Future: Add OAuth/JWT for multi-user

### Data Protection

- Local-only storage
- No cloud transmission
- Docker network isolation
- Environment variable protection

### File Upload Security

- File type validation
- Size limits (50MB)
- Sanitized filenames
- Isolated storage directory

---

## Version Information

**Current Version:** 2.0.0

**Changelog:**

**v2.0.0** (October 2025)
- Migrated from Supabase to MySQL
- Added conversational AI interfaces
- Implemented professional instructional design
- Added BRD generation
- Created unified AI Assistant
- Docker containerization

**v1.0.0** (Initial)
- Basic RFP upload
- Simple curriculum generation
- Supabase integration

---

**For questions or issues:** https://github.com/Kaizenpbc/wsib/issues

