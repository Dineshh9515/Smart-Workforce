import React from 'react';

const DatePicker = ({ label, name, value, onChange, error, required, min, max, ...props }) => {
  // Ensure value is in YYYY-MM-DD format for input type="date"
  const formattedValue = value ? new Date(value).toISOString().split('T')[0] : '';

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type="date"
        id={name}
        name={name}
        value={formattedValue}
        onChange={onChange}
        min={min}
        max={max}
        className={`w-full rounded-md border ${
          error ? 'border-red-500' : 'border-slate-300'
        } px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default DatePicker;
