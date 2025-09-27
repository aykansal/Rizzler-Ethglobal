import prisma from '../db';
import { UserQuery, UserFeedResponse } from '../types';
import { Gender, InteractionType } from '@prisma/client';

export class UserService {
  async getUserByNfcId(nfcId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { nfcId },
        select: {
          id: true,
          nfcId: true,
          name: true,
          age: true,
          gender: true,
          images: true,
          interests: true,
          upvotes: true,
          downvotes: true,
          bio: true,
          prompts: true,
        },
      });

      return user;
    } catch (error) {
      console.error('Error fetching user by NFC ID:', error);
      return null;
    }
  }

  async getFeedForUser(userId: string): Promise<UserFeedResponse> {
    try {
      // Get the current user's gender to filter for opposite gender
      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { gender: true },
      });

      if (!currentUser) {
        return {
          success: false,
          message: 'User not found',
        };
      }

      // Determine opposite gender(s)
      let oppositeGenders: Gender[] = [];
      if (currentUser.gender === Gender.MALE) {
        oppositeGenders = [Gender.FEMALE];
      } else if (currentUser.gender === Gender.FEMALE) {
        oppositeGenders = [Gender.MALE];
      } else {
        oppositeGenders = [Gender.MALE, Gender.FEMALE]; // OTHER gender sees both
      }

      // Get users that the current user has disliked (to exclude from feed)
      const dislikedUsers = await prisma.interaction.findMany({
        where: {
          fromUserId: userId,
          type: InteractionType.DISLIKE,
        },
        select: { toUserId: true },
      });

      const dislikedUserIds = dislikedUsers.map(interaction => interaction.toUserId);

      // Get feed users (opposite gender, not disliked, not self)
      const feedUsers = await prisma.user.findMany({
        where: {
          gender: { in: oppositeGenders },
          id: {
            not: userId,
            notIn: dislikedUserIds,
          },
        },
        select: {
          id: true,
          nfcId: true,
          name: true,
          age: true,
          gender: true,
          images: true,
          interests: true,
          upvotes: true,
          downvotes: true,
          bio: true,
          prompts: true,
        },
        // Order by upvotes desc for basic recommendation
        orderBy: [
          { upvotes: 'desc' },
          { createdAt: 'desc' },
        ],
        take: 50, // Limit for performance
      });

      return {
        success: true,
        users: feedUsers.map(user => ({
          ...user,
          bio: user.bio || undefined,
          prompts: user.prompts as any[] || undefined,
        })),
      };
    } catch (error) {
      console.error('Error fetching user feed:', error);
      return {
        success: false,
        message: 'An error occurred while fetching feed',
      };
    }
  }

  async updateUserStats(userId: string, isUpvote: boolean) {
    try {
      const updateData = isUpvote 
        ? { upvotes: { increment: 1 } }
        : { downvotes: { increment: 1 } };

      await prisma.user.update({
        where: { id: userId },
        data: updateData,
      });
    } catch (error) {
      console.error('Error updating user stats:', error);
    }
  }
}
