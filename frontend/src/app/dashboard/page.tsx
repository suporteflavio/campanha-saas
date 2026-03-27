'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { apiClient } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const { user, accessToken, logout } = useAuthStore();
  const [resumo, setResumo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken) {
      router.push('/auth/login');
      return;
    }

    fetchDashboard();
  }, [accessToken, router]);

  const fetchDashboard = async () => {
    try {
      const response = await apiClient.get('/dashboard/resumo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setResumo(response.data);
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container-safe flex items-center justify-between py-4">
          <h1 className="text-2xl font-bold text-primary-700">CampanhaOS</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">
              Bem-vindo, <strong>{user?.name}</strong>
            </span>
            <button onClick={handleLogout} className="btn-secondary text-sm">
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container-safe py-8">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            {
              label: 'Total de Eleitores',
              value: resumo?.totalEleitores || 0,
              icon: '👥',
            },
            {
              label: 'Lideranças',
              value: resumo?.totalLideranças || 0,
              icon: '⭐',
            },
            {
              label: 'Reuniões',
              value: resumo?.totalReunioes || 0,
              icon: '📅',
            },
            {
              label: 'Meta de Votos',
              value: `${resumo?.percentualMeta || 0}%`,
              icon: '🎯',
            },
          ].map((kpi, idx) => (
            <div key={idx} className="card">
              <div className="text-3xl mb-2">{kpi.icon}</div>
              <p className="text-gray-600 text-sm">{kpi.label}</p>
              <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Votos Atual vs Meta */}
        <div className="card mb-8">
          <h2 className="text-xl font-bold mb-4">Votos Atual vs Meta</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-700">Votos Atuais</span>
                <span className="font-bold text-primary-600">
                  {resumo?.votosAtuais || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-primary-600 h-4 rounded-full transition-all"
                  style={{
                    width: `${
                      resumo?.votosNecessarios > 0
                        ? (resumo?.votosAtuais / resumo?.votosNecessarios) * 100
                        : 0
                    }%`,
                  }}
                ></div>
              </div>
            </div>
            <p className="text-gray-600 text-sm">
              Meta: {resumo?.votosNecessarios || 0} votos
            </p>
          </div>
        </div>

        {/* Resumo Financeiro */}
        {resumo?.resumoFinanceiro && (
          <div className="card">
            <h2 className="text-xl font-bold mb-4">Resumo Financeiro</h2>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-gray-600 text-sm">Receitas</p>
                <p className="text-xl font-bold text-green-600">
                  R$ {resumo.resumoFinanceiro.totalReceitas.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Despesas</p>
                <p className="text-xl font-bold text-red-600">
                  R$ {resumo.resumoFinanceiro.totalDespesas.toFixed(2)}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm">Saldo</p>
                <p className="text-xl font-bold text-primary-600">
                  R$ {resumo.resumoFinanceiro.saldo.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
