"use client";

import React, { useState, useMemo } from "react";
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
  FileText,
  CheckSquare,
  XCircle,
  History,
  CalendarRange,
  CalendarDays,
  RefreshCcw,
  Filter,
  ChevronLeft,
  ChevronRight,
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

/* --- DATOS INICIALES --- */
const INITIAL_SOLICITUDES: Appointment[] = [
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


const DATA_CONFIRMADOS: Appointment[] = [
  { 
    idAppointment: "324245",
    type: "Cargue",
    date: "2026-01-28",
    time: "15:28", 
    status: "pending", 
    locationName: "CENTRO DE DISTRIBUCIÓN NORTE",
    id: "NOTAPRUEBAABI5002",
    canal: "MODERNO",
    tipoOperacion: "Nacional",
    unidadNegocio: "Consumo",
    idgenerador: "GEN-001",
    generador: "ALIMENTOS POLAR",
    nit: "900.742.771-9",
    carrier: "FERRIAMARILLA S.A.S", 
    truckId: "TRK-ANT-001",
    driverId: "1.020.455.890",
    driver: "SARA PEREZ",
    product: "Insumos Industriales",
    tipologiavehiculo: "TURBO",
    tiempoprogramadocargue: "30 MINUTOS",
    tipoCargue: "Pallet",
    talleres: "N/A",
    route: "RUTA SUR-01",
    priority: "ALTA",
    logisticProfile: "REFRIGERADO"
  },
  { 
    idAppointment: "324246",
    type: "Descargue",
    date: "2026-01-28",
    time: "08:30", 
    status: "confirmado", 
    locationName: "CENTRO DE DISTRIBUCIÓN NORTE",
    id: "ABI10201",
    canal: "TRADICIONAL",
    tipoOperacion: "Local",
    unidadNegocio: "Hogar",
    idgenerador: "GEN-002",
    generador: "PROCTER & GAMBLE",
    nit: "860.001.222-5",
    carrier: "LOGISTICA EXPRESS", 
    truckId: "JRT-123",
    driverId: "71.223.445",
    driver: "CARLOS RUIZ",
    product: "Limpieza",
    tipologiavehiculo: "SENCILLO",
    tiempoprogramadocargue: "45 MINUTOS",
    tipoCargue: "Arrume",
    talleres: "N/A",
    route: "NORTE-05",
    priority: "MEDIA",
    logisticProfile: "SECA"
  },
  { 
    idAppointment: "324247",
    type: "Cargue",
    date: "2026-01-28",
    time: "10:00", 
    status: "en_proceso", 
    locationName: "BODEGA PRINCIPAL SUR",
    id: "ABI10202",
    canal: "MODERNO",
    tipoOperacion: "Exportación",
    unidadNegocio: "Café",
    idgenerador: "GEN-003",
    generador: "COLCAFÉ S.A.S",
    nit: "890.102.345-1",
    carrier: "TRANSPORTES ANDINOS", 
    truckId: "KLY-554",
    driverId: "1.033.456.789",
    driver: "ANDRES FELIPE",
    product: "Café Molido",
    tipologiavehiculo: "MINIMULA",
    tiempoprogramadocargue: "60 MINUTOS",
    tipoCargue: "Pallet",
    talleres: "SÍ",
    route: "PUERTO-02",
    priority: "ALTA",
    logisticProfile: "ALIMENTOS"
  },
  { 
    idAppointment: "324248",
    type: "Descargue",
    date: "2026-01-28",
    time: "11:15", 
    status: "retrasado", 
    locationName: "CENTRO DE DISTRIBUCIÓN NORTE",
    id: "ABI10203",
    canal: "E-COMMERCE",
    tipoOperacion: "Nacional",
    unidadNegocio: "Electrónica",
    idgenerador: "GEN-004",
    generador: "SAMSUNG LOGISTICS",
    nit: "900.555.444-2",
    carrier: "RAPIDO CARGO", 
    truckId: "MXZ-987",
    driverId: "98.765.432",
    driver: "MARTHA LÓPEZ",
    product: "Televisores LED",
    tipologiavehiculo: "TURBO",
    tiempoprogramadocargue: "40 MINUTOS",
    tipoCargue: "premezclas",
    talleres: "N/A",
    route: "ORIENTE-10",
    priority: "BAJA",
    logisticProfile: "VALOR"
  },
  { 
    idAppointment: "324249",
    type: "Cargue",
    date: "2026-01-28",
    time: "13:45", 
    status: "completado", 
    locationName: "BODEGA ORIENTE",
    id: "ABI10204",
    canal: "MODERNO",
    tipoOperacion: "Local",
    unidadNegocio: "Consumo",
    idgenerador: "GEN-001",
    generador: "ALIMENTOS POLAR",
    nit: "900.742.771-9",
    carrier: "FERRIAMARILLA S.A.S", 
    truckId: "TRK-ANT-002",
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
    type: "Cargue",
    date: "2026-01-28",
    time: "16:20", 
    status: "pending", 
    locationName: "CENTRO DE DISTRIBUCIÓN NORTE",
    id: "ABI10205",
    canal: "MODERNO",
    tipoOperacion: "Nacional",
    unidadNegocio: "Lácteos",
    idgenerador: "GEN-005",
    generador: "ALPINA S.A.",
    nit: "860.002.555-8",
    carrier: "FRIO CARGO", 
    truckId: "RTY-112",
    driverId: "1.010.222.333",
    driver: "DIEGO TORRES",
    product: "Yogures",
    tipologiavehiculo: "TURBO",
    tiempoprogramadocargue: "25 MINUTOS",
    tipoCargue: "Arrume",
    talleres: "N/A",
    route: "BOG-CENTRO",
    priority: "ALTA",
    logisticProfile: "REFRIGERADO"
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
    truckId: "RTY-112", // Se agregó porque era obligatorio
    idTipoProducto: "Leche en polvo",
    id: "ABI10205",
    cantidadPedida: 500,
    fechaReagendacion: "2026-01-30",
    horaReagendacion: "10:00",
    Motivo: "Operación logística interna",
  },
  { 
    idAppointment: "324251",
    date: "2026-01-28",
    time: "09:00", 
    type: "Descargue",
    status: "retrasado", 
    idgenerador: "GEN-006",
    generador: "NESTLÉ COLOMBIA",
    carrier: "TRANSPORTES VALLE", 
    truckId: "VLL-445",
    idTipoProducto: "Cacao",
    id: "ABI10206",
    cantidadPedida: 1200,
    fechaReagendacion: "2026-01-29",
    horaReagendacion: "07:30",
    Motivo: "Falla mecánica del vehículo",
  },
  { 
    idAppointment: "324252",
    date: "2026-01-28",
    time: "11:00", 
    type: "Cargue",
    status: "en_proceso", 
    idgenerador: "GEN-001",
    generador: "ALIMENTOS POLAR",
    carrier: "FERRIAMARILLA S.A.S", 
    truckId: "TRK-ANT-001",
    idTipoProducto: "Harina",
    id: "ABI10207",
    cantidadPedida: 800,
    fechaReagendacion: "2026-01-29",
    horaReagendacion: "14:00",
    Motivo: "Cierre de vías principal",
  },
  { 
    idAppointment: "324253",
    date: "2026-01-28",
    time: "14:30", 
    type: "Descargue",
    status: "pending", 
    idgenerador: "GEN-008",
    generador: "POSTOBON S.A.",
    carrier: "LOGISTICA CARGO", 
    truckId: "ABC-998",
    idTipoProducto: "Envases",
    id: "ABI10208",
    cantidadPedida: 3000,
    fechaReagendacion: "2026-01-31",
    horaReagendacion: "08:00",
    Motivo: "Falta de espacio en bodega",
  },
  { 
    idAppointment: "324254",
    date: "2026-01-28",
    time: "07:00", 
    type: "Cargue",
    status: "confirmado", 
    idgenerador: "GEN-010",
    generador: "COLGATE-PALMOLIVE",
    carrier: "EXPRESS LOGISTICS", 
    truckId: "COL-123",
    idTipoProducto: "Cuidado Personal",
    id: "ABI10209",
    cantidadPedida: 150,
    fechaReagendacion: "2026-01-29",
    horaReagendacion: "11:30",
    Motivo: "Documentación incompleta",
  },
  { 
    idAppointment: "324255",
    date: "2026-01-28",
    time: "15:45", 
    type: "Descargue",
    status: "pending", 
    idgenerador: "GEN-012",
    generador: "UNILEVER",
    carrier: "RAPIDO NACIONAL", 
    truckId: "XYZ-777",
    idTipoProducto: "Detergentes",
    id: "ABI10210",
    cantidadPedida: 2200,
    fechaReagendacion: "2026-01-30",
    horaReagendacion: "16:00",
    Motivo: "Error en la orden de compra",
  }
];

// Mock de muelles para el modal
const MOCK_DOCKS: Dock[] = [
  { id: "1", name: "Muelle 01", status: "available", occupancy: 0 },
  { id: "2", name: "Muelle 02", status: "available", occupancy: 40 },
  { id: "3", name: "Muelle 03", status: "maintenance", occupancy: 0 },
];

/* --- MODAL 1: SOLICITUD (DETALLES DE ENTREGA) --- */
function RequestAppointmentModal({ 
  appointments, 
  onClose, 
  onContinue 
}: { 
  appointments: Appointment[], 
  onClose: () => void, 
  onContinue: (data: any) => void 
}) {
  const [quantities, setQuantities] = useState<{ [key: string]: number }>(() => {
    const initial: { [key: string]: number } = {};
    appointments.forEach(apt => {
      initial[apt.id] = (apt.quantityOrdered || 0) - (apt.quantityDelivered || 0);
    });
    return initial;
  });

  const groupedByCarrier = useMemo(() => {
    const groups: { [key: string]: Appointment[] } = {};
    appointments.forEach(apt => {
      if (!groups[apt.carrier]) groups[apt.carrier] = [];
      groups[apt.carrier].push(apt);
    });
    return groups;
  }, [appointments]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-2">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl overflow-hidden flex flex-col border border-slate-300 max-h-[95vh]">
        
        {/* HEADER PRINCIPAL - AGREGADO CONTADOR TOTAL */}
        <div className="flex items-center justify-between px-5 py-3 bg-[#1C1E59] text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-1.5 rounded-lg">
              <ClipboardList className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-black uppercase tracking-widest">Detalles de entrega</h3>
                <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-black border border-white/10 text-orange-400">
                  {appointments.length} DOCUMENTOS SELECCIONADOS
                </span>
              </div>
    
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-1.5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTENIDO CON BLOQUES - ESPACIADO REDUCIDO */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-100/50 space-y-4 custom-scrollbar">
          
          {Object.entries(groupedByCarrier).map(([carrier, items]) => (
            <div key={carrier} className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              
              {/* BANNER DE PROVEEDOR - PADDING REDUCIDO */}
              <div className="bg-slate-50 border-b border-slate-200 px-4 py-2">
                <div className="flex flex-wrap items-center gap-x-8 gap-y-1">
                  <div className="min-w-[150px]">
                    <span className="text-[7px] font-black text-slate-400 uppercase block leading-none mb-1">Generador de carga</span>
                    <span className="text-[10px] font-black text-[#1C1E59] uppercase">{carrier}</span>
                  </div>
                  <div>
                    <span className="text-[7px] font-black text-slate-400 uppercase block leading-none mb-1">Id Generador de carga</span>
                    <span className="text-[10px] font-bold text-slate-600 font-mono">{items[0].nit}</span>
                  </div>
                  <div className="flex-1">
                    <span className="text-[7px] font-black text-slate-400 uppercase block leading-none mb-1">Localidad</span>
                    <span className="text-[10px] font-bold text-[#1C1E59] uppercase">{items[0].locationName}</span>
                  </div>
                </div>
              </div>

              {/* TABLA DE DETALLES - PADDING REDUCIDO */}
              <div className="overflow-x-auto">
                <table className="w-full table-fixed border-collapse">
                  <thead>
                    <tr className="bg-white border-b border-slate-100">
                      <th className="w-[15%] px-4 py-2 text-[8px] font-black text-slate-400 uppercase text-left tracking-widest"># Documento</th>
                      <th className="w-[12%] px-4 py-2 text-[8px] font-black text-slate-400 uppercase text-left tracking-widest">Producto</th>
                      <th className="w-[33%] px-4 py-2 text-[8px] font-black text-slate-400 uppercase text-left tracking-widest">Descripción Artículo</th>
                      <th className="w-[10%] px-4 py-2 text-[8px] font-black text-slate-400 uppercase text-right tracking-widest">Cantidad ordenada</th>
                      <th className="w-[10%] px-4 py-2 text-[8px] font-black text-slate-400 uppercase text-right tracking-widest">Cantidad entregada</th>
                      <th className="w-[20%] px-4 py-2 text-[8px] font-black text-orange-600 uppercase text-center tracking-widest bg-orange-50/30">Cantidad a entregar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {items.map((doc) => (
                      <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-2 text-[10px] font-black text-[#1C1E59]">{doc.id}</td>
                        <td className="px-4 py-2 text-[9px] font-bold text-slate-500 font-mono">{doc.codigoArticulo || "---"}</td>
                        <td className="px-4 py-2 text-[9px] font-bold text-slate-600 uppercase truncate" title={doc.product}>{doc.product}</td>
                        <td className="px-4 py-2 text-[10px] font-black text-slate-400 text-right">{doc.quantityOrdered}</td>
                        <td className="px-4 py-2 text-[10px] font-black text-emerald-600 text-right">{doc.quantityDelivered || 0}</td>
                        <td className="px-4 py-1.5 bg-orange-50/10">
                          <div className="flex justify-center">
                            <input 
                              type="number"
                              className="w-full max-w-[90px] h-7 text-center text-[10px] font-black border-2 border-slate-200 rounded-lg focus:border-orange-500 outline-none transition-all text-[#1C1E59] bg-white"
                              value={quantities[doc.id]}
                              onChange={(e) => setQuantities({...quantities, [doc.id]: Number(e.target.value)})}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              
            </div>
          ))}

        </div>

        {/* FOOTER GENERAL - REDUCIDO */}
        <div className="px-6 py-3 flex justify-end items-center gap-4 bg-white border-t border-slate-200">
          <button onClick={onClose} className="text-[9px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest transition-colors">
            Cancelar Operación
          </button>
          <Button 
            className="bg-[#FF6C01] hover:bg-[#e66000] text-white font-black px-8 h-9 rounded-xl shadow-lg shadow-orange-200 transition-all hover:scale-[1.02] active:scale-95 uppercase text-[10px] tracking-widest flex items-center gap-2"
            onClick={() => onContinue({ items: appointments, quantities })}
          >
            Continuar a Cita <ArrowRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}

/* --- MODAL 2: CREACIÓN (DATOS DE TRANSPORTE) --- */
function CreateAppointmentModal({ 
  selectedItems, 
  suggestedDock, 
  onClose, 
  onConfirm,
  availableDocks = [] 
}: { 
  selectedItems: any[], 
  suggestedDock: string, 
  onClose: () => void, 
  onConfirm: (updatedData: any) => void,
  availableDocks?: Dock[]
}) {
  const baseItem = selectedItems[0];

  const [selectedDockId, setSelectedDockId] = useState(suggestedDock);

  const carriers = ["FERRIAMARILLA S.A.S", "DISTRIBUIDORA NACIONAL", "LOGISTICA EXPRESS"];
  const drivers = [
    { name: "SARA PEREZ", id: "1.020.455.890", phone: "310 455 6677", email: "yuliana@transporte.com" },
    { name: "CARLOS RUIZ", id: "71.344.555", phone: "300 123 4455", email: "cruiz@logistica.com" },
    { name: "PEDRO NEL", id: "8.900.111", phone: "320 999 8877", email: "pedronel@envios.com" }
  ];

  const [isManualCarrier, setIsManualCarrier] = useState(false);
  const [isManualDriver, setIsManualDriver] = useState(false);
  const [selectedDock, setSelectedDock] = useState(suggestedDock);
  const [formErrors, setFormErrors] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    appointmentId: "4006038",
    transportCompany: carriers[0],
    loadType: "BULTOS",
    vehicleType: "TURBO",
    unloadTime: "30 MINUTOS",
    loadDate: "2026-01-28",
    loadTime: "15:28",
    driver: drivers[0].name,
    driverId: drivers[0].id,
    driverPhone: drivers[0].phone,
    truckId: baseItem.truckId === "---" ? "TRK-ANT-001" : baseItem.truckId,
    comments: ""
  });



  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors.includes(field)) {
      setFormErrors(prev => prev.filter(item => item !== field));
    }
  };

  const handleDriverSelect = (name: string) => {
    const driverObj = drivers.find(d => d.name === name);
    if (driverObj) {
      setFormData(prev => ({
        ...prev,
        driver: driverObj.name,
        driverId: driverObj.id,
        driverPhone: driverObj.phone
      }));
    }
  };

  const handleFinalCreate = () => {
    const errors = [];
    if (!formData.transportCompany || formData.transportCompany.trim() === "") errors.push("transportCompany");
    if (!formData.loadType || formData.loadType === "") errors.push("loadType");
    if (!formData.vehicleType || formData.vehicleType === "") errors.push("vehicleType");
    if (!formData.loadDate || formData.loadDate === "") errors.push("loadDate");
    if (!formData.loadTime || formData.loadTime === "") errors.push("loadTime");

    if (errors.length > 0) {
      setFormErrors(errors);
      return; // Detiene la ejecución y NO cierra el modal
    }

   onConfirm({
      ...formData,
      items: selectedItems,
      assignedDockId: selectedDockId, 
      locationName: baseItem.locationName,
      status: "scheduled",
      type: baseItem.type,
      carrier: formData.transportCompany,
      time: formData.loadTime
    });
  };

  const labelClass = "text-[9px] font-black text-slate-500 uppercase pr-4 text-right bg-[#F8FAFC] border-r border-slate-200 w-48 shrink-0 flex items-center justify-end leading-tight";
  const cellClass = "flex border-b border-slate-200 min-h-[40px]";
  const inputClass = "flex-1 px-4 text-[10px] font-bold text-indigo-900 outline-none focus:bg-orange-50/30 uppercase transition-colors";
  const selectClass = "flex-1 px-4 text-[10px] font-bold text-indigo-900 outline-none bg-transparent cursor-pointer uppercase";
  const cellLabelClass = "bg-slate-50 border border-slate-200 px-4 py-2 text-[9px] font-black text-slate-500 uppercase flex items-center w-1/4";
  const cellValueClass = "bg-white border border-slate-200 px-4 py-2 text-[10px] font-bold text-slate-700 flex items-center w-1/4";
  
  // Estilo de error más agresivo
  const errorStyle = "bg-red-50 ring-2 ring-red-500 ring-inset z-10";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-300 animate-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between px-6 py-3 bg-[#1C1E59] text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-1.5 rounded-lg shadow-lg">
              <ClipboardList className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-widest ">Detalles de la cita</h3>
          </div>
          <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-full transition-all text-white/70 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 space-y-5 custom-scrollbar">
          
          {/* Alerta de error si el formulario es inválido */}
          {formErrors.length > 0 && (
            <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-[10px] font-bold uppercase flex items-center gap-2 animate-bounce">
              <AlertTriangle size={14} /> Faltan campos obligatorios por completar (*)
            </div>
          )}

          <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <div className="grid grid-cols-2">
              <div className={cellClass}>
                <span className={labelClass}>LOCALIDAD:</span>
                <span className="flex-1 px-4 text-[9px] font-black text-slate-500 flex items-center truncate uppercase ">{baseItem.locationName}</span>
              </div>
              <div className={cellClass}>
                <span className={labelClass}>NÚMERO DE LA CITA:</span>
                <input className={cn(inputClass, "text-slate-400 font-normal")} value={formData.appointmentId} onChange={(e)=>handleChange('appointmentId', e.target.value)} />
              </div>

              <div className={cellClass}>
                <span className={labelClass}>CITA EMPRESA DE TRANSPORTE:</span>
                <div className="flex-1 px-4 flex items-center">
                  <input type="checkbox" checked className="w-4 h-4 accent-blue-600 rounded cursor-pointer" readOnly />
                </div>
              </div>
              
              <div className={cn(cellClass, formErrors.includes("transportCompany") && errorStyle)}>
                <span className={labelClass}>EMPRESA DE TRANSPORTE:*</span>
                <div className="flex-1 flex items-center pr-3">
                  {!isManualCarrier ? (
                    <select 
                      className={selectClass} 
                      value={formData.transportCompany} 
                      onChange={(e) => handleChange('transportCompany', e.target.value)}
                    >
                      <option value="">SELECCIONE...</option>
                      {carriers.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  ) : (
                    <input className={inputClass} autoFocus placeholder="ESCRIBIR EMPRESA..." value={formData.transportCompany} onChange={(e)=>handleChange('transportCompany', e.target.value)} />
                  )}
                  <button onClick={() => {setIsManualCarrier(!isManualCarrier); if(!isManualCarrier) handleChange('transportCompany', '')}} className="text-orange-500 hover:scale-110 transition-transform">
                    <Plus size={18} strokeWidth={3} />
                  </button>
                </div>
              </div>

              <div className={cn(cellClass, formErrors.includes("loadType") && errorStyle)}>
                <span className={labelClass}>TIPO DE CARGUE:*</span>
                <select className={selectClass} value={formData.loadType} onChange={(e)=>handleChange('loadType', e.target.value)}>
                  <option value="">SELECCIONE...</option>
                  <option value="BULTOS">BULTOS</option><option value="GRANEL">GRANEL</option><option value="PALLETS">PALLETS</option>
                </select>
              </div>
              <div className={cn(cellClass, formErrors.includes("vehicleType") && errorStyle)}>
                <span className={labelClass}>TIPOLOGÍA DE VEHÍCULO:*</span>
                <select className={selectClass} value={formData.vehicleType} onChange={(e)=>handleChange('vehicleType', e.target.value)}>
                  <option value="">SELECCIONE...</option>
                  <option value="TURBO">TURBO</option><option value="SENCILLO">SENCILLO</option><option value="TRACTOMULA">TRACTOMULA</option>
                </select>
              </div>
              
              <div className={cn(cellClass, formErrors.includes("loadDate") && errorStyle)}>
                <span className={labelClass}>FECHA DE LA CITA:*</span>
                <input type="date" className={inputClass} value={formData.loadDate} onChange={(e)=>handleChange('loadDate', e.target.value)} />
              </div>
              <div className={cn(cellClass, formErrors.includes("loadTime") && errorStyle)}>
                <span className={labelClass}>HORA DE LA CITA:*</span>
                <input type="time" className={inputClass} value={formData.loadTime} onChange={(e)=>handleChange('loadTime', e.target.value)} />
              </div>

              <div className={cellClass}>
                <span className={labelClass}>PLACAS:</span>
                <input className={cn(inputClass, "tracking-widest font-black text-orange-600")} value={formData.truckId} onChange={(e)=>handleChange('truckId', e.target.value)} />
              </div>
              <div className={cellClass}>
                <span className={labelClass}>TIEMPO ESTIMADO CARGUE/DESCARGUE:</span>
                <input className={inputClass} value={formData.unloadTime} onChange={(e)=>handleChange('unloadTime', e.target.value)} />
              </div>

              <div className="col-span-2 flex border-b border-slate-200 min-h-[120px]">
                <div className={cn(labelClass, "min-h-[120px]")}>CONDUCTOR:</div>
                <div className="flex-1 flex flex-col">
                  <div className="flex-1 flex border-b border-slate-100 items-center">
                    <span className="text-[8px] font-black text-slate-400 w-40 text-right pr-4 uppercase">Nombre:</span>
                    {!isManualDriver ? (
                      <select className={selectClass} value={formData.driver} onChange={(e) => handleDriverSelect(e.target.value)}>
                        {drivers.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                      </select>
                    ) : (
                      <input className={inputClass} autoFocus placeholder="NOMBRE COMPLETO..." value={formData.driver} onChange={(e)=>handleChange('driver', e.target.value)} />
                    )}
                    <button onClick={() => {setIsManualDriver(!isManualDriver); if(!isManualDriver) { handleChange('driver', ''); handleChange('driverId', ''); handleChange('driverPhone', '')}}} className="text-orange-500 mx-3 hover:scale-110 transition-transform">
                      <Plus size={18} strokeWidth={3} />
                    </button>
                  </div>
                  <div className="flex-1 flex border-b border-slate-100 items-center">
                    <span className="text-[8px] font-black text-slate-400 w-40 text-right pr-4 uppercase">Identificación:</span>
                    <input className={inputClass} readOnly={!isManualDriver} value={formData.driverId} onChange={(e)=>handleChange('driverId', e.target.value)} />
                  </div>
                  <div className="flex-1 flex items-center">
                    <span className="text-[8px] font-black text-slate-400 w-40 text-right pr-4 uppercase">Número de contacto:</span>
                    <input className={inputClass} readOnly={!isManualDriver} value={formData.driverPhone} onChange={(e)=>handleChange('driverPhone', e.target.value)} />
                   
                  </div>
                </div>
              </div>

              <div className="col-span-2 flex min-h-[60px]">
                <span className={cn(labelClass, "min-h-[60px]")}>OBSERVACIONES:</span>
                <textarea className="flex-1 p-3 text-[10px] font-medium outline-none resize-none uppercase" rows={2} value={formData.comments} onChange={(e)=>handleChange('comments', e.target.value)} />
              </div>
            </div>
          </div>

           {/* LISTA DOCUMENTOS VINCULADOS */}
          <div className="space-y-4">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">Documentos vinculados:</span>
            {selectedItems.map((doc) => (
              <div key={doc.id} className="bg-white rounded-lg overflow-hidden shadow-sm border border-slate-200">
                <div className="bg-[#F8FAFC] px-4 py-2 border-b border-slate-200 flex justify-between items-center">
                   <span className="text-[10px] font-black text-[#1C1E59]">DOCUMENTO: {doc.id}</span>
                </div>
                <div className="flex flex-col">
                  {/* FILA 1 */}
                  <div className="flex w-full">
                    <div className={cellLabelClass}>Muelle sugerido</div>
                    <div className={cellValueClass}>
                      <select 
                        value={selectedDockId} 
                        onChange={(e) => setSelectedDockId(e.target.value)}
                        className="w-full bg-transparent outline-none cursor-pointer text-blue-600 font-black border-b border-blue-200 hover:border-blue-500"
                      >
                        {/* Filtramos muelles que NO estén en mantenimiento y pertenezcan a la localidad */}
                        {availableDocks
                          .filter(d => d.status !== 'maintenance')
                          .map(dock => (
                            <option key={dock.id} value={dock.id}>
                              {dock.name} {dock.occupancy > 0 ? `(${dock.occupancy}%)` : '(Libre)'}
                            </option>
                          ))
                        }
                      </select>
                    </div>
                    <div className={cellLabelClass}>Mercancía</div>
                    <div className={cellValueClass}>{doc.merchandiseCode || "900030"}</div>
                  </div>
                  {/* FILA 2 */}
                  <div className="flex w-full">
                    <div className={cellLabelClass}>Cantidad a entregar</div>
                    <div className={cellValueClass}>{doc.quantityToDeliver || doc.quantityOrdered || "0"}</div>
                    <div className={cellLabelClass}>Tipo de mercancía</div>
                    <div className={cellValueClass}>{doc.tipoMercancia || "No Alimentos"}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-8 py-4 flex flex-col items-center gap-3 bg-white border-t border-slate-100 shrink-0">
          <div className="flex justify-center gap-4 w-full">
            <Button 
              className="bg-[#FF6C01] hover:bg-[#e66000] text-white font-black px-10 h-10 rounded-xl uppercase text-[10px] shadow-lg transition-all active:scale-95 flex items-center gap-2"
              onClick={handleFinalCreate}
            >
              Confirmar cITA <ArrowRight size={14} />
            </Button>
            <Button variant="outline" className="border-slate-200 text-slate-400 font-black px-10 h-10 rounded-xl uppercase text-[10px] hover:bg-slate-50 transition-all active:scale-95" onClick={onClose}>
              Cancelar
            </Button>
          </div>
          <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
            Al confirmar, se enviarán notificaciones automáticas al conductor, empresa de transporte y proveedor vía correo electrónico.
          </span>
        </div>
      </div>
    </div>
  );
}


/* --- COMPONENTE PRINCIPAL --- */
export default function ManagementTables({ locationId }: { locationId: string | null }) {
  const [activeTab, setActiveTab] = useState("solicitudes");
   const [isFilterOpen, setIsFilterOpen] = useState(false); // <--- 1. ESTADO NUEVO

  // ESTADOS PARA FLUJO DE MODALES
  const [step, setStep] = useState(0); // 0: Cerrado, 1: Paso 1, 2: Paso 2
  const [selectedData, setSelectedData] = useState<any>(null);

  const tabs = [
    { id: "solicitudes", label: "Solicitud de Citas", icon: FileText },
    { id: "programadas", label: "Confirmación", icon: CheckSquare },
    { id: "cancelacion", label: "Cancelación", icon: XCircle },
    { id: "reagendamiento", label: "Reagendar", icon: History },
    { id: "recurrencia", label: "Recurrencia de Citas", icon: CalendarRange },
  ];

    // ESTADOS PARA FLUJO DE MODALES
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedItemsForModal, setSelectedItemsForModal] = useState<Appointment[]>([]);
  const [dataFromStep1, setDataFromStep1] = useState<any>(null);

  const handleOpenFlow = (apt: Appointment) => {
    setSelectedItemsForModal([apt]);
    setIsRequestOpen(true);
  };

  /* --- COMPONENTE: MODAL DE FILTROS --- */
function FilterModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  if (!isOpen) return null;

  const labelClass = "text-[11px] font-bold text-slate-600 w-24 shrink-0 pt-2";
  const inputClass = "flex-1 h-8 px-3 text-[11px] border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500 transition-all uppercase font-medium";
  const rowClass = "flex gap-4 items-start";

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-[500px] overflow-hidden animate-in fade-in zoom-in duration-200 border border-slate-200">
        
        {/* Header Naranja (Como la imagen) */}
        <div className="bg-[#FF6B00] px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Filter className="w-4 h-4" />
            <span className="font-bold text-sm tracking-tight">Filtros</span>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cuerpo del Formulario - Compacto */}
        <div className="p-5 space-y-3 bg-white">
          
          {/* Fila: Fechas */}
          <div className={rowClass}>
            <div className="flex flex-1 items-center gap-2">
              <label className="text-[11px] font-bold text-slate-600 w-20">Fecha inicial</label>
              <input type="date" className={inputClass} defaultValue="2026-02-04" />
            </div>
            <div className="flex flex-1 items-center gap-2">
              <label className="text-[11px] font-bold text-slate-600 w-16 text-right">Fecha final</label>
              <input type="date" className={inputClass} defaultValue="2026-02-04" />
            </div>
          </div>

          {/* Fila: Cita */}
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-bold text-slate-600 w-20">Cita</label>
            <input type="text" className={inputClass} placeholder="Número de cita" />
          </div>

          {/* Fila: Orden de Compra */}
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-bold text-slate-600 w-20">Orden de compra</label>
            <input type="text" className={inputClass} placeholder="Documento de referencia" />
          </div>

          {/* Fila: NITs */}
          <div className={rowClass}>
            <div className="flex flex-1 items-center gap-2">
              <label className="text-[11px] font-bold text-slate-600 w-20">Nit proveedor</label>
              <input type="text" className={inputClass} />
            </div>
            <div className="flex flex-1 items-center gap-2">
              <label className="text-[11px] font-bold text-slate-600 w-24 text-right">Nit transportista</label>
              <input type="text" className={inputClass} />
            </div>
          </div>

          {/* Fila: Cedi */}
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-bold text-slate-600 w-20">Cedi</label>
            <input type="text" className={inputClass} placeholder="Centro de distribución" />
          </div>

          {/* Fila: Gen */}
          <div className="flex items-center gap-2">
            <label className="text-[11px] font-bold text-slate-600 w-20">Gen</label>
            <input type="text" className={inputClass} placeholder="Generador" />
          </div>

        </div>

        {/* Footer con botones */}
        <div className="bg-slate-50/80 px-4 py-3 flex items-center justify-end gap-2 border-t border-slate-100">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="h-8 px-4 bg-[#FF6B00] hover:bg-[#e66000] text-white border-none text-[11px] font-bold rounded-md"
          >
            Cancelar
          </Button>
          <Button 
            className="h-8 px-6 bg-[#FF6B00] hover:bg-[#e66000] text-white text-[11px] font-bold rounded-md shadow-sm"
            onClick={onClose}
          >
            Buscar
          </Button>
        </div>
      </div>
    </div>
  );
}

 return (
    <div className="flex h-full w-full bg-white border border-slate-200 rounded-3xl shadow-lg overflow-hidden">
      
      {/* --- BARRA LATERAL IZQUIERDA COMPACTA --- */}
      <div className="w-16 flex flex-col border-r border-slate-100 bg-slate-50/50 py-4 items-center gap-3 shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            title={tab.label}
            className={cn(
              "relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 group",
              activeTab === tab.id 
                ? "bg-[#FF6B00] text-white shadow-md shadow-orange-200" 
                : "text-slate-400 hover:bg-white hover:text-[#1C1E59]"
            )}
          >
            <tab.icon className="w-5 h-5" />
            
            {/* Indicador lateral activo pegado al borde */}
            {activeTab === tab.id && (
              <div className="absolute -left-3 w-1 h-6 bg-[#FF6B00] rounded-r-full" />
            )}
          </button>
        ))}
      </div>

      

      {/* --- ÁREA DE CONTENIDO --- */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Toolbar superior */}
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
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <CalendarDays className="w-10 h-10 text-slate-200 mb-2" />
                <h3 className="text-xs font-bold text-slate-400">Seleccione Localidad</h3>
              </div>
            ) : (
              <div className="flex-1 overflow-auto">
                 {activeTab === "solicitudes" && (
                <Table>
                  <TableHeader className="bg-[#050038] sticky top-0 z-30">
                    <TableRow className="border-none h-10">
                      <TableHead className="w-10"></TableHead>
                      {["Documentos", "Tipo de Cita", "Estado Documento", "Fecha Inicial", "Fecha Final", "Canal", "Unidad Negocio", "Tipo Operación", "Tipo Mercancia", "Tipo Cargue", "Tipo de Producto", "Acción"].map((h) => (
                        <TableHead key={h} className="text-white font-bold text-[9px] uppercase px-3">{h}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {INITIAL_SOLICITUDES.map((apt) => (
                      <TableRow key={apt.id} className="hover:bg-orange-50/20 border-b h-12 transition-colors">
                        <TableCell className="text-center">
                          <input type="checkbox" className="accent-[#FF6B00] cursor-pointer w-3.5 h-3.5" />
                        </TableCell>
                        <TableCell className="px-3 text-[10px] text-slate-600 font-bold">{apt.id}</TableCell>
                        <TableCell className="px-3 text-[10px] text-slate-400">{apt.tipoCita}</TableCell>
                        <TableCell className="px-4 text-[10px] text-slate-400">{apt.estadoDocumento}</TableCell>
                        <TableCell className="px-3 text-[10px] text-slate-400">{apt.fechaInicial}</TableCell>
                        <TableCell className="px-3 text-[10px] text-slate-400">{apt.fechaFinal}</TableCell>
                        <TableCell className="px-3 text-[10px] text-slate-400 font-medium">{apt.canal}</TableCell>
                        <TableCell className="px-3 text-[10px] text-slate-400">{apt.unidadNegocio}</TableCell>
                        <TableCell className="px-3 text-[10px] text-slate-400">{apt.tipoOperacion}</TableCell>
                        <TableCell className="px-3 text-[10px] text-slate-400">{apt.tipoMercancia}</TableCell>
                        <TableCell className="px-3 text-[10px] text-slate-400">{apt.tipoCargue}</TableCell>
                        <TableCell className="px-3 text-[10px] text-slate-400">{apt.product}</TableCell>
                        <TableCell className="px-3 text-center">
                          <Button 
                            className="h-9 w-9 bg-[#FF6B00] hover:bg-orange-600 text-white rounded-xl shadow-lg"
                            size="icon"
                            onClick={() => handleOpenFlow(apt)}
                          >
                            <CalendarPlus className="w-5 h-5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                )}


               {activeTab === "programadas" && (
  <div className="rounded-md border overflow-x-auto">
    <Table>
      <TableHeader className="bg-[#050038] sticky top-0 z-30">
        <TableRow className="border-none h-10">
          {/* Encabezados */}
          {[
            "Acciones",
            "Número de Cita",
            "Tipo de Cita",
            "Fecha Cita",
            "Hora Cita",
            "Estado de Cita",
            "Localidad",
            "Documento",
            "Canal",
            "Tipo de Operación",
            "Unidad de Negocio",
            "Identificación Generador / Cliente",
            "Generador / Cliente",
            "Identificación Empresa de Transporte",
            "Empresa de Transporte",
            "Placas",
            "Identificación Conductor",
            "Conductor Agendado",
            "Producto",
            "Tipologia de Vehiculo",
            "Tiempo Programado Cargue/Descargue",
            "Tipo de Cargue",
            "Talleres",
          ].map((h) => (
            <TableHead 
              key={h} 
              className="text-white font-bold text-[9px] uppercase px-2 text-center whitespace-nowrap"
            >
              {h}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {DATA_CONFIRMADOS.map((apt) => (
          <TableRow 
            key={apt.idAppointment} 
            className="hover:bg-slate-50 border-b h-12 transition-colors"
          >
            {/* Botón de Acción Centrado */}
           <TableCell className="p-2 text-center">
              <div className="flex justify-center">
                <Button 
                  className="h-8 w-8 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm transition-colors"
                  size="icon"
                  title="Confirmar Cita"
                  
                >
                  <CheckSquare className="w-4 h-4" strokeWidth={2.5} />
                </Button>
              </div>
            </TableCell>

            {/* Datos Mapeados y Centrados */}
            <TableCell className="px-2 text-[10px] text-slate-700 font-bold text-center whitespace-nowrap">{apt.idAppointment}</TableCell>
            <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.type}</TableCell>
            <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.date}</TableCell>
            <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.time}</TableCell>
            <TableCell className="px-2 text-[10px] text-center">
              <Badge className={cn(
                "text-[9px] px-2 py-0 font-medium capitalize",
                apt.status === "pending" ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-blue-100 text-blue-700"
              )}>
                {apt.status.replace("_", " ")}
              </Badge>
            </TableCell>
            <TableCell className="px-2 text-[10px] text-slate-600 text-center whitespace-nowrap">{apt.locationName}</TableCell>
            <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.id}</TableCell>
            <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.canal}</TableCell>
            <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.tipoOperacion}</TableCell>
            <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.unidadNegocio}</TableCell>
            <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.idgenerador}</TableCell>
            <TableCell className="px-2 text-[10px] text-slate-600 text-center whitespace-nowrap">{apt.generador}</TableCell>
            <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.nit}</TableCell>
            <TableCell className="px-2 text-[10px] text-slate-600 text-center whitespace-nowrap">{apt.carrier}</TableCell>
            <TableCell className="px-2 text-[10px] text-slate-700 font-semibold text-center">{apt.truckId}</TableCell>
            <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.driverId}</TableCell>
            <TableCell className="px-2 text-[10px] text-slate-600 text-center whitespace-nowrap">{apt.driver}</TableCell>
            <TableCell className="px-2 text-[10px] text-slate-600 text-center whitespace-nowrap">{apt.product}</TableCell>
            <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.tipologiavehiculo}</TableCell>
            <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.tiempoprogramadocargue}</TableCell>
            <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.tipoCargue || "N/A"}</TableCell>
            <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.talleres}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
)}


            {activeTab === "cancelacion" && (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-[#050038] sticky top-0 z-30">
                      <TableRow className="border-none h-10">
                        {/* Encabezados */}
                        {[
                          "Acciones",
                          "Número de Cita",
                          "Tipo de Cita",
                          "Fecha Cita",
                          "Hora Final",
                          "Estado de Cita",
                          "Localidad",
                          "Documento",
                          "Canal",
                          "Tipo de Operación",
                          "Unidad de Negocio",
                          "Identificación Generador / Cliente",
                          "Generador / Cliente",
                          "Identificación Empresa de Transporte",
                          "Empresa de Transporte",
                          "Placas",
                          "Identificación Conductor",
                          "Conductor Agendado",
                          "Producto",
                          "Tipologia de Vehiculo",
                          "Tiempo Programado Cargue/Descargue",
                          "Tipo de Cargue",
                          "Talleres",
                        ].map((h) => (
                          <TableHead 
                            key={h} 
                            className="text-white font-bold text-[9px] uppercase px-2 text-center whitespace-nowrap"
                          >
                            {h}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {DATA_CONFIRMADOS.map((apt) => (
                        <TableRow 
                          key={apt.idAppointment} 
                          className="hover:bg-slate-50 border-b h-12 transition-colors"
                        >
                        <TableCell className="p-2 text-center">
                            <div className="flex justify-center">
                              <Button 
                                className="h-8 w-8 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition-colors"
                                size="icon"
                                title="Cancelar Cita"
                          
                              >
                                <X className="w-4 h-4" strokeWidth={3} />
                              </Button>
                            </div>
                          </TableCell>

                          {/* Datos Mapeados y Centrados */}
                          <TableCell className="px-2 text-[10px] text-slate-700 font-bold text-center whitespace-nowrap">{apt.idAppointment}</TableCell>
                          <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.type}</TableCell>
                          <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.date}</TableCell>
                          <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.time}</TableCell>
                          <TableCell className="px-2 text-[10px] text-center">
                            <Badge className={cn(
                              "text-[9px] px-2 py-0 font-medium capitalize",
                              apt.status === "pending" ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-blue-100 text-blue-700"
                            )}>
                              {apt.status.replace("_", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-2 text-[10px] text-slate-600 text-center whitespace-nowrap">{apt.locationName}</TableCell>
                          <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.id}</TableCell>
                          <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.canal}</TableCell>
                          <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.tipoOperacion}</TableCell>
                          <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.unidadNegocio}</TableCell>
                          <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.idgenerador}</TableCell>
                          <TableCell className="px-2 text-[10px] text-slate-600 text-center whitespace-nowrap">{apt.generador}</TableCell>
                          <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.nit}</TableCell>
                          <TableCell className="px-2 text-[10px] text-slate-600 text-center whitespace-nowrap">{apt.carrier}</TableCell>
                          <TableCell className="px-2 text-[10px] text-slate-700 font-semibold text-center">{apt.truckId}</TableCell>
                          <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.driverId}</TableCell>
                          <TableCell className="px-2 text-[10px] text-slate-600 text-center whitespace-nowrap">{apt.driver}</TableCell>
                          <TableCell className="px-2 text-[10px] text-slate-600 text-center whitespace-nowrap">{apt.product}</TableCell>
                          <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.tipologiavehiculo}</TableCell>
                          <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.tiempoprogramadocargue}</TableCell>
                          <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.tipoCargue || "N/A"}</TableCell>
                          <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.talleres}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}


   {activeTab === "reagendamiento" && (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-[#050038] sticky top-0 z-30">
                      <TableRow className="border-none h-10">
                        {/* Encabezados */}
                        {[
                          "Reagendar",
                          "Número de Cita",
                          "Fecha Cita",
                          "Hora Cita",
                          "Tipo de Cita",
                          "Estado solicitud",
                          "Botón para Gestion para perfiles diferentes del admin",
                          "Identificación Generador / Cliente",
                          "Generador / Cliente",
                          "Proveedor",
                          "Tipo producto",
                          "Documento",
                          "Cantidad Pedida",
                          "Fecha reagendada",
                          "Hora reagendada",
                          "Motivo del reagendamiento",
                        ].map((h) => (
                          <TableHead 
                            key={h} 
                            className="text-white font-bold text-[9px] uppercase px-2 text-center whitespace-nowrap"
                          >
                            {h}
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {DATA_REAGENDADA.map((apt) => (
                        <TableRow 
                          key={apt.idAppointment} 
                          className="hover:bg-slate-50 border-b h-12 transition-colors"
                        >
                        <TableCell className="p-2 text-center">
                            <div className="flex justify-center">
                             <Button 
                            className="h-9 w-9 bg-[#FF6B00] hover:bg-orange-600 text-white rounded-xl shadow-lg"
                            size="icon"
                            onClick={() => handleOpenFlow(apt)}
                          >
                            <RefreshCcw className="w-5 h-5" />
                          </Button>
                            </div>
                          </TableCell>

                          {/* Datos Mapeados y Centrados */}
                          <TableCell className="px-2 text-[10px] text-slate-700 font-bold text-center whitespace-nowrap">{apt.idAppointment}</TableCell>
                          <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.date}</TableCell>
                          <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.time}</TableCell>
                          <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.type}</TableCell>
                           <TableCell className="px-2 text-[10px] text-center">
                            <Badge className={cn(
                              "text-[9px] px-2 py-0 font-medium capitalize",
                              apt.status === "pending" ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-blue-100 text-blue-700"
                            )}>
                              {apt.status.replace("_", " ")}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-2 text-[10px] text-slate-600 text-center"></TableCell>
                          <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.idgenerador}</TableCell>
                          <TableCell className="px-2 text-[10px] text-slate-600 text-center whitespace-nowrap">{apt.generador}</TableCell>
                          <TableCell className="px-2 text-[10px] text-slate-600 text-center whitespace-nowrap">{apt.carrier}</TableCell>
                          <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.idTipoProducto}</TableCell>
                          <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.id}</TableCell>
                          <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.cantidadPedida}</TableCell>
                          <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.fechaReagendacion}</TableCell>
                          <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.horaReagendacion}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}


               {activeTab === "recurrencia" && (
  <div className="rounded-md border overflow-x-auto">
    <Table>
      <TableHeader className="bg-[#050038] sticky top-0 z-30">
        <TableRow className="border-none h-10">
          {/* Encabezados */}
          {[
            "Localidad",
            "Identificación Generador / Cliente",
            "Generador / Cliente",
            "Identificación Empresa Transporte",
            "Producto",
            "Tipologia de Vehiculo",
            "Fecha Inicio",
            "Fecha Fin",
            "Hora de Cita",
            "Tiempo Programado Cargue/Descargue",
            "Frecuencia",
            "Editar",
            "Eliminar",
            "Ver en Agenda",
            "Ver Informe",
          ].map((h) => (
            <TableHead 
              key={h} 
              className="text-white font-bold text-[9px] uppercase px-2 text-center whitespace-nowrap"
            >
              {h}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {DATA_CONFIRMADOS.map((apt) => (
          <TableRow 
            key={apt.idAppointment} 
            className="hover:bg-slate-50 border-b h-12 transition-colors"
          >
         
            {/* Datos Mapeados y Centrados */}
            <TableCell className="px-2 text-[10px] text-slate-700 font-bold text-center whitespace-nowrap">{apt.locationName}</TableCell>
            <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.idgenerador}</TableCell>
            <TableCell className="px-2 text-[10px] text-slate-600 text-center whitespace-nowrap">{apt.generador}</TableCell>
            <TableCell className="px-2 text-[10px] text-slate-600 text-center whitespace-nowrap">{apt.nit}</TableCell>
            <TableCell className="px-2 text-[10px] text-slate-600 text-center whitespace-nowrap">{apt.carrier}</TableCell>
            <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.tipologiavehiculo}</TableCell>
            <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.date}</TableCell>
            <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.date}</TableCell>
            <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.time}</TableCell>
            <TableCell className="px-2 text-[10px] text-slate-600 text-center">{apt.tiempoprogramadocargue}</TableCell>

            <TableCell className="px-2 text-[10px] text-slate-600 text-center whitespace-nowrap"></TableCell>
            <TableCell className="p-2 text-center">
                  <div className="flex justify-center">
                             <Button 
                            className="h-9 w-9 bg-[#FF6B00] hover:bg-orange-600 text-white rounded-xl shadow-lg"
                            size="icon"
                            onClick={() => handleOpenFlow(apt)}
                          >
                            <Edit className="w-5 h-5" />
                          </Button>
                  </div>
            </TableCell>
            <TableCell className="p-2 text-center">
                            <div className="flex justify-center">
                              <Button 
                                className="h-8 w-8 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-sm transition-colors"
                                size="icon"
                                title="Eliminar"
                          
                              >
                                <X className="w-4 h-4" strokeWidth={3} />
                              </Button>
                            </div>
                          </TableCell>
            <TableCell className="px-3 text-center">
                          <Button 
                            className="h-9 w-9 bg-[#FF6B00] hover:bg-orange-600 text-white rounded-xl shadow-lg"
                            size="icon"
                            onClick={() => handleOpenFlow(apt)}
                          >
                            <CalendarPlus className="w-5 h-5" />
                          </Button>
                        </TableCell>
            <TableCell className="p-2 text-center">
                  <div className="flex justify-center">
                             <Button 
                            className="h-9 w-9 bg-[#FF6B00] hover:bg-orange-600 text-white rounded-xl shadow-lg"
                            size="icon"
                            onClick={() => handleOpenFlow(apt)}
                          >
                            <FileText className="w-4 h-4" />
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
            
          </div>
          
        </div>
      </div>
   
    {/* RENDERIZADO DE MODALES */}
      {isRequestOpen && (
        <RequestAppointmentModal 
          appointments={selectedItemsForModal} 
          onClose={() => setIsRequestOpen(false)} 
          onContinue={(data) => {
            setDataFromStep1(data);
            setIsRequestOpen(false);
            setIsCreateOpen(true);
          }}
        />
      )}

      {isCreateOpen && dataFromStep1 && (
        <CreateAppointmentModal 
          selectedItems={dataFromStep1.items} // Pasamos el array de items
          suggestedDock="1"                   // <--- ESTA ES LA PROPIEDAD QUE FALTABA (ID del muelle inicial)
          availableDocks={MOCK_DOCKS}
          onClose={() => setIsCreateOpen(false)}
          onConfirm={(finalData) => {
            console.log("Cita creada:", finalData);
            setIsCreateOpen(false);
            // Aquí podrías limpiar la selección
            alert("Cita creada con éxito");
          }}
        />
      )}
 <FilterModal 
        isOpen={isFilterOpen} 
        onClose={() => setIsFilterOpen(false)} 
      />

    </div>
  );
}