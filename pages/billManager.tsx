"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/router"
import { Plus, CreditCard, Calendar, FileText, DollarSign, X, Check, ArrowLeft } from "lucide-react"

interface Bill {
  id: string
  name: string
  description: string
  payment_method: string
}

export default function BillManager() {
  const [bills, setBills] = useState<Bill[]>([])
  const [selectedBillId, setSelectedBillId] = useState("")
  const [amount, setAmount] = useState("")
  const [date, setDate] = useState("")
  const [accountNumber, setAccountNumber] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        router.push("/login")
        return
      }

      setUserId(user.id)

      const { data, error } = await supabase
        .from("bill_users")
        .select("bill_id, bills ( id, name, description, payment_method )")
        .eq("user_id", user.id)

      if (error) {
        console.error("Failed to fetch bills:", error)
        return
      }

      const flatBills = data.map((record: any) => record.bills)
      setBills(flatBills)
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (!selectedBillId) return
    const selectedBill = bills.find((b) => b.id === selectedBillId)
    if (selectedBill && (selectedBill as any).account_number) {
      setAccountNumber((selectedBill as any).account_number)
    }
  }, [selectedBillId, bills])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId || !selectedBillId) return

    const selectedBill = bills.find((b) => b.id === selectedBillId)
    const paidDate = new Date(date)
    const month = paidDate.getMonth() + 1
    const year = paidDate.getFullYear()

    setLoading(true)

    const { error } = await supabase.from("payments").insert({
      user_id: userId,
      bill_type: selectedBill?.name || "",
      amount: Number.parseFloat(amount),
      paid_on: date,
      month,
      year,
      notes,
      account_number: accountNumber,
    })

    setLoading(false)

    if (error) {
      alert("Failed to add payment: " + error.message)
    } else {
      alert("Payment added successfully!")
      router.push("/dashboard")
    }
  }

  const handleAddBill = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const form = e.currentTarget as HTMLFormElement
    const formData = new FormData(form)

    const name = formData.get("name")?.toString().trim()
    const description = formData.get("description")?.toString().trim()
    const payment_method = formData.get("payment_method")?.toString().trim()
    const account_number = formData.get("account_number")?.toString().trim()

    if (!userId || !name) {
      setIsSubmitting(false)
      return
    }

    const { data: newBill, error: billError } = await supabase
      .from("bills")
      .insert({ name, description, payment_method })
      .select()
      .single()

    if (billError || !newBill) {
      alert("Failed to add bill: " + billError?.message)
      setIsSubmitting(false)
      return
    }

    const { error: linkError } = await supabase.from("bill_users").insert({
      bill_id: newBill.id,
      user_id: userId,
    })

    if (linkError) {
      alert("Failed to assign bill to user: " + linkError.message)
      setIsSubmitting(false)
      return
    }

    setBills([...bills, newBill])
    setSelectedBillId(newBill.id)
    if (account_number) setAccountNumber(account_number)

    alert("Bill added successfully!")
    setIsModalOpen(false)
    setIsSubmitting(false)
    form.reset()
  }

  return (
    <div className="min-h-screen bg-background text-white">
      {/* Header */}
      <div className="bg-black/20 border-b border-neonBlue/20">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex items-center space-x-2 text-mutedText hover:text-neonBlue transition-colors duration-300 group"
              >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                <span>Back to Dashboard</span>
              </button>
            </div>
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-neonBlue to-neonGreen bg-clip-text text-transparent">
                Add Payment
              </h1>
              <p className="text-mutedText text-sm mt-1">Record a new bill payment</p>
            </div>
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Add New Bill Button */}
        <div className="mb-8">
          <button
            onClick={() => setIsModalOpen(true)}
            className="group bg-gradient-to-r from-neonGreen to-neonBlue text-background px-6 py-3 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-neon hover:shadow-neonGreen flex items-center space-x-3"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span>Add New Bill Type</span>
          </button>
        </div>

        {/* Main Form */}
        <div className="bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-neonBlue/20 shadow-neon">
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-neonBlue/20 p-3 rounded-lg">
              <CreditCard className="w-6 h-6 text-neonBlue" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Payment Details</h2>
              <p className="text-mutedText text-sm">Enter your bill payment information</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Bill Type Selection */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium">
                <FileText className="w-4 h-4 text-neonBlue" />
                <span>Bill Type</span>
              </label>
              <div className="relative">
                <select
                  value={selectedBillId}
                  onChange={(e) => setSelectedBillId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-neonBlue/30 focus:border-neonBlue focus:outline-none focus:ring-2 focus:ring-neonBlue/20 text-white font-medium transition-all duration-300 appearance-none cursor-pointer"
                  required
                >
                  <option value="" className="bg-black text-mutedText">
                    Select a bill type
                  </option>
                  {bills.map((bill) => (
                    <option key={bill.id} value={bill.id} className="bg-black text-white">
                      {bill.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <svg className="w-5 h-5 text-neonBlue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium">
                <DollarSign className="w-4 h-4 text-neonGreen" />
                <span>Amount (Rs)</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-neonGreen/30 focus:border-neonGreen focus:outline-none focus:ring-2 focus:ring-neonGreen/20 text-white transition-all duration-300"
                required
              />
            </div>

            {/* Date */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium">
                <Calendar className="w-4 h-4 text-neonBlue" />
                <span>Payment Date</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-neonBlue/30 focus:border-neonBlue focus:outline-none focus:ring-2 focus:ring-neonBlue/20 text-white transition-all duration-300"
                required
              />
            </div>

            {/* Bill Description (Read-only) */}
            {selectedBillId && (
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium">
                  <FileText className="w-4 h-4 text-yellow-400" />
                  <span>Bill Details</span>
                </label>
                <div className="px-4 py-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-100">
                  {bills.find((b) => b.id === selectedBillId)?.description || "No description available"}
                </div>
              </div>
            )}

            {/* Notes */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium">
                <FileText className="w-4 h-4 text-mutedText" />
                <span>Additional Notes</span>
                <span className="text-xs text-mutedText">(Optional)</span>
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any additional notes about this payment..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20 focus:border-neonBlue focus:outline-none focus:ring-2 focus:ring-neonBlue/20 text-white transition-all duration-300 resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-neonBlue to-neonGreen text-background px-6 py-4 rounded-xl font-bold text-lg shadow-neon hover:shadow-neonGreen hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-3"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                    <span>Saving Payment...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Save Payment</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Add Bill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-black/90 backdrop-blur-md border border-neonGreen/30 rounded-2xl p-8 max-w-md w-full shadow-neonGreen">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-neonGreen/20 p-2 rounded-lg">
                  <Plus className="w-5 h-5 text-neonGreen" />
                </div>
                <h2 className="text-xl font-bold">Add New Bill Type</h2>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-mutedText hover:text-white transition-colors duration-300 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddBill} className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">Bill Name *</label>
                <input
                  name="name"
                  placeholder="e.g., Ceylon Electricity Board"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-neonGreen/30 focus:border-neonGreen focus:outline-none focus:ring-2 focus:ring-neonGreen/20 text-white transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Description</label>
                <input
                  name="description"
                  placeholder="e.g., Monthly electricity bill for home"
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20 focus:border-neonGreen focus:outline-none focus:ring-2 focus:ring-neonGreen/20 text-white transition-all duration-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">Payment Method</label>
                <input
                  name="payment_method"
                  placeholder="e.g., Online Banking, Cash, Card"
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-white/20 focus:border-neonGreen focus:outline-none focus:ring-2 focus:ring-neonGreen/20 text-white transition-all duration-300"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors duration-300 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-neonGreen to-neonBlue text-background font-bold hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                      <span>Adding...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Add Bill</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
