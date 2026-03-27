import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CampanhaOS - Gestão de Campanhas Eleitorais',
  description: 'SaaS de Gestão de Campanhas Eleitorais -multi-tenant',
  manifest: '/manifest.json',
  themeColor: '#0284c7',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#0284c7" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
