"use client"

import Link from "next/link"
import { Code2, User, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full px-6 py-4">
      <div className="container mx-auto">
        <div className="card-tech rounded-2xl px-6 py-3">
          <div className="flex h-12 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center animate-tech-pulse group-hover:scale-110 transition-transform duration-300">
                  <Code2 className="h-5 w-5 text-white" />
                </div>
                <span className="text-2xl font-bold text-gradient animate-gradient-shift">
                  Vocabeat
                </span>
              </Link>
              
              <nav className="hidden md:flex items-center gap-8">
                <Link 
                  href="/dashboard" 
                  className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:text-gradient font-medium relative group"
                >
                  ダッシュボード
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link 
                  href="/words" 
                  className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:text-gradient font-medium relative group"
                >
                  単語一覧
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
                </Link>
                <Link 
                  href="/test" 
                  className="text-muted-foreground hover:text-foreground transition-all duration-300 hover:text-gradient font-medium relative group"
                >
                  テスト
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-primary group-hover:w-full transition-all duration-300"></span>
                </Link>
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="md:hidden glass hover:bg-white/10">
                <Menu className="h-5 w-5" />
              </Button>
              <Button className="gradient-primary text-white font-medium px-6 py-2 rounded-xl hover:shadow-glow transition-all duration-300 hover:scale-105">
                <User className="mr-2 h-4 w-4" />
                <Link href="/auth">ログイン</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}