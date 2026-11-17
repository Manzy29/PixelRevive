import React from 'react';
import { X, BarChart2 } from 'lucide-react';

export default function HistogramModal({ isOpen, onClose, histogramBase64 }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-deep-brown/60 flex items-center justify-center p-4">
      <div className="bg-warm-cream border border-muted-beige rounded-lg shadow-xl max-w-3xl w-full p-5 overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-muted-beige">
          <div className="flex items-center space-x-2 text-deep-brown">
            <BarChart2 className="w-5 h-5 text-mandarin" />
            <h3 className="font-bold text-base">Pixel Intensity Distribution (RGB Histogram)</h3>
          </div>
          <button
            onClick={onClose}
            className="text-deep-brown/70 hover:text-deep-brown p-1 rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="py-4 flex justify-center">
          {histogramBase64 ? (
            <img
              src={histogramBase64}
              alt="Histogram Comparison"
              className="max-w-full rounded border border-muted-beige"
            />
          ) : (
            <p className="text-xs text-deep-brown/60">No histogram data generated yet.</p>
          )}
        </div>

        <div className="bg-onion-peel/40 p-3 rounded text-xs text-deep-brown space-y-1">
          <p className="font-semibold">Educational Interpretation:</p>
          <p>
            The horizontal axis represents the 8-bit discrete intensity range [0–255], while the vertical axis depicts the raw count of pixels for Blue, Green, and Red channels.
          </p>
        </div>
      </div>
    </div>
  );
}
