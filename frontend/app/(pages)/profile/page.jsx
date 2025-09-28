'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService, interactionService } from '../../../services/index.js';
import { Settings, Edit3, Heart, Users, LogOut } from 'lucide-react';
import { SettingsIcon, PlusIcon, XIcon, CameraIcon } from 'lucide-react';

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState({
    id: 1,
    name: 'John',
    age: 26,
    bio: 'Love hiking and coffee ☕',
    photos: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face'
    ],
    interests: ['Travel', 'Photography', 'Fitness'],
    prompts: [
      { question: 'My ideal first date', answer: 'A sunset hike followed by coffee ☕' },
      { question: 'My biggest fear', answer: 'Running out of coffee beans' },
      { question: 'My dream job', answer: 'Professional coffee taster' }
    ]
  });
  const [newInterest, setNewInterest] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const loadProfileData = async () => {
      try {
        // Check authentication
        if (!authService.isAuthenticated()) {
          router.push('/login');
          return;
        }

        // Get current user data
        const userData = authService.getCurrentUser();
        if (userData) {
          setUser(userData);
        }

        // Load matches
        const matchesResult = await interactionService.getMatches();
        if (matchesResult.success) {
          setMatches(matchesResult.matches);
        }
      } catch (error) {
        console.error('Error loading profile data:', error);
        setError('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [router]);

  const handleLogout = () => {
    authService.logout();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-signature-2 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full space-y-6 bg-white p-6 rounded-lg shadow-md text-center mx-4">
          <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--signature)' }}>
            Error Loading Profile
          </h1>
          <p className="text-sm text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 rounded-lg text-white font-medium transition-all duration-200 hover:shadow-md transform hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, var(--signature) 0%, var(--signature-2) 100%)'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full space-y-6 bg-white p-6 rounded-lg shadow-md text-center mx-4">
          <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--signature)' }}>
            Profile Not Found
          </h1>
          <p className="text-sm text-gray-600 mb-4">Please log in again</p>
          <button
            onClick={() => router.push('/login')}
            className="px-6 py-2 rounded-lg text-white font-medium transition-all duration-200 hover:shadow-md transform hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, var(--signature) 0%, var(--signature-2) 100%)'
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }


  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoChange = (index, newUrl) => {
    const newPhotos = [...profileData.photos];
    newPhotos[index] = newUrl;
    setProfileData(prev => ({
      ...prev,
      photos: newPhotos
    }));
  };

  const addPhoto = () => {
    if (profileData.photos.length < 6) {
      setProfileData(prev => ({
        ...prev,
        photos: [...prev.photos, '']
      }));
    }
  };

  const removePhoto = (index) => {
    const newPhotos = profileData.photos.filter((_, i) => i !== index);
    setProfileData(prev => ({
      ...prev,
      photos: newPhotos
    }));
  };

  const addInterest = () => {
    if (newInterest.trim() && !profileData.interests.includes(newInterest.trim())) {
      setProfileData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest('');
    }
  };

  const removeInterest = (interest) => {
    setProfileData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const handlePromptChange = (index, field, value) => {
    const newPrompts = [...profileData.prompts];
    newPrompts[index] = {
      ...newPrompts[index],
      [field]: value
    };
    setProfileData(prev => ({
      ...prev,
      prompts: newPrompts
    }));
  };

  const addPrompt = () => {
    setProfileData(prev => ({
      ...prev,
      prompts: [...prev.prompts, { question: '', answer: '' }]
    }));
  };

  const removePrompt = (index) => {
    const newPrompts = profileData.prompts.filter((_, i) => i !== index);
    setProfileData(prev => ({
      ...prev,
      prompts: newPrompts
    }));
  };

  const saveProfile = () => {
    console.log('Saving profile:', profileData);
    setIsEditing(false);
    // Here you would typically save to a backend
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm"
            >
              <SettingsIcon className="w-4 h-4 text-gray-600" />
              <span className="text-gray-700">{isEditing ? 'Preview' : 'Edit'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Basic Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    value={profileData.age}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    disabled={!isEditing}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed text-sm resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>
              </div>
            </div>

            {/* Interests Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Interests</h2>
                {isEditing && (
                  <button
                    onClick={addInterest}
                    className="p-1 text-pink-500 hover:text-pink-600 transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {profileData.interests.map((interest, index) => (
                  <span
                    key={index}
                    className="flex items-center space-x-1 bg-pink-50 text-pink-700 px-2 py-1 rounded-md text-xs font-medium"
                  >
                    <span>{interest}</span>
                    {isEditing && (
                      <button
                        onClick={() => removeInterest(interest)}
                        className="text-pink-500 hover:text-pink-700"
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
              {isEditing && (
                <input
                  type="text"
                  value={newInterest}
                  onChange={(e) => setNewInterest(e.target.value)}
                  placeholder="Add an interest"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                />
              )}
            </div>
          </div>

          {/* Right Column - Photos & Prompts */}
          <div className="lg:col-span-2 space-y-6">
            {/* Photos Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Photos</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {profileData.photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                      {photo ? (
                        <img
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <CameraIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    {isEditing && (
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="flex flex-col space-y-2 p-2">
                          <input
                            type="url"
                            value={photo}
                            onChange={(e) => handlePhotoChange(index, e.target.value)}
                            placeholder="Photo URL"
                            className="px-2 py-1 text-xs rounded bg-white/90 w-full"
                          />
                          <button
                            onClick={() => removePhoto(index)}
                            className="p-1 bg-red-500 text-white rounded hover:bg-red-600 self-center"
                          >
                            <XIcon className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Prompts Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Conversation Starters</h2>
                {isEditing && (
                  <button
                    onClick={addPrompt}
                    className="flex items-center space-x-1 px-3 py-1 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm"
                  >
                    <PlusIcon className="w-3 h-3" />
                    <span>Add</span>
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {profileData.prompts.map((prompt, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-xs font-medium text-gray-500">Prompt {index + 1}</span>
                      {isEditing && (
                        <button
                          onClick={() => removePrompt(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <XIcon className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Question</label>
                        <input
                          type="text"
                          value={prompt.question}
                          onChange={(e) => handlePromptChange(index, 'question', e.target.value)}
                          disabled={!isEditing}
                          className="w-full px-2 py-1 border border-gray-200 rounded-md focus:ring-1 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed text-sm"
                          placeholder="Enter your question..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Answer</label>
                        <textarea
                          value={prompt.answer}
                          onChange={(e) => handlePromptChange(index, 'answer', e.target.value)}
                          disabled={!isEditing}
                          rows={2}
                          className="w-full px-2 py-1 border border-gray-200 rounded-md focus:ring-1 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed text-sm resize-none"
                          placeholder="Enter your answer..."
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        {isEditing && (
          <div className="flex justify-end space-x-3 mt-8">
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              onClick={saveProfile}
              className="px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm shadow-sm"
            >
              Save Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;


