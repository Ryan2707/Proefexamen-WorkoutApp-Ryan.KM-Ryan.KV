'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/css/new.module.css';

export default function NewWorkoutPage() {
  const router = useRouter();

  const [name, setName]         = useState('');
  const [date, setDate]         = useState('');
  const [category, setCategory] = useState('');
  const [duration, setDuration] = useState('');
  const [notes, setNotes]       = useState('');
  const [exercises, setExercises] = useState([]);
  const [saving, setSaving]     = useState(false);

  const addExercise = () => {
    setExercises(prev => [...prev, { name: '', sets: '', reps: '', weight: '' }]);
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
    if (!date) return alert('Kies een datum');

    setSaving(true);
    try {
      const res = await fetch('/api/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, date, category, duration, notes, exercises }),
      });
      if (res.ok) router.push('/workouts');
      else alert('Opslaan mislukt');
    } catch {
      alert('Fout bij opslaan');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Nieuwe workout aanmaken</h1>

      <div className={styles.card}>
        <h2 className={styles.sectionTitle}>Details</h2>

        <div className={styles.row2}>
          <div className={styles.field}>
            <label className={styles.label}>Workout naam *</label>
            <input
              className={styles.input}
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Datum *</label>
            <input
              className={styles.input}
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.row2}>
          <div className={styles.field}>
            <label className={styles.label}>Categorie</label>
            <input
              className={styles.input}
              value={category}
              onChange={e => setCategory(e.target.value)}
              placeholder="bv. Kracht, Cardio"
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Duur (min)</label>
            <input
              className={styles.input}
              type="number"
              value={duration}
              onChange={e => setDuration(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Notities</label>
          <textarea
            className={styles.textarea}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Voeg notities toe..."
            rows={3}
          />
        </div>

        <h2 className={styles.sectionTitle} style={{ marginTop: 24 }}>Oefeningen</h2>

        {exercises.length > 0 && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Oefening</th>
                <th className={styles.th}>Sets</th>
                <th className={styles.th}>Reps</th>
                <th className={styles.th}>Gewicht</th>
                <th className={styles.th}></th>
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
                      placeholder="Naam oefening"
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
                    <button className={styles.deleteBtn} onClick={() => removeExercise(i)}>
                      🗑
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

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