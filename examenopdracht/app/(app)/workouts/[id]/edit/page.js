'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import styles from '@/css/edit.module.css';

export default function EditWorkoutPage() {
  const router     = useRouter();
  const { id }     = useParams();

  const [workout, setWorkout]     = useState(null);
  const [name, setName]           = useState('');
  const [date, setDate]           = useState('');
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/workouts/${id}`)
      .then(r => r.json())
      .then(data => {
        setWorkout(data);
        setName(data.name || '');
        setDate(data.date ? data.date.slice(0, 10) : '');
        setExercises(data.exercises || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  const addExercise = () => {
    setExercises(prev => [...prev, { name: '', sets: 3, reps: 10, weight: '' }]);
  };

  const removeExercise = (i) => {
    setExercises(prev => prev.filter((_, idx) => idx !== i));
  };

  const updateExercise = (i, field, value) => {
    setExercises(prev =>
      prev.map((ex, idx) => idx === i ? { ...ex, [field]: value } : ex)
    );
  };

  const handleSave = async () => {
    if (!name.trim()) return alert('Geef een naam op');
    setSaving(true);
    try {
      const res = await fetch(`/api/workouts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, date, exercises }),
      });
      if (res.ok) router.push('/workouts');
      else alert('Opslaan mislukt');
    } catch {
      alert('Fout bij opslaan');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div style={{ padding: 40 }}>Laden...</div>;
  if (!workout) return <div style={{ padding: 40 }}>Workout niet gevonden.</div>;

  return (
    <div className={styles.page}>
      <div className={styles.titleGroup}>
        <h1 className={styles.title}>{workout.name} bewerken</h1>
        <p className={styles.subtitle}>
          {exercises.length} oefeningen
          {workout.durationMin
            ? ` · ${workout.durationMin}${workout.durationMax ? ` / ${workout.durationMax}` : ''} min`
            : ''}
        </p>
      </div>

      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>Basisgegevens</h2>

        <div className={styles.row2}>
          <div className={styles.field}>
            <label className={styles.label}>Naam</label>
            <input
              className={styles.input}
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Datum</label>
            <input
              className={styles.input}
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
        </div>

        <h2 className={styles.sectionTitle} style={{ marginTop: 24 }}>Oefeningen</h2>

        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Oefening</th>
              <th className={styles.th}>Sets</th>
              <th className={styles.th}>Reps</th>
              <th className={styles.th}>Gewicht</th>
              <th className={styles.th} colSpan={2}></th>
            </tr>
          </thead>
          <tbody>
            {exercises.map((ex, i) => (
              <tr key={i} className={styles.tr}>
                <td className={styles.td}>
                  <input
                    className={styles.inlineInput}
                    value={ex.name}
                    onChange={e => updateExercise(i, 'name', e.target.value)}
                  />
                </td>
                <td className={styles.td}>
                  <input
                    className={`${styles.inlineInput} ${styles.narrow}`}
                    type="number"
                    value={ex.sets}
                    onChange={e => updateExercise(i, 'sets', e.target.value)}
                  />
                </td>
                <td className={styles.td}>
                  <input
                    className={`${styles.inlineInput} ${styles.narrow}`}
                    type="number"
                    value={ex.reps}
                    onChange={e => updateExercise(i, 'reps', e.target.value)}
                  />
                </td>
                <td className={styles.td}>
                  <input
                    className={`${styles.inlineInput} ${styles.narrow}`}
                    value={ex.weight}
                    onChange={e => updateExercise(i, 'weight', e.target.value)}
                    placeholder="kg"
                  />
                </td>
                <td className={styles.td}>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => removeExercise(i)}
                  >
                    Verwijderen
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className={styles.addExerciseBtn} onClick={addExercise}>
          Oefening toevoegen
        </button>

        <div className={styles.actions}>
          <button className={styles.btnCancel} onClick={() => router.push('/workouts')}>
            Annuleren
          </button>
          <button className={styles.btnSave} onClick={handleSave} disabled={saving}>
            {saving ? 'Opslaan...' : 'Opslaan'}
          </button>
        </div>
      </div>
    </div>
  );
}