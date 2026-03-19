import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// Floating particle component
const Particle = ({ style }) => (
  <div
    className="absolute rounded-full pointer-events-none"
    style={{
      width: style.size,
      height: style.size,
      left: style.left,
      top: style.top,
      background: style.color,
      opacity: style.opacity,
      animation: `twinkle ${style.duration}s ease-in-out infinite`,
      animationDelay: style.delay,
      filter: 'blur(1px)',
    }}
  />
);

const particles = Array.from({ length: 30 }, (_, i) => ({
  size: `${Math.random() * 4 + 2}px`,
  left: `${Math.random() * 100}%`,
  top: `${Math.random() * 100}%`,
  color: ['#6366f1','#8b5cf6','#a855f7','#ec4899','#3b82f6'][Math.floor(Math.random() * 5)],
  opacity: Math.random() * 0.6 + 0.2,
  duration: Math.random() * 3 + 2,
  delay: `${Math.random() * 3}s`,
}));

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [focused, setFocused] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center px-4 relative overflow-hidden">

      {/* Animated orbs */}
      <div className="orb w-96 h-96 bg-indigo-600 top-[-10%] left-[-10%] animate-float" />
      <div className="orb w-80 h-80 bg-purple-600 bottom-[-10%] right-[-5%]" style={{ animation: 'float 8s ease-in-out infinite reverse' }} />
      <div className="orb w-64 h-64 bg-pink-600 top-[40%] right-[10%]" style={{ animation: 'float 10s ease-in-out infinite', animationDelay: '2s' }} />

      {/* Particles */}
      {particles.map((p, i) => <Particle key={i} style={p} />)}

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '50px 50px' }}
      />

      {/* Card */}
      <div className={`relative w-full max-w-md transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

        {/* Glow ring behind card */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-xl scale-105" />

        <div className="relative glass-strong rounded-3xl p-8 shadow-2xl">

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl btn-gradient flex items-center justify-center mb-4 animate-pulse-glow">
              <span className="text-3xl relative z-10">💰</span>
            </div>
            <h1 className="text-3xl font-black gradient-text">Welcome Back</h1>
            <p className="text-zinc-400 text-sm mt-1">Sign in to your expense tracker</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {/* Email field */}
            <div className={`relative transition-all duration-300 ${focused === 'email' ? 'scale-[1.01]' : ''}`}>
              <div className={`absolute left-4 top-1/2 -translate-y-1/2 text-lg transition-colors duration-200 ${focused === 'email' ? 'text-indigo-400' : 'text-zinc-500'}`}>
                ✉️
              </div>
              <input
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                onFocus={() => setFocused('email')}
                onBlur={() => setFocused('')}
                className="w-full bg-white/5 border border-white/10 text-white rounded-2xl pl-12 pr-4 py-3.5 outline-none input-glow transition-all duration-200 placeholder-zinc-500 text-sm"
                required
              />
            </div>

            {/* Password field */}
            <div className={`relative transition-all duration-300 ${focused === 'password' ? 'scale-[1.01]' : ''}`}>
              <div className={`absolute left-4 top-1/2 -translate-y-1/2 text-lg transition-colors duration-200 ${focused === 'password' ? 'text-indigo-400' : 'text-zinc-500'}`}>
                🔒
              </div>
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                onFocus={() => setFocused('password')}
                onBlur={() => setFocused('')}
                className="w-full bg-white/5 border border-white/10 text-white rounded-2xl pl-12 pr-12 py-3.5 outline-none input-glow transition-all duration-200 placeholder-zinc-500 text-sm"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors text-sm"
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-gradient btn-lift w-full text-white font-bold py-3.5 rounded-2xl mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="relative z-10">Signing in...</span>
                </>
              ) : (
                <span className="relative z-10">Sign In →</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-zinc-500 text-xs">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <p className="text-zinc-400 text-center text-sm">
            No account?{' '}
            <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors hover:underline">
              Create one free →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
