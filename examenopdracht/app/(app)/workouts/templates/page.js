'use client';

import { useRouter } from 'next/navigation';

const TEMPLATES = [
  {
    id: '3x10',
    name: '3×10 Hypertrofie',
    tag: '3×10',
    tagColor: '#3b82f6',
    description: 'Klassiek opbouwschema voor spiergroei',
    detail: 'Moderate gewicht · 60-90 sec rust',
    sets: 3,
    reps: 10,
    exampleSets: ['S1', 'S2', 'S3'],
  },
  {
    id: '5x5',
    name: '5×5 Kracht',
    tag: '5×5',
    tagColor: '#8b5cf6',
    description: 'Zwaar gewicht, lage reps voor maximale kracht',
    detail: 'Zwaar gewicht · 3-5 min rust',
    sets: 5,
    reps: 5,
    exampleSets: ['S1', 'S2', 'S3', 'S4', 'S5'],
  },
  {
    id: '4x12',
    name: '4×12 Volume',
    tag: '4×12',
    tagColor: '#22c55e',
    description: 'Hoog volume voor uithouding en definitie',
    detail: 'Licht gewicht · 45-60 sec rust',
    sets: 4,
    reps: 12,
    exampleSets: ['S1', 'S2', 'S3', 'S4'],
  },
  {
    id: 'custom',
    name: 'Eigen schema',
    tag: '—×—',
    tagColor: '#6b7280',
    description: 'Begin met een leeg schema en stel zelf in',
    detail: 'Volledig aanpasbaar',
    sets: 3,
    reps: 10,
    exampleSets: [],
    isCustom: true,
  },
];

export default function TemplatesPage() {
  const router = useRouter();

  const handleSelect = (tpl) => {
    const params = new URLSearchParams({
      sets: tpl.sets,
      reps: tpl.reps,
      template: tpl.id,
    });
    router.push(`/workouts/new?${params.toString()}`);
  };

  return (
    <div style={{ padding: '32px 40px', maxWidth: 900 }}>
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
          Nieuwe workout aanmaken
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: 4, fontSize: 14 }}>
          Kies een template of begin leeg
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {TEMPLATES.map((tpl) => (
          <div
            key={tpl.id}
            style={{
              background: 'var(--content-bg)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
            }}
          >
            <div style={{ height: 4, background: tpl.tagColor }} />

            <div style={{ padding: '16px 20px 20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {tpl.name}
                </span>
                <span style={{
                  fontSize: 12, fontWeight: 600, color: tpl.tagColor,
                  background: `${tpl.tagColor}18`, padding: '2px 10px', borderRadius: 20,
                }}>
                  {tpl.tag}
                </span>
              </div>

              <p style={{ fontSize: 13, color: 'var(--text-secondary)', margin: '0 0 2px' }}>
                {tpl.description}
              </p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 14px' }}>
                {tpl.detail}
              </p>

              {tpl.exampleSets.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <p style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, fontWeight: 500 }}>
                    Voorbeeld oefening
                  </p>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {tpl.exampleSets.map((s) => (
                      <span key={s} style={{
                        fontSize: 11, background: '#f3f4f6', color: 'var(--text-secondary)',
                        padding: '3px 8px', borderRadius: 4, fontWeight: 500,
                      }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {tpl.isCustom && <div style={{ marginBottom: 16, height: 42 }} />}

              <button
                onClick={() => handleSelect(tpl)}
                style={{
                  width: '100%', padding: '9px 0',
                  background: tpl.isCustom ? '#374151' : tpl.tagColor,
                  color: '#fff', border: 'none', borderRadius: 'var(--radius)',
                  fontWeight: 600, fontSize: 14, cursor: 'pointer',
                }}
              >
                {tpl.isCustom ? 'Leeg beginnen' : 'Gebruik template'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}