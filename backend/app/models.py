from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from enum import Enum

class ClauseCategory(str, Enum):
    DURATION = "duration"
    CONTENT = "content"
    ASSESSMENT = "assessment"
    EQUIPMENT = "equipment"
    OTHER = "other"

class Priority(str, Enum):
    MUST = "must"
    SHOULD = "should"
    MAY = "may"

class Clause(BaseModel):
    text: str
    category: ClauseCategory
    priority: Priority
    page_number: Optional[int] = None
    section: Optional[str] = None

class ParseRfpRequest(BaseModel):
    file_url: str
    file_name: str

class ParseRfpResponse(BaseModel):
    success: bool
    clauses: List[Clause]
    total_pages: Optional[int] = None
    error: Optional[str] = None

class Topic(BaseModel):
    title: str
    content: str
    duration_minutes: int

class Activity(BaseModel):
    type: str
    title: str
    description: str
    duration_minutes: int
    materials_needed: Optional[List[str]] = None

class Assessment(BaseModel):
    type: str
    title: str
    passing_score: int

class CurriculumModule(BaseModel):
    title: str
    description: str
    learning_objectives: List[str]
    duration_minutes: int
    sequence_order: int
    topics: List[Topic]
    activities: List[Activity]
    assessment: Optional[Assessment] = None

class GenerateCurriculumRequest(BaseModel):
    rfp_id: str
    clause_ids: List[str]
    standard_ids: List[str]

class GenerateCurriculumResponse(BaseModel):
    success: bool
    curriculum_id: str
    modules: List[CurriculumModule]
    total_duration_minutes: int
    error: Optional[str] = None

class GenerateOutputRequest(BaseModel):
    curriculum_id: str
    count: Optional[int] = None

class Scenario(BaseModel):
    title: str
    description: str
    setup_instructions: str
    patient_information: Dict[str, Any]
    expected_actions: List[str]
    evaluation_criteria: List[Dict[str, Any]]
    duration_minutes: int
    difficulty: str

class TestQuestion(BaseModel):
    question: str
    type: str
    options: Optional[List[str]] = None
    correct_answer: str
    points: int
    learning_objective: str

