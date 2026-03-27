'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';

export default function BlockedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { logout } = useAuthStore();

  const campaignName =
    searchParams.get('campaign') ||
    (typeof window !== 'undefined' ? localStorage.getItem('campaignName') : 'Sua campanha');

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-600 text-white p-4">
      <div className="max-w-xl w-full bg-red-700/90 border border-red-800 rounded-2xl shadow-xl p-8">
        <h1 className="text-4xl font-black mb-3">⛔ Acesso Suspenso</h1>
        <p className="text-lg mb-5">Sua campanha está com acesso bloqueado por questões administrativas.</p>
        <div className="bg-white/10 p-4 rounded-lg mb-6">
          <p className="text-sm text-gray-100 mb-1">Campanha:</p>
          <p className="font-semibold text-xl">{campaignName}</p>
        </div>

        <div className="mb-6">
          <p>Se você acha que isso é um erro, entre em contato:</p>
          <p className="mt-2">📞 Flávio Silveira</p>
          <p>
            WhatsApp:{' '}
            <a
              href="https://wa.me/5519999999999"
              className="underline"
              target="_blank"
              rel="noreferrer"
            >
              Abrir WhatsApp
            </a>
          </p>
          <p>E-mail: flavio@campanhaos.com.br</p>
        </div>

        <button
          onClick={handleLogout}
          className="w-full py-3 font-bold rounded-xl bg-white text-red-700 hover:bg-gray-100"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
