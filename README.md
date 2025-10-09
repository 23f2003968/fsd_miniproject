# Social Media App - MERN Stack

A full-stack social media application built with MongoDB, Express.js, React, and Node.js.

## Features

- User authentication (Sign up/Sign in/Logout)
- Create posts with text and images
- Like posts
- Comment on posts
- Delete own posts
- View all posts from users
- Responsive UI with React Bootstrap

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (running locally or connection string)
- npm or yarn

## Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd fsd_mp
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory (already created):
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/social-media
JWT_SECRET=your_jwt_secret_key_change_in_production
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

## Running the Application

### Start MongoDB
Make sure MongoDB is running on your system:
```bash
# On Linux/Mac
sudo systemctl start mongod

# Or if using MongoDB Community Edition
mongod
```

### Start Backend Server
```bash
cd backend
npm start
```
The backend server will run on `http://localhost:3001`

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```
The frontend will run on `http://localhost:5173`

## Usage

1. **Sign Up**: Create a new account with username, email, and password
2. **Sign In**: Log in with your credentials
3. **Create Post**: Share your thoughts with optional images
4. **Interact**: Like and comment on posts
5. **Manage**: Delete your own posts

## API Endpoints

### Authentication
- `POST /api/signup` - Create new user account
- `POST /api/signin` - Login user
- `GET /api/me` - Get current user (requires auth)

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create new post (requires auth)
- `DELETE /api/posts/:id` - Delete post (requires auth)
- `POST /api/posts/:id/like` - Like/unlike post (requires auth)
- `POST /api/posts/:id/comment` - Add comment to post (requires auth)

## Technologies Used

### Frontend
- React 19
- React Router DOM
- React Bootstrap
- Vite

### Backend
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Multer for file uploads
- CORS

## Project Structure

```
fsd_mp/
├── backend/
│   ├── middleware/
│   │   └── auth.js
│   ├── models/
│   │   ├── User.js
│   │   └── Post.js
│   ├── index.js
│   ├── .env
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── Home.jsx
│   │   ├── SignIn.jsx
│   │   ├── SignUp.jsx
│   │   ├── CreatePost.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## Security Notes

- Change the JWT_SECRET in production
- Use environment variables for sensitive data
- Passwords are hashed using bcryptjs
- JWT tokens expire after 24 hours
- File upload size limited to 5MB

## Future Enhancements

- User profiles
- Follow/unfollow users
- Edit posts
- Search functionality
- Real-time notifications
- Direct messaging
- Profile pictures
- Post sharing

## License

ISC

## Author

Your Name
