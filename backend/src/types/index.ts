import { z } from 'zod';
import { Gender, InteractionType } from '@prisma/client';

// Validation schemas
export const loginSchema = z.object({
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Prompt schema for question/answer pairs
export const promptSchema = z.object({
  question: z.string().min(1, 'Question is required'),
  answer: z.string().min(1, 'Answer is required'),
});

export const signupSchema = z.object({
  nfcId: z.string().min(1, 'NFC ID is required'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(1, 'Name is required'),
  age: z.number().int().min(18, 'Must be at least 18 years old').optional(),
  gender: z.nativeEnum(Gender),
  images: z.array(z.string().url()).max(4, 'Maximum 4 images allowed'),
  interests: z.array(z.string()).max(10, 'Maximum 10 interests allowed'),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  prompts: z.array(promptSchema).max(3, 'Maximum 3 prompts allowed').optional(),
});

export const interactionSchema = z.object({
  toUserId: z.string().uuid('Invalid user ID'),
  type: z.nativeEnum(InteractionType),
});

export const userQuerySchema = z.object({
  nfcId: z.string().min(1, 'NFC ID is required'),
});

// Types
export type LoginData = z.infer<typeof loginSchema>;
export type SignupData = z.infer<typeof signupSchema>;
export type InteractionData = z.infer<typeof interactionSchema>;
export type UserQuery = z.infer<typeof userQuerySchema>;

export type PromptType = {
  question: string;
  answer: string;
};

export interface AuthResponse {
  success: boolean;
  token?: string;
  user?: {
    id: string;
    nfcId: string;
    name: string;
    phoneNumber: string;
    gender: Gender;
    images: string[];
    interests: string[];
    upvotes: number;
    downvotes: number;
    bio?: string;
    prompts?: PromptType[];
  };
  message?: string;
}

export interface UserFeedResponse {
  success: boolean;
  users?: {
    id: string;
    nfcId: string;
    name: string;
    age?: number | null;
    gender: Gender;
    images: string[];
    interests: string[];
    upvotes: number;
    downvotes: number;
    bio?: string;
    prompts?: PromptType[];
  }[];
  message?: string;
}

export interface InteractionResponse {
  success: boolean;
  message?: string;
}
