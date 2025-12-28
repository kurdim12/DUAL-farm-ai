import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/charts', label: 'Live Charts' },
    { path: '/control', label: 'Control Panel' },
    { path: '/alerts', label: 'Alerts' },
    { path: '/reports', label: 'Reports' },
    { path: '/about', label: 'About' },
  ];

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <span className="text-2xl">🌱</span>
              <span className="text-xl font-bold text-primary">DualFarm</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">👤 {username}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Demo Mode Banner */}
      <div className="bg-yellow-50 border-b border-yellow-200 py-2 px-4">
        <p className="text-center text-sm text-yellow-800">
          <span className="font-semibold">🚧 DEMO MODE</span> - This is a demonstration system for RoboCraft competition
        </p>
      </div>
    </nav>
  );
};

export default Navbar;
