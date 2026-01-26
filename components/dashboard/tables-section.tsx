"use client";

import React from "react";

import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Maximize2
} from "lucide-react";


interface TablesSectionProps {
  locationId: string | null;
  dockGroupId: string | null;
}

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12.75 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM7.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM8.25 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM9.75 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM10.5 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM12.75 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM14.25 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 17.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 15.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM15 12.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM16.5 13.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" />
      <path
        fillRule="evenodd"
        d="M6.75 2.25A.75.75 0 0 1 7.5 3v1.5h9V3A.75.75 0 0 1 18 3v1.5h.75a3 3 0 0 1 3 3v11.25a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.5a3 3 0 0 1 3-3H6V3a.75.75 0 0 1 .75-.75Zm13.5 9a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

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

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M4.5 6.375a4.125 4.125 0 1 1 8.25 0 4.125 4.125 0 0 1-8.25 0ZM14.25 8.625a3.375 3.375 0 1 1 6.75 0 3.375 3.375 0 0 1-6.75 0ZM1.5 19.125a7.125 7.125 0 0 1 14.25 0v.003l-.001.119a.75.75 0 0 1-.363.63 13.067 13.067 0 0 1-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 0 1-.364-.63l-.001-.122ZM17.25 19.128l-.001.144a2.25 2.25 0 0 1-.233.96 10.088 10.088 0 0 0 5.06-1.01.75.75 0 0 0 .42-.643 4.875 4.875 0 0 0-6.957-4.611 8.586 8.586 0 0 1 1.71 5.157v.003Z" />
    </svg>
  );
}

function CubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path d="M12.378 1.602a.75.75 0 0 0-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03ZM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 0 0 .372-.648V7.93ZM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 0 0 .372.648l8.628 5.033Z" />
    </svg>
  );
}

function MagnifyingGlassIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

// Sample data with locationId
const appointmentsData = [
  // Location 1 - Centro de Distribucion Norte
  {
    id: "APT-001",
    carrier: "Swift Transport",
    driver: "Juan Perez",
    truckId: "TRK-4521",
    dock: "Muelle A-01",
    scheduledTime: "08:30",
    type: "inbound",
    status: "in-progress",
    locationId: "loc-1",
  },
  {
    id: "APT-002",
    carrier: "LogiCargo",
    driver: "Maria Lopez",
    truckId: "TRK-1193",
    dock: "Muelle B-01",
    scheduledTime: "09:15",
    type: "inbound",
    status: "delayed",
    locationId: "loc-1",
  },
  {
    id: "APT-003",
    carrier: "FastFreight",
    driver: "Carlos Rodriguez",
    truckId: "TRK-7832",
    dock: "Despacho 01",
    scheduledTime: "09:00",
    type: "outbound",
    status: "in-progress",
    locationId: "loc-1",
  },
  {
    id: "APT-004",
    carrier: "NuevoTransporte",
    driver: "Ana Garcia",
    truckId: "TRK-NT01",
    dock: "-",
    scheduledTime: "12:00",
    type: "inbound",
    status: "scheduled",
    locationId: "loc-1",
  },
  // Location 2 - Almacen Central Guadalajara
  {
    id: "APT-005",
    carrier: "TransGlobal",
    driver: "Roberto Sanchez",
    truckId: "TRK-9012",
    dock: "Norte 01",
    scheduledTime: "08:00",
    type: "inbound",
    status: "in-progress",
    locationId: "loc-2",
  },
  {
    id: "APT-006",
    carrier: "ExpressLine",
    driver: "Laura Martinez",
    truckId: "TRK-2345",
    dock: "Sur 02",
    scheduledTime: "10:00",
    type: "outbound",
    status: "in-progress",
    locationId: "loc-2",
  },
  {
    id: "APT-007",
    carrier: "CargaRapida",
    driver: "Pedro Hernandez",
    truckId: "TRK-CR01",
    dock: "-",
    scheduledTime: "11:00",
    type: "inbound",
    status: "scheduled",
    locationId: "loc-2",
  },
  // Location 3 - Hub Logistico Monterrey
  {
    id: "APT-008",
    carrier: "MexiFreight",
    driver: "Miguel Torres",
    truckId: "TRK-5678",
    dock: "Terminal A-02",
    scheduledTime: "07:30",
    type: "inbound",
    status: "in-progress",
    locationId: "loc-3",
  },
  {
    id: "APT-009",
    carrier: "BorderCargo",
    driver: "Sofia Ramirez",
    truckId: "TRK-1122",
    dock: "Terminal A-05",
    scheduledTime: "08:15",
    type: "outbound",
    status: "delayed",
    locationId: "loc-3",
  },
  {
    id: "APT-010",
    carrier: "NorteFreight",
    driver: "Diego Morales",
    truckId: "TRK-NF01",
    dock: "-",
    scheduledTime: "10:00",
    type: "inbound",
    status: "scheduled",
    locationId: "loc-3",
  },
  // Location 4 - Centro Exportacion Tijuana
  {
    id: "APT-011",
    carrier: "USBound",
    driver: "Ricardo Flores",
    truckId: "TRK-USA1",
    dock: "Aduana 01",
    scheduledTime: "06:00",
    type: "outbound",
    status: "in-progress",
    locationId: "loc-4",
  },
  {
    id: "APT-012",
    carrier: "CrossBorder",
    driver: "Elena Ruiz",
    truckId: "TRK-CB02",
    dock: "Aduana 03",
    scheduledTime: "07:00",
    type: "outbound",
    status: "in-progress",
    locationId: "loc-4",
  },
  {
    id: "APT-013",
    carrier: "FronteraCargo",
    driver: "Fernando Diaz",
    truckId: "TRK-FC01",
    dock: "-",
    scheduledTime: "08:00",
    type: "outbound",
    status: "scheduled",
    locationId: "loc-4",
  },
];

const carriersData = [
  {
    id: "CAR-001",
    name: "Swift Transport",
    contact: "contact@swift.com",
    phone: "+1 (555) 123-4567",
    totalTrips: 156,
    rating: 4.8,
    status: "active",
  },
  {
    id: "CAR-002",
    name: "FastFreight",
    contact: "ops@fastfreight.com",
    phone: "+1 (555) 234-5678",
    totalTrips: 89,
    rating: 4.5,
    status: "active",
  },
  {
    id: "CAR-003",
    name: "LogiCargo",
    contact: "dispatch@logicargo.com",
    phone: "+1 (555) 345-6789",
    totalTrips: 234,
    rating: 4.9,
    status: "active",
  },
  {
    id: "CAR-004",
    name: "TransGlobal",
    contact: "info@transglobal.com",
    phone: "+1 (555) 456-7890",
    totalTrips: 67,
    rating: 4.2,
    status: "inactive",
  },
  {
    id: "CAR-005",
    name: "QuickShip",
    contact: "support@quickship.com",
    phone: "+1 (555) 567-8901",
    totalTrips: 178,
    rating: 4.7,
    status: "active",
  },
];

const inventoryData = [
  {
    id: "INV-001",
    sku: "SKU-78451",
    product: "Electronics Components",
    quantity: 1250,
    location: "Zone A - Rack 12",
    status: "in-stock",
  },
  {
    id: "INV-002",
    sku: "SKU-23897",
    product: "Industrial Parts",
    quantity: 450,
    location: "Zone B - Rack 05",
    status: "low-stock",
  },
  {
    id: "INV-003",
    sku: "SKU-11234",
    product: "Packaging Materials",
    quantity: 3200,
    location: "Zone C - Rack 22",
    status: "in-stock",
  },
  {
    id: "INV-004",
    sku: "SKU-99012",
    product: "Raw Materials",
    quantity: 0,
    location: "Zone A - Rack 08",
    status: "out-of-stock",
  },
  {
    id: "INV-005",
    sku: "SKU-45678",
    product: "Finished Goods",
    quantity: 890,
    location: "Zone D - Rack 15",
    status: "in-stock",
  },
];

function getStatusBadge(status: string) {
  const styles: Record<string, string> = {
    "in-progress": "bg-yms-cyan text-yms-primary",
    completed: "bg-green-500 text-white",
    delayed: "bg-yms-secondary text-white",
    scheduled: "bg-yms-primary text-white",
    pending: "bg-yms-gray text-white",
    active: "bg-yms-cyan text-yms-primary",
    inactive: "bg-yms-gray text-white",
    "in-stock": "bg-yms-cyan text-yms-primary",
    "low-stock": "bg-yms-secondary text-white",
    "out-of-stock": "bg-red-500 text-white",
  };

  return (
    <Badge className={cn("text-xs capitalize", styles[status] || styles.pending)}>
      {status.replace("-", " ")}
    </Badge>
  );
}

export function TablesSection({ locationId, dockGroupId }: TablesSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter appointments based on location
  const filteredAppointmentsData = useMemo(() => {
    if (!locationId) return [];
    return appointmentsData.filter((apt) => apt.locationId === locationId);
  }, [locationId]);

  return (
    <div className="h-full flex flex-col bg-white border-t border-yms-border overflow-hidden">
      <Tabs defaultValue="appointments" className="flex-1 flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-yms-border bg-slate-50/50">
          <TabsList className="bg-yms-primary/5 rounded-[1.25rem] p-1 h-auto">
            <TabsTrigger
              value="appointments"
              className="data-[state=active]:bg-yms-primary data-[state=active]:text-white rounded-[0.75rem] px-4 py-2 gap-2"
            >
              <CalendarIcon className="w-4 h-4" />
              <span className="font-medium">Consulta de citas</span>
              <Badge
                variant="secondary"
                className="ml-1 bg-yms-secondary/20 text-yms-secondary text-[10px]"
              >
                {filteredAppointmentsData.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="carriers"
              className="data-[state=active]:bg-yms-primary data-[state=active]:text-white rounded-[0.75rem] px-4 py-2 gap-2"
            >
              <TruckIcon className="w-4 h-4" />
              <span className="font-medium">Torre de Control</span>
              <Badge
                variant="secondary"
                className="ml-1 bg-yms-cyan/20 text-yms-cyan text-[10px]"
              >
                {carriersData.length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger
              value="inventory"
              className="data-[state=active]:bg-yms-primary data-[state=active]:text-white rounded-[0.75rem] px-4 py-2 gap-2"
            >
              <CubeIcon className="w-4 h-4" />
              <span className="font-medium">Editar Información</span>
              <Badge
                variant="secondary"
                className="ml-1 bg-yms-primary/20 text-yms-primary text-[10px]"
              >
                {inventoryData.length}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3">
           <Button className="bg-yms-secondary hover:bg-yms-secondary/90 text-white rounded-[0.75rem] gap-2">
              <PlusIcon className="w-4 h-4" />
              New Entry
            </Button>
            <div className="w-px h-8 bg-yms-border mx-1" />

        {/* Action icon buttons */}
        <button
          title="Exportar Excel"
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-yms-border bg-white hover:bg-yms-primary/5 active:scale-95 transition-all"
        >
          <Download className="w-4 h-4 text-yms-primary" />
        </button>

        <button
          title="Recargar"
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-yms-border bg-white hover:bg-yms-primary/5 active:scale-95 transition-all"
        >
          <RefreshCcw className="w-4 h-4 text-yms-primary" />
        </button>

        <button
          title="Filtrar"
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-yms-border bg-white hover:bg-yms-primary/5 active:scale-95 transition-all"
        >
          <Filter className="w-4 h-4 text-yms-primary" />
        </button>

        <button
          title="Pantalla completa"
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-yms-border bg-white hover:bg-yms-primary/5 active:scale-95 transition-all"
        >
          <Maximize2 className="w-4 h-4 text-yms-primary" />
        </button>
           
          </div>
        </div>

        {/* Appointments Tab */}
        <TabsContent value="appointments" className="flex-1 overflow-auto m-0 p-0">
          {!locationId ? (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-yms-primary/10 flex items-center justify-center mb-4">
                <CalendarIcon className="w-8 h-8 text-yms-primary" />
              </div>
              <h3 className="font-serif font-bold text-lg text-yms-primary mb-2">
                Selecciona una Localidad
              </h3>
              <p className="text-yms-gray text-sm max-w-md">
                Para ver las citas programadas, selecciona una localidad en el filtro superior
              </p>
            </div>
          ) : filteredAppointmentsData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-yms-cyan/10 flex items-center justify-center mb-4">
                <CalendarIcon className="w-8 h-8 text-yms-cyan" />
              </div>
              <h3 className="font-serif font-bold text-lg text-yms-primary mb-2">
                Sin Citas
              </h3>
              <p className="text-yms-gray text-sm max-w-md">
                No hay citas programadas para esta localidad
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-yms-primary/5 hover:bg-yms-primary/5">
                  <TableHead className="font-serif font-bold text-yms-primary">
                    ID
                  </TableHead>
                  <TableHead className="font-serif font-bold text-yms-primary">
                    Carrier
                  </TableHead>
                  <TableHead className="font-serif font-bold text-yms-primary">
                    Driver
                  </TableHead>
                  <TableHead className="font-serif font-bold text-yms-primary">
                    Truck ID
                  </TableHead>
                  <TableHead className="font-serif font-bold text-yms-primary">
                    Dock
                  </TableHead>
                  <TableHead className="font-serif font-bold text-yms-primary">
                    Scheduled
                  </TableHead>
                  <TableHead className="font-serif font-bold text-yms-primary">
                    Type
                  </TableHead>
                  <TableHead className="font-serif font-bold text-yms-primary">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointmentsData.map((apt) => (
                  <TableRow
                    key={apt.id}
                    className="hover:bg-yms-cyan/5 cursor-pointer"
                  >
                    <TableCell className="font-medium text-yms-primary">
                      {apt.id}
                    </TableCell>
                    <TableCell>{apt.carrier}</TableCell>
                    <TableCell>{apt.driver}</TableCell>
                    <TableCell className="font-mono text-sm">{apt.truckId}</TableCell>
                    <TableCell>
                      <span
                        className={cn(
                          "font-medium",
                          apt.dock === "-" ? "text-yms-gray" : "text-yms-primary"
                        )}
                      >
                        {apt.dock}
                      </span>
                    </TableCell>
                    <TableCell>{apt.scheduledTime}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs capitalize",
                          apt.type === "inbound"
                            ? "border-yms-cyan text-yms-cyan"
                            : "border-yms-secondary text-yms-secondary"
                        )}
                      >
                        {apt.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(apt.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TabsContent>

        {/* Carriers Tab */}
        <TabsContent value="carriers" className="flex-1 overflow-auto m-0 p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-yms-primary/5 hover:bg-yms-primary/5">
                <TableHead className="font-serif font-bold text-yms-primary">
                  ID
                </TableHead>
                <TableHead className="font-serif font-bold text-yms-primary">
                  Carrier Name
                </TableHead>
                <TableHead className="font-serif font-bold text-yms-primary">
                  Contact Email
                </TableHead>
                <TableHead className="font-serif font-bold text-yms-primary">
                  Phone
                </TableHead>
                <TableHead className="font-serif font-bold text-yms-primary">
                  Total Trips
                </TableHead>
                <TableHead className="font-serif font-bold text-yms-primary">
                  Rating
                </TableHead>
                <TableHead className="font-serif font-bold text-yms-primary">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {carriersData.map((carrier) => (
                <TableRow
                  key={carrier.id}
                  className="hover:bg-yms-cyan/5 cursor-pointer"
                >
                  <TableCell className="font-medium text-yms-primary">
                    {carrier.id}
                  </TableCell>
                  <TableCell className="font-medium">{carrier.name}</TableCell>
                  <TableCell className="text-yms-gray">{carrier.contact}</TableCell>
                  <TableCell>{carrier.phone}</TableCell>
                  <TableCell className="font-medium">{carrier.totalTrips}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4 text-yellow-400 fill-yellow-400"
                        viewBox="0 0 24 24"
                      >
                        <path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" />
                      </svg>
                      <span className="font-medium">{carrier.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(carrier.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="flex-1 overflow-auto m-0 p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-yms-primary/5 hover:bg-yms-primary/5">
                <TableHead className="font-serif font-bold text-yms-primary">
                  ID
                </TableHead>
                <TableHead className="font-serif font-bold text-yms-primary">
                  SKU
                </TableHead>
                <TableHead className="font-serif font-bold text-yms-primary">
                  Product
                </TableHead>
                <TableHead className="font-serif font-bold text-yms-primary">
                  Quantity
                </TableHead>
                <TableHead className="font-serif font-bold text-yms-primary">
                  Location
                </TableHead>
                <TableHead className="font-serif font-bold text-yms-primary">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventoryData.map((item) => (
                <TableRow
                  key={item.id}
                  className="hover:bg-yms-cyan/5 cursor-pointer"
                >
                  <TableCell className="font-medium text-yms-primary">
                    {item.id}
                  </TableCell>
                  <TableCell className="font-mono text-sm">{item.sku}</TableCell>
                  <TableCell className="font-medium">{item.product}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "font-medium",
                        item.quantity === 0 && "text-red-500",
                        item.quantity > 0 && item.quantity < 500 && "text-yms-secondary"
                      )}
                    >
                      {item.quantity.toLocaleString()}
                    </span>
                  </TableCell>
                  <TableCell className="text-yms-gray">{item.location}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>
    </div>
  );
}
