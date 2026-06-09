import "@/css/globals.css";
import AuthProvider from "@/components/SessionProvider";

export const metadata = {
  title: "WorkoutApp",
  description: "Jouw persoonlijke workout tracker",
};

export default function RootLayout({ children }) {
  return (
    <html lang="nl">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}