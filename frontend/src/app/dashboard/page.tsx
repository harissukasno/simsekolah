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

// Asumsikan fungsi getRoleFromToken() Anda mengambil peran dari JWT di localStorage
// Contoh implementasi sederhana (Anda perlu menyesuaikannya dengan logika decoding JWT Anda yang sebenarnya)
const getRoleFromToken = (): string | null => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        // Ini adalah contoh sederhana. Anda mungkin perlu library JWT decoder yang lebih robust
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.role; // Asumsikan 'role' ada di payload JWT Anda
      } catch (e) {
        console.error("Error decoding token:", e);
        return null;
      }
    }
  }
  return null; // Akan mengembalikan null saat di server atau jika tidak ada token
};

export default function Page() {  
  
  // State untuk menyimpan komponen sidebar yang akan dirender.
  // Inisialisasi dengan null atau komponen loading/default untuk render awal server.
  const [CurrentSidebarComponent, setCurrentSidebarComponent] = useState<React.ComponentType<{ variant?: string; className?: string }> | null>(null);

  useEffect(() => {
    // Kode di dalam useEffect ini hanya akan berjalan di sisi klien setelah komponen mount
    const role = getRoleFromToken();
    let selectedComponent: React.ComponentType;

    if (role === "siswa") {
      selectedComponent = SidebarSiswa;
    } else if (role === "guru") {
      selectedComponent = SidebarGuru;
    } else if (role === "super_admin") {
      selectedComponent = SidebarAdmin;
    } else {
      // Fallback jika peran tidak ditemukan atau tidak dikenali
      // Ini harus cocok dengan default yang Anda inginkan jika tidak ada peran spesifik
      selectedComponent = SidebarGuru; // Atau komponen default lainnya
    }

    // Perbarui state dengan komponen yang telah ditentukan
    setCurrentSidebarComponent(() => selectedComponent);
  }, []); // Array dependensi kosong memastikan efek ini hanya berjalan sekali setelah mount  

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      {/* <SidebarComponent variant="inset" /> */}
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
  )
}
