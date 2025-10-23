import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { CheckCircle, XCircle, AlertCircle, Download } from 'lucide-react'
import { curriculumService, clauseService } from '@/services/supabase/database'
import type { Curriculum, Clause, ComplianceItem } from '@/types'

export default function ComplianceDashboard() {
  const { id } = useParams<{ id: string }>()
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null)
  const [clauses, setClauses] = useState<Clause[]>([])
  const [compliance, setCompliance] = useState<ComplianceItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      loadData()
    }
  }, [id])

  const loadData = async () => {
    if (!id) return

    try {
      const curriculumData = await curriculumService.getById(id)
      setCurriculum(curriculumData)

      if (curriculumData.rfp_id) {
        const clausesData = await clauseService.getByRfpId(curriculumData.rfp_id)
        setClauses(clausesData)

        // Mock compliance data for now
        const complianceData: ComplianceItem[] = clausesData.map(clause => ({
          id: `comp-${clause.id}`,
          clause_id: clause.id,
          clause_text: clause.text,
          status: Math.random() > 0.2 ? 'met' : Math.random() > 0.5 ? 'partial' : 'not_met',
          evidence: 'Covered in module 2',
          notes: 'Sample compliance note'
        }))
        setCompliance(complianceData)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!curriculum) {
    return <div className="text-center py-12">Curriculum not found</div>
  }

  const metCount = compliance.filter(c => c.status === 'met').length
  const partialCount = compliance.filter(c => c.status === 'partial').length
  const notMetCount = compliance.filter(c => c.status === 'not_met').length
  const complianceRate = clauses.length > 0 ? Math.round((metCount / clauses.length) * 100) : 0

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Compliance Dashboard</h1>
          <p className="text-gray-600 mt-1">{curriculum.title}</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <p className="text-sm text-gray-600">Compliance Rate</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{complianceRate}%</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-2 mb-1">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm text-gray-600">Met</p>
          </div>
          <p className="text-3xl font-bold text-green-600">{metCount}</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <p className="text-sm text-gray-600">Partial</p>
          </div>
          <p className="text-3xl font-bold text-yellow-600">{partialCount}</p>
        </div>
        <div className="card">
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-gray-600">Not Met</p>
          </div>
          <p className="text-3xl font-bold text-red-600">{notMetCount}</p>
        </div>
      </div>

      {/* Compliance Items */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Requirements Checklist</h2>
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {compliance.map((item) => (
            <div key={item.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {item.status === 'met' ? (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  ) : item.status === 'partial' ? (
                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-gray-900 mb-2">{item.clause_text}</p>
                  {item.evidence && (
                    <p className="text-sm text-gray-600 mb-1">
                      <span className="font-medium">Evidence:</span> {item.evidence}
                    </p>
                  )}
                  {item.notes && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Notes:</span> {item.notes}
                    </p>
                  )}
                  <div className="mt-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.status === 'met' ? 'bg-green-100 text-green-700' :
                      item.status === 'partial' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

