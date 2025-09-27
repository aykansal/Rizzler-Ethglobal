import prisma from '../db';
import { hashPassword, comparePassword, generateToken } from '../utils/helpers';
import { LoginData, SignupData, AuthResponse } from '../types';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export class AuthService {
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const user = await prisma.user.findUnique({
        where: { phoneNumber: data.phoneNumber },
      });

      if (!user) {
        return {
          success: false,
          message: 'Invalid phone number or password',
        };
      }

      const isValidPassword = await comparePassword(data.password, user.password);
      if (!isValidPassword) {
        return {
          success: false,
          message: 'Invalid phone number or password',
        };
      }

      const token = generateToken({
        id: user.id,
        nfcId: user.nfcId,
        phoneNumber: user.phoneNumber,
      });

      return {
        success: true,
        token,
        user: {
          id: user.id,
          nfcId: user.nfcId,
          name: user.name,
          phoneNumber: user.phoneNumber,
          gender: user.gender,
          images: user.images,
          interests: user.interests,
          upvotes: user.upvotes,
          downvotes: user.downvotes,
          bio: user.bio || undefined,
          prompts: user.prompts as any[] || undefined,
        },
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'An error occurred during login',
      };
    }
  }

  async signup(data: SignupData): Promise<AuthResponse> {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { phoneNumber: data.phoneNumber },
            { nfcId: data.nfcId },
          ],
        },
      });

      if (existingUser) {
        return {
          success: false,
          message: existingUser.phoneNumber === data.phoneNumber 
            ? 'Phone number already registered' 
            : 'NFC ID already registered',
        };
      }

      const hashedPassword = await hashPassword(data.password);

      const user = await prisma.user.create({
        data: {
          nfcId: data.nfcId,
          phoneNumber: data.phoneNumber,
          password: hashedPassword,
          name: data.name,
          age: data.age,
          gender: data.gender,
          images: data.images,
          interests: data.interests,
          bio: data.bio,
          prompts: data.prompts || [],
        },
      });

      const token = generateToken({
        id: user.id,
        nfcId: user.nfcId,
        phoneNumber: user.phoneNumber,
      });

      return {
        success: true,
        token,
        user: {
          id: user.id,
          nfcId: user.nfcId,
          name: user.name,
          phoneNumber: user.phoneNumber,
          gender: user.gender,
          images: user.images,
          interests: user.interests,
          upvotes: user.upvotes,
          downvotes: user.downvotes,
          bio: user.bio || undefined,
          prompts: user.prompts as any[] || undefined,
        },
      };
    } catch (error) {
      console.error('Signup error:', error);
      
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          return {
            success: false,
            message: 'Phone number or NFC ID already exists',
          };
        }
      }

      return {
        success: false,
        message: 'An error occurred during signup',
      };
    }
  }
}
