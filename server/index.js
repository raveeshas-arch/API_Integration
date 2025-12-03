import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import router from './routes/adminRoutes.js';
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import config from './config/config.js';
import { requireAuth } from './middleware/auth.js';

const app = express();
const PORT = config.app.port;

// Middleware
app.use(cors({
  origin: config.client.url,
  credentials: true
}));
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));

// Request timeout middleware
app.use((req, res, next) => {
  req.setTimeout(30000, () => {
    res.status(408).json({
      success: false,
      message: 'Request timeout',
      error: 'REQUEST_TIMEOUT'
    });
  });
  next();
});

// Simple request logger
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// MongoDB Connection
mongoose
  .connect(config.database.mongoUrl)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

// User Schema & Model
const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
    birthDate: { type: String },
    course: { type: String, required: true },

  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

// Routes
app.use('/api/admin', router);
app.use('/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload', uploadRoutes);

// Add new user
app.post('/api/users', async (req, res, next) => {
  try {
    const { fullName, age, email, phone, gender, course } = req.body;

    if (!fullName || !age || !email || !phone || !gender || !course) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields',
        error: 'VALIDATION_ERROR'
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        message: 'User with this email already exists',
        error: 'DUPLICATE_EMAIL'
      });
    }

    const user = new User(req.body);
    await user.save();
    res.status(201).json({ success: true, message: 'User saved successfully', user });
  } catch (error) {
    next(error);
  }
});

// Get all users
app.get('/api/users' ,requireAuth, async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments();
    const users = await User.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({ 
      success: true, 
      users,
      pagination: {
        currentPage: page,
        totalPages,
        totalUsers,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
});

// Update user by ID
app.put('/api/users/:id',requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user ID format',
        error: 'INVALID_ID'
      });
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }
    res.status(200).json({ success: true, message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    next(error);
  }
});

// Delete user by ID
app.delete('/api/users/:id', requireAuth, async (req, res, next) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid user ID format',
        error: 'INVALID_ID'
      });
    }

    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }
    res.status(200).json({ success: true, message: 'User deleted successfully', user: deletedUser });
  } catch (error) {
    next(error);
  }
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found',
    error: 'ROUTE_NOT_FOUND'
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: 'VALIDATION_ERROR',
      details: errors
    });
  }
  
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
      error: 'DUPLICATE_KEY_ERROR'
    });
  }
  
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
      error: 'INVALID_ID_FORMAT'
    });
  }
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: 'SERVER_ERROR'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});