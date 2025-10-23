# 🎓 GTA CPR Curriculum Design Framework

> A complete web application for designing curriculum from RFPs and generating training materials automatically!

![Project Status](https://img.shields.io/badge/status-in%20development-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## 📖 What Does This App Do?

Think of this app like a **"Curriculum Factory"**! Here's what happens:

1. **You upload** an RFP document (PDF or Word) from WSIB
2. **The app reads** the RFP and breaks it into requirements
3. **You click a button** to generate a curriculum
4. **The app creates** everything you need:
   - 📊 PowerPoint presentations for teaching
   - 📚 Student workbooks
   - 👨‍🏫 Instructor manuals  
   - 🎭 Practice scenarios
   - ✍️ Test questions

All in just a few clicks! 🎉

---

## 🏗️ How It's Built

This project uses three main parts (like three rooms in a house):

```
┌─────────────────┐
│   FRONTEND      │  ← The part you see and click (React)
│   (Website)     │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   SUPABASE      │  ← Cloud database and file storage
│   (Database)    │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   BACKEND       │  ← The "brain" that creates files (Python)
│   (Generator)    │
└─────────────────┘
```

### Tech Stack:
- **Frontend:** React + TypeScript + Vite + TailwindCSS
- **Database:** Supabase (PostgreSQL in the cloud)
- **Backend:** Python + FastAPI
- **Libraries:** PyPDF2, python-pptx, reportlab

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

## 🚀 Getting Started

### Step 1: Install Required Software

Before you start, you need to install these tools (like buying ingredients before cooking):

1. **Node.js** (version 18 or newer)
   - Download from: https://nodejs.org/
   - This runs the frontend website

2. **Python** (version 3.10 or newer)
   - Download from: https://www.python.org/
   - This runs the backend server

3. **Git** (to download code)
   - Download from: https://git-scm.com/

4. **Code Editor** (optional but helpful)
   - VS Code: https://code.visualstudio.com/

### Step 2: Get a Supabase Account

Supabase is like a "cloud filing cabinet" for your data:

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up (it's FREE!)
4. Create a new project:
   - Give it a name: "gta-cpr-curriculum"
   - Set a password (save this!)
   - Choose a region (closest to you)
5. Wait 2 minutes for it to set up
6. Go to **Settings → API** and copy:
   - `Project URL` (looks like: https://xxxxx.supabase.co)
   - `anon public` key (long string of letters/numbers)

### Step 3: Set Up the Database

1. In Supabase dashboard, click **SQL Editor**
2. Click **New Query**
3. Copy everything from `supabase/schema.sql` in this project
4. Paste it and click **Run**
5. You should see "Success" - your database is ready! ✅

### Step 4: Create Storage Buckets

1. In Supabase dashboard, click **Storage**
2. Create two buckets:
   - Click **New bucket** → Name: `rfp-uploads` → Make it Public → Create
   - Click **New bucket** → Name: `generated-outputs` → Make it Public → Create

### Step 5: Set Up Frontend

Open your terminal (Command Prompt on Windows, Terminal on Mac):

```bash
# Go to the project folder
cd gta-cpr-curriculum

# Go to frontend folder
cd frontend

# Install all the tools (this takes 2-3 minutes)
npm install

# Create environment file
# On Windows:
copy .env.example .env

# On Mac/Linux:
cp .env.example .env
```

Now open the `.env` file and add your Supabase info:

```
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_BACKEND_API_URL=http://localhost:8000
```

### Step 6: Set Up Backend

Open a NEW terminal window:

```bash
# Go to the project folder
cd gta-cpr-curriculum

# Go to backend folder
cd backend

# Create a virtual environment (like a separate workspace for Python)
# On Windows:
python -m venv venv
venv\Scripts\activate

# On Mac/Linux:
python3 -m venv venv
source venv/bin/activate

# Install Python tools (this takes 2-3 minutes)
pip install -r requirements.txt

# Create environment file
# On Windows:
copy .env.example .env

# On Mac/Linux:
cp .env.example .env
```

Open the `backend/.env` file and add:

```
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your-service-role-key-here
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:5173
```

**Note:** For SUPABASE_KEY, use the **service_role** key (not anon), found in Settings → API → service_role key.

---

## ▶️ Running the Application

You need to run **TWO things** at the same time (like having two workers):

### Terminal 1 - Frontend (Website)

```bash
cd frontend
npm run dev
```

You should see:
```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
```

### Terminal 2 - Backend (Python Server)

```bash
cd backend
# Make sure virtual environment is activated (you should see (venv) in your terminal)
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
```

### Open the App!

Open your web browser and go to: **http://localhost:5173**

You should see the GTA CPR Curriculum Designer! 🎉

---

## 🎮 How to Use the App

### 1. Upload Standards & Compliance Documents (NEW! 🆕)

1. Click **"Upload Standards"** in the sidebar
2. Click the upload box or drag and drop files
3. **Select multiple files** at once:
   - CPR training standards (e.g., AHA guidelines)
   - Compliance requirements
   - Industry best practices
   - Reference materials
4. Click **"Upload X Document(s)"**
5. Watch them all upload!
6. See them on your Dashboard

### 2. Upload an RFP

1. Click **"Upload RFP"** in the sidebar
2. Fill in the form:
   - **Title:** "CPR Training Program 2024"
   - **Organization:** "WSIB"
   - **Description:** "CPR training requirements"
3. Click the upload box and select a PDF or Word file
4. Click **"Upload and Parse RFP"**
5. Wait while it reads the file (this takes 10-30 seconds)
6. You'll be taken to the Curriculum Design page

### 3. Generate Curriculum

1. On the Curriculum Design page, you'll see all the requirements from the RFP
2. Click **"Generate Curriculum"** button
3. Wait a few seconds
4. You'll see modules appear (like chapters in a book)
5. The system will use your uploaded standards to guide the curriculum!

### 4. Generate Outputs

1. Click **"Generate Outputs"** button
2. You'll see cards for different output types:
   - PowerPoint Presentation
   - Student Manual
   - Instructor Manual
   - Practice Scenarios
   - Test Questions
3. Click **"Generate"** on any card
4. Wait for it to create the file
5. Click **"Download"** when ready!

### 5. Check Compliance

1. Click **"View Compliance"**
2. See which RFP requirements are met
3. Green checkmarks ✅ = requirement is covered
4. Export a compliance report

---

## 🧪 Testing with Sample Data

Want to try it without a real RFP? Use the sample file:

1. The `data/sample_rfp.md` file contains a realistic WSIB RFP
2. Convert it to PDF or use it as reference
3. The `data/sample_standards.json` contains CPR training standards

---

## 🐛 Troubleshooting

### Problem: "npm install" fails
**Solution:** Make sure you have Node.js 18+ installed. Check with: `node --version`

### Problem: "pip install" fails
**Solution:** Make sure you have Python 3.10+ installed. Check with: `python --version`

### Problem: Frontend can't connect to backend
**Solution:** 
1. Make sure backend is running on port 8000
2. Check your `.env` files have correct URLs
3. Try restarting both servers

### Problem: "Supabase connection failed"
**Solution:**
1. Check your Supabase URL and keys in `.env` files
2. Make sure you ran the `schema.sql` in Supabase
3. Verify storage buckets exist

### Problem: File upload fails
**Solution:**
1. Check storage buckets are created in Supabase
2. Verify buckets are set to "Public"
3. Check file size (must be under 10MB)

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

## 🌟 Features Coming Soon

- 🤖 AI-powered content generation (using OpenAI)
- 👥 Multi-user collaboration
- 📧 Email notifications when outputs are ready
- 🌍 Multi-language support (English/French)
- 📱 Mobile app version
- ☁️ Cloud deployment guide

---

**Built with ❤️ for WSIB**

Happy curriculum building! 🎓✨

