"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  LayoutGrid, 
  Calendar as CalendarIcon, 
  ChevronRight,
  Clock,
  Maximize2, 
  Minimize2,
  Trash2,
  Save,
  X,
  MapPin,
  User,
  AlertTriangle,
  ClipboardList,
  ArrowDownCircle, 
  ArrowUpCircle,   
  ArrowRightLeft,
  Package, Search, Boxes, ArrowRight, ListFilter, 
  ChevronLeft, LayoutList, Truck, CheckCircle, Info, FileText
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// --- TIPOS (Sin cambios) ---
type AppointmentStatus = "scheduled" | "in-progress" | "completed" | "delayed" | "pending";
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

// CAMBIO 1: Renombramos la prop para aceptar un ID de muelle específico
interface DockManagerProps {
  locationId: string | null;
  selectedDockId: string | null; // Antes dockGroupId
}

// ... [Mantén aquí todas las funciones auxiliares de iconos (TruckIcon, etc.)] ...
// ... [Mantén aquí las funciones auxiliares de estilos (getOccupancyStyle, etc.)] ...
// ... [Mantén aquí la constante allDocks y pendingAppointments] ...

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

// --- DATOS COMPLETOS DE MUELLES ---
const allDocks: Dock[] = [
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
   { id: "dock-1c-4", name: "Despacho 04", type: "outbound", status: "available", occupancy: 0, locationId: "loc-1", dockGroupId: "dg-1c" },
  { id: "dock-1c-5", name: "Despacho 05", type: "outbound", status: "available", occupancy: 0, locationId: "loc-1", dockGroupId: "dg-1c" },
  { id: "dock-1c-6", name: "Despacho 06", type: "outbound", status: "available", occupancy: 0, locationId: "loc-1", dockGroupId: "dg-1c" },
    { id: "dock-1d-1", name: "Mixto 01", type: "both", status: "available", occupancy: 0, locationId: "loc-1", dockGroupId: "dg-1d" },
  { id: "dock-1d-2", name: "Mixto 02", type: "both", status: "occupied", occupancy: 100, locationId: "loc-1", dockGroupId: "dg-1d",
    currentAppointment: { id: "apt-mixed-1", carrier: "InterRapidísimo", truckId: "INT-88", time: "13:00", type: "inbound", status: "in-progress", locationId: "loc-1", dockGroupId: "dg-1d", duration: 30, driver: "Luisa Lane" } },
  { id: "dock-2a-1", name: "Norte 01", type: "inbound", status: "occupied", occupancy: 100, locationId: "loc-2", dockGroupId: "dg-2a",
    currentAppointment: { id: "apt-5", carrier: "TransGlobal", truckId: "TRK-9012", time: "08:00", type: "inbound", status: "in-progress", locationId: "loc-2", dockGroupId: "dg-2a", duration: 60, driver: "Pedro Sola" }},
  { id: "dock-2a-2", name: "Norte 02", type: "inbound", status: "available", occupancy: 0, locationId: "loc-2", dockGroupId: "dg-2a" },
  { id: "dock-2a-3", name: "Norte 03", type: "inbound", status: "available", occupancy: 0, locationId: "loc-2", dockGroupId: "dg-2a" },
  { id: "dock-2b-1", name: "Sur 01", type: "outbound", status: "available", occupancy: 0, locationId: "loc-2", dockGroupId: "dg-2b" },
  { id: "dock-2b-2", name: "Sur 02", type: "outbound", status: "occupied", occupancy: 100, locationId: "loc-2", dockGroupId: "dg-2b",
    currentAppointment: { id: "apt-7", carrier: "ExpressLine", truckId: "TRK-2345", time: "10:00", type: "outbound", status: "in-progress", locationId: "loc-2", dockGroupId: "dg-2b", duration: 90, driver: "Luisa Lane" }},
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
  if (dock.status === "maintenance") return "bg-gray-100 border-gray-300 text-gray-500 shadow-sm"; 
  if (dock.occupancy >= 100) return "bg-red-50 border-red-300 text-red-900 shadow-sm"; 
  if (dock.occupancy > 0) return "bg-orange-50 border-orange-300 text-orange-900 shadow-sm";
  if (isDragging) return "bg-white border-yms-cyan/60 ring-4 ring-yms-cyan/20 shadow-[0_0_15px_rgba(6,182,212,0.3)] scale-[1.02] animate-pulse";
  return "bg-white border-slate-200 text-yms-primary hover:border-yms-primary/30";
}

// NUEVO: Ayudante para color de columna en agenda
function getTimelineColumnColor(dock: Dock) {
  if (dock.status === "maintenance") return "bg-gray-100/40";
  if (dock.occupancy >= 100) return "bg-red-50/50";
  if (dock.occupancy > 0) return "bg-orange-50/50";
  return "bg-transparent";
}

function getTimelineAppointmentStyle(status: AppointmentStatus) {
  if (status === 'completed') return "bg-green-100 border-green-500 text-green-800 hover:bg-green-200 cursor-pointer";
  if (status === 'in-progress' || status === 'delayed') return "bg-red-100 border-red-500 text-red-800 hover:bg-red-200 cursor-pointer";
  return "bg-slate-100 border-slate-400 text-slate-700 hover:bg-slate-200 cursor-pointer";
}

function getStatusConfig(status: AppointmentStatus) {
  const baseClasses = "text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide w-full text-center border shadow-sm transition-all";
  
  switch (status) {
    case "in-progress": return { label: "EN PROCESO", className: cn(baseClasses, "bg-[#FF6C01] text-white border-[#e66101]") };
    case "completed": return { label: "COMPLETADO", className: cn(baseClasses, "bg-orange-50 text-orange-600 border-orange-200") };
    case "delayed": return { label: "RETRASADO", className: cn(baseClasses, "bg-orange-700 text-white border-orange-800") };
    case "scheduled": return { label: "PROGRAMADO", className: cn(baseClasses, "bg-orange-400 text-white border-orange-500") };
    case "pending": return { label: "PENDIENTE", className: cn(baseClasses, "bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]") };
    default: return { label: status, className: cn(baseClasses, "bg-amber-100 text-amber-700 border-amber-200") };
  }
}

// --- UTILS TIMELINE ---
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const getTopFromTime = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number);
  return ((hours * 60 + minutes) / 1440) * 100;
};
const getHeightFromDuration = (durationMinutes: number): number => {
  return (durationMinutes / 1440) * 100;
};

// --- COMPONENTES AUXILIARES (DockSlot, InfoField, Modales) ---
const InfoField = ({ label, value }: { label: string, value?: string }) => (
  <div>
    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-0.5">{label}</div>
    <div className="text-sm font-semibold text-gray-800 truncate" title={value}>{value || "---"}</div>
  </div>
);

function DockSlot({ dock, onDrop, isDropTarget, onDragOver, onDragLeave, onClick, isDragging }: any) {
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); if (dock.status !== "maintenance" && dock.occupancy < 100) onDragOver(); };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); const appointmentId = e.dataTransfer.getData("appointmentId"); if (appointmentId && dock.status !== "maintenance" && dock.occupancy < 100) onDrop(appointmentId, dock.id); onDragLeave(); };
  const isMaintenance = dock.status === "maintenance";
  const showContent = !isMaintenance && dock.occupancy > 0;
  const TypeIcon = dock.type === "inbound" ? ArrowDownCircle : dock.type === "outbound" ? ArrowUpCircle : ArrowRightLeft;
  const iconColor = dock.type === "inbound" ? "text-yms-cyan" : dock.type === "outbound" ? "text-yms-secondary" : "text-yms-primary";

  return (
    <div onClick={onClick} onDragOver={handleDragOver} onDragLeave={onDragLeave} onDrop={handleDrop} className={cn("relative border rounded-xl p-2.5 w-36 h-44 flex flex-col cursor-pointer transition-all shadow-sm hover:shadow-md", getOccupancyStyle(dock, isDragging), isDropTarget && "scale-105 ring-2 ring-yms-cyan ring-offset-2 z-10")}>
      <div className="flex flex-col items-start w-full mb-2">
        <div className="flex items-center gap-1.5 w-full">
             {!isMaintenance && <TypeIcon className={cn("w-4 h-4 shrink-0", iconColor)} strokeWidth={2.5} />}
             <span className={cn("font-serif font-bold text-xs truncate", isMaintenance ? "text-gray-500" : "text-[#1C1E59]")} title={dock.name}>{dock.name}</span>
             {isMaintenance && <WrenchIcon className="w-4 h-4 text-gray-400 shrink-0 ml-auto" />}
        </div>
        {!isMaintenance && dock.occupancy > 0 && (
           <div className="mt-1"><span className={cn("text-[10px] font-bold uppercase tracking-tight", dock.occupancy >= 100 ? "text-red-700" : "text-orange-700")}>{dock.occupancy >= 100 ? "FULL 100%" : `PARCIAL ${dock.occupancy}%`}</span></div>
        )}
      </div>
      <div className="flex-1 flex flex-col justify-center min-h-0 mt-1 relative">
        {isMaintenance && (<div className="flex flex-col items-center justify-center text-gray-400 gap-1 opacity-70"><div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300"><AlertTriangle className="w-5 h-5 text-gray-500" /></div><span className="text-[10px] font-bold text-center uppercase tracking-wider text-gray-500">En Mantenimiento</span></div>)}
        {!isMaintenance && dock.occupancy === 0 && (<div className="flex flex-col items-center justify-center opacity-30 gap-1"><div className="w-9 h-9 rounded-full border border-dashed border-slate-400 flex items-center justify-center"><TruckIcon className="w-4 h-4 text-slate-400" /></div><span className="text-[10px] text-slate-500 font-medium">Disponible</span></div>)}
        {showContent && dock.currentAppointment && (
          <div className="w-full h-full flex flex-col animate-in fade-in duration-300">
            <div className="flex-1 bg-transparent rounded-lg p-1 flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5 pb-1 mb-1 border-b border-black/5">{dock.currentAppointment.type === "inbound" ? <ArrowDownIcon className="w-3 h-3 text-yms-cyan shrink-0" /> : <ArrowUpIcon className="w-3 h-3 text-yms-secondary shrink-0" />}<span className="font-bold text-[10px] leading-tight truncate text-gray-800" title={dock.currentAppointment.carrier}>{dock.currentAppointment.carrier}</span></div>
                <div className="space-y-0.5"><div className="text-[9px] text-gray-600 truncate font-mono">{dock.currentAppointment.truckId}</div><div className="flex items-center gap-1 text-[9px] text-gray-600 font-bold"><ClockIcon className="w-2.5 h-2.5 opacity-70" /> {dock.currentAppointment.time}</div></div>
                <div className="mt-auto pt-1">{(() => { const { label, className } = getStatusConfig(dock.currentAppointment.status); return <div className={className}>{label}</div>; })()}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ... [Mantén los modales RequestAppointmentModal, CreateAppointmentModal, AppointmentEditModal, OrderDetailsTechnicalModal igual que antes] ...
// (Para ahorrar espacio, asumo que estos componentes se mantienen idénticos al código proporcionado anteriormente)

function RequestAppointmentModal({ appointment, onClose, onContinue }: { appointment: Appointment, onClose: () => void, onContinue: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b">
           <div className="flex items-center gap-3"><div className="bg-slate-100 p-2 rounded-lg border border-slate-200"><ClipboardList className="w-6 h-6 text-indigo-900" /></div><h3 className="text-lg font-bold text-indigo-900 uppercase">SOLICITUD DE CITAS</h3></div>
           <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
        </div>
        <div className="p-8 bg-gray-50/50">
           <div className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-200"><h4 className="text-sm font-bold text-indigo-900 uppercase">Detalles de entrega</h4></div>
              <div className="grid grid-cols-2 text-sm">
                 <div className="col-span-2 px-4 py-3 border-b border-slate-100 grid grid-cols-[140px_1fr] gap-4"><span className="font-semibold text-slate-600">Documento</span><span className="font-medium text-slate-900">{appointment.id}</span></div>
                 <div className="px-4 py-3 border-b border-r border-slate-100 grid grid-cols-[140px_1fr] gap-4"><span className="font-semibold text-slate-600">Proveedor</span><span className="font-medium text-slate-900 uppercase">{appointment.carrier}</span></div>
                 <div className="px-4 py-3 border-b border-slate-100 grid grid-cols-[1fr_100px] gap-4"><span className="font-semibold text-slate-600">Cantidad ordenada</span><span className="font-medium text-slate-900 text-right">{appointment.quantityOrdered || 0}</span></div>
                 <div className="px-4 py-3 border-b border-r border-slate-100 grid grid-cols-[140px_1fr] gap-4"><span className="font-semibold text-slate-600">NIT</span><span className="font-medium text-slate-900">{appointment.nit || '---'}</span></div>
                 <div className="px-4 py-3 border-b border-slate-100 grid grid-cols-[1fr_100px] gap-4"><span className="font-semibold text-slate-600 truncate">Cantidad entregada prev.</span><span className="font-medium text-slate-900 text-right">{appointment.quantityDelivered || 0}</span></div>
                 <div className="px-4 py-3 grid grid-cols-[140px_1fr] gap-4"><span className="font-semibold text-slate-600">Lugar</span><span className="font-medium text-slate-900">{appointment.locationName}</span></div>
                 <div className="px-4 py-3 border-l border-slate-100 grid grid-cols-[1fr_100px] gap-4 bg-slate-50/50"><span className="font-semibold text-slate-600 px-4">CANTIDAD POR ENTREGAR</span><span className="font-bold text-orange-600 text-right px-4">{(appointment.quantityOrdered || 0) - (appointment.quantityDelivered || 0)}</span></div>
              </div>
           </div>
        </div>
        <div className="px-8 py-6 flex items-center gap-6 bg-white border-t">
           <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 h-10 shadow-md shadow-orange-500/20" onClick={onContinue}>CONTINUAR</Button>
           <button className="text-orange-500 font-bold text-sm hover:underline" onClick={onClose}>CANCELAR</button>
        </div>
      </div>
    </div>
  );
}


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
  
  // Lógica de colores según estado
  const isCompleted = appointment.status === 'completed';
  const isInProgressOrDelayed = appointment.status === 'in-progress' || appointment.status === 'delayed';
  
  const headerColor = isCompleted 
    ? "bg-emerald-600" 
    : isInProgressOrDelayed 
      ? "bg-rose-600" 
      : "bg-slate-600";

  const getStatusSubtitle = (status: AppointmentStatus) => {
    if (status === 'completed') return "Cita cumplida exitosamente";
    if (status === 'in-progress') return "Operación en curso";
    if (status === 'delayed') return "Operación retrasada";
    return "Cita confirmada sin arribo"; 
  };

  // Filtramos los muelles para mostrar el actual + los disponibles
  const dockOptions = useMemo(() => {
    return availableDocks.filter(d => 
      d.id === currentDockId || 
      (d.status !== 'maintenance' && d.occupancy < 100) 
    );
  }, [availableDocks, currentDockId]);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* --- ENCABEZADO CON COLOR DINÁMICO --- */}
        <div className={cn("px-6 py-4 flex justify-between items-center text-white shadow-md relative overflow-hidden", headerColor)}>
          {/* Decoración de fondo */}
          <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-2">
            {appointment.type === 'inbound' ? <ArrowDownIcon className="w-24 h-24" /> : <ArrowUpIcon className="w-24 h-24" />}
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
               {appointment.type === 'inbound' 
                 ? <ArrowDownIcon className="w-5 h-5 text-white/90" /> 
                 : <ArrowUpIcon className="w-5 h-5 text-white/90" />
               }
               <h3 className="text-lg font-black font-serif tracking-wide uppercase">
                 {appointment.type === 'inbound' ? 'DESCARGUE' : 'CARGUE'}
               </h3>
            </div>
            <p className="text-white/90 text-xs font-medium flex items-center gap-1 uppercase tracking-wider">
              {getStatusSubtitle(appointment.status)}
            </p>
          </div>
          <button onClick={onClose} className="relative z-10 text-white/70 hover:text-white transition-colors bg-black/10 hover:bg-black/20 rounded-full p-1.5">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* --- CUERPO DEL MODAL --- */}
        <div className="p-6 overflow-y-auto space-y-6 bg-slate-50/50">
           
           {/* SECCIÓN 1: UBICACIÓN Y MUELLE */}
           <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <h4 className="flex items-center gap-2 text-xs font-black text-[#1C1E59] uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                <MapPin className="w-4 h-4 text-slate-400" /> Ubicación y Muelle
              </h4>
              <div className="grid grid-cols-2 gap-y-4 gap-x-4">
                 <InfoField label="Ciudad" value={appointment.city || "Bello"} />
                 <InfoField label="Departamento" value={appointment.department || "Antioquia"} />
                 <div className="col-span-2">
                    <InfoField label="Localidad" value={appointment.locationName || "Planta Principal"} />
                 </div>
                 
                 {/* SELECTOR DE MUELLE */}
                 <div className="col-span-2 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Muelle Asignado</div>
                    {!isCompleted ? (
                      <select 
                        value={selectedDockId} 
                        onChange={(e) => setSelectedDockId(e.target.value)} 
                        className="font-bold text-[#1C1E59] text-sm bg-white border border-slate-300 rounded-md px-3 py-2 focus:outline-none focus:border-orange-500 w-full shadow-sm transition-all"
                      >
                        {dockOptions.map(dock => (
                          <option key={dock.id} value={dock.id}>
                            {dock.name} {dock.occupancy > 0 && dock.id !== currentDockId ? `(Ocupado: ${dock.occupancy}%)` : ''}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <div className="text-sm font-bold text-slate-700 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        {dockName}
                      </div>
                    )}
                 </div>
              </div>
           </div>

           {/* SECCIÓN 2: DETALLES DE CITA */}
           <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <h4 className="flex items-center gap-2 text-xs font-black text-[#1C1E59] uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                <CalendarIcon className="w-4 h-4 text-slate-400" /> Detalles de Tiempo
              </h4>
              <div className="grid grid-cols-2 gap-4">
                 <InfoField label="Fecha Programada" value={appointment.date || "Hoy"} />
                 
                 {/* SELECTOR DE HORA */}
                 <div>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">Hora Estimada</div>
                    {!isCompleted ? (
                       <div className="relative">
                         <input 
                           type="time" 
                           value={time} 
                           onChange={(e) => setTime(e.target.value)} 
                           className="font-bold text-[#1C1E59] text-base bg-white border border-slate-300 rounded-md px-3 py-1.5 focus:outline-none focus:border-orange-500 w-full shadow-sm"
                         />
                         <Clock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                       </div>
                    ) : (
                      <div className="text-sm font-bold text-slate-800">{time}</div>
                    )}
                 </div>
              </div>
           </div>

           {/* SECCIÓN 3: VEHÍCULO Y CONDUCTOR */}
           <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <h4 className="flex items-center gap-2 text-xs font-black text-[#1C1E59] uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                <Truck className="w-4 h-4 text-slate-400" /> Transporte
              </h4>
              <div className="grid grid-cols-2 gap-4 mb-4">
                 <InfoField label="Placa Vehículo" value={appointment.truckId} />
                 <InfoField label="Tipo Carga" value={appointment.loadType || "General"} />
              </div>
              <div className="space-y-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                 <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-500 uppercase">Información del Conductor</span>
                 </div>
                 <div className="grid grid-cols-1 gap-2">
                    <div className="text-sm font-bold text-[#1C1E59]">{appointment.driver || "No asignado"}</div>
                    <div className="text-xs text-slate-500 font-medium">{appointment.carrier}</div>
                 </div>
              </div>
           </div>

           <div className="pt-2 text-[10px] text-slate-300 font-mono text-center">ID Sistema: {appointment.id}</div>
        </div>

        {/* --- FOOTER DE ACCIONES --- */}
        {!isCompleted && (
           <div className="bg-white px-6 py-4 flex justify-between items-center border-t border-slate-100 mt-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
              <Button 
                variant="ghost" 
                className="text-red-500 hover:text-red-700 hover:bg-red-50 gap-2 h-10 px-4 rounded-xl transition-all" 
                onClick={() => onDelete(appointment.id)}
              >
                <Trash2 className="w-4 h-4" /> Eliminar
              </Button>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={onClose} 
                  className="h-10 px-6 rounded-xl border-slate-200 text-slate-600 font-bold uppercase text-xs hover:bg-slate-50"
                >
                  Cancelar
                </Button>
                <Button 
                  className="bg-[#ff6b00] hover:bg-[#e66000] text-white gap-2 h-10 px-6 rounded-xl font-bold uppercase text-xs shadow-lg shadow-orange-200 transition-all active:scale-95" 
                  onClick={() => onSave(appointment.id, time, selectedDockId)}
                >
                  <Save className="w-4 h-4" /> Guardar Cambios
                </Button>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}

// Debes asegurarte de que este modal reciba también la función onOpenRequest
// para poder abrir el flujo de solicitud desde aquí.

function OrderDetailsTechnicalModal({ 
  appointment, 
  onClose, 
  onRequestAppointment 
}: { 
  appointment: Appointment, 
  onClose: () => void, 
  onRequestAppointment: () => void 
}) {
  const DataItem = ({ label, value }: { label: string, value: any }) => (
    <div className="flex flex-col py-1.5 border-b border-slate-50 last:border-0 group">
      <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter group-hover:text-[#ff6b00] transition-colors">{label}</span>
      <span className="text-[11px] font-bold text-slate-700 truncate">{value}</span>
    </div>
  );

  return (
    <Dialog open={!!appointment} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden border-none rounded-[2rem] shadow-2xl bg-white">
        <DialogHeader className="sr-only">
          <DialogTitle>Detalles Técnicos OC: {appointment.id}</DialogTitle>
        </DialogHeader>

        {/* Cabecera compacta */}
        <div className="bg-[#1C1E59] px-6 py-4 text-white flex justify-between items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5"><FileText size={100} /></div>
          <div className="relative z-10 flex items-center gap-3">
             <div className="p-2 bg-white/10 rounded-xl"><LayoutList size={18} className="text-orange-400" /></div>
             <div>
                <p className="text-[9px] font-bold text-orange-400 uppercase tracking-[0.2em] leading-none">Maestro de Documento</p>
                <h3 className="text-lg font-black mt-1">OC: {appointment.id}</h3>
             </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white transition-colors z-20 p-2 hover:bg-white/10 rounded-full">
            <X size={20} />
          </button>
        </div>

        {/* Cuerpo con datos poblados */}
        <div className="p-8 bg-white grid grid-cols-3 gap-x-10 gap-y-2">
          <div className="space-y-1">
            <DataItem label="Producto" value={appointment.product || "INSUMOS VARIOS"} />
            <DataItem label="Nit Proveedor" value={appointment.nit || "900742771-9"} />
            <DataItem label="Descripción Company" value={appointment.descripcionCompany || "Logística Integral SAS"} />
            <DataItem label="Estado Documento" value="ACTIVO" />
            <DataItem label="Localidad" value={appointment.unidadNegocio || "CENTRO DISTRIBUCIÓN NORTE"} />
            <DataItem label="Canal" value={appointment.canal || "MODERNO"} />
          </div>
          <div className="space-y-1 border-x border-slate-100 px-6">
            <DataItem label="Fecha Inicio" value={appointment.date || "27/01/2026"} />
            <DataItem label="Fecha Fin" value={appointment.date || "29/01/2026"} />
            <DataItem label="Tipo de Operación" value={appointment.operationType || "DESCARGUE"} />
            <DataItem label="Tipo Mercancía" value={appointment.tipoMercancia || "GENERAL NO PERECEDERA"} />
            <DataItem label="Tipo de Cargue" value={appointment.loadType || "A GRANEL"} />
            <DataItem label="Código Artículo" value={appointment.codigoArticulo || "SKU-882910"} />
          </div>
          <div className="space-y-1">
            <DataItem label="Peso" value={appointment.peso || "1,240.00 KG"} />
            <DataItem label="Volumen" value={appointment.volumen || "4.50 M3"} />
            <DataItem label="Litros" value={appointment.litros || "0.00"} />
            <DataItem label="Cantidad Pedida" value={appointment.quantityOrdered || "400"} />
            <DataItem label="Cantidad Recibida" value={appointment.quantityDelivered || "0"} />
            <DataItem label="U. Medida" value={appointment.unidadMedida || "UNIDADES (UND)"} />
          </div>
        </div>

        {/* FOOTER CON DOS BOTONES */}
        <div className="p-6 bg-slate-50/50 flex justify-end gap-3 rounded-b-[2rem] border-t border-slate-100">
          
          {/* BOTÓN SOLICITAR CITA (NUEVO) */}
          {/* Solo mostramos este botón si la cita aún no está lista/asignada */}
          {!appointment.isReadyForAssignment && (
            <Button 
              onClick={() => {
                onClose(); // Cerramos este modal primero
                onRequestAppointment(); // Abrimos el flujo de solicitud
              }} 
              className="bg-[#FF6C01] hover:bg-[#e66000] text-white text-[10px] font-bold uppercase px-8 rounded-2xl h-12 shadow-lg shadow-orange-500/20 transition-all active:scale-95"
            >
              Solicitar Cita
            </Button>
          )}

          {/* BOTÓN CERRAR DETALLE */}
          <Button onClick={onClose} className="bg-[#1C1E59] hover:bg-[#25286e] text-white text-[10px] font-bold uppercase px-8 rounded-2xl h-12 shadow-xl shadow-blue-900/20 transition-all active:scale-95">
            Cerrar Detalle
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function DockTimeline({ 
  docks, 
  timeFrame, 
  highlightedDockId, 
  onAppointmentClick, 
  currentTime 
}: { 
  docks: Dock[], 
  timeFrame: TimeFrame, 
  highlightedDockId: string | null, 
  onAppointmentClick: any, 
  currentTime: Date 
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dockStartIndex, setDockStartIndex] = useState(0);
  const docksPerPage = 5;
  const [selectedDockForWeek, setSelectedDockForWeek] = useState<string | null>(null);

  const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();
  const currentPosition = (currentMinutes / 1440) * 100;

  // -- VISTA MENSUAL --
  if (timeFrame === "month") {
    const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
    return (
      <div className="flex flex-col h-full bg-slate-50 p-4 overflow-auto">
         <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-300 rounded-lg overflow-hidden shadow-sm">
             {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(d => (
                <div key={d} className="bg-slate-100 p-2 text-center text-xs font-bold text-gray-500 uppercase">{d}</div>
             ))}
             {daysInMonth.map(day => (
                <div key={day} className="bg-white h-24 p-2 relative hover:bg-slate-50 transition-colors">
                   <span className="text-xs font-bold text-gray-400">{day}</span>
                   {day === 19 && (<div className="mt-1 space-y-1"><div className="text-[9px] bg-yms-cyan/10 text-yms-cyan rounded px-1 py-0.5 truncate font-medium border border-yms-cyan/20">3 Citas</div></div>)}
                </div>
             ))}
         </div>
      </div>
    );
  }

  // -- VISTA SEMANA --
  if (timeFrame === "week") {
    const activeDockId = selectedDockForWeek || highlightedDockId || docks[0]?.id;
    const activeDock = docks.find(d => d.id === activeDockId) || docks[0];
    const weekDays = ["Lun 17", "Mar 18", "Mié 19", "Jue 20", "Vie 21", "Sáb 22", "Dom 23"];

    return (
      <div className="flex flex-col h-full bg-white relative">
         <div className="flex items-center justify-between p-2 border-b border-slate-200 bg-slate-50/50">
             <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-gray-500 uppercase">Muelle:</span>
                <select className="text-sm font-bold text-indigo-900 bg-transparent border-none focus:ring-0 cursor-pointer" value={activeDock?.id} onChange={(e) => setSelectedDockForWeek(e.target.value)}>
                   {docks.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
             </div>
         </div>
         <div className="flex border-b border-slate-200 sticky top-0 bg-white z-20 shadow-sm">
             <div className="w-16 shrink-0 border-r border-slate-200 p-2 bg-slate-50"></div>
             {weekDays.map((day, idx) => (
                <div key={day} className={cn("flex-1 text-center py-2 text-xs font-bold border-r border-slate-100", idx === 2 ? "bg-blue-50 text-blue-700" : "text-gray-600")}>{day}</div>
             ))}
         </div>
         <div className="flex-1 overflow-y-auto relative custom-scrollbar h-[600px]">
            <div className="flex relative min-h-[1200px]">
                <div className="w-16 shrink-0 border-r border-slate-200 bg-slate-50 text-xs text-gray-400 font-mono text-right pr-2 pt-2 relative">
                   {HOURS.map(h => (<div key={h} className="absolute w-full pr-2" style={{ top: `${(h/24)*100}%` }}>{h.toString().padStart(2,'0')}:00</div>))}
                </div>
                {weekDays.map((day, idx) => (
                   <div key={day} className={cn("flex-1 border-r border-slate-100 relative", idx === 2 ? "bg-blue-50/30" : getTimelineColumnColor(activeDock))}>
                      {HOURS.map(h => <div key={h} className="absolute w-full border-b border-slate-100" style={{ top: `${(h/24)*100}%` }}></div>)}
                      {idx === 2 && activeDock?.currentAppointment && (
                        <div onClick={() => onAppointmentClick(activeDock.currentAppointment!, activeDock.id, activeDock.name)} className={cn("absolute left-1 right-1 rounded border p-1 shadow-sm text-[10px] flex flex-col justify-center overflow-hidden hover:scale-[1.02] transition-transform z-10 cursor-pointer", getTimelineAppointmentStyle(activeDock.currentAppointment.status))} style={{ top: `${getTopFromTime(activeDock.currentAppointment.time)}%`, height: `${getHeightFromDuration(activeDock.currentAppointment.duration || 60)}%`, minHeight: '24px' }}>
                           <div className="font-bold truncate leading-tight">{activeDock.currentAppointment.carrier}</div>
                           <div className="opacity-80 truncate">{activeDock.currentAppointment.truckId}</div>
                        </div>
                      )}
                   </div>
                ))}
            </div>
         </div>
      </div>
    );
  }

  // -- VISTA DÍA (VERTICAL) --
  const visibleDocks = docks.slice(dockStartIndex, dockStartIndex + docksPerPage);
  const canGoLeft = dockStartIndex > 0;
  const canGoRight = dockStartIndex + docksPerPage < docks.length;

  return (
    <div className="flex flex-col h-full bg-white relative">
      <div className="flex border-b border-slate-200 sticky top-0 bg-white z-20 shadow-sm h-14">
        <div className="w-16 shrink-0 border-r border-slate-200 bg-slate-50 flex items-center justify-center">
           <Clock className="w-4 h-4 text-slate-300" />
        </div>

        <div className="flex-1 flex relative overflow-hidden">
           {canGoLeft && (
             <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-30 flex items-center justify-start pl-1">
                <button onClick={() => setDockStartIndex(prev => Math.max(0, prev - 1))} className="bg-white shadow border rounded-full p-1 hover:bg-slate-50 text-slate-600"><ChevronLeft className="w-3 h-3"/></button>
             </div>
           )}

           {visibleDocks.map((dock) => {
              const isMaintenance = dock.status === 'maintenance';
              return (
                <div key={dock.id} className="flex-1 min-w-[120px] border-r border-slate-200 flex flex-col items-center justify-center p-1 bg-slate-50/50">
                   <div className="flex items-center gap-1.5 w-full justify-center">
                      <span className={cn("font-bold text-xs truncate", isMaintenance ? "text-gray-400" : "text-indigo-900")}>{dock.name}</span>
                      <div className={cn("w-2 h-2 rounded-full shrink-0", isMaintenance ? 'bg-gray-400' : dock.occupancy >= 100 ? 'bg-red-500' : dock.occupancy > 0 ? 'bg-orange-400' : 'bg-green-500')} />
                   </div>
                   <div className={cn("text-[9px] font-bold uppercase tracking-tighter", 
                      isMaintenance ? "text-gray-500" : 
                      dock.occupancy >= 100 ? "text-red-600" : 
                      dock.occupancy > 0 ? "text-orange-600" : "text-green-600")}>
                      {isMaintenance ? "Mantenimiento" : dock.occupancy >= 100 ? "FULL 100%" : dock.occupancy > 0 ? `PARCIAL ${dock.occupancy}%` : "Disponible"}
                   </div>
                </div>
              );
           })}

           {canGoRight && (
             <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-30 flex items-center justify-end pr-1">
                <button onClick={() => setDockStartIndex(prev => Math.min(docks.length - docksPerPage, prev + 1))} className="bg-white shadow border rounded-full p-1 hover:bg-slate-50 text-slate-600"><ChevronRight className="w-3 h-3"/></button>
             </div>
           )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto relative custom-scrollbar h-[600px]" ref={containerRef}>
         <div className="flex relative min-h-[1440px]"> 
            <div className="w-16 shrink-0 border-r border-slate-200 bg-slate-50/50 relative">
               {HOURS.map((hour) => (
                  <div key={hour} className="absolute w-full text-right pr-2 text-[10px] text-gray-400 font-mono -mt-1.5" style={{ top: `${(hour / 24) * 100}%` }}>{hour.toString().padStart(2, '0')}:00</div>
               ))}
            </div>

            <div className="flex-1 flex relative">
               <div className="absolute inset-0 z-0 pointer-events-none">
                  {HOURS.map((hour) => (<div key={hour} className="absolute w-full border-b border-slate-100" style={{ top: `${(hour / 24) * 100}%` }}></div>))}
               </div>
               {visibleDocks.map((dock) => (
                  <div key={dock.id} className={cn("flex-1 min-w-[120px] border-r border-slate-100 relative z-10 transition-colors group", getTimelineColumnColor(dock))}>
                     {dock.status === 'maintenance' && (<div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIi8+CjxwYXRoIGQ9Ik0wIDBMNCA0Wk00IDBMMCA0WiIgc3Ryb2tlPSIjZTJlOGYwIiBzdHJva2Utd2lkdGg9IjEiLz4KPC9zdmc+')] opacity-50"></div>)}
                     {dock.currentAppointment && (
                        <div onClick={() => onAppointmentClick(dock.currentAppointment!, dock.id, dock.name)} className={cn("absolute left-1 right-1 rounded border p-1.5 shadow-sm text-[10px] flex flex-col justify-start overflow-hidden hover:scale-[1.02] hover:z-20 transition-all cursor-pointer group-hover:shadow-md", getTimelineAppointmentStyle(dock.currentAppointment.status))} style={{ top: `${getTopFromTime(dock.currentAppointment.time)}%`, height: `${getHeightFromDuration(dock.currentAppointment.duration || 60)}%`, minHeight: '28px' }}>
                           <div className="font-bold text-xs truncate text-indigo-950/90 mb-0.5">{dock.currentAppointment.carrier}</div>
                           <div className="flex items-center gap-1 opacity-80 truncate mb-0.5"><Truck className="w-3 h-3" /><span className="truncate">{dock.currentAppointment.truckId}</span></div>
                        </div>
                     )}
                  </div>
               ))}
               <div className="absolute left-0 right-0 border-t-2 border-blue-600 z-30 pointer-events-none shadow-[0_2px_4px_rgba(37,99,235,0.2)]" style={{ top: `${currentPosition}%` }}>
                  <div className="absolute -left-16 -top-2.5 w-16 text-[10px] font-bold text-white bg-blue-600 px-1 rounded-r py-0.5 text-center shadow-sm">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}

// --- MAIN COMPONENT ---
export function DockManager({ locationId, selectedDockId }: DockManagerProps) {
  const [isTechnicalModalOpen, setIsTechnicalModalOpen] = useState(false);
  const [allDocksState, setAllDocksState] = useState(allDocks);
  const [allAppointmentsState, setAllAppointmentsState] = useState(pendingAppointments);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  
  // CAMBIO 2: Lógica de vista automática
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("day");
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [highlightedDockId, setHighlightedDockId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [editingAppointment, setEditingAppointment] = useState<any>(null);
  const [requestModalAppointment, setRequestModalAppointment] = useState<any>(null);
  const [createModalAppointment, setCreateModalAppointment] = useState<any>(null);

  useEffect(() => { const timer = setInterval(() => setCurrentTime(new Date()), 60000); return () => clearInterval(timer); }, []);

  // CAMBIO 3: Efecto para cambiar vista basado en selectedDockId
  useEffect(() => {
    if (selectedDockId && selectedDockId !== 'all') {
      // Si se selecciona un muelle específico, cambiar a timeline
      setViewMode('timeline');
      setHighlightedDockId(selectedDockId);
    } else {
      // Si es "all" o null (cambio de localidad), volver a grid
      setViewMode('grid');
      setHighlightedDockId(null);
    }
  }, [selectedDockId]);

  // CAMBIO 4: Filtrado por ID individual en lugar de grupo
  const filteredDocks = useMemo(() => {
    if (!locationId) return [];
    
    // Primero filtramos por localidad
    let filtered = allDocksState.filter((dock) => dock.locationId === locationId);
    
    // Luego filtramos por el muelle seleccionado específico (si no es 'all')
    if (selectedDockId && selectedDockId !== "all") {
      filtered = filtered.filter((dock) => dock.id === selectedDockId);
    }
    
    return filtered;
  }, [allDocksState, locationId, selectedDockId]);

  const filteredAppointments = useMemo(() => {
    if (!locationId) return [];
    let filtered = allAppointmentsState.filter((apt) => apt.locationId === locationId);
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((apt) => apt.carrier.toLowerCase().includes(query) || apt.id.toLowerCase().includes(query));
    }
    return filtered;
  }, [allAppointmentsState, locationId, searchQuery]);

  // Funciones de manejo de eventos (Drop, Click, etc.)
  const handleDrop = (appointmentId: string, dockId: string) => {
    const apt = allAppointmentsState.find((a) => a.id === appointmentId);
    if (!apt) return;
    setAllDocksState(prev => prev.map(d => d.id === dockId ? { ...d, status: "occupied", occupancy: 100, currentAppointment: { ...apt, status: "in-progress", duration: 60 } } as any : d));
    setAllAppointmentsState(prev => prev.filter(a => a.id !== appointmentId));
    setDraggingId(null); setDropTargetId(null); setSelectedAppointment(null);
  };

  const handleDockClick = (dockId: string) => { setHighlightedDockId(dockId); setViewMode("timeline"); setTimeFrame("day"); };
  const handleAppointmentClick = (apt: Appointment, dockId: string, dockName: string) => { setEditingAppointment({ apt, dockId, dockName }); };

  const handleSaveAppointment = (appointmentId: string, newTime: string, newDockId: string) => {
    if (!editingAppointment) return;
    setAllDocksState((prev) => prev.map((dock) => (dock.id === editingAppointment.dockId && dock.currentAppointment?.id === appointmentId ? { ...dock, currentAppointment: { ...dock.currentAppointment, time: newTime } } as Dock : dock)));
    setEditingAppointment(null);
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    if (!editingAppointment) return;
    setAllDocksState((prev) => prev.map((dock) => {
      if (dock.id === editingAppointment.dockId) {
         if (dock.currentAppointment) setAllAppointmentsState(p => [...p, { ...dock.currentAppointment!, status: 'pending', isReadyForAssignment: false }]);
         return { ...dock, status: "available", occupancy: 0, currentAppointment: undefined } as Dock;
      }
      return dock;
    }));
    setEditingAppointment(null);
  };

  // --- COMPONENTE AUXILIAR PARA EL ESTADO SIN SELECCIÓN ---
  const SelectLocationState = ({ minimalist = false }: { minimalist?: boolean }) => (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-300">
      <div className={cn("rounded-full bg-slate-100 flex items-center justify-center mb-3", minimalist ? "w-12 h-12" : "w-16 h-16")}>
        <MapPin className={cn("text-slate-400", minimalist ? "w-6 h-6" : "w-8 h-8")} />
      </div>
      <h3 className={cn("font-bold text-slate-700 uppercase", minimalist ? "text-xs" : "text-sm")}>
        Selecciona una Localidad
      </h3>
      {!minimalist && (
        <p className="text-xs text-slate-400 mt-1 max-w-[200px]">
          Elige una ubicación en el filtro superior para visualizar la operación.
        </p>
      )}
    </div>
  );

  const expandedClasses = isExpanded ? "fixed inset-0 z-50 bg-white overflow-y-auto" : "h-full flex flex-col p-4 gap-3 overflow-hidden";

  return (
    <div className={expandedClasses}>
      {editingAppointment && <AppointmentEditModal appointment={editingAppointment.apt} dockName={editingAppointment.dockName} currentDockId={editingAppointment.dockId} availableDocks={filteredDocks} onClose={() => setEditingAppointment(null)} onSave={handleSaveAppointment} onDelete={handleDeleteAppointment} />}
      {requestModalAppointment && <RequestAppointmentModal appointment={requestModalAppointment} onClose={() => setRequestModalAppointment(null)} onContinue={() => { setCreateModalAppointment(requestModalAppointment); setRequestModalAppointment(null); }} />}
     {createModalAppointment && (
  <CreateAppointmentModal 
    appointment={createModalAppointment} 
    onClose={() => setCreateModalAppointment(null)} 
    onConfirm={() => { 
        // 1. Encontrar el Muelle A-02 (o el primero disponible) para asignar la cita
        // Simulamos que asignamos automáticamente al muelle "dock-1a-2"
        const targetDockId = "dock-1a-2"; 

        setAllDocksState(prev => prev.map(dock => {
            if (dock.id === targetDockId) {
                return {
                    ...dock,
                    status: "occupied", // Cambia estado a ocupado o programado
                    occupancy: 50, // Ocupación parcial
                    currentAppointment: {
                        ...createModalAppointment,
                        status: "scheduled", // Estado: Programado
                        dockGroupId: dock.dockGroupId,
                        locationId: dock.locationId,
                        // Ajustamos hora para demostración
                        time: "10:00" 
                    }
                };
            }
            return dock;
        }));

        // 2. Quitamos la cita de la lista de pendientes (barra izquierda)
        setAllAppointmentsState(prev => prev.filter(a => a.id !== createModalAppointment.id));
        
        // 3. Limpiamos estados
        setCreateModalAppointment(null); 
        setSelectedAppointment(null);
    }} 
  />
)}

      {isExpanded && <div className="p-2 border-b flex justify-end"><Button variant="ghost" size="sm" onClick={() => setIsExpanded(false)}><Minimize2 className="mr-2 w-4 h-4"/> Salir de pantalla completa</Button></div>}
      
      <div className={cn("flex-1 flex gap-4 min-h-0", isExpanded && "p-4")}>
    
       {/* PANEL ASIGNACIONES  */}
      <div className="w-80 shrink-0 flex flex-col min-h-0 bg-slate-100/40 rounded-[1.5rem] border border-slate-200/60 shadow-inner overflow-hidden">
        
        {/* Cabezal Navy con esquinas onduladas */}
        <div className="px-5 py-4 bg-[#1C1E59] flex items-center justify-between shadow-md z-20 rounded-t-[1.5rem]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-orange-500/20 rounded-lg">
              <LayoutList className="w-4 h-4 text-orange-400" />
            </div>
            <h2 className="text-white font-bold text-[11px] uppercase tracking-[0.1em]">Disponibilidad</h2>
          </div>

          <div className="flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <button className="p-2 hover:bg-white/10 rounded-xl text-white transition-all active:scale-90" disabled={!locationId}>
                  <ListFilter className="w-4 h-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-4 rounded-[1.5rem] shadow-2xl border-slate-100 bg-white" align="start" side="right">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#1C1E59]">Filtros de búsqueda</h4>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="OC o Proveedor..." 
                      className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
                      value={searchQuery} 
                      onChange={(e) => setSearchQuery(e.target.value)} 
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <Badge className="bg-orange-500 text-white border-none text-[10px] font-black h-6 w-6 flex items-center justify-center rounded-full shadow-lg shadow-orange-500/40">
              {filteredAppointments.length}
            </Badge>
          </div>
        </div>

        {/* Contenido del Panel - Fondo sutil */}
        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar relative">
         {!locationId ? (
            <SelectLocationState minimalist={true} />
         ) : selectedAppointment ? (
            /* DETALLE DE CITA */
            <div className="space-y-3 animate-in fade-in slide-in-from-left-4 duration-500">
              <button 
                onClick={() => setSelectedAppointment(null)} 
                className="flex items-center gap-2 text-slate-400 hover:text-[#1C1E59] text-[9px] font-black uppercase transition-all ml-2 group"
              >
                <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" /> VOLVER
              </button>

              <div className="bg-white rounded-[1.5rem] overflow-hidden border border-slate-200 shadow-xl shadow-slate-200/30">
                <div className="bg-[#1C1E59] p-4 text-white relative">
                  <span className="text-[8px] font-bold text-orange-300 uppercase tracking-widest opacity-80">Documento de Compra</span>
                  <h4 className="text-lg font-black tracking-tight leading-none mt-1">{selectedAppointment.id}</h4>
                </div>
                
                <div className="p-4 space-y-3">
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center border-b border-slate-50 pb-1.5">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Proveedor</span>
                      <p className="text-[10px] font-bold text-slate-700 text-right truncate max-w-[150px]">
                        {selectedAppointment.carrier}
                      </p>
                    </div>
                    <div className="flex justify-between items-center border-b border-slate-50 pb-1.5">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Producto</span>
                      <p className="text-[10px] font-bold text-slate-600 truncate max-w-[150px]">
                        {selectedAppointment.product || 'Insumos Varios'}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    {!selectedAppointment.isReadyForAssignment ? (
                      <Button 
                        className="flex-1 bg-[#FF6C01] hover:bg-[#e66000] text-white font-black text-[10px] uppercase h-11 rounded-2xl shadow-lg shadow-orange-500/20 transition-all active:scale-95 border-none" 
                        onClick={() => setRequestModalAppointment(selectedAppointment)}
                      >
                        Solicitar Cita
                      </Button>
                    ) : (
                      <div 
                        draggable 
                        onDragStart={(e) => { 
                          e.dataTransfer.setData("appointmentId", selectedAppointment.id); 
                          setDraggingId(selectedAppointment.id); 
                        }} 
                        onDragEnd={() => setDraggingId(null)}
                        className="flex-1 p-3 border-2 border-dashed border-emerald-400 rounded-2xl text-center bg-emerald-50/50 cursor-grab active:cursor-grabbing hover:bg-emerald-100 transition-all group"
                      >
                        <div className="flex items-center justify-center gap-2">
                          <ArrowRight className="w-3 h-3 text-emerald-600 rotate-90 animate-bounce" />
                          <span className="text-[9px] text-emerald-700 font-black uppercase tracking-widest">
                            Arrastrar a Muelle
                          </span>
                        </div>
                      </div>
                    )}

                    <Button 
                      variant="outline"
                      className="px-4 border-none bg-slate-50/80 text-[#1C1E59] hover:bg-slate-200 rounded-2xl h-11 transition-all active:scale-95 shadow-sm"
                      onClick={() => setIsTechnicalModalOpen(true)}
                      title="Ver más información"
                    >
                      <Info size={18} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
                /* LISTADO DE ITEMS */
                <div className="grid grid-cols-1 gap-2">
                  {filteredAppointments.length === 0 && searchQuery === "" ? (
                     <div className="text-center p-4 text-slate-400 text-xs mt-10">No hay asignaciones pendientes</div>
                  ) : filteredAppointments.map(apt => (
                    <div 
                      key={apt.id} 
                      onClick={() => setSelectedAppointment(apt)} 
                      className={cn(
                        "group relative px-4 py-3 bg-white border border-slate-200 rounded-[1.25rem] cursor-pointer transition-all duration-300",
                        "hover:shadow-lg hover:border-orange-500/30 hover:-translate-y-0.5",
                        apt.isReadyForAssignment && "border-l-4 border-l-emerald-500"
                      )}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={cn(
                            "p-2 rounded-xl shrink-0 transition-colors",
                            apt.isReadyForAssignment ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-500"
                          )}>
                            <Package size={16} strokeWidth={2.5} />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-[12px] text-slate-800 truncate uppercase tracking-tight leading-none group-hover:text-[#1C1E59]">
                              {apt.carrier}
                            </h4>
                            <div className="flex items-center gap-1.5 mt-1.5 opacity-60">
                              <span className="text-[9px] font-black text-slate-500 font-mono">#{apt.id}</span>
                            </div>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-slate-200 group-hover:text-orange-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        {/* PANEL DERECHO (MUELLES) */}
        <div className="flex-1 flex flex-col min-h-0 bg-white border border-yms-border rounded-[1.5rem] overflow-hidden shadow-sm">
           <div className="p-3 border-b flex justify-between items-center">
              <Badge variant="outline" className="bg-slate-50 text-slate-600 font-bold">{filteredDocks.length} Muelles</Badge>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-slate-50 border rounded-lg p-0.5">
                   <Button size="icon" variant="ghost" className="h-7 w-7" disabled={!locationId}><ChevronLeft className="w-4 h-4" /></Button>
                   <span className="font-bold text-xs px-2 text-yms-primary">Hoy</span>
                   <Button size="icon" variant="ghost" className="h-7 w-7" disabled={!locationId}><ChevronRight className="w-4 h-4" /></Button>
                </div>
                <div className="flex items-center gap-2 bg-emerald-50 border rounded-lg px-3 py-2"><div className="relative flex h-2 w-2 "><span className="animate-ping absolute inline-flex h-full w-full  rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full  h-2 w-2 bg-emerald-500"></span></div><div className="flex flex-col leading-none"><span className="text-[9px] font-black text-emerald-700 tracking-wide uppercase">EN VIVO</span><span className="text-[10px] font-mono text-emerald-600 font-medium">{currentTime ? currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}</span></div></div>
                {viewMode === 'timeline' && <div className="flex bg-slate-50 rounded-lg p-0.5 border py-1">{(['day', 'week', 'month'] as const).map(tf => <button key={tf} onClick={() => setTimeFrame(tf)} className={cn("px-3 py-1 text-[10px] font-medium rounded-md transition-all", timeFrame === tf ? "bg-white text-yms-primary shadow-sm" : "text-slate-400 hover:text-yms-primary")}>{tf === 'day' ? 'Día' : tf === 'week' ? 'Semana' : 'Mes'}</button>)}</div>}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200">
                  <Button disabled={!locationId} variant={viewMode === 'grid' ? 'default' : 'ghost'} size="icon" className={cn("h-7 w-7", viewMode === 'grid' ? "bg-white text-yms-primary shadow-sm" : "text-slate-500")} onClick={() => setViewMode('grid')}><LayoutGrid className="w-4 h-4" /></Button>
                  <Button disabled={!locationId} variant={viewMode === 'timeline' ? 'default' : 'ghost'} size="icon" className={cn("h-7 w-7", viewMode === 'timeline' ? "bg-white text-yms-primary shadow-sm" : "text-slate-500")} onClick={() => setViewMode('timeline')}><CalendarIcon className="w-4 h-4" /></Button>
                  <div className="w-px h-4 bg-slate-300 mx-1" />
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-500 hover:bg-white" onClick={() => setIsExpanded(!isExpanded)}>{isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}</Button>
                </div>
              </div>
           </div>
           
           {/* Vista Grid de los muelles */}
           <div className="flex-1 overflow-hidden bg-white bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] relative">
              
              {!locationId ? (
                 <SelectLocationState minimalist={false} />
              ) : viewMode === 'grid' ? (
                <div className="p-4 flex flex-wrap gap-4 overflow-y-auto h-full bg-slate-50/50 backdrop-blur-[1px]">
                    {filteredDocks.map(dock => (
                        <DockSlot 
                            key={dock.id} 
                            dock={dock} 
                            isDragging={!!draggingId} 
                            onDrop={handleDrop} 
                            onDragOver={() => setDropTargetId(dock.id)} 
                            onDragLeave={() => setDropTargetId(null)} 
                            isDropTarget={dropTargetId === dock.id} 
                            onClick={() => handleDockClick(dock.id)} 
                        />
                    ))}
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

        {/* RENDER DEL MODAL AL FINAL DEL DIV PRINCIPAL */}
         {/* RENDER DEL MODAL AL FINAL DEL DIV PRINCIPAL */}
{selectedAppointment && isTechnicalModalOpen && (
  <OrderDetailsTechnicalModal 
    appointment={selectedAppointment} 
    onClose={() => setIsTechnicalModalOpen(false)} 
    onRequestAppointment={() => {
        // Al hacer clic, configuramos el modal de solicitud con la cita actual
        setRequestModalAppointment(selectedAppointment);
    }}
  />
)}
       
      </div>
    </div>
  );
}