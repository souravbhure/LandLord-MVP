import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Land Monetization Platform",
  description: "Understand your land. Find the best way to monetize it.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen text-gray-900">
        <header className="border-b bg-white px-6 py-4 flex items-center justify-between">
          <a href="/" className="font-semibold text-lg text-brand">
            LandMonetize
          </a>
          <nav className="space-x-4 text-sm">
            <a href="/register" className="hover:underline">Register Land</a>
            <a href="/login" className="hover:underline">Login</a>
          </nav>
        </header>
        <main className="max-w-3xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
