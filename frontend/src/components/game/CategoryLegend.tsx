'use client';

import { CATEGORY_CONFIG } from '@/lib/constants';

export function CategoryLegend() {
  const categories = Object.entries(CATEGORY_CONFIG);

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-4">
      {categories.map(([key, config]) => (
        <div 
          key={key}
          className={`bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2 border ${config.borderColor} flex items-center gap-2`}
        >
          <span className="text-lg">{config.icon}</span>
          <span className={`${config.textColor} text-sm`}>{config.name}</span>
        </div>
      ))}
    </div>
  );
}
