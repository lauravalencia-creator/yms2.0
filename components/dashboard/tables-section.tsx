"use client";

import React, { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Download,
  Filter,
  Maximize2,
  Minimize2,
  Monitor,
  CalendarDays,
ClipboardList,
  FileText,
  CheckSquare,
  XCircle,
  Clock,
  Search,
  ChevronLeft,
  ChevronRight,
  Package,
  CalendarRange,
  Truck,
  History,
  AlertTriangle,
  Check,
  MapPin,
  Trash2,
  BarChart3,
  RefreshCcw,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


/* ---------------- PROPS ---------------- */
interface TablesSectionProps {
  locationId: string | null;
  dockGroupId?: string | null;
}


export interface Appointment {
  id: string;
  carrier: string;
  truckId: string;
  time: string;
  type: "inbound" | "outbound";
  status: string;
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
}

/* ---------------- UI HELPERS ---------------- */
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
    <div className="text-xs text-slate-500 italic">
      Mostrando <span className="font-bold text-slate-700">1 - 10</span> de <span className="font-bold text-slate-700">{total}</span> registros
    </div>
    <div className="flex items-center gap-1">
      <Button variant="outline" size="icon" className="h-8 w-8 rounded-xl border-slate-200"><ChevronLeft className="w-4 h-4" /></Button>
      <Button className="h-8 w-8 rounded-xl bg-[#1C1E59] text-white text-xs font-bold">1</Button>
      <Button variant="ghost" className="h-8 w-8 rounded-xl text-xs font-medium text-slate-400">2</Button>
      <Button variant="outline" size="icon" className="h-8 w-8 rounded-xl border-slate-200"><ChevronRight className="w-4 h-4" /></Button>
    </div>
  </div>
);

// 1. Modal de Solicitud (Paso 1)
function RequestAppointmentModal({ appointment, onClose, onContinue }: { appointment: Appointment, onClose: () => void, onContinue: () => void }) {
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b">
           <div className="flex items-center gap-3"><div className="bg-slate-100 p-2 rounded-lg border border-slate-200"><ClipboardList className="w-6 h-6 text-[#1C1E59]" /></div><h3 className="text-lg font-bold text-[#1C1E59] uppercase tracking-tighter">SOLICITUD DE CITAS</h3></div>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600">x</button>
        </div>
        <div className="p-8 bg-gray-50/50">
           <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200"><h4 className="text-sm font-bold text-[#1C1E59] uppercase">Detalles de entrega</h4></div>
              <div className="grid grid-cols-2 text-sm">
                 <div className="col-span-2 px-4 py-3 border-b border-slate-100 grid grid-cols-[140px_1fr] gap-4"><span className="font-semibold text-slate-600">Documento</span><span className="font-medium text-slate-900">{appointment.id}</span></div>
                 <div className="px-4 py-3 border-b border-r border-slate-100 grid grid-cols-[140px_1fr] gap-4"><span className="font-semibold text-slate-600">Proveedor</span><span className="font-medium text-slate-900 uppercase">{appointment.carrier}</span></div>
                 <div className="px-4 py-3 border-b border-slate-100 grid grid-cols-[1fr_100px] gap-4"><span className="font-semibold text-slate-600">Cantidad ordenada</span><span className="font-medium text-slate-900 text-right">{appointment.quantityOrdered || 0}</span></div>
                 <div className="px-4 py-3 border-b border-r border-slate-100 grid grid-cols-[140px_1fr] gap-4"><span className="font-semibold text-slate-600">NIT</span><span className="font-medium text-slate-900">{appointment.nit || '---'}</span></div>
                 <div className="px-4 py-3 border-b border-slate-100 grid grid-cols-[1fr_100px] gap-4"><span className="font-semibold text-slate-600 truncate">Cant. entregada prev.</span><span className="font-medium text-slate-900 text-right">{appointment.quantityDelivered || 0}</span></div>
                 <div className="px-4 py-3 grid grid-cols-[140px_1fr] gap-4"><span className="font-semibold text-slate-600">Lugar</span><span className="font-medium text-slate-900">{appointment.locationName}</span></div>
                 <div className="px-4 py-3 border-l border-slate-100 grid grid-cols-[1fr_100px] gap-4 bg-slate-50/50"><span className="font-semibold text-slate-600 px-4 uppercase text-[10px]">CANTIDAD POR ENTREGAR</span><span className="font-bold text-orange-600 text-right px-4">{(appointment.quantityOrdered || 0) - (appointment.quantityDelivered || 0)}</span></div>
              </div>
           </div>
        </div>
        <div className="px-8 py-6 flex items-center gap-6 bg-white border-t">
           <Button className="bg-[#FF6B00] hover:bg-orange-600 text-white font-bold px-8 h-12 rounded-xl shadow-lg shadow-orange-200" onClick={onContinue}>CONTINUAR</Button>
           <button className="text-slate-400 font-bold text-sm hover:text-[#1C1E59] transition-colors" onClick={onClose}>CANCELAR</button>
        </div>
      </div>
    </div>
  );
}

// 2. Modal de Creación (Paso 2)
function CreateAppointmentModal({ appointment, onClose, onConfirm }: { appointment: Appointment, onClose: () => void, onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[95vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b">
           <div className="flex items-center gap-3">
              <div className="bg-slate-100 p-2 rounded-lg border border-slate-200">
                <ClipboardList className="w-6 h-6 text-indigo-900" />
              </div>
              <h3 className="text-lg font-bold text-indigo-900">SOLICITUD DE CITAS</h3>
           </div>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              x
           </button>
        </div>
        <div className="p-8 bg-white space-y-6">
           <div className="rounded-lg border border-slate-200 overflow-hidden">
              <div className="bg-slate-50/80 px-4 py-2 border-b border-slate-200 text-center">
                 <h4 className="text-sm font-bold text-indigo-900">Detalles de la cita</h4>
              </div>
              <div className="grid grid-cols-2 text-sm">
                 <div className="px-4 py-2 border-b border-r border-slate-100 grid grid-cols-[140px_1fr] gap-4">
                    <span className="font-semibold text-slate-600">Destino</span>
                    <span className="font-medium text-slate-900">{appointment.locationName}</span>
                 </div>
                 <div className="px-4 py-2 border-b border-slate-100 grid grid-cols-[140px_1fr] gap-4">
                    <span className="font-semibold text-slate-600">ID de la cita</span>
                    <span className="font-medium text-slate-900">{appointment.appointmentIdRef || '---'}</span>
                 </div>
                 <div className="px-4 py-2 border-b border-r border-slate-100 grid grid-cols-[140px_1fr] gap-4">
                    <span className="font-semibold text-slate-600">Transportista de la cita</span>
                    <span className="font-medium text-slate-900">SI</span>
                 </div>
                 <div className="px-4 py-2 border-b border-slate-100 grid grid-cols-[140px_1fr] gap-4">
                    <span className="font-semibold text-slate-600">Transportista</span>
                    <span className="font-medium text-slate-900">{appointment.transportCompany || appointment.carrier}</span>
                 </div>
                 <div className="px-4 py-2 border-b border-r border-slate-100 grid grid-cols-[140px_1fr] gap-4">
                    <span className="font-semibold text-slate-600">Tipo de carga</span>
                    <span className="font-medium text-slate-900">{appointment.loadType}</span>
                 </div>
                 <div className="px-4 py-2 border-b border-slate-100 grid grid-cols-[140px_1fr] gap-4">
                    <span className="font-semibold text-slate-600">Vehículo</span>
                    <span className="font-medium text-slate-900">{appointment.vehicleType}</span>
                 </div>
                 <div className="px-4 py-2 border-b border-r border-slate-100 grid grid-cols-[140px_1fr] gap-4">
                    <span className="font-semibold text-slate-600">Fecha de cargue</span>
                    <span className="font-medium text-slate-900">{appointment.loadDate}</span>
                 </div>
                 <div className="px-4 py-2 border-b border-slate-100 grid grid-cols-[140px_1fr] gap-4">
                    <span className="font-semibold text-slate-600">Hora de cargue</span>
                    <span className="font-medium text-slate-900">{appointment.loadTime}</span>
                 </div>
                 <div className="px-4 py-2 border-r border-slate-100 grid grid-cols-[140px_1fr] gap-4">
                    <span className="font-semibold text-slate-600">Fecha de descargue</span>
                    <span className="font-medium text-slate-900">{appointment.unloadDate}</span>
                 </div>
                 <div className="px-4 py-2 grid grid-cols-[140px_1fr] gap-4">
                    <span className="font-semibold text-slate-600">Hora de descargue</span>
                    <span className="font-medium text-slate-900">{appointment.unloadTime}</span>
                 </div>
              </div>
           </div>
           <div className="rounded-lg border border-slate-200 overflow-hidden">
              <div className="bg-slate-50/80 px-4 py-2 border-b border-slate-200 text-center">
                 <h4 className="text-sm font-bold text-indigo-900">Conductor</h4>
              </div>
              <div className="grid grid-cols-2 text-sm">
                 <div className="px-4 py-3 border-b border-r border-slate-100 grid grid-cols-[140px_1fr] gap-4 items-center">
                    <span className="font-semibold text-slate-600">Nombre del conductor</span>
                    <span className="font-medium text-slate-900">{appointment.driver}</span>
                 </div>
                 <div className="px-4 py-3 border-b border-slate-100 grid grid-cols-[140px_1fr] gap-4 items-center">
                    <span className="font-semibold text-slate-600">Documento del conductor</span>
                    <span className="font-medium text-slate-900">{appointment.driverId}</span>
                 </div>
                 <div className="px-4 py-3 border-b border-r border-slate-100 grid grid-cols-[140px_1fr] gap-4 items-center">
                    <span className="font-semibold text-slate-600">Teléfono del conductor</span>
                    <span className="font-medium text-slate-900">{appointment.driverPhone}</span>
                 </div>
                 <div className="px-4 py-3 border-b border-slate-100 grid grid-cols-[140px_1fr] gap-4 items-center">
                    <span className="font-semibold text-slate-600">Correo electrónico del conductor</span>
                    <span className="font-medium text-slate-900">{appointment.driverEmail}</span>
                 </div>
                 <div className="px-4 py-3 border-r border-slate-100 grid grid-cols-[140px_1fr] gap-4 items-center col-span-2">
                    <span className="font-semibold text-slate-600">Placa del vehículo</span>
                    <span className="font-medium text-slate-900">{appointment.truckId}</span>
                 </div>
              </div>
           </div>
           <div className="rounded-lg border border-slate-200 overflow-hidden">
              <div className="bg-slate-50/80 px-4 py-2 border-b border-slate-200 text-center">
                 <h4 className="text-sm font-bold text-indigo-900">Comentarios</h4>
              </div>
              <div className="text-sm">
                 <div className="px-4 py-3 border-b border-slate-100 grid grid-cols-[140px_1fr] gap-4">
                    <span className="font-semibold text-slate-600 pt-2">Escribe comentarios</span>
                    <textarea 
                       className="w-full border border-slate-200 rounded p-2 text-slate-600 text-sm focus:outline-none focus:border-orange-400 placeholder:text-slate-300"
                       placeholder="Añadir observaciones aquí..."
                       rows={2}
                    />
                 </div>
                 <div className="px-4 py-2 border-b border-slate-100 grid grid-cols-[140px_1fr] gap-4">
                    <span className="font-semibold text-slate-600">Documento</span>
                    <span className="font-medium text-slate-900">{appointment.id}</span>
                 </div>
                 <div className="grid grid-cols-2">
                    <div className="px-4 py-2 border-r border-slate-100 grid grid-cols-[140px_1fr] gap-4">
                       <span className="font-semibold text-slate-600">Muelle sugerido</span>
                       <span className="font-medium text-slate-900">2</span>
                    </div>
                    <div className="px-4 py-2 grid grid-cols-[140px_1fr] gap-4">
                       <span className="font-semibold text-slate-600">Mercancía</span>
                       <span className="font-medium text-slate-900">{appointment.merchandiseCode}</span>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 border-t border-slate-100">
                    <div className="px-4 py-2 border-r border-slate-100 grid grid-cols-[140px_1fr] gap-4">
                       <span className="font-semibold text-slate-600">Cantidad a entregar</span>
                       <span className="font-medium text-slate-900">{(appointment.quantityOrdered || 0) - (appointment.quantityDelivered || 0)}</span>
                    </div>
                    <div className="px-4 py-2 grid grid-cols-[140px_1fr] gap-4">
                       <span className="font-semibold text-slate-600">Tipo de mercancía</span>
                       <span className="font-medium text-slate-900">{appointment.product || 'No Alimentos'}</span>
                    </div>
                 </div>
              </div>
           </div>
        </div>
        <div className="px-8 py-6 flex items-center gap-6 bg-white border-t">
           <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 h-10 shadow-md shadow-orange-500/20" onClick={onConfirm}>
             CREAR CITA
           </Button>
           <button className="text-orange-500 font-bold text-sm hover:underline" onClick={onClose}>
             ATRÁS
           </button>
        </div>
      </div>
    </div>
  );
}

function FilterModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:bg-slate-50">
          <Filter className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden border-0 rounded-[2rem] shadow-2xl">
        {/* Encabezado */}
        <DialogHeader className="px-8 py-5 border-b border-gray-100 flex flex-row items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center border border-gray-100 shadow-sm">
              <Search className="w-5 h-5 text-[#1C1E59]" />
            </div>
            <DialogTitle className="text-xl font-black text-[#1C1E59] tracking-tight">Filtros</DialogTitle>
          </div>
        </DialogHeader>

        {/* Cuerpo del Formulario */}
        <div className="p-8 bg-white space-y-6">
          <div className="grid grid-cols-2 gap-6">
            {/* Columna 1 */}
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">ID Cita</label>
                <Input placeholder="999" className="h-11 rounded-xl border-slate-200 text-sm focus:ring-[#FF6B00] focus:border-[#FF6B00]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Estado de Cita</label>
                <Select>
                  <SelectTrigger className="h-11 rounded-xl border-slate-200 text-slate-500">
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="confirmado">Confirmado</SelectItem>
                    <SelectItem value="en_proceso">En Proceso</SelectItem>
                    <SelectItem value="retrasado">Retrasado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Desde</label>
                <div className="relative">
                  <Input type="text" placeholder="dd/mm/aaaa" className="h-11 rounded-xl border-slate-200 text-sm pr-10" />
                  <CalendarDays className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Columna 2 */}
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Proveedor</label>
                <Input placeholder="Nombre del proveedor" className="h-11 rounded-xl border-slate-200 text-sm focus:ring-[#FF6B00]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Transportista</label>
                <Input placeholder="Empresa transportadora" className="h-11 rounded-xl border-slate-200 text-sm focus:ring-[#FF6B00]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Hasta</label>
                <div className="relative">
                  <Input type="text" placeholder="dd/mm/aaaa" className="h-11 rounded-xl border-slate-200 text-sm pr-10" />
                  <CalendarDays className="absolute right-3 top-3 w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer de Acciones */}
        <div className="px-8 py-6 bg-white border-t border-gray-100 flex items-center justify-end gap-4">
          <Button variant="outline" className="h-11 px-8 rounded-xl border-slate-200 font-bold text-[11px] uppercase tracking-widest text-[#1C1E59] hover:bg-slate-50 transition-all">
            Limpiar
          </Button>
          <Button className="h-11 px-8 rounded-xl bg-[#FF6B00] hover:bg-[#e65c00] font-black text-[11px] uppercase tracking-widest text-white shadow-lg shadow-orange-200 transition-all active:scale-95">
            Aplicar Filtros
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// 1. Datos de ejemplo iniciales (fuera o dentro del componente)
const INITIAL_SOLICITUDES = [...Array(10)].map((_, i) => ({
  id: `REQ-882${i}`,
  carrier: i % 2 === 0 ? "DHL Logistics Express" : "Carga Segura S.A.",
  truckId: `XYZ-12${i}`,
  time: "08:00 AM",
  type: "inbound" as const,
  status: "pending" as const,
  quantityOrdered: 1000,
  quantityDelivered: 0,
  locationName: "Planta Bello 1405",
  loadType: "Materia Prima (Seca)",
  product: "Insumos Industriales",
  nit: "800.123.456-1",
  date: "26/01/2026"
}));

function DeleteConfirmDialog({ isOpen, onClose, onConfirm }: { isOpen: boolean, onClose: () => void, onConfirm: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden border-0 rounded-[2rem] shadow-2xl bg-white">
        <div className="p-8 text-center">
          {/* Círculo del icono en Naranja suave */}
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-orange-100">
            <AlertTriangle className="w-10 h-10 text-orange-500" />
          </div>
          
          <DialogHeader>
            <DialogTitle className="text-xl font-black text-[#1C1E59] text-center uppercase tracking-tight">
              ¿Estás seguro?
            </DialogTitle>
          </DialogHeader>
          
          <p className="text-slate-500 text-sm mt-3 leading-relaxed">
            Esta acción eliminará la solicitud permanentemente. 
            <span className="block font-bold text-orange-600 mt-1 italic text-xs">
              Una vez eliminado, no podrá recuperarse.
            </span>
          </p>
        </div>

        <div className="px-8 py-6 bg-slate-50 flex flex-col gap-3">
          {/* Botón Principal en Naranja */}
          <Button 
            onClick={onConfirm}
            className="w-full h-12 bg-[#FF6B00] hover:bg-[#e65c00] text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-orange-200 transition-all active:scale-95 border-none"
          >
            SÍ, ELIMINAR SOLICITUD
          </Button>
          
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="w-full h-12 text-slate-400 font-bold uppercase text-[11px] hover:text-slate-600 transition-colors"
          >
            NO, MANTENER REGISTRO
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---------------- COMPONENT ---------------- */
/* ---------------- COMPONENT ---------------- */
export function TablesSection({ locationId }: TablesSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [section, setSection] = useState<"monitoreo" | "gestion">("monitoreo");
  const [monitoreoView, setMonitoreoView] = useState("appointments");
  const [gestionView, setGestionView] = useState("solicitudes");

  // --- ESTADOS PARA CONTROLAR LOS MODALES ---
  const [requestModalAppointment, setRequestModalAppointment] = useState<Appointment | null>(null);
  const [createModalAppointment, setCreateModalAppointment] = useState<Appointment | null>(null);

  // --- ESTADOS PARA GESTIONAR LOS DATOS DE LA TABLA ---
  const [solicitudes, setSolicitudes] = useState<Appointment[]>(INITIAL_SOLICITUDES);
  const [itemAEliminar, setItemAEliminar] = useState<Appointment | null>(null);

  // Función para confirmar la eliminación
  const confirmarEliminacion = () => {
    if (itemAEliminar) {
      setSolicitudes(solicitudes.filter(s => s.id !== itemAEliminar.id));
      setItemAEliminar(null);
    }
  };

  const monitoringTabs = [
    { id: "appointments", label: "Consulta de Citas", icon: CalendarRange, count: 24 },
    { id: "carriers", label: "Control de Citas", icon: Truck, count: 8 },
    { id: "inventory", label: "Editar Información", icon: Package, count: 12 }
  ];

  const managementTabs = [
    { id: "solicitudes", label: "Solicitud de Citas", icon: FileText },
    { id: "programadas", label: "Confirmación", icon: CheckSquare },
    { id: "cancelacion", label: "Cancelación", icon: XCircle },
    { id: "reagendamiento", label: "Reagendar", icon: History },
    { id: "recurrencia", label: "Recurrencia de Citas", icon: CalendarRange },
  ];

  // --- COMPONENTE VISUAL PARA ESTADO SIN LOCALIDAD ---
  const SelectLocationState = () => (
    <div className="h-full w-full flex flex-col items-center justify-center bg-slate-50/30 p-12 text-center animate-in fade-in duration-500">
      <div className="bg-slate-50 p-6 rounded-full mb-4 shadow-inner border border-slate-100">
        <Monitor className="w-10 h-10 text-slate-300" />
      </div>
      <h3 className="text-lg font-black text-[#1C1E59] uppercase tracking-tighter italic">Selecciona una Localidad</h3>
      <p className="text-sm text-slate-400 max-w-xs mx-auto mt-2">
        Elige una planta en el filtro superior para visualizar los datos de esta tabla.
      </p>
    </div>
  );

  return (
    <div className={cn(
      "bg-white border border-slate-200 rounded-3xl flex flex-col transition-all duration-500 ease-in-out",
      isExpanded ? "fixed inset-4 z-[100] shadow-2xl" : "h-full w-full shadow-lg"
    )}>
      
      <Tabs value={section} onValueChange={(v) => setSection(v as any)} className="flex-1 flex flex-col min-h-0">
        
        {/* --- TOOLBAR SUPERIOR --- */}
        <div className="px-5 py-3 border-b flex items-center justify-between bg-white shrink-0 gap-4">
            <div className="flex items-center gap-4">
                <TabsList className="h-10 bg-slate-100 p-1 rounded-xl shrink-0 border border-slate-200 flex items-center">
                  <TabsTrigger 
                      value="monitoreo" 
                      className="h-8 w-10 p-0 flex items-center justify-center data-[state=active]:bg-white data-[state=active]:text-[#1C1E59] data-[state=active]:shadow-sm transition-all rounded-lg"
                  >
                      <Monitor className="w-4 h-4" />
                  </TabsTrigger>
                  
                  <TabsTrigger 
                      value="gestion" 
                      className="h-8 w-10 p-0 flex items-center justify-center data-[state=active]:bg-white data-[state=active]:text-[#1C1E59] data-[state=active]:shadow-sm transition-all rounded-lg"
                  >
                      <CalendarDays className="w-4 h-4" />
                  </TabsTrigger>
                </TabsList>

                <div className="h-6 w-px bg-slate-200 shrink-0" />

                <div className="flex items-center bg-slate-50/80 p-1 rounded-xl gap-1 border border-slate-100">
                    {(section === "monitoreo" ? monitoringTabs : managementTabs).map(tab => {
                        const isActive = (section === "monitoreo" ? monitoreoView : gestionView) === tab.id;
                        return (
                          <button 
                            key={tab.id} 
                            onClick={() => section === "monitoreo" ? setMonitoreoView(tab.id) : setGestionView(tab.id)} 
                            className={cn(
                                "flex items-center gap-2 px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                                isActive ? "bg-[#1C1E59] text-white shadow-lg" : "text-slate-500 hover:bg-white"
                            )}
                          >
                            <tab.icon className="w-3.5 h-3.5" />
                            <span className="hidden lg:block">{tab.label}</span>
                          </button>
                        )
                    })}
                </div>
            </div>

            <div className="flex items-center gap-3">
                <div className="h-6 w-px bg-slate-200 mx-1" />
                <Button disabled={!locationId} variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:bg-slate-50"><RefreshCcw className="w-4 h-4"/></Button>
                <Button disabled={!locationId} variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:bg-slate-50"><Download className="w-4 h-4"/></Button>
                {/* Deshabilitamos el filtro si no hay localidad, o lo dejamos activo si prefieres */}
                {locationId ? <FilterModal /> : (
                   <Button disabled variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400"><Filter className="w-4 h-4"/></Button>
                )}
                <Button 
                    variant="ghost" size="icon" 
                    className={cn("h-9 w-9 rounded-xl transition-all", isExpanded ? "text-orange-500 bg-orange-50" : "text-slate-400 hover:bg-slate-50")}
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </Button>
            </div>
        </div>

        {/* --- AREA DE TABLA CON MARGEN Y ESTILO --- */}
        <div className="flex-1 overflow-hidden bg-slate-50/50 p-3 flex flex-col min-h-0">
            <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/60 overflow-hidden flex flex-col relative">
                
                {/* CONTENIDO PRINCIPAL */}
                <div className="flex-1 overflow-auto custom-scrollbar">
                  <TabsContent value="monitoreo" className="h-full m-0">
                    {!locationId ? (
                        <SelectLocationState />
                    ) : (
                      <>
                        {/* --- VISTA: CONSULTA DE CITAS --- */}
                        {monitoreoView === "appointments" && (
                          <Table>
                            <TableHeader className="bg-[#1C1E59] sticky top-0 z-30">
                              <TableRow className="hover:bg-transparent border-none h-11">
                                {[
                                  "ID Cita", "Hora Cita", "Proveedor", "ID Proveedor", "Transportadora", 
                                  "Tipo de Producto", "Estado", "Placa", "Entrada", "Salida", "Taller"
                                ].map((h) => (
                                  <TableHead key={h} className="text-white font-bold text-[10px] uppercase tracking-wider px-4 h-11 whitespace-nowrap">{h}</TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {[...Array(10)].map((_, i) => (
                                <TableRow key={i} className="group hover:bg-blue-50/40 border-b border-slate-50 transition-colors h-14">
                                  <TableCell className="px-4 font-black text-[#1C1E59] text-sm tracking-tighter">APT-{1024 + i}</TableCell>
                                  <TableCell className="px-4 whitespace-nowrap"><div className="flex items-center gap-1.5 text-slate-500 font-medium text-xs italic"><Clock className="w-3.5 h-3.5 text-slate-300" /> 08:30 AM</div></TableCell>
                                  <TableCell className="px-4 font-bold text-slate-700 text-xs uppercase tracking-tight">Logística del Norte SAS</TableCell>
                                  <TableCell className="px-4 text-slate-400 font-medium text-[11px]">NIT 900.123.4{i}</TableCell>
                                  <TableCell className="px-4 text-slate-600 text-xs font-semibold uppercase">Transportes Especiales</TableCell>
                                  <TableCell className="px-4"><code className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono text-[10px]">G-9921</code></TableCell>
                                  <TableCell className="px-4 text-center"><StatusBadge status={i % 3 === 0 ? "en_proceso" : "confirmado"} /></TableCell>
                                  <TableCell className="px-4"><span className="bg-amber-50 border border-amber-200 text-amber-800 px-2 py-0.5 rounded font-mono font-bold text-[11px] uppercase shadow-sm">KKL-99{i}</span></TableCell>
                                  <TableCell className="px-4 text-slate-400 text-xs italic">07:45 AM</TableCell>
                                  <TableCell className="px-4 text-slate-400 text-xs italic">09:30 AM</TableCell>
                                  <TableCell className="px-4"><div className="flex items-center gap-2 text-slate-500 text-[10px] font-bold"><div className="w-1.5 h-1.5 rounded-full bg-orange-400" /> Taller A</div></TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}

                        {/* --- VISTA: TORRE DE CONTROL (NUEVA) --- */}
                        {/* --- VISTA: TORRE DE CONTROL (ACTUALIZADA COMPLETA) --- */}
                        {monitoreoView === "carriers" && (
                          <Table>
                            <TableHeader className="bg-[#1C1E59] sticky top-0 z-30">
                              <TableRow className="hover:bg-transparent border-none h-11">
                                {[
                                  "Numero de Cita", "Localidad", "Muelle", "Tipo de Cita", "Fecha Cita", "Hora Cita", 
                                  "Usuario Solicitante", "Estado de Cita", "Documento", "Recibo Maestro", 
                                  "ID Generador", "Generador / Cliente", "Placa Agendada", "Placa Ingresó", 
                                  "ID Conductor Agend.", "Nombre Cond. Agend.", "ID Cond. Ingresó", "Nombre Cond. Ingresó", 
                                  "Celular", "ID Emp. Transporte", "Emp. Transporte", "Tipo de Cargue", "Tipo de Producto", 
                                  "Peso Total", "Litros Totales", "Volumen Total", "GPS Ingreso", 
                                  "Fecha/Hora Ingreso", "T. Transcurrido Localidad", "T. Transcurrido Traspaso", 
                                  "T. Transcurrido C/D", "T. Estimado C/D", "Cant. Solicitada", "Cant. Entregada", 
                                  "Fecha/Hora Salida", "GPS Salida", "OnTime", "% Cargue/Descargue", 
                                  "User Entrada", "User Inicio", "User Fin", "User Salida"
                                ].map((h) => (
                                  <TableHead key={h} className="text-white font-bold text-[9px] uppercase tracking-[0.1em] px-4 h-11 whitespace-nowrap">{h}</TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {[...Array(10)].map((_, i) => (
                                <TableRow key={i} className="group hover:bg-blue-50/40 border-b border-slate-50 transition-colors h-14">
                                  {/* 1. Numero de Cita */}
                                  <TableCell className="px-4 font-black text-[#1C1E59] text-xs whitespace-nowrap">CITA-{1000 + i}</TableCell>
                                  {/* 2. Localidad */}
                                  <TableCell className="px-4 text-slate-600 text-[10px] font-bold whitespace-nowrap">Planta Bello</TableCell>
                                  {/* 3. Muelle */}
                                  <TableCell className="px-4 text-slate-500 text-[10px] whitespace-nowrap">Muelle {i+1}</TableCell>
                                  {/* 4. Tipo de Cita */}
                                  <TableCell className="px-4 font-medium text-blue-600 text-[10px] uppercase whitespace-nowrap">Descargue</TableCell>
                                  {/* 5. Fecha Cita */}
                                  <TableCell className="px-4 text-slate-500 text-[10px] whitespace-nowrap">26/01/2026</TableCell>
                                  {/* 6. Hora Cita */}
                                  <TableCell className="px-4 text-slate-500 text-[10px] whitespace-nowrap">08:00 AM</TableCell>
                                  {/* 7. Usuario Solicitante */}
                                  <TableCell className="px-4 text-slate-600 text-[10px] uppercase whitespace-nowrap">Juan Perez</TableCell>
                                  {/* 8. Estado de Cita */}
                                  <TableCell className="px-4"><StatusBadge status="en_proceso" /></TableCell>
                                  {/* 9. Documento */}
                                  <TableCell className="px-4 text-slate-500 text-[10px] whitespace-nowrap">DOC-{500+i}</TableCell>
                                  {/* 10. Recibo Maestro */}
                                  <TableCell className="px-4 text-slate-500 text-[10px] whitespace-nowrap">REC-{200+i}</TableCell>
                                  {/* 11. ID Generador */}
                                  <TableCell className="px-4 text-slate-400 text-[10px] whitespace-nowrap">NIT 900.123</TableCell>
                                  {/* 12. Generador / Cliente */}
                                  <TableCell className="px-4 font-bold text-[#1C1E59] text-[10px] uppercase whitespace-nowrap">Cliente Principal SAS</TableCell>
                                  {/* 13. Placa Agendada */}
                                  <TableCell className="px-4"><span className="bg-slate-100 px-2 py-0.5 rounded font-mono font-bold text-[10px] text-slate-600">AAA-123</span></TableCell>
                                  {/* 14. Placa Ingresó */}
                                  <TableCell className="px-4"><span className="bg-amber-50 border border-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono font-bold text-[10px]">AAA-123</span></TableCell>
                                  {/* 15. ID Conductor Agend. */}
                                  <TableCell className="px-4 text-slate-500 text-[10px] whitespace-nowrap">71.223.334</TableCell>
                                  {/* 16. Nombre Cond. Agend. */}
                                  <TableCell className="px-4 text-slate-600 text-[10px] uppercase whitespace-nowrap">Pedro Pablo</TableCell>
                                  {/* 17. ID Cond. Ingresó */}
                                  <TableCell className="px-4 text-slate-500 text-[10px] whitespace-nowrap">71.223.334</TableCell>
                                  {/* 18. Nombre Cond. Ingresó */}
                                  <TableCell className="px-4 text-slate-600 text-[10px] uppercase whitespace-nowrap">Pedro Pablo</TableCell>
                                  {/* 19. Celular */}
                                  <TableCell className="px-4 text-slate-500 text-[10px] whitespace-nowrap">300 123 4567</TableCell>
                                  {/* 20. ID Emp. Transporte */}
                                  <TableCell className="px-4 text-slate-400 text-[10px] whitespace-nowrap">NIT 800.111</TableCell>
                                  {/* 21. Emp. Transporte */}
                                  <TableCell className="px-4 text-slate-600 text-[10px] uppercase font-bold whitespace-nowrap">Carga Segura</TableCell>
                                  {/* 22. Tipo de Cargue */}
                                  <TableCell className="px-4 text-slate-500 text-[10px] whitespace-nowrap">Palletizado</TableCell>
                                  {/* 23. Tipo de Producto */}
                                  <TableCell className="px-4 text-slate-500 text-[10px] whitespace-nowrap">Materia Prima</TableCell>
                                  {/* 24. Peso Total */}
                                  <TableCell className="px-4 font-mono text-[10px] whitespace-nowrap">10,000 Kg</TableCell>
                                  {/* 25. Litros Totales */}
                                  <TableCell className="px-4 font-mono text-[10px] whitespace-nowrap">N/A</TableCell>
                                  {/* 26. Volumen Total */}
                                  <TableCell className="px-4 font-mono text-[10px] whitespace-nowrap">15 M3</TableCell>
                                  {/* 27. GPS Ingreso */}
                                  <TableCell className="px-4"><Badge variant="outline" className="text-[9px] whitespace-nowrap">GPS-{i}99</Badge></TableCell>
                                  {/* 28. Fecha/Hora Ingreso */}
                                  <TableCell className="px-4 text-slate-500 text-[10px] whitespace-nowrap">26/01 07:45</TableCell>
                                  {/* 29. T. Transcurrido Localidad */}
                                  <TableCell className="px-4 font-mono text-[10px] text-orange-600 font-bold whitespace-nowrap">01:15:00</TableCell>
                                  {/* 30. T. Transcurrido Traspaso */}
                                  <TableCell className="px-4 font-mono text-[10px] whitespace-nowrap">00:10:00</TableCell>
                                  {/* 31. T. Transcurrido C/D */}
                                  <TableCell className="px-4 font-mono text-[10px] text-blue-600 font-bold whitespace-nowrap">00:45:00</TableCell>
                                  {/* 32. T. Estimado C/D */}
                                  <TableCell className="px-4 text-slate-400 text-[10px] whitespace-nowrap">01:00:00</TableCell>
                                  {/* 33. Cant. Solicitada */}
                                  <TableCell className="px-4 font-mono text-[10px] whitespace-nowrap">1000</TableCell>
                                  {/* 34. Cant. Entregada */}
                                  <TableCell className="px-4 font-mono text-[10px] whitespace-nowrap">500</TableCell>
                                  {/* 35. Fecha/Hora Salida */}
                                  <TableCell className="px-4 text-slate-400 text-[10px] whitespace-nowrap">---</TableCell>
                                  {/* 36. GPS Salida */}
                                  <TableCell className="px-4 text-slate-400 text-[10px] whitespace-nowrap">---</TableCell>
                                  {/* 37. OnTime */}
                                  <TableCell className="px-4 text-center">{i % 2 === 0 ? <Check className="w-3.5 h-3.5 text-emerald-500 mx-auto" /> : <XCircle className="w-3.5 h-3.5 text-rose-500 mx-auto" />}</TableCell>
                                  {/* 38. % Cargue/Descargue */}
                                  <TableCell className="px-4"><Badge className="bg-blue-100 text-blue-700 text-[9px] font-black border-none whitespace-nowrap">50%</Badge></TableCell>
                                  {/* 39. User Entrada */}
                                  <TableCell className="px-4 text-slate-500 text-[9px] uppercase whitespace-nowrap">Portero 1</TableCell>
                                  {/* 40. User Inicio */}
                                  <TableCell className="px-4 text-slate-500 text-[9px] uppercase whitespace-nowrap">Montacarga 2</TableCell>
                                  {/* 41. User Fin */}
                                  <TableCell className="px-4 text-slate-400 text-[9px] uppercase whitespace-nowrap">---</TableCell>
                                  {/* 42. User Salida */}
                                  <TableCell className="px-4 text-slate-400 text-[9px] uppercase whitespace-nowrap">---</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}

                        {/* --- VISTA: EDITAR INFORMACIÓN (Otras) --- */}
                        {monitoreoView === "inventory" && (
                          <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl overflow-hidden mx-1 mb-1">
                            <div className="flex-1 overflow-auto custom-scrollbar">
                              <Table>
                                <TableHeader className="bg-[#1C1E59] sticky top-0 z-30">
                                  <TableRow className="border-none hover:bg-transparent">
                                    <TableHead className="w-12 text-center">
                                      <input type="checkbox" className="rounded border-white/20 bg-transparent" />
                                    </TableHead>
                                    {[
                                      "Unidad Negocio", "Proveedor", "Fecha", "Hora", "Tipo Cita", 
                                      "ID Cita", "Estado", "Cédula", "Orden Compra", "No. Recibo", 
                                      "Recibo", "Muelle", "Conductor", "Teléfono", "Vehículo", 
                                      "Categorización", "Transportadora", "ID Contenedor", "No. Orden", 
                                      "No. Importación", "OBS", "ID Proveedor", "No. Pallets", 
                                      "Entrada UN", "T. Transcurrido", "T. Est. Descargue", "Salida", 
                                      "Usuario", "A Tiempo", "Descargue %", "Acciones"
                                    ].map((h) => (
                                      <TableHead key={h} className="text-white/90 font-bold text-[9px] uppercase tracking-wider h-11 whitespace-nowrap px-4 border-none">
                                        {h}
                                      </TableHead>
                                    ))}
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {[...Array(10)].map((_, i) => (
                                    <TableRow key={i} className="group hover:bg-blue-50/40 transition-colors border-b border-slate-50 last:border-none h-14">
                                      <TableCell className="text-center">
                                        <input type="checkbox" className="rounded border-slate-200" />
                                      </TableCell>
                                      
                                      {/* Datos básicos */}
                                      <TableCell className="px-4 font-bold text-slate-700 text-[10px] whitespace-nowrap">Planta Bello</TableCell>
                                      <TableCell className="px-4 font-black text-[#1C1E59] text-[10px] uppercase whitespace-nowrap">Logística Integral S.A.</TableCell>
                                      <TableCell className="px-4 text-slate-500 text-[10px] whitespace-nowrap">26/01/2026</TableCell>
                                      <TableCell className="px-4 text-slate-500 text-[10px] whitespace-nowrap font-medium">14:30</TableCell>
                                      <TableCell className="px-4 font-bold text-blue-600 text-[9px] uppercase">Descargue</TableCell>
                                      <TableCell className="px-4 font-black text-[#1C1E59] text-[11px] tracking-tighter">DOC-992{i}</TableCell>
                                      <TableCell className="px-4"><StatusBadge status="en_proceso" /></TableCell>
                                      
                                      {/* Datos de Identificación y Documentos */}
                                      <TableCell className="px-4 text-slate-500 text-[10px] font-mono">1.033.455.{i}</TableCell>
                                      <TableCell className="px-4"><Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 font-bold text-[9px]">OC-7721</Badge></TableCell>
                                      <TableCell className="px-4 text-slate-600 text-[10px]">#99821</TableCell>
                                      <TableCell className="px-4 text-slate-400 text-[10px]">REC-001</TableCell>
                                      <TableCell className="px-4 font-bold text-slate-700 text-[10px]">Muelle 04</TableCell>
                                      
                                      {/* Conductor y Vehículo */}
                                      <TableCell className="px-4 font-medium text-slate-700 text-[10px] uppercase whitespace-nowrap">Carlos Rodriguez</TableCell>
                                      <TableCell className="px-4 text-slate-500 text-[10px]">310 455 2211</TableCell>
                                      <TableCell className="px-4 text-slate-600 text-[10px] uppercase font-semibold">Tractomula</TableCell>
                                      <TableCell className="px-4 text-slate-400 text-[10px]">Materia Prima</TableCell>
                                      
                                      {/* Logística */}
                                      <TableCell className="px-4 text-slate-700 text-[10px] font-bold uppercase">Carga Segura</TableCell>
                                      <TableCell className="px-4">
                                        <span className="bg-amber-50 border border-amber-200 text-amber-800 px-2 py-0.5 rounded font-mono font-bold text-[10px] uppercase">REM-552{i}</span>
                                      </TableCell>
                                      <TableCell className="px-4 text-slate-500 text-[10px]">ORD-112</TableCell>
                                      <TableCell className="px-4 text-slate-400 text-[10px]">IMP-223</TableCell>
                                      <TableCell className="px-4 text-slate-400 text-[9px] italic max-w-[100px] truncate">Llegada sin novedad...</TableCell>
                                      <TableCell className="px-4 text-slate-500 text-[10px]">NIT 800.221</TableCell>
                                      <TableCell className="px-4 text-center font-bold text-slate-700">24</TableCell>
                                      
                                      {/* Tiempos */}
                                      <TableCell className="px-4 text-slate-500 text-[10px] italic">14:45:00</TableCell>
                                      <TableCell className="px-4 font-mono text-[10px] text-orange-600 font-bold">01:20:00</TableCell>
                                      <TableCell className="px-4 font-mono text-[10px] text-slate-400">02:00:00</TableCell>
                                      <TableCell className="px-4 text-slate-500 text-[10px]">16:05</TableCell>
                                      <TableCell className="px-4 text-slate-600 text-[10px] font-medium uppercase">Admin_Jpm</TableCell>
                                      
                                      {/* KPIs */}
                                      <TableCell className="px-4 text-center">
                                        {i % 2 === 0 ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <XCircle className="w-4 h-4 text-rose-500 mx-auto" />}
                                      </TableCell>
                                      <TableCell className="px-4">
                                        <div className="w-full bg-slate-100 rounded-full h-1.5 min-w-[50px]">
                                          <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: '85%' }}></div>
                                        </div>
                                      </TableCell>

                                      {/* COLUMNA ACCIONES */}
                                      <TableCell className="px-4 text-right">
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          className="h-8 px-4 bg-white border-slate-200 text-[#1C1E59] font-black text-[10px] uppercase tracking-tighter rounded-xl shadow-sm hover:shadow-md hover:bg-slate-50 hover:border-slate-300 transition-all active:scale-95 flex items-center gap-2"
                                        >
                                          <FileText className="w-3.5 h-3.5" />
                                          Editar
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </TabsContent>

                  {/* --- CONTENIDO: GESTIÓN DE CITAS --- */}
                  <TabsContent value="gestion" className="h-full m-0 flex flex-col">
                    {!locationId ? (
                        <SelectLocationState />
                    ) : (
                      <>
                        {/* 1. TABLA DE SOLICITUDES */}
                        {gestionView === "solicitudes" && (
                          <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl overflow-hidden mx-1 mb-1">
                            <div className="flex-1 overflow-auto custom-scrollbar">
                              <Table>
                                <TableHeader className="bg-[#1C1E59] sticky top-0 z-30">
                                  <TableRow className="border-none hover:bg-transparent">
                                    <TableHead className="w-12 text-center">
                                      <input type="checkbox" className="rounded border-white/20 bg-transparent" />
                                    </TableHead>
                                    {[
                                      "ID Solicitud", "Transportadora", "Fecha Sugerida", 
                                      "Ventana Horaria", "Tipo de Carga", "Cant. Pallets", 
                                      "Estado", "Acciones"
                                    ].map((h) => (
                                      <TableHead key={h} className="text-white/90 font-bold text-[10px] uppercase tracking-wider h-11 whitespace-nowrap px-4 border-none">
                                        {h}
                                      </TableHead>
                                    ))}
                                  </TableRow>
                                </TableHeader>

                                <TableBody>
                                  {solicitudes.map((apt) => (
                                    <TableRow 
                                      key={apt.id} 
                                      className="group hover:bg-orange-50/30 transition-colors border-b border-slate-50 last:border-none h-14"
                                    >
                                      <TableCell className="text-center">
                                        <input type="checkbox" className="rounded border-slate-200" />
                                      </TableCell>
                                      <TableCell className="px-4"><span className="font-black text-[#1C1E59] text-sm italic tracking-tighter">{apt.id}</span></TableCell>
                                      <TableCell className="px-4 font-bold text-slate-700 text-xs uppercase">{apt.carrier}</TableCell>
                                      <TableCell className="px-4 text-slate-500 text-xs">{apt.date}</TableCell>
                                      <TableCell className="px-4"><Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 font-bold text-[10px]">08:00 - 10:00</Badge></TableCell>
                                      <TableCell className="px-4 text-slate-600 text-xs font-medium uppercase">{apt.loadType}</TableCell>
                                      <TableCell className="px-4 text-center font-mono font-bold text-blue-600">24</TableCell>
                                      <TableCell className="px-4"><StatusBadge status={apt.status} /></TableCell>
                                      <TableCell className="px-4 text-right">
                                        <div className="flex justify-end gap-2">
                                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 rounded-xl" onClick={() => setRequestModalAppointment(apt)}><CheckSquare className="w-4 h-4" /></Button>
                                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 rounded-xl" onClick={() => setItemAEliminar(apt)}><XCircle className="w-4 h-4" /></Button>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                  {solicitudes.length === 0 && (
                                    <TableRow><TableCell colSpan={9} className="h-32 text-center text-slate-400 italic">No hay solicitudes pendientes.</TableCell></TableRow>
                                  )}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        )}

                        {/* 2. TABLA DE CONFIRMACIÓN */}
                        {gestionView === "programadas" && (
                          <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl overflow-hidden mx-1 mb-1">
                            <div className="flex-1 overflow-auto custom-scrollbar">
                              <Table>
                                <TableHeader className="bg-[#1C1E59] sticky top-0 z-30">
                                  <TableRow className="border-none hover:bg-transparent">
                                    {["Acciones", "ID Cita", "Estado", "Tipo de Producto", "Documento", "Fecha Cita", "Hora Cita", "Proveedor", "Transportista", "Conductor", "Placa", "Vehículo", "Talleres Entrega"].map((header) => (
                                      <TableHead key={header} className="text-white/90 font-bold text-[10px] uppercase tracking-wider h-11 whitespace-nowrap px-4 border-none text-center">{header}</TableHead>
                                    ))}
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {[...Array(10)].map((_, i) => (
                                    <TableRow key={i} className="group hover:bg-blue-50/40 transition-colors border-b border-slate-50 last:border-none h-14">
                                      <TableCell className="text-center px-4"><Button size="sm" className="bg-[#378424] hover:bg-[#327D20] text-white font-black text-[10px] uppercase rounded-xl h-8 px-4 flex items-center gap-1.5 mx-auto"><Check className="w-3.5 h-3.5" /></Button></TableCell>
                                      <TableCell className="px-4 text-center"><span className="font-black text-[#1C1E59] text-sm tracking-tighter italic">APT-772{i}</span></TableCell>
                                      <TableCell className="px-4 text-center"><StatusBadge status="confirmado" /></TableCell>
                                      <TableCell className="px-4 text-slate-600 text-xs font-medium uppercase text-center">Materia Prima</TableCell>
                                      <TableCell className="px-4 text-center"><Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 font-bold text-[10px]">OC-99234</Badge></TableCell>
                                      <TableCell className="px-4 text-slate-500 text-xs text-center font-medium">26/01/2026</TableCell>
                                      <TableCell className="px-4 text-center"><div className="flex items-center justify-center gap-1.5 text-slate-500 font-medium text-xs italic"><Clock className="w-3.5 h-3.5 text-slate-300" /> 10:30 AM</div></TableCell>
                                      <TableCell className="px-4 font-bold text-slate-700 text-xs uppercase text-center">Proveedor Global</TableCell>
                                      <TableCell className="px-4 text-slate-600 text-xs font-semibold uppercase text-center">Transportes Atlas</TableCell>
                                      <TableCell className="px-4 text-slate-700 text-[11px] font-medium uppercase text-center">Ricardo M.</TableCell>
                                      <TableCell className="px-4 text-center"><span className="bg-amber-50 border border-amber-200 text-amber-800 px-2 py-0.5 rounded font-mono font-bold text-[11px] uppercase">JVW-00{i}</span></TableCell>
                                      <TableCell className="px-4 text-slate-500 text-xs text-center uppercase font-medium">Sencillo</TableCell>
                                      <TableCell className="px-4 text-center"><div className="flex items-center justify-center gap-2 text-slate-500 text-[10px] font-bold"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Bodega A</div></TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        )}

                        {/* 3. TABLA DE CANCELACIÓN */}
                        {gestionView === "cancelacion" && (
                          <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl overflow-hidden mx-1 mb-1">
                            <div className="flex-1 overflow-auto custom-scrollbar">
                              <Table>
                                <TableHeader className="bg-[#1C1E59] sticky top-0 z-30">
                                  <TableRow className="border-none hover:bg-transparent">
                                    {["Acciones", "ID Cita", "Estado", "Tipo de Producto", "Orden de Compra", "Fecha Cita", "Hora Cita", "Proveedor", "Transportista", "Conductor", "Placa", "Vehículo", "Talleres Entrega"].map((header) => (
                                      <TableHead key={header} className="text-white/90 font-bold text-[10px] uppercase tracking-wider h-11 whitespace-nowrap px-4 border-none text-center">{header}</TableHead>
                                    ))}
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {[...Array(10)].map((_, i) => (
                                    <TableRow key={i} className="group hover:bg-blue-50/40 transition-colors border-b border-slate-50 last:border-none h-14">
                                      <TableCell className="text-center px-4"><Button size="sm" className="bg-[#EC2C2C] hover:bg-[#B11C1C] text-white font-black text-[10px] uppercase rounded-xl h-8 px-4 flex items-center gap-1.5 mx-auto"><XCircle className="w-3.5 h-3.5" /></Button></TableCell>
                                      <TableCell className="px-4 text-center"><span className="font-black text-[#1C1E59] text-sm tracking-tighter italic">APT-772{i}</span></TableCell>
                                      <TableCell className="px-4 text-center"><StatusBadge status="confirmado" /></TableCell>
                                      <TableCell className="px-4 text-slate-600 text-xs font-medium uppercase text-center">Materia Prima</TableCell>
                                      <TableCell className="px-4 text-center"><Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 font-bold text-[10px]">OC-99234</Badge></TableCell>
                                      <TableCell className="px-4 text-slate-500 text-xs text-center font-medium">26/01/2026</TableCell>
                                      <TableCell className="px-4 text-center"><div className="flex items-center justify-center gap-1.5 text-slate-500 font-medium text-xs italic"><Clock className="w-3.5 h-3.5 text-slate-300" /> 10:30 AM</div></TableCell>
                                      <TableCell className="px-4 font-bold text-slate-700 text-xs uppercase text-center">Proveedor Global</TableCell>
                                      <TableCell className="px-4 text-slate-600 text-xs font-semibold uppercase text-center">Transportes Atlas</TableCell>
                                      <TableCell className="px-4 text-slate-700 text-[11px] font-medium uppercase text-center">Ricardo M.</TableCell>
                                      <TableCell className="px-4 text-center"><span className="bg-amber-50 border border-amber-200 text-amber-800 px-2 py-0.5 rounded font-mono font-bold text-[11px] uppercase">JVW-00{i}</span></TableCell>
                                      <TableCell className="px-4 text-slate-500 text-xs text-center uppercase font-medium">Sencillo</TableCell>
                                      <TableCell className="px-4 text-center"><div className="flex items-center justify-center gap-2 text-slate-500 text-[10px] font-bold"><div className="w-1.5 h-1.5 rounded-full bg-indigo-400" /> Bodega A</div></TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        )}

                        {/* 4. TABLA DE REAGENDAMIENTO */}
                        {gestionView === "reagendamiento" && (
                          <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl overflow-hidden mx-1 mb-1">
                            <div className="flex-1 overflow-auto custom-scrollbar">
                              <Table>
                                <TableHeader className="bg-[#1C1E59] sticky top-0 z-30">
                                  <TableRow className="border-none hover:bg-transparent">
                                    {["Acciones", "Solicitud", "ID Cita", "Fecha Original", "Hora Original", "Estado", "Gestión", "Proveedor", "Tipo Producto", "Orden Compra", "Cant. Unidades", "Nueva Fecha", "Nueva Hora", "Motivo"].map((header) => (
                                      <TableHead key={header} className="text-white/90 font-bold text-[10px] uppercase tracking-wider h-11 whitespace-nowrap px-4 border-none text-center">{header}</TableHead>
                                    ))}
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {[...Array(10)].map((_, i) => (
                                    <TableRow key={i} className="group hover:bg-orange-50/30 transition-colors border-b border-slate-50 last:border-none h-14">
                                      <TableCell className="text-center px-4"><Button size="sm" className="bg-[#FF6B00] hover:bg-[#e66101] text-white font-black text-[10px] uppercase rounded-xl h-8 px-4 flex items-center gap-1.5 mx-auto"><History className="w-3.5 h-3.5" /> Reagendar</Button></TableCell>
                                      <TableCell className="px-4 text-center font-bold text-slate-400 text-[11px]">#RS-992{i}</TableCell>
                                      <TableCell className="px-4 text-center"><span className="font-black text-[#1C1E59] text-sm tracking-tighter">APT-445{i}</span></TableCell>
                                      <TableCell className="px-4 text-slate-500 text-xs text-center font-medium">20/01/2026</TableCell>
                                      <TableCell className="px-4 text-center"><div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs italic"><Clock className="w-3 h-3" /> 08:00 AM</div></TableCell>
                                      <TableCell className="px-4 text-center"><StatusBadge status="retrasado" /></TableCell>
                                      <TableCell className="px-4 text-center text-slate-600 text-[11px] font-semibold uppercase">Manual</TableCell>
                                      <TableCell className="px-4 font-bold text-slate-700 text-xs uppercase tracking-tight text-center">Bayer Industrial</TableCell>
                                      <TableCell className="px-4 text-slate-500 text-xs text-center uppercase font-medium">Insumos</TableCell>
                                      <TableCell className="px-4 text-center"><Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 font-bold text-[10px]">OC-11223</Badge></TableCell>
                                      <TableCell className="px-4 text-center font-mono font-bold text-blue-600">1,250</TableCell>
                                      <TableCell className="px-4 text-[#1C1E59] text-xs text-center font-black italic">26/01/2026</TableCell>
                                      <TableCell className="px-4 text-center"><div className="flex items-center justify-center gap-1.5 text-[#1C1E59] font-black text-xs italic bg-blue-50 py-1 rounded-lg border border-blue-100">14:00 PM</div></TableCell>
                                      <TableCell className="px-4 text-left min-w-[200px]"><div className="flex items-start gap-2 text-slate-500 text-[10px] italic leading-tight"><AlertTriangle className="w-3 h-3 text-orange-400 shrink-0 mt-0.5" /> Reprogramación por retraso.</div></TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        )}

                        {/* 5. TABLA DE RECURRENCIA */}
                        {gestionView === "recurrencia" && (
                          <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl overflow-hidden mx-1 mb-1">
                            <div className="flex-1 overflow-auto custom-scrollbar">
                              <Table>
                                <TableHeader className="bg-[#1C1E59] sticky top-0 z-30">
                                  <TableRow className="border-none hover:bg-transparent">
                                    {["Unidad de negocio", "Proveedor", "Carrier", "Dirección", "Hora de la cita", "Tiempo de inicio", "Fin de la cita", "Editar", "Eliminar", "Reporte"].map((header) => (
                                      <TableHead key={header} className="text-white/90 font-bold text-[10px] uppercase tracking-wider h-11 whitespace-nowrap px-4 border-none text-center">{header}</TableHead>
                                    ))}
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {[...Array(8)].map((_, i) => (
                                    <TableRow key={i} className="group hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-none h-14">
                                      <TableCell className="px-4 text-center"><span className="font-bold text-slate-700 text-xs uppercase">Planta Bello</span></TableCell>
                                      <TableCell className="px-4 text-center"><span className="font-black text-[#1C1E59] text-[11px] uppercase tracking-tight">Colgate</span></TableCell>
                                      <TableCell className="px-4 text-center text-slate-600 text-[11px] font-semibold uppercase">Servientrega</TableCell>
                                      <TableCell className="px-4 text-center max-w-[150px] truncate"><div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] italic"><MapPin className="w-3 h-3 shrink-0" /> Calle 45</div></TableCell>
                                      <TableCell className="px-4 text-center"><div className="inline-flex items-center gap-1.5 text-[#1C1E59] font-bold text-xs bg-slate-100 px-2 py-1 rounded-lg"><Clock className="w-3.5 h-3.5" /> 07:00 AM</div></TableCell>
                                      <TableCell className="px-4 text-center text-slate-500 text-xs font-medium italic">06:45 AM</TableCell>
                                      <TableCell className="px-4 text-center text-slate-500 text-xs font-medium italic">08:30 AM</TableCell>
                                      <TableCell className="px-4 text-center"><Button size="sm" className="bg-[#FF6B00] hover:bg-[#e66101] text-white font-black text-[10px] uppercase rounded-xl h-8 px-4 flex items-center gap-1.5 mx-auto"><FileText className="w-3.5 h-3.5" /></Button></TableCell>
                                      <TableCell className="px-4 text-center"><Button variant="outline" size="icon" className="h-8 w-8 rounded-xl border-rose-100 text-rose-500 hover:bg-rose-50"><Trash2 className="w-4 h-4" /></Button></TableCell>
                                      <TableCell className="px-4 text-center"><Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-slate-400 hover:text-[#1C1E59] hover:bg-slate-100"><BarChart3 className="w-4 h-4" /></Button></TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </TabsContent>
                </div>
                
                {/* PAGINACIÓN - Solo visible si hay localidad */}
                {locationId && <TablePagination total={45} />}
            </div>

       {requestModalAppointment && (
        <RequestAppointmentModal 
          appointment={requestModalAppointment} 
          onClose={() => setRequestModalAppointment(null)} 
          onContinue={() => { 
            setCreateModalAppointment(requestModalAppointment); 
            setRequestModalAppointment(null); 
          }} 
        />
      )}

      {createModalAppointment && (
        <CreateAppointmentModal 
          appointment={createModalAppointment} 
          onClose={() => setCreateModalAppointment(null)} 
          onConfirm={() => { 
            setCreateModalAppointment(null); 
            alert("Cita creada con éxito desde la gestión de solicitudes");
          }} 
        />
      )}

      <DeleteConfirmDialog 
        isOpen={!!itemAEliminar} 
        onClose={() => setItemAEliminar(null)} 
        onConfirm={confirmarEliminacion} 
      />

        </div>
      </Tabs>
    </div>
  );
}