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
  PlusIcon,
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
} from "lucide-react";

/* ---------------- PROPS ---------------- */
interface TablesSectionProps {
  locationId: string | null;
  dockGroupId?: string | null;
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

/* ---------------- COMPONENT ---------------- */
export function TablesSection({ locationId }: TablesSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [section, setSection] = useState<"monitoreo" | "gestion">("monitoreo");
  const [monitoreoView, setMonitoreoView] = useState("appointments");
  const [gestionView, setGestionView] = useState("solicitudes");

  const monitoringTabs = [
    { id: "appointments", label: "Consulta de Citas", icon: CalendarRange, count: 24 },
    { id: "carriers", label: "Torre Control", icon: Truck, count: 8 },
    { id: "inventory", label: "Editar Información", icon: Package, count: 12 }
  ];

  const managementTabs = [
    { id: "solicitudes", label: "Solicitud de Citas", icon: FileText },
    { id: "programadas", label: "Confirmación", icon: CheckSquare },
    { id: "cancelacion", label: "Cancelación", icon: XCircle },
    { id: "reagendamiento", label: "Reagendar", icon: History },
    { id: "recurrencia", label: "Recurrencia de Citas", icon: CalendarRange },
  ];

  if (!locationId) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-white border rounded-3xl border-dashed border-slate-200 p-12 text-center">
        <div className="bg-slate-50 p-6 rounded-full mb-4 shadow-inner">
          <Monitor className="w-10 h-10 text-slate-300" />
        </div>
        <h3 className="text-lg font-black text-[#1C1E59] uppercase tracking-tighter italic">Selecciona una Localidad</h3>
        <p className="text-sm text-slate-400 max-w-xs">Elige una planta para visualizar las tablas de gestión y monitoreo.</p>
      </div>
    );
  }

  return (
    <div className={cn(
      "bg-white border border-slate-200 rounded-3xl flex flex-col transition-all duration-500 ease-in-out",
      isExpanded ? "fixed inset-4 z-[100] shadow-2xl" : "h-full w-full shadow-lg"
    )}>
      
      <Tabs value={section} onValueChange={(v) => setSection(v as any)} className="flex-1 flex flex-col min-h-0">
        
        {/* --- TOOLBAR SUPERIOR --- */}
        <div className="px-5 py-3 border-b flex items-center justify-between bg-white shrink-0 gap-4">
            <div className="flex items-center gap-4">
                <TabsList className="h-10 bg-slate-100 p-1 rounded-xl shrink-0 border border-slate-200">
                    <TabsTrigger value="monitoreo" className="h-8 px-4 data-[state=active]:bg-white data-[state=active]:text-[#1C1E59] data-[state=active]:shadow-sm transition-all">
                        <Monitor className="w-4 h-4 mr-2" />
                    </TabsTrigger>
                    <TabsTrigger value="gestion" className="h-8 px-4 data-[state=active]:bg-white data-[state=active]:text-[#1C1E59] data-[state=active]:shadow-sm transition-all">
                        <CalendarDays className="w-4 h-4 mr-2" />
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
                <div className="relative group hidden xl:block">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-orange-500" />
                    <Input placeholder="Buscar..." className="h-9 w-48 pl-10 rounded-xl border-slate-200 text-xs focus:ring-1 focus:ring-orange-500" />
                </div>
                <Button className="h-9 gap-2 bg-[#FF6B00] hover:bg-[#e65c00] text-white rounded-xl px-5 text-xs font-black uppercase tracking-wider shadow-lg shadow-orange-200">
                    <PlusIcon className="w-4 h-4" /> New Entry
                </Button>
                <div className="h-6 w-px bg-slate-200 mx-1" />
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:bg-slate-50"><Download className="w-4 h-4"/></Button>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:bg-slate-50"><Filter className="w-4 h-4"/></Button>
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
            <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-200/60 overflow-hidden flex flex-col">
                <div className="flex-1 overflow-auto custom-scrollbar">
                      <TabsContent value="monitoreo" className="h-full m-0">
                        {/* --- VISTA: CONSULTA DE CITAS --- */}
                        {monitoreoView === "appointments" && (
                          <Table>
                            <TableHeader className="bg-[#1C1E59] sticky top-0 z-30">
                              <TableRow className="hover:bg-transparent border-none h-11">
                                {[
                                  "ID Cita", "Hora Cita", "Proveedor", "ID Proveedor", "Transportadora", 
                                  "GEN", "Estado", "Placa", "Entrada", "Salida", "Taller"
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
                        {monitoreoView === "carriers" && (
                          <Table>
                            <TableHeader className="bg-[#1C1E59] sticky top-0 z-30">
                              <TableRow className="hover:bg-transparent border-none h-11">
                                {[
                                  "Unidad Negocio", "Proveedor", "Fecha", "Hora", "Tipo Cita", 
                                  "ID Cita", "Estado", "Orden Compra", "Recibo", "Placa", 
                                  "Transportadora", "Entrada UN", "T. Transcurrido UN", "T. Traslado", 
                                  "T. Descargue", "T. Est. Descargue", "Salida", "Usuario", 
                                  "A Tiempo", "Descargue", "ID Proveedor"
                                ].map((h) => (
                                  <TableHead key={h} className="text-white font-bold text-[9px] uppercase tracking-[0.1em] px-4 h-11 whitespace-nowrap">{h}</TableHead>
                                ))}
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {[...Array(10)].map((_, i) => (
                                <TableRow key={i} className="group hover:bg-blue-50/40 border-b border-slate-50 transition-colors h-14">
                                  <TableCell className="px-4 font-bold text-slate-700 text-[11px]">Planta Bello</TableCell>
                                  <TableCell className="px-4 font-bold text-[#1C1E59] text-[11px] uppercase">Solla S.A.</TableCell>
                                  <TableCell className="px-4 text-slate-500 text-[11px]">26/01/2026</TableCell>
                                  <TableCell className="px-4 text-slate-500 text-[11px]">14:30</TableCell>
                                  <TableCell className="px-4 font-medium text-blue-600 text-[10px] uppercase">Descargue</TableCell>
                                  <TableCell className="px-4 font-black text-[#1C1E59] text-xs">DOC-9921{i}</TableCell>
                                  <TableCell className="px-4"><StatusBadge status="en_proceso" /></TableCell>
                                  <TableCell className="px-4 font-mono text-[10px]">OC-7721</TableCell>
                                  <TableCell className="px-4 text-slate-400 text-[10px]">REC-001</TableCell>
                                  <TableCell className="px-4">
                                    <span className="bg-amber-50 border border-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono font-bold text-[10px] uppercase">XYZ-12{i}</span>
                                  </TableCell>
                                  <TableCell className="px-4 text-slate-600 text-[10px] uppercase">Carga Segura</TableCell>
                                  <TableCell className="px-4 text-slate-500 text-[10px]">14:45</TableCell>
                                  <TableCell className="px-4 font-mono text-[10px] text-orange-600 font-bold">00:45:12</TableCell>
                                  <TableCell className="px-4 font-mono text-[10px]">00:15:00</TableCell>
                                  <TableCell className="px-4 font-mono text-[10px] text-emerald-600 font-bold">01:20:00</TableCell>
                                  <TableCell className="px-4 text-slate-400 text-[10px]">02:00:00</TableCell>
                                  <TableCell className="px-4 text-slate-500 text-[10px]">16:05</TableCell>
                                  <TableCell className="px-4 text-slate-600 text-[10px] font-medium uppercase">Admin_User</TableCell>
                                  <TableCell className="px-4 text-center">
                                    {i % 2 === 0 ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <XCircle className="w-4 h-4 text-rose-500 mx-auto" />}
                                  </TableCell>
                                  <TableCell className="px-4">
                                    <Badge className="bg-blue-100 text-blue-700 text-[8px] font-black border-none">95%</Badge>
                                  </TableCell>
                                  <TableCell className="px-4 text-slate-400 text-[10px]">NIT 800.112.233</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}

                        {/* --- VISTA: EDITAR INFORMACIÓN (Otras) --- */}
                        {monitoreoView === "inventory" && (
                      <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden mx-1 mb-1">
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

                                  {/* COLUMNA ACCIONES: BOTÓN EDITAR SOLICITADO */}
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
                      </TabsContent>

                      {/* --- CONTENIDO: GESTIÓN DE CITAS --- */}
<TabsContent value="gestion" className="h-full m-0 flex flex-col">
  
  {/* 1. TABLA DE SOLICITUDES (Pestaña "Solicitud") */}
  {gestionView === "solicitudes" && (
    <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden mx-1 mb-1">
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
            {[...Array(10)].map((_, i) => (
              <TableRow key={i} className="group hover:bg-orange-50/30 transition-colors border-b border-slate-50 last:border-none h-14">
                <TableCell className="text-center">
                  <input type="checkbox" className="rounded border-slate-200" />
                </TableCell>

                {/* ID Solicitud - Itálico y elegante */}
                <TableCell className="px-4">
                  <span className="font-black text-[#1C1E59] text-sm italic tracking-tighter">REQ-882{i}</span>
                </TableCell>

                <TableCell className="px-4 font-bold text-slate-700 text-xs uppercase">
                  DHL Logistics Express
                </TableCell>

                <TableCell className="px-4 text-slate-500 text-xs">
                  26/01/2026
                </TableCell>

                {/* Ventana Horaria - Estilo Badge */}
                <TableCell className="px-4">
                  <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 font-bold text-[10px]">
                    08:00 - 10:00
                  </Badge>
                </TableCell>

                <TableCell className="px-4 text-slate-600 text-xs font-medium uppercase">
                  Materia Prima (Seca)
                </TableCell>

                <TableCell className="px-4 text-center font-mono font-bold text-blue-600">
                  24
                </TableCell>

                <TableCell className="px-4">
                   <StatusBadge status="pendiente" />
                </TableCell>

                {/* ACCIONES: Botones estilizados con Shadow */}
                <TableCell className="px-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0 text-green-600 hover:bg-green-50 hover:text-green-700 border border-transparent hover:border-green-100 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
                      title="Aprobar Solicitud"
                    >
                      <CheckSquare className="w-4 h-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-100 rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
                      title="Rechazar Solicitud"
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )}


{/* 2. TABLA DE CONFIRMACIÓN (Pestaña "Confirmación") */}
{gestionView === "programadas" && (
  <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden mx-1 mb-1">
    <div className="flex-1 overflow-auto custom-scrollbar">
      <Table>
        <TableHeader className="bg-[#1C1E59] sticky top-0 z-30">
          <TableRow className="border-none hover:bg-transparent">
            {[
              "Acciones", "ID Cita", "Estado", "Tipo de Producto", 
              "Orden de Compra", "Fecha Cita", "Hora Cita", "Proveedor", 
              "Transportista", "Conductor", "Placa", "Vehículo", "Talleres Entrega"
            ].map((header) => (
              <TableHead 
                key={header} 
                className="text-white/90 font-bold text-[10px] uppercase tracking-wider h-11 whitespace-nowrap px-4 border-none text-center"
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(10)].map((_, i) => (
            <TableRow 
              key={i} 
              className="group hover:bg-blue-50/40 transition-colors border-b border-slate-50 last:border-none h-14"
            >
              {/* ACCIONES - BOTÓN CONFIRMAR ESTILIZADO */}
              <TableCell className="text-center px-4">
                <Button 
                  size="sm" 
                  className="bg-[#FF6B00] hover:bg-[#e66101] text-white font-black text-[10px] uppercase tracking-tighter rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 h-8 px-4 flex items-center gap-1.5 mx-auto"
                >
                  <Check className="w-3.5 h-3.5" />
                 
                </Button>
              </TableCell>

              {/* ID CITA */}
              <TableCell className="px-4 text-center">
                <span className="font-black text-[#1C1E59] text-sm tracking-tighter italic">APT-772{i}</span>
              </TableCell>

              {/* ESTADO */}
              <TableCell className="px-4 text-center">
                <StatusBadge status="confirmado" />
              </TableCell>

              {/* TIPO DE PRODUCTO */}
              <TableCell className="px-4 text-slate-600 text-xs font-medium uppercase text-center whitespace-nowrap">
                Materia Prima
              </TableCell>

              {/* ORDEN DE COMPRA */}
              <TableCell className="px-4 text-center">
                <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 font-bold text-[10px] shadow-sm">
                  OC-99234
                </Badge>
              </TableCell>

              {/* FECHA CITA */}
              <TableCell className="px-4 text-slate-500 text-xs text-center font-medium">
                26/01/2026
              </TableCell>

              {/* HORA CITA */}
              <TableCell className="px-4 text-center">
                <div className="flex items-center justify-center gap-1.5 text-slate-500 font-medium text-xs italic whitespace-nowrap">
                  <Clock className="w-3.5 h-3.5 text-slate-300" /> 10:30 AM
                </div>
              </TableCell>

              {/* PROVEEDOR */}
              <TableCell className="px-4 font-bold text-slate-700 text-xs uppercase tracking-tight text-center whitespace-nowrap">
                Proveedor Global S.A.
              </TableCell>

              {/* TRANSPORTISTA */}
              <TableCell className="px-4 text-slate-600 text-xs font-semibold uppercase text-center whitespace-nowrap">
                Transportes Atlas
              </TableCell>

              {/* CONDUCTOR */}
              <TableCell className="px-4 text-slate-700 text-[11px] font-medium uppercase text-center whitespace-nowrap">
                Ricardo Montenegro
              </TableCell>

              {/* PLACA */}
              <TableCell className="px-4 text-center">
                <span className="bg-amber-50 border border-amber-200 text-amber-800 px-2 py-0.5 rounded font-mono font-bold text-[11px] uppercase shadow-sm">
                  JVW-00{i}
                </span>
              </TableCell>

              {/* VEHÍCULO */}
              <TableCell className="px-4 text-slate-500 text-xs text-center uppercase font-medium">
                Sencillo
              </TableCell>

              {/* TALLERES ENTREGA */}
              <TableCell className="px-4 text-center">
                <div className="flex items-center justify-center gap-2 text-slate-500 text-[10px] font-bold whitespace-nowrap">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  Bodega Principal A
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
)}


{/* 2. TABLA DE CANCELACIÓN (Pestaña "Cancelación") */}
{gestionView === "cancelacion" && (
  <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden mx-1 mb-1">
    <div className="flex-1 overflow-auto custom-scrollbar">
      <Table>
        <TableHeader className="bg-[#1C1E59] sticky top-0 z-30">
          <TableRow className="border-none hover:bg-transparent">
            {[
              "Acciones", "ID Cita", "Estado", "Tipo de Producto", 
              "Orden de Compra", "Fecha Cita", "Hora Cita", "Proveedor", 
              "Transportista", "Conductor", "Placa", "Vehículo", "Talleres Entrega"
            ].map((header) => (
              <TableHead 
                key={header} 
                className="text-white/90 font-bold text-[10px] uppercase tracking-wider h-11 whitespace-nowrap px-4 border-none text-center"
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(10)].map((_, i) => (
            <TableRow 
              key={i} 
              className="group hover:bg-blue-50/40 transition-colors border-b border-slate-50 last:border-none h-14"
            >
              {/* ACCIONES - BOTÓN CONFIRMAR ESTILIZADO */}
              <TableCell className="text-center px-4">
                <Button 
                  size="sm" 
                  className="bg-[#FF6B00] hover:bg-[#e66101] text-white font-black text-[10px] uppercase tracking-tighter rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 h-8 px-4 flex items-center gap-1.5 mx-auto"
                >
                  <XCircle className="w-3.5 h-3.5" />
                 
                </Button>
              </TableCell>

              {/* ID CITA */}
              <TableCell className="px-4 text-center">
                <span className="font-black text-[#1C1E59] text-sm tracking-tighter italic">APT-772{i}</span>
              </TableCell>

              {/* ESTADO */}
              <TableCell className="px-4 text-center">
                <StatusBadge status="confirmado" />
              </TableCell>

              {/* TIPO DE PRODUCTO */}
              <TableCell className="px-4 text-slate-600 text-xs font-medium uppercase text-center whitespace-nowrap">
                Materia Prima
              </TableCell>

              {/* ORDEN DE COMPRA */}
              <TableCell className="px-4 text-center">
                <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 font-bold text-[10px] shadow-sm">
                  OC-99234
                </Badge>
              </TableCell>

              {/* FECHA CITA */}
              <TableCell className="px-4 text-slate-500 text-xs text-center font-medium">
                26/01/2026
              </TableCell>

              {/* HORA CITA */}
              <TableCell className="px-4 text-center">
                <div className="flex items-center justify-center gap-1.5 text-slate-500 font-medium text-xs italic whitespace-nowrap">
                  <Clock className="w-3.5 h-3.5 text-slate-300" /> 10:30 AM
                </div>
              </TableCell>

              {/* PROVEEDOR */}
              <TableCell className="px-4 font-bold text-slate-700 text-xs uppercase tracking-tight text-center whitespace-nowrap">
                Proveedor Global S.A.
              </TableCell>

              {/* TRANSPORTISTA */}
              <TableCell className="px-4 text-slate-600 text-xs font-semibold uppercase text-center whitespace-nowrap">
                Transportes Atlas
              </TableCell>

              {/* CONDUCTOR */}
              <TableCell className="px-4 text-slate-700 text-[11px] font-medium uppercase text-center whitespace-nowrap">
                Ricardo Montenegro
              </TableCell>

              {/* PLACA */}
              <TableCell className="px-4 text-center">
                <span className="bg-amber-50 border border-amber-200 text-amber-800 px-2 py-0.5 rounded font-mono font-bold text-[11px] uppercase shadow-sm">
                  JVW-00{i}
                </span>
              </TableCell>

              {/* VEHÍCULO */}
              <TableCell className="px-4 text-slate-500 text-xs text-center uppercase font-medium">
                Sencillo
              </TableCell>

              {/* TALLERES ENTREGA */}
              <TableCell className="px-4 text-center">
                <div className="flex items-center justify-center gap-2 text-slate-500 text-[10px] font-bold whitespace-nowrap">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  Bodega Principal A
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
)}


{/* 4. TABLA DE REAGENDAMIENTO (Pestaña "Reagendar") */}
{gestionView === "reagendamiento" && (
  <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden mx-1 mb-1">
    <div className="flex-1 overflow-auto custom-scrollbar">
      <Table>
        <TableHeader className="bg-[#1C1E59] sticky top-0 z-30">
          <TableRow className="border-none hover:bg-transparent">
            {[
              "Acciones",         // field: 'actions'
              "Solicitud",        // field: 'reschedule' (label a)
              "ID Cita",          // field: 'appointment' (label b)
              "Fecha Original",   // field: 'appointment_date' (label c)
              "Hora Original",    // field: 'appointment_time' (label d)
              "Estado",           // field: 'request_status' (label e)
              "Gestión",          // field: 'management' (label f)
              "Proveedor",        // field: 'supplier' (label g)
              "Tipo Producto",    // field: 'product_type' (label h)
              "Orden Compra",     // field: 'purchase_order' (label i)
              "Cant. Unidades",   // field: 'quantity_of_units' (label j)
              "Nueva Fecha",      // field: 'rescheduled_date' (label k)
              "Nueva Hora",       // field: 'assigned_time' (label l)
              "Motivo"            // field: 'Reason_rescheduling' (label m)
            ].map((header) => (
              <TableHead 
                key={header} 
                className="text-white/90 font-bold text-[10px] uppercase tracking-wider h-11 whitespace-nowrap px-4 border-none text-center"
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(10)].map((_, i) => (
            <TableRow 
              key={i} 
              className="group hover:bg-orange-50/30 transition-colors border-b border-slate-50 last:border-none h-14"
            >
              {/* ACCIONES - BOTÓN REAGENDAR ESTILIZADO */}
              <TableCell className="text-center px-4">
                <Button 
                  size="sm" 
                  className="bg-[#FF6B00] hover:bg-[#e66101] text-white font-black text-[10px] uppercase tracking-tighter rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95 h-8 px-4 flex items-center gap-1.5 mx-auto"
                >
                  <History className="w-3.5 h-3.5" />
                  Reagendar
                </Button>
              </TableCell>

              {/* LABEL A: Solicitud */}
              <TableCell className="px-4 text-center font-bold text-slate-400 text-[11px]">
                #RS-992{i}
              </TableCell>

              {/* LABEL B: ID Cita */}
              <TableCell className="px-4 text-center">
                <span className="font-black text-[#1C1E59] text-sm tracking-tighter">APT-445{i}</span>
              </TableCell>

              {/* LABEL C: Fecha Cita */}
              <TableCell className="px-4 text-slate-500 text-xs text-center font-medium">
                20/01/2026
              </TableCell>

              {/* LABEL D: Hora Cita */}
              <TableCell className="px-4 text-center">
                <div className="flex items-center justify-center gap-1.5 text-slate-400 text-xs italic">
                  <Clock className="w-3 h-3" /> 08:00 AM
                </div>
              </TableCell>

              {/* LABEL E: Estado */}
              <TableCell className="px-4 text-center">
                <StatusBadge status="retrasado" />
              </TableCell>

              {/* LABEL F: Gestión */}
              <TableCell className="px-4 text-center text-slate-600 text-[11px] font-semibold uppercase">
                Manual
              </TableCell>

              {/* LABEL G: Proveedor */}
              <TableCell className="px-4 font-bold text-slate-700 text-xs uppercase tracking-tight text-center whitespace-nowrap">
                Bayer Industrial
              </TableCell>

              {/* LABEL H: Tipo Producto */}
              <TableCell className="px-4 text-slate-500 text-xs text-center uppercase font-medium">
                Insumos
              </TableCell>

              {/* LABEL I: Orden Compra */}
              <TableCell className="px-4 text-center">
                <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 font-bold text-[10px]">
                  OC-11223
                </Badge>
              </TableCell>

              {/* LABEL J: Cant. Unidades */}
              <TableCell className="px-4 text-center font-mono font-bold text-blue-600">
                1,250
              </TableCell>

              {/* LABEL K: Fecha Reagendada */}
              <TableCell className="px-4 text-[#1C1E59] text-xs text-center font-black italic">
                26/01/2026
              </TableCell>

              {/* LABEL L: Hora Asignada */}
              <TableCell className="px-4 text-center">
                <div className="flex items-center justify-center gap-1.5 text-[#1C1E59] font-black text-xs italic bg-blue-50 py-1 rounded-lg border border-blue-100">
                  14:00 PM
                </div>
              </TableCell>

              {/* LABEL M: Motivo Reagendamiento */}
              <TableCell className="px-4 text-left min-w-[200px]">
                <div className="flex items-start gap-2 text-slate-500 text-[10px] italic leading-tight">
                  <AlertTriangle className="w-3 h-3 text-orange-400 shrink-0 mt-0.5" />
                  Reprogramación por retraso en puerto de salida.
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
)}
 {/* 5. TABLA DE RECURRENCIA (Pestaña "Recurrencia") */}
{gestionView === "recurrencia" && (
  <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden mx-1 mb-1">
    <div className="flex-1 overflow-auto custom-scrollbar">
      <Table>
        <TableHeader className="bg-[#1C1E59] sticky top-0 z-30">
          <TableRow className="border-none hover:bg-transparent">
            {[
              "Unidad de negocio", "Proveedor", "Carrier", "Dirección", 
              "Hora de la cita", "Tiempo de inicio", "Fin de la cita", 
              "Editar", "Eliminar", "Reporte"
            ].map((header) => (
              <TableHead 
                key={header} 
                className="text-white/90 font-bold text-[10px] uppercase tracking-wider h-11 whitespace-nowrap px-4 border-none text-center"
              >
                {header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(8)].map((_, i) => (
            <TableRow 
              key={i} 
              className="group hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-none h-14"
            >
              {/* UNIDAD DE NEGOCIO */}
              <TableCell className="px-4 text-center">
                <span className="font-bold text-slate-700 text-xs uppercase">Planta Bello 1405</span>
              </TableCell>

              {/* PROVEEDOR */}
              <TableCell className="px-4 text-center">
                <span className="font-black text-[#1C1E59] text-[11px] uppercase tracking-tight">Colgate-Palmolive</span>
              </TableCell>

              {/* CARRIER */}
              <TableCell className="px-4 text-center text-slate-600 text-[11px] font-semibold uppercase">
                Servientrega S.A.
              </TableCell>

              {/* DIRECCIÓN */}
              <TableCell className="px-4 text-center max-w-[150px] truncate">
                <div className="flex items-center justify-center gap-1 text-slate-400 text-[10px] italic">
                  <MapPin className="w-3 h-3 shrink-0" />
                  Calle 45 #12-80, Bello
                </div>
              </TableCell>

              {/* HORA DE LA CITA */}
              <TableCell className="px-4 text-center">
                <div className="inline-flex items-center gap-1.5 text-[#1C1E59] font-bold text-xs bg-slate-100 px-2 py-1 rounded-lg">
                  <Clock className="w-3.5 h-3.5" /> 07:00 AM
                </div>
              </TableCell>

              {/* TIEMPO DE INICIO */}
              <TableCell className="px-4 text-center text-slate-500 text-xs font-medium italic">
                06:45 AM
              </TableCell>

              {/* FIN DE LA CITA */}
              <TableCell className="px-4 text-center text-slate-500 text-xs font-medium italic">
                08:30 AM
              </TableCell>

              {/* ACCIÓN: EDITAR (Botón con Box Shadow) */}
              <TableCell className="px-4 text-center">
                <Button 
                  size="sm" 
                  className="bg-[#FF6B00] hover:bg-[#e66101] text-white font-black text-[10px] uppercase rounded-xl shadow-md shadow-orange-200 hover:shadow-lg transition-all active:scale-95 h-8 px-4 flex items-center gap-1.5 mx-auto"
                >
                  <FileText className="w-3.5 h-3.5" />
                 
                </Button>
              </TableCell>

              {/* ACCIÓN: ELIMINAR */}
              <TableCell className="px-4 text-center">
                <Button 
                  variant="outline"
                  size="icon" 
                  className="h-8 w-8 rounded-xl border-rose-100 text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition-all"
                  title="Eliminar Recurrencia"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </TableCell>

              {/* ACCIÓN: REPORTE */}
              <TableCell className="px-4 text-center">
                <Button 
                  variant="ghost"
                  size="icon" 
                  className="h-8 w-8 rounded-xl text-slate-400 hover:text-[#1C1E59] hover:bg-slate-100 transition-all"
                  title="Ver Reporte de Patrón"
                >
                  <BarChart3 className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  </div>
)}
  
  
</TabsContent>
              </div>
                <TablePagination total={45} />
            </div>
        </div>
      </Tabs>
    </div>
  );
}