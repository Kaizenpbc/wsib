import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { FileText, Download, CheckCircle, Loader, MessageSquare, X } from 'lucide-react'
import { curriculumService, outputService } from '@/services/supabase/database'
import { 
  generatePowerPoint, 
  generateStudentManual, 
  generateInstructorManual,
  generateScenarios,
  generateTestQuestions 
} from '@/services/api'
import PptChat from '@/components/PptChat'
import type { Curriculum, Output } from '@/types'

export default function OutputGeneration() {
  const { id } = useParams<{ id: string }>()
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null)
  const [outputs, setOutputs] = useState<Output[]>([])
  const [generating, setGenerating] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPptChat, setShowPptChat] = useState(false)
  const [pptOutline, setPptOutline] = useState<any>(null)

  useEffect(() => {
    if (id) {
      loadData()
    }
  }, [id])

  const loadData = async () => {
    if (!id) return

    try {
      const [curriculumData, outputsData] = await Promise.all([
        curriculumService.getById(id),
        outputService.getByCurriculumId(id)
      ])

      setCurriculum(curriculumData)
      setOutputs(outputsData)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async (type: Output['type'], generatorFn: Function, title: string) => {
    if (!id) return

    // For PPT, open chat interface
    if (type === 'ppt') {
      setShowPptChat(true)
      return
    }

    setGenerating(type)
    try {
      // Create output record
      const output = await outputService.create({
        curriculum_id: id,
        type,
        title,
        status: 'generating'
      })

      // Generate the file
      const result = await generatorFn(id)

      // Update output record
      await outputService.update(output.id, {
        status: 'ready',
        file_url: result.url || result.file_url
      })

      // Reload outputs
      await loadData()
    } catch (error) {
      console.error(`Error generating ${type}:`, error)
    } finally {
      setGenerating(null)
    }
  }

  const handlePptReady = (pptData: any) => {
    console.log('[Output Gen] PPT Outline ready:', pptData)
    setPptOutline(pptData)
  }

  const handleGeneratePpt = async () => {
    if (!id || !pptOutline) return

    setGenerating('ppt')
    setShowPptChat(false)
    
    try {
      // Create output record
      const output = await outputService.create({
        curriculum_id: id,
        type: 'ppt',
        title: 'PowerPoint Presentation',
        status: 'generating'
      })

      // Generate with customizations
      const result = await generatePowerPoint(id)

      // Update output record
      await outputService.update(output.id, {
        status: 'ready',
        file_url: result.url || result.file_url
      })

      // Reload outputs
      await loadData()
      setPptOutline(null)
    } catch (error) {
      console.error('Error generating PPT:', error)
    } finally {
      setGenerating(null)
    }
  }

  const outputTypes = [
    {
      type: 'ppt' as const,
      title: 'PowerPoint Presentation',
      description: 'Teaching slides with content from curriculum',
      icon: FileText,
      generator: generatePowerPoint,
      color: 'bg-orange-500'
    },
    {
      type: 'student_manual' as const,
      title: 'Student Manual',
      description: 'Workbook with exercises and learning materials',
      icon: FileText,
      generator: generateStudentManual,
      color: 'bg-blue-500'
    },
    {
      type: 'instructor_manual' as const,
      title: 'Instructor Manual',
      description: 'Teaching guide with notes and answer keys',
      icon: FileText,
      generator: generateInstructorManual,
      color: 'bg-green-500'
    },
    {
      type: 'scenario' as const,
      title: 'Practice Scenarios',
      description: 'Realistic scenarios for hands-on practice',
      icon: FileText,
      generator: () => generateScenarios(id!, 5),
      color: 'bg-purple-500'
    },
    {
      type: 'test' as const,
      title: 'Test Questions',
      description: 'Assessment questions with answer key',
      icon: FileText,
      generator: () => generateTestQuestions(id!, 25),
      color: 'bg-pink-500'
    }
  ]

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!curriculum) {
    return <div className="text-center py-12">Curriculum not found</div>
  }

  return (
    <div>
      {/* PPT Chat Modal */}
      {showPptChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Design Your PowerPoint</h2>
              <button
                onClick={() => setShowPptChat(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <PptChat
                curriculumId={id!}
                curriculumTitle={curriculum.title}
                onPptReady={handlePptReady}
              />
              
              {pptOutline && (
                <div className="mt-4">
                  <button
                    onClick={handleGeneratePpt}
                    disabled={generating === 'ppt'}
                    className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-300 transition-colors font-medium"
                  >
                    {generating === 'ppt' ? 'Generating PowerPoint...' : '🎨 Generate PowerPoint'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Generate Outputs</h1>
        <p className="text-gray-600 mt-1">{curriculum.title}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {outputTypes.map((outputType) => {
          const Icon = outputType.icon
          const existingOutput = outputs.find(o => o.type === outputType.type)
          const isGenerating = generating === outputType.type

          return (
            <div key={outputType.type} className="card">
              <div className="flex items-start gap-4">
                <div className={`${outputType.color} p-3 rounded-lg flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 mb-1">{outputType.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{outputType.description}</p>

                  {existingOutput?.status === 'ready' ? (
                    <a
                      href={existingOutput.file_url}
                      download
                      className="flex items-center gap-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  ) : existingOutput?.status === 'generating' || isGenerating ? (
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Loader className="w-4 h-4 animate-spin" />
                      Generating...
                    </div>
                  ) : (
                    <button
                      onClick={() => handleGenerate(outputType.type, outputType.generator, outputType.title)}
                      disabled={isGenerating}
                      className="flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium disabled:text-gray-400"
                    >
                      {outputType.type === 'ppt' && <MessageSquare className="w-4 h-4" />}
                      {outputType.type === 'ppt' ? 'Chat to Create' : 'Generate'}
                    </button>
                  )}

                  {existingOutput?.status === 'error' && (
                    <p className="text-xs text-red-600 mt-2">{existingOutput.error_message}</p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Generated Outputs List */}
      {outputs.length > 0 && (
        <div className="card mt-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Generated Files</h2>
          <div className="space-y-3">
            {outputs.filter(o => o.status === 'ready').map((output) => (
              <div key={output.id} className="flex items-center justify-between border border-gray-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">{output.title}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(output.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <a
                  href={output.file_url}
                  download
                  className="btn-primary flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

