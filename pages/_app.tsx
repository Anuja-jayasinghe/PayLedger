import '@/styles/globals.css'; // or '../styles/globals.css'
import type { AppProps } from "next/app";
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Define protected routes
    const protectedRoutes = ['/dashboard', '/billmanager', '/transactions'];
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && protectedRoutes.includes(router.pathname)) {
        router.push('/login');
      } else if (session && router.pathname === '/login') {
        router.push('/dashboard');
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && protectedRoutes.includes(router.pathname)) {
        router.push('/login');
      } else if (session && router.pathname === '/login') {
        router.push('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [router.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neonBlue"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>PayLedger - Simple Bill Management</title>
        <meta
          name="description"
          content="Never miss a bill again. Simple, beautiful bill management that actually works. Track payments, view spending habits, and share monthly summaries."
        />
        <meta name="author" content="Anuja Jayasinghe" />
        <meta
          name="keywords"
          content="PayLedger, bill management, payment tracker, finance, personal finance, spending tracker, budget"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />

        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="PayLedger - Simple Bill Management" />
        <meta
          property="og:description"
          content="Never miss a bill again. Simple, beautiful bill management that actually works."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://payledger.anujajay.com" />
        <meta property="og:image" content="https://payledger.anujajay.com/logo.png" />
        <meta property="og:site_name" content="PayLedger" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="PayLedger - Simple Bill Management" />
        <meta
          name="twitter:description"
          content="Never miss a bill again. Simple, beautiful bill management that actually works."
        />
        <meta name="twitter:image" content="https://payledger.anujajay.com/logo.png" />

        {/* Additional Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#14F195" />
      </Head>
      <div className="min-h-screen bg-background">
        <Component {...pageProps} />
      </div>
    </>
  );
}
