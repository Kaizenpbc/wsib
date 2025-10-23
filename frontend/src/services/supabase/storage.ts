// Storage service that uses backend API with local file storage
// No more Supabase - everything runs on your computer!

const API_URL = (import.meta as any).env?.VITE_BACKEND_API_URL || 'http://localhost:8000'

export const storageService = {
  // Upload RFP file to local backend
  async uploadRfp(file: File) {
    // The file will be uploaded directly when creating RFP
    // This method now just returns file info for compatibility
    const fileName = `${Date.now()}-${file.name}`
    
    return {
      path: fileName,
      url: `${API_URL}/api/files/uploads/${fileName}`,
      fileName: file.name,
      file: file // Include actual file for backend upload
    }
  },

  // Upload generated output file
  async uploadOutput(_file: Blob, fileName: string, type: string) {
    const timestamp = Date.now()
    const fullFileName = `${timestamp}-${fileName}`
    
    return {
      path: `outputs/${type}/${fullFileName}`,
      url: `${API_URL}/api/files/outputs/${type}/${fullFileName}`,
      fileName: fullFileName
    }
  },

  // Delete file (not implemented for local storage yet)
  async deleteFile(_bucket: string, _path: string) {
    console.warn('File deletion not implemented for local storage')
    // Could be implemented by adding delete endpoint to backend
  },

  // Get file URL
  getPublicUrl(_bucket: string, path: string) {
    // Convert path to local backend URL
    if (path.includes('uploads')) {
      const fileName = path.split('/').pop()
      return `${API_URL}/api/files/uploads/${fileName}`
    }
    return `${API_URL}/api/files/${path}`
  }
}

