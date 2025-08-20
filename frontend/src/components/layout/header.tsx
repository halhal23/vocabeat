"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Code2, User, Menu, LogOut, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/AuthContext"

export function Header() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  return (
    <>
      <header className="fixed top-0 z-50 w-full px-4 sm:px-6 py-3 sm:py-4">
        <div className="container mx-auto">
          <div className="card-tech rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 sm:py-3">
            <div className="flex h-10 sm:h-12 items-center justify-between">
              <div className="flex items-center gap-3 sm:gap-8">
                <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-primary rounded-lg sm:rounded-xl flex items-center justify-center animate-tech-pulse group-hover:scale-110 transition-transform duration-300">
                    <Code2 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </div>
                  <span className="text-lg sm:text-2xl font-bold text-gradient animate-gradient-shift">
                    Vocabeat
                  </span>
                </Link>
                
                <nav className="hidden md:flex items-center gap-6 lg:gap-8">
                  <Link 
                    href="/dashboard" 
                    className="text-sm lg:text-base text-muted-foreground hover:text-foreground transition-all duration-300 hover:text-gradient font-medium relative group"
                  >
                    ダッシュボード
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
                  </Link>
                  <Link 
                    href="/words" 
                    className="text-sm lg:text-base text-muted-foreground hover:text-foreground transition-all duration-300 hover:text-gradient font-medium relative group"
                  >
                    単語一覧
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
                  </Link>
                  <Link 
                    href="/test" 
                    className="text-sm lg:text-base text-muted-foreground hover:text-foreground transition-all duration-300 hover:text-gradient font-medium relative group"
                  >
                    テスト
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
                  </Link>
                </nav>
              </div>
              
              <div className="flex items-center gap-2 sm:gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="md:hidden glass hover:bg-white/10 p-2"
                  onClick={toggleMobileMenu}
                >
                  {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
                
                {loading ? (
                  <div className="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                ) : user ? (
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-xs sm:text-sm text-muted-foreground hidden lg:inline truncate max-w-32">
                      {user.email}
                    </span>
                    <Button 
                      onClick={handleSignOut}
                      variant="outline" 
                      size="sm"
                      className="glass hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all duration-300 text-xs sm:text-sm px-3 sm:px-4"
                    >
                      <LogOut className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden xs:inline">ログアウト</span>
                    </Button>
                  </div>
                ) : (
                  <Link href="/auth">
                    <Button className="gradient-primary text-white font-medium px-3 sm:px-6 py-1.5 sm:py-2 rounded-lg sm:rounded-xl hover:shadow-glow transition-all duration-300 hover:scale-105 text-sm">
                      <User className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden xs:inline">ログイン</span>
                      <span className="xs:hidden">入</span>
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={toggleMobileMenu} />
          <div className="fixed top-20 left-4 right-4 bg-card/95 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-purple-500/20">
            <nav className="flex flex-col gap-4">
              <Link 
                href="/dashboard" 
                className="text-base font-medium text-muted-foreground hover:text-gradient transition-all duration-300 py-3 px-4 rounded-xl hover:bg-purple-500/10"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ダッシュボード
              </Link>
              <Link 
                href="/words" 
                className="text-base font-medium text-muted-foreground hover:text-gradient transition-all duration-300 py-3 px-4 rounded-xl hover:bg-purple-500/10"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                単語一覧
              </Link>
              <Link 
                href="/test" 
                className="text-base font-medium text-muted-foreground hover:text-gradient transition-all duration-300 py-3 px-4 rounded-xl hover:bg-purple-500/10"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                テスト
              </Link>
              {user && (
                <div className="pt-4 border-t border-purple-500/20">
                  <div className="text-sm text-muted-foreground mb-2 px-4">
                    {user.email}
                  </div>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}