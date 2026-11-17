import os
import zipfile
import uuid
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = os.path.join(os.getcwd(), 'temp_storage', 'uploads')
PROCESSED_FOLDER = os.path.join(os.getcwd(), 'temp_storage', 'processed')
DATASET_FOLDER = os.path.join(os.getcwd(), 'temp_storage', 'datasets')

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def init_storage():
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    os.makedirs(PROCESSED_FOLDER, exist_ok=True)
    os.makedirs(DATASET_FOLDER, exist_ok=True)

def is_allowed_file(filename: str) -> bool:
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_uploaded_file(file_storage, target_folder: str = UPLOAD_FOLDER) -> str:
    original_name = secure_filename(file_storage.filename)
    extension = original_name.rsplit('.', 1)[1].lower() if '.' in original_name else 'png'
    unique_name = f"{uuid.uuid4().hex}.{extension}"
    file_path = os.path.join(target_folder, unique_name)
    file_storage.save(file_path)
    return unique_name

def safe_extract_zip(zip_file_path: str, extract_to: str, max_files: int = 50) -> list:
    extracted_filenames = []
    with zipfile.ZipFile(zip_file_path, 'r') as archive:
        for member in archive.infolist():
            if member.is_dir() or member.filename.startswith('__MACOSX') or member.filename.startswith('.'):
                continue
            base_name = os.path.basename(member.filename)
            if not is_allowed_file(base_name):
                continue
            clean_name = secure_filename(base_name)
            unique_name = f"{uuid.uuid4().hex}_{clean_name}"
            destination_path = os.path.join(extract_to, unique_name)
            with archive.open(member) as source, open(destination_path, "wb") as target:
                target.write(source.read())
            extracted_filenames.append(unique_name)
            if len(extracted_filenames) >= max_files:
                break
    return extracted_filenames
