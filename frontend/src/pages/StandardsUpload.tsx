import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, FileText, CheckCircle, AlertCircle, X } from 'lucide-react'
import { standardService } from '@/services/supabase/database'

interface UploadedFile {
  file: File
  id: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

export default function StandardsUpload() {
  const navigate = useNavigate()
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState<string[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    
    const newFiles: UploadedFile[] = selectedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substring(7),
      status: 'pending'
    }))
    
    setFiles(prev => [...prev, ...newFiles])
  }

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const addProgress = (message: string) => {
    setProgress(prev => [...prev, message])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (files.length === 0) return

    setUploading(true)
    setProgress([])

    try {
      addProgress(`Uploading ${files.length} standard document(s)...`)

      for (const fileItem of files) {
        try {
          // Update status to uploading
          setFiles(prev => prev.map(f => 
            f.id === fileItem.id ? { ...f, status: 'uploading' } : f
          ))

          // Upload to backend - it handles file storage and database record
          addProgress(`📤 Uploading ${fileItem.file.name}...`)
          
          await standardService.create({
            file: fileItem.file,
            name: fileItem.file.name.replace(/\.[^/.]+$/, ''),
            category: 'Compliance'
          })

          // Mark as success
          setFiles(prev => prev.map(f => 
            f.id === fileItem.id ? { ...f, status: 'success' } : f
          ))
          addProgress(`✓ ${fileItem.file.name} uploaded successfully`)

        } catch (error) {
          setFiles(prev => prev.map(f => 
            f.id === fileItem.id ? { 
              ...f, 
              status: 'error',
              error: error instanceof Error ? error.message : 'Upload failed'
            } : f
          ))
          addProgress(`✗ Failed to upload ${fileItem.file.name}`)
        }
      }

      addProgress('✓ All uploads complete!')
      
      // Wait a moment then navigate
      setTimeout(() => {
        navigate('/')
      }, 2000)

    } catch (err) {
      console.error('Upload error:', err)
      addProgress('✗ Error occurred during upload')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Upload Standards & Compliance Documents</h1>
        <p className="text-gray-600 mt-1">
          Upload training standards, compliance guidelines, and reference documents
        </p>
      </div>

      <div className="max-w-3xl">
        <form onSubmit={handleSubmit} className="card">
          {/* Multiple File Upload */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Documents (Multiple files allowed)
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-primary-500 transition-colors">
              <input
                type="file"
                accept=".pdf,.doc,.docx,.zip"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload-multiple"
                multiple
                disabled={uploading}
              />
              <label htmlFor="file-upload-multiple" className="cursor-pointer">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Click to upload or drag and drop</p>
                <p className="text-sm text-gray-500">PDF, DOC, DOCX, or ZIP (max 50MB each)</p>
                <p className="text-sm text-primary-600 font-medium mt-2">
                  You can select multiple files at once
                </p>
                <p className="text-xs text-green-600 mt-1">
                  💡 TIP: Zip multiple documents into one file for faster upload!
                </p>
              </label>
            </div>
          </div>

          {/* File List */}
          {files.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Selected Files ({files.length})
              </h3>
              <div className="space-y-2">
                {files.map((fileItem) => (
                  <div 
                    key={fileItem.id} 
                    className="flex items-center justify-between border border-gray-200 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <FileText className={`w-5 h-5 ${
                        fileItem.status === 'success' ? 'text-green-600' :
                        fileItem.status === 'error' ? 'text-red-600' :
                        fileItem.status === 'uploading' ? 'text-yellow-600' :
                        'text-gray-400'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">
                          {fileItem.file.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {(fileItem.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                        {fileItem.error && (
                          <p className="text-xs text-red-600 mt-1">{fileItem.error}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {fileItem.status === 'success' && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                      {fileItem.status === 'error' && (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                      )}
                      {fileItem.status === 'uploading' && (
                        <div className="w-5 h-5 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin" />
                      )}
                      {fileItem.status === 'pending' && !uploading && (
                        <button
                          type="button"
                          onClick={() => removeFile(fileItem.id)}
                          className="text-gray-400 hover:text-red-600"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress */}
          {progress.length > 0 && (
            <div className="mb-6 bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Upload Progress</h3>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {progress.map((msg, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    {msg.startsWith('✓') ? (
                      <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    ) : msg.startsWith('✗') ? (
                      <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    ) : msg.startsWith('📤') ? (
                      <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                    ) : null}
                    <span className={
                      msg.startsWith('✓') ? 'text-green-700' :
                      msg.startsWith('✗') ? 'text-red-700' :
                      'text-gray-700'
                    }>
                      {msg}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex gap-3">
              <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-medium text-blue-900 mb-1">
                  What documents should you upload?
                </h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Training standards (e.g., AHA CPR guidelines)</li>
                  <li>• Compliance requirements</li>
                  <li>• Regulatory documents</li>
                  <li>• Industry best practices</li>
                  <li>• Reference materials</li>
                  <li>• <strong>ZIP files containing multiple documents</strong> 📦</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={files.length === 0 || uploading}
            className="btn-primary w-full disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {uploading ? `Uploading ${files.length} file(s)...` : `Upload ${files.length} Document(s)`}
          </button>
        </form>

        {/* Quick Add Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have standards uploaded?{' '}
            <button
              onClick={() => navigate('/rfp-upload')}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Go to RFP Upload →
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

