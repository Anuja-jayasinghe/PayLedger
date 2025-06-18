import { supabase } from '@/lib/supabaseClient'
import Link from 'next/link'

export default function Header() {
    const handleLogout = async () => {
      await supabase.auth.signOut()
      window.location.href = '/login'
    }
  
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-neonBlue/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/dashboard" className="flex items-center space-x-2 text-neonBlue font-bold text-xl">
              <img src="/logo.png" alt="PayLedger Logo" className="w-8 h-8 object-contain" />
              <span>PayLedger</span>
            </Link>
  
            <button
              onClick={handleLogout}
              className="bg-white/10 hover:bg-white/20 border border-neonBlue text-neonBlue rounded-full p-2 transition"
              title="Sign out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 15l3-3m0 0l-3-3m3 3H9" />
              </svg>
            </button>
          </div>
        </div>
      </nav>
    )
  }
  