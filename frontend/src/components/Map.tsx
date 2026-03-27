'use client';

import { useEffect, useRef, useState } from 'react';

interface Marker {
  id: string | number;
  lat: number;
  lng: number;
  title: string;
  type: 'lideranca' | 'reunion' | 'municipio';
  color?: string;
}

interface MapProps {
  center?: { lat: number; lng: number };
  markers?: Marker[];
  onMarkerClick?: (markerId: string | number) => void;
  zoom?: number;
  heatmap?: boolean;
}

export function Map({
  center = { lat: -16.6869, lng: -49.2648 },
  markers = [],
  onMarkerClick,
  zoom = 8,
  heatmap = false,
}: MapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let map: any;
    let leaflet: any;

    const init = async () => {
      try {
        // import leaflet dynamically to avoid build break if não instalado
        const mod = await import('leaflet');
        leaflet = mod.default || mod;
        if (!containerRef.current) return;

        // inject CSS once
        if (typeof document !== 'undefined' && !document.getElementById('leaflet-css')) {
          const link = document.createElement('link');
          link.id = 'leaflet-css';
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        map = leaflet.map(containerRef.current).setView([center.lat, center.lng], zoom);
        leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
        }).addTo(map);

        markers.forEach((marker) => {
          const iconHtml = `<span style="font-size:16px;color:${marker.color || '#3182ce'}">⬤</span>`;
          const icon = leaflet.divIcon({ html: iconHtml, className: '' });
          const m = leaflet.marker([marker.lat, marker.lng], { icon }).addTo(map);
          m.on('click', () => onMarkerClick?.(marker.id));
          m.bindPopup(`<strong>${marker.title}</strong><br/>${marker.type}`);
        });

        if (heatmap) {
          // Simplified placeholder heatmap: semi-opaque circles
          markers.forEach((marker) => {
            leaflet.circle([marker.lat, marker.lng], {
              color: 'rgba(255, 0, 0, 0.35)',
              fillOpacity: 0.2,
              radius: 5000,
            }).addTo(map);
          });
        }
      } catch (err) {
        setError('Não foi possível inicializar o mapa. Verifique se o Leaflet está instalado.');
        console.error('Map init error', err);
      }
    };

    init();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [center, markers, onMarkerClick, zoom, heatmap]);

  return (
    <div className="rounded-lg overflow-hidden shadow-sm h-96 bg-white">
      {error ? (
        <div className="flex items-center justify-center h-full text-red-500 px-4 py-8">
          {error}
        </div>
      ) : (
        <div ref={containerRef} className="h-96 w-full" />
      )}
    </div>
  );
}
