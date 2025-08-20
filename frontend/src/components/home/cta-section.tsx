import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Rocket, ArrowRight, Code2, Zap } from "lucide-react"

export function CtaSection() {
  return (
    <section className="py-20 sm:py-24 lg:py-32 px-4 sm:px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="card-tech p-8 sm:p-10 lg:p-12 text-center">
          <div className="space-y-6 sm:space-y-8">
            <div className="flex justify-center mb-6 sm:mb-8">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-primary rounded-2xl sm:rounded-3xl flex items-center justify-center animate-tech-pulse shadow-glow">
                <Rocket className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold">
                準備はできましたか？
              </h2>
              <h3 className="text-xl sm:text-2xl lg:text-3xl">
                <span className="text-gradient-glow">次世代の語彙学習</span>
                <br className="sm:hidden" />
                <span className="sm:hidden"> </span>
                を体験しよう
              </h3>
            </div>
            
            <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-2">
              世界中の開発者が選ぶVocabeatで、
              今日から効率的な英語学習を始めましょう。
              <br />
              <span className="text-gradient font-semibold">
                完全無料でスタート
              </span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center pt-6 sm:pt-8 max-w-lg sm:max-w-none mx-auto">
              <Link href="/dashboard">
                <Button 
                  size="lg" 
                  className="gradient-primary text-white font-bold px-8 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-glow hover:shadow-intense transition-all duration-300 hover:scale-105 text-base sm:text-lg w-full sm:w-auto"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Zap className="h-5 w-5 sm:h-6 sm:w-6" />
                    今すぐ無料で始める
                    <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                </Button>
              </Link>
              
              <Link href="/auth">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="card-tech border-2 border-purple-500/30 hover:border-purple-500/60 text-foreground font-medium px-8 sm:px-10 py-3 sm:py-4 rounded-xl sm:rounded-2xl transition-all duration-300 text-base sm:text-lg w-full sm:w-auto"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Code2 className="h-5 w-5 sm:h-6 sm:w-6" />
                    デモを見る
                  </div>
                </Button>
              </Link>
            </div>

            <div className="pt-6 sm:pt-8 text-center">
              <p className="text-xs sm:text-sm text-muted-foreground px-2">
                クレジットカード不要 • 即座にスタート • いつでもキャンセル可能
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}