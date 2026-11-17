# PixelRevive — Image Restoration & Colour Transformation Studio

PixelRevive is a web application designed for Image Processing & Computer Vision (IPCV) coursework. It provides an interactive laboratory environment for students to analyze standard linear and non-linear image filtering, colorimetric representations, and histogram enhancement methods using traditional OpenCV algorithms without deep learning overhead.

---

## 🎨 Visual Color Palette
- **Warm Cream (`#FFF9F3`)**: Primary background
- **Deep Brown (`#4B3028`)**: Headings, navigation, typography
- **Mandarin Orange (`#E87936`)**: Action buttons, active slider accents
- **Onion Peel (`#F3E5D8`)**: Content cards and dashboard panels
- **Muted Beige (`#D8BFA9`)**: Borders, subtle dividers

---

## 🚀 Features

### 1. Image Restoration
- **Gaussian Blur** (`cv2.GaussianBlur`): Spatial domain low-pass filter with customizable kernel size and $\sigma$.
- **Median Filtering** (`cv2.medianBlur`): Non-linear filter effective against impulse (salt-and-pepper) noise.
- **Average (Box) Filtering** (`cv2.blur`): Neighborhood averaging filter.
- **Image Sharpening** (`cv2.filter2D`): High-pass Laplacian convolution kernel.
- **Noise Synthesizers**: Controlled Gaussian and Salt-and-Pepper noise generation for testing filtering pipelines.

### 2. Colour Transformations
- **RGB to Grayscale** (`cv2.cvtColor`): Perceptually weighted luminance projection.
- **RGB to HSV**: Channel separation and visualization of Hue, Saturation, and Value components.
- **RGB to CIELAB**: Visualization of $L^*$, $a^*$, and $b^*$ opponent color planes.
- **Negative & Sepia**: Photographic inversion and antique 3-channel matrix projection.
- **Brightness & Contrast**: Point-wise affine transformation ($g(x) = \alpha f(x) + \beta$).

### 3. Image Enhancement
- **Histogram Equalization**: Equalizes the luminance ($Y$ channel in YCrCb) to avoid hue distortion in color images.
- **Contrast Stretching**: Min-Max normalization mapping narrow pixel distributions across $[0, 255]$.
- **Gamma Correction**: Power-law adjustment utilizing a 256-element Look-Up Table (LUT).
- **Comparative Histograms**: Side-by-side RGB channel pixel intensity distributions generated dynamically via Matplotlib.

### 4. Dataset Batch Processing
- Upload single images or **ZIP archives containing image sets**.
- Path traversal protection (safe Zip slip prevention).
- Batch process entire datasets using any selected OpenCV algorithm.
- Export results individually or packaged in a single ZIP download.

---

## 🛠️ Installation & Execution

### Prerequisites
- Python 3.9+ installed
- Node.js 18+ and npm installed

---

### Step 1: Set Up and Run the Flask Backend

1. Open your terminal and navigate to the `backend` folder:
   ```bash
   cd pixel-revive/backend