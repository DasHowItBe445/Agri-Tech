def grade_produce(inference_results, freshness_score):
    if freshness_score > 85 and inference_results['confidence'] > 0.9:
        return {"grade": "A", "label": "Premium"}
    elif freshness_score > 60:
        return {"grade": "B", "label": "Standard"}
    else:
        return {"grade": "C", "label": "Sub-standard"}
