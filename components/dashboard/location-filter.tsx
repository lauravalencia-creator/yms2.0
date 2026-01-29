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
  Search, BarChart3, Settings, Users, Upload, Calendar as CalendarIcon,
  FileUp, CheckCircle2, FileText, History as HistoryIcon, Eye, Download, 
  RotateCw, Filter, UserPlus, ChevronRight, AlertTriangle,MapPin,
  Package, X, QrCode, ArrowRight, LayoutGrid, Type,  Plus,
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

const SettingsIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg 
    viewBox="0 0 223 205" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg" 
    {...props}
  >
    <path
      fill="currentColor"
      d="M111.5 131.333C103.339 131.333 95.5123 128.137 89.7417 122.449C83.971 116.76 80.7291 109.045 80.7291 101C80.7291 92.955 83.971 85.2396 89.7417 79.551C95.5123 73.8624 103.339 70.6666 111.5 70.6666C119.661 70.6666 127.488 73.8624 133.258 79.551C139.029 85.2396 142.271 92.955 142.271 101C142.271 109.045 139.029 116.76 133.258 122.449C127.488 128.137 119.661 131.333 111.5 131.333ZM176.822 109.407C177.174 106.633 177.437 103.86 177.437 101C177.437 98.1399 177.174 95.2799 176.822 92.3333L195.372 78.2066C197.043 76.9066 197.482 74.5666 196.427 72.6599L178.844 42.6733C177.789 40.7666 175.415 39.9866 173.481 40.7666L151.59 49.4333C147.018 46.0533 142.271 43.1066 136.732 40.9399L133.479 17.9733C133.301 16.9525 132.761 16.027 131.957 15.3607C131.152 14.6945 130.134 14.3305 129.083 14.3333H93.9166C91.7187 14.3333 89.8724 15.8933 89.5208 17.9733L86.2678 40.9399C80.7291 43.1066 75.9816 46.0533 71.4099 49.4333L49.5187 40.7666C47.5845 39.9866 45.2108 40.7666 44.1558 42.6733L26.5724 72.6599C25.4295 74.5666 25.957 76.9066 27.6274 78.2066L46.1779 92.3333C45.8262 95.2799 45.5624 98.1399 45.5624 101C45.5624 103.86 45.8262 106.633 46.1779 109.407L27.6274 123.793C25.957 125.093 25.4295 127.433 26.5724 129.34L44.1558 159.327C45.2108 161.233 47.5845 161.927 49.5187 161.233L71.4099 152.48C75.9816 155.947 80.7291 158.893 86.2678 161.06L89.5208 184.027C89.8724 186.107 91.7187 187.667 93.9166 187.667H129.083C131.281 187.667 133.127 186.107 133.479 184.027L136.732 161.06C142.271 158.807 147.018 155.947 151.59 152.48L173.481 161.233C175.415 161.927 177.789 161.233 178.844 159.327L196.427 129.34C197.482 127.433 197.043 125.093 195.372 123.793L176.822 109.407Z"
    />
  </svg>
);

// --- 2. COMPONENTE: BOTÓN DASHBOARD EXPANDIBLE (REDISEÑADO) ---
const DashboardNavButton = React.forwardRef(({ 
  icon: Icon, 
  label, 
  onClick, 
  variant = "orange",
  className 
}: any, ref: any) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      className={cn(
        "flex items-center h-10 rounded-xl transition-all duration-300 ease-in-out overflow-hidden group shadow-sm border-none text-white",
        variant === "orange" ? "bg-[#ff6b00] hover:bg-[#e66000]" : "bg-[#1e2b58] hover:bg-[#151f40]",
        "w-10 hover:w-36 px-2.5 shrink-0", 
        className
      )}
    >
      <Icon size={18} className="shrink-0" strokeWidth={2.5} />
      <span className="ml-3 font-black text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
        {label}
      </span>
    </button>
  );
});
DashboardNavButton.displayName = "DashboardNavButton";

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

// --- MODAL: PERMISOS (TOGGLES) ---
function PermissionsConfigModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl p-0 border-0 rounded-[2.5rem] overflow-hidden shadow-2xl z-[150] bg-[#f8fafc] [&>button]:hidden">
        <div className="bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between">
           <h3 className="text-[#1C1E59] font-black italic uppercase text-lg flex items-center gap-3">
             <div className="w-1.5 h-6 bg-[#ff6b00] rounded-full" />
             Configuración de Permisos
           </h3>
           <button onClick={onClose} className="text-gray-300 hover:text-gray-500"><X size={20} /></button>
        </div>
        <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
           {["Acceso", "Menú Catálogos"].map((cat) => (
             <div key={cat} className="space-y-3">
               <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">{cat}</h4>
               <div className="bg-white rounded-3xl border border-gray-100 divide-y divide-gray-50">
                 {[1, 2, 3].map((i) => (
                   <div key={i} className="flex items-center justify-between p-4 px-6 hover:bg-gray-50/50 transition-colors">
                     <span className="text-xs font-bold text-gray-600">Registros ➝ Entrada {i}</span>
                     <CustomSwitch checked={true} onChange={() => {}} />
                   </div>
                 ))}
               </div>
             </div>
           ))}
        </div>
        <div className="p-6 bg-white border-t border-gray-100 flex justify-end">
           <Button onClick={onClose} className="bg-[#ff6b00] hover:bg-[#e66000] text-white font-black uppercase text-xs px-10 h-12 rounded-xl shadow-lg shadow-orange-100">Guardar Cambios</Button>
        </div>
      </DialogContent>
    </Dialog>
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

// --- MODAL: GENERAR / EDITAR PERFIL ---
function ProfileFormModal({ isOpen, onClose, mode = "create" }: { isOpen: boolean; onClose: () => void; mode?: "create" | "edit" }) {
  const [showPermissions, setShowPermissions] = useState(false);
  const isEdit = mode === "edit";

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg p-0 border-0 rounded-[2.5rem] overflow-hidden shadow-2xl z-[140] [&>button]:hidden">
          <div className={cn("px-8 py-6 text-white flex items-center justify-between", isEdit ? "bg-[#1e2b58]" : "bg-[#ff6b00]")}>
            <div className="flex items-center gap-3">
              {isEdit ? <Settings size={22} className="text-[#4CCAC8]" /> : <UserPlus size={22} />}
              <h3 className="font-black italic uppercase tracking-wider text-sm">
                {isEdit ? "Actualización de Perfil" : "Generar Nuevo Perfil"}
              </h3>
            </div>
            <button onClick={onClose} className="text-white/60 hover:text-white"><X size={20} /></button>
          </div>

          <div className="p-8 bg-white space-y-6">
            {isEdit && (
               <div className="flex gap-2">
                 <Badge variant="outline" className="text-[10px] font-bold text-gray-400">ID: 1229</Badge>
                 <Badge className="bg-emerald-100 text-emerald-600 text-[9px] font-black border-none">ACTIVO</Badge>
               </div>
            )}
            
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 space-y-1.5">
                <FilterLabel>Descripción</FilterLabel>
                <Input placeholder="Ej: Administrador" className="h-12 rounded-xl bg-gray-50/50 border-gray-100 font-bold text-sm" />
              </div>
              <div className="space-y-1.5">
                <FilterLabel>Tipo</FilterLabel>
                <Select defaultValue="admin">
                  <SelectTrigger className="h-12 rounded-xl bg-gray-50/50 border-gray-100 font-bold text-xs"><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="admin">Admin</SelectItem></SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <FilterLabel>Tiempo Sesión (Min)</FilterLabel>
                <Input type="number" defaultValue={120} className="h-12 rounded-xl bg-gray-50/50 border-gray-100 font-bold text-sm" />
              </div>
              <div className="space-y-1.5">
                <FilterLabel>Terminal</FilterLabel>
                <ToggleCard icon={LayoutGrid} title="Modo Terminal" checked={true} onChange={() => {}} />
              </div>
            </div>

            <div className="space-y-3">
              <FilterLabel>Configuración Avanzada</FilterLabel>
              <div className="grid grid-cols-2 gap-3">
                <ToggleCard icon={Type} title="Autocompletar" checked={false} onChange={() => {}} />
                <ToggleCard icon={Package} title="Cant. Entrega" checked={false} onChange={(v:any) => {}} />
              </div>
            </div>
          </div>

          <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex gap-4">
            {isEdit ? (
              <>
                <Button variant="outline" onClick={() => setShowPermissions(true)} className="flex-1 h-14 rounded-2xl border-gray-200 font-black uppercase text-[10px] text-[#1e2b58]">Modificar Permisos</Button>
                <Button className="flex-1 h-14 bg-[#ff6b00] hover:bg-[#e66000] text-white font-black uppercase text-[10px] rounded-2xl shadow-xl">Actualizar Datos</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={onClose} className="flex-1 h-14 font-black uppercase text-[10px] text-gray-400">Cancelar</Button>
                <Button className="flex-1 h-14 bg-[#ff6b00] hover:bg-[#e66000] text-white font-black uppercase text-[10px] rounded-2xl shadow-xl shadow-orange-100">Generar y Asignar</Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <PermissionsConfigModal isOpen={showPermissions} onClose={() => setShowPermissions(false)} />
    </>
  );
}

// 1. Agrega este pequeño componente arriba para tener la tuerca exacta
const CustomGearIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-1.728-4.256c.266-.88 1.19-1.494 2.15-1.494.96 0 1.884.614 2.15 1.494l.26 1.037c.184.733.9 1.135 1.57.945l1.045-.295c.915-.258 1.942.146 2.422.978.48.832.39 1.914-.216 2.656l-.693.85c-.443.543-.377 1.343.155 1.804l.824.713c.723.625.962 1.636.586 2.47-.376.834-1.272 1.34-2.196 1.24l-1.073-.116c-.754-.082-1.417.472-1.524 1.2l-.155 1.057c-.135.922-.92 1.62-1.848 1.62-.927 0-1.713-.698-1.848-1.62l-.155-1.057c-.107-.728-.77-1.282-1.524-1.2l-1.073.116c-.924.1-1.82-.406-2.196-1.24-.376-.834-.137-1.845.586-2.47l.824-.713c.532-.461.598-1.261.155-1.804l-.693-.85c-.606-.742-.696-1.824-.216-2.656.48-.832 1.507-1.236 2.422-.978l1.045.295c.67.19 1.386-.212 1.57-.945l.26-1.037Z" />
  </svg>
);

// --- UTILS UI ---
const FilterLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5 block font-sans">
    {children}
  </label>
);

// --- DATOS DE PERMISOS (Simulando la estructura de tu imagen) ---
const PERMISSIONS_DATA = [
  {
    category: "ACCESO",
    items: [
      { id: "p1", label: "Registros ➝ Entrada", active: true },
      { id: "p2", label: "Registros ➝ Salida", active: true },
      { id: "p3", label: "Registros ➝ Inicio de descargue", active: true },
      { id: "p4", label: "Registros ➝ Fin de descargue", active: true },
      { id: "p5", label: "Registros ➝ Inicio de Cargue", active: true },
      { id: "p6", label: "Registros ➝ Fin de Cargue", active: true },
    ]
  },
  {
    category: "MENU ACCESO",
    items: [
      { id: "p7", label: "Gestión de citas ➝ Solicitud de citas", active: false },
      { id: "p8", label: "Carga de archivos ➝ Carga de Documentos", active: false },
      { id: "p9", label: "Carga de archivos ➝ Carga de Documentos legacy", active: false },
      { id: "p10", label: "Carga de archivos ➝ Carga de Citas", active: false },
      { id: "p11", label: "Gestión de citas ➝ Confirmación/Cancelación", active: false },
      { id: "p12", label: "Gestión de citas ➝ Recurrencia de citas", active: false },
      { id: "p13", label: "Gestión de citas ➝ Reagendamiento", active: false },
    ]
  },
  {
    category: "MENU CATALOGOS",
    items: [
      { id: "p14", label: "Maestros ➝ Conductores", active: true },
      { id: "p15", label: "Maestros ➝ Vehículos", active: true },
    ]
  }
];

// --- COMPONENTE TOGGLE SWITCH PERSONALIZADO ---
const CustomSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <button 
    onClick={onChange}
    className={cn(
      "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
      checked ? "bg-[#ff6b00]" : "bg-gray-200"
    )}
  >
    <span className="sr-only">Toggle setting</span>
    <span
      className={cn(
        "pointer-events-none block h-5 w-5 rounded-full bg-white shadow ring-0 transition-transform duration-200 ease-in-out",
        checked ? "translate-x-5" : "translate-x-0"
      )}
    />
  </button>
);

// Checkbox estilizado como tarjeta para mejor UX
const ToggleCard = ({ icon: Icon, title, checked, onChange }: any) => (
  <div 
    onClick={() => onChange(!checked)}
    className={cn(
      "cursor-pointer rounded-xl border p-3 flex items-center gap-3 transition-all",
      checked 
        ? "border-[#ff6b00] bg-orange-50/50 text-[#1e2b58]" 
        : "border-gray-100 bg-gray-50/50 text-gray-400 hover:border-gray-300"
    )}
  >
    <div className={cn("p-2 rounded-lg", checked ? "bg-[#ff6b00] text-white" : "bg-white text-gray-400")}>
      <Icon size={16} />
    </div>
    <div className="flex-1">
      <span className="text-[11px] font-bold uppercase tracking-wider block select-none">{title}</span>
    </div>
    {checked && <CheckCircle2 size={16} className="text-[#ff6b00]" />}
  </div>
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

// --- MODAL: GENERAR PERFIL ---
function CreateProfileModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [flags, setFlags] = useState({ autocomplete: false, delivery: false, terminal: false });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg p-0 border-0 rounded-[1.5rem] overflow-hidden shadow-2xl bg-white [&>button]:hidden">
        {/* Header Compacto */}
        <div className="bg-[#ff6b00] px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-white/90" />
            <h3 className="font-black italic uppercase tracking-wide text-sm">Generar Nuevo Perfil</h3>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors"><X size={20} /></button>
        </div>

        <div className="p-6 space-y-5">
          {/* Fila 1: Descripción */}
          <div className="space-y-1.5">
            <FilterLabel>Descripción del Perfil</FilterLabel>
            <Input placeholder="Ej: Operador Logístico Junior" className="h-10 text-sm border-gray-200 focus:border-[#ff6b00]" />
          </div>

          {/* Fila 2: Grid de Configuración */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <FilterLabel>Tipo</FilterLabel>
              <Select defaultValue="operativo">
                <SelectTrigger className="h-10 text-xs font-medium border-gray-200"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="operativo">Operativo</SelectItem>
                  <SelectItem value="consulta">Consulta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <FilterLabel>Tiempo Sesión (Min)</FilterLabel>
              <div className="relative">
                <Input type="number" defaultValue={15} className="h-10 text-sm border-gray-200 pr-8" />
                <HistoryIcon size={14} className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
             <FilterLabel>Nivel de Visibilidad</FilterLabel>
             <Select defaultValue="corp">
                <SelectTrigger className="h-10 text-xs font-medium border-gray-200"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="corp">Corporativo (Global)</SelectItem>
                  <SelectItem value="loc">Localidad</SelectItem>
                </SelectContent>
              </Select>
          </div>

          {/* Fila 3: Toggles / Checkboxes mejorados */}
          <div>
            <FilterLabel>Permisos Adicionales</FilterLabel>
            <div className="grid grid-cols-2 gap-2 mt-1">
              <ToggleCard icon={Type} title="Autocompletar" checked={flags.autocomplete} onChange={(v:boolean) => setFlags({...flags, autocomplete: v})} />
              <ToggleCard icon={Package} title="Cant. Entrega" checked={flags.delivery} onChange={(v:boolean) => setFlags({...flags, delivery: v})} />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3 justify-end">
           <Button variant="ghost" onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xs font-bold uppercase">Cancelar</Button>
           <Button className="bg-[#ff6b00] hover:bg-[#e66000] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-orange-200 rounded-xl px-6">
             Generar y Asignar
           </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PermissionsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  // Estado local para manejar los toggles (en una app real esto vendría de BD)
  const [permissions, setPermissions] = useState(PERMISSIONS_DATA);

  const togglePermission = (catIndex: number, itemIndex: number) => {
    const newPerms = [...permissions];
    newPerms[catIndex].items[itemIndex].active = !newPerms[catIndex].items[itemIndex].active;
    setPermissions(newPerms);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl p-0 border-0 rounded-[1.5rem] overflow-hidden shadow-2xl bg-[#F8FAFC] max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-8 py-5 flex items-center justify-between shrink-0 z-10">
          <div>
            <h3 className="text-[#1C1E59] font-black italic uppercase text-lg tracking-wide flex items-center gap-2">
              <span className="w-1 h-6 bg-[#ff6b00] rounded-full inline-block"></span>
              Configuración de Permisos
            </h3>
            <p className="text-xs text-gray-400 font-medium pl-3">Control de acceso y visibilidad de módulos</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all">
            <X size={18} />
          </button>
        </div>

        {/* Body Scrollable */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
          {permissions.map((section, catIndex) => (
            <div key={section.category} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 pl-1">
                {section.category}
              </h4>
              
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-2 bg-gray-50/50 border-b border-gray-50 flex justify-end">
                   <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Off / On</span>
                </div>
                {section.items.map((item, itemIndex) => (
                  <div 
                    key={item.id} 
                    className="flex items-center justify-between px-6 py-4 border-b border-gray-50 last:border-0 hover:bg-slate-50 transition-colors group"
                  >
                    <span className="text-sm font-medium text-gray-600 group-hover:text-[#1C1E59] transition-colors flex items-center gap-2">
                       {/* Transformamos la flecha de texto en un icono visual si lo prefieres, o dejamos el texto */}
                       {item.label.split('➝').map((part, i, arr) => (
                          <React.Fragment key={i}>
                             {part.trim()}
                             {i < arr.length - 1 && <ChevronRight size={12} className="text-gray-300 mx-1" />}
                          </React.Fragment>
                       ))}
                    </span>
                    <CustomSwitch 
                      checked={item.active} 
                      onChange={() => togglePermission(catIndex, itemIndex)} 
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-5 bg-white border-t border-gray-100 flex justify-end gap-3 shrink-0 z-10">
           <Button variant="ghost" onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold uppercase text-xs">
             Cancelar
           </Button>
           <Button onClick={onClose} className="bg-[#ff6b00] hover:bg-[#e66000] text-white font-bold uppercase text-xs px-8 rounded-xl shadow-lg shadow-orange-200">
             Guardar Cambios
           </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- MODAL: ACTUALIZAR PERFIL ---
function EditProfileModal({ isOpen, onClose, profileData }: { isOpen: boolean; onClose: () => void; profileData: any }) {
  const [flags, setFlags] = useState({ autocomplete: false, delivery: false, terminal: true });
  
  // NUEVO: Estado para controlar el modal de permisos
  const [isPermissionsOpen, setIsPermissionsOpen] = useState(false);

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-lg p-0 border-0 rounded-[1.5rem] overflow-hidden shadow-2xl bg-white ">
          {/* ... (Todo el Header y Body del EditProfileModal se mantiene igual) ... */}
          <div className="bg-[#1e2b58] px-6 py-4 flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <Settings size={20} className="text-[#4CCAC8]" />
              <h3 className="font-black italic uppercase tracking-wide text-sm">Actualización de Perfil</h3>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white transition-colors"><X size={20} /></button>
          </div>

          <div className="p-6 space-y-5">
             <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs text-gray-500 border-gray-200">ID: 1229</Badge>
                <Badge className="bg-emerald-100 text-emerald-600 shadow-none border-none text-[10px] font-bold">ACTIVO</Badge>
             </div>

            <div className="grid grid-cols-3 gap-4">
               <div className="col-span-2 space-y-1.5">
                  <FilterLabel>Descripción</FilterLabel>
                  <Input defaultValue="Administrador" className="h-10 text-sm font-bold text-[#1e2b58] border-gray-200 bg-gray-50/50" />
               </div>
               <div className="space-y-1.5">
                  <FilterLabel>Tipo</FilterLabel>
                  <div className="h-10 flex items-center px-3 bg-gray-100 rounded-md text-xs text-gray-500 font-bold border border-gray-200">
                     Administrador
                  </div>
               </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1.5">
                  <FilterLabel>Tiempo Sesión</FilterLabel>
                  <Input type="number" defaultValue={120} className="h-10 text-sm border-gray-200" />
               </div>
               <div className="space-y-1.5">
                   <FilterLabel>Terminal</FilterLabel>
                   <ToggleCard icon={LayoutGrid} title="Modo Terminal" checked={flags.terminal} onChange={(v:boolean) => setFlags({...flags, terminal: v})} />
               </div>
            </div>

            <div>
              <FilterLabel>Configuración Avanzada</FilterLabel>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <ToggleCard icon={Type} title="Autocompletar" checked={flags.autocomplete} onChange={(v:boolean) => setFlags({...flags, autocomplete: v})} />
                <ToggleCard icon={Package} title="Cant. Entrega" checked={flags.delivery} onChange={(v:boolean) => setFlags({...flags, delivery: v})} />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
             {/* BOTÓN ACTUALIZADO */}
             <Button 
                variant="outline" 
                onClick={() => setIsPermissionsOpen(true)} // AHORA ABRE EL NUEVO MODAL
                className="flex-1 border-gray-200 text-[#1e2b58] hover:bg-white hover:border-[#1e2b58] font-bold text-xs uppercase rounded-xl h-10 shadow-sm"
             >
               Modificar Permisos
             </Button>
             
             <Button className="flex-1 bg-[#ff6b00] hover:bg-[#e66000] text-white text-xs font-bold uppercase tracking-wider shadow-md rounded-xl h-10">
               Actualizar Datos
             </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* RENDERIZAMOS EL MODAL DE PERMISOS AQUÍ */}
      <PermissionsModal isOpen={isPermissionsOpen} onClose={() => setIsPermissionsOpen(false)} />
    </>
  );
}

function UsuariosTable() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#f8fafc]">
      {/* MODAL GENERAR USUARIO */}
      <ProfileFormModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} mode="create" />
      
      {/* TOOLBAR: Elementos flotando sin recuadro blanco */}
      <div className="flex items-center gap-4 py-6 px-2 shrink-0">
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className="bg-[#1e2b58] hover:bg-[#151f40] text-white text-[10px] font-black uppercase tracking-widest h-12 px-8 rounded-2xl shadow-xl flex items-center gap-3 transition-all active:scale-95"
        >
          <Plus size={18} strokeWidth={3} /> Generar Usuario
        </Button>

        <div className="relative group flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500" size={16} />
          <Input placeholder="BUSCAR USUARIO..." className="h-12 rounded-2xl bg-white border-none shadow-sm pl-12 text-[10px] font-black tracking-widest uppercase focus-visible:ring-1 focus-visible:ring-orange-200 transition-all" />
        </div>

        <div className="relative group flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500" size={16} />
          <Input placeholder="BUSCAR PERFIL..." className="h-12 rounded-2xl bg-white border-none shadow-sm pl-12 text-[10px] font-black tracking-widest uppercase focus-visible:ring-1 focus-visible:ring-orange-200 transition-all" />
        </div>
      </div>

      {/* TABLA CON FONDO PROPIO */}
      <div className="flex-1 bg-white rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto custom-scrollbar">
          <Table>
            <TableHeader className="bg-[#1e2b58] sticky top-0 z-10">
              <TableRow className="h-14 border-none">
                <TableHead className="text-white text-[9px] font-black uppercase pl-8">Usuario</TableHead>
                <TableHead className="text-white text-[9px] font-black uppercase">Perfil</TableHead>
                <TableHead className="text-white text-[9px] font-black uppercase">Localidad</TableHead>
                <TableHead className="text-white text-[9px] font-black uppercase text-center">Estatus</TableHead>
                <TableHead className="text-white text-[9px] font-black uppercase pr-8">Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[1, 2, 3].map((i) => (
                <TableRow key={i} className="group border-b border-gray-50 h-16 hover:bg-orange-50/30 transition-colors cursor-pointer">
                  <TableCell className="pl-8 font-black text-[#1e2b58] text-xs">USUARIO_PRO_{i}</TableCell>
                  <TableCell className="text-gray-500 text-xs font-bold uppercase italic">Administrador</TableCell>
                  <TableCell className="text-gray-400 text-xs">CEDI Norte</TableCell>
                  <TableCell className="text-center">
                    <Badge className="bg-emerald-100 text-emerald-600 border-none shadow-none text-[8px] font-black px-3">ACTIVO</Badge>
                  </TableCell>
                  <TableCell className="text-gray-400 text-xs pr-8 font-mono">unidades@controlt.com</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

// --- CONTENIDO TAB PERFILES (CON LÓGICA DE MODALES) ---
function PerfilesTabContent() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="space-y-6 h-full flex flex-col">
      {/* MODALES */}
      <ProfileFormModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} mode="edit" />
      <ProfileFormModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} mode="create" />

      <div className="flex items-center justify-between px-1">
        <div className="relative group w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <Input placeholder="BUSCAR PERFIL..." className="h-12 rounded-2xl bg-white border-none shadow-sm pl-12 text-[10px] font-black uppercase focus-visible:ring-1 focus-visible:ring-orange-200 transition-all" />
        </div>
        <Button 
          onClick={() => setIsCreateOpen(true)} 
          className="bg-[#ff6b00] hover:bg-[#e66000] text-white text-[10px] font-black uppercase h-12 px-8 rounded-2xl shadow-xl shadow-orange-100 flex items-center gap-3 transition-all active:scale-95"
        >
          <Plus size={18} strokeWidth={3} /> Generar Perfil
        </Button>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl border border-gray-100 flex-1 overflow-hidden">
        <Table>
          <TableHeader className="bg-[#1e2b58]">
            <TableRow className="h-14 border-none">
              <TableHead className="text-white text-[9px] font-black uppercase pl-8">Perfil</TableHead>
              <TableHead className="text-white text-[9px] font-black uppercase">Descripción</TableHead>
              <TableHead className="text-white text-[9px] font-black uppercase text-center w-32">Estado</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {["Administrador", "Operador de Patio"].map((name) => (
              <TableRow 
                key={name} 
                onClick={() => setIsEditOpen(true)} // ESTO HACE QUE LA FILA SEA CLICKEABLE
                className="group border-b border-gray-50 h-20 hover:bg-orange-50/30 cursor-pointer transition-colors"
              >
                <TableCell className="pl-8 font-black text-[#1e2b58] text-sm uppercase italic tracking-tighter">{name}</TableCell>
                <TableCell className="text-gray-400 text-xs font-medium">Control total sobre los módulos de acceso y configuración del sistema.</TableCell>
                <TableCell className="text-center">
                   <Badge className="bg-emerald-100 text-emerald-600 border-none text-[8px] font-black px-3">ACTIVO</Badge>
                </TableCell>
                <TableCell className="pr-8">
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#ff6b00] group-hover:text-white transition-all shadow-sm">
                    <ChevronRight size={16} strokeWidth={3} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
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
  if (!docId) return null;
  return (
    <Dialog open={!!docId} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden border-0 rounded-[2rem] shadow-2xl z-[120] [&>button]:hidden">
        {/* Header con patrón de cuadrícula Navy */}
        <div className="relative bg-[#0A0E3F] p-7 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '15px 15px' }}></div>
          <div className="relative z-10 flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-black italic tracking-tighter flex items-center gap-2">
                ANÁLISIS DE <span className="text-[#4CCAC8]">LOGS</span>
              </h2>
              <p className="text-cyan-400 font-bold text-[10px] uppercase tracking-widest mt-1">EXPEDIENTE: {docId}</p>
            </div>
            <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
               <X size={24} strokeWidth={3} />
            </button>
          </div>
        </div>

        <div className="p-8 bg-white space-y-8">
          {/* Grid de Información Meta */}
          <div className="grid grid-cols-2 gap-y-6 gap-x-12">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-gray-400 uppercase italic">Validación</span>
              <div><Badge className="bg-red-50 text-red-500 text-[10px] py-0.5 px-3 shadow-none font-bold rounded-full">FAILED</Badge></div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black text-gray-400 uppercase italic">Timestamp</span>
              <p className="text-[#1C1E59] font-black text-sm">26/01/2026, 5:27 PM</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black text-gray-400 uppercase italic">Auditor</span>
              <p className="text-[#1C1E59] font-black text-sm uppercase">J.GARCIA</p>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black text-gray-400 uppercase italic">Categoría</span>
              <p className="text-[#1C1E59] font-black text-sm uppercase italic">Packing List</p>
            </div>
          </div>

          {/* Ruta de Datos */}
          <div className="space-y-4">
            <h4 className="text-[#1C1E59] text-xs font-black italic uppercase tracking-tighter flex items-center gap-2">
              <div className="w-1.5 h-4 bg-cyan-400 rounded-full"></div> RUTA DE DATOS
            </h4>
            <div className="relative pl-6 space-y-6 before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
              <div className="relative">
                <div className="absolute -left-[22px] w-4.5 h-4.5 rounded-full bg-white border-2 border-cyan-400 z-10 flex items-center justify-center"></div>
                <p className="text-[11px] font-black text-[#1C1E59] uppercase">Generación Documental</p>
                <p className="text-gray-400 text-[10px] font-medium">Procesado por motor YMS.</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[22px] w-4.5 h-4.5 rounded-full bg-white border-2 border-orange-500 z-10"></div>
                <p className="text-[11px] font-black text-[#1C1E59] uppercase">Sincronización API</p>
                <p className="text-gray-400 text-[10px] font-medium">Transmisión a infraestructura central.</p>
              </div>
            </div>
          </div>

          {/* Caja de Error */}
          <div className="bg-red-50/50 border border-red-100 p-4 rounded-2xl flex items-center gap-4 text-red-600">
             <div className="bg-red-100 p-1.5 rounded-lg"><AlertTriangle size={18} /></div>
             <p className="text-[11px] font-bold italic leading-tight">Connection timeout with external API endpoint 504</p>
          </div>
        </div>

        {/* Footer con botones grandes */}
        <div className="p-6 bg-slate-50/50 border-t border-gray-100 flex gap-4">
          <Button className="flex-1 h-14 bg-[#ff6b00] hover:bg-[#e66000] text-white text-xs font-black uppercase rounded-2xl shadow-lg shadow-orange-100">
            Reproceso Manual
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1 h-14 border-[#1C1E59] text-[#1C1E59] text-xs font-black uppercase rounded-2xl hover:bg-white transition-all">
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
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 rounded-[2.5rem] shadow-2xl z-[130] [&>button]:hidden">
        {/* Cabecera Naranja Intensa */}
        <div className="bg-[#FF6C01] p-10 flex flex-col items-center text-white relative">
          <button onClick={onClose} className="absolute right-6 top-6 text-white/60 hover:text-white transition-colors">
            <X size={20} strokeWidth={3} />
          </button>
          
          <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mb-6 border border-white/30 rotate-45">
            <div className="-rotate-45 text-white">
               <AlertTriangle size={32} />
            </div>
          </div>
          
          <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-1">Confirmar Reproceso</h2>
          <p className="text-[9px] font-black tracking-[0.2em] uppercase opacity-80">Seguridad YMS • Protocolo Crítico</p>
        </div>

        <div className="p-10 bg-white text-center">
          <p className="text-gray-500 text-sm leading-relaxed mb-10 italic">
            Se ha iniciado una solicitud para reprocesar <span className="font-black text-[#1C1E59]">1 PAQUETE(S) DE DATOS</span>. Esta acción intentará registrar nuevamente los documentos en la base de datos central de CONTROLT.
          </p>
          
          <p className="text-[#1C1E59] font-black text-sm italic mb-10 uppercase tracking-tight">¿Desea proceder con el envío manual a la API?</p>

          <div className="flex gap-4">
            <Button variant="ghost" onClick={onClose} className="flex-1 h-14 bg-gray-50 text-gray-400 font-black italic uppercase rounded-2xl text-[10px] hover:bg-gray-100">
              Abordar Operación
            </Button>
            <Button className="flex-1 h-14 bg-[#0A0E3F] hover:bg-[#050038] text-white font-black italic uppercase rounded-2xl text-[10px] shadow-2xl shadow-blue-900/30">
              Iniciar Ejecución
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- COMPONENTE: MODAL HISTORIAL (CON TOGGLE Y HEADER AZUL) ---
// --- COMPONENTE: AUDITORÍA (CON TODA LA LÓGICA Y DATOS) ---
function AuditHistoryContent() {
  // 1. Estados para controlar qué modal se abre
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [isReprocessOpen, setIsReprocessOpen] = useState(false);
  const [operationType, setOperationType] = useState<"creacion" | "actualizacion">("creacion");

  // 2. Datos de ejemplo (Asegúrate de que tengan la propiedad 'operation')
  const auditData = [
    { id: "DOC-1024", type: "PACKING LIST", status: "FAILED", auditor: "J.GARCIA", time: "26/01/2026, 17:27", operation: "creacion" },
    { id: "DOC-1025", type: "ASN", status: "SUCCESS", auditor: "M.RODRIGUEZ", time: "26/01/2026, 16:27", operation: "creacion" },
    { id: "DOC-2048", type: "WAYBILL", status: "SUCCESS", auditor: "A.MARTINEZ", time: "26/01/2026, 15:27", operation: "actualizacion" },
    { id: "DOC-2049", type: "CUSTOMS", status: "FAILED", auditor: "L.PEREZ", time: "26/01/2026, 12:27", operation: "actualizacion" },
  ];

  // 3. Lógica de filtrado (Aquí se define filteredData)
  const filteredData = auditData.filter(row => row.operation === operationType);

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
      {/* RENDER DE MODALES HIJOS */}
      <LogAnalysisModal docId={selectedDoc || ""} onClose={() => setSelectedDoc(null)} />
      <ReprocessConfirmModal isOpen={isReprocessOpen} onClose={() => setIsReprocessOpen(false)} />

      {/* BARRA DE HERRAMIENTAS (TOOLBAR) */}
      <div className="flex items-center justify-between px-1">
        {/* Buscador */}
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-[#ff6b00] transition-colors" />
          <Input 
            placeholder="Buscar por ID o Auditor..." 
            className="bg-white border-none h-12 rounded-2xl w-full shadow-sm pl-12 text-sm font-medium focus-visible:ring-1 focus-visible:ring-orange-200" 
          />
        </div>
        
        <div className="flex items-center gap-3">
          {/* Selector Creación / Actualización */}
          <div className="bg-white p-1.5 rounded-[1.25rem] flex items-center shadow-sm border border-gray-50 h-12">
            <button 
              onClick={() => setOperationType("creacion")} 
              className={cn(
                "px-6 h-full rounded-xl text-[10px] font-black uppercase transition-all", 
                operationType === "creacion" ? "bg-slate-50 text-[#1C1E59] shadow-inner" : "text-gray-400 hover:text-gray-600"
              )}
            >
              Creación
            </button>
            <button 
              onClick={() => setOperationType("actualizacion")} 
              className={cn(
                "px-6 h-full rounded-xl text-[10px] font-black uppercase transition-all", 
                operationType === "actualizacion" ? "bg-slate-50 text-[#1C1E59] shadow-inner" : "text-gray-400 hover:text-gray-600"
              )}
            >
              Actualización
            </button>
          </div>

          {/* BOTÓN FILTROS (DISEÑO EXACTO IMAGEN) */}
          <Popover>
            <PopoverTrigger asChild>
              <Button className="h-12 px-6 rounded-[1.25rem] bg-[#ff6b00] hover:bg-[#e66000] text-white font-black uppercase text-[10px] tracking-widest gap-2 shadow-lg shadow-orange-100 transition-all active:scale-95">
                <Filter size={18} strokeWidth={2.5} />
                <span>Filtros</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-6 rounded-[2rem] shadow-2xl border-none z-[120]" align="end">
              <div className="space-y-6">
                <h4 className="font-black text-[#1C1E59] text-xs uppercase italic tracking-wider">Filtros Avanzados</h4>
                <div className="grid grid-cols-2 gap-3">
                   <div className="relative">
                      <Input type="date" className="h-12 rounded-xl border-gray-100 bg-gray-50/50 text-[10px] font-bold uppercase" />
                   </div>
                   <div className="relative">
                      <Input type="date" className="h-12 rounded-xl border-gray-100 bg-gray-50/50 text-[10px] font-bold uppercase" />
                   </div>
                </div>
                <Button className="w-full h-12 bg-[#1C1E59] hover:bg-[#0A0E3F] text-white text-[10px] font-black uppercase rounded-2xl shadow-xl transition-all">
                  Aplicar
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          <Button className="h-12 w-12 p-0 bg-[#ff6b00] text-white rounded-[1.25rem] shadow-lg shadow-orange-100 hover:bg-[#e66000] transition-all active:scale-95">
            <FileText size={20} />
          </Button>
        </div>
      </div>

      {/* TABLA PRINCIPAL */}
      <div className="bg-white rounded-[2rem] shadow-2xl border border-gray-50 overflow-hidden flex flex-col flex-1">
        <Table>
          <TableHeader className="bg-[#1C1E59]">
            <TableRow className="hover:bg-transparent border-none h-14">
              <TableHead className="text-[10px] font-black uppercase text-white pl-8 tracking-widest">Documento ID</TableHead>
              <TableHead className="text-[10px] font-black uppercase text-white tracking-widest">Tipo Logístico</TableHead>
              <TableHead className="text-[10px] font-black uppercase text-white text-center tracking-widest">Estado</TableHead>
              <TableHead className="text-[10px] font-black uppercase text-white text-right pr-12 tracking-widest">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-32 text-center text-gray-400 font-bold italic">No se encontraron registros</TableCell>
              </TableRow>
            ) : (
              filteredData.map((row) => (
                <TableRow key={row.id} className="hover:bg-slate-50/50 border-b border-gray-50 h-20 transition-colors">
                  <TableCell className="font-black text-sm text-[#1C1E59] pl-8">{row.id}</TableCell>
                  <TableCell className="text-[10px] font-bold text-gray-500 uppercase italic">{row.type}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={cn(
                      "text-[8px] px-3 py-1 font-black rounded-full border-none shadow-none", 
                      row.status === "FAILED" ? "bg-red-50 text-red-400" : "bg-emerald-50 text-emerald-400"
                    )}>
                      {row.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <div className="flex items-center justify-end gap-2">
                      {/* BOTÓN OJO -> Abre Análisis de Logs */}
                      <button 
                        onClick={() => setSelectedDoc(row.id)} 
                        className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-300 hover:text-cyan-500 hover:border-cyan-100 transition-all bg-white shadow-sm active:scale-90"
                      >
                        <Eye size={18} />
                      </button>
                      
                      <button className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-300 hover:text-gray-600 transition-all bg-white shadow-sm active:scale-90">
                        <Download size={18} />
                      </button>

                      {/* BOTÓN RECARGAR -> Abre Confirmar Reproceso (Solo si FAILED) */}
                      {row.status === "FAILED" && (
                        <button 
                          onClick={() => setIsReprocessOpen(true)} 
                          className="w-10 h-10 rounded-full border border-orange-100 flex items-center justify-center text-[#ff6b00] hover:bg-orange-50 transition-all bg-white shadow-sm active:scale-90"
                        >
                          <RotateCw size={18} />
                        </button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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
            value="citas" 
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-[3px] data-[state=active]:border-[#ff6b00] data-[state=active]:text-[#ff6b00] rounded-none px-0 py-3 font-bold text-gray-400 uppercase text-[11px] tracking-wide"
          >
            Carga de Citas Fijas
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 p-6 flex flex-col items-center justify-center">
            <div className="w-full h-full border-2 border-dashed border-gray-200 rounded-[2rem] flex flex-col items-center justify-center gap-6 relative bg-slate-50/10">
                 <div className="w-20 h-20 bg-white rounded-3xl shadow-lg shadow-gray-100 flex items-center justify-center">
                    <FileUp className="w-8 h-8 text-[#4CCAC8]" />
                 </div>
                 
                 <div className="text-center space-y-2">
                    <h3 className={cn("text-lg font-black uppercase tracking-wide", COLORS.NAVY)}>Carga tus documentos</h3>
                    <p className="text-gray-400 text-sm">Arrastra aquí o usa el botón para explorar archivos locales (.txt) o Excel</p>
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
      { id: "dg-1a", name: "Muelle A", dockCount: 4, type: "inbound" },
      { id: "dg-1b", name: "Muelle B", dockCount: 4, type: "inbound" },
      { id: "dg-1c", name: "Muelle Despacho", dockCount: 6, type: "outbound" },
      { id: "dg-1d", name: "Muelle Mixto", dockCount: 2, type: "mixed" },
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

const MenuGridButton = ({ 
  icon: Icon, 
  label, 
  onClick, 
  variant = "navy" 
}: { 
  icon: any, 
  label: string, 
  onClick?: () => void,
  variant?: "navy" | "orange"
}) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl hover:bg-slate-50 transition-all group active:scale-95"
  >
    <div className={cn(
      "w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 group-hover:shadow-md transition-all",
      variant === "orange" ? "bg-orange-50 text-[#ff6b00] group-hover:bg-[#ff6b00] group-hover:text-white" : "bg-slate-50 text-[#1e2b58] group-hover:bg-[#1e2b58] group-hover:text-white"
    )}>
      <Icon size={24} strokeWidth={2.5} />
    </div>
    <span className="text-[10px] font-black uppercase tracking-tight text-center leading-tight text-gray-500 group-hover:text-[#1e2b58]">
      {label}
    </span>
  </button>
);

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
    <div className="bg-white flex flex-col w-full border-b border-gray-100 shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between gap-4">
        
        {/* LADO IZQUIERDO: LOGO Y LOCALIDAD */}
        <div className="flex items-center gap-6">
          <img src="/ControlT.png" alt="Logo" className="h-9 w-auto object-contain" />
          
          <div className="h-8 w-px bg-gray-100 mx-2" />

              {/* 2. SELECTOR LOCALIDAD */}
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
        </div>

        {/* LADO DERECHO: BARRA DE ACCIONES DASHBOARD */}
        <div className="ml-auto flex items-center gap-3">


          
          {/* GRUPO 2: BUSCADOR */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-[#ff6b00] transition-colors" />
            <input 
              type="text" 
              placeholder="BUSCAR..." 
              className="pl-9 pr-4 py-2 h-10 w-36 bg-white border border-gray-100 rounded-xl text-[10px] font-bold outline-none focus:ring-2 focus:ring-orange-100 focus:w-56 transition-all duration-500 uppercase tracking-widest" 
            />
          </div>
          
          {/* BOTÓN ÚNICO DE REGISTROS (EXPANDIBLE + POPOVER) */}
          <Popover>
            <PopoverTrigger asChild>
              <DashboardNavButton icon={LayoutGrid} label="Registros" variant="orange" />
            </PopoverTrigger>
            <PopoverContent className="w-64 p-2 rounded-2xl shadow-2xl border-gray-100" align="center">
              <div className="grid grid-cols-1 gap-1">
                <div className="px-3 py-2 border-b border-gray-50 mb-1">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Gestión de Patio</span>
                </div>
                {REGISTRO_OPCIONES.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => { setSelectedRegistro(opt.id); setIsModalOpen(true); }}
                    className="flex items-center gap-3 p-3 w-full hover:bg-orange-50 rounded-xl transition-colors group text-left"
                  >
                    <div className="w-8 h-8 rounded-lg bg-gray-50 group-hover:bg-[#ff6b00] group-hover:text-white flex items-center justify-center transition-colors">
                      <opt.icon size={16} />
                    </div>
                    <span className="text-[11px] font-black text-[#1e2b58] uppercase tracking-tighter">{opt.label}</span>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>

         

         {/* AUDITORÍA */}
          <Dialog>
            <DialogTrigger asChild>
              <DashboardNavButton icon={HistoryIcon} label="Auditoría" variant="navy" />
            </DialogTrigger>
            <DialogContent className="!fixed !inset-0 !translate-x-0 !translate-y-0 !max-w-none !w-screen !h-screen !m-0 !p-0 !rounded-none border-none bg-[#f8fafc] z-[100] flex flex-col [&>button]:hidden">
              {/* Header de Pantalla Completa */}
              <div className="bg-[#1C1E59] h-14 flex items-center justify-between px-6 shrink-0 w-full shadow-sm z-10">
                <div className="flex items-center gap-3">
                  <HistoryIcon className="text-white" size={20} />
                  <h2 className="text-sm font-bold text-white uppercase tracking-tight italic">Auditoría General de Documentos</h2>
                </div>
                <DialogPrimitive.Close className="text-white/40 hover:text-white outline-none p-1.5 hover:bg-white/10 rounded-full transition-colors">
                  <X size={20} />
                </DialogPrimitive.Close>
              </div>

              {/* Contenido con Scroll */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <div className="max-w-7xl mx-auto h-full">
                   <AuditHistoryContent />
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* REPORTES (PANTALLA COMPLETA + FORM CENTRADO) */}
          <Dialog>
            <DialogTrigger asChild>
              <DashboardNavButton icon={BarChart3} label="Reportes" variant="navy" />
            </DialogTrigger>
            
            {/* Contenedor Full Screen */}
            <DialogContent className="!fixed !inset-0 !translate-x-0 !translate-y-0 !max-w-none !w-screen !h-screen !m-0 !p-0 !rounded-none border-none bg-[#f8fafc] z-[100] flex flex-col [&>button]:hidden">
              
              {/* Header Navy (Consistente con Auditoría) */}
              <div className="bg-[#1C1E59] h-14 flex items-center justify-between px-6 shrink-0 w-full shadow-sm z-10">
                <div className="flex items-center gap-3">
                  <BarChart3 className="text-white" size={20} />
                  <h2 className="text-sm font-bold text-white uppercase tracking-tight italic">Módulo de Reportes y Estadísticas</h2>
                </div>
                <DialogPrimitive.Close className="text-white/40 hover:text-white outline-none p-1.5 hover:bg-white/10 rounded-full transition-colors">
                  <X size={20} />
                </DialogPrimitive.Close>
              </div>

              {/* Cuerpo del Modal: Centrado perfecto del Formulario */}
              <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto custom-scrollbar">
                
                {/* Caja del Formulario Estilo Dashboard */}
                <div className="w-full max-w-4xl bg-white p-12 rounded-[3rem] shadow-[0_20px_70px_rgba(0,0,0,0.05)] border border-gray-100 animate-in fade-in zoom-in-95 duration-500">
                  <div className="mb-8 text-center">
                    <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <BarChart3 className="text-[#ff6b00]" size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-[#1C1E59] uppercase italic tracking-tighter">Filtros de Búsqueda</h3>
                    <p className="text-gray-400 text-xs font-medium">Define los parámetros para generar tu reporte logístico</p>
                  </div>

                  {/* Tu componente original de filtros */}
                  <ReportFiltersContent />
                </div>

              </div>
            </DialogContent>
          </Dialog>

          {/* USUARIOS (PANTALLA COMPLETA) */}
         <Dialog>
  <DialogTrigger asChild>
    <DashboardNavButton icon={Users} label="Usuarios" variant="navy" />
  </DialogTrigger>
  <DialogContent className="!fixed !inset-0 !translate-x-0 !translate-y-0 !max-w-none !w-screen !h-screen !m-0 !p-0 !rounded-none border-none bg-[#f8fafc] z-[100] flex flex-col [&>button]:hidden">
    
    <div className="bg-[#1C1E59] h-14 flex items-center justify-between px-6 shrink-0 w-full shadow-sm z-10">
      <div className="flex items-center gap-3">
        <Users className="text-white" size={20} />
        <h2 className="text-sm font-bold text-white uppercase tracking-tight italic">Gestión de Usuarios y Accesos</h2>
      </div>
      <DialogPrimitive.Close className="text-white/40 hover:text-white outline-none p-1.5 hover:bg-white/10 rounded-full transition-colors">
        <X size={20} />
      </DialogPrimitive.Close>
    </div>

    <div className="flex-1 p-8 overflow-hidden flex flex-col">
       <Tabs defaultValue="usuarios" className="h-full flex flex-col">
          <div className="flex items-center justify-between mb-2 shrink-0">
             <TabsList className="bg-white p-1 rounded-2xl h-12 w-fit shadow-sm border border-gray-100">
                <TabsTrigger value="usuarios" className="rounded-xl px-10 h-full text-[10px] font-black uppercase data-[state=active]:bg-[#ff6b00] data-[state=active]:text-white transition-all">Administración de Usuarios</TabsTrigger>
                <TabsTrigger value="perfiles" className="rounded-xl px-10 h-full text-[10px] font-black uppercase data-[state=active]:bg-[#ff6b00] data-[state=active]:text-white transition-all">Administración de Perfiles</TabsTrigger>
             </TabsList>
             <Badge variant="outline" className="bg-white border-gray-100 text-gray-300 font-black px-4 py-2 rounded-xl text-[10px] uppercase tracking-widest">Control de accesos YMS v2.0</Badge>
          </div>

          <TabsContent value="usuarios" className="flex-1 min-h-0 m-0 outline-none">
             <UsuariosTable />
          </TabsContent>

          <TabsContent value="perfiles" className="flex-1 min-h-0 m-0 outline-none py-6">
             <PerfilesTabContent />
          </TabsContent>
       </Tabs>
    </div>
  </DialogContent>
</Dialog>

          {/* CARGA DOCUMENTOS */}
          {/* CARGA DOCUMENTOS (PANTALLA COMPLETA) */}
          <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
            <DialogTrigger asChild>
              <DashboardNavButton icon={Upload} label="Cargar" variant="navy" />
            </DialogTrigger>
            
            {/* Contenedor Full Screen: !fixed !inset-0 !w-screen !h-screen */}
            <DialogContent className="!fixed !inset-0 !translate-x-0 !translate-y-0 !max-w-none !w-screen !h-screen !m-0 !p-0 !rounded-none border-none bg-[#f8fafc] z-[100] flex flex-col [&>button]:hidden">
              
              {/* Cabecera Navy Estilo Dashboard */}
              <div className="bg-[#1C1E59] h-14 flex items-center justify-between px-6 shrink-0 w-full shadow-sm z-10">
                <div className="flex items-center gap-3">
                  <Upload className="text-white" size={20} />
                  <h2 className="text-sm font-bold text-white uppercase tracking-tight italic">Carga Masiva de Documentos</h2>
                </div>
                <DialogPrimitive.Close className="text-white/40 hover:text-white outline-none p-1.5 hover:bg-white/10 rounded-full transition-colors">
                  <X size={20} />
                </DialogPrimitive.Close>
              </div>

              {/* Cuerpo del Modal: Contenedor de carga centrado */}
              <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto custom-scrollbar">
                
                {/* Caja Blanca Premium para el Dropzone */}
                <div className="w-full max-w-6xl bg-white rounded-[3rem] shadow-[0_20px_70px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
                  <div className="p-10">
                    <FileUploadContent onUpload={() => { setIsUploadModalOpen(false); setIsResultsModalOpen(true); }} />
                  </div>
                </div>

              </div>
            </DialogContent>
          </Dialog>
          

          <div className="w-px h-6 bg-gray-200 mx-1" />

          {/* GRUPO 3: ICONOS DE PERFIL (SOLICITADOS) */}
          <div className="flex items-center gap-5">
              {/* ICONO COG (ENGRANAJE REAL) */}
           

  <button className="text-[#1e2b58] hover:scale-110 transition-transform active:scale-95">
    <SettingsIcon 
      className="w-[22px] h-[22px]" 
    />
  </button>

            <button className="text-[#1e2b58] hover:scale-110 transition-transform">
              <LayoutGrid size={22} strokeWidth={2.5} fill="#1e2b58" className="stroke-none" />
            </button>

            <button className="w-9 h-9 rounded-full bg-[#050038] flex items-center justify-center shadow-md hover:brightness-125 transition-all">
              <span className="text-white text-sm font-bold tracking-tighter">AC</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODAL FULL SCREEN DE REGISTROS (MANTENIENDO TU LÓGICA) */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="!fixed !inset-0 !translate-x-0 !translate-y-0 !max-w-none !w-screen !h-screen !m-0 !p-0 !rounded-none border-none bg-white z-[100] flex flex-col [&>button]:hidden">
          {selectedRegistro && <RegistrosModalContent registroId={selectedRegistro} />}
        </DialogContent>
      </Dialog>

      {/* LÍNEA DECORATIVA */}
      <div className="w-full h-[4px] leading-[0]">
        <img src="/rectangle.jpg" alt="border" className="w-full h-full object-fill block" />
      </div>
    </div>
  );
}



export { locationsData };