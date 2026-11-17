import React from 'react';
import { Play, RotateCcw, Download, BarChart2 } from 'lucide-react';
import { ALGORITHMS } from '../data/algorithms';

export default function Controls({
  algorithms,
  selectedAlgoKey,
  onSelectAlgorithm,
  parameters,
  onParameterChange,
  onApply,
  onReset,
  onDownload,
  onOpenHistogram,
  hasProcessed,
  isLoading,
  canProcess,
}) {
  const currentAlgo = ALGORITHMS[selectedAlgoKey] || algorithms[0];

  return (
    <div className="bg-onion-peel/40 border border-muted-beige rounded-lg p-5 flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-muted-beige/60 pb-4">
        <div className="flex-1">
          <label className="block text-xs font-bold uppercase tracking-wider text-deep-brown mb-1">
            Select Algorithm
          </label>
          <select
            value={selectedAlgoKey}
            onChange={(e) => onSelectAlgorithm(e.target.value)}
            className="w-full bg-warm-cream border border-muted-beige rounded px-3 py-2 text-sm font-medium text-deep-brown focus:outline-none focus:ring-2 focus:ring-mandarin"
          >
            {algorithms.map((alg) => (
              <option key={alg.id} value={alg.id}>
                {alg.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center space-x-2 pt-2 sm:pt-4">
          <button
            onClick={onApply}
            disabled={!canProcess || isLoading}
            className="flex items-center space-x-1 bg-mandarin hover:bg-[#d66928] text-warm-cream px-4 py-2 rounded text-sm font-semibold transition disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isLoading ? 'Processing...' : 'Apply Transform'}</span>
          </button>

          <button
            onClick={onReset}
            disabled={!hasProcessed || isLoading}
            className="flex items-center space-x-1 bg-onion-peel hover:bg-muted-beige text-deep-brown px-3 py-2 rounded text-sm font-semibold transition disabled:opacity-50 border border-muted-beige"
            title="Reset to Original"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset</span>
          </button>

          <button
            onClick={onDownload}
            disabled={!hasProcessed || isLoading}
            className="flex items-center space-x-1 bg-deep-brown hover:bg-[#39241e] text-warm-cream px-3 py-2 rounded text-sm font-semibold transition disabled:opacity-50"
            title="Download PNG Result"
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>

          {hasProcessed && (
            <button
              onClick={onOpenHistogram}
              className="flex items-center space-x-1 bg-onion-peel hover:bg-muted-beige text-deep-brown px-3 py-2 rounded text-sm font-semibold transition border border-muted-beige"
              title="View Comparative Histogram"
            >
              <BarChart2 className="w-4 h-4 text-mandarin" />
              <span>Histogram</span>
            </button>
          )}
        </div>
      </div>

      {currentAlgo.controls && currentAlgo.controls.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentAlgo.controls.map((ctrl) => {
            const val = parameters[ctrl.key] ?? ctrl.min;
            return (
              <div key={ctrl.key} className="bg-warm-cream/80 p-3 rounded border border-muted-beige/60">
                <div className="flex justify-between text-xs font-semibold text-deep-brown mb-1.5">
                  <span>{ctrl.label}</span>
                  <span className="font-mono text-mandarin font-bold">{val}</span>
                </div>
                <input
                  type={ctrl.type}
                  min={ctrl.min}
                  max={ctrl.max}
                  step={ctrl.step}
                  value={val}
                  onChange={(e) =>
                    onParameterChange(
                      ctrl.key,
                      ctrl.step % 1 === 0 ? parseInt(e.target.value, 10) : parseFloat(e.target.value)
                    )
                  }
                  className="w-full cursor-pointer"
                />
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs italic text-deep-brown/70 bg-warm-cream/50 p-2 rounded border border-muted-beige/40">
          No adjustable hyper-parameters required for this point/matrix transformation.
        </p>
      )}

      <div className="bg-warm-cream border-l-4 border-mandarin p-3.5 rounded text-xs leading-relaxed space-y-1">
        <p className="font-bold text-deep-brown text-sm">{currentAlgo.name}</p>
        <p className="text-deep-brown/90">{currentAlgo.description}</p>
        <p className="text-deep-brown/80">
          <strong className="text-deep-brown">Academic Principle:</strong> {currentAlgo.educationalPurpose}
        </p>
        <p className="text-deep-brown/80">
          <strong className="text-deep-brown">Parameters:</strong> {currentAlgo.parameterGuide}
        </p>
      </div>
    </div>
  );
}
