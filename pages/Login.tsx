import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GraduationCap, ArrowLeft, CheckCircle } from 'lucide-react';

export const Login: React.FC = () => {
  const { login, resetPassword } = useApp();
  const [view, setView] = useState<'login' | 'register' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await login(email, password);
    } catch (e) {
      setError('Invalid credentials');
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setIsSubmitting(true);
    try {
        await resetPassword(email);
        setSuccessMsg('Check your email! We sent a password reset link.');
    } catch(err) {
        setError('Failed to send reset link. Please verify your email and try again.');
    } finally {
        setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    // --- Forgot Password View ---
    if (view === 'forgot') {
        return (
            <div className="w-full max-w-sm space-y-6">
                <div className="flex items-center mb-4">
                    <button onClick={() => { setView('login'); setSuccessMsg(''); setError(''); }} className="text-gray-400 hover:text-gray-600 flex items-center">
                        <ArrowLeft size={18} className="mr-1" /> Back
                    </button>
                </div>
                
                <h2 className="text-2xl font-bold text-gray-900 text-center">Reset Password</h2>
                
                {successMsg ? (
                    <div className="bg-green-50 p-6 rounded-2xl flex flex-col items-center text-center space-y-4">
                        <CheckCircle className="text-green-500" size={48} />
                        <p className="text-gray-800 font-medium">{successMsg}</p>
                        <button 
                            onClick={() => setView('login')}
                            className="w-full bg-white border border-gray-200 text-gray-700 py-3 rounded-xl font-medium shadow-sm"
                        >
                            Return to Login
                        </button>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-500 text-center text-sm">Enter your email address and we'll send you a link to reset your password.</p>
                        <form onSubmit={handleReset} className="space-y-4">
                            <div>
                                <input 
                                    type="email" 
                                    placeholder="Email Address" 
                                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            
                            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                            
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full bg-primary text-white p-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/30 active:scale-95 transition-transform disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                    </>
                )}
            </div>
        );
    }

    // --- Login / Register View ---
    return (
        <div className="w-full max-w-sm space-y-6">
            <div className="flex p-1 bg-gray-100 rounded-xl mb-6">
                <button 
                    onClick={() => setView('login')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${view === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                >
                    Login
                </button>
                <button 
                    onClick={() => setView('register')}
                    className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${view === 'register' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'}`}
                >
                    Register
                </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <input 
                        type="email" 
                        placeholder="Email Address" 
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input 
                        type="password" 
                        placeholder="Password" 
                        className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required
                    />
                </div>
                
                {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                
                <button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-primary text-white p-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/30 active:scale-95 transition-transform disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? 'Please wait...' : (view === 'login' ? 'Sign In' : 'Create Account')}
                </button>
            </form>

            {view === 'login' && (
                <button 
                    onClick={() => setView('forgot')}
                    className="w-full text-sm text-gray-400 font-medium hover:text-gray-600 transition-colors"
                >
                    Forgot Password?
                </button>
            )}
        </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white transition-all duration-300">
      <div className="mb-8 flex flex-col items-center">
        <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center shadow-xl mb-4 transform rotate-12">
            <GraduationCap className="text-white" size={40} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Prep Tracker</h1>
        <p className="text-gray-500 mt-2">Master your English journey</p>
      </div>

      {renderContent()}
    </div>
  );
};