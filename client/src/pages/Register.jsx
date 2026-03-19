import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const steps = [
  { icon: '👤', label: 'Username', field: 'username', type: 'text', placeholder: 'Choose a username' },
  { icon: '✉️', label: 'Email',    field: 'email',    type: 'email', placeholder: 'Your email address' },
  { icon: '🔒', label: 'Password', field: 'password', type: 'password', placeholder: 'Create a strong password' },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState('');
  const [mounted, setMounted] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      toast.success('Account created! 🚀');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const strength = (() => {
    const p = form.password;
    if (!p) return 0;
    let s = 0;
    if (p.length >= 8) s++;
    if (/[A-Z]/.test(p)) s++;
    if (/[0-9]/.test(p)) s++;
    if (/[^A-Za-z0-9]/.test(p)) s++;
    return s;
  })();

  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'][strength];
  const strengthColor = ['', 'bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'][strength];

  return (
    <div className="min-h-screen mesh-bg flex items-center justify-center px-4 relative overflow-hidden">

      {/* Orbs */}
      <div className="orb w-96 h-96 bg-purple-600 top-[-15%] right-[-10%] animate-float" />
      <div className="orb w-72 h-72 bg-indigo-600 bottom-[-10%] left-[-5%]" style={{ animation: 'float 9s ease-in-out infinite reverse' }} />
      <div className="orb w-56 h-56 bg-pink-500 top-[30%] left-[5%]" style={{ animation: 'float 7s ease-in-out infinite', animationDelay: '1s' }} />

      {/* Grid */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '50px 50px' }}
      />

      <div className={`relative w-full max-w-md transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500 opacity-20 blur-xl scale-105" />

        <div className="relative glass-strong rounded-3xl p-8 shadow-2xl">

          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 animate-float"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}>
              <span className="text-3xl">🚀</span>
            </div>
            <h1 className="text-3xl font-black gradient-text">Create Account</h1>
            <p className="text-zinc-400 text-sm mt-1">Start tracking your expenses today</p>
          </div>

          {/* Progress dots */}
          <div className="flex justify-center gap-2 mb-6">
            {steps.map((s, i) => (
              <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${form[s.field] ? 'w-8 bg-indigo-500' : 'w-4 bg-white/10'}`} />
            ))}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {steps.map((s) => (
              <div key={s.field} className={`relative transition-all duration-300 ${focused === s.field ? 'scale-[1.01]' : ''}`}>
                <div className={`absolute left-4 top-1/2 -translate-y-1/2 text-lg transition-colors duration-200 ${focused === s.field ? 'text-indigo-400' : 'text-zinc-500'}`}>
                  {s.icon}
                </div>
                <input
                  type={s.field === 'password' ? (showPass ? 'text' : 'password') : s.type}
                  placeholder={s.placeholder}
                  value={form[s.field]}
                  onChange={e => setForm({ ...form, [s.field]: e.target.value })}
                  onFocus={() => setFocused(s.field)}
                  onBlur={() => setFocused('')}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-2xl pl-12 pr-12 py-3.5 outline-none input-glow transition-all duration-200 placeholder-zinc-500 text-sm"
                  required
                />
                {/* Checkmark when filled */}
                {form[s.field] && s.field !== 'password' && (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400 text-sm animate-scale-in">✓</div>
                )}
                {s.field === 'password' && (
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors text-sm">
                    {showPass ? '🙈' : '👁️'}
                  </button>
                )}
              </div>
            ))}

            {/* Password strength */}
            {form.password && (
              <div className="animate-slide-up">
                <div className="flex gap-1 mb-1">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`flex-1 h-1 rounded-full transition-all duration-300 ${i <= strength ? strengthColor : 'bg-white/10'}`} />
                  ))}
                </div>
                <p className={`text-xs ${['','text-red-400','text-yellow-400','text-blue-400','text-green-400'][strength]}`}>
                  Password strength: {strengthLabel}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-lift w-full text-white font-bold py-3.5 rounded-2xl mt-2 disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : (
                <span>Create Account 🚀</span>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-zinc-500 text-xs">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <p className="text-zinc-400 text-center text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors hover:underline">
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
