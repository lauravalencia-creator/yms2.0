"use client";

import React, { useState, useMemo, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { cn } from "@/lib/utils"; 
import { 
  Search, MapPin, Truck, CheckCircle2, 
  Building2, Calendar, Clock, 
  User, AlertTriangle, FileText, Hash,
  Scale, Droplets, Box, Phone, Anchor, ArrowRightLeft,
  Timer, BarChart3, LogOut, Package, ChevronDown
} from "lucide-react";// Nota: Asegúrate que sea lucide-react
import { 
  Search as SearchIcon, MapPin as MapPinIcon, ChevronDown as ChevronDownIcon 
} from "lucide-react"; 
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

// --- CONFIGURACIÓN DE LOCALIDADES ---
const LOCATIONS = [
  { id: "loc-1", name: "CEDI NORTE (BELLO)", coords: [6.333, -75.552] as [number, number] },
  { id: "loc-2", name: "CEDI SUR (ITAGÜÍ)", coords: [6.172, -75.606] as [number, number] },
  { id: "loc-3", name: "PLANTA ORIENTE (RIONEGRO)", coords: [6.154, -75.374] as [number, number] },
];

// --- LÓGICA DE ESTADOS Y COLORES UNIFICADA ---
const getStatusConfig = (status: string) => {
  switch (status) {
    case 'EN SITIO':
      return { 
        color: '#10b981', 
        text: 'CITA CUMPLIDA', 
        bgClass: 'bg-emerald-500 hover:bg-emerald-600' 
      }; // Verde
    case 'ATRASADO':
      return { 
        color: '#f59e0b', 
        text: 'RETRASO EN CITA', 
        bgClass: 'bg-amber-500 hover:bg-amber-600' 
      }; // Amarillo
    default:
      return { 
        color: '#94a3b8', 
        text: 'A TIEMPO / EN CAMINO', 
        bgClass: 'bg-slate-400 hover:bg-slate-500' 
      }; // Gris
  }
};

// --- PIN REDISEÑADO (FLECHAS) ---
const createCustomIcon = (placa: string, type: 'carga' | 'descarga', status: string, isInside: boolean) => {
  if (typeof window === "undefined") return null;

  const config = getStatusConfig(status);
  const color = isInside ? config.color : '#94a3b8';
  const label = isInside ? config.text : 'FUERA DE RANGO';
  
  const arrowSvg = type === 'carga' 
    ? `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>`;

  return L.divIcon({
    className: "custom-div-icon",
    html: `
      <div style="display: flex; flex-direction: column; align-items: center; width: 140px; transform: translateX(-43%);">
        ${isInside ? `
          <div style="background: ${color}; color: white; padding: 1px 8px; border-radius: 20px; font-size: 8px; font-weight: 900; text-transform: uppercase; margin-bottom: 2px; border: 1.5px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); white-space: nowrap; z-index: 10;">
            ${label}
          </div>
        ` : ''}
        <div style="background: #050038; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 900; border: 1.5px solid rgba(255,255,255,0.2); white-space: nowrap; box-shadow: 0 4px 8px rgba(0,0,0,0.3); text-transform: uppercase;">
          ${placa}
        </div>
        <div style="position: relative; width: 32px; height: 32px; margin-top: 4px;">
            <div style="background: ${color}; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; border: 2px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
                <div style="transform: rotate(45deg); width: 18px; height: 18px;">
                    ${arrowSvg}
                </div>
            </div>
        </div>
      </div>
    `,
    iconSize: [140, 80],
    iconAnchor: [20, 80],
  });
};

function RecenterMap({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => { map.setView(coords, 14, { animate: true }); }, [coords, map]);
  return null;
}



function VehiclePopupContent({ vehicle }: { vehicle: any }) {
  const statusConfig = getStatusConfig(vehicle.status);

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
            <h3 className="text-base font-black  uppercase tracking-tighter flex items-center gap-2">
               Detalles de la Cita <span className="text-[#ff6b00]">#{vehicle.cita}</span>
            </h3>
            <div className="flex items-center gap-3 text-[10px] text-white/70 font-bold uppercase tracking-wider">
               <span className="flex items-center gap-1"> {vehicle.dock}</span>
               <span className="w-px h-3 bg-white/20"></span>
               <span className="flex items-center gap-1"><FileText size={11} /> {vehicle.oc}</span>
            </div>
        </div>
        <div className="flex flex-col items-end gap-1">
            <Badge className={cn("text-[9px] font-black border-none px-2 py-0.5", vehicle.type === 'carga' ? "bg-cyan-500" : "bg-[#ff6b00]")}>
                {vehicle.type.toUpperCase()}
            </Badge>
            <Badge className={cn("text-[9px] font-black border-none px-2 py-0.5 text-white shadow-sm", statusConfig.bgClass)}>
                {statusConfig.text}
            </Badge>
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
          <Field label="Litros Totales" value={vehicle.liters} icon={Droplets} />
           <Field label="Cant. Solicitada" value={vehicle.qty_req} icon={ArrowRightLeft} />
          <Field label="Cant. Entregada" value={vehicle.qty_del} icon={CheckCircle2} />

            {/* SECCIÓN NUEVA: CÓDIGOS DE SEGUIMIENTO */}
          <SectionTitle>Monitoreo y Seguimiento</SectionTitle>
          <div className="col-span-full flex flex-wrap gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
            {vehicle.tracking_codes && vehicle.tracking_codes.length > 0 ? (
                vehicle.tracking_codes.map((code: string, index: number) => (
                    <div key={index} className="flex items-center gap-2 bg-white border border-slate-200 px-2 py-1 rounded shadow-sm group hover:border-[#ff6b00] transition-colors">
                        <Timer size={10} className="text-slate-400 group-hover:text-[#ff6b00]" />
                        <span className="text-[10px] font-black text-[#050038] tracking-tighter">{code}</span>
                    </div>
                ))
            ) : (
                <span className="text-[10px] font-bold text-slate-400  px-2">Sin códigos registrados</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}



export default function VehicleMap() {
  const [activeLoc, setActiveLoc] = useState(LOCATIONS[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const RADIUS = 800;

 // --- DATOS MOCK CON TODOS LOS CAMPOS COMPLETADOS ---
  const vehiculos = [
    { 
      id: 1, 
      placa: "CCC009", 
      cita: "3381589", 
      oc: "OC-88921", 
      dock: "MUELLE NORTE 01", 
      type: 'descarga', 
      status: 'EN SITIO', 
      client: 'ALIMENTOS EL SOL S.A.S', 
      supplier: 'PROVEEDORA GLOBAL LTDA',
      driver: 'JUAN PEREZ ACEVEDO', 
      driver_id: '1.020.455.890',
      driver_phone: '310 455 6677',
      carrier_company: 'TRANSPORTES PEREZ & CO',
      weight: '4,500 KG',
      volume: '12.5 M3',
      liters: 'N/A',
      load_type: 'PALLETIZADO', 
      product_type: 'ALIMENTOS SECOS', 
      qty_req: '100 UN', 
      qty_del: '40 UN',
      receipt: 'REC-12345-A', 
      request_user: 'CARLOS LOPEZ (LOGÍSTICA)',
      entry_time: '29/01/2026 07:45 AM',
      exit_time: 'EN PROCESO',
      est_time: '120 MIN',
      progress: '40%',
      tracking_codes: ['GPS-992', 'SAT-001', 'NFC-22'],
      lat: 6.334, 
      lng: -75.553, 
      date: '29/01/2026', 
      time: '08:00 AM'
    },
    { 
      id: 2, 
      placa: "GTR554", 
      cita: "3381601", 
      oc: "OC-4005", 
      dock: "MUELLE SUR 05", 
      type: 'carga', 
      status: 'ATRASADO', 
      client: 'TECNOLOGIA AVANZADA SAS', 
      supplier: 'FABRICA CENTRAL DE CHIPS',
      driver: 'MARIA GONZALEZ RUIZ', 
      driver_id: '71.344.555',
      driver_phone: '300 123 4455',
      carrier_company: 'LOGÍSTICA EXPRESS NACIONAL',
      weight: '2,100 KG',
      volume: '8.0 M3',
      liters: 'N/A',
      load_type: 'A GRANEL', 
      product_type: 'COMPONENTES ELECTRÓNICOS', 
      qty_req: '200 UN', 
      qty_del: '200 UN',
      receipt: 'REC-99821-B', 
      request_user: 'MARTHA RUIZ (COMPRAS)',
      entry_time: '29/01/2026 11:15 AM',
      exit_time: '29/01/2026 12:30 PM',
      est_time: '45 MIN',
      progress: '100%',
      tracking_codes: ['XYZ-123', 'BC-882'],
      lat: 6.332, 
      lng: -75.551, 
      date: '29/01/2026', 
      time: '09:30 AM' 
    },
    { 
      id: 3, 
      placa: "TNK990", 
      oc: "OC-9988", 
      cita: "3381777", 
      dock: "MUELLE LÍQUIDOS 02", 
      type: 'descarga', 
      status: 'FUERA DE LOCALIDAD', 
      client: 'QUIMICOS DEL VALLE LTDA', 
      supplier: 'REFINERÍA DEL SUR',
      driver: 'PEDRO PABLO MONTOYA', 
      driver_id: '8.900.111',
      driver_phone: '320 999 8877',
      carrier_company: 'SERVI-TANQUES S.A.',
      weight: '10,000 KG',
      volume: 'N/A',
      liters: '8,500 L',
      load_type: 'CISTERNA / TANQUE', 
      product_type: 'QUÍMICOS INDUSTRIALES', 
      qty_req: '600 UND', 
      qty_del: '0 UND',
      receipt: 'PENDIENTE', 
      request_user: 'SISTEMA AUTOMÁTICO',
      entry_time: 'SIN REGISTRO',
      exit_time: 'SIN REGISTRO',
      est_time: '180 MIN',
      progress: '0%',
      tracking_codes: ['LIQ-88', 'ISO-TANK-9'],
      lat: 6.315, 
      lng: -75.545, 
      date: '29/01/2026', 
      time: '08:00 AM'
    },
  ];

  const filteredVehicles = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return vehiculos.filter(v => 
      v.placa.toLowerCase().includes(q) || v.cita.toLowerCase().includes(q) || v.oc.toLowerCase().includes(q)
    );
  }, [searchTerm]);

  return (
    <div className="relative w-full h-full bg-[#f1f5f9] overflow-hidden">
      <div className="absolute top-6 left-6 z-[1000] flex flex-col gap-3">
        <Popover>
          <PopoverTrigger asChild>
            <button className="h-14 px-6 bg-[#050038] hover:bg-[#0a0050] text-white rounded-2xl shadow-2xl flex items-center gap-3 transition-all border border-white/10">
              <MapPinIcon className="text-[#ff6b00]" size={20} />
              <div className="text-left">
                <p className="text-[8px] font-black text-white/40 uppercase tracking-widest leading-none">Localidad Activa</p>
                <p className="text-xs font-black uppercase tracking-tight">{activeLoc.name}</p>
              </div>
              <ChevronDownIcon size={16} className="ml-2 opacity-50" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-72 p-2 bg-white rounded-2xl shadow-2xl border-none">
            <div className="flex flex-col gap-1">
              {LOCATIONS.map(loc => (
                <button
                  key={loc.id}
                  onClick={() => setActiveLoc(loc)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl transition-all text-left",
                    activeLoc.id === loc.id ? "bg-orange-50 text-orange-600" : "hover:bg-slate-50 text-slate-600"
                  )}
                >
                  <Building2 size={16} />
                  <span className="text-[10px] font-black uppercase">{loc.name}</span>
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <div className="relative group w-[450px]">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#ff6b00]" size={18} />
          <Input 
            placeholder="BUSCAR: PLACA, CITA, OC..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="h-14 pl-12 pr-4 bg-white/95 backdrop-blur shadow-2xl rounded-2xl border-none font-black text-[10px] uppercase tracking-widest"
          />
        </div>
      </div>

      <MapContainer center={activeLoc.coords} zoom={14} style={{ height: "100%", width: "100%" }} zoomControl={false}>
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        <RecenterMap coords={activeLoc.coords} />
        <Circle center={activeLoc.coords} radius={RADIUS} pathOptions={{ fillColor: '#fbbf24', fillOpacity: 0.1, color: '#fbbf24', dashArray: '10, 10', weight: 2 }} />
        {filteredVehicles.map(v => {
          const isInside = L.latLng(activeLoc.coords).distanceTo([v.lat, v.lng]) <= RADIUS;
          return (
            <Marker key={v.id} position={[v.lat, v.lng]} icon={createCustomIcon(v.placa, v.type as any, v.status, isInside) as any}>
              <Popup className="custom-popup-large">
                <VehiclePopupContent vehicle={v} />
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      <style jsx global>{`
        .custom-popup-large .leaflet-popup-content-wrapper {
          width: 750px !important; padding: 0; border-radius: 12px; overflow: hidden;
          box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.4);
        }
        .custom-popup-large .leaflet-popup-content { width: 750px !important; margin: 0 !important; }
        .leaflet-div-icon { background: transparent !important; border: none !important; }
      `}</style>
    </div>
  );
}

// Botón simple reutilizado
function Button({ className, ...props }: any) {
  return <button className={cn("inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50", className)} {...props} />;
}

const RADIUS = 800;