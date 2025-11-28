import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import adminModel from "../models/adminModel.js";
import transporter from "../config/nodemailer.js";
import { generateRandomPassword } from "../utils/passwordGenerator.js";

//register
export const registerAdmin = async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name and email are required" });
    }

    const existingUser = await adminModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const generatedPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(generatedPassword, 10);

    const newUser = new adminModel({
      name,
      email,
      password: hashedPassword,
      role: role || "student",  
    });

    await newUser.save();

    try {
      await transporter.sendMail({
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Welcome! Your Account Password",
        html: `<p>Welcome ${name}!</p><p>Your account has been created. Your login password is: <strong>${generatedPassword}</strong></p>`
      });
      res.status(201).json({ message: "User registered successfully! Password sent to your email." });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      res.status(201).json({ 
        message: "User registered successfully! However, email sending failed. Please contact admin for your password."
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//Login Admin
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await adminModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not registered" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { 
        id: user._id, 
        email: user.email,
        name: user.name,
        role: user.role,  
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      message: "Login successful",
      token,
      admin: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Send password via email
export const sendPasswordEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await adminModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not registered" });
    }

    const newPassword = generateRandomPassword();
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await adminModel.findByIdAndUpdate(user._id, { password: hashedPassword });

    await transporter.sendMail({
      from: process.env.SENDER_EMAIL,
      to: email,
      subject: "Your Login Password",
      html: `<p>Your login password is: <strong>${newPassword}</strong></p>`
    });

    res.status(200).json({ message: "Password sent to your email" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

//admin logout
export const logoutAdmin = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax"
    });
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};