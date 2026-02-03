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
  ChevronLeft, LayoutList, Truck, CheckCircle, Info, FileText, Plus, ChevronDown,
} from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// --- NUEVOS IMPORTS PARA EL SELECT DE LOCALIDAD ---
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// --- TIPOS (Sin cambios) ---
type AppointmentStatus = "scheduled" | "in-progress" | "completed" | "delayed" | "pending";
type ViewMode = "grid" | "timeline";
type TimeFrame = "day" | "week" | "month";

// --- TIPOS PARA LOCALIDADES (Traídos del segundo componente) ---
export interface DockGroup {
  id: string;
  name: string;
  dockCount: number;
  type: "inbound" | "outbound" | "mixed";
}


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
  route: string;
  priority: string;
  logisticProfile: string;
  
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
  onLocationChange: (id: string | null) => void; // <-- Agregar esto a la interfaz
  selectedDockId: string | null;
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



const locationsData = [
  {
    id: "loc-1",
    name: "Centro de Distribución Norte",
  },
  {
    id: "loc-2",
    name: "Centro Logístico Sur",
  },
  {
    id: "loc-3",
    name: "Terminal Portuaria Occidente",
  }
];



const allDocks: Dock[] = [
  // === LOCALIDAD 1: NORTE (11 Muelles) ===
  { id: "dock-1a-1", name: "Muelle A-01", type: "inbound", status: "occupied", occupancy: 100, locationId: "loc-1", dockGroupId: "dg-1a",
    currentAppointment: { id: "apt-1", carrier: "Swift Transport", truckId: "JPM378", time: "08:30", type: "inbound", status: "in-progress", locationId: "loc-1", dockGroupId: "dg-1a", duration: 90, 
    driver: "Yuliana Perez", city: "BELLO", department: "ANTIOQUIA", locationName: "Planta Solla Bello 1405", zone: "Descargue Materia Prima", date: "MIE 19 NOV 2025", vehicleType: "Camión Sencillo", loadType: "Seca", operationType: "Descargue",
    route: "NORTE-01", priority: "ALTA", logisticProfile: "SECA" }},
  { id: "dock-1a-2", name: "Muelle A-02", type: "inbound", status: "available", occupancy: 20, locationId: "loc-1", dockGroupId: "dg-1a",
    currentAppointment: { id: "apt-gray-1", carrier: "TransFuturo", truckId: "FUT-2026", time: "14:00", type: "inbound", status: "scheduled", locationId: "loc-1", dockGroupId: "dg-1a", duration: 60,
    driver: "Esteban Quito", city: "BOGOTA", department: "CUNDINAMARCA", locationName: "Planta Norte", zone: "Zona A", date: "MIE 19 NOV 2025", vehicleType: "Tractomula", loadType: "Refrigerada", operationType: "Descargue",
    route: "BOG-02", priority: "MEDIA", logisticProfile: "FRIO" }},
  { id: "dock-1a-3", name: "Muelle A-03", type: "inbound", status: "available", occupancy: 0, locationId: "loc-1", dockGroupId: "dg-1a" },
  { id: "dock-1a-4", name: "Muelle A-04", type: "inbound", status: "available", occupancy: 15, locationId: "loc-1", dockGroupId: "dg-1a",
    currentAppointment: { id: "apt-completed-1", carrier: "Historic Logistics", truckId: "TRK-OLD", time: "05:00", type: "inbound", status: "completed", locationId: "loc-1", dockGroupId: "dg-1a", duration: 120, 
    driver: "Roberto Gómez", city: "MEDELLIN", department: "ANTIOQUIA", locationName: "Centro Dist. Norte", zone: "Zona A", date: "MIE 19 NOV 2025", vehicleType: "Tractomula", loadType: "Refrigerada", operationType: "Descargue",
    route: "URBANA-01", priority: "NORMAL", logisticProfile: "FRIO" }},
  { id: "dock-1b-1", name: "Muelle B-01", type: "inbound", status: "occupied", occupancy: 50, locationId: "loc-1", dockGroupId: "dg-1b",
    currentAppointment: { id: "apt-2", carrier: "LogiCargo", truckId: "TRK-1193", time: "09:15", type: "inbound", status: "delayed", locationId: "loc-1", dockGroupId: "dg-1b", duration: 60,
    driver: "Maria Diaz", city: "BOGOTA", department: "CUNDINAMARCA", locationName: "Bodega Central", zone: "Zona B", date: "MIE 19 NOV 2025", vehicleType: "Turbo", loadType: "Seca", operationType: "Descargue",
    route: "SUR-05", priority: "MEDIA", logisticProfile: "SECA" }},
  { id: "dock-1b-2", name: "Muelle B-02", type: "inbound", status: "available", occupancy: 10, locationId: "loc-1", dockGroupId: "dg-1b",
    currentAppointment: { id: "apt-gray-2", carrier: "Andina Carga", truckId: "AND-99", time: "16:30", type: "inbound", status: "pending", locationId: "loc-1", dockGroupId: "dg-1b", duration: 90,
    driver: "Julian Alvarez", city: "CALI", department: "VALLE", locationName: "Bodega B", zone: "Zona B", date: "MIE 19 NOV 2025", vehicleType: "Doble Troque", loadType: "Granel", operationType: "Descargue",
    route: "EJE-01", priority: "NORMAL", logisticProfile: "GRANEL" }},
  { id: "dock-1b-3", name: "Muelle B-03", type: "inbound", status: "available", occupancy: 0, locationId: "loc-1", dockGroupId: "dg-1b" },
  { id: "dock-1b-4", name: "Muelle B-04", type: "inbound", status: "occupied", occupancy: 100, locationId: "loc-1", dockGroupId: "dg-1b",
    currentAppointment: { id: "apt-3", carrier: "CargoMax", truckId: "TRK-7890", time: "10:00", type: "inbound", status: "in-progress", locationId: "loc-1", dockGroupId: "dg-1b", duration: 120,
    driver: "Carlos Ruiz", city: "CALI", department: "VALLE", locationName: "Planta Sur", zone: "Zona B", date: "MIE 19 NOV 2025", vehicleType: "Doble Troque", loadType: "Granel", operationType: "Descargue",
    route: "LOCAL-04", priority: "ALTA", logisticProfile: "GRANEL" }},
  { id: "dock-1c-1", name: "Despacho 01", type: "outbound", status: "occupied", occupancy: 100, locationId: "loc-1", dockGroupId: "dg-1c",
    currentAppointment: { id: "apt-4", carrier: "FastFreight", truckId: "TRK-7832", time: "09:00", type: "outbound", status: "in-progress", locationId: "loc-1", dockGroupId: "dg-1c", duration: 45,
    driver: "Ana Lopez", city: "BELLO", department: "ANTIOQUIA", locationName: "Planta Solla Bello 1405", zone: "Cargue", date: "MIE 19 NOV 2025", vehicleType: "Camión Sencillo", loadType: "Seca", operationType: "Cargue",
    route: "NACIONAL-01", priority: "ALTA", logisticProfile: "SECA" }},
  { id: "dock-1c-2", name: "Despacho 02", type: "outbound", status: "maintenance", occupancy: 100, locationId: "loc-1", dockGroupId: "dg-1c" },
  { id: "dock-1d-2", name: "Mixto 02", type: "both", status: "occupied", occupancy: 100, locationId: "loc-1", dockGroupId: "dg-1d",
    currentAppointment: { id: "apt-mixed-1", carrier: "InterRapidísimo", truckId: "INT-88", time: "13:00", type: "inbound", status: "in-progress", locationId: "loc-1", dockGroupId: "dg-1d", duration: 30, driver: "Luisa Lane",
    route: "URBANA", priority: "NORMAL", logisticProfile: "PAQUETEO" } },

  // === LOCALIDAD 2: SUR (5 Muelles) ===
  { id: "dock-2a-1", name: "Muelle S-01", type: "inbound", status: "occupied", occupancy: 100, locationId: "loc-2", dockGroupId: "dg-2a",
    currentAppointment: { id: "apt-sur-1", carrier: "TransGlobal", truckId: "TRK-9012", time: "08:00", type: "inbound", status: "in-progress", locationId: "loc-2", dockGroupId: "dg-2a", duration: 60, driver: "Pedro Sola",
    route: "R-10", priority: "MEDIA", logisticProfile: "SECA" }},
  { id: "dock-2a-2", name: "Muelle S-02", type: "inbound", status: "available", occupancy: 0, locationId: "loc-2", dockGroupId: "dg-2a" },
  { id: "dock-2a-3", name: "Muelle S-03", type: "inbound", status: "available", occupancy: 0, locationId: "loc-2", dockGroupId: "dg-2a" },
  { id: "dock-2b-1", name: "Despacho S-01", type: "outbound", status: "available", occupancy: 0, locationId: "loc-2", dockGroupId: "dg-2b" },
  { id: "dock-2b-2", name: "Despacho S-02", type: "outbound", status: "occupied", occupancy: 100, locationId: "loc-2", dockGroupId: "dg-2b",
    currentAppointment: { id: "apt-sur-2", carrier: "ExpressLine", truckId: "TRK-2345", time: "10:00", type: "outbound", status: "in-progress", locationId: "loc-2", dockGroupId: "dg-2b", duration: 90, driver: "Luisa Lane",
    route: "EJE-11", priority: "NORMAL", logisticProfile: "SECA" }},

  // === LOCALIDAD 3: PUERTO (8 Muelles) ===
  { id: "dock-3a-1", name: "Contenedor 01", type: "inbound", status: "occupied", occupancy: 100, locationId: "loc-3", dockGroupId: "dg-3a",
    currentAppointment: { id: "apt-prt-1", carrier: "Maersk", truckId: "CONT-99", time: "06:00", type: "inbound", status: "in-progress", locationId: "loc-3", dockGroupId: "dg-3a", duration: 240, driver: "John Doe",
    route: "INT-01", priority: "ALTA", logisticProfile: "CONTENEDOR" }},
  { id: "dock-3a-2", name: "Contenedor 02", type: "inbound", status: "available", occupancy: 0, locationId: "loc-3", dockGroupId: "dg-3a" },
  { id: "dock-3a-3", name: "Contenedor 03", type: "inbound", status: "available", occupancy: 0, locationId: "loc-3", dockGroupId: "dg-3a" },
  { id: "dock-3a-4", name: "Contenedor 04", type: "inbound", status: "available", occupancy: 0, locationId: "loc-3", dockGroupId: "dg-3a" },
  { id: "dock-3b-1", name: "Carga Granel 01", type: "outbound", status: "maintenance", occupancy: 100, locationId: "loc-3", dockGroupId: "dg-3b" },
  { id: "dock-3b-2", name: "Carga Granel 02", type: "inbound", status: "available", occupancy: 0, locationId: "loc-3", dockGroupId: "dg-3b" },
  { id: "dock-3c-1", name: "Patio 01", type: "outbound", status: "available", occupancy: 0, locationId: "loc-3", dockGroupId: "dg-3c" },
  { id: "dock-3c-2", name: "Patio 02", type: "outbound", status: "available", occupancy: 0, locationId: "loc-3", dockGroupId: "dg-3c" },
];







// --- Citas pendientes ---
const pendingAppointments: Appointment[] = [
  // LOCALIDAD 1
  { 
    id: "NOTAPRUEBAABI5002", carrier: "FERRIAMARILLA S.A.S", truckId: "TRK-ANT-001", time: "15:28", type: "inbound", status: "pending", 
    locationId: "loc-1", locationName: "CENTRO DE DISTRIBUCIÓN NORTE", date: "2026-01-28", nit: "900.742.771-9", quantityOrdered: 150, quantityDelivered: 50, peso: "5,000", operationType: "Descargue", isReadyForAssignment: false, zone: "MEDELLIN_ANT", product: "PRODUCTO EJEMPLO 1", canal: "MODERNO", route: "RUTA SUR-01", priority: "ALTA", logisticProfile: "REFRIGERADO"
  },
  { 
    id: "ABI10200", carrier: "DISTRIBUIDORA NACIONAL", truckId: "TRK-DC-014", time: "08:00", type: "inbound", status: "pending",
    locationId: "loc-1", locationName: "CENTRO DE DISTRIBUCIÓN NORTE", date: "2026-01-28", nit: "860.001.002-4", quantityOrdered: 2400, quantityDelivered: 1200, peso: "3,500", operationType: "Descargue", isReadyForAssignment: false, zone: "BOGOTA_DC", product: "ABARROTES VARIOS", canal: "TRADICIONAL", route: "NORTE-05", priority: "MEDIA", logisticProfile: "SECA"
  },
  
  // LOCALIDAD 2 (SUR)
  { 
    id: "SUR-88921", carrier: "ALIMENTOS DEL VALLE", truckId: "TRK-CALI-223", time: "09:30", type: "outbound", status: "pending",
    locationId: "loc-2", locationName: "CENTRO LOGÍSTICO SUR", date: "2026-01-29", nit: "890.900.120-1", quantityOrdered: 500, quantityDelivered: 0, peso: "12,000", operationType: "Cargue", isReadyForAssignment: false, zone: "CALI", product: "AZUCAR", canal: "MODERNO", route: "SUR-02", priority: "ALTA", logisticProfile: "GRANEL"
  },
  { 
    id: "SUR-99281", carrier: "CARGAS DEL PACIFICO", truckId: "TRK-PAC-078", time: "11:45", type: "inbound", status: "pending",
    locationId: "loc-2", locationName: "CENTRO LOGÍSTICO SUR", date: "2026-01-28", nit: "800.123.456-0", quantityOrdered: 1200, quantityDelivered: 800, peso: "8,200", operationType: "Descargue", isReadyForAssignment: false, zone: "PASTO", product: "PAPA", canal: "DIRECTO", route: "SUR-01", priority: "BAJA", logisticProfile: "SECA"
  },

  // LOCALIDAD 3 (PUERTO)
  { 
    id: "PORT-77261", carrier: "NAVIERA INTERNACIONAL", truckId: "TRK-BUN-031", time: "14:15", type: "inbound", status: "pending",
    locationId: "loc-3", locationName: "TERMINAL PORTUARIA OCCIDENTE", date: "2026-01-29", nit: "900.555.666-8", quantityOrdered: 85, quantityDelivered: 85, peso: "1,200", operationType: "Descargue", isReadyForAssignment: false, zone: "BUENAVENTURA", product: "IMPORTACION CHINA", canal: "MODERNO", route: "INT-03", priority: "MEDIA", logisticProfile: "CONTENEDOR"
  }
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

const DocumentCard = ({ apt, isSelected, onSelect, onOpenDetails }: any) => (
  <div className={cn(
    "relative bg-white border rounded-xl transition-all duration-200 shadow-sm hover:shadow-md",
    isSelected ? "border-orange-500 ring-1 ring-orange-500/20" : "border-slate-100"
  )}>
    {/* Checkbox */}
    <div className="absolute top-4 left-4 z-10">
      <div 
        onClick={(e) => onSelect(apt.id, e)}
        className={cn(
          "w-6 h-6 rounded-full border-2 flex items-center justify-center cursor-pointer transition-all",
          isSelected ? "bg-orange-500 border-orange-500 shadow-sm" : "border-slate-200 bg-white hover:border-orange-300"
        )}
      >
        {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
      </div>
    </div>

    {/* Contenido Estilo Imagen 1 */}
    <div className="pl-14 pr-4 py-4">
      <div className="border-l-[3px] border-orange-500 pl-4 space-y-3">
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-black text-[#1C1E59] leading-none uppercase">{apt.id}</h4>
          <span className="text-[8px] font-bold text-slate-400 font-mono tracking-tighter">2026-01-28</span>
        </div>

        <div>
          <span className="text-[9px] font-black text-orange-500 uppercase tracking-widest block mb-0.5">Proveedor:</span>
          <p className="text-[11px] font-bold text-gray-600 leading-tight uppercase">{apt.carrier}</p>
        </div>

        {/* Cajas de Peso y Ventas */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
            <span className="text-[7px] font-black text-slate-400 uppercase block mb-1">Peso</span>
            <span className="text-[11px] font-black text-[#1C1E59]">{apt.peso || '0'} kg</span>
          </div>
          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
            <span className="text-[7px] font-black text-slate-400 uppercase block mb-1">Ventas</span>
            <span className="text-[11px] font-black text-[#1C1E59]">{apt.quantityOrdered || '0'}</span>
          </div>
        </div>

        <button 
          onClick={() => onOpenDetails(apt)}
          className="w-full mt-2 py-1 text-[8px] font-black text-blue-600 hover:text-blue-800 uppercase tracking-widest flex items-center justify-center gap-1 bg-blue-50/50 rounded-md"
        >
          <Info size={10} /> Ver Detalle Completo
        </button>
      </div>
    </div>
  </div>
);

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

const DocumentDetailView = ({ doc, onBack, onOpenRequest, onOpenTechnical }: any) => (
  <div className="flex flex-col h-full bg-white animate-in slide-in-from-left-4 duration-300">
    {/* Header del detalle */}
    <div className="bg-[#1C1E59] px-4 py-3 flex items-center justify-between shadow-md">
      <button onClick={onBack} className="text-white p-1 hover:bg-white/10 rounded-lg">
        <ChevronLeft size={20} />
      </button>
      <span className="text-white font-bold text-sm uppercase italic">Detalle Documento</span>
      <Button 
        size="sm" 
        onClick={onOpenRequest}
        className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-black uppercase px-3 h-8 rounded-lg shadow-lg border-none"
      >
        Solicitar Cita
      </Button>
    </div>

    {/* Contenido (Basado en tu imagen 2) */}
    <div className="flex-1 overflow-y-auto p-5 space-y-4">
      <div className="border-l-4 border-orange-500 pl-4 space-y-4">
        <div>
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nota de entrega:</h4>
          <p className="text-sm font-black text-[#1C1E59] break-all">NOTAPRUEBAABI5002</p>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <div>
            <span className="text-[9px] font-black text-orange-500 uppercase block">Origen:</span>
            <span className="text-xs font-bold text-gray-600">{doc.locationName || 'CEDI CALI'}</span>
          </div>
          <div>
            <span className="text-[9px] font-black text-orange-500 uppercase block">Destino:</span>
            <span className="text-xs font-bold text-gray-600">FERRIAMARILLA S.A.S-CR 87 48A 05 (MEDELLIN_ANT)</span>
          </div>
        </div>

        <div>
          <span className="text-[9px] font-black text-orange-500 uppercase block"># Documento:</span>
          <span className="text-xs font-bold text-gray-600">{doc.id}</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[9px] font-black text-orange-500 uppercase block">Peso:</span>
            <span className="text-xs font-bold text-gray-600">{doc.peso || '0.00'}</span>
          </div>
          <div>
            <span className="text-[9px] font-black text-orange-500 uppercase block">Ventas (Cant):</span>
            <span className="text-xs font-bold text-gray-600">{doc.quantityOrdered || '0'}</span>
          </div>
        </div>

        <div>
          <span className="text-[9px] font-black text-orange-500 uppercase block">Fecha de Creacion:</span>
          <span className="text-xs font-bold text-gray-600">{doc.date} 15:28:00</span>
        </div>
      </div>
      
      <Button 
        variant="outline" 
        className="w-full border-dashed border-slate-300 text-slate-400 text-[10px] font-bold h-10 mt-4"
        onClick={onOpenTechnical}
      >
        <Info size={14} className="mr-2" /> Ver Datos Técnicos Completos
      </Button>
    </div>
  </div>
);

// --- COMPONENTE: CARD ESTILO MAESTRO DE DOCUMENTO (AJUSTADO: MÁS LARGO, MENOS ANCHO) ---
const DocumentMaestroCard = ({ apt, isSelected, onSelect, onDragStart, onDragEnd }: any) => {
  const DataEntry = ({ label, value, color = "text-slate-700" }: any) => (
    <div className="flex flex-col min-w-0">
      <span className="text-[7px] font-black text-orange-500 uppercase tracking-tighter leading-none mb-1.5">{label}</span>
      <span className={cn("text-[10px] font-bold truncate leading-none", color)}>{value || '---'}</span>
    </div>
  );

  return (
    <div 
      draggable 
      onDragStart={(e) => onDragStart(e, apt.id)} 
      onDragEnd={onDragEnd} 
      className={cn(
        "group relative bg-white border-2 rounded-xl transition-all duration-300 mb-4 cursor-pointer overflow-hidden",
        isSelected ? "border-orange-500 shadow-xl bg-orange-50/5 scale-[1.01]" : "border-slate-100 hover:border-orange-200",
        "active:cursor-grabbing" 
      )}
      onClick={() => onSelect(apt.id)}
    >
      <div className="bg-slate-50/80 px-4 py-2 border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={cn("w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all", isSelected ? "bg-orange-500 border-orange-500" : "border-slate-300 bg-white")}>
            {isSelected && <CheckCircle className="w-3 h-3 text-white" />}
          </div>
          <span className="text-[11px] font-black text-[#1C1E59] uppercase">DOC: {apt.id}</span>
        </div>
        
      </div>

      {/* AUMENTÉ EL PADDING (p-5) Y EL GAP VERTICAL (gap-y-6) PARA HACERLA MÁS LARGA */}
      <div className="p-5 border-l-[6px] border-orange-500 grid grid-cols-2 gap-x-4 gap-y-6 bg-white"> 
        
        {/* FILA 1 */}
        <div className="col-span-2 grid grid-cols-2 gap-4 border-b border-slate-50 pb-4">
           <DataEntry label="Producto" value={apt.product} />
             <DataEntry label="Estado del documento" value="ACTIVO"  />
        </div>

        {/* COLUMNA IZQUIERDA */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
           <DataEntry label="Proveedor" value={apt.carrier} />
            <DataEntry label="NIT Proveedor" value={apt.nit || '900.742.771-9'} />
          </div>
          <DataEntry label="Empresa" value={apt.descripcionCompany} color="text-slate-500" />
          <DataEntry label="Tipo Mercancía" value={apt.tipoMercancia || 'GENERAL NO PERECEDERA'} />
          <DataEntry label="Tipo de Cargue" value=" Agranel"  />
       
          <div className="grid grid-cols-2 gap-2">
            <DataEntry label="Peso" value={`${apt.peso || '0'} KG`} />
            <DataEntry label="Volumen" value="4.50 M³" />
            <DataEntry label="Litros" value="500 lts" />
            <DataEntry label="Unidad de Medida" value="Unidades (UND)" />
          </div>
          
          
        </div>

        {/* COLUMNA DERECHA */}
        <div className="space-y-4 border-l border-slate-50 pl-4">
          <div className="grid grid-cols-2 gap-2">
            <DataEntry label="Fecha de Inicio" value="500 lts" />
            <DataEntry label="Fecha de Finalización" value="500 lts" />
          </div>
          <DataEntry label="Canal" value={apt.canal} color="text-[#1C1E59] " />
          <DataEntry label="Operación" value={apt.operationType} />
          <DataEntry label="SKU Artículo" value={apt.codigoArticulo || 'SKU-882910'} color="font-mono text-slate-600" />
          
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 space-y-2 mt-1">
            <div className="flex justify-between items-center">
              <span className="text-[7px] font-black text-orange-500 uppercase">Pedida</span>
              <span className="text-[11px] font-black text-[#1C1E59]">{apt.quantityOrdered}</span>
            </div>
            <div className="flex justify-between items-center pt-1 border-t border-slate-200">
              <span className="text-[7px] font-black text-orange-600 uppercase">Recibida</span>
              <span className="text-[11px] font-black text-orange-600">0</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

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

function CreateAppointmentModal({ 
  selectedItems, 
  suggestedDock, 
  onClose, 
  onConfirm 
}: { 
  selectedItems: any[], 
  suggestedDock: string, 
  onClose: () => void, 
  onConfirm: (updatedData: any) => void 
}) {
  const baseItem = selectedItems[0];
  
  // ESTADOS DE CREACIÓN (Restaurados de la versión anterior)
  const [isNewCarrier, setIsNewCarrier] = useState(false);
  const [isNewDriver, setIsNewDriver] = useState(false);

  const [formData, setFormData] = useState({
    appointmentId: "4006038", // Número de cita por defecto
    transportCompany: baseItem.carrier || "",
    loadType: "Bultos",
    vehicleType: baseItem.vehicleType || "Turbo",
    unloadTime: "gfssgs", // Tiempo descargue
    estimatedTime: "1.5", // NUEVO: Tiempo estimado (decimal)
    loadDate: baseItem.date || "2026-01-08",
    loadTime: baseItem.time || "15:30",
    driver: baseItem.driver || "",
    driverId: baseItem.driverId || "",
    driverPhone: baseItem.driverPhone || "",
    truckId: baseItem.truckId === "---" ? "TRK-ANT-001" : baseItem.truckId,
    comments: "fsdsdgs"
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Estilos de la tabla tipo grid de la imagen
  const labelClass = "text-[9px] font-black text-slate-500 uppercase pr-3 text-right bg-[#F8FAFC] border-r border-slate-200 w-40 shrink-0 flex items-center justify-end leading-tight";
  const cellClass = "flex border-b border-slate-200 min-h-[36px]";
  const inputClass = "flex-1 px-3 text-[11px] font-bold text-indigo-900 outline-none focus:bg-orange-50/30 uppercase";

  const handleFinalCreate = () => {
    onConfirm({
      ...formData,
      items: selectedItems,
      suggestedDock,
      status: "scheduled",
      carrier: formData.transportCompany,
      time: formData.loadTime
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[95vh] border border-slate-300">
        
        {/* HEADER */}
        <div className="bg-white px-6 py-3 border-b flex justify-between items-center shrink-0">
          <h3 className="text-base font-black text-slate-600 tracking-tighter w-full text-center uppercase italic">
            Detalle de la Cita para Cargue
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X size={20} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar">
          
          {/* GRID DE FORMULARIO PRINCIPAL */}
          <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-sm">
            <div className="grid grid-cols-2">
              
              {/* FILA 1 */}
              <div className={cellClass}>
                <span className={labelClass}>Destino:</span>
                <span className="flex-1 px-3 text-[10px] font-bold flex items-center text-slate-500">{baseItem.locationName}</span>
              </div>
              <div className={cellClass}>
                <span className={labelClass}>Cita:</span>
                <input className={cn(inputClass, "text-slate-400 italic font-normal")} value={formData.appointmentId} onChange={(e)=>handleChange('appointmentId', e.target.value)} />
              </div>

              {/* FILA 2 */}
              <div className={cellClass}>
                <span className={labelClass}>Cita para transportista:</span>
                <div className="flex-1 px-3 flex items-center">
                  <input type="checkbox" checked className="w-4 h-4 accent-blue-600 cursor-pointer" />
                </div>
              </div>
              <div className={cellClass}>
                <span className={labelClass}>Transportista:<span className="text-red-500 ml-0.5">*</span></span>
                <div className="flex-1 flex items-center pr-2">
                   <input className={inputClass} value={formData.transportCompany} onChange={(e)=>handleChange('transportCompany', e.target.value)} />
                   <button onClick={() => setIsNewCarrier(!isNewCarrier)} className="text-orange-500 p-1 hover:bg-orange-50 rounded">
                     <Plus size={16} strokeWidth={3} />
                   </button>
                </div>
              </div>

              {/* FILA 3 */}
              <div className={cellClass}>
                <span className={labelClass}>Tipo de cargue:<span className="text-red-500 ml-0.5">*</span></span>
                <select className={cn(inputClass, "bg-transparent")} value={formData.loadType} onChange={(e)=>handleChange('loadType', e.target.value)}>
                  <option>Bultos</option><option>Granel</option><option>Pallets</option>
                </select>
              </div>
              <div className={cellClass}><span className={labelClass}></span></div>

              {/* FILA 4 */}
              <div className={cellClass}>
                <span className={labelClass}>Tipo de vehículo:<span className="text-red-500 ml-0.5">*</span></span>
                <select className={cn(inputClass, "bg-transparent")} value={formData.vehicleType} onChange={(e)=>handleChange('vehicleType', e.target.value)}>
                  <option>Turbo</option><option>Sencillo</option><option>Tractomula</option>
                </select>
              </div>
              <div className={cellClass}>
                <span className={labelClass}>Tiempo descargue:</span>
                <input className={inputClass} value={formData.unloadTime} onChange={(e)=>handleChange('unloadTime', e.target.value)} />
              </div>

              {/* FILA 5 */}
              <div className={cellClass}>
                <span className={labelClass}>Fecha de cita:<span className="text-red-500 ml-0.5">*</span></span>
                <div className="flex-1 relative flex items-center">
                  <input type="date" className={inputClass} value={formData.loadDate} onChange={(e)=>handleChange('loadDate', e.target.value)} />
                </div>
              </div>
              <div className={cellClass}>
                <span className={labelClass}>Hora de cita:<span className="text-red-500 ml-0.5">*</span></span>
                <div className="flex-1 relative flex items-center">
                  <input type="time" className={inputClass} value={formData.loadTime} onChange={(e)=>handleChange('loadTime', e.target.value)} />
                </div>
              </div>

              {/* FILA 6: CONDUCTOR (MODO CREACIÓN) */}
              <div className="col-span-2 flex border-b border-slate-200 min-h-[108px]">
                 <div className={cn(labelClass, "min-h-[108px]")}>Conductor:</div>
                 <div className="flex-1 flex flex-col">
                    <div className="flex-1 flex border-b border-slate-100 items-center">
                       <span className="text-[9px] font-bold text-slate-400 w-32 text-right pr-3 uppercase">Nombre completo:</span>
                       <input className={inputClass} value={formData.driver} onChange={(e)=>handleChange('driver', e.target.value)} />
                       <button onClick={() => setIsNewDriver(!isNewDriver)} className="text-orange-500 mx-2 p-1 hover:bg-orange-50 rounded">
                         <Plus size={16} strokeWidth={3} />
                       </button>
                    </div>
                    <div className="flex-1 flex border-b border-slate-100 items-center">
                       <span className="text-[9px] font-bold text-slate-400 w-32 text-right pr-3 uppercase">Cédula:</span>
                       <input className={inputClass} value={formData.driverId} onChange={(e)=>handleChange('driverId', e.target.value)} />
                       <button className="text-orange-500 mx-2 p-1 opacity-100"><Plus size={16} strokeWidth={3} /></button>
                    </div>
                    <div className="flex-1 flex items-center">
                       <span className="text-[9px] font-bold text-slate-400 w-32 text-right pr-3 uppercase">Celular:</span>
                       <input className={inputClass} value={formData.driverPhone} onChange={(e)=>handleChange('driverPhone', e.target.value)} />
                       <div className="w-10"></div>
                    </div>
                 </div>
              </div>

              {/* FILA 7 */}
              <div className={cellClass}>
                <span className={labelClass}>Placas:</span>
                <input className={cn(inputClass, "tracking-widest font-black")} value={formData.truckId} onChange={(e)=>handleChange('truckId', e.target.value)} />
              </div>
              <div className={cellClass}>
                <span className={labelClass}>Tiempo estimado:</span>
                <input 
                  type="number" 
                  step="0.1" 
                  className={cn(inputClass, "text-orange-600")} 
                  value={formData.estimatedTime} 
                  onChange={(e)=>handleChange('estimatedTime', e.target.value)} 
                  placeholder="0.0"
                />
              </div>

              {/* FILA 8 */}
              <div className="col-span-2 flex min-h-[50px]">
                <span className={cn(labelClass, "min-h-[50px]")}>Comentario:</span>
                <textarea className="flex-1 p-2 text-[11px] font-medium outline-none resize-none uppercase" value={formData.comments} onChange={(e)=>handleChange('comments', e.target.value)} />
              </div>
            </div>
          </div>

          <p className="text-[10px] text-red-500 font-bold">* Campos obligatorios.</p>

          {/* LISTA DE DOCUMENTOS (DISEÑO IGUAL A LA IMAGEN) */}
          <div className="space-y-3">
            {selectedItems.map((doc) => (
              <div key={doc.id} className="border border-slate-200 rounded-lg overflow-hidden shadow-sm">
                <div className="flex bg-[#F8FAFC] border-b border-slate-200 text-[10px] font-bold">
                  <div className="p-2 border-r border-slate-200 uppercase w-32 text-slate-500">Documento:</div>
                  <div className="p-2 flex-1 text-blue-700 uppercase">{doc.id}</div>
                  <div className="p-2 border-l border-slate-200 uppercase w-40 text-slate-500">Muelle sugerido:</div>
                  <div className="p-2 bg-[#1C1E59] text-white text-center w-12 font-black">{suggestedDock}</div>
                </div>
                <div className="grid grid-cols-3 bg-white text-[9px] font-black text-slate-400 uppercase border-b border-slate-100">
                  <div className="p-1.5 px-3">Artículo</div>
                  <div className="p-1.5 px-3">Cantidad a entregar</div>
                  <div className="p-1.5 px-3">Producto</div>
                </div>
                <div className="grid grid-cols-3 bg-white text-[11px] font-bold text-slate-700">
                  <div className="p-2 px-3">{doc.codigoArticulo || "001"}</div>
                  <div className="p-2 px-3 text-orange-600 font-black">{doc.quantityToDeliver || doc.quantityOrdered}</div>
                  <div className="p-2 px-3 text-slate-400">{doc.product}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FOOTER ACCIONES */}
        <div className="px-8 py-5 flex justify-center gap-6 bg-white border-t shrink-0">
          <Button 
            className="bg-[#FF6C01] hover:bg-[#e66000] text-white font-black px-16 h-10 rounded-xl uppercase text-xs shadow-lg shadow-orange-200 transition-transform active:scale-95"
            onClick={handleFinalCreate}
          >
            Confirmar
          </Button>
          <Button 
            className="bg-[#FF6C01] hover:bg-[#e66000] text-white font-black px-16 h-10 rounded-xl uppercase text-xs shadow-lg shadow-orange-200 transition-transform active:scale-95"
            onClick={onClose}
          >
            Cancelar
          </Button>
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

function OrderDetailsTechnicalModal({ appointment, onClose, onRequestAppointment }: any) {
  const DataItem = ({ label, value, highlight = false }: any) => (
    <div className="flex flex-col py-2 border-b border-slate-50 group hover:bg-slate-50/50 transition-colors">
      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest group-hover:text-orange-500">{label}</span>
      <span className={cn("text-[10px] font-bold", highlight ? "text-orange-600" : "text-[#1C1E59]")}>{value || '---'}</span>
    </div>
  );

  return (
    <Dialog open={!!appointment} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden border-none rounded-[2rem] shadow-2xl bg-white">
        <div className="bg-[#1C1E59] px-6 py-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-white/10 rounded-xl"><LayoutList size={18} className="text-orange-400" /></div>
             <div>
                <p className="text-[8px] font-bold text-orange-400 uppercase tracking-[0.2em]">Maestro de Documento</p>
                <h3 className="text-lg font-black mt-1 uppercase">OC: {appointment.id}</h3>
             </div>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white p-2 hover:bg-white/10 rounded-full"><X size={20} /></button>
        </div>

        <div className="p-8 grid grid-cols-3 gap-x-12 gap-y-1">
          {/* Columna 1 */}
          <div className="space-y-1">
            <DataItem label="Producto" value={appointment.product} />
            <DataItem label="Nit Proveedor" value={appointment.nit} />
            <DataItem label="Descripción Company" value={appointment.descripcionCompany} />
            <DataItem label="Estado Documento" value="ACTIVO" />
            <DataItem label="Localidad" value={appointment.locationName} />
            <DataItem label="Canal" value={appointment.canal} />
          </div>
          {/* Columna 2 */}
          <div className="space-y-1 border-x border-slate-100 px-8">
            <DataItem label="Fecha Inicio" value={appointment.date} />
            <DataItem label="Fecha Fin" value={appointment.date} />
            <DataItem label="Tipo de Operación" value={appointment.operationType} />
            <DataItem label="Tipo Mercancía" value="GENERAL ..." />
            <DataItem label="Tipo de Cargue" value={appointment.loadType} />
            <DataItem label="Código Artículo" value={appointment.codigoArticulo} />
          </div>
          {/* Columna 3 */}
          <div className="space-y-1">
            <DataItem label="Peso" value={`${appointment.peso} KG`} />
            <DataItem label="Volumen" value="4.50 M3" />
            <DataItem label="Litros" value="0.00" />
            <DataItem label="Cantidad Pedida" value={appointment.quantityOrdered} />
            <DataItem label="Cantidad Recibida" value="0" highlight={true} />
            <DataItem label="U. Medida" value={appointment.unidadMedida} />
          </div>
        </div>

        <div className="p-6 bg-slate-50 flex justify-end gap-3 border-t">
          <Button onClick={onClose} className="bg-[#1C1E59] text-white text-[10px] font-black uppercase px-8 rounded-xl h-11">Cerrar</Button>
          {!appointment.isReadyForAssignment && (
             <Button onClick={() => { onClose(); onRequestAppointment(); }} className="bg-orange-500 text-white text-[10px] font-black uppercase px-8 rounded-xl h-11 shadow-lg shadow-orange-500/20">Solicitar Cita</Button>
          )}
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
 // -- VISTA MENSUAL ACTUALIZADA --
  if (timeFrame === "month") {
    const today = new Date();
    // Verificamos si el mes/año que estamos viendo es el actual
    const isCurrentMonth = currentTime.getMonth() === today.getMonth() && 
                          currentTime.getFullYear() === today.getFullYear();
    const currentDayNumber = today.getDate();

    const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
    
    return (
      <div className="flex flex-col h-full bg-slate-50 p-4 overflow-auto custom-scrollbar">
         <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-300 rounded-lg overflow-hidden shadow-sm">
             {["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"].map(d => (
                <div key={d} className="bg-slate-100 p-2 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">{d}</div>
             ))}
             {daysInMonth.map(day => {
                const isToday = isCurrentMonth && day === currentDayNumber;
                
                return (
                  <div key={day} className={cn(
                    "bg-white h-24 p-2 relative hover:bg-slate-50 transition-colors group",
                    isToday && "bg-orange-50/40" // Fondo suave para el día actual
                  )}>
                     {/* Círculo indicador del día */}
                     <div className={cn(
                       "text-xs font-bold w-7 h-7 flex items-center justify-center rounded-full transition-all",
                       isToday 
                        ? "bg-[#FF6C01] text-white shadow-lg shadow-orange-200 scale-110" 
                        : "text-gray-400 group-hover:text-[#1C1E59]"
                     )}>
                       {day}
                     </div>

                     {/* Badge de "HOY" */}
                     {isToday && (
                       <span className="absolute top-2 right-2 text-[8px] font-black text-orange-600 uppercase tracking-tighter">
                         Hoy
                       </span>
                     )}

                     {/* Contenido de ejemplo (Citas) */}
                     {day === 19 && (
                       <div className="mt-2 space-y-1">
                          <div className="text-[9px] bg-blue-50 text-[#1C1E59] rounded px-1.5 py-0.5 truncate font-black border border-blue-100">
                            3 Citas
                          </div>
                       </div>
                     )}
                     
                     {/* Punto indicador si hay actividad en otros días */}
                     {!isToday && day % 7 === 0 && (
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-slate-300" />
                     )}
                  </div>
                );
             })}
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


// ... (Mantén los imports y tipos iniciales igual)

export function DockManager({ 
  locationId,         // Viene del padre (DashboardPage)
  onLocationChange,   // Función para avisar al padre
  selectedDockId      
}: DockManagerProps) {



  const [isTechnicalModalOpen, setIsTechnicalModalOpen] = useState(false);
  const [allDocksState, setAllDocksState] = useState(allDocks);
  const [allAppointmentsState, setAllAppointmentsState] = useState(pendingAppointments);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

// --- NUEVOS ESTADOS PARA REDIMENSIÓN MANUAL ---
  const [sidebarWidth, setSidebarWidth] = useState(320); // Ancho inicial
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("day");
  const [isExpanded, setIsExpanded] = useState(false);
  const [highlightedDockId, setHighlightedDockId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  const [editingAppointment, setEditingAppointment] = useState<any>(null);
  const [requestModalAppointment, setRequestModalAppointment] = useState<any>(null);
  const [createModalAppointment, setCreateModalAppointment] = useState<any>(null);
  const [selectedAptIds, setSelectedAptIds] = useState<string[]>([]);
  const [requestModalAppointments, setRequestModalAppointments] = useState<Appointment[] | null>(null);

  const [isSelectionExpanded, setIsSelectionExpanded] = useState(false);
  const [targetDockIdAfterModal, setTargetDockIdAfterModal] = useState<string | null>(null);
   
  const [isSearchOpen, setIsSearchOpen] = useState(false); 
  const [searchQuery, setSearchQuery] = useState("");
  //const isExpandedSidebar = searchQuery.length > 0 || selectedAptIds.length > 0 || isSearchOpen;
  const isExpandedSidebar = locationId !== null || searchQuery.length > 0;

  // --- NUEVOS ESTADOS PARA FECHA Y FILTRO LOCAL ---
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDockIds, setSelectedDockIds] = useState<string[]>([]);

   // --- LÓGICA DE REDIMENSIÓN ---
  const startResizing = React.useCallback(() => setIsResizing(true), []);
  const stopResizing = React.useCallback(() => setIsResizing(false), []);


const resize = React.useCallback(
    (mouseMoveEvent: MouseEvent) => {
      if (isResizing && sidebarRef.current) {
        const newWidth = mouseMoveEvent.clientX - sidebarRef.current.getBoundingClientRect().left;
        // Límites: Mínimo 280px, Máximo 800px
        if (newWidth > 280 && newWidth < 800) {
          setSidebarWidth(newWidth);
        }
      }
    },
    [isResizing]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", resize);
      window.addEventListener("mouseup", stopResizing);
    } else {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    }
    return () => {
      window.removeEventListener("mousemove", resize);
      window.removeEventListener("mouseup", stopResizing);
    };
  }, [isResizing, resize, stopResizing]);



  // 2. Obtener datos de la localidad activa
  const currentLocationData = useMemo(() => 
    locationsData.find(l => l.id === locationId), 
  [locationId]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Sincronizar vista si cambia la selección desde el Navbar
  useEffect(() => {
    if (selectedDockId && selectedDockId !== 'all') {
      setViewMode('timeline');
      setHighlightedDockId(selectedDockId);
    } else {
      setViewMode('grid');
    }
  }, [selectedDockId]);

  // --- LÓGICA DE NAVEGACIÓN DE FECHAS ---
  const handleNavigate = (direction: 'next' | 'prev') => {
    const newDate = new Date(currentDate);
    const offset = direction === 'next' ? 1 : -1;

    if (viewMode === 'grid' || timeFrame === 'day') {
      newDate.setDate(newDate.getDate() + offset);
    } else if (timeFrame === 'week') {
      newDate.setDate(newDate.getDate() + (offset * 7));
    } else if (timeFrame === 'month') {
      newDate.setMonth(newDate.getMonth() + offset);
    }
    setCurrentDate(newDate);
  };

 // --- LÓGICA DE NAVEGACIÓN DE FECHAS MODIFICADA ---
const dateDisplayLabel = useMemo(() => {
  const today = new Date();
  const isSameDay = currentDate.toDateString() === today.toDateString();
  
  // Formateamos la fecha actual (ej: "03 feb")
  const formattedDate = currentDate.toLocaleDateString('es-ES', { 
    day: '2-digit', 
    month: 'short' 
  }).replace('.', ''); // Quitamos el punto que a veces pone el locale es-ES

  if (viewMode === 'grid' || timeFrame === 'day') {
    // Si es hoy, combinamos la palabra "Hoy" con la fecha formateada
    return isSameDay ? `Hoy, ${formattedDate}` : formattedDate;
  }

  if (timeFrame === 'week') {
    const start = new Date(currentDate);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `${start.getDate()} - ${end.getDate()} ${end.toLocaleDateString('es-ES', { month: 'short' })}`;
  }

  if (timeFrame === 'month') {
    return currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' }).toUpperCase();
  }

  return formattedDate;
}, [currentDate, viewMode, timeFrame]);




  // 1. Filtrar Localidades para la búsqueda inicial
  const filteredLocations = useMemo(() => {
    if (locationId) return []; // Si ya hay ID, no mostramos la lista de sedes
    if (!searchQuery.trim()) return locationsData;
    return locationsData.filter(loc => 
      loc.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, locationId]);


  const filteredDocks = useMemo(() => {
    if (!locationId) return []; 
    let filtered = allDocksState.filter((dock) => dock.locationId === locationId);
    if (selectedDockIds.length > 0) {
      filtered = filtered.filter((dock) => selectedDockIds.includes(dock.id));
    }
    return filtered;
  }, [allDocksState, locationId, selectedDockIds]);



const filteredAppointments = useMemo(() => {
    if (!locationId) return [];
    let filtered = allAppointmentsState.filter((apt) => apt.locationId === locationId);
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((apt) => 
        apt.carrier.toLowerCase().includes(query) || 
        apt.id.toLowerCase().includes(query) ||
        apt.city?.toLowerCase().includes(query) ||
        apt.product?.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [allAppointmentsState, locationId, searchQuery]);



  const docksWithTemporalStatus = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const viewedDate = new Date(currentDate);
    viewedDate.setHours(0, 0, 0, 0);

    return filteredDocks.map(dock => {
      // 1. SI ES FUTURO: Todo vacío/disponible
      if (viewedDate > today) {
        return {
          ...dock,
          status: "available" as const,
          occupancy: 0,
          currentAppointment: undefined 
        };
      }

      // 2. SI ES PASADO: Simular historial basado en el ID
      if (viewedDate < today) {
        const hash = dock.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        const mockType = hash % 4; 
        if (mockType === 0) return { ...dock, status: "occupied" as const, occupancy: 100 };
        if (mockType === 1) return { ...dock, status: "available" as const, occupancy: 75 };
        if (mockType === 2) return { ...dock, status: "available" as const, occupancy: 30 };
        return { ...dock, status: "available" as const, occupancy: 0, currentAppointment: undefined };
      }

      // 3. SI ES HOY: Estado real
      return dock;
    });
  }, [filteredDocks, currentDate]);

    // --- LÓGICA PARA EL NOMBRE DEL MUELLE SUGERIDO ---
  const suggestedDockDisplay = useMemo(() => {
    if (!targetDockIdAfterModal) return "2"; // Por defecto si no es arrastre
    const dock = allDocksState.find(d => d.id === targetDockIdAfterModal);
    if (!dock) return "2";
    // Limpiamos el nombre para que quepa en el badge (ej: "Muelle A-03" -> "A-03")
    return dock.name.replace("Muelle ", "");
  }, [targetDockIdAfterModal, allDocksState]);

 const handleDrop = (appointmentId: string, dockId: string) => {
    const apt = allAppointmentsState.find((a) => a.id === appointmentId);
    if (!apt) return;

    setTargetDockIdAfterModal(dockId); // Guardamos el ID del muelle soltado
    setRequestModalAppointments([apt]); 
    setDraggingId(null); 
    setDropTargetId(null); 
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

   // --- NUEVOS HANDLERS PARA EL FLUJO DE SEDE ---
const handleSelectLocation = (id: string) => {
    onLocationChange(id); 
    setSearchQuery("");
  };

  const handleClearLocation = () => {
    onLocationChange(null);
    setSearchQuery("");
  };

// --- HANDLER PARA SOLICITAR CITA MÚLTIPLE ---
  const handleRequestMultipleAppointments = () => {
    const selectedDocs = allAppointmentsState.filter(doc => selectedAptIds.includes(doc.id));
    
    if (selectedDocs.length > 0) {
      setRequestModalAppointments(selectedDocs);
    }
  };

  const toggleAptSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedAptIds(prev => prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]);
  };

  const SelectLocationState = ({ minimalist = false }: { minimalist?: boolean }) => (
    <div className="h-full flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-300">
      <div className={cn("rounded-full bg-slate-100 flex items-center justify-center mb-3", minimalist ? "w-12 h-12" : "w-16 h-16")}>
        <MapPin className={cn("text-slate-400", minimalist ? "w-6 h-6" : "w-8 h-8")} />
      </div>
      <h3 className={cn("font-bold text-slate-700 uppercase", minimalist ? "text-xs" : "text-sm")}>Selecciona una Localidad</h3>
    </div>
  );

  return (
    
     <div className={isExpanded ? "fixed inset-0 z-50 bg-white overflow-y-auto" : "h-full flex flex-col p-1 gap-2 overflow-hidden"}>
      {editingAppointment && <AppointmentEditModal appointment={editingAppointment.apt} dockName={editingAppointment.dockName} currentDockId={editingAppointment.dockId} availableDocks={filteredDocks} onClose={() => setEditingAppointment(null)} onSave={handleSaveAppointment} onDelete={handleDeleteAppointment} />}

    {requestModalAppointments && (
  <RequestAppointmentModal 
    appointments={requestModalAppointments} 
    onClose={() => setRequestModalAppointments(null)} 
    onContinue={(data) => { 
        // Preparamos los items con sus nuevas cantidades
        const itemsWithQuantities = data.items.map((item: any) => ({
          ...item,
          quantityToDeliver: data.quantities[item.id]
        }));
        
        setCreateModalAppointment(itemsWithQuantities); // Pasamos el array al siguiente modal
        setRequestModalAppointments(null); 
    }} 
  />
)}


 {createModalAppointment && (
  <CreateAppointmentModal 

    selectedItems={Array.isArray(createModalAppointment) ? createModalAppointment : [createModalAppointment]} 
    suggestedDock={suggestedDockDisplay} 
    onClose={() => {
      setCreateModalAppointment(null);
      setTargetDockIdAfterModal(null);
    }} 
    onConfirm={(finalAppointment) => { 
        const targetDockId = targetDockIdAfterModal || "dock-1a-1"; 
        
        setAllDocksState(prev => prev.map(dock => 
          dock.id === targetDockId 
            ? { ...dock, status: "occupied", occupancy: 100, currentAppointment: finalAppointment } 
            : dock
        ));

        // Filtramos para quitar todos los documentos seleccionados de la lista lateral
        const idsToRemove = finalAppointment.items.map((item: any) => item.id);
        setAllAppointmentsState(prev => prev.filter(a => !idsToRemove.includes(a.id)));
        
        setCreateModalAppointment(null); 
        setTargetDockIdAfterModal(null);
        setSelectedAptIds([]);
    }} 
  />
)}

       <div className={cn("h-full flex gap-2 p-1 bg-[#f8fafc] overflow-hidden transition-all duration-500", isExpanded && "fixed inset-0 z-50 bg-white")}>
  {/* === PANEL IZQUIERDO (AHORA REDIMENSIONABLE) === */}
        <div 
          ref={sidebarRef}
          style={{ width: sidebarWidth }}
          className={cn(
            "shrink-0 flex flex-col bg-white rounded-[1.5rem] border border-slate-200 shadow-xl relative overflow-hidden",
            !isResizing && "transition-[width] duration-300 ease-in-out"
          )}
        >
          {/* 1. BUSCADOR */}
          <div className="bg-white p-3 border-b border-slate-100 flex items-center gap-2 shrink-0 z-10">
             <div className="relative flex-1">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
               <input 
                 type="text"
                 placeholder={locationId ? "BUSCAR DOCUMENTO / SKU..." : "BUSCAR SEDE OPERATIVA..."}
                 className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-bold text-[#1C1E59] placeholder:text-slate-400 uppercase outline-none focus:ring-1 focus:ring-orange-500 transition-all"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
               {searchQuery && (<button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={14} /></button>)}
             </div>
          </div>

          {/* 2. ITEM SELECCIONADO */}
          {locationId && currentLocationData && (
             <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 animate-in slide-in-from-top-2 duration-200 shrink-0">
                <div className="flex items-center justify-between bg-white border border-slate-200 rounded-lg p-2 shadow-sm">
                   <div className="flex items-center gap-2 overflow-hidden">
                      <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                         <MapPin className="w-3 h-3 text-orange-600" />
                      </div>
                      <div className="flex flex-col min-w-0">
                         <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Sede Seleccionada</span>
                         <span className="text-[10px] font-black text-[#1C1E59] uppercase truncate">{currentLocationData.name}</span>
                      </div>
                   </div>
                   <button onClick={handleClearLocation} className="p-1.5 hover:bg-slate-50 rounded-md text-slate-400 hover:text-red-500 transition-colors" title="Cambiar Sede"><X size={14} strokeWidth={3} /></button>
                </div>
             </div>
          )}

          {/* 3. LISTADO (SEDES o DOCUMENTOS) */}
          <div className="flex-1 overflow-y-auto px-3 py-3 custom-scrollbar bg-white/50">
            {!locationId ? (
               <div className="space-y-2 animate-in fade-in duration-300">
                  <div className="text-[9px] font-black text-slate-400 uppercase tracking-wider mb-2 px-1">Resultados ({filteredLocations.length})</div>
                  {filteredLocations.map(loc => {
                    const dockCount = allDocksState.filter(d => d.locationId === loc.id).length;
                    return (
                      <div key={loc.id} onClick={() => handleSelectLocation(loc.id)} className="group flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/10 cursor-pointer transition-all hover:shadow-sm">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-white flex items-center justify-center border border-slate-200 group-hover:border-orange-200 transition-colors">
                               <MapPin className="w-4 h-4 text-slate-400 group-hover:text-orange-500" />
                            </div>
                            <div>
                               <h4 className="text-[11px] font-black text-[#1C1E59] uppercase group-hover:text-orange-600 transition-colors">{loc.name}</h4>
                               <p className="text-[9px] font-medium text-slate-400 uppercase">{dockCount} Muelles Operativos</p>
                            </div>
                         </div>
                         <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-orange-400" />
                      </div>
                    );
                  })}
                  {filteredLocations.length === 0 && (<div className="text-center py-10 text-slate-400 text-[10px] font-bold uppercase">No se encontraron sedes</div>)}
               </div>
            ) : (
               <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  
                     {/* HEADER DE SELECCIÓN CON BOTÓN SOLICITAR CITA */}
                   <div className="flex justify-between items-center mb-3 px-1 h-8">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Documentos ({filteredAppointments.length})</span>
                      {selectedAptIds.length > 0 && (
                         <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                            <span className="text-[9px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">{selectedAptIds.length} selec.</span>
                            <Button 
                              size="sm" 
                              className="h-6 px-3 text-[9px] font-black bg-orange-500 hover:bg-orange-600 text-white border-none rounded-lg shadow-sm"
                              onClick={handleRequestMultipleAppointments}
                            >
                              SOLICITAR CITA
                            </Button>
                         </div>
                      )}
                   </div>
                   {filteredAppointments.length > 0 ? (
                     filteredAppointments.map(doc => (
                       <DocumentMaestroCard key={doc.id} apt={doc} isSelected={selectedAptIds.includes(doc.id)} onSelect={(id: string) => toggleAptSelection(id, { stopPropagation: () => {} } as any)} onDragStart={(e: React.DragEvent, id: string) => { setDraggingId(id); e.dataTransfer.setData("appointmentId", id); }} onDragEnd={() => setDraggingId(null)} />
                     ))
                   ) : (
                     <div className="flex flex-col items-center justify-center py-12 text-slate-300 gap-2"><Package size={32} strokeWidth={1.5} /><p className="text-[10px] font-bold uppercase">No hay documentos pendientes</p></div>
                   )}
               </div>
            )}
          </div>
        </div>

        {/* === RESIZER (BARRA DE ARRASTRE) === */}
        <div
          className="w-4 z-20 cursor-col-resize flex items-center justify-center group hover:scale-110 active:scale-110 transition-transform -ml-2"
          onMouseDown={startResizing}
        >
          {/* Línea visual del resizer */}
          <div className={cn(
            "w-1 h-12 rounded-full transition-all duration-200",
            isResizing ? "bg-orange-500 scale-y-110" : "bg-slate-300/50 group-hover:bg-orange-400"
          )} />
        </div>



        {/* PANEL DERECHO (MUELLES) */}
        <div className="flex-1 flex flex-col min-h-0 bg-white border border-slate-200 rounded-[1.5rem] overflow-hidden shadow-sm">
          <div className="p-2 border-b flex justify-between items-center bg-slate-50/20">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-white text-slate-600 font-bold px-3 py-1 border-slate-200 shadow-sm">{filteredDocks.length} Muelles</Badge>
              
              {/* --- SELECT DE MUELLES INTEGRADO (MODIFICADO) --- */}
{/* --- SELECTOR MULTI-MUELLE (POPOVER) --- */}
{locationId && (
  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
    <div className="w-px h-6 bg-slate-200" />
    <LayoutGrid className="w-4 h-4 text-yms-cyan" />
    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Ver:</span>
    
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          role="combobox" 
          className="h-8 justify-between text-xs font-bold text-[#1C1E59] border-slate-200 bg-white min-w-[180px]"
        >
          {selectedDockIds.length === 0 
            ? "Todos los muelles" 
            : selectedDockIds.length === 1 
              ? allDocksState.find(d => d.id === selectedDockIds[0])?.name 
              : `${selectedDockIds.length} muelles seleccionados`}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      
      <PopoverContent className="w-[220px] p-0 bg-white border border-slate-200 shadow-xl rounded-lg" align="start">
        <div className="max-h-[300px] overflow-y-auto p-1 custom-scrollbar">
          
          {/* OPCIÓN: TODOS */}
          <div 
            className="flex items-center px-2 py-2 cursor-pointer hover:bg-slate-50 rounded-md transition-colors"
            onClick={() => setSelectedDockIds([])} // Vaciar array = Todos
          >
            <div className={cn(
              "mr-2 flex h-4 w-4 items-center justify-center rounded border border-slate-300",
              selectedDockIds.length === 0 ? "bg-[#1C1E59] border-[#1C1E59]" : "bg-white"
            )}>
               {selectedDockIds.length === 0 && <CheckCircle className="h-3 w-3 text-white" />}
            </div>
            <span className="text-xs font-bold text-slate-700">Todos los muelles</span>
          </div>

          <div className="h-px bg-slate-100 my-1" />

          {/* LISTA DE MUELLES INDIVIDUALES */}
          {allDocksState
            .filter(d => d.locationId === locationId)
            .map((dock) => {
              const isSelected = selectedDockIds.includes(dock.id);
              return (
                <div 
                  key={dock.id}
                  className={cn(
                    "flex items-center px-2 py-1.5 cursor-pointer rounded-md transition-colors",
                    isSelected ? "bg-blue-50" : "hover:bg-slate-50"
                  )}
                  onClick={() => {
                    setSelectedDockIds(prev => 
                      isSelected 
                        ? prev.filter(id => id !== dock.id) // Deseleccionar
                        : [...prev, dock.id] // Seleccionar
                    );
                  }}
                >
                  <div className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded border transition-all",
                    isSelected ? "bg-orange-500 border-orange-500" : "border-slate-300 bg-white"
                  )}>
                    {isSelected && <CheckCircle className="h-3 w-3 text-white" />}
                  </div>
                  <span className={cn("text-xs font-bold", isSelected ? "text-[#1C1E59]" : "text-slate-600")}>
                    {dock.name}
                  </span>
                </div>
              );
            })}
        </div>
      </PopoverContent>
    </Popover>
  </div>
)}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
                 <Button size="icon" variant="ghost" className="h-7 w-7 hover:bg-slate-50" disabled={!locationId} onClick={() => handleNavigate('prev')}><ChevronLeft className="w-4 h-4" /></Button>
                 <div className="min-w-[80px] text-center"><span className="font-black text-[10px] uppercase text-indigo-900 tracking-tight">{dateDisplayLabel}</span></div>
                 <Button size="icon" variant="ghost" className="h-7 w-7 hover:bg-slate-50" disabled={!locationId} onClick={() => handleNavigate('next')}><ChevronRight className="w-4 h-4" /></Button>
              </div>

              


              <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-1.5 shadow-sm">
                <div className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></div>
                <div className="flex flex-col leading-none"><span className="text-[8px] font-black text-emerald-700 tracking-wide uppercase">En Vivo</span><span className="text-[10px] font-mono text-emerald-600 font-bold">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
              </div>

              {/* ... dentro del panel derecho, donde están los botones de vista ... */}

<div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
  {/* Selector de Modo de Vista (Grid / Timeline) */}
  <Button 
    disabled={!locationId} 
    variant={viewMode === 'grid' ? 'default' : 'ghost'} 
    size="icon" 
    className={cn("h-7 w-7", viewMode === 'grid' ? "bg-white text-indigo-900 shadow-sm rounded-lg" : "text-slate-500")} 
    onClick={() => setViewMode('grid')}
  >
    <LayoutGrid className="w-4 h-4" />
  </Button>
  <Button 
    disabled={!locationId} 
    variant={viewMode === 'timeline' ? 'default' : 'ghost'} 
    size="icon" 
    className={cn("h-7 w-7", viewMode === 'timeline' ? "bg-white text-indigo-900 shadow-sm rounded-lg" : "text-slate-500")} 
    onClick={() => setViewMode('timeline')}
  >
    <CalendarIcon className="w-4 h-4" />
  </Button>

  {/* NUEVO: SELECTOR DÍA / SEMANA / MES (Aparece solo en Timeline) */}
  {viewMode === 'timeline' && (
    <>
      <div className="w-px h-4 bg-slate-300 mx-1" />
      <div className="flex items-center gap-1">
        {(['day', 'week', 'month'] as const).map((frame) => (
          <Button
            key={frame}
            variant={timeFrame === frame ? 'default' : 'ghost'}
            className={cn(
              "h-7 px-3 text-[9px] font-black uppercase tracking-tighter transition-all",
              timeFrame === frame 
                ? "bg-white text-[#ff6b00] shadow-sm rounded-lg" 
                : "text-slate-400 hover:text-slate-600"
            )}
            onClick={() => setTimeFrame(frame)}
          >
            {frame === 'day' ? 'Día' : frame === 'week' ? 'Semana' : 'Mes'}
          </Button>
        ))}
      </div>
    </>
  )}


  
</div>
            </div>
          </div>
          
          {/* VISTA CON FONDO CUADRICULADO */}
<div className="flex-1 overflow-hidden bg-white bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] relative">
  {!locationId ? (
    <SelectLocationState minimalist={false} />
  ) : viewMode === 'grid' ? (
    <div className="p-4 flex flex-wrap gap-3 content-start items-start overflow-y-auto h-full bg-slate-50/20 backdrop-blur-[1px]">
      {/* CAMBIO AQUÍ: Usar docksWithTemporalStatus */}
      {docksWithTemporalStatus.map(dock => (
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
    /* CAMBIO AQUÍ: Usar docksWithTemporalStatus */
    <DockTimeline 
      docks={docksWithTemporalStatus} 
      timeFrame={timeFrame} 
      highlightedDockId={highlightedDockId} 
      onAppointmentClick={handleAppointmentClick} 
      currentTime={currentTime} 
    />
  )}
</div>
        </div>
      </div>

      {selectedAppointment && isTechnicalModalOpen && (
        <OrderDetailsTechnicalModal appointment={selectedAppointment} onClose={() => setIsTechnicalModalOpen(false)} onRequestAppointment={() => setRequestModalAppointments([selectedAppointment])} />
      )}
    </div>
  );
}