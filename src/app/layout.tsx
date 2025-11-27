import "./globals.css";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { FinancialDataProvider } from "@/contexts/FinancialDataContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { Sidebar } from "@/components/ui/sidebar"; 

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Wealth Navigator",
  description: "Personal Wealth Management",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${mono.variable} font-sans antialiased min-h-screen bg-[#020817]`}>
        
        <AuthProvider>
          <FinancialDataProvider>
            
            <div className="relative h-full min-h-screen">
              
              {/* SIDEBAR */}
              <div className="fixed inset-y-0 left-0 z-50 w-64 h-full border-r border-white/10 bg-[#111827]">
                 <Sidebar />
              </div>

              {/* CONTENT */}
              <main className="pl-64 h-full min-h-screen relative">
                {children}
              </main>

            </div>

            <Toaster />
          </FinancialDataProvider>
        </AuthProvider>

      </body>
    </html>
  );
}