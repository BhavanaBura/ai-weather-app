// ============================================
// AuthModal Component - Login & Register
// ============================================

import React, { useState } from 'react';
import { FiX, FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import { WiDaySunny } from 'react-icons/wi';
import { useAuth } from '../context/AuthContext';

const AuthModal = ({ onClose }) => {
  // mode is either 'login' or 'register'
  const [mode, setMode] = useState('login');
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { login, register } = useAuth();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    setError('');
    setSuccess('');
    setFormData({ name: '', email: '', password: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (mode === 'login') {
        const res = await login(formData.email, formData.password);
        setSuccess(res.message || 'Logged in successfully!');
        setTimeout(() => onClose(), 800);
      } else {
        if (!formData.name.trim()) {
          setError('Please enter your full name');
          setLoading(false);
          return;
        }
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        const res = await register(formData.name, formData.email, formData.password);
        setSuccess(res.message || 'Account created successfully!');
        setTimeout(() => onClose(), 800);
      }
    } catch (err) {
      const msg = err.response?.data?.message || '';
      if (!msg) {
        setError('Cannot reach the server. Make sure the backend is running on port 5000.');
      } else if (msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('password')) {
        setError('Wrong email or password. Please check your details and try again.');
      } else if (msg.toLowerCase().includes('exists') || msg.toLowerCase().includes('duplicate')) {
        setError('This email is already registered. Try logging in instead.');
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // Full-screen backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(12px)' }}
    >
      {/* Modal card — fixed dark theme */}
      <div
        className="w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-slide-up"
        style={{ background: '#0f172a', border: '1px solid rgba(148,163,184,0.15)' }}
      >

        {/* ---- Gradient Header ---- */}
        <div
          className="relative p-7 pb-6"
          style={{ background: 'linear-gradient(135deg, #1d4ed8 0%, #7c3aed 50%, #db2777 100%)' }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-all"
          >
            <FiX className="text-lg" />
          </button>

          <WiDaySunny className="text-yellow-300 text-5xl mb-3" />
          <h2 className="text-white text-2xl font-bold">
            {mode === 'login' ? 'Welcome Back! 👋' : 'Create Account ✨'}
          </h2>
          <p className="text-blue-100 text-sm mt-1">
            {mode === 'login'
              ? 'Login to save cities and access your weather dashboard'
              : 'Create a free account to unlock all features'}
          </p>
        </div>

        {/* ---- Form Area ---- */}
        <div className="p-7 pt-6">

          {/* Success Banner */}
          {success && (
            <div
              className="mb-4 p-3 rounded-2xl text-sm flex items-center gap-2 font-medium"
              style={{ background: '#052e16', color: '#4ade80', border: '1px solid #166534' }}
            >
              <FiCheck /> {success}
            </div>
          )}

          {/* Error Banner */}
          {error && (
            <div
              className="mb-4 p-4 rounded-2xl text-sm"
              style={{ background: '#1a0a0a', color: '#f87171', border: '1px solid #7f1d1d' }}
            >
              <p className="font-semibold mb-0.5">⚠️ {mode === 'login' ? 'Login Failed' : 'Registration Failed'}</p>
              <p className="text-xs opacity-90 leading-relaxed">{error}</p>
            </div>
          )}

          {/* First-time user hint on login screen */}
          {mode === 'login' && !error && !success && (
            <div
              className="mb-4 p-3 rounded-xl text-xs"
              style={{ background: 'rgba(59,130,246,0.1)', color: '#93c5fd', border: '1px solid rgba(59,130,246,0.2)' }}
            >
              💡 <strong>New here?</strong> Click <button
                onClick={() => switchMode('register')}
                className="underline font-bold text-blue-300"
              >Register</button> below to create your free account first.
            </div>
          )}

          {/* ---- Form ---- */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name — only on Register */}
            {mode === 'register' && (
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-base" />
                <input
                  type="text" name="name" value={formData.name}
                  onChange={handleChange} placeholder="Your full name" required
                  className="w-full pl-12 pr-4 py-4 rounded-2xl text-sm font-medium outline-none transition-all"
                  style={{
                    background: '#1e293b',
                    color: '#f1f5f9',
                    border: '2px solid #334155',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#3b82f6'; }}
                  onBlur={e => { e.target.style.borderColor = '#334155'; }}
                />
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-base" />
              <input
                type="email" name="email" value={formData.email}
                onChange={handleChange} placeholder="Email address" required
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-sm font-medium outline-none transition-all"
                style={{ background: '#1e293b', color: '#f1f5f9', border: '2px solid #334155' }}
                onFocus={e => { e.target.style.borderColor = '#3b82f6'; }}
                onBlur={e => { e.target.style.borderColor = '#334155'; }}
              />
            </div>

            {/* Password */}
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-base" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password" value={formData.password}
                onChange={handleChange}
                placeholder={mode === 'register' ? 'Password (min 6 characters)' : 'Your password'}
                required
                className="w-full pl-12 pr-12 py-4 rounded-2xl text-sm font-medium outline-none transition-all"
                style={{ background: '#1e293b', color: '#f1f5f9', border: '2px solid #334155' }}
                onFocus={e => { e.target.style.borderColor = '#3b82f6'; }}
                onBlur={e => { e.target.style.borderColor = '#334155'; }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-400 transition-colors"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-2xl text-white font-bold text-base transition-all disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg, #2563eb, #7c3aed)' }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                  {mode === 'login' ? 'Logging in...' : 'Creating account...'}
                </span>
              ) : (
                mode === 'login' ? '🔓 Login to My Account' : '🚀 Create My Free Account'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 border-t" style={{ borderColor: '#1e293b' }} />
            <span className="text-slate-600 text-xs">or</span>
            <div className="flex-1 border-t" style={{ borderColor: '#1e293b' }} />
          </div>

          {/* Switch between Login / Register */}
          <p className="text-center text-slate-500 text-sm">
            {mode === 'login' ? 'New here? ' : 'Already have an account? '}
            <button
              onClick={() => switchMode(mode === 'login' ? 'register' : 'login')}
              className="font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              {mode === 'login' ? '→ Create Free Account' : '→ Login Instead'}
            </button>
          </p>

        </div>
      </div>
    </div>
  );
};

export default AuthModal;
