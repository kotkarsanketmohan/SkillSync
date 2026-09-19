from abc import ABC, abstractmethod
from typing import List, Dict

class IndustrySourceAdapter(ABC):
    @abstractmethod
    def collect_jobs(self, city: str, state: str, branch: str) -> List[Dict]:
        """
        Collects jobs relevant to location and branch.
        Must return list of dicts: {"company": "", "title": "", "description": "", "url": "", "skills": []}
        """
        pass
