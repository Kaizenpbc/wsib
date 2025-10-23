# 💬 Conversational Curriculum Designer - User Guide

Your app now has a **smart chat interface** for creating professional curricula!

## 🎯 What Makes It Special:

### Professional Instructional Design
- ✅ **Bloom's Taxonomy** - Learning objectives progress from basic to advanced
- ✅ **ADDIE Model** - Analysis → Design → Development → Implementation → Evaluation
- ✅ **70-20-10 Learning** - 70% hands-on practice, 20% instruction, 10% theory
- ✅ **Adult Learning Principles** - Scenario-based, practical, relevant
- ✅ **Industry Standards** - 80% passing score, proper assessments

### Smart Conversation
- ✅ **Adapts to your style** - Give detailed instructions OR answer step-by-step
- ✅ **Asks only what it needs** - If you provide duration, it won't ask again
- ✅ **Shows progress** - Selected clauses update in real-time
- ✅ **Provides suggestions** - Click quick replies to speed up

---

## 🚀 How to Use:

### Step 1: Upload Your RFP
1. Go to "Upload RFP"
2. Upload your document
3. System parses all requirements automatically

### Step 2: Start the Chat
1. Go to Dashboard
2. Click on your RFP
3. You'll see the **chat interface**

### Step 3: Talk to the AI

**Option A - Free-form (Give all details at once):**
```
You: "Create an 8-hour CPR course for healthcare workers, 
      focusing on adult and pediatric CPR with AED training"

AI: "Excellent! What should we call this curriculum?"

You: "Healthcare CPR Certification - Level 1"

AI: *Selects 145 relevant clauses*
    *Generates professional curriculum*
    "✨ Curriculum Generated! Check the preview..."
```

**Option B - Guided (Step-by-step):**
```
You: "I need help creating a curriculum"

AI: "What type of course?"

You: "CPR training"

AI: "How long should it be?"

You: "8 hours"

AI: "Who's the target audience?"

You: "Healthcare workers"

AI: *Builds curriculum*
```

**Option C - Multiple Curricula:**
```
You: "I need to create 3 different courses from this RFP"

AI: "Great! Let's start with course #1. 
     What should this first course focus on?"

You: "Basic CPR for beginners"

AI: *Guides you through course 1*
    *Then you can start over for course 2*
```

### Step 4: Review & Save
1. **Right Panel** - See selected requirements (clauses)
2. **Preview (click 'Show Preview')** - See full curriculum with:
   - All modules
   - Learning objectives
   - Activities
   - Assessments
   - Time allocations
3. **Click "Save Curriculum"** - Saves to MySQL database

### Step 5: Generate Outputs
Once saved, you can create:
- PowerPoint presentations
- Student manuals
- Instructor guides
- Practice scenarios
- Test questions

---

## 📚 What the AI Creates For You:

### Properly Structured Modules
Each module includes:
- **Clear learning objectives** (using action verbs from Bloom's)
- **Content topics** (broken into digestible chunks)
- **Engaging activities**:
  - Real-world discussions
  - Instructor demonstrations
  - Hands-on practice (largest time block!)
  - Skills assessments
- **Required materials** (manikins, AEDs, etc.)
- **Appropriate timing** (60-90 min per module for adult learners)

### Example Module Output:
```
Module 1: CPR (75 minutes)

Learning Objectives:
• Students will demonstrate proper hand placement for chest compressions
• Students will explain the importance of high-quality CPR
• Students will perform CPR skills in realistic scenarios

Activities:
1. Real-World Scenarios (8min) - Discussion
2. CPR Technique Demonstration (23min) - Instructor-led
3. CPR Skills Practice (26min) - Hands-on with manikins
4. CPR Competency Check (11min) - Individual assessment

Materials: Training manikins, barrier devices, skills checklist
```

---

## 🎓 Instructional Design Features:

### Time Allocation (Research-Based)
- 10% - Introduction & context
- 30% - Direct instruction
- **35% - Hands-on practice** (most important!)
- 15% - Assessment
- 10% - Review & wrap-up

### Learning Progression
Modules progress through Bloom's levels:
1. **Remember** - Identify, list, recall
2. **Understand** - Explain, describe
3. **Apply** - Demonstrate, perform
4. **Analyze** - Compare, examine
5. **Evaluate** - Assess, critique
6. **Create** - Design, develop

### Assessment Strategy
- **Formative** - Checkpoints during learning
- **Summative** - Final comprehensive assessment
- **Passing Score** - 80% (industry standard)
- **Skills + Written** - Both practical and theoretical

---

## 💡 Pro Tips:

### For Multiple Curricula (Your Use Case):
1. Complete chat for **Curriculum #1**
2. Click "Save"
3. **Go back to RFP** (click back arrow)
4. **Click RFP again** to start fresh chat
5. Create **Curriculum #2** with different focus
6. Repeat for **Curriculum #3**

Each curriculum is independent!

### Give Better Instructions:
✅ **Good**: "8-hour basic CPR for general public, include AED"
❌ **Vague**: "Make a course"

✅ **Good**: "16-hour advanced first aid for workplace safety teams"
❌ **Vague**: "Training thing"

### Speed It Up:
- Use **suggestion buttons** instead of typing
- Give **all details upfront** (skips questions)
- Type **"yes"** to proceed quickly

---

## 🔍 What Gets Saved to MySQL:

When you click "Save Curriculum":

```sql
-- In curricula table:
- id
- rfp_id (linked to your RFP)
- title
- description
- status ('completed')
- total_duration_minutes
- created_at, updated_at

-- Modules are stored as JSON
-- Can be expanded to separate table if needed
```

---

## 🎉 Result:

You get **professionally designed curricula** that:
- Meet all RFP requirements
- Follow instructional design best practices
- Are ready for classroom delivery
- Can generate outputs (PPT, manuals, etc.)
- Are backed by SQL database

**No more manual curriculum design - just chat about what you need!** 🚀

