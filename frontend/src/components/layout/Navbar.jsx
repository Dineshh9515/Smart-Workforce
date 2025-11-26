import React from 'react';
import { FaUserCircle, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center">
          <h1 className="text-xl font-bold text-slate-800 lg:hidden">Smart Workforce</h1>
          {/* Mobile menu button could go here */}
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-slate-500 hidden md:block">
            {new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-slate-700">{user?.name || user?.email || 'User'}</span>
              <FaUserCircle className="text-slate-400 text-2xl" />
            </div>
            <button 
              onClick={handleLogout}
              className="text-slate-500 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <FaSignOutAlt className="text-xl" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
