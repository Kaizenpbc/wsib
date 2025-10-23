from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

from app.database import get_db
from app.db_models import Curriculum

router = APIRouter()

class ChatMessage(BaseModel):
    role: str
    content: str

class PptChatRequest(BaseModel):
    curriculum_id: str
    message: str
    conversation_history: List[ChatMessage] = []
    current_context: Dict[str, Any] = {}

class PptChatResponse(BaseModel):
    message: str
    ppt_outline: Optional[Dict[str, Any]] = None
    action: Optional[str] = None
    suggestions: List[str] = []
    current_context: Dict[str, Any] = {}

@router.post("/ppt-chat")
async def ppt_chat(request: PptChatRequest, db: Session = Depends(get_db)):
    """
    Conversational PowerPoint generator
    Understands instructions for customization
    """
    try:
        # Get curriculum
        curriculum = db.query(Curriculum).filter(Curriculum.id == request.curriculum_id).first()
        if not curriculum:
            raise HTTPException(status_code=404, detail="Curriculum not found")
        
        user_message = request.message.lower()
        context = request.current_context if request.current_context else {}
        
        # Initialize context
        if not context or 'stage' not in context:
            context = {
                'stage': 'initial',
                'theme': 'professional',
                'color_scheme': 'blue',
                'include_modules': 'all',
                'include_assessments': True,
                'include_instructor_notes': False,
                'slide_style': 'balanced'  # minimal, balanced, detailed
            }
        
        response_message = ""
        suggestions = []
        ppt_outline = None
        action = 'continue'
        
        # Stage 1: Initial - understand preferences
        if context['stage'] == 'initial':
            # Detect preferences from message
            detected_prefs = []
            
            # Color theme
            colors = {'blue': 'blue', 'red': 'red', 'green': 'green', 'purple': 'purple', 'orange': 'orange'}
            for color_word, color_val in colors.items():
                if color_word in user_message:
                    context['color_scheme'] = color_val
                    detected_prefs.append(f"✓ {color_val.title()} theme")
            
            # Style preferences
            if 'professional' in user_message or 'corporate' in user_message:
                context['theme'] = 'professional'
                detected_prefs.append("✓ Professional style")
            elif 'fun' in user_message or 'engaging' in user_message or 'colorful' in user_message:
                context['theme'] = 'engaging'
                detected_prefs.append("✓ Engaging style")
            
            # Content preferences
            if 'practice' in user_message or 'hands-on' in user_message:
                context['focus'] = 'practice'
                detected_prefs.append("✓ Focus on hands-on practice")
            if 'assessment' in user_message or 'quiz' in user_message or 'test' in user_message:
                context['include_assessments'] = True
                detected_prefs.append("✓ Include assessments")
            if 'instructor' in user_message or 'notes' in user_message or 'teaching' in user_message:
                context['include_instructor_notes'] = True
                detected_prefs.append("✓ Add instructor notes")
            
            # Check if they want all modules or specific ones
            if 'all' in user_message or 'everything' in user_message or 'complete' in user_message:
                context['include_modules'] = 'all'
                detected_prefs.append("✓ All modules included")
            
            if detected_prefs:
                # They gave specific preferences
                context['stage'] = 'confirming'
                prefs_text = "\n".join(detected_prefs)
                
                response_message = f"Great! I've noted your preferences:\n\n{prefs_text}\n\nAnything else you'd like to customize, or shall I create the outline?"
                suggestions = [
                    "That's perfect, create outline",
                    "Add more assessment slides",
                    "Make it more visual"
                ]
            else:
                # Ask for preferences
                response_message = "I can customize the presentation in many ways! Would you like to specify:\n\n• Color theme? (blue, red, green, purple)\n• Style? (professional, engaging)\n• Focus areas? (practice, theory, assessments)\n• Special features? (instructor notes, quizzes)\n\nOr just say 'use defaults' for a standard professional presentation!"
                suggestions = [
                    "Use defaults",
                    "Professional blue theme with all modules",
                    "Colorful and engaging with quizzes"
                ]
        
        elif context['stage'] == 'confirming':
            if 'create' in user_message or 'outline' in user_message or 'generate' in user_message or 'yes' in user_message or 'perfect' in user_message:
                # Create outline!
                context['stage'] = 'ready'
                action = 'generate_outline'
                
                # Build PPT outline
                ppt_outline = {
                    'theme': context['theme'],
                    'color_scheme': context['color_scheme'],
                    'total_slides': 15,  # Will be calculated
                    'sections': [
                        {'title': 'Title Slide', 'slides': 1},
                        {'title': 'Learning Objectives', 'slides': 2},
                        {'title': 'Module Content', 'slides': 8},
                        {'title': 'Practice Activities', 'slides': 2},
                        {'title': 'Assessment', 'slides': 2} if context.get('include_assessments') else None
                    ],
                    'features': {
                        'instructor_notes': context.get('include_instructor_notes', False),
                        'assessments': context.get('include_assessments', True)
                    }
                }
                
                ppt_outline['sections'] = [s for s in ppt_outline['sections'] if s]
                
                response_message = f"✨ **PowerPoint Outline Ready!**\n\n🎨 Theme: {context['theme'].title()}\n🎨 Colors: {context['color_scheme'].title()}\n📊 Total Slides: ~{ppt_outline['total_slides']}\n\n**Slide Breakdown:**\n"
                
                for section in ppt_outline['sections']:
                    response_message += f"\n• {section['title']}: {section['slides']} slides"
                
                response_message += "\n\n**Features:**"
                if context.get('include_instructor_notes'):
                    response_message += "\n• Instructor notes on each slide"
                if context.get('include_assessments'):
                    response_message += "\n• Assessment/quiz slides included"
                
                response_message += "\n\nClick 'Generate PowerPoint' button to create it!"
                suggestions = []
            else:
                # Additional customization
                context['additional_prefs'] = context.get('additional_prefs', [])
                context['additional_prefs'].append(request.message)
                
                response_message = f"Noted! I'll add: '{request.message}'\n\nAnything else?"
                suggestions = ["That's all, create it!", "Also add...", "Change the theme"]
        
        return PptChatResponse(
            message=response_message,
            ppt_outline=ppt_outline,
            action=action,
            suggestions=suggestions,
            current_context=context
        )
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

