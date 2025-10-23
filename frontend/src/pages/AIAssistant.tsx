import { useEffect, useState } from 'react'
import { Bot, FileCheck, BookOpen, Presentation, CheckSquare, Loader, ArrowRight } from 'lucide-react'
import { rfpService } from '@/services/supabase/database'
import UnifiedChat from '@/components/UnifiedChat'

interface WorkItem {
  type: 'curriculum' | 'brd' | 'ppt' | 'none'
  title: string
  data: any
  status: 'draft' | 'ready' | 'generating'
}

export default function AIAssistant() {
  const [rfps, setRfps] = useState<any[]>([])
  const [selectedRfp, setSelectedRfp] = useState<any>(null)
  const [workItem, setWorkItem] = useState<WorkItem>({ type: 'none', title: '', data: null, status: 'draft' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadRfps()
  }, [])

  const loadRfps = async () => {
    try {
      const data = await rfpService.getAll()
      setRfps(data)
    } catch (error) {
      console.error('Error loading RFPs:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleWorkItemUpdate = (type: WorkItem['type'], title: string, data: any, status: WorkItem['status'] = 'draft') => {
    setWorkItem({ type, title, data, status })
  }

  return (
    <div className="fixed inset-0 flex flex-col" style={{ top: '4rem' }}>
      {/* Header Bar */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-lg">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">AI Assistant</h1>
              <p className="text-sm text-white text-opacity-90">
                Your intelligent helper for curriculum design
              </p>
            </div>
          </div>
          
          {selectedRfp && (
            <div className="bg-white bg-opacity-20 px-4 py-2 rounded-lg">
              <p className="text-sm font-medium">{selectedRfp.title}</p>
              <p className="text-xs text-white text-opacity-80">
                {selectedRfp.clauses_count} requirements
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Split View */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Chat Panel (Always Visible) */}
        <div className="w-1/2 border-r border-gray-200 bg-white flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <h2 className="font-semibold text-gray-900 mb-3">💬 Chat with AI</h2>
            
            {/* RFP Selector */}
            {!selectedRfp && rfps.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select an RFP to work with:
                </label>
                <select
                  onChange={(e) => {
                    const rfp = rfps.find(r => r.id === e.target.value)
                    setSelectedRfp(rfp)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Choose RFP...</option>
                  {rfps.map(rfp => (
                    <option key={rfp.id} value={rfp.id}>
                      {rfp.title} ({rfp.clauses_count} clauses)
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {selectedRfp && (
              <button
                onClick={() => setSelectedRfp(null)}
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                ← Change RFP
              </button>
            )}
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-hidden">
            {selectedRfp ? (
              <UnifiedChat
                rfpId={selectedRfp.id}
                rfpTitle={selectedRfp.title}
                onWorkItemUpdate={handleWorkItemUpdate}
              />
            ) : (
              <div className="flex items-center justify-center h-full p-8 text-center">
                <div>
                  <Bot className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600 mb-2">Select an RFP to get started</p>
                  <p className="text-sm text-gray-500">
                    I'll help you create curricula, BRDs, and outputs
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Work Panel (Shows Results) */}
        <div className="w-1/2 bg-gray-50 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-200 bg-white">
            <h2 className="font-semibold text-gray-900">📊 Your Work</h2>
            <p className="text-sm text-gray-600 mt-1">
              Results appear here as you chat
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {workItem.type === 'none' ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center max-w-md">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                      <BookOpen className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-900">Curriculum</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                      <FileCheck className="w-8 h-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-900">BRD</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                      <Presentation className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-900">PowerPoint</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                      <CheckSquare className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-900">More...</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-2">Start chatting to create:</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Curricula with professional instructional design</li>
                    <li>• Business Requirements Documents</li>
                    <li>• Customized PowerPoint presentations</li>
                    <li>• And more...</li>
                  </ul>
                </div>
              </div>
            ) : workItem.type === 'curriculum' ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <BookOpen className="w-6 h-6 text-primary-600" />
                  <div>
                    <h3 className="font-bold text-gray-900">{workItem.title}</h3>
                    <p className="text-sm text-gray-600">Curriculum Design</p>
                  </div>
                </div>

                {workItem.data && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Duration</p>
                      <p className="text-gray-900">{Math.floor(workItem.data.total_duration_minutes / 60)} hours</p>
                    </div>
                    
                    {workItem.data.modules && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Modules</p>
                        <div className="space-y-2">
                          {workItem.data.modules.map((module: any, idx: number) => (
                            <div key={idx} className="p-3 bg-primary-50 rounded-lg border border-primary-200">
                              <p className="font-medium text-sm text-gray-900">{module.title}</p>
                              <p className="text-xs text-gray-600 mt-1">{module.duration_minutes} minutes</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : workItem.type === 'brd' ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <FileCheck className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="font-bold text-gray-900">{workItem.title}</h3>
                    <p className="text-sm text-gray-600">Business Requirements Document</p>
                  </div>
                </div>

                {workItem.data && (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Executive Summary</p>
                      <p className="text-sm text-gray-600">{workItem.data.executive_summary}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Requirements</p>
                      <div className="flex gap-4 text-sm">
                        <span className="text-gray-600">
                          <strong>{workItem.data.functional_requirements?.length || 0}</strong> Functional
                        </span>
                        <span className="text-gray-600">
                          <strong>{workItem.data.non_functional_requirements?.length || 0}</strong> Non-Functional
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : workItem.type === 'ppt' ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Presentation className="w-6 h-6 text-purple-600" />
                  <div>
                    <h3 className="font-bold text-gray-900">{workItem.title}</h3>
                    <p className="text-sm text-gray-600">PowerPoint Presentation</p>
                  </div>
                </div>

                {workItem.data && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700">Theme</p>
                        <p className="text-gray-900">{workItem.data.theme}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Colors</p>
                        <p className="text-gray-900">{workItem.data.color_scheme}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Slides</p>
                        <p className="text-gray-900">~{workItem.data.total_slides}</p>
                      </div>
                    </div>
                    
                    {workItem.data.sections && (
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">Slide Sections</p>
                        <div className="space-y-1">
                          {workItem.data.sections.map((section: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <ArrowRight className="w-4 h-4 text-purple-600" />
                              <span className="text-gray-900">{section.title}</span>
                              <span className="text-gray-500">({section.slides} slides)</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : null}

            {/* Status indicator */}
            {workItem.status === 'generating' && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2">
                  <Loader className="w-5 h-5 text-blue-600 animate-spin" />
                  <span className="text-sm font-medium text-blue-900">Generating...</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

