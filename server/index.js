import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import router from './routes/adminRoutes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT ;
// Middleware
app.use(cors());
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
// MongoDB Connectio
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Stop server if DB connection fails
  });
// User Schema & Mode
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

app.use('/api/admin',router)

// Add new user
app.post('/api/users', async (req, res, next) => {
  try {
    const { fullName, age, email, phone, gender, course } = req.body;

    // Validation
    if (!fullName || !age || !email || !phone || !gender || !course) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields',
        error: 'VALIDATION_ERROR'
      });
    }

    // Check for duplicate email
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
app.get('/api/users', async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({ success: true, count: users.length, users });
  } catch (error) {
    next(error);
  }
});

// Update user by ID
app.put('/api/users/:id', async (req, res, next) => {
  try {
    // Validate ObjectId
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
app.delete('/api/users/:id', async (req, res, next) => {
  try {
    // Validate ObjectId
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
  
  // MongoDB validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      error: 'VALIDATION_ERROR',
      details: errors
    });
  }
  
  // MongoDB duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `${field} already exists`,
      error: 'DUPLICATE_KEY_ERROR'
    });
  }
  
  // MongoDB CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format',
      error: 'INVALID_ID_FORMAT'
    });
  }
  
  // Default server error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: 'SERVER_ERROR'
  });
});
// Start Serve
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
