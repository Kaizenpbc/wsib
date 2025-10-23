import zipfile
import tempfile
import os
from typing import List, Dict
from pathlib import Path

class ZipExtractor:
    """
    Service to extract and process ZIP files containing documents
    """
    
    SUPPORTED_EXTENSIONS = ['.pdf', '.doc', '.docx']
    
    async def extract_and_process(self, zip_path: str) -> Dict:
        """
        Extract ZIP file and return list of contained documents
        """
        extracted_files = []
        
        try:
            # Create temporary directory for extraction
            with tempfile.TemporaryDirectory() as temp_dir:
                # Extract ZIP
                with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                    zip_ref.extractall(temp_dir)
                
                # Find all supported documents
                for root, dirs, files in os.walk(temp_dir):
                    for file in files:
                        file_path = Path(root) / file
                        file_ext = file_path.suffix.lower()
                        
                        # Only process supported file types
                        if file_ext in self.SUPPORTED_EXTENSIONS:
                            # Skip hidden files and system files
                            if not file.startswith('.') and not file.startswith('__'):
                                extracted_files.append({
                                    'name': file,
                                    'path': str(file_path),
                                    'size': os.path.getsize(file_path),
                                    'type': file_ext[1:]  # Remove the dot
                                })
                
                return {
                    'success': True,
                    'files': extracted_files,
                    'count': len(extracted_files)
                }
        
        except zipfile.BadZipFile:
            return {
                'success': False,
                'error': 'Invalid ZIP file',
                'files': [],
                'count': 0
            }
        except Exception as e:
            return {
                'success': False,
                'error': str(e),
                'files': [],
                'count': 0
            }
    
    def is_zip_file(self, filename: str) -> bool:
        """
        Check if file is a ZIP file
        """
        return filename.lower().endswith('.zip')
    
    async def get_zip_contents(self, zip_path: str) -> List[str]:
        """
        Get list of files in ZIP without extracting
        """
        try:
            with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                return zip_ref.namelist()
        except Exception:
            return []


