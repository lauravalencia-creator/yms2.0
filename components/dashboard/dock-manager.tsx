"use client";

import React from "react";

import { useState, useEffect, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type AppointmentStatus =
  | "scheduled"
  | "in-progress"
  | "completed"
  | "delayed"
  | "pending";

export interface Appointment {
  id: string;
  carrier: string;
  truckId: string;
  time: string;
  type: "inbound" | "outbound";
  status: AppointmentStatus;
  locationId?: string;
  dockGroupId?: string;
}

export interface Dock {
  id: string;
  name: string;
  type: "inbound" | "outbound" | "both";
  status: "available" | "occupied" | "maintenance";
  currentAppointment?: Appointment;
  locationId: string;
  dockGroupId: string;
}

interface DockManagerProps {
  locationId: string | null;
  dockGroupId: string | null;
}

// Docks data by location and dock group
const allDocks: Dock[] = [
  // Location 1 - Centro de Distribucion Norte
  // Dock Group: Muelles Recepcion A (dg-1a)
  { id: "dock-1a-1", name: "Muelle A-01", type: "inbound", status: "occupied", locationId: "loc-1", dockGroupId: "dg-1a",
    currentAppointment: { id: "apt-1", carrier: "Swift Transport", truckId: "TRK-4521", time: "08:30", type: "inbound", status: "in-progress", locationId: "loc-1", dockGroupId: "dg-1a" }},
  { id: "dock-1a-2", name: "Muelle A-02", type: "inbound", status: "available", locationId: "loc-1", dockGroupId: "dg-1a" },
  { id: "dock-1a-3", name: "Muelle A-03", type: "inbound", status: "available", locationId: "loc-1", dockGroupId: "dg-1a" },
  { id: "dock-1a-4", name: "Muelle A-04", type: "inbound", status: "maintenance", locationId: "loc-1", dockGroupId: "dg-1a" },
  // Dock Group: Muelles Recepcion B (dg-1b)
  { id: "dock-1b-1", name: "Muelle B-01", type: "inbound", status: "occupied", locationId: "loc-1", dockGroupId: "dg-1b",
    currentAppointment: { id: "apt-2", carrier: "LogiCargo", truckId: "TRK-1193", time: "09:15", type: "inbound", status: "delayed", locationId: "loc-1", dockGroupId: "dg-1b" }},
  { id: "dock-1b-2", name: "Muelle B-02", type: "inbound", status: "available", locationId: "loc-1", dockGroupId: "dg-1b" },
  { id: "dock-1b-3", name: "Muelle B-03", type: "inbound", status: "available", locationId: "loc-1", dockGroupId: "dg-1b" },
  { id: "dock-1b-4", name: "Muelle B-04", type: "inbound", status: "occupied", locationId: "loc-1", dockGroupId: "dg-1b",
    currentAppointment: { id: "apt-3", carrier: "CargoMax", truckId: "TRK-7890", time: "10:00", type: "inbound", status: "in-progress", locationId: "loc-1", dockGroupId: "dg-1b" }},
  // Dock Group: Muelles Despacho (dg-1c)
  { id: "dock-1c-1", name: "Despacho 01", type: "outbound", status: "occupied", locationId: "loc-1", dockGroupId: "dg-1c",
    currentAppointment: { id: "apt-4", carrier: "FastFreight", truckId: "TRK-7832", time: "09:00", type: "outbound", status: "in-progress", locationId: "loc-1", dockGroupId: "dg-1c" }},
  { id: "dock-1c-2", name: "Despacho 02", type: "outbound", status: "available", locationId: "loc-1", dockGroupId: "dg-1c" },
  { id: "dock-1c-3", name: "Despacho 03", type: "outbound", status: "available", locationId: "loc-1", dockGroupId: "dg-1c" },
  { id: "dock-1c-4", name: "Despacho 04", type: "outbound", status: "available", locationId: "loc-1", dockGroupId: "dg-1c" },
  { id: "dock-1c-5", name: "Despacho 05", type: "outbound", status: "maintenance", locationId: "loc-1", dockGroupId: "dg-1c" },
  { id: "dock-1c-6", name: "Despacho 06", type: "outbound", status: "available", locationId: "loc-1", dockGroupId: "dg-1c" },
  // Dock Group: Muelles Mixtos (dg-1d)
  { id: "dock-1d-1", name: "Mixto 01", type: "both", status: "available", locationId: "loc-1", dockGroupId: "dg-1d" },
  { id: "dock-1d-2", name: "Mixto 02", type: "both", status: "available", locationId: "loc-1", dockGroupId: "dg-1d" },

  // Location 2 - Almacen Central Guadalajara
  // Dock Group: Zona Carga Norte (dg-2a)
  { id: "dock-2a-1", name: "Norte 01", type: "inbound", status: "occupied", locationId: "loc-2", dockGroupId: "dg-2a",
    currentAppointment: { id: "apt-5", carrier: "TransGlobal", truckId: "TRK-9012", time: "08:00", type: "inbound", status: "in-progress", locationId: "loc-2", dockGroupId: "dg-2a" }},
  { id: "dock-2a-2", name: "Norte 02", type: "inbound", status: "available", locationId: "loc-2", dockGroupId: "dg-2a" },
  { id: "dock-2a-3", name: "Norte 03", type: "inbound", status: "available", locationId: "loc-2", dockGroupId: "dg-2a" },
  { id: "dock-2a-4", name: "Norte 04", type: "inbound", status: "occupied", locationId: "loc-2", dockGroupId: "dg-2a",
    currentAppointment: { id: "apt-6", carrier: "QuickShip", truckId: "TRK-3456", time: "09:30", type: "inbound", status: "scheduled", locationId: "loc-2", dockGroupId: "dg-2a" }},
  { id: "dock-2a-5", name: "Norte 05", type: "inbound", status: "available", locationId: "loc-2", dockGroupId: "dg-2a" },
  { id: "dock-2a-6", name: "Norte 06", type: "inbound", status: "maintenance", locationId: "loc-2", dockGroupId: "dg-2a" },
  { id: "dock-2a-7", name: "Norte 07", type: "inbound", status: "available", locationId: "loc-2", dockGroupId: "dg-2a" },
  { id: "dock-2a-8", name: "Norte 08", type: "inbound", status: "available", locationId: "loc-2", dockGroupId: "dg-2a" },
  // Dock Group: Zona Descarga Sur (dg-2b)
  { id: "dock-2b-1", name: "Sur 01", type: "outbound", status: "available", locationId: "loc-2", dockGroupId: "dg-2b" },
  { id: "dock-2b-2", name: "Sur 02", type: "outbound", status: "occupied", locationId: "loc-2", dockGroupId: "dg-2b",
    currentAppointment: { id: "apt-7", carrier: "ExpressLine", truckId: "TRK-2345", time: "10:00", type: "outbound", status: "in-progress", locationId: "loc-2", dockGroupId: "dg-2b" }},
  { id: "dock-2b-3", name: "Sur 03", type: "outbound", status: "available", locationId: "loc-2", dockGroupId: "dg-2b" },
  { id: "dock-2b-4", name: "Sur 04", type: "outbound", status: "available", locationId: "loc-2", dockGroupId: "dg-2b" },
  { id: "dock-2b-5", name: "Sur 05", type: "outbound", status: "available", locationId: "loc-2", dockGroupId: "dg-2b" },
  { id: "dock-2b-6", name: "Sur 06", type: "outbound", status: "maintenance", locationId: "loc-2", dockGroupId: "dg-2b" },

  // Location 3 - Hub Logistico Monterrey
  // Dock Group: Terminal A (dg-3a)
  { id: "dock-3a-1", name: "Terminal A-01", type: "both", status: "available", locationId: "loc-3", dockGroupId: "dg-3a" },
  { id: "dock-3a-2", name: "Terminal A-02", type: "both", status: "occupied", locationId: "loc-3", dockGroupId: "dg-3a",
    currentAppointment: { id: "apt-8", carrier: "MexiFreight", truckId: "TRK-5678", time: "07:30", type: "inbound", status: "in-progress", locationId: "loc-3", dockGroupId: "dg-3a" }},
  { id: "dock-3a-3", name: "Terminal A-03", type: "both", status: "available", locationId: "loc-3", dockGroupId: "dg-3a" },
  { id: "dock-3a-4", name: "Terminal A-04", type: "both", status: "available", locationId: "loc-3", dockGroupId: "dg-3a" },
  { id: "dock-3a-5", name: "Terminal A-05", type: "both", status: "occupied", locationId: "loc-3", dockGroupId: "dg-3a",
    currentAppointment: { id: "apt-9", carrier: "BorderCargo", truckId: "TRK-1122", time: "08:15", type: "outbound", status: "delayed", locationId: "loc-3", dockGroupId: "dg-3a" }},
  { id: "dock-3a-6", name: "Terminal A-06", type: "both", status: "available", locationId: "loc-3", dockGroupId: "dg-3a" },
  { id: "dock-3a-7", name: "Terminal A-07", type: "both", status: "available", locationId: "loc-3", dockGroupId: "dg-3a" },
  { id: "dock-3a-8", name: "Terminal A-08", type: "both", status: "maintenance", locationId: "loc-3", dockGroupId: "dg-3a" },
  { id: "dock-3a-9", name: "Terminal A-09", type: "both", status: "available", locationId: "loc-3", dockGroupId: "dg-3a" },
  { id: "dock-3a-10", name: "Terminal A-10", type: "both", status: "available", locationId: "loc-3", dockGroupId: "dg-3a" },

  // Location 4 - Centro Exportacion Tijuana
  // Dock Group: Aduana Principal (dg-4a)
  { id: "dock-4a-1", name: "Aduana 01", type: "outbound", status: "occupied", locationId: "loc-4", dockGroupId: "dg-4a",
    currentAppointment: { id: "apt-10", carrier: "USBound", truckId: "TRK-USA1", time: "06:00", type: "outbound", status: "in-progress", locationId: "loc-4", dockGroupId: "dg-4a" }},
  { id: "dock-4a-2", name: "Aduana 02", type: "outbound", status: "available", locationId: "loc-4", dockGroupId: "dg-4a" },
  { id: "dock-4a-3", name: "Aduana 03", type: "outbound", status: "occupied", locationId: "loc-4", dockGroupId: "dg-4a",
    currentAppointment: { id: "apt-11", carrier: "CrossBorder", truckId: "TRK-CB02", time: "07:00", type: "outbound", status: "in-progress", locationId: "loc-4", dockGroupId: "dg-4a" }},
  { id: "dock-4a-4", name: "Aduana 04", type: "outbound", status: "available", locationId: "loc-4", dockGroupId: "dg-4a" },
  { id: "dock-4a-5", name: "Aduana 05", type: "outbound", status: "available", locationId: "loc-4", dockGroupId: "dg-4a" },
  { id: "dock-4a-6", name: "Aduana 06", type: "outbound", status: "maintenance", locationId: "loc-4", dockGroupId: "dg-4a" },
];

const pendingAppointments: Appointment[] = [
  {
    id: "pending-1",
    carrier: "TransGlobal",
    truckId: "TRK-9012",
    time: "10:00",
    type: "inbound",
    status: "scheduled",
  },
  {
    id: "pending-2",
    carrier: "QuickShip",
    truckId: "TRK-3456",
    time: "10:30",
    type: "outbound",
    status: "scheduled",
  },
  {
    id: "pending-3",
    carrier: "CargoMax",
    truckId: "TRK-7890",
    time: "11:00",
    type: "inbound",
    status: "pending",
  },
  {
    id: "pending-4",
    carrier: "ExpressLine",
    truckId: "TRK-2345",
    time: "11:30",
    type: "outbound",
    status: "scheduled",
  },
];

const initialDocks = allDocks; // Declare initialDocks variable

function TruckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25ZM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 1 1 6 0h3a.75.75 0 0 0 .75-.75V15Zm8.25 0h-1.5v2.625c0 .621.504 1.125 1.125 1.125h.375a3 3 0 1 1-6 0H13.5v.75c0 .414.336.75.75.75h8.625c.621 0 1.125-.504 1.125-1.125V19.5a4.5 4.5 0 0 0-4.5-4.5h-1.5V9.75a.75.75 0 0 0-.75-.75h-1.5a.75.75 0 0 0-.75.75v2.25H18a3 3 0 0 1 3 3v.75h.75a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-.75.75h-.75v.75Z" />
      <path d="M7.5 16.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3ZM16.5 16.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" />
    </svg>
  );
}

function ArrowDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M12 2.25a.75.75 0 0 1 .75.75v16.19l6.22-6.22a.75.75 0 1 1 1.06 1.06l-7.5 7.5a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 1 1 1.06-1.06l6.22 6.22V3a.75.75 0 0 1-.75-.75Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ArrowUpIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function WrenchIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M12 6.75a5.25 5.25 0 0 1 6.775-5.025.75.75 0 0 1 .313 1.248l-3.32 3.319c.063.475.276.934.641 1.299.365.365.824.578 1.3.64l3.318-3.319a.75.75 0 0 1 1.248.313 5.25 5.25 0 0 1-5.472 6.756c-1.018-.086-1.87.1-2.309.634L7.344 21.3A3.298 3.298 0 1 1 2.7 16.657l8.684-7.151c.533-.44.72-1.291.634-2.309A5.342 5.342 0 0 1 12 6.75ZM4.117 19.125a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75h-.008a.75.75 0 0 1-.75-.75v-.008Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ClockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function getStatusColor(status: AppointmentStatus) {
  switch (status) {
    case "in-progress":
      return "bg-yms-cyan text-yms-primary";
    case "completed":
      return "bg-green-500 text-white";
    case "delayed":
      return "bg-yms-secondary text-white";
    case "scheduled":
      return "bg-yms-primary text-white";
    default:
      return "bg-yms-gray text-white";
  }
}

function getDockStatusStyle(status: Dock["status"]) {
  switch (status) {
    case "available":
      return "border-yms-cyan bg-yms-cyan/5";
    case "occupied":
      return "border-yms-primary bg-yms-primary/5";
    case "maintenance":
      return "border-yms-secondary bg-yms-secondary/5";
  }
}

function AppointmentCard({
  appointment,
  isDragging,
  onDragStart,
}: {
  appointment: Appointment;
  isDragging: boolean;
  onDragStart: () => void;
}) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("appointmentId", appointment.id);
        onDragStart();
      }}
      className={cn(
        "bg-white border border-yms-border rounded-[0.75rem] p-3 cursor-grab active:cursor-grabbing transition-all hover:shadow-md hover:border-yms-cyan",
        isDragging && "opacity-50 scale-95"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          {appointment.type === "inbound" ? (
            <ArrowDownIcon className="w-4 h-4 text-yms-cyan" />
          ) : (
            <ArrowUpIcon className="w-4 h-4 text-yms-secondary" />
          )}
          <span className="font-medium text-sm text-yms-primary">
            {appointment.carrier}
          </span>
        </div>
        <Badge className={cn("text-xs", getStatusColor(appointment.status))}>
          {appointment.status}
        </Badge>
      </div>
      <div className="flex items-center gap-3 text-xs text-yms-gray">
        <span className="flex items-center gap-1">
          <TruckIcon className="w-3.5 h-3.5" />
          {appointment.truckId}
        </span>
        <span className="flex items-center gap-1">
          <ClockIcon className="w-3.5 h-3.5" />
          {appointment.time}
        </span>
      </div>
    </div>
  );
}

function DockSlot({
  dock,
  onDrop,
  isDropTarget,
  onDragOver,
  onDragLeave,
}: {
  dock: Dock;
  onDrop: (appointmentId: string, dockId: string) => void;
  isDropTarget: boolean;
  onDragOver: () => void;
  onDragLeave: () => void;
}) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (dock.status === "available") {
      onDragOver();
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const appointmentId = e.dataTransfer.getData("appointmentId");
    if (appointmentId && dock.status === "available") {
      onDrop(appointmentId, dock.id);
    }
    onDragLeave();
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={onDragLeave}
      onDrop={handleDrop}
      className={cn(
        "relative border-2 rounded-xl p-2.5 w-32 h-40 transition-all flex flex-col",
        getDockStatusStyle(dock.status),
        isDropTarget && dock.status === "available" && "border-yms-cyan border-dashed bg-yms-cyan/10 scale-105",
        dock.status === "available" && "hover:border-yms-cyan/50 cursor-pointer"
      )}
    >
      {/* Dock Header */}
      <div className="flex items-center justify-between gap-1 mb-1.5">
        <span className="font-serif font-bold text-xs text-yms-primary truncate">
          {dock.name}
        </span>
        {dock.status === "maintenance" && (
          <WrenchIcon className="w-3.5 h-3.5 text-yms-secondary shrink-0" />
        )}
      </div>

      <Badge
        variant="outline"
        className={cn(
          "text-[9px] px-1.5 py-0.5 w-fit mb-2",
          dock.type === "inbound" && "border-yms-cyan text-yms-cyan",
          dock.type === "outbound" && "border-yms-secondary text-yms-secondary",
          dock.type === "both" && "border-yms-primary text-yms-primary"
        )}
      >
        {dock.type === "both" ? "IN/OUT" : dock.type.toUpperCase()}
      </Badge>

      {/* Dock Content */}
      <div className="flex-1 flex items-center justify-center min-h-0">
        {dock.status === "available" && (
          <div className="flex flex-col items-center justify-center text-yms-gray/50">
            <div className="w-8 h-8 rounded-full border-2 border-dashed border-yms-border flex items-center justify-center mb-1">
              <TruckIcon className="w-5 h-5" />
            </div>
            <span className="text-[10px] text-yms-gray/60">Disponible</span>
          </div>
        )}

        {dock.status === "maintenance" && (
          <div className="flex flex-col items-center justify-center text-yms-secondary">
            <WrenchIcon className="w-6 h-6 mb-1" />
            <span className="text-[10px] font-medium text-center">Mantenimiento</span>
          </div>
        )}

        {dock.currentAppointment && (
          <div className="w-full space-y-1 overflow-hidden">
            <div className="flex items-center gap-1">
              {dock.currentAppointment.type === "inbound" ? (
                <ArrowDownIcon className="w-3.5 h-3.5 text-yms-cyan shrink-0" />
              ) : (
                <ArrowUpIcon className="w-3.5 h-3.5 text-yms-secondary shrink-0" />
              )}
              <span className="font-medium text-[11px] text-yms-primary truncate">
                {dock.currentAppointment.carrier}
              </span>
            </div>
            <div className="text-[10px] text-yms-gray truncate">
              {dock.currentAppointment.truckId}
            </div>
            <div className="text-[10px] text-yms-gray flex items-center gap-1">
              <ClockIcon className="w-3 h-3" />
              {dock.currentAppointment.time}
            </div>
            <Badge
              className={cn(
                "text-[9px] px-1.5 py-0.5 mt-1",
                getStatusColor(dock.currentAppointment.status)
              )}
            >
              {dock.currentAppointment.status === "in-progress" ? "En Proceso" :
               dock.currentAppointment.status === "delayed" ? "Retrasado" :
               dock.currentAppointment.status === "scheduled" ? "Agendado" : 
               dock.currentAppointment.status}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}

// Pending appointments by location
const allPendingAppointments: Appointment[] = [
  // Location 1
  { id: "pending-1a-1", carrier: "NuevoTransporte", truckId: "TRK-NT01", time: "12:00", type: "inbound", status: "scheduled", locationId: "loc-1", dockGroupId: "dg-1a" },
  { id: "pending-1a-2", carrier: "RapidoCarga", truckId: "TRK-RC02", time: "12:30", type: "inbound", status: "pending", locationId: "loc-1", dockGroupId: "dg-1b" },
  { id: "pending-1c-1", carrier: "EnvioDirecto", truckId: "TRK-ED01", time: "13:00", type: "outbound", status: "scheduled", locationId: "loc-1", dockGroupId: "dg-1c" },
  // Location 2
  { id: "pending-2a-1", carrier: "CargaRapida", truckId: "TRK-CR01", time: "11:00", type: "inbound", status: "scheduled", locationId: "loc-2", dockGroupId: "dg-2a" },
  { id: "pending-2b-1", carrier: "LogiMex", truckId: "TRK-LM01", time: "11:30", type: "outbound", status: "scheduled", locationId: "loc-2", dockGroupId: "dg-2b" },
  // Location 3
  { id: "pending-3a-1", carrier: "NorteFreight", truckId: "TRK-NF01", time: "10:00", type: "inbound", status: "scheduled", locationId: "loc-3", dockGroupId: "dg-3a" },
  { id: "pending-3a-2", carrier: "MonterreyExpress", truckId: "TRK-ME02", time: "10:30", type: "outbound", status: "pending", locationId: "loc-3", dockGroupId: "dg-3a" },
  // Location 4
  { id: "pending-4a-1", carrier: "FronteraCargo", truckId: "TRK-FC01", time: "08:00", type: "outbound", status: "scheduled", locationId: "loc-4", dockGroupId: "dg-4a" },
  { id: "pending-4a-2", carrier: "ExportMex", truckId: "TRK-EM02", time: "08:30", type: "outbound", status: "scheduled", locationId: "loc-4", dockGroupId: "dg-4a" },
];

export function DockManager({ locationId, dockGroupId }: DockManagerProps) {
  const [allDocksState, setAllDocksState] = useState(allDocks);
  const [allAppointmentsState, setAllAppointmentsState] = useState(allPendingAppointments);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dropTargetId, setDropTargetId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  // Filter docks based on location and dock group
  const filteredDocks = useMemo(() => {
    if (!locationId) return [];
    let filtered = allDocksState.filter((dock) => dock.locationId === locationId);
    if (dockGroupId && dockGroupId !== "all") {
      filtered = filtered.filter((dock) => dock.dockGroupId === dockGroupId);
    }
    return filtered;
  }, [allDocksState, locationId, dockGroupId]);

  // Filter appointments based on location, dock group, and search query
  const filteredAppointments = useMemo(() => {
    if (!locationId) return [];
    let filtered = allAppointmentsState.filter((apt) => apt.locationId === locationId);
    if (dockGroupId && dockGroupId !== "all") {
      filtered = filtered.filter((apt) => apt.dockGroupId === dockGroupId);
    }
    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((apt) => 
        apt.carrier.toLowerCase().includes(query) ||
        apt.truckId.toLowerCase().includes(query) ||
        apt.id.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [allAppointmentsState, locationId, dockGroupId, searchQuery]);

  // Calculate stats
  const stats = useMemo(() => {
    const available = filteredDocks.filter((d) => d.status === "available").length;
    const occupied = filteredDocks.filter((d) => d.status === "occupied").length;
    const maintenance = filteredDocks.filter((d) => d.status === "maintenance").length;
    return { available, occupied, maintenance, total: filteredDocks.length };
  }, [filteredDocks]);

  const handleDrop = (appointmentId: string, dockId: string) => {
    const appointment = allAppointmentsState.find((a) => a.id === appointmentId);
    if (!appointment) return;

    setAllDocksState((prev) =>
      prev.map((dock) =>
        dock.id === dockId
          ? {
              ...dock,
              status: "occupied" as const,
              currentAppointment: { ...appointment, status: "in-progress" as const },
            }
          : dock
      )
    );

    setAllAppointmentsState((prev) => prev.filter((a) => a.id !== appointmentId));
    setDraggingId(null);
    setDropTargetId(null);
    setSelectedAppointment(null);
  };

  // Empty state when no location is selected
  if (!locationId) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="w-20 h-20 rounded-full bg-yms-primary/10 flex items-center justify-center mb-4">
          <svg
            className="w-10 h-10 text-yms-primary"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M11.54 22.351l.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h3 className="font-serif font-bold text-xl text-yms-primary mb-2">
          Selecciona una Localidad
        </h3>
        <p className="text-yms-gray max-w-md">
          Para visualizar y gestionar los muelles, primero selecciona una localidad en el filtro superior
        </p>
      </div>
    );
  }

return (
  <div className="h-full flex flex-col p-4 gap-3 overflow-hidden">

    <div className="flex-1 flex gap-4 overflow-hidden min-h-0">
      {/* Pending Appointments Queue */}
      <div className="w-72 shrink-0 flex flex-col min-h-0">

        {/* Header */}
        <div className="bg-yms-primary rounded-t-[1rem] px-4 py-2.5 flex-shrink-0">
          <h3 className="font-serif font-bold text-sm text-white">
            Asignaciones
          </h3>
        </div>

        {/* Search Box (debajo del título) */}
        {!selectedAppointment && (
          <div className="bg-white border-x border-b border-yms-border px-3 py-2.5 flex-shrink-0">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-yms-gray/60"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>

              <input
                type="text"
                placeholder="Buscar orden de compra..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-8 py-2 text-sm border border-yms-border rounded-lg outline-none focus:border-yms-cyan focus:ring-2 focus:ring-yms-cyan/20 transition-all"
              />

              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-yms-gray/60 hover:text-yms-primary transition-colors"
                >
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          </div>
        )}

          
         

          <div className="flex-1 bg-white border border-t-0 border-yms-border rounded-b-[1rem] p-3 overflow-y-auto min-h-0">
            {selectedAppointment ? (
              // Vista detallada
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                {/* Botón de regresar */}
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="flex items-center gap-2 text-yms-primary hover:text-yms-cyan transition-colors text-sm font-medium"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Volver a la lista
                </button>

                {/* Detalles de la orden */}
                <div className="bg-gradient-to-br from-yms-primary to-yms-primary/80 rounded-xl p-4 text-white shadow-lg">
                  <div className="flex items-center gap-2 mb-3">
                    {selectedAppointment.type === "inbound" ? (
                      <ArrowDownIcon className="w-5 h-5" />
                    ) : (
                      <ArrowUpIcon className="w-5 h-5" />
                    )}
                    <h4 className="font-serif font-bold text-lg">
                      {selectedAppointment.carrier}
                    </h4>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625ZM7.5 15a.75.75 0 0 1 .75-.75h7.5a.75.75 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 15Zm.75 2.25a.75.75 0 0 0 0 1.5H12a.75.75 0 0 0 0-1.5H8.25Z" clipRule="evenodd" />
                        <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                      </svg>
                      <span className="opacity-80">Orden de Compra:</span>
                      <span className="font-bold">{selectedAppointment.id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TruckIcon className="w-4 h-4 opacity-70" />
                      <span className="opacity-80">Vehículo:</span>
                      <span className="font-bold">{selectedAppointment.truckId}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4 opacity-70" />
                      <span className="opacity-80">Hora programada:</span>
                      <span className="font-bold">{selectedAppointment.time}</span>
                    </div>
                  </div>
                </div>

                {/* Información adicional */}
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-3 border border-yms-border">
                    <p className="text-xs font-bold text-yms-gray mb-1 uppercase tracking-wide">Conductor</p>
                    <p className="text-sm text-yms-primary font-medium">Juan Carlos Pérez</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 border border-yms-border">
                    <p className="text-xs font-bold text-yms-gray mb-1 uppercase tracking-wide">Tipo de Producto</p>
                    <p className="text-sm text-yms-primary font-medium">Mercancía General</p>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 border border-yms-border">
                    <p className="text-xs font-bold text-yms-gray mb-1 uppercase tracking-wide">Estado</p>
                    <Badge className={cn("text-xs", getStatusColor(selectedAppointment.status))}>
                      {selectedAppointment.status === "scheduled" ? "Programada" :
                       selectedAppointment.status === "pending" ? "Pendiente" :
                       selectedAppointment.status}
                    </Badge>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 border border-yms-border">
                    <p className="text-xs font-bold text-yms-gray mb-1 uppercase tracking-wide">Tipo de Operación</p>
                    <div className="flex items-center gap-2">
                      {selectedAppointment.type === "inbound" ? (
                        <>
                          <ArrowDownIcon className="w-4 h-4 text-yms-cyan" />
                          <span className="text-sm text-yms-primary font-medium">Recepción / Entrada</span>
                        </>
                      ) : (
                        <>
                          <ArrowUpIcon className="w-4 h-4 text-yms-secondary" />
                          <span className="text-sm text-yms-primary font-medium">Despacho / Salida</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Instrucciones de arrastre */}
                <div className="bg-yms-cyan/10 border border-yms-cyan/30 rounded-lg p-3 flex items-start gap-2">
                  <svg className="w-5 h-5 text-yms-cyan shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor">
                    <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clipRule="evenodd" />
                  </svg>
                  <p className="text-xs text-yms-primary">
                    Arrastra esta cita desde la lista hacia un muelle disponible para asignarla
                  </p>
                </div>
              </div>
            ) : (
              // Vista de lista
              <div className="space-y-2">
                {filteredAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    onClick={() => setSelectedAppointment(appointment)}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("appointmentId", appointment.id);
                      setDraggingId(appointment.id);
                    }}
                    className={cn(
                      "bg-white border border-yms-border rounded-lg p-3 cursor-pointer transition-all hover:shadow-md hover:border-yms-cyan",
                      draggingId === appointment.id && "opacity-50 scale-95"
                    )}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {appointment.type === "inbound" ? (
                          <ArrowDownIcon className="w-4 h-4 text-yms-cyan" />
                        ) : (
                          <ArrowUpIcon className="w-4 h-4 text-yms-secondary" />
                        )}
                        <span className="font-medium text-sm text-yms-primary">
                          {appointment.carrier}
                        </span>
                      </div>
                      <Badge className={cn("text-xs", getStatusColor(appointment.status))}>
                        {appointment.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-yms-gray">
                      <span className="flex items-center gap-1">
                        <TruckIcon className="w-3.5 h-3.5" />
                        {appointment.truckId}
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-3.5 h-3.5" />
                        {appointment.time}
                      </span>
                    </div>
                  </div>
                ))}
                {filteredAppointments.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full text-yms-gray/60 text-sm py-8">
                    <TruckIcon className="w-8 h-8 mb-2 opacity-40" />
                    {searchQuery ? (
                      <p>No se encontraron resultados</p>
                    ) : (
                      <p>Sin citas pendientes</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Docks Grid */}
        <div className="flex-1 bg-white border border-yms-border rounded-[1.5rem] p-2 overflow-y-auto min-h-0">
          {filteredDocks.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {filteredDocks.map((dock) => (
                <DockSlot
                  key={dock.id}
                  dock={dock}
                  onDrop={handleDrop}
                  isDropTarget={dropTargetId === dock.id}
                  onDragOver={() => setDropTargetId(dock.id)}
                  onDragLeave={() => setDropTargetId(null)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-yms-gray/60">
              <p>No hay muelles en este grupo</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}