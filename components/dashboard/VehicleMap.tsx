"use client";

import React, { useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils"; 
import { 
  Search, MapPin, Truck, CheckCircle2, X, Info, 
  ArrowUp, Hash, Building2, Calendar, Clock, 
  User, ShieldCheck, FileText, Activity
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

// --- CONFIGURACIÓN DEL PIN PREMIUM ---
const createCustomIcon = (placa: string, type: 'carga' | 'descarga', isInside: boolean) => {
  if (typeof window === "undefined") return null;

  const arrowIcon = type === 'carga' 
    ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4CCAC8" stroke-width="4"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>`
    : `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF6C01" stroke-width="4"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>`;

  return L.divIcon({
    className: "custom-div-icon",
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; width: 120px; transform: translateX(-35%);">
        <!-- 1. PLACA -->
        <div style="background: #050038; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 900; border: 1.5px solid rgba(255,255,255,0.2); white-space: nowrap; box-shadow: 0 4px 8px rgba(0,0,0,0.3); text-transform: uppercase; z-index: 3;">
          ${placa}
        </div>

        <!-- 2. INDICADOR "EN SITIO" (DINÁMICO) -->
        ${isInside ? `
          <div style="background: #10b981; color: white; padding: 1px 6px; border-radius: 3px; font-size: 8px; font-weight: 900; text-transform: uppercase; margin-top: 1px; margin-bottom: -3px; border: 1px solid rgba(255,255,255,0.3); z-index: 4; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
            EN SITIO
          </div>
        ` : ''}

        <!-- 3. CUERPO DEL PIN -->
        <div style="position: relative; width: 38px; height: 50px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2)); margin-top: 2px;">
          <svg width="38" height="50" viewBox="0 0 32 42" fill="none">
            <path d="M16 0C7.16344 0 0 7.16344 0 16C0 26 16 42 16 42C16 42 32 26 32 16C32 7.16344 24.8366 0 16 0Z" fill="#ff6b00"/>
            <circle cx="16" cy="16" r="11" fill="white"/>
          </svg>
          
          <!-- Badge de Carga/Descarga -->
          <div style="position: absolute; top: -4px; right: -4px; background: white; border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; border: 1.5px solid #050038;">
            ${arrowIcon}
          </div>

          <div style="position: absolute; top: 16px; left: 19px; transform: translate(-50%, -50%); color: #050038;">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M1 3h15v13H1z"></path><path d="M16 8h4l3 3v5h-7V8z"></path><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
          </div>
        </div>
      </div>
    `,
    iconSize: [120, 90],
    iconAnchor: [20, 82],
  });
};

// --- COMPONENTE: SIDEBAR DE DETALLES ---
function VehicleDetailSidebar({ vehicle, onClose }: { vehicle: any, onClose: () => void }) {
  if (!vehicle) return null;
  const DetailItem = ({ label, value, icon: Icon }: any) => (
    <div className="flex flex-col py-3 border-b border-gray-50 group hover:bg-slate-50/50 transition-colors px-5">
      <div className="flex items-center gap-2 mb-0.5">
        {Icon && <Icon size={11} className="text-gray-400 group-hover:text-[#ff6b00]" />}
        <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-xs font-bold text-[#1e2b58]">{value || '---'}</span>
    </div>
  );

  return (
    <div className="absolute right-0 top-0 h-full w-[380px] bg-white shadow-[-10px_0_40px_rgba(0,0,0,0.15)] z-[2000] flex flex-col animate-in slide-in-from-right duration-300 border-l">
      <div className="bg-[#050038] p-6 text-white flex justify-between items-center shrink-0">
        <div>
          <h3 className="text-lg font-black italic tracking-tighter uppercase">Expediente Operativo</h3>
          <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Cita: {vehicle.cita}</p>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20"><X size={18} /></button>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="grid grid-cols-2 gap-0">
          <DetailItem label="Unidad de Negocio" value={vehicle.business_unit} icon={Building2} />
          <DetailItem label="Proveedor" value={vehicle.supplier} icon={User} />
          <DetailItem label="Fecha" value={vehicle.date} icon={Calendar} />
          <DetailItem label="Hora" value={vehicle.time} icon={Clock} />
          <DetailItem label="Tipo" value={vehicle.type.toUpperCase()} icon={Activity} />
          <DetailItem label="ID Cita" value={vehicle.cita} icon={FileText} />
          <DetailItem label="Estado" value="ARRIBADO" icon={ShieldCheck} />
          <DetailItem label="Orden de Compra" value={vehicle.oc} icon={FileText} />
          <DetailItem label="Placa" value={vehicle.placa} icon={Truck} />
          <DetailItem label="Transportadora" value={vehicle.carrier_company} icon={Truck} />
          <DetailItem label="Hora Entrada" value="14:02:10" icon={Clock} />
          <DetailItem label="En Planta" value="00:45:00" icon={Clock} />
          <DetailItem label="Traslado" value="00:12:00" icon={Clock} />
          <DetailItem label="Descargue" value="En proceso..." icon={Clock} />
          <DetailItem label="Salida Est." value="16:00:00" icon={Clock} />
          <DetailItem label="Usuario" value="J.GARCIA" icon={User} />
          <DetailItem label="On-Time" value="SI" icon={CheckCircle2} />
          <DetailItem label="Muelle" value="A-02" icon={MapPin} />
        </div>
             {/* --- NUEVA SECCIÓN: CÓDIGOS DE SEGUIMIENTO --- */}
        <div className="p-6 bg-slate-50/50">
          <div className="flex items-center gap-2 mb-4">
            <Hash size={14} className="text-[#ff6b00]" />
            <h4 className="text-[10px] font-black text-[#050038] uppercase tracking-widest">Códigos de Seguimiento Asociados</h4>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {vehicle.tracking_codes && vehicle.tracking_codes.length > 0 ? (
              vehicle.tracking_codes.map((code: string) => (
                <div 
                  key={code} 
                  className="flex items-center gap-2 bg-white border border-gray-200 px-3 py-2 rounded-lg shadow-sm group hover:border-[#ff6b00] transition-all cursor-default"
                >
                  <span className="text-[11px] font-black text-[#050038] font-mono tracking-tighter">{code}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]"></div>
                </div>
              ))
            ) : (
              <p className="text-[10px] font-bold text-gray-400 italic">No hay códigos adicionales registrados.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VehicleMap({ locationName }: { locationName: string }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);

  const centroLocalidad: [number, number] = [6.333, -75.552];
  const RADIUS = 800; // Radio en metros

  const vehiculos = [
    { id: 1, placa: "CCC0009", oc: "OC-88921", cita: "3381589", lat: 6.334, lng: -75.553, type: 'descarga', supplier: 'SOLA S.A.', business_unit: 'CEDI NORTE', carrier_company: 'TRANSPORTES ABC', tracking_codes: ["DFS54SF", "5464FGDF", "123RERET"]  },
    { id: 2, placa: "AAA111", oc: "OC-4002", cita: "3381500", lat: 6.350, lng: -75.570, type: 'carga', supplier: 'ALIMENTOS S.A.', business_unit: 'CEDI BOGOTÁ', carrier_company: 'EXPRESS LOG', tracking_codes: ["DFS54SF", "432WWDF", "001PASS"]  },
    { id: 3, placa: "XWZ772", oc: "OC-10224", cita: "3381602", lat: 6.315, lng: -75.540, type: 'descarga', supplier: 'CARGO S.A.S', business_unit: 'CEDI CALI', carrier_company: 'RAPIDO RUTA', tracking_codes: ["DFS54SF"]  },
  ];

  const checkIsInside = (lat: number, lng: number) => {
    return L.latLng(centroLocalidad).distanceTo([lat, lng]) <= RADIUS;
  };

  const filteredVehicles = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return vehiculos.filter(v => 
      v.placa.toLowerCase().includes(q) || v.cita.toLowerCase().includes(q) || 
      v.oc.toLowerCase().includes(q) || v.supplier?.toLowerCase().includes(q) || 
      v.carrier_company?.toLowerCase().includes(q)
    );
  }, [searchTerm]);

  const hasLocation = locationName && locationName !== "SIN LOCALIDAD";

  return (
    <div className="relative w-full h-full bg-[#f1f5f9] overflow-hidden">
      <VehicleDetailSidebar vehicle={selectedVehicle} onClose={() => setSelectedVehicle(null)} />

      {hasLocation && (
        <div className="absolute top-6 left-6 z-[1000] w-96">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <Input 
              placeholder="BUSCAR PLACA, CITA, OC, EMPRESA..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-14 pl-12 pr-4 bg-white/95 backdrop-blur shadow-2xl rounded-2xl border-none font-black text-[10px] uppercase tracking-widest focus-visible:ring-2 focus-visible:ring-orange-500 transition-all"
            />
          </div>
        </div>
      )}

      <MapContainer center={centroLocalidad} zoom={14} style={{ height: "100%", width: "100%" }} zoomControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        {hasLocation && (
          <>
            <Circle center={centroLocalidad} radius={RADIUS} pathOptions={{ fillColor: '#fbbf24', fillOpacity: 0.2, color: '#fbbf24', dashArray: '10, 10', weight: 2 }} />
            {filteredVehicles.map(v => {
              const isInside = checkIsInside(v.lat, v.lng);
              return (
                <Marker key={v.id} position={[v.lat, v.lng]} icon={createCustomIcon(v.placa, v.type as any, isInside) as any}>
                  <Popup className="custom-popup">
                    <div className="p-1 min-w-[180px]">
                      <div className="flex justify-between border-b pb-2 mb-2">
                        <span className="text-[9px] font-black text-gray-400 uppercase">Estado:</span>
                        <Badge className={cn("text-[8px] font-black border-none", v.type === 'carga' ? "bg-cyan-100 text-cyan-600" : "bg-orange-100 text-[#ff6b00]")}>
                          {v.type.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="space-y-1 mb-3">
                         <div className="flex justify-between"><span className="text-[9px] font-bold text-gray-400 uppercase">Cita:</span><span className="text-[10px] font-black text-[#1e2b58]">#{v.cita}</span></div>
                         <div className="flex justify-between"><span className="text-[9px] font-bold text-gray-400 uppercase">Documento:</span><span className="text-[10px] font-black text-[#1e2b58]">{v.oc}</span></div>
                      </div>
                      <Button onClick={() => setSelectedVehicle(v)} className="w-full h-8 bg-[#1e2b58] hover:bg-[#ff6b00] text-white text-[9px] font-black uppercase rounded-lg gap-2 transition-all">
                        <Info size={12} /> Ver Expediente
                      </Button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </>
        )}
      </MapContainer>

      <div className="absolute bottom-8 left-8 z-[1000]">
        <div className="bg-[#050038] px-8 py-5 rounded-[2rem] shadow-2xl border border-white/10 flex items-center gap-4">
           <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center"><MapPin className="text-[#ff6b00]" size={28} /></div>
           <div><p className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] mb-0.5">Control Tower Active</p><h4 className="text-white font-black italic uppercase text-xl leading-none">{locationName}</h4></div>
        </div>
      </div>

      <style jsx global>{`
        .custom-div-icon { background: transparent !important; border: none !important; }
        .leaflet-popup-content-wrapper { border-radius: 1.5rem !important; padding: 10px !important; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25) !important; }
        .leaflet-popup-tip-container { display: none; }
      `}</style>
    </div>
  );
}