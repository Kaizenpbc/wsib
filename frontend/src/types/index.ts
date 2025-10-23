// Core data models for the GTA CPR Curriculum application

export interface Clause {
  id: string
  rfp_id: string
  text: string
  category: 'duration' | 'content' | 'assessment' | 'equipment' | 'other'
  priority: 'must' | 'should' | 'may'
  standard_match?: string
  created_at: string
  updated_at: string
}

export interface Standard {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  requirements: string[]
  file_url?: string
  file_name?: string
  created_at: string
}

export interface CurriculumModule {
  id: string
  curriculum_id: string
  title: string
  description: string
  learning_objectives: string[]
  duration_minutes: number
  sequence_order: number
  topics: Topic[]
  activities: Activity[]
  assessment?: Assessment
  created_at: string
  updated_at: string
}

export interface Topic {
  id: string
  title: string
  content: string
  duration_minutes: number
}

export interface Activity {
  id: string
  type: 'lecture' | 'discussion' | 'hands-on' | 'scenario' | 'video' | 'assessment'
  title: string
  description: string
  duration_minutes: number
  materials_needed?: string[]
}

export interface Assessment {
  id: string
  type: 'quiz' | 'practical' | 'written' | 'observation'
  title: string
  passing_score: number
  questions?: TestQuestion[]
}

export interface TestQuestion {
  id: string
  question: string
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'practical'
  options?: string[]
  correct_answer: string
  points: number
  learning_objective: string
}

export interface RFP {
  id: string
  title: string
  organization: string
  description: string
  file_url: string
  file_name: string
  status: 'uploaded' | 'parsing' | 'parsed' | 'error'
  clauses_count?: number
  created_at: string
  updated_at: string
}

export interface Curriculum {
  id: string
  rfp_id: string
  title: string
  description: string
  status: 'draft' | 'in_progress' | 'complete' | 'published'
  modules?: CurriculumModule[]
  total_duration_minutes?: number
  created_at: string
  updated_at: string
}

export interface Output {
  id: string
  curriculum_id: string
  type: 'ppt' | 'student_manual' | 'instructor_manual' | 'scenario' | 'test'
  title: string
  status: 'pending' | 'generating' | 'ready' | 'error'
  file_url?: string
  error_message?: string
  created_at: string
  updated_at: string
}

export interface Scenario {
  id: string
  curriculum_id: string
  title: string
  description: string
  setup_instructions: string
  patient_information: {
    age?: number
    gender?: string
    condition: string
    symptoms: string[]
  }
  expected_actions: string[]
  evaluation_criteria: {
    criterion: string
    points: number
  }[]
  duration_minutes: number
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export interface ComplianceItem {
  id: string
  clause_id: string
  clause_text: string
  status: 'met' | 'partial' | 'not_met' | 'not_applicable'
  evidence?: string
  curriculum_module_id?: string
  notes?: string
}

