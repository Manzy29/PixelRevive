import cv2
import numpy as np
import os
import zipfile

os.makedirs("sample_dataset", exist_ok=True)

# 1. Low Contrast Image (pixels confined between 100 and 160)
x = np.linspace(0, 1, 400)
y = np.linspace(0, 1, 400)
X, Y = np.meshgrid(x, y)
pattern = (np.sin(X * 10) * np.cos(Y * 10) + 1) * 30 + 100
low_contrast = np.stack([pattern, pattern * 0.9, pattern * 1.1], axis=-1).astype(np.uint8)
cv2.putText(low_contrast, "Low Contrast Sample", (30, 200), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (130, 130, 130), 2)
cv2.imwrite("sample_dataset/01_low_contrast.png", low_contrast)

# 2. Underexposed / Dark Image (values mostly < 50)
dark_img = np.zeros((400, 400, 3), dtype=np.uint8)
cv2.circle(dark_img, (200, 200), 120, (30, 35, 40), -1)
cv2.rectangle(dark_img, (60, 60), (340, 340), (20, 25, 30), 3)
cv2.putText(dark_img, "Dark Image: Test Gamma", (40, 200), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (45, 50, 55), 2)
cv2.imwrite("sample_dataset/02_underexposed_dark.png", dark_img)

# 3. Vivid RGB Color Spectrum
color_bars = np.zeros((400, 400, 3), dtype=np.uint8)
bar_w = 400 // 6
colors = [
    (0, 0, 255),    # Red
    (0, 255, 0),    # Green
    (255, 0, 0),    # Blue
    (0, 255, 255),  # Yellow
    (255, 0, 255),  # Magenta
    (255, 255, 0)   # Cyan
]
for i, col in enumerate(colors):
    color_bars[:, i * bar_w:(i + 1) * bar_w] = col
cv2.putText(color_bars, "HSV / LAB Test", (50, 200), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (255, 255, 255), 2)
cv2.imwrite("sample_dataset/03_color_bars.png", color_bars)

# 4. Salt-and-Pepper Noise Corrupted Image
sp_base = np.full((400, 400, 3), 128, dtype=np.uint8)
cv2.circle(sp_base, (200, 200), 90, (220, 150, 80), -1)
cv2.putText(sp_base, "Apply Median Filter", (45, 200), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
prob = 0.08
num_salt = int(prob * sp_base.size * 0.5)
num_pepper = int(prob * sp_base.size * 0.5)
coords = [np.random.randint(0, i - 1, num_salt) for i in sp_base.shape[:2]]
sp_base[tuple(coords)] = 255
coords = [np.random.randint(0, i - 1, num_pepper) for i in sp_base.shape[:2]]
sp_base[tuple(coords)] = 0
cv2.imwrite("sample_dataset/04_salt_pepper_noise.png", sp_base)

# 5. Gaussian Noise Corrupted Image
g_base = np.zeros((400, 400, 3), dtype=np.uint8)
g_base[:] = (180, 130, 90)
cv2.rectangle(g_base, (80, 80), (320, 320), (70, 90, 160), -1)
cv2.putText(g_base, "Apply Gaussian Blur", (40, 205), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (255, 255, 255), 2)
noise = np.random.normal(0, 30, g_base.shape).astype(np.float32)
noisy_g = np.clip(g_base.astype(np.float32) + noise, 0, 255).astype(np.uint8)
cv2.imwrite("sample_dataset/05_gaussian_noise.png", noisy_g)

# 6. Geometric Edges for Sharpening
sharp_base = np.zeros((400, 400, 3), dtype=np.uint8)
sharp_base[:] = (240, 240, 240)
for r in range(30, 180, 25):
    cv2.circle(sharp_base, (200, 200), r, (40, 40, 40), 2)
cv2.putText(sharp_base, "Test Sharpening", (80, 205), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 200), 2)
blurred_sharp = cv2.GaussianBlur(sharp_base, (7, 7), 2.0)
cv2.imwrite("sample_dataset/06_geometric_shapes.png", blurred_sharp)

# Bundle into sample_dataset.zip
with zipfile.ZipFile("sample_dataset.zip", "w") as zf:
    for filename in os.listdir("sample_dataset"):
        zf.write(os.path.join("sample_dataset", filename), arcname=filename)

print("Created sample_dataset folder and sample_dataset.zip successfully!")
