'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

interface Campaign {
  id: string;
  candidateName: string;
  role: string;
  state: string;
  votePercent?: number;
  colors?: { primary: string; secondary: string };
}

export default function SelectCampaignPage() {
  const router = useRouter();
  const { accessToken, setTenantId, logout } = useAuthStore();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!accessToken) {
      router.push('/auth/login');
      return;
    }
    fetchCampaigns();
  }, [accessToken, router]);

  useEffect(() => {
    if (!loading && campaigns.length === 1) {
      handleSelectCampaign(campaigns[0]);
    }
  }, [loading, campaigns]);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get('/tenants');
      setCampaigns(response.data || []);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || 'Erro ao carregar campanhas');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCampaign = (campaign: Campaign) => {
    setTenantId(campaign.id);
    localStorage.setItem('tenantId', campaign.id);
    router.push('/dashboard');
  };

  const handleLogout = () => {
    logout();
    router.push('/auth/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Selecione sua campanha</h1>
          <p className="text-gray-600">Escolha a campanha que deseja gerenciar.</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {loading && <p className="text-gray-600">Carregando campanhas...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {!loading && campaigns.map((camp) => (
          <div key={camp.id} className="bg-white p-4 rounded-xl shadow hover:shadow-lg transition">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-xl font-bold">{camp.candidateName}</h2>
                <p className="text-sm text-gray-500">{camp.role} - {camp.state}</p>
              </div>
              <div className="h-12 w-12 rounded-full flex items-center justify-center" style={{backgroundColor: camp.colors?.primary || '#60A5FA', color: '#fff'}}>
                {camp.candidateName?.[0]?.toUpperCase() || 'C'}
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-3">
              {camp.votePercent ? `${camp.votePercent}% de votos estimados` : 'Sem dados de intenção de votos'}
            </p>
            <button
              onClick={() => handleSelectCampaign(camp)}
              className="block w-full py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              Selecionar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
