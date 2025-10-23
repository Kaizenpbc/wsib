# 🎓 WSIB Curriculum Designer - Training Guide

## Training New Users

This guide helps you train others to use the WSIB Curriculum Designer system.

---

## Training Session Outline

### Session 1: Introduction (30 minutes)

**Learning Objectives:**
- Understand what the system does
- Navigate the interface
- Upload their first document

**Activities:**

**1. System Overview (10 min)**
- Show the dashboard
- Explain the left menu
- Demonstrate navigation

**2. Upload an RFP (15 min)**
- Click "Upload RFP"
- Choose a sample file
- Fill in the form
- Watch it parse
- Explain what "clauses" are

**3. Q&A (5 min)**

---

### Session 2: Using the AI Assistant (45 minutes)

**Learning Objectives:**
- Use the chat interface
- Create a simple curriculum
- Understand the conversation flow

**Activities:**

**1. Introduction to AI Assistant (10 min)**
- Click "🤖 AI Assistant"
- Show split-screen layout
- Explain: Left = Chat, Right = Results

**2. Hands-On: Create First Curriculum (25 min)**

**Trainer demonstrates:**
```
Step 1: Select RFP from dropdown
Step 2: Type: "Create an 8-hour CPR course"
Step 3: Follow AI's questions
Step 4: See curriculum appear on right
Step 5: Click "Save"
```

**Then students try** with guidance

**3. Discussion: What You Created (10 min)**
- Review the curriculum
- Explain modules
- Show learning objectives
- Discuss activities

---

### Session 3: Advanced Features (60 minutes)

**Learning Objectives:**
- Create multiple curricula from one RFP
- Generate Business Requirements Documents
- Customize PowerPoint presentations

**Activities:**

**1. Multiple Curricula (20 min)**

Show how to create 3 different courses:
- Basic level (8 hours)
- Advanced level (16 hours)
- Instructor course (24 hours)

Each from same RFP but different focus!

**2. Business Requirements (15 min)**
- Click "Business Requirements"
- Generate BRD
- Explain each section
- Show how to download

**3. PowerPoint Generation (20 min)**
- Navigate to outputs
- Use PowerPoint chat
- Customize theme and colors
- Generate presentation

**4. Q&A (5 min)**

---

## Training Materials

### Sample Scenarios

**Scenario 1: Basic User**
"Maria needs to respond to a CPR training RFP. She has never used the system before."

**Tasks:**
1. Upload the RFP document
2. Create an 8-hour basic CPR curriculum
3. Generate a BRD
4. Download PowerPoint

**Scenario 2: Complex RFP**
"John has an RFP requiring 3 different courses: basic, advanced, and instructor-level."

**Tasks:**
1. Upload RFP
2. Use AI Assistant to create course #1
3. Save it
4. Start new conversation for course #2
5. Repeat for course #3

**Scenario 3: Customization**
"Sarah wants a very specific curriculum with special requirements."

**Tasks:**
1. Use detailed chat instructions
2. Specify duration, audience, focus areas
3. Review auto-selected clauses
4. Request modifications
5. Generate custom PowerPoint

### Practice Exercises

**Exercise 1: Upload & Parse**
- Time: 10 minutes
- Upload provided sample RFP
- Verify clause count
- Check parsing status

**Exercise 2: Simple Curriculum**
- Time: 15 minutes
- Create basic 8-hour course
- Use chat interface
- Save to database

**Exercise 3: Multiple Curricula**
- Time: 25 minutes
- Create 2 different courses from same RFP
- Use different durations and audiences
- Compare results

---

## Demonstration Scripts

### Demo 1: First-Time User Flow

**Script for trainer:**

"Welcome! I'll show you how easy it is to create professional training curricula.

*[Click Dashboard]*

This is your home. You can see any RFPs you've uploaded.

*[Click Upload RFP]*

Let's upload a Request for Proposal. These are documents that tell us what training is needed.

*[Select file, fill form, upload]*

Watch as the system reads the document... See? It found 355 requirements automatically!

*[Click AI Assistant]*

Now here's where it gets interesting. This is your AI helper. Left side - you chat. Right side - your work appears.

*[Type: 'Create an 8-hour CPR course for healthcare workers']*

Just tell it what you want in plain English... The AI asks smart questions...

*[Follow conversation]*

Look at the right side - it's building your curriculum in real-time!

And when done, you have a complete professional curriculum ready to deliver."

### Demo 2: Power User Workflow

**Script:**

"For experienced users, you can give detailed instructions all at once.

*[Open AI Assistant]*

Instead of answering questions, you can say:

*[Type long instruction]*
'Create three courses from this RFP:
1. 8-hour basic CPR for general public
2. 16-hour advanced first aid for healthcare workers  
3. 24-hour instructor certification course

Start with the basic course, focus on adult and pediatric CPR, include AED training.'

*[Show AI response]*

See how it understood everything? It's creating the first course now...

This saves time when you know exactly what you need."

---

## Common Questions During Training

### Q: "What if I make a mistake?"

**A:** Just start a new conversation! Or correct the AI:
- "Actually, make it 16 hours, not 8"
- "Change the audience to paramedics"

### Q: "Can I save my chat conversation?"

**A:** The AI remembers your conversation while you're working. Once you save the curriculum, it's in the database. You can start fresh for the next project.

### Q: "How do I know if it used the right requirements?"

**A:** In the curriculum chat, you can see selected clauses in the right panel. The AI automatically selects MUST-HAVE requirements, and you can ask it to include more.

### Q: "What if the RFP asks for 5 different courses?"

**A:** No problem! Create them one at a time:
1. Chat to create course #1, save
2. Start new chat for course #2, save
3. Repeat for all 5

### Q: "Can I edit a curriculum after saving?"

**A:** Currently, you'd create a new version. Editing feature is planned for future updates.

### Q: "Where is my data?"

**A:** Everything is on your computer:
- Database: MySQL in Docker
- Files: `backend/local_storage/`
- It's safe even if you close the app!

---

## Troubleshooting During Training

### Issue: "I can't see my uploaded RFP"

**Solution:**
1. Check Dashboard
2. Look for parsing status
3. If error, re-upload
4. Check file format (PDF, DOC, DOCX, ZIP only)

### Issue: "Chat isn't responding"

**Solution:**
1. Check if backend is running
2. Refresh browser
3. Try clicking a suggestion button instead of typing
4. If still stuck, restart browser

### Issue: "Generated curriculum looks wrong"

**Solution:**
- This is normal! AI needs good instructions
- Try being more specific
- Answer AI's questions carefully
- You can create a new one anytime

---

## Assessment

### Knowledge Check

**Question 1:** What are the two main ways to create a curriculum?
- A) Click buttons and fill forms
- B) Chat naturally OR answer step-by-step questions ✓

**Question 2:** Where is your data stored?
- A) In the cloud
- B) On your computer ✓

**Question 3:** Can you create multiple curricula from one RFP?
- A) No, only one
- B) Yes, as many as needed ✓

**Question 4:** What does the AI Assistant's split screen show?
- A) Left: Chat, Right: Results ✓
- B) Left: Files, Right: Settings

**Question 5:** How do you customize a PowerPoint?
- A) Edit it after generation
- B) Chat about preferences before generation ✓

### Practical Assessment

**Task:** Create a curriculum using the AI Assistant

**Criteria for success:**
- ✓ Selects RFP correctly
- ✓ Provides clear instructions
- ✓ Follows conversation
- ✓ Reviews results
- ✓ Saves curriculum

---

## Tips for Trainers

### Do's

✅ **Start simple** - Don't overwhelm with all features
✅ **Use real examples** - Show actual RFPs they'll work with
✅ **Let them try** - Hands-on practice is key
✅ **Encourage exploration** - Chat is forgiving, mistakes are OK
✅ **Show the "why"** - Explain instructional design principles briefly

### Don'ts

❌ **Don't skip the basics** - Make sure they understand upload first
❌ **Don't go too fast** - Give time to absorb
❌ **Don't ignore questions** - Address concerns immediately
❌ **Don't make it too technical** - Focus on what they need to know
❌ **Don't forget practice time** - Theory alone doesn't work

### Training Best Practices

**1. Use the 70-20-10 Model** (Like the system itself!)
- 70% Hands-on practice
- 20% Demonstrations
- 10% Theory

**2. Follow ADDIE**
- **Analyze**: What do they need to learn?
- **Design**: Plan your session
- **Develop**: Prepare materials
- **Implement**: Deliver training
- **Evaluate**: Get feedback

**3. Adult Learning Principles**
- Make it relevant to their work
- Let them practice with real scenarios
- Provide immediate feedback

---

## Training Checklist

### Before Training

- [ ] System is running and tested
- [ ] Sample RFPs prepared
- [ ] User accounts created (if multi-user)
- [ ] Training room has projector/screen
- [ ] Internet connection verified
- [ ] Backup system ready (in case of issues)

### During Training

- [ ] Welcome and introductions
- [ ] System overview
- [ ] Hands-on exercises
- [ ] Q&A time
- [ ] Practice scenarios
- [ ] Knowledge check

### After Training

- [ ] Provide documentation
- [ ] Share login credentials
- [ ] Set up support channel
- [ ] Schedule follow-up session
- [ ] Collect feedback

---

## Follow-Up Support

### Week 1
- Daily check-ins
- Answer questions
- Help with first real projects

### Week 2-4
- Weekly check-ins
- Review work quality
- Share tips and tricks

### Ongoing
- Monthly user group meetings
- Share best practices
- Gather feature requests

---

## Training Resources

### Handouts to Provide

1. **Quick Start Guide** - One-page reference
2. **Chat Examples** - Sample conversations
3. **Keyboard Shortcuts** - Speed tips
4. **Troubleshooting** - Common fixes

### Video Tutorials (To Create)

1. "Your First RFP Upload" (5 min)
2. "Creating a Curriculum with Chat" (10 min)
3. "Generating Business Requirements" (7 min)
4. "Creating Multiple Curricula" (12 min)
5. "Customizing PowerPoint Outputs" (8 min)

---

**Trainer Certification:** Contact system administrator
**Training Materials:** Available in `docs/training/`
**Version:** 2.0.0

