import React from 'react';
import { clsx } from 'clsx';

const PillFilter = ({ options, active, onChange }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={clsx(
            'px-3 py-1 rounded-full text-xs font-medium transition-colors border',
            active === option.value
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default PillFilter;
