import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react'
import { rfpService } from '@/services/supabase/database'

export default function RfpUpload() {
  const navigate = useNavigate()
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  const [organization, setOrganization] = useState('WSIB')
  const [description, setDescription] = useState('')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      if (!title) {
        setTitle(selectedFile.name.replace(/\.[^/.]+$/, ''))
      }
    }
  }

  const addProgress = (message: string) => {
    setProgress(prev => [...prev, message])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setUploading(true)
    setError(null)
    setProgress([])

    try {
      // Upload file to local backend - it will automatically parse and save everything!
      addProgress('Uploading file to server...')
      addProgress('Parsing RFP document...')
      
      const rfp = await rfpService.create({
        file,
        title,
        organization,
        description
      })
      
      addProgress('✓ File uploaded successfully')
      addProgress(`✓ Parsed ${rfp.clauses_count || 0} clauses`)
      addProgress('✓ RFP processing complete!')

      // Navigate to curriculum design
      setTimeout(() => {
        navigate(`/curriculum/${rfp.id}`)
      }, 1500)

    } catch (err) {
      console.error('Upload error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred during upload')
      addProgress('✗ Error occurred')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Upload RFP</h1>
        <p className="text-gray-600 mt-1">Upload an RFP document to begin curriculum design</p>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit} className="card">
          {/* File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              RFP Document
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.zip"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                disabled={uploading}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                {file ? (
                  <div className="flex items-center justify-center gap-3">
                    <FileText className="w-8 h-8 text-primary-600" />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                    <p className="text-sm text-gray-500">PDF, DOC, DOCX, or ZIP (max 50MB)</p>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input"
              placeholder="e.g., CPR Training Program 2024"
              required
              disabled={uploading}
            />
          </div>

          {/* Organization */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Organization
            </label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              className="input"
              placeholder="e.g., WSIB"
              required
              disabled={uploading}
            />
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input"
              rows={3}
              placeholder="Brief description of the RFP requirements..."
              disabled={uploading}
            />
          </div>

          {/* Progress */}
          {progress.length > 0 && (
            <div className="mb-6 bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Progress</h3>
              <div className="space-y-1">
                {progress.map((msg, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    {msg.startsWith('✓') ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : msg.startsWith('✗') ? (
                      <AlertCircle className="w-4 h-4 text-red-600" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                    )}
                    <span className={msg.startsWith('✓') ? 'text-green-700' : msg.startsWith('✗') ? 'text-red-700' : 'text-gray-700'}>
                      {msg}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Error</h3>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!file || uploading}
            className="btn-primary w-full disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {uploading ? 'Processing...' : 'Upload and Parse RFP'}
          </button>
        </form>
      </div>
    </div>
  )
}

