// ============================================================
// HEADER COMPONENT
// ============================================================
'use client';

import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function Header() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-bold text-lg">C</span>
          </div>
          <span className="font-bold text-xl hidden sm:inline">CampanhaOS</span>
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded hover:bg-blue-500 transition"
          >
            <span className="text-sm">{user?.name || 'Usuário'}</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded shadow-lg z-10">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition"
              >
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
