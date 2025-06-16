import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        window.location.href = '/login'
      } else {
        setUser(user)
      }
    })
  }, [])

  return (
    <div className="p-4 text-white bg-background min-h-screen">
      <h1 className="text-xl font-bold mb-2">Welcome, {user?.email}</h1>
      {/* Add your dashboard components here */}
    </div>
  )
}
