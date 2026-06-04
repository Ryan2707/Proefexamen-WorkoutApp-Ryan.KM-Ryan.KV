import mongoose from 'mongoose';

const ExerciseEntrySchema = new mongoose.Schema({
  name:   { type: String, required: true },
  sets:   { type: Number, default: 3 },
  reps:   { type: Number, default: 10 },
  weight: { type: Number, default: 0 },
}, { _id: false });

const WorkoutSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  date:        { type: Date },
  category:    { type: String, default: 'Kracht' },
  durationMin: { type: Number },
  durationMax: { type: Number },
  notes:       { type: String },
  exercises:   { type: [ExerciseEntrySchema], default: [] },
  userId:      { type: String },
}, { timestamps: true });

export default mongoose.models.Workout ||
  mongoose.model('Workout', WorkoutSchema);