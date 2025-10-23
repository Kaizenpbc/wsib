from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import FileResponse
from typing import List, Optional
from datetime import datetime
import os

from app.services.local_database import db
from app.services.local_storage import storage
from app.services.rfp_parser import RfpParser

router = APIRouter()

# ===== RFP ENDPOINTS =====

@router.get("/rfps")
async def get_rfps():
    """Get all RFPs"""
    rfps = db.select_all('rfps', order_by='created_at', reverse=True)
    return rfps

@router.get("/rfps/{rfp_id}")
async def get_rfp(rfp_id: str):
    """Get single RFP"""
    rfp = db.select_by_id('rfps', rfp_id)
    if not rfp:
        raise HTTPException(status_code=404, detail="RFP not found")
    return rfp

@router.post("/rfps")
async def create_rfp(
    file: UploadFile = File(...),
    title: str = "",
    organization: str = "",
    description: str = ""
):
    """Upload and parse RFP"""
    # Save file
    file_content = await file.read()
    timestamp = int(datetime.now().timestamp() * 1000)
    safe_filename = f"{timestamp}-{file.filename}"
    
    file_info = storage.save_upload(file_content, safe_filename)
    
    # Create RFP record
    rfp = db.insert('rfps', {
        'title': title or file.filename,
        'organization': organization,
        'description': description,
        'file_url': file_info['url'],
        'file_name': file.filename,
        'status': 'uploaded',
        'clauses_count': 0
    })
    
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
        for clause in result.get('clauses', []):
            db.insert('clauses', {
                'rfp_id': rfp['id'],
                'text': clause.text,
                'category': clause.category.value,
                'priority': clause.priority.value,
                'section': getattr(clause, 'section', None)
            })
        
        # Update RFP
        db.update('rfps', rfp['id'], {
            'status': 'parsed',
            'clauses_count': len(result.get('clauses', []))
        })
        
        rfp['clauses_count'] = len(result.get('clauses', []))
    
    except Exception as e:
        db.update('rfps', rfp['id'], {'status': 'error'})
        raise HTTPException(status_code=500, detail=str(e))
    
    return rfp

# ===== CLAUSES ENDPOINTS =====

@router.get("/clauses")
async def get_clauses(rfp_id: Optional[str] = None):
    """Get clauses"""
    if rfp_id:
        return db.select_where('clauses', rfp_id=rfp_id)
    return db.select_all('clauses')

# ===== STANDARDS ENDPOINTS =====

@router.get("/standards")
async def get_standards():
    """Get all standards"""
    return db.select_all('standards', order_by='created_at', reverse=True)

@router.post("/standards")
async def create_standard(
    file: UploadFile = File(...),
    name: str = "",
    category: str = "Compliance"
):
    """Upload standard document"""
    # Save file
    file_content = await file.read()
    timestamp = int(datetime.now().timestamp() * 1000)
    safe_filename = f"{timestamp}-{file.filename}"
    
    file_info = storage.save_upload(file_content, safe_filename)
    
    # Create standard record
    standard = db.insert('standards', {
        'name': name or file.filename.replace('.pdf', '').replace('.doc', ''),
        'description': f'Uploaded standard document',
        'category': category,
        'tags': ['uploaded', 'standard'],
        'requirements': [],
        'file_url': file_info['url'],
        'file_name': file.filename
    })
    
    return standard

@router.delete("/standards/{standard_id}")
async def delete_standard(standard_id: str):
    """Delete a standard"""
    success = db.delete('standards', standard_id)
    if not success:
        raise HTTPException(status_code=404, detail="Standard not found")
    return {"success": True}

# ===== CURRICULA ENDPOINTS =====

@router.get("/curricula")
async def get_curricula(rfp_id: Optional[str] = None):
    """Get curricula"""
    if rfp_id:
        return db.select_where('curricula', rfp_id=rfp_id)
    return db.select_all('curricula', order_by='created_at', reverse=True)

@router.get("/curricula/{curriculum_id}")
async def get_curriculum(curriculum_id: str):
    """Get single curriculum"""
    curriculum = db.select_by_id('curricula', curriculum_id)
    if not curriculum:
        raise HTTPException(status_code=404, detail="Curriculum not found")
    return curriculum

@router.post("/curricula")
async def create_curriculum(data: dict):
    """Create curriculum"""
    curriculum = db.insert('curricula', data)
    return curriculum

@router.patch("/curricula/{curriculum_id}")
async def update_curriculum(curriculum_id: str, data: dict):
    """Update curriculum"""
    curriculum = db.update('curricula', curriculum_id, data)
    if not curriculum:
        raise HTTPException(status_code=404, detail="Curriculum not found")
    return curriculum

# ===== OUTPUTS ENDPOINTS =====

@router.get("/outputs")
async def get_outputs(curriculum_id: Optional[str] = None):
    """Get outputs"""
    if curriculum_id:
        return db.select_where('outputs', curriculum_id=curriculum_id)
    return db.select_all('outputs', order_by='created_at', reverse=True)

@router.post("/outputs")
async def create_output(data: dict):
    """Create output"""
    output = db.insert('outputs', data)
    return output

@router.patch("/outputs/{output_id}")
async def update_output(output_id: str, data: dict):
    """Update output"""
    output = db.update('outputs', output_id, data)
    if not output:
        raise HTTPException(status_code=404, detail="Output not found")
    return output

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


