import type { Metadata } from "next";
import Navbar from "../componentes/navbar/navbar";

export const metadata: Metadata = {
  title: "Mi App de Tareas",
  description: "Proyecto de Desarrollo de Aplicaciones Web",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="bg-purple-300">
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </body>
    </html>
  );
}