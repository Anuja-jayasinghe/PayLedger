// pages/billmanager.tsx
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/router'

interface Bill {
  id: string
  name: string
  description: string
  payment_method: string
}

export default function BillManager() {
  const [bills, setBills] = useState<Bill[]>([])
  const [selectedBillId, setSelectedBillId] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser()

      if (userError || !user) {
        router.push('/login')
        return
      }

      setUserId(user.id)

      const { data, error } = await supabase
        .from('bill_users')
        .select('bill_id, bills ( id, name, description, payment_method )')
        .eq('user_id', user.id)

      if (error) {
        console.error('Failed to fetch bills:', error)
        return
      }

      const flatBills = data.map((record: any) => record.bills)
      setBills(flatBills)
    }

    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId || !selectedBillId) return

    const selectedBill = bills.find(b => b.id === selectedBillId)
    const paidDate = new Date(date)
    const month = paidDate.getMonth() + 1
    const year = paidDate.getFullYear()

    setLoading(true)

    const { error } = await supabase.from('payments').insert({
      user_id: userId,
      bill_type: selectedBill?.name || '',
      amount: parseFloat(amount),
      paid_on: date,
      month,
      year,
      notes,
      account_number: accountNumber,
    })

    setLoading(false)

    if (error) {
      alert('Failed to add payment: ' + error.message)
    } else {
      alert('Payment added successfully!')
      router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen bg-background text-white py-16 px-4">
      <div className="max-w-xl mx-auto mb-6">
  <button
    onClick={() => {
      const dialog = document.getElementById('bill-modal') as HTMLDialogElement
      dialog?.showModal()
    }}
    className="bg-neonGreen text-black px-4 py-2 rounded hover:opacity-90 transition"
  >
    + Add New Bill
  </button>

  <dialog
    id="bill-modal"
    className="rounded-xl backdrop-blur-xl bg-background border border-white/10 p-6 max-w-md w-full text-white"
  >
    <form
      method="dialog"
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault()
        const form = e.currentTarget as HTMLFormElement
        const formData = new FormData(form)

        const name = formData.get('name')?.toString().trim()
        const description = formData.get('description')?.toString().trim()
        const payment_method = formData.get('payment_method')?.toString().trim()
        const account_number = formData.get('account_number')?.toString().trim()

        if (!userId || !name) return

        const { data: newBill, error: billError } = await supabase
          .from('bills')
          .insert({ name, description, payment_method })
          .select()
          .single()

        if (billError || !newBill) {
          alert('Failed to add bill: ' + billError?.message)
          return
        }

        const { error: linkError } = await supabase.from('bill_users').insert({
          bill_id: newBill.id,
          user_id: userId,
        })

        if (linkError) {
          alert('Failed to assign bill to user: ' + linkError.message)
          return
        }

        // Add bill + prefill account number if entered
        setBills([...bills, newBill])
        setSelectedBillId(newBill.id)
        if (account_number) setAccountNumber(account_number)

        alert('Bill added successfully!')
      }}
    >
      <h2 className="text-lg font-bold">Add New Bill</h2>

      <div>
        <label className="block text-sm mb-1">Bill Name</label>
        <input
          name="name"
          placeholder="e.g., Ceylon Electricity Board"
          required
          className="w-full bg-white/10 border border-white/20 px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Description</label>
        <input
          name="description"
          placeholder="e.g., House electricity bill"
          className="w-full bg-white/10 border border-white/20 px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Payment Method</label>
        <input
          name="payment_method"
          placeholder="e.g., Bank Transfer"
          className="w-full bg-white/10 border border-white/20 px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block text-sm mb-1">Account Number</label>
        <input
          name="account_number"
          placeholder="e.g., 123456789"
          className="w-full bg-white/10 border border-white/20 px-3 py-2 rounded"
        />
      </div>

      <div className="flex justify-end gap-4 pt-2">
        <button
          type="submit"
          className="bg-neonGreen text-black px-4 py-2 rounded hover:opacity-90"
        >
          Save
        </button>
        <button
          type="reset"
          onClick={() => (document.getElementById('bill-modal') as HTMLDialogElement)?.close()}
          className="bg-white/10 px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </form>
  </dialog>
</div>


      <div className="max-w-xl mx-auto bg-white/5 p-6 rounded-xl border border-white/10 backdrop-blur-lg">
        <h2 className="text-xl font-semibold mb-6">Add New Payment</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Bill Type</label>
            <select
              value={selectedBillId}
              onChange={(e) => setSelectedBillId(e.target.value)}
              className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 focus:outline-none"
              required
            >
              <option value="">Select a bill</option>
              {bills.map(bill => (
                <option key={bill.id} value={bill.id}>{bill.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Amount (Rs)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Paid On</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Account Number</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 rounded bg-white/10 border border-white/20 focus:outline-none"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-neonBlue text-black px-6 py-2 rounded hover:opacity-90 transition"
          >
            {loading ? 'Saving...' : 'Save Payment'}
          </button>
        </form>
      </div>
    </div>
  )
}
