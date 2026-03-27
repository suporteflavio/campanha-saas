'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';

const attendanceSchema = z.object({
  name: z.string().min(3, 'Digite seu nome completo'),
  whatsapp: z.string().min(11, 'WhatsApp inválido'),
  municipio: z.string().min(2, 'Selecione o município'),
  bairro: z.string().min(2, 'Digite o bairro'),
  interesses: z.array(z.string()).min(1, 'Selecione ao menos um interesse'),
  lgpd: z.literal(true, { errorMap: () => ({ message: 'É necessário autorizar LGPD' }) }),
});

type AttendanceForm = z.infer<typeof attendanceSchema>;

const INTERESTS = ['Saúde', 'Agro', 'Segurança', 'Educação', 'Infraestrutura', 'Assistência Social'];

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (value: number) => (value * Math.PI) / 180;
  const R = 6371e3;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lon2 - lon1);

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function AttendanceTokenPage() {
  const params = useParams();
  const router = useRouter();
  const token = params?.token as string;
  const [meeting, setMeeting] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [geoData, setGeoData] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AttendanceForm>({
    resolver: zodResolver(attendanceSchema),
    defaultValues: { interesses: [], lgpd: false },
  });

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get(`/attendance/reuniao/${token}`);
        setMeeting(response.data);
        if (response.data?.municipio) {
          setValue('municipio', response.data.municipio);
        }
      } catch (err: any) {
        console.error(err);
        toast.error('Token inválido ou reunião não encontrada.');
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchMeeting();
  }, [token, setValue]);

  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError('GPS não disponível neste dispositivo.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setGeoData({ lat, lng });

        if (meeting?.latitude && meeting?.longitude) {
          const dist = haversineDistance(lat, lng, meeting.latitude, meeting.longitude);
          setDistance(dist);
        }
      },
      (err) => {
        console.error(err);
        setGeoError('Por favor, autorize sua localização para continuar');
      },
      { enableHighAccuracy: true, timeout: 20000 },
    );
  }, [meeting]);

  const onSubmit = async (data: AttendanceForm) => {
    if (!geoData) {
      toast.error('Localização não autorizada.');
      return;
    }

    if (distance && distance > 500) {
      toast.error(`Você está muito longe do local da reunião (${Math.round(distance)}m)`);
      return;
    }

    try {
      await apiClient.post(`/attendance/reuniao/${token}/presenca`, {
        ...data,
        latitude: geoData.lat,
        longitude: geoData.lng,
        distancia: distance,
      });
      toast.success('Presença registrada!');
      router.push('/attendance/sucesso');
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Erro ao registrar presença.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="max-w-lg mx-auto bg-white rounded-xl shadow-lg p-6">
        <div className="text-center mb-4">
          <img src={meeting?.logo || '/logo.png'} alt="Logo" className="mx-auto h-16 w-16 mb-2" />
          <h1 className="text-2xl font-bold">Registro de Presença</h1>
          <p className="text-gray-600">Reunião: {meeting?.titulo || '...'} </p>
        </div>

        {loading && <p className="text-gray-600">Carregando dados da reunião...</p>}

        {!loading && !meeting && <p className="text-red-600">Reunião não encontrada.</p>}

        {!loading && meeting && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nome</label>
              <input {...register('name')} className="mt-1 w-full border rounded-lg p-2" />
              {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">WhatsApp</label>
              <input {...register('whatsapp')} type="tel" className="mt-1 w-full border rounded-lg p-2" placeholder="(99) 99999-9999" />
              {errors.whatsapp && <p className="text-red-600 text-sm">{errors.whatsapp.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Município</label>
              <select {...register('municipio')} className="mt-1 w-full border rounded-lg p-2">
                <option value="">Selecione...</option>
                <option value="Goiânia">Goiânia</option>
                <option value="Aparecida de Goiânia">Aparecida de Goiânia</option>
                <option value="Rio Verde">Rio Verde</option>
                {meeting?.municipio && !['Goiânia', 'Aparecida de Goiânia', 'Rio Verde'].includes(meeting.municipio) && (
                  <option value={meeting.municipio}>{meeting.municipio}</option>
                )}
              </select>
              {errors.municipio && <p className="text-red-600 text-sm">{errors.municipio.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Bairro</label>
              <input {...register('bairro')} className="mt-1 w-full border rounded-lg p-2" />
              {errors.bairro && <p className="text-red-600 text-sm">{errors.bairro.message}</p>}
            </div>

            <div>
              <p className="font-medium text-gray-700 mb-2">Interesses</p>
              <div className="grid grid-cols-2 gap-2">
                {INTERESTS.map((item) => (
                  <label key={item} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      value={item}
                      {...register('interesses')}
                      className="accent-blue-600"
                    />
                    {item}
                  </label>
                ))}
              </div>
              {errors.interesses && <p className="text-red-600 text-sm">{errors.interesses.message}</p>}
            </div>

            <div className="flex items-start gap-2">
              <input id="lgpd" type="checkbox" {...register('lgpd')} className="accent-blue-600 mt-1" />
              <label htmlFor="lgpd" className="text-sm text-gray-700">
                Autorizo uso de meus dados conforme LGPD
              </label>
            </div>
            {errors.lgpd && <p className="text-red-600 text-sm">{errors.lgpd.message}</p>}

            {geoError && <p className="text-red-600 text-sm">{geoError}</p>}
            {distance !== null && (
              <p className={`text-sm ${distance > 500 ? 'text-red-600' : 'text-green-600'}`}>
                Distância atual: {Math.round(distance)}m
              </p>
            )}

            <button
              disabled={!!geoError || (distance ?? 0) > 500}
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50"
            >
              Registrar Presença
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
