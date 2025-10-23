import axios from 'axios'

const API_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// RFP Processing
export const parseRfp = async (fileUrl: string, fileName: string) => {
  const response = await api.post('/api/rfp/parse', {
    file_url: fileUrl,
    file_name: fileName
  })
  return response.data
}

// Curriculum Generation
export const generateCurriculum = async (rfpId: string, clauseIds: string[], standardIds: string[]) => {
  const response = await api.post('/api/curriculum/generate', {
    rfp_id: rfpId,
    clause_ids: clauseIds,
    standard_ids: standardIds
  })
  return response.data
}

// Output Generation
export const generatePowerPoint = async (curriculumId: string) => {
  const response = await api.post('/api/outputs/generate-ppt', {
    curriculum_id: curriculumId
  }, {
    responseType: 'blob'
  })
  return response.data
}

export const generateStudentManual = async (curriculumId: string) => {
  const response = await api.post('/api/outputs/generate-student-manual', {
    curriculum_id: curriculumId
  }, {
    responseType: 'blob'
  })
  return response.data
}

export const generateInstructorManual = async (curriculumId: string) => {
  const response = await api.post('/api/outputs/generate-instructor-manual', {
    curriculum_id: curriculumId
  }, {
    responseType: 'blob'
  })
  return response.data
}

export const generateScenarios = async (curriculumId: string, count: number = 5) => {
  const response = await api.post('/api/outputs/generate-scenarios', {
    curriculum_id: curriculumId,
    count
  })
  return response.data
}

export const generateTestQuestions = async (curriculumId: string, count: number = 25) => {
  const response = await api.post('/api/outputs/generate-test-questions', {
    curriculum_id: curriculumId,
    count
  })
  return response.data
}

export default api

