from fastapi import APIRouter, UploadFile, File, HTTPException, Depends, Form
from fastapi.responses import FileResponse
from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
import os

from app.database import get_db
from app.db_models import RFP, Clause, Standard, Curriculum, Output
from app.services.local_storage import storage
from app.services.rfp_parser import RfpParser

router = APIRouter()

# ===== RFP ENDPOINTS =====

@router.get("/rfps")
async def get_rfps(db: Session = Depends(get_db)):
    """Get all RFPs"""
    rfps = db.query(RFP).order_by(RFP.created_at.desc()).all()
    return [rfp_to_dict(rfp) for rfp in rfps]

@router.get("/rfps/{rfp_id}")
async def get_rfp(rfp_id: str, db: Session = Depends(get_db)):
    """Get single RFP"""
    rfp = db.query(RFP).filter(RFP.id == rfp_id).first()
    if not rfp:
        raise HTTPException(status_code=404, detail="RFP not found")
    return rfp_to_dict(rfp)

@router.post("/rfps")
async def create_rfp(
    file: UploadFile = File(...),
    title: str = Form(""),
    organization: str = Form(""),
    description: str = Form(""),
    db: Session = Depends(get_db)
):
    """Upload and parse RFP"""
    # Save file
    file_content = await file.read()
    timestamp = int(datetime.now().timestamp() * 1000)
    safe_filename = f"{timestamp}-{file.filename}"
    
    file_info = storage.save_upload(file_content, safe_filename)
    
    # Create RFP record
    rfp = RFP(
        title=title or file.filename,
        organization=organization,
        description=description,
        file_url=file_info['url'],
        file_name=file.filename,
        status='uploaded',
        clauses_count=0
    )
    
    db.add(rfp)
    db.commit()
    db.refresh(rfp)
    
    # Parse the file
    try:
        parser = RfpParser()
        # Use local file path instead of URL
        local_path = storage.get_file_path(file_info['url'])
        
        # For local parsing, we'll read the file directly
        with open(local_path, 'rb') as f:
            from io import BytesIO
            file_io = BytesIO(f.read())
        
        if file.filename.lower().endswith('.pdf'):
            result = await parser._parse_pdf(file_io)
        elif file.filename.lower().endswith(('.doc', '.docx')):
            result = await parser._parse_word(file_io)
        elif file.filename.lower().endswith('.zip'):
            result = await parser._parse_zip(file_io, file.filename)
        else:
            result = {'clauses': []}
        
        # Save clauses
        clause_count = 0
        for clause in result.get('clauses', []):
            db_clause = Clause(
                rfp_id=rfp.id,
                text=clause.text,
                category=clause.category.value,
                priority=clause.priority.value,
                section=getattr(clause, 'section', None)
            )
            db.add(db_clause)
            clause_count += 1
        
        # Update RFP
        rfp.status = 'parsed'
        rfp.clauses_count = clause_count
        db.commit()
        db.refresh(rfp)
    
    except Exception as e:
        rfp.status = 'error'
        db.commit()
        raise HTTPException(status_code=500, detail=str(e))
    
    return rfp_to_dict(rfp)

@router.patch("/rfps/{rfp_id}")
async def update_rfp(rfp_id: str, updates: dict, db: Session = Depends(get_db)):
    """Update RFP"""
    rfp = db.query(RFP).filter(RFP.id == rfp_id).first()
    if not rfp:
        raise HTTPException(status_code=404, detail="RFP not found")
    
    for key, value in updates.items():
        if hasattr(rfp, key):
            setattr(rfp, key, value)
    
    db.commit()
    db.refresh(rfp)
    return rfp_to_dict(rfp)

# ===== CLAUSES ENDPOINTS =====

@router.get("/clauses")
async def get_clauses(rfp_id: Optional[str] = None, db: Session = Depends(get_db)):
    """Get clauses"""
    query = db.query(Clause)
    if rfp_id:
        query = query.filter(Clause.rfp_id == rfp_id)
    clauses = query.all()
    return [clause_to_dict(clause) for clause in clauses]

# ===== STANDARDS ENDPOINTS =====

@router.get("/standards")
async def get_standards(db: Session = Depends(get_db)):
    """Get all standards"""
    standards = db.query(Standard).order_by(Standard.created_at.desc()).all()
    return [standard_to_dict(standard) for standard in standards]

@router.post("/standards")
async def create_standard(
    file: UploadFile = File(...),
    name: str = Form(""),
    category: str = Form("Compliance"),
    db: Session = Depends(get_db)
):
    """Upload standard document"""
    # Save file
    file_content = await file.read()
    timestamp = int(datetime.now().timestamp() * 1000)
    safe_filename = f"{timestamp}-{file.filename}"
    
    file_info = storage.save_upload(file_content, safe_filename)
    
    # Create standard record
    standard = Standard(
        name=name or file.filename.replace('.pdf', '').replace('.doc', ''),
        description='Uploaded standard document',
        category=category,
        tags=['uploaded', 'standard'],
        requirements=[],
        file_url=file_info['url'],
        file_name=file.filename
    )
    
    db.add(standard)
    db.commit()
    db.refresh(standard)
    
    return standard_to_dict(standard)

@router.delete("/standards/{standard_id}")
async def delete_standard(standard_id: str, db: Session = Depends(get_db)):
    """Delete a standard"""
    standard = db.query(Standard).filter(Standard.id == standard_id).first()
    if not standard:
        raise HTTPException(status_code=404, detail="Standard not found")
    
    db.delete(standard)
    db.commit()
    return {"success": True}

# ===== CURRICULA ENDPOINTS =====

@router.get("/curricula")
async def get_curricula(rfp_id: Optional[str] = None, db: Session = Depends(get_db)):
    """Get curricula"""
    query = db.query(Curriculum)
    if rfp_id:
        query = query.filter(Curriculum.rfp_id == rfp_id)
    curricula = query.order_by(Curriculum.created_at.desc()).all()
    return [curriculum_to_dict(curriculum) for curriculum in curricula]

@router.get("/curricula/{curriculum_id}")
async def get_curriculum(curriculum_id: str, db: Session = Depends(get_db)):
    """Get single curriculum"""
    curriculum = db.query(Curriculum).filter(Curriculum.id == curriculum_id).first()
    if not curriculum:
        raise HTTPException(status_code=404, detail="Curriculum not found")
    return curriculum_to_dict(curriculum)

@router.post("/curricula")
async def create_curriculum(data: dict, db: Session = Depends(get_db)):
    """Create curriculum"""
    curriculum = Curriculum(**data)
    db.add(curriculum)
    db.commit()
    db.refresh(curriculum)
    return curriculum_to_dict(curriculum)

@router.patch("/curricula/{curriculum_id}")
async def update_curriculum(curriculum_id: str, data: dict, db: Session = Depends(get_db)):
    """Update curriculum"""
    curriculum = db.query(Curriculum).filter(Curriculum.id == curriculum_id).first()
    if not curriculum:
        raise HTTPException(status_code=404, detail="Curriculum not found")
    
    for key, value in data.items():
        if hasattr(curriculum, key):
            setattr(curriculum, key, value)
    
    db.commit()
    db.refresh(curriculum)
    return curriculum_to_dict(curriculum)

# ===== OUTPUTS ENDPOINTS =====

@router.get("/outputs")
async def get_outputs(curriculum_id: Optional[str] = None, db: Session = Depends(get_db)):
    """Get outputs"""
    query = db.query(Output)
    if curriculum_id:
        query = query.filter(Output.curriculum_id == curriculum_id)
    outputs = query.order_by(Output.created_at.desc()).all()
    return [output_to_dict(output) for output in outputs]

@router.post("/outputs")
async def create_output(data: dict, db: Session = Depends(get_db)):
    """Create output"""
    output = Output(**data)
    db.add(output)
    db.commit()
    db.refresh(output)
    return output_to_dict(output)

@router.patch("/outputs/{output_id}")
async def update_output(output_id: str, data: dict, db: Session = Depends(get_db)):
    """Update output"""
    output = db.query(Output).filter(Output.id == output_id).first()
    if not output:
        raise HTTPException(status_code=404, detail="Output not found")
    
    for key, value in data.items():
        if hasattr(output, key):
            setattr(output, key, value)
    
    db.commit()
    db.refresh(output)
    return output_to_dict(output)

# ===== FILE SERVING =====

@router.get("/files/uploads/{filename}")
async def get_upload_file(filename: str):
    """Serve uploaded file"""
    filepath = os.path.join(storage.uploads_dir, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(filepath)

@router.get("/files/outputs/{output_type}/{filename}")
async def get_output_file(output_type: str, filename: str):
    """Serve generated output file"""
    filepath = os.path.join(storage.outputs_dir, output_type, filename)
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(filepath)

# ===== HELPER FUNCTIONS =====

def rfp_to_dict(rfp: RFP) -> dict:
    """Convert RFP model to dictionary"""
    return {
        'id': rfp.id,
        'title': rfp.title,
        'organization': rfp.organization,
        'description': rfp.description,
        'file_url': rfp.file_url,
        'file_name': rfp.file_name,
        'status': rfp.status,
        'clauses_count': rfp.clauses_count,
        'created_at': rfp.created_at.isoformat() if rfp.created_at else None,
        'updated_at': rfp.updated_at.isoformat() if rfp.updated_at else None,
    }

def clause_to_dict(clause: Clause) -> dict:
    """Convert Clause model to dictionary"""
    return {
        'id': clause.id,
        'rfp_id': clause.rfp_id,
        'text': clause.text,
        'category': clause.category,
        'priority': clause.priority,
        'standard_match': clause.standard_match,
        'page_number': clause.page_number,
        'section': clause.section,
        'created_at': clause.created_at.isoformat() if clause.created_at else None,
        'updated_at': clause.updated_at.isoformat() if clause.updated_at else None,
    }

def standard_to_dict(standard: Standard) -> dict:
    """Convert Standard model to dictionary"""
    return {
        'id': standard.id,
        'name': standard.name,
        'description': standard.description,
        'category': standard.category,
        'tags': standard.tags,
        'requirements': standard.requirements,
        'file_url': standard.file_url,
        'file_name': standard.file_name,
        'created_at': standard.created_at.isoformat() if standard.created_at else None,
    }

def curriculum_to_dict(curriculum: Curriculum) -> dict:
    """Convert Curriculum model to dictionary"""
    return {
        'id': curriculum.id,
        'rfp_id': curriculum.rfp_id,
        'title': curriculum.title,
        'description': curriculum.description,
        'status': curriculum.status,
        'total_duration_minutes': curriculum.total_duration_minutes,
        'created_at': curriculum.created_at.isoformat() if curriculum.created_at else None,
        'updated_at': curriculum.updated_at.isoformat() if curriculum.updated_at else None,
    }

def output_to_dict(output: Output) -> dict:
    """Convert Output model to dictionary"""
    return {
        'id': output.id,
        'curriculum_id': output.curriculum_id,
        'type': output.type,
        'title': output.title,
        'status': output.status,
        'file_url': output.file_url,
        'error_message': output.error_message,
        'created_at': output.created_at.isoformat() if output.created_at else None,
        'updated_at': output.updated_at.isoformat() if output.updated_at else None,
    }
