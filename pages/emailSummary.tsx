"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { supabase } from "@/lib/supabaseClient"
import emailjs from "@emailjs/browser"
import { Mail, Calendar, DollarSign, Send, ArrowLeft, CheckCircle, X, FileText, TrendingUp } from "lucide-react"

export default function EmailSummaryPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [recipient, setRecipient] = useState("")
  const [receivedAmount, setReceivedAmount] = useState("")
  const [month, setMonth] = useState<number>(new Date().getMonth()) // default to previous month
  const [year, setYear] = useState<number>(new Date().getFullYear())
  const [payments, setPayments] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      if (error || !user) return router.push("/login")
      setUserId(user.id)
    }

    fetchUser()
  }, [])

  useEffect(() => {
    if (!userId || !month || !year) return

    const fetchPayments = async () => {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .eq("user_id", userId)
        .eq("month", month)
        .eq("year", year)

      if (!error && data) {
        setPayments(data)
      }
    }

    fetchPayments()
  }, [userId, month, year])

  const sendEmail = async () => {
    setLoading(true)

    const grouped = payments.reduce(
      (acc, curr) => {
        const key = curr.bill_type
        if (!acc[key]) acc[key] = []
        acc[key].push(curr)
        return acc
      },
      {} as Record<string, any[]>,
    )

    const bill_summary = Object.entries(grouped)
      .map(([type, entries]) => {
        const lines = (entries as any[]).map((e) => `• ${e.account_number || "N/A"} - LKR ${e.amount}`).join("\n")
        return `\n${type}:\n${lines}`
      })
      .join("\n")

    const total = payments.reduce((sum, p) => sum + Number(p.amount), 0)
    const balance = Number(receivedAmount) - total

    try {
      await emailjs.send(
        "service_97v3ap7",
        "template_c7faikl",
        {
          to_email: recipient,
          subject: `Bill Summary for ${month}/${year}`,
          month_name: new Date(year, month - 1).toLocaleString("default", { month: "long" }),
          year: year.toString(),
          bill_summary,
          total: total.toFixed(2),
          received: Number(receivedAmount).toFixed(2),
          balance: balance.toFixed(2),
        },
        "hArF77Z5OPjhZiatw",
      )
      setShowSuccess(true)
    } catch (err) {
      console.error("EmailJS error:", err)
      alert("Failed to send email: " + JSON.stringify(err))
    }

    setLoading(false)
  }

  const total = payments.reduce((sum, p) => sum + Number(p.amount), 0)
  const balance = Number(receivedAmount) - total

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
                Monthly Summary
              </h1>
              <p className="text-mutedText text-sm mt-1">Send bill summary via email</p>
            </div>
            <div className="w-32"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Summary Preview Card */}
        {payments.length > 0 && receivedAmount && (
          <div className="mb-8 bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-neonGreen/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-neonGreen/20 p-2 rounded-lg">
                <TrendingUp className="w-5 h-5 text-neonGreen" />
              </div>
              <h3 className="text-lg font-semibold">Summary Preview</h3>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-neonBlue/10 p-4 rounded-xl">
                <p className="text-sm text-mutedText">Total Spent</p>
                <p className="text-xl font-bold text-neonBlue">LKR {total.toFixed(2)}</p>
              </div>
              <div className="bg-neonGreen/10 p-4 rounded-xl">
                <p className="text-sm text-mutedText">Received</p>
                <p className="text-xl font-bold text-neonGreen">LKR {Number(receivedAmount).toFixed(2)}</p>
              </div>
              <div className={`p-4 rounded-xl ${balance >= 0 ? "bg-green-500/10" : "bg-red-500/10"}`}>
                <p className="text-sm text-mutedText">Balance</p>
                <p className={`text-xl font-bold ${balance >= 0 ? "text-green-400" : "text-red-400"}`}>
                  LKR {balance.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Main Form */}
        <div className="bg-black/40 backdrop-blur-md p-8 rounded-2xl border border-neonBlue/20 shadow-neon">
          <div className="flex items-center space-x-3 mb-8">
            <div className="bg-neonBlue/20 p-3 rounded-lg">
              <Mail className="w-6 h-6 text-neonBlue" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Email Configuration</h2>
              <p className="text-mutedText text-sm">Configure your monthly bill summary email</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Recipient Email */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium">
                <Mail className="w-4 h-4 text-neonBlue" />
                <span>Recipient Email</span>
              </label>
              <input
                type="email"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="example@email.com"
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-neonBlue/30 focus:border-neonBlue focus:outline-none focus:ring-2 focus:ring-neonBlue/20 text-white transition-all duration-300"
                required
              />
            </div>

            {/* Month and Year Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="flex items-center space-x-2 text-sm font-medium">
                  <Calendar className="w-4 h-4 text-neonGreen" />
                  <span>Month</span>
                </label>
                <div className="relative">
                  <select
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-neonGreen/30 focus:border-neonGreen focus:outline-none focus:ring-2 focus:ring-neonGreen/20 text-white transition-all duration-300 appearance-none cursor-pointer"
                  >
                    {Array.from({ length: 12 }, (_, i) => (
                      <option key={i + 1} value={i + 1} className="bg-black">
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
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full px-4 py-3 rounded-xl bg-black/60 border border-neonGreen/30 focus:border-neonGreen focus:outline-none focus:ring-2 focus:ring-neonGreen/20 text-white transition-all duration-300 appearance-none cursor-pointer"
                  >
                    {[2023, 2024, 2025].map((yr) => (
                      <option key={yr} value={yr} className="bg-black">
                        {yr}
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

            {/* Money Received */}
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-medium">
                <DollarSign className="w-4 h-4 text-neonGreen" />
                <span>Money Received (LKR)</span>
              </label>
              <input
                type="number"
                step="0.01"
                value={receivedAmount}
                onChange={(e) => setReceivedAmount(e.target.value)}
                placeholder="e.g. 20000"
                className="w-full px-4 py-3 rounded-xl bg-black/60 border border-neonGreen/30 focus:border-neonGreen focus:outline-none focus:ring-2 focus:ring-neonGreen/20 text-white transition-all duration-300"
                required
              />
            </div>

            {/* Bills Found Info */}
            {payments.length > 0 && (
              <div className="bg-neonBlue/10 border border-neonBlue/30 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <FileText className="w-4 h-4 text-neonBlue" />
                  <span className="text-sm font-medium text-neonBlue">Bills Found</span>
                </div>
                <p className="text-sm text-mutedText">
                  Found {payments.length} payment{payments.length !== 1 ? "s" : ""} for{" "}
                  {new Date(year, month - 1).toLocaleString("default", { month: "long" })} {year}
                </p>
              </div>
            )}

            {/* Send Button */}
            <div className="pt-4">
              <button
                onClick={sendEmail}
                disabled={loading || !recipient || !receivedAmount}
                className="w-full bg-gradient-to-r from-neonBlue to-neonGreen text-background px-6 py-4 rounded-xl font-bold text-lg shadow-neon hover:shadow-neonGreen hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-3"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                    <span>Sending Email...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Summary Email</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-black/90 backdrop-blur-md border border-neonGreen/30 rounded-2xl p-8 max-w-md w-full shadow-neonGreen animate-in fade-in duration-300">
            <div className="text-center">
              <div className="bg-neonGreen/20 p-4 rounded-full w-fit mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-neonGreen" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Email Sent Successfully!</h3>
              <p className="text-mutedText mb-6">
                Your monthly bill summary has been sent to{" "}
                <span className="text-neonGreen font-medium">{recipient}</span>
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowSuccess(false)
                    router.push("/dashboard")
                  }}
                  className="w-full bg-gradient-to-r from-neonBlue to-neonGreen text-background px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all duration-300"
                >
                  Return to Dashboard
                </button>
                <button
                  onClick={() => setShowSuccess(false)}
                  className="w-full bg-white/10 hover:bg-white/20 px-6 py-3 rounded-xl font-medium transition-colors duration-300"
                >
                  Send Another Email
                </button>
              </div>
            </div>
            <button
              onClick={() => setShowSuccess(false)}
              className="absolute top-4 right-4 text-mutedText hover:text-white transition-colors duration-300 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
