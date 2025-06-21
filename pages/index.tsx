"use client"

import { DollarSign, Calendar, Target, TrendingUp, ArrowRight, Shield, Sparkles, ChevronDown } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import Head from "next/head"
import Image from "next/image"

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    setIsLoaded(true)

    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen bg-background text-white overflow-hidden scroll-smooth">
      <Head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>
      <Header />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative min-h-screen flex items-center">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-neonBlue/5 rounded-full blur-3xl animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.1}px)` }}
          />
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neonGreen/5 rounded-full blur-3xl animate-pulse"
            style={{ transform: `translateY(${scrollY * -0.1}px)` }}
          />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div
            className={`mb-8 relative inline-block pb-6 transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <img
              src="/logo.png"
              alt="PayLedger Logo"
              className="w-24 h-24 mx-auto animate-float hover:scale-110 transition-transform duration-300"
            />
            <Sparkles className="w-8 h-8 text-neonGreen absolute -top-2 -right-2 animate-pulse sparkle-animate" />
          </div>

          <h1
            className={`text-5xl sm:text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-neonBlue via-white to-neonGreen bg-clip-text text-transparent pb-4 sm:pb-10 transition-all duration-1000 delay-200 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            PayLedger
          </h1>

          <p
            className={`text-xl sm:text-2xl md:text-3xl text-white mb-7 max-w-4xl mx-auto font-light transition-all duration-1000 delay-400 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            Never miss a bill again.
          </p>

          <p
            className={`text-base sm:text-lg md:text-xl text-mutedText mb-12 max-w-2xl mx-auto leading-relaxed transition-all duration-1000 delay-600 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            Built from personal frustration with scattered bills and forgotten payments. Simple, beautiful, and actually
            works.
          </p>

          <div
            className={`flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-16 transition-all duration-1000 delay-800 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <Link
              href="/login"
              className="group bg-gradient-to-r from-neonBlue to-neonGreen text-background px-8 sm:px-12 py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg shadow-neon hover:shadow-neonGreen hover:scale-105 transition-all duration-300 flex items-center space-x-3 w-full sm:w-auto justify-center focus:outline-none focus:ring-4 focus:ring-neonBlue/50"
              role="button"
              aria-label="Start organizing your bills"
            >
              <span>Start Organizing</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              onClick={scrollToFeatures}
              className="group text-white border border-neonBlue/30 hover:border-neonBlue px-8 sm:px-12 py-4 sm:py-5 rounded-xl font-bold text-base sm:text-lg hover:bg-neonBlue/10 transition-all duration-300 flex items-center space-x-3 w-full sm:w-auto justify-center focus:outline-none focus:ring-4 focus:ring-neonBlue/50"
              aria-label="Learn more about features"
            >
              <span>Learn More</span>
              <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
            </button>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce ">
            <ChevronDown className="w-6 h-6 text-mutedText" />
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">
              From Chaos to <span className="text-neonGreen">Control</span>
            </h2>
            <p className="text-lg sm:text-xl text-mutedText max-w-3xl mx-auto leading-relaxed">
              Born from the mess of sticky notes, forgotten due dates, and that sinking feeling when you realize you
              missed another payment.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="group h-full">
              <div className="bg-black/60 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-red-500/30 hover:border-red-500/50 transition-all duration-500 transform group-hover:scale-105 group-hover:-translate-y-2 h-full flex flex-col shadow-lg hover:shadow-red-500/20">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">😵‍💫</div>
                <h3 className="text-xl font-semibold mb-4 text-red-400">The Old Way</h3>
                <p className="text-mutedText leading-relaxed flex-grow">
                  Scattered receipts, forgotten due dates, late fees, and that constant anxiety about what you might be
                  missing.
                </p>
              </div>
            </div>

            <div className="group h-full">
              <div className="bg-black/60 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-yellow-500/30 hover:border-yellow-500/50 transition-all duration-500 transform group-hover:scale-105 group-hover:-translate-y-2 h-full flex flex-col shadow-lg hover:shadow-yellow-500/20">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">⚡</div>
                <h3 className="text-xl font-semibold mb-4 text-yellow-400">The Transition</h3>
                <p className="text-mutedText leading-relaxed flex-grow">
                  One simple app that captures everything. No more juggling apps, spreadsheets, or hoping you remember.
                </p>
              </div>
            </div>

            <div className="group h-full sm:col-span-2 lg:col-span-1">
              <div className="bg-black/60 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-neonGreen/30 hover:border-neonGreen/50 transition-all duration-500 transform group-hover:scale-105 group-hover:-translate-y-2 h-full flex flex-col shadow-lg hover:shadow-neonGreen/20">
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">✨</div>
                <h3 className="text-xl font-semibold mb-4 text-neonGreen">Peace of Mind</h3>
                <p className="text-mutedText leading-relaxed flex-grow">
                  Everything in one place, shared with family, and that satisfying feeling of being completely on top of
                  your finances.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 sm:mb-16">
            Everything You Actually Need
          </h2>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
              <div className="group flex items-start space-x-4 p-4 rounded-xl hover:bg-black/30 transition-all duration-300">
                <div className="bg-neonBlue/20 p-3 rounded-lg group-hover:bg-neonBlue/30 transition-colors duration-300 flex-shrink-0">
                  <Calendar className="w-6 h-6 text-neonBlue" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">Never Miss a Due Date</h3>
                  <p className="text-mutedText leading-relaxed">
                    Track all your bills with their due dates. Simple calendar view shows what's coming up.
                  </p>
                </div>
              </div>

              <div className="group flex items-start space-x-4 p-4 rounded-xl hover:bg-black/30 transition-all duration-300">
                <div className="bg-neonGreen/20 p-3 rounded-lg group-hover:bg-neonGreen/30 transition-colors duration-300 flex-shrink-0">
                  <Target className="w-6 h-6 text-neonGreen" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">Share with Family</h3>
                  <p className="text-mutedText leading-relaxed">
                    Share bills with your partner or family. Everyone stays in the loop, no more "I thought you paid
                    that."
                  </p>
                </div>
              </div>

              <div className="group flex items-start space-x-4 p-4 rounded-xl hover:bg-black/30 transition-all duration-300">
                <div className="bg-neonBlue/20 p-3 rounded-lg group-hover:bg-neonBlue/30 transition-colors duration-300 flex-shrink-0">
                  <TrendingUp className="w-6 h-6 text-neonBlue" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">See Your Patterns</h3>
                  <p className="text-mutedText leading-relaxed">
                    Understand where your money goes. Simple analytics without the overwhelming complexity.
                  </p>
                </div>
              </div>

              <div className="group flex items-start space-x-4 p-4 rounded-xl hover:bg-black/30 transition-all duration-300">
                <div className="bg-neonGreen/20 p-3 rounded-lg group-hover:bg-neonGreen/30 transition-colors duration-300 flex-shrink-0">
                  <Shield className="w-6 h-6 text-neonGreen" />
                </div>
                <div className="flex-grow">
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">Your Data, Secure</h3>
                  <p className="text-mutedText leading-relaxed">
                    Bank-level security. Your financial information stays private and protected.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative order-1 lg:order-2">
              <div className="bg-black/60 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-neonBlue/20 shadow-neon hover:shadow-neonBlue/30 transition-all duration-500 hover:scale-105">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-neonBlue/10 rounded-lg hover:bg-neonBlue/20 transition-colors duration-300 cursor-pointer">
                    <span className="font-semibold">Electricity Bill</span>
                    <span className="text-neonGreen font-bold">Rs. 3,200.00</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-neonGreen/10 rounded-lg hover:bg-neonGreen/20 transition-colors duration-300 cursor-pointer">
                    <span className="font-semibold">Internet</span>
                    <span className="text-neonBlue font-bold">Rs. 1,800.00</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-yellow-500/10 rounded-lg hover:bg-yellow-500/20 transition-colors duration-300 cursor-pointer">
                    <span className="font-semibold">Phone Bill</span>
                    <span className="text-yellow-400 font-bold">Rs. 2,500.00</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gradient-to-r from-neonBlue/20 to-neonGreen/20 rounded-lg border border-neonBlue/10">
                  <div className="text-center">
                    <p className="text-sm text-mutedText mb-1">Total This Month</p>
                    <p className="text-2xl font-bold text-white">Rs. 7,500.00</p>
                  </div>
                </div>
              </div>

              {/* Floating elements for visual interest */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-neonGreen/20 rounded-full animate-pulse" />
              <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-neonBlue/20 rounded-full animate-pulse delay-1000" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-neonBlue/5 to-neonGreen/5 rounded-3xl mx-4 sm:mx-8" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">Ready to Get Organized?</h2>
          <p className="text-lg sm:text-xl text-mutedText mb-12 leading-relaxed max-w-2xl mx-auto">
            Stop the stress. Start the control. It takes 2 minutes to set up.
          </p>
          <Link
            href="/login"
            className="group bg-gradient-to-r from-neonBlue to-neonGreen text-background px-12 sm:px-16 py-5 sm:py-6 rounded-2xl font-bold text-lg sm:text-xl shadow-neon hover:shadow-neonGreen hover:scale-110 transition-all duration-300 inline-flex items-center space-x-4 focus:outline-none focus:ring-4 focus:ring-neonGreen/50"
            role="button"
            aria-label="Get started with PayLedger"
          >
            <span>Let's Do This</span>
            <ArrowRight className="w-6 sm:w-8 h-6 sm:h-8 group-hover:translate-x-3 transition-transform" />
          </Link>
        </div>
      </section>

      <Footer />

      {/* Footer
      <footer className="border-t border-neonBlue/20 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 text-neonBlue font-bold text-xl sm:text-2xl mb-4 sm:mb-6 hover:text-neonGreen transition-colors duration-300">
            <DollarSign className="w-6 sm:w-8 h-6 sm:h-8" />
            <span>PayLedger</span>
          </div>
          <p className="text-mutedText leading-relaxed max-w-md mx-auto">
            Built by someone who was tired of late fees and financial chaos.
            <br className="hidden sm:block" />
            Simple solutions for real problems.
          </p>
        </div>
      </footer> */}

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .sparkle-animate {
          animation: float 2s ease-in-out infinite, pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
