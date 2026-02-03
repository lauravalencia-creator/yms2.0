"use client";

import React from "react";
import { Calendar as CalendarIcon, BarChart3 } from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FilterLabel = ({ children }: { children: React.ReactNode }) => (
  <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-1.5 block">
    {children}
  </label>
);

const InputWithIcon = ({ icon: Icon, ...props }: any) => (
  <div className="relative">
    <Input 
      {...props} 
      className="pr-10 h-11 rounded-xl border-gray-100 bg-slate-50/30 focus:bg-white focus:border-[#ff6b00] focus:ring-[#ff6b00]/10 text-xs font-bold text-[#1C1E59] w-full transition-all" 
    />
    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
      <Icon size={16} />
    </div>
  </div>
);

export function ReportsManagerContent() {
  return (
    // Se cambió items-center por items-start y se añadió pt-12 (padding top)
    <div className="flex-1 flex justify-center items-start pt-12 p-4 animate-in fade-in zoom-in-95 duration-500 h-full overflow-y-auto">
      <div className="w-full max-w-2xl bg-white p-8 rounded-[2rem] shadow-[0_15px_50px_rgba(0,0,0,0.04)] border border-slate-100 mb-10">
        
        {/* Header Compacto */}
        <div className="mb-6 text-center">
          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-3 border border-orange-100">
            <BarChart3 className="text-[#ff6b00]" size={24} />
          </div>
          <h3 className="text-xl font-black text-[#1C1E59] uppercase italic tracking-tighter">Reportes Logísticos</h3>
          <p className="text-gray-400 text-[11px] font-medium">Define los parámetros para filtrar los indicadores</p>
        </div>

        {/* Formulario */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FilterLabel>Fecha Inicial</FilterLabel>
              <InputWithIcon placeholder="DD/MM/AAAA" icon={CalendarIcon} />
            </div>
            <div>
              <FilterLabel>Fecha Final</FilterLabel>
              <InputWithIcon placeholder="DD/MM/AAAA" icon={CalendarIcon} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FilterLabel>Sede / Localidad</FilterLabel>
              <Input placeholder="Ej: CEDI Norte" className="h-11 rounded-xl border-gray-100 bg-slate-50/30 text-xs font-bold uppercase" />
            </div>
            <div>
              <FilterLabel>Proveedor</FilterLabel>
              <Input placeholder="Nombre de empresa" className="h-11 rounded-xl border-gray-100 bg-slate-50/30 text-xs font-bold uppercase" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FilterLabel>Estado Operativo</FilterLabel>
              <Select>
                <SelectTrigger className="w-full h-11 rounded-xl border-gray-100 bg-slate-50/30 text-xs font-bold uppercase">
                  <SelectValue placeholder="Cualquiera" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Cualquiera</SelectItem>
                  <SelectItem value="active">Completado</SelectItem>
                  <SelectItem value="inactive">En Proceso</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <FilterLabel>Código Interno</FilterLabel>
              <Input placeholder="ID Generado" className="h-11 rounded-xl border-gray-100 bg-slate-50/30 text-xs font-bold uppercase" />
            </div>
          </div>

          {/* Botón de acción */}
          <div className="flex justify-end pt-2">
            <Button className="bg-[#ff6b00] hover:bg-[#e66000] text-white font-black uppercase tracking-[0.15em] px-10 h-12 rounded-xl text-[10px] shadow-lg shadow-orange-200 border-none transition-all active:scale-95">
              Generar Reporte
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}