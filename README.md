# 📱 Bemb Dating App - Complete Documentation

## Table of Contents

1. [Overview](#overview)
2. [Technology Stack](#technology-stack)
3. [Architecture](#architecture)
4. [Database Schema](#database-schema)
5. [Backend API](#backend-api)
6. [Frontend Structure](#frontend-structure)
7. [Features](#features)
8. [Setup & Installation](#setup--installation)
9. [Deployment](#deployment)
10. [Security](#security)
11. [Others](#current-feature-status)

---

## Overview

**Bemb** is a modern dating application that helps users find meaningful connections through smart matching algorithms based on location, preferences, interests, and mutual attraction.

### Key Features

- ✅ User authentication (JWT-based)
- ✅ Profile creation with image upload
- ✅ Location-based matching
- ✅ Swipe-based discovery (like Tinder)
- ✅ Match system with mutual likes
- ✅ Real-time messaging
- ✅ Interest-based filtering
- ✅ Block/unblock users
- ✅ Dark mode support
- ✅ Mobile responsive

### Design Philosophy

- **User-first:** Intuitive, beautiful interface
- **Privacy-focused:** User data protection
- **Performance:** Fast, responsive experience
- **Accessibility:** Works on all devices

---

## Technology Stack

### Frontend

```
- Framework: Next.js 14 (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- UI Components: shadcn/ui + Radix UI
- Icons: Lucide React
- State Management: React Context API
- HTTP Client: Fetch API
```

### Backend

```
- Runtime: Node.js
- Framework: Express.js
- Language: JavaScript
- Database: MongoDB
- ODM: Mongoose
- Authentication: JWT (jsonwebtoken)
- Password Hashing: bcrypt
- Validation: Custom middleware
```

### Development Tools

```
- Package Manager: npm/yarn
- Version Control: Git
- Code Editor: VS Code (recommended)
- API Testing: Postman
- Database GUI: MongoDB Compass
```

---

## Architecture

### System Architecture

```
┌─────────────────────────────────────────────────┐
│                   Client                         │
│  ┌──────────────────────────────────────────┐  │
│  │     Next.js 14 (App Router)              │  │
│  │  ┌────────────────────────────────────┐  │  │
│  │  │  Pages: Home, Discover, Chat,      │  │  │
│  │  │         Profile, blocked, Auth     │  │  │
│  │  └────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────┐  │  │
│  │  │  Components: ProfileCard,          │  │  │
│  │  │              MatchModal, etc.      │  │  │
│  │  └────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────┐  │  │
│  │  │  Context: AuthContext              │  │  │
│  │  └────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                       │
                       │ HTTP/REST API
                       │ (JWT Auth)
                       ▼
┌─────────────────────────────────────────────────┐
│                   Server                         │
│  ┌──────────────────────────────────────────┐  │
│  │     Express.js REST API                  │  │
│  │  ┌────────────────────────────────────┐  │  │
│  │  │  Routes: /users, /profiles,        │  │  │
│  │  │      /matches, /messages , blocked │  │  │
│  │  └────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────┐  │  │
│  │  │  Controllers: userController,      │  │  │
│  │  │               matchController       │  │  │
│  │  └────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────┐  │  │
│  │  │  Middleware: auth, errorHandler    │  │  │
│  │  └────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                       │
                       │ Mongoose ODM
                       ▼
┌─────────────────────────────────────────────────┐
│                  MongoDB Atlas                   │
│  ┌──────────────────────────────────────────┐  │
│  │  Collections: users, profiles,           │  │
│  │         matches, messages , blocked      │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### Request Flow

```
User Action → Frontend Component → API Request →
→ Backend Route → Middleware (Auth) →
→ Controller → MongoDB → Response →
→ Frontend Update → UI Render
```

---

## Database Schema

### User Collection

```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  createdAt: Date (default: Date.now)
}

// Indexes
email: unique
```

### Profile Collection

```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  name: String (required),
  age: Number (required, min: 18, max: 100),
  bio: String,
  profilePic: String (image URL),

  // Location (GeoJSON)
  location: {
    type: String (enum: ["Point"], default: "Point"),
    coordinates: [Number] // [longitude, latitude]
  },

  // Preferences
  gender: String (enum: ["male", "female", "non-binary", "other"]),
  interestedIn: [String] (enum: ["male", "female", "non-binary", "other"]),
  interests: [String] (default: []),

  createdAt: Date (default: Date.now)
}

// Indexes
userId: 1
location: 2dsphere (geospatial index)
```

### Match Collection

```javascript
{
  _id: ObjectId,
  fromUser: ObjectId (ref: User, required),
  toUser: ObjectId (ref: User, required),
  isMatch: Boolean (default: false),
  liked: Boolean (required),
  skippedAt: Date (timestamp when skipped),
  createdAt: Date (default: Date.now)
}

// Indexes
fromUser: 1, toUser: 1
skippedAt: 1
```

### Message Collection

```javascript
{
  _id: ObjectId,
  matchId: ObjectId (ref: Match, required),
  senderId: ObjectId (ref: User, required),
  receiverId: ObjectId (ref: User, required),
  content: String (required),
  createdAt: Date (default: Date.now)
}

// Indexes
matchId: 1
createdAt: -1
```

### Block Collection

```javascript
{
  _id: ObjectId,
  blockerId: ObjectId (ref: User, required),
  blockedId: ObjectId (ref: User, required),
  reason: String (enum: ["spam", "inappropriate", "harassment", "other"]),
  createdAt: Date (default: Date.now)
}

// Indexes
blockerId: 1, blockedId: 1 (unique compound index)
blockedId: 1, blockerId: 1
```

### Relationships

```
User (1) ←→ (1) Profile
User (1) ←→ (N) Match (as fromUser or toUser)
Match (1) ←→ (N) Message
User (1) ←→ (N) Block (as blocker or blocked)
```

---

## Backend API

### Base URL

```
Development: http://localhost:5000
Production: https://dating-app-phi-five.vercel.app
```

### Authentication

All protected routes require JWT token:

```
Authorization: Bearer <token>
```

### API Endpoints

#### **1. User Authentication**

**Register User**

```
POST /users/register
Body: {
  email: string,
  password: string (min 8 chars)
}
Response: {
  message: string,
  user: { id, email },
  access: string (JWT token)
}
```

**Login User**

```
POST /users/login
Body: {
  email: string,
  password: string
}
Response: {
  access: string (JWT token)
}
```

**Get Profile**

```
GET /users/profile
Headers: Authorization: Bearer <token>
Response: {
  user: { _id, email, createdAt }
}
```

#### **2. Profile Management**

**Create/Update Profile**

```
POST /profiles
Headers: Authorization: Bearer <token>
Body: {
  name: string,
  age: number (18-100),
  bio: string,
  profilePic: string (URL),
  location: {
    type: "Point",
    coordinates: [longitude, latitude]
  },
  gender: string ("male"|"female"|"non-binary"|"other"),
  interestedIn: string[],
  interests: string[]
}
Response: {
  message: string,
  profile: Profile
}
```

**Get Own Profile**

```
GET /profiles/me
Headers: Authorization: Bearer <token>
Response: {
  profile: Profile
}
```

**Get Profile by ID**

```
GET /profiles/:profileId
Headers: Authorization: Bearer <token>
Response: {
  profile: Profile
}
```

**Delete Profile**

```
DELETE /profiles
Headers: Authorization: Bearer <token>
Response: {
  message: "Profile deleted successfully"
}
```

#### **3. Matching System**

**Get Potential Matches (Discovery)**

```
GET /matches/discover?maxDistance=50&minAge=21&maxAge=35&limit=20
Headers: Authorization: Bearer <token>
Query Parameters:
  - maxDistance: number (km, default: 50)
  - minAge: number (optional)
  - maxAge: number (optional)
  - limit: number (default: 20)
Response: {
  matches: Profile[],
  count: number
}
```

**Swipe (Like/Skip)**

```
POST /matches/swipe
Headers: Authorization: Bearer <token>
Body: {
  toUserId: string,
  liked: boolean
}
Response: {
  message: string,
  isMatch: boolean,
  match: Match
}
```

**Get My Matches**

```
GET /matches
Headers: Authorization: Bearer <token>
Response: {
  matches: [{
    matchId: string,
    userId: string,
    profile: Profile,
    matchedAt: Date
  }],
  count: number
}
```

**Unmatch**

```
DELETE /matches/:matchedUserId
Headers: Authorization: Bearer <token>
Response: {
  message: "Unmatched successfully"
}
```

**Check Match Status**

```
GET /matches/check/:otherUserId
Headers: Authorization: Bearer <token>
Response: {
  isMatched: boolean,
  match: Match | null
}
```

#### **4. Messaging**

**Get All Conversations**

```
GET /messages/conversations
Headers: Authorization: Bearer <token>
Response: {
  conversations: [{
    matchId: string,
    otherUserId: string,
    lastMessage: Message,
    unreadCount: number,
    createdAt: Date
  }],
  count: number
}
```

**Get Messages by Match ID**

```
GET /messages/:matchId
Headers: Authorization: Bearer <token>
Response: {
  messages: Message[],
  count: number
}
```

**Send Message**

```
POST /messages
Headers: Authorization: Bearer <token>
Body: {
  matchId: string,
  receiverId: string,
  content: string
}
Response: {
  message: "Message sent successfully",
  data: Message
}
```

**Delete Message**

```
DELETE /messages/:messageId
Headers: Authorization: Bearer <token>
Response: {
  message: "Message deleted successfully"
}
```

#### **5. Block Management**

**Block User**

```
POST /block
Headers: Authorization: Bearer <token>
Body: {
  blockedId: string,
  reason: string ("spam"|"inappropriate"|"harassment"|"other")
}
Response: {
  message: "User blocked successfully",
  block: Block
}
```

**Get Blocked Users**

```
GET /block
Headers: Authorization: Bearer <token>
Response: {
  blockedUsers: [{
    _id: string,
    email: string,
    blockedAt: Date
  }],
  count: number
}
```

**Unblock User**

```
DELETE /block/:userId
Headers: Authorization: Bearer <token>
Response: {
  message: "User unblocked successfully"
}
```

**Check if User is Blocked**

```
GET /block/check/:userId
Headers: Authorization: Bearer <token>
Response: {
  isBlocked: boolean
}
```

### Error Responses

All errors follow this format:

```json
{
  "error": {
    "message": "Error description",
    "code": "ERROR_CODE",
    "statusCode": 400
  }
}
```

Common Status Codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Server Error

---

## Frontend Structure

### Directory Structure

```
client/
├── app/
│   ├── (protected)/           # Protected routes (require auth)
│   │   ├── blocked/
│   │   │   └── page.tsx       # Blocked users management
│   │   ├── chat/
│   │   │   └── page.tsx       # Chat/messaging page
│   │   ├── discover/
│   │   │   └── page.tsx       # Swipe/discovery page
│   │   ├── profile/
│   │   │   └── page.tsx       # Profile edit page
│   │   └── layout.tsx         # Protected layout wrapper
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx       # Login page
│   │   └── register/
│   │       └── page.tsx       # Register page
│   ├── logout/
│   │   └── page.tsx           # Logout handler
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   └── globals.css            # Global styles
│
├── components/
│   ├── ui/                    # shadcn/ui components
│   │   ├── avatar.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── spinner.tsx
│   │
│   ├── ChatWindow.tsx         # Chat interface
│   ├── DiscoverFilters.tsx    # Age/distance filters
│   ├── Footer.tsx             # App footer
│   ├── ImageUpload.tsx        # Profile image uploader
│   ├── InterestsSelector.tsx  # Interests picker
│   ├── LocationSelector.tsx   # Location picker
│   ├── MatchList.tsx          # Match sidebar list
│   ├── MatchModal.tsx         # Match notification
│   ├── Navbar.tsx             # Main navigation
│   ├── ProfileCard.tsx        # Swipeable card
│   ├── ProfileForm.tsx        # Profile edit form
│   ├── ProtectedRoute.tsx     # Auth guard
│   ├── ThemeToggle.tsx        # Dark mode toggle
│   └── theme-provider.tsx     # Theme context
│
├── context/
│   └── AuthContext.tsx        # Authentication state
│
├── api/
│   └── block.ts               # Block API functions
│
└── lib/
    └── utils.ts               # Helper functions
```

### Page Routes

**Public Routes:**

```
/                    - Home/landing page
/auth/login         - Login page
/auth/register      - Registration page
```

**Protected Routes:**

```
/discover           - Browse potential matches
/chat               - View matches and messages
/profile            - Edit user profile
/blocked            - Manage blocked users
/logout             - Logout handler
```

### Component Hierarchy

```
RootLayout (layout.tsx)
├── ThemeProvider
├── AuthProvider
│   ├── Navbar (conditional based on auth)
│   ├── Children (pages)
│   └── Footer
│
├── Home Page (/)
│   ├── Hero Section
│   └── Features Grid
│
├── Auth Pages (/auth/*)
│   ├── Login Form
│   └── Register Form
│
├── Discover Page (/discover)
│   ├── Header
│   ├── DiscoverFilters
│   ├── ProfileCard (swipeable)
│   └── MatchModal
│
├── Chat Page (/chat)
│   ├── MatchList (sidebar)
│   └── ChatWindow
│
└── Profile Page (/profile)
    └── ProfileForm
        ├── ImageUpload
        ├── LocationSelector
        └── InterestsSelector

└── Blocked Users Page (/blocked)
    ├── Header
    ├── Blocked Users List
    └── Unblock Actions
```

---

## Features

### 1. Authentication System

**Features:**

- JWT-based authentication
- Secure password hashing (bcrypt)
- Protected routes
- Auto-login on registration
- Session persistence (localStorage)
- Auto-redirect based on auth state

**Flow:**

```
Register → Auto-login → Redirect to /profile
Login → Verify credentials → Redirect to /discover
Logout → Clear token → Redirect to /auth/login
Protected Route → Check token → Allow/Deny access
```

### 2. Profile Management

**Features:**

- Image upload with preview
- Smart location selector (Metro Manila presets)
- Interactive interests selector (60+ options)
- Gender and preference selection
- Bio with character counter
- Profile completion tracking
- Update/delete functionality

**Validation:**

- Name: Required
- Age: 18-100
- Gender: Required (male/female/non-binary/other)
- Interested In: Required (array)
- Location: Valid coordinates
- Image: Max 5MB

### 3. Discovery/Matching

**Features:**

- Swipe-based interface (Tinder-style)
- Like (right swipe) or skip (left swipe)
- Visual swipe indicators (LIKE/NOPE)
- Match detection (mutual likes)
- Match modal with actions
- Skip timeout (7 days cooldown)
- Smart filtering

**Filters:**

- Distance: 10-50km or unlimited
- Age range: Min/max
- Gender preferences
- Mutual interest requirement

**Matching Algorithm:**

```
1. Get user's profile
2. Find users matching criteria:
   - User interested in their gender
   - They interested in user's gender
   - Within distance range
   - Within age range
   - Not already swiped
3. Exclude self and previous swipes
4. Apply location-based sorting
5. Return profiles
```

**Skip Timeout Logic:**

```
- User swipes left → Timestamp saved
- Profile hidden for 7 days
- After 7 days → Profile reappears
- User can swipe again
```

### 4. Real-Time Messaging

**Features:**

- Match-based chat rooms
- Text messaging
- Message history
- Timestamp display
- Auto-scroll to latest
- Message polling (3-second intervals)
- Unmatch functionality
- Empty states

**Chat Flow:**

```
1. Users match
2. Chat unlocked
3. Send messages via POST /messages
4. Poll GET /messages/:matchId every 3s
5. Display messages in chat window
6. Unmatch deletes conversation
```

### 5. UI/UX Features

**Design System:**

- Glassmorphism effects
- Gradient backgrounds
- Pink/rose color scheme
- Smooth animations
- Hover effects
- Loading states
- Error handling
- Empty states

**Responsive Design:**

- Mobile-first approach
- Breakpoints: 640px, 768px, 1024px
- Touch-optimized
- Adaptive layouts

**Dark Mode:**

- System preference detection
- Manual toggle
- Persistent across sessions
- All components themed

**Accessibility:**

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus states
- Alt text for images

---

## Setup & Installation

### Prerequisites

```bash
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Git
- Code editor (VS Code recommended)
```

### Backend Setup

1. **Clone Repository**

```bash
git clone <repository-url>
cd bemb-dating-app/server
```

2. **Install Dependencies**

```bash
npm install
```

3. **Environment Variables**

Create `.env` file in server directory:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/bemb?retryWrites=true&w=majority

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Optional: For future features
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

4. **Start Server**

```bash
# Development
npm run dev

# Production
npm start
```

Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to Client**

```bash
cd ../client
```

2. **Install Dependencies**

```bash
npm install
```

3. **Environment Variables**

Create `.env.local` file in client directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

4. **Start Development Server**

```bash
npm run dev
```

Client runs on `http://localhost:3000`

### MongoDB Setup

1. **Create MongoDB Atlas Cluster**

- Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas)
- Create free cluster
- Get connection string

2. **Create Database**

```
Database name: bemb
Collections: users, profiles, matches, messages
```

3. **Create Indexes**

```javascript
// In MongoDB shell or Compass

// Profile collection - geospatial index
db.profiles.createIndex({ location: "2dsphere" });

// User collection - unique email
db.users.createIndex({ email: 1 }, { unique: true });

// Match collection - compound index
db.matches.createIndex({ fromUser: 1, toUser: 1 });
db.matches.createIndex({ skippedAt: 1 });
```

### Verify Installation

1. **Backend Health Check**

```bash
curl http://localhost:5000
# Should return 404 or success response
```

2. **Register Test User**

```bash
curl -X POST http://localhost:5000/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123!"}'
```

3. **Access Frontend**

```
Open http://localhost:3000 in browser
```

---

## Deployment

### Backend Deployment (Render)

1. **Prepare Your Project**

   - Make sure your backend code (e.g., in the `server` folder) has a `package.json` with a valid `start` script, for example:
     ```json
     "scripts": {
       "start": "node index.js"
     }
     ```
   - Ensure your app listens on `process.env.PORT`.

2. **Push Your Code to GitHub**

   - Commit and push all your backend files to your GitHub repository:
     ```bash
     git add .
     git commit -m "Prepare backend for Render deployment"
     git push origin main
     ```

3. **Create a New Web Service on Render**

   - Go to [https://render.com](https://render.com) and log in.
   - Click **"New" → "Web Service"**.
   - Connect your GitHub repository.
   - Select the branch you want to deploy (usually `main`).

4. **Configure Environment Variables**

   - In the **Environment** tab of your Render service, add the following:
     ```
     MONGO_URI = your-mongodb-uri
     JWT_SECRET = your-jwt-secret
     ```
   - You can also add other variables your app needs (e.g., PORT, NODE_ENV, etc.).

5. **Set Build and Start Commands**

   - **Build Command:** (optional, if needed)
     ```
     npm install
     ```
   - **Start Command:**
     ```
     npm start
     ```

6. **Deploy**

   - Click **"Create Web Service"**.
   - Render will automatically install dependencies, build your app, and deploy it.

7. **Verify**
   - Once deployed, open your Render URL (e.g., `https://bemb-api.onrender.com`).
   - Check the **Logs** tab in Render for any errors or deployment details.

### Frontend Deployment (Vercel)

1. **Push Your Frontend Code to GitHub**

   - Make sure your frontend (e.g., `client` folder) is committed and pushed to GitHub:
     ```bash
     git add .
     git commit -m "Prepare frontend for deployment"
     git push origin main
     ```

2. **Deploy via Vercel Dashboard**

   - Go to [https://vercel.com](https://vercel.com) and log in.
   - Click **"Add New Project" → "Import Git Repository"**.
   - Select your repository and click **"Import"**.
   - When prompted, choose the frontend folder (e.g., `/client`) as the root directory if needed.

3. **Configure Build Settings**

   - Vercel will auto-detect your framework (e.g., React, Next.js, etc.).
   - Confirm or set:
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist` or `.next` (depending on your framework)

4. **Set Environment Variables**

   - In your Vercel project dashboard, go to:
     ```
     Settings → Environment Variables
     ```
   - Add:
     ```
     NEXT_PUBLIC_API_URL = https://bemb-api.onrender.com
     ```
     (Use your actual Render backend URL.)

5. **Deploy**

   - Click **"Deploy"**.
   - Vercel will build and deploy your frontend automatically.

6. **Verify**
   - Once deployed, open your live site URL (e.g., `https://bemb-frontend.vercel.app`).
   - Test your app to confirm it connects properly to your Render backend.

### Production Checklist

- [ ] Environment variables set
- [ ] MongoDB Atlas whitelist IPs
- [ ] CORS configured for production domain
- [ ] JWT secret is strong and unique
- [ ] Error logging configured
- [ ] Rate limiting enabled
- [ ] HTTPS enforced
- [ ] Database backups scheduled
- [ ] Monitoring setup (e.g., New Relic)
- [ ] Analytics configured (e.g., Google Analytics)

---

## Security

### Authentication Security

**JWT Implementation:**

```javascript
// Token generation
const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
  expiresIn: "7d",
});

// Token verification
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

**Password Security:**

```javascript
// Hashing (10 salt rounds)
const hashedPassword = await bcrypt.hash(password, 10);

// Verification
const isValid = await bcrypt.compare(password, hashedPassword);
```

### Best Practices Implemented

1. **Input Validation**

   - Email format validation
   - Password strength requirements (min 8 chars)
   - Age validation (18-100)
   - Coordinate range validation
   - File size limits (5MB)

2. **Data Protection**

   - Passwords never stored in plain text
   - JWT tokens expire after 7 days
   - Tokens stored in localStorage (consider httpOnly cookies for production)
   - Profile data only accessible to authenticated users

3. **API Security**

   - All sensitive routes require authentication
   - Authorization checks (users can only edit their own data)
   - Error messages don't leak sensitive info
   - Rate limiting (recommended for production)

4. **Database Security**
   - MongoDB connection with authentication
   - Geospatial queries prevent injection
   - Mongoose schema validation
   - Indexes for performance

### Recommended Security Enhancements

```javascript
// 1. Rate Limiting (install express-rate-limit)
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use("/api/", limiter);

// 2. Helmet (security headers)
const helmet = require("helmet");
app.use(helmet());

// 3. CORS (restrict origins)
app.use(
  cors({
    origin: ["https://yourdomain.com"],
    credentials: true,
  })
);

// 4. Input Sanitization
const mongoSanitize = require("express-mongo-sanitize");
app.use(mongoSanitize());

// 5. HTTPS Redirect (in production)
app.use((req, res, next) => {
  if (req.header("x-forwarded-proto") !== "https") {
    res.redirect(`https://${req.header("host")}${req.url}`);
  } else {
    next();
  }
});
```

### Privacy Considerations

- **Location Data:** Only general area shown (km away)
- **Profile Visibility:** Only to users matching criteria
- **Messages:** Only accessible to matched users
- **Data Deletion:** Profile deletion removes all related data
- **GDPR Compliance:** Users can request data export/deletion

---

## Current Feature Status

### ✅ Implemented Features

- User authentication (register, login, logout)
- Profile management (create, edit, delete, image upload)
- Location-based matching (geospatial queries)
- Swipe-based discovery (like/skip)
- Match detection (mutual likes)
- Skip timeout (7-day cooldown)
- Real-time messaging (polling-based)
- Block/unblock users
- Interest-based filtering
- Dark mode
- Responsive design
- Floating glassmorphism navbar
- Interactive components (swipe gestures, location picker, interests selector)

### 🚧 Planned Features

- Socket.io real-time messaging
- Push notifications
- Profile verification
- Premium subscriptions
- Video calls
- Advanced analytics

---

## Troubleshooting

### Common Issues

**1. Cannot connect to MongoDB**

```
Error: MongoNetworkError
Solution:
- Check MONGO_URI in .env
- Whitelist your IP in MongoDB Atlas
- Verify internet connection
```

**2. JWT Token Invalid**

```
Error: 401 Unauthorized
Solution:
- Token expired (7 days)
- Re-login to get new token
- Check JWT_SECRET matches
```

**3. Geospatial Query Fails**

```
Error: Index not found
Solution:
- Create 2dsphere index on profiles.location
db.profiles.createIndex({ location: "2dsphere" })
```

**4. Images Not Uploading**

```
Error: File too large
Solution:
- Check file size (max 5MB)
- Verify file type (images only)
- Implement proper storage service
```

**5. Blocked Users Still Appearing**

```
Issue: Blocked user shows in discovery
Solution:
- Check block API is called correctly
- Verify discovery query excludes blocked users
- Clear cache/refresh
```

### Debug Tips

**Check Backend Logs:**

```bash
# Development
npm run dev

# Check specific route
curl -X GET http://localhost:5000/matches/discover \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Check Frontend Console:**

```javascript
// In browser console
localStorage.getItem("accessToken");
```

**MongoDB Queries:**

```javascript
// Check if profile exists
db.profiles.findOne({ userId: ObjectId("...") });

// Check blocks
db.blocks.find({ blockerId: ObjectId("...") });

// Check matches
db.matches.find({ fromUser: ObjectId("...") });
```

---

## API Reference Quick Links

- **Authentication:** `/users/register`, `/users/login`, `/users/profile`
- **Profiles:** `/profiles`, `/profiles/me`, `/profiles/:id`
- **Matching:** `/matches/discover`, `/matches/swipe`, `/matches`
- **Messaging:** `/messages`, `/messages/:matchId`, `/messages/conversations`
- **Blocking:** `/block`, `/block/:userId`

---

## Contributing

### Code Style

**JavaScript/TypeScript:**

```javascript
// Use async/await
async function fetchData() {
  const response = await fetch(url);
  return response.json();
}

// Use arrow functions
const handleClick = () => {
  console.log("clicked");
};

// Use destructuring
const { name, age } = profile;
```

**Component Structure:**

```typescript
// 1. Imports
import { useState } from "react";

// 2. Types/Interfaces
interface Props {
  name: string;
}

// 3. Component
export default function Component({ name }: Props) {
  // 4. State
  const [value, setValue] = useState("");

  // 5. Effects
  useEffect(() => {}, []);

  // 6. Handlers
  const handleClick = () => {};

  // 7. Render
  return <div>{name}</div>;
}
```

**Naming Conventions:**

- Components: PascalCase (ProfileCard.tsx)
- Functions: camelCase (handleSwipe)
- Constants: UPPER_SNAKE_CASE (MAX_FILE_SIZE)
- Files: kebab-case or PascalCase

### Git Workflow

```bash
# 1. Create feature branch
git checkout -b feature/block-system

# 2. Make changes
git add .
git commit -m "feat: add block/unblock functionality"

# 3. Push to remote
git push origin feature/block-system

# 4. Create pull request
# 5. Merge after review
```

---

## License

This project is for educational purposes. All rights reserved.

---

## Contact & Support

- **Documentation:** This file
- **Issues:** GitHub Issues
- **Email:** support@bemb.app (placeholder)
- **Discord:** Bemb Community (placeholder)

---

## Changelog

### v1.0.0 (Current)

- ✅ Initial release
- ✅ Core features implemented
- ✅ Block/unblock system
- ✅ Swipe gestures
- ✅ Location-based matching

### v0.9.0 (Beta)

- Profile management
- Match system
- Basic messaging

### v0.5.0 (Alpha)

- User authentication
- Database setup
- Basic UI

---

**Last Updated:** October 2024
**Version:** 1.0.0
**Status:** Production Ready 🚀
