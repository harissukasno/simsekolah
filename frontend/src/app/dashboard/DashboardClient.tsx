// app/dashboard/DashboardClient.tsx
'use client'

import { SidebarSiswa } from "@/components/dashboard/sidebar-siswa"
import { SidebarGuru } from "@/components/dashboard/sidebar-guru"
import { SidebarAdmin } from "@/components/dashboard/sidebar-admin"
import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive"
import { DataTable } from "@/components/dashboard/data-table"
import { SectionCards } from "@/components/dashboard/section-cards"
import { SiteHeader } from "@/components/dashboard/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import data from "./data.json"
import React, { useState, useEffect } from "react";

const getRoleFromToken = (): string | null => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role;
      } catch (e) {
        console.error("Error decoding token:", e);
        return null;
      }
    }
  }
  return null;
};

export function DashboardClient() {
  const [CurrentSidebarComponent, setCurrentSidebarComponent] = useState<React.ComponentType<{ variant?: string; className?: string }> | null>(null);

  useEffect(() => {
    const role = getRoleFromToken();
    let selectedComponent: React.ComponentType;

    if (role === "siswa") {
      selectedComponent = SidebarSiswa;
    } else if (role === "guru") {
      selectedComponent = SidebarGuru;
    } else if (role === "super_admin") {
      selectedComponent = SidebarAdmin;
    } else {
      selectedComponent = SidebarGuru;
    }

    setCurrentSidebarComponent(() => selectedComponent);
  }, []);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      {CurrentSidebarComponent && (
        <CurrentSidebarComponent variant="inset" className="hidden lg:block" />
      )}
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
