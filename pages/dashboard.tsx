// pages/dashboard.tsx
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { Bar, Line, Pie } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, ArcElement, Tooltip, Legend } from 'chart.js'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/footer'

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
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export default function Dashboard() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear())
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar')

  useEffect(() => {
    const fetchPayments = async () => {
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser()

      if (userError) {
        console.error('User fetch error:', userError.message)
        return
      }

      console.log('Logged in user ID:', user?.id)

      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user?.id)

      if (error) {
        console.error('Payments fetch error:', error.message)
      } else {
        console.log('Fetched payments:', data)
        setPayments(data)
      }
    }

    fetchPayments()
  }, [])

  const monthPayments = payments.filter(p => p.month === selectedMonthIndex + 1 && p.year === selectedYear)
  const monthTotal = monthPayments.reduce((sum, p) => sum + p.amount, 0)

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

  const chartData = {
    labels: monthKeys,
    datasets: [
      {
        label: 'Monthly Spending',
        data: monthData,
        backgroundColor: '#38BDF8',
        borderColor: '#14F195',
        borderWidth: 2,
      },
    ],
  }

  const pieData = {
    labels: Object.keys(categoryBreakdown),
    datasets: [
      {
        data: Object.values(categoryBreakdown),
        backgroundColor: ['#38BDF8', '#14F195', '#F472B6', '#FACC15', '#F97316'],
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

  return (
    <div className="min-h-screen bg-background text-white">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-8 pt-20">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => changeMonth(-1)} className="text-xl">&larr;</button>
            <h2 className="text-xl font-bold">{monthNames[selectedMonthIndex]} {selectedYear}</h2>
            <button onClick={() => changeMonth(1)} className="text-xl">&rarr;</button>
          </div>
          <Link
            href="/billmanager"
            className="bg-neonGreen text-background px-4 py-2 rounded shadow hover:scale-105 transition"
          >
            + Add New Record
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Payment History */}
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-lg">
            <h3 className="text-base font-semibold mb-4">Payment History</h3>
            <ul className="space-y-2 text-sm">
              {monthPayments.map((p) => (
                <li key={p.id} className="flex justify-between">
                  <span>{p.bill_type}</span>
                  <span>Rs. {p.amount.toFixed(2)}</span>
                </li>
              ))}
              <li className="flex justify-between font-bold border-t border-white/10 pt-2 mt-2">
                <span>Total</span>
                <span>Rs. {monthTotal.toFixed(2)}</span>
              </li>
            </ul>
            <Link
              href="/history"
              className="mt-4 inline-block text-xs text-neonBlue hover:underline"
            >
              View Full History
            </Link>
          </div>

          {/* Chart Area */}
          <div className="bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-semibold">Spending by Month</h3>
              <div className="flex gap-2">
                {(['bar', 'line', 'pie'] as const).map((type) => (
                  <button
                    key={type}
                    className={`px-3 py-1 rounded text-xs font-medium ${chartType === type ? 'bg-neonBlue text-black' : 'bg-white/10'}`}
                    onClick={() => setChartType(type)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            {chartType === 'bar' && <Bar data={chartData} />} 
            {chartType === 'line' && <Line data={chartData} />} 
            {chartType === 'pie' && <Pie data={chartData} />} 
          </div>
        </div>

        {/* Monthly Breakdown */}
        <div className="bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-lg">
          <h3 className="text-base font-semibold mb-4">Spending by Category ({monthNames[selectedMonthIndex]})</h3>
          <Pie data={pieData} />
        </div>
      </div>
      <Footer />
    </div>
  )
}
