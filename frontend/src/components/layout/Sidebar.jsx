import React from 'react';
import { NavLink } from 'react-router-dom';
import { MdDashboard, MdPeople, MdPrecisionManufacturing, MdWork, MdEventAvailable, MdMap } from 'react-icons/md';
import { clsx } from 'clsx';

const Sidebar = () => {
  const navItems = [
    { path: '/', label: 'Dashboard', icon: MdDashboard },
    { path: '/technicians', label: 'Technicians', icon: MdPeople },
    { path: '/assets', label: 'Assets', icon: MdPrecisionManufacturing },
    { path: '/locations', label: 'Locations', icon: MdMap },
    { path: '/jobs', label: 'Jobs', icon: MdWork },
    { path: '/availability', label: 'Availability', icon: MdEventAvailable },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-slate-900 text-white transition-all duration-300">
      <div className="flex items-center justify-center h-16 border-b border-slate-800">
        <span className="text-lg font-bold tracking-wide">Smart Workforce</span>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center px-6 py-3 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-blue-600 text-white border-r-4 border-blue-400'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  )
                }
              >
                <item.icon className="mr-3 text-lg" />
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t border-slate-800">
        <div className="text-xs text-slate-500 text-center">
          &copy; 2025 Engineering Co.
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
