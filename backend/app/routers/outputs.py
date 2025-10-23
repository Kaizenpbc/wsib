from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse, JSONResponse
from app.models import GenerateOutputRequest, Scenario, TestQuestion
from app.services.generators.ppt_generator import PptGenerator
from app.services.generators.pdf_generator import PdfGenerator
from app.services.generators.scenario_generator import ScenarioGenerator
from app.services.generators.test_generator import TestGenerator
from typing import List

router = APIRouter()

@router.post("/generate-ppt")
async def generate_powerpoint(request: GenerateOutputRequest):
    """
    Generate PowerPoint presentation from curriculum
    """
    try:
        generator = PptGenerator()
        file_path = await generator.generate(request.curriculum_id)
        return {"success": True, "file_url": file_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-student-manual")
async def generate_student_manual(request: GenerateOutputRequest):
    """
    Generate student manual PDF from curriculum
    """
    try:
        generator = PdfGenerator()
        file_path = await generator.generate_student_manual(request.curriculum_id)
        return {"success": True, "file_url": file_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-instructor-manual")
async def generate_instructor_manual(request: GenerateOutputRequest):
    """
    Generate instructor manual PDF from curriculum
    """
    try:
        generator = PdfGenerator()
        file_path = await generator.generate_instructor_manual(request.curriculum_id)
        return {"success": True, "file_url": file_path}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-scenarios", response_model=List[Scenario])
async def generate_scenarios(request: GenerateOutputRequest):
    """
    Generate practice scenarios from curriculum
    """
    try:
        generator = ScenarioGenerator()
        scenarios = await generator.generate(
            request.curriculum_id,
            count=request.count or 5
        )
        return scenarios
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-test-questions", response_model=List[TestQuestion])
async def generate_test_questions(request: GenerateOutputRequest):
    """
    Generate test questions from curriculum
    """
    try:
        generator = TestGenerator()
        questions = await generator.generate(
            request.curriculum_id,
            count=request.count or 25
        )
        return questions
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

