import cv2
import numpy as np

def process_image(image_path):
    image = cv2.imread(image_path)
    if image is None:
        raise ValueError("Image not found or invalid")
    
    # Convert to HSV for color saturation analysis
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    saturation = np.mean(hsv[:, :, 1])
    
    # Surface defect detection (simple contour analysis for demonstration)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(blurred, 50, 150)
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    defects = [len(c) for c in contours if len(c) > 50] # Just a count of large contours
    
    return {
        "saturation": float(saturation),
        "defects": {"count": len(defects), "details": defects[:5]}
    }
