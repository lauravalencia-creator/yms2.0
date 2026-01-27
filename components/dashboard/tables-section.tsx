"use client";

import React, { useState, useMemo } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
  RefreshCcw,
  Filter,
  Maximize2,
  Monitor,
  CalendarDays,
  PlusIcon,
  FileText,
  CheckSquare,
  History,
  AlertOctagon,
  Truck,
  Package,
  CalendarRange
} from "lucide-react";

/* ---------------- PROPS & MOCK DATA ---------------- */
interface TablesSectionProps {
  locationId: string | null;
  dockGroupId: string | null;
}

const appointmentsData = [
  { id: "APT-001", carrier: "Swift Transport", driver: "Juan Perez", truckId: "TRK-4521", dock: "Muelle A-01", scheduledTime: "08:30", type: "inbound", status: "in-progress", locationId: "loc-1" },
  { id: "APT-002", carrier: "LogiCargo", driver: "Maria Lopez", truckId: "TRK-1193", dock: "Muelle B-01", scheduledTime: "09:15", type: "inbound", status: "delayed", locationId: "loc-1" },
  { id: "APT-003", carrier: "FastFreight", driver: "Carlos Rodriguez", truckId: "TRK-7832", dock: "Despacho 01", scheduledTime: "09:00", type: "outbound", status: "in-progress", locationId: "loc-1" },
];

const carriersData = [
  { id: "CAR-001", name: "Swift Transport", contact: "contact@swift.com", rating: 4.8, status: "active" },
  { id: "CAR-002", name: "FastFreight", contact: "ops@fastfreight.com", rating: 4.5, status: "active" },
];

const inventoryData = [
  { id: "INV-001", sku: "SKU-78451", product: "Electronics Components", quantity: 1250, location: "Zone A", status: "in-stock" },
  { id: "INV-002", sku: "SKU-23897", product: "Industrial Parts", quantity: 450, location: "Zone B", status: "low-stock" },
];

/* ---------------- HELPERS ---------------- */
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "in-progress": "bg-cyan-100 text-cyan-800 hover:bg-cyan-100",
    delayed: "bg-orange-100 text-orange-800 hover:bg-orange-100",
    active: "bg-green-100 text-green-800 hover:bg-green-100",
    "in-stock": "bg-blue-100 text-blue-800 hover:bg-blue-100",
    "low-stock": "bg-red-100 text-red-800 hover:bg-red-100",
  };

  return (
    <Badge className={cn("text-xs capitalize shadow-none font-normal", styles[status] || "bg-slate-200")}>
      {status.replace("-", " ")}
    </Badge>
  );
}

/* ---------------- COMPONENT ---------------- */
export function TablesSection({ locationId }: TablesSectionProps) {
  const [section, setSection] = useState<"monitoreo" | "gestion">("monitoreo");
  const [monitoreoView, setMonitoreoView] = useState("appointments");
  const [gestionView, setGestionView] = useState("solicitudes");

  const appointments = useMemo(
    () => appointmentsData.filter(a => a.locationId === locationId),
    [locationId]
  );

  // Configuración de las Tabs de Monitoreo para coincidir con la imagen
  const monitoringTabs = [
    { 
        id: "appointments", 
        label: "Consulta de citas", 
        icon: CalendarRange, 
        count: 0, 
        // Estilos específicos para cuando NO está activo (el activo se maneja general)
        badgeInactive: "bg-slate-200 text-slate-600",
        badgeActive: "bg-white/10 text-orange-500" // El "0" naranja oscuro sobre fondo oscuro
    },
    { 
        id: "carriers", 
        label: "Torre de Control", 
        icon: Truck, 
        count: 5, 
        badgeInactive: "bg-cyan-100 text-cyan-700",
        badgeActive: "bg-white/20 text-white"
    },
    { 
        id: "inventory", 
        label: "Editar Información", 
        icon: Package, 
        count: 5, 
        badgeInactive: "bg-indigo-100 text-indigo-700",
        badgeActive: "bg-white/20 text-white"
    }
  ];

  return (
    <div className="h-full w-full flex flex-col bg-white border-t overflow-hidden font-sans">
      
      {/* CONTROLADOR PRINCIPAL */}
      <Tabs 
        value={section} 
        onValueChange={(v) => setSection(v as any)} 
        className="flex-1 flex flex-col min-h-0"
      >
        
        {/* BARRA DE HERRAMIENTAS (Header) */}
        <div className="px-4 py-3 border-b flex items-center justify-between bg-white shrink-0 gap-4">
            
            {/* IZQUIERDA: Selector de Vistas y Tabs */}
            <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
                
                {/* 1. Switcher Iconos (Monitoreo vs Gestión) */}
                <TabsList className="h-10 bg-slate-100 p-1 rounded-lg shrink-0">
                    <TabsTrigger value="monitoreo" className="h-8 w-9 px-0 data-[state=active]:bg-white data-[state=active]:text-blue-900 data-[state=active]:shadow-sm transition-all">
                        <Monitor className="w-4 h-4" />
                    </TabsTrigger>
                    <TabsTrigger value="gestion" className="h-8 w-9 px-0 data-[state=active]:bg-white data-[state=active]:text-blue-900 data-[state=active]:shadow-sm transition-all">
                        <CalendarDays className="w-4 h-4" />
                    </TabsTrigger>
                </TabsList>

                {/* Divisor Vertical */}
                <div className="h-6 w-px bg-slate-200 shrink-0" />

                {/* 2. Sub-tabs Estilo "Pill" (Como la imagen) */}
                {section === "monitoreo" && (
                    <div className="flex items-center bg-slate-100/80 p-1 rounded-xl gap-1">
                        {monitoringTabs.map(tab => {
                            const isActive = monitoreoView === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setMonitoreoView(tab.id)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 border border-transparent",
                                        isActive 
                                            ? "bg-[#1e204d] text-white shadow-md" // Azul oscuro intenso
                                            : "text-slate-600 hover:bg-white hover:shadow-sm"
                                    )}
                                >
                                    <tab.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-500")} />
                                    <span>{tab.label}</span>
                                    
                                    {/* Badge/Contador */}
                                    <span className={cn(
                                        "ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold",
                                        isActive ? tab.badgeActive : tab.badgeInactive
                                    )}>
                                        {tab.count}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {section === "gestion" && (
                     <div className="flex gap-2">
                        {[
                            { id: "solicitudes", label: "Solicitud de Citas", icon: FileText },
                            { id: "programadas", label: "Confirmación", icon: CheckSquare },
                            { id: "ingresos", label: "Cancelación", icon: RefreshCcw },
                            { id: "reagendamiento de Citas", label: "Reagendar Citar", icon: CheckSquare },
                            { id: "Recurrencia de Citas", label: "Recurrencia de Citas", icon: RefreshCcw },
                        ].map(tab => {
                            const isActive = gestionView === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setGestionView(tab.id)}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-full border transition-all",
                                        isActive 
                                            ? "bg-slate-800 text-white border-slate-800" 
                                            : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                                    )}
                                >
                                    <tab.icon className="w-3.5 h-3.5" />
                                    {tab.label}
                                </button>
                            )
                        })}
                     </div>
                )}
            </div>

            {/* DERECHA: Botones de Acción (Estilo Imagen) */}
            <div className="flex items-center gap-3 shrink-0 ml-auto">
                <Button 
                    className="gap-2 bg-[#FF6B00] hover:bg-[#e65c00] text-white rounded-xl px-5 font-semibold shadow-sm border-0"
                >
                    <PlusIcon className="w-5 h-5" /> 
                    New Entry
                </Button>
                
                {/* Grupo de Botones de Icono Circulares/Cuadrados redondeados */}
                <div className="flex items-center gap-2 border-l pl-3 ml-1">
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                        <Download className="w-5 h-5"/>
                    </Button>
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                        <RefreshCcw className="w-5 h-5"/>
                    </Button>
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                        <Filter className="w-5 h-5"/>
                    </Button>
                    <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                        <Maximize2 className="w-5 h-5"/>
                    </Button>
                </div>
            </div>
        </div>

        {/* 3. ÁREA DE CONTENIDO */}
        <div className="flex-1 overflow-hidden bg-slate-50/50 relative">
            
            <TabsContent value="monitoreo" className="h-full m-0 p-0 overflow-auto">
              {monitoreoView === "appointments" && (
                <Table>
                  <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                    <TableRow className="hover:bg-transparent border-b-slate-200">
                      <TableHead className="w-[100px]">ID Cita</TableHead>
                      <TableHead>Horario</TableHead>
                      <TableHead>Transportista</TableHead>
                      <TableHead>Conductor / Camión</TableHead>
                      <TableHead>Muelle</TableHead>
                      <TableHead className="text-right">Estado</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map(a => (
                      <TableRow key={a.id} className="hover:bg-blue-50/50 cursor-pointer transition-colors">
                        <TableCell className="font-medium text-blue-900">{a.id}</TableCell>
                        <TableCell className="font-medium">{a.scheduledTime}</TableCell>
                        <TableCell>{a.carrier}</TableCell>
                        <TableCell>
                            <div className="flex flex-col">
                                <span className="text-sm text-slate-900">{a.driver}</span>
                                <span className="text-xs text-slate-500">{a.truckId}</span>
                            </div>
                        </TableCell>
                        <TableCell>{a.dock}</TableCell>
                        <TableCell className="text-right"><StatusBadge status={a.status} /></TableCell>
                      </TableRow>
                    ))}
                    {appointments.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                                No hay citas registradas para esta ubicación.
                            </TableCell>
                        </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}

              {/* Otros contenidos de ejemplo para mantener la estructura */}
              {monitoreoView === "carriers" && (
                 <div className="p-8 text-center text-slate-500">Vista de Torre de Control</div>
              )}
               {monitoreoView === "inventory" && (
                 <div className="p-8 text-center text-slate-500">Vista de Edición de Información</div>
              )}
            </TabsContent>

            {/* ---------------- SECCIÓN GESTIÓN (Tablas Fake) ---------------- */}
            <TabsContent value="gestion" className="h-full m-0 p-0 overflow-auto">
                
                {/* 1. TABLA SOLICITUDES (Pendientes de aprobación) */}
                {gestionView === "solicitudes" && (
                    <div className="h-full flex flex-col">
                         {/* Datos Fake definidos inline para ejemplo */}
                        {(() => {
                            const requestsData = [
                                { id: "REQ-8821", carrier: "DHL Logistics", date: "2023-11-15", window: "08:00 - 10:00", items: "Pallets x12", status: "pending" },
                                { id: "REQ-8822", carrier: "FedEx Ground", date: "2023-11-15", window: "10:30 - 12:00", items: "Cajas Sueltas", status: "pending" },
                                { id: "REQ-8825", carrier: "Transportes Norte", date: "2023-11-16", window: "14:00 - 16:00", items: "Contenedor 20ft", status: "review" },
                            ];
                            
                            return (
                                <Table>
                                    <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                                        <TableRow>
                                            <TableHead>ID Solicitud</TableHead>
                                            <TableHead>Transportista</TableHead>
                                            <TableHead>Fecha Solicitada</TableHead>
                                            <TableHead>Ventana Horaria</TableHead>
                                            <TableHead>Carga</TableHead>
                                            <TableHead className="text-right">Acciones</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {requestsData.map((item) => (
                                            <TableRow key={item.id} className="hover:bg-slate-50">
                                                <TableCell className="font-medium">{item.id}</TableCell>
                                                <TableCell>{item.carrier}</TableCell>
                                                <TableCell>{item.date}</TableCell>
                                                <TableCell><Badge variant="outline" className="bg-slate-100">{item.window}</Badge></TableCell>
                                                <TableCell className="text-slate-600">{item.items}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button size="sm" variant="outline" className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200">
                                                            <span className="sr-only">Rechazar</span>
                                                            <span className="text-xs font-bold">✕</span>
                                                        </Button>
                                                        <Button size="sm" className="h-7 w-7 p-0 bg-green-600 hover:bg-green-700 text-white">
                                                            <CheckSquare className="w-3 h-3" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            );
                        })()}
                    </div>
                )}

                {/* 2. TABLA CONFIRMACIÓN (Programadas) */}
                {gestionView === "programadas" && (
                    <div className="h-full flex flex-col">
                        {(() => {
                            const scheduledData = [
                                { id: "CNF-102", driver: "Roberto Gomez", plate: "ABC-123", dock: "Muelle A-02", eta: "09:45 AM", status: "confirmed" },
                                { id: "CNF-105", driver: "Luis Fernandez", plate: "XYZ-987", dock: "Muelle B-01", eta: "11:00 AM", status: "awaiting_driver" },
                                { id: "CNF-108", driver: "Ana Torres", plate: "LMN-456", dock: "Patio C", eta: "02:15 PM", status: "confirmed" },
                            ];

                            return (
                                <Table>
                                    <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                                        <TableRow>
                                            <TableHead>Referencia</TableHead>
                                            <TableHead>Conductor</TableHead>
                                            <TableHead>Placa / Patente</TableHead>
                                            <TableHead>Ubicación Asignada</TableHead>
                                            <TableHead>Hora Estimada (ETA)</TableHead>
                                            <TableHead className="text-right">Estatus</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {scheduledData.map((item) => (
                                            <TableRow key={item.id} className="hover:bg-slate-50">
                                                <TableCell className="font-semibold text-slate-700">{item.id}</TableCell>
                                                <TableCell>{item.driver}</TableCell>
                                                <TableCell className="font-mono text-xs">{item.plate}</TableCell>
                                                <TableCell>{item.dock}</TableCell>
                                                <TableCell>{item.eta}</TableCell>
                                                <TableCell className="text-right">
                                                    {item.status === "confirmed" ? (
                                                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 shadow-none border border-green-200">Confirmado</Badge>
                                                    ) : (
                                                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 shadow-none border border-amber-200">Falta Chofer</Badge>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )
                        })()}
                    </div>
                )}

                {/* 3. TABLA CANCELACIÓN (Ingresos/Histórico de fallos) */}
                {gestionView === "ingresos" && (
                    <div className="h-full flex flex-col">
                         {(() => {
                            const cancelledData = [
                                { id: "APT-009", carrier: "LogiCargo", originalDate: "2023-11-14", reason: "Llegada tardía (>4h)", user: "admin_sys" },
                                { id: "APT-012", carrier: "Swift Transport", originalDate: "2023-11-14", reason: "Documentación incompleta", user: "j_martinez" },
                                { id: "REQ-991", carrier: "FastFreight", originalDate: "2023-11-13", reason: "Cancelado por transportista", user: "system" },
                            ];

                            return (
                                <Table>
                                    <TableHeader className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                                        <TableRow>
                                            <TableHead>ID Original</TableHead>
                                            <TableHead>Transportista</TableHead>
                                            <TableHead>Fecha Original</TableHead>
                                            <TableHead>Motivo de Cancelación</TableHead>
                                            <TableHead>Responsable</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {cancelledData.map((item) => (
                                            <TableRow key={item.id} className="hover:bg-red-50/30">
                                                <TableCell className="font-medium text-slate-500 line-through">{item.id}</TableCell>
                                                <TableCell>{item.carrier}</TableCell>
                                                <TableCell>{item.originalDate}</TableCell>
                                                <TableCell className="text-red-600 font-medium flex items-center gap-2">
                                                    <AlertOctagon className="w-3 h-3" />
                                                    {item.reason}
                                                </TableCell>
                                                <TableCell className="text-xs text-slate-500 uppercase">{item.user}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )
                        })()}
                    </div>
                )}
            </TabsContent>

        </div>
      </Tabs>
    </div>
  );
}