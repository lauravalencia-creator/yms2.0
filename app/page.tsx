"use client";

import { useState, useCallback } from "react";
import { LocationFilter } from "@/components/dashboard/location-filter";
import { DockManager } from "@/components/dashboard/dock-manager";
import { TablesSection } from "@/components/dashboard/tables-section";

export default function DashboardPage() {
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [selectedDockGroupId, setSelectedDockGroupId] = useState<string | null>(null);

  const handleFilterChange = useCallback((locationId: string | null, dockGroupId: string | null) => {
    setSelectedLocationId(locationId);
    setSelectedDockGroupId(dockGroupId);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
   

      {/* Location Filter Bar */}
      <LocationFilter onFilterChange={handleFilterChange} />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-0">
        {/* Dock Manager Section - 50% height */}
        <section className="h-1/2 min-h-0 bg-slate-50">
          <DockManager 
            locationId={selectedLocationId} 
            dockGroupId={selectedDockGroupId} 
          />
        </section>

        {/* Tables Section - 50% height */}
        <section className="h-1/2 min-h-0">
          <TablesSection 
            locationId={selectedLocationId}
            dockGroupId={selectedDockGroupId}
          />
        </section>
      </main>
    </div>
  );
}
