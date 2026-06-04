'use client';

import Link from 'next/link';

export default function NewWorkoutPage() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Nieuwe workout</h1>
      <p>Deze pagina is leeg en kan hier verder worden ingevuld.</p>
      <Link href='/workouts'>Terug naar workouts</Link>
    </div>
  );
}

