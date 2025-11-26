import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <h1 className="text-6xl font-bold text-slate-300 mb-4">404</h1>
      <h2 className="text-2xl font-semibold text-slate-700 mb-2">Page Not Found</h2>
      <p className="text-slate-500 mb-6">The page you are looking for does not exist.</p>
      <Link to="/" className="text-blue-600 hover:underline">
        Go back to Dashboard
      </Link>
    </div>
  );
};

export default NotFoundPage;
