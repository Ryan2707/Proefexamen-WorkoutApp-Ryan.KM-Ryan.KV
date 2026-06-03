// import Sidebar from '@/components/Sidebar';

export default function AppLayout({ children }) {
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* <Sidebar /> */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        background: 'var(--bg)',
      }}>
        {children}
      </main>
    </div>
  );
}