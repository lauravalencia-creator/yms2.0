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
  Search, 
  BarChart3, 
  ClipboardList, 
  Users, 
  Upload, 
  Calendar as CalendarIcon,
  FileUp,
  CheckCircle2,
  FileText
} from 'lucide-react';

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

export function LocationFilter({ onFilterChange }: LocationFilterProps) {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [selectedDockGroupId, setSelectedDockGroupId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isResultsModalOpen, setIsResultsModalOpen] = useState(false);

  const selectedLocation = locationsData.find((loc) => loc.id === selectedLocationId);

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
    <div className="bg-white border-b border-yms-border px-6 py-4">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-yms-gray">
            <MapPinIcon className="w-5 h-5 text-yms-secondary" />
            <span className="font-medium text-sm">Localidad:</span>
          </div>
          <Select value={selectedLocationId || ""} onValueChange={handleLocationChange}>
            <SelectTrigger className={cn("w-[320px] rounded-[1.25rem] border-yms-border bg-white focus:ring-2 focus:ring-yms-cyan focus:border-yms-cyan hover:border-yms-cyan/50 transition-colors", !selectedLocationId && "text-yms-gray")}>
              <SelectValue placeholder="Seleccionar localidad..." />
            </SelectTrigger>
            <SelectContent className="rounded-[1rem] border-yms-border">
              {locationsData.map((location) => (
                <SelectItem key={location.id} value={location.id} className="rounded-[0.75rem] cursor-pointer focus:bg-yms-cyan/10">
                  <div className="flex items-start gap-3 py-1">
                    <BuildingIcon className="w-4 h-4 text-yms-primary mt-0.5 shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-medium text-yms-primary">{location.name}</span>
                      <span className="text-xs text-yms-gray">{location.address}</span>
                    </div>
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

        {isLoaded && selectedLocation && (
          <div className="ml-auto flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-yms-gray group-focus-within:text-yms-cyan transition-colors pointer-events-none" />
              <input type="text" placeholder="Buscar..." className="pl-9 pr-4 py-2 h-10 w-48 bg-white border border-yms-border rounded-xl text-sm outline-none focus:border-yms-cyan focus:ring-2 focus:ring-yms-cyan/20 transition-all" />
            </div>
            <div className="w-px h-8 bg-yms-border" />

            {/* MODAL REPORTES - ANCHO 4XL + W-FULL */}
            <Dialog>
              <DialogTrigger asChild>
                <button title="Reportes" className="w-10 h-10 flex items-center justify-center rounded-xl bg-yms-secondary text-white hover:brightness-110 active:scale-95 transition-all shadow-md"><BarChart3 size={18} /></button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-4xl w-full p-8 bg-white rounded-[2rem] sm:rounded-[2rem] border-0 shadow-2xl">
                <DialogHeader><DialogTitle className={cn("text-center text-2xl font-black uppercase tracking-wide mb-2", COLORS.NAVY)}>Filtros de Búsqueda</DialogTitle></DialogHeader>
                <ReportFiltersContent />
              </DialogContent>
            </Dialog>

            <button title="Registros" className="w-10 h-10 flex items-center justify-center rounded-xl bg-yms-secondary text-white hover:brightness-110 active:scale-95 transition-all shadow-md"><ClipboardList size={18} /></button>

            {/* MODAL USUARIOS - ANCHO 7XL + W-FULL */}
            <Dialog>
              <DialogTrigger asChild>
                <button title="Usuarios" className="w-10 h-10 flex items-center justify-center rounded-xl bg-yms-secondary text-white hover:brightness-110 active:scale-95 transition-all shadow-md"><Users size={18} /></button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-7xl w-full p-8 bg-white rounded-[2rem] border-0 shadow-2xl">
                <DialogHeader><DialogTitle className={cn("text-xl font-black uppercase tracking-wide", COLORS.NAVY)}>Gestión de Usuarios</DialogTitle></DialogHeader>
                <Tabs defaultValue="usuarios" className="mt-6">
                  <TabsList className="bg-gray-50 p-1.5 rounded-full h-auto w-fit border border-gray-100">
                    <TabsTrigger value="usuarios" className="rounded-full px-6 py-2.5 font-bold text-sm text-gray-500 data-[state=active]:bg-white data-[state=active]:text-[#1e2b58] data-[state=active]:shadow-sm transition-all">Administración de usuarios</TabsTrigger>
                    <TabsTrigger value="perfiles" className="rounded-full px-6 py-2.5 font-bold text-sm text-gray-500 data-[state=active]:bg-white data-[state=active]:text-[#1e2b58] data-[state=active]:shadow-sm transition-all">Administración de perfiles</TabsTrigger>
                  </TabsList>
                  <div className="mt-6"><TabsContent value="usuarios"><UsuariosTable /></TabsContent><TabsContent value="perfiles"><PerfilesTable /></TabsContent></div>
                </Tabs>
              </DialogContent>
            </Dialog>

            {/* MODAL CARGA - ANCHO 6XL + W-FULL */}
            <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
              <DialogTrigger asChild>
                <button title="Carga de Archivos" className="w-10 h-10 flex items-center justify-center rounded-xl bg-yms-secondary text-white hover:brightness-110 active:scale-95 transition-all shadow-md"><Upload size={18} /></button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-6xl w-full p-0 bg-white rounded-[2rem] border-0 shadow-2xl overflow-hidden">
                <div className="px-8 py-5 border-b border-gray-100 flex items-center gap-3"><div className="p-2 bg-slate-50 rounded-lg"><Upload className={cn("w-5 h-5", COLORS.NAVY)} /></div><DialogTitle className={cn("text-lg font-black uppercase tracking-wide", COLORS.NAVY)}>Carga de Archivos</DialogTitle></div>
                <div className="px-8 pb-8"><FileUploadContent onUpload={handleUploadComplete} /></div>
              </DialogContent>
            </Dialog>

            {/* MODAL RESULTADOS - ANCHO 4XL + W-FULL */}
            <Dialog open={isResultsModalOpen} onOpenChange={setIsResultsModalOpen}>
                <DialogContent className="sm:max-w-4xl w-full p-0 bg-white rounded-[2rem] border-0 shadow-2xl overflow-hidden">
                    <div className="px-8 py-5 border-b border-gray-100 flex items-center gap-3"><div className="p-2 bg-slate-50 rounded-lg"><Upload className={cn("w-5 h-5", COLORS.NAVY)} /></div><DialogTitle className={cn("text-lg font-black uppercase tracking-wide", COLORS.NAVY)}>Carga de Archivos</DialogTitle></div>
                    <div className="px-8 pb-8"><UploadResultsContent onClose={() => setIsResultsModalOpen(false)} /></div>
                </DialogContent>
            </Dialog>
          </div>
        )}
      </div>
      {!selectedLocationId && <div className="mt-3 flex items-center gap-2 text-yms-gray/70 text-sm"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" /></svg><span>Selecciona una localidad para cargar el dashboard de operaciones</span></div>}
    </div>
  );
}

export { locationsData };