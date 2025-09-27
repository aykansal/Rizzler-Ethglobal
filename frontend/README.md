# Rizzler Frontend

A modern dating app frontend built with Next.js 15, React 19, and TailwindCSS, integrated with the Rizzler backend API.

## 🚀 Features

### ✅ **Authentication System**
- Phone number + password login/signup
- JWT token management
- Auto-redirect for protected routes
- Token validation and refresh

### ✅ **User Registration Flow**
- Multi-step signup process
- Profile creation with photos, bio, interests
- Interactive prompts system
- Age and gender selection

### ✅ **Smart Matching System**
- Real-time user feed from backend
- Swipe interactions (like/dislike)
- Rose sending (super likes)
- Match detection and animations
- Opposite gender filtering

### ✅ **Profile Management**
- Complete user profiles display
- Stats tracking (likes, matches)
- Photo galleries
- Interest tags and prompts

### ✅ **API Integration**
- Complete backend API integration
- Real-time data synchronization  
- Error handling and loading states
- Offline-first approach

## 🏗️ Architecture

### **API Layer**
```
lib/
├── constants.js     # API URLs and config
└── api.js          # HTTP client with auth
```

### **Services Layer**
```
services/
├── authService.js       # Authentication
├── userService.js       # User management  
├── interactionService.js # Like/dislike system
└── index.js            # Service exports
```

### **Custom Hooks**
```
hooks/
└── useAuth.js      # Authentication state management
```

### **Pages Structure**
```
app/
├── (auth)/
│   ├── login/      # Login page with phone auth
│   └── signup/     # Multi-step registration
└── (pages)/
    └── male/       # Main app routes
        ├── explore/    # Swipe interface
        ├── profile/    # User profile
        └── chats/     # Messaging (future)
```

## 🔧 API Configuration

The app connects to the backend via a configurable API URL:

```javascript
// lib/constants.js
export const API_CONFIG = {
  BASE_URL: 'https://backend.rizzler.io',
  ENDPOINTS: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
    GET_FEED: '/api/user/feed',
    CREATE_INTERACTION: '/api/interaction',
    // ... more endpoints
  }
};
```

## 📱 Key Components

### **Authentication Flow**
```javascript
// Login with phone number and password
const result = await authService.login(phoneNumber, password);
if (result.success) {
  router.push('/male/explore');
}
```

### **User Feed Integration**
```javascript
// Load personalized user feed
const result = await userService.getUserFeed();
// Returns opposite gender users, excluding disliked profiles
```

### **Interaction System**
```javascript
// Like/dislike users
await interactionService.likeUser(userId);
await interactionService.dislikeUser(userId);
await interactionService.sendRose(userId); // Super like
```

## 🎨 UI Features

### **Modern Design**
- Gradient backgrounds and smooth animations
- Card-based profile layouts
- Responsive mobile-first design
- Loading states and error handling

### **Interactive Elements**
- Swipe gestures for like/dislike
- Drag-to-send rose functionality
- Match celebration animations
- Photo galleries with error fallbacks

### **Real-time Feedback**
- Instant interaction responses
- Match notifications
- Error messaging
- Loading indicators

## 📊 Data Flow

```
1. User Authentication
   Login/Signup → Backend API → JWT Token → Local Storage

2. Feed Loading  
   User Profile → API Request → Filtered Users → Display

3. Interactions
   Swipe/Rose → API Call → Match Check → UI Update

4. Profile Display
   User Data → Transform → Display → Stats/Matches
```

## 🛠️ Development

### **Getting Started**
```bash
npm install
npm run dev
```

### **API Integration**
The frontend automatically connects to the backend API. Make sure:
1. Backend is running on the configured URL
2. Database is seeded with test users
3. CORS is enabled for frontend domain

### **Environment Setup**
No environment variables needed - all configuration is in `lib/constants.js`.

## 📈 Performance Optimizations

- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Automatic fallbacks and error handling
- **API Caching**: Smart caching of user data
- **Bundle Splitting**: Optimized for mobile performance

## 🔐 Security Features

- JWT token management
- Automatic token validation
- Protected route handling
- Secure API communication
- Input validation and sanitization

## 🚀 Ready for Production

The frontend is production-ready with:
- ✅ Complete backend integration
- ✅ Authentication flow
- ✅ Real user data display
- ✅ Interaction system
- ✅ Error handling
- ✅ Mobile optimization

## 🔄 Future Enhancements

- Real-time messaging system
- Push notifications
- Advanced matching algorithms
- Video call integration
- Social media sharing

---

**Built with ❤️ using Next.js 15, React 19, and modern web technologies**