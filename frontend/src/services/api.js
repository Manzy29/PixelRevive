const API_BASE = '/api';

export const uploadSingleImage = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to upload image');
  }
  return response.json();
};

export const uploadDatasetFiles = async (files) => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append('dataset', files[i]);
  }
  const response = await fetch(`${API_BASE}/upload-dataset`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to upload dataset');
  }
  return response.json();
};

export const applyProcessing = async (filename, sourceType, algorithm, parameters) => {
  const response = await fetch(`${API_BASE}/process`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename,
      source_type: sourceType,
      algorithm,
      parameters,
    }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed to process image');
  }
  return response.json();
};

export const applyBatchProcessing = async (filenames, algorithm, parameters) => {
  const response = await fetch(`${API_BASE}/process-batch`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filenames,
      algorithm,
      parameters,
    }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Failed batch processing');
  }
  return response.json();
};
