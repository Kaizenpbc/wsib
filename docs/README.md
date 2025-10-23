# 📚 WSIB Curriculum Designer - Documentation Hub

Welcome to the complete documentation for the WSIB Curriculum Designer!

---

## 📖 Documentation Overview

This documentation set is designed to help everyone - from first-time users to system administrators.

### 🎯 Quick Start

**New to the system?** Start here:
1. Read the [main README](../README.md) for overview
2. Follow installation steps
3. Check out [Quick Reference](QUICK_REFERENCE.md) for a cheat sheet
4. Read [User Manual](USER_MANUAL.md) for complete guide

**Setting up the system?**
→ See [Technical Guide](TECHNICAL_GUIDE.md) and [Admin Guide](ADMIN_GUIDE.md)

**Training others?**
→ Use the [Training Guide](TRAINING_GUIDE.md)

---

## 📋 Documentation Files

### For End Users

#### 📘 [User Manual](USER_MANUAL.md)
**Who:** Curriculum designers, training managers, instructional designers

**What you'll learn:**
- How to upload RFPs and standards
- Using the AI Assistant
- Creating curricula through conversation
- Generating business requirements
- Creating customized PowerPoint presentations
- Managing multiple curricula
- Troubleshooting common issues

**Length:** ~45 minutes read

---

#### ⚡ [Quick Reference Card](QUICK_REFERENCE.md)
**Who:** Everyone!

**What you'll learn:**
- Common chat commands
- System commands
- Database queries
- Keyboard shortcuts
- Port numbers
- Quick troubleshooting

**Length:** 5 minutes (print and keep at your desk!)

---

### For Administrators

#### 👨‍💼 [Admin Guide](ADMIN_GUIDE.md)
**Who:** System administrators, IT staff

**What you'll learn:**
- System installation
- Database administration
- Backup and recovery
- Monitoring and logs
- Security configuration
- Storage management
- Updates and maintenance
- Scaling considerations

**Length:** ~60 minutes read

---

### For Developers

#### 🔧 [Technical Guide](TECHNICAL_GUIDE.md)
**Who:** Developers, technical staff

**What you'll learn:**
- System architecture
- Database schema
- API endpoints
- Backend services (Instructional Designer, BRD Extractor)
- Configuration details
- Development workflow
- Deployment strategies
- Performance optimization

**Length:** ~75 minutes read

---

### For Trainers

#### 🎓 [Training Guide](TRAINING_GUIDE.md)
**Who:** Trainers, team leads

**What you'll learn:**
- Training session outlines
- Hands-on exercises
- Demonstration scripts
- Common questions and answers
- Assessment methods
- Training best practices
- Follow-up support strategies

**Length:** ~50 minutes read

---

## 🗺️ Documentation Roadmap

### Choose Your Path:

```
┌─────────────────────────────────────────┐
│        I want to USE the system         │
└──────────────┬──────────────────────────┘
               │
               ├──> 📘 User Manual
               ├──> ⚡ Quick Reference
               └──> 🎓 Training Guide (if teaching others)


┌─────────────────────────────────────────┐
│       I want to MANAGE the system       │
└──────────────┬──────────────────────────┘
               │
               ├──> 👨‍💼 Admin Guide
               ├──> 🔧 Technical Guide
               └──> ⚡ Quick Reference


┌─────────────────────────────────────────┐
│     I want to DEVELOP/EXTEND system     │
└──────────────┬──────────────────────────┘
               │
               ├──> 🔧 Technical Guide
               ├──> 👨‍💼 Admin Guide
               └──> ../README.md (main)
```

---

## 🎯 Common Tasks

### "I want to get started quickly"
→ [Main README](../README.md) → [Quick Reference](QUICK_REFERENCE.md)

### "I need to upload my first RFP"
→ [User Manual - Uploading Documents](USER_MANUAL.md#uploading-documents)

### "I want to use the chat interface"
→ [User Manual - AI Assistant](USER_MANUAL.md#ai-assistant)

### "I need to create multiple curricula"
→ [User Manual - Creating Curricula](USER_MANUAL.md#creating-curricula)

### "I want to backup the database"
→ [Admin Guide - Backup & Recovery](ADMIN_GUIDE.md#backup--recovery)

### "I need to understand the architecture"
→ [Technical Guide - Architecture](TECHNICAL_GUIDE.md#architecture-overview)

### "I'm training my team"
→ [Training Guide](TRAINING_GUIDE.md)

### "Something is broken"
→ [Admin Guide - Troubleshooting](ADMIN_GUIDE.md#troubleshooting)

---

## 📊 Documentation Matrix

| Topic | User | Admin | Technical | Training |
|-------|------|-------|-----------|----------|
| **Getting Started** | ⭐⭐⭐ | ⭐⭐ | ⭐ | ⭐⭐⭐ |
| **AI Chat Interface** | ⭐⭐⭐ | ⭐ | ⭐⭐ | ⭐⭐⭐ |
| **Creating Curricula** | ⭐⭐⭐ | ⭐ | ⭐⭐ | ⭐⭐⭐ |
| **System Architecture** | ⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐ |
| **Database Admin** | - | ⭐⭐⭐ | ⭐⭐⭐ | - |
| **API Development** | - | ⭐ | ⭐⭐⭐ | - |
| **Backup/Recovery** | - | ⭐⭐⭐ | ⭐⭐ | - |
| **Training Others** | ⭐ | ⭐ | - | ⭐⭐⭐ |
| **Troubleshooting** | ⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |

⭐⭐⭐ = Highly relevant | ⭐⭐ = Relevant | ⭐ = Somewhat relevant | - = Not covered

---

## 🆘 Getting Help

### Step 1: Check Documentation
- Look in the appropriate guide above
- Check [Quick Reference](QUICK_REFERENCE.md) for quick answers

### Step 2: Search Issues
- Check existing issues: https://github.com/Kaizenpbc/wsib/issues
- Someone may have had the same problem!

### Step 3: Check Logs
```bash
# Backend logs
docker-compose logs backend --tail 100

# MySQL logs
docker-compose logs mysql --tail 50

# Frontend logs
Check browser console (F12)
```

### Step 4: Create an Issue
- Go to: https://github.com/Kaizenpbc/wsib/issues/new
- Provide:
  - What you were trying to do
  - What happened instead
  - Error messages (from logs)
  - Your environment (OS, Docker version)

---

## 📝 Documentation Maintenance

### Keeping Docs Updated

**For Developers:**
- Update docs when adding features
- Keep API documentation in sync
- Update version numbers

**For Administrators:**
- Document configuration changes
- Add troubleshooting solutions
- Share best practices

**For Users:**
- Report unclear sections
- Suggest improvements
- Share tips and tricks

### Contributing to Docs

1. Fork repository
2. Edit markdown files in `docs/`
3. Submit pull request
4. Label with `documentation`

---

## 📦 Document Formats

All documentation is in **Markdown** format:
- ✅ Easy to read
- ✅ Version controlled
- ✅ Works offline
- ✅ Can be converted to PDF/HTML

### Converting to PDF

**Using Pandoc:**
```bash
pandoc USER_MANUAL.md -o USER_MANUAL.pdf
```

**Using VS Code:**
Install "Markdown PDF" extension

### Viewing Locally

Any of these work:
- GitHub
- VS Code (with Markdown preview)
- Any text editor
- Browser (with Markdown extension)

---

## 📚 Additional Resources

### Official Links
- **Repository**: https://github.com/Kaizenpbc/wsib
- **Issues**: https://github.com/Kaizenpbc/wsib/issues
- **Discussions**: https://github.com/Kaizenpbc/wsib/discussions

### Technology Documentation
- **React**: https://react.dev
- **FastAPI**: https://fastapi.tiangolo.com
- **MySQL**: https://dev.mysql.com/doc
- **Docker**: https://docs.docker.com
- **SQLAlchemy**: https://docs.sqlalchemy.org

### Learning Resources
- **Instructional Design**: ADDIE model, Bloom's Taxonomy
- **Adult Learning**: Malcolm Knowles' principles
- **70-20-10 Learning**: Charles Jennings

---

## 🎓 Terminology

**RFP** - Request for Proposal: A document asking for training to be created

**Clause** - A single requirement extracted from an RFP

**Curriculum** - A complete training course with modules, objectives, activities

**BRD** - Business Requirements Document: Organized business needs

**Module** - A section of curriculum (like a chapter in a book)

**Learning Objective** - What students will be able to DO after training

**Instructional Design** - The science and art of creating effective learning

**Docker Container** - A packaged application that runs consistently anywhere

**API** - Application Programming Interface: How frontend talks to backend

---

## 📅 Version History

**v2.0.0** (October 2025)
- Complete documentation set created
- Migrated to MySQL
- Added AI conversational interfaces
- Implemented professional instructional design

**v1.0.0** (Initial)
- Basic system documentation
- Supabase integration

---

## 📞 Contact

**Documentation Issues**: Open an issue on GitHub
**Technical Support**: See [Admin Guide](ADMIN_GUIDE.md)
**Feature Requests**: Use GitHub Discussions

---

**Happy Learning! 🎓**

*This documentation is maintained by the WSIB Curriculum Designer team.*
*Last updated: October 2025*

