
"use client";

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { AppHeader } from '@/components/AppHeader';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { FinancialDataProvider } from '@/contexts/FinancialDataContext';
import { AuthProvider } from '@/contexts/AuthContext';
import OfflinePage from './_offline';
import { Toaster } from "@/components/ui/toaster";


export function Providers({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <AuthProvider>
          <CurrencyProvider>
            <FinancialDataProvider>
              <SidebarProvider>
                <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black"></div>
                <div className="flex h-screen overflow-hidden">
                    <div className="hidden md:flex w-64 flex-col fixed inset-y-0 z-50">
                        <AppSidebar />
                    </div>
                    <main className="flex-1 md:pl-64 flex flex-col overflow-y-auto h-full relative">
                        {children}
                    </main>
                </div>
                <Toaster />
              </SidebarProvider>
            </FinancialDataProvider>
          </CurrencyProvider>
        </AuthProvider>
    );
}
