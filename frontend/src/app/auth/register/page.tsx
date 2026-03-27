'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api';
import { useAuthStore } from '@/store/auth';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    cpf: '',
    name: '',
    email: '',
    password: '',
    cnpj: '',
    tenantName: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await apiClient.post('/auth/register', formData);
      setAuth(response.data);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 to-primary-900 flex items-center justify-center p-4">
      <div className="card w-full max-w-md animate-slideUp">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-900">
          CampanhaOS
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Criar Nova Campanha
        </p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            placeholder="Nome Completo"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            required
          />
          <input
            type="text"
            name="cpf"
            placeholder="CPF (000.000.000-00)"
            value={formData.cpf}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Senha (mín. 8 caracteres)"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            required
          />
          <input
            type="text"
            name="cnpj"
            placeholder="CNPJ (00.000.000/0000-00)"
            value={formData.cnpj}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            required
          />
          <input
            type="text"
            name="tenantName"
            placeholder="Nome da Campanha"
            value={formData.tenantName}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50"
          >
            {loading ? 'Registrando...' : 'Registrar'}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          Já tem conta?{' '}
          <Link href="/auth/login" className="text-primary-600 font-medium hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}
