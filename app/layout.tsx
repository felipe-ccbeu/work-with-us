import type { Metadata, Viewport } from "next";
import { Lato, PT_Sans } from "next/font/google";
import "./globals.css";

const ptSans = PT_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--fonte-pt-sans",
  display: "swap",
});

const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--fonte-lato",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Trabalhe conosco — CCBEU Guarapuava",
  description:
    "Faça parte da família CCBEU Guarapuava. Envie sua candidatura e conte o que te motiva a trabalhar com a gente.",
  openGraph: {
    title: "Create with us! — CCBEU Guarapuava",
    description: "Ficaremos felizes em ter você em nossa família.",
    locale: "pt_BR",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ea258b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${ptSans.variable} ${lato.variable}`}>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
