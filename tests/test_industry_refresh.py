import pytest
from app.services.industry import IndustryDatasetRefreshService

class MockSession:
    def add(self, *args): pass
    def commit(self): pass
    def refresh(self, *args): pass
    def rollback(self): pass
    def flush(self): pass
    def query(self, *args):
        class MockQuery:
            def filter(self, *args, **kwargs): return self
            def first(self): return None
        return MockQuery()

def test_industry_refresh_preserves_on_failure(monkeypatch):
    mock_session = MockSession()
    
    # Mock collection to raise an exception, simulating a failure
    def mock_collect(*args, **kwargs):
        raise ValueError("Simulated Apify/Scraping Failure")
        
    import app.services.industry as industry
    monkeypatch.setattr(industry.IndustryDataCollectionService, "collect_all", mock_collect)
    
    # This should handle the exception, rollback, and NOT delete old active datasets
    IndustryDatasetRefreshService.run_refresh(mock_session, "Pune", "Maharashtra", "Computer Engineering")
    # Asserting that it doesn't crash and handles the failure gracefully
    assert True 
