// ============================================
// Navbar Component — Single Dark Theme
// ============================================

import React, { useState } from 'react';
import { WiDaySunny } from 'react-icons/wi';
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import AccountPanel from './AccountPanel';

const Navbar = ({ onShowAuth }) => {
  const { isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="relative z-50 px-4 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <WiDaySunny className="text-yellow-300 text-4xl" />
          <div>
            <h1 className="text-white font-bold text-xl leading-tight">AI Weather</h1>
            <p className="text-blue-200 text-xs">Dashboard</p>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            // AccountPanel replaces the plain name — it's a full clickable dropdown
            <AccountPanel />
          ) : (
            <button
              onClick={onShowAuth}
              className="bg-white/20 hover:bg-white/30 text-white rounded-full px-5 py-2 font-medium text-sm transition-all backdrop-blur-sm border border-white/20"
            >
              Login / Register
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX className="text-xl" /> : <FiMenu className="text-xl" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden mt-3 glass rounded-2xl p-4 mx-4 animate-fade-in">
          {isAuthenticated ? (
            // On mobile show AccountPanel inline too
            <AccountPanel />
          ) : (
            <button
              onClick={() => { onShowAuth(); setMenuOpen(false); }}
              className="text-white font-medium py-2 text-left w-full"
            >
              Login / Register
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
