
"use client";

import { WifiOff } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
      <WifiOff className="h-24 w-24 text-muted-foreground mb-6" />
      <h1 className="text-4xl font-bold mb-2">You're Offline</h1>
      <p className="text-lg text-muted-foreground mb-8 max-w-md">
        It looks like you've lost your connection. This app has limited functionality while offline, but you can still view pages you've already visited.
      </p>
      <p className="text-sm text-muted-foreground">
        Please check your internet connection and try again.
      </p>
    </div>
  );
}
