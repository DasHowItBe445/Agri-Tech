def calculate_freshness(processed_data, inference_results):
    # Logic: Higher saturation and fewer defects mean higher freshness
    saturation = processed_data.get('saturation', 50)
    defects_count = processed_data.get('defects', {}).get('count', 0)
    
    # Scale from 0 to 100
    base_freshness = min(100, saturation * 0.8)
    penalty = defects_count * 2
    
    final_score = max(0, base_freshness - penalty)
    return float(final_score)
