from sqlalchemy import Column, String, Integer, Text, ForeignKey, JSON, DateTime
from sqlalchemy.sql import func
from app.database import Base
import uuid

# Helper function to generate UUIDs
def generate_uuid():
    return str(uuid.uuid4())

class RFP(Base):
    """RFPs Table - Stores uploaded RFP documents"""
    __tablename__ = "rfps"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(255), nullable=False)
    organization = Column(String(255), nullable=False)
    description = Column(Text)
    file_url = Column(Text, nullable=False)
    file_name = Column(String(255), nullable=False)
    status = Column(String(50), default='uploaded')
    clauses_count = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class Clause(Base):
    """Clauses Table - Stores parsed clauses from RFPs"""
    __tablename__ = "clauses"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    rfp_id = Column(String(36), ForeignKey('rfps.id', ondelete='CASCADE'))
    text = Column(Text, nullable=False)
    category = Column(String(50), nullable=False)
    priority = Column(String(50), nullable=False)
    standard_match = Column(String(255))
    page_number = Column(Integer)
    section = Column(String(255))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class Standard(Base):
    """Standards Table - Stores training standards and compliance documents"""
    __tablename__ = "standards"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    category = Column(String(100), nullable=False)
    tags = Column(JSON)
    requirements = Column(JSON)
    file_url = Column(Text)
    file_name = Column(String(255))
    created_at = Column(DateTime, server_default=func.now())

class Curriculum(Base):
    """Curricula Table - Stores generated curricula"""
    __tablename__ = "curricula"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    rfp_id = Column(String(36), ForeignKey('rfps.id', ondelete='CASCADE'))
    title = Column(String(255), nullable=False)
    description = Column(Text)
    status = Column(String(50), default='draft')
    total_duration_minutes = Column(Integer)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class CurriculumModule(Base):
    """Curriculum Modules Table - Stores modules within curricula"""
    __tablename__ = "curriculum_modules"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    curriculum_id = Column(String(36), ForeignKey('curricula.id', ondelete='CASCADE'))
    title = Column(String(255), nullable=False)
    description = Column(Text)
    learning_objectives = Column(JSON)
    duration_minutes = Column(Integer, nullable=False)
    sequence_order = Column(Integer, nullable=False)
    topics = Column(JSON)
    activities = Column(JSON)
    assessment = Column(JSON)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class Output(Base):
    """Outputs Table - Stores generated output files"""
    __tablename__ = "outputs"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    curriculum_id = Column(String(36), ForeignKey('curricula.id', ondelete='CASCADE'))
    type = Column(String(50), nullable=False)
    title = Column(String(255), nullable=False)
    status = Column(String(50), default='pending')
    file_url = Column(Text)
    error_message = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class Scenario(Base):
    """Scenarios Table - Stores training scenarios"""
    __tablename__ = "scenarios"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    curriculum_id = Column(String(36), ForeignKey('curricula.id', ondelete='CASCADE'))
    title = Column(String(255), nullable=False)
    description = Column(Text)
    setup_instructions = Column(Text)
    patient_information = Column(JSON)
    expected_actions = Column(JSON)
    evaluation_criteria = Column(JSON)
    duration_minutes = Column(Integer)
    difficulty = Column(String(50))
    created_at = Column(DateTime, server_default=func.now())

class BRD(Base):
    """Business Requirements Documents Table"""
    __tablename__ = "brds"

    id = Column(String(36), primary_key=True, default=generate_uuid)
    rfp_id = Column(String(36), ForeignKey('rfps.id', ondelete='CASCADE'))
    rfp_title = Column(String(255), nullable=False)
    executive_summary = Column(Text)
    business_objectives = Column(JSON)
    functional_requirements = Column(JSON)
    non_functional_requirements = Column(JSON)
    scope = Column(Text)
    stakeholders = Column(JSON)
    success_criteria = Column(JSON)
    constraints = Column(JSON)
    assumptions = Column(JSON)
    created_at = Column(DateTime, server_default=func.now())
