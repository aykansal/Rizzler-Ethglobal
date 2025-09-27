# Rizzler Backend API

A robust backend API for a dating/social app built with Node.js, Express, TypeScript, and Prisma.

## 🚀 Features

- **Authentication**: Phone number & password-based login/signup
- **User Management**: Profile management with NFC ID support
- **Smart Feed**: Opposite gender filtering with dislike exclusion
- **Interactions**: Like/dislike system with match detection
- **Real-time Matching**: Automatic match detection on mutual likes
- **Recommendation System**: Basic algorithm excluding rejected users

## 📋 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration

### User Management
- `GET /api/user?nfcId=xxx` - Get user by NFC ID
- `GET /api/user/feed` - Get personalized user feed (requires auth)

### Interactions
- `POST /api/interaction` - Create like/dislike (requires auth)
- `GET /api/interaction/matches` - Get user matches (requires auth)

### Health Check
- `GET /api/health` - API health status

## 🛠️ Setup Instructions

1. **Install Dependencies**
   ```bash
   pnpm install
   ```

2. **Environment Setup**
   ```bash
   cp .env.example .env
   # Update DATABASE_URL and JWT_SECRET in .env
   ```

3. **Database Setup**
   ```bash
   # Generate Prisma client
   pnpm run prisma:generate
   
   # Run migrations
   pnpm run prisma:migrate
   ```

4. **Start Development Server**
   ```bash
   pnpm run dev
   ```

## 📊 Database Schema

### User Model
- `id`: UUID primary key
- `nfcId`: Unique NFC identifier
- `phoneNumber`: Unique phone number
- `password`: Hashed password
- `name`: Display name
- `age`: Optional age
- `gender`: MALE | FEMALE | OTHER
- `images`: Array of image URLs (max 4)
- `interests`: Array of interests
- `upvotes/downvotes`: Interaction stats

### Interaction Model
- Tracks likes/dislikes between users
- Prevents duplicate interactions
- Enables match detection

### Message Model
- User-to-user messaging support
- Sender/receiver relationships

## 🔐 Authentication

Uses JWT tokens with 7-day expiry. Include in requests as:
```
Authorization: Bearer <token>
```

## 📝 Request/Response Examples

### Login
```json
POST /api/auth/login
{
  "phoneNumber": "+1234567890",
  "password": "password123"
}
```

### Create Interaction
```json
POST /api/interaction
{
  "toUserId": "user-uuid",
  "type": "LIKE"
}
```

### Get User Feed
```json
GET /api/user/feed
Authorization: Bearer <token>
```

## 🏗️ Project Structure

```
src/
├── db/           # Database connection
├── middleware/   # Auth middleware
├── routes/       # API routes
├── services/     # Business logic
├── types/        # TypeScript types & validation
└── utils/        # Helper functions
```

## 🚨 Environment Variables

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/rizzler_db"
JWT_SECRET="your-secret-key"
PORT=3000
NODE_ENV=development
```
