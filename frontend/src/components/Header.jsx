import React, { useRef } from 'react';
import { Sparkles, Upload, FolderUp } from 'lucide-react';

export default function Header({ onUploadSingle, onUploadDataset, isLoading }) {
  const singleInputRef = useRef(null);
  const datasetInputRef = useRef(null);

  const handleSingleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onUploadSingle(e.target.files[0]);
    }
  };

  const handleDatasetChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onUploadDataset(e.target.files);
    }
  };

  return (
    <header className="bg-deep-brown text-warm-cream px-6 py-4 shadow-sm flex flex-wrap items-center justify-between border-b border-muted-beige/30">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-mandarin rounded-md text-warm-cream">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-wide text-warm-cream">PixelRevive</h1>
          <p className="text-xs text-muted-beige font-medium">
            Image Restoration & Colour Transformation Studio
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3 mt-3 sm:mt-0">
        <input
          type="file"
          ref={singleInputRef}
          onChange={handleSingleChange}
          accept="image/png, image/jpeg, image/jpg"
          className="hidden"
        />
        <button
          disabled={isLoading}
          onClick={() => singleInputRef.current.click()}
          className="flex items-center space-x-2 bg-mandarin hover:bg-[#d66928] text-warm-cream px-4 py-2 rounded font-medium text-sm transition-colors duration-150 disabled:opacity-50"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Image</span>
        </button>

        <input
          type="file"
          ref={datasetInputRef}
          onChange={handleDatasetChange}
          multiple
          accept=".zip, image/png, image/jpeg, image/jpg"
          className="hidden"
        />
        <button
          disabled={isLoading}
          onClick={() => datasetInputRef.current.click()}
          className="flex items-center space-x-2 bg-onion-peel text-deep-brown hover:bg-muted-beige px-4 py-2 rounded font-medium text-sm transition-colors duration-150 disabled:opacity-50"
        >
          <FolderUp className="w-4 h-4" />
          <span>Upload Dataset (ZIP / Multi)</span>
        </button>
      </div>
    </header>
  );
}
