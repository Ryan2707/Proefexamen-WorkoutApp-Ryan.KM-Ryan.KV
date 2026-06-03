import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      default: () => uuidv4(),
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Naam is verplicht'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'E-mailadres is verplicht'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Voer een geldig e-mailadres in'],
    },
    password: {
      type: String,
      required: [true, 'Wachtwoord is verplicht'],
      minlength: [6, 'Wachtwoord moet minimaal 6 tekens bevatten'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);