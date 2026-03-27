// ============================================================
// AUTHENTICATED LAYOUT (Para dashboard e módulos)
// ============================================================
'use client';

import { Header, Sidebar } from '@/components';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, accessToken } = useAuthStore();
  const router = useRouter();

  // Redirecionar para login se não autenticado
  useEffect(() => {
    if (!user || !accessToken) {
      router.push('/auth/login');
    }
  }, [user, accessToken, router]);

  if (!user || !accessToken) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 bg-gray-50 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
