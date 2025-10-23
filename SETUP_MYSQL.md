# 🗄️ Setup MySQL Database (No Supabase Needed!)

## Why MySQL?
- ✅ FREE forever
- ✅ Runs on your computer (no internet needed)
- ✅ Industry standard
- ✅ Much better than JSON files
- ✅ Easy to use

---

## 📦 **STEP 1: Install MySQL**

### **Option A: MySQL Installer (Recommended - Easiest)**

1. Download MySQL Installer:
   - Go to: https://dev.mysql.com/downloads/installer/
   - Click **"Download"** on "Windows (x86, 32-bit), MSI Installer" (smaller file)
   - Click **"No thanks, just start my download"**

2. Run the installer (mysql-installer-web-community-x.x.x.msi)

3. Setup Type: Choose **"Developer Default"** (click Next)

4. Check Requirements: Click **"Next"** (ignore warnings)

5. Installation: Click **"Execute"** (wait 2-3 minutes)

6. Product Configuration:
   - **MySQL Server:**
     - Type: Development Computer
     - Port: 3306 (default)
     - Click **"Next"**
   
   - **Accounts and Roles:**
     - Root Password: `root123` (or your choice - REMEMBER IT!)
     - Click **"Next"**
   
   - Click **"Execute"** to apply configuration
   
7. Click **"Finish"** when done!

### **Option B: MySQL Workbench (If you want a visual tool)**
Already included in installer above! You'll see "MySQL Workbench" in your start menu.

---

## 🗄️ **STEP 2: Create Database**

### **Method A: Using Command Line (Quick)**

1. Open **Command Prompt** (Win + R, type `cmd`, Enter)

2. Login to MySQL:
```bash
mysql -u root -p
```

3. Enter password: `root123` (or whatever you set)

4. Create database:
```sql
CREATE DATABASE gta_cpr_curriculum;
USE gta_cpr_curriculum;
```

5. You should see: `Database changed`

6. Type `exit` to leave MySQL

### **Method B: Using MySQL Workbench (Visual)**

1. Open **MySQL Workbench** from Start Menu

2. Click on "Local instance MySQL" (enter password if asked)

3. Click **"Create a new schema"** button (database icon)

4. Name: `gta_cpr_curriculum`

5. Click **"Apply"**

---

## 📋 **STEP 3: Run Database Schema**

### **Using Command Line:**

1. Open Command Prompt in your project folder:
```bash
cd C:\Users\gerog\Documents\WSIB
```

2. Login to MySQL and select database:
```bash
mysql -u root -p gta_cpr_curriculum
```

3. Run the schema file:
```sql
source supabase/mysql_schema.sql
```

### **Using MySQL Workbench:**

1. Open MySQL Workbench

2. Connect to your database

3. Click **"File" → "Open SQL Script"**

4. Select: `C:\Users\gerog\Documents\WSIB\supabase\mysql_schema.sql`

5. Click **"Execute"** (⚡ lightning bolt icon)

6. You should see green checkmarks!

---

## ⚙️ **STEP 4: Update Backend Configuration**

Edit file: **`backend\.env`**

Replace everything with:
```env
# MySQL Database
DATABASE_TYPE=mysql
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=root123
MYSQL_DATABASE=gta_cpr_curriculum

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
CORS_ORIGINS=http://localhost:5173

# Storage (local files)
STORAGE_TYPE=local
```

**Save the file!**

---

## 📦 **STEP 5: Install MySQL Python Library**

Open Command Prompt:

```bash
cd C:\Users\gerog\Documents\WSIB\backend
pip install mysql-connector-python pymysql sqlalchemy
```

---

## 🚀 **STEP 6: Restart Backend Server**

1. Stop current backend (Ctrl+C in its window)

2. Start fresh:
```bash
cd C:\Users\gerog\Documents\WSIB\backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

3. You should see: **"Application startup complete"**

---

## ✅ **STEP 7: Test It!**

1. Open browser: http://localhost:5173

2. Click "Upload RFP"

3. Upload a file

4. It should work! 🎉

---

## 🎯 **What You Get:**

✅ **No Supabase subscription needed**
✅ **Everything runs on YOUR computer**
✅ **No internet required (after setup)**
✅ **Real database (not JSON files)**
✅ **Industry standard technology**
✅ **FREE forever**

---

## 🔍 **Check Your Database:**

### **See your data in MySQL Workbench:**

1. Open MySQL Workbench
2. Connect to database
3. Click on `gta_cpr_curriculum` database
4. Click on "Tables"
5. Right-click any table → "Select Rows"
6. See all your data! 📊

### **Or use Command Line:**

```bash
mysql -u root -p gta_cpr_curriculum
```

```sql
-- See all RFPs
SELECT * FROM rfps;

-- See all standards
SELECT * FROM standards;

-- See all curricula
SELECT * FROM curricula;
```

---

## 🐛 **Troubleshooting:**

### "Can't connect to MySQL server"
- Make sure MySQL is running (check Services: Win+R → `services.msc` → find "MySQL")
- Check password is correct in `.env` file

### "Access denied for user 'root'"
- Check password in `.env` matches what you set during install
- Try: `MYSQL_PASSWORD=root` if you didn't set one

### "Unknown database 'gta_cpr_curriculum'"
- Run: `CREATE DATABASE gta_cpr_curriculum;` in MySQL

### "pip install fails"
- Make sure you're in backend folder
- Try: `python -m pip install --upgrade pip` first

---

## 💾 **Backup Your Data:**

To backup (save your work):
```bash
mysqldump -u root -p gta_cpr_curriculum > backup.sql
```

To restore (get your work back):
```bash
mysql -u root -p gta_cpr_curriculum < backup.sql
```

---

**Now you have a REAL database! No subscriptions, no cloud, all yours! 🎉**


