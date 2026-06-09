'use client';

import { useState, useEffect } from 'react';
import styles from '@/css/replace.module.css';

const MUSCLE_GROUPS = ['Alle', 'Borst', 'Schouders', 'Triceps', 'Rug'];

export default function ReplaceExerciseModal({ exercise, onSelect, onClose }) {
  const [search, setSearch]           = useState('');
  const [filter, setFilter]           = useState('Alle');
  const [alternatives, setAlternatives] = useState([]);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/exercises?replace=${encodeURIComponent(exercise.name)}`)
      .then(r => r.json())
      .then(data => { setAlternatives(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [exercise.name]);

  const filtered = alternatives.filter(alt => {
    const matchSearch = alt.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'Alle' || (alt.muscleGroups || []).includes(filter);
    return matchSearch && matchFilter;
  });

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        <h2 className={styles.title}>Oefening vervangen</h2>
        <p className={styles.subtitle}>Alternatief kiezen voor {exercise.name}</p>

        <div className={styles.currentCard}>
          <div className={styles.currentName}>{exercise.name}</div>
          <div className={styles.currentMeta}>
            {exercise.sets} sets · {exercise.reps} reps · {exercise.weight} kg
          </div>
        </div>

        <label className={styles.searchLabel}>Zoeken</label>
        <input
          className={styles.searchInput}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <div className={styles.filters}>
          {MUSCLE_GROUPS.map(g => (
            <button
              key={g}
              onClick={() => setFilter(g)}
              className={`${styles.filterBtn} ${filter === g ? styles.filterActive : ''}`}
            >
              {g}
            </button>
          ))}
        </div>

        <h3 className={styles.altTitle}>Alternatieven</h3>

        <div className={styles.altList}>
          {loading && <div className={styles.empty}>Laden...</div>}

          {!loading && filtered.length === 0 && (
            <div className={styles.empty}>Geen alternatieven gevonden.</div>
          )}

          {filtered.map((alt, i) => (
            <div
              key={i}
              className={`${styles.altRow} ${i === 0 ? styles.recommended : ''}`}
            >
              <div className={styles.altInfo}>
                <div className={styles.altName}>{alt.name}</div>
                <div className={styles.altMeta}>
                  {(alt.muscleGroups || []).join(' / ')}
                  {alt.note ? ` — ${alt.note}` : ''}
                </div>
              </div>
              {i === 0 && (
                <span className={styles.badge}>★ aanbevolen</span>
              )}
              <button
                className={styles.selectBtn}
                onClick={() => onSelect(alt)}
              >
                Selecteren
              </button>
            </div>
          ))}
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose}>
            Annuleren
          </button>
        </div>
      </div>
    </div>
  );
}