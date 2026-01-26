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
  FileText,
  AlertTriangle,
  ClipboardList,
  CheckCircle2,
  Filter,
  Activity,
  ArrowDownCircle, 
  ArrowUpCircle,   
  ArrowRightLeft   
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
  
  // Campos extra
  city?: string;
  department?: string;
  locationName?: string;
  zone?: string;
  date?: string;
  vehicleType?: string;
  loadType?: string;
  operationType?: string;
  product?: string;

  // Campos Modal Solicitud
  nit?: string;
  quantityOrdered?: number;
  quantityDelivered?: number;
  
  // Campos Modal Creación
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

// --- ICONOS SVG ---
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

// --- DATOS COMPLETOS DE MUELLES (PARA TODAS LAS LOCALIDADES) ---
const allDocks: Dock[] = [
  // --- LOC-1: CENTRO DISTRIBUCION NORTE ---
  { id: "dock-1a-1", name: "Muelle A-01", type: "inbound", status: "occupied", occupancy: 100, locationId: "loc-1", dockGroupId: "dg-1a",
    currentAppointment: { id: "apt-1", carrier: "Swift Transport", truckId: "JPM378", time: "08:30", type: "inbound", status: "in-progress", locationId: "loc-1", dockGroupId: "dg-1a", duration: 90, 
    driver: "Yuliana Perez", city: "BELLO", department: "ANTIOQUIA", locationName: "Planta Solla Bello 1405", zone: "Descargue Materia Prima", date: "MIE 19 NOV 2025", vehicleType: "Camión Sencillo", loadType: "Seca", operationType: "Descargue" }},
  
  { id: "dock-1a-2", name: "Muelle A-02", type: "inbound", status: "available", occupancy: 20, locationId: "loc-1", dockGroupId: "dg-1a",
    currentAppointment: { id: "apt-gray-1", carrier: "TransFuturo", truckId: "FUT-2026", time: "14:00", type: "inbound", status: "scheduled", locationId: "loc-1", dockGroupId: "dg-1a", duration: 60,
    driver: "Esteban Quito", city: "BOGOTA", department: "CUNDINAMARCA", locationName: "Planta Norte", zone: "Zona A", date: "MIE 19 NOV 2025", vehicleType: "Tractomula", loadType: "Refrigerada", operationType: "Descargue" }},

  { id: "dock-1a-3", name: "Muelle A-03", type: "inbound", status: "available", occupancy: 0, locationId: "loc-1", dockGroupId: "dg-1a" },
  
  { id: "dock-1a-4", name: "Muelle A-04", type: "inbound", status: "available", occupancy: 15, locationId: "loc-1", dockGroupId: "dg-1a",
    currentAppointment: { id: "apt-completed-1", carrier: "Historic Logistics", truckId: "TRK-OLD", time: "05:00", type: "inbound", status: "completed", locationId: "loc-1", dockGroupId: "dg-1a", duration: 120, 
    driver: "Roberto Gómez", city: "MEDELLIN", department: "ANTIOQUIA", locationName: "Centro Dist. Norte", zone: "Zona A", date: "MIE 19 NOV 2025", vehicleType: "Tractomula", loadType: "Refrigerada", operationType: "Descargue" }
  },
  
  { id: "dock-1b-1", name: "Muelle B-01", type: "inbound", status: "occupied", occupancy: 50, locationId: "loc-1", dockGroupId: "dg-1b",
    currentAppointment: { id: "apt-2", carrier: "LogiCargo", truckId: "TRK-1193", time: "09:15", type: "inbound", status: "delayed", locationId: "loc-1", dockGroupId: "dg-1b", duration: 60,
    driver: "Maria Diaz", city: "BOGOTA", department: "CUNDINAMARCA", locationName: "Bodega Central", zone: "Zona B", date: "MIE 19 NOV 2025", vehicleType: "Turbo", loadType: "Seca", operationType: "Descargue" }},
  
  { id: "dock-1b-2", name: "Muelle B-02", type: "inbound", status: "available", occupancy: 10, locationId: "loc-1", dockGroupId: "dg-1b",
    currentAppointment: { id: "apt-gray-2", carrier: "Andina Carga", truckId: "AND-99", time: "16:30", type: "inbound", status: "pending", locationId: "loc-1", dockGroupId: "dg-1b", duration: 90,
    driver: "Julian Alvarez", city: "CALI", department: "VALLE", locationName: "Bodega B", zone: "Zona B", date: "MIE 19 NOV 2025", vehicleType: "Doble Troque", loadType: "Granel", operationType: "Descargue" }},

  { id: "dock-1b-3", name: "Muelle B-03", type: "inbound", status: "available", occupancy: 0, locationId: "loc-1", dockGroupId: "dg-1b" },
  
  { id: "dock-1b-4", name: "Muelle B-04", type: "inbound", status: "occupied", occupancy: 100, locationId: "loc-1", dockGroupId: "dg-1b",
    currentAppointment: { id: "apt-3", carrier: "CargoMax", truckId: "TRK-7890", time: "10:00", type: "inbound", status: "in-progress", locationId: "loc-1", dockGroupId: "dg-1b", duration: 120,
    driver: "Carlos Ruiz", city: "CALI", department: "VALLE", locationName: "Planta Sur", zone: "Zona B", date: "MIE 19 NOV 2025", vehicleType: "Doble Troque", loadType: "Granel", operationType: "Descargue" }},
  
  { id: "dock-1c-1", name: "Despacho 01", type: "outbound", status: "occupied", occupancy: 100, locationId: "loc-1", dockGroupId: "dg-1c",
    currentAppointment: { id: "apt-4", carrier: "FastFreight", truckId: "TRK-7832", time: "09:00", type: "outbound", status: "in-progress", locationId: "loc-1", dockGroupId: "dg-1c", duration: 45,
    driver: "Ana Lopez", city: "BELLO", department: "ANTIOQUIA", locationName: "Planta Solla Bello 1405", zone: "Cargue", date: "MIE 19 NOV 2025", vehicleType: "Camión Sencillo", loadType: "Seca", operationType: "Cargue" }},
  
  { id: "dock-1c-2", name: "Despacho 02", type: "outbound", status: "maintenance", occupancy: 100, locationId: "loc-1", dockGroupId: "dg-1c" },
  
  { id: "dock-1c-3", name: "Despacho 03", type: "outbound", status: "available", occupancy: 35, locationId: "loc-1", dockGroupId: "dg-1c",
    currentAppointment: { id: "apt-gray-3", carrier: "Envía Ya", truckId: "ENV-001", time: "11:00", type: "outbound", status: "scheduled", locationId: "loc-1", dockGroupId: "dg-1c", duration: 45,
    driver: "Pedro Picapiedra", city: "MEDELLIN", department: "ANTIOQUIA", locationName: "Despachos", zone: "Cargue", date: "MIE 19 NOV 2025", vehicleType: "Sencillo", loadType: "Paqueteo", operationType: "Cargue" } },

  { id: "dock-1d-1", name: "Mixto 01", type: "both", status: "available", occupancy: 0, locationId: "loc-1", dockGroupId: "dg-1d" },
  { id: "dock-1d-2", name: "Mixto 02", type: "both", status: "occupied", occupancy: 100, locationId: "loc-1", dockGroupId: "dg-1d",
    currentAppointment: { id: "apt-mixed-1", carrier: "InterRapidísimo", truckId: "INT-88", time: "13:00", type: "inbound", status: "in-progress", locationId: "loc-1", dockGroupId: "dg-1d", duration: 30, driver: "Luisa Lane" } },

  // --- LOC-2: ALMACEN CENTRAL GUADALAJARA ---
  { id: "dock-2a-1", name: "Norte 01", type: "inbound", status: "occupied", occupancy: 100, locationId: "loc-2", dockGroupId: "dg-2a",
    currentAppointment: { id: "apt-5", carrier: "TransGlobal", truckId: "TRK-9012", time: "08:00", type: "inbound", status: "in-progress", locationId: "loc-2", dockGroupId: "dg-2a", duration: 60, driver: "Pedro Sola" }},
  { id: "dock-2a-2", name: "Norte 02", type: "inbound", status: "available", occupancy: 0, locationId: "loc-2", dockGroupId: "dg-2a" },
  { id: "dock-2a-3", name: "Norte 03", type: "inbound", status: "available", occupancy: 0, locationId: "loc-2", dockGroupId: "dg-2a" },
  
  { id: "dock-2b-1", name: "Sur 01", type: "outbound", status: "available", occupancy: 0, locationId: "loc-2", dockGroupId: "dg-2b" },
  { id: "dock-2b-2", name: "Sur 02", type: "outbound", status: "occupied", occupancy: 100, locationId: "loc-2", dockGroupId: "dg-2b",
    currentAppointment: { id: "apt-7", carrier: "ExpressLine", truckId: "TRK-2345", time: "10:00", type: "outbound", status: "in-progress", locationId: "loc-2", dockGroupId: "dg-2b", duration: 90, driver: "Luisa Lane" }},

  // --- LOC-3: HUB LOGISTICO MONTERREY ---
  { id: "dock-3a-1", name: "Term A-01", type: "both", status: "available", occupancy: 0, locationId: "loc-3", dockGroupId: "dg-3a" },
  { id: "dock-3a-2", name: "Term A-02", type: "both", status: "maintenance", occupancy: 100, locationId: "loc-3", dockGroupId: "dg-3a" },
  { id: "dock-3b-1", name: "Term B-01", type: "both", status: "occupied", occupancy: 100, locationId: "loc-3", dockGroupId: "dg-3b",
    currentAppointment: { id: "apt-mty-1", carrier: "RegioPack", truckId: "MTY-001", time: "07:30", type: "inbound", status: "in-progress", locationId: "loc-3", dockGroupId: "dg-3b", duration: 120 } },
  { id: "dock-3c-1", name: "Refri 01", type: "inbound", status: "available", occupancy: 0, locationId: "loc-3", dockGroupId: "dg-3c" },

  // --- LOC-4: CENTRO EXPORTACION TIJUANA ---
  { id: "dock-4a-1", name: "Aduana 01", type: "outbound", status: "available", occupancy: 0, locationId: "loc-4", dockGroupId: "dg-4a" },
  { id: "dock-4b-1", name: "Cross 01", type: "both", status: "occupied", occupancy: 100, locationId: "loc-4", dockGroupId: "dg-4b",
    currentAppointment: { id: "apt-tj-1", carrier: "BorderLogistics", truckId: "USA-99", time: "11:00", type: "outbound", status: "in-progress", locationId: "loc-4", dockGroupId: "dg-4b", duration: 60 } },
];

// --- Citas pendientes ---
const pendingAppointments: Appointment[] = [
  { 
    id: "35252525", carrier: "BERHLAN DE COLOMBIA SAS", truckId: "TRN123", time: "12:00", type: "inbound", status: "pending", 
    locationId: "loc-1", dockGroupId: "dg-1a", driver: "Juan Motos", city: "BELLO", department: "ANTIOQUIA", locationName: "DICAL", zone: "Descargue", date: "MIE 19 NOV 2025", vehicleType: "Moto", loadType: "A granel", operationType: "Descargue", product: "Insumos Varios",
    nit: "9007427719", quantityOrdered: 400, quantityDelivered: 0, isReadyForAssignment: false 
  },
  { 
    id: "88997766554", carrier: "RapidoCarga", truckId: "TRK-RC02", time: "12:30", type: "inbound", status: "pending", 
    locationId: "loc-1", dockGroupId: "dg-1b", driver: "Luis Perez", city: "BELLO", department: "ANTIOQUIA", locationName: "Planta Solla", zone: "Descargue", date: "MIE 19 NOV 2025", vehicleType: "Sencillo", loadType: "Seca", operationType: "Descargue", product: "Materia Prima",
    nit: "800112233-5", quantityOrdered: 10000, quantityDelivered: 0, isReadyForAssignment: false 
  },
];

// --- HELPERS STYLES ---
function getOccupancyStyle(dock: Dock, isDragging: boolean) {
  if (dock.status === "maintenance") {
    // GRIS para mantenimiento
    return "bg-gray-100 border-gray-300 text-gray-500 shadow-sm"; 
  }
  
  const occupancy = dock.occupancy || 0;

  if (occupancy >= 100) {
    return "bg-red-50 border-red-300 text-red-900 shadow-sm"; 
  }
  
  if (occupancy > 0) {
    return "bg-orange-50 border-orange-300 text-orange-900 shadow-sm";
  }

  // Disponible (Blanco)
  if (isDragging) {
     return "bg-white border-yms-cyan/60 ring-4 ring-yms-cyan/20 shadow-[0_0_15px_rgba(6,182,212,0.3)] scale-[1.02] animate-pulse";
  }
  return "bg-white border-slate-200 text-yms-primary hover:border-yms-primary/30";
}

function getTimelineAppointmentStyle(status: AppointmentStatus) {
  if (status === 'completed') return "bg-green-100 border-green-500 text-green-800 hover:bg-green-200 cursor-pointer";
  if (status === 'in-progress' || status === 'delayed') return "bg-red-100 border-red-500 text-red-800 hover:bg-red-200 cursor-pointer";
  return "bg-slate-100 border-slate-400 text-slate-700 hover:bg-slate-200 cursor-pointer";
}

function getStatusConfig(status: AppointmentStatus) {
  const baseClasses = "text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide w-full text-center border shadow-sm";
  switch (status) {
    case "in-progress": return { label: "EN PROCESO", className: cn(baseClasses, "bg-yms-cyan text-white border-yms-cyan") };
    case "completed": return { label: "COMPLETADO", className: cn(baseClasses, "bg-green-500 text-white border-green-600") };
    case "delayed": return { label: "RETRASADO", className: cn(baseClasses, "bg-red-500 text-white border-red-600") };
    case "scheduled": return { label: "PROGRAMADO", className: cn(baseClasses, "bg-yms-primary text-white border-yms-primary") };
    case "pending": return { label: "PENDIENTE", className: cn(baseClasses, "bg-slate-200 text-slate-600 border-slate-300") };
    default: return { label: status, className: cn(baseClasses, "bg-gray-400 text-white") };
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
const InfoField = ({ label, value }: { label: string, value?: string }) => (
  <div>
    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">{label}</div>
    <div className="text-sm font-semibold text-gray-800 truncate" title={value}>{value || "---"}</div>
  </div>
);

// --- DOCK SLOT (REDISENADO SEGÚN SOLICITUD) ---
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

  const isMaintenance = dock.status === "maintenance";
  const showContent = !isMaintenance && dock.occupancy > 0;
  
  // Icono según tipo
  const TypeIcon = dock.type === "inbound" ? ArrowDownCircle : dock.type === "outbound" ? ArrowUpCircle : ArrowRightLeft;
  const iconColor = dock.type === "inbound" ? "text-yms-cyan" : dock.type === "outbound" ? "text-yms-secondary" : "text-yms-primary";

  return (
    <div
      onClick={onClick}
      onDragOver={handleDragOver}
      onDragLeave={onDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative border rounded-xl p-2.5 w-36 h-44 flex flex-col cursor-pointer transition-all shadow-sm hover:shadow-md",
        getOccupancyStyle(dock, isDragging),
        isDropTarget && "scale-105 ring-2 ring-yms-cyan ring-offset-2 z-10"
      )}
    >
      <div className="flex flex-col items-start w-full mb-2">
        {/* HEADER: ICONO + NOMBRE */}
        <div className="flex items-center gap-1.5 w-full">
             {!isMaintenance && <TypeIcon className={cn("w-4 h-4 shrink-0", iconColor)} strokeWidth={2.5} />}
             <span className={cn("font-serif font-bold text-xs truncate", isMaintenance ? "text-gray-500" : "text-[#1C1E59]")} title={dock.name}>
                {dock.name}
             </span>
             {isMaintenance && <WrenchIcon className="w-4 h-4 text-gray-400 shrink-0 ml-auto" />}
        </div>
        
        {/* SUBTITULO: FULL/PARCIAL (Solo ocupados) */}
        {!isMaintenance && dock.occupancy > 0 && (
           <div className="mt-1">
              <span className={cn("text-[10px] font-bold uppercase tracking-tight", 
                  dock.occupancy >= 100 ? "text-red-700" : "text-orange-700"
              )}>
                  {dock.occupancy >= 100 ? "FULL 100%" : `PARCIAL ${dock.occupancy}%`}
              </span>
           </div>
        )}
      </div>

      <div className="flex-1 flex flex-col justify-center min-h-0 mt-1 relative">
        {/* MANTENIMIENTO: GRIS */}
        {isMaintenance && (
          <div className="flex flex-col items-center justify-center text-gray-400 gap-1 opacity-70">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300">
               <AlertTriangle className="w-5 h-5 text-gray-500" />
            </div>
            <span className="text-[10px] font-bold text-center uppercase tracking-wider text-gray-500">En Mantenimiento</span>
          </div>
        )}

        {/* DISPONIBLE: BLANCO */}
        {!isMaintenance && dock.occupancy === 0 && (
          <div className="flex flex-col items-center justify-center opacity-30 gap-1">
            <div className="w-9 h-9 rounded-full border border-dashed border-slate-400 flex items-center justify-center">
               <TruckIcon className="w-4 h-4 text-slate-400" />
            </div>
            <span className="text-[10px] text-slate-500 font-medium">Disponible</span>
          </div>
        )}

        {/* CITA: SIN SOMBRA NI BORDES PESADOS */}
        {showContent && dock.currentAppointment && (
          <div className="w-full h-full flex flex-col animate-in fade-in duration-300">
            <div className="flex-1 bg-transparent rounded-lg p-1 flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5 pb-1 mb-1 border-b border-black/5">
                  {dock.currentAppointment.type === "inbound" ? 
                     <ArrowDownIcon className="w-3 h-3 text-yms-cyan shrink-0" /> : 
                     <ArrowUpIcon className="w-3 h-3 text-yms-secondary shrink-0" />
                  }
                  <span className="font-bold text-[10px] leading-tight truncate text-gray-800" title={dock.currentAppointment.carrier}>
                     {dock.currentAppointment.carrier}
                  </span>
                </div>
                <div className="space-y-0.5">
                   <div className="text-[9px] text-gray-600 truncate font-mono">
                      {dock.currentAppointment.truckId}
                   </div>
                   <div className="flex items-center gap-1 text-[9px] text-gray-600 font-bold">
                      <ClockIcon className="w-2.5 h-2.5 opacity-70" /> {dock.currentAppointment.time}
                   </div>
                </div>
                <div className="mt-auto pt-1">
                   {(() => {
                      const { label, className } = getStatusConfig(dock.currentAppointment.status);
                      return <div className={className}>{label}</div>;
                   })()}
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// --- MODAL 1: SOLICITUD DE CITAS (PASO 1) ---
function RequestAppointmentModal({ appointment, onClose, onContinue }: { appointment: Appointment, onClose: () => void, onContinue: () => void }) {
  // ... (código igual al anterior)
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
           <div className="flex items-center gap-3">
              <div className="bg-slate-100 p-2 rounded-lg border border-slate-200">
                <ClipboardList className="w-6 h-6 text-indigo-900" />
              </div>
              <h3 className="text-lg font-bold text-indigo-900">SOLICITUD DE CITAS</h3>
           </div>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <X className="w-6 h-6" />
           </button>
        </div>

        {/* Content */}
        <div className="p-8 bg-gray-50/50">
           <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                 <h4 className="text-sm font-bold text-indigo-900">Detalles de entrega</h4>
              </div>
              <div className="grid grid-cols-2 text-sm">
                 <div className="col-span-2 px-4 py-3 border-b border-slate-100 grid grid-cols-[140px_1fr] gap-4">
                    <span className="font-semibold text-slate-600">Orden de compra</span>
                    <span className="font-medium text-slate-900">{appointment.id}</span>
                 </div>
                 <div className="px-4 py-3 border-b border-r border-slate-100 grid grid-cols-[140px_1fr] gap-4">
                    <span className="font-semibold text-slate-600">Proveedor</span>
                    <span className="font-medium text-slate-900 uppercase">{appointment.carrier}</span>
                 </div>
                 <div className="px-4 py-3 border-b border-slate-100 grid grid-cols-[1fr_100px] gap-4">
                    <span className="font-semibold text-slate-600">Cantidad ordenada</span>
                    <span className="font-medium text-slate-900 text-right">{appointment.quantityOrdered || 0}</span>
                 </div>
                 <div className="px-4 py-3 border-b border-r border-slate-100 grid grid-cols-[140px_1fr] gap-4">
                    <span className="font-semibold text-slate-600">NIT</span>
                    <span className="font-medium text-slate-900">{appointment.nit || '---'}</span>
                 </div>
                 <div className="px-4 py-3 border-b border-slate-100 grid grid-cols-[1fr_100px] gap-4">
                    <span className="font-semibold text-slate-600 truncate">Cantidad entregada prev.</span>
                    <span className="font-medium text-slate-900 text-right">{appointment.quantityDelivered || 0}</span>
                 </div>
                 <div className="px-4 py-3 grid grid-cols-[140px_1fr] gap-4">
                    <span className="font-semibold text-slate-600">Lugar</span>
                    <span className="font-medium text-slate-900">{appointment.locationName}</span>
                 </div>
                 <div className="px-4 py-3 border-l border-slate-100 grid grid-cols-[1fr_100px] gap-4 bg-slate-50/50">
                    <span className="font-semibold text-slate-600">Cantidad por entregar</span>
                    <span className="font-bold text-orange-600 text-right">
                       {(appointment.quantityOrdered || 0) - (appointment.quantityDelivered || 0)}
                    </span>
                 </div>
              </div>
           </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-6 flex items-center gap-6 bg-white border-t">
           <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 h-10 shadow-md shadow-orange-500/20" onClick={onContinue}>
             CONTINUAR
           </Button>
           <button className="text-orange-500 font-bold text-sm hover:underline" onClick={onClose}>
             CANCELAR
           </button>
        </div>
      </div>
    </div>
  );
}

// --- MODAL 2: CREACIÓN DE CITA (PASO 2) ---
function CreateAppointmentModal({ appointment, onClose, onConfirm }: { appointment: Appointment, onClose: () => void, onConfirm: () => void }) {
  // ... (código igual al anterior)
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
              <X className="w-6 h-6" />
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
                    <span className="font-semibold text-slate-600">Orden de compra</span>
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

// --- MODAL DE EDICION (EXISTENTE) ---
function AppointmentEditModal({ 
  appointment, 
  dockName, 
  currentDockId, 
  availableDocks, 
  onClose, 
  onSave, 
  onDelete 
}: { 
  appointment: Appointment, 
  dockName: string, 
  currentDockId: string, 
  availableDocks: Dock[], 
  onClose: () => void, 
  onSave: (id: string, newTime: string, newDockId: string) => void, 
  onDelete: (id: string) => void 
}) {
  const [time, setTime] = useState(appointment.time);
  const [selectedDockId, setSelectedDockId] = useState(currentDockId);
  const isCompleted = appointment.status === 'completed';
  const headerColor = isCompleted ? "bg-emerald-600" : (appointment.status === 'in-progress' || appointment.status === 'delayed') ? "bg-rose-600" : "bg-slate-600";

  const getStatusSubtitle = (status: AppointmentStatus) => {
    if (status === 'completed') return "Cita cumplida";
    if (status === 'in-progress' || status === 'delayed') return "Cita confirmada con arribo";
    return "Cita confirmada sin arribo"; 
  };

  const dockOptions = useMemo(() => {
    return availableDocks.filter(d => 
      d.id === currentDockId || 
      (d.status !== 'maintenance' && d.occupancy < 100) 
    );
  }, [availableDocks, currentDockId]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        <div className={cn("px-6 py-4 flex justify-between items-center text-white shadow-md", headerColor)}>
          <div>
            <div className="flex items-center gap-2 mb-1">
               {appointment.type === 'inbound' ? <ArrowDownIcon className="w-5 h-5" /> : <ArrowUpIcon className="w-5 h-5" />}
               <h3 className="text-lg font-bold font-serif tracking-wide">{appointment.type === 'inbound' ? 'DESCARGUE' : 'CARGUE'}</h3>
            </div>
            <p className="text-white/90 text-sm font-medium flex items-center gap-1">{getStatusSubtitle(appointment.status)}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors bg-white/10 rounded-full p-1"><X className="w-5 h-5" /></button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
           <div>
              <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-3"><MapPin className="w-4 h-4 text-gray-500" /> Ubicación y Muelle</h4>
              <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                 <InfoField label="Ciudad" value={appointment.city} />
                 <InfoField label="Departamento" value={appointment.department} />
                 <InfoField label="Localidad" value={appointment.locationName} />
                 <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Muelle Asignado</div>
                    {!isCompleted ? (
                      <select value={selectedDockId} onChange={(e) => setSelectedDockId(e.target.value)} className="font-bold text-gray-900 text-sm bg-gray-50 border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:border-yms-primary w-full truncate">
                        {dockOptions.map(dock => (<option key={dock.id} value={dock.id}>{dock.name} {dock.occupancy > 0 && dock.id !== currentDockId ? `(Parcial: ${dock.occupancy}%)` : ''}</option>))}
                      </select>
                    ) : (
                      <div className="text-sm font-semibold text-gray-800 truncate">{dockName}</div>
                    )}
                 </div>
                 <div className="col-span-2"><InfoField label="Zona Localidad" value={appointment.zone} /></div>
              </div>
           </div>
           <div>
              <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-3"><CalendarIcon className="w-4 h-4 text-gray-500" /> Detalles de Cita</h4>
              <div className="grid grid-cols-2 gap-4">
                 <InfoField label="Fecha" value={appointment.date} />
                 <div>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">Hora Arribo</div>
                    {!isCompleted ? (
                       <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="font-bold text-gray-900 text-base bg-gray-50 border border-gray-300 rounded px-2 py-0.5 focus:outline-none focus:border-yms-primary w-full"/>
                    ) : (<div className="text-sm font-semibold text-gray-800">{time}</div>)}
                 </div>
              </div>
           </div>
           <div>
              <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-3"><Truck className="w-4 h-4 text-gray-500" /> Vehículo y Carga</h4>
              <div className="grid grid-cols-2 gap-4">
                 <InfoField label="Placa" value={appointment.truckId} />
                 <InfoField label="Tipo Vehículo" value={appointment.vehicleType} />
                 <InfoField label="Tipo Carga" value={appointment.loadType} />
                 <InfoField label="Operación" value={appointment.operationType} />
              </div>
           </div>
           <div>
              <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 border-b border-gray-100 pb-2 mb-3"><User className="w-4 h-4 text-gray-500" /> Conductor y Empresa</h4>
              <div className="space-y-3">
                 <InfoField label="Nombre Conductor" value={appointment.driver} />
                 <div className="grid grid-cols-2 gap-4"><InfoField label="Identificación" value="1122334455" /><InfoField label="Empresa Transportadora" value={appointment.carrier} /></div>
              </div>
           </div>
           <div className="pt-2 text-[10px] text-gray-400 font-mono text-right">ID Sistema: {appointment.id}</div>
        </div>
        {!isCompleted && (
           <div className="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-200 mt-auto">
              <Button variant="ghost" className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-2 h-9 px-3" onClick={() => onDelete(appointment.id)}><Trash2 className="w-4 h-4" /> Eliminar</Button>
              <div className="flex gap-2"><Button variant="outline" onClick={onClose} className="h-9">Cerrar</Button><Button className="bg-yms-primary gap-2 h-9 text-white hover:bg-yms-primary/90" onClick={() => onSave(appointment.id, time, selectedDockId)}><Save className="w-4 h-4" /> Guardar</Button></div>
           </div>
        )}
      </div>
    </div>
  );
}

// --- TIMELINE (CON LÍNEA DE HORA ACTUAL AZUL) ---
function DockTimeline({ docks, timeFrame, highlightedDockId, onAppointmentClick, currentTime }: { docks: Dock[], timeFrame: TimeFrame, highlightedDockId: string | null, onAppointmentClick: any, currentTime: Date }) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Calcular posición de la línea de tiempo (0-100%)
  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const currentPosition = (currentMinutes / 1440) * 100;

  useEffect(() => {
    if (highlightedDockId && containerRef.current) {
      const element = containerRef.current.querySelector(`[data-dock-id="${highlightedDockId}"]`);
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightedDockId]);

  if (timeFrame !== "day") return <div className="flex flex-col items-center justify-center h-full text-yms-gray/60 bg-slate-50 rounded-xl border border-dashed border-yms-border"><CalendarIcon className="w-12 h-12 mb-3 opacity-30" /><p>Vista de {timeFrame === "week" ? "Semana" : "Mes"} en desarrollo.</p></div>;

  return (
    <div className="flex-1 bg-white border border-yms-border rounded-[1.5rem] overflow-hidden flex flex-col min-h-0 relative">
      <div className="flex border-b border-yms-border bg-slate-50/80 sticky top-0 z-20">
        <div className="w-40 shrink-0 p-3 border-r border-yms-border font-bold text-xs text-yms-primary bg-slate-50/80 sticky left-0 z-20">Muelle</div>
        <div className="flex-1 overflow-hidden relative" style={{ minWidth: '1200px' }}>
          <div className="flex h-full">
            {HOURS.map((hour) => (<div key={hour} className="flex-1 border-r border-yms-border/50 text-[10px] text-yms-gray/60 p-1 flex justify-center items-center font-mono">{hour.toString().padStart(2, '0')}:00</div>))}
          </div>
          
          {/* LÍNEA DE TIEMPO ACTUAL (HEADER) - COLOR AZUL */}
          <div 
             className="absolute top-0 bottom-0 z-30 pointer-events-none flex flex-col items-center"
             style={{ left: `${currentPosition}%`, transform: 'translateX(-50%)' }}
          >
             <div className="bg-[#1C1E59] text-white text-[9px] font-bold px-1 rounded-sm mb-1 whitespace-nowrap shadow-sm">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
             </div>
             <div className="w-px h-4 bg-[#1C1E59]"></div>
          </div>
        </div>
      </div>
      
      <div className="overflow-auto flex-1 custom-scrollbar relative" ref={containerRef}>
        <div className="min-w-[1200px] relative h-full">
          
          {/* LÍNEA DE TIEMPO ACTUAL (BODY) - COLOR AZUL - SOLO UNA LÍNEA */}
          <div 
             className="absolute top-0 bottom-0 w-0.5 bg-[#1C1E59] z-30 pointer-events-none shadow-[0_0_2px_rgba(28,30,89,0.4)]"
             style={{ left: `calc(160px + (100% - 160px) * ${currentPosition / 100})` }}
          />

          {docks.map((dock: Dock) => {
            const isHighlighted = dock.id === highlightedDockId;
            const rowHeaderStyle = dock.occupancy >= 100 ? "bg-red-50" : dock.occupancy > 0 ? "bg-orange-50" : "bg-white";
            const rowBorderStyle = isHighlighted ? "border-yms-cyan/50 shadow-inner bg-yms-cyan/5" : "border-yms-border/50 hover:bg-slate-50";

            return (
              <div key={dock.id} data-dock-id={dock.id} className={cn("flex border-b transition-colors h-16 group/row relative", rowBorderStyle)}>
                <div className={cn("w-40 shrink-0 p-3 border-r border-yms-border sticky left-0 z-10 flex flex-col justify-center shadow-[1px_0_5px_rgba(0,0,0,0.05)]", rowHeaderStyle)}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-xs text-yms-primary truncate">{dock.name}</span>
                    <div className={cn("w-2 h-2 rounded-full", dock.status === 'maintenance' ? 'bg-gray-500' : dock.occupancy >= 100 ? 'bg-red-500' : dock.occupancy > 0 ? 'bg-orange-400' : 'bg-green-500')} />
                  </div>
                  <div className="text-[10px] text-yms-gray uppercase opacity-70">{dock.type === 'both' ? 'IN/OUT' : dock.type === 'inbound' ? 'DESCARGUE' : 'CARGUE'}</div>
                </div>

                <div className="flex-1 relative h-full">
                  <div className="absolute inset-0 flex pointer-events-none">
                    {HOURS.map((hour) => (<div key={hour} className="flex-1 border-r border-yms-border/30 h-full" />))}
                  </div>
                  {dock.currentAppointment && (
                    <div onClick={() => onAppointmentClick(dock.currentAppointment!, dock.id, dock.name)}
                      className={cn("absolute top-2 bottom-2 rounded-md border text-[10px] px-2 flex flex-col justify-center shadow-sm overflow-hidden whitespace-nowrap z-0 transition-transform hover:scale-[1.02]", getTimelineAppointmentStyle(dock.currentAppointment.status))}
                      style={{ left: `${getPositionFromTime(dock.currentAppointment.time)}%`, width: `${getWidthFromDuration(dock.currentAppointment.duration || 60)}%`, minWidth: '60px' }}>
                      <div className="font-bold truncate">{dock.currentAppointment.carrier}</div>
                      <div className="truncate opacity-80">{dock.currentAppointment.truckId}</div>
                    </div>
                  )}
                  {dock.status === 'maintenance' && (
                     <div className="absolute inset-y-0 left-0 right-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Ik0wIDBMNCA0Wk00IDBMMCA0WiIgc3Ryb2tlPSIjZmRiYTdIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')] opacity-50 flex items-center justify-center bg-slate-800/10">
                        <span className="bg-slate-700/80 px-2 py-0.5 rounded text-[10px] font-bold text-white border border-slate-600 shadow-sm">MANTENIMIENTO</span>
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
  
  // Estado para la hora actual
  const [currentTime, setCurrentTime] = useState<Date | null>(null);

  // Estados Modales
  const [editingAppointment, setEditingAppointment] = useState<{apt: Appointment, dockId: string, dockName: string} | null>(null);
  const [requestModalAppointment, setRequestModalAppointment] = useState<Appointment | null>(null);
  const [createModalAppointment, setCreateModalAppointment] = useState<Appointment | null>(null);

  // Efecto para el reloj en tiempo real
  useEffect(() => {
    setCurrentTime(new Date()); // Set inicial
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Actualizar cada minuto
    return () => clearInterval(timer);
  }, []);

  const filteredDocks = useMemo(() => {
    if (!locationId) return [];
    let filtered = allDocksState.filter((dock) => dock.locationId === locationId);
    if (dockGroupId && dockGroupId !== "all") filtered = filtered.filter((dock) => dock.dockGroupId === dockGroupId);
    return filtered;
  }, [allDocksState, locationId, dockGroupId]);

  const filteredAppointments = useMemo(() => {
    if (!locationId) return [];
    let filtered = allAppointmentsState.filter((apt) => apt.locationId === locationId);
    if (dockGroupId && dockGroupId !== "all") filtered = filtered.filter((apt) => apt.dockGroupId === dockGroupId);
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((apt) => apt.carrier.toLowerCase().includes(query) || apt.truckId.toLowerCase().includes(query) || apt.id.toLowerCase().includes(query));
    }
    return filtered;
  }, [allAppointmentsState, locationId, dockGroupId, searchQuery]);

  const handleDrop = (appointmentId: string, dockId: string) => {
    const appointment = allAppointmentsState.find((a) => a.id === appointmentId);
    if (!appointment) return;
    setAllDocksState((prev) =>
      prev.map((dock) =>
        dock.id === dockId ? { ...dock, status: "occupied" as const, occupancy: 100, currentAppointment: { ...appointment, status: "in-progress" as const, duration: 60 } } : dock
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

  const handleAppointmentClick = (apt: Appointment, dockId: string, dockName: string) => {
    setEditingAppointment({ apt, dockId, dockName });
  };

  const handleSaveAppointment = (appointmentId: string, newTime: string, newDockId: string) => {
    if (!editingAppointment) return;
    if (newDockId === editingAppointment.dockId) {
      setAllDocksState((prev) => 
        prev.map((dock) => dock.id === editingAppointment.dockId && dock.currentAppointment?.id === appointmentId ? { ...dock, currentAppointment: { ...dock.currentAppointment, time: newTime } } as Dock : dock)
      );
    } else {
      setAllDocksState((prev) => {
        const sourceDock = prev.find(d => d.id === editingAppointment.dockId);
        const appointmentToMove = sourceDock?.currentAppointment;
        if (!appointmentToMove) return prev;
        const updatedAppointment = { ...appointmentToMove, time: newTime };
        return prev.map((dock) => {
          if (dock.id === editingAppointment.dockId) return { ...dock, status: "available", occupancy: 0, currentAppointment: undefined } as Dock;
          if (dock.id === newDockId) return { ...dock, status: "occupied", occupancy: 100, currentAppointment: updatedAppointment } as Dock;
          return dock;
        });
      });
    }
    setEditingAppointment(null);
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    if (!editingAppointment) return;
    setAllDocksState((prev) => 
      prev.map((dock) => {
        if (dock.id === editingAppointment.dockId) {
           if (dock.currentAppointment) setAllAppointmentsState(prevAppts => [...prevAppts, { ...dock.currentAppointment!, status: 'pending', isReadyForAssignment: false }]);
           return { ...dock, status: "available", occupancy: 0, currentAppointment: undefined } as Dock;
        }
        return dock;
      })
    );
    setEditingAppointment(null);
  };

  // --- LOGICA DE FLUJO DE SOLICITUD ---
  const handleRequestClick = () => {
    if (selectedAppointment) {
       setRequestModalAppointment(selectedAppointment);
    }
  };

  const handleContinueToStep2 = () => {
    if (requestModalAppointment) {
      setCreateModalAppointment(requestModalAppointment);
      setRequestModalAppointment(null);
    }
  };

  const handleCreateAppointment = () => {
    if (!createModalAppointment) return;
    setAllAppointmentsState(prev => prev.map(a => 
       a.id === createModalAppointment.id 
          ? { ...a, isReadyForAssignment: true, status: 'scheduled' } 
          : a
    ));
    if (selectedAppointment?.id === createModalAppointment.id) {
       setSelectedAppointment(prev => prev ? { ...prev, isReadyForAssignment: true, status: 'scheduled' } : null);
    }
    setCreateModalAppointment(null);
  };

  if (!locationId) return <div className="h-full flex flex-col items-center justify-center p-8 text-center"><div className="w-20 h-20 rounded-full bg-yms-primary/10 flex items-center justify-center mb-4"><LayoutGrid className="w-10 h-10 text-yms-primary" /></div><h3 className="font-serif font-bold text-xl text-yms-primary mb-2">Selecciona una Localidad</h3></div>;

  const expandedClasses = isExpanded ? "fixed inset-0 z-50 bg-white" : "h-full flex flex-col p-4 gap-3 overflow-hidden";

  return (
    <div className={expandedClasses}>
      {/* Modales */}
      {editingAppointment && <AppointmentEditModal appointment={editingAppointment.apt} dockName={editingAppointment.dockName} currentDockId={editingAppointment.dockId} availableDocks={filteredDocks} onClose={() => setEditingAppointment(null)} onSave={handleSaveAppointment} onDelete={handleDeleteAppointment} />}
      {requestModalAppointment && <RequestAppointmentModal appointment={requestModalAppointment} onClose={() => setRequestModalAppointment(null)} onContinue={handleContinueToStep2} />}
      {createModalAppointment && <CreateAppointmentModal appointment={createModalAppointment} onClose={() => setCreateModalAppointment(null)} onConfirm={handleCreateAppointment} />}

      {isExpanded && <div className="p-2 border-b flex justify-end"><Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)}><Minimize2 className="mr-2 w-4 h-4"/> Salir de pantalla completa</Button></div>}
      
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
              </div>
            </div>
          )}
          <div className="flex-1 bg-white border border-t-0 border-yms-border rounded-b-[1rem] p-3 overflow-y-auto min-h-0">
            {selectedAppointment ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <button onClick={() => setSelectedAppointment(null)} className="flex items-center gap-2 text-yms-primary hover:text-yms-cyan transition-colors text-sm font-medium">
                  <ChevronLeft className="w-4 h-4" /> Volver a la lista
                </button>
                <div className="bg-[#1C1E59] rounded-xl p-4 text-white shadow-lg">
                  <div className="flex items-center gap-2 mb-3"><FileText className="w-5 h-5 text-orange-400" /><h4 className="font-bold text-base">{selectedAppointment.id}</h4></div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-white/10 pb-1"><span className="opacity-70">Producto:</span><span className="font-bold">{selectedAppointment.product || '---'}</span></div>
                    <div className="flex justify-between border-b border-white/10 pb-1"><span className="opacity-70">Remolque:</span><span className="font-bold">{selectedAppointment.truckId}</span></div>
                    <div className="flex justify-between border-b border-white/10 pb-1"><span className="opacity-70">Conductor:</span><span className="font-bold">{selectedAppointment.driver}</span></div>
                  </div>
                </div>
                {!selectedAppointment.isReadyForAssignment ? (
                   <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold h-10 shadow-md animate-pulse" onClick={handleRequestClick}>SOLICITAR CITA</Button>
                ) : (
                   <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex flex-col gap-2">
                      <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm"><CheckCircle2 className="w-5 h-5" /> Cita Solicitada</div>
                      <p className="text-xs text-emerald-600">Ya puedes arrastrar esta orden hacia un muelle disponible en la cuadrícula.</p>
                      <div draggable onDragStart={(e) => { e.dataTransfer.setData("appointmentId", selectedAppointment.id); setDraggingId(selectedAppointment.id); }} className="bg-white border-2 border-dashed border-emerald-400 rounded p-2 text-center text-xs text-emerald-600 font-medium cursor-grab active:cursor-grabbing hover:bg-emerald-50 transition-colors">::: Arrástrame al Muelle :::</div>
                   </div>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredAppointments.map((appointment) => (
                  <div key={appointment.id} onClick={() => setSelectedAppointment(appointment)} draggable={false} className={cn("bg-white border border-yms-border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md hover:border-yms-cyan group relative overflow-hidden", appointment.isReadyForAssignment && "border-l-4 border-l-emerald-500")}>
                    {appointment.isReadyForAssignment && <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[9px] px-1.5 py-0.5 rounded-bl font-bold">LISTA</div>}
                    <div className="flex items-start justify-between gap-2 mb-2"><span className="font-medium text-sm text-yms-primary truncate">{appointment.carrier}</span></div>
                    <div className="flex items-center gap-3 text-xs text-yms-gray"><span className="font-mono text-xs text-slate-500">OC: {appointment.id}</span></div>
                  </div>
                ))}
                {filteredAppointments.length === 0 && <div className="flex flex-col items-center justify-center h-full text-yms-gray/60 text-sm py-8"><TruckIcon className="w-8 h-8 mb-2 opacity-40" /><p>Sin citas pendientes</p></div>}
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
                
                {/* INDICADOR EN VIVO (HORA ACTUAL) */}
                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-1 animate-in fade-in">
                   <div className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                   </div>
                   <div className="flex flex-col leading-none">
                      <span className="text-[9px] font-black text-emerald-700 tracking-wide">EN VIVO</span>
                      <span className="text-[10px] font-mono text-emerald-600 font-medium">
                         {currentTime ? currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                      </span>
                   </div>
                </div>

                <div className="w-px h-6 bg-yms-border" />

                {viewMode === 'timeline' && (
                  <>
                    <div className="flex bg-slate-50 rounded-lg p-0.5 border border-yms-border">{(['day', 'week', 'month'] as const).map((tf) => (<button key={tf} onClick={() => setTimeFrame(tf)} className={cn("px-3 py-1 text-[10px] font-medium rounded-md transition-all", timeFrame === tf ? "bg-white text-yms-primary shadow-sm" : "text-yms-gray hover:text-yms-primary")}>{tf === 'day' ? 'Día' : tf === 'week' ? 'Semana' : 'Mes'}</button>))}</div>
                    <div className="w-px h-6 bg-yms-border" />
                  </>
                )}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                  <Button variant={viewMode === 'grid' ? 'default' : 'ghost'} size="icon" className={cn("h-7 w-7 rounded-md", viewMode === 'grid' ? "bg-white text-yms-primary shadow-sm hover:bg-white" : "text-yms-gray hover:text-yms-primary")} onClick={() => setViewMode('grid')}><LayoutGrid className="w-4 h-4" /></Button>
                  <Button variant={viewMode === 'timeline' ? 'default' : 'ghost'} size="icon" className={cn("h-7 w-7 rounded-md", viewMode === 'timeline' ? "bg-white text-yms-primary shadow-sm hover:bg-white" : "text-yms-gray hover:text-yms-primary")} onClick={() => setViewMode('timeline')}><CalendarIcon className="w-4 h-4" /></Button>
                  <div className="w-px h-4 bg-slate-300 mx-1"></div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md text-yms-gray hover:text-yms-primary hover:bg-white" onClick={() => setIsExpanded(!isExpanded)}>{isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}</Button>
                </div>
              </div>
           </div>

           <div className="flex-1 overflow-hidden flex flex-col min-h-0">
             {viewMode === 'grid' ? (
                <div className="flex-1 p-4 overflow-y-auto min-h-0 bg-slate-50/50">
                  {filteredDocks.length > 0 ? (
                    <div className="flex flex-wrap gap-4 content-start">
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
                   currentTime={currentTime || new Date()} 
                />
             )}
           </div>
        </div>
      </div>
    </div>
  );
}