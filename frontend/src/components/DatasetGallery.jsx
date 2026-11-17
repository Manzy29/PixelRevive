import React from 'react';
import { Layers, Play, DownloadCloud } from 'lucide-react';

export default function DatasetGallery({
  dataset,
  selectedFilename,
  onSelectImage,
  onBatchProcess,
  onDownloadBatch,
  isProcessing,
  selectedAlgoName,
}) {
  if (!dataset || dataset.length === 0) {
    return (
      <div className="bg-onion-peel/30 border border-muted-beige rounded-lg p-10 text-center text-deep-brown">
        <Layers className="w-12 h-12 mx-auto mb-3 text-muted-beige" />
        <h3 className="font-bold text-base">No Dataset Images Available</h3>
        <p className="text-xs text-deep-brown/70 mt-1 max-w-sm mx-auto">
          Click the "Upload Dataset" button in the navigation header to import a ZIP file or multiple images at once.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-onion-peel/30 border border-muted-beige rounded-lg p-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-muted-beige gap-3">
        <div>
          <h2 className="text-base font-bold text-deep-brown flex items-center space-x-2">
            <span>Dataset Gallery ({dataset.length} Images)</span>
          </h2>
          <p className="text-xs text-deep-brown/70">
            Click any thumbnail to load it into the workspace, or run a batch transformation on all images.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onBatchProcess}
            disabled={isProcessing}
            className="flex items-center space-x-1.5 bg-mandarin hover:bg-[#d66928] text-warm-cream px-3 py-1.5 rounded text-xs font-semibold disabled:opacity-50"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Batch Apply: {selectedAlgoName}</span>
          </button>
          <button
            onClick={onDownloadBatch}
            className="flex items-center space-x-1.5 bg-deep-brown hover:bg-[#39241e] text-warm-cream px-3 py-1.5 rounded text-xs font-semibold"
          >
            <DownloadCloud className="w-3.5 h-3.5" />
            <span>Download All (ZIP)</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-4 max-h-96 overflow-y-auto p-1">
        {dataset.map((item) => {
          const isSelected = item.filename === selectedFilename;
          return (
            <div
              key={item.filename}
              onClick={() => onSelectImage(item)}
              className={`cursor-pointer rounded border p-1 transition-all ${
                isSelected
                  ? 'border-mandarin ring-2 ring-mandarin bg-warm-cream'
                  : 'border-muted-beige bg-warm-cream/60 hover:bg-warm-cream'
              }`}
            >
              <div className="w-full h-24 bg-onion-peel/40 rounded flex items-center justify-center overflow-hidden">
                <img
                  src={item.url}
                  alt={item.filename}
                  className="max-h-full max-w-full object-cover"
                />
              </div>
              <p className="text-[10px] font-mono text-deep-brown truncate mt-1">
                {item.filename}
              </p>
              <p className="text-[9px] text-deep-brown/60">
                {item.dimensions.width}×{item.dimensions.height}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
