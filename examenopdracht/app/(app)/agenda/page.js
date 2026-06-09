'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from '@/css/agenda.module.css';

const DAYS   = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];
const MONTHS = [
  'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
  'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December',
];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}


function getFirstWeekday(year, month) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

export default function AgendaPage() {
  const router = useRouter();
  const today  = new Date();

  const [viewYear, setViewYear]   = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [workouts, setWorkouts]   = useState([]);
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  useEffect(() => {
    fetch('/api/workouts')
      .then(r => r.json())
      .then(setWorkouts)
      .catch(() => {});
  }, []);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
    else setViewMonth(m => m + 1);
    setSelectedDay(null);
  };

  
  const workoutsByDay = {};
  workouts.forEach(w => {
    if (!w.date) return;
    const d = new Date(w.date);
    if (d.getFullYear() === viewYear && d.getMonth() === viewMonth) {
      const day = d.getDate();
      if (!workoutsByDay[day]) workoutsByDay[day] = [];
      workoutsByDay[day].push(w);
    }
  });

  
  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay    = getFirstWeekday(viewYear, viewMonth);
  const cells       = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const rows = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  const isToday = (day) =>
    day === today.getDate() &&
    viewMonth === today.getMonth() &&
    viewYear === today.getFullYear();

  
  const selectedWorkouts = selectedDay ? (workoutsByDay[selectedDay] || []) : [];
  const selectedWorkout  = selectedWorkouts[0] || null;

  const dayName = selectedDay
    ? DAYS[(new Date(viewYear, viewMonth, selectedDay).getDay() + 6) % 7]
    : '';

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>
        Agenda – {MONTHS[viewMonth]} {viewYear}
      </h1>

      <div className={styles.calendarCard}>
        {}
        <div className={styles.navRow}>
          <button className={styles.navBtn} onClick={prevMonth}>{'< Vorige'}</button>
          <span className={styles.monthLabel}>{MONTHS[viewMonth]} {viewYear}</span>
          <button className={styles.navBtn} onClick={nextMonth}>{'Volgende >'}</button>
        </div>

        {}
        <div className={styles.dayHeaders}>
          {DAYS.map(d => (
            <div
              key={d}
              className={`${styles.dayHeader} ${d === 'Za' || d === 'Zo' ? styles.weekendHeader : ''}`}
            >
              {d}
            </div>
          ))}
        </div>

        {}
        {rows.map((row, ri) => (
          <div key={ri} className={styles.calRow}>
            {row.map((day, ci) => {
              const dayWorkouts = day ? (workoutsByDay[day] || []) : [];
              const isWeekend   = ci >= 5;
              const isSelected  = day === selectedDay;

              return (
                <div
                  key={ci}
                  onClick={() => day && setSelectedDay(day)}
                  className={[
                    styles.cell,
                    !day       ? styles.emptyCell   : '',
                    isWeekend  ? styles.weekendCell  : '',
                    isSelected ? styles.selectedCell : '',
                  ].join(' ')}
                >
                  {day && (
                    <>
                      <span className={[
                        styles.dayNum,
                        isToday(day)   ? styles.todayNum    : '',
                        isSelected     ? styles.selectedNum : '',
                      ].join(' ')}>
                        {day}
                      </span>

                      {dayWorkouts.slice(0, 2).map((w, wi) => (
                        <div key={wi} className={styles.pill}>
                          {w.name}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {}
      {selectedWorkout && (
        <div className={styles.infoBar}>
          <span className={styles.infoText}>
            {dayName} {selectedDay} {MONTHS[viewMonth].slice(0, 3).toLowerCase()}
            {' '}—{' '}{selectedWorkout.name}
            {selectedWorkout.exerciseCount != null
              ? `  ·  ${selectedWorkout.exerciseCount} oefeningen`
              : ''}
            {selectedWorkout.durationMin
              ? `  ·  ${selectedWorkout.durationMin}${selectedWorkout.durationMax ? ` / ${selectedWorkout.durationMax}` : ''} min`
              : ''}
          </span>
          <button
            className={styles.viewBtn}
            onClick={() => router.push(`/workouts/${selectedWorkout._id}/start`)}
          >
            Bekijken
          </button>
        </div>
      )}
    </div>
  );
}
