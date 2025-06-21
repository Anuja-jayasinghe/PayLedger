"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Line, Pie, Chart as ChartJSComponent } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  PieChart,
  BarChart3,
  LineChart,
  History,
  Mail,
  Calendar,
  DollarSign,
  Save,
  Github,
} from "lucide-react"

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend)

interface Payment {
  id: string
  user_id: string
  bill_type: string
  amount: number
  month: number
  year: number
  paid_on: string
  notes: string
  account_number: string
  created_at: string
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
]

export default function Dashboard() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [chartType, setChartType] = useState<"bar" | "line" | "pie">("bar")

  const [moneyReceived, setMoneyReceived] = useState<number>(0)
  const [loadingMoneyReceived, setLoadingMoneyReceived] = useState(false)

  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const fetchUserAndPayments = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) {
        console.error("User fetch error:", userError.message)
        return
      }
      if (!user) return

      setUserId(user.id)

      const { data, error } = await supabase.from("payments").select("*").eq("user_id", user.id)

      if (error) {
        console.error("Payments fetch error:", error.message)
      } else if (data && data.length > 0) {
        setPayments(data)

        const latest = data.reduce((max, curr) => {
          if (curr.year > max.year || (curr.year === max.year && curr.month > max.month)) {
            return curr
          }
          return max
        }, data[0])
        setSelectedMonthIndex(latest.month - 1)
        setSelectedYear(latest.year)
      }
    }

    fetchUserAndPayments()
  }, [])

  useEffect(() => {
    if (!userId) return

    const fetchMoneyReceived = async () => {
      setLoadingMoneyReceived(true)
      const { data, error } = await supabase
        .from("monthly_finances")
        .select("money_received")
        .eq("user_id", userId)
        .eq("month", selectedMonthIndex + 1)
        .eq("year", selectedYear)
        .single()

      if (error) {
        if (error.code === "PGRST116") {
          setMoneyReceived(0)
        } else {
          console.error("Error fetching money received:", error.message)
        }
      } else {
        setMoneyReceived(data.money_received)
      }
      setLoadingMoneyReceived(false)
    }

    fetchMoneyReceived()
  }, [userId, selectedMonthIndex, selectedYear])

  const monthPayments = payments.filter((p) => p.month === selectedMonthIndex + 1 && p.year === selectedYear)
  const monthTotal = monthPayments.reduce((sum, p) => sum + p.amount, 0)

  const balance = moneyReceived - monthTotal

  const monthGrouped = payments.reduce((acc: Record<string, number>, curr) => {
    const key = `${monthNames[curr.month - 1]} ${curr.year}`
    acc[key] = (acc[key] || 0) + curr.amount
    return acc
  }, {})

  const categoryBreakdown = monthPayments.reduce((acc: Record<string, number>, curr) => {
    acc[curr.bill_type] = (acc[curr.bill_type] || 0) + curr.amount
    return acc
  }, {})

  const monthKeys = Object.keys(monthGrouped)
  const monthData = Object.values(monthGrouped)

  // Color palette for 12 months
  const monthColors = [
    "#38BDF8",
    "#14F195",
    "#F472B6",
    "#FACC15",
    "#F97316",
    "#A78BFA",
    "#34D399",
    "#F87171",
    "#60A5FA",
    "#FBBF24",
    "#10B981",
    "#6366F1",
  ]

  // Distinct color palette for categories
  const categoryColors = [
    "#FF6384",
    "#36A2EB",
    "#FFCE56",
    "#4BC0C0",
    "#9966FF",
    "#FF9F40",
    "#C9CBCF",
    "#B4FF9F",
    "#FFB4E6",
    "#B4D4FF",
  ]

  // Data for bar+line combo
  const barLineChartData = {
    labels: monthKeys,
    datasets: [
      {
        label: "Monthly Spending",
        data: monthData,
        backgroundColor: monthKeys.map((_, i) => monthColors[i % monthColors.length]),
        borderColor: "#fff",
        borderWidth: 1,
        type: "bar" as const,
      },
      {
        label: "Trend",
        data: monthData,
        type: "line" as const,
        borderColor: "#14F195",
        backgroundColor: "rgba(20, 241, 149, 0.2)",
        borderWidth: 2,
        pointRadius: 3,
        fill: false,
        tension: 0.3,
      },
    ],
  }

  // Data for line chart only
  const lineChartData = {
    labels: monthKeys,
    datasets: [
      {
        label: "Monthly Spending",
        data: monthData,
        borderColor: "#14F195",
        backgroundColor: "rgba(20, 241, 149, 0.2)",
        borderWidth: 2,
        pointRadius: 3,
        fill: false,
        tension: 0.3,
      },
    ],
  }

  const pieData = {
    labels: Object.keys(categoryBreakdown),
    datasets: [
      {
        data: Object.values(categoryBreakdown),
        backgroundColor: Object.keys(categoryBreakdown).map((_, i) => categoryColors[i % categoryColors.length]),
      },
    ],
  }

  const changeMonth = (offset: number) => {
    let newMonth = selectedMonthIndex + offset
    let newYear = selectedYear
    if (newMonth > 11) {
      newMonth = 0
      newYear++
    } else if (newMonth < 0) {
      newMonth = 11
      newYear--
    }
    setSelectedMonthIndex(newMonth)
    setSelectedYear(newYear)
  }

  // Custom legend for monthly spending pie chart
  const renderMonthLegend = () => {
    const items = monthKeys.map((label, i) => (
      <div key={label} style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
        <span
          style={{
            display: "inline-block",
            width: 12,
            height: 12,
            backgroundColor: monthColors[i % monthColors.length],
            borderRadius: 2,
            marginRight: 8,
          }}
        />
        <span style={{ fontSize: 11 }}>{label}</span>
      </div>
    ))
    // Split into two columns
    const mid = Math.ceil(items.length / 2)
    return (
      <div style={{ display: "flex", flexDirection: "row", gap: 16 }}>
        <div>{items.slice(0, mid)}</div>
        <div>{items.slice(mid)}</div>
      </div>
    )
  }

  // Custom legend for category pie chart
  const renderCategoryLegend = () => {
    const keys = Object.keys(categoryBreakdown)
    if (keys.length === 0) return null
    return (
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16, marginTop: 16 }}>
        {keys.map((cat, i) => (
          <div key={cat} style={{ display: "flex", alignItems: "center", minWidth: 120 }}>
            <span
              style={{
                display: "inline-block",
                width: 14,
                height: 14,
                backgroundColor: categoryColors[i % categoryColors.length],
                borderRadius: 3,
                marginRight: 8,
              }}
            />
            <span style={{ fontSize: 13 }}>{cat}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-white">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8 pt-20">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          {/* Month Navigation */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => changeMonth(-1)}
              className="p-2 rounded-lg bg-black/40 border border-neonBlue/30 hover:border-neonBlue hover:bg-neonBlue/10 transition-all duration-300 group"
            >
              <ChevronLeft className="w-5 h-5 text-neonBlue group-hover:scale-110 transition-transform" />
            </button>
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-neonBlue to-neonGreen bg-clip-text text-transparent">
                {monthNames[selectedMonthIndex]} {selectedYear}
              </h2>
              <p className="text-sm text-mutedText">Monthly Overview</p>
            </div>
            <button
              onClick={() => changeMonth(1)}
              className="p-2 rounded-lg bg-black/40 border border-neonBlue/30 hover:border-neonBlue hover:bg-neonBlue/10 transition-all duration-300 group"
            >
              <ChevronRight className="w-5 h-5 text-neonBlue group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/emailSummary"
              className="group bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 flex items-center space-x-2"
            >
              <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Email Summary</span>
            </Link>
            <Link
              href="/billManager"
              className="group bg-gradient-to-r from-neonGreen to-neonBlue text-background px-4 py-2 rounded-xl font-semibold hover:scale-105 transition-all duration-300 shadow-neon hover:shadow-neonGreen flex items-center space-x-2"
            >
              <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" />
              <span>Add Payment</span>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          {/* This Month Total */}
          <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-neonBlue/20">
            <div className="flex items-center space-x-3">
              <div className="bg-neonBlue/20 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-neonBlue" />
              </div>
              <div>
                <p className="text-sm text-mutedText">This Month's Total</p>
                <p className="text-2xl font-bold text-neonBlue">Rs. {monthTotal.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Money Received */}
          <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-purple-500/20">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-500/20 p-3 rounded-lg">
                <DollarSign className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-mutedText">Money Received</p>
                {loadingMoneyReceived ? (
                  <p className="text-2xl font-bold text-purple-400">Loading...</p>
                ) : (
                  <p className="text-2xl font-bold text-purple-400">Rs. {moneyReceived.toFixed(2)}</p>
                )}
              </div>
            </div>
          </div>

          {/* Balance */}
          <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-pink-500/20">
            <div className="flex items-center space-x-3">
              <div className="bg-pink-500/20 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-pink-400" />
              </div>
              <div>
                <p className="text-sm text-mutedText">Balance</p>
                <p className={`text-2xl font-bold ${balance >= 0 ? "text-green-400" : "text-red-400"}`}>
                  Rs. {balance.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Categories Count */}
          <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-yellow-500/20">
            <div className="flex items-center space-x-3">
              <div className="bg-yellow-500/20 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-sm text-mutedText">Categories</p>
                <p className="text-2xl font-bold text-yellow-400">
                  {Object.keys(categoryBreakdown).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Payment History */}
          <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-neonBlue/20 shadow-neon">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-neonBlue/20 p-2 rounded-lg">
                  <History className="w-5 h-5 text-neonBlue" />
                </div>
                <h3 className="text-lg font-semibold">Payment History</h3>
              </div>
              <Link
                href="/history"
                className="text-sm text-neonBlue hover:text-neonGreen transition-colors duration-300 flex items-center space-x-1"
              >
                <span>View All</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-3">
              {monthPayments.length === 0 ? (
                <div className="text-center py-8 text-mutedText">
                  <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No payments recorded for this month</p>
                </div>
              ) : (
                <>
                  {monthPayments.map((p) => (
                    <div
                      key={p.id}
                      className="flex justify-between items-center p-3 bg-black/30 rounded-lg hover:bg-black/50 transition-colors duration-300"
                    >
                      <div>
                        <p className="font-medium">{p.bill_type}</p>
                        <p className="text-sm text-mutedText">{new Date(p.paid_on).toLocaleDateString()}</p>
                      </div>
                      <span className="font-bold text-neonGreen">Rs. {p.amount.toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center p-3 bg-neonBlue/10 rounded-lg border border-neonBlue/30 font-bold">
                    <span>Total</span>
                    <span className="text-neonBlue">Rs. {monthTotal.toFixed(2)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Chart Area */}
          <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-neonGreen/20 shadow-neon">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-neonGreen/20 p-2 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-neonGreen" />
                </div>
                <h3 className="text-lg font-semibold">Spending Overview</h3>
              </div>
              <div className="flex gap-2">
                {(["bar", "line", "pie"] as const).map((type) => (
                  <button
                    key={type}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 flex items-center space-x-1 ${
                      chartType === type
                        ? "bg-neonGreen text-background"
                        : "bg-black/30 text-mutedText hover:text-white hover:bg-black/50"
                    }`}
                    onClick={() => setChartType(type)}
                  >
                    {type === "bar" && <BarChart3 className="w-3 h-3" />}
                    {type === "line" && <LineChart className="w-3 h-3" />}
                    {type === "pie" && <PieChart className="w-3 h-3" />}
                    <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="h-64">
              {chartType === "bar" && <ChartJSComponent type="bar" data={barLineChartData} options={{}} />}
              {chartType === "line" && <Line data={lineChartData} />}
              {chartType === "pie" && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "100%",
                    gap: 32,
                  }}
                >
                  <div style={{ width: 320, height: 240 }}>
                    <Pie
                      data={pieData}
                      width={320}
                      height={240}
                      options={{
                        plugins: {
                          legend: { display: false },
                        },
                      }}
                    />
                  </div>
                  <div style={{ minWidth: 120 }}>{renderMonthLegend()}</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Monthly Category Breakdown */}
        <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-yellow-500/20 shadow-neon">
          <div className="flex items-center space-x-3 mb-6">
            <div className="bg-yellow-500/20 p-2 rounded-lg">
              <PieChart className="w-5 h-5 text-yellow-400" />
            </div>
            <h3 className="text-lg font-semibold">
              Category Breakdown - {monthNames[selectedMonthIndex]} {selectedYear}
            </h3>
          </div>

          {Object.keys(categoryBreakdown).length === 0 ? (
            <div className="text-center py-12 text-mutedText">
              <PieChart className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">No data for this month</p>
              <p className="text-sm">Add some payments to see category breakdown</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div style={{ width: 320, height: 220, margin: "0 auto" }}>
                <Pie data={pieData} width={320} height={220} options={{ plugins: { legend: { display: false } } }} />
              </div>
              {renderCategoryLegend()}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

const AppFooter = () => (
  <footer className="mt-16 border-t border-white/10 pt-6 text-center text-sm text-mutedText">
    <div className="flex flex-col items-center justify-center space-y-3">
      <p>
        © {new Date().getFullYear()} PayLedger · Built by Anuja Jayasinghe
      </p>
      <div className="flex items-center space-x-4">
        <a
          href="https://anujajay.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neonBlue hover:text-neonGreen transition-colors duration-300"
        >
          anujajay.com
        </a>
        <span className="text-mutedText">·</span>
        <a
          href="https://github.com/Anuja-jayasinghe"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neonBlue hover:text-neonGreen transition-colors duration-300 flex items-center space-x-1"
        >
          <Github className="w-4 h-4" />
          <span>GitHub</span>
        </a>
         <span className="text-mutedText">·</span>
        <a
          href="https://github.com/Anuja-jayasinghe/PayLedger"
          target="_blank"
          rel="noopener noreferrer"
          className="text-neonBlue hover:text-neonGreen transition-colors duration-300 flex items-center space-x-1"
        >
          <Github className="w-4 h-4" />
          <span>Project Repo</span>
        </a>
      </div>
    </div>
  </footer>
)
