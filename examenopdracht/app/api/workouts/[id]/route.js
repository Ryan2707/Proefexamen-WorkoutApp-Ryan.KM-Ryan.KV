import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Workout from '@/lib/models/Workout';

export async function GET(req, { params }) {
  await connectDB();
  const { id } = await params;
  const workout = await Workout.findById(id).lean();
  if (!workout) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ ...workout, exerciseCount: (workout.exercises || []).length });
}

export async function PUT(req, { params }) {
  await connectDB();
  const { id } = await params;
  const body = await req.json();
  const { name, date, exercises } = body;

  const updated = await Workout.findByIdAndUpdate(
    id,
    {
      name,
      date: date ? new Date(date) : undefined,
      exercises: (exercises || []).map(ex => ({
        name: ex.name,
        sets: Number(ex.sets) || 3,
        reps: Number(ex.reps) || 10,
        weight: parseFloat(ex.weight) || 0,
      })),
    },
    { new: true }
  );

  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(updated.toJSON());
}

export async function DELETE(req, { params }) {
  await connectDB();
  const { id } = await params;
  await Workout.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}