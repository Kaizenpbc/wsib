from fastapi import APIRouter, HTTPException
from app.models import ParseRfpRequest, ParseRfpResponse
from app.services.rfp_parser import RfpParser

router = APIRouter()

@router.post("/parse", response_model=ParseRfpResponse)
async def parse_rfp(request: ParseRfpRequest):
    """
    Parse an RFP document and extract clauses
    """
    try:
        parser = RfpParser()
        result = await parser.parse_document(request.file_url, request.file_name)
        
        return ParseRfpResponse(
            success=True,
            clauses=result['clauses'],
            total_pages=result.get('total_pages')
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

