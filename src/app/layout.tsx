import "./globals.css";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { FinancialDataProvider } from "@/contexts/FinancialDataContext";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Wealth Navigator | Pro",
  description: "Advanced Personal Wealth Management System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${mono.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black"></div>
        
        {/* We use FinancialDataProvider directly here, NO AuthProvider needed for this version */}
        <FinancialDataProvider>
          <main className="flex-1 relative">
            {children}
          </main>
          <Toaster />
        </FinancialDataProvider>
      </body>
    </html>
  );
}