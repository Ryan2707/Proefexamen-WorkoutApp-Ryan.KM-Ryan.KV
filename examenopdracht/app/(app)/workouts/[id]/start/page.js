'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function StartWorkoutPage() {
  const router = useRouter();
  const { id } = useParams();

  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);

  // current exercise index
  const [currentIdx, setCurrentIdx] = useState(0);

  // per-exercise overrides: { sets, reps, weight }
  const [overrides, setOverrides] = useState({});

  // rest timer
  const [restSeconds, setRestSeconds] = useState(0);
  const [restTotal, setRestTotal] = useState(150); // 2:30 default
  const [timerActive, setTimerActive] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/workouts/${id}`)
      .then(r => r.json())
      .then(data => {
        setWorkout(data);
        // init overrides from workout exercises
        const init = {};
        (data.exercises || []).forEach((ex, i) => {
          init[i] = { sets: ex.sets, reps: ex.reps, weight: ex.weight || 0 };
        });
        setOverrides(init);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  // rest timer logic
  useEffect(() => {
    if (timerActive) {
      intervalRef.current = setInterval(() => {
        setRestSeconds(s => {
          if (s >= restTotal) {
            clearInterval(intervalRef.current);
            setTimerActive(false);
            return restTotal;
          }
          return s + 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [timerActive, restTotal]);

  const startTimer = () => {
    setRestSeconds(0);
    setTimerActive(true);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const currentEx = workout?.exercises?.[currentIdx];
  const currentOverride = overrides[currentIdx] || {};
  const nextExercises = workout?.exercises?.slice(currentIdx + 1) || [];

  const adjust = (field, delta) => {
    setOverrides(prev => ({
      ...prev,
      [currentIdx]: {
        ...prev[currentIdx],
        [field]: Math.max(0, (prev[currentIdx]?.[field] ?? 0) + delta),
      },
    }));
  };

  const completeSet = () => {
    startTimer();
    const totalSets = currentOverride.sets || 3;
    const cur = overrides[currentIdx] || {};
    const completedSets = (cur.completedSets || 0) + 1;

    if (completedSets >= totalSets) {
      if (currentIdx < (workout.exercises.length - 1)) {
        setOverrides(prev => ({ ...prev, [currentIdx]: { ...prev[currentIdx], completedSets: 0 } }));
        setCurrentIdx(i => i + 1);
      } else {
        // workout done — navigate outside of setState
        router.push('/workouts');
      }
    } else {
      setOverrides(prev => ({
        ...prev,
        [currentIdx]: { ...prev[currentIdx], completedSets },
      }));
    }
  };

  const skipExercise = () => {
    if (currentIdx < (workout?.exercises?.length - 1)) {
      setCurrentIdx(i => i + 1);
    } else {
      router.push('/workouts');
    }
  };

  const completedSets = overrides[currentIdx]?.completedSets || 0;
  const totalSets = currentOverride.sets || 3;
  const currentSetNum = Math.min(completedSets + 1, totalSets);

  if (loading) return <div style={{ padding: 40 }}>Laden...</div>;
  if (!workout || !currentEx) return <div style={{ padding: 40 }}>Workout niet gevonden.</div>;

  const timerPct = restTotal > 0 ? (restSeconds / restTotal) * 100 : 0;

  return (
    <div style={{ padding: '32px 40px', maxWidth: 900 }}>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          {workout.name} — Actief
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: 14 }}>
          Bezig met: {currentEx.name} &nbsp; Set {currentSetNum} van {totalSets}
        </p>
      </div>

      {/* Rest timer bar */}
      <div style={{
        background: '#e5e7eb',
        borderRadius: 6,
        overflow: 'hidden',
        marginBottom: 24,
        height: 44,
        position: 'relative',
      }}>
        <div style={{
          width: `${timerPct}%`,
          height: '100%',
          background: 'var(--blue)',
          transition: 'width 1s linear',
          borderRadius: 6,
        }} />
        <span style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 16,
          fontSize: 14,
          fontWeight: 600,
          color: timerPct > 20 ? '#fff' : 'var(--text-primary)',
        }}>
          Rusttimer: {formatTime(restSeconds)} / {formatTime(restTotal)}
        </span>
      </div>

      {/* Current exercise card */}
      <div style={{
        background: '#eff6ff',
        border: '2px solid var(--blue)',
        borderRadius: 'var(--radius)',
        padding: '20px 24px',
        marginBottom: 24,
      }}>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
            {currentEx.name}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
            Set {currentSetNum} van {totalSets}
          </p>
        </div>

        {/* Sets / Reps / Weight controls */}
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          {[
            { label: 'Sets', field: 'sets', step: 1 },
            { label: 'Reps', field: 'reps', step: 1 },
            { label: 'Gewicht (kg)', field: 'weight', step: 5 },
          ].map(({ label, field, step }) => (
            <div key={field}>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>{label}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                <button
                  onClick={() => adjust(field, -step)}
                  style={{
                    width: 36, height: 48, background: '#fff', border: '1px solid var(--border)',
                    borderRight: 'none', borderRadius: '4px 0 0 4px', fontSize: 18,
                    cursor: 'pointer', fontWeight: 700, color: 'var(--text-primary)',
                  }}
                >
                  -
                </button>
                <div style={{
                  width: 64, height: 48, background: '#fff', border: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, fontWeight: 700, color: 'var(--text-primary)',
                }}>
                  {currentOverride[field] ?? currentEx[field] ?? 0}
                </div>
                <button
                  onClick={() => adjust(field, step)}
                  style={{
                    width: 36, height: 48, background: 'var(--blue)', border: '1px solid var(--blue)',
                    borderLeft: 'none', borderRadius: '0 4px 4px 0', fontSize: 18,
                    cursor: 'pointer', fontWeight: 700, color: '#fff',
                  }}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        <button
          onClick={completeSet}
          style={{
            background: '#16a34a', color: '#fff', border: 'none',
            borderRadius: 'var(--radius)', padding: '12px 28px',
            fontSize: 15, fontWeight: 600, cursor: 'pointer',
          }}
        >
          Set voltooien ✓
        </button>
        <button
          onClick={skipExercise}
          style={{
            background: '#f3f4f6', color: 'var(--text-primary)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '12px 24px',
            fontSize: 15, fontWeight: 500, cursor: 'pointer',
          }}
        >
          Oefening overslaan
        </button>
      </div>

      {/* Upcoming exercises */}
      {nextExercises.length > 0 && (
        <>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>
            Volgende oefeningen
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0, border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
            {nextExercises.map((ex, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '16px 20px',
                  borderBottom: i < nextExercises.length - 1 ? '1px solid var(--border)' : 'none',
                  background: '#fff',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--text-primary)' }}>{ex.name}</div>
                  <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
                    {ex.sets} sets · {ex.reps} reps · {ex.weight} kg
                  </div>
                </div>
                <button
                  onClick={() => setCurrentIdx(currentIdx + 1 + i)}
                  style={{
                    background: '#f3f4f6', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)', padding: '7px 16px',
                    fontSize: 13, fontWeight: 500, cursor: 'pointer', color: 'var(--text-primary)',
                  }}
                >
                  Aanpassen
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}