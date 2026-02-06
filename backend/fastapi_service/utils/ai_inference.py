import tensorflow as tf
import numpy as np
from PIL import Image

def get_inference(image_path):
    # In a real scenario, you'd load a MobileNetV2 model here
    # For hackathon demo, we'll simulate the output
    
    # model = tf.keras.applications.MobileNetV2(weights='imagenet', include_top=True)
    # img = Image.open(image_path).resize((224, 224))
    # x = np.array(img) / 255.0
    # x = np.expand_dims(x, axis=0)
    # preds = model.predict(x)
    
    # Simulating inference results
    # Grade A: 0.8, Grade B: 0.15, Grade C: 0.05
    return {
        "class": "A",
        "confidence": 0.92,
        "raw_scores": [0.92, 0.05, 0.03]
    }
