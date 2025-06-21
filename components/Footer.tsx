import { Github } from "lucide-react"

export default function Footer() {
  return (
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
            <span>GitHub Profile</span>
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
}
  