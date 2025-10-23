from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
import os
from datetime import datetime

from app.database import get_db
from app.db_models import RFP, Clause, BRD
from app.services.brd_extractor import brd_extractor

router = APIRouter()

class GenerateBRDRequest(BaseModel):
    rfp_id: str

@router.get("/brd")
async def get_all_brds(db: Session = Depends(get_db)):
    """Get all BRDs"""
    brds = db.query(BRD).order_by(BRD.created_at.desc()).all()
    return [brd_to_dict(brd) for brd in brds]

@router.get("/brd/{brd_id}")
async def get_brd(brd_id: str, db: Session = Depends(get_db)):
    """Get single BRD"""
    brd = db.query(BRD).filter(BRD.id == brd_id).first()
    if not brd:
        raise HTTPException(status_code=404, detail="BRD not found")
    return brd_to_dict(brd)

@router.post("/brd/generate")
async def generate_brd(request: GenerateBRDRequest, db: Session = Depends(get_db)):
    """
    Generate BRD from RFP
    Extracts business requirements, objectives, scope, etc.
    """
    try:
        # Get RFP and clauses
        rfp = db.query(RFP).filter(RFP.id == request.rfp_id).first()
        if not rfp:
            raise HTTPException(status_code=404, detail="RFP not found")
        
        clauses = db.query(Clause).filter(Clause.rfp_id == request.rfp_id).all()
        
        if not clauses:
            raise HTTPException(status_code=400, detail="No clauses found. Please parse the RFP first.")
        
        # Check if BRD already exists
        existing_brd = db.query(BRD).filter(BRD.rfp_id == request.rfp_id).first()
        if existing_brd:
            # Update existing
            brd_data = brd_extractor.extract_from_rfp(rfp, clauses)
            
            existing_brd.executive_summary = brd_data['executive_summary']
            existing_brd.business_objectives = brd_data['business_objectives']
            existing_brd.functional_requirements = brd_data['functional_requirements']
            existing_brd.non_functional_requirements = brd_data['non_functional_requirements']
            existing_brd.scope = brd_data['scope']
            existing_brd.stakeholders = brd_data['stakeholders']
            existing_brd.success_criteria = brd_data['success_criteria']
            existing_brd.constraints = brd_data['constraints']
            existing_brd.assumptions = brd_data['assumptions']
            
            db.commit()
            db.refresh(existing_brd)
            
            return brd_to_dict(existing_brd)
        
        # Extract business requirements using BRD extractor
        brd_data = brd_extractor.extract_from_rfp(rfp, clauses)
        
        # Create BRD record
        brd = BRD(
            rfp_id=request.rfp_id,
            rfp_title=rfp.title,
            executive_summary=brd_data['executive_summary'],
            business_objectives=brd_data['business_objectives'],
            functional_requirements=brd_data['functional_requirements'],
            non_functional_requirements=brd_data['non_functional_requirements'],
            scope=brd_data['scope'],
            stakeholders=brd_data['stakeholders'],
            success_criteria=brd_data['success_criteria'],
            constraints=brd_data['constraints'],
            assumptions=brd_data['assumptions']
        )
        
        db.add(brd)
        db.commit()
        db.refresh(brd)
        
        return brd_to_dict(brd)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/brd/{brd_id}/download")
async def download_brd(brd_id: str, db: Session = Depends(get_db)):
    """
    Download BRD as PDF
    """
    brd = db.query(BRD).filter(BRD.id == brd_id).first()
    if not brd:
        raise HTTPException(status_code=404, detail="BRD not found")
    
    # TODO: Generate PDF from BRD data
    # For now, return JSON
    return brd_to_dict(brd)

def brd_to_dict(brd: BRD) -> dict:
    """Convert BRD model to dictionary"""
    return {
        'id': brd.id,
        'rfp_id': brd.rfp_id,
        'rfp_title': brd.rfp_title,
        'executive_summary': brd.executive_summary,
        'business_objectives': brd.business_objectives,
        'functional_requirements': brd.functional_requirements,
        'non_functional_requirements': brd.non_functional_requirements,
        'scope': brd.scope,
        'stakeholders': brd.stakeholders,
        'success_criteria': brd.success_criteria,
        'constraints': brd.constraints,
        'assumptions': brd.assumptions,
        'created_at': brd.created_at.isoformat() if brd.created_at else None
    }

