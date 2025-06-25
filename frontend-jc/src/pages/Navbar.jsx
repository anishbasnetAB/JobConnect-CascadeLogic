import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    setMobileNavOpen(false);
    navigate('/login');
  };

  const navLinks = () => {
    if (!user) {
      return [{ text: 'Register', to: '/signup' }];
    }
    if (user.userType === 'jobseeker') {
      return [
        { text: 'Jobs', to: '/jobs' },
        { text: 'My Applications', to: '/applications' },
        { text: 'Saved Jobs', to: '/saved-jobs' },
        { text: 'Blogs', to: '/blogs' }
      ];
    }
    if (user.userType === 'employer') {
      return [
        { text: 'Dashboard', to: '/dashboard' },
        { text: 'Post Job', to: '/employer/post-job' },
        { text: 'My Jobs', to: '/employer/my-jobs' },
        { text: 'Create Blog', to: '/blogs/create' },
        { text: 'Blogs', to: '/blogs' }
      ];
    }
    return [];
  };

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-lg font-bold text-black">
          JobConnect
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center space-x-6">
          {navLinks().map((item) => (
            <Link
              key={item.text}
              to={item.to}
              className="text-sm text-gray-700 hover:text-black font-medium"
            >
              {item.text}
            </Link>
          ))}
          {!user && (
            <Link
              to="/login"
              className="bg-gray-100 hover:bg-gray-200 text-sm px-4 py-1.5 rounded font-medium"
            >
              Sign In
            </Link>
          )}
          {user && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-black"
              >
                👤
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded shadow z-10">
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="text-black focus:outline-none"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile menu links */}
      {mobileNavOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 space-y-1 py-2">
          {navLinks().map((item) => (
            <Link
              key={item.text}
              to={item.to}
              onClick={() => setMobileNavOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              {item.text}
            </Link>
          ))}
          {!user && (
            <Link
              to="/login"
              onClick={() => setMobileNavOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Sign In
            </Link>
          )}
          {user && (
            <>
              <Link
                to="/profile"
                onClick={() => setMobileNavOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Edit Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
