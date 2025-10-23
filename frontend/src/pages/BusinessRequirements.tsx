import { useEffect, useState } from 'react'
import { FileCheck, Download, RefreshCw, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { rfpService } from '@/services/supabase/database'
import axios from 'axios'

const API_URL = (import.meta as any).env?.VITE_BACKEND_API_URL || 'http://localhost:8000'

interface BRD {
  id: string
  rfp_id: string
  rfp_title: string
  executive_summary: string
  business_objectives: string[]
  functional_requirements: string[]
  non_functional_requirements: string[]
  scope: string
  stakeholders: string[]
  success_criteria: string[]
  constraints: string[]
  assumptions: string[]
  created_at: string
}

export default function BusinessRequirements() {
  const [rfps, setRfps] = useState<any[]>([])
  const [brds, setBrds] = useState<BRD[]>([])
  const [selectedBrd, setSelectedBrd] = useState<BRD | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [rfpsData, brdsData] = await Promise.all([
        rfpService.getAll(),
        axios.get(`${API_URL}/api/brd`).then(r => r.data).catch(() => [])
      ])
      
      setRfps(rfpsData)
      setBrds(brdsData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateBRD = async (rfpId: string) => {
    setGenerating(rfpId)
    try {
      const response = await axios.post(`${API_URL}/api/brd/generate`, { rfp_id: rfpId })
      
      // Reload data
      await loadData()
      
      // Select the newly generated BRD
      setSelectedBrd(response.data)
    } catch (error) {
      console.error('Error generating BRD:', error)
      alert('Error generating BRD. Please try again.')
    } finally {
      setGenerating(null)
    }
  }

  const handleDownloadBRD = async (brdId: string) => {
    try {
      const response = await axios.get(`${API_URL}/api/brd/${brdId}/download`, {
        responseType: 'blob'
      })
      
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `BRD_${brdId}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (error) {
      console.error('Error downloading BRD:', error)
      alert('Error downloading BRD. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Business Requirements Documents</h1>
        <p className="text-gray-600 mt-1">
          Extract and manage business requirements from RFPs
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RFPs List - Generate BRD */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">RFPs</h2>
          
          {rfps.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No RFPs uploaded yet</p>
              <p className="text-sm mt-2">Upload an RFP to generate a BRD</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rfps.map((rfp) => {
                const hasBRD = brds.some(b => b.rfp_id === rfp.id)
                const isGenerating = generating === rfp.id
                
                return (
                  <div key={rfp.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{rfp.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{rfp.organization}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {rfp.clauses_count} clauses parsed
                        </p>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        {hasBRD ? (
                          <button
                            onClick={() => {
                              const brd = brds.find(b => b.rfp_id === rfp.id)
                              setSelectedBrd(brd || null)
                            }}
                            className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors text-sm"
                          >
                            <CheckCircle className="w-4 h-4" />
                            View BRD
                          </button>
                        ) : (
                          <button
                            onClick={() => handleGenerateBRD(rfp.id)}
                            disabled={isGenerating}
                            className="flex items-center gap-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 transition-colors text-sm"
                          >
                            {isGenerating ? (
                              <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Generating...
                              </>
                            ) : (
                              <>
                                <FileCheck className="w-4 h-4" />
                                Generate BRD
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* BRD Display */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Business Requirements Document</h2>
            {selectedBrd && (
              <button
                onClick={() => handleDownloadBRD(selectedBrd.id)}
                className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
            )}
          </div>

          {!selectedBrd ? (
            <div className="text-center py-12 text-gray-500">
              <FileCheck className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="mb-2">No BRD selected</p>
              <p className="text-sm">Generate a BRD from an RFP to view it here</p>
            </div>
          ) : (
            <div className="space-y-6 max-h-[700px] overflow-y-auto">
              {/* Executive Summary */}
              <section>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                  Executive Summary
                </h3>
                <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
                  {selectedBrd.executive_summary}
                </p>
              </section>

              {/* Business Objectives */}
              <section>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                  Business Objectives
                </h3>
                <ul className="space-y-2">
                  {selectedBrd.business_objectives.map((obj, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      {obj}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Functional Requirements */}
              <section>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                  Functional Requirements
                </h3>
                <div className="space-y-2">
                  {selectedBrd.functional_requirements.map((req, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-gray-700 bg-blue-50 p-2 rounded">
                      <span className="font-mono text-blue-700 flex-shrink-0">FR-{idx + 1}</span>
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Non-Functional Requirements */}
              <section>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                  Non-Functional Requirements
                </h3>
                <div className="space-y-2">
                  {selectedBrd.non_functional_requirements.map((req, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-sm text-gray-700 bg-purple-50 p-2 rounded">
                      <span className="font-mono text-purple-700 flex-shrink-0">NFR-{idx + 1}</span>
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Scope */}
              <section>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                  Project Scope
                </h3>
                <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg">
                  {selectedBrd.scope}
                </p>
              </section>

              {/* Stakeholders */}
              <section>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                  Stakeholders
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedBrd.stakeholders.map((stakeholder, idx) => (
                    <span key={idx} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                      {stakeholder}
                    </span>
                  ))}
                </div>
              </section>

              {/* Success Criteria */}
              <section>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-primary-600 rounded-full"></span>
                  Success Criteria
                </h3>
                <ul className="space-y-2">
                  {selectedBrd.success_criteria.map((criteria, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-green-600 flex-shrink-0">✓</span>
                      {criteria}
                    </li>
                  ))}
                </ul>
              </section>

              {/* Constraints & Assumptions */}
              <div className="grid grid-cols-2 gap-4">
                <section>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">Constraints</h3>
                  <ul className="space-y-1">
                    {selectedBrd.constraints.map((constraint, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                        <AlertCircle className="w-3 h-3 text-orange-500 mt-0.5 flex-shrink-0" />
                        {constraint}
                      </li>
                    ))}
                  </ul>
                </section>

                <section>
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm">Assumptions</h3>
                  <ul className="space-y-1">
                    {selectedBrd.assumptions.map((assumption, idx) => (
                      <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                        <span className="text-blue-500 flex-shrink-0">ℹ</span>
                        {assumption}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <div className="text-xs text-gray-500 pt-4 border-t">
                Generated: {new Date(selectedBrd.created_at).toLocaleString()}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

