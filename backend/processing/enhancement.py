import io
import base64
import cv2
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

def histogram_equalization(image: np.ndarray) -> np.ndarray:
    if len(image.shape) == 2 or image.shape[2] == 1:
        return cv2.equalizeHist(image)
    ycrcb = cv2.cvtColor(image, cv2.COLOR_BGR2YCrCb)
    y, cr, cb = cv2.split(ycrcb)
    y_eq = cv2.equalizeHist(y)
    merged = cv2.merge([y_eq, cr, cb])
    return cv2.cvtColor(merged, cv2.COLOR_YCrCb2BGR)

def contrast_stretching(image: np.ndarray) -> np.ndarray:
    return cv2.normalize(image, None, alpha=0, beta=255, norm_type=cv2.NORM_MINMAX)

def gamma_correction(image: np.ndarray, gamma: float = 1.0) -> np.ndarray:
    if gamma <= 0:
        gamma = 0.01
    inv_gamma = 1.0 / float(gamma)
    table = np.array([((i / 255.0) ** inv_gamma) * 255 for i in np.arange(0, 256)]).astype("uint8")
    return cv2.LUT(image, table)

def generate_histogram_base64(original_bgr: np.ndarray, processed_bgr: np.ndarray) -> str:
    fig, axes = plt.subplots(1, 2, figsize=(10, 4), dpi=100)
    colors = ('b', 'g', 'r')
    labels = ('Blue', 'Green', 'Red')

    axes[0].set_title("Original Image Histogram", fontsize=11, fontweight="bold", color="#4B3028")
    for i, col in enumerate(colors):
        hist = cv2.calcHist([original_bgr], [i], None, [256], [0, 256])
        axes[0].plot(hist, color=col, label=labels[i], linewidth=1.2)
    axes[0].set_xlim([0, 256])
    axes[0].set_xlabel("Pixel Intensity")
    axes[0].set_ylabel("Pixel Count")
    axes[0].grid(True, linestyle="--", alpha=0.5)
    axes[0].legend(loc="upper right")

    axes[1].set_title("Processed Image Histogram", fontsize=11, fontweight="bold", color="#4B3028")
    for i, col in enumerate(colors):
        hist = cv2.calcHist([processed_bgr], [i], None, [256], [0, 256])
        axes[1].plot(hist, color=col, label=labels[i], linewidth=1.2)
    axes[1].set_xlim([0, 256])
    axes[1].set_xlabel("Pixel Intensity")
    axes[1].grid(True, linestyle="--", alpha=0.5)
    axes[1].legend(loc="upper right")

    plt.tight_layout()
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png', bbox_inches='tight')
    plt.close(fig)
    buffer.seek(0)
    encoded = base64.b64encode(buffer.read()).decode('utf-8')
    return f"data:image/png;base64,{encoded}"
