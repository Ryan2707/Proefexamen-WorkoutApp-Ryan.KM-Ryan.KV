"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "@/css/workouts.module.css";

const FILTERS = ["Alle", "Kracht", "Cardio"];

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState([]);
  const [filter, setFilter] = useState("Alle");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/workouts")
      .then((r) => r.json())
      .then((data) => {
        setWorkouts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered =
    filter === "Alle"
      ? workouts
      : workouts.filter((w) => w.category === filter);

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Mijn Workouts</h1>

        <Link href="/workouts/new">
          <button className={styles.btnPrimary}>Nieuwe workout</button>
        </Link>
      </div>

      {/* Category filters */}
      <div className={styles.filters}>
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ""}`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Workout list */}
      <div className={styles.list}>
        {loading && <div className={styles.empty}>Laden...</div>}

        {!loading && filtered.length === 0 && (
          <div className={styles.empty}>Geen workouts gevonden.</div>
        )}

        {filtered.map((workout) => (
          <div key={workout._id} className={styles.workoutRow}>
            <div className={styles.workoutInfo}>
              <div className={styles.workoutName}>{workout.name}</div>
              <div className={styles.workoutMeta}>
                {workout.exerciseCount} oefeningen
                {workout.durationMin
                  ? ` · ${workout.durationMin}${workout.durationMax ? ` / ${workout.durationMax}` : ""} min`
                  : ""}
              </div>
            </div>
            <Link href={`/workouts/${workout._id}/edit`}>
              <button className={styles.btnSecondary}>Bewerken</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
