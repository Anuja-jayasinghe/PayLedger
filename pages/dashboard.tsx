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
    <div className="p-4 text-white bg-background min-h-screen max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Welcome, {user?.email}</h1>

      <div className="bg-gray-900 p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">Add Payment</h2>

        <label className="block mb-2">
          Bill Type:
          <select
            className="w-full mt-1 text-black p-2 rounded"
            onChange={e => handleBillSelect(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>Select a bill</option>
            {bills.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        </label>

        <button
          onClick={() => setShowNewBillForm(!showNewBillForm)}
          className="text-blue-400 underline text-sm mb-4"
        >
          {showNewBillForm ? 'Cancel' : 'Add new bill type'}
        </button>

        {showNewBillForm && (
          <div className="bg-gray-800 p-3 rounded mb-4">
            <input
              placeholder="Name"
              className="w-full p-2 my-1 rounded text-black"
              value={newBill.name}
              onChange={e => setNewBill({ ...newBill, name: e.target.value })}
            />
            <input
              placeholder="Description"
              className="w-full p-2 my-1 rounded text-black"
              value={newBill.description}
              onChange={e => setNewBill({ ...newBill, description: e.target.value })}
            />
            <input
              placeholder="Payment Method"
              className="w-full p-2 my-1 rounded text-black"
              value={newBill.paymentMethod}
              onChange={e => setNewBill({ ...newBill, paymentMethod: e.target.value })}
            />
            <button onClick={handleAddNewBill} className="mt-2 bg-green-600 px-3 py-1 rounded">
              Save Bill
            </button>
          </div>
        )}

        <label className="block mb-2">
          Date:
          <input
            type="date"
            className="w-full p-2 mt-1 text-black rounded"
            value={formData.date}
            onChange={e => setFormData({ ...formData, date: e.target.value })}
          />
        </label>

        <label className="block mb-2">
          Description:
          <input
            type="text"
            className="w-full p-2 mt-1 text-black rounded"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
        </label>

        <label className="block mb-2">
          Amount:
          <input
            type="number"
            className="w-full p-2 mt-1 text-black rounded"
            value={formData.amount}
            onChange={e => setFormData({ ...formData, amount: e.target.value })}
          />
        </label>

        <label className="block mb-4">
          Payment Method:
          <input
            type="text"
            className="w-full p-2 mt-1 text-black rounded"
            value={formData.paymentMethod}
            onChange={e => setFormData({ ...formData, paymentMethod: e.target.value })}
          />
        </label>

        <button
          onClick={handleSubmit}
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500"
        >
          Submit Payment
        </button>
      </div>
    </div>
  )
}
