# 📘 WSIB Curriculum Designer - User Manual

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Dashboard Overview](#dashboard-overview)
4. [Uploading Documents](#uploading-documents)
5. [AI Assistant](#ai-assistant)
6. [Creating Curricula](#creating-curricula)
7. [Business Requirements Documents](#business-requirements-documents)
8. [Generating Outputs](#generating-outputs)
9. [FAQ](#faq)

---

## Introduction

### What is the WSIB Curriculum Designer?

The WSIB Curriculum Designer is a smart tool that helps you create professional training curricula from Request for Proposals (RFPs). Think of it as your intelligent assistant that:

- **Reads RFP documents** - Automatically understands what the RFP is asking for
- **Creates professional curricula** - Designs courses using teaching best practices
- **Generates documents** - Makes PowerPoints, manuals, tests, and more
- **Saves everything** - All your work is safely stored on your computer

### Who is this for?

- Curriculum designers creating training programs
- Training managers responding to RFPs
- Instructional designers building courses
- Anyone who needs to turn RFP requirements into actual training curricula

### Key Benefits

✅ **No subscriptions** - Everything runs on your computer, free forever
✅ **AI-powered** - Chat naturally to create curricula
✅ **Professional quality** - Uses Bloom's Taxonomy, ADDIE model, and more
✅ **Time-saving** - What takes hours manually, takes minutes with chat
✅ **Multiple curricula** - Create as many different courses as you need from one RFP

---

## Getting Started

### System Requirements

- **Windows 10 or later**
- **Docker Desktop** - For running the database
- **Web browser** - Chrome, Edge, or Firefox
- **Internet** - Only for initial setup

### Starting the System

**Step 1: Start Docker Services**

Open PowerShell or Command Prompt:
```bash
cd C:\Users\gerog\Documents\WSIB
docker-compose up
```

Wait until you see: "Application startup complete"

**Step 2: Start the Interface (New Terminal)**

```bash
cd frontend
npm run dev
```

Wait until you see: "Local: http://localhost:5173"

**Step 3: Open Your Browser**

Go to: `http://localhost:5173`

You'll see the WSIB Curriculum Designer homepage!

### Stopping the System

**Stop Frontend:** Press `Ctrl+C` in the frontend terminal

**Stop Docker:** Press `Ctrl+C` in the Docker terminal, or run:
```bash
docker-compose down
```

---

## Dashboard Overview

When you open the app, you see the **Dashboard** - your home base.

### What You See:

**Left Sidebar (Navigation Menu):**
- 🏠 **Dashboard** - Overview of everything
- 🤖 **AI Assistant** - Your smart chat workspace (⭐ Main feature!)
- 📄 **Upload RFP** - Upload RFP documents
- 🛡️ **Upload Standards** - Upload training standards
- ✅ **Business Requirements** - Generate BRDs
- 📚 **Curriculum Design** - (Access via RFP click)
- 📊 **Generate Outputs** - (Access via curriculum)

**Main Area:**
- **Recent RFPs** - Documents you've uploaded
- **Standards Library** - Compliance documents
- **Quick actions** - Upload new files

---

## Uploading Documents

### Uploading an RFP

Think of an RFP as the "recipe book" that tells you what training to create.

**Step 1: Click "Upload RFP"** in the left menu

**Step 2: Choose your file**
- Click the upload area or drag-and-drop
- Supported formats: PDF, DOC, DOCX, ZIP

**Step 3: Fill in details**
- **Title**: Name your RFP (e.g., "CPR Training RFP 2024")
- **Organization**: Who sent it (e.g., "WSIB")
- **Description**: Brief note (optional)

**Step 4: Click "Upload and Parse RFP"**

The system will:
1. Upload your file ✅
2. Read it and find all requirements (called "clauses") ✅
3. Save everything to the database ✅

You'll see progress messages like:
- "Uploading file to server..."
- "Parsing RFP document..."
- "✓ Parsed 355 clauses"

**What happens behind the scenes:**
- Your file is saved safely
- The system reads every requirement
- Each requirement is categorized (content, duration, assessment, etc.)
- All stored in your MySQL database

### Uploading Standards

Standards are like the "rules" you must follow (e.g., AHA CPR guidelines).

**Step 1: Click "Upload Standards"**

**Step 2: Select files**
- You can upload multiple files at once!
- Or upload a ZIP file with many documents

**Step 3: Click Upload**

Each standard is saved and can be referenced when creating curricula.

**💡 Tip:** Upload all your compliance documents at once using a ZIP file!

---

## AI Assistant

### Your Smart Workspace

The **AI Assistant** is where the magic happens! It's a split-screen interface where you can chat naturally to create everything you need.

**How to Access:**
Click **"🤖 AI Assistant"** in the left menu (it's highlighted!)

### Layout Explained

**Left Side: Chat (Always Visible)**
- Talk to the AI here
- Give instructions
- Answer questions
- See suggestions to click

**Right Side: Your Work (Updates in Real-Time)**
- See curricula as they're built
- View BRDs as they're extracted
- Watch PowerPoint outlines appear
- Everything updates while you chat!

### How to Use

**Step 1: Select an RFP**
- Use the dropdown at the top of the chat
- Choose which RFP you want to work with

**Step 2: Start Chatting**

You can say things like:
- "Create a curriculum for this RFP"
- "I need 3 different courses from this document"
- "Generate a business requirements document"
- "Make a PowerPoint presentation"

**Step 3: Follow the Conversation**
- The AI will ask clarifying questions
- Click suggestion buttons for quick answers
- Or type your own responses

**Step 4: Save Your Work**
- Once something is created, you'll see it on the right
- Click "Save" buttons to store it in the database

### What the AI Can Create

✅ **Curricula** - Professional training courses
✅ **BRDs** - Business Requirements Documents
✅ **PowerPoints** - Customized presentations
✅ **More coming** - Manuals, scenarios, tests

---

## Creating Curricula

### Using the AI Chat

**Example Conversation:**

```
You: "I need to create an 8-hour CPR course for healthcare workers"

AI: "Excellent! What should we call this curriculum?"

You: "Healthcare CPR Certification - Basic Level"

AI: "Perfect! I've selected 145 MUST-HAVE requirements from the RFP.
     Ready to generate?"
     
You: "Yes"

AI: "✨ Curriculum Generated!
     - 6 modules
     - 8 hours total
     - Includes hands-on practice, assessments
     - Professional instructional design applied"
```

### What Gets Created

Your curriculum includes:

**Modules** - Organized chunks of content (e.g., Module 1: Introduction, Module 2: CPR Techniques)

Each module has:
- **Learning Objectives** - What students will be able to DO (using Bloom's Taxonomy)
- **Content Topics** - What you'll teach
- **Activities** - How you'll teach it:
  - Discussions (10%)
  - Demonstrations (30%)
  - Hands-on Practice (35% - most important!)
  - Assessments (15%)
  - Review (10%)
- **Duration** - Time for each part
- **Materials** - What you need (manikins, AEDs, etc.)

**Professional Design Principles Applied:**
- **Bloom's Taxonomy** - Learning progresses from basic (remember) to advanced (create)
- **ADDIE Model** - Industry-standard design process
- **70-20-10 Learning** - 70% practice, 20% instruction, 10% theory
- **Adult Learning** - Practical, scenario-based, relevant

### Creating Multiple Curricula from One RFP

If your RFP asks for 3 different courses:

**For Course 1:**
1. Chat: "Create 8-hour basic CPR for general public"
2. Follow conversation
3. Save curriculum

**For Course 2:**
1. Stay in AI Assistant (or come back)
2. Chat: "Now create 16-hour advanced first aid for healthcare workers"
3. AI starts fresh conversation
4. Save this curriculum too

**For Course 3:**
1. Chat: "Create 24-hour instructor certification course"
2. Save

All 3 are linked to the same RFP but are completely different curricula!

---

## Business Requirements Documents

### What is a BRD?

A Business Requirements Document extracts the "business needs" from your RFP. It organizes all requirements into a professional format that stakeholders can understand.

### How to Generate

**Method 1: From AI Assistant**
```
You: "Generate a business requirements document"
AI: Creates BRD and shows it on the right panel
```

**Method 2: From BRD Page**
1. Click "Business Requirements" in menu
2. Find your RFP
3. Click "Generate BRD"

### What's in the BRD

- **Executive Summary** - High-level overview
- **Business Objectives** - What the organization wants to achieve
- **Functional Requirements** - What the system/training MUST do (labeled FR-1, FR-2, etc.)
- **Non-Functional Requirements** - Quality attributes (NFR-1, NFR-2, etc.)
- **Project Scope** - What's included and excluded
- **Stakeholders** - Who's involved
- **Success Criteria** - How to measure success
- **Constraints** - Limitations (budget, time, etc.)
- **Assumptions** - What we're assuming is true

### Downloading BRD

Click the "Download PDF" button to get a professional document you can share with stakeholders.

---

## Generating Outputs

Once you have a curriculum saved, you can generate various outputs from it.

### Available Outputs

**1. PowerPoint Presentation**
- Teaching slides
- Content from your curriculum
- Customizable through chat!

**How to create:**
- Chat: "Make a PowerPoint with blue theme and instructor notes"
- AI asks preferences
- Generates customized PPT

**2. Student Manual**
- Workbook for students
- Exercises and learning materials
- Based on curriculum modules

**3. Instructor Manual**
- Teaching guide
- Answer keys
- Tips for instructors

**4. Practice Scenarios**
- Realistic situations for practice
- Patient information
- Expected actions
- Evaluation criteria

**5. Test Questions**
- Assessment questions
- Multiple choice, practical skills
- Answer key included

### How to Generate

**Step 1:** Make sure you have a saved curriculum

**Step 2:** Go to "Generate Outputs" (or use AI Assistant)

**Step 3:** Select what you want to create

**Step 4:** For PowerPoint, chat about customization. For others, just click "Generate"

**Step 5:** Download when ready!

---

## FAQ

### Q: Where is my data stored?

**A:** Everything is stored on YOUR computer:
- **Database**: MySQL running in Docker (a container on your PC)
- **Files**: `backend/local_storage/` folder
- **No cloud** - Nothing leaves your computer!

### Q: What if I close the app?

**A:** Your data is safe! When you restart:
```bash
docker-compose up
cd frontend && npm run dev
```
Everything you created is still there!

### Q: Can I create multiple curricula from one RFP?

**A:** Yes! That's exactly what it's designed for. Just start a new chat conversation for each curriculum.

### Q: How do I delete something?

**A:** Currently managed through the database. Future versions will have delete buttons in the UI.

### Q: What if the AI doesn't understand me?

**A:** Try:
- Being more specific: "8-hour CPR course" instead of "make a course"
- Using the suggestion buttons
- Answering the AI's questions step-by-step

### Q: Can I edit a curriculum after creating it?

**A:** Currently you create new ones. Editing feature coming soon!

### Q: Is this secure?

**A:** Yes! Everything runs on your computer. No data sent to the cloud. Your MySQL database is local.

### Q: What formats can I upload?

**A:** 
- **RFPs**: PDF, DOC, DOCX, ZIP
- **Standards**: PDF, DOC, DOCX, ZIP
- **Max size**: 50MB per file

### Q: How accurate is the AI?

**A:** The AI uses professional instructional design principles (Bloom's, ADDIE, etc.) and extracts requirements directly from your RFP. Always review and adjust as needed!

### Q: Can I use this offline?

**A:** After initial setup, yes! Everything runs locally. You only need internet for the first-time Docker image downloads.

---

## Quick Reference

### Common Commands

**Start System:**
```bash
docker-compose up
cd frontend && npm run dev
```

**Stop System:**
```bash
Ctrl+C (in both terminals)
docker-compose down
```

**Check Database:**
```bash
docker-compose exec mysql mysql -uroot -proot123 gta_cpr_curriculum
```

### Chat Examples

**Create Curriculum:**
- "8-hour basic CPR for healthcare workers"
- "I need 3 different courses"
- "Advanced first aid, 16 hours, paramedics"

**Generate BRD:**
- "Create business requirements"
- "Generate BRD"

**Make PowerPoint:**
- "Professional blue theme with all modules"
- "Colorful presentation with quizzes"

---

## Getting Help

**Documentation Files:**
- `USER_MANUAL.md` - This document
- `TECHNICAL_GUIDE.md` - For developers
- `ADMIN_GUIDE.md` - System administration
- `TRAINING_GUIDE.md` - How to train others

**Check Logs:**
```bash
docker-compose logs backend
docker-compose logs mysql
```

**Restart Services:**
```bash
docker-compose restart backend
```

---

**Version:** 2.0.0  
**Last Updated:** October 2025  
**Support:** https://github.com/Kaizenpbc/wsib

