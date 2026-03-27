'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';

const joinSchema = z.object({
  nome: z.string().min(3, 'Informe seu nome'),
  whatsapp: z.string().min(11, 'WhatsApp inválido'),
  cpf: z.string().optional(),
  municipio: z.string().min(2, 'Selecione o município'),
  bairro: z.string().min(2, 'Informe o bairro'),
  interesse: z.enum(['Saúde', 'Agro', 'Segurança', 'Educação', 'Infraestrutura', 'Assistência Social']),
  lgpd: z.literal(true, { errorMap: () => ({ message: 'É necessário consentir com LGPD' }) }),
});

type JoinForm = z.infer<typeof joinSchema>;

const municipiosGO = ['Goiânia', 'Aparecida de Goiânia', 'Anápolis', 'Rio Verde', 'Senador Canedo'];

export default function JoinTokenPage() {
  const { token } = useParams();
  const router = useRouter();
  const [leaderName, setLeaderName] = useState('');
  const [leaderId, setLeaderId] = useState('');
  const [loading, setLoading] = useState(true);
  const [blocked, setBlocked] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinForm>({
    resolver: zodResolver(joinSchema),
  });

  useEffect(() => {
    const fetchToken = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/join/${token}`);
        const data = response.data;

        if (data?.subscription_status === 'suspended' || data?.subscription_status === 'overdue') {
          setBlocked(true);
          return;
        }

        setLeaderName(data?.leaderName || 'Liderança');
        setLeaderId(data?.leaderId || '');
      } catch (err: any) {
        toast.error('Link inválido ou expirado.');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchToken();
  }, [token]);

  const onSubmit = async (form: JoinForm) => {
    try {
      await apiClient.post('/voters/join', {
        leaderId,
        nomeVotante: form.nome,
        whatsapp: form.whatsapp,
        cpf: form.cpf,
        municipio: form.municipio,
        bairro: form.bairro,
        interesse: form.interesse,
        consentimento: true,
      });
      toast.success('Obrigado por se juntar à nossa campanha! 🎉');
      router.push('/');
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Erro no cadastro.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-700">Carregando...</p>
      </div>
    );
  }

  if (blocked) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-yellow-100 border border-yellow-300 p-6 rounded-lg">
          <h1 className="text-xl font-bold mb-2">Campanha indisponível</h1>
          <p>Sua campanha está com acesso bloqueado ou inativa.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white p-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-1">Indicado por: {leaderName}</h1>
        <p className="text-gray-600 mb-6">Preencha seus dados para entrar no time.</p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input {...register('nome')} className="mt-1 w-full border rounded-lg p-2" />
            {errors.nome && <p className="text-red-600 text-sm">{errors.nome.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">WhatsApp</label>
            <input {...register('whatsapp')} className="mt-1 w-full border rounded-lg p-2" placeholder="(99) 99999-9999" />
            {errors.whatsapp && <p className="text-red-600 text-sm">{errors.whatsapp.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">CPF (opcional)</label>
            <input {...register('cpf')} className="mt-1 w-full border rounded-lg p-2" placeholder="000.000.000-00" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Município</label>
            <select {...register('municipio')} className="mt-1 w-full border rounded-lg p-2">
              <option value="">Selecione</option>
              {municipiosGO.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            {errors.municipio && <p className="text-red-600 text-sm">{errors.municipio.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Bairro</label>
            <input {...register('bairro')} className="mt-1 w-full border rounded-lg p-2" />
            {errors.bairro && <p className="text-red-600 text-sm">{errors.bairro.message}</p>}
          </div>

          <div>
            <p className="block text-sm font-medium text-gray-700 mb-2">Interesse principal</p>
            <div className="grid grid-cols-2 gap-2">
              {['Saúde', 'Agro', 'Segurança', 'Educação', 'Infraestrutura', 'Assistência Social'].map((i) => (
                <label key={i} className="flex items-center gap-2 rounded-lg border p-2">
                  <input type="radio" value={i} {...register('interesse')} className="accent-blue-600" />
                  <span>{i}</span>
                </label>
              ))}
            </div>
            {errors.interesse && <p className="text-red-600 text-sm">{errors.interesse.message}</p>}
          </div>

          <div className="flex items-start gap-2">
            <input type="checkbox" {...register('lgpd')} className="accent-blue-600 mt-1" />
            <label className="text-sm text-gray-700">Autorizo contato e uso de dados conforme LGPD</label>
          </div>
          {errors.lgpd && <p className="text-red-600 text-sm">{errors.lgpd.message}</p>}

          <button type="submit" className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700">
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
