
"use client";

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { AppHeader } from '@/components/AppHeader';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { FinancialDataProvider } from '@/contexts/FinancialDataContext';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext';
import OfflinePage from './_offline';

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
                <AppSidebar />
                <SidebarInset className="min-h-screen">
                  <AppHeader />
                  <main className="p-4 md:p-6 lg:p-8">
                    {typeof navigator !== 'undefined' && !navigator.onLine ? <OfflinePage /> : children}
                  </main>
                </SidebarInset>
              </SidebarProvider>
            </FinancialDataProvider>
          </CurrencyProvider>
        </AuthProvider>
    );
}
