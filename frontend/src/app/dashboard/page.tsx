'use client'

import { SidebarSiswa } from "@/components/dashboard/sidebar-siswa"
import { SidebarGuru } from "@/components/dashboard/sidebar-guru"
import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive"
import { DataTable } from "@/components/dashboard/data-table"
import { SectionCards } from "@/components/dashboard/section-cards"
import { SiteHeader } from "@/components/dashboard/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import data from "./data.json"
import { useRouter } from "next/navigation"

function getRoleFromToken(): string | null {
  if (typeof window === "undefined") return null
  const token = localStorage.getItem("access_token")
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))    
    return payload.role || null
  } catch {
    return null
  }
}

export default function Page() {
  const router = useRouter();    
  
  let SidebarComponent = SidebarGuru // default
  if (typeof window !== "undefined") {
    const role = getRoleFromToken()
    if (role === "siswa") {SidebarComponent = SidebarSiswa}
    else if (role === "guru") {SidebarComponent = SidebarGuru}
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <SidebarComponent variant="inset" />
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
