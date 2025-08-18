import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Zap, ArrowRight, Terminal, Code2, Sparkles } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-screen flex items-center">
      {/* Cosmic Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="container relative mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-8">
            {/* Tech Icon Badge */}
            <div className="flex justify-center mb-8">
              <div className="relative group">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow animate-tech-pulse group-hover:scale-110 transition-transform duration-300">
                  <Terminal className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center animate-float">
                  <Code2 className="h-3 w-3 text-white" />
                </div>
              </div>
            </div>

            {/* Main Hero Text */}
            <div className="space-y-6">
              <h1 className="text-6xl md:text-8xl font-bold tracking-tight">
                <span className="text-gradient-glow animate-neon-glow">
                  Vocabeat
                </span>
              </h1>
              <div className="w-32 h-1 bg-gradient-primary mx-auto rounded-full glow-primary" />
            </div>
            
            <div className="max-w-4xl mx-auto space-y-6">
              <h2 className="text-2xl md:text-4xl font-bold text-foreground">
                翻訳を<span className="text-gradient">自動学習</span>に変える
                <br />
                次世代の語彙習得システム
              </h2>
              
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                Google翻訳やDeepLでの翻訳履歴を自動取得し、
                <span className="text-gradient font-semibold">スマートな間隔反復学習</span>
                でエンジニアの英語力を効率的に向上させます。
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Button 
                size="lg" 
                className="gradient-primary text-white font-bold px-8 py-4 rounded-2xl shadow-glow hover:shadow-intense transition-all duration-300 hover:scale-105 text-lg"
              >
                <Link href="/dashboard" className="flex items-center gap-3">
                  <Zap className="h-5 w-5" />
                  今すぐ始める
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="card-tech border-2 border-purple-500/30 hover:border-purple-500/60 text-foreground font-medium px-8 py-4 rounded-2xl transition-all duration-300"
              >
                <Link href="/auth" className="flex items-center gap-2">
                  <Terminal className="h-5 w-5" />
                  デモを見る
                </Link>
              </Button>
            </div>

            {/* Tech Companies Social Proof */}
            <div className="pt-16">
              <p className="text-sm text-muted-foreground mb-6 font-medium">
                世界中の開発者に選ばれています
              </p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
                <div className="flex items-center gap-2 text-lg font-bold">
                  <Code2 className="h-5 w-5" />
                  Google
                </div>
                <div className="flex items-center gap-2 text-lg font-bold">
                  <Terminal className="h-5 w-5" />
                  Microsoft
                </div>
                <div className="flex items-center gap-2 text-lg font-bold">
                  <Sparkles className="h-5 w-5" />
                  Meta
                </div>
                <div className="flex items-center gap-2 text-lg font-bold">
                  <Zap className="h-5 w-5" />
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