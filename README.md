# API Integration Project

A full-stack application with React frontend and Node.js backend featuring user authentication, MongoDB integration, file uploads, and real-time notifications.

## 🚀 Features

- **User Authentication** - JWT-based authentication with login/register
- **MongoDB Integration** - Complete CRUD operations with Mongoose ODM
- **File Upload** - AWS S3 integration for file storage
- **Real-time Notifications** - Backend notification handling
- **API Integration** - RESTful API with proper error handling
- **Responsive UI** - Modern React with TypeScript and Tailwind CSS

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Authentication Guide](#authentication-guide)
- [MongoDB Integration](#mongodb-integration)
- [File Upload Guide](#file-upload-guide)
- [Notification System](#notification-system)
- [Environment Setup](#environment-setup)
- [Deployment](#deployment)

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- AWS Account (for S3)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd API_Integration
```

2. **Install server dependencies**
```bash
cd server
npm install
```

3. **Install client dependencies**
```bash
cd ../client
npm install
```

4. **Setup environment variables**
```bash
# Server (.env)
cp .env.example .env

# Client (.env)
cp .env.example .env
```

5. **Start the application**
```bash
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client
cd client
npm run dev
```

## 📁 Project Structure

```
API_Integration/
├── client/                 # React TypeScript frontend
│   ├── src/
│   │   ├── apis/          # API service functions
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── pages/         # Page components
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                # Node.js Express backend
│   ├── config/           # Configuration files
│   ├── controller/       # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   └── utils/           # Server utilities
└── README.md
```

## 🔌 API Documentation

### Base URL
```
Local: http://localhost:3000
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/register` | Register new user | No |
| POST | `/auth/login` | User login | No |
| POST | `/auth/logout` | User logout | Yes |
| GET | `/auth/profile` | Get user profile | Yes |

### User Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users` | Get all users (paginated) | Yes |
| POST | `/api/users` | Create new user | Yes |
| PUT | `/api/users/:id` | Update user | Yes |
| DELETE | `/api/users/:id` | Delete user | Yes |

### Product Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products` | Get all products | Yes |
| POST | `/api/products` | Create product | Yes |
| PUT | `/api/products/:id` | Update product | Yes |
| DELETE | `/api/products/:id` | Delete product | Yes |

### File Upload

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/upload` | Upload file to S3 | Yes |

## 🔐 Authentication Guide

### JWT Token Implementation

The application uses JWT (JSON Web Tokens) for authentication with the following flow:

#### 1. User Registration
```javascript
// POST /auth/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

#### 2. User Login
```javascript
// POST /auth/login
{
  "email": "john@example.com",
  "password": "securePassword123"
}

// Response
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "userId",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### 3. Token Storage
- JWT token is stored in HTTP-only cookies
- Automatic inclusion in requests
- Secure transmission over HTTPS

#### 4. Protected Routes
```javascript
// Middleware usage
import { requireAuth } from './middleware/auth.js';

app.get('/api/protected', requireAuth, (req, res) => {
  // Access user data via req.user
  res.json({ user: req.user });
});
```

#### 5. Frontend Authentication Hook
```typescript
// useAuth.ts
export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    setUser(response.data.user);
  };

  const logout = async () => {
    await api.post('/auth/logout');
    setUser(null);
  };

  return { user, login, logout, loading };
};
```

## 🗄️ MongoDB Integration

### Database Connection
```javascript
// server/index.js
import mongoose from 'mongoose';

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
```

### Schema Definitions

#### User Schema
```javascript
// models/User.js
const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  phone: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  course: { type: String, required: true }
}, { timestamps: true });
```

#### Product Schema
```javascript
// models/Product.js
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String },
  inStock: { type: Boolean, default: true }
}, { timestamps: true });
```

### CRUD Operations

#### Create
```javascript
app.post('/api/users', async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});
```

#### Read with Pagination
```javascript
app.get('/api/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments();
    const users = await User.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      users,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalUsers / limit),
        totalUsers
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

#### Update
```javascript
app.put('/api/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});
```

#### Delete
```javascript
app.delete('/api/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    
    if (!deletedUser) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

## 📁 File Upload Guide

### AWS S3 Configuration
```javascript
// config/s3.js
import { S3Client } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

export default s3Client;
```

### Upload Controller
```javascript
// controller/uploadController.js
import { PutObjectCommand } from '@aws-sdk/client-s3';
import s3Client from '../config/s3.js';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

export const uploadFile = async (req, res) => {
  try {
    const file = req.file;
    const fileName = `${Date.now()}-${file.originalname}`;
    
    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      Body: file.buffer,
      ContentType: file.mimetype
    };
    
    await s3Client.send(new PutObjectCommand(uploadParams));
    
    const fileUrl = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    
    res.json({ success: true, fileUrl });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
```

### Frontend Upload Component
```typescript
// components/FileUpload.tsx
import { useState } from 'react';

const FileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [fileUrl, setFileUrl] = useState('');

  const handleUpload = async (file: File) => {
    setUploading(true);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.success) {
        setFileUrl(data.fileUrl);
      }
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
        disabled={uploading}
      />
      {uploading && <p>Uploading...</p>}
      {fileUrl && <img src={fileUrl} alt="Uploaded" />}
    </div>
  );
};
```

## 🔔 Notification System

### Backend Notification Handler
```javascript
// utils/notificationService.js
import nodemailer from 'nodemailer';

class NotificationService {
  constructor() {
    this.transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendEmail(to, subject, html) {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to,
        subject,
        html
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Email send failed:', error);
    }
  }

  async sendWelcomeEmail(user) {
    const html = `
      <h1>Welcome ${user.name}!</h1>
      <p>Thank you for registering with our platform.</p>
    `;
    
    await this.sendEmail(user.email, 'Welcome!', html);
  }

  async sendPasswordReset(user, resetToken) {
    const html = `
      <h1>Password Reset</h1>
      <p>Click <a href="${process.env.CLIENT_URL}/reset-password?token=${resetToken}">here</a> to reset your password.</p>
    `;
    
    await this.sendEmail(user.email, 'Password Reset', html);
  }
}

export default new NotificationService();
```

### Integration in Controllers
```javascript
// controller/authController.js
import NotificationService from '../utils/notificationService.js';

export const register = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    
    // Send welcome notification
    await NotificationService.sendWelcomeEmail(user);
    
    res.status(201).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};
```

### Frontend Toast Notifications
```typescript
// utils/toast.ts
import toast from 'react-hot-toast';

export const showSuccess = (message: string) => {
  toast.success(message);
};

export const showError = (message: string) => {
  toast.error(message);
};

export const showLoading = (message: string) => {
  return toast.loading(message);
};
```

## ⚙️ Environment Setup

### Server Environment Variables
```bash
# server/.env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/api_integration
JWT_SECRET=your_super_secret_jwt_key_here

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your_bucket_name

# Email
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Client URL
CLIENT_URL=http://localhost:5173
```

### Client Environment Variables
```bash
# client/.env
VITE_API_URL=http://localhost:3000
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

## 🚀 Deployment

### Production Build
```bash
# Build client
cd client
npm run build

# Start server in production
cd ../server
npm start
```

### Docker Deployment
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

### Environment-specific Configurations
- **Development**: Hot reload, detailed error messages
- **Production**: Minified builds, error logging, security headers

## 🔧 API Error Handling

### Standardized Error Responses
```javascript
// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  const errorResponse = {
    success: false,
    message: err.message || 'Internal Server Error',
    error: err.name || 'SERVER_ERROR'
  };
  
  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }
  
  res.status(err.status || 500).json(errorResponse);
});
```

### Frontend Error Handling
```typescript
// utils/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);
```

## 📚 Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [JWT.io](https://jwt.io/)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Express.js Documentation](https://expressjs.com/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.