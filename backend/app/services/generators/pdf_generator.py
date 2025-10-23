from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
import os

class PdfGenerator:
    """
    Service to generate PDF manuals from curriculum
    """
    
    async def generate_student_manual(self, curriculum_id: str) -> str:
        """
        Generate student manual PDF
        """
        output_dir = "outputs/manuals"
        os.makedirs(output_dir, exist_ok=True)
        file_path = f"{output_dir}/student_manual_{curriculum_id}.pdf"
        
        doc = SimpleDocTemplate(file_path, pagesize=letter)
        styles = getSampleStyleSheet()
        story = []
        
        # Title
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor='darkblue',
            spaceAfter=30,
        )
        story.append(Paragraph("CPR Training - Student Manual", title_style))
        story.append(Spacer(1, 0.2 * inch))
        
        # Introduction
        story.append(Paragraph("Introduction", styles['Heading2']))
        story.append(Paragraph(
            "Welcome to the CPR Training Program. This manual will guide you through "
            "the essential skills and knowledge needed to perform CPR effectively.",
            styles['BodyText']
        ))
        story.append(Spacer(1, 0.2 * inch))
        
        # Module 1
        story.append(Paragraph("Module 1: Introduction to CPR", styles['Heading2']))
        story.append(Paragraph("Learning Objectives:", styles['Heading3']))
        objectives = [
            "Understand the importance of CPR",
            "Identify when CPR is needed",
            "Recognize signs of cardiac arrest"
        ]
        for obj in objectives:
            story.append(Paragraph(f"• {obj}", styles['BodyText']))
        story.append(Spacer(1, 0.3 * inch))
        
        # Module 2
        story.append(Paragraph("Module 2: CPR Techniques", styles['Heading2']))
        story.append(Paragraph(
            "Chest compressions are the most critical component of CPR. "
            "Proper technique ensures blood flow to vital organs.",
            styles['BodyText']
        ))
        story.append(Spacer(1, 0.2 * inch))
        
        # Practice section
        story.append(Paragraph("Practice Notes", styles['Heading3']))
        story.append(Paragraph("" * 10, styles['BodyText']))  # Empty lines for notes
        
        doc.build(story)
        return file_path
    
    async def generate_instructor_manual(self, curriculum_id: str) -> str:
        """
        Generate instructor manual PDF
        """
        output_dir = "outputs/manuals"
        os.makedirs(output_dir, exist_ok=True)
        file_path = f"{output_dir}/instructor_manual_{curriculum_id}.pdf"
        
        doc = SimpleDocTemplate(file_path, pagesize=letter)
        styles = getSampleStyleSheet()
        story = []
        
        # Title
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor='darkgreen',
            spaceAfter=30,
        )
        story.append(Paragraph("CPR Training - Instructor Manual", title_style))
        story.append(Spacer(1, 0.2 * inch))
        
        # Teaching guide
        story.append(Paragraph("Teaching Guide", styles['Heading2']))
        story.append(Paragraph(
            "This manual provides comprehensive guidance for delivering the CPR training program.",
            styles['BodyText']
        ))
        story.append(Spacer(1, 0.2 * inch))
        
        # Module 1 teaching notes
        story.append(Paragraph("Module 1: Introduction to CPR", styles['Heading2']))
        story.append(Paragraph("Teaching Notes:", styles['Heading3']))
        story.append(Paragraph(
            "Duration: 60 minutes",
            styles['BodyText']
        ))
        story.append(Paragraph(
            "Key Points to Emphasize:",
            styles['BodyText']
        ))
        teaching_points = [
            "CPR can double or triple chances of survival",
            "Every second counts in cardiac arrest",
            "Good Samaritan laws protect rescuers"
        ]
        for point in teaching_points:
            story.append(Paragraph(f"• {point}", styles['BodyText']))
        story.append(Spacer(1, 0.3 * inch))
        
        # Assessment guide
        story.append(Paragraph("Assessment Guide", styles['Heading2']))
        story.append(Paragraph(
            "Students must demonstrate proper technique in the following areas:",
            styles['BodyText']
        ))
        assessment_criteria = [
            "Correct hand placement (80% minimum)",
            "Adequate compression depth (2-2.4 inches)",
            "Proper compression rate (100-120 per minute)",
            "Complete chest recoil between compressions"
        ]
        for criterion in assessment_criteria:
            story.append(Paragraph(f"• {criterion}", styles['BodyText']))
        
        doc.build(story)
        return file_path

