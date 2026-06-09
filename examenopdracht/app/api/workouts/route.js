import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import Workout from '@/lib/models/Workout';

export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
  }

  await connectDB();

  const workouts = await Workout.find({ userId: session.user.id })
    .sort({ date: -1 })
    .lean();

  const result = workouts.map(w => ({
    ...w,
    _id: w._id.toString(),
    exerciseCount: (w.exercises || []).length,
  }));

  return NextResponse.json(result);
}

export async function POST(req) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: 'Niet ingelogd' }, { status: 401 });
  }

  await connectDB();

  const { name, date, category, duration, notes, exercises } = await req.json();

  const workout = await Workout.create({
    name,
    date: date ? new Date(date) : undefined,
    category: category || 'Kracht',
    durationMin: duration ? Number(duration) : undefined,
    notes,
    userId: session.user.id,
    exercises: (exercises || [])
      .filter(ex => ex.name?.trim())
      .map(ex => ({
        name:   ex.name.trim(),
        sets:   Number(ex.sets)       || 3,
        reps:   Number(ex.reps)       || 10,
        weight: parseFloat(ex.weight) || 0,
      })),
  });

  return NextResponse.json(
    { ...workout.toJSON(), _id: workout._id.toString() },
    { status: 201 }
  );
}