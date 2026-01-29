"use client";

import React, { useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, MapPin, Truck, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";

// --- CONFIGURACIÓN DEL PIN PREMIUM CON INDICADOR DE ESTADO ---
const createCustomIcon = (placa: string, isInside: boolean) => {
  if (typeof window === "undefined") return null;

  return L.divIcon({
    className: "custom-div-icon",
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; width: 120px; transform: translateX(-35%);">
        
        <!-- 1. PLACA (CAJA NEGRA) -->
        <div style="
          background: #050038; 
          color: white; 
          padding: 3px 10px; 
          border-radius: 6px; 
          font-size: 12px; 
          font-weight: 900; 
          border: 1.5px solid rgba(255,255,255,0.25); 
          white-space: nowrap; 
          box-shadow: 0 6px 12px rgba(0,0,0,0.4); 
          text-transform: uppercase; 
          letter-spacing: 0.8px;
          z-index: 3;
        ">
          ${placa}
        </div>

        <!-- 2. ETIQUETA DE ESTADO (Solo si está en localidad) -->
        ${isInside ? `
          <div style="
            background: #10b981; 
            color: white; 
            padding: 1px 8px; 
            border-radius: 4px; 
            font-size: 9px; 
            font-weight: 900; 
            text-transform: uppercase; 
            margin-top: 2px;
            margin-bottom: -4px;
            box-shadow: 0 4px 6px rgba(16,185,129,0.3);
            border: 1px solid rgba(255,255,255,0.4);
            z-index: 4;
            animate: bounce 2s infinite;
          ">
            EN LOCALIDAD
          </div>
        ` : ''}

        <!-- 3. CUERPO DEL PIN -->
        <div style="position: relative; width: 40px; height: 55px; filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3)); margin-top: 2px;">
          <svg width="40" height="55" viewBox="0 0 32 45" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0C7.16344 0 0 7.16344 0 16C0 26 16 45 16 45C16 45 32 26 32 16C32 7.16344 24.8366 0 16 0Z" fill="${isInside ? '#ff6b00' : '#ff6b00'}"/>
            <circle cx="16" cy="16" r="11" fill="white"/>
          </svg>

          <!-- ÍCONO DE CAMIÓN CENTRADO -->
          <div style="position: absolute; top: 16px; left: 20px; transform: translate(-50%, -50%); color: #050038;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M1 3h15v13H1z"></path>
              <path d="M16 8h4l3 3v5h-7V8z"></path>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
          </div>
        </div>
      </div>
    `,
    iconSize: [120, 90],
    iconAnchor: [20, 85],
  });
};

export default function VehicleMap({ locationName }: { locationName: string }) {
  const [searchTerm, setSearchTerm] = useState("");

  const hasLocation = locationName && locationName !== "" && locationName !== "SIN LOCALIDAD" && locationName !== "CENTRO DE DISTRIBUCIÓN";

  // Coordenadas del centro de la localidad
  const centroLocalidad: [number, number] = [6.333, -75.552];
  const RADIUS_METERS = 800;

  // Datos de vehículos
  const vehiculos = [
    { id: 1, placa: "CCC0009", oc: "OC-88921", cita: "3381589", lat: 6.3340, lng: -75.5530 }, // DENTRO
    { id: 2, placa: "AAA111", oc: "OC-4002", cita: "3381500", lat: 6.3550, lng: -75.5700 },  // FUERA
    { id: 3, placa: "XWZ772", oc: "OC-10224", cita: "3381602", lat: 6.3150, lng: -75.5400 }, // FUERA
  ];

  // Función para calcular si está dentro del radio (Usa la librería Leaflet)
  const checkIsInside = (lat: number, lng: number) => {
    const distance = L.latLng(centroLocalidad).distanceTo([lat, lng]);
    return distance <= RADIUS_METERS;
  };

  const filteredVehicles = useMemo(() => {
    if (!hasLocation) return [];
    return vehiculos.filter(v => v.placa.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [searchTerm, hasLocation]);

  return (
    <div className="relative w-full h-full bg-[#f1f5f9] overflow-hidden">
      
      {hasLocation && (
        <div className="absolute top-6 left-6 z-[1000] w-80">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff6b00]" size={20} />
            <Input 
              placeholder="BUSCAR PLACA..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-14 pl-12 pr-4 bg-white/95 backdrop-blur shadow-2xl rounded-2xl border-none font-black text-sm uppercase tracking-widest focus-visible:ring-2 focus-visible:ring-orange-500 transition-all"
            />
          </div>
        </div>
      )}

      <MapContainer center={centroLocalidad} zoom={hasLocation ? 14 : 6} style={{ height: "100%", width: "100%" }} zoomControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        
        {hasLocation && (
          <>
            <Circle 
              center={centroLocalidad} 
              radius={RADIUS_METERS} 
              pathOptions={{ fillColor: '#fbbf24', fillOpacity: 0.2, color: '#fbbf24', dashArray: '12, 12', weight: 3 }} 
            />

            {filteredVehicles.map(v => {
              const isInside = checkIsInside(v.lat, v.lng);
              return (
                <Marker 
                  key={v.id} 
                  position={[v.lat, v.lng]} 
                  icon={createCustomIcon(v.placa, isInside) as any}
                >
                  <Popup className="custom-popup">
                    <div className="p-2 min-w-[160px]">
                      <div className="flex justify-between border-b pb-2 mb-2">
                        <span className="text-[9px] font-black text-gray-400 uppercase">Documento OC</span>
                        <span className="text-[11px] font-bold text-[#1e2b58]">{v.oc}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-black text-gray-400 uppercase">Número Cita</span>
                        <span className="text-[11px] font-black text-[#ff6b00]">#{v.cita}</span>
                      </div>
                      {isInside && (
                        <div className="mt-2 pt-2 border-t border-emerald-100 flex items-center gap-2">
                          <CheckCircle2 size={12} className="text-emerald-500" />
                          <span className="text-[10px] font-black text-emerald-600 uppercase italic">Vehículo en sitio</span>
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </>
        )}
      </MapContainer>

      {/* PANEL INFERIOR */}
      <div className="absolute bottom-8 left-8 z-[1000]">
        {hasLocation ? (
          <div className="bg-[#050038] px-8 py-5 rounded-[2.5rem] shadow-2xl border border-white/10 flex items-center gap-4 animate-in slide-in-from-bottom-10">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
              <MapPin className="text-[#ff6b00]" size={28} />
            </div>
            <div>
              <p className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] mb-0.5">Localidad Seleccionada</p>
              <h4 className="text-white font-black italic uppercase text-xl tracking-tighter leading-tight">{locationName}</h4>
            </div>
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur px-8 py-6 rounded-[2rem] shadow-2xl border border-gray-100 flex items-center gap-5 animate-in fade-in">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center"><MapPin className="text-slate-400" size={24} /></div>
            <div>
              <h4 className="text-[#1e2b58] font-black uppercase text-sm tracking-widest">Sin monitoreo activo</h4>
              <p className="text-slate-400 text-xs font-bold italic">Selecciona una localidad en el panel superior.</p>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-div-icon { background: transparent !important; border: none !important; }
        .leaflet-popup-content-wrapper { border-radius: 1.5rem !important; padding: 10px !important; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25) !important; border: 1px solid #f1f5f9; }
        .leaflet-popup-tip-container { display: none; }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-2px); }
        }
      `}</style>
    </div>
  );
}