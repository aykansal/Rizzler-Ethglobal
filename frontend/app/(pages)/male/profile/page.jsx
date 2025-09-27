'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService, interactionService } from '../../../../services/index.js';
import { Settings, Edit3, Heart, Users, LogOut } from 'lucide-react';

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold" style={{ color: 'var(--signature)' }}>
              Profile
            </h1>
            <div className="flex items-center space-x-3">
              <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
                <Edit3 size={20} />
              </button>
              <button 
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-500 transition-colors"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Profile Image */}
          <div className="relative h-80">
            <img
              src={user.images && user.images[0] 
                ? user.images[0] 
                : 'https://via.placeholder.com/400x600?text=No+Photo'}
              alt={user.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <h2 className="text-2xl font-bold">
                {user.name}, {user.age || 'N/A'}
              </h2>
              <p className="text-sm opacity-90 mt-1">
                {user.gender === 'MALE' ? 'He/Him' : 
                 user.gender === 'FEMALE' ? 'She/Her' : 'They/Them'}
              </p>
            </div>
          </div>

          {/* Profile Info */}
          <div className="p-6">
            <div className="space-y-4">
              {/* Bio */}
              {user.bio && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">About Me</h3>
                  <p className="text-gray-600">{user.bio}</p>
                </div>
              )}

              {/* Interests */}
              {user.interests && user.interests.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">My Interests</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.interests.map((interest, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-signature-light text-signature-2 rounded-full text-sm font-medium"
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Prompts */}
              {user.prompts && user.prompts.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">My Prompts</h3>
                  <div className="space-y-3">
                    {user.prompts.map((prompt, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm font-semibold text-gray-700 mb-1">
                          {prompt.question}
                        </p>
                        <p className="text-sm text-gray-600">
                          {prompt.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Your Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-2">
                <Heart className="w-6 h-6 text-red-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{user.upvotes || 0}</p>
              <p className="text-sm text-gray-600">Likes Received</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-2">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{matches.length}</p>
              <p className="text-sm text-gray-600">Matches</p>
            </div>
          </div>
        </div>

        {/* Matches Preview */}
        {matches.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Matches</h3>
            <div className="grid grid-cols-3 gap-3">
              {matches.slice(0, 6).map((match, index) => (
                <div key={match.id || index} className="relative">
                  <img
                    src={match.images && match.images[0] 
                      ? match.images[0] 
                      : 'https://via.placeholder.com/100x100?text=No+Photo'}
                    alt={match.name}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                  <div className="absolute bottom-1 left-1 right-1">
                    <p className="text-xs text-white bg-black/50 rounded px-1 truncate">
                      {match.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            {matches.length > 6 && (
              <p className="text-sm text-gray-500 text-center mt-3">
                +{matches.length - 6} more matches
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button className="w-full py-3 px-4 bg-white rounded-xl shadow-sm text-left flex items-center justify-between hover:shadow-md transition-all duration-200">
            <span className="text-gray-700">Edit Profile</span>
            <Edit3 size={18} className="text-gray-400" />
          </button>
          <button className="w-full py-3 px-4 bg-white rounded-xl shadow-sm text-left flex items-center justify-between hover:shadow-md transition-all duration-200">
            <span className="text-gray-700">Settings</span>
            <Settings size={18} className="text-gray-400" />
          </button>
          <button 
            onClick={handleLogout}
            className="w-full py-3 px-4 bg-red-50 rounded-xl text-left flex items-center justify-between hover:bg-red-100 transition-all duration-200"
          >
            <span className="text-red-600">Log Out</span>
            <LogOut size={18} className="text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;


