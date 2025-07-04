"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/router"
import {
  Plus,
  CreditCard,
  Calendar,
  FileText,
  DollarSign,
  X,
  Check,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

interface Bill {
  id: string
  name: string
  description: string
  payment_method: string
}

interface Notification {
  id: string
  type: "success" | "error"
  title: string
  message: string
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
  const [notifications, setNotifications] = useState<Notification[]>([])

  const [moneyReceived, setMoneyReceived] = useState("")
  const [moneyReceivedMonth, setMoneyReceivedMonth] = useState(new Date().getMonth() + 1)
  const [moneyReceivedYear, setMoneyReceivedYear] = useState(new Date().getFullYear())
  const [isSavingMoney, setIsSavingMoney] = useState(false)

  const router = useRouter()

  // Notification functions
  const showNotification = (type: "success" | "error", title: string, message: string) => {
    const id = Date.now().toString()
    const notification = { id, type, title, message }
    setNotifications((prev) => [...prev, notification])

    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(id)
    }, 5000)
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

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
      showNotification("error", "Payment Failed", `Failed to add payment: ${error.message}`)
    } else {
      showNotification("success", "Payment Added", "Payment has been successfully recorded!")
      // Clear form
      setSelectedBillId("")
      setAmount("")
      setDate("")
      setNotes("")
      setAccountNumber("")
      // Navigate after a short delay to show the success message
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
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
      showNotification("error", "Bill Creation Failed", `Failed to add bill: ${billError?.message}`)
      setIsSubmitting(false)
      return
    }

    const { error: linkError } = await supabase.from("bill_users").insert({
      bill_id: newBill.id,
      user_id: userId,
    })

    if (linkError) {
      showNotification("error", "Bill Assignment Failed", `Failed to assign bill to user: ${linkError.message}`)
      setIsSubmitting(false)
      return
    }

    setBills([...bills, newBill])
    setSelectedBillId(newBill.id)
    if (account_number) setAccountNumber(account_number)

    showNotification("success", "Bill Added", `${name} has been successfully added to your bill types!`)
    setIsModalOpen(false)
    setIsSubmitting(false)
    form.reset()
  }

  const handleSaveMoneyReceived = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId || !moneyReceived) return

    setIsSavingMoney(true)

    const { error } = await supabase.from("monthly_finances").upsert(
      {
        user_id: userId,
        month: moneyReceivedMonth,
        year: moneyReceivedYear,
        money_received: Number.parseFloat(moneyReceived),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,month,year" },
    )

    setIsSavingMoney(false)

    if (error) {
      showNotification("error", "Save Failed", `Failed to save money received: ${error.message}`)
    } else {
      const monthName = new Date(0, moneyReceivedMonth - 1).toLocaleString("default", { month: "long" })
      showNotification(
        "success",
        "Money Received Saved",
        `Successfully recorded Rs. ${moneyReceived} for ${monthName} ${moneyReceivedYear}`,
      )
      setMoneyReceived("") // Reset form
    }
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
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full pl-4 pr-10 py-3 rounded-xl bg-black/60 border border-neonBlue/30 focus:border-neonBlue focus:outline-none focus:ring-2 focus:ring-neonBlue/20 text-white transition-all duration-300 appearance-none"
                  required
                />
                <style jsx>{`
                  input[type="date"]::-webkit-calendar-picker-indicator {
                    position: absolute;
                    right: 0;
                    top: 0;
                    width: 100%;
                    height: 100%;
                    padding: 0;
                    margin: 0;
                    opacity: 0;
                    cursor: pointer;
                  }
                `}</style>
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                  <Calendar className="w-5 h-5 text-neonBlue" />
                </div>
              </div>
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

        {/* Record Money Received Form */}
        <div className="mt-8 bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-neonGreen/20 shadow-neon">
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-neonGreen/20 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-neonGreen" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Record Money Received</h2>
              <p className="text-mutedText text-sm">Add the total money received for a month.</p>
            </div>
          </div>

          <form onSubmit={handleSaveMoneyReceived} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium">
                  <Calendar className="w-4 h-4 text-neonGreen" />
                  <span>Month</span>
                </label>
                <div className="relative">
                  <select
                    value={moneyReceivedMonth}
                    onChange={(e) => setMoneyReceivedMonth(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-neonGreen/30 focus:border-neonGreen focus:outline-none focus:ring-2 focus:ring-neonGreen/20 text-white font-medium transition-all duration-300 appearance-none cursor-pointer"
                    required
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1} className="bg-black text-white">
                        {new Date(0, i).toLocaleString("default", { month: "long" })}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-neonGreen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium">
                  <Calendar className="w-4 h-4 text-neonGreen" />
                  <span>Year</span>
                </label>
                <div className="relative">
                  <select
                    value={moneyReceivedYear}
                    onChange={(e) => setMoneyReceivedYear(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-neonGreen/30 focus:border-neonGreen focus:outline-none focus:ring-2 focus:ring-neonGreen/20 text-white font-medium transition-all duration-300 appearance-none cursor-pointer"
                    required
                  >
                    {[2023, 2024, 2025].map((y) => (
                      <option key={y} value={y} className="bg-black text-white">
                        {y}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-5 h-5 text-neonGreen" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium">
                <DollarSign className="w-4 h-4 text-neonGreen" />
                <span>Amount Received (Rs)</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={moneyReceived}
                onChange={(e) => setMoneyReceived(e.target.value)}
                placeholder="0.00"
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-neonGreen/30 focus:border-neonGreen focus:outline-none focus:ring-2 focus:ring-neonGreen/20 text-white transition-all duration-300"
                required
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSavingMoney}
                className="w-full bg-gradient-to-r from-neonGreen to-purple-500 text-background px-6 py-4 rounded-xl font-bold text-lg shadow-neon hover:shadow-neonGreen hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-3"
              >
                {isSavingMoney ? (
                  <>
                    <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Save Money Received</span>
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

      {/* Custom Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-3">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`max-w-sm w-full bg-black/90 backdrop-blur-md border rounded-2xl p-4 shadow-lg transform transition-all duration-300 animate-in slide-in-from-right ${
              notification.type === "success"
                ? "border-neonGreen/30 shadow-neonGreen/20"
                : "border-red-500/30 shadow-red-500/20"
            }`}
          >
            <div className="flex items-start space-x-3">
              <div
                className={`p-2 rounded-lg flex-shrink-0 ${
                  notification.type === "success" ? "bg-neonGreen/20" : "bg-red-500/20"
                }`}
              >
                {notification.type === "success" ? (
                  <CheckCircle className={`w-5 h-5 text-neonGreen`} />
                ) : (
                  <AlertCircle className={`w-5 h-5 text-red-400`} />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4
                  className={`text-sm font-semibold ${
                    notification.type === "success" ? "text-neonGreen" : "text-red-400"
                  }`}
                >
                  {notification.title}
                </h4>
                <p className="text-sm text-mutedText mt-1 leading-relaxed">{notification.message}</p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-mutedText hover:text-white transition-colors duration-300 p-1 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
