import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Workout from '@/lib/models/Workout';

export async function GET() {
  await connectDB();
  const workouts = await Workout.find().sort({ date: -1 }).lean();
  // Add exerciseCount to lean objects
  const result = workouts.map(w => ({
    ...w,
    exerciseCount: (w.exercises || []).length,
  }));
  return NextResponse.json(result);
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();

  const { name, date, category, duration, notes, exercises } = body;

  const workout = await Workout.create({
    name,
    date: date ? new Date(date) : undefined,
    category: category || 'Kracht',
    durationMin: duration ? Number(duration) : undefined,
    notes,
    exercises: (exercises || []).map(ex => ({
      name: ex.name,
      sets: Number(ex.sets) || 3,
      reps: Number(ex.reps) || 10,
      weight: parseFloat(ex.weight) || 0,
    })).filter(ex => ex.name),
  });

  return NextResponse.json(workout.toJSON(), { status: 201 });
}