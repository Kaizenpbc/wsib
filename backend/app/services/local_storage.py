import os
import shutil
from typing import Dict

class LocalStorage:
    """
    Simple file storage for local development
    No Supabase needed!
    """
    
    def __init__(self, storage_dir: str = "local_storage"):
        self.storage_dir = storage_dir
        self.uploads_dir = os.path.join(storage_dir, "rfp-uploads")
        self.outputs_dir = os.path.join(storage_dir, "generated-outputs")
        
        # Create directories
        os.makedirs(self.uploads_dir, exist_ok=True)
        os.makedirs(self.outputs_dir, exist_ok=True)
    
    def save_upload(self, file_content: bytes, filename: str) -> Dict:
        """Save uploaded file"""
        filepath = os.path.join(self.uploads_dir, filename)
        
        with open(filepath, 'wb') as f:
            f.write(file_content)
        
        return {
            'path': filepath,
            'url': f'/files/uploads/{filename}',
            'fileName': filename
        }
    
    def save_output(self, file_content: bytes, filename: str, output_type: str) -> Dict:
        """Save generated output file"""
        type_dir = os.path.join(self.outputs_dir, output_type)
        os.makedirs(type_dir, exist_ok=True)
        
        filepath = os.path.join(type_dir, filename)
        
        with open(filepath, 'wb') as f:
            f.write(file_content)
        
        return {
            'path': filepath,
            'url': f'/files/outputs/{output_type}/{filename}',
            'fileName': filename
        }
    
    def get_file_path(self, url: str) -> str:
        """Convert URL to local file path"""
        if url.startswith('/files/uploads/'):
            filename = url.replace('/files/uploads/', '')
            return os.path.join(self.uploads_dir, filename)
        elif url.startswith('/files/outputs/'):
            path_parts = url.replace('/files/outputs/', '').split('/')
            return os.path.join(self.outputs_dir, *path_parts)
        return url

# Global instance
storage = LocalStorage()


