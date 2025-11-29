"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, Building2, Wallet, ArrowRightLeft, Calculator, 
  BrainCircuit, LogOut, Activity, LineChart, FileText, Lightbulb, 
  FileBarChart
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";

const routes = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/", color: "text-sky-500" },
  { label: "Assets", icon: Building2, href: "/assets", color: "text-emerald-500" },
  { label: "Liabilities", icon: Wallet, href: "/liabilities", color: "text-rose-500" },
  { label: "Cash Flow", icon: ArrowRightLeft, href: "/cashflow", color: "text-violet-500" },
  { label: "Breakdown", icon: Calculator, href: "/breakdown", color: "text-orange-500" },
  { label: "Fin. Health", icon: Activity, href: "/health", color: "text-green-600" },
  { label: "Trends", icon: LineChart, href: "/trends", color: "text-blue-400" },
  { label: "Calculator", icon: Calculator, href: "/calculator", color: "text-yellow-500" },
  { label: "AI Advisor", icon: BrainCircuit, href: "/advisor", color: "text-pink-700" },
  { label: "Insights", icon: Lightbulb, href: "/insights", color: "text-amber-400" },
  { label: "Reports", icon: FileBarChart, href: "/report", color: "text-indigo-400" },
  { label: "Documents", icon: FileText, href: "/documents", color: "text-slate-400" },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white border-r border-white/10">
      <div className="px-3 py-2 flex-1 overflow-y-auto custom-scrollbar">
        <Link href="/" className="flex items-center pl-3 mb-10">
           <div className="h-8 w-8 mr-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center font-bold">W</div>
           <h1 className="text-2xl font-bold">Wealth Nav</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href ? "text-white bg-white/10" : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="px-3 py-2 border-t border-white/10 pt-4 bg-[#0f172a]/50">
        <Button onClick={logout} variant="ghost" className="w-full justify-start text-zinc-400 hover:text-red-400 hover:bg-white/10">
            <LogOut className="h-5 w-5 mr-3" /> Logout
        </Button>
      </div>
    </div>
  );
}