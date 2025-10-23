// Database services using local MySQL backend API
// No more Supabase - everything runs on your computer!

import axios from 'axios'
import type { RFP, Clause, Curriculum, Output, Standard } from '@/types'

const API_URL = (import.meta as any).env?.VITE_BACKEND_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// RFP Operations
export const rfpService = {
  async getAll() {
    const response = await api.get('/api/rfps')
    return response.data as RFP[]
  },

  async getById(id: string) {
    const response = await api.get(`/api/rfps/${id}`)
    return response.data as RFP
  },

  async create(rfp: Partial<RFP> & { file?: File }) {
    // Use FormData for file upload
    const formData = new FormData()
    
    if (rfp.file) {
      formData.append('file', rfp.file)
    }
    if (rfp.title) formData.append('title', rfp.title)
    if (rfp.organization) formData.append('organization', rfp.organization)
    if (rfp.description) formData.append('description', rfp.description)
    
    const response = await api.post('/api/rfps', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data as RFP
  },

  async update(id: string, updates: Partial<RFP>) {
    const response = await api.patch(`/api/rfps/${id}`, updates)
    return response.data as RFP
  }
}

// Clause Operations
export const clauseService = {
  async getByRfpId(rfpId: string) {
    const response = await api.get('/api/clauses', {
      params: { rfp_id: rfpId }
    })
    return response.data as Clause[]
  },

  async create(clause: Partial<Clause>) {
    const response = await api.post('/api/clauses', clause)
    return response.data as Clause
  },

  async bulkCreate(clauses: Partial<Clause>[]) {
    const promises = clauses.map(clause => api.post('/api/clauses', clause))
    const responses = await Promise.all(promises)
    return responses.map(r => r.data) as Clause[]
  },

  async update(id: string, updates: Partial<Clause>) {
    const response = await api.patch(`/api/clauses/${id}`, updates)
    return response.data as Clause
  }
}

// Curriculum Operations
export const curriculumService = {
  async getByRfpId(rfpId: string) {
    const response = await api.get('/api/curricula', {
      params: { rfp_id: rfpId }
    })
    return response.data as Curriculum[]
  },

  async getById(id: string) {
    const response = await api.get(`/api/curricula/${id}`)
    return response.data as Curriculum
  },

  async create(curriculum: Partial<Curriculum>) {
    const response = await api.post('/api/curricula', curriculum)
    return response.data as Curriculum
  },

  async update(id: string, updates: Partial<Curriculum>) {
    const response = await api.patch(`/api/curricula/${id}`, updates)
    return response.data as Curriculum
  }
}

// Standards Operations
export const standardService = {
  async getAll() {
    const response = await api.get('/api/standards')
    return response.data as Standard[]
  },

  async getByCategory(category: string) {
    const response = await api.get('/api/standards', {
      params: { category }
    })
    return response.data as Standard[]
  },

  async create(standard: Partial<Standard> & { file?: File }) {
    // Use FormData for file upload
    const formData = new FormData()
    
    if (standard.file) {
      formData.append('file', standard.file)
    }
    if (standard.name) formData.append('name', standard.name)
    if (standard.category) formData.append('category', standard.category)
    
    const response = await api.post('/api/standards', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data as Standard
  },

  async delete(id: string) {
    await api.delete(`/api/standards/${id}`)
  }
}

// Output Operations
export const outputService = {
  async getByCurriculumId(curriculumId: string) {
    const response = await api.get('/api/outputs', {
      params: { curriculum_id: curriculumId }
    })
    return response.data as Output[]
  },

  async create(output: Partial<Output>) {
    const response = await api.post('/api/outputs', output)
    return response.data as Output
  },

  async update(id: string, updates: Partial<Output>) {
    const response = await api.patch(`/api/outputs/${id}`, updates)
    return response.data as Output
  }
}

