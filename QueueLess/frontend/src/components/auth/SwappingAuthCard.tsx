'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../common/Logo';
import {
  Mail,
  Lock,
  User,
  Phone,
  Building2,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';

const CATEGORIES = [
  'Clinics',
  'Salons',
  'Barbers',
  'Restaurants',
  'Diagnostic Centers',
  'Repair Shops',
  'Banks',
  'Government Services',
  'Other',
];

interface SwappingAuthCardProps {
  initialMode?: 'login' | 'register';
}

export const SwappingAuthCard: React.FC<SwappingAuthCardProps> = ({
  initialMode = 'login',
}) => {
  const router = useRouter();
  const { login, register } = useAuth();

  const [isSignUp, setIsSignUp] = useState(initialMode === 'register');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regRole, setRegRole] = useState<'USER' | 'BUSINESS_OWNER'>('USER');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regBusinessName, setRegBusinessName] = useState('');
  const [regBusinessCategory, setRegBusinessCategory] = useState('Clinics');
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState('');

  // Toggle mode & update URL shallowly
  const toggleMode = (signUpMode: boolean) => {
    setIsSignUp(signUpMode);
    setLoginError('');
    setRegError('');
    window.history.replaceState(null, '', signUpMode ? '/register' : '/login');
  };

  // Handle Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const loggedUser = await login(loginEmail, loginPassword);
      if (loggedUser.role === 'ADMIN') {
        router.push('/admin');
      } else if (loggedUser.role === 'BUSINESS_OWNER' || loggedUser.role === 'STAFF') {
        router.push('/business-dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Invalid email or password.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Demo Quick Fill
  const handleQuickDemo = async (role: 'USER' | 'BUSINESS_OWNER' | 'ADMIN') => {
    setLoginLoading(true);
    setLoginError('');
    try {
      let email = 'user@queueless.demo';
      let pass = 'User@123456';
      let redirect = '/dashboard';

      if (role === 'BUSINESS_OWNER') {
        email = 'business@queueless.demo';
        pass = 'Business@123456';
        redirect = '/business-dashboard';
      } else if (role === 'ADMIN') {
        email = 'admin@queueless.demo';
        pass = 'Admin@123456';
        redirect = '/admin';
      }

      setLoginEmail(email);
      setLoginPassword(pass);
      await login(email, pass);
      router.push(redirect);
    } catch (err: any) {
      setLoginError(err.message || 'Demo login failed.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Register
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirmPassword) {
      setRegError('Passwords do not match.');
      return;
    }
    if (regPassword.length < 6) {
      setRegError('Password must be at least 6 characters.');
      return;
    }

    setRegLoading(true);
    setRegError('');

    try {
      const payload: any = {
        name: regName,
        email: regEmail,
        phone: regPhone,
        password: regPassword,
        role: regRole,
      };

      if (regRole === 'BUSINESS_OWNER') {
        payload.businessData = {
          name: regBusinessName || `${regName}'s Service`,
          category: regBusinessCategory,
          phone: regPhone,
        };
      }

      await register(payload);

      if (regRole === 'BUSINESS_OWNER') {
        router.push('/business-dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setRegError(err.message || 'Registration failed. Please try again.');
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Mobile Tab Switcher (< md screens) */}
      <div className="md:hidden mb-4 flex items-center justify-center p-1.5 bg-slate-200/70 dark:bg-slate-800/80 rounded-2xl max-w-xs mx-auto">
        <button
          type="button"
          onClick={() => toggleMode(false)}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            !isSignUp
              ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Sign In
        </button>
        <button
          type="button"
          onClick={() => toggleMode(true)}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
            isSignUp
              ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          Create Account
        </button>
      </div>

      {/* Main Dual-Panel Sliding Card */}
      <div className="relative w-full min-h-[660px] md:h-[680px] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200/90 dark:border-slate-800/90 overflow-hidden">
        
        {/* ========================================================
            1. SIGN IN FORM CONTAINER (Left Half on Desktop)
           ======================================================== */}
        <div
          className={`w-full md:w-1/2 h-full absolute top-0 left-0 flex flex-col justify-center px-6 sm:px-10 py-8 transition-all duration-700 ease-in-out ${
            isSignUp
              ? 'md:opacity-0 md:pointer-events-none md:-translate-x-12 z-0 hidden md:flex'
              : 'opacity-100 pointer-events-auto translate-x-0 z-10 flex'
          }`}
        >
          <div className="max-w-sm mx-auto w-full space-y-4">
            <div className="text-center space-y-1">
              <div className="flex justify-center mb-1">
                <Logo size="sm" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Sign In to Turnova
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Skip lines and manage your digital tokens
              </p>
            </div>

            {/* Quick 1-Click Demo Buttons */}
            <div className="p-2.5 rounded-2xl bg-brand-50/70 dark:bg-brand-950/30 border border-brand-200/70 dark:border-brand-800/70 space-y-1.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-brand-700 dark:text-brand-300 px-1">
                <span className="flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-brand-600" />
                  Instant 1-Click Demo
                </span>
                <span className="text-[10px] text-brand-500 font-normal">Click to test</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('USER')}
                  disabled={loginLoading}
                  className="py-1.5 px-2 rounded-xl bg-white dark:bg-slate-900 border border-brand-200/80 dark:border-brand-800/80 hover:bg-brand-50/80 text-[11px] font-semibold text-slate-800 dark:text-slate-200 shadow-2xs flex items-center justify-center gap-1 transition-all"
                >
                  <User className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Customer</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('BUSINESS_OWNER')}
                  disabled={loginLoading}
                  className="py-1.5 px-2 rounded-xl bg-white dark:bg-slate-900 border border-brand-200/80 dark:border-brand-800/80 hover:bg-brand-50/80 text-[11px] font-semibold text-slate-800 dark:text-slate-200 shadow-2xs flex items-center justify-center gap-1 transition-all"
                >
                  <Building2 className="w-3.5 h-3.5 text-brand-500" />
                  <span>Business</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('ADMIN')}
                  disabled={loginLoading}
                  className="py-1.5 px-2 rounded-xl bg-white dark:bg-slate-900 border border-brand-200/80 dark:border-brand-800/80 hover:bg-brand-50/80 text-[11px] font-semibold text-slate-800 dark:text-slate-200 shadow-2xs flex items-center justify-center gap-1 transition-all"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-purple-500" />
                  <span>Admin</span>
                </button>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
              <span className="bg-white dark:bg-slate-900 px-2.5 text-[10px] uppercase font-bold text-slate-400">
                or sign in with email
              </span>
            </div>

            {loginError && (
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="user@example.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-[11px] text-brand-600 dark:text-brand-400 hover:underline font-medium"
                  >
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showLoginPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-brand-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] mt-2 cursor-pointer"
              >
                {loginLoading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="md:hidden text-center pt-2">
              <span className="text-xs text-slate-500">Don't have an account? </span>
              <button
                type="button"
                onClick={() => toggleMode(true)}
                className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================
            2. SIGN UP FORM CONTAINER (Right Half on Desktop)
           ======================================================== */}
        <div
          className={`w-full md:w-1/2 h-full absolute top-0 right-0 flex flex-col justify-center px-6 sm:px-10 py-6 overflow-y-auto transition-all duration-700 ease-in-out ${
            !isSignUp
              ? 'md:opacity-0 md:pointer-events-none md:translate-x-12 z-0 hidden md:flex'
              : 'opacity-100 pointer-events-auto translate-x-0 z-10 flex'
          }`}
        >
          <div className="max-w-sm mx-auto w-full space-y-3">
            <div className="text-center space-y-0.5">
              <div className="flex justify-center mb-1">
                <Logo size="sm" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                Create Account
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Join Turnova for virtual queue freedom
              </p>
            </div>

            {/* Role Switcher: Customer vs Business Owner */}
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl">
              <button
                type="button"
                onClick={() => setRegRole('USER')}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  regRole === 'USER'
                    ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Customer</span>
              </button>
              <button
                type="button"
                onClick={() => setRegRole('BUSINESS_OWNER')}
                className={`py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  regRole === 'BUSINESS_OWNER'
                    ? 'bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Business Owner</span>
              </button>
            </div>

            {regError && (
              <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-rose-600 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{regError}</span>
              </div>
            )}

            <form onSubmit={handleRegisterSubmit} className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Alex Smith"
                      className="w-full pl-8 pr-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="+91 98765..."
                      className="w-full pl-8 pr-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="alex@example.com"
                    className="w-full pl-8 pr-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Extra business fields if business owner */}
              {regRole === 'BUSINESS_OWNER' && (
                <div className="grid grid-cols-2 gap-2 p-2 rounded-xl bg-brand-50/50 dark:bg-brand-950/20 border border-brand-200/60 dark:border-brand-800/60">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                      Business Name
                    </label>
                    <input
                      type="text"
                      required
                      value={regBusinessName}
                      onChange={(e) => setRegBusinessName(e.target.value)}
                      placeholder="e.g. Metro Clinic"
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-700 dark:text-slate-300 mb-0.5">
                      Category
                    </label>
                    <select
                      value={regBusinessCategory}
                      onChange={(e) => setRegBusinessCategory(e.target.value)}
                      className="w-full px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••"
                      className="w-full pl-8 pr-7 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showRegPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Confirm Pass
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      placeholder="••••••"
                      className="w-full pl-8 pr-2.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={regLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-brand-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] mt-1 cursor-pointer"
              >
                {regLoading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="md:hidden text-center pt-1">
              <span className="text-xs text-slate-500">Already registered? </span>
              <button
                type="button"
                onClick={() => toggleMode(false)}
                className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================
            3. SLIDING OVERLAY PANEL (Desktop Only - Smooth 700ms Swap)
           ======================================================== */}
        <div
          className={`hidden md:block absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-20 ${
            isSignUp ? '-translate-x-full' : 'translate-x-0'
          }`}
        >
          {/* Internal gradient banner moving opposite to create parallax effect */}
          <div
            className={`w-[200%] h-full relative -left-full transition-transform duration-700 ease-in-out bg-gradient-to-br from-brand-600 via-indigo-600 to-blue-500 text-white ${
              isSignUp ? 'translate-x-1/2' : 'translate-x-0'
            }`}
          >
            {/* Background Decorative Circles */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-900/30 rounded-full blur-3xl pointer-events-none" />

            {/* Left Overlay Content: Shown when in Register Mode -> Click to Go to Sign In */}
            <div
              className={`absolute top-0 left-0 w-1/2 h-full flex flex-col justify-center items-center text-center px-10 transition-all duration-700 ease-in-out ${
                isSignUp
                  ? 'opacity-100 pointer-events-auto translate-x-0'
                  : 'opacity-0 pointer-events-none -translate-x-8'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center mb-4 shadow-inner border border-white/20">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl font-black tracking-tight mb-3">
                Welcome Back!
              </h2>
              <p className="text-xs text-white/80 max-w-xs leading-relaxed mb-6">
                Already have a Turnova account? Sign in to manage your active queues, call next customers, and monitor live tokens.
              </p>
              <button
                type="button"
                onClick={() => toggleMode(false)}
                className="py-3 px-8 rounded-full border-2 border-white text-white font-bold text-xs uppercase tracking-wider hover:bg-white hover:text-brand-600 transition-all duration-300 shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
              >
                Sign In
              </button>
            </div>

            {/* Right Overlay Content: Shown when in Login Mode -> Click to Go to Sign Up */}
            <div
              className={`absolute top-0 right-0 w-1/2 h-full flex flex-col justify-center items-center text-center px-10 transition-all duration-700 ease-in-out ${
                !isSignUp
                  ? 'opacity-100 pointer-events-auto translate-x-0'
                  : 'opacity-0 pointer-events-none translate-x-8'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center mb-4 shadow-inner border border-white/20">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-3xl font-black tracking-tight mb-3">
                Hello, Friend!
              </h2>
              <p className="text-xs text-white/80 max-w-xs leading-relaxed mb-6">
                Enter your details and start your journey with Turnova. Skip physical lines and join virtual queues from anywhere.
              </p>
              <button
                type="button"
                onClick={() => toggleMode(true)}
                className="py-3 px-8 rounded-full border-2 border-white text-white font-bold text-xs uppercase tracking-wider hover:bg-white hover:text-brand-600 transition-all duration-300 shadow-lg hover:scale-105 active:scale-95 cursor-pointer"
              >
                Sign Up
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
