'use client';

import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b relative" style={{ borderColor: 'var(--secondary)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-bold" style={{ color: 'var(--signature)' }}>
              Rizzler.in
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a
                href="/"
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-100"
                style={{ color: 'var(--foreground)' }}
              >
                Home
              </a>
              <a
                href="/about"
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-100"
                style={{ color: 'var(--foreground)' }}
              >
                About
              </a>
              <a
                href="/contact"
                className="px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-gray-100"
                style={{ color: 'var(--foreground)' }}
              >
                Contact
              </a>
              <a
                href="/login"
                className="px-3 py-2 rounded-md text-sm font-medium text-white transition-colors duration-200 hover:shadow-md"
                style={{ 
                  backgroundColor: 'var(--signature)',
                  backgroundImage: 'linear-gradient(135deg, var(--signature) 0%, var(--signature-2) 100%)'
                }}
              >
                Login
              </a>
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md transition-all duration-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 hover:scale-110"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger icon */}
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6 transition-all duration-300`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{ color: 'var(--foreground)' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Close icon */}
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6 transition-all duration-300`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{ color: 'var(--foreground)' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div 
        className={`md:hidden fixed inset-0 z-40 transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Mobile menu */}
      <div 
        className={`md:hidden fixed top-0 right-0 h-full w-80 max-w-sm z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full bg-white shadow-xl border-l" style={{ borderColor: 'var(--secondary)' }}>
          {/* Menu header */}
          <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--secondary)' }}>
            <h2 className="text-lg font-semibold" style={{ color: 'var(--signature)' }}>
              Menu
            </h2>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                style={{ color: 'var(--foreground)' }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Menu items */}
          <nav className="px-4 py-6 space-y-2">
            <a
              href="/"
              className="flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 hover:bg-gray-100 hover:scale-105 transform"
              style={{ color: 'var(--foreground)' }}
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </a>
            <a
              href="/about"
              className="flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 hover:bg-gray-100 hover:scale-105 transform"
              style={{ color: 'var(--foreground)' }}
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </a>
            <a
              href="/contact"
              className="flex items-center px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 hover:bg-gray-100 hover:scale-105 transform"
              style={{ color: 'var(--foreground)' }}
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </a>
            <div className="pt-4">
              <a
                href="/login"
                className="flex items-center justify-center px-4 py-3 rounded-lg text-base font-medium text-white transition-all duration-200 hover:shadow-lg hover:scale-105 transform"
                style={{ 
                  backgroundColor: 'var(--signature)',
                  backgroundImage: 'linear-gradient(135deg, var(--signature) 0%, var(--signature-2) 100%)'
                }}
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </a>
            </div>
          </nav>

          {/* Menu footer */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t" style={{ borderColor: 'var(--secondary)' }}>
            <div className="text-center">
              <p className="text-xs" style={{ color: 'var(--foreground)' }}>
                © 2025 Rizzler.in
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
