// ============================================================
// SIDEBAR COMPONENT
// ============================================================
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: '📊' },
  { name: 'Lideranças', path: '/liderancas', icon: '👥' },
  { name: 'Eleitores', path: '/eleitores', icon: '🗳️' },
  { name: 'Reuniões', path: '/reunioes', icon: '📅' },
  { name: 'Metas de Votos', path: '/metas', icon: '🎯' },
  { name: 'Financeiro', path: '/financeiro', icon: '💰' },
  { name: 'Equipe', path: '/equipe', icon: '👨‍💼' },
  { name: 'Demandas', path: '/demandas', icon: '📋' },
  { name: 'Marketing', path: '/marketing', icon: '📱' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`${
        collapsed ? 'w-20' : 'w-64'
      } bg-gray-900 text-white transition-all duration-300 hidden md:block min-h-screen`}
    >
      <div className="p-4 flex justify-between items-center">
        <h1 className={`font-bold ${collapsed ? 'hidden' : 'block'}`}>Menu</h1>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white"
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="mt-8 space-y-2 px-2">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.path);
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded transition ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {!collapsed && <span className="text-sm">{item.name}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
