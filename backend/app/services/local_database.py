import json
import os
from typing import List, Dict, Optional
from datetime import datetime
import uuid

class LocalDatabase:
    """
    Simple JSON file-based database for local development
    No Supabase needed!
    """
    
    def __init__(self, data_dir: str = "local_data"):
        self.data_dir = data_dir
        os.makedirs(data_dir, exist_ok=True)
        
        # Initialize empty files if they don't exist
        self.files = {
            'rfps': os.path.join(data_dir, 'rfps.json'),
            'clauses': os.path.join(data_dir, 'clauses.json'),
            'standards': os.path.join(data_dir, 'standards.json'),
            'curricula': os.path.join(data_dir, 'curricula.json'),
            'outputs': os.path.join(data_dir, 'outputs.json'),
        }
        
        for file_path in self.files.values():
            if not os.path.exists(file_path):
                with open(file_path, 'w') as f:
                    json.dump([], f)
    
    def _read(self, table: str) -> List[Dict]:
        """Read from JSON file"""
        with open(self.files[table], 'r') as f:
            return json.load(f)
    
    def _write(self, table: str, data: List[Dict]):
        """Write to JSON file"""
        with open(self.files[table], 'w') as f:
            json.dump(data, f, indent=2, default=str)
    
    def insert(self, table: str, record: Dict) -> Dict:
        """Insert a record"""
        data = self._read(table)
        
        # Add ID and timestamps if not present
        if 'id' not in record:
            record['id'] = str(uuid.uuid4())
        if 'created_at' not in record:
            record['created_at'] = datetime.now().isoformat()
        if 'updated_at' not in record:
            record['updated_at'] = datetime.now().isoformat()
        
        data.append(record)
        self._write(table, data)
        return record
    
    def select_all(self, table: str, order_by: Optional[str] = None, reverse: bool = False) -> List[Dict]:
        """Get all records"""
        data = self._read(table)
        
        if order_by and data:
            data.sort(key=lambda x: x.get(order_by, ''), reverse=reverse)
        
        return data
    
    def select_by_id(self, table: str, record_id: str) -> Optional[Dict]:
        """Get record by ID"""
        data = self._read(table)
        for record in data:
            if record.get('id') == record_id:
                return record
        return None
    
    def select_where(self, table: str, **conditions) -> List[Dict]:
        """Get records matching conditions"""
        data = self._read(table)
        results = []
        
        for record in data:
            match = True
            for key, value in conditions.items():
                if record.get(key) != value:
                    match = False
                    break
            if match:
                results.append(record)
        
        return results
    
    def update(self, table: str, record_id: str, updates: Dict) -> Optional[Dict]:
        """Update a record"""
        data = self._read(table)
        
        for i, record in enumerate(data):
            if record.get('id') == record_id:
                record.update(updates)
                record['updated_at'] = datetime.now().isoformat()
                data[i] = record
                self._write(table, data)
                return record
        
        return None
    
    def delete(self, table: str, record_id: str) -> bool:
        """Delete a record"""
        data = self._read(table)
        original_length = len(data)
        
        data = [r for r in data if r.get('id') != record_id]
        
        if len(data) < original_length:
            self._write(table, data)
            return True
        
        return False

# Global instance
db = LocalDatabase()


