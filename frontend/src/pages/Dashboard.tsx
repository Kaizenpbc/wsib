import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, BookOpen, FileOutput, Plus, Shield } from 'lucide-react'
import { rfpService, standardService } from '@/services/supabase/database'
import type { RFP, Standard } from '@/types'

export default function Dashboard() {
  const [rfps, setRfps] = useState<RFP[]>([])
  const [standards, setStandards] = useState<Standard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [rfpsData, standardsData] = await Promise.all([
        rfpService.getAll(),
        standardService.getAll()
      ])
      setRfps(rfpsData)
      setStandards(standardsData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    { name: 'Total RFPs', value: rfps.length, icon: FileText, color: 'bg-blue-500' },
    { name: 'Standards Uploaded', value: standards.length, icon: Shield, color: 'bg-green-500' },
    { name: 'Generated Outputs', value: '12', icon: FileOutput, color: 'bg-purple-500' },
  ]

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to your Curriculum Design workspace</p>
        </div>
        <Link to="/rfp-upload" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          New RFP
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <div key={stat.name} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Uploaded Standards */}
      <div className="card mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Uploaded Standards & Compliance Documents</h2>
          <Link to="/standards-upload" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
            + Upload More
          </Link>
        </div>
        
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : standards.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No standards uploaded yet</p>
            <Link to="/standards-upload" className="btn-primary">
              Upload Standards Documents
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {standards.slice(0, 6).map((standard) => (
              <div key={standard.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">{standard.name}</h3>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">{standard.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                        {standard.category}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(standard.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent RFPs */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Recent RFPs</h2>
        
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : rfps.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No RFPs uploaded yet</p>
            <Link to="/rfp-upload" className="btn-primary">
              Upload Your First RFP
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {rfps.map((rfp) => (
              <div key={rfp.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{rfp.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{rfp.organization}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-gray-500">
                        {new Date(rfp.created_at).toLocaleDateString()}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        rfp.status === 'parsed' ? 'bg-green-100 text-green-700' :
                        rfp.status === 'parsing' ? 'bg-yellow-100 text-yellow-700' :
                        rfp.status === 'error' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {rfp.status}
                      </span>
                    </div>
                  </div>
                  <Link 
                    to={`/curriculum/${rfp.id}`}
                    className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

