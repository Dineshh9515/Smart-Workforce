import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Badge = ({ label, variant = 'default', className }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    
    // Status specific mappings
    Available: 'bg-green-100 text-green-800',
    'On Job': 'bg-blue-100 text-blue-800',
    'On Leave': 'bg-yellow-100 text-yellow-800',
    Inactive: 'bg-slate-100 text-slate-800',
    
    Operational: 'bg-green-100 text-green-800',
    'Under Maintenance': 'bg-blue-100 text-blue-800',
    Down: 'bg-red-100 text-red-800',
    Decommissioned: 'bg-slate-100 text-slate-800',
    
    Critical: 'bg-red-100 text-red-800',
    High: 'bg-orange-100 text-orange-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Low: 'bg-green-100 text-green-800',

    Planned: 'bg-slate-100 text-slate-800',
    Assigned: 'bg-blue-100 text-blue-800',
    'In Progress': 'bg-purple-100 text-purple-800',
    Completed: 'bg-green-100 text-green-800',
    Cancelled: 'bg-red-100 text-red-800',
  };

  // Fallback to default if variant key doesn't exist, or check if label matches a key
  const style = variants[variant] || variants[label] || variants.default;

  return (
    <span className={twMerge(clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', style, className))}>
      {label}
    </span>
  );
};

export default Badge;
