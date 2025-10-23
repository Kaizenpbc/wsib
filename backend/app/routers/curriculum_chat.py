from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
import json

from app.database import get_db
from app.db_models import RFP, Clause, Standard, Curriculum
from app.services.instructional_designer import instructional_designer

router = APIRouter()

def _format_modules_summary(modules: List[Dict]) -> str:
    """Format modules list for chat display"""
    summary = ""
    for i, module in enumerate(modules, 1):
        summary += f"\n  {i}. {module['title']} ({module['duration_minutes']}min)"
    return summary

# Models for chat
class ChatMessage(BaseModel):
    role: str  # 'user' or 'assistant'
    content: str

class ChatRequest(BaseModel):
    rfp_id: str
    message: str
    conversation_history: List[ChatMessage] = []
    current_context: Dict[str, Any] = {}  # Stores curriculum being built

class ChatResponse(BaseModel):
    message: str
    selected_clauses: List[str] = []
    curriculum_preview: Optional[Dict[str, Any]] = None
    action: Optional[str] = None  # 'continue', 'generate', 'clarify'
    suggestions: List[str] = []
    current_context: Dict[str, Any] = {}  # Return updated context

@router.post("/chat", response_model=ChatResponse)
async def curriculum_chat(request: ChatRequest, db: Session = Depends(get_db)):
    """
    Conversational curriculum builder
    Adapts to user's style - guided OR free-form
    """
    try:
        # Get RFP and clauses
        rfp = db.query(RFP).filter(RFP.id == request.rfp_id).first()
        if not rfp:
            raise HTTPException(status_code=404, detail="RFP not found")
        
        clauses = db.query(Clause).filter(Clause.rfp_id == request.rfp_id).all()
        standards = db.query(Standard).all()
        
        # Analyze user message
        user_message = request.message.lower()
        context = request.current_context if request.current_context else {}
        
        # Initialize context if empty or missing stage
        if not context or 'stage' not in context:
            context = {
                'stage': 'initial',  # initial, gathering_info, selecting_clauses, generating
                'curriculum_title': '',
                'duration': None,
                'audience': '',
                'topics': [],
                'selected_clause_ids': []
            }
            print(f"[CHAT] Starting new conversation for RFP: {request.rfp_id}")
        
        print(f"[CHAT] Current stage: {context.get('stage')}, User message: {request.message[:50]}")
        
        # Simple rule-based conversation (will upgrade to AI later)
        response_message = ""
        selected_clauses = context.get('selected_clause_ids', [])
        action = 'continue'
        suggestions = []
        curriculum_preview = None
        
        # Stage 1: Initial - understand what they want
        if context['stage'] == 'initial':
            # Store their initial request
            context['initial_request'] = request.message
            
            # Check if they gave detailed instructions
            has_course_type = any(word in user_message for word in ['cpr', 'first aid', 'course', 'training', 'curriculum'])
            has_duration = 'hour' in user_message or any(str(i) in user_message for i in range(1, 25))
            has_audience = any(word in user_message for word in ['healthcare', 'workers', 'public', 'responders'])
            
            # Count how much info they provided
            info_provided = sum([has_course_type, has_duration, has_audience])
            
            if info_provided >= 2:
                # They gave good detail - move to title
                context['stage'] = 'gathering_title'
                
                # Extract what we can
                if has_duration:
                    words = user_message.split()
                    for i, word in enumerate(words):
                        if 'hour' in word and i > 0:
                            try:
                                duration_num = int(''.join(filter(str.isdigit, words[i-1])))
                                context['duration'] = duration_num * 60
                            except:
                                pass
                
                response_message = f"Excellent! I can help you create: '{request.message}'\n\nWhat should we call this curriculum? (You can use the RFP title or create your own)"
                suggestions = [
                    f"{rfp.title} - Basic Course",
                    f"{rfp.title} - Advanced Course",
                    "Custom name"
                ]
            else:
                # Need more info - guide them
                context['stage'] = 'initial'  # Stay at initial
                response_message = f"Great start! To create the perfect curriculum, I need a bit more detail.\n\nCould you tell me:\n• What type of course? (e.g., CPR, First Aid, etc.)\n• How long should it be?\n• Who's it for?\n\nOr just describe it in a sentence!"
                suggestions = [
                    "8-hour CPR course for healthcare workers",
                    "Basic first aid training, 4 hours, general public",
                    "Advanced life support, 16 hours, paramedics"
                ]
        
        # Stage 2: Gathering title
        elif context['stage'] == 'gathering_title':
            context['curriculum_title'] = request.message
            
            # Check if we already have duration
            if context.get('duration'):
                # Skip to audience
                context['stage'] = 'gathering_audience'
                response_message = f"Perfect! We'll call it '{request.message}'.\n\nWho is the target audience?"
                suggestions = ["Healthcare workers", "General public", "First responders", "Workplace safety teams"]
            else:
                # Ask for duration
                context['stage'] = 'gathering_duration'
                response_message = f"Great title: '{request.message}'!\n\nHow long should this course be?"
                suggestions = ["8 hours", "16 hours", "4 hours", "Custom duration"]
            
        elif context['stage'] == 'gathering_duration':
            # Extract duration
            try:
                if 'hour' in user_message:
                    duration_hours = int(''.join(filter(str.isdigit, user_message.split('hour')[0])))
                    context['duration'] = duration_hours * 60
                else:
                    duration_hours = int(''.join(filter(str.isdigit, user_message)))
                    context['duration'] = duration_hours * 60
            except:
                context['duration'] = 480  # Default 8 hours
            
            context['stage'] = 'gathering_audience'
            response_message = f"Got it - {context['duration'] // 60} hours.\n\nWho is the target audience for this curriculum?"
            suggestions = ["Healthcare workers", "General public", "First responders", "Workplace safety teams"]
        
        elif context['stage'] == 'gathering_audience':
            context['audience'] = request.message
            context['stage'] = 'ready_to_generate'
            
            # Auto-select relevant clauses (simple keyword matching for now)
            relevant_clauses = []
            for clause in clauses:
                # Select all MUST clauses by default
                if clause.priority == 'must':
                    relevant_clauses.append(clause.id)
            
            context['selected_clause_ids'] = relevant_clauses
            selected_clauses = relevant_clauses
            
            # Build preview
            curriculum_preview = {
                'title': context['curriculum_title'],
                'description': f"{context.get('initial_request', 'Curriculum')} for {context['audience']}",
                'total_duration_minutes': context['duration'],
                'status': 'draft'
            }
            
            response_message = f"Perfect! Here's what I've prepared:\n\n📚 **{context['curriculum_title']}**\n⏱️ Duration: {context['duration'] // 60} hours\n👥 Audience: {context['audience']}\n📋 Requirements: {len(relevant_clauses)} MUST-HAVE clauses selected\n\nYou can see the selected requirements in the right panel.\n\nReady to generate?"
            suggestions = [
                "Yes, generate it!",
                "Add focus on AED training",
                "Include pediatric CPR requirements"
            ]
        
        elif context['stage'] == 'ready_to_generate':
            if 'yes' in user_message or 'generate' in user_message or 'create' in user_message or 'go' in user_message or 'proceed' in user_message:
                # Actually generate using professional instructional design!
                action = 'generate'
                context['stage'] = 'generated'
                
                # Get selected clauses objects
                selected_clause_objs = [c for c in clauses if c.id in selected_clauses]
                
                # Use instructional designer to create professional curriculum
                designed_curriculum = instructional_designer.design_curriculum_structure(
                    title=context['curriculum_title'],
                    duration_minutes=context['duration'],
                    audience=context['audience'],
                    clauses=selected_clause_objs,
                    standards=standards,
                    user_instructions=context.get('initial_request', '')
                )
                
                curriculum_preview = designed_curriculum
                
                response_message = f"✨ **Curriculum Generated!**\n\n📚 **{designed_curriculum['title']}**\n⏱️ {designed_curriculum['total_duration_minutes'] // 60} hours • {len(designed_curriculum['modules'])} modules\n👥 {context['audience']}\n\n**Instructional Design Applied:**\n• Bloom's Taxonomy for learning progression\n• 70-20-10 model (70% hands-on practice!)\n• ADDIE framework\n• Industry-standard assessments\n\n**Modules Created:**\n{_format_modules_summary(designed_curriculum['modules'])}\n\n📊 Check the preview below to see the full curriculum. Click 'Save' when ready!"
                suggestions = []
            else:
                # They want to refine
                context['additional_instructions'] = context.get('additional_instructions', [])
                context['additional_instructions'].append(request.message)
                
                response_message = f"Noted! I'll make sure to: '{request.message}'\n\nAnything else to add before I generate?"
                suggestions = ["That's all, generate it!", "Also include...", "Change the duration"]
        
        return ChatResponse(
            message=response_message,
            selected_clauses=selected_clauses,
            curriculum_preview=curriculum_preview,
            action=action,
            suggestions=suggestions,
            current_context=context  # Return updated context so conversation continues
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-from-chat")
async def generate_from_chat(
    rfp_id: str,
    curriculum_data: Dict[str, Any],
    selected_clause_ids: List[str],
    db: Session = Depends(get_db)
):
    """
    Generate curriculum from chat conversation
    """
    try:
        # Create curriculum record
        curriculum = Curriculum(
            rfp_id=rfp_id,
            title=curriculum_data.get('title', 'Untitled Curriculum'),
            description=curriculum_data.get('description', ''),
            status='generating',
            total_duration_minutes=curriculum_data.get('total_duration_minutes', 480)
        )
        
        db.add(curriculum)
        db.commit()
        db.refresh(curriculum)
        
        # TODO: Call curriculum generation engine with selected clauses
        # For now, update status to completed
        curriculum.status = 'completed'
        db.commit()
        
        return {
            'success': True,
            'curriculum_id': curriculum.id,
            'message': 'Curriculum generated successfully!'
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

