import React from 'react';
import { RefreshCw, Palette, Sliders, Layers } from 'lucide-react';
import { ALGORITHM_CATEGORIES } from '../data/algorithms';

export default function Sidebar({ activeCategory, onSelectCategory, datasetCount }) {
  const navItems = [
    {
      id: ALGORITHM_CATEGORIES.RESTORATION,
      label: 'Image Restoration',
      icon: RefreshCw,
      desc: 'Filtering & Noise Simulation',
    },
    {
      id: ALGORITHM_CATEGORIES.COLOUR,
      label: 'Colour Transformations',
      icon: Palette,
      desc: 'HSV, LAB, Gray & Affine Ops',
    },
    {
      id: ALGORITHM_CATEGORIES.ENHANCEMENT,
      label: 'Image Enhancement',
      icon: Sliders,
      desc: 'Equalization, LUT & Normalization',
    },
    {
      id: 'dataset',
      label: 'Dataset Gallery',
      icon: Layers,
      desc: `${datasetCount} images in memory`,
      badge: datasetCount > 0 ? datasetCount : null,
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-onion-peel/60 border-r border-muted-beige p-4 flex flex-col space-y-2">
      <div className="text-xs uppercase font-bold text-deep-brown tracking-wider px-3 mb-2">
        Modules
      </div>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeCategory === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onSelectCategory(item.id)}
            className={`w-full text-left p-3 rounded-lg flex items-start space-x-3 transition-colors ${
              isActive
                ? 'bg-deep-brown text-warm-cream shadow-sm'
                : 'hover:bg-onion-peel text-deep-brown'
            }`}
          >
            <Icon className={`w-5 h-5 mt-0.5 ${isActive ? 'text-mandarin' : 'text-deep-brown'}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm">{item.label}</span>
                {item.badge !== null && (
                  <span className="text-xs px-2 py-0.5 rounded-full bg-mandarin text-warm-cream font-bold">
                    {item.badge}
                  </span>
                )}
              </div>
              <p className={`text-xs truncate ${isActive ? 'text-muted-beige' : 'text-deep-brown/70'}`}>
                {item.desc}
              </p>
            </div>
          </button>
        );
      })}
    </aside>
  );
}
