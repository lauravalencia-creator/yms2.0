"use client";

import React, { useState, useMemo } from "react";
import { 
  Search, Filter, FileText, Eye, Download, 
  RotateCw, X, AlertTriangle, ChevronRight 
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

import {
  Dialog,DialogContent
} from "@/components/ui/dialog";

// --- SUB-COMPONENTE: ANÁLISIS DE LOGS ---
function LogAnalysisModal({ docId, onClose }: { docId: string, onClose: () => void }) {
  return (
    <Dialog open={!!docId} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden border-0 rounded-[2rem] shadow-2xl z-[120] [&>button]:hidden">
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
          <div className="grid grid-cols-2 gap-y-6 gap-x-12">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-gray-400 uppercase italic">Validación</span>
              <div><Badge className="bg-red-50 text-red-500 text-[10px] py-0.5 px-3 shadow-none font-bold rounded-full">FAILED</Badge></div>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-black text-gray-400 uppercase italic">Timestamp</span>
              <p className="text-[#1C1E59] font-black text-sm">26/01/2026, 5:27 PM</p>
            </div>
          </div>

          <div className="bg-red-50/50 border border-red-100 p-4 rounded-2xl flex items-center gap-4 text-red-600">
             <div className="bg-red-100 p-1.5 rounded-lg"><AlertTriangle size={18} /></div>
             <p className="text-[11px] font-bold italic leading-tight">Error de conexión con el endpoint externo API 504 (Timeout)</p>
          </div>
        </div>

        <div className="p-6 bg-slate-50/50 border-t border-gray-100 flex gap-4">
          <Button className="flex-1 h-14 bg-[#ff6b00] hover:bg-[#e66000] text-white text-xs font-black uppercase rounded-2xl shadow-lg shadow-orange-100">
            Reproceso Manual
          </Button>
          <Button variant="outline" onClick={onClose} className="flex-1 h-14 border-[#1C1E59] text-[#1C1E59] text-xs font-black uppercase rounded-2xl hover:bg-white transition-all">
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// --- SUB-COMPONENTE: CONFIRMACIÓN REPROCESO ---
function ReprocessConfirmModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 rounded-[2.5rem] shadow-2xl z-[130] [&>button]:hidden">
        <div className="bg-[#FF6C01] p-10 flex flex-col items-center text-white relative">
          <button onClick={onClose} className="absolute right-6 top-6 text-white/60 hover:text-white transition-colors">
            <X size={20} strokeWidth={3} />
          </button>
          <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mb-6 border border-white/30 rotate-45">
            <div className="-rotate-45 text-white"><AlertTriangle size={32} /></div>
          </div>
          <h2 className="text-2xl font-black italic tracking-tighter uppercase mb-1 text-center">Confirmar Reproceso</h2>
        </div>
        <div className="p-10 bg-white text-center">
          <p className="text-[#1C1E59] font-black text-sm italic mb-10 uppercase tracking-tight text-center">¿Desea proceder con el envío manual a la API?</p>
          <div className="flex gap-4">
            <Button variant="ghost" onClick={onClose} className="flex-1 h-14 bg-gray-50 text-gray-400 font-black italic uppercase rounded-2xl text-[10px] hover:bg-gray-100">
              Cancelar
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

// --- COMPONENTE PRINCIPAL ---
interface AuditHistoryContentProps {
  locationId?: string | null;
}

export function AuditHistoryContent({ locationId }: AuditHistoryContentProps) {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [isReprocessOpen, setIsReprocessOpen] = useState(false);
  const [operationType, setOperationType] = useState<"creacion" | "actualizacion">("creacion");
  const [searchQuery, setSearchQuery] = useState("");

  // Datos extendidos para simular el filtrado por sede
  const auditData = useMemo(() => [
    { id: "DOC-1024", type: "PACKING LIST", status: "FAILED", auditor: "J.GARCIA", time: "26/01/2026, 17:27", operation: "creacion", loc: "loc-1" },
    { id: "DOC-1025", type: "ASN", status: "SUCCESS", auditor: "M.RODRIGUEZ", time: "26/01/2026, 16:27", operation: "creacion", loc: "loc-1" },
    { id: "DOC-2048", type: "WAYBILL", status: "SUCCESS", auditor: "A.MARTINEZ", time: "26/01/2026, 15:27", operation: "actualizacion", loc: "loc-2" },
    { id: "DOC-2049", type: "CUSTOMS", status: "FAILED", auditor: "L.PEREZ", time: "26/01/2026, 12:27", operation: "actualizacion", loc: "loc-3" },
  ], []);

  // Lógica de filtrado combinada (Sede + Tipo de Operación + Búsqueda)
  const filteredData = useMemo(() => {
    return auditData.filter(row => {
      const matchLoc = locationId ? row.loc === locationId : true;
      const matchOp = row.operation === operationType;
      const matchSearch = row.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          row.auditor.toLowerCase().includes(searchQuery.toLowerCase());
      return matchLoc && matchOp && matchSearch;
    });
  }, [auditData, locationId, operationType, searchQuery]);

  return (
    <div className="flex flex-col h-full space-y-6 animate-in fade-in duration-500">
      {/* Modales controlados internamente */}
      <LogAnalysisModal docId={selectedDoc || ""} onClose={() => setSelectedDoc(null)} />
      <ReprocessConfirmModal isOpen={isReprocessOpen} onClose={() => setIsReprocessOpen(false)} />

      {/* TOOLBAR */}
      <div className="flex items-center justify-between px-1">
        <div className="relative w-full max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-[#ff6b00] transition-colors" />
          <Input 
            placeholder="Buscar por ID o Auditor..." 
            className="bg-white border-none h-12 rounded-2xl w-full shadow-sm pl-12 text-sm font-medium focus-visible:ring-1 focus-visible:ring-orange-200" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-3">
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
                <div className="grid grid-cols-1 gap-4">
                   <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Fecha Inicial</label>
                      <Input type="date" className="h-11 rounded-xl border-gray-100 bg-gray-50/50 text-[10px] font-bold uppercase" />
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-gray-400 uppercase ml-1">Fecha Final</label>
                      <Input type="date" className="h-11 rounded-xl border-gray-100 bg-gray-50/50 text-[10px] font-bold uppercase" />
                   </div>
                </div>
                <Button className="w-full h-12 bg-[#1C1E59] hover:bg-[#0A0E3F] text-white text-[10px] font-black uppercase rounded-2xl shadow-xl transition-all">
                  Aplicar Filtros
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
                <TableCell colSpan={4} className="h-48 text-center text-gray-300 font-bold italic">
                   <div className="flex flex-col items-center gap-2 opacity-50">
                      <Search size={32} />
                      <span>No se encontraron registros para esta selección</span>
                   </div>
                </TableCell>
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
                      <button 
                        onClick={() => setSelectedDoc(row.id)} 
                        title="Ver Logs"
                        className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-300 hover:text-cyan-500 hover:border-cyan-100 transition-all bg-white shadow-sm"
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        title="Descargar Reporte"
                        className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center text-gray-300 hover:text-gray-600 transition-all bg-white shadow-sm"
                      >
                        <Download size={18} />
                      </button>
                      {row.status === "FAILED" && (
                        <button 
                          onClick={() => setIsReprocessOpen(true)} 
                          title="Reprocesar"
                          className="w-10 h-10 rounded-full border border-orange-100 flex items-center justify-center text-[#ff6b00] hover:bg-orange-50 transition-all bg-white shadow-sm"
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