"use client";

import { useState } from "react";
import dynamic from "next/dynamic"; 
import { LocationFilter, locationsData } from "@/components/dashboard/location-filter"; 
import { DockManager } from "@/components/dashboard/dock-manager";

// --- NUEVAS IMPORTACIONES ---
import MonitoringTables from "@/components/dashboard/MonitoringTables";
import ManagementTables from "@/components/dashboard/ManagementTables";

import { AuditHistoryContent } from "@/components/dashboard/audit";
import { RegisterManagerContent } from "@/components/dashboard/register-manager";
import { ReportsManagerContent } from "@/components/dashboard/reports";
import { UploadManagerContent } from "@/components/dashboard/upload-files";

const VehicleMap = dynamic(
  () => import('@/components/dashboard/VehicleMap'), 
  { 
    ssr: false,
    loading: () => <div className="h-full w-full bg-slate-100 animate-pulse" /> 
  }
);

export default function DashboardPage() {
  // Estado único de la verdad para la localidad
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  
  // Estado para la vista activa
  const [activeView, setActiveView] = useState<"muelles" | "monitoreo" | "gestion" | "auditoria" | "registros" | "mapa" | "reportes" | "carga">("muelles");

  // Estado para el sub-tipo de registro (entrada, salida, etc.)
  const [registerType, setRegisterType] = useState<string>("entrada");

  // Buscamos el nombre de la localidad para el mapa
  const selectedLocationName = locationsData.find(l => l.id === selectedLocationId)?.name || "SIN LOCALIDAD";

  const handleViewChange = (view: any, subView?: string) => {
    setActiveView(view);
    if (subView) {
      setRegisterType(subView); 
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      
       <LocationFilter 
        onFilterChange={setSelectedLocationId}
        onViewChange={handleViewChange}
        currentView={activeView}
        selectedLocationId={selectedLocationId}
      />

      <main className="flex-1 flex flex-col min-h-0 bg-slate-50 relative overflow-hidden">
        
        {/* VISTA 1: GESTOR DE MUELLES */}
        {activeView === "muelles" && (
          <div className="h-full animate-in fade-in duration-500">
            <DockManager 
              locationId={selectedLocationId} 
              onLocationChange={setSelectedLocationId} 
              selectedDockId={null} 
            />
          </div>
        )}

        {/* VISTA 2: MONITOREO (Usando el nuevo componente especializado) */}
        {activeView === "monitoreo" && (
          <div className="h-full p-4 animate-in fade-in zoom-in-95 duration-300">
            <MonitoringTables locationId={selectedLocationId} />
          </div>
        )}

        {/* VISTA 3: GESTIÓN (Usando el nuevo componente especializado) */}
        {activeView === "gestion" && (
          <div className="h-full p-4 animate-in fade-in zoom-in-95 duration-300">
            <ManagementTables locationId={selectedLocationId} />
          </div>
        )}

        {/* VISTA 4: AUDITORÍA */}
        {activeView === "auditoria" && (
          <div className="h-full p-6 animate-in fade-in duration-500 overflow-hidden">
             <AuditHistoryContent locationId={selectedLocationId} />
          </div>
        )}

        {/* VISTA 5: REGISTROS */}
       {activeView === "registros" && (
          <div className="h-full p-8 overflow-y-auto bg-slate-50">
             <RegisterManagerContent 
               locationId={selectedLocationId} 
               initialOption={registerType} 
               onClose={() => setActiveView("muelles")} 
             />
          </div>
        )}

        {/* VISTA 6: MAPA */}
        {activeView === "mapa" && (
          <div className="h-full w-full animate-in fade-in duration-500 bg-white">
             <VehicleMap locationName={selectedLocationName} />
          </div>
        )}

         {/* VISTA REPORTES */}
        {activeView === "reportes" && (
          <div className="h-full bg-slate-50 overflow-y-auto">
            <ReportsManagerContent />
          </div>
        )}

        {/* VISTA CARGA */}
        {activeView === "carga" && (
          <div className="h-full bg-slate-50 overflow-y-auto">
            <UploadManagerContent onSuccess={() => setActiveView("gestion")} />
          </div>
        )}

      </main>
    </div>
  );
}