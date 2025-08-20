import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Zap, ArrowRight, Terminal, Code2, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Cosmic Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-10 sm:top-20 left-1/4 w-48 h-48 sm:w-72 sm:h-72 bg-purple-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 sm:bottom-20 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-blue-500/15 rounded-full blur-3xl animate-float-delay-2" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-56 h-56 sm:w-80 sm:h-80 bg-violet-500/10 rounded-full blur-3xl animate-float-delay-4" />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6 sm:space-y-8">
            {/* Tech Icon Badge */}
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="relative group">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-primary rounded-xl sm:rounded-2xl flex items-center justify-center shadow-glow animate-tech-pulse group-hover:scale-110 transition-transform duration-300">
                  <Terminal className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-6 sm:h-6 bg-gradient-primary rounded-full flex items-center justify-center animate-float">
                  <Code2 className="h-2 w-2 sm:h-3 sm:w-3 text-white" />
                </div>
              </div>
            </div>

            {/* Main Hero Text */}
            <div className="space-y-4 sm:space-y-6">
              <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight">
                <span className="text-gradient-glow animate-neon-glow">
                  Vocabeat
                </span>
              </h1>
              <div className="w-24 sm:w-32 h-1 bg-gradient-primary mx-auto rounded-full glow-primary" />
            </div>
            
            <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
              <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-tight">
                翻訳を<span className="text-gradient">自動学習</span>に変える
                <br className="hidden xs:block" />
                <span className="xs:hidden"> </span>
                次世代の語彙習得システム
              </h2>
              
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto px-2">
                Google翻訳やDeepLでの翻訳履歴を自動取得し、
                <br className="hidden sm:block" />
                <span className="text-gradient font-semibold">スマートな間隔反復学習</span>
                でエンジニアの英語力を効率的に向上させます。
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center pt-6 sm:pt-8 max-w-md sm:max-w-none mx-auto">
              <Link href="/dashboard">
                <Button 
                  size="lg" 
                  className="gradient-primary text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-glow hover:shadow-intense transition-all duration-300 hover:scale-105 text-base sm:text-lg w-full sm:w-auto"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
                    今すぐ始める
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                </Button>
              </Link>
              
              <Link href="/auth">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="card-tech border-2 border-purple-500/30 hover:border-purple-500/60 text-foreground font-medium px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 w-full sm:w-auto"
                >
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4 sm:h-5 sm:w-5" />
                    デモを見る
                  </div>
                </Button>
              </Link>
            </div>

            {/* Tech Companies Social Proof */}
            <div className="pt-12 sm:pt-16">
              <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-6 font-medium">
                世界中の開発者に選ばれています
              </p>
              <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-8 opacity-60">
                <div className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base lg:text-lg font-bold">
                  <Code2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  Google
                </div>
                <div className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base lg:text-lg font-bold">
                  <Terminal className="h-4 w-4 sm:h-5 sm:w-5" />
                  Microsoft
                </div>
                <div className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base lg:text-lg font-bold">
                  <Sparkles className="h-4 w-4 sm:h-5 sm:w-5" />
                  Meta
                </div>
                <div className="flex items-center gap-1 sm:gap-2 text-sm sm:text-base lg:text-lg font-bold">
                  <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
                  OpenAI
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}