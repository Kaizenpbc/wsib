# ⚡ Quick Reference Card

## Starting the System

```bash
# Terminal 1: Start Docker
docker-compose up

# Terminal 2: Start Frontend  
cd frontend && npm run dev

# Browser
http://localhost:5173
```

---

## Common Chat Commands

### Creating Curricula
```
"Create 8-hour CPR course for healthcare workers"
"I need 3 different courses from this RFP"
"Advanced first aid, 16 hours, paramedics"
```

### Business Requirements
```
"Generate business requirements"
"Create BRD"
"Extract requirements from this RFP"
```

### PowerPoint
```
"Professional blue theme with all modules"
"Colorful presentation with quizzes"
"Add instructor notes to slides"
```

---

## Navigation Menu

| Icon | Menu Item | Purpose |
|------|-----------|---------|
| 🏠 | Dashboard | Home/Overview |
| 🤖 | AI Assistant | **Main workspace** - Chat here! |
| 📄 | Upload RFP | Upload RFP documents |
| 🛡️ | Upload Standards | Upload compliance docs |
| ✅ | Business Requirements | View/Generate BRDs |
| 📚 | Curriculum Design | Via RFP click |
| 📊 | Generate Outputs | Via curriculum |

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Enter` | Send chat message |
| `Shift+Enter` | New line in chat |
| `Ctrl+C` | Stop Docker/Frontend |

---

## File Formats Supported

**Uploads:**
- PDF, DOC, DOCX, ZIP
- Max 50MB per file

**Outputs:**
- PowerPoint (.pptx)
- PDF (manuals, BRD)
- JSON (data exports)

---

## Database Quick Commands

**View RFPs:**
```sql
SELECT id, title, clauses_count FROM rfps;
```

**View Curricula:**
```sql
SELECT id, title, total_duration_minutes FROM curricula;
```

**Count Records:**
```sql
SELECT 
  (SELECT COUNT(*) FROM rfps) as rfps,
  (SELECT COUNT(*) FROM curricula) as curricula,
  (SELECT COUNT(*) FROM standards) as standards;
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't connect | `docker-compose restart backend` |
| Frontend error | Refresh browser (F5) |
| Chat not responding | Check backend logs |
| Port in use | Change port in docker-compose.yml |

---

## System Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend | 5173 | http://localhost:5173 |
| Backend API | 8000 | http://localhost:8000 |
| MySQL | 13306 | localhost:13306 |
| API Docs | 8000 | http://localhost:8000/docs |

---

## Workflow Cheat Sheet

### Complete RFP to Curriculum Flow

```
1. Upload RFP
   ↓
2. Click "🤖 AI Assistant"
   ↓
3. Select RFP
   ↓
4. Chat: "Create 8-hour CPR course"
   ↓
5. Answer AI questions
   ↓
6. Review curriculum on right
   ↓
7. Click "Save"
   ↓
8. Generate outputs!
```

---

## Data Locations

**Database:** Docker volume `mysql_data`
**Files:** `backend/local_storage/`
**Backups:** `backups/` (if configured)

---

## Version: 2.0.0
**Print this for your desk! 📎**

