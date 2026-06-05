import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Workout from '@/lib/models/Workout';

export async function GET(req, { params }) {
  await connectDB();
  const { id } = await params;

  const workout = await Workout.findById(id).lean();
  if (!workout) return NextResponse.json({ error: 'Niet gevonden' }, { status: 404 });

  return NextResponse.json({
    ...workout,
    _id: workout._id.toString(),
    exerciseCount: (workout.exercises || []).length,
  });
}

export async function PUT(req, { params }) {
  await connectDB();
  const { id } = await params;
  const { name, date, exercises } = await req.json();

  const updated = await Workout.findByIdAndUpdate(
    id,
    {
      name,
      date: date ? new Date(date) : undefined,
      exercises: (exercises || [])
        .filter(ex => ex.name?.trim())
        .map(ex => ({
          name:   ex.name.trim(),
          sets:   Number(ex.sets)       || 3,
          reps:   Number(ex.reps)       || 10,
          weight: parseFloat(ex.weight) || 0,
        })),
    },
    { new: true }
  );

  if (!updated) return NextResponse.json({ error: 'Niet gevonden' }, { status: 404 });

  return NextResponse.json({
    ...updated.toJSON(),
    _id: updated._id.toString(),
  });
}

export async function DELETE(req, { params }) {
  await connectDB();
  const { id } = await params;

  await Workout.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}