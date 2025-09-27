# Rizzler Backend API Usage Guide

## 🎉 Completed MVP Features

### ✅ Authentication System
- **Phone number + password** based auth
- JWT tokens with 7-day expiry
- Secure password hashing with bcrypt

### ✅ User Profile Management
- **NFC ID** support for unique identification
- **Multiple photos** (up to 4 per user)
- **Bio** and **interests** array
- **Prompt responses** (question/answer pairs)
- **Age and gender** filtering

### ✅ Smart Recommendation System
- **Opposite gender** filtering
- **Dislike exclusion** (won't show rejected users again)
- **Upvote-based** ranking for better matches

### ✅ Interaction System
- **Like/Dislike** functionality
- **Match detection** (mutual likes)
- **User statistics** tracking (upvotes/downvotes)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd backend
pnpm install
```

### 2. Setup Environment
```bash
# Copy the example environment file
cp .env.example .env

# Update DATABASE_URL in .env with your PostgreSQL connection
DATABASE_URL="postgresql://username:password@localhost:5432/rizzler_db"
```

### 3. Setup Database
```bash
# Generate Prisma client
pnpm run prisma:generate

# Run database migrations
pnpm run prisma:migrate

# Build the project first (required for seeding)
pnpm run build

# Seed with sample data (optional)
pnpm run prisma:seed
```

### 4. Start Development Server
```bash
pnpm run dev
```

Server will run on `http://localhost:3000`

---

## 📚 API Endpoints

### Authentication

#### Sign Up
```http
POST /api/auth/signup
Content-Type: application/json

{
  "nfcId": "nfc_001",
  "phoneNumber": "+1234567890",
  "password": "password123",
  "name": "Sarah",
  "age": 24,
  "gender": "FEMALE",
  "bio": "Love hiking and coffee ☕",
  "images": [
    "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop&crop=face"
  ],
  "interests": ["Travel", "Photography", "Fitness"],
  "prompts": [
    {
      "question": "My ideal first date",
      "answer": "A sunset hike followed by coffee ☕"
    },
    {
      "question": "I'm weirdly attracted to",
      "answer": "People who can make me laugh until I cry"
    }
  ]
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "phoneNumber": "+1234567890",
  "password": "password123"
}
```

### User Management

#### Get User by NFC ID
```http
GET /api/user?nfcId=nfc_001
```

#### Get Personalized Feed (Requires Auth)
```http
GET /api/user/feed
Authorization: Bearer <jwt_token>
```

### Interactions

#### Like/Dislike User (Requires Auth)
```http
POST /api/interaction
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "toUserId": "user-uuid-here",
  "type": "LIKE"
}
```

#### Get Matches (Requires Auth)
```http
GET /api/interaction/matches
Authorization: Bearer <jwt_token>
```

### Health Check
```http
GET /api/health
```

---

## 💾 Sample Data Structure

The seed file includes 5 sample users with complete profiles:

```javascript
{
  id: "uuid",
  name: "Sarah",
  age: 24,
  bio: "Love hiking and coffee ☕",
  images: ["url1", "url2", "url3", "url4"],
  interests: ["Travel", "Photography", "Fitness"],
  prompts: [
    {
      question: "My ideal first date",
      answer: "A sunset hike followed by coffee ☕"
    },
    {
      question: "I'm weirdly attracted to", 
      answer: "People who can make me laugh until I cry"
    },
    {
      question: "The way to my heart",
      answer: "Surprise me with my favorite book"
    }
  ],
  gender: "FEMALE",
  upvotes: 0,
  downvotes: 0
}
```

---

## 🔧 Development Commands

```bash
# Development
pnpm run dev              # Start development server
pnpm run build           # Build TypeScript
pnpm run start           # Start production server

# Database
pnpm run prisma:generate # Generate Prisma client
pnpm run prisma:migrate  # Run migrations  
pnpm run build          # Build project (required for seeding)
pnpm run prisma:seed     # Seed sample data
pnpm run db:reset        # Reset DB and seed

# Testing
curl http://localhost:3000/api/health
```

---

## 🎯 Key Features Implemented

1. **Structured Directory Layout**: Services, routes, middleware, types
2. **Type Safety**: Full TypeScript with Zod validation
3. **Security**: JWT auth, password hashing, input validation
4. **Scalable**: Modular architecture with proper separation of concerns
5. **Database**: PostgreSQL with Prisma ORM
6. **User Experience**: Smart filtering and recommendation algorithm

## 🚀 Ready for Frontend Integration!

Your backend MVP is complete and ready for frontend integration. All endpoints are documented and tested. The feed algorithm ensures users see relevant matches while excluding previously disliked profiles.

**Base URL**: `http://localhost:3000`
**Health Check**: `GET /api/health`
