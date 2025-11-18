import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {  
    
    type: String,
    required: true,
  },
  profilePic: {
    type: String,
    default: null,
  },
  role: { type: String, enum: ["admin", "student"], default: "student" },
}, {
  timestamps: true,
});

const adminModel = mongoose.models.admin || mongoose.model("admin", adminSchema);

export default adminModel;
