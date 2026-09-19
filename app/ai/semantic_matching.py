import numpy as np

def cosine_similarity(v1: np.ndarray, v2: np.ndarray) -> float:
    """Calculate the cosine similarity between two vectors."""
    dot_product = np.dot(v1, v2)
    norm_v1 = np.linalg.norm(v1)
    norm_v2 = np.linalg.norm(v2)
    if norm_v1 == 0 or norm_v2 == 0:
        return 0.0
    return float(dot_product / (norm_v1 * norm_v2))

def match_skills(curriculum_embeddings: list[np.ndarray], industry_embeddings: list[np.ndarray]) -> dict:
    """
    Given a list of curriculum skill embeddings and industry skill embeddings,
    calculate the best match for each industry skill in the curriculum.
    Returns an overall matching score and details.
    """
    if not industry_embeddings:
        return {"score": 0.0, "details": []}
    
    if not curriculum_embeddings:
        return {"score": 0.0, "details": [{"industry_idx": i, "curriculum_idx": None, "similarity": 0.0} for i in range(len(industry_embeddings))]}

    details = []
    total_similarity = 0.0
    
    for i_idx, ind_emb in enumerate(industry_embeddings):
        best_sim = -1.0
        best_c_idx = None
        for c_idx, cur_emb in enumerate(curriculum_embeddings):
            sim = cosine_similarity(ind_emb, cur_emb)
            if sim > best_sim:
                best_sim = sim
                best_c_idx = c_idx
        
        details.append({
            "industry_idx": i_idx,
            "curriculum_idx": best_c_idx,
            "similarity": best_sim
        })
        total_similarity += max(best_sim, 0.0) # avoid negative similarity subtracting from score
        
    score = (total_similarity / len(industry_embeddings)) * 100
    
    return {
        "score": round(score, 2),
        "details": details
    }
