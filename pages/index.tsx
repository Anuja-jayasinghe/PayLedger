import { DollarSign, Calendar, Target, TrendingUp, ArrowRight, Zap, Shield, Sparkles } from 'lucide-react'
import Link from 'next/link'
import Navigation from '@/pages/Navigation'

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-white overflow-hidden">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-neonBlue/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-neonGreen/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-neonBlue/5 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="animate-float mb-8">
            <div className="relative inline-block">
              <DollarSign className="w-24 h-24 text-neonBlue mx-auto mb-6" />
              <Sparkles className="w-8 h-8 text-neonGreen absolute -top-2 -right-2 animate-pulse" />
            </div>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-neonBlue via-white to-neonGreen bg-clip-text text-transparent">
            PayLedger
          </h1>
          
          <p className="text-2xl md:text-3xl text-white mb-4 max-w-4xl mx-auto font-light">
            Never miss a bill again.
          </p>
          <p className="text-lg md:text-xl text-mutedText mb-12 max-w-2xl mx-auto">
            Built from personal frustration with scattered bills and forgotten payments. 
            Simple, beautiful, and actually works.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link 
              href="/login" 
              className="bg-gradient-to-r from-neonBlue to-neonGreen text-background px-12 py-5 rounded-xl font-bold text-lg shadow-neon hover:shadow-neonGreen hover:scale-105 transition-all duration-300 flex items-center space-x-3 group"
            >
              <Zap className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              <span>Start Organizing</span>
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link 
              href="/dashboard" 
              className="border-2 border-neonBlue text-neonBlue px-12 py-5 rounded-xl font-bold text-lg hover:bg-neonBlue/20 hover:shadow-neon transition-all duration-300 backdrop-blur-sm"
            >
              See It In Action
            </Link>
          </div>
        </div>
      </section>

      {/* Problem & Solution Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              From Chaos to <span className="text-neonGreen">Control</span>
            </h2>
            <p className="text-xl text-mutedText max-w-3xl mx-auto">
              Born from the mess of sticky notes, forgotten due dates, and that sinking feeling 
              when you realize you missed another payment.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group">
              <div className="bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-red-500/30 hover:border-red-500/50 transition-all duration-300 transform group-hover:scale-105">
                <div className="text-4xl mb-4">😵‍💫</div>
                <h3 className="text-xl font-semibold mb-4 text-red-400">The Old Way</h3>
                <p className="text-mutedText">Scattered receipts, forgotten due dates, late fees, and that constant anxiety about what you might be missing.</p>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-yellow-500/30 hover:border-yellow-500/50 transition-all duration-300 transform group-hover:scale-105">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-semibold mb-4 text-yellow-400">The Transition</h3>
                <p className="text-mutedText">One simple app that captures everything. No more juggling apps, spreadsheets, or hoping you remember.</p>
              </div>
            </div>
            
            <div className="group">
              <div className="bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-neonGreen/30 hover:border-neonGreen/50 transition-all duration-300 transform group-hover:scale-105">
                <div className="text-4xl mb-4">✨</div>
                <h3 className="text-xl font-semibold mb-4 text-neonGreen">Peace of Mind</h3>
                <p className="text-mutedText">Everything in one place, shared with family, and that satisfying feeling of being completely on top of your finances.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black/20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Everything You Actually Need
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="bg-neonBlue/20 p-3 rounded-lg">
                  <Calendar className="w-6 h-6 text-neonBlue" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Never Miss a Due Date</h3>
                  <p className="text-mutedText">Track all your bills with their due dates. Simple calendar view shows what's coming up.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-neonGreen/20 p-3 rounded-lg">
                  <Target className="w-6 h-6 text-neonGreen" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Share with Family</h3>
                  <p className="text-mutedText">Share bills with your partner or family. Everyone stays in the loop, no more "I thought you paid that."</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-neonBlue/20 p-3 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-neonBlue" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">See Your Patterns</h3>
                  <p className="text-mutedText">Understand where your money goes. Simple analytics without the overwhelming complexity.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-neonGreen/20 p-3 rounded-lg">
                  <Shield className="w-6 h-6 text-neonGreen" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Your Data, Secure</h3>
                  <p className="text-mutedText">Bank-level security. Your financial information stays private and protected.</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-black/60 backdrop-blur-md p-8 rounded-2xl border border-neonBlue/20 shadow-neon">
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-neonBlue/10 rounded-lg">
                    <span className="font-semibold">Electricity Bill</span>
                    <span className="text-neonGreen">$89.50</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-neonGreen/10 rounded-lg">
                    <span className="font-semibold">Internet</span>
                    <span className="text-neonBlue">$65.00</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-yellow-500/10 rounded-lg">
                    <span className="font-semibold">Phone Bill</span>
                    <span className="text-yellow-400">$45.00</span>
                  </div>
                </div>
                <div className="mt-6 p-4 bg-gradient-to-r from-neonBlue/20 to-neonGreen/20 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm text-mutedText">Total This Month</p>
                    <p className="text-2xl font-bold text-white">$199.50</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Get Organized?
          </h2>
          <p className="text-xl text-mutedText mb-12">
            Stop the stress. Start the control. It takes 2 minutes to set up.
          </p>
          <Link 
            href="/login" 
            className="bg-gradient-to-r from-neonBlue to-neonGreen text-background px-16 py-6 rounded-2xl font-bold text-xl shadow-neon hover:shadow-neonGreen hover:scale-110 transition-all duration-300 inline-flex items-center space-x-4 group"
          >
            <span>Let's Do This</span>
            <ArrowRight className="w-8 h-8 group-hover:translate-x-3 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neonBlue/20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 text-neonBlue font-bold text-2xl mb-6">
            <DollarSign className="w-8 h-8" />
            <span>PayLedger</span>
          </div>
          <p className="text-mutedText">
            Built by someone who was tired of late fees and financial chaos. 
            <br />
            Simple solutions for real problems.
          </p>
        </div>
      </footer>
    </div>
  )
}
