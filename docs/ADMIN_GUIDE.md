# 👨‍💼 WSIB Curriculum Designer - Administrator Guide

## System Administration

This guide is for administrators who manage and maintain the WSIB Curriculum Designer system.

---

## Installation & Setup

### Prerequisites

- Windows 10 or later
- Docker Desktop installed
- 8GB RAM minimum
- 10GB free disk space

### Initial Setup

**1. Install Docker Desktop**
- Download from: https://www.docker.com/products/docker-desktop
- Install and restart computer
- Verify: `docker --version`

**2. Clone Repository**
```bash
git clone https://github.com/Kaizenpbc/wsib.git
cd wsib
```

**3. Configure Environment**

Create `backend/.env`:
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

**4. Start Services**
```bash
docker-compose up -d
```

**5. Install Frontend Dependencies**
```bash
cd frontend
npm install
```

**6. Start Frontend**
```bash
npm run dev
```

**7. Verify Installation**
- Backend: `curl http://localhost:8000/health`
- Frontend: Open `http://localhost:5173`
- Database: `docker-compose exec mysql mysql -uroot -proot123 -e "SHOW DATABASES;"`

---

## User Management

### Current Status
- Single-user system (local development)
- No authentication required
- All users have full access

### Future Multi-User Setup
When adding authentication:
1. Add user table to database
2. Implement JWT authentication
3. Add role-based access control
4. Update frontend with login page

---

## Database Administration

### Accessing MySQL

**Command Line:**
```bash
docker-compose exec mysql mysql -uroot -proot123 gta_cpr_curriculum
```

**MySQL Workbench:**
- Host: `localhost`
- Port: `13306`
- Username: `root`
- Password: `root123`
- Database: `gta_cpr_curriculum`

### Common Queries

**View all RFPs:**
```sql
SELECT id, title, organization, status, clauses_count, created_at 
FROM rfps 
ORDER BY created_at DESC;
```

**View curricula:**
```sql
SELECT id, title, status, total_duration_minutes, created_at 
FROM curricula 
ORDER BY created_at DESC;
```

**View standards:**
```sql
SELECT id, name, category, created_at 
FROM standards;
```

**Check database size:**
```sql
SELECT 
    table_name AS 'Table',
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.TABLES
WHERE table_schema = 'gta_cpr_curriculum'
ORDER BY (data_length + index_length) DESC;
```

### Database Maintenance

**Optimize tables:**
```sql
OPTIMIZE TABLE rfps, clauses, standards, curricula;
```

**Clean up old data:**
```sql
-- Delete RFPs older than 1 year
DELETE FROM rfps WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 YEAR);
```

**Reset database:**
```bash
docker-compose down -v
docker-compose up -d
```
⚠️ **Warning:** This deletes ALL data!

---

## Backup & Recovery

### Automated Backup Script

Create `backup.bat`:
```batch
@echo off
set BACKUP_DIR=backups\%date:~-4,4%%date:~-10,2%%date:~-7,2%
mkdir %BACKUP_DIR%

REM Backup database
docker-compose exec -T mysql mysqldump -uroot -proot123 gta_cpr_curriculum > %BACKUP_DIR%\database.sql

REM Backup files
xcopy backend\local_storage %BACKUP_DIR%\files /E /I /Y

echo Backup completed to %BACKUP_DIR%
```

**Schedule with Task Scheduler:**
- Run daily at 2 AM
- Keep last 7 backups

### Manual Backup

**Database:**
```bash
docker-compose exec mysql mysqldump -uroot -proot123 gta_cpr_curriculum > backup_20251023.sql
```

**Files:**
```bash
cp -r backend/local_storage backup/storage_20251023
```

### Restore from Backup

**Database:**
```bash
docker-compose exec -T mysql mysql -uroot -proot123 gta_cpr_curriculum < backup_20251023.sql
```

**Files:**
```bash
cp -r backup/storage_20251023/* backend/local_storage/
```

---

## Monitoring

### Health Checks

**Backend Health:**
```bash
curl http://localhost:8000/health
# Should return: {"status":"healthy"}
```

**Database Health:**
```bash
docker-compose exec mysql mysqladmin ping -uroot -proot123
# Should return: mysqld is alive
```

**Container Status:**
```bash
docker-compose ps
# Both should show "Up" status
```

### Logs

**View all logs:**
```bash
docker-compose logs -f
```

**Backend only:**
```bash
docker-compose logs -f backend
```

**MySQL only:**
```bash
docker-compose logs -f mysql
```

**Save logs to file:**
```bash
docker-compose logs > system_logs_20251023.txt
```

### Performance Monitoring

**Database connections:**
```sql
SHOW PROCESSLIST;
```

**Table statistics:**
```sql
SELECT table_name, table_rows 
FROM information_schema.tables 
WHERE table_schema = 'gta_cpr_curriculum';
```

**Container resource usage:**
```bash
docker stats
```

---

## Storage Management

### Disk Space

**Check usage:**
```bash
docker-compose exec backend du -sh /app/local_storage/*
```

**Database size:**
```bash
docker-compose exec mysql mysql -uroot -proot123 -e "
SELECT 
    SUM(data_length + index_length) / 1024 / 1024 AS 'Total Size (MB)'
FROM information_schema.TABLES 
WHERE table_schema = 'gta_cpr_curriculum';
"
```

### Cleanup

**Old uploaded files:**
```bash
docker-compose exec backend find /app/local_storage/rfp-uploads -mtime +90 -delete
```

**Orphaned files:**
- Check file_url in database
- Delete files not referenced

**Docker volumes:**
```bash
docker volume ls
docker volume prune
```

---

## Security Administration

### Password Management

**Change MySQL root password:**

1. Stop containers:
```bash
docker-compose down
```

2. Update `docker-compose.yml`:
```yaml
MYSQL_ROOT_PASSWORD: new_password
```

3. Update `backend/.env`:
```env
MYSQL_PASSWORD=new_password
```

4. Restart:
```bash
docker-compose up -d
```

### File Permissions

**Uploaded files:**
```bash
docker-compose exec backend chmod 644 /app/local_storage/rfp-uploads/*
```

**Application files:**
```bash
docker-compose exec backend chmod 755 /app
```

### Network Security

**Firewall rules:**
- Port 8000: Backend API (localhost only)
- Port 13306: MySQL (localhost only)
- Port 5173: Frontend dev server (localhost only)

**For production:**
- Use reverse proxy (nginx)
- Enable HTTPS
- Restrict CORS origins

---

## Updates & Maintenance

### Updating the System

**1. Pull latest code:**
```bash
git pull origin main
```

**2. Rebuild containers:**
```bash
docker-compose down
docker-compose up --build -d
```

**3. Update frontend dependencies:**
```bash
cd frontend
npm install
```

### Database Migrations

Currently: Automatic with SQLAlchemy

**Manual migration:**
1. Add/modify model in `db_models.py`
2. Restart backend
3. Tables auto-update

**For complex migrations:**
- Consider Alembic (migration tool)
- Backup before migrating

### System Upgrades

**Docker images:**
```bash
docker-compose pull
docker-compose up -d
```

**Python packages:**
```bash
docker-compose exec backend pip install --upgrade -r requirements.txt
docker-compose restart backend
```

---

## Troubleshooting

### Common Issues

**1. Port Already in Use**

**Problem:** "Bind for 0.0.0.0:13306 failed: port is already allocated"

**Solution:**
```bash
# Find what's using the port
netstat -ano | findstr :13306

# Change port in docker-compose.yml
ports:
  - "13307:3306"
```

**2. Cannot Connect to Database**

**Problem:** "Access denied for user 'root'"

**Solution:**
- Check password in `.env` matches `docker-compose.yml`
- Ensure MySQL container is running: `docker-compose ps`
- Check MySQL logs: `docker-compose logs mysql`

**3. Frontend Can't Reach Backend**

**Problem:** "Network Error" in browser console

**Solution:**
- Ensure backend is running: `curl http://localhost:8000/health`
- Check CORS settings in `backend/app/config.py`
- Verify API_URL in frontend

**4. Out of Disk Space**

**Solution:**
```bash
# Clean Docker
docker system prune -a

# Clean old files
docker-compose exec backend find /app/local_storage -mtime +30 -delete
```

### Emergency Recovery

**System completely broken:**
```bash
# Nuclear option - start fresh
docker-compose down -v
docker system prune -a
git pull origin main
docker-compose up --build
```

---

## Scaling

### Current Capacity

- **RFPs**: Hundreds
- **Clauses**: Tens of thousands
- **Curricula**: Unlimited
- **Concurrent users**: 1 (local system)

### Scaling Up

**For multiple users:**
1. Deploy to server (not local)
2. Add authentication
3. Increase MySQL resources
4. Add load balancing

**Database scaling:**
```yaml
# docker-compose.yml
mysql:
  ...
  command: --max_connections=200 --innodb_buffer_pool_size=1G
```

---

## Best Practices

### Regular Maintenance

- ✅ **Daily**: Check logs for errors
- ✅ **Weekly**: Backup database
- ✅ **Monthly**: Clean old files, optimize database
- ✅ **Quarterly**: Update dependencies

### Data Management

- Keep RFPs organized by project
- Tag standards appropriately
- Archive old curricula
- Document customizations

### Monitoring

- Set up alerts for disk space
- Monitor container health
- Track API response times
- Log error rates

---

## Support & Escalation

### Getting Help

**1. Check Documentation**
- USER_MANUAL.md
- TECHNICAL_GUIDE.md (this file)
- README_DOCKER.md

**2. Check Logs**
```bash
docker-compose logs backend --tail 100
```

**3. GitHub Issues**
https://github.com/Kaizenpbc/wsib/issues

**4. Database Issues**
- Check MySQL docs
- Verify schema matches models

---

**Administrator Contact:** System Administrator
**Last Updated:** October 2025
**Version:** 2.0.0

