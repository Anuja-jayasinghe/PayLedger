import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [bills, setBills] = useState<any[]>([])
  const [selectedBill, setSelectedBill] = useState<any | null>(null)
  const [formData, setFormData] = useState({
    date: new Date().toISOString().slice(0, 10),
    description: '',
    amount: '',
    paymentMethod: '',
  })
  const [newBill, setNewBill] = useState({
    name: '',
    description: '',
    paymentMethod: '',
  })
  const [showNewBillForm, setShowNewBillForm] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        window.location.href = '/login'
      } else {
        setUser(user)
        fetchBills()
      }
    })
  }, [])

  const fetchBills = async () => {
    const { data, error } = await supabase.from('bills').select('*')
    if (data) setBills(data)
  }

  const handleBillSelect = (id: string) => {
    const bill = bills.find(b => b.id === id)
    if (bill) {
      setSelectedBill(bill)
      setFormData({
        ...formData,
        description: bill.description,
        paymentMethod: bill.paymentMethod,
      })
    }
  }

  const handleAddNewBill = async () => {
    const { data, error } = await supabase
      .from('bills')
      .insert([newBill])
      .select()

    if (data) {
      setBills([...bills, data[0]])
      setShowNewBillForm(false)
      setNewBill({ name: '', description: '', paymentMethod: '' })
    }
  }

  const handleSubmit = async () => {
    const { error } = await supabase.from('payments').insert([
      {
        user_id: user.id,
        ...formData,
        bill_id: selectedBill?.id || null,
      },
    ])
    if (!error) alert('Payment added!')
  }

  return (
    <div className="min-h-screen bg-background text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Welcome, {user?.email}</h1>
          <button
            onClick={() => supabase.auth.signOut()}
            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
          >
            Sign Out
          </button>
        </div>

        <div className="bg-black/40 backdrop-blur-md p-6 rounded-xl shadow-neon border border-neonBlue/20">
          <h2 className="text-xl font-semibold mb-6 text-neonBlue">Add Payment</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-mutedText mb-2">Bill Type</label>
              <select
                className="w-full p-3 rounded-lg bg-black/50 border border-neonBlue/20 text-white focus:border-neonBlue focus:ring-1 focus:ring-neonBlue"
                onChange={e => handleBillSelect(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>Select a bill</option>
                {bills.map(b => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowNewBillForm(!showNewBillForm)}
              className="text-neonBlue hover:text-neonBlue/80 transition-colors text-sm"
            >
              {showNewBillForm ? 'Cancel' : '+ Add new bill type'}
            </button>

            {showNewBillForm && (
              <div className="bg-black/30 p-4 rounded-lg border border-neonBlue/20">
                <div className="space-y-3">
                  <input
                    placeholder="Name"
                    className="w-full p-3 rounded-lg bg-black/50 border border-neonBlue/20 text-white focus:border-neonBlue focus:ring-1 focus:ring-neonBlue"
                    value={newBill.name}
                    onChange={e => setNewBill({ ...newBill, name: e.target.value })}
                  />
                  <input
                    placeholder="Description"
                    className="w-full p-3 rounded-lg bg-black/50 border border-neonBlue/20 text-white focus:border-neonBlue focus:ring-1 focus:ring-neonBlue"
                    value={newBill.description}
                    onChange={e => setNewBill({ ...newBill, description: e.target.value })}
                  />
                  <input
                    placeholder="Payment Method"
                    className="w-full p-3 rounded-lg bg-black/50 border border-neonBlue/20 text-white focus:border-neonBlue focus:ring-1 focus:ring-neonBlue"
                    value={newBill.paymentMethod}
                    onChange={e => setNewBill({ ...newBill, paymentMethod: e.target.value })}
                  />
                  <button 
                    onClick={handleAddNewBill} 
                    className="w-full bg-neonGreen text-background px-4 py-3 rounded-lg font-semibold hover:bg-neonGreen/90 transition-colors"
                  >
                    Save Bill
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-mutedText mb-2">Date</label>
                <input
                  type="date"
                  className="w-full p-3 rounded-lg bg-black/50 border border-neonBlue/20 text-white focus:border-neonBlue focus:ring-1 focus:ring-neonBlue"
                  value={formData.date}
                  onChange={e => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-mutedText mb-2">Description</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg bg-black/50 border border-neonBlue/20 text-white focus:border-neonBlue focus:ring-1 focus:ring-neonBlue"
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-mutedText mb-2">Amount</label>
                <input
                  type="number"
                  className="w-full p-3 rounded-lg bg-black/50 border border-neonBlue/20 text-white focus:border-neonBlue focus:ring-1 focus:ring-neonBlue"
                  value={formData.amount}
                  onChange={e => setFormData({ ...formData, amount: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-mutedText mb-2">Payment Method</label>
                <input
                  type="text"
                  className="w-full p-3 rounded-lg bg-black/50 border border-neonBlue/20 text-white focus:border-neonBlue focus:ring-1 focus:ring-neonBlue"
                  value={formData.paymentMethod}
                  onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-neonBlue text-background px-4 py-3 rounded-lg font-semibold hover:bg-neonBlue/90 transition-colors"
            >
              Submit Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
