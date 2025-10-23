import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, CheckSquare, FileText, Eye, EyeOff } from 'lucide-react'
import { rfpService, clauseService, curriculumService } from '@/services/supabase/database'
import CurriculumChat from '@/components/CurriculumChat'
import type { RFP, Clause } from '@/types'

export default function CurriculumDesignChat() {
  const { id } = useParams<{ id: string }>()
  const [rfp, setRfp] = useState<RFP | null>(null)
  const [clauses, setClauses] = useState<Clause[]>([])
  const [selectedClauses, setSelectedClauses] = useState<string[]>([])
  const [curriculumPreview, setCurriculumPreview] = useState<any>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (id) {
      loadData()
    }
  }, [id])

  const loadData = async () => {
    if (!id) return
    
    try {
      const [rfpData, clausesData] = await Promise.all([
        rfpService.getById(id),
        clauseService.getByRfpId(id)
      ])
      
      setRfp(rfpData)
      setClauses(clausesData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClausesSelected = (clauseIds: string[]) => {
    console.log('[Curriculum Design] Clauses selected:', clauseIds.length)
    setSelectedClauses(clauseIds)
  }

  const handleCurriculumGenerated = (curriculumData: any) => {
    console.log('[Curriculum Design] Curriculum preview updated:', curriculumData)
    setCurriculumPreview(curriculumData)
    setShowPreview(true)
  }

  const handleSaveCurriculum = async () => {
    if (!curriculumPreview || !id) return

    setSaving(true)
    try {
      // Save to database
      const savedCurriculum = await curriculumService.create({
        rfp_id: id,
        title: curriculumPreview.title,
        description: curriculumPreview.description,
        status: 'completed',
        total_duration_minutes: curriculumPreview.total_duration_minutes
      })

      console.log('[Curriculum Design] Saved:', savedCurriculum)
      alert(`✅ Curriculum "${curriculumPreview.title}" saved successfully!\n\nYou can now generate outputs from it.`)
      
      // Optionally navigate to outputs page
      // navigate(`/outputs/${savedCurriculum.id}`)
    } catch (error) {
      console.error('Error saving curriculum:', error)
      alert('❌ Error saving curriculum. Please try again.')
    } finally {
      setSaving(false)
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

  if (!rfp) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">RFP not found</p>
        <Link to="/" className="text-primary-600 hover:underline">
          ← Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                to="/"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{rfp.title}</h1>
                <p className="text-sm text-gray-600">{rfp.organization} • {clauses.length} requirements</p>
              </div>
            </div>
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showPreview ? 'Hide' : 'Show'} Preview
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Area - Takes 2 columns */}
          <div className="lg:col-span-2">
            <CurriculumChat
              rfpId={id!}
              rfpTitle={rfp.title}
              clausesCount={clauses.length}
              onClausesSelected={handleClausesSelected}
              onCurriculumGenerated={handleCurriculumGenerated}
            />
          </div>

          {/* Selected Clauses Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm sticky top-24">
              <div className="p-4 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center gap-2">
                  <CheckSquare className="w-5 h-5 text-primary-600" />
                  <h3 className="font-semibold text-gray-900">Selected Requirements</h3>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {selectedClauses.length} of {clauses.length} selected
                </p>
              </div>

              <div className="p-4 max-h-[600px] overflow-y-auto">
                {selectedClauses.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">
                      As you chat, I'll select relevant requirements for your curriculum
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {clauses
                      .filter(c => selectedClauses.includes(c.id))
                      .map((clause) => (
                        <div
                          key={clause.id}
                          className="p-3 bg-primary-50 border border-primary-200 rounded-lg"
                        >
                          <div className="flex items-start gap-2">
                            <CheckSquare className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900">{clause.text}</p>
                              <div className="flex gap-2 mt-2">
                                <span className="text-xs px-2 py-0.5 bg-white rounded-full text-gray-600">
                                  {clause.category}
                                </span>
                                <span className="text-xs px-2 py-0.5 bg-white rounded-full text-gray-600">
                                  {clause.priority}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Curriculum Preview - Expandable Section */}
        {showPreview && curriculumPreview && (
          <div className="mt-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                📋 Curriculum Preview
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900">Title</h3>
                  <p className="text-gray-700">{curriculumPreview.title}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900">Description</h3>
                  <p className="text-gray-700">{curriculumPreview.description}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900">Duration</h3>
                  <p className="text-gray-700">
                    {curriculumPreview.total_duration_minutes} minutes 
                    ({Math.round(curriculumPreview.total_duration_minutes / 60)} hours)
                  </p>
                </div>
                
                {curriculumPreview.modules && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Modules</h3>
                    <div className="space-y-3">
                      {curriculumPreview.modules.map((module: any, index: number) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <h4 className="font-medium text-gray-900">{module.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{module.description}</p>
                          <p className="text-xs text-gray-500 mt-2">
                            {module.duration_minutes} minutes
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={handleSaveCurriculum}
                disabled={saving}
                className="mt-6 w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {saving ? '💾 Saving...' : '💾 Save Curriculum to Database'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

