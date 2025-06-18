import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-neonBlue/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2 text-neonBlue font-bold text-xl">
            <img src="/logo.png" alt="PayLedger Logo" className="w-8 h-8 object-contain" />
            <span>PayLedger</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link 
              href="/login" 
              className="text-white hover:text-neonBlue transition-colors"
            >
              Login
            </Link>
            <Link 
              href="/login" 
              className="bg-neonBlue text-background px-4 py-2 rounded-lg hover:bg-neonBlue/90 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
} 