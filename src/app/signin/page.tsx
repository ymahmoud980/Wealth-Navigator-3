
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039L38.804 8.841C34.524 4.931 29.637 2.5 24 2.5C11.318 2.5 2.5 11.318 2.5 24s8.818 21.5 21.5 21.5S45.5 36.682 45.5 24c0-1.543-.146-3.045-.41-4.484z"/>
      <path fill="#FF3D00" d="M6.306 14.691c-1.645 3.118-2.655 6.64-2.655 10.309c0 3.669 1.01 7.191 2.655 10.309L15.17 31.39C13.2 28.525 12.5 25.13 12.5 21.5s.7-7.025 2.67-9.81L6.306 14.691z"/>
      <path fill="#4CAF50" d="M24 45.5c5.637 0 10.524-2.431 14.804-6.359L31.83 31.391c-1.921 1.745-4.425 2.81-7.33 2.81c-4.478 0-8.29-2.735-9.81-6.691l-8.864 6.957C9.306 39.809 16.035 45.5 24 45.5z"/>
      <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.238-2.24 4.168-4.087 5.571l7.33 5.793c4.131-3.891 6.456-9.47 6.456-15.864c0-1.543-.146-3.045-.41-4.484z"/>
    </svg>
);

export default function SignInPage() {
  const { user, signInWithGoogle, loading } = useAuth();
  const router = useRouter();
  const [isSigningIn, setIsSigningIn] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.push('/');
    }
  }, [user, loading, router]);

  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
      // The useEffect will handle the redirect
    } catch (error) {
      console.error("Google sign-in failed", error);
      // Handle error, maybe show a toast
    } finally {
      setIsSigningIn(false);
    }
  };

  if (loading || user) {
      return (
        <div className="flex justify-center items-center h-screen">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
             <div className="bg-primary text-primary-foreground p-3 rounded-full">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8"
                >
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                </svg>
             </div>
          </div>
          <CardTitle>Welcome to Wealth Navigator</CardTitle>
          <CardDescription>
            Sign in with your Google account to securely access and sync your financial data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleSignIn} disabled={isSigningIn} className="w-full">
            {isSigningIn ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : <GoogleIcon />}
            {isSigningIn ? 'Redirecting...' : 'Sign In with Google'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
