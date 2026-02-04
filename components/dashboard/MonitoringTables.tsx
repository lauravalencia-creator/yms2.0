"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";



import {
  Download,
  Monitor,
  CalendarRange,
  Truck,
  Package,
  Clock,
  RefreshCcw,
  Filter,
  Check,
  XCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  CheckSquare,
  History,
  CalendarDays,
  CalendarPlus,
  ClipboardList,
  X,
  ArrowRight,
  Plus,
  AlertTriangle,
  Edit,
} from "lucide-react";

export type AppointmentStatus = "pending" | "en_proceso" | "confirmado" | "retrasado" | "completado";
/* --- TIPOS --- */
export interface Appointment {
  idAppointment?: string;
  id: string;
  carrier: string;
  truckId?: string;
  time: string;
  type: "Cargue" | "Descargue";
  status: AppointmentStatus;
  locationId?: string;
  dockGroupId?: string;
  duration?: number;
  driver?: string;
  city?: string;
  department?: string;
  locationName?: string;
  zone?: string;
  date?: string;
  vehicleType?: string;
  loadType?: string;
  operationType?: string;
  product?: string;
  nit?: string;
  quantityOrdered?: number;
  quantityDelivered?: number;
  appointmentIdRef?: string;
  transportCompany?: string;
  loadDate?: string;
  loadTime?: string;
  unloadDate?: string;
  unloadTime?: string;
  driverId?: string;
  driverPhone?: string;
  driverEmail?: string;
  merchandiseCode?: string;
  isReadyForAssignment?: boolean;
  codigoLocalidad?: string;
  tipoLocalidad?: string;
  idTipoProducto?: string;
  idProducto?: string;
  descripcionCompany?: string;
  estadoDocumento?: string;
  unidadNegocio?: string;
  canal?: string;
  tipoOperacion?: string;
  tipoMercancia?: string;
  tipoCargue?: string;
  peso?: string;
  volumen?: string;
  litros?: string;
  codigoArticulo?: string;
  cantidadPedida?: number;
  cantidadRecibida?: number;
  unidadMedida?: string;
  route?: string;
  priority?: string;
  logisticProfile?: string;
  documento?: string;      
  tipoCita?: string;       
  fechaInicial?: string;
  fechaFinal?: string;
  idgenerador?: string;
  generador?: string;
  tipologiavehiculo?: string;
  tiempoprogramadocargue?: string;
  talleres?: string;
  fechaReagendacion?: string,
  horaReagendacion?: string,
  Motivo?: string,
}


interface Dock {
  id: string;
  name: string;
  status: 'available' | 'maintenance' | 'occupied';
  occupancy: number;
}

const STYLES = {
  header: "bg-[#050038] text-white font-bold text-[10px] uppercase px-4 py-3 sticky top-0 z-30 whitespace-nowrap",
  cell: "px-4 py-2 text-[11px] text-slate-600 text-center border-b transition-colors",
  cellBold: "px-4 py-2 text-[11px] text-slate-700 font-bold text-center border-b whitespace-nowrap",
  row: "hover:bg-slate-50 h-12 transition-colors border-none"
};


const DATA_APPOINTMENTS: Appointment[] = [
  {
    id: "1", // Campo obligatorio según tu interfaz
    idAppointment: "APT-1024",
    time: "08:30 AM",
    generador: "Logística del Norte",
    idgenerador: "900.123.456-1",
    carrier: "Transportes Especiales S.A.",
    unidadNegocio: "Consumo",
    status: "en_proceso",
    locationName: "CEDI - Medellín",
    documento: "DOC-88210",
    type: "Cargue",
    truckId: "KKL-990",
    loadTime: "07:45 AM",
    unloadTime: "09:30 AM",
    talleres: "Taller Central",
  },
  {
    id: "2", // Campo obligatorio
    idAppointment: "APT-1025",
    time: "09:00 AM",
    generador: "Alimentos Globales",
    idgenerador: "800.555.222-3",
    carrier: "Express Cargo",
    unidadNegocio: "Frio",
    status: "confirmado",
    locationName: "CEDI - Bogotá",
    documento: "DOC-88211",
    type: "Descargue",
    truckId: "MXC-123",
    loadTime: "08:50 AM",
    unloadTime: "10:15 AM",
    talleres: "N/A",
  },
  {
    id: "3", // Campo obligatorio
    idAppointment: "APT-1026",
    time: "10:30 AM",
    generador: "Industrial S.A.",
    idgenerador: "860.001.002-5",
    carrier: "TransLogist",
    unidadNegocio: "Químicos",
    status: "pending",
    locationName: "CEDI - Cali",
    documento: "DOC-88212",
    type: "Cargue",
    truckId: "RTY-456",
    loadTime: "10:15 AM",
    unloadTime: "11:45 AM",
    talleres: "Taller Sur",
  },
  {
    id: "4", // Campo obligatorio
    idAppointment: "APT-1027",
    time: "11:00 AM",
    generador: "Retail Colombia",
    idgenerador: "901.998.776-4",
    carrier: "Rápido Quindío",
    unidadNegocio: "Retail",
    status: "retrasado",
    locationName: "CEDI - Barranquilla",
    documento: "DOC-88213",
    type: "Descargue",
    truckId: "GGT-789",
    loadTime: "11:30 AM",
    unloadTime: "01:00 PM",
    talleres: "N/A",
  }
];
/* --- DATOS INICIALES --- */
const EDIT_DATA: Appointment[] = [
   { 
    id: "NOTAPRUEBAABI5002", 
    documento: "Documento1",
    carrier: "FERRIAMARILLA S.A.S", 
    nit: "900.742.771-9",
    locationName: "CENTRO DE DISTRIBUCIÓN NORTE", 
    product: "Insumos Industriales",
    codigoArticulo: "ART-001",
    quantityOrdered: 150, 
    quantityDelivered: 50, 
    tipoCita: "Cargue",
    fechaInicial: "2026-01-28",
    fechaFinal: "2026-01-28",
    canal: "MODERNO", 
    unidadNegocio: "Consumo",
    tipoOperacion: "Nacional",
    tipoMercancia: "General",
    estadoDocumento: "Ordenado",
    tipoCargue: "Pallet",
    truckId: "TRK-ANT-001", 
    time: "15:28", 
    type: "Descargue", 
    status: "pending", 
    locationId: "loc-1", 
    date: "2026-01-28", 
    peso: "5,000", 
    operationType: "Descargue", 
    isReadyForAssignment: false, 
    zone: "MEDELLIN_ANT", 
    route: "RUTA SUR-01", 
    priority: "ALTA", 
    logisticProfile: "REFRIGERADO"
  },
  { 
    id: "ABI10200", 
    documento: "Documento2",
    carrier: "DISTRIBUIDORA NACIONAL",
    nit: "860.001.002-4",  
    locationName: "CENTRO DE DISTRIBUCIÓN NORTE", 
    product: "ABARROTES VARIOS", 
    codigoArticulo: "ART-002",
    quantityOrdered: 2400, 
    quantityDelivered: 1200, 
    tipoCita: "Cargue",
     fechaInicial: "2026-01-28",
    fechaFinal: "2026-01-28",
    estadoDocumento: "Ordenado",
    canal: "TRADICIONAL",
    unidadNegocio: "Consumo",
    tipoOperacion: "Nacional",
    tipoMercancia: "General",
    tipoCargue: "Arrume",
    truckId: "TRK-DC-014", 
    time: "08:00", 
    type: "Descargue", 
    status: "pending",
    locationId: "loc-1", 
    date: "2026-01-28", 
    peso: "3,500", 
    operationType: "Descargue", 
    isReadyForAssignment: false, 
    zone: "BOGOTA_DC", 
    route: "NORTE-05", 
    priority: "MEDIA", 
    logisticProfile: "SECA"
  },
];

const DATA_REAGENDADA: Appointment[] = [
  { 
    idAppointment: "324250",
    date: "2026-01-28",
    time: "16:20", 
    type: "Cargue",
    status: "pending", 
    idgenerador: "GEN-005",
    generador: "ALPINA S.A.",
    carrier: "FERRIAMARILLA S.A.S", 
    truckId: "RTY-112", 
    idTipoProducto: "Leche en polvo",
    id: "ABI10205",
    cantidadPedida: 500,
    fechaReagendacion: "2026-01-30",
    horaReagendacion: "10:00",
    Motivo: "Operación logística interna",
    locationName: "CENTRO DE DISTRIBUCIÓN NORTE",
    canal: "MODERNO",
    tipoOperacion: "Local",
    unidadNegocio: "Consumo",
    nit: "900.742.771-9",
    driverId: "43.555.666",
    driver: "JUAN QUINTERO",
    product: "Harina de Maíz",
    tipologiavehiculo: "SENCILLO",
    tiempoprogramadocargue: "30 MINUTOS",
    tipoCargue: "Pallet",
    talleres: "N/A",
    route: "SUR-08",
    priority: "MEDIA",
    logisticProfile: "SECA"
  },
  { 
     idAppointment: "324250",
    date: "2026-01-28",
    time: "16:20", 
    type: "Cargue",
    status: "pending", 
    idgenerador: "GEN-005",
    generador: "ALPINA S.A.",
    carrier: "FERRIAMARILLA S.A.S", 
    truckId: "RTY-112", 
    idTipoProducto: "Leche en polvo",
    id: "ABI10205",
    cantidadPedida: 500,
    fechaReagendacion: "2026-01-30",
    horaReagendacion: "10:00",
    Motivo: "Operación logística interna",
    locationName: "CENTRO DE DISTRIBUCIÓN NORTE",
    canal: "MODERNO",
    tipoOperacion: "Local",
    unidadNegocio: "Consumo",
    nit: "900.742.771-9",
    driverId: "43.555.666",
    driver: "JUAN QUINTERO",
    product: "Harina de Maíz",
    tipologiavehiculo: "SENCILLO",
    tiempoprogramadocargue: "30 MINUTOS",
    tipoCargue: "Pallet",
    talleres: "N/A",
    route: "SUR-08",
    priority: "MEDIA",
    logisticProfile: "SECA"
  },
  { 
       idAppointment: "324250",
    date: "2026-01-28",
    time: "16:20", 
    type: "Cargue",
    status: "pending", 
    idgenerador: "GEN-005",
    generador: "ALPINA S.A.",
    carrier: "FERRIAMARILLA S.A.S", 
    truckId: "RTY-112", 
    idTipoProducto: "Leche en polvo",
    id: "ABI10205",
    cantidadPedida: 500,
    fechaReagendacion: "2026-01-30",
    horaReagendacion: "10:00",
    Motivo: "Operación logística interna",
    locationName: "CENTRO DE DISTRIBUCIÓN NORTE",
    canal: "MODERNO",
    tipoOperacion: "Local",
    unidadNegocio: "Consumo",
    nit: "900.742.771-9",
    driverId: "43.555.666",
    driver: "JUAN QUINTERO",
    product: "Harina de Maíz",
    tipologiavehiculo: "SENCILLO",
    tiempoprogramadocargue: "30 MINUTOS",
    tipoCargue: "Pallet",
    talleres: "N/A",
    route: "SUR-08",
    priority: "MEDIA",
    logisticProfile: "SECA"
  },
  { 
        idAppointment: "324250",
    date: "2026-01-28",
    time: "16:20", 
    type: "Cargue",
    status: "pending", 
    idgenerador: "GEN-005",
    generador: "ALPINA S.A.",
    carrier: "FERRIAMARILLA S.A.S", 
    truckId: "RTY-112", 
    idTipoProducto: "Leche en polvo",
    id: "ABI10205",
    cantidadPedida: 500,
    fechaReagendacion: "2026-01-30",
    horaReagendacion: "10:00",
    Motivo: "Operación logística interna",
    locationName: "CENTRO DE DISTRIBUCIÓN NORTE",
    canal: "MODERNO",
    tipoOperacion: "Local",
    unidadNegocio: "Consumo",
    nit: "900.742.771-9",
    driverId: "43.555.666",
    driver: "JUAN QUINTERO",
    product: "Harina de Maíz",
    tipologiavehiculo: "SENCILLO",
    tiempoprogramadocargue: "30 MINUTOS",
    tipoCargue: "Pallet",
    talleres: "N/A",
    route: "SUR-08",
    priority: "MEDIA",
    logisticProfile: "SECA"
  },
  { 
      idAppointment: "324250",
    date: "2026-01-28",
    time: "16:20", 
    type: "Cargue",
    status: "pending", 
    idgenerador: "GEN-005",
    generador: "ALPINA S.A.",
    carrier: "FERRIAMARILLA S.A.S", 
    truckId: "RTY-112", 
    idTipoProducto: "Leche en polvo",
    id: "ABI10205",
    cantidadPedida: 500,
    fechaReagendacion: "2026-01-30",
    horaReagendacion: "10:00",
    Motivo: "Operación logística interna",
    locationName: "CENTRO DE DISTRIBUCIÓN NORTE",
    canal: "MODERNO",
    tipoOperacion: "Local",
    unidadNegocio: "Consumo",
    nit: "900.742.771-9",
    driverId: "43.555.666",
    driver: "JUAN QUINTERO",
    product: "Harina de Maíz",
    tipologiavehiculo: "SENCILLO",
    tiempoprogramadocargue: "30 MINUTOS",
    tipoCargue: "Pallet",
    talleres: "N/A",
    route: "SUR-08",
    priority: "MEDIA",
    logisticProfile: "SECA"
  },
  { 
        idAppointment: "324250",
    date: "2026-01-28",
    time: "16:20", 
    type: "Cargue",
    status: "pending", 
    idgenerador: "GEN-005",
    generador: "ALPINA S.A.",
    carrier: "FERRIAMARILLA S.A.S", 
    truckId: "RTY-112", 
    idTipoProducto: "Leche en polvo",
    id: "ABI10205",
    cantidadPedida: 500,
    fechaReagendacion: "2026-01-30",
    horaReagendacion: "10:00",
    Motivo: "Operación logística interna",
    locationName: "CENTRO DE DISTRIBUCIÓN NORTE",
    canal: "MODERNO",
    tipoOperacion: "Local",
    unidadNegocio: "Consumo",
    nit: "900.742.771-9",
    driverId: "43.555.666",
    driver: "JUAN QUINTERO",
    product: "Harina de Maíz",
    tipologiavehiculo: "SENCILLO",
    tiempoprogramadocargue: "30 MINUTOS",
    tipoCargue: "Pallet",
    talleres: "N/A",
    route: "SUR-08",
    priority: "MEDIA",
    logisticProfile: "SECA"
  }
];

const EDIT_DATA_table: Appointment[] = [
  {
    id: "inv-1",
    carrier: "Transportes Norte", // Campo obligatorio añadido
    type: "Cargue",              // Campo obligatorio añadido (en lugar de tipoCita)
    locationName: "CENTRO DE DISTRIBUCIÓN NORTE",
    generador: "Proveedor Alimentos SAS",
    date: "2024-05-20",
    time: "07:00 AM",
    idAppointment: "APT-5521",
    status: "pending",
    driverId: "CR-9920",
    documento: "FACT-8821",
    merchandiseCode: "REC-101",
    appointmentIdRef: "RM-001",
  },
  {
    id: "inv-2",
    carrier: "Logística Express",
    type: "Descargue",
    locationName: "CENTRO DE DISTRIBUCIÓN NORTE",
    generador: "Distribuidora Global",
    date: "2024-05-20",
    time: "09:30 AM",
    idAppointment: "APT-5522",
    status: "pending",
    driverId: "CR-9921",
    documento: "FACT-8822",
    merchandiseCode: "REC-102",
    appointmentIdRef: "RM-002",
  },
  {
    id: "inv-3",
    carrier: "TransCarga",
    type: "Cargue",
    locationName: "CENTRO DE DISTRIBUCIÓN NORTE",
    generador: "Manufacturas ABC",
    date: "2024-05-21",
    time: "11:00 AM",
    idAppointment: "APT-5523",
    status: "pending",
    driverId: "CR-9922",
    documento: "FACT-8823",
    merchandiseCode: "REC-103",
    appointmentIdRef: "RM-003",
  },
  {
    id: "inv-4",
    carrier: "Rápido Quindío",
    type: "Descargue",
    locationName: "CENTRO DE DISTRIBUCIÓN NORTE",
    generador: "Logística Express",
    date: "2024-05-21",
    time: "02:00 PM",
    idAppointment: "APT-5524",
    status: "retrasado",
    driverId: "CR-9923",
    documento: "FACT-8824",
    merchandiseCode: "REC-104",
    appointmentIdRef: "RM-004",
  }
];
/* --- HELPERS VISUALES --- */
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "en_proceso": "bg-cyan-50 text-cyan-600 border-cyan-100",
    "confirmado": "bg-indigo-50 text-indigo-600 border-indigo-100",
    "completado": "bg-emerald-50 text-emerald-600 border-emerald-100",
    "retrasado": "bg-rose-50 text-rose-600 border-rose-100",
  };
  return (
    <Badge variant="outline" className={cn("text-[10px] uppercase font-black px-2 py-0.5 rounded-lg border shadow-none", styles[status] || "bg-slate-50")}>
      {status.replace("_", " ")}
    </Badge>
  );
}

const TablePagination = ({ total }: { total: number }) => (
  <div className="px-6 py-3 bg-white border-t flex items-center justify-between shrink-0">
    <div className="text-[10px] text-slate-500 ">
      Mostrando <span className="font-bold text-slate-700">1 - 10</span> de <span className="font-bold text-slate-700">{total}</span>
    </div>
    <div className="flex items-center gap-1">
      <Button variant="outline" size="icon" className="h-7 w-7 rounded-lg border-slate-200"><ChevronLeft className="w-3.5 h-3.5" /></Button>
      <Button className="h-7 w-7 rounded-lg bg-[#1C1E59] text-white text-[10px] font-bold">1</Button>
      <Button variant="outline" size="icon" className="h-7 w-7 rounded-lg border-slate-200"><ChevronRight className="w-3.5 h-3.5" /></Button>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="h-full w-full flex flex-col items-center justify-center bg-slate-50/30 p-12 text-center">
    <div className="bg-slate-50 p-6 rounded-full mb-4 border border-slate-100">
      <Monitor className="w-10 h-10 text-slate-300" />
    </div>
    <h3 className="text-sm font-black text-[#1C1E59] uppercase tracking-tighter ">Selecciona una Localidad</h3>
    <p className="text-[11px] text-slate-400 max-w-xs mx-auto mt-2">Elige una planta para visualizar los datos de monitoreo.</p>
  </div>
);

/* --- COMPONENTE PRINCIPAL --- */
export default function MonitoringTables({ locationId }: { locationId: string | null }) {
const [activeTab, setActiveTab] = useState("appointments");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const tabs = [
    { id: "appointments", label: "Consulta de Citas", icon: CalendarRange },
    { id: "carriers", label: "Control de Citas", icon: Truck },
    { id: "inventory", label: "Editar Información", icon: Package }
  ];

  return (
    <div className="flex h-full w-full bg-white border border-slate-200 rounded-3xl shadow-lg overflow-hidden">
      
      {/* --- BARRA LATERAL IZQUIERDA COMPACTA (NAVY STYLE) --- */}
      <div className="w-16 flex flex-col border-r border-slate-100 bg-slate-50/50 py-4 items-center gap-3 shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            title={tab.label}
            className={cn(
              "relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 group",
              activeTab === tab.id 
                ? "bg-[#1C1E59] text-white shadow-md shadow-indigo-200" 
                : "text-slate-400 hover:bg-white hover:text-[#1C1E59]"
            )}
          >
            <tab.icon className="w-5 h-5" />
            
            {/* Indicador lateral activo pegado al borde */}
            {activeTab === tab.id && (
              <div className="absolute -left-3 w-1 h-6 bg-[#1C1E59] rounded-r-full" />
            )}
          </button>
        ))}
      </div>

            {/* --- MODAL DE FILTROS --- */}
{isFilterOpen && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
      
      {/* Header Naranja */}
      <div className="bg-[#FF6B00] px-5 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <Filter className="w-4 h-4" />
          <span className="font-bold text-sm uppercase tracking-wider">Filtros de Búsqueda</span>
        </div>
        <button 
          onClick={() => setIsFilterOpen(false)}
          className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Cuerpo del Formulario - Padding reducido */}
      <div className="p-5 grid grid-cols-2 gap-4">
        
        {/* Fechas en una fila */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Fecha Inicial</label>
          <input type="date" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
        </div>
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Fecha Final</label>
          <input type="date" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
        </div>

        {/* Campos de ancho completo */}
        <div className="col-span-2 space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Número de Cita</label>
          <input type="text" placeholder="Ej: APT-1024" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
        </div>

        <div className="col-span-2 space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Orden de Compra / Documento</label>
          <input type="text" placeholder="Ingrese el número de documento" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">NIT Proveedor</label>
          <input type="text" placeholder="Nit sin puntos" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
        </div>

        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">NIT Transportista</label>
          <input type="text" placeholder="Nit empresa" className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
        </div>

        <div className="col-span-2 space-y-1.5">
          <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Nombre del Proveedor</label>
          <input type="text" placeholder="Buscar por nombre..." className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-orange-500 outline-none transition-all" />
        </div>
      </div>

      {/* Footer con Acciones */}
      <div className="bg-slate-50 px-5 py-4 flex items-center justify-end gap-3 border-t border-slate-100">
        <Button 
          variant="ghost" 
          onClick={() => setIsFilterOpen(false)}
          className="text-slate-500 text-xs font-bold hover:bg-slate-200 rounded-xl px-6"
        >
          CANCELAR
        </Button>
        <Button 
          className="bg-[#FF6B00] hover:bg-orange-600 text-white text-xs font-bold px-8 rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-95"
          onClick={() => setIsFilterOpen(false)}
        >
          APLICAR FILTROS
        </Button>
      </div>
    </div>
  </div>
)}

      {/* --- ÁREA DE CONTENIDO (DERECHA) --- */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Toolbar superior compacto */}
        <div className="h-12 border-b border-slate-100 flex items-center justify-between px-6 bg-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#1C1E59] ">
              {tabs.find(t => t.id === activeTab)?.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button disabled={!locationId} variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
              <RefreshCcw className="w-3.5 h-3.5"/>
            </Button>
            <Button disabled={!locationId} variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
              <Download className="w-3.5 h-3.5"/>
            </Button>
            <Button 
            disabled={!locationId} 
            variant="ghost" 
            size="icon" 
            className={cn("h-8 w-8 transition-colors", isFilterOpen ? "text-[#FF6B00] bg-orange-50" : "text-slate-400")}
            onClick={() => setIsFilterOpen(true)}
          >
            <Filter className="w-3.5 h-3.5"/>
          </Button>
          </div>
        </div>

        <div className="flex-1 p-3 bg-slate-50/30 overflow-hidden flex flex-col">
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            {!locationId ? (
              <EmptyState />
            ) : (
              <div className="flex-1 overflow-auto custom-scrollbar">
               
               
{activeTab === "appointments" && (
  <div className="w-full overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
    <Table>
      <TableHeader className="bg-[#1C1E59] sticky top-0 z-30">
        <TableRow className="border-none h-10">
          {[
            "Cita", "Hora de la Cita", "Proveedor", "Nit Proveedor", 
            "Empresa de Transporte", "Gen", "Estado de la cita", 
            "Localidad", "Documento", "Flujo", "Placas", 
            "Entrada", "Salida", "Talleres"
          ].map((h) => (
            <TableHead key={h} className="text-white font-bold text-[9px] uppercase px-4 whitespace-nowrap text-center">
              {h}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {DATA_APPOINTMENTS.map((apt) => (
          <TableRow key={apt.id} className="hover:bg-slate-50 border-b border-slate-100 h-12 transition-colors">
            
            {/* Cita */}
            <TableCell className="px-4 text-center font-bold text-[#1C1E59] text-[10px]">
              {apt.idAppointment}
            </TableCell>

            {/* Hora */}
            <TableCell className="px-4 text-center text-slate-600 text-[10px] whitespace-nowrap">
              <Clock className="inline w-3 h-3 mr-1 text-slate-400 mb-0.5" />
              {apt.time}
            </TableCell>

            {/* Proveedor */}
            <TableCell className="px-4 text-center text-slate-700 text-[10px] font-medium uppercase whitespace-nowrap">
              {apt.generador}
            </TableCell>

            {/* Nit */}
            <TableCell className="px-4 text-center text-slate-600 text-[10px]">
              {apt.idgenerador}
            </TableCell>

            {/* Empresa Transporte */}
            <TableCell className="px-4 text-center text-slate-600 text-[10px] whitespace-nowrap">
              {apt.carrier}
            </TableCell>

            {/* Gen (Unidad Negocio) */}
            <TableCell className="px-4 text-center text-slate-600 text-[10px]">
              {apt.unidadNegocio}
            </TableCell>

            {/* Estado (Único con Badge) */}
            <TableCell className="px-4 text-center">
              <div className="flex justify-center">
                <Badge className={cn(
                  "text-[9px] px-2 py-0.5 font-bold uppercase border shadow-none rounded-md",
                  apt.status === "en_proceso" && "bg-blue-50 text-blue-700 border-blue-200",
                  apt.status === "confirmado" && "bg-green-50 text-green-700 border-green-200",
                  apt.status === "pending" && "bg-amber-50 text-amber-700 border-amber-200",
                  apt.status === "retrasado" && "bg-red-50 text-red-700 border-red-200"
                )}>
                  {apt.status?.replace("_", " ")}
                </Badge>
              </div>
            </TableCell>

            {/* Localidad */}
            <TableCell className="px-4 text-center text-slate-600 text-[10px] whitespace-nowrap">
              {apt.locationName}
            </TableCell>

            {/* Documento */}
            <TableCell className="px-4 text-center text-slate-600 text-[10px]">
              {apt.documento}
            </TableCell>

            {/* Flujo (Texto simple) */}
            <TableCell className="px-4 text-center text-slate-600 text-[10px] font-bold">
              {apt.type}
            </TableCell>

            {/* Placas (Texto simple) */}
            <TableCell className="px-4 text-center text-slate-700 text-[10px] font-bold uppercase">
              {apt.truckId}
            </TableCell>

            {/* Entrada (Sin italic) */}
            <TableCell className="px-4 text-center text-slate-600 text-[10px]">
              {apt.loadTime}
            </TableCell>

            {/* Salida (Sin italic) */}
            <TableCell className="px-4 text-center text-slate-600 text-[10px]">
              {apt.unloadTime}
            </TableCell>

            {/* Talleres */}
            <TableCell className="px-4 text-center text-slate-600 text-[10px]">
              {apt.talleres}
            </TableCell>

          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
)}

               {activeTab === "carriers" && (
  <div className="w-full overflow-x-auto rounded-lg shadow-sm border border-slate-200">
    <Table>
      <TableHeader className="bg-[#050038]">
        <TableRow className="border-none">
          {/* Mapeo de Cabeceras */}
          {[
            "Acciones", "Número de Cita", "Tipo de Cita", "Fecha cita", "Hora cita", 
            "Estado de Cita", "Localidad", "Documento", "Canal", "Tipo de operación", 
            "Unidad Negocio", "Identificación Generador", "Generador / Cliente", 
            "ID Empresa Transporte", "Empresa Transporte", "Placas", "ID Conductor", 
            "Conductor", "Producto", "Tipología", "Tiempo Prog.", "Tipo Cargue", "Talleres"
          ].map((h) => (
            <TableHead key={h} className={STYLES.header}>
              {h}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {DATA_REAGENDADA.map((apt) => (
          <TableRow key={apt.idAppointment} className={STYLES.row}>
            {/* Acciones */}
            <TableCell className={STYLES.cell}>
              <div className="flex justify-center">
                <Button 
                  className="h-8 w-8 bg-[#FF6B00] hover:bg-orange-600 text-white rounded-lg shadow-md transition-transform active:scale-95"
                  size="icon"
                >
                  <RefreshCcw className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>

            {/* Datos Principales */}
            <TableCell className={STYLES.cellBold}>{apt.idAppointment}</TableCell>
            <TableCell className={STYLES.cell}>{apt.type}</TableCell>
            <TableCell className={STYLES.cell}>{apt.date}</TableCell>
            <TableCell className={STYLES.cell}>{apt.time}</TableCell>
            
            {/* Estado con Badge */}
            <TableCell className={STYLES.cell}>
              <Badge className={cn(
                "text-[9px] px-2 py-0.5 font-semibold capitalize border shadow-sm",
                apt.status === "pending" 
                  ? "bg-amber-50 text-amber-700 border-amber-200" 
                  : "bg-blue-50 text-blue-700 border-blue-200"
              )}>
                {apt.status.replace("_", " ")}
              </Badge>
            </TableCell>

            {/* Resto de Columnas (Usando el estilo base) */}
            <TableCell className={STYLES.cell}>{apt.locationName}</TableCell>
            <TableCell className={STYLES.cell}>{apt.id}</TableCell>
            <TableCell className={`${STYLES.cell} whitespace-nowrap`}>{apt.canal}</TableCell>
            <TableCell className={`${STYLES.cell} whitespace-nowrap`}>{apt.operationType}</TableCell>
            <TableCell className={`${STYLES.cell} whitespace-nowrap`}>{apt.unidadNegocio}</TableCell>
            <TableCell className={STYLES.cell}>{apt.idgenerador}</TableCell>
            <TableCell className={`${STYLES.cell} whitespace-nowrap`}>{apt.generador}</TableCell>
            <TableCell className={STYLES.cell}>{apt.nit}</TableCell>
            <TableCell className={`${STYLES.cell} whitespace-nowrap`}>{apt.carrier}</TableCell>
            <TableCell className={STYLES.cell}>{apt.truckId || "—"}</TableCell>
            <TableCell className={STYLES.cell}>{apt.driverId}</TableCell>
            <TableCell className={`${STYLES.cell} whitespace-nowrap`}>{apt.driver}</TableCell>
            <TableCell className={`${STYLES.cell} whitespace-nowrap`}>{apt.product}</TableCell>
            <TableCell className={STYLES.cell}>{apt.tipologiavehiculo}</TableCell>
            <TableCell className={STYLES.cell}>{apt.tiempoprogramadocargue}</TableCell>
            <TableCell className={STYLES.cell}>{apt.tipoCargue || "N/A"}</TableCell>
            <TableCell className={STYLES.cell}>{apt.talleres}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
)}

               {activeTab === "inventory" && (
  <div className="w-full overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
    <Table>
      <TableHeader className="bg-[#050038] sticky top-0 z-30">
        <TableRow className="border-none h-10">
          <TableHead className="w-10 text-center">
            {/* Checkbox Header opcional */}
          </TableHead>
          {[
            "Localidad", "Proveedor", "Fecha Cita", "Hora Cita", 
            "Tipo de Cita", "Cita", "Estado", "#Credencial", 
            "Documentos", "#Recepción", "Recibo Maestro", "Editar"
          ].map((h) => (
            <TableHead key={h} className="text-white font-bold text-[9px] uppercase px-3 text-center whitespace-nowrap">
              {h}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {EDIT_DATA_table.map((apt) => (
          <TableRow key={apt.id} className="hover:bg-slate-50 border-b h-12 transition-colors">
            {/* Checkbox */}
            <TableCell className="text-center p-2">
              <input type="checkbox" className="accent-[#FF6B00] cursor-pointer w-3.5 h-3.5" />
            </TableCell>

            {/* Datos Centrados y Unificados */}
            <TableCell className="px-3 text-[10px] text-slate-600 text-center font-medium">{apt.locationName}</TableCell>
            <TableCell className="px-3 text-[10px] text-slate-700 text-center font-bold uppercase whitespace-nowrap">{apt.generador}</TableCell>
            <TableCell className="px-3 text-[10px] text-slate-600 text-center">{apt.date}</TableCell>
            <TableCell className="px-3 text-[10px] text-slate-600 text-center">{apt.time}</TableCell>
            <TableCell className="px-3 text-[10px] text-slate-600 text-center">{apt.tipoCita}</TableCell>
            <TableCell className="px-3 text-[10px] text-[#050038] text-center font-bold">{apt.idAppointment}</TableCell>
            
            {/* Estado con Badge */}
            <TableCell className="px-3">
              <div className="flex justify-center">
                <Badge className={cn(
                  "text-[9px] px-2 py-0.5 font-bold uppercase border shadow-none",
                  apt.status === "en_proceso" && "bg-blue-50 text-blue-700 border-blue-200",
                  apt.status === "confirmado" && "bg-green-50 text-green-700 border-green-200",
                  apt.status === "pending" && "bg-amber-50 text-amber-700 border-amber-200",
                  apt.status === "retrasado" && "bg-red-50 text-red-700 border-red-200"
                )}>
                  {apt.status?.replace("_", " ")}
                </Badge>
              </div>
            </TableCell>

            <TableCell className="px-3 text-[10px] text-slate-600 text-center font-mono">{apt.driverId}</TableCell>
            <TableCell className="px-3 text-[10px] text-slate-600 text-center">{apt.documento}</TableCell>
            <TableCell className="px-3 text-[10px] text-slate-600 text-center">{apt.merchandiseCode}</TableCell>
            <TableCell className="px-3 text-[10px] text-slate-600 text-center">{apt.appointmentIdRef}</TableCell>

            {/* Botón Editar Navy */}
            <TableCell className="px-3 text-center">
              <div className="flex justify-center">
                <Button 
                  className="h-8 w-8 bg-[#050038] hover:bg-[#0a054d] text-white rounded-lg shadow-md transition-all active:scale-95"
                  size="icon"
                >
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
)}

              </div>
            )}
            {locationId && <TablePagination total={45} />}
          </div>
        </div>
      </div>
    </div>
  );
}