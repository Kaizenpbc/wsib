# 🎓 WSIB Curriculum Designer with AI Assistant

> An intelligent curriculum design system powered by SQL and conversational AI

![Project Status](https://img.shields.io/badge/status-active-green)
![License](https://img.shields.io/badge/license-MIT-blue)
![Database](https://img.shields.io/badge/database-MySQL-blue)
![AI](https://img.shields.io/badge/AI-powered-purple)

---

## 📖 What Does This App Do?

Think of this as your **"Intelligent Curriculum Design Assistant"**! Here's the magic:

1. **Upload RFP** - Drop in your Request for Proposal document
2. **Chat naturally** - Tell the AI what you need: "Create an 8-hour CPR course for healthcare workers"
3. **AI designs** - Uses professional instructional design (Bloom's Taxonomy, ADDIE, 70-20-10 learning)
4. **You get**:
   - 📚 Professional curricula with modules, objectives, activities
   - 📋 Business Requirements Documents (BRDs)
   - 📊 Customized PowerPoint presentations
   - 📝 Student & instructor manuals
   - 🎭 Practice scenarios
   - ✍️ Test questions

**All through natural conversation!** No forms, no buttons - just chat! 💬

---

## 🏗️ How It's Built

Professional architecture running **100% on your computer**:

```
┌──────────────────────────────────┐
│   Frontend (React + TypeScript)  │  ← Beautiful chat interface
│   Port: 5173                     │
└─────────────┬────────────────────┘
              │ REST API
┌─────────────▼────────────────────┐
│   Backend (FastAPI/Python)       │  ← AI-powered logic
│   Docker Container               │
│   Port: 8000                     │
└─────────────┬────────────────────┘
              │ SQLAlchemy ORM
┌─────────────▼────────────────────┐
│   MySQL Database                 │  ← All your data
│   Docker Container               │
│   Port: 13306                    │
└──────────────────────────────────┘
```

### Tech Stack:
- **Frontend:** React 18, TypeScript, Vite, TailwindCSS
- **Backend:** Python 3.12, FastAPI, SQLAlchemy
- **Database:** MySQL 8.0 (Dockerized)
- **AI Services:** Instructional Designer, BRD Extractor, Chat Endpoints
- **Infrastructure:** Docker Compose
- **Libraries:** python-pptx, ReportLab, PyPDF2, PyMySQL

---

## 📁 Project Structure

```
gta-cpr-curriculum/
├── frontend/              # Website (React)
│   ├── src/
│   │   ├── components/   # Building blocks (buttons, forms, etc.)
│   │   ├── pages/        # Different screens
│   │   ├── services/     # Code that talks to database/backend
│   │   └── types/        # Data shapes (TypeScript)
│   └── package.json      # Frontend dependencies
│
├── backend/              # Python server
│   ├── app/
│   │   ├── routers/     # API endpoints
│   │   ├── services/    # Business logic
│   │   └── models.py    # Data structures
│   └── requirements.txt  # Python dependencies
│
├── supabase/            # Database configuration
│   └── schema.sql       # Database structure
│
├── data/                # Sample files
│   ├── sample_rfp.md
│   └── sample_standards.json
│
└── README.md            # This file!
```

---

## 🚀 Quick Start (5 Minutes!)

### Prerequisites

✅ **Docker Desktop** - Download from https://docker.com
✅ **Node.js 18+** - Download from https://nodejs.org

That's it! No MySQL installation, no complex setup!

### Installation

**1. Clone the repository:**
```bash
git clone https://github.com/Kaizenpbc/wsib.git
cd wsib
```

**2. Start everything with one command:**
```bash
docker-compose up
```

Wait for: "Application startup complete" ✅

**3. Start the frontend (new terminal):**
```bash
cd frontend
npm install
npm run dev
```

**4. Open your browser:**
```
http://localhost:5173
```

**You're done!** 🎉

### What Just Happened?

- ✅ MySQL database started in Docker
- ✅ Backend API started in Docker
- ✅ All tables created automatically
- ✅ Frontend ready to use
- ✅ Everything running on YOUR computer
- ✅ No cloud accounts needed!

### Create Your `.env` File (Important!)

Create `backend/.env` with:
```env
MYSQL_HOST=mysql
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=root123
MYSQL_DATABASE=gta_cpr_curriculum
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:5173
STORAGE_TYPE=local
```

The Docker containers use this to connect!

---

## ▶️ Daily Use

**Starting the System:**

```bash
# Terminal 1: Docker containers
docker-compose up

# Terminal 2: Frontend
cd frontend && npm run dev
```

**Stopping the System:**

Press `Ctrl+C` in both terminals, or:
```bash
docker-compose down
```

**Accessing:**
- **App**: http://localhost:5173
- **API Docs**: http://localhost:8000/docs
- **MySQL**: localhost:13306 (root/root123)

---

## 🎮 How to Use (The AI Way!)

### 🤖 AI Assistant - Your Main Workspace

**Click "🤖 AI Assistant" in the left menu**

This is where everything happens! Split-screen interface:
- **Left**: Chat with AI
- **Right**: See your work build in real-time

### Example Conversations

**Creating a Curriculum:**
```
You: "Create an 8-hour CPR course for healthcare workers"

AI: "Perfect! I've selected 145 MUST-HAVE requirements.
     Ready to generate?"
     
You: "Yes"

AI: "✨ Curriculum Generated!
     - 6 modules
     - Professional instructional design
     - 70% hands-on practice
     
     Click 'Save' when ready!"
```

**Generating a BRD:**
```
You: "Generate business requirements"

AI: Creates complete BRD with:
     - Executive summary
     - Functional requirements
     - Success criteria
     - Stakeholders
```

**Customizing PowerPoint:**
```
You: "Make a PowerPoint with blue theme and instructor notes"

AI: "Let me design that for you..."
     [Shows customized PPT preview]
```

### Traditional Workflow (Still Available)

1. **Upload RFP**: Left menu → Upload RFP → Select file
2. **View Standards**: Upload standards for reference
3. **Generate**: Use AI Assistant OR navigate manually
4. **Download**: All outputs available for download

---

## 🧪 Testing with Sample Data

Want to try it without a real RFP? Use the sample file:

1. The `data/sample_rfp.md` file contains a realistic WSIB RFP
2. Convert it to PDF or use it as reference
3. The `data/sample_standards.json` contains CPR training standards

---

## 📚 Documentation

### Complete Guides Available

- **📘 [User Manual](docs/USER_MANUAL.md)** - Complete user guide with examples
- **🔧 [Technical Guide](docs/TECHNICAL_GUIDE.md)** - Architecture and development
- **👨‍💼 [Admin Guide](docs/ADMIN_GUIDE.md)** - System administration
- **🎓 [Training Guide](docs/TRAINING_GUIDE.md)** - Train others to use the system
- **⚡ [Quick Reference](docs/QUICK_REFERENCE.md)** - Cheat sheet (print this!)

### API Documentation

Once running, visit: `http://localhost:8000/docs`

---

## 🐛 Troubleshooting

### Docker won't start
**Solution:** Ensure Docker Desktop is running. Check: `docker --version`

### Port already in use
**Solution:** Change ports in `docker-compose.yml`:
```yaml
mysql:
  ports:
    - "13307:3306"  # Changed from 13306
```

### Frontend can't connect
**Solution:** 
1. Verify backend is running: `curl http://localhost:8000/health`
2. Check CORS in `backend/app/config.py`
3. Restart both services

### Database connection failed
**Solution:**
1. Check `.env` file exists in `backend/`
2. Verify password matches `docker-compose.yml`
3. Wait 10 seconds after MySQL starts
4. Restart: `docker-compose restart backend`

### Chat not responding
**Solution:**
1. Check backend logs: `docker-compose logs backend`
2. Refresh browser
3. Try suggestion buttons instead of typing

**For more troubleshooting**, see the [Admin Guide](docs/ADMIN_GUIDE.md)

---

## 📚 Learn More

### What is React?
React is like LEGO for websites - you build pages using small reusable pieces (components).

### What is FastAPI?
FastAPI is a Python tool that creates a "web server" - it listens for requests and sends back responses.

### What is Supabase?
Supabase is like a "smart database in the cloud" - it stores your data and files safely online.

### What is TypeScript?
TypeScript is JavaScript with "safety rules" - it helps catch mistakes before they become bugs.

---

## 🤝 Contributing

Want to improve this project? Great!

1. Fork the repository
2. Create a branch: `git checkout -b my-feature`
3. Make your changes
4. Test everything works
5. Commit: `git commit -m "Add my feature"`
6. Push: `git push origin my-feature`
7. Create a Pull Request

---

## 📝 License

MIT License - Feel free to use this for your projects!

---

## 🆘 Need Help?

If you get stuck:

1. Check the Troubleshooting section above
2. Look at the error message carefully
3. Google the error (someone probably had the same problem!)
4. Ask for help on Stack Overflow

---

## 🎯 Next Steps

Once you have the basic app running, you can:

1. ✅ Customize the curriculum templates
2. ✅ Add AI features for better content generation
3. ✅ Add user authentication (login/signup)
4. ✅ Deploy to the cloud (make it accessible online)
5. ✅ Add more output formats (videos, quizzes, etc.)

---

## ✨ Key Features

### Implemented ✅

- ✅ **Conversational AI** - Chat naturally to create curricula
- ✅ **Professional Instructional Design** - Bloom's Taxonomy, ADDIE, 70-20-10 learning
- ✅ **Business Requirements** - Auto-generate BRDs from RFPs
- ✅ **Multiple Curricula** - Create many courses from one RFP
- ✅ **Customizable Outputs** - Chat-based PowerPoint customization
- ✅ **100% Local** - All data on YOUR computer, no cloud
- ✅ **Docker Containerized** - Easy setup and deployment
- ✅ **Split-Screen Interface** - Chat left, results right
- ✅ **Auto-clause Selection** - AI picks relevant requirements
- ✅ **Real-time Preview** - See curricula build as you chat

### Roadmap 🚀

- 🔄 **Curriculum Editing** - Modify existing curricula
- 🔐 **Multi-user Auth** - Team collaboration
- 📧 **Notifications** - Email when outputs ready
- 🌍 **Multi-language** - English/French support
- 📱 **Mobile App** - iOS/Android
- ☁️ **Cloud Deployment** - One-click deploy

---

## 🙏 Acknowledgments

Built for **WSIB** with professional instructional design principles:
- Bloom's Taxonomy for learning progression
- ADDIE framework for systematic design
- 70-20-10 model for practical learning
- Adult learning theory

---

## 📞 Support

- **Documentation**: See `docs/` folder
- **Issues**: https://github.com/Kaizenpbc/wsib/issues
- **Discussions**: https://github.com/Kaizenpbc/wsib/discussions

---

**Version 2.0.0** | **Built with ❤️ for WSIB**

Happy curriculum building! 🎓✨

