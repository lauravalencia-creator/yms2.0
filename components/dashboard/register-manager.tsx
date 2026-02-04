"use client";

import React, { useState, useEffect } from "react";
import { 
  X, ArrowRight, ArrowLeft, Package, Check, QrCode, 
  Plus, Hash, Calendar as CalendarIcon, Truck, Building2, 
  RefreshCw, CheckCircle2, AlertCircle, ShoppingCart, Archive, RotateCcw
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

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
  const [registroId, setRegistroId] = useState(initialOption || "entrada");
  
  // AHORA: Tanto entrada como salida activan el formulario completo
  const esProcesoCompleto = registroId === "entrada" || registroId === "salida";

  const [vehicleState, setVehicleState] = useState<"cargado" | "vacio" | "devuelto" | null>(null);
  const [returnReason, setReturnReason] = useState("");
  const [step, setStep] = useState<'form' | 'scanner' | 'result' | 'tracking-scanner' | 'process-details'>('form');
  const [codigo, setCodigo] = useState("");
  const [trackingCodes, setTrackingCodes] = useState<string[]>([]);
  const [newTrackingInput, setNewTrackingInput] = useState("");

  useEffect(() => {
    if (initialOption) {
      setRegistroId(initialOption);
      setStep('form');
      setCodigo("");
      setVehicleState(null);
      setReturnReason("");
    }
  }, [initialOption]);

  // Simulación de escáner
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'scanner' || step === 'tracking-scanner') {
      timer = setTimeout(() => {
        if (step === 'scanner') {
          setCodigo("QR-8821-AUTO");
          setTrackingCodes(["PKG-7721", "PKG-9902"]);
          if (esProcesoCompleto) setStep('process-details');
          else setStep('result');
        } else {
          const newCode = `PKG-${Math.floor(Math.random() * 9000) + 1000}`;
          setTrackingCodes(prev => [...prev, newCode]);
          setStep('result');
        }
      }, 2200);
    }
    return () => clearTimeout(timer);
  }, [step, esProcesoCompleto]);

  const handleSubmitManual = () => {
    if (codigo) setStep('result');
  };

  const isButtonDisabled = () => {
    if (!codigo) return true;
    if (esProcesoCompleto) {
      if (!vehicleState) return true;
      if (vehicleState === "devuelto" && returnReason.trim().length < 5) return true;
    }
    return false;
  };

  // --- COMPONENTE: SELECTOR DE ESTADO (Dinámico según entrada/salida) ---
  const VehicleStateSelector = () => (
    <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center block">
        Estado del Vehículo al {registroId === 'entrada' ? 'Ingresar' : 'Salir'}
      </label>
      <div className="grid grid-cols-3 gap-3">
        {[
          { id: 'cargado', label: 'Cargado', icon: ShoppingCart },
          { id: 'vacio', label: 'Vacío', icon: Archive },
          { id: 'devuelto', label: 'Devuelto', icon: RotateCcw },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setVehicleState(item.id as any)}
            className={cn(
              "flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all gap-1.5",
              vehicleState === item.id 
                ? "bg-[#050038] border-[#050038] text-white shadow-md scale-105" 
                : "bg-white border-slate-100 text-slate-400 hover:border-slate-200"
            )}
          >
            <item.icon size={18} strokeWidth={vehicleState === item.id ? 3 : 2} />
            <span className="text-[8px] font-black uppercase tracking-tighter">{item.label}</span>
          </button>
        ))}
      </div>

      {vehicleState === 'devuelto' && (
        <div className="space-y-2 animate-in fade-in duration-300">
          <div className="flex items-center gap-2 text-rose-500 mb-1">
            <AlertCircle size={14} />
            <span className="text-[9px] font-black uppercase tracking-widest">Motivo de Devolución Obligatorio</span>
          </div>
          <textarea
            value={returnReason}
            onChange={(e) => setReturnReason(e.target.value)}
            placeholder="Escriba el motivo..."
            className="w-full h-20 p-3 rounded-xl border-2 border-rose-100 bg-rose-50/20 text-xs font-bold focus:outline-none focus:border-rose-300 transition-all resize-none uppercase"
          />
        </div>
      )}
    </div>
  );

  // --- VISTA 1: FORMULARIO ---
  if (step === 'form') {
    const opcion = REGISTRO_OPCIONES.find((opt) => opt.id === registroId) || REGISTRO_OPCIONES[0];
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] py-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="mb-6 p-4 bg-white rounded-2xl shadow-lg border border-slate-100 text-[#4CCAC8]">
           <opcion.icon size={32} strokeWidth={3} />
        </div>
        <h2 className="text-[#050038] font-black text-2xl uppercase tracking-tighter mb-6 text-center">
          {opcion.label}
        </h2>

        <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-xl p-8 border border-slate-50 flex flex-col gap-6">
           <div className="space-y-2">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1 text-center block">Número de Cita / Código</label>
              <Input 
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="ESCRIBIR AQUÍ..." 
                className="h-12 rounded-xl border-2 border-slate-100 bg-slate-50/50 text-center text-lg font-black text-[#050038] focus-visible:border-[#ff6b00] focus-visible:ring-0 transition-all uppercase"
                onKeyDown={(e) => e.key === 'Enter' && !isButtonDisabled() && handleSubmitManual()}
              />
           </div>

           {esProcesoCompleto && <VehicleStateSelector />}

           <Button 
            onClick={handleSubmitManual} 
            disabled={isButtonDisabled()} 
            className={cn(
                "h-14 rounded-xl font-black uppercase text-[10px] tracking-[0.2em] transition-all", 
                !isButtonDisabled() ? "bg-[#ff6b00] text-white shadow-lg hover:bg-[#e66000]" : "bg-slate-100 text-slate-300"
            )}
           >
             Confirmar Registro
           </Button>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">O utiliza el escáner de alta precisión</p>
           <Button 
            variant="outline" 
            onClick={() => setStep('scanner')} 
            className="h-11 px-8 rounded-full border-orange-100 bg-white text-[#ff6b00] hover:bg-[#ff6b00] hover:text-white font-black text-[10px] uppercase tracking-widest gap-3 shadow-sm transition-all"
           >
             <QrCode size={18} /> Iniciar Lector QR
           </Button>
        </div>
      </div>
    );
  }

  // --- VISTA: DETALLES DE PROCESO (POST-ESCANEO PARA ENTRADA/SALIDA) ---
  if (step === 'process-details') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] py-4 animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-xl p-8 border border-slate-50 flex flex-col gap-6 text-center">
           <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center mx-auto text-[#ff6b00]">
             <QrCode size={24} />
           </div>
           <div>
             <h3 className="text-[#050038] font-black text-xl uppercase tracking-tighter">Cita detectada: {codigo}</h3>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
               Complete la información de {registroId === 'entrada' ? 'entrada' : 'salida'}
             </p>
           </div>
           
           <VehicleStateSelector />

           <Button 
            onClick={() => setStep('result')} 
            disabled={!vehicleState || (vehicleState === "devuelto" && returnReason.trim().length < 5)} 
            className="h-14 rounded-xl bg-[#ff6b00] text-white font-black uppercase text-[10px] tracking-[0.2em] shadow-lg"
           >
             Finalizar Registro de {registroId === 'entrada' ? 'Entrada' : 'Salida'}
           </Button>
        </div>
      </div>
    );
  }

  // --- VISTA 2: ESCÁNER ---
  if (step === 'scanner' || step === 'tracking-scanner') {
    return (
      <div className="fixed inset-0 bg-[#050038] flex flex-col items-center justify-center z-[200] p-6 overflow-hidden">
        <style>{`
          @keyframes scanMove { 0% { top: 5%; opacity: 0.2; } 50% { opacity: 1; } 100% { top: 95%; opacity: 0.2; } }
          .scan-line { position: absolute; left: 0; width: 100%; height: 4px; background: #ff6b00; box-shadow: 0 0 30px 6px #ff6b00; animation: scanMove 2.5s ease-in-out infinite; z-index: 20; }
        `}</style>
        <div className="text-center mb-10 space-y-2 relative z-10">
   
            <h3 className="text-white font-black text-2xl uppercase tracking-tighter animate-pulse">
                Leyendo {step === 'scanner' ? 'Documento Principal' : 'Guía de Paquete'}...
            </h3>
        </div>
        <div className="relative w-64 h-64 bg-black/30 rounded-[3rem] border-2 border-white/10 flex items-center justify-center overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]">
            <div className="absolute top-8 left-8 w-12 h-12 border-t-[6px] border-l-[6px] border-[#ff6b00] rounded-tl-3xl z-30" />
            <div className="absolute top-8 right-8 w-12 h-12 border-t-[6px] border-r-[6px] border-[#ff6b00] rounded-tr-3xl z-30" />
            <div className="absolute bottom-8 left-8 w-12 h-12 border-b-[6px] border-l-[6px] border-[#ff6b00] rounded-bl-3xl z-30" />
            <div className="absolute bottom-8 right-8 w-12 h-12 border-b-[6px] border-r-[6px] border-[#ff6b00] rounded-br-3xl z-30" />
            <div className="scan-line" />
            <QrCode size={100} className="text-white/5 relative z-10" />
        </div>
        <Button variant="ghost" onClick={() => setStep('form')} className="mt-16 text-red-400 font-black uppercase text-[10px] tracking-[0.3em] border border-red-400/20 px-8 h-10 rounded-full">
            Cancelar
        </Button>
      </div>
    );
  }

  // --- VISTA 3: RESULTADOS ---
  const opcionActiva = REGISTRO_OPCIONES.find((opt) => opt.id === registroId) || REGISTRO_OPCIONES[0];
  
  // Datos para Proceso Completo (Entrada/Salida)
  const infoDetallada = [
    { label: "ID Cita", val: codigo || "QR-8821-AUTO" },
    { label: "Fecha Cita", val: "29 ENE 2026" },
    { label: "Hora Cita", val: "14:00:00" },
    { label: "Ciudad", val: "Bogotá D.C." },
    { label: "Departamento", val: "Cundinamarca" },
    { label: "Localidad", val: "Fontibón" },
    { label: "Zona Localidad", val: "Zona Franca" },
    { label: "Punto Acceso", val: "Patio A-12" },
    { label: "Tipo Operación", val: opcionActiva.label },
    { label: "Empresa Transp.", val: "TransLogistics S.A." },
    { label: "Conductor", val: "Juan Pérez" },
    { label: "ID Conductor", val: "1.023.456.789" },
    { label: "Vehículo", val: "Scania R450" },
    { label: "Placa", val: "JPL-092" },
    { label: "Tipo Carga", val: vehicleState === 'vacio' ? "Vacío" : "Carga General" },
    { label: registroId === 'entrada' ? "Hora Entrada" : "Hora Salida", val: "16:45:12" },
    { label: "Muelle Asignado", val: "Muelle 04" },
    { label: "Estado", val: vehicleState?.toUpperCase() || "N/A" },
    { label: "Observaciones", val: returnReason || "Sin novedades", fullWidth: true },
  ];

  const infoBasica = [
    { label: "Código Detectado", val: codigo || "AUTO-SCAN" },
    { label: "Marca de Tiempo", val: "29 ENE 2026 - 16:45:12" },
    { label: "Unidad Vehicular", val: "SCANIA R450 - [JPL-092]" },
    { label: "Punto de Acceso", val: "ZONA DE PATIO A-12" },
  ];

  return (
    <div className="max-w-4xl mx-auto py-6 space-y-6 animate-in slide-in-from-bottom-8 duration-700">
        {/* ENCABEZADO DE ÉXITO */}
        <div className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 border-2 border-emerald-100 shadow-inner">
                <Check className="text-emerald-500" size={32} strokeWidth={3} />
            </div>
            <h3 className="font-black text-xl text-[#1C1E59] uppercase tracking-tight leading-none">
                {opcionActiva.label} exitoso
            </h3>
            <div className="mt-3 flex gap-2">
                <Badge className="bg-slate-100 text-slate-500 border-none font-bold uppercase text-[8px] px-3">Sede: {locationId || "Principal"}</Badge>
                {vehicleState && (
                   <Badge className={cn("border-none font-black uppercase text-[8px] px-3", vehicleState === 'devuelto' ? "bg-rose-500 text-white" : "bg-emerald-500 text-white")}>
                     Vehículo: {vehicleState}
                   </Badge>
                )}
            </div>
        </div>

        {/* CONTENEDOR DE INFORMACIÓN */}
        
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-lg p-8 space-y-6">
                 <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                    <Truck size={18} className="text-[#1C1E59]" />
                    <span className="font-black text-[#1C1E59] text-xs uppercase tracking-widest">Detalle Completo de Operación</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-6">
                    {infoDetallada.map((item, i) => (
                        <div key={i} className={cn("flex flex-col gap-1", item.fullWidth && "col-span-2 md:col-span-3")}>
                            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{item.label}</span>
                            <span className="text-xs font-black text-[#1C1E59] break-words uppercase">{item.val}</span>
                        </div>
                    ))}
                </div>
            </div>
        
        

        {/* TRACKING */}
        <div className="bg-white rounded-[2rem] border border-orange-100 shadow-lg p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-orange-50 pb-3">
                <div className="flex items-center gap-3">
                    <Package size={16} className="text-[#ff6b00]" />
                    <span className="font-black text-[#ff6b00] text-[10px] uppercase tracking-widest">Códigos de Seguimiento Asociados</span>
                </div>
                <Badge className="bg-orange-500 text-white font-mono text-[10px]">{trackingCodes.length}</Badge>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex gap-2 w-full md:w-1/3">
                    <div className="relative flex-1">
                        <Input 
                            placeholder="Escribir ID..." 
                            value={newTrackingInput}
                            onChange={(e) => setNewTrackingInput(e.target.value)}
                            className="h-10 rounded-xl bg-slate-50 border-none text-xs font-bold pr-10 focus-visible:ring-1 focus-visible:ring-orange-200"
                        />
                        <button 
                            onClick={() => setStep('tracking-scanner')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center bg-orange-100 text-[#ff6b00] rounded-lg"
                        >
                            <QrCode size={14} strokeWidth={2.5} />
                        </button>
                    </div>
                    <Button 
                        onClick={() => { if(newTrackingInput) setTrackingCodes([...trackingCodes, newTrackingInput.toUpperCase()]); setNewTrackingInput(""); }} 
                        className="bg-[#1C1E59] h-10 w-10 rounded-xl"
                    >
                        <Plus size={16} strokeWidth={3}/>
                    </Button>
                </div>

                <div className="flex flex-wrap gap-2 w-full md:w-2/3 content-start">
                    {trackingCodes.length > 0 ? trackingCodes.map((c, i) => (
                        <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-100 pl-3 pr-2 py-1 rounded-lg">
                            <span className="text-[9px] font-black text-[#1C1E59] font-mono">{c}</span>
                            <button onClick={() => setTrackingCodes(p => p.filter((_, idx) => idx !== i))} className="text-slate-300 hover:text-red-500 transition-colors">
                                <X size={10} />
                            </button>
                        </div>
                    )) : (
                        <span className="text-[10px] text-slate-300 italic self-center">No hay códigos registrados</span>
                    )}
                </div>
            </div>
        </div>

        {/* BOTONES DE ACCIÓN */}
        <div className="flex gap-4 pt-4 max-w-md mx-auto">
            <Button 
                onClick={() => { setStep('form'); setCodigo(""); setTrackingCodes([]); setVehicleState(null); setReturnReason(""); }} 
                className="flex-1 h-12 bg-slate-100 hover:bg-slate-200 text-[#1C1E59] font-black rounded-2xl gap-2 text-[10px] tracking-widest transition-all"
            >
                <RefreshCw size={14} /> NUEVA OPERACIÓN
            </Button>
            <Button 
                onClick={onClose} 
                className="flex-1 h-12 bg-[#ff6b00] hover:bg-[#e66000] text-white font-black rounded-2xl gap-2 text-[10px] tracking-widest shadow-lg transition-all"
            >
                <CheckCircle2 size={14} /> FINALIZAR
            </Button>
        </div>
    </div>
  );
}