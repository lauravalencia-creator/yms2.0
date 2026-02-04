"use client";

import React, { useState } from "react";
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
import { cn } from "@/lib/utils";
import {
  Download,
  Monitor,
  CalendarRange,
  Truck,
  Package,
  Clock,
  RefreshCcw,
  Filter,
  Check,
  XCircle,
  FileText,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* --- HELPERS VISUALES --- */
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
    <div className="text-[10px] text-slate-500 ">
      Mostrando <span className="font-bold text-slate-700">1 - 10</span> de <span className="font-bold text-slate-700">{total}</span>
    </div>
    <div className="flex items-center gap-1">
      <Button variant="outline" size="icon" className="h-7 w-7 rounded-lg border-slate-200"><ChevronLeft className="w-3.5 h-3.5" /></Button>
      <Button className="h-7 w-7 rounded-lg bg-[#1C1E59] text-white text-[10px] font-bold">1</Button>
      <Button variant="outline" size="icon" className="h-7 w-7 rounded-lg border-slate-200"><ChevronRight className="w-3.5 h-3.5" /></Button>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="h-full w-full flex flex-col items-center justify-center bg-slate-50/30 p-12 text-center">
    <div className="bg-slate-50 p-6 rounded-full mb-4 border border-slate-100">
      <Monitor className="w-10 h-10 text-slate-300" />
    </div>
    <h3 className="text-sm font-black text-[#1C1E59] uppercase tracking-tighter ">Selecciona una Localidad</h3>
    <p className="text-[11px] text-slate-400 max-w-xs mx-auto mt-2">Elige una planta para visualizar los datos de monitoreo.</p>
  </div>
);

/* --- COMPONENTE PRINCIPAL --- */
export default function MonitoringTables({ locationId }: { locationId: string | null }) {
  const [activeTab, setActiveTab] = useState("appointments");

  const tabs = [
    { id: "appointments", label: "Consulta de Citas", icon: CalendarRange },
    { id: "carriers", label: "Control de Citas", icon: Truck },
    { id: "inventory", label: "Editar Información", icon: Package }
  ];

  return (
    <div className="flex h-full w-full bg-white border border-slate-200 rounded-3xl shadow-lg overflow-hidden">
      
      {/* --- BARRA LATERAL IZQUIERDA COMPACTA (NAVY STYLE) --- */}
      <div className="w-16 flex flex-col border-r border-slate-100 bg-slate-50/50 py-4 items-center gap-3 shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            title={tab.label}
            className={cn(
              "relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 group",
              activeTab === tab.id 
                ? "bg-[#1C1E59] text-white shadow-md shadow-indigo-200" 
                : "text-slate-400 hover:bg-white hover:text-[#1C1E59]"
            )}
          >
            <tab.icon className="w-5 h-5" />
            
            {/* Indicador lateral activo pegado al borde */}
            {activeTab === tab.id && (
              <div className="absolute -left-3 w-1 h-6 bg-[#1C1E59] rounded-r-full" />
            )}
          </button>
        ))}
      </div>

      {/* --- ÁREA DE CONTENIDO (DERECHA) --- */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Toolbar superior compacto */}
        <div className="h-12 border-b border-slate-100 flex items-center justify-between px-6 bg-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#1C1E59] ">
              {tabs.find(t => t.id === activeTab)?.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Button disabled={!locationId} variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
              <RefreshCcw className="w-3.5 h-3.5"/>
            </Button>
            <Button disabled={!locationId} variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
              <Download className="w-3.5 h-3.5"/>
            </Button>
            <Button disabled={!locationId} variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
              <Filter className="w-3.5 h-3.5"/>
            </Button>
          </div>
        </div>

        <div className="flex-1 p-3 bg-slate-50/30 overflow-hidden flex flex-col">
          <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            {!locationId ? (
              <EmptyState />
            ) : (
              <div className="flex-1 overflow-auto custom-scrollbar">
                {activeTab === "appointments" && (
                  <Table>
                    <TableHeader className="bg-[#1C1E59] sticky top-0 z-30">
                      <TableRow className="border-none h-10">
                        {["ID Cita", "Hora Cita", "Proveedor", "Transportadora", "Estado", "Placa", "Entrada", "Salida"].map(h => (
                          <TableHead key={h} className="text-white font-bold text-[9px] uppercase px-3 whitespace-nowrap">{h}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...Array(10)].map((_, i) => (
                        <TableRow key={i} className="hover:bg-blue-50/20 border-b border-slate-50 h-12">
                          <TableCell className="px-3 font-black text-[#1C1E59] text-[10px] ">APT-{1024 + i}</TableCell>
                          <TableCell className="px-3 text-slate-500 text-[10px] font-medium"><Clock className="inline w-3 h-3 mr-1" /> 08:30 AM</TableCell>
                          <TableCell className="px-3 font-bold text-slate-700 text-[10px] uppercase">Logística del Norte</TableCell>
                          <TableCell className="px-3 text-slate-600 text-[10px]">Transportes Especiales</TableCell>
                          <TableCell className="px-3"><StatusBadge status={i % 2 === 0 ? "en_proceso" : "confirmado"} /></TableCell>
                          <TableCell className="px-3"><span className="bg-amber-50 border border-amber-200 text-amber-800 px-2 py-0.5 rounded font-mono font-bold text-[10px]">KKL-99{i}</span></TableCell>
                          <TableCell className="px-3 text-slate-400 text-[10px] ">07:45 AM</TableCell>
                          <TableCell className="px-3 text-slate-400 text-[10px] ">09:30 AM</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}

                {activeTab === "carriers" && (
                  <Table>
                     <TableHeader className="bg-[#1C1E59] sticky top-0 z-30">
                        <TableRow className="border-none h-10">
                          {["Cita", "Localidad", "Estado", "Cliente", "Placa", "T. Localidad", "OnTime", "% C/D"].map(h => (
                            <TableHead key={h} className="text-white font-bold text-[9px] uppercase px-3 whitespace-nowrap">{h}</TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {[...Array(10)].map((_, i) => (
                          <TableRow key={i} className="hover:bg-blue-50/20 border-b border-slate-50 h-12">
                            <TableCell className="px-3 font-black text-[#1C1E59] text-[10px]">CITA-{100+i}</TableCell>
                            <TableCell className="px-3 text-slate-600 text-[10px] font-bold">Planta Bello</TableCell>
                            <TableCell className="px-3"><StatusBadge status="en_proceso" /></TableCell>
                            <TableCell className="px-3 font-bold text-[#1C1E59] text-[10px] uppercase">Cliente Principal</TableCell>
                            <TableCell className="px-3 font-mono font-bold text-[10px]">AAA-123</TableCell>
                            <TableCell className="px-3 font-mono text-[10px] text-orange-600 font-bold">01:15:00</TableCell>
                            <TableCell className="px-3 text-center">{i % 2 === 0 ? <Check className="w-3.5 h-3.5 text-emerald-500 mx-auto" /> : <XCircle className="w-3.5 h-3.5 text-rose-500 mx-auto" />}</TableCell>
                            <TableCell className="px-3"><Badge className="bg-blue-100 text-blue-700 text-[9px] border-none">50%</Badge></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                  </Table>
                )}

                {activeTab === "inventory" && (
                  <Table>
                    <TableHeader className="bg-[#1C1E59] sticky top-0 z-30">
                      <TableRow className="border-none h-10">
                        {["ID Cita", "Proveedor", "Vehículo", "T. Transcurrido", "Acciones"].map(h => (
                          <TableHead key={h} className="text-white font-bold text-[9px] uppercase px-3 whitespace-nowrap">{h}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...Array(10)].map((_, i) => (
                        <TableRow key={i} className="hover:bg-blue-50/20 border-b border-slate-50 h-12">
                          <TableCell className="px-3 font-black text-[#1C1E59] text-[10px]">DOC-992{i}</TableCell>
                          <TableCell className="px-3 font-black text-[#1C1E59] text-[10px] uppercase">Logística Integral S.A.</TableCell>
                          <TableCell className="px-3 text-slate-600 text-[10px] uppercase font-semibold">Tractomula</TableCell>
                          <TableCell className="px-3 font-mono text-[10px] text-orange-600 font-bold">01:20:00</TableCell>
                          <TableCell className="px-3">
                            <Button variant="outline" size="sm" className="h-7 px-3 bg-white border-slate-200 text-[#1C1E59] font-black text-[9px] rounded-lg">
                              <FileText className="w-3 h-3 mr-1" /> Editar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            )}
            {locationId && <TablePagination total={45} />}
          </div>
        </div>
      </div>
    </div>
  );
}