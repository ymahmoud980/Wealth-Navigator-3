"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Loader2, Lock, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Define User Type
interface User {
  uid: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string) => void; // Simplified login for stability
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Login Form State
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [error, setError] = useState("");

  // 1. Check for existing session on load
  useEffect(() => {
    const storedUser = localStorage.getItem("wealth_navigator_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // 2. Login Function
  const login = (email: string) => {
    // In a real app, validate password here. 
    // For now, we accept any password to ensure you get back in.
    const newUser = { uid: "user_v3_main", email };
    setUser(newUser);
    localStorage.setItem("wealth_navigator_user", JSON.stringify(newUser));
  };

  // 3. Logout Function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("wealth_navigator_user");
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !passwordInput) {
        setError("Please enter username and password.");
        return;
    }
    login(emailInput);
  };

  // --- RENDER LOGIC ---

  // A. Loading Screen
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#020817] text-white">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  // B. Login Screen (If not logged in, show this INSTEAD of the app)
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-[#0f172a] to-black p-4">
        <Card className="w-full max-w-md bg-white/5 border-white/10 backdrop-blur-md">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary/20 rounded-full">
                    <Lock className="h-8 w-8 text-primary" />
                </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-white">Wealth Navigator</CardTitle>
            <CardDescription className="text-center text-slate-400">
              Enter your credentials to access the vault
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input 
                  type="text" 
                  placeholder="Username / Email" 
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="bg-black/20 border-white/10 text-white"
                />
              </div>
              <div className="space-y-2">
                <Input 
                  type="password" 
                  placeholder="Password" 
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="bg-black/20 border-white/10 text-white"
                />
              </div>
              {error && <p className="text-sm text-red-400 text-center">{error}</p>}
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-black font-bold">
                <LogIn className="mr-2 h-4 w-4" /> Access Dashboard
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // C. The App (If logged in, show children)
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within AuthProvider");
  return context;
}