import cv2
import numpy as np

def rgb_to_grayscale(image: np.ndarray) -> np.ndarray:
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    return cv2.cvtColor(gray, cv2.COLOR_GRAY2BGR)

def rgb_to_hsv_visualized(image: np.ndarray) -> np.ndarray:
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    h, s, v = cv2.split(hsv)

    h_vis = cv2.normalize(h, None, 0, 255, cv2.NORM_MINMAX)
    h_bgr = cv2.applyColorMap(h_vis, cv2.COLORMAP_HSV)
    s_bgr = cv2.cvtColor(s, cv2.COLOR_GRAY2BGR)
    v_bgr = cv2.cvtColor(v, cv2.COLOR_GRAY2BGR)

    cv2.putText(h_bgr, "Hue (H)", (15, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
    cv2.putText(s_bgr, "Saturation (S)", (15, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
    cv2.putText(v_bgr, "Value (V)", (15, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)

    return np.hstack([h_bgr, s_bgr, v_bgr])

def rgb_to_lab_visualized(image: np.ndarray) -> np.ndarray:
    lab = cv2.cvtColor(image, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)

    l_bgr = cv2.cvtColor(l, cv2.COLOR_GRAY2BGR)
    a_bgr = cv2.applyColorMap(a, cv2.COLORMAP_PINK)
    b_bgr = cv2.applyColorMap(b, cv2.COLORMAP_JET)

    cv2.putText(l_bgr, "L* (Luminance)", (15, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
    cv2.putText(a_bgr, "a* (Green - Red)", (15, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
    cv2.putText(b_bgr, "b* (Blue - Yellow)", (15, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)

    return np.hstack([l_bgr, a_bgr, b_bgr])

def negative_transformation(image: np.ndarray) -> np.ndarray:
    return 255 - image

def sepia_transformation(image: np.ndarray) -> np.ndarray:
    sepia_matrix = np.array([
        [0.131, 0.534, 0.272],
        [0.168, 0.686, 0.349],
        [0.189, 0.769, 0.393]
    ], dtype=np.float32)
    transformed = cv2.transform(image, sepia_matrix)
    return np.clip(transformed, 0, 255).astype(np.uint8)

def adjust_brightness_contrast(image: np.ndarray, brightness: int = 0, contrast: float = 1.0) -> np.ndarray:
    return cv2.convertScaleAbs(image, alpha=float(contrast), beta=float(brightness))
