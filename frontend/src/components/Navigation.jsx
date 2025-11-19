import { NavLink } from 'react-router-dom'
import { TrendingUp, Shield, AlertTriangle, History } from 'lucide-react'
import { cn } from '../lib/utils'

function Navigation() {
  const navLinkClass = ({ isActive }) => cn(
    "flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-all border-b-2",
    isActive
      ? "border-primary text-primary bg-primary/5"
      : "border-transparent text-gray-600 hover:text-primary hover:border-primary/50 hover:bg-gray-50"
  )

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1">
          {/* Dashboard link removed */}
          <NavLink to="/controls" className={navLinkClass}>
            <Shield className="w-4 h-4" />
            <span>Contrôles ISO 27001</span>
          </NavLink>
          {/* Vulnerabilités and Risques links removed */}
          <NavLink to="/history" className={navLinkClass}>
            <History className="w-4 h-4" />
            <span>Historique</span>
          </NavLink>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
