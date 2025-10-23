# 🔧 Fix Supabase Connection Error

## ❌ Current Problem:
Your app is trying to connect to `https://placeholder.supabase.co` which doesn't exist!

## ✅ Solution: Add Real Supabase Credentials

---

## 📋 **STEP-BY-STEP SETUP**

### **1️⃣ Create Supabase Account (FREE!)**

1. Go to: **https://supabase.com**
2. Click **"Start your project"**
3. Sign up (GitHub is fastest)
4. Verify email

### **2️⃣ Create New Project**

1. Click **"New Project"** button
2. Fill in:
   ```
   Name: gta-cpr-curriculum
   Database Password: [Create strong password - SAVE IT!]
   Region: East US (or closest to you)
   ```
3. Click **"Create new project"**
4. ⏰ Wait 2 minutes for setup

### **3️⃣ Get Your Credentials**

Once project is ready:

1. Click **Settings** (⚙️ icon on left)
2. Click **API** section
3. Copy these 3 things:

   **A) Project URL:**
   ```
   Example: https://abcdefgh.supabase.co
   ```

   **B) anon public key:**
   ```
   Starts with: eyJhbGc...
   (Click "Copy" button)
   ```

   **C) service_role key:**
   ```
   Click "Reveal" first, then "Copy"
   Starts with: eyJhbGc...
   ```

### **4️⃣ Update Frontend .env File**

1. Open file: `frontend\.env` in Notepad
2. Replace with YOUR values:

```
VITE_SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...YOUR-ANON-KEY-HERE
VITE_BACKEND_API_URL=http://localhost:8000
```

**Example with fake values:**
```
VITE_SUPABASE_URL=https://xyzabc123.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh5emFiYzEyMyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNjQ1MTkyNjU1LCJleHAiOjE5NjA3Njg2NTV9.abcdefghijk123456789
VITE_BACKEND_API_URL=http://localhost:8000
```

3. **Save** the file

### **5️⃣ Update Backend .env File**

1. Open file: `backend\.env` in Notepad
2. Replace with YOUR values:

```
SUPABASE_URL=https://YOUR-PROJECT-ID.supabase.co
SUPABASE_KEY=eyJhbGc...YOUR-SERVICE-ROLE-KEY-HERE
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:5173
```

**⚠️ IMPORTANT:** For backend, use **service_role** key (not anon key!)

3. **Save** the file

### **6️⃣ Set Up Database**

1. In Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **"New Query"**
3. Open your file: `supabase/schema.sql`
4. Copy ALL the contents
5. Paste into SQL Editor
6. Click **"Run"** button
7. You should see: ✅ **"Success. No rows returned"**

### **7️⃣ Create Storage Buckets**

1. In Supabase dashboard, click **Storage** (left sidebar)
2. Click **"Create a new bucket"**
3. Create first bucket:
   ```
   Name: rfp-uploads
   ☑️ Public bucket (CHECK THIS!)
   ```
4. Click **"Create bucket"**
5. Repeat for second bucket:
   ```
   Name: generated-outputs
   ☑️ Public bucket (CHECK THIS!)
   ```

### **8️⃣ Restart Your Servers**

**Kill current servers:**
1. Go to the PowerShell windows running your servers
2. Press **Ctrl + C** in each to stop them

**Start fresh:**

**PowerShell Window 1 - Backend:**
```powershell
cd C:\Users\gerog\Documents\WSIB\backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**PowerShell Window 2 - Frontend:**
```powershell
cd C:\Users\gerog\Documents\WSIB\frontend
npm run dev
```

### **9️⃣ Test It!**

1. Open browser: **http://localhost:5173**
2. Click **"Upload Standards"**
3. Try uploading a file
4. It should work now! 🎉

---

## 🎯 **Quick Checklist**

- [ ] Created Supabase account
- [ ] Created new project
- [ ] Copied Project URL
- [ ] Copied anon key
- [ ] Copied service_role key
- [ ] Updated `frontend\.env`
- [ ] Updated `backend\.env`
- [ ] Ran `schema.sql` in SQL Editor
- [ ] Created `rfp-uploads` bucket (PUBLIC)
- [ ] Created `generated-outputs` bucket (PUBLIC)
- [ ] Restarted both servers
- [ ] Tested file upload

---

## 🐛 **Still Not Working?**

### Error: "Failed to fetch"
- Check your .env files have NO quotes around values
- Make sure you saved the .env files
- Restart servers after changing .env

### Error: "Bucket not found"
- Make sure buckets are PUBLIC (checkbox when creating)
- Bucket names must be exact: `rfp-uploads` and `generated-outputs`

### Error: "Table does not exist"
- Run the `schema.sql` again
- Make sure you clicked "Run" in SQL Editor
- Check for errors in SQL Editor

---

## 📝 **Example Setup (Yours will be different!)**

```
# Frontend .env
VITE_SUPABASE_URL=https://xyzabc123.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...long-string-here
VITE_BACKEND_API_URL=http://localhost:8000

# Backend .env
SUPABASE_URL=https://xyzabc123.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...different-long-string-here
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:5173
```

---

**Once done, your app will connect to your REAL database! 🚀**


