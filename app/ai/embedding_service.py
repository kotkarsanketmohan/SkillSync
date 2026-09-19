from sentence_transformers import SentenceTransformer
import numpy as np

# Load a pre-trained sentence transformer model
# all-MiniLM-L6-v2 produces 384 dimensional embeddings, which is fast and good for semantic similarity
model = SentenceTransformer('all-MiniLM-L6-v2')

def get_embedding(text: str) -> np.ndarray:
    """Generate an embedding vector for the given text."""
    if not text:
        return np.zeros(384)
    # The model returns a numpy array
    return model.encode(text)

def get_embeddings(texts: list[str]) -> list[np.ndarray]:
    """Generate embedding vectors for a list of texts."""
    if not texts:
        return []
    return model.encode(texts)
