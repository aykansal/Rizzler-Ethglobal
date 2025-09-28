'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../../component/header.jsx';
import { authService } from '../../../services/index.js';
import { GENDER_OPTIONS } from '../../../lib/constants.js';

const SignupPage = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1: Basic Details
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: '',
    bio: '',
    
    // Step 2: Interests & Prompts
    interests: [],
    prompts: [
      { question: 'My ideal first date', answer: '' },
      { question: 'I\'m weirdly attracted to', answer: '' },
      { question: 'The way to my heart', answer: '' }
    ],
    
    // Step 3: Photos
    photos: []
  });
  
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const interests = [
    { id: 'technology', label: 'Technology', icon: '💻' },
    { id: 'music', label: 'Music', icon: '🎵' },
    { id: 'sports', label: 'Sports', icon: '⚽' },
    { id: 'travel', label: 'Travel', icon: '✈️' },
    { id: 'food', label: 'Food & Cooking', icon: '🍳' },
    { id: 'art', label: 'Art & Design', icon: '🎨' },
    { id: 'fitness', label: 'Fitness', icon: '💪' },
    { id: 'gaming', label: 'Gaming', icon: '🎮' },
    { id: 'reading', label: 'Reading', icon: '📚' },
    { id: 'photography', label: 'Photography', icon: '📸' },
    { id: 'movies', label: 'Movies & TV', icon: '🎬' },
    { id: 'fashion', label: 'Fashion', icon: '👗' }
  ];

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

  const handleInterestChange = (interestId) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const handlePromptChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      prompts: prev.prompts.map((prompt, i) => 
        i === index ? { ...prompt, [field]: value } : prompt
      )
    }));
  };

  const handlePhotoChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newPhotos = [...formData.photos];
      newPhotos[index] = file;
      setFormData(prev => ({
        ...prev,
        photos: newPhotos
      }));
    }
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{9,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.age || formData.age < 18) {
      newErrors.age = 'Age must be 18 or older';
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    if (formData.interests.length === 0) {
      setErrors({ interests: 'Please select at least one interest' });
      return false;
    }
    setErrors({});
    return true;
  };

  const validateStep3 = () => {
    if (formData.photos.filter(photo => photo).length === 0) {
      setErrors({ photos: 'Please upload at least one photo' });
      return false;
    }
    setErrors({});
    return true;
  };

  const nextStep = () => {
    if (currentStep === 1 && validateStep1()) {
      setCurrentStep(2);
    } else if (currentStep === 2 && validateStep2()) {
      setCurrentStep(3);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep3()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Convert photos to URLs (in real app, you'd upload to cloud storage)
      const photoUrls = formData.photos
        .filter(photo => photo)
        .map((photo, index) => `https://via.placeholder.com/400x600?text=Photo+${index + 1}`);
      
      // Filter out prompts with empty answers
      const completedPrompts = formData.prompts.filter(prompt => prompt.answer.trim());
      
      const signupData = {
        name: formData.name,
        phone: formData.phone,
        password: formData.password,
        age: formData.age ? parseInt(formData.age) : undefined,
        gender: formData.gender,
        bio: formData.bio,
        interests: formData.interests,
        prompts: completedPrompts,
        photos: photoUrls
      };
      
      const result = await authService.signup(signupData);
      
      if (result.success) {
        console.log('✅ Signup successful:', result.user?.name);
        // Redirect to main app (explore page)
        router.push('/explore');
      } else {
        setErrors({ 
          general: result.message || 'Signup failed. Please try again.' 
        });
      }
    } catch (error) {
      console.error('❌ Signup error:', error);
      setErrors({ 
        general: 'Network error. Please check your connection.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-3">
      <div>
        <label htmlFor="name" className="block text-xs font-medium mb-1" style={{ color: 'var(--foreground)' }}>
          Full Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={formData.name}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md text-sm transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 ${
            errors.name 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          style={{
            backgroundColor: 'white',
            borderColor: errors.name ? '#DC143C' : '#D1D5DB'
          }}
          placeholder="Enter your full name"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-600">{errors.name}</p>
        )}
      </div>

      <div>
        <label htmlFor="phone" className="block text-xs font-medium mb-1" style={{ color: 'var(--foreground)' }}>
          Phone Number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          value={formData.phone}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md text-sm transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 ${
            errors.phone 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          style={{
            backgroundColor: 'white',
            borderColor: errors.phone ? '#DC143C' : '#D1D5DB'
          }}
          placeholder="Enter your phone number"
        />
        {errors.phone && (
          <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-xs font-medium mb-1" style={{ color: 'var(--foreground)' }}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          value={formData.password}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md text-sm transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 ${
            errors.password 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          style={{
            backgroundColor: 'white',
            borderColor: errors.password ? '#DC143C' : '#D1D5DB'
          }}
          placeholder="Create a password"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-red-600">{errors.password}</p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-xs font-medium mb-1" style={{ color: 'var(--foreground)' }}>
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          value={formData.confirmPassword}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md text-sm transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 ${
            errors.confirmPassword 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          style={{
            backgroundColor: 'white',
            borderColor: errors.confirmPassword ? '#DC143C' : '#D1D5DB'
          }}
          placeholder="Confirm your password"
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
        )}
      </div>

      <div>
        <label htmlFor="age" className="block text-xs font-medium mb-1" style={{ color: 'var(--foreground)' }}>
          Age
        </label>
        <input
          id="age"
          name="age"
          type="number"
          min="18"
          max="100"
          required
          value={formData.age}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md text-sm transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 ${
            errors.age 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          style={{
            backgroundColor: 'white',
            borderColor: errors.age ? '#DC143C' : '#D1D5DB'
          }}
          placeholder="Enter your age"
        />
        {errors.age && (
          <p className="mt-1 text-xs text-red-600">{errors.age}</p>
        )}
      </div>

      <div>
        <label htmlFor="gender" className="block text-xs font-medium mb-1" style={{ color: 'var(--foreground)' }}>
          Gender
        </label>
        <select
          id="gender"
          name="gender"
          required
          value={formData.gender}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md text-sm transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 ${
            errors.gender 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          style={{
            backgroundColor: 'white',
            borderColor: errors.gender ? '#DC143C' : '#D1D5DB'
          }}
        >
          <option value="">Select your gender</option>
          {GENDER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.gender && (
          <p className="mt-1 text-xs text-red-600">{errors.gender}</p>
        )}
      </div>

      <div>
        <label htmlFor="bio" className="block text-xs font-medium mb-1" style={{ color: 'var(--foreground)' }}>
          Bio (Optional)
        </label>
        <textarea
          id="bio"
          name="bio"
          rows={3}
          maxLength={500}
          value={formData.bio}
          onChange={handleInputChange}
          className={`w-full px-3 py-2 border rounded-md text-sm transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-offset-1 resize-none ${
            errors.bio 
              ? 'border-red-500 focus:ring-red-500' 
              : 'border-gray-300 focus:ring-blue-500'
          }`}
          style={{
            backgroundColor: 'white',
            borderColor: errors.bio ? '#DC143C' : '#D1D5DB'
          }}
          placeholder="Tell others about yourself..."
        />
        <p className="mt-1 text-xs text-gray-500">
          {formData.bio.length}/500 characters
        </p>
        {errors.bio && (
          <p className="mt-1 text-xs text-red-600">{errors.bio}</p>
        )}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Interests Section */}
      <div>
        <div className="text-center mb-4">
          <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--foreground)' }}>
            What interests you?
          </h3>
          <p className="text-xs text-gray-600">Select your interests to help us personalize your experience</p>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {interests.map((interest) => (
            <label
              key={interest.id}
              className={`relative flex items-center p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-105 ${
                formData.interests.includes(interest.id)
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <input
                type="checkbox"
                checked={formData.interests.includes(interest.id)}
                onChange={() => handleInterestChange(interest.id)}
                className="sr-only"
              />
              <div className="flex items-center space-x-2 w-full">
                <span className="text-lg">{interest.icon}</span>
                <span className="text-xs font-medium" style={{ color: 'var(--foreground)' }}>
                  {interest.label}
                </span>
              </div>
              {formData.interests.includes(interest.id) && (
                <div className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </label>
          ))}
        </div>
        
        {errors.interests && (
          <p className="text-xs text-red-600 text-center mt-2">{errors.interests}</p>
        )}
      </div>

      {/* Prompts Section */}
      <div>
        <div className="text-center mb-4">
          <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--foreground)' }}>
            Tell us more about yourself
          </h3>
          <p className="text-xs text-gray-600">Answer these prompts to showcase your personality (optional)</p>
        </div>
        
        <div className="space-y-4">
          {formData.prompts.map((prompt, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-semibold text-gray-700 mb-2">
                {prompt.question}
              </p>
              <textarea
                rows={2}
                maxLength={200}
                value={prompt.answer}
                onChange={(e) => handlePromptChange(index, 'answer', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                placeholder="Your answer..."
              />
              <p className="mt-1 text-xs text-gray-500 text-right">
                {prompt.answer.length}/200
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="text-center mb-4">
        <h3 className="text-base font-semibold mb-1" style={{ color: 'var(--foreground)' }}>
          Upload Your Best Photos
        </h3>
        <p className="text-xs text-gray-600">Add up to 4 photos to showcase yourself</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="relative">
            <label className="block">
              <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400 transition-colors duration-200 group">
                {formData.photos[index] ? (
                  <div className="relative w-full h-full">
                    <img
                      src={URL.createObjectURL(formData.photos[index])}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newPhotos = [...formData.photos];
                        newPhotos[index] = null;
                        setFormData(prev => ({ ...prev, photos: newPhotos }));
                      }}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="text-center p-3">
                    <svg className="mx-auto h-8 w-8 text-gray-400 group-hover:text-gray-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <p className="mt-1 text-xs text-gray-500">Click to upload</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handlePhotoChange(e, index)}
                  className="hidden"
                />
              </div>
            </label>
          </div>
        ))}
      </div>
      
      {errors.photos && (
        <p className="text-xs text-red-600 text-center">{errors.photos}</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)' }}>
      <Header />
      <div className="flex items-center justify-center py-6 px-4">
        <div className="max-w-lg w-full space-y-4 bg-white p-6 rounded-lg shadow-md">
          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h1 className="text-lg font-bold" style={{ color: 'var(--signature)' }}>
                Create Account
              </h1>
              <span className="text-xs text-gray-500">
                Step {currentStep} of 3
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="h-1.5 rounded-full transition-all duration-500"
                style={{ 
                  width: `${(currentStep / 3) * 100}%`,
                  background: 'linear-gradient(135deg, var(--signature) 0%, var(--signature-2) 100%)'
                }}
              ></div>
            </div>
          </div>

          {/* Error Message */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600 text-center">{errors.general}</p>
            </div>
          )}

          {/* Form Steps */}
          <form onSubmit={handleSubmit} className='max-h-[60vh] overflow-y-auto'>
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Previous
              </button>

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-4 py-2 rounded-md text-sm font-medium text-white transition-all duration-200 hover:shadow-md transform hover:scale-105"
                  style={{
                    background: 'linear-gradient(135deg, var(--signature) 0%, var(--signature-2) 100%)'
                  }}
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-6 py-2 rounded-md text-sm font-medium text-white transition-all duration-200 hover:shadow-md transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, var(--signature) 0%, var(--signature-2) 100%)'
                  }}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              )}
            </div>
          </form>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-xs" style={{ color: 'var(--foreground)' }}>
              Already have an account?{' '}
              <a href="/login" className="font-medium hover:underline" style={{ color: 'var(--signature)' }}>
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
