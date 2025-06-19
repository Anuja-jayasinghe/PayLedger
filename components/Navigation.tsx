"use client"

import { useState, useEffect } from "react"
import { DollarSign, Menu, X } from "lucide-react"
import Link from "next/link"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-black/80 backdrop-blur-md border-b border-neonBlue/20" : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-3 text-neonBlue font-bold text-xl sm:text-2xl hover:text-neonGreen transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-neonBlue/50 rounded-lg p-2"
            aria-label="PayLedger Home"
          >
            <img src="/logo.png" alt="PayLedger Logo" className="w-8 h-8 object-contain" />
            <span className="hidden sm:block">PayLedger</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })}
              className="text-white hover:text-neonBlue transition-colors duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-neonBlue/50 rounded-lg px-3 py-2"
            >
              Features
            </button>
            <Link
              href="/about"
              className="text-white hover:text-neonBlue transition-colors duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-neonBlue/50 rounded-lg px-3 py-2"
            >
              About
            </Link>
           
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/login"
              className="text-white hover:text-neonBlue transition-colors duration-300 font-medium focus:outline-none focus:ring-2 focus:ring-neonBlue/50 rounded-lg px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="bg-gradient-to-r from-neonBlue to-neonGreen text-background px-6 py-2 rounded-lg font-bold hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-neonGreen/50"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white hover:text-neonBlue transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-neonBlue/50 rounded-lg p-2"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden transition-all duration-300 overflow-hidden ${
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="py-4 space-y-4 border-t border-neonBlue/20 bg-black/90 backdrop-blur-md rounded-b-lg">
            <button
              onClick={() => {
                document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })
                setIsMenuOpen(false)
              }}
              className="block w-full text-left px-4 py-2 text-white hover:text-neonBlue hover:bg-neonBlue/10 transition-all duration-300 rounded-lg mx-2"
            >
              Features
            </button>
            <Link
              href="/about"
              className="block px-4 py-2 text-white hover:text-neonBlue hover:bg-neonBlue/10 transition-all duration-300 rounded-lg mx-2"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            
            <div className="border-t border-neonBlue/20 pt-4 px-2 space-y-2">
              <Link
                href="/login"
                className="block px-4 py-2 text-white hover:text-neonBlue hover:bg-neonBlue/10 transition-all duration-300 rounded-lg"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/login"
                className="block bg-gradient-to-r from-neonBlue to-neonGreen text-background px-4 py-2 rounded-lg font-bold text-center hover:scale-105 transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
