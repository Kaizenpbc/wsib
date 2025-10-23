# 🐳 Docker Setup - One Command to Rule Them All!

Your app now runs completely in Docker! No MySQL installation needed, no configuration headaches!

## 🚀 Quick Start

### Start Everything:
```bash
docker-compose up
```

That's it! This command:
- ✅ Starts MySQL database in a container
- ✅ Creates all database tables automatically
- ✅ Starts your backend API
- ✅ Connects everything together
- ✅ Makes them talk to each other

### Start in Background (Detached Mode):
```bash
docker-compose up -d
```

### Stop Everything:
```bash
docker-compose down
```

### Stop and Remove Data:
```bash
docker-compose down -v
```
⚠️ **Warning**: This deletes all your database data!

---

## 📊 Check If It's Working

### View Logs:
```bash
# All services
docker-compose logs -f

# Just backend
docker-compose logs -f backend

# Just MySQL
docker-compose logs -f mysql
```

### Test the API:
```bash
curl http://localhost:8000/health
```

You should see: `{"status":"healthy"}`

---

## 🎯 How to Use Your App

### 1. Start Docker Services:
```bash
docker-compose up -d
```

### 2. Start Frontend (in another terminal):
```bash
cd frontend
npm run dev
```

### 3. Open Your Browser:
```
http://localhost:5173
```

Now you can upload RFPs, create curricula, and everything works! 🎉

---

## 🔍 Access MySQL Database

### Option 1: Using Docker:
```bash
docker-compose exec mysql mysql -uroot -proot123 gta_cpr_curriculum
```

Then run SQL commands:
```sql
SHOW TABLES;
SELECT * FROM rfps;
SELECT * FROM standards;
```

### Option 2: Using MySQL Workbench:
- Host: `localhost`
- Port: `3306`
- Username: `root`
- Password: `root123`
- Database: `gta_cpr_curriculum`

---

## 🛠️ Development Commands

### Rebuild Backend After Code Changes:
```bash
docker-compose up --build backend
```

### Restart Just One Service:
```bash
docker-compose restart backend
```

### View Running Containers:
```bash
docker-compose ps
```

### Execute Command in Container:
```bash
docker-compose exec backend bash
```

---

## 📁 Where Is Everything?

- **Backend Code**: `backend/app/` (live reload enabled!)
- **Uploaded Files**: `backend/local_storage/rfp-uploads/`
- **Generated Files**: `backend/local_storage/generated-outputs/`
- **MySQL Data**: Stored in Docker volume `mysql_data`

---

## 🐛 Troubleshooting

### "Port already in use":
Another service is using port 3306 or 8000. Stop it or change ports in `docker-compose.yml`.

### Backend can't connect to MySQL:
Wait a few seconds - MySQL takes time to start. The backend waits automatically.

### Want to reset everything:
```bash
docker-compose down -v
docker-compose up --build
```

### Check backend logs for errors:
```bash
docker-compose logs backend
```

---

## 🎉 What You Get:

✅ **No Manual MySQL Installation** - Docker handles it  
✅ **One Command Startup** - `docker-compose up`  
✅ **Isolated Environment** - Won't conflict with other apps  
✅ **Easy to Share** - Anyone can run your app  
✅ **Automatic Database Setup** - Tables created on startup  
✅ **Data Persistence** - Your data survives container restarts  
✅ **Development Friendly** - Code changes reload automatically  

---

## 📝 Pro Tips:

1. **Always start with** `docker-compose up` to see logs
2. **Once working, use** `docker-compose up -d` to run in background
3. **Keep frontend separate** - it's faster to develop without Docker
4. **Backup your data** before running `docker-compose down -v`

---

**Your app is now fully Dockerized! 🐳**

