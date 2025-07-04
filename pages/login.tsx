import { useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Login() {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    })
    if (error) console.error(error)
  }

  useEffect(() => {
    // If user already logged in, redirect to home
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        window.location.href = '/dashboard'
      }
    })
  }, [])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-white">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">PayLedger</h1>
        <p className="text-mutedText">Your personal finance companion</p>
      </div>
      
      <button
        onClick={handleLogin}
        className="bg-neonBlue text-background px-8 py-3 rounded-lg font-semibold shadow-neon hover:bg-neonBlue/90 transition-colors flex items-center space-x-2"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        <span>Sign in with Google</span>
      </button>

      <div className="flex items-center gap-4 mt-6">
        <button
          onClick={() => (window.location.href = "/")}
          className="bg-white/10 text-white px-6 py-2 rounded-md font-medium text-sm hover:bg-white/20 transition-colors"
        >
          Go to Home
        </button>
        <a
          href="https://payledger.anujajay.com/public-dashboard?token=demo-dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-neonGreen/10 text-neonGreen px-6 py-2 rounded-md font-medium text-sm hover:bg-neonGreen/20 transition-colors"
        >
          View Demo
        </a>
      </div>
    </div>
  )
}
