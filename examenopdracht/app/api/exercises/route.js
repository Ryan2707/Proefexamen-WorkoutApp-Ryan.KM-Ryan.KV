import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Exercise from '@/lib/models/Exercise';

// Fallback alternatives if DB is empty
const FALLBACK_ALTERNATIVES = {
  'Bench Press': [
    { name: 'Dumbbell Bench Press', muscleGroups: ['Borst', 'Triceps'], note: 'vergelijkbare beweging' },
    { name: 'Incline Dumbell Press', muscleGroups: ['Borst boven', 'Schouders'], note: null },
    { name: 'Cable Fly', muscleGroups: ['Borst'], note: null },
    { name: 'Push-Up varianten', muscleGroups: ['Borst', 'Triceps'], note: 'geen gewicht nodig' },
  ],
};

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const replace = searchParams.get('replace');
  const search = searchParams.get('search');
  const muscle = searchParams.get('muscle');

  await connectDB();

  if (replace) {
    // Find alternatives for this exercise
    const exercises = await Exercise.find().lean();

    if (exercises.length > 0) {
      // Filter out the exercise being replaced
      const alts = exercises.filter(e => e.name !== replace);
      return NextResponse.json(alts);
    }

    // Use fallback
    const fallback = FALLBACK_ALTERNATIVES[replace] || Object.values(FALLBACK_ALTERNATIVES).flat().filter(e => e.name !== replace);
    return NextResponse.json(fallback);
  }

  // General exercise list
  const query = {};
  if (search) query.name = { $regex: search, $options: 'i' };
  if (muscle) query.muscleGroups = muscle;

  const exercises = await Exercise.find(query).lean();
  return NextResponse.json(exercises);
}

export async function POST(req) {
  await connectDB();
  const body = await req.json();
  const exercise = await Exercise.create(body);
  return NextResponse.json(exercise.toJSON(), { status: 201 });
}