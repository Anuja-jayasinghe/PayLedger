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
    // If user already logged in, redirect to dashboard
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        window.location.href = '/dashboard'
      }
    })
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-white">
      <button
        onClick={handleLogin}
        className="bg-white text-black px-4 py-2 rounded font-semibold shadow hover:bg-gray-200"
      >
        Sign in with Google
      </button>
    </div>
  )
}
