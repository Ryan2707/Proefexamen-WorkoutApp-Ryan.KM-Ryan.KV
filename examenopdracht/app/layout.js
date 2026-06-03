import './globals.css';

export const metadata = {
  title: 'WorkoutApp',
  description: 'Jouw persoonlijke workout tracker',
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}