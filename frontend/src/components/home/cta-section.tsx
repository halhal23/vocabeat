import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Rocket, ArrowRight, Code2, Zap } from "lucide-react"

export function CtaSection() {
  return (
    <section className="py-32 px-6">
      <div className="container mx-auto max-w-4xl">
        <div className="card-tech p-12 text-center">
          <div className="space-y-8">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-primary rounded-3xl flex items-center justify-center animate-tech-pulse shadow-glow">
                <Rocket className="h-10 w-10 text-white" />
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-4xl md:text-6xl font-bold">
                準備はできましたか？
              </h2>
              <h3 className="text-2xl md:text-3xl">
                <span className="text-gradient-glow">次世代の語彙学習</span>
                を体験しよう
              </h3>
            </div>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              世界中の開発者が選ぶVocabeatで、
              今日から効率的な英語学習を始めましょう。
              <br />
              <span className="text-gradient font-semibold">
                完全無料でスタート
              </span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Button 
                size="lg" 
                className="gradient-primary text-white font-bold px-10 py-4 rounded-2xl shadow-glow hover:shadow-intense transition-all duration-300 hover:scale-105 text-lg"
              >
                <Link href="/dashboard" className="flex items-center gap-3">
                  <Zap className="h-6 w-6" />
                  今すぐ無料で始める
                  <ArrowRight className="h-6 w-6" />
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="card-tech border-2 border-purple-500/30 hover:border-purple-500/60 text-foreground font-medium px-10 py-4 rounded-2xl transition-all duration-300 text-lg"
              >
                <Link href="/auth" className="flex items-center gap-3">
                  <Code2 className="h-6 w-6" />
                  デモを見る
                </Link>
              </Button>
            </div>

            <div className="pt-8 text-center">
              <p className="text-sm text-muted-foreground">
                クレジットカード不要 • 即座にスタート • いつでもキャンセル可能
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}