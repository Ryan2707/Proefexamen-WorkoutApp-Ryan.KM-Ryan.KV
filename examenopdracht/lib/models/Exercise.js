import mongoose from 'mongoose';

const ExerciseSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  muscleGroups: { type: [String], default: [] },
  category:     { type: String },
  note:         { type: String },
  videoUrl:     { type: String },
}, { timestamps: true });

export default mongoose.models.Exercise || mongoose.model('Exercise', ExerciseSchema);