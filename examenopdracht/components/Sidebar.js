"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";

export default function Sidebar() {
  const { data: session } = useSession();

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
      <div style={{ borderBottom: "1px solid #666", paddingBottom: "15px" }}>
        <h1 style={{ margin: 0, fontSize: 22 }}>WorkoutApp</h1>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Link href="/workouts" style={{ color: "inherit", textDecoration: "none" }}>
          Overzicht
        </Link>
        <Link href="/agenda" style={{ color: "inherit", textDecoration: "none" }}>
          Agenda
        </Link>
        {/* Links to template picker first, then on to /workouts/new */}
        <Link href="/workouts/templates" style={{ color: "inherit", textDecoration: "none" }}>
          Nieuwe workout
        </Link>
      </nav>

      <div style={{ marginTop: "auto" }}>
        <div style={{ paddingBottom: "15px", color: "#999" }}>
          {session?.user?.name || "Gebruiker"}
        </div>
        <div style={{ borderTop: "1px solid #666", paddingTop: "15px" }}>
          <button
            onClick={() => signOut()}
            style={{
              width: "100%",
              padding: "10px",
              cursor: "pointer",
              backgroundColor: "red",
              color: "white",
              border: "none",
            }}
          >
            Log out
          </button>
        </div>
      </div>
    </aside>
  );
}