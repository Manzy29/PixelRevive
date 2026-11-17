import React from 'react';
import { Image as ImageIcon, ArrowRight } from 'lucide-react';

export default function Workspace({
  originalUrl,
  processedUrl,
  originalMeta,
  processedMeta,
  activeAlgorithmName,
  appliedParameters,
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-4">
      <div className="bg-onion-peel/30 border border-muted-beige rounded-lg p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-muted-beige">
            <span className="font-bold text-xs uppercase tracking-wider text-deep-brown">
              Before (Original Input)
            </span>
            {originalMeta && (
              <span className="text-xs bg-warm-cream px-2 py-0.5 rounded border border-muted-beige font-mono text-deep-brown">
                {originalMeta.width} × {originalMeta.height} px • {originalMeta.file_type || 'IMG'}
              </span>
            )}
          </div>
          <div className="w-full h-80 bg-warm-cream rounded border border-muted-beige/60 flex items-center justify-center overflow-hidden">
            {originalUrl ? (
              <img
                src={originalUrl}
                alt="Original"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="text-center text-deep-brown/60 p-4">
                <ImageIcon className="w-10 h-10 mx-auto mb-2 text-muted-beige" />
                <p className="text-sm font-medium">No image loaded</p>
                <p className="text-xs text-deep-brown/50">Upload an image or pick from dataset</p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-3 text-xs text-deep-brown/70 flex justify-between">
          <span>Source: Unmodified Raw Input</span>
          <span>Status: Read-Only Buffer</span>
        </div>
      </div>

      <div className="bg-onion-peel/30 border border-muted-beige rounded-lg p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-2 mb-3 border-b border-muted-beige">
            <span className="font-bold text-xs uppercase tracking-wider text-mandarin">
              After (Processed Result)
            </span>
            {processedMeta && (
              <span className="text-xs bg-warm-cream px-2 py-0.5 rounded border border-muted-beige font-mono text-deep-brown">
                {processedMeta.width} × {processedMeta.height} px
              </span>
            )}
          </div>
          <div className="w-full h-80 bg-warm-cream rounded border border-muted-beige/60 flex items-center justify-center overflow-hidden">
            {processedUrl ? (
              <img
                src={processedUrl}
                alt="Processed"
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="text-center text-deep-brown/60 p-4">
                <ArrowRight className="w-10 h-10 mx-auto mb-2 text-muted-beige" />
                <p className="text-sm font-medium">Transformation pending</p>
                <p className="text-xs text-deep-brown/50">Choose parameters and click 'Apply Transform'</p>
              </div>
            )}
          </div>
        </div>
        <div className="mt-3 text-xs text-deep-brown/80 flex flex-wrap justify-between gap-1">
          <span>
            Algorithm: <strong>{activeAlgorithmName || 'None'}</strong>
          </span>
          {appliedParameters && Object.keys(appliedParameters).length > 0 && (
            <span className="font-mono text-mandarin text-[11px]">
              {JSON.stringify(appliedParameters)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
