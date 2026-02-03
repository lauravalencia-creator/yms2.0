"use client";

import React, { useState, useEffect } from "react";
import { 
  X, ArrowRight, ArrowLeft, Package, Check, QrCode, 
  Plus, Hash, Calendar as CalendarIcon, Truck, Building2, 
  RefreshCw, CheckCircle2 
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// --- CONFIGURACIÓN DE OPCIONES ---
export const REGISTRO_OPCIONES = [
  { id: "entrada", label: "Registro de entrada", icon: ArrowRight },
  { id: "salida", label: "Registro de salida", icon: ArrowLeft },
  { id: "ini-descargue", label: "Inicio de Descargue", icon: Package },
  { id: "fin-descargue", label: "Fin de Descargue", icon: Check },
  { id: "ini-cargue", label: "Inicio de Cargue", icon: Package },
  { id: "fin-cargue", label: "Fin de Cargue", icon: Check },
];

interface RegisterManagerProps {
  locationId?: string | null;
  initialOption?: string | null;
  onClose?: () => void;
}

export function RegisterManagerContent({ locationId, initialOption, onClose }: RegisterManagerProps) {
  // Sincronizar el estado interno con la selección del Navbar
  const [registroId, setRegistroId] = useState(initialOption || "entrada");
  
  useEffect(() => {
    if (initialOption) {
      setRegistroId(initialOption);
      setStep('form'); // Reiniciamos el flujo al cambiar de tipo de registro
      setCodigo("");
    }
  }, [initialOption]);

  const opcion = REGISTRO_OPCIONES.find((opt) => opt.id === registroId) || REGISTRO_OPCIONES[0];
  
  const [step, setStep] = useState<'form' | 'scanner' | 'result' | 'tracking-scanner'>('form');
  const [codigo, setCodigo] = useState("");
  const [trackingCodes, setTrackingCodes] = useState<string[]>([]);
  const [newTrackingInput, setNewTrackingInput] = useState("");

  // Animación y lógica del escáner (Hardware simulation)
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'scanner' || step === 'tracking-scanner') {
      timer = setTimeout(() => {
        if (step === 'scanner') {
          setCodigo("QR-8821-AUTO"); 
          setTrackingCodes(["PKG-7721", "PKG-9902"]);
          setStep('result');
        } else {
          const newCode = `PKG-${Math.floor(Math.random() * 9000) + 1000}`;
          setTrackingCodes(prev => [...prev, newCode]);
          setStep('result');
        }
      }, 2500);
    }
    return () => clearTimeout(timer);
  }, [step]);

  const handleSubmitManual = () => {
    if (codigo) setStep('result');
  };

  // --- VISTA 1: FORMULARIO ---
  if (step === 'form') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] animate-in fade-in zoom-in-95 duration-300">
        <div className="mb-8 p-5 bg-white rounded-[2rem] shadow-xl border border-slate-100 text-[#4CCAC8]">
           <opcion.icon size={40} strokeWidth={3} />
        </div>
        <h2 className="text-[#050038] font-black text-3xl uppercase tracking-tighter mb-10 text-center italic">
          {opcion.label}
        </h2>
        <div className="bg-white w-full max-w-md rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] p-12 border border-slate-50 flex flex-col gap-8">
           <div className="space-y-3">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] ml-1 text-center block">Número de Cita / Código de Barra</label>
              <Input 
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="ESCRIBIR AQUÍ..." 
                className="h-16 rounded-2xl border-2 border-slate-100 bg-slate-50/50 text-center text-xl font-black text-[#050038] focus-visible:border-[#ff6b00] focus-visible:ring-0 transition-all uppercase"
                onKeyDown={(e) => e.key === 'Enter' && handleSubmitManual()}
              />
           </div>
           <Button 
            onClick={handleSubmitManual} 
            disabled={!codigo} 
            className={cn(
                "h-16 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all", 
                codigo ? "bg-[#050038] text-white shadow-2xl hover:bg-[#1C1E59]" : "bg-slate-100 text-slate-300"
            )}
           >
             Validar Registro
           </Button>
        </div>
        <div className="mt-16 flex flex-col items-center gap-5">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">O utiliza el escáner de alta precisión</p>
           <Button 
            variant="outline" 
            onClick={() => setStep('scanner')} 
            className="h-14 px-10 rounded-full border-orange-100 bg-white text-[#ff6b00] hover:bg-[#ff6b00] hover:text-white font-black text-xs uppercase tracking-widest gap-4 shadow-lg transition-all active:scale-95"
           >
             <QrCode size={20} /> Iniciar Lector QR
           </Button>
        </div>
      </div>
    );
  }

  // --- VISTA 2: ESCÁNER (CON ANIMACIÓN) ---
  if (step === 'scanner' || step === 'tracking-scanner') {
    return (
      <div className="fixed inset-0 bg-[#050038] flex flex-col items-center justify-center z-[200] p-6 overflow-hidden">
        {/* CSS Inyectado para la animación de la línea */}
        <style>{`
          @keyframes scanMove {
            0% { top: 5%; opacity: 0.2; }
            50% { opacity: 1; }
            100% { top: 95%; opacity: 0.2; }
          }
          .scan-line {
            position: absolute;
            left: 0;
            width: 100%;
            height: 4px;
            background: #ff6b00;
            box-shadow: 0 0 30px 6px #ff6b00;
            animation: scanMove 2.5s ease-in-out infinite;
            z-index: 20;
          }
        `}</style>

        <div className="text-center mb-16 space-y-3 relative z-10">
            <h3 className="text-white font-black text-3xl uppercase italic tracking-tighter">Hardware de Patio Activo</h3>
            <p className="text-cyan-400 text-[11px] font-black uppercase tracking-[0.4em] animate-pulse">
                Leyendo {step === 'scanner' ? 'Documento Principal' : 'Guía de Paquete'}...
            </p>
        </div>

        <div className="relative w-80 h-80 bg-black/30 rounded-[4rem] border-2 border-white/10 flex items-center justify-center overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]">
            {/* Esquinas de enfoque */}
            <div className="absolute top-10 left-10 w-14 h-14 border-t-[8px] border-l-[8px] border-[#ff6b00] rounded-tl-3xl z-30" />
            <div className="absolute top-10 right-10 w-14 h-14 border-t-[8px] border-r-[8px] border-[#ff6b00] rounded-tr-3xl z-30" />
            <div className="absolute bottom-10 left-10 w-14 h-14 border-b-[8px] border-l-[8px] border-[#ff6b00] rounded-bl-3xl z-30" />
            <div className="absolute bottom-10 right-10 w-14 h-14 border-b-[8px] border-r-[8px] border-[#ff6b00] rounded-br-3xl z-30" />
            
            {/* LÍNEA ANIMADA */}
            <div className="scan-line" />
            
            <QrCode size={120} className="text-white/5 relative z-10" />
        </div>

        <Button 
            variant="ghost" 
            onClick={() => setStep('form')} 
            className="mt-20 text-red-400 hover:text-red-300 hover:bg-white/5 font-black uppercase text-xs tracking-[0.3em] border border-red-400/20 px-8 h-12 rounded-full"
        >
            Abortar Operación
        </Button>
      </div>
    );
  }

  // --- VISTA 3: RESULTADOS ---
  return (
    <div className="max-w-5xl mx-auto py-10 space-y-8 animate-in slide-in-from-bottom-8 duration-700">
        {/* Banner de Éxito */}
        <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border-2 border-emerald-100 shadow-inner">
                <Check className="text-emerald-500" size={40} strokeWidth={3} />
            </div>
            <h3 className="font-black text-2xl text-[#1C1E59] uppercase italic tracking-tight leading-none">
                {opcion.label} exitoso
            </h3>
            <div className="mt-4 flex gap-2">
                <Badge className="bg-slate-100 text-slate-500 border-none font-bold uppercase text-[9px] px-3">Sede: {locationId || "Principal"}</Badge>
                <Badge className="bg-orange-50 text-[#ff6b00] border-none font-bold uppercase text-[9px] px-3">Modo: Operativo</Badge>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card Izquierda: Metadata */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-8 space-y-6">
                <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                    <div className="w-8 h-8 rounded-lg bg-[#1C1E59] flex items-center justify-center text-white"><Hash size={16}/></div>
                    <span className="font-black text-[#1C1E59] text-xs uppercase italic tracking-widest">Información del Registro</span>
                </div>
                <div className="space-y-4">
                    {[
                        { label: "Código Detectado", val: codigo || "AUTO-SCAN" },
                        { label: "Marca de Tiempo", val: "29 ENE 2026 - 16:45:12" },
                        { label: "Unidad Vehicular", val: "SCANIA R450 - [JPL-092]" },
                        { label: "Punto de Acceso", val: "ZONA DE PATIO A-12" }
                    ].map((row, i) => (
                        <div key={i} className="flex justify-between items-center group">
                            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{row.label}</span>
                            <span className="text-[#1C1E59] font-black text-sm">{row.val}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Card Derecha: Guías con Botón Escáner */}
            <div className="bg-white rounded-[2.5rem] border border-orange-100 shadow-xl p-8 space-y-6">
                <div className="flex items-center justify-between border-b border-orange-50 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#ff6b00] flex items-center justify-center text-white"><Package size={16}/></div>
                        <span className="font-black text-[#ff6b00] text-xs uppercase italic tracking-widest">Códigos de Seguimiento</span>
                    </div>
                    <Badge className="bg-orange-500 text-white font-mono">{trackingCodes.length}</Badge>
                </div>

                <div className="flex gap-3">
                    <div className="relative flex-1">
                        <Input 
                            placeholder="Escribir ID..." 
                            value={newTrackingInput}
                            onChange={(e) => setNewTrackingInput(e.target.value)}
                            className="h-12 rounded-xl bg-slate-50 border-none text-xs font-bold pr-12 focus-visible:ring-1 focus-visible:ring-orange-200"
                        />
                        {/* BOTÓN ESCÁNER RESTAURADO */}
                        <button 
                            onClick={() => setStep('tracking-scanner')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center bg-orange-100 text-[#ff6b00] hover:bg-orange-200 rounded-lg transition-colors"
                            title="Escanear paquete"
                        >
                            <QrCode size={18} strokeWidth={2.5} />
                        </button>
                    </div>
                    <Button 
                        onClick={() => { if(newTrackingInput) setTrackingCodes([...trackingCodes, newTrackingInput.toUpperCase()]); setNewTrackingInput(""); }} 
                        className="bg-[#1C1E59] hover:bg-[#050038] h-12 w-12 rounded-xl shadow-lg shadow-blue-900/20"
                    >
                        <Plus size={20} strokeWidth={3}/>
                    </Button>
                </div>

                <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1 custom-scrollbar">
                    {trackingCodes.length === 0 ? (
                        <p className="text-slate-300 text-[10px] font-bold uppercase italic text-center w-full py-4">No hay códigos de seguimiento vinculados</p>
                    ) : (
                        trackingCodes.map((c, i) => (
                            <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-100 pl-3 pr-2 py-1.5 rounded-lg group hover:border-orange-200 transition-colors">
                                <span className="text-[10px] font-black text-[#1C1E59] font-mono">{c}</span>
                                <button onClick={() => setTrackingCodes(p => p.filter((_, idx) => idx !== i))} className="text-slate-300 hover:text-red-500 transition-colors">
                                    <X size={12} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>

        {/* Footer Actions */}
        <div className="flex gap-5 pt-6 max-w-2xl mx-auto">
            <Button 
                onClick={() => { setStep('form'); setCodigo(""); setTrackingCodes([]); }} 
                className="flex-1 h-16 bg-slate-100 hover:bg-slate-200 text-[#1C1E59] font-black rounded-3xl gap-3 text-xs tracking-widest shadow-inner transition-all"
            >
                <RefreshCw size={18} /> NUEVA OPERACIÓN
            </Button>
            <Button 
                onClick={onClose} 
                className="flex-1 h-16 bg-[#ff6b00] hover:bg-[#e66000] text-white font-black rounded-3xl gap-3 text-xs tracking-widest shadow-2xl shadow-orange-900/20 transition-all active:scale-95"
            >
                <CheckCircle2 size={18} /> FINALIZAR SESIÓN
            </Button>
        </div>
    </div>
  );
}