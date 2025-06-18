export default function Footer() {
    return (
      <footer className="w-full text-center text-xs text-mutedText bg-white/5 backdrop-blur-md border-t border-white/10 py-4 mt-8">
        <p>
          &copy; {new Date().getFullYear()} <span className="text-neonBlue font-medium">PayLedger</span>. Built by Anuja Jayasinghe.
        </p>
      </footer>
    )
  }
  