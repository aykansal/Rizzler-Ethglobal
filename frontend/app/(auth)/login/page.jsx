'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../component/header.jsx';
import { authService } from '../../../services/index.js';

const LoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    phoneNumber: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{9,15}$/.test(formData.phoneNumber.replace(/\s/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid phone number';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await authService.login(formData.phoneNumber, formData.password);
      
      if (result.success) {
        console.log('✅ Login successful:', result.user?.name);
        // Redirect to main app (explore page)
        router.push('/male/explore');
      } else {
        setErrors({ 
          general: result.message || 'Login failed. Please check your credentials.' 
        });
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      setErrors({ 
        general: 'Network error. Please check your connection.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' }}>
      <Header />
      <div className="flex items-center justify-center mt-4 py-8 px-4">
        <div className="max-w-sm w-full space-y-6 bg-white p-6 rounded-xl shadow-md">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl font-bold" style={{ color: 'var(--signature)' }}>
            Welcome Back
          </h2>
          <p className="mt-1 text-sm" style={{ color: 'var(--foreground)' }}>
            Sign in to your account
          </p>
        </div>

        {/* Error Message */}
        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600 text-center">{errors.general}</p>
          </div>
        )}

        {/* Login Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-3">
            {/* Phone Number Field */}
            <div>
              <label htmlFor="phoneNumber" className="block text-xs font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                Phone Number
              </label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                autoComplete="tel"
                required
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md text-sm transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 ${
                  errors.phoneNumber 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                style={{
                  backgroundColor: 'white',
                  borderColor: errors.phoneNumber ? '#DC143C' : '#D1D5DB'
                }}
                placeholder="Enter your phone number (e.g., +1234567890)"
              />
              {errors.phoneNumber && (
                <p className="mt-1 text-xs text-red-600">{errors.phoneNumber}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-medium mb-1" style={{ color: 'var(--foreground)' }}>
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 pr-10 border rounded-md text-sm transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 ${
                    errors.password 
                      ? 'border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:ring-blue-500'
                  }`}
                  style={{
                    backgroundColor: 'white',
                    borderColor: errors.password ? '#DC143C' : '#D1D5DB'
                  }}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-2 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="text-gray-500 hover:text-gray-700 text-sm">
                    {showPassword ? '🙈' : '👁️'}
                  </span>
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-3 w-3 rounded border-gray-300 focus:ring-1 focus:ring-blue-500"
                style={{ accentColor: 'var(--signature)' }}
              />
              <label htmlFor="remember-me" className="ml-1 block text-xs" style={{ color: 'var(--foreground)' }}>
                Remember me
              </label>
            </div>

            <div className="text-xs">
              <a href="#" className="font-medium hover:underline" style={{ color: 'var(--signature)' }}>
                Forgot password?
              </a>
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
              style={{
                backgroundColor: 'var(--signature)',
                backgroundImage: 'linear-gradient(135deg, var(--signature) 0%, var(--signature-2) 100%)'
              }}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-xs" style={{ color: 'var(--foreground)' }}>
              Don't have an account?{' '}
              <a href="/signup" className="font-medium hover:underline" style={{ color: 'var(--signature)' }}>
                Sign up here
              </a>
            </p>
          </div>
        </form>

        {/* Social Login Options */}
        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-transparent" style={{ color: 'var(--foreground)' }}>
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2">
            <button
              type="button"
              className="w-full inline-flex justify-center items-center py-2 px-3 border border-gray-300 rounded-md shadow-sm bg-white text-xs font-medium text-gray-500 hover:bg-gray-50 transition-colors duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16" height="16" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
              </svg>
              <span className="ml-1">Google</span>
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;