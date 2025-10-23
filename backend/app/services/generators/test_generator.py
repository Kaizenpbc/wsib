from typing import List
from app.models import TestQuestion

class TestGenerator:
    """
    Service to generate test questions from curriculum
    """
    
    QUESTION_BANK = [
        {
            "question": "What is the correct compression-to-ventilation ratio for adult CPR with one rescuer?",
            "type": "multiple_choice",
            "options": ["15:2", "30:2", "5:1", "15:1"],
            "correct_answer": "30:2",
            "points": 4,
            "objective": "Demonstrate proper CPR technique"
        },
        {
            "question": "What is the recommended depth for chest compressions on an adult?",
            "type": "multiple_choice",
            "options": ["1-1.5 inches", "At least 2 inches", "3-4 inches", "As deep as possible"],
            "correct_answer": "At least 2 inches",
            "points": 4,
            "objective": "Demonstrate proper compression technique"
        },
        {
            "question": "At what rate should chest compressions be performed?",
            "type": "multiple_choice",
            "options": ["60-80 per minute", "80-100 per minute", "100-120 per minute", "120-140 per minute"],
            "correct_answer": "100-120 per minute",
            "points": 4,
            "objective": "Demonstrate proper compression technique"
        },
        {
            "question": "When should you stop performing CPR?",
            "type": "multiple_choice",
            "options": [
                "After 5 minutes",
                "When you are exhausted",
                "When EMS arrives or the person shows signs of life",
                "Never stop once started"
            ],
            "correct_answer": "When EMS arrives or the person shows signs of life",
            "points": 4,
            "objective": "Understand when to perform CPR"
        },
        {
            "question": "Before performing CPR, what is the first thing you should do?",
            "type": "multiple_choice",
            "options": [
                "Start chest compressions immediately",
                "Check the scene for safety",
                "Give rescue breaths",
                "Call your supervisor"
            ],
            "correct_answer": "Check the scene for safety",
            "points": 4,
            "objective": "Follow proper emergency response procedures"
        },
        {
            "question": "The 'Chain of Survival' includes early recognition and activation of emergency response.",
            "type": "true_false",
            "options": ["True", "False"],
            "correct_answer": "True",
            "points": 4,
            "objective": "Understand the Chain of Survival"
        },
        {
            "question": "You should tilt the head and lift the chin to open the airway.",
            "type": "true_false",
            "options": ["True", "False"],
            "correct_answer": "True",
            "points": 4,
            "objective": "Demonstrate airway management"
        },
        {
            "question": "Where should you place your hands when performing chest compressions on an adult?",
            "type": "multiple_choice",
            "options": [
                "Upper chest near collarbone",
                "Center of chest on the lower half of the breastbone",
                "Left side of chest over the heart",
                "Right side of chest"
            ],
            "correct_answer": "Center of chest on the lower half of the breastbone",
            "points": 4,
            "objective": "Demonstrate proper hand placement"
        },
        {
            "question": "Good Samaritan laws protect people who provide reasonable assistance to those who are injured.",
            "type": "true_false",
            "options": ["True", "False"],
            "correct_answer": "True",
            "points": 4,
            "objective": "Understand legal considerations"
        },
        {
            "question": "What does CPR stand for?",
            "type": "multiple_choice",
            "options": [
                "Cardiac Pulmonary Response",
                "Cardiopulmonary Resuscitation",
                "Cardiac Pressure Response",
                "Cardio Pulmonary Rescue"
            ],
            "correct_answer": "Cardiopulmonary Resuscitation",
            "points": 4,
            "objective": "Understand CPR fundamentals"
        },
        {
            "question": "You should allow complete chest recoil between compressions.",
            "type": "true_false",
            "options": ["True", "False"],
            "correct_answer": "True",
            "points": 4,
            "objective": "Demonstrate proper compression technique"
        },
        {
            "question": "If an AED is available, when should you use it?",
            "type": "multiple_choice",
            "options": [
                "Only after performing CPR for 10 minutes",
                "As soon as it arrives",
                "Only if the person is breathing",
                "Never during CPR"
            ],
            "correct_answer": "As soon as it arrives",
            "points": 4,
            "objective": "Understand AED usage"
        },
        {
            "question": "How long should each rescue breath last?",
            "type": "multiple_choice",
            "options": ["1 second", "3 seconds", "5 seconds", "Until the chest rises"],
            "correct_answer": "1 second",
            "points": 4,
            "objective": "Demonstrate proper ventilation technique"
        },
        {
            "question": "CPR can be performed on a soft surface like a bed.",
            "type": "true_false",
            "options": ["True", "False"],
            "correct_answer": "False",
            "points": 4,
            "objective": "Understand proper CPR positioning"
        },
        {
            "question": "What is the purpose of chest compressions?",
            "type": "multiple_choice",
            "options": [
                "To restart the heart",
                "To circulate blood to vital organs",
                "To clear the airway",
                "To help the person breathe"
            ],
            "correct_answer": "To circulate blood to vital organs",
            "points": 4,
            "objective": "Understand the purpose of CPR"
        },
        {
            "question": "You should check for a pulse for no more than 10 seconds.",
            "type": "true_false",
            "options": ["True", "False"],
            "correct_answer": "True",
            "points": 4,
            "objective": "Follow proper assessment procedures"
        },
        {
            "question": "For a child, what is the recommended compression depth?",
            "type": "multiple_choice",
            "options": [
                "About 1 inch",
                "About 2 inches or at least one-third the depth of the chest",
                "As deep as an adult",
                "1/2 inch"
            ],
            "correct_answer": "About 2 inches or at least one-third the depth of the chest",
            "points": 4,
            "objective": "Demonstrate child CPR techniques"
        },
        {
            "question": "You must be certified to perform CPR.",
            "type": "true_false",
            "options": ["True", "False"],
            "correct_answer": "False",
            "points": 4,
            "objective": "Understand legal and ethical considerations"
        },
        {
            "question": "What should you do if you are alone and see someone collapse?",
            "type": "multiple_choice",
            "options": [
                "Perform CPR for 2 minutes, then call 911",
                "Call 911 immediately, then start CPR",
                "Drive them to the hospital",
                "Wait for someone else to help"
            ],
            "correct_answer": "Call 911 immediately, then start CPR",
            "points": 4,
            "objective": "Follow proper emergency response procedures"
        },
        {
            "question": "The chest should rise visibly with each rescue breath.",
            "type": "true_false",
            "options": ["True", "False"],
            "correct_answer": "True",
            "points": 4,
            "objective": "Demonstrate proper ventilation technique"
        },
        {
            "question": "For infant CPR, you should use which technique for compressions?",
            "type": "multiple_choice",
            "options": [
                "Two hands on the chest",
                "One hand on the chest",
                "Two fingers on the center of the chest",
                "Thumbs encircling the chest"
            ],
            "correct_answer": "Two fingers on the center of the chest",
            "points": 4,
            "objective": "Demonstrate infant CPR techniques"
        },
        {
            "question": "Interruptions in chest compressions should be minimized.",
            "type": "true_false",
            "options": ["True", "False"],
            "correct_answer": "True",
            "points": 4,
            "objective": "Understand effective CPR delivery"
        },
        {
            "question": "What does the 'C' in CAB stand for in the CPR sequence?",
            "type": "multiple_choice",
            "options": ["Call", "Check", "Compressions", "Clear"],
            "correct_answer": "Compressions",
            "points": 4,
            "objective": "Understand CPR sequence"
        },
        {
            "question": "You should use an adult AED on a child older than 8 years.",
            "type": "true_false",
            "options": ["True", "False"],
            "correct_answer": "True",
            "points": 4,
            "objective": "Understand AED usage for different ages"
        },
        {
            "question": "What should you do if the person vomits during CPR?",
            "type": "multiple_choice",
            "options": [
                "Stop CPR immediately",
                "Turn the person on their side, clear the mouth, then resume CPR",
                "Continue CPR without stopping",
                "Give more rescue breaths"
            ],
            "correct_answer": "Turn the person on their side, clear the mouth, then resume CPR",
            "points": 4,
            "objective": "Handle complications during CPR"
        }
    ]
    
    async def generate(self, curriculum_id: str, count: int = 25) -> List[TestQuestion]:
        """
        Generate test questions from question bank
        """
        questions = []
        
        for i, q in enumerate(self.QUESTION_BANK[:count]):
            question = TestQuestion(
                question=q["question"],
                type=q["type"],
                options=q.get("options"),
                correct_answer=q["correct_answer"],
                points=q["points"],
                learning_objective=q["objective"]
            )
            questions.append(question)
        
        return questions

