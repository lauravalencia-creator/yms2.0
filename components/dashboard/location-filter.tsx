"use client";

import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,

} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { 
  Search, BarChart3, ClipboardList, Users, Upload, Calendar as CalendarIcon,
  FileUp, CheckCircle2, FileText, History as HistoryIcon, Eye, Download, 
  RotateCw, Filter, ChevronLeft, ChevronRight, AlertTriangle,
  Package, X, QrCode, ArrowRight, LayoutGrid,
  Truck, Box, Calendar, Building2, Hash, ArrowLeft, RefreshCw, ChevronDown, Check
} from 'lucide-react';

import * as DialogPrimitive from "@radix-ui/react-dialog";

import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

// --- CONSTANTES DE COLOR ---
const COLORS = {
  NAVY: "text-[#1e2b58]",
  ORANGE_BG: "bg-[#ff6b00]",
  ORANGE_HOVER: "hover:bg-[#e66000]",
  ORANGE_TEXT: "text-[#ff6b00]",
  ORANGE_LIGHT_BG: "bg-[#FFEAD5]",
};

// --- ICONOS ---
function MapPinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
    </svg>
  );
}

function BuildingIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M4.5 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5h-.75V3.75a.75.75 0 0 0 0-1.5h-15ZM9 6a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm-.75 3.75A.75.75 0 0 1 9 9h1.5a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM9 12a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm3.75-5.25A.75.75 0 0 1 13.5 6H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM13.5 9a.75.75 0 0 0 0 1.5H15a.75.75 0 0 0 0-1.5h-1.5Zm-.75 3.75a.75.75 0 0 1 .75-.75H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM9 19.5v-2.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 9 19.5Z" clipRule="evenodd" />
    </svg>
  );
}

function LayersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M11.644 1.59a.75.75 0 0 1 .712 0l9.75 5.25a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.712 0l-9.75-5.25a.75.75 0 0 1 0-1.32l9.75-5.25Z" />
      <path d="m3.265 10.602 7.668 4.129a2.25 2.25 0 0 0 2.134 0l7.668-4.13 1.37.739a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.71 0l-9.75-5.25a.75.75 0 0 1 0-1.32l1.37-.738Z" />
      <path d="m10.933 19.231-7.668-4.13-1.37.739a.75.75 0 0 0 0 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 0 0 0-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 0 1-2.134-.001Z" />
    </svg>
  );
}

  const REGISTRO_OPCIONES = [
  { id: "entrada", label: "Registro de entrada", icon: ArrowRight },
  { id: "salida", label: "Registro de salida", icon: ArrowLeft },
  { id: "ini-descargue", label: "Inicio de Descargue", icon: Package },
  { id: "fin-descargue", label: "Fin de Descargue", icon: Check },
  { id: "ini-cargue", label: "Inicio de Cargue", icon: Package },
  { id: "fin-cargue", label: "Fin de Cargue", icon: Check },
];


// --- UTILS UI ---
const FilterLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block font-sans">
    {children}
  </label>
);

const InputWithIcon = ({ icon: Icon, ...props }: any) => (
  <div className="relative">
    <Input 
      {...props} 
      className="pr-10 h-11 rounded-xl border-gray-200 focus:border-[#ff6b00] focus:ring-[#ff6b00]/20 text-sm w-full" 
    />
    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
      <Icon size={18} />
    </div>
  </div>
);

// --- COMPONENTES TABLAS DE USUARIOS ---
function UsuariosTable() {
  return (
    <div className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className={cn("font-bold uppercase tracking-wide h-10 w-[20%]", COLORS.NAVY)}>Usuario</TableHead>
            <TableHead className={cn("font-bold uppercase tracking-wide h-10 w-[15%]", COLORS.NAVY)}>Perfil</TableHead>
            <TableHead className={cn("font-bold uppercase tracking-wide h-10 w-[15%]", COLORS.NAVY)}>Tipo</TableHead>
            <TableHead className={cn("font-bold uppercase tracking-wide h-10 w-[15%]", COLORS.NAVY)}>Localidad</TableHead>
            <TableHead className={cn("font-bold uppercase tracking-wide h-10 w-[15%]", COLORS.NAVY)}>Estado</TableHead>
            <TableHead className={cn("font-bold uppercase tracking-wide h-10 w-[20%]", COLORS.NAVY)}>Email</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow className="border-b border-gray-100 hover:bg-slate-50/50">
            <TableCell className="font-bold text-gray-700 text-sm py-4">UNIDADES</TableCell>
            <TableCell className="text-gray-600 text-sm">Administrador</TableCell>
            <TableCell className="text-gray-600 text-sm">Interno</TableCell>
            <TableCell className="text-gray-600 text-sm">Todas</TableCell>
            <TableCell>
              <Badge className="bg-emerald-100 text-emerald-600 hover:bg-emerald-200 border-none shadow-none font-bold px-3">Activo</Badge>
            </TableCell>
            <TableCell className="text-gray-500 text-sm">unidades@example.com</TableCell>
          </TableRow>

          <TableRow className="border-b border-gray-100 hover:bg-slate-50/50">
            <TableCell className="font-bold text-gray-700 text-sm py-4">JUAN.PEREZ</TableCell>
            <TableCell className="text-gray-600 text-sm">Operativo</TableCell>
            <TableCell className="text-gray-600 text-sm">Externo</TableCell>
            <TableCell className="text-gray-600 text-sm">Bogotá</TableCell>
            <TableCell>
              <Badge className="bg-emerald-100 text-emerald-600 hover:bg-emerald-200 border-none shadow-none font-bold px-3">Activo</Badge>
            </TableCell>
            <TableCell className="text-gray-500 text-sm">juan.perez@example.com</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

function PerfilesTable() {
  return (
    <div className="overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-none">
            <TableHead className={cn("font-bold uppercase tracking-wide h-10 w-[25%]", COLORS.NAVY)}>Perfil</TableHead>
            <TableHead className={cn("font-bold uppercase tracking-wide h-10 w-[40%]", COLORS.NAVY)}>Descripción</TableHead>
            <TableHead className={cn("font-bold uppercase tracking-wide h-10 w-[20%]", COLORS.NAVY)}>Usuarios</TableHead>
            <TableHead className={cn("font-bold uppercase tracking-wide h-10 w-[15%]", COLORS.NAVY)}>Estado</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableRow className="border-b border-gray-100 hover:bg-slate-50/50">
            <TableCell className="font-bold text-gray-700 text-sm py-4">Administrador</TableCell>
            <TableCell className="text-gray-600 text-sm">Acceso total al sistema</TableCell>
            <TableCell className="text-gray-600 text-sm">5</TableCell>
            <TableCell>
              <Badge className="bg-emerald-100 text-emerald-600 hover:bg-emerald-200 border-none shadow-none font-bold px-3">Activo</Badge>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

// --- CONTENIDO: FILTROS DE BÚSQUEDA ---
function ReportFiltersContent() {
  return (
    <div className="py-2 space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <FilterLabel>Fecha Inicial</FilterLabel>
          <InputWithIcon placeholder="dd/mm/aaaa" icon={CalendarIcon} />
        </div>
        <div>
          <FilterLabel>Fecha Final</FilterLabel>
          <InputWithIcon placeholder="dd/mm/aaaa" icon={CalendarIcon} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <FilterLabel>Localidad</FilterLabel>
          <Input placeholder="Ej: CEDI Norte" className="h-11 rounded-xl border-gray-200 text-sm focus:border-[#ff6b00] focus:ring-[#ff6b00]/20 w-full" />
        </div>
        <div>
          <FilterLabel>Proveedor</FilterLabel>
          <Input placeholder="Nombre del Proveedor" className="h-11 rounded-xl border-gray-200 text-sm focus:border-[#ff6b00] focus:ring-[#ff6b00]/20 w-full" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <FilterLabel>Estado</FilterLabel>
          <Select>
            <SelectTrigger className="w-full h-11 rounded-xl border-gray-200 text-gray-700 focus:border-[#ff6b00] focus:ring-[#ff6b00]/20">
              <SelectValue placeholder="Cualquiera" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Cualquiera</SelectItem>
              <SelectItem value="active">Activo</SelectItem>
              <SelectItem value="inactive">Inactivo</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <FilterLabel>Gen</FilterLabel>
          <Input placeholder="Código Gen" className="h-11 rounded-xl border-gray-200 text-sm focus:border-[#ff6b00] focus:ring-[#ff6b00]/20 w-full" />
        </div>
      </div>

      <div>
        <FilterLabel>Subdirección</FilterLabel>
        <Input placeholder="Área encargada" className="h-11 rounded-xl border-gray-200 text-sm focus:border-[#ff6b00] focus:ring-[#ff6b00]/20 w-full" />
      </div>

      <div className="flex justify-end pt-4">
        <Button className={cn("font-bold uppercase tracking-wider px-10 py-6 h-12 rounded-xl text-base shadow-lg hover:shadow-xl transition-all w-48 border-none", COLORS.ORANGE_BG, COLORS.ORANGE_HOVER)}>
          Buscar
        </Button>
      </div>
    </div>
  );
}

function LogAnalysisModal({ docId, onClose }: { docId: string, onClose: () => void }) {
  return (
    <Dialog open={!!docId} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden border-0 rounded-[1.5rem] shadow-2xl">
        {/* Header Compacto */}
        <div className="relative bg-[#1C1E59] p-5 text-white">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
          <div className="relative z-10 flex justify-between items-center">
            <div>
              <h2 className="text-xl font-black italic tracking-tighter flex items-center gap-2">
                ANÁLISIS DE <span className="text-[#4CCAC8]">LOGS</span>
              </h2>
              <p className="text-cyan-400 font-mono text-[10px] uppercase tracking-widest">Expediente: {docId}</p>
            </div>
            <button onClick={onClose} className="text-white/50 hover:text-white">x</button>
          </div>
        </div>

        <div className="p-5 bg-white space-y-5">
          {/* Info General Compacta */}
          <div className="grid grid-cols-2 gap-4 border-b pb-4">
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold text-gray-400 uppercase italic">Validación</span>
              <div><Badge className="bg-red-50 text-red-500 text-[9px] py-0 px-2 shadow-none font-bold">FAILED</Badge></div>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold text-gray-400 uppercase italic">Timestamp</span>
              <p className="text-[#1C1E59] font-bold text-xs">26/01/2026, 5:27 PM</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold text-gray-400 uppercase italic">Auditor</span>
              <p className="text-[#1C1E59] font-bold text-xs">J.GARCIA</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[9px] font-bold text-gray-400 uppercase italic">Categoría</span>
              <p className="text-[#1C1E59] font-bold text-xs uppercase">Packing List</p>
            </div>
          </div>

          {/* Ruta Logística Compacta */}
          <div className="space-y-3">
            <h4 className="text-[#1C1E59] text-xs font-black italic uppercase tracking-tighter flex items-center gap-2">
              <div className="w-1 h-4 bg-cyan-400 rounded-full"></div> Ruta de Datos
            </h4>
            <div className="relative pl-6 space-y-4 before:absolute before:left-[9px] before:top-1 before:bottom-1 before:w-0.5 before:bg-gray-100">
              <div className="relative text-[11px]">
                <div className="absolute -left-[21px] w-4 h-4 rounded-full bg-white border-2 border-cyan-400 z-10"></div>
                <p className="font-bold text-[#1C1E59]">GENERACIÓN DOCUMENTAL</p>
                <p className="text-gray-400 text-[10px]">Procesado por motor YMS.</p>
              </div>
              <div className="relative text-[11px]">
                <div className="absolute -left-[21px] w-4 h-4 rounded-full bg-white border-2 border-orange-500 z-10"></div>
                <p className="font-bold text-[#1C1E59]">SINCRONIZACIÓN API</p>
                <p className="text-gray-400 text-[10px]">Transmisión a infraestructura central.</p>
              </div>
            </div>
          </div>

          {/* Anomalía Compacta */}
          <div className="bg-red-50 border border-red-100 p-3 rounded-xl flex items-center gap-3 text-red-600">
             <AlertTriangle size={16} />
             <p className="text-[10px] font-bold italic">Connection timeout with external API endpoint 504</p>
          </div>
        </div>

        {/* Footer Compacto */}
        <div className="p-4 bg-slate-50 flex gap-3 border-t border-gray-100">
          <Button className="flex-1 h-10 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold uppercase rounded-xl shadow-md">
            Reproceso Manual
          </Button>
          <Button variant="outline" className="flex-1 h-10 border-[#1C1E59] text-[#1C1E59] text-xs font-bold uppercase rounded-xl">
            Exportar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- COMPONENTE: MODAL DE CONFIRMACIÓN DE REPROCESO ---
function ReprocessConfirmModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 rounded-[2rem] shadow-2xl">
        {/* Cabecera Naranja */}
        <div className="bg-[#FF6C01] p-8 flex flex-col items-center text-white relative">
          <button onClick={onClose} className="absolute right-4 top-4 text-white/80 hover:text-white">
            x
          </button>
          
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-6 border border-white/30">
            <AlertTriangle size={32} className="text-white" />
          </div>
          
          <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-1">
            Confirmar Reproceso
          </h2>
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase opacity-90">
            Seguridad YMS • Protocolo Crítico
          </p>
        </div>

        {/* Cuerpo del Modal */}
        <div className="p-8 bg-white text-center">
          <p className="text-gray-500 text-sm leading-relaxed mb-6 italic">
            Se ha iniciado una solicitud para reprocesar <span className="font-black text-[#1C1E59] tracking-tight">1 PAQUETE(S) DE DATOS</span>. Esta acción intentará registrar nuevamente los documentos en la base de datos central de CONTROLT.
          </p>
          
          <p className="text-gray-600 font-bold text-sm italic mb-8">
            ¿Desea proceder con el envío manual a la API?
          </p>

          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1 h-14 border-gray-200 text-gray-400 font-black italic uppercase rounded-2xl text-xs hover:bg-gray-50"
            >
              Abordar Operación
            </Button>
            <Button 
              className="flex-1 h-14 bg-[#1C1E59] hover:bg-[#151744] text-white font-black italic uppercase rounded-2xl text-xs shadow-xl shadow-blue-900/30"
            >
              Iniciar Ejecución
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- COMPONENTE: MODAL HISTORIAL (CON TOGGLE Y HEADER AZUL) ---
function AuditHistoryContent() {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [isReprocessOpen, setIsReprocessOpen] = useState(false);
  // NUEVO ESTADO: Controla la vista de Creación vs Actualización
  const [operationType, setOperationType] = useState<"creacion" | "actualizacion">("creacion");

  // NUEVO: Datos actualizados con la propiedad `operation`
  const auditData = [
    { id: "DOC-1024", type: "PACKING LIST", status: "FAILED", auditor: "J.GARCIA", time: "26/01/2026, 17:27", operation: "creacion" },
    { id: "DOC-1025", type: "ASN", status: "SUCCESS", auditor: "M.RODRIGUEZ", time: "26/01/2026, 16:27", operation: "creacion" },
    { id: "DOC-2048", type: "WAYBILL", status: "SUCCESS", auditor: "A.MARTINEZ", time: "26/01/2026, 15:27", operation: "actualizacion" },
    { id: "DOC-2049", type: "CUSTOMS DECLARATION", status: "FAILED", auditor: "L.GOMEZ", time: "26/01/2026, 14:15", operation: "actualizacion" },
    { id: "DOC-1026", type: "INVOICE", status: "SUCCESS", auditor: "A.MARTINEZ", time: "26/01/2026, 15:27", operation: "creacion" },
    { id: "DOC-1027", type: "PACKING LIST", status: "SUCCESS", auditor: "J.GARCIA", time: "26/01/2026, 14:27", operation: "creacion" },
  ];

  // Filtramos los datos según el toggle seleccionado
  const filteredData = auditData.filter(row => row.operation === operationType);

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      <LogAnalysisModal docId={selectedDoc || ""} onClose={() => setSelectedDoc(null)} />
      <ReprocessConfirmModal isOpen={isReprocessOpen} onClose={() => setIsReprocessOpen(false)} />

      {/* Header Modal */}
      <div className="flex items-center justify-between mb-8 px-2 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center border border-gray-100">
            <HistoryIcon className="text-[#1C1E59]" size={20} />
          </div>
          <h2 className="text-xl font-black text-[#1C1E59] uppercase italic">Auditoría de documentos</h2>
        </div>

      
      </div>

      {/* TOOLBAR */}
      <div className="flex items-center justify-between mb-6 px-2 shrink-0 gap-3">
        {/* Buscador */}
        <div className="relative w-full max-w-sm group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-[#FF6C01]" />
          <Input 
            placeholder="Buscar por ID, Tipo o Auditor..." 
            className="bg-white border-gray-200 pl-11 h-11 rounded-xl w-full shadow-sm focus:ring-[#FF6C01]/10" 
          />
        </div>
        
        {/* ACCIONES DERECHA: Toggle + Filtros + Exportar */}
        <div className="flex items-center gap-3">
          
          {/* NUEVO AJUSTE: TOGGLE DE VISTA (Creación / Actualización) */}
          <div className="bg-slate-100 p-1 rounded-2xl flex items-center border border-gray-200 shadow-sm h-11">
            <button
              onClick={() => setOperationType("creacion")}
              className={cn(
                "px-5 h-full rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5",
                operationType === "creacion" 
                  ? "bg-white text-[#1C1E59] shadow-md" 
                  : "text-gray-400 hover:text-gray-600 hover:bg-white/50"
              )}
            >
              <div className={cn("w-1.5 h-1.5 rounded-full", operationType === "creacion" ? "bg-cyan-500" : "bg-transparent")} />
              Creación
            </button>
            <button
              onClick={() => setOperationType("actualizacion")}
              className={cn(
                "px-5 h-full rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5",
                operationType === "actualizacion" 
                  ? "bg-white text-[#1C1E59] shadow-md" 
                  : "text-gray-400 hover:text-gray-600 hover:bg-white/50"
              )}
            >
              <div className={cn("w-1.5 h-1.5 rounded-full", operationType === "actualizacion" ? "bg-orange-500" : "bg-transparent")} />
              Actualización
            </button>
          </div>

          <div className="w-px h-6 bg-gray-200 mx-1"></div>

          {/* Botón Filtros */}
          <Popover>
            <PopoverTrigger asChild>
              <Button className="h-11 px-4 rounded-xl bg-[#FF6C01] hover:bg-[#e66101] text-white font-bold gap-2 shadow-lg shadow-orange-200">
                <Filter size={18} />
                <span>Filtros</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4 rounded-2xl shadow-2xl" align="end">
              <div className="space-y-4">
                <h4 className="font-black text-[#1C1E59] text-xs uppercase italic">Filtros Avanzados</h4>
                <div className="grid grid-cols-2 gap-2">
                   <Input type="date" className="text-xs h-9" />
                   <Input type="date" className="text-xs h-9" />
                </div>
                <Button className="w-full bg-[#1C1E59] text-white text-[10px] font-bold uppercase rounded-lg">Aplicar</Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* Botón Exportar */}
          <Button className="h-11 w-11 p-0 bg-[#FF6C01] hover:bg-[#e66101] text-white rounded-xl shadow-lg shadow-orange-200">
            <FileText size={20} />
          </Button>
        </div>
      </div>

      {/* TABLA PRINCIPAL */}
      <div className="bg-white rounded-[1.5rem] border border-gray-100 shadow-xl overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <Table>
            <TableHeader className="sticky top-0 bg-[#1C1E59] z-20">
              <TableRow className="hover:bg-transparent border-none">
                <TableHead className="w-12 text-center"><input type="checkbox" className="rounded border-white/20 bg-transparent" /></TableHead>
                <TableHead className="text-[10px] font-black uppercase text-white tracking-widest italic">Documento ID</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-white tracking-widest italic">Tipo Logístico</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-white tracking-widest italic text-center">Estado</TableHead>
                <TableHead className="text-[10px] font-black uppercase text-white tracking-widest italic text-right pr-12">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Mapeamos filteredData en lugar de todos */}
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-32 text-gray-400 font-bold italic">No hay registros para esta vista.</TableCell>
                </TableRow>
              ) : (
                filteredData.map((row) => (
                  <TableRow key={row.id} className="hover:bg-slate-50/50 border-b border-gray-50 h-16">
                    <TableCell className="text-center"><input type="checkbox" className="rounded" /></TableCell>
                    <TableCell className="font-black text-xs text-[#1C1E59]">{row.id}</TableCell>
                    <TableCell className="text-[10px] font-bold text-gray-500 uppercase">{row.type}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn(
                        "text-[8px] px-3 font-black rounded-full border-none shadow-none",
                        row.status === "FAILED" ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500"
                      )}>{row.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setSelectedDoc(row.id)} className="p-2.5 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-cyan-500 shadow-sm transition-all"><Eye size={16} /></button>
                        <button className="p-2.5 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-orange-500 shadow-sm transition-all"><Download size={16} /></button>
                        {row.status === "FAILED" && <button onClick={() => setIsReprocessOpen(true)} className="p-2.5 rounded-xl bg-white border border-gray-100 text-[#FF6C01] shadow-sm hover:bg-orange-50 transition-all active:scale-90"><RotateCw size={16} /></button>}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* PAGINACIÓN */}
        <div className="px-6 py-3 bg-slate-50/50 border-t flex items-center justify-between shrink-0">
           <span className="text-[9px] font-bold text-gray-400 uppercase italic">Mostrando {filteredData.length} registros</span>
           <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7"><ChevronLeft size={14} /></Button>
              <Button className="h-7 w-7 bg-[#1C1E59] text-white text-[10px] font-bold rounded-lg shadow-md shadow-blue-900/20">1</Button>
              <Button variant="ghost" size="icon" className="h-7 w-7"><ChevronRight size={14} /></Button>
           </div>
        </div>
      </div>
    </div>
  );
}

// --- CONTENIDO: CARGA ARCHIVOS ---
function FileUploadContent({ onUpload }: { onUpload: () => void }) {
  return (
    <div className="flex flex-col h-[500px]">
      <Tabs defaultValue="documentos" className="w-full h-full flex flex-col">
        <TabsList className="w-full justify-start bg-transparent border-b border-gray-200 rounded-none p-0 space-x-8">
          <TabsTrigger 
            value="documentos" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-[3px] data-[state=active]:border-[#ff6b00] data-[state=active]:text-[#ff6b00] rounded-none px-0 py-3 font-bold text-gray-400 uppercase text-[11px] tracking-wide"
          >
            Cargar Documentos
          </TabsTrigger>
          <TabsTrigger 
            value="legacy" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-[3px] data-[state=active]:border-[#ff6b00] data-[state=active]:text-[#ff6b00] rounded-none px-0 py-3 font-bold text-gray-400 uppercase text-[11px] tracking-wide"
          >
            Carga de Documentos Legacy
          </TabsTrigger>
          <TabsTrigger 
            value="citas" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-[3px] data-[state=active]:border-[#ff6b00] data-[state=active]:text-[#ff6b00] rounded-none px-0 py-3 font-bold text-gray-400 uppercase text-[11px] tracking-wide"
          >
            Carga de Citas
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 p-6 flex flex-col items-center justify-center">
            <div className="w-full h-full border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center gap-6 relative bg-slate-50/10">
                 <div className="w-20 h-20 bg-white rounded-3xl shadow-lg shadow-gray-100 flex items-center justify-center">
                    <FileUp className="w-8 h-8 text-[#4CCAC8]" />
                 </div>
                 
                 <div className="text-center space-y-2">
                    <h3 className={cn("text-lg font-black uppercase tracking-wide", COLORS.NAVY)}>Carga tus documentos</h3>
                    <p className="text-gray-400 text-sm">Arrastra aquí o usa el botón para explorar archivos locales (.txt)</p>
                 </div>

                 <Button className={cn("font-bold uppercase tracking-wider px-8 h-12 rounded-xl shadow-lg shadow-orange-500/20", COLORS.ORANGE_BG, COLORS.ORANGE_HOVER)}>
                    <FileText className="w-4 h-4 mr-2" />
                    Seleccionar Archivos
                 </Button>
            </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-100">
           <Button 
             className={cn("text-[#ff6b00] hover:text-[#ff6b00] font-bold uppercase tracking-wider px-10 h-12 rounded-xl shadow-none hover:bg-[#FFEAD5]/80", COLORS.ORANGE_LIGHT_BG)}
             onClick={onUpload}
           >
             Subir Cita
           </Button>
        </div>
      </Tabs>
    </div>
  )
}

// --- CONTENIDO: RESULTADOS ---
function UploadResultsContent({ onClose }: { onClose: () => void }) {
  return (
    <div className="py-6">
        <h3 className="text-base font-bold text-gray-800 mb-6 pl-2">
           Carga masiva completada correctamente
        </h3>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
             <div className="bg-slate-50/50 p-4 border-b border-gray-100 flex items-center gap-3">
                 <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-[#ff6b00]" />
                 </div>
                 <span className="font-medium text-gray-700 text-sm">Citas creadas (3)</span>
             </div>
             
             <div className="p-6 space-y-4 text-sm text-gray-600">
                 <p className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#ff6b00]" />
                    Placa: WDR234 en Muelle A-02
                 </p>
                 <p className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#ff6b00]" />
                    Placa: HDTG234 en Muelle A-02
                 </p>
                 <p className="flex items-center gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[#ff6b00]" />
                    Placa: FDF322 en Muelle Despacho 03
                 </p>
             </div>
        </div>

        <div className="flex justify-end mt-8">
            <Button 
                onClick={onClose}
                className={cn("font-bold uppercase tracking-wider px-10 h-12 rounded-xl shadow-md", COLORS.ORANGE_BG, COLORS.ORANGE_HOVER)}
            >
                Cerrar
            </Button>
        </div>
    </div>
  )
}

// --- LOCATION FILTER COMPONENT ---
export interface Location {
  id: string;
  name: string;
  address: string;
  dockGroups: DockGroup[];
}

export interface DockGroup {
  id: string;
  name: string;
  dockCount: number;
  type: "inbound" | "outbound" | "mixed";
}

const locationsData: Location[] = [
  {
    id: "loc-1",
    name: "Centro de Distribucion Norte",
    address: "Av. Industrial 1250, CDMX",
    dockGroups: [
      { id: "dg-1a", name: "Muelles Recepcion A", dockCount: 4, type: "inbound" },
      { id: "dg-1b", name: "Muelles Recepcion B", dockCount: 4, type: "inbound" },
      { id: "dg-1c", name: "Muelles Despacho", dockCount: 6, type: "outbound" },
      { id: "dg-1d", name: "Muelles Mixtos", dockCount: 2, type: "mixed" },
    ],
  },
  {
    id: "loc-2",
    name: "Almacen Central Guadalajara",
    address: "Blvd. Logistico 450, GDL",
    dockGroups: [
      { id: "dg-2a", name: "Zona Carga Norte", dockCount: 8, type: "inbound" },
      { id: "dg-2b", name: "Zona Descarga Sur", dockCount: 6, type: "outbound" },
    ],
  },
  {
    id: "loc-3",
    name: "Hub Logistico Monterrey",
    address: "Parque Industrial MTY, NL",
    dockGroups: [
      { id: "dg-3a", name: "Terminal A", dockCount: 10, type: "mixed" },
      { id: "dg-3b", name: "Terminal B", dockCount: 8, type: "mixed" },
      { id: "dg-3c", name: "Refrigerados", dockCount: 4, type: "inbound" },
    ],
  },
  {
    id: "loc-4",
    name: "Centro Exportacion Tijuana",
    address: "Zona Franca 890, TIJ",
    dockGroups: [
      { id: "dg-4a", name: "Aduana Principal", dockCount: 6, type: "outbound" },
      { id: "dg-4b", name: "Cross-Dock", dockCount: 4, type: "mixed" },
    ],
  },
];

interface LocationFilterProps {
  onFilterChange: (locationId: string | null, dockGroupId: string | null) => void;
}

function RegistrosModalContent({ registroId }: { registroId: string }) {
  const opcion = REGISTRO_OPCIONES.find((opt) => opt.id === registroId) || REGISTRO_OPCIONES[0];
  
  // ESTADOS DE FLUJO: 'form' | 'scanner' | 'result'
  const [step, setStep] = useState<'form' | 'scanner' | 'result'>('form');
  const [codigo, setCodigo] = useState("");

  const handleSimularEscaneo = () => {
    setStep('scanner');
    // Simulamos que encuentra un QR después de 2 segundos
    setTimeout(() => {
      setStep('result');
    }, 2500);
  };

  // --- VISTA 1: FORMULARIO ---
  if (step === 'form') {
    return (
      <div className="flex flex-col h-full w-full bg-[#FDFDFD] overflow-hidden">
        <div className="bg-[#1C1E59] h-14 flex items-center justify-between px-6 shrink-0 w-full shadow-sm z-10">
          <div className="flex items-center gap-3">
            <Package className="text-white" size={20} />
            <h2 className="text-sm font-bold text-white uppercase tracking-tight">Gestión de Registros</h2>
          </div>
          <DialogPrimitive.Close className="text-white/40 hover:text-white outline-none p-1.5 hover:bg-white/10 rounded-full">
            <X size={20} />
          </DialogPrimitive.Close>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-4 bg-slate-50/30">
          <div className="w-full max-w-md flex flex-col items-center animate-in fade-in zoom-in-95 duration-500">
            <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4 border border-gray-100">
              <opcion.icon className="text-[#4CCAC8]" size={28} />
            </div>
            <h3 className="text-xl font-bold text-[#1C1E59] uppercase tracking-tight mb-6 text-center">{opcion.label}</h3>
            
            <div className="bg-white p-8 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.03)] w-full border border-gray-100 mb-8">
              <div className="space-y-6">
                <div className="space-y-3 text-center">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Número de Cita / Código</label>
                  <Input 
                    placeholder="Ej: CITA-9982-24"
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    className="h-14 rounded-xl border-none bg-gray-50/50 text-center text-lg font-bold shadow-inner"
                  />
                </div>
                <Button 
                  disabled={codigo.length < 3}
                  className={cn("w-full h-14 font-bold uppercase rounded-xl text-xs transition-all", 
                  codigo.length >= 3 ? "bg-[#1C1E59] text-white shadow-md" : "bg-[#F1F5F9] text-gray-400")}
                  onClick={() => setStep('result')}
                >
                  Confirmar Registro
                </Button>
              </div>
            </div>

            <div className="text-center w-full flex flex-col items-center space-y-4">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">¿Deseas agilizar el proceso?</p>
              <Button onClick={handleSimularEscaneo} className="h-12 px-8 rounded-2xl bg-[#ff6b00] hover:bg-[#e66000] flex items-center gap-3 shadow-lg shadow-orange-200">
                <QrCode size={18} className="text-white" />
                <span className="font-bold uppercase text-[11px] text-white">Escanear Código QR</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- VISTA 2: ESCÁNER ---
  if (step === 'scanner') {
    return (
      <div className="flex flex-col h-full w-full bg-white items-center p-6 animate-in fade-in duration-300">
        <div className="text-center mb-8 border border-gray-100 p-4 rounded-xl w-full max-w-sm">
           <h3 className="text-[#1C1E59] font-bold text-lg">Escáner QR Para Conductores</h3>
           <p className="text-gray-400 text-[11px]">Escanea el código QR del documento para iniciar la gestión de eventos</p>
        </div>

        {/* BOX DEL LECTOR */}
        <div className="relative w-full max-w-[320px] aspect-square bg-black rounded-[2rem] overflow-hidden shadow-2xl flex items-center justify-center">
            {/* Esquinas Cyan */}
            <div className="absolute top-8 left-8 w-8 h-8 border-t-4 border-l-4 border-cyan-400 rounded-tl-lg"></div>
            <div className="absolute top-8 right-8 w-8 h-8 border-t-4 border-r-4 border-cyan-400 rounded-tr-lg"></div>
            <div className="absolute bottom-8 left-8 w-8 h-8 border-b-4 border-l-4 border-cyan-400 rounded-bl-lg"></div>
            <div className="absolute bottom-8 right-8 w-8 h-8 border-b-4 border-r-4 border-cyan-400 rounded-br-lg"></div>

            {/* Línea de Escaneo (Animada) */}
           <div className="absolute left-[10%] w-[80%] h-1 bg-cyan-400 shadow-[0_0_15px_#22d3ee] animate-scan-loop"></div>
        </div>

        {/* Badge Escaneando */}
        <div className="mt-8 bg-blue-600 px-6 py-2 rounded-full flex items-center gap-3 shadow-lg shadow-blue-200">
            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            <span className="text-white text-[11px] font-bold uppercase tracking-wider">Escaneando...</span>
        </div>

        {/* Botón Cancelar */}
        <Button 
          variant="outline" 
          onClick={() => setStep('form')}
          className="mt-12 w-full max-w-[320px] h-12 border-red-200 text-red-500 hover:bg-red-50 font-bold gap-2 uppercase text-xs"
        >
          <X size={16} /> CANCELAR
        </Button>
      </div>
    );
  }

  // --- VISTA 3: RESULTADOS ---
  return (
    <div className="flex flex-col h-full w-full bg-slate-50/50 items-center p-6 overflow-y-auto animate-in slide-in-from-bottom-4 duration-500">
        <div className="bg-white text-center mb-6 p-4 rounded-xl w-full max-w-lg border border-gray-100">
           <h3 className="text-[#1C1E59] font-bold text-lg">Escáner QR Para Conductores</h3>
           <p className="text-gray-400 text-[11px]">Escanea el código QR del documento para iniciar la gestión de eventos</p>
        </div>

        {/* FEEDBACK ÉXITO */}
        <div className="bg-white w-full max-w-lg rounded-2xl p-6 border border-gray-100 flex flex-col items-center shadow-sm mb-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mb-4">
                <Check className="text-white" size={28} />
            </div>
            <div className="flex items-center gap-2 mb-1 text-blue-600">
                <CheckCircle2 size={16} />
                <span className="font-bold text-sm uppercase">Cita Escaneada</span>
            </div>
            <p className="text-gray-400 text-[10px]">Información de la cita cargada correctamente</p>
        </div>

        {/* INFORMACIÓN DE LA CITA */}
        <div className="bg-white w-full max-w-lg rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-50 flex items-center gap-3 bg-slate-50/30">
                <Calendar size={18} className="text-[#1C1E59]" />
                <span className="font-bold text-[#1C1E59] text-sm uppercase">Información de la Cita</span>
            </div>

            <div className="p-6 space-y-5">
                {[
                    { icon: Hash, label: "ID Cita", val: "3381589" },
                    { icon: Calendar, label: "Fecha", val: "MAR 23 ABR 2024" },
                    { icon: Truck, label: "Tipo de Vehículo", val: "CARRY (500 KILOS)" },
                    { icon: Box, label: "Tipo de Carga", val: "Mercado" },
                    { icon: Building2, label: "Proveedor", val: "13203" }
                ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between group">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-[#1C1E59]">
                                <row.icon size={16} />
                            </div>
                            <span className="text-gray-400 text-[11px] font-medium uppercase">{row.label}</span>
                        </div>
                        <span className="text-[#1C1E59] font-bold text-xs">{row.val}</span>
                    </div>
                ))}
            </div>

            {/* JSON ACCORDION MOCK */}
            <div className="bg-slate-50/80 px-6 py-3 border-t border-gray-100 flex items-center justify-between text-gray-400 cursor-pointer">
                <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px]">&lt; &gt;</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">Ver JSON completo</span>
                </div>
                <ChevronDown size={14} />
            </div>
        </div>

        {/* FOOTER ACCIONES */}
        <div className="w-full max-w-lg grid grid-cols-2 gap-3 mt-6">
            <Button 
                onClick={() => setStep('scanner')}
                className="h-14 bg-[#1C1E59] hover:bg-[#151744] text-white font-bold rounded-xl gap-3 text-xs"
            >
                <RefreshCw size={16} /> ESCANEAR OTRO QR
            </Button>
            <Button 
                variant="outline"
                onClick={() => setStep('form')}
                className="h-14 border-gray-200 text-gray-500 font-bold rounded-xl gap-3 text-xs"
            >
                <ArrowLeft size={16} /> VOLVER
            </Button>
        </div>
    </div>
  );
}

export function LocationFilter({ onFilterChange }: LocationFilterProps) {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [selectedDockGroupId, setSelectedDockGroupId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);

  const selectedLocation = locationsData.find((loc) => loc.id === selectedLocationId);

  // ESTADOS PARA REGISTROS
  const [selectedRegistro, setSelectedRegistro] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenRegistro = (id: string) => {
    setSelectedRegistro(id);
    setIsModalOpen(true);
  };


  useEffect(() => {
    onFilterChange(selectedLocationId, selectedDockGroupId);
  }, [selectedLocationId, selectedDockGroupId, onFilterChange]);

  const handleLocationChange = (value: string) => {
    setSelectedLocationId(value);
    setSelectedDockGroupId(null);
    setIsLoaded(true);
  };

  const handleDockGroupChange = (value: string) => {
    setSelectedDockGroupId(value);
  };

  const handleUploadComplete = () => {
    setIsUploadModalOpen(false);
    setTimeout(() => {
        setIsResultsModalOpen(true);
    }, 200);
  };

  const getDockTypeColor = (type: DockGroup["type"]) => {
    switch (type) {
      case "inbound": return "bg-yms-cyan/20 text-yms-cyan border-yms-cyan/30";
      case "outbound": return "bg-yms-secondary/20 text-yms-secondary border-yms-secondary/30";
      case "mixed": return "bg-yms-primary/20 text-yms-primary border-yms-primary/30";
    }
  };

  return (
       <div className="bg-white flex flex-col w-full border-none shadow-sm">
    {/* --- FILA PRINCIPAL: Logo + Filtros + Botones --- */}
    <div className="px-6 py-4 flex items-center gap-8"> {/* gap-8 mantiene una separación elegante */}
      
      {/* 1. LOGO */}
      <div className="flex-shrink-0">
        <img 
          src="/ControlT.png" 
          alt="Logo"
          className="h-10 w-auto object-contain" 
        />
      </div>

      {/* 2. SELECTOR LOCALIDAD (Agrupado cerca del logo) */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-yms-gray">
          <MapPinIcon className="w-5 h-5 text-yms-secondary" />
          <span className="font-bold text-sm text-gray-600">Localidad:</span>
        </div>
        <Select value={selectedLocationId || ""} onValueChange={handleLocationChange}>
          <SelectTrigger className={cn(
            "w-[320px] h-10 rounded-full border-gray-200 bg-white focus:ring-2 focus:ring-yms-cyan transition-all text-sm", 
            !selectedLocationId && "text-gray-400"
          )}>
            <SelectValue placeholder="Seleccionar localidad..." />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-gray-100 shadow-xl">
            {locationsData.map((location) => (
              <SelectItem key={location.id} value={location.id} className="cursor-pointer focus:bg-gray-100 focus:text-gray-900 rounded-lg m-1">
                <div className="flex flex-col py-1">
                  <span className="font-bold text-yms-primary">{location.name}</span>
                  <span className="text-[10px] text-gray-400 leading-tight">{location.address}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
        {selectedLocationId && (
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="w-px h-8 bg-yms-border" />
            <div className="flex items-center gap-2 text-yms-gray">
              <LayersIcon className="w-5 h-5 text-yms-cyan" />
              <span className="font-medium text-sm">Grupo:</span>
            </div>
            <Select value={selectedDockGroupId || ""} onValueChange={handleDockGroupChange}>
              <SelectTrigger className={cn("w-[280px] rounded-[1.25rem] border-yms-border bg-white focus:ring-2 focus:ring-yms-cyan focus:border-yms-cyan hover:border-yms-cyan/50 transition-colors", !selectedDockGroupId && "text-yms-gray")}>
                <SelectValue placeholder="Todos los grupos..." />
              </SelectTrigger>
              <SelectContent className="rounded-[1rem] border-yms-border">
                <SelectItem value="all" className="rounded-[0.75rem] cursor-pointer focus:bg-yms-cyan/10">
                  <div className="flex items-center gap-2"><LayersIcon className="w-4 h-4 text-yms-primary" /><span className="font-medium">Todos los grupos</span></div>
                </SelectItem>
                {selectedLocation?.dockGroups.map((group) => (
                  <SelectItem key={group.id} value={group.id} className="rounded-[0.75rem] cursor-pointer focus:bg-yms-cyan/10">
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-yms-primary">{group.name}</span>
                      <Badge variant="outline" className={cn("text-[10px] px-1.5 capitalize", getDockTypeColor(group.type))}>{group.type === "mixed" ? "Mixto" : group.type === "inbound" ? "Entrada" : "Salida"}</Badge>
                      <span className="text-xs text-yms-gray ml-auto">{group.dockCount}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

      {/* 3. BOTÓN ÚNICO DE ITEMS (ACCIONES) */}
        {isLoaded && selectedLocation && (
          <div className="ml-auto flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Buscar..." className="pl-9 pr-4 py-2 h-10 w-48 bg-gray-50 border-none rounded-full text-sm outline-none focus:ring-2 focus:ring-yms-cyan/20 transition-all" />
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#ff6b00] text-white hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-orange-200">
                  <LayoutGrid size={20} />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-3 rounded-[1.5rem] shadow-2xl border-gray-100 bg-white" align="end">
                <div className="space-y-4">
                  {/* SECCIÓN REGISTROS RÁPIDOS */}
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 mb-2 block">Registros</span>
                    <div className="grid grid-cols-1 gap-1">
                      {REGISTRO_OPCIONES.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => handleOpenRegistro(opt.id)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-orange-50 text-gray-600 hover:text-[#ff6b00] transition-all group text-left"
                        >
                          <opt.icon size={16} className="text-gray-400 group-hover:text-[#ff6b00]" />
                          <span className="text-xs font-bold">{opt.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-gray-100 mx-2" />

                  {/* SECCIÓN HERRAMIENTAS */}
                  <div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-3 mb-2 block">Herramientas</span>
                    <div className="flex flex-col gap-1">
                      {/* CADA BOTÓN ACTIVA SU PROPIO DIALOG */}
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-gray-600 transition-all text-left">
                            <HistoryIcon size={16} className="text-[#1C1E59]" />
                            <span className="text-xs font-bold text-[#1C1E59]">Historial de Auditoría</span>
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-7xl w-full p-10 bg-[#f8fafc] rounded-[3rem] border-0 shadow-2xl overflow-hidden max-h-[95vh]">
                          <AuditHistoryContent />
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-gray-600 transition-all text-left">
                            <BarChart3 size={16} className="text-[#1C1E59]" />
                            <span className="text-xs font-bold text-[#1C1E59]">Filtros y Reportes</span>
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-4xl w-full p-8 bg-white rounded-[2rem] border-0 shadow-2xl">
                          <DialogHeader><DialogTitle className={cn("text-center text-2xl font-black uppercase mb-2", COLORS.NAVY)}>Filtros de Búsqueda</DialogTitle></DialogHeader>
                          <ReportFiltersContent />
                        </DialogContent>
                      </Dialog>

                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-gray-600 transition-all text-left">
                            <Users size={16} className="text-[#1C1E59]" />
                            <span className="text-xs font-bold text-[#1C1E59]">Gestión de Usuarios</span>
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-7xl w-full p-8 bg-white rounded-[2rem] border-0 shadow-2xl">
                          <DialogHeader><DialogTitle className={cn("text-xl font-black uppercase", COLORS.NAVY)}>Gestión de Usuarios</DialogTitle></DialogHeader>
                          <Tabs defaultValue="usuarios" className="mt-4">
                            <TabsList className="bg-gray-50 p-1.5 rounded-full h-auto w-fit border border-gray-100">
                              <TabsTrigger value="usuarios" className="rounded-full px-6 py-2 text-xs font-bold">Usuarios</TabsTrigger>
                              <TabsTrigger value="perfiles" className="rounded-full px-6 py-2 text-xs font-bold">Perfiles</TabsTrigger>
                            </TabsList>
                            <div className="mt-6">
                              <TabsContent value="usuarios"><UsuariosTable /></TabsContent>
                              <TabsContent value="perfiles"><PerfilesTable /></TabsContent>
                            </div>
                          </Tabs>
                        </DialogContent>
                      </Dialog>

                      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
                        <DialogTrigger asChild>
                          <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 text-gray-600 transition-all text-left">
                            <Upload size={16} className="text-[#1C1E59]" />
                            <span className="text-xs font-bold text-[#1C1E59]">Carga de Archivos</span>
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-6xl w-full p-0 bg-white rounded-[2rem] border-0 shadow-2xl overflow-hidden">
                          <div className="px-8 py-5 border-b border-gray-100 flex items-center gap-3">
                            <Upload className={cn("w-5 h-5", COLORS.NAVY)} />
                            <DialogTitle className={cn("text-lg font-black uppercase", COLORS.NAVY)}>Carga de Archivos</DialogTitle>
                          </div>
                          <div className="px-8 pb-8">
                            <FileUploadContent onUpload={() => { setIsUploadModalOpen(false); setIsResultsModalOpen(true); }} />
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* MODAL REGISTROS (FUERA DEL POPOVER PARA EVITAR CONFLICTOS DE ENFOQUE) */}
            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogContent className="!fixed !inset-0 !translate-x-0 !translate-y-0 !max-w-none !w-screen !h-screen !m-0 !p-0 !rounded-none border-none bg-white z-[100] flex flex-col [&>button]:hidden">
                {selectedRegistro && <RegistrosModalContent registroId={selectedRegistro} />}
              </DialogContent>
            </Dialog>

            {/* MODAL RESULTADOS DE CARGA */}
            <Dialog open={isResultsModalOpen} onOpenChange={setIsResultsModalOpen}>
              <DialogContent className="sm:max-w-4xl w-full p-0 bg-white rounded-[2rem] border-0 shadow-2xl overflow-hidden">
                <div className="px-8 py-5 border-b border-gray-100 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <DialogTitle className={cn("text-lg font-black uppercase", COLORS.NAVY)}>Resultados de Carga</DialogTitle>
                </div>
                <div className="px-8 pb-8">
                  <UploadResultsContent onClose={() => setIsResultsModalOpen(false)} />
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
    
    
       {/* --- 3. IMAGEN DEL RECTÁNGULO (BORDE INFERIOR REAL) --- */}
      <div className="w-full leading-[0]">
        <img 
          src="/rectangle.jpg" 
          alt="Decorative border"
          className="w-full h-[4px] object-fill block" // 
        />
      </div>
    
    
    </div>
  );
}

export { locationsData };