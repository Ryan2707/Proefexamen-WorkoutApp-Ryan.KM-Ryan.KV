import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Workout from '@/lib/models/Workout';

export async function GET() {
  await connectDB();

  const workouts = await Workout.find().sort({ date: -1 }).lean();

  const result = workouts.map(w => ({
    ...w,
    _id: w._id.toString(),
    exerciseCount: (w.exercises || []).length,
  }));

  return NextResponse.json(result);
}