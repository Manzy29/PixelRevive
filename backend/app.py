import os
import cv2
import zipfile
import time
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS

from utils.file_handler import (
    init_storage,
    save_uploaded_file,
    safe_extract_zip,
    is_allowed_file,
    UPLOAD_FOLDER,
    PROCESSED_FOLDER,
    DATASET_FOLDER
)
from processing.restoration import (
    apply_gaussian_blur,
    apply_median_filter,
    apply_average_filter,
    apply_sharpening,
    add_gaussian_noise,
    add_salt_and_pepper_noise
)
from processing.colour_transforms import (
    rgb_to_grayscale,
    rgb_to_hsv_visualized,
    rgb_to_lab_visualized,
    negative_transformation,
    sepia_transformation,
    adjust_brightness_contrast
)
from processing.enhancement import (
    histogram_equalization,
    contrast_stretching,
    gamma_correction,
    generate_histogram_base64
)

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
init_storage()

def dispatch_algorithm(image, algorithm: str, params: dict):
    if algorithm == "gaussian_blur":
        return apply_gaussian_blur(image, int(params.get("kernel_size", 5)), float(params.get("sigma", 1.0)))
    elif algorithm == "median_filter":
        return apply_median_filter(image, int(params.get("kernel_size", 5)))
    elif algorithm == "average_filter":
        return apply_average_filter(image, int(params.get("kernel_size", 5)))
    elif algorithm == "sharpening":
        return apply_sharpening(image, float(params.get("strength", 1.0)))
    elif algorithm == "gaussian_noise":
        return add_gaussian_noise(image, sigma=float(params.get("sigma", 25.0)))
    elif algorithm == "salt_and_pepper_noise":
        return add_salt_and_pepper_noise(image, probability=float(params.get("probability", 0.05)))
    elif algorithm == "grayscale":
        return rgb_to_grayscale(image)
    elif algorithm == "hsv":
        return rgb_to_hsv_visualized(image)
    elif algorithm == "lab":
        return rgb_to_lab_visualized(image)
    elif algorithm == "negative":
        return negative_transformation(image)
    elif algorithm == "sepia":
        return sepia_transformation(image)
    elif algorithm == "brightness_contrast":
        return adjust_brightness_contrast(image, int(params.get("brightness", 0)), float(params.get("contrast", 1.0)))
    elif algorithm == "histogram_equalization":
        return histogram_equalization(image)
    elif algorithm == "contrast_stretching":
        return contrast_stretching(image)
    elif algorithm == "gamma_correction":
        return gamma_correction(image, gamma=float(params.get("gamma", 1.0)))
    else:
        raise ValueError(f"Unknown algorithm: {algorithm}")

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "service": "PixelRevive Core Backend"}), 200

@app.route('/api/upload', methods=['POST'])
def upload_single_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided in request"}), 400
    file = request.files['image']
    if file.filename == '' or not is_allowed_file(file.filename):
        return jsonify({"error": "Invalid file type. Supported: JPG, JPEG, PNG"}), 400

    filename = save_uploaded_file(file, UPLOAD_FOLDER)
    filepath = os.path.join(UPLOAD_FOLDER, filename)
    img = cv2.imread(filepath)
    if img is None:
        return jsonify({"error": "Failed to decode uploaded image"}), 400

    h, w, c = img.shape
    return jsonify({
        "message": "Upload successful",
        "filename": filename,
        "dimensions": {"width": w, "height": h, "channels": c},
        "file_type": filename.rsplit('.', 1)[1].upper(),
        "url": f"/api/files/uploads/{filename}"
    }), 200

@app.route('/api/upload-dataset', methods=['POST'])
def upload_dataset():
    files = request.files.getlist('dataset')
    if not files or files[0].filename == '':
        return jsonify({"error": "No files uploaded"}), 400

    extracted_items = []
    if len(files) == 1 and files[0].filename.endswith('.zip'):
        zip_file = files[0]
        temp_zip_name = save_uploaded_file(zip_file, DATASET_FOLDER)
        temp_zip_path = os.path.join(DATASET_FOLDER, temp_zip_name)
        extracted_files = safe_extract_zip(temp_zip_path, DATASET_FOLDER, max_files=40)
        os.remove(temp_zip_path)
        for fn in extracted_files:
            p = os.path.join(DATASET_FOLDER, fn)
            im = cv2.imread(p)
            if im is not None:
                h, w, c = im.shape
                extracted_items.append({
                    "filename": fn,
                    "dimensions": {"width": w, "height": h, "channels": c},
                    "url": f"/api/files/datasets/{fn}"
                })
    else:
        for file in files:
            if is_allowed_file(file.filename):
                saved_name = save_uploaded_file(file, DATASET_FOLDER)
                p = os.path.join(DATASET_FOLDER, saved_name)
                im = cv2.imread(p)
                if im is not None:
                    h, w, c = im.shape
                    extracted_items.append({
                        "filename": saved_name,
                        "dimensions": {"width": w, "height": h, "channels": c},
                        "url": f"/api/files/datasets/{saved_name}"
                    })

    if not extracted_items:
        return jsonify({"error": "No valid image files found in dataset upload"}), 400

    return jsonify({
        "message": f"Successfully loaded {len(extracted_items)} dataset images",
        "dataset": extracted_items
    }), 200

@app.route('/api/process', methods=['POST'])
def process_image():
    data = request.get_json() or {}
    filename = data.get("filename")
    source_type = data.get("source_type", "uploads")
    algorithm = data.get("algorithm")
    params = data.get("parameters", {})

    if not filename or not algorithm:
        return jsonify({"error": "filename and algorithm are required"}), 400

    folder = DATASET_FOLDER if source_type == "datasets" else UPLOAD_FOLDER
    src_path = os.path.join(folder, filename)
    if not os.path.exists(src_path):
        return jsonify({"error": "Source image not found"}), 404

    original_img = cv2.imread(src_path)
    if original_img is None:
        return jsonify({"error": "Could not read original image"}), 500

    try:
        processed_img = dispatch_algorithm(original_img, algorithm, params)
    except Exception as e:
        return jsonify({"error": f"Image processing error: {str(e)}"}), 500

    out_filename = f"proc_{int(time.time() * 1000)}_{filename.rsplit('.', 1)[0]}.png"
    out_path = os.path.join(PROCESSED_FOLDER, out_filename)
    cv2.imwrite(out_path, processed_img)

    h, w = processed_img.shape[:2]
    c = processed_img.shape[2] if len(processed_img.shape) > 2 else 1
    hist_b64 = generate_histogram_base64(original_img, processed_img)

    return jsonify({
        "message": "Processing complete",
        "processed_filename": out_filename,
        "processed_url": f"/api/files/processed/{out_filename}",
        "dimensions": {"width": w, "height": h, "channels": c},
        "histogram_data": hist_b64
    }), 200

@app.route('/api/process-batch', methods=['POST'])
def process_batch():
    data = request.get_json() or {}
    filenames = data.get("filenames", [])
    algorithm = data.get("algorithm")
    params = data.get("parameters", {})

    if not filenames or not algorithm:
        return jsonify({"error": "filenames and algorithm are required for batch"}), 400

    processed_list = []
    for fn in filenames:
        src = os.path.join(DATASET_FOLDER, fn)
        if not os.path.exists(src):
            continue
        img = cv2.imread(src)
        if img is None:
            continue
        try:
            res = dispatch_algorithm(img, algorithm, params)
            out_fn = f"batch_{fn.rsplit('.', 1)[0]}.png"
            out_path = os.path.join(PROCESSED_FOLDER, out_fn)
            cv2.imwrite(out_path, res)
            processed_list.append(out_fn)
        except Exception:
            continue

    return jsonify({
        "message": f"Processed {len(processed_list)} images successfully",
        "processed_files": processed_list
    }), 200

@app.route('/api/download', methods=['GET'])
def download_image():
    filename = request.args.get('filename')
    if not filename:
        return jsonify({"error": "filename parameter missing"}), 400
    filepath = os.path.join(PROCESSED_FOLDER, filename)
    if not os.path.exists(filepath):
        return jsonify({"error": "File not found"}), 404
    return send_file(filepath, as_attachment=True, download_name=filename, mimetype="image/png")

@app.route('/api/download-batch', methods=['GET'])
def download_batch():
    zip_path = os.path.join(PROCESSED_FOLDER, "processed_dataset.zip")
    with zipfile.ZipFile(zip_path, 'w') as zf:
        for fn in os.listdir(PROCESSED_FOLDER):
            if fn.startswith("batch_") or fn.startswith("proc_"):
                fp = os.path.join(PROCESSED_FOLDER, fn)
                zf.write(fp, arcname=fn)
    return send_file(zip_path, as_attachment=True, download_name="pixelrevive_batch.zip", mimetype="application/zip")

@app.route('/api/files/<folder>/<filename>', methods=['GET'])
def serve_file(folder, filename):
    folder_map = {
        'uploads': UPLOAD_FOLDER,
        'processed': PROCESSED_FOLDER,
        'datasets': DATASET_FOLDER
    }
    target = folder_map.get(folder)
    if not target:
        return jsonify({"error": "Invalid folder"}), 404

    file_path = os.path.join(target, filename)
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"}), 404

    response = send_file(file_path)
    # Prevent browser from caching processed previews
    response.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response

if __name__ == '__main__':
    print("PixelRevive Backend running at http://127.0.0.1:5000 ...")
    app.run(host='127.0.0.1', port=5000, debug=True)
