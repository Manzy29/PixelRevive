import React, { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Controls from './components/Controls';
import Workspace from './components/Workspace';
import DatasetGallery from './components/DatasetGallery';
import HistogramModal from './components/HistogramModal';

import { ALGORITHMS, ALGORITHM_CATEGORIES } from './data/algorithms';
import {
  uploadSingleImage,
  uploadDatasetFiles,
  applyProcessing,
  applyBatchProcessing,
} from './services/api';

export default function App() {
  const [activeCategory, setActiveCategory] = useState(ALGORITHM_CATEGORIES.RESTORATION);
  const [selectedAlgoKey, setSelectedAlgoKey] = useState('gaussian_blur');
  const [parameters, setParameters] = useState(ALGORITHMS.gaussian_blur.defaultParams);

  const [currentFile, setCurrentFile] = useState(null);
  const [processedFile, setProcessedFile] = useState(null);
  const [appliedParams, setAppliedParams] = useState(null);
  const [lastAppliedAlgoName, setLastAppliedAlgoName] = useState('');
  const [histogramData, setHistogramData] = useState(null);
  const [isHistModalOpen, setIsHistModalOpen] = useState(false);

  const [dataset, setDataset] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleSelectAlgorithm = (algoKey) => {
    setSelectedAlgoKey(algoKey);
    setParameters(ALGORITHMS[algoKey].defaultParams || {});
  };

  const handleSelectCategory = (catId) => {
    setActiveCategory(catId);
    if (catId !== 'dataset') {
      const firstInCat = Object.values(ALGORITHMS).find((a) => a.category === catId);
      if (firstInCat) {
        setSelectedAlgoKey(firstInCat.id);
        setParameters(firstInCat.defaultParams || {});
      }
    }
  };

  const handleParameterChange = (paramKey, value) => {
    setParameters((prev) => ({
      ...prev,
      [paramKey]: value,
    }));
  };

  const handleUploadSingle = async (file) => {
    setIsLoading(true);
    setStatusMessage('Uploading image...');
    try {
      const res = await uploadSingleImage(file);
      setCurrentFile({
        filename: res.filename,
        url: res.url,
        dimensions: res.dimensions,
        file_type: res.file_type,
        source_type: 'uploads',
      });
      setProcessedFile(null);
      setHistogramData(null);
      setAppliedParams(null);
      setLastAppliedAlgoName('');
      setStatusMessage('Image uploaded successfully.');
    } catch (err) {
      alert(`Error uploading file: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUploadDataset = async (files) => {
    setIsLoading(true);
    setStatusMessage('Unpacking dataset...');
    try {
      const res = await uploadDatasetFiles(files);
      setDataset(res.dataset);
      setActiveCategory('dataset');
      if (res.dataset.length > 0) {
        const first = res.dataset[0];
        setCurrentFile({
          filename: first.filename,
          url: first.url,
          dimensions: first.dimensions,
          file_type: 'DATASET',
          source_type: 'datasets',
        });
        setProcessedFile(null);
      }
      setStatusMessage(`Dataset loaded: ${res.dataset.length} images.`);
    } catch (err) {
      alert(`Dataset error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyTransform = async () => {
    if (!currentFile) return;
    setIsLoading(true);
    setStatusMessage(`Applying ${ALGORITHMS[selectedAlgoKey].name}...`);
    try {
      const res = await applyProcessing(
        currentFile.filename,
        currentFile.source_type || 'uploads',
        selectedAlgoKey,
        parameters
      );
      setProcessedFile({
        filename: res.processed_filename,
        url: `${res.processed_url}?t=${Date.now()}`,  // <--- Forces browser to reload
        dimensions: res.dimensions,
      });
      setHistogramData(res.histogram_data);
      setAppliedParams({ ...parameters });
      setLastAppliedAlgoName(ALGORITHMS[selectedAlgoKey].name);
      setStatusMessage('Operation applied.');
    } catch (err) {
      alert(`Processing error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setProcessedFile(null);
    setHistogramData(null);
    setAppliedParams(null);
    setLastAppliedAlgoName('');
  };

  const handleDownload = () => {
    if (!processedFile) return;
    window.location.href = `/api/download?filename=${encodeURIComponent(processedFile.filename)}`;
  };

  const handleSelectDatasetImage = (item) => {
    setCurrentFile({
      filename: item.filename,
      url: item.url,
      dimensions: item.dimensions,
      file_type: 'DATASET',
      source_type: 'datasets',
    });
    setProcessedFile(null);
    setHistogramData(null);
  };

  const handleBatchProcess = async () => {
    if (!dataset || dataset.length === 0) return;
    setIsLoading(true);
    setStatusMessage('Running batch transformation across dataset...');
    try {
      const filenames = dataset.map((d) => d.filename);
      const res = await applyBatchProcessing(filenames, selectedAlgoKey, parameters);
      alert(res.message + '. You can now click "Download All (ZIP)" to retrieve the batch archive.');
    } catch (err) {
      alert(`Batch processing error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadBatch = () => {
    window.location.href = '/api/download-batch';
  };

  const filteredAlgorithms = Object.values(ALGORITHMS).filter(
    (alg) => activeCategory === 'dataset' || alg.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-warm-cream flex flex-col selection:bg-mandarin selection:text-warm-cream">
      <Header
        onUploadSingle={handleUploadSingle}
        onUploadDataset={handleUploadDataset}
        isLoading={isLoading}
      />

      <div className="flex-1 flex flex-col md:flex-row">
        <Sidebar
          activeCategory={activeCategory}
          onSelectCategory={handleSelectCategory}
          datasetCount={dataset.length}
        />

        <main className="flex-1 p-5 max-w-7xl mx-auto w-full flex flex-col gap-5">
          {statusMessage && (
            <div className="text-xs font-medium text-deep-brown/80 bg-onion-peel/60 px-3 py-1.5 rounded border border-muted-beige flex items-center justify-between">
              <span>Status: {statusMessage}</span>
              {isLoading && <span className="animate-pulse font-bold text-mandarin">Processing...</span>}
            </div>
          )}

          {activeCategory === 'dataset' ? (
            <DatasetGallery
              dataset={dataset}
              selectedFilename={currentFile?.filename}
              onSelectImage={handleSelectDatasetImage}
              onBatchProcess={handleBatchProcess}
              onDownloadBatch={handleDownloadBatch}
              isProcessing={isLoading}
              selectedAlgoName={ALGORITHMS[selectedAlgoKey]?.name}
            />
          ) : null}

          <Controls
            algorithms={filteredAlgorithms}
            selectedAlgoKey={selectedAlgoKey}
            onSelectAlgorithm={handleSelectAlgorithm}
            parameters={parameters}
            onParameterChange={handleParameterChange}
            onApply={handleApplyTransform}
            onReset={handleReset}
            onDownload={handleDownload}
            onOpenHistogram={() => setIsHistModalOpen(true)}
            hasProcessed={!!processedFile}
            isLoading={isLoading}
            canProcess={!!currentFile}
          />

          <Workspace
            originalUrl={currentFile ? currentFile.url : null}
            processedUrl={processedFile ? processedFile.url : null}
            originalMeta={currentFile ? currentFile.dimensions : null}
            processedMeta={processedFile ? processedFile.dimensions : null}
            activeAlgorithmName={lastAppliedAlgoName}
            appliedParameters={appliedParams}
          />
        </main>
      </div>

      <HistogramModal
        isOpen={isHistModalOpen}
        onClose={() => setIsHistModalOpen(false)}
        histogramBase64={histogramData}
      />
    </div>
  );
}
