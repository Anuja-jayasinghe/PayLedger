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
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session && router.pathname !== '/login') {
        router.push('/login');
      } else if (session && router.pathname === '/login') {
        router.push('/dashboard');
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && router.pathname !== '/login') {
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
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </Head>
      <div className="min-h-screen bg-background">
        <Component {...pageProps} />
      </div>
    </>
  );
}
