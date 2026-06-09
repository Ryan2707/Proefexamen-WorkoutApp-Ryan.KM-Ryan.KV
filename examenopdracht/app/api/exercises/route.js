import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Exercise from '@/lib/models/Exercise';

const FALLBACKS = {
  'Bench Press': [
    { name: 'Dumbbell Bench Press', muscleGroups: ['Borst', 'Triceps'], note: 'vergelijkbare beweging' },
    { name: 'Incline Dumbbell Press', muscleGroups: ['Borst boven', 'Schouders'], note: null },
    { name: 'Cable Fly', muscleGroups: ['Borst'], note: null },
    { name: 'Push-Up varianten', muscleGroups: ['Borst', 'Triceps'], note: 'geen gewicht nodig' },
  ],
  'Shoulder Press': [
    { name: 'Dumbbell Shoulder Press', muscleGroups: ['Schouders'], note: 'vergelijkbare beweging' },
    { name: 'Arnold Press', muscleGroups: ['Schouders'], note: null },
    { name: 'Lateral Raise', muscleGroups: ['Schouders'], note: null },
  ],
  'Deadlifts': [
    { name: 'Romanian Deadlift', muscleGroups: ['Rug', 'Hamstrings'], note: 'vergelijkbare beweging' },
    { name: 'Sumo Deadlift', muscleGroups: ['Rug', 'Benen'], note: null },
    { name: 'Kettlebell Swing', muscleGroups: ['Rug', 'Benen'], note: null },
  ],
};

function getFallback(exerciseName) {
  if (FALLBACKS[exerciseName]) return FALLBACKS[exerciseName];

  return Object.values(FALLBACKS)
    .flat()
    .filter(e => e.name !== exerciseName);
}

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const replace = searchParams.get('replace');
  const muscle  = searchParams.get('muscle');
  const search  = searchParams.get('search');

  await connectDB();

  if (replace) {
    const exercises = await Exercise.find().lean();

    if (exercises.length > 0) {
      let alts = exercises.filter(e => e.name !== replace);
      if (muscle && muscle !== 'Alle') {
        alts = alts.filter(e => (e.muscleGroups || []).includes(muscle));
      }
      if (search) {
        alts = alts.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));
      }
      return NextResponse.json(alts.map(e => ({ ...e, _id: e._id.toString() })));
    }

    let fallback = getFallback(replace);
    if (muscle && muscle !== 'Alle') {
      fallback = fallback.filter(e => (e.muscleGroups || []).includes(muscle));
    }
    if (search) {
      fallback = fallback.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));
    }
    return NextResponse.json(fallback);
  }

  const query = {};
  if (search) query.name = { $regex: search, $options: 'i' };
  if (muscle && muscle !== 'Alle') query.muscleGroups = muscle;

  const exercises = await Exercise.find(query).lean();
  return NextResponse.json(exercises.map(e => ({ ...e, _id: e._id.toString() })));
}

export async function POST(req) {
  await connectDB();
  const body     = await req.json();
  const exercise = await Exercise.create(body);
  return NextResponse.json(
    { ...exercise.toJSON(), _id: exercise._id.toString() },
    { status: 201 }
  );
}