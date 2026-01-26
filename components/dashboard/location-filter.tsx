"use client";

import React from "react"

import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
        import { Search, BarChart3, ClipboardList, Users, Upload } from 'lucide-react';

// Icons
function MapPinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M11.54 22.351l.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function BuildingIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M4.5 2.25a.75.75 0 0 0 0 1.5v16.5h-.75a.75.75 0 0 0 0 1.5h16.5a.75.75 0 0 0 0-1.5h-.75V3.75a.75.75 0 0 0 0-1.5h-15ZM9 6a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm-.75 3.75A.75.75 0 0 1 9 9h1.5a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM9 12a.75.75 0 0 0 0 1.5h1.5a.75.75 0 0 0 0-1.5H9Zm3.75-5.25A.75.75 0 0 1 13.5 6H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM13.5 9a.75.75 0 0 0 0 1.5H15a.75.75 0 0 0 0-1.5h-1.5Zm-.75 3.75a.75.75 0 0 1 .75-.75H15a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75ZM9 19.5v-2.25a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-.75.75h-4.5A.75.75 0 0 1 9 19.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function LayersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M11.644 1.59a.75.75 0 0 1 .712 0l9.75 5.25a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.712 0l-9.75-5.25a.75.75 0 0 1 0-1.32l9.75-5.25Z" />
      <path d="m3.265 10.602 7.668 4.129a2.25 2.25 0 0 0 2.134 0l7.668-4.13 1.37.739a.75.75 0 0 1 0 1.32l-9.75 5.25a.75.75 0 0 1-.71 0l-9.75-5.25a.75.75 0 0 1 0-1.32l1.37-.738Z" />
      <path d="m10.933 19.231-7.668-4.13-1.37.739a.75.75 0 0 0 0 1.32l9.75 5.25c.221.12.489.12.71 0l9.75-5.25a.75.75 0 0 0 0-1.32l-1.37-.738-7.668 4.13a2.25 2.25 0 0 1-2.134-.001Z" />
    </svg>
  );
}

// Types
export interface Location {
  id: string;
  name: string;
  address: string;
  dockGroups: DockGroup[];
}

export interface DockGroup {
  id: string;
  name: string;
  dockCount: number;
  type: "inbound" | "outbound" | "mixed";
}

// Sample data - locations with dock groups
const locationsData: Location[] = [
  {
    id: "loc-1",
    name: "Centro de Distribucion Norte",
    address: "Av. Industrial 1250, CDMX",
    dockGroups: [
      { id: "dg-1a", name: "Muelles Recepcion A", dockCount: 4, type: "inbound" },
      { id: "dg-1b", name: "Muelles Recepcion B", dockCount: 4, type: "inbound" },
      { id: "dg-1c", name: "Muelles Despacho", dockCount: 6, type: "outbound" },
      { id: "dg-1d", name: "Muelles Mixtos", dockCount: 2, type: "mixed" },
    ],
  },
  {
    id: "loc-2",
    name: "Almacen Central Guadalajara",
    address: "Blvd. Logistico 450, GDL",
    dockGroups: [
      { id: "dg-2a", name: "Zona Carga Norte", dockCount: 8, type: "inbound" },
      { id: "dg-2b", name: "Zona Descarga Sur", dockCount: 6, type: "outbound" },
    ],
  },
  {
    id: "loc-3",
    name: "Hub Logistico Monterrey",
    address: "Parque Industrial MTY, NL",
    dockGroups: [
      { id: "dg-3a", name: "Terminal A", dockCount: 10, type: "mixed" },
      { id: "dg-3b", name: "Terminal B", dockCount: 8, type: "mixed" },
      { id: "dg-3c", name: "Refrigerados", dockCount: 4, type: "inbound" },
    ],
  },
  {
    id: "loc-4",
    name: "Centro Exportacion Tijuana",
    address: "Zona Franca 890, TIJ",
    dockGroups: [
      { id: "dg-4a", name: "Aduana Principal", dockCount: 6, type: "outbound" },
      { id: "dg-4b", name: "Cross-Dock", dockCount: 4, type: "mixed" },
    ],
  },
];

interface LocationFilterProps {
  onFilterChange: (locationId: string | null, dockGroupId: string | null) => void;
}

export function LocationFilter({ onFilterChange }: LocationFilterProps) {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [selectedDockGroupId, setSelectedDockGroupId] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const selectedLocation = locationsData.find((loc) => loc.id === selectedLocationId);
  const selectedDockGroup = selectedLocation?.dockGroups.find(
    (dg) => dg.id === selectedDockGroupId
  );

  useEffect(() => {
    onFilterChange(selectedLocationId, selectedDockGroupId);
  }, [selectedLocationId, selectedDockGroupId, onFilterChange]);

  const handleLocationChange = (value: string) => {
    setSelectedLocationId(value);
    setSelectedDockGroupId(null);
    setIsLoaded(true);
  };

  const handleDockGroupChange = (value: string) => {
    setSelectedDockGroupId(value);
  };

  const getDockTypeColor = (type: DockGroup["type"]) => {
    switch (type) {
      case "inbound":
        return "bg-yms-cyan/20 text-yms-cyan border-yms-cyan/30";
      case "outbound":
        return "bg-yms-secondary/20 text-yms-secondary border-yms-secondary/30";
      case "mixed":
        return "bg-yms-primary/20 text-yms-primary border-yms-primary/30";
    }
  };

  return (
    <div className="bg-white border-b border-yms-border px-6 py-4">
      <div className="flex items-center gap-6">
        {/* Location Select */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-yms-gray">
            <MapPinIcon className="w-5 h-5 text-yms-secondary" />
            <span className="font-medium text-sm">Localidad:</span>
          </div>
          <Select value={selectedLocationId || ""} onValueChange={handleLocationChange}>
            <SelectTrigger
              className={cn(
                "w-[320px] rounded-[1.25rem] border-yms-border bg-white",
                "focus:ring-2 focus:ring-yms-cyan focus:border-yms-cyan",
                "hover:border-yms-cyan/50 transition-colors",
                !selectedLocationId && "text-yms-gray"
              )}
            >
              <SelectValue placeholder="Seleccionar localidad..." />
            </SelectTrigger>
            <SelectContent className="rounded-[1rem] border-yms-border">
              {locationsData.map((location) => (
                <SelectItem
                  key={location.id}
                  value={location.id}
                  className="rounded-[0.75rem] cursor-pointer focus:bg-yms-cyan/10"
                >
                  <div className="flex items-start gap-3 py-1">
                    <BuildingIcon className="w-4 h-4 text-yms-primary mt-0.5 shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-medium text-yms-primary">
                        {location.name}
                      </span>
                      <span className="text-xs text-yms-gray">{location.address}</span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Dock Group Select - Only visible after location is selected */}
        {selectedLocationId && (
          <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="w-px h-8 bg-yms-border" />
            <div className="flex items-center gap-2 text-yms-gray">
              <LayersIcon className="w-5 h-5 text-yms-cyan" />
              <span className="font-medium text-sm">Grupo de Muelles:</span>
            </div>
            <Select
              value={selectedDockGroupId || ""}
              onValueChange={handleDockGroupChange}
            >
              <SelectTrigger
                className={cn(
                  "w-[280px] rounded-[1.25rem] border-yms-border bg-white",
                  "focus:ring-2 focus:ring-yms-cyan focus:border-yms-cyan",
                  "hover:border-yms-cyan/50 transition-colors",
                  !selectedDockGroupId && "text-yms-gray"
                )}
              >
                <SelectValue placeholder="Todos los grupos..." />
              </SelectTrigger>
              <SelectContent className="rounded-[1rem] border-yms-border">
                <SelectItem
                  value="all"
                  className="rounded-[0.75rem] cursor-pointer focus:bg-yms-cyan/10"
                >
                  <div className="flex items-center gap-2">
                    <LayersIcon className="w-4 h-4 text-yms-primary" />
                    <span className="font-medium">Todos los grupos</span>
                  </div>
                </SelectItem>
                {selectedLocation?.dockGroups.map((group) => (
                  <SelectItem
                    key={group.id}
                    value={group.id}
                    className="rounded-[0.75rem] cursor-pointer focus:bg-yms-cyan/10"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-yms-primary">
                        {group.name}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] px-1.5 capitalize",
                          getDockTypeColor(group.type)
                        )}
                      >
                        {group.type === "mixed" ? "Mixto" : group.type === "inbound" ? "Entrada" : "Salida"}
                      </Badge>
                      <span className="text-xs text-yms-gray ml-auto">
                        {group.dockCount} muelles
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}



{/* Action Buttons */}
{isLoaded && selectedLocation && (
  <div className="ml-auto flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
    {/* Barra de búsqueda */}
    <div className="relative group">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-yms-gray group-focus-within:text-yms-cyan transition-colors pointer-events-none" />
      <input
        type="text"
        placeholder="Buscar..."
        className="pl-9 pr-4 py-2 h-10 w-48 bg-white border border-yms-border rounded-xl text-sm outline-none focus:border-yms-cyan focus:ring-2 focus:ring-yms-cyan/20 transition-all"
      />
    </div>

    <div className="w-px h-8 bg-yms-border" />

    {/* Botón Reportes */}
    <button
      title="Reportes"
      className="w-10 h-10 flex items-center justify-center rounded-xl bg-yms-secondary text-white hover:brightness-110 active:scale-95 transition-all shadow-md"
    >
      <BarChart3 size={18} />
    </button>

    {/* Botón Registros */}
    <button
      title="Registros"
      className="w-10 h-10 flex items-center justify-center rounded-xl bg-yms-secondary text-white hover:brightness-110 active:scale-95 transition-all shadow-md"
    >
      <ClipboardList size={18} />
    </button>

    {/* Botón Usuarios */}
    <button
      title="Usuarios"
      className="w-10 h-10 flex items-center justify-center rounded-xl bg-yms-secondary text-white hover:brightness-110 active:scale-95 transition-all shadow-md"
    >
      <Users size={18} />
    </button>

    {/* Botón Carga de Archivos */}
    <button
      title="Carga de Archivos"
      className="w-10 h-10 flex items-center justify-center rounded-xl bg-yms-secondary text-white hover:brightness-110 active:scale-95 transition-all shadow-md"
    >
      <Upload size={18} />
    </button>
  </div>
)}
      </div>

      {/* Empty state hint */}
      {!selectedLocationId && (
        <div className="mt-3 flex items-center gap-2 text-yms-gray/70 text-sm">
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 0 1 .67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 1 1-.671-1.34l.041-.022ZM12 9a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
              clipRule="evenodd"
            />
          </svg>
          <span>Selecciona una localidad para cargar el dashboard de operaciones</span>
        </div>
      )}
    </div>
  );
}

export { locationsData };
