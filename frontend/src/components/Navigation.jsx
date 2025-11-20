import { NavLink } from 'react-router-dom'
import { TrendingUp, Shield, History, LogIn, LogOut, User, Users, Menu, X } from 'lucide-react'
import { cn } from '../lib/utils'
import { useAuth } from '../contexts/AuthContext'
import { Button } from './ui/button'
import { useState } from 'react'

function Navigation() {
  const { user, logout, isAdmin } = useAuth()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navLinkClass = ({ isActive }) => cn(
    "flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-all border-b-2",
    isActive
      ? "border-primary text-primary bg-primary/5"
      : "border-transparent text-gray-600 hover:text-primary hover:border-primary/50 hover:bg-gray-50"
  )

  const mobileNavLinkClass = ({ isActive }) => cn(
    "flex items-center space-x-4 px-6 py-4 text-base font-medium transition-all rounded-xl mx-2",
    isActive
      ? "bg-primary text-white shadow-md"
      : "text-gray-700 hover:bg-gray-100 active:bg-gray-200"
  )

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-1">
            <NavLink to="/controls" className={navLinkClass} onClick={closeMobileMenu}>
              <Shield className="w-4 h-4" />
              <span>Contrôles ISO 27001</span>
            </NavLink>
            {isAdmin() && (
              <NavLink to="/history" className={navLinkClass} onClick={closeMobileMenu}>
                <History className="w-4 h-4" />
                <span>Historique</span>
              </NavLink>
            )}
            {user && (
              <NavLink to="/profile" className={navLinkClass} onClick={closeMobileMenu}>
                <User className="w-4 h-4" />
                <span>Profil</span>
              </NavLink>
            )}
            {isAdmin() && (
              <NavLink to="/users" className={navLinkClass} onClick={closeMobileMenu}>
                <Users className="w-4 h-4" />
                <span>Utilisateurs</span>
              </NavLink>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden relative z-60">
            <Button
              variant="ghost"
              size="lg"
              onClick={toggleMobileMenu}
              className="p-3 h-12 w-12 rounded-xl hover:bg-gray-100 active:bg-gray-200 transition-all duration-200 touch-manipulation cursor-pointer"
              aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 transition-transform duration-200 rotate-90" />
              ) : (
                <Menu className="w-6 h-6 transition-transform duration-200" />
              )}
            </Button>
          </div>

          {/* Desktop User Section */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600 hidden lg:block">
                  Connecté en tant que {user.username} ({user.role})
                </span>
                <span className="text-sm text-gray-600 lg:hidden">
                  {user.username}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Déconnexion</span>
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                asChild
                className="flex items-center justify-center p-2"
                aria-label="Connexion Admin"
              >
                <NavLink to="/login">
                  <LogIn className="w-4 h-4" />
                </NavLink>
              </Button>
            )}
          </div>

          {/* Mobile User Section */}
          <div className="md:hidden">
            {user && (
              <span className="text-sm text-gray-600">
                {user.username}
              </span>
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden animate-fadeIn"
              onClick={closeMobileMenu}
              style={{ touchAction: 'manipulation' }}
            />
            {/* Menu */}
            <div className="md:hidden border-t border-gray-200 bg-white shadow-2xl animate-slideDown absolute left-0 right-0 z-50">
              <div className="px-4 pt-4 pb-6 space-y-2 max-h-[70vh] overflow-y-auto">
                <NavLink to="/controls" className={mobileNavLinkClass} onClick={closeMobileMenu}>
                  <Shield className="w-6 h-6 flex-shrink-0" />
                  <span className="font-medium">Contrôles ISO 27001</span>
                </NavLink>
                {isAdmin() && (
                  <NavLink to="/history" className={mobileNavLinkClass} onClick={closeMobileMenu}>
                    <History className="w-6 h-6 flex-shrink-0" />
                    <span className="font-medium">Historique</span>
                  </NavLink>
                )}
                {user && (
                  <NavLink to="/profile" className={mobileNavLinkClass} onClick={closeMobileMenu}>
                    <User className="w-6 h-6 flex-shrink-0" />
                    <span className="font-medium">Profil</span>
                  </NavLink>
                )}
                {isAdmin() && (
                  <NavLink to="/users" className={mobileNavLinkClass} onClick={closeMobileMenu}>
                    <Users className="w-6 h-6 flex-shrink-0" />
                    <span className="font-medium">Utilisateurs</span>
                  </NavLink>
                )}
                <div className="border-t border-gray-200 pt-4 mt-4 mx-2">
                  {user ? (
                    <div className="space-y-3">
                      <div className="px-4 py-2 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-gray-900">{user.username}</p>
                        <p className="text-xs text-gray-600">{user.role}</p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          logout()
                          closeMobileMenu()
                        }}
                        className="w-full flex items-center justify-center space-x-3 h-12 rounded-xl border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 touch-manipulation"
                        style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Déconnexion</span>
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      asChild
                      className="w-full flex items-center justify-center h-12 rounded-xl touch-manipulation"
                      onClick={closeMobileMenu}
                      style={{ touchAction: 'manipulation', WebkitTapHighlightColor: 'transparent' }}
                      aria-label="Connexion Admin"
                    >
                      <NavLink to="/login">
                        <LogIn className="w-5 h-5" />
                      </NavLink>
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navigation
