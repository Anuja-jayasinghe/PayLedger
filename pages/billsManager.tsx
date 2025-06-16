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
        .eq('bill_users.user_id', user.id);
      
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
      .from('users') // Supabase auth users table
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

  if (loading) return <p className="text-white p-4">Loading bills...</p>

  return (
    <div className="text-white bg-background p-4 rounded shadow max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">💸 My Bills</h2>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Name"
          value={newBill.name}
          onChange={(e) => setNewBill({ ...newBill, name: e.target.value })}
          className="mr-2 px-2 py-1 rounded bg-black text-white border"
        />
        <input
          type="text"
          placeholder="Description"
          value={newBill.description}
          onChange={(e) => setNewBill({ ...newBill, description: e.target.value })}
          className="mr-2 px-2 py-1 rounded bg-black text-white border"
        />
        <input
          type="text"
          placeholder="Payment method"
          value={newBill.payment_method}
          onChange={(e) => setNewBill({ ...newBill, payment_method: e.target.value })}
          className="mr-2 px-2 py-1 rounded bg-black text-white border"
        />
        <button
          onClick={handleCreateBill}
          className="bg-green-600 px-3 py-1 rounded hover:bg-green-500"
        >
          ➕ Add Bill
        </button>
      </div>

      <ul className="space-y-2">
        {bills.map((bill) => (
          <li
            key={bill.id}
            className="p-3 bg-black border border-gray-700 rounded flex justify-between items-center"
          >
            <div>
              <div className="font-semibold">{bill.name}</div>
              <div className="text-sm text-gray-400">{bill.description}</div>
              <div className="text-sm">Method: {bill.payment_method}</div>
            </div>
            <button
              onClick={() => setSelectedBill(bill)}
              className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-500 text-sm"
            >
              🔗 Share
            </button>
          </li>
        ))}
      </ul>

      {selectedBill && (
        <div className="mt-6 bg-black border border-gray-700 p-4 rounded">
          <h3 className="text-lg font-semibold mb-2">Share "{selectedBill.name}"</h3>
          <input
            type="email"
            placeholder="Enter email to share with"
            value={shareEmail}
            onChange={(e) => setShareEmail(e.target.value)}
            className="mr-2 px-2 py-1 rounded bg-black text-white border"
          />
          <button
            onClick={handleShare}
            className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-500"
          >
            Share
          </button>
        </div>
      )}
    </div>
  )
}
