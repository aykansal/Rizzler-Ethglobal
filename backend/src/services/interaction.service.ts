import prisma from '../db';
import { InteractionData, InteractionResponse } from '../types';
import { InteractionType } from '@prisma/client';
import { UserService } from './user.service';

export class InteractionService {
  private userService = new UserService();

  async createInteraction(fromUserId: string, data: InteractionData): Promise<InteractionResponse> {
    try {
      // Check if user is trying to interact with themselves
      if (fromUserId === data.toUserId) {
        return {
          success: false,
          message: 'Cannot interact with yourself',
        };
      }

      // Check if target user exists
      const targetUser = await prisma.user.findUnique({
        where: { id: data.toUserId },
      });

      if (!targetUser) {
        return {
          success: false,
          message: 'Target user not found',
        };
      }

      // Check if interaction already exists
      const existingInteraction = await prisma.interaction.findUnique({
        where: {
          fromUserId_toUserId: {
            fromUserId,
            toUserId: data.toUserId,
          },
        },
      });

      if (existingInteraction) {
        // Update existing interaction
        await prisma.interaction.update({
          where: {
            fromUserId_toUserId: {
              fromUserId,
              toUserId: data.toUserId,
            },
          },
          data: {
            type: data.type,
          },
        });
      } else {
        // Create new interaction
        await prisma.interaction.create({
          data: {
            fromUserId,
            toUserId: data.toUserId,
            type: data.type,
          },
        });
      }

      // Update user stats based on interaction type
      await this.userService.updateUserStats(data.toUserId, data.type === InteractionType.LIKE);

      // Check for mutual like (match)
      if (data.type === InteractionType.LIKE) {
        const mutualInteraction = await prisma.interaction.findUnique({
          where: {
            fromUserId_toUserId: {
              fromUserId: data.toUserId,
              toUserId: fromUserId,
            },
          },
        });

        if (mutualInteraction && mutualInteraction.type === InteractionType.LIKE) {
          return {
            success: true,
            message: 'It\'s a match! 🎉',
          };
        }
      }

      return {
        success: true,
        message: data.type === InteractionType.LIKE ? 'Liked successfully' : 'Disliked successfully',
      };
    } catch (error) {
      console.error('Error creating interaction:', error);
      return {
        success: false,
        message: 'An error occurred while processing interaction',
      };
    }
  }

  async getMatches(userId: string) {
    try {
      // Find mutual likes
      const matches = await prisma.interaction.findMany({
        where: {
          fromUserId: userId,
          type: InteractionType.LIKE,
          toUser: {
            sentInteractions: {
              some: {
                fromUserId: { in: [userId] },
                type: InteractionType.LIKE,
              },
            },
          },
        },
        include: {
          toUser: {
            select: {
              id: true,
              nfcId: true,
              name: true,
              age: true,
              gender: true,
              images: true,
              interests: true,
              bio: true,
              prompts: true,
            },
          },
        },
      });

      return matches.map(match => match.toUser);
    } catch (error) {
      console.error('Error fetching matches:', error);
      return [];
    }
  }
}
