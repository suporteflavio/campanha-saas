'use client';

import { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';
import toast from 'react-hot-toast';

type Voucher = {
  codigo: string;
  status: 'valid' | 'used' | 'expired';
  tipoCombustivel: string;
  litros: number;
  valorEstimado: number;
  posto?: { latitude: number; longitude: number; nome: string };
};

const haversineDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
  const toRad = (x: number) => (x * Math.PI) / 180;
  const R = 6371e3;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export default function FuelValidatePage() {
  const [code, setCode] = useState('');
  const [voucher, setVoucher] = useState<Voucher | null>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [price, setPrice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!voucher || !voucher.posto || !location) return;
    const dist = haversineDistance(location.lat, location.lng, voucher.posto.latitude, voucher.posto.longitude);
    setDistance(dist);
  }, [location, voucher]);

  const askLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocalização não suportada.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => toast.error('Por favor, autorize sua localização.'),
      { enableHighAccuracy: true },
    );
  };

  const handleSearch = async () => {
    if (!code.trim()) {
      toast.error('Informe o código do voucher.');
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.get(`/fuel/vouchers/${encodeURIComponent(code.trim())}`);
      setVoucher(response.data);
      if (response.data.status === 'valid') {
        toast.success('Voucher encontrado e válido.');
      }
    } catch (err: any) {
      console.error(err);
      setVoucher(null);
      toast.error(err.response?.data?.message || 'Voucher inválido');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!voucher) return;
    if (!location) {
      toast.error('É necessário autorização de GPS.');
      return;
    }

    if (voucher.status !== 'valid') {
      return toast.error('Voucher não é válido para uso.');
    }

    if (distance === null || distance > 500) {
      return toast.error('Você está muito longe do posto; não é possível confirmar.');
    }

    if (!price || Number(price) <= 0) {
      return toast.error('Informe o preço atual na bomba.');
    }

    try {
      setSubmitting(true);
      await apiClient.post(`/fuel/vouchers/${encodeURIComponent(code.trim())}/use`, {
        priceAtPump: Number(price),
        attendantLat: location.lat,
        attendantLng: location.lng,
      });
      toast.success('Vale utilizado com sucesso');
      setCode('');
      setVoucher(null);
      setPrice('');
      setLocation(null);
      setDistance(null);
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Erro ao confirmar uso.');
    } finally {
      setSubmitting(false);
    }
  };

  const valueToReceive = voucher && price ? (voucher.litros * Number(price)).toFixed(2) : '0.00';

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-4">Validação de Vale-Combustível</h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Código do Voucher</label>
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            type="text"
            className="mt-1 w-full border rounded-lg p-2"
            placeholder="Digite ou escaneie"
          />
        </div>

        <button
          onClick={handleSearch}
          disabled={loading}
          className="w-full py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
        >
          {loading ? 'Buscando...' : 'Buscar Voucher'}
        </button>

        <div className="mt-4">
          <button
            onClick={askLocation}
            className="w-full py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300"
          >
            Atualizar GPS
          </button>
        </div>

        {location && (
          <p className="mt-2 text-sm text-gray-600">Localização obtida: {location.lat.toFixed(5)}, {location.lng.toFixed(5)}</p>
        )}

        {distance !== null && (
          <p className={`mt-1 text-sm ${distance > 500 ? 'text-red-600' : 'text-green-600'}`}>
            Distância do posto: {Math.round(distance)}m
          </p>
        )}

        {voucher && (
          <div className="mt-5 bg-blue-50 border border-blue-200 p-4 rounded-lg">
            {voucher.status === 'valid' ? (
              <>
                <p className="font-semibold text-green-700">✅ Voucher válido</p>
                <p>Combustível: {voucher.tipoCombustivel}</p>
                <p>Litros: {voucher.litros}</p>
                <p>Valor estimado: R$ {voucher.valorEstimado.toFixed(2)}</p>
              </>
            ) : voucher.status === 'expired' ? (
              <p className="font-semibold text-red-700">Voucher expirado</p>
            ) : (
              <p className="font-semibold text-red-700">Voucher já foi utilizado</p>
            )}
          </div>
        )}

        {voucher?.status === 'valid' && (
          <div className="mt-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Preço Real na Bomba (R$/litro)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-1 w-full border rounded-lg p-2"
                placeholder="Ex: 5.49"
              />
            </div>

            <p className="text-sm text-gray-600">Você receberá R$ {valueToReceive}</p>

            <button
              onClick={handleConfirm}
              disabled={submitting || !location || (distance ?? 1000) > 500}
              className="w-full py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {submitting ? 'Confirmando...' : 'Confirmar Uso'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
