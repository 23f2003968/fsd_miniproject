# Social Media App - Mini Project Documentation

## Project Overview

This is a full-stack social media application built using the MERN (MongoDB, Express.js, React, Node.js) stack. The application allows users to create accounts, share posts with images, like posts, comment on posts, and interact with other users' content.

## Features Implemented

### User Authentication
- **Sign Up**: Users can create new accounts with username, email, and password
- **Sign In**: Secure login with JWT-based authentication
- **Logout**: Users can safely log out from their accounts
- **Session Management**: JWT tokens stored in localStorage with 24-hour expiration

### Post Management
- **Create Posts**: Users can create posts with text content and optional images
- **View Posts**: All users can view posts in a feed (newest first)
- **Delete Posts**: Users can delete their own posts
- **Image Upload**: Support for image uploads (up to 5MB)

### Social Interactions
- **Like Posts**: Authenticated users can like/unlike posts
- **Comment on Posts**: Users can add comments to posts
- **View Likes**: See the number of likes on each post
- **View Comments**: See all comments with usernames and timestamps

### UI/UX Features
- **Responsive Design**: Works on desktop and mobile devices
- **Loading States**: Spinners and loading indicators for better UX
- **Error Handling**: Proper error messages for all operations
- **Navigation**: Easy navigation with React Router
- **Protected Routes**: Certain pages require authentication
- **Real-time Updates**: Posts refresh after interactions

## Technical Architecture

### Backend (Node.js + Express)

#### Database Schema

**User Model**
```javascript
{
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed, required),
  bio: String (default: ''),
  createdAt: Date,
  timestamps: true
}
```

**Post Model**
```javascript
{
  content: String (required),
  media: Buffer (optional),
  mediaType: String (optional),
  user: ObjectId (ref: User, required),
  likes: [ObjectId] (ref: User),
  comments: [{
    user: ObjectId (ref: User),
    text: String (required),
    createdAt: Date
  }],
  timestamps: true
}
```

#### API Endpoints

**Authentication**
- `POST /api/signup` - Register new user
- `POST /api/signin` - Login user
- `GET /api/me` - Get current user (protected)

**Posts**
- `GET /api/posts` - Get all posts (with user info and comments)
- `POST /api/posts` - Create new post (protected)
- `DELETE /api/posts/:id` - Delete post (protected, owner only)
- `POST /api/posts/:id/like` - Toggle like on post (protected)
- `POST /api/posts/:id/comment` - Add comment to post (protected)

#### Security Features
- Password hashing with bcryptjs (10 salt rounds)
- JWT token-based authentication
- Protected routes with authentication middleware
- CORS enabled for frontend communication
- Environment variables for sensitive data
- File upload size limits (5MB)
- Owner-only delete authorization

### Frontend (React + Vite)

#### Component Structure

**App.jsx**
- Main application component
- Handles authentication state
- Navigation bar with conditional rendering
- Route management
- Protected routes implementation

**Home.jsx**
- Displays all posts in reverse chronological order
- Like/unlike functionality
- Comment functionality
- Delete post (for post owners)
- Loading and error states
- Image display

**SignIn.jsx**
- User login form
- Error handling
- Redirects after successful login
- Form validation

**SignUp.jsx**
- User registration form
- Email validation
- Password strength requirements
- Error handling
- Auto-login after signup

**CreatePost.jsx**
- Post creation form
- Text and image input
- File upload preview
- Form validation
- Navigation after creation

#### State Management
- React hooks (useState, useEffect)
- localStorage for token and user data
- Props passing for authentication state
- Form state management

#### Styling
- React Bootstrap for UI components
- Custom CSS for enhancements
- Responsive grid system
- Card-based layout
- Professional color scheme

## How to Run the Project

### Prerequisites
1. Install Node.js (v14 or higher)
2. Install MongoDB and start the service
3. Clone the project repository

### Installation Steps

1. **Install Backend Dependencies**
```bash
cd backend
npm install
```

2. **Configure Environment Variables**
Create a `.env` file in the backend directory:
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/social-media
JWT_SECRET=your_secret_key_here
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

### Running the Application

1. **Start MongoDB**
```bash
sudo systemctl start mongod
```

2. **Start Backend Server** (Terminal 1)
```bash
cd backend
npm start
```
Backend will run on http://localhost:3001

3. **Start Frontend Development Server** (Terminal 2)
```bash
cd frontend
npm run dev
```
Frontend will run on http://localhost:5173

### Testing the Application

1. Open browser and navigate to http://localhost:5173
2. Click "Sign Up" and create a new account
3. You'll be automatically logged in
4. Click "Create Post" to add a new post
5. View posts on the home page
6. Try liking and commenting on posts
7. Test logout and login functionality

## Project Structure

```
fsd_mp/
├── backend/
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── models/
│   │   ├── User.js              # User schema
│   │   └── Post.js              # Post schema
│   ├── index.js                 # Main server file
│   ├── .env                     # Environment variables
│   ├── .gitignore               # Git ignore file
│   └── package.json             # Backend dependencies
├── frontend/
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── assets/              # Images, fonts, etc.
│   │   ├── App.jsx              # Main app component
│   │   ├── Home.jsx             # Home page/feed
│   │   ├── SignIn.jsx           # Login page
│   │   ├── SignUp.jsx           # Registration page
│   │   ├── CreatePost.jsx       # Create post page
│   │   ├── main.jsx             # React entry point
│   │   ├── index.css            # Global styles
│   │   └── App.css              # App-specific styles
│   ├── index.html               # HTML template
│   ├── vite.config.js           # Vite configuration
│   ├── .gitignore               # Git ignore file
│   └── package.json             # Frontend dependencies
├── .gitignore                   # Root git ignore
├── package.json                 # Root package.json
├── README.md                    # Main documentation
└── DOCUMENTATION.md             # This file
```

## Technologies Used

### Backend Technologies
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing
- **Multer**: File upload handling
- **CORS**: Cross-origin resource sharing
- **dotenv**: Environment variable management

### Frontend Technologies
- **React 19**: UI library
- **Vite**: Build tool and dev server
- **React Router DOM**: Client-side routing
- **React Bootstrap**: UI component library
- **Bootstrap 5**: CSS framework

## Key Features Explained

### Authentication Flow
1. User submits signup/login form
2. Backend validates credentials
3. Password is hashed (signup) or verified (login)
4. JWT token is generated and sent to frontend
5. Frontend stores token in localStorage
6. Token is sent with each protected API request
7. Backend middleware verifies token
8. Request is processed if token is valid

### Post Creation Flow
1. User fills out post form with text and optional image
2. Form data is sent as multipart/form-data
3. Backend receives and validates data
4. Image is stored as Buffer in MongoDB
5. Post is saved with user reference
6. Frontend redirects to home page
7. New post appears in feed

### Like/Comment Flow
1. User clicks like button or submits comment
2. Frontend sends request with authentication token
3. Backend verifies user and updates post
4. Database is updated (like toggle or comment append)
5. Frontend refreshes post list
6. Updated like count/comments are displayed

## Possible Improvements for Future Versions

1. **User Profiles**: Dedicated profile pages with bio and posts
2. **Edit Posts**: Allow users to edit their posts
3. **Follow System**: Follow/unfollow users
4. **Feed Filtering**: Show posts from followed users only
5. **Search**: Search for users and posts
6. **Notifications**: Real-time notifications for likes/comments
7. **Direct Messaging**: Private messaging between users
8. **Profile Pictures**: Upload and display profile pictures
9. **Post Sharing**: Share posts to your timeline
10. **Hashtags**: Tag posts with hashtags
11. **Infinite Scroll**: Load posts as user scrolls
12. **Image Gallery**: Multiple images per post
13. **Video Support**: Upload and display videos
14. **React/Emoji Reactions**: More reaction types beyond like
15. **Dark Mode**: Theme toggle

## Common Issues and Solutions

### Issue: MongoDB connection failed
**Solution**: Ensure MongoDB service is running
```bash
sudo systemctl status mongod
sudo systemctl start mongod
```

### Issue: Port already in use
**Solution**: Kill process on port or change port in .env
```bash
lsof -ti:3001 | xargs kill -9
```

### Issue: CORS errors
**Solution**: Ensure backend CORS is enabled and frontend URL is correct

### Issue: JWT token expired
**Solution**: Logout and login again to get new token

### Issue: Image not displaying
**Solution**: Check file size (<5MB) and format (image types only)

## Submission Checklist

- [x] Full MERN stack implementation
- [x] User authentication (signup/login)
- [x] CRUD operations for posts
- [x] Social features (likes, comments)
- [x] Responsive UI
- [x] Error handling
- [x] Code documentation
- [x] README file
- [x] Project runs successfully
- [x] Clean code structure
- [x] Security best practices

## Credits

This project was developed as a mini project for Full Stack Development course.

## License

ISC License
