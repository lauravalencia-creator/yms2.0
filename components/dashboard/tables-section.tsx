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
  ArrowDownCircle,
  Check
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
    { id: "solicitudes", label: "Solicitud", icon: FileText },
    { id: "programadas", label: "Confirmación", icon: CheckSquare },
    { id: "cancelacion", label: "Cancelación", icon: XCircle },
    { id: "reagendamiento", label: "Reagendar", icon: History },
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
              </div>
                <TablePagination total={45} />
            </div>
        </div>
      </Tabs>
    </div>
  );
}