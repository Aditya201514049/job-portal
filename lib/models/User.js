import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
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
  role: {
    type: String,
    enum: ["jobseeker", "employer", "admin"],
    required: true,
  },
  isApproved: {
    type: Boolean,
    default: function() {
      return this.role !== "employer"; // Auto-approve jobseekers and admins
    },
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  // Job Seeker specific fields
  bio: {
    type: String,
    default: "",
  },
  skills: {
    type: String,
    default: "",
  },
  resumeURL: {
    type: String,
    default: "",
  },
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model("User", UserSchema);