from typing import Dict, List
from app.models import CurriculumModule, Topic, Activity, Assessment

class CurriculumEngine:
    """
    Service to generate curriculum from RFP clauses and standards
    """
    
    async def generate(
        self,
        rfp_id: str,
        clause_ids: List[str],
        standard_ids: List[str]
    ) -> Dict:
        """
        Generate curriculum modules from clauses and standards
        """
        # For now, create sample curriculum
        # In production, this would analyze clauses and standards to generate real content
        
        modules = [
            self._create_introduction_module(),
            self._create_cpr_basics_module(),
            self._create_hands_on_practice_module(),
            self._create_assessment_module()
        ]
        
        total_duration = sum(module.duration_minutes for module in modules)
        
        return {
            'curriculum_id': rfp_id,
            'modules': modules,
            'total_duration_minutes': total_duration
        }
    
    def _create_introduction_module(self) -> CurriculumModule:
        return CurriculumModule(
            title="Introduction to CPR",
            description="Overview of CPR, its importance, and course objectives",
            learning_objectives=[
                "Understand the importance of CPR in emergency situations",
                "Identify when CPR is needed",
                "Recognize the signs of cardiac arrest"
            ],
            duration_minutes=60,
            sequence_order=1,
            topics=[
                Topic(
                    title="What is CPR?",
                    content="Cardiopulmonary resuscitation (CPR) is a lifesaving technique...",
                    duration_minutes=20
                ),
                Topic(
                    title="The Chain of Survival",
                    content="Understanding the critical steps in emergency response...",
                    duration_minutes=20
                ),
                Topic(
                    title="Legal and Ethical Considerations",
                    content="Good Samaritan laws and duty to act...",
                    duration_minutes=20
                )
            ],
            activities=[
                Activity(
                    type="lecture",
                    title="CPR Overview Presentation",
                    description="Instructor-led presentation on CPR fundamentals",
                    duration_minutes=30
                ),
                Activity(
                    type="discussion",
                    title="Emergency Scenarios Discussion",
                    description="Group discussion of various emergency scenarios",
                    duration_minutes=30
                )
            ]
        )
    
    def _create_cpr_basics_module(self) -> CurriculumModule:
        return CurriculumModule(
            title="CPR Techniques",
            description="Step-by-step CPR techniques for adults, children, and infants",
            learning_objectives=[
                "Demonstrate proper hand placement for chest compressions",
                "Perform chest compressions at correct rate and depth",
                "Deliver rescue breaths effectively"
            ],
            duration_minutes=120,
            sequence_order=2,
            topics=[
                Topic(
                    title="Adult CPR",
                    content="Techniques for performing CPR on adults...",
                    duration_minutes=40
                ),
                Topic(
                    title="Child CPR",
                    content="Modified techniques for children...",
                    duration_minutes=40
                ),
                Topic(
                    title="Infant CPR",
                    content="Special considerations for infants...",
                    duration_minutes=40
                )
            ],
            activities=[
                Activity(
                    type="hands-on",
                    title="Adult CPR Practice",
                    description="Practice chest compressions and rescue breaths on manikins",
                    duration_minutes=60,
                    materials_needed=["Adult CPR manikins", "Face shields", "Gloves"]
                ),
                Activity(
                    type="video",
                    title="CPR Demonstration Video",
                    description="Watch professional demonstration of proper technique",
                    duration_minutes=15
                )
            ]
        )
    
    def _create_hands_on_practice_module(self) -> CurriculumModule:
        return CurriculumModule(
            title="Hands-On Practice and Scenarios",
            description="Realistic scenario practice with feedback",
            learning_objectives=[
                "Apply CPR skills in realistic scenarios",
                "Work effectively in emergency situations",
                "Make appropriate decisions under pressure"
            ],
            duration_minutes=180,
            sequence_order=3,
            topics=[
                Topic(
                    title="Scenario-Based Training",
                    content="Practice with realistic emergency scenarios...",
                    duration_minutes=120
                ),
                Topic(
                    title="Team CPR",
                    content="Coordinating with others during CPR...",
                    duration_minutes=60
                )
            ],
            activities=[
                Activity(
                    type="scenario",
                    title="Cardiac Arrest Scenarios",
                    description="Students respond to various cardiac arrest scenarios",
                    duration_minutes=120,
                    materials_needed=["Manikins", "AED trainers", "Scenario cards"]
                )
            ]
        )
    
    def _create_assessment_module(self) -> CurriculumModule:
        return CurriculumModule(
            title="Skills Assessment and Certification",
            description="Practical skills test and written exam",
            learning_objectives=[
                "Demonstrate competency in CPR skills",
                "Pass written knowledge assessment"
            ],
            duration_minutes=60,
            sequence_order=4,
            topics=[
                Topic(
                    title="Skills Test",
                    content="Practical demonstration of CPR skills...",
                    duration_minutes=30
                ),
                Topic(
                    title="Written Exam",
                    content="Knowledge assessment covering all course content...",
                    duration_minutes=30
                )
            ],
            activities=[
                Activity(
                    type="assessment",
                    title="Practical Skills Test",
                    description="Students perform CPR on manikins while being evaluated",
                    duration_minutes=30
                ),
                Activity(
                    type="assessment",
                    title="Written Knowledge Test",
                    description="25-question multiple choice exam",
                    duration_minutes=30
                )
            ],
            assessment=Assessment(
                type="practical",
                title="CPR Skills Assessment",
                passing_score=80
            )
        )

