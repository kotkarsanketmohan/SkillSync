import pytest
from app.services.discovery import CollegeDiscoveryService
from app.models.academic import College, Department, Syllabus

# In a real environment, you'd use a test DB fixture
class MockQuery:
    def __init__(self, items):
        self.items = items
    def join(self, *args, **kwargs): return self
    def filter(self, *args, **kwargs): return self
    def distinct(self): return self
    def limit(self, limit): return MockQuery(self.items[:limit])
    def all(self): return self.items

class MockSession:
    def __init__(self, data):
        self.data = data
    def query(self, model):
        return MockQuery(self.data)

def test_discover_colleges():
    # Setup mock data
    mock_college1 = College(id=1, name="Pune Institute of Tech", city="Pune", state="Maharashtra")
    mock_session = MockSession([mock_college1] * 60) # Simulate 60 matches
    
    results = CollegeDiscoveryService.discover_colleges(mock_session, "Pune", "Maharashtra", "Computer Engineering", limit=50)
    
    assert len(results) == 50 # Verifying the maximum 50 results limit
    assert results[0].city == "Pune"
