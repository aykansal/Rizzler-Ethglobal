import apiClient from '../lib/api.js';
import { API_CONFIG } from '../lib/constants.js';

/**
 * User Service
 * Handles user profile and feed-related operations
 */
class UserService {

  /**
   * Get user by NFC ID
   */
  async getUserByNfcId(nfcId) {
    try {
      const response = await apiClient.get(
        `${API_CONFIG.ENDPOINTS.GET_USER}?nfcId=${encodeURIComponent(nfcId)}`,
        false // Public endpoint, no auth required
      );

      if (response.success && response.user) {
        console.log('✅ User fetched successfully:', response.user.name);
        return {
          success: true,
          user: response.user
        };
      }

      return {
        success: false,
        message: response.message || 'User not found'
      };
    } catch (error) {
      console.error('❌ Get user error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch user'
      };
    }
  }

  /**
   * Get personalized user feed
   * Returns opposite gender users excluding those already disliked
   */
  async getUserFeed() {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.GET_FEED);

      if (response.success && response.users) {
        console.log(`✅ Feed fetched successfully: ${response.users.length} users`);
        return {
          success: true,
          users: response.users
        };
      }

      return {
        success: false,
        users: [],
        message: response.message || 'No users found'
      };
    } catch (error) {
      console.error('❌ Get feed error:', error);
      return {
        success: false,
        users: [],
        message: error.message || 'Failed to fetch feed'
      };
    }
  }

  /**
   * Update user profile
   * Note: This would require a PATCH/PUT endpoint on the backend
   */
  async updateProfile(profileData) {
    try {
      // This endpoint doesn't exist yet in the backend
      // Would need to be implemented as PATCH /api/user/:id
      const response = await apiClient.put(
        `/api/user/profile`,
        profileData
      );

      if (response.success) {
        console.log('✅ Profile updated successfully');
        return {
          success: true,
          user: response.user,
          message: 'Profile updated successfully'
        };
      }

      return {
        success: false,
        message: response.message || 'Profile update failed'
      };
    } catch (error) {
      console.error('❌ Update profile error:', error);
      return {
        success: false,
        message: error.message || 'Failed to update profile'
      };
    }
  }

  /**
   * Search users by name or other criteria
   * Note: This would require a search endpoint on the backend
   */
  async searchUsers(query, filters = {}) {
    try {
      const params = new URLSearchParams({
        q: query,
        ...filters
      });

      const response = await apiClient.get(
        `/api/user/search?${params.toString()}`
      );

      if (response.success) {
        return {
          success: true,
          users: response.users || []
        };
      }

      return {
        success: false,
        users: [],
        message: response.message || 'Search failed'
      };
    } catch (error) {
      console.error('❌ Search users error:', error);
      return {
        success: false,
        users: [],
        message: error.message || 'Search failed'
      };
    }
  }

  /**
   * Get user statistics
   */
  async getUserStats(userId = null) {
    try {
      const endpoint = userId 
        ? `/api/user/${userId}/stats`
        : '/api/user/stats';
        
      const response = await apiClient.get(endpoint);

      if (response.success) {
        return {
          success: true,
          stats: response.stats
        };
      }

      return {
        success: false,
        message: response.message || 'Failed to fetch stats'
      };
    } catch (error) {
      console.error('❌ Get user stats error:', error);
      return {
        success: false,
        message: error.message || 'Failed to fetch stats'
      };
    }
  }
}

// Create and export singleton instance
const userService = new UserService();
export default userService;
