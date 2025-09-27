import { PrismaClient, Gender } from '@prisma/client';
import { hashPassword } from '../utils/helpers';

const prisma = new PrismaClient();

const sampleUsers = [
  {
    nfcId: 'nfc_001',
    name: 'Sarah',
    age: 24,
    bio: 'Love hiking and coffee ☕',
    phoneNumber: '+1234567890',
    password: 'password123',
    gender: Gender.FEMALE,
    images: [
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop&crop=face'
    ],
    interests: ['Travel', 'Photography', 'Fitness'],
    prompts: [
      { question: 'My ideal first date', answer: 'A sunset hike followed by coffee ☕' },
      { question: 'I\'m weirdly attracted to', answer: 'People who can make me laugh until I cry' },
      { question: 'The way to my heart', answer: 'Surprise me with my favorite book' }
    ]
  },
  {
    nfcId: 'nfc_002',
    name: 'Alex',
    age: 26,
    bio: 'Software engineer by day, musician by night 🎸',
    phoneNumber: '+1234567891',
    password: 'password123',
    gender: Gender.MALE,
    images: [
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop&crop=face'
    ],
    interests: ['Music', 'Technology', 'Gaming', 'Cooking'],
    prompts: [
      { question: 'My perfect Sunday', answer: 'Coding a new project while jamming to indie rock' },
      { question: 'I geek out on', answer: 'New programming languages and guitar pedals' },
      { question: 'Fun fact about me', answer: 'I once performed at a tech conference' }
    ]
  },
  {
    nfcId: 'nfc_003',
    name: 'Emma',
    age: 22,
    bio: 'Art student who loves vintage books and tea 📚',
    phoneNumber: '+1234567892',
    password: 'password123',
    gender: Gender.FEMALE,
    images: [
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop&crop=face'
    ],
    interests: ['Art', 'Literature', 'Vintage Fashion', 'Tea'],
    prompts: [
      { question: 'My happy place', answer: 'A cozy bookstore with a cup of Earl Grey' },
      { question: 'I\'m passionate about', answer: 'Creating art that tells stories' },
      { question: 'Best way to win me over', answer: 'Recommend a book I\'ve never heard of' }
    ]
  },
  {
    nfcId: 'nfc_004',
    name: 'Jake',
    age: 28,
    bio: 'Adventure seeker and food enthusiast 🏔️',
    phoneNumber: '+1234567893',
    password: 'password123',
    gender: Gender.MALE,
    images: [
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=600&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=600&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1489980557514-251d61e3eeb6?w=400&h=600&fit=crop&crop=face'
    ],
    interests: ['Rock Climbing', 'Food', 'Travel', 'Surfing'],
    prompts: [
      { question: 'My ideal adventure', answer: 'Backpacking through Southeast Asia' },
      { question: 'I\'m looking for', answer: 'Someone to share epic sunrises with' },
      { question: 'My superpower', answer: 'Finding the best hole-in-the-wall restaurants' }
    ]
  },
  {
    nfcId: 'nfc_005',
    name: 'Maya',
    age: 25,
    bio: 'Yoga instructor spreading good vibes ✨',
    phoneNumber: '+1234567894',
    password: 'password123',
    gender: Gender.FEMALE,
    images: [
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=600&fit=crop&crop=face'
    ],
    interests: ['Yoga', 'Meditation', 'Plant-based Cooking', 'Nature'],
    prompts: [
      { question: 'My morning ritual', answer: 'Sunrise yoga followed by green smoothie' },
      { question: 'What matters to me', answer: 'Living mindfully and staying connected to nature' },
      { question: 'Let\'s bond over', answer: 'Trying new plant-based recipes together' }
    ]
  }
];

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');

    // Clean existing data
    await prisma.interaction.deleteMany();
    await prisma.message.deleteMany();
    await prisma.user.deleteMany();

    console.log('🗑️  Cleaned existing data');

    // Create sample users
    for (const userData of sampleUsers) {
      const hashedPassword = await hashPassword(userData.password);
      
      await prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
        },
      });

      console.log(`✅ Created user: ${userData.name}`);
    }

    console.log('🎉 Database seeded successfully!');
    console.log(`📊 Created ${sampleUsers.length} sample users`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seed();