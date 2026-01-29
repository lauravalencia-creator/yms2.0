"use client";

import React, { useState, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils"; 
import { 
  Search, MapPin, Truck, CheckCircle2, 
  Building2, Calendar, Clock, 
  User, ShieldCheck, FileText, Hash,
  Scale, Droplets, Box, Phone, Anchor, ArrowRightLeft,
  Timer, BarChart3, LogOut, Package
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// --- PIN PREMIUM (ICONO PERSONALIZADO) ---
const createCustomIcon = (placa: string, type: 'carga' | 'descarga', isInside: boolean) => {
  if (typeof window === "undefined") return null;

  const arrowIcon = type === 'carga' 
    ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#4CCAC8" stroke-width="4"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>`
    : `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#FF6C01" stroke-width="4"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>`;

  return L.divIcon({
    className: "custom-div-icon",
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; width: 140px; transform: translateX(-43%);">
        <div style="background: #050038; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 900; border: 1.5px solid rgba(255,255,255,0.2); white-space: nowrap; box-shadow: 0 4px 8px rgba(0,0,0,0.3); text-transform: uppercase; z-index: 3;">
          ${placa}
        </div>
        ${isInside ? `<div style="background: #10b981; color: white; padding: 1px 6px; border-radius: 3px; font-size: 8px; font-weight: 900; text-transform: uppercase; margin-top: 1px; margin-bottom: -3px; border: 1px solid rgba(255,255,255,0.3); z-index: 4;">EN SITIO</div>` : ''}
        <div style="position: relative; width: 40px; height: 55px; filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2)); margin-top: 2px;">
          <svg width="40" height="55" viewBox="0 0 32 45" fill="none">
            <path d="M16 0C7.16344 0 0 7.16344 0 16C0 26 16 45 16 45C16 45 32 26 32 16C32 7.16344 24.8366 0 16 0Z" fill="#ff6b00"/>
            <circle cx="16" cy="16" r="11" fill="white"/>
          </svg>
          <div style="position: absolute; top: -4px; right: -4px; background: white; border-radius: 50%; width: 18px; height: 18px; display: flex; align-items: center; justify-content: center; border: 1.5px solid #050038; z-index: 5;">
            ${arrowIcon}
          </div>
          <div style="position: absolute; top: 16px; left: 20px; transform: translate(-50%, -50%); color: #050038;">
             <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M1 3h15v13H1z"></path><path d="M16 8h4l3 3v5h-7V8z"></path><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
          </div>
        </div>
      </div>
    `,
    iconSize: [140, 95],
    iconAnchor: [20, 85],
  });
};

// --- CONTENIDO DEL POPUP (SIN CAMBIOS VISUALES) ---
function VehiclePopupContent({ vehicle }: { vehicle: any }) {
  const Field = ({ label, value, icon: Icon, className = "" }: any) => (
    <div className={cn("flex flex-col py-2 px-2 hover:bg-slate-50 transition-colors rounded-md group", className)}>
      <div className="flex items-center gap-1.5 mb-1 opacity-60 group-hover:opacity-100 transition-opacity">
        {Icon && <Icon size={11} className="text-[#ff6b00]" />}
        <span className="text-[9px] font-black text-gray-500 uppercase tracking-wide truncate">{label}</span>
      </div>
      <span className="text-[11px] font-bold text-[#1e2b58] leading-tight truncate" title={String(value)}>{value || '---'}</span>
    </div>
  );

  const SectionTitle = ({ children }: { children: React.ReactNode }) => (
    <div className="col-span-full border-b border-gray-100 mt-3 mb-1 pb-1 flex items-center gap-2">
      <div className="w-1 h-3 bg-[#1e2b58] rounded-full"></div>
      <h4 className="text-[10px] font-black text-[#1e2b58] uppercase tracking-widest">{children}</h4>
    </div>
  );

  return (
    <div className="flex flex-col w-full h-full bg-white font-sans text-left">
      <div className="bg-[#050038] p-4 text-white shrink-0 sticky top-0 z-20 shadow-sm flex justify-between items-start">
        <div className="flex flex-col gap-1">
            <h3 className="text-base font-black italic uppercase tracking-tighter flex items-center gap-2">
               Detalles de la Cita <span className="text-[#ff6b00]">#{vehicle.cita}</span>
            </h3>
            <div className="flex items-center gap-3 text-[10px] text-white/70 font-bold uppercase tracking-wider">
               <span className="flex items-center gap-1"><Anchor size={11} className="text-[#4CCAC8]"/> {vehicle.dock}</span>
               <span className="w-px h-3 bg-white/20"></span>
               <span className="flex items-center gap-1"><FileText size={11} /> {vehicle.oc}</span>
            </div>
        </div>
        <div className="flex flex-col items-end gap-1">
             <Badge className={cn("text-[9px] font-black border-none px-2 py-0.5", vehicle.type === 'carga' ? "bg-cyan-500 text-white" : "bg-[#ff6b00] text-white")}>
                {vehicle.type.toUpperCase()}
            </Badge>
            <span className="text-[9px] font-bold text-emerald-400 flex items-center gap-1">
               <CheckCircle2 size={11} /> {vehicle.status}
            </span>
        </div>
      </div>

      <div className="p-4 overflow-y-auto max-h-[500px] custom-scrollbar"> 
        <div className="grid grid-cols-4 gap-x-2 gap-y-1">
          <SectionTitle>Datos de la Cita</SectionTitle>
          <Field label="Número Cita" value={vehicle.cita} icon={Hash} />
          <Field label="Tipo de Cita" value={vehicle.type === 'carga' ? 'CARGUE' : 'DESCARGUE'} icon={ArrowRightLeft} />
          <Field label="Fecha Cita" value={vehicle.date} icon={Calendar} />
          <Field label="Hora Cita" value={vehicle.time} icon={Clock} />
          <Field label="Recibo Maestro" value={vehicle.receipt} icon={FileText} />
          <Field label="Usuario Solicitante" value={vehicle.request_user} icon={User} />
          <Field label="Documento" value={vehicle.oc} icon={FileText} className="col-span-2" />

          <SectionTitle>Actores</SectionTitle>
          <Field label="Generador / Cliente" value={vehicle.client} icon={Building2} className="col-span-2" />
          <Field label="Proveedor" value={vehicle.supplier} icon={Building2} className="col-span-2" />
          <Field label="Usuario Registro" value="SISTEMA" icon={User} />

          <SectionTitle>Vehículo y Conductor</SectionTitle>
          <Field label="Placa Vehículo" value={vehicle.placa} icon={Truck} />
          <Field label="Empresa Transp." value={vehicle.carrier_company} icon={Building2} />
          <Field label="ID Conductor" value={vehicle.driver_id} icon={FileText} />
          <Field label="Celular" value={vehicle.driver_phone} icon={Phone} />
          <Field label="Nombre Conductor" value={vehicle.driver} icon={User} className="col-span-2" />

          <SectionTitle>Operación Logística</SectionTitle>
          <Field label="Tipo de Cargue" value={vehicle.load_type} icon={Package} />
          <Field label="Tipo Producto" value={vehicle.product_type} icon={Box} />
          <Field label="Peso Total" value={vehicle.weight} icon={Scale} />
          <Field label="Volumen Total" value={vehicle.volume} icon={Box} />
          <Field label="Litros Totales" value={vehicle.liters} icon={Droplets} />
          <Field label="Cant. Solicitada" value={vehicle.qty_req} icon={ArrowRightLeft} />
          <Field label="Cant. Entregada" value={vehicle.qty_del} icon={CheckCircle2} />

          <SectionTitle>Tiempos y Progreso</SectionTitle>
          <Field label="Fecha/Hora Ingreso" value={vehicle.entry_time} icon={Clock} className="col-span-2" />
          <Field label="Fecha/Hora Salida" value={vehicle.exit_time} icon={LogOut} className="col-span-2" />
          <Field label="Tiempo Estimado" value={vehicle.est_time} icon={Timer} />
          <Field label="% Cargue/Descargue" value={vehicle.progress} icon={BarChart3} />
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
           <div className="flex items-center gap-2 mb-2">
              <MapPin size={12} className="text-[#ff6b00]" />
              <h4 className="text-[10px] font-black text-[#1e2b58] uppercase tracking-widest">Códigos GPS Adicionales de Ingreso</h4>
           </div>
           <div className="flex flex-wrap gap-2">
              {vehicle.tracking_codes && vehicle.tracking_codes.length > 0 ? vehicle.tracking_codes.map((code: string) => (
                <div key={code} className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md shadow-sm text-[10px] font-bold font-mono text-[#1e2b58] flex items-center gap-2 uppercase">
                  {code}
                </div>
              )) : <span className="text-[10px] text-gray-400 italic">No hay códigos registrados</span>}
           </div>
        </div>
      </div>
    </div>
  );
}

export default function VehicleMap({ locationName }: { locationName: string }) {
  const [searchTerm, setSearchTerm] = useState("");
  const centroLocalidad: [number, number] = [6.333, -75.552];
  const RADIUS = 800;

  // --- DATOS MOCK ---
  const vehiculos = [
    { 
      id: 1, 
      placa: "CCC009", 
      oc: "OC-88921", 
      cita: "3381589", 
      dock: "MUELLE NORTE 01",
      type: 'descarga', 
      date: '29/01/2026',
      time: '10:00 AM',
      request_user: 'J.PEREZ',
      receipt: 'REC-00123',
      client: 'ALIMENTOS EL SOL S.A.S',
      driver_id: '10203040',
      driver: 'JUAN PEREZ', 
      driver_phone: '3001234567',
      carrier_company: 'TRANSPORTES ABC', 
      load_type: 'PALLET',
      product_type: 'PERECEDEROS',
      weight: '4,500 KG',
      liters: 'N/A',
      volume: '12 M3',
      tracking_codes: ['GPS-992', 'SAT-001'],
      entry_time: '29/01/2026 09:45 AM',
      progress: '45%',
      est_time: '45 MIN',
      qty_req: '500 UN',
      qty_del: '250 UN',
      exit_time: '---',
      status: 'EN SITIO',
      supplier: 'SOLA S.A.', 
      business_unit: 'CEDI NORTE', 
      lat: 6.334, 
      lng: -75.553 
    },
    { 
      id: 2, 
      placa: "GTR554", 
      oc: "OC-4005", 
      cita: "3381601", 
      dock: "MUELLE SUR 05",
      type: 'carga', 
      date: '29/01/2026',
      time: '11:30 AM',
      request_user: 'M.RODRIGUEZ',
      receipt: 'REC-00124',
      client: 'TECNOLOGIA LTDA',
      driver_id: '98765432',
      driver: 'MARIA GONZALEZ', 
      driver_phone: '3109876543',
      carrier_company: 'RAPIDO OCHOA', 
      load_type: 'ARRUME',
      product_type: 'ELECTRONICA',
      weight: '2,100 KG',
      liters: 'N/A',
      volume: '8 M3',
      tracking_codes: ['XYZ-123'], // ESTE CÓDIGO SE BUSCARÁ
      entry_time: '29/01/2026 11:15 AM',
      progress: '10%',
      est_time: '60 MIN',
      qty_req: '1200 UN',
      qty_del: '120 UN',
      exit_time: '---',
      status: 'EN SITIO',
      supplier: 'TECNOLOGIA LTDA', 
      business_unit: 'LOGISTICA CENTRAL', 
      lat: 6.332, 
      lng: -75.551 
    },
    { 
      id: 3, 
      placa: "TNK990", 
      oc: "OC-9988", 
      cita: "3381777", 
      dock: "MUELLE 02",
      type: 'descarga', 
      date: '29/01/2026',
      time: '08:00 AM',
      request_user: 'L.GOMEZ',
      receipt: 'REC-00125',
      client: 'QUIMICOS DEL VALLE',
      driver_id: '77665544',
      driver: 'PEDRO PABLO', 
      driver_phone: '3201112233',
      carrier_company: 'SERVIENTREGA', 
      load_type: 'A GRANEL',
      product_type: 'LIQUIDOS',
      weight: '10,000 KG',
      liters: '8,500 L',
      volume: 'N/A',
      tracking_codes: ['LIQ-88', 'ISO-TANK-2'],
      entry_time: '29/01/2026 07:50 AM',
      progress: '90%',
      est_time: '120 MIN',
      qty_req: '8500 L',
      qty_del: '8000 L',
      exit_time: '---',
      status: 'EN SITIO',
      supplier: 'FRUTAS FRESCAS', 
      business_unit: 'CEDI SUR', 
      lat: 6.315, 
      lng: -75.545 
    },
  ];

  // --- LÓGICA DE BÚSQUEDA CORREGIDA (INCLUYE TRACKING CODES) ---
  const filteredVehicles = useMemo(() => {
    if (!searchTerm) return vehiculos;
    const q = searchTerm.toLowerCase();
    
    return vehiculos.filter(v => 
      v.placa.toLowerCase().includes(q) ||                     
      v.cita.toLowerCase().includes(q) ||                      
      v.oc.toLowerCase().includes(q) ||                        
      v.driver?.toLowerCase().includes(q) ||                   
      v.carrier_company?.toLowerCase().includes(q) ||          
      v.supplier?.toLowerCase().includes(q) ||
      // NUEVA LÍNEA PARA BUSCAR EN EL ARRAY DE CÓDIGOS
      v.tracking_codes?.some(code => code.toLowerCase().includes(q))
    );
  }, [searchTerm, vehiculos]);

  const hasLocation = locationName && locationName !== "SIN LOCALIDAD";

  return (
    <div className="relative w-full h-full bg-[#f1f5f9] overflow-hidden">
      
      {hasLocation && (
        <div className="absolute top-6 left-6 z-[1000] w-[500px]">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff6b00]" size={18} />
            <Input 
              placeholder="BUSCAR: PLACA, CITA, OC, CONDUCTOR, EMPRESA, TRACKING..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-14 pl-12 pr-4 bg-white/95 backdrop-blur shadow-2xl rounded-2xl border-none font-black text-[10px] uppercase tracking-widest focus-visible:ring-2 focus-visible:ring-orange-500 transition-all placeholder:text-gray-300"
            />
          </div>
        </div>
      )}

      <MapContainer center={centroLocalidad} zoom={13} style={{ height: "100%", width: "100%" }} zoomControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        
        {hasLocation && (
          <>
            <Circle center={centroLocalidad} radius={RADIUS} pathOptions={{ fillColor: '#fbbf24', fillOpacity: 0.1, color: '#fbbf24', dashArray: '10, 10', weight: 2 }} />
            {filteredVehicles.map(v => {
              const isInside = L.latLng(centroLocalidad).distanceTo([v.lat, v.lng]) <= RADIUS;
              return (
                <Marker 
                  key={v.id} 
                  position={[v.lat, v.lng]} 
                  icon={createCustomIcon(v.placa, v.type as any, isInside) as any}
                >
                  <Popup className="custom-popup-large" closeButton={true}>
                    <VehiclePopupContent vehicle={v} />
                  </Popup>
                </Marker>
              );
            })}
          </>
        )}
      </MapContainer>

      <div className="absolute bottom-8 left-8 z-[1000]">
        {hasLocation && (
          <div className="bg-[#050038] px-8 py-5 rounded-[2rem] shadow-2xl border border-white/10 flex items-center gap-4 animate-in slide-in-from-bottom-10">
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10"><MapPin className="text-[#ff6b00]" size={28} /></div>
            <div><p className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] mb-0.5">Localidad Seleccionada</p><h4 className="text-white font-black italic uppercase text-xl leading-none">{locationName}</h4></div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-popup-large .leaflet-popup-content-wrapper {
          width: 750px !important;
          min-width: 750px !important;
          max-width: 95vw;
          padding: 0;
          border-radius: 12px;
          overflow: hidden;
          background: transparent;
          box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.4);
        }
        .custom-popup-large .leaflet-popup-content {
          width: 750px !important; 
          margin: 0 !important;
        }
        .leaflet-popup-tip {
          background: white;
        }
        .leaflet-popup-close-button {
          color: white !important;
          top: 15px !important;
          right: 15px !important;
          font-size: 18px !important;
          opacity: 0.8;
        }
        .leaflet-popup-close-button:hover {
          opacity: 1;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
}