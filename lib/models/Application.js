import mongoose from "mongoose";

const ApplicationSchema = new mongoose.Schema({
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  jobSeekerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
}, {
  timestamps: true,
});

// Ensure one application per job per user
ApplicationSchema.index({ jobId: 1, jobSeekerId: 1 }, { unique: true });

export default mongoose.models.Application || mongoose.model("Application", ApplicationSchema);