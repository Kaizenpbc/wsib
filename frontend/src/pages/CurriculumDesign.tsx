import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { BookOpen, Plus, Edit, Trash2 } from 'lucide-react'
import { rfpService, clauseService, curriculumService } from '@/services/supabase/database'
import { generateCurriculum } from '@/services/api'
import type { RFP, Clause, Curriculum } from '@/types'

export default function CurriculumDesign() {
  const { id } = useParams<{ id: string }>()
  const [rfp, setRfp] = useState<RFP | null>(null)
  const [clauses, setClauses] = useState<Clause[]>([])
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)

  useEffect(() => {
    if (id) {
      loadData()
    }
  }, [id])

  const loadData = async () => {
    if (!id) return
    
    try {
      const [rfpData, clausesData, curriculaData] = await Promise.all([
        rfpService.getById(id),
        clauseService.getByRfpId(id),
        curriculumService.getByRfpId(id)
      ])
      
      setRfp(rfpData)
      setClauses(clausesData)
      if (curriculaData.length > 0) {
        setCurriculum(curriculaData[0])
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateCurriculum = async () => {
    if (!id || !rfp) return

    setGenerating(true)
    try {
      // Create curriculum record
      const newCurriculum = await curriculumService.create({
        rfp_id: id,
        title: `${rfp.title} - Curriculum`,
        description: `Generated curriculum for ${rfp.title}`,
        status: 'in_progress'
      })

      // Call backend to generate curriculum
      const clauseIds = clauses.map(c => c.id)
      await generateCurriculum(newCurriculum.id, clauseIds, [])

      // Reload data
      await loadData()
    } catch (error) {
      console.error('Error generating curriculum:', error)
    } finally {
      setGenerating(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!rfp) {
    return <div className="text-center py-12">RFP not found</div>
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{rfp.title}</h1>
        <p className="text-gray-600 mt-1">{rfp.organization}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RFP Clauses */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">RFP Requirements</h2>
              <span className="text-sm text-gray-600">{clauses.length} clauses</span>
            </div>

            {clauses.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No clauses parsed yet</p>
            ) : (
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {clauses.map((clause) => (
                  <div key={clause.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-gray-900">{clause.text}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            clause.priority === 'must' ? 'bg-red-100 text-red-700' :
                            clause.priority === 'should' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {clause.priority}
                          </span>
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                            {clause.category}
                          </span>
                        </div>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Curriculum Panel */}
        <div className="lg:col-span-1">
          <div className="card sticky top-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Curriculum</h2>

            {!curriculum ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No curriculum generated yet</p>
                <button
                  onClick={handleGenerateCurriculum}
                  disabled={generating || clauses.length === 0}
                  className="btn-primary w-full disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  {generating ? 'Generating...' : 'Generate Curriculum'}
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    curriculum.status === 'complete' ? 'bg-green-100 text-green-700' :
                    curriculum.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {curriculum.status}
                  </span>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600">Total Duration</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {curriculum.total_duration_minutes ? `${curriculum.total_duration_minutes} min` : 'TBD'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Modules</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {curriculum.modules?.length || 0}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link
                    to={`/outputs/${curriculum.id}`}
                    className="btn-primary w-full text-center block"
                  >
                    Generate Outputs
                  </Link>
                  <Link
                    to={`/compliance/${curriculum.id}`}
                    className="btn-secondary w-full text-center block"
                  >
                    View Compliance
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

