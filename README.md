# InkWell - Full-Stack Blogging Platform

> A modern, feature-rich blogging application built with the MERN stack, featuring rich text editing, image management, and real-time commenting system.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-brightgreen)
![MongoDB](https://img.shields.io/badge/Database-MongoDB-green)
![Express.js](https://img.shields.io/badge/Backend-Express.js-yellow)
![React](https://img.shields.io/badge/Frontend-React-blue)
![Node.js](https://img.shields.io/badge/Runtime-Node.js-brightgreen)
![Cloudinary](https://img.shields.io/badge/Media-Cloudinary-orange)

## Overview

InkWell is a full-stack blogging platform that demonstrates modern web development practices using the MERN stack. The application provides secure user authentication, rich content creation tools, and an interactive comment system, showcasing comprehensive full-stack development skills.

## Features

**Core Functionality**
- User registration and JWT-based authentication
- Rich text editor with ReactQuill (formatting, images, links)
- Complete blog CRUD operations (Create, Read, Update, Delete)
- Interactive commenting system with user verification
- Cloud-based image upload and optimization via Cloudinary
- Responsive design for all devices

**Technical Implementation**
- JWT authentication with HTTP-only cookies
- Password hashing with bcrypt
- File upload with Multer and Cloudinary integration
- Form validation (client and server-side)
- Error handling and user feedback
- Real-time content updates

## Technology Stack

**Frontend**: React 18, React Router DOM, React Context API, ReactQuill, Vite, date-fns, CSS3  
**Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt, Multer, Cloudinary, CORS  
**Database**: MongoDB with Mongoose ODM  
**Cloud Services**: Cloudinary for image management

## Installation

### Prerequisites
- Node.js (v14.0.0+)
- MongoDB (local or Atlas)
- Cloudinary account

### Setup
1. **Clone the repository**
   ```bash
   git clone https://github.com/KAMRANKHANALWI/InkWell.git
   cd InkWell
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd api && yarn install
   
   # Frontend
   cd client && yarn install
   ```

3. **Environment Configuration**
   Create `.env` in `api` directory:
   ```env
   MONG0URL=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   NODE_ENV=development
   ```

4. **Start the application**
   ```bash
   # Backend (Terminal 1)
   cd api && yarn start
   
   # Frontend (Terminal 2)
   cd client && yarn dev
   ```

5. **Access**: Frontend at http://localhost:3000, Backend at http://localhost:4000

## API Documentation

### Authentication
- `POST /register` - User registration
- `POST /login` - User login with JWT
- `GET /profile` - Get current user (authenticated)
- `POST /logout` - User logout

### Blog Posts
- `GET /posts` - Get all posts
- `GET /post/:id` - Get single post
- `POST /post` - Create post (authenticated + file upload)
- `PUT /post/:id` - Update post (author only)
- `DELETE /post/:id` - Delete post (author only)

### Comments
- `POST /post/comment/:postId` - Add comment (authenticated)
- `GET /comments/:postId` - Get post comments

## Architecture

### Database Models
```javascript
// User Schema
{
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // bcrypt hashed
}

// Post Schema
{
  title: String,
  summary: String,
  content: String,
  cover: String, // Cloudinary URL
  author: { type: ObjectId, ref: "User" },
}

// Comment Schema
{
  content: { type: String, required: true },
  postId: { type: ObjectId, ref: "Post" },
  createdBy: { type: ObjectId, ref: "User" },
}
```

### Key Components
**Frontend**: App.jsx (routing), Header.jsx (navigation), Editor.jsx (ReactQuill), UserContext.jsx (auth state)  
**Backend**: Controllers (blog, comment, user), Models (Post, User, Comment), Routes (modular Express routes), Services (JWT auth)

### Authentication Flow
1. User registration with bcrypt password hashing
2. Login generates JWT stored in HTTP-only cookies
3. Middleware validates tokens for protected routes
4. React Context manages global auth state

### File Upload System
Multer processes multipart data → Cloudinary cloud storage → URL returned and stored in database → CDN delivery

## Troubleshooting

**Common Issues**:
- MongoDB connection: Verify connection string and network access
- Cloudinary upload: Check API credentials
- CORS errors: Ensure frontend URL allowed in backend config
- Authentication: Verify JWT secret consistency

---

*Built with the MERN stack demonstrating modern full-stack development practices.*
