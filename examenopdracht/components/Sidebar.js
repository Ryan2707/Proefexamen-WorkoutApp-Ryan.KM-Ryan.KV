import Link from "next/link";

export default function Sidebar() {
  return (
    <aside
      style={{
        width: 240,
        padding: "32px 20px",
        background: "var(--sidebar-bg)",
        color: "var(--sidebar-text)",
        display: "flex",
        flexDirection: "column",
        gap: 24,
        overflowY: "auto",
        minHeight: "100vh",
      }}
    >
      <div>
        <h1 style={{ margin: 0, fontSize: 22 }}>WorkoutApp</h1>
        <p style={{ marginTop: 8, color: "var(--sidebar-text)" }}>
          Jouw dashboard
        </p>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Link
          href="/dashboard"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          Dashboard
        </Link>
        <Link
          href="/workouts"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          Workouts
        </Link>
        <Link
          href="/exercises"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          Oefeningen
        </Link>
        <Link
          href="/agenda"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          Agenda
        </Link>
      </nav>

      <div
        style={{
          marginTop: "auto",
          borderTop: "1px solid #666",
          padding: "15px",
          color: "#999",
        }}
      >
        Ryan Kalisvaart
      </div>
    </aside>
  );
}
