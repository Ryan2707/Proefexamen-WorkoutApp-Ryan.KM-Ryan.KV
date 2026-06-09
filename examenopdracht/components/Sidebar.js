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
      <div
        style={{
          borderBottom: "1px solid #666",
          paddingBottom: "15px",
        }}
      >
        <h1 style={{ margin: 0, fontSize: 22 }}>WorkoutApp</h1>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Link
          href="/workouts"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          Overzicht
        </Link>
        <Link
          href="/agenda"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          Agenda
        </Link>
        <Link
          href="/workouts/new"
          style={{ color: "inherit", textDecoration: "none" }}
        >
          Nieuwe workout
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
