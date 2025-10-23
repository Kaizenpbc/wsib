from fastapi import APIRouter, HTTPException
from app.models import GenerateCurriculumRequest, GenerateCurriculumResponse
from app.services.curriculum_engine import CurriculumEngine

router = APIRouter()

@router.post("/generate", response_model=GenerateCurriculumResponse)
async def generate_curriculum(request: GenerateCurriculumRequest):
    """
    Generate curriculum from RFP clauses and standards
    """
    try:
        engine = CurriculumEngine()
        result = await engine.generate(
            request.rfp_id,
            request.clause_ids,
            request.standard_ids
        )
        
        return GenerateCurriculumResponse(
            success=True,
            curriculum_id=result['curriculum_id'],
            modules=result['modules'],
            total_duration_minutes=result['total_duration_minutes']
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

