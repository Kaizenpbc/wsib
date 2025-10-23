"""
Business Requirements Document (BRD) Extractor
Analyzes RFP and extracts business requirements in professional format
"""
from typing import List, Dict, Any

class BRDExtractor:
    """
    Extracts and structures business requirements from RFP clauses
    Creates professional BRD following industry standards
    """
    
    def extract_from_rfp(self, rfp: Any, clauses: List[Any]) -> Dict[str, Any]:
        """
        Extract business requirements from RFP and create BRD
        
        Args:
            rfp: RFP object with title, organization, description
            clauses: List of parsed clauses from RFP
            
        Returns:
            Dict with BRD structure
        """
        
        # Categorize clauses
        functional_reqs = []
        non_functional_reqs = []
        business_objectives = []
        constraints = []
        success_criteria = []
        
        for clause in clauses:
            text = clause.text if hasattr(clause, 'text') else str(clause)
            category = clause.category if hasattr(clause, 'category') else 'other'
            priority = clause.priority if hasattr(clause, 'priority') else 'may'
            
            # Categorize based on content and priority
            if priority == 'must':
                # MUST requirements are functional requirements
                if self._is_functional_requirement(text):
                    functional_reqs.append(text)
                else:
                    non_functional_reqs.append(text)
            
            # Extract business objectives from content-related clauses
            if category == 'content' and priority in ['must', 'should']:
                objective = self._extract_business_objective(text)
                if objective and objective not in business_objectives:
                    business_objectives.append(objective)
            
            # Duration and assessment clauses often indicate success criteria
            if category in ['assessment', 'duration']:
                criteria = self._extract_success_criteria(text)
                if criteria and criteria not in success_criteria:
                    success_criteria.append(criteria)
            
            # Equipment and resource clauses may be constraints
            if 'budget' in text.lower() or 'cost' in text.lower() or 'resource' in text.lower():
                constraints.append(text)
        
        # If no business objectives found, create from RFP description
        if not business_objectives:
            business_objectives = self._generate_default_objectives(rfp)
        
        # If no success criteria found, create from requirements
        if not success_criteria:
            success_criteria = self._generate_default_success_criteria(clauses)
        
        # Extract stakeholders
        stakeholders = self._identify_stakeholders(rfp, clauses)
        
        # Create executive summary
        executive_summary = self._create_executive_summary(rfp, clauses)
        
        # Define scope
        scope = self._define_scope(rfp, clauses)
        
        # Identify assumptions
        assumptions = self._identify_assumptions(rfp, clauses)
        
        return {
            'rfp_title': rfp.title if hasattr(rfp, 'title') else 'RFP',
            'executive_summary': executive_summary,
            'business_objectives': business_objectives[:10],  # Top 10
            'functional_requirements': functional_reqs[:20],  # Top 20
            'non_functional_requirements': non_functional_reqs[:15],  # Top 15
            'scope': scope,
            'stakeholders': stakeholders,
            'success_criteria': success_criteria[:10],
            'constraints': constraints[:10] if constraints else self._default_constraints(),
            'assumptions': assumptions
        }
    
    def _is_functional_requirement(self, text: str) -> bool:
        """Determine if clause is a functional requirement"""
        functional_keywords = [
            'must include', 'shall provide', 'will include', 'training must', 
            'course must', 'shall demonstrate', 'must cover', 'required to',
            'participants will', 'students must', 'shall be able to'
        ]
        
        text_lower = text.lower()
        return any(keyword in text_lower for keyword in functional_keywords)
    
    def _extract_business_objective(self, text: str) -> str:
        """Convert clause to business objective"""
        # Common patterns to business objective mapping
        if 'certification' in text.lower():
            return "Provide industry-recognized certification to participants"
        if 'comply' in text.lower() or 'compliance' in text.lower():
            return "Ensure regulatory compliance with training standards"
        if 'skill' in text.lower() or 'competenc' in text.lower():
            return "Develop practical skills and competencies in participants"
        if 'safety' in text.lower():
            return "Improve workplace safety through proper training"
        
        # Default: Clean up the clause text
        return text[:100] + "..." if len(text) > 100 else text
    
    def _extract_success_criteria(self, text: str) -> str:
        """Extract success criteria from clause"""
        if 'pass' in text.lower():
            return text
        if '%' in text or 'percent' in text.lower():
            return text
        if 'assess' in text.lower():
            return f"Successful completion of: {text[:80]}"
        return None
    
    def _generate_default_objectives(self, rfp: Any) -> List[str]:
        """Generate default business objectives based on RFP"""
        title = rfp.title if hasattr(rfp, 'title') else 'Training Program'
        org = rfp.organization if hasattr(rfp, 'organization') else 'Organization'
        
        return [
            f"Deliver high-quality training program as specified in {title}",
            f"Meet {org}'s training and certification requirements",
            "Ensure participants gain practical, job-ready skills",
            "Achieve regulatory compliance with industry standards",
            "Provide measurable learning outcomes and competency verification"
        ]
    
    def _generate_default_success_criteria(self, clauses: List[Any]) -> List[str]:
        """Generate default success criteria"""
        return [
            "80% or higher pass rate on final assessment",
            "All participants demonstrate competency in practical skills",
            "Course completion within specified timeframe",
            "Positive participant feedback (4.0+ out of 5.0)",
            "100% coverage of required curriculum topics",
            "Compliance with accreditation standards"
        ]
    
    def _identify_stakeholders(self, rfp: Any, clauses: List[Any]) -> List[str]:
        """Identify project stakeholders"""
        stakeholders = set()
        
        # Add organization
        if hasattr(rfp, 'organization'):
            stakeholders.add(rfp.organization)
        
        # Common stakeholders in training projects
        stakeholders.add("Training Participants")
        stakeholders.add("Instructors/Trainers")
        stakeholders.add("Program Administrators")
        
        # Look for specific stakeholders in clauses
        stakeholder_keywords = {
            'management': 'Management Team',
            'supervisor': 'Supervisors',
            'employee': 'Employees',
            'worker': 'Workers',
            'regulator': 'Regulatory Bodies',
            'accredit': 'Accreditation Bodies'
        }
        
        for clause in clauses:
            text = clause.text.lower() if hasattr(clause, 'text') else str(clause).lower()
            for keyword, stakeholder in stakeholder_keywords.items():
                if keyword in text:
                    stakeholders.add(stakeholder)
        
        return sorted(list(stakeholders))[:8]  # Max 8 stakeholders
    
    def _create_executive_summary(self, rfp: Any, clauses: List[Any]) -> str:
        """Create executive summary"""
        title = rfp.title if hasattr(rfp, 'title') else 'Training Program'
        org = rfp.organization if hasattr(rfp, 'organization') else 'the organization'
        num_clauses = len(clauses)
        
        must_clauses = sum(1 for c in clauses if hasattr(c, 'priority') and c.priority == 'must')
        
        return f"""This Business Requirements Document outlines the requirements extracted from {title} for {org}. 

The RFP contains {num_clauses} requirements, including {must_clauses} mandatory requirements that must be addressed. This document structures these requirements into functional and non-functional categories, identifies key stakeholders, defines success criteria, and establishes project scope.

The primary focus is on delivering a compliant, high-quality training program that meets all specified requirements while ensuring participant competency and regulatory compliance."""
    
    def _define_scope(self, rfp: Any, clauses: List[Any]) -> str:
        """Define project scope"""
        title = rfp.title if hasattr(rfp, 'title') else 'training program'
        
        # Count different types of requirements
        content_clauses = sum(1 for c in clauses if hasattr(c, 'category') and c.category == 'content')
        duration_clauses = sum(1 for c in clauses if hasattr(c, 'category') and c.category == 'duration')
        assessment_clauses = sum(1 for c in clauses if hasattr(c, 'category') and c.category == 'assessment')
        
        scope = f"""
**In Scope:**
• Development and delivery of {title}
• {content_clauses} content requirements covering curriculum topics
• {duration_clauses} timing and scheduling requirements
• {assessment_clauses} assessment and evaluation requirements
• Instructor training and materials development
• Participant certification upon successful completion
• Quality assurance and compliance verification

**Out of Scope:**
• Requirements not explicitly stated in the RFP
• Ongoing program maintenance beyond initial delivery
• Facilities and venue procurement
• Participant recruitment and registration
        """.strip()
        
        return scope
    
    def _identify_assumptions(self, rfp: Any, clauses: List[Any]) -> List[str]:
        """Identify project assumptions"""
        return [
            "All training materials will be provided in required languages",
            "Adequate facilities and equipment will be available",
            "Participants meet prerequisite requirements",
            "Instructors are properly certified and qualified",
            "Assessment tools align with industry standards",
            "Regulatory requirements remain stable during project duration",
            "Sufficient time allocated for participant practice and skill development"
        ]
    
    def _default_constraints(self) -> List[str]:
        """Default constraints if none found"""
        return [
            "Budget constraints as per RFP specifications",
            "Timeline requirements for program delivery",
            "Availability of qualified instructors",
            "Equipment and facility limitations",
            "Regulatory and compliance requirements"
        ]

# Global instance
brd_extractor = BRDExtractor()

