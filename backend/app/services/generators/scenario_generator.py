from typing import List
from app.models import Scenario

class ScenarioGenerator:
    """
    Service to generate practice scenarios from curriculum
    """
    
    SCENARIO_TEMPLATES = [
        {
            "title": "Shopping Mall Cardiac Arrest",
            "location": "shopping mall",
            "age_range": (45, 65),
            "condition": "sudden cardiac arrest"
        },
        {
            "title": "Workplace Emergency",
            "location": "office building",
            "age_range": (30, 60),
            "condition": "cardiac arrest"
        },
        {
            "title": "Home Emergency",
            "location": "residential home",
            "age_range": (50, 75),
            "condition": "unresponsive adult"
        },
        {
            "title": "Gym Emergency",
            "location": "fitness center",
            "age_range": (25, 50),
            "condition": "collapsed during exercise"
        },
        {
            "title": "Restaurant Emergency",
            "location": "restaurant",
            "age_range": (40, 70),
            "condition": "choking leading to cardiac arrest"
        }
    ]
    
    async def generate(self, curriculum_id: str, count: int = 5) -> List[Scenario]:
        """
        Generate practice scenarios
        """
        scenarios = []
        
        for i, template in enumerate(self.SCENARIO_TEMPLATES[:count]):
            scenario = Scenario(
                title=template["title"],
                description=f"Simulated emergency at a {template['location']}",
                setup_instructions=self._generate_setup_instructions(template),
                patient_information={
                    "age": (template["age_range"][0] + template["age_range"][1]) // 2,
                    "gender": "male" if i % 2 == 0 else "female",
                    "condition": template["condition"],
                    "symptoms": [
                        "Unresponsive",
                        "Not breathing normally",
                        "No pulse detected"
                    ]
                },
                expected_actions=[
                    "Check scene safety",
                    "Check responsiveness",
                    "Call 911 or direct someone to call",
                    "Position patient on firm, flat surface",
                    "Begin chest compressions",
                    "Deliver rescue breaths if trained",
                    "Continue CPR until help arrives or AED is available"
                ],
                evaluation_criteria=[
                    {"criterion": "Scene safety assessment", "points": 5},
                    {"criterion": "Check responsiveness", "points": 5},
                    {"criterion": "Activate emergency response", "points": 10},
                    {"criterion": "Proper hand placement", "points": 15},
                    {"criterion": "Adequate compression depth", "points": 20},
                    {"criterion": "Correct compression rate", "points": 20},
                    {"criterion": "Minimal interruptions", "points": 15},
                    {"criterion": "Proper rescue breaths (if applicable)", "points": 10}
                ],
                duration_minutes=10,
                difficulty="intermediate"
            )
            scenarios.append(scenario)
        
        return scenarios
    
    def _generate_setup_instructions(self, template: dict) -> str:
        """
        Generate setup instructions for scenario
        """
        return f"""
Scenario Setup:
1. Place manikin in {template['location']} setting
2. Have AED trainer nearby but not immediately visible
3. Designate observers to play bystanders
4. Prepare evaluation checklist
5. Brief student on scenario context without giving away specific condition

Starting Position:
- Student enters the scene
- Manikin is on the floor/ground, unresponsive
- Bystanders appear concerned but uncertain what to do

Scenario Flow:
- Allow student to assess situation
- Respond to student's directions (calling 911, getting AED, etc.)
- Monitor performance using evaluation criteria
- Provide feedback after scenario completion
        """.strip()

