import cv2
import numpy as np

def apply_gaussian_blur(image: np.ndarray, kernel_size: int = 5, sigma: float = 1.0) -> np.ndarray:
    k = max(1, kernel_size if kernel_size % 2 != 0 else kernel_size + 1)
    return cv2.GaussianBlur(image, (k, k), sigmaX=float(sigma))

def apply_median_filter(image: np.ndarray, kernel_size: int = 5) -> np.ndarray:
    k = max(1, kernel_size if kernel_size % 2 != 0 else kernel_size + 1)
    return cv2.medianBlur(image, k)

def apply_average_filter(image: np.ndarray, kernel_size: int = 5) -> np.ndarray:
    k = max(1, int(kernel_size))
    return cv2.blur(image, (k, k))

def apply_sharpening(image: np.ndarray, strength: float = 1.0) -> np.ndarray:
    kernel = np.array([
        [0, -1 * strength, 0],
        [-1 * strength, 4 * strength + 1, -1 * strength],
        [0, -1 * strength, 0]
    ], dtype=np.float32)
    sharpened = cv2.filter2D(image, -1, kernel)
    return np.clip(sharpened, 0, 255).astype(np.uint8)

def add_gaussian_noise(image: np.ndarray, mean: float = 0.0, sigma: float = 25.0) -> np.ndarray:
    noise = np.random.normal(mean, sigma, image.shape).astype(np.float32)
    noisy_image = image.astype(np.float32) + noise
    return np.clip(noisy_image, 0, 255).astype(np.uint8)

def add_salt_and_pepper_noise(image: np.ndarray, probability: float = 0.05) -> np.ndarray:
    noisy = image.copy()
    num_salt = np.ceil(probability * image.size * 0.5)
    num_pepper = np.ceil(probability * image.size * 0.5)

    coords = [np.random.randint(0, i - 1, int(num_salt)) for i in image.shape[:2]]
    noisy[tuple(coords)] = 255

    coords = [np.random.randint(0, i - 1, int(num_pepper)) for i in image.shape[:2]]
    noisy[tuple(coords)] = 0

    return noisy
