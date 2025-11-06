import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Add logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});                           

//connect database
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("DB error:", err));

  //Use Schema 
  const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  age: { type: Number, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  birthDate: { type: String },
  course: { type: String, required: true }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

//API endpoints to save form data
app.post('/api/users', async (req, res) => {
  try {
    console.log('Received user data:', req.body);
    const user = new User(req.body);
    await user.save();
    console.log('User saved to DB:', user);
    res.status(201).json({ message: 'User saved successfully', user });
  } catch (error) {
    console.log('Error saving user:', error);
    res.status(400).json({ error: error.message });
  }
});

// Get all users from database
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ users, count: users.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 