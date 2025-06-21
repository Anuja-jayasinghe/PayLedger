"use client"

import { DollarSign, Target, Mail, Calendar, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import Header from "@/components/Navigation"
import Footer from "@/components/Footer"
import Head from "next/head"

export default function About() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <div className="min-h-screen bg-background text-white overflow-hidden">
      <Head>
        <title>About PayLedger - My Personal Solution</title>
        <meta name="description" content="Learn about why I built PayLedger to solve my own bill tracking problems." />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neonBlue/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neonGreen/5 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div
            className={`mb-8 transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <CheckCircle className="w-16 h-16 mx-auto text-neonGreen mb-6 animate-pulse" />
          </div>

          <h1
            className={`text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-neonBlue via-white to-neonGreen bg-clip-text text-transparent transition-all duration-1000 delay-200 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            A Personal Solution
            <br />
            to a Real Problem
          </h1>

          <p
            className={`text-lg sm:text-xl text-mutedText mb-12 max-w-3xl mx-auto leading-relaxed transition-all duration-1000 delay-400 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            PayLedger is a personal project of mine created to solve a problem I've been facing for years: keeping track of which bills
            I've actually paid and when.
          </p>
        </div>
      </section>

      {/* Origin Story Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                The <span className="text-neonGreen">Problem</span>
              </h2>

              <div className="space-y-4 text-mutedText leading-relaxed">
                <p>
                  "Did I pay the electricity bill this month?" This question haunted me every few weeks. I'd check my
                  bank statements, scroll through payment apps, and still couldn't get a clear picture.
                </p>

                <p>
                  The problem wasn't paying bills on time – it was remembering what I'd already paid. Different bills,
                  different payment methods, different dates. It was chaos.
                </p>

                <p>
                  I tried spreadsheets, notes apps, even photos of receipts. Nothing gave me that simple peace of mind:{" "}
                  <strong className="text-white">"Yes, I paid this. Here's when and how much."</strong>
                </p>

                <p>
                  So I decided to build something simple. A place to record what I've paid, when I paid it, and how
                  much. No fancy features, no complicated categories – just a clear record of my bill payments.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-neonBlue/20 shadow-neon">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-4">🤔</div>
                  <h3 className="text-xl font-semibold text-neonBlue">The Daily Question</h3>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="bg-yellow-500/10 p-4 rounded-lg border-l-4 border-yellow-500">
                    <p className="text-yellow-400 font-semibold">"Did I pay the electricity bill?"</p>
                    <p className="text-mutedText">Checking bank statements...</p>
                  </div>

                  <div className="bg-yellow-500/10 p-4 rounded-lg border-l-4 border-yellow-500">
                    <p className="text-yellow-400 font-semibold">"What about the internet?"</p>
                    <p className="text-mutedText">Scrolling through payment apps...</p>
                  </div>

                  <div className="text-center text-mutedText">
                    <p>"There has to be a better way..."</p>
                  </div>

                  <div className="bg-neonGreen/10 p-4 rounded-lg border-l-4 border-neonGreen">
                    <p className="text-neonGreen font-semibold">Solution: Build PayLedger</p>
                    <p className="text-mutedText">Simple bill payment tracking</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What PayLedger Does Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              What PayLedger <span className="text-neonBlue">Actually Does</span>
            </h2>
            <p className="text-lg sm:text-xl text-mutedText max-w-3xl mx-auto leading-relaxed">
              It's simple: track the bills you've paid, when you paid them, and how much you spent.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="group">
              <div className="bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-neonBlue/20 hover:border-neonBlue/40 transition-all duration-500 transform group-hover:scale-105 group-hover:-translate-y-2 h-full">
                <div className="bg-neonBlue/20 p-4 rounded-lg w-fit mb-6 group-hover:bg-neonBlue/30 transition-colors duration-300">
                  <CheckCircle className="w-8 h-8 text-neonBlue" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Record Payments</h3>
                <p className="text-mutedText leading-relaxed">
                  Log each bill payment with the date, amount, and payment method. Simple and straightforward.
                </p>
              </div>
            </div>

            <div className="group">
              <div className="bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-neonGreen/20 hover:border-neonGreen/40 transition-all duration-500 transform group-hover:scale-105 group-hover:-translate-y-2 h-full">
                <div className="bg-neonGreen/20 p-4 rounded-lg w-fit mb-6 group-hover:bg-neonGreen/30 transition-colors duration-300">
                  <Calendar className="w-8 h-8 text-neonGreen" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Track History</h3>
                <p className="text-mutedText leading-relaxed">
                  See your payment history at a glance. No more wondering "Did I pay this last month?"
                </p>
              </div>
            </div>

            <div className="group sm:col-span-2 lg:col-span-1">
              <div className="bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-yellow-500/20 hover:border-yellow-500/40 transition-all duration-500 transform group-hover:scale-105 group-hover:-translate-y-2 h-full">
                <div className="bg-yellow-500/20 p-4 rounded-lg w-fit mb-6 group-hover:bg-yellow-500/30 transition-colors duration-300">
                  <Target className="w-8 h-8 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold mb-4">Stay Organized</h3>
                <p className="text-mutedText leading-relaxed">
                  All your bill payments in one place. Clear, organized, and always accessible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personal Philosophy Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              My <span className="text-neonGreen">Philosophy</span>
            </h2>
          </div>

          <div className="bg-black/60 backdrop-blur-md p-8 sm:p-12 rounded-2xl border border-neonBlue/20 shadow-neon">
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-neonBlue to-neonGreen rounded-full flex items-center justify-center text-2xl font-bold text-background mx-auto">
                💡
              </div>

              <div className="space-y-4 text-mutedText leading-relaxed">
                <p className="text-lg">
                  <strong className="text-white">"Keep it simple, keep it useful."</strong>
                </p>

                <p>
                  I'm not trying to revolutionize personal finance or build the next big fintech app. I just wanted to
                  solve my own problem: keeping track of what bills I've paid.
                </p>

                <p>
                  PayLedger does one thing well – it helps you record and track your bill payments. No complicated
                  features, no overwhelming dashboards, just a simple tool that works.
                </p>

                <p className="text-white font-semibold">
                  If it helps you get that same peace of mind I was looking for, then it's done its job.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Questions or <span className="text-neonGreen">Feedback?</span>
          </h2>
          <p className="text-lg sm:text-xl text-mutedText mb-12 leading-relaxed">
            Since this is a personal project, I'd love to hear if it helps you too or if you have suggestions.
          </p>

          <div className="grid sm:grid-cols-2 gap-8 mb-12">
            <div className="bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-neonBlue/20 hover:border-neonBlue/40 transition-all duration-300">
              <Mail className="w-12 h-12 text-neonBlue mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Email Me</h3>
              <p className="text-mutedText mb-4">For questions, feedback, or suggestions</p>
              <Link
                href="mailto:anujajayasinhe@gmail.com"
                className="text-neonBlue hover:text-neonGreen transition-colors duration-300 font-semibold"
              >
                anujajayasinhe@gmail.com
              </Link>
            </div>

            <div className="bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-neonGreen/20 hover:border-neonGreen/40 transition-all duration-300">
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <svg className="w-12 h-12 text-neonGreen" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">View Source</h3>
              <p className="text-mutedText mb-4">Check out the code or contribute</p>
              <Link
                href="https://github.com/Anuja-jayasinghe/payledger"
                target="_blank"
                rel="noopener noreferrer"
                className="text-neonGreen hover:text-neonBlue transition-colors duration-300 font-semibold"
              >
                GitHub Repository
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-r from-neonBlue/10 to-neonGreen/10 p-8 rounded-2xl border border-neonBlue/20">
            <p className="text-lg text-white mb-2">
              "I built this for myself, but I'm happy to share it with anyone who finds it useful."
            </p>
            <p className="text-mutedText">— Anuja Jayasinghe.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Ready to Try It?</h2>
          <p className="text-lg sm:text-xl text-mutedText mb-12 leading-relaxed">
            If you face the same problem I did, PayLedger might be exactly what you need.
          </p>
          <Link
            href="/login"
            className="group bg-gradient-to-r from-neonBlue to-neonGreen text-background px-12 sm:px-16 py-5 sm:py-6 rounded-2xl font-bold text-lg sm:text-xl shadow-neon hover:shadow-neonGreen hover:scale-110 transition-all duration-300 inline-flex items-center space-x-4 focus:outline-none focus:ring-4 focus:ring-neonGreen/50"
            role="button"
            aria-label="Start using PayLedger"
          >
            <span>Give It a Try</span>
            <CheckCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
          </Link>
        </div>
      </section>

    <Footer />
    </div>
  )
}
