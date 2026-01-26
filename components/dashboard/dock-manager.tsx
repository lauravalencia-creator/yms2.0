"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  LayoutGrid, 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  Maximize2, 
  Minimize2,
  Trash2,
  Save,
  X,
  MapPin,
  User,
  Truck,
  FileText // Usamos FileText si CalendarDays falla, o el mismo CalendarIcon
} from "lucide-react";

// --- TIPOS ---
type AppointmentStatus =
  | "scheduled"
  | "in-progress"
  | "completed"
  | "delayed"
  | "pending";

type ViewMode = "grid" | "timeline";
type TimeFrame = "day" | "week" | "month";

export interface Appointment {
  id: string;
  carrier: string;
  truckId: string;
  time: string;
  type: "inbound" | "outbound";
  status: AppointmentStatus;
  locationId?: string;
  dockGroupId?: string;
  duration?: number;
  driver?: string;
  
  // Campos de información
  city?: string;
  department?: string;
  locationName?: string;
  zone?: string;
  date?: string;
  vehicleType?: string;
  loadType?: string;
  operationType?: string;
  product?: string;
}

export interface Dock {
  id: string;
  name: string;
  type: "inbound" | "outbound" | "both";
  status: "available" | "occupied" | "maintenance";
  occupancy: number; 
  currentAppointment?: Appointment;
  locationId: string;
  dockGroupId: string;
}

interface DockManagerProps {
  locationId: string | null;
  dockGroupId: string | null;
}

// --- ICONOS ---
function TruckIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 1 1 6 0h3a.75.75 0 0 0 .75-.75V15Zm8.25 0h-1.5v2.625c0 .621.504 1.125 1.125 1.125h.375a3 3 0 1 1-6 0H13.5v.75c0 .414.336.75.75.75h8.625c.621 0 1.125-.504 1.125-1.125V19.5a4.5 4.5 0 0 0-4.5-4.5h-1.5V9.75a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75v2.25H18a3 3 0 0 1 3 3v.75h.75a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-.75v.75Z" /><path d="M7.5 16.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM16.5 16.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" /></svg>;
}
function ArrowDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}><path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v16.19l6.22-6.22a.75.75 0 1 1 1.06 1.06l-7.5 7.5a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 1 1 1.06-1.06l6.22 6.22V3a.75.75 0 0 1-.75-.75Z" clipRule="evenodd" /></svg>;
}
function ArrowUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}><path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" /></svg>;
}
function WrenchIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}><path fillRule="evenodd" d="M12 6.75a5.25 5.25 0 0 1 6.775-5.025.75.75 0 0 1 .313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 0 1 1.248.313 5.25 5.25 0 0 1-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 1 1 2.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0 1 12 6.75ZM4.117 19.125a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z" clipRule="evenodd" /></svg>;
}
function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" /></svg>;
}

// --- DATOS COMPLETOS (Con nuevos campos para el modal) ---
const allDocks: Dock[] = [
  // Location 1 - Centro de Distribucion Norte
  { id: "dock-1a-1", name: "Muelle A-01", type: "inbound", status: "occupied", occupancy: 100, locationId: "loc-1", dockGroupId: "dg-1a",
    currentAppointment: { id: "apt-1", carrier: "Swift Transport", truckId: "JPM378", time: "08:30", type: "inbound", status: "in-progress", locationId: "loc-1", dockGroupId: "dg-1a", duration: 90, 
    driver: "Yuliana Perez", city: "BELLO", department: "ANTIOQUIA", locationName: "Planta Solla Bello 1405", zone: "Descargue Materia Prima", date: "MIE 19 NOV 2025", vehicleType: "Camión Sencillo - Dos Ejes", loadType: "Seca", operationType: "Descargue Materia Prima" }},
  
  { id: "dock-1a-2", name: "Muelle A-02", type: "inbound", status: "available", occupancy: 0, locationId: "loc-1", dockGroupId: "dg-1a" },
  { id: "dock-1a-3", name: "Muelle A-03", type: "inbound", status: "available", occupancy: 0, locationId: "loc-1", dockGroupId: "dg-1a" },
  
  { id: "dock-1a-4", name: "Muelle A-04", type: "inbound", status: "available", occupancy: 0, locationId: "loc-1", dockGroupId: "dg-1a",
    currentAppointment: { id: "apt-completed-1", carrier: "Historic Logistics", truckId: "TRK-OLD", time: "05:00", type: "inbound", status: "completed", locationId: "loc-1", dockGroupId: "dg-1a", duration: 120, 
    driver: "Roberto Gómez", city: "MEDELLIN", department: "ANTIOQUIA", locationName: "Centro Dist. Norte", zone: "Zona A", date: "MIE 19 NOV 2025", vehicleType: "Tractomula", loadType: "Refrigerada", operationType: "Descargue" }
  },
  
  { id: "dock-1b-1", name: "Muelle B-01", type: "inbound", status: "occupied", occupancy: 50, locationId: "loc-1", dockGroupId: "dg-1b",
    currentAppointment: { id: "apt-2", carrier: "LogiCargo", truckId: "TRK-1193", time: "09:15", type: "inbound", status: "delayed", locationId: "loc-1", dockGroupId: "dg-1b", duration: 60,
    driver: "Maria Diaz", city: "BOGOTA", department: "CUNDINAMARCA", locationName: "Bodega Central", zone: "Zona B", date: "MIE 19 NOV 2025", vehicleType: "Turbo", loadType: "Seca", operationType: "Descargue" }},
  
  { id: "dock-1b-2", name: "Muelle B-02", type: "inbound", status: "available", occupancy: 0, locationId: "loc-1", dockGroupId: "dg-1b" },
  { id: "dock-1b-3", name: "Muelle B-03", type: "inbound", status: "available", occupancy: 0, locationId: "loc-1", dockGroupId: "dg-1b" },
  
  { id: "dock-1b-4", name: "Muelle B-04", type: "inbound", status: "occupied", occupancy: 100, locationId: "loc-1", dockGroupId: "dg-1b",
    currentAppointment: { id: "apt-3", carrier: "CargoMax", truckId: "TRK-7890", time: "10:00", type: "inbound", status: "in-progress", locationId: "loc-1", dockGroupId: "dg-1b", duration: 120,
    driver: "Carlos Ruiz", city: "CALI", department: "VALLE", locationName: "Planta Sur", zone: "Zona B", date: "MIE 19 NOV 2025", vehicleType: "Doble Troque", loadType: "Granel", operationType: "Descargue" }},
  
  // Despacho
  { id: "dock-1c-1", name: "Despacho 01", type: "outbound", status: "occupied", occupancy: 100, locationId: "loc-1", dockGroupId: "dg-1c",
    currentAppointment: { id: "apt-4", carrier: "FastFreight", truckId: "TRK-7832", time: "09:00", type: "outbound", status: "in-progress", locationId: "loc-1", dockGroupId: "dg-1c", duration: 45,
    driver: "Ana Lopez", city: "BELLO", department: "ANTIOQUIA", locationName: "Planta Solla Bello 1405", zone: "Cargue Producto Terminado", date: "MIE 19 NOV 2025", vehicleType: "Camión Sencillo", loadType: "Seca", operationType: "Cargue Producto Terminado" }},
  
  { id: "dock-1c-2", name: "Despacho 02", type: "outbound", status: "available", occupancy: 0, locationId: "loc-1", dockGroupId: "dg-1c" },
  { id: "dock-1c-3", name: "Despacho 03", type: "outbound", status: "available", occupancy: 0, locationId: "loc-1", dockGroupId: "dg-1c" },
  // ... more docks
  { id: "dock-2a-1", name: "Norte 01", type: "inbound", status: "occupied", occupancy: 100, locationId: "loc-2", dockGroupId: "dg-2a",
    currentAppointment: { id: "apt-5", carrier: "TransGlobal", truckId: "TRK-9012", time: "08:00", type: "inbound", status: "in-progress", locationId: "loc-2", dockGroupId: "dg-2a", duration: 60, driver: "Pedro Sola", city: "GUADALAJARA", department: "JALISCO", locationName: "CEDIS Norte", zone: "Norte", date: "MIE 19 NOV 2025", vehicleType: "Trailer", loadType: "Seca", operationType: "Descargue" }},
  { id: "dock-2b-2", name: "Sur 02", type: "outbound", status: "occupied", occupancy: 100, locationId: "loc-2", dockGroupId: "dg-2b",
    currentAppointment: { id: "apt-7", carrier: "ExpressLine", truckId: "TRK-2345", time: "10:00", type: "outbound", status: "in-progress", locationId: "loc-2", dockGroupId: "dg-2b", duration: 90, driver: "Luisa Lane", product: "Químicos" }},
];

const pendingAppointments: Appointment[] = [
  { id: "pending-1a-1", carrier: "NuevoTransporte", truckId: "TRK-NT01", time: "12:00", type: "inbound", status: "scheduled", locationId: "loc-1", dockGroupId: "dg-1a", driver: "Pendiente", city: "BELLO", department: "ANTIOQUIA", locationName: "Planta Solla Bello 1405", zone: "Descargue", date: "MIE 19 NOV 2025", vehicleType: "Sencillo", loadType: "Seca", operationType: "Descargue" },
  { id: "pending-1a-2", carrier: "RapidoCarga", truckId: "TRK-RC02", time: "12:30", type: "inbound", status: "pending", locationId: "loc-1", dockGroupId: "dg-1b", driver: "Pendiente", city: "BELLO", department: "ANTIOQUIA", locationName: "Planta Solla Bello 1405", zone: "Descargue", date: "MIE 19 NOV 2025", vehicleType: "Sencillo", loadType: "Seca", operationType: "Descargue" },
];

// --- HELPERS ---
function getOccupancyStyle(dock: Dock, isDragging: boolean) {
  if (dock.status === "maintenance") return "border-yms-secondary/30 bg-yms-secondary/5 text-yms-secondary";
  const occupancy = dock.occupancy || 0;
  let baseStyle = occupancy >= 100 ? "bg-red-50 border-red-200 text-red-900" : occupancy >= 50 ? "bg-orange-50 border-orange-200 text-orange-900" : "bg-white border-yms-border text-yms-primary";
  if (isDragging && occupancy < 100) return cn(baseStyle, "transition-all duration-500 ease-in-out border-yms-cyan/60 ring-4 ring-yms-cyan/20 shadow-[0_0_15px_rgba(6,182,212,0.3)] scale-[1.02] animate-pulse");
  return baseStyle;
}

function getTimelineAppointmentStyle(status: AppointmentStatus) {
  if (status === 'completed') return "bg-green-100 border-green-500 text-green-800 hover:bg-green-200 cursor-pointer";
  if (status === 'in-progress' || status === 'delayed') return "bg-red-100 border-red-500 text-red-800 hover:bg-red-200 cursor-pointer";
  return "bg-slate-100 border-slate-400 text-slate-700 hover:bg-slate-200 cursor-pointer";
}

function getStatusColor(status: AppointmentStatus) {
  switch (status) {
    case "in-progress": return "bg-yms-cyan text-yms-primary";
    case "completed": return "bg-green-500 text-white";
    case "delayed": return "bg-yms-secondary text-white";
    case "scheduled": return "bg-yms-primary text-white";
    default: return "bg-yms-gray text-white";
  }
}

// --- UTILS TIMELINE ---
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const getPositionFromTime = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return ((hours + minutes / 60) / 24) * 100;
};
const getWidthFromDuration = (durationMinutes: number): number => {
  return (durationMinutes / 60 / 24) * 100;
};

// --- COMPONENTES ---

// Componente Helper para campo de información en modal
const InfoField = ({ label, value }: { label: string, value?: string }) => (
  <div>
    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">{label}</div>
    <div className="text-sm font-semibold text-gray-800 truncate" title={value}>{value || "---"}</div>
  </div>
);

function DockSlot({ dock, onDrop, isDropTarget, onDragOver, onDragLeave, onClick, isDragging }: any) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (dock.status !== "maintenance" && dock.occupancy < 100) onDragOver();
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const appointmentId = e.dataTransfer.getData("appointmentId");
    if (appointmentId && dock.status !== "maintenance" && dock.occupancy < 100) onDrop(appointmentId, dock.id);
    onDragLeave();
  };

  return (
    <div
      onClick={onClick}
      onDragOver={handleDragOver}
      onDragLeave={onDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative border-2 rounded-xl p-2.5 w-32 h-40 flex flex-col cursor-pointer",
        getOccupancyStyle(dock, isDragging),
        isDropTarget && "scale-110 shadow-[0_0_25px_rgba(6,182,212,0.6)] ring-yms-cyan ring-opacity-100 z-10 bg-yms-cyan/10"
      )}
    >
      <div className="flex items-center justify-between gap-1 mb-1.5">
        <span className="font-serif font-bold text-xs truncate">{dock.name}</span>
        {dock.status === "maintenance" && <WrenchIcon className="w-3.5 h-3.5 text-yms-secondary shrink-0" />}
      </div>
      <Badge variant="outline" className={cn("text-[9px] px-1.5 py-0.5 w-fit mb-2 border-current opacity-70", dock.type === "inbound" && "text-yms-cyan", dock.type === "outbound" && "text-yms-secondary", dock.type === "both" && "text-yms-primary")}>
        {dock.type === "both" ? "CARGUE/DESCARGUE" : dock.type === "inbound" ? "DESCARGUE" : "CARGUE"}
      </Badge>
      <div className="flex-1 flex items-center justify-center min-h-0">
        {dock.occupancy === 0 && dock.status !== "maintenance" && (
          <div className="flex flex-col items-center justify-center opacity-40">
            <div className="w-8 h-8 rounded-full border-2 border-dashed border-current flex items-center justify-center mb-1"><TruckIcon className="w-5 h-5" /></div>
            <span className="text-[10px]">Disponible</span>
          </div>
        )}
        {dock.status === "maintenance" && (
          <div className="flex flex-col items-center justify-center text-yms-secondary">
            <WrenchIcon className="w-6 h-6 mb-1" /><span className="text-[10px] font-medium text-center">Mantenimiento</span>
          </div>
        )}
        {dock.currentAppointment && (
          <div className="w-full space-y-1 overflow-hidden">
            <div className="flex items-center gap-1">
              {dock.currentAppointment.type === "inbound" ? <ArrowDownIcon className="w-3.5 h-3.5 shrink-0" /> : <ArrowUpIcon className="w-3.5 h-3.5 shrink-0" />}
              <span className="font-medium text-[11px] truncate">{dock.currentAppointment.carrier}</span>
            </div>
            <div className="text-[10px] opacity-70 truncate">{dock.currentAppointment.truckId}</div>
            <div className="text-[10px] opacity-70 flex items-center gap-1"><ClockIcon className="w-3 h-3" />{dock.currentAppointment.time}</div>
            <Badge className={cn("text-[9px] px-1.5 py-0.5 mt-1 border-none", getStatusColor(dock.currentAppointment.status))}>
                {dock.currentAppointment.status === "in-progress" ? "En Proceso" : dock.currentAppointment.status === "delayed" ? "Retrasado" : dock.currentAppointment.status === "scheduled" ? "Agendado" : dock.currentAppointment.status}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}

// --- MODAL DE INFORMACIÓN (REDISEÑADO ESTILO FICHA) ---
function AppointmentEditModal({ appointment, dockName, onClose, onSave, onDelete }: { appointment: Appointment, dockName: string, onClose: () => void, onSave: (id: string, newTime: string) => void, onDelete: (id: string) => void }) {
  const [time, setTime] = useState(appointment.time);
  const isCompleted = appointment.status === 'completed';
  
  // Colores de cabecera según estado
  const headerColor = isCompleted ? "bg-emerald-600" :
                      (appointment.status === 'in-progress' || appointment.status === 'delayed') ? "bg-rose-600" :
                      "bg-slate-600";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Cabecera con Color de Estado */}
        <div className={cn("px-6 py-4 flex justify-between items-center text-white shadow-md", headerColor)}>
          <div>
            <div className="flex items-center gap-2 mb-1">
               {appointment.type === 'inbound' ? <ArrowDownIcon className="w-5 h-5" /> : <ArrowUpIcon className="w-5 h-5" />}
               <h3 className="text-lg font-bold font-serif tracking-wide">
                  {appointment.type === 'inbound' ? 'DESCARGUE' : 'CARGUE'}
               </h3>
            </div>
            <p className="text-white/80 text-xs font-mono">ID: {appointment.id}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors bg-white/10 rounded-full p-1"><X className="w-5 h-5" /></button>
        </div>

        {/* Contenido Scrollable */}
        <div className="p-6 overflow-y-auto space-y-6">
           
           {/* Sección 1: Ubicación */}
           <div>
              <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-3">
                 <MapPin className="w-4 h-4 text-gray-500" /> Ubicación y Fecha
              </h4>
              <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                 <InfoField label="Ciudad" value={appointment.city} />
                 <InfoField label="Departamento" value={appointment.department} />
                 <InfoField label="Localidad" value={appointment.locationName} />
                 <InfoField label="Muelle Asignado" value={dockName} />
                 <div className="col-span-2">
                    <InfoField label="Zona Localidad" value={appointment.zone} />
                 </div>
              </div>
           </div>

           {/* Sección 2: Detalles Cita (Editable) */}
           <div>
              <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-3">
                 <CalendarIcon className="w-4 h-4 text-gray-500" /> Detalles de Cita
              </h4>
              <div className="grid grid-cols-2 gap-4">
                 <InfoField label="Fecha" value={appointment.date} />
                 <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Hora</div>
                    {!isCompleted ? (
                       <input 
                          type="time" 
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          className="font-bold text-gray-900 text-base bg-gray-50 border border-gray-300 rounded px-2 py-0.5 focus:outline-none focus:border-yms-primary w-full"
                       />
                    ) : (
                       <div className="text-sm font-semibold text-gray-800">{time}</div>
                    )}
                 </div>
              </div>
           </div>

           {/* Sección 3: Vehículo y Carga */}
           <div>
              <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-3">
                 <Truck className="w-4 h-4 text-gray-500" /> Vehículo y Carga
              </h4>
              <div className="grid grid-cols-2 gap-4">
                 <InfoField label="Placa" value={appointment.truckId} />
                 <InfoField label="Tipo Vehículo" value={appointment.vehicleType} />
                 <InfoField label="Tipo Carga" value={appointment.loadType} />
                 <InfoField label="Operación" value={appointment.operationType} />
              </div>
           </div>

           {/* Sección 4: Conductor */}
           <div>
              <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-3">
                 <User className="w-4 h-4 text-gray-500" /> Conductor y Empresa
              </h4>
              <div className="space-y-3">
                 <InfoField label="Nombre Conductor" value={appointment.driver} />
                 <div className="grid grid-cols-2 gap-4">
                    <InfoField label="Identificación" value="1122334455" /> {/* Mock ID */}
                    <InfoField label="Empresa Transportadora" value={appointment.carrier} />
                 </div>
              </div>
           </div>

        </div>

        {/* Footer Actions */}
        {!isCompleted && (
           <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-200 mt-auto">
              <Button 
                 variant="ghost" 
                 className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-2 h-9 px-3"
                 onClick={() => onDelete(appointment.id)}
              >
                 <Trash2 className="w-4 h-4" /> Eliminar
              </Button>
              <div className="flex gap-2">
                 <Button variant="outline" onClick={onClose} className="h-9">Cerrar</Button>
                 <Button className="bg-yms-primary gap-2 h-9 text-white hover:bg-yms-primary/90" onClick={() => onSave(appointment.id, time)}>
                    <Save className="w-4 h-4" /> Guardar
                 </Button>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}

// --- COMPONENTE TIMELINE ---
function DockTimeline({ 
  docks, 
  timeFrame, 
  highlightedDockId, 
  onAppointmentClick
}: { 
  docks: Dock[]; 
  timeFrame: TimeFrame; 
  highlightedDockId: string | null;
  onAppointmentClick: (appointment: Appointment, dockId: string, dockName: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (highlightedDockId && containerRef.current) {
      const element = containerRef.current.querySelector(`[data-dock-id="${highlightedDockId}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightedDockId]);

  if (timeFrame !== "day") {
    return (
      <div className="flex flex-col items-center justify-center h-full text-yms-gray/60 bg-slate-50 rounded-xl border border-dashed border-yms-border">
        <CalendarIcon className="w-12 h-12 mb-3 opacity-30" />
        <p>Vista de {timeFrame === "week" ? "Semana" : "Mes"} en desarrollo.</p>
        <p className="text-sm">Por favor, usa la vista de "Día" para ver la agenda horaria.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white border border-yms-border rounded-[1.5rem] overflow-hidden flex flex-col min-h-0">
      <div className="flex border-b border-yms-border bg-slate-50/80 sticky top-0 z-10">
        <div className="w-40 shrink-0 p-3 border-r border-yms-border font-bold text-xs text-yms-primary bg-slate-50/80 sticky left-0 z-20">Muelle</div>
        <div className="flex-1 overflow-hidden relative" style={{ minWidth: '1200px' }}>
          <div className="flex h-full">
            {HOURS.map((hour) => (
              <div key={hour} className="flex-1 border-r border-yms-border/50 text-[10px] text-yms-gray/60 p-1 flex justify-center items-center font-mono">
                {hour.toString().padStart(2, '0')}:00
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="overflow-auto flex-1 custom-scrollbar" ref={containerRef}>
        <div className="min-w-[1200px]">
          {docks.map((dock) => {
            const isHighlighted = dock.id === highlightedDockId;
            const rowHeaderStyle = dock.occupancy >= 100 ? "bg-red-50" : dock.occupancy >= 50 ? "bg-orange-50" : "bg-white";
            const rowBorderStyle = isHighlighted ? "border-yms-cyan/50 shadow-inner bg-yms-cyan/5" : "border-yms-border/50 hover:bg-slate-50";

            return (
              <div key={dock.id} data-dock-id={dock.id} className={cn("flex border-b transition-colors h-16 group/row", rowBorderStyle)}>
                <div className={cn("w-40 shrink-0 p-3 border-r border-yms-border sticky left-0 z-10 flex flex-col justify-center shadow-[1px_0_5px_rgba(0,0,0,0.05)]", rowHeaderStyle)}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-xs text-yms-primary truncate">{dock.name}</span>
                    <div className={cn("w-2 h-2 rounded-full", dock.status === 'maintenance' ? 'bg-gray-400' : dock.occupancy >= 100 ? 'bg-red-500' : dock.occupancy >= 50 ? 'bg-orange-400' : 'bg-green-500')} />
                  </div>
                  <div className="text-[10px] text-yms-gray uppercase opacity-70">{dock.type === 'both' ? 'IN/OUT' : dock.type === 'inbound' ? 'DESCARGUE' : 'CARGUE'}</div>
                </div>

                <div className="flex-1 relative h-full">
                  <div className="absolute inset-0 flex pointer-events-none">
                    {HOURS.map((hour) => (<div key={hour} className="flex-1 border-r border-yms-border/30 h-full" />))}
                  </div>
                  
                  {dock.currentAppointment && (
                    <div
                      onClick={() => onAppointmentClick(dock.currentAppointment!, dock.id, dock.name)}
                      className={cn(
                        "absolute top-2 bottom-2 rounded-md border text-[10px] px-2 flex flex-col justify-center shadow-sm overflow-hidden whitespace-nowrap z-0 transition-transform hover:scale-[1.02]",
                        getTimelineAppointmentStyle(dock.currentAppointment.status)
                      )}
                      style={{
                        left: `${getPositionFromTime(dock.currentAppointment.time)}%`,
                        width: `${getWidthFromDuration(dock.currentAppointment.duration || 60)}%`,
                        minWidth: '60px'
                      }}
                      title="Clic para ver detalles y editar"
                    >
                      <div className="font-bold truncate">{dock.currentAppointment.carrier}</div>
                      <div className="truncate opacity-80">{dock.currentAppointment.truckId}</div>
                    </div>
                  )}

                  {dock.status === 'maintenance' && (
                     <div className="absolute inset-y-0 left-0 right-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Ik0wIDBMNCA0Wk00IDBMMCA0WiIgc3Ryb2tlPSIjZmRiYTdIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')] opacity-50 flex items-center justify-center">
                        <span className="bg-white/80 px-2 py-0.5 rounded text-[10px] font-bold text-orange-600 border border-orange-200 shadow-sm">MANTENIMIENTO</span>
                     </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// --- MAIN COMPONENT ---
export function DockManager({ locationId, dockGroupId }: DockManagerProps) {
  const [allDocksState, setAllDocksState] = useState(allDocks);
  const [allAppointmentsState, setAllAppointmentsState] = useState(pendingAppointments);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("day");
  const [isExpanded, setIsExpanded] = useState(false);
  const [highlightedDockId, setHighlightedDockId] = useState<string | null>(null);

  // Estados para el Modal de Edición
  const [editingAppointment, setEditingAppointment] = useState<{apt: Appointment, dockId: string, dockName: string} | null>(null);

  const filteredDocks = useMemo(() => {
    if (!locationId) return [];
    let filtered = allDocksState.filter((dock) => dock.locationId === locationId);
    if (dockGroupId && dockGroupId !== "all") {
      filtered = filtered.filter((dock) => dock.dockGroupId === dockGroupId);
    }
    return filtered;
  }, [allDocksState, locationId, dockGroupId]);

  const filteredAppointments = useMemo(() => {
    if (!locationId) return [];
    let filtered = allAppointmentsState.filter((apt) => apt.locationId === locationId);
    if (dockGroupId && dockGroupId !== "all") {
      filtered = filtered.filter((apt) => apt.dockGroupId === dockGroupId);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((apt) => 
        apt.carrier.toLowerCase().includes(query) ||
        apt.truckId.toLowerCase().includes(query) ||
        apt.id.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [allAppointmentsState, locationId, dockGroupId, searchQuery]);

  const handleDrop = (appointmentId: string, dockId: string) => {
    const appointment = allAppointmentsState.find((a) => a.id === appointmentId);
    if (!appointment) return;
    setAllDocksState((prev) =>
      prev.map((dock) =>
        dock.id === dockId
          ? { ...dock, status: "occupied" as const, occupancy: 100, currentAppointment: { ...appointment, status: "in-progress" as const, duration: 60 } }
          : dock
      )
    );
    setAllAppointmentsState((prev) => prev.filter((a) => a.id !== appointmentId));
    setDraggingId(null);
    setDropTargetId(null);
    setSelectedAppointment(null);
  };

  const handleDockClick = (dockId: string) => {
    setHighlightedDockId(dockId);
    setViewMode("timeline");
    setTimeFrame("day");
  };

  // --- LOGICA DEL MODAL ---
  const handleAppointmentClick = (apt: Appointment, dockId: string, dockName: string) => {
    setEditingAppointment({ apt, dockId, dockName });
  };

  const handleSaveAppointment = (appointmentId: string, newTime: string) => {
    if (!editingAppointment) return;
    setAllDocksState((prev) => 
      prev.map((dock) => {
        if (dock.id === editingAppointment.dockId && dock.currentAppointment?.id === appointmentId) {
           return {
              ...dock,
              currentAppointment: { ...dock.currentAppointment, time: newTime }
           } as Dock;
        }
        return dock;
      })
    );
    setEditingAppointment(null);
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    if (!editingAppointment) return;
    setAllDocksState((prev) => 
      prev.map((dock) => {
        if (dock.id === editingAppointment.dockId) {
           if (dock.currentAppointment) {
             setAllAppointmentsState(prevAppts => [...prevAppts, { ...dock.currentAppointment!, status: 'pending' }]);
           }
           return { ...dock, status: "available", occupancy: 0, currentAppointment: undefined } as Dock;
        }
        return dock;
      })
    );
    setEditingAppointment(null);
  };

  if (!locationId) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-yms-primary/10 flex items-center justify-center mb-4">
           <LayoutGrid className="w-10 h-10 text-yms-primary" />
        </div>
        <h3 className="font-serif font-bold text-xl text-yms-primary mb-2">Selecciona una Localidad</h3>
        <p className="text-yms-gray max-w-md">Para visualizar y gestionar los muelles, primero selecciona una localidad en el filtro superior</p>
      </div>
    );
  }

  const expandedClasses = isExpanded ? "fixed inset-0 z-50 bg-white" : "h-full flex flex-col p-4 gap-3 overflow-hidden";

  return (
    <div className={expandedClasses}>
      {/* MODAL REDISEÑADO */}
      {editingAppointment && (
        <AppointmentEditModal 
           appointment={editingAppointment.apt} 
           dockName={editingAppointment.dockName}
           onClose={() => setEditingAppointment(null)}
           onSave={handleSaveAppointment}
           onDelete={handleDeleteAppointment}
        />
      )}

      {isExpanded && (
         <div className="p-2 border-b flex justify-end">
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)}>
               <Minimize2 className="mr-2 w-4 h-4"/> Salir de pantalla completa
            </Button>
         </div>
      )}
      
      <div className={cn("flex-1 flex gap-4 overflow-hidden min-h-0", isExpanded && "p-4")}>
        
        {/* LEFT COLUMN */}
        <div className="w-72 shrink-0 flex flex-col min-h-0">
          <div className="bg-yms-primary rounded-t-[1rem] px-4 py-2.5 flex-shrink-0">
            <h3 className="font-serif font-bold text-sm text-white">Asignaciones</h3>
          </div>

          {!selectedAppointment && (
            <div className="bg-white border-x border-b border-yms-border px-3 py-2.5 flex-shrink-0">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-yms-gray/60" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input type="text" placeholder="Buscar orden de compra..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-8 py-2 text-sm border border-yms-border rounded-lg outline-none focus:border-yms-cyan focus:ring-2 focus:ring-yms-cyan/20 transition-all" />
                {searchQuery && (<button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-yms-gray/60 hover:text-yms-primary transition-colors"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>)}
              </div>
            </div>
          )}

          <div className="flex-1 bg-white border border-t-0 border-yms-border rounded-b-[1rem] p-3 overflow-y-auto min-h-0">
            {selectedAppointment ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <button onClick={() => setSelectedAppointment(null)} className="flex items-center gap-2 text-yms-primary hover:text-yms-cyan transition-colors text-sm font-medium">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  Volver a la lista
                </button>
                <div className="bg-gradient-to-br from-yms-primary to-yms-primary/80 rounded-xl p-4 text-white shadow-lg">
                  <div className="flex items-center gap-2 mb-3">
                    {selectedAppointment.type === "inbound" ? <ArrowDownIcon className="w-5 h-5" /> : <ArrowUpIcon className="w-5 h-5" />}
                    <h4 className="font-serif font-bold text-lg">{selectedAppointment.carrier}</h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2"><svg className="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clipRule="evenodd" /><path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" /></svg><span className="opacity-80">Orden de Compra:</span><span className="font-bold">{selectedAppointment.id}</span></div>
                    <div className="flex items-center gap-2"><TruckIcon className="w-4 h-4 opacity-70" /><span className="opacity-80">Vehículo:</span><span className="font-bold">{selectedAppointment.truckId}</span></div>
                    <div className="flex items-center gap-2"><ClockIcon className="w-4 h-4 opacity-70" /><span className="opacity-80">Hora programada:</span><span className="font-bold">{selectedAppointment.time}</span></div>
                  </div>
                </div>
                <div className="space-y-3">
                   <div className="bg-gray-50 rounded-lg p-3 border border-yms-border"><p className="text-xs font-bold text-yms-gray mb-1 uppercase tracking-wide">Conductor</p><p className="text-sm text-yms-primary font-medium">{selectedAppointment.driver || "No asignado"}</p></div>
                   <div className="bg-gray-50 rounded-lg p-3 border border-yms-border"><p className="text-xs font-bold text-yms-gray mb-1 uppercase tracking-wide">Estado</p><Badge className={cn("text-xs", getStatusColor(selectedAppointment.status))}>{selectedAppointment.status}</Badge></div>
                </div>
                <div className="bg-yms-cyan/10 border border-yms-cyan/30 rounded-lg p-3 flex items-start gap-2"><svg className="w-5 h-5 text-yms-cyan shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" /></svg><p className="text-xs text-yms-primary">Arrastra esta cita desde la lista hacia un muelle disponible para asignarla</p></div>
              </div>
            ) : (
              <div className="space-y-2">
                {filteredAppointments.map((appointment) => (
                  <div key={appointment.id} onClick={() => setSelectedAppointment(appointment)} draggable onDragStart={(e) => { e.dataTransfer.setData("appointmentId", appointment.id); setDraggingId(appointment.id); }} className={cn("bg-white border border-yms-border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md hover:border-yms-cyan", draggingId === appointment.id && "opacity-50 scale-95")}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {appointment.type === "inbound" ? <ArrowDownIcon className="w-4 h-4 text-yms-cyan" /> : <ArrowUpIcon className="w-4 h-4 text-yms-secondary" />}
                        <span className="font-medium text-sm text-yms-primary">{appointment.carrier}</span>
                      </div>
                      <Badge className={cn("text-xs", getStatusColor(appointment.status))}>{appointment.status}</Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-yms-gray">
                      <span className="flex items-center gap-1"><TruckIcon className="w-3.5 h-3.5" />{appointment.truckId}</span>
                      <span className="flex items-center gap-1"><ClockIcon className="w-3.5 h-3.5" />{appointment.time}</span>
                    </div>
                  </div>
                ))}
                {filteredAppointments.length === 0 && (<div className="flex flex-col items-center justify-center h-full text-yms-gray/60 text-sm py-8"><TruckIcon className="w-8 h-8 mb-2 opacity-40" /><p>{searchQuery ? "No se encontraron resultados" : "Sin citas pendientes"}</p></div>)}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex-1 flex flex-col min-h-0 bg-white border border-yms-border rounded-[1.5rem] overflow-hidden">
           <div className="flex items-center justify-between p-3 border-b border-yms-border">
              <div className="flex items-center gap-2"><Badge variant="outline" className="bg-slate-50 text-yms-gray">{filteredDocks.length} Muelles</Badge></div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-slate-50 border border-yms-border rounded-lg p-0.5">
                  <Button size="icon" variant="ghost" className="h-7 w-7"><ChevronLeft className="w-4 h-4" /></Button>
                  <span className="font-bold text-xs text-yms-primary px-2 min-w-[30px] text-center">Hoy</span>
                  <Button size="icon" variant="ghost" className="h-7 w-7"><ChevronRight className="w-4 h-4" /></Button>
                </div>
                {viewMode === 'timeline' && (
                  <>
                    <div className="flex bg-slate-50 rounded-lg p-0.5 border border-yms-border">{(['day', 'week', 'month'] as const).map((tf) => (<button key={tf} onClick={() => setTimeFrame(tf)} className={cn("px-3 py-1 text-[10px] font-medium rounded-md transition-all", timeFrame === tf ? "bg-white text-yms-primary shadow-sm" : "text-yms-gray hover:text-yms-primary")}>{tf === 'day' ? 'Día' : tf === 'week' ? 'Semana' : 'Mes'}</button>))}</div>
                    <div className="w-px h-6 bg-yms-border" />
                  </>
                )}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                  <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="icon" className={cn("h-7 w-7 rounded-md", viewMode === 'grid' ? "bg-white text-yms-primary shadow-sm hover:bg-white" : "text-yms-gray hover:text-yms-primary")} onClick={() => setViewMode('grid')} title="Vista Cuadrícula"><LayoutGrid className="w-4 h-4" /></Button>
                  <Button variant={viewMode === 'timeline' ? 'default' : 'ghost'} size="icon" className={cn("h-7 w-7 rounded-md", viewMode === 'timeline' ? "bg-white text-yms-primary shadow-sm hover:bg-white" : "text-yms-gray hover:text-yms-primary")} onClick={() => setViewMode('timeline')} title="Vista Agenda"><CalendarIcon className="w-4 h-4" /></Button>
                  <div className="w-px h-4 bg-slate-300 mx-1"></div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md text-yms-gray hover:text-yms-primary hover:bg-white" onClick={() => setIsExpanded(!isExpanded)} title={isExpanded ? "Salir de pantalla completa" : "Pantalla completa"}>{isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}</Button>
                </div>
              </div>
           </div>

           <div className="flex-1 overflow-hidden flex flex-col min-h-0">
             {viewMode === 'grid' ? (
                <div className="flex-1 p-4 overflow-y-auto min-h-0">
                  {filteredDocks.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {filteredDocks.map((dock) => (
                        <DockSlot key={dock.id} dock={dock} isDragging={!!draggingId} onClick={() => handleDockClick(dock.id)} onDrop={handleDrop} isDropTarget={dropTargetId === dock.id} onDragOver={() => setDropTargetId(dock.id)} onDragLeave={() => setDropTargetId(null)} />
                      ))}
                    </div>
                  ) : (<div className="flex flex-col items-center justify-center h-full text-yms-gray/60"><p>No hay muelles en este grupo</p></div>)}
                </div>
             ) : (
                <DockTimeline 
                  docks={filteredDocks} 
                  timeFrame={timeFrame} 
                  highlightedDockId={highlightedDockId} 
                  onAppointmentClick={handleAppointmentClick}
                />
             )}
           </div>
        </div>
      </div>
    </div>
  );
}