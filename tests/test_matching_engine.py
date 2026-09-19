import pytest
from app.services.skills import MatchingEngine

# Mocking db queries for tests
class MockSession:
    def query(self, model):
        class MockQuery:
            def join(self, *args, **kwargs): return self
            def filter(self, *args, **kwargs): return self
            def first(self): return None
            def delete(self): pass
            def all(self): return []
        return MockQuery()
    def add(self, *args): pass
    def flush(self): pass
    def commit(self): pass

def test_matching_engine_deterministic_scores():
    # If using demo mode or deterministic logic without real embeddings:
    # We should get a deterministic fallback score.
    mock_session = MockSession()
    # In a full test, we'd mock the returned CurriculumSkills and IndustryDatasetSkills
    # and verify the dot product / cosine similarity logic output.
    
    score = MatchingEngine.calculate_college_match(mock_session, college_id=1, dataset_id=2)
    # Testing that it returns a valid float percentage
    assert isinstance(score, float)
    assert 0.0 <= score <= 100.0
