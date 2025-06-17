import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function BillsManager() {
  const [user, setUser] = useState<any>(null)
  const [bills, setBills] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const [newBill, setNewBill] = useState({
    name: '',
    description: '',
    payment_method: '',
  })

  const [shareEmail, setShareEmail] = useState('')
  const [selectedBill, setSelectedBill] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        window.location.href = '/login'
      } else {
        setUser(user)
      }
    })
  }, [])

  useEffect(() => {
    if (!user) return
    const fetchBills = async () => {
      const { data, error } = await supabase
        .from('bills')
        .select('*, bill_users!inner(user_id)')
        .eq('bill_users.user_id', user.id)
      
      if (error) console.error('Fetch bills error:', error)
      else setBills(data || [])
      setLoading(false)
    }
    fetchBills()
  }, [user])

  const handleCreateBill = async () => {
    if (!newBill.name) return alert('Bill name is required.')

    const { data: bill, error: billError } = await supabase
      .from('bills')
      .insert([newBill])
      .select()
      .single()

    if (billError) return console.error(billError)

    const { error: linkError } = await supabase.from('bill_users').insert([
      {
        bill_id: bill.id,
        user_id: user.id,
        role: 'owner',
      },
    ])

    if (linkError) {
      console.error(linkError)
      return
    }

    setBills([...bills, bill])
    setNewBill({ name: '', description: '', payment_method: '' })
  }

  const handleShare = async () => {
    if (!selectedBill || !shareEmail) return

    const { data: targetUser, error: userError } = await supabase
      .from('users')
      .select('id, email')
      .eq('email', shareEmail)
      .single()

    if (userError || !targetUser) {
      alert("User not found or hasn't signed in yet.")
      return
    }

    const { error: shareError } = await supabase.from('bill_users').insert([
      {
        bill_id: selectedBill.id,
        user_id: targetUser.id,
        role: 'viewer',
      },
    ])

    if (shareError) {
      console.error(shareError)
      alert('Error sharing bill')
    } else {
      alert(`Shared with ${shareEmail}`)
      setShareEmail('')
      setSelectedBill(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-neonBlue"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">💸 My Bills</h1>
          <button
            onClick={() => supabase.auth.signOut()}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Sign Out
          </button>
        </div>

        <div className="bg-black/40 backdrop-blur-md p-6 rounded-xl shadow-neon border border-neonBlue/20 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Name"
              value={newBill.name}
              onChange={(e) => setNewBill({ ...newBill, name: e.target.value })}
              className="p-3 rounded-lg bg-black/50 border border-neonBlue/20 text-white focus:border-neonBlue focus:ring-1 focus:ring-neonBlue"
            />
            <input
              type="text"
              placeholder="Description"
              value={newBill.description}
              onChange={(e) => setNewBill({ ...newBill, description: e.target.value })}
              className="p-3 rounded-lg bg-black/50 border border-neonBlue/20 text-white focus:border-neonBlue focus:ring-1 focus:ring-neonBlue"
            />
            <input
              type="text"
              placeholder="Payment method"
              value={newBill.payment_method}
              onChange={(e) => setNewBill({ ...newBill, payment_method: e.target.value })}
              className="p-3 rounded-lg bg-black/50 border border-neonBlue/20 text-white focus:border-neonBlue focus:ring-1 focus:ring-neonBlue"
            />
          </div>
          <button
            onClick={handleCreateBill}
            className="mt-4 w-full bg-neonGreen text-background px-4 py-3 rounded-lg font-semibold hover:bg-neonGreen/90 transition-colors"
          >
            ➕ Add Bill
          </button>
        </div>

        <div className="space-y-4">
          {bills.map((bill) => (
            <div
              key={bill.id}
              className="bg-black/40 backdrop-blur-md p-6 rounded-xl shadow-neon border border-neonBlue/20"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-neonBlue">{bill.name}</h3>
                  <p className="text-mutedText mt-1">{bill.description}</p>
                  <p className="text-sm mt-2">Method: {bill.payment_method}</p>
                </div>
                <button
                  onClick={() => setSelectedBill(bill)}
                  className="bg-neonBlue text-background px-4 py-2 rounded-lg hover:bg-neonBlue/90 transition-colors"
                >
                  🔗 Share
                </button>
              </div>
            </div>
          ))}
        </div>

        {selectedBill && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-black/80 p-6 rounded-xl shadow-neon border border-neonBlue/20 max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4 text-neonBlue">
                Share "{selectedBill.name}"
              </h3>
              <input
                type="email"
                placeholder="Enter email to share with"
                value={shareEmail}
                onChange={(e) => setShareEmail(e.target.value)}
                className="w-full p-3 rounded-lg bg-black/50 border border-neonBlue/20 text-white focus:border-neonBlue focus:ring-1 focus:ring-neonBlue mb-4"
              />
              <div className="flex space-x-4">
                <button
                  onClick={handleShare}
                  className="flex-1 bg-neonBlue text-background px-4 py-3 rounded-lg font-semibold hover:bg-neonBlue/90 transition-colors"
                >
                  Share
                </button>
                <button
                  onClick={() => setSelectedBill(null)}
                  className="flex-1 bg-red-500/20 text-red-400 px-4 py-3 rounded-lg font-semibold hover:bg-red-500/30 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
