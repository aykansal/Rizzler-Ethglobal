import apiClient from '../lib/api.js';
import { API_CONFIG, INTERACTION_TYPES } from '../lib/constants.js';

/**
 * Interaction Service
 * Handles like/dislike interactions and match management
 */
class InteractionService {

  /**
   * Like a user
   */
  async likeUser(userId) {
    return this.createInteraction(userId, INTERACTION_TYPES.LIKE);
  }

  /**
   * Dislike a user
   */
  async dislikeUser(userId) {
    return this.createInteraction(userId, INTERACTION_TYPES.DISLIKE);
  }

  /**
   * Create an interaction (like or dislike)
   */
  async createInteraction(toUserId, type) {
    try {
      if (!toUserId || !type) {
        throw new Error('User ID and interaction type are required');
      }

      if (!Object.values(INTERACTION_TYPES).includes(type)) {
        throw new Error('Invalid interaction type');
      }

      const response = await apiClient.post(
        API_CONFIG.ENDPOINTS.CREATE_INTERACTION,
        {
          toUserId,
          type,
        }
      );

      if (response.success) {
        const isMatch = response.message?.includes('match');
        console.log(`✅ ${type.toLowerCase()} successful${isMatch ? ' - IT\'S A MATCH! 🎉' : ''}`);
        
        return {
          success: true,
          isMatch: isMatch,
          message: response.message
        };
      }

      return {
        success: false,
        message: response.message || 'Interaction failed'
      };
    } catch (error) {
      console.error('❌ Create interaction error:', error);
      return {
        success: false,
        message: error.message || 'Interaction failed'
      };
    }
  }

  /**
   * Get user's matches
   */
  async getMatches() {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.GET_MATCHES);

      if (response.success) {
        console.log(`✅ Matches fetched successfully: ${response.matches?.length || 0} matches`);
        return {
          success: true,
          matches: response.matches || []
        };
      }

      return {
        success: false,
        matches: [],
        message: response.message || 'Failed to fetch matches'
      };
    } catch (error) {
      console.error('❌ Get matches error:', error);
      return {
        success: false,
        matches: [],
        message: error.message || 'Failed to fetch matches'
      };
    }
  }

  /**
   * Check if users have matched
   */
  async checkMatch(userId) {
    try {
      const matchesResult = await this.getMatches();
      
      if (matchesResult.success) {
        const isMatched = matchesResult.matches.some(match => match.id === userId);
        return {
          success: true,
          isMatched: isMatched
        };
      }

      return {
        success: false,
        isMatched: false,
        message: 'Failed to check match status'
      };
    } catch (error) {
      console.error('❌ Check match error:', error);
      return {
        success: false,
        isMatched: false,
        message: error.message || 'Failed to check match status'
      };
    }
  }

  /**
   * Send a rose (super like)
   * This is essentially a like with special handling
   */
  async sendRose(userId) {
    const result = await this.likeUser(userId);
    
    if (result.success) {
      console.log('🌹 Rose sent successfully!');
      return {
        ...result,
        isRose: true,
        message: result.isMatch 
          ? 'Rose sent and it\'s a match! 🌹💕' 
          : 'Rose sent successfully! 🌹'
      };
    }
    
    return result;
  }

  /**
   * Get interaction history for analytics
   * Note: This would require a backend endpoint
   */
  async getInteractionHistory(limit = 50) {
    try {
      const response = await apiClient.get(
        `/api/interaction/history?limit=${limit}`
      );

      if (response.success) {
        return {
          success: true,
          interactions: response.interactions || []
        };
      }

      return {
        success: false,
        interactions: [],
        message: response.message || 'Failed to fetch interaction history'
      };
    } catch (error) {
      console.error('❌ Get interaction history error:', error);
      return {
        success: false,
        interactions: [],
        message: error.message || 'Failed to fetch interaction history'
      };
    }
  }

  /**
   * Undo last interaction
   * Note: This would require a backend endpoint
   */
  async undoLastInteraction() {
    try {
      const response = await apiClient.post('/api/interaction/undo', {});

      if (response.success) {
        console.log('✅ Last interaction undone successfully');
        return {
          success: true,
          message: 'Last interaction undone successfully'
        };
      }

      return {
        success: false,
        message: response.message || 'Failed to undo interaction'
      };
    } catch (error) {
      console.error('❌ Undo interaction error:', error);
      return {
        success: false,
        message: error.message || 'Failed to undo interaction'
      };
    }
  }
}

// Create and export singleton instance
const interactionService = new InteractionService();
export default interactionService;
