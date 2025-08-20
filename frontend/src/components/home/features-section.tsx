import Link from "next/link"
import { Bot, Smartphone, BarChart3, Zap, ArrowRight, Code2 } from "lucide-react"

export function FeaturesSection() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 px-4 sm:px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            なぜエンジニアが
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            <span className="text-gradient-glow">Vocabeat</span>
            を選ぶのか
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-2">
            開発者のワークフローに完璧に統合された、
            <br className="hidden sm:block" />
            次世代の語彙学習エクスペリエンス
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20">
          {/* Auto Collection Feature */}
          <div className="group">
            <div className="card-tech p-6 sm:p-8 h-full">
              <div className="text-center mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-primary rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 animate-tech-pulse transition-transform duration-300">
                  <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gradient">自動収集</h3>
                <p className="text-muted-foreground text-base sm:text-lg">
                  Chrome拡張で翻訳を自動キャッチ
                </p>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  Google翻訳やDeepLでの翻訳を自動検知し、
                  バックグラウンドで語彙データベースを構築。
                  作業を中断することなく、自然に学習コンテンツが蓄積されます。
                </p>
                <div className="flex items-center text-xs sm:text-sm text-gradient font-medium">
                  <Code2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  ゼロ設定で即座に開始
                </div>
              </div>
            </div>
          </div>

          {/* Smart Review Feature */}
          <div className="group">
            <div className="card-tech p-6 sm:p-8 h-full">
              <div className="text-center mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-primary rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 animate-tech-pulse transition-transform duration-300">
                  <Smartphone className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gradient">AIアダプティブ学習</h3>
                <p className="text-muted-foreground text-base sm:text-lg">
                  記憶科学に基づく個別最適化
                </p>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  忘却曲線とあなたの学習パターンを解析し、
                  最適なタイミングで復習を提案。
                  科学的根拠に基づいた効率的な記憶定着を実現します。
                </p>
                <div className="flex items-center text-xs sm:text-sm text-gradient font-medium">
                  <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  記憶定着率98%達成
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Feature */}
          <div className="group">
            <div className="card-tech p-6 sm:p-8 h-full">
              <div className="text-center mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-primary rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 animate-tech-pulse transition-transform duration-300">
                  <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 text-gradient">詳細分析</h3>
                <p className="text-muted-foreground text-base sm:text-lg">
                  成長を可視化する高度なダッシュボード
                </p>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  学習進捗、語彙習得率、弱点分析など、
                  データドリブンなインサイトで学習を最適化。
                  エンジニアが愛する美しい分析ツール。
                </p>
                <div className="flex items-center text-xs sm:text-sm text-gradient font-medium">
                  <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  リアルタイム学習分析
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="card-tech inline-block p-6 sm:p-8 max-w-lg mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
              革新的な学習体験を
              <br className="sm:hidden" />
              <span className="text-gradient">今すぐ体感</span>
            </h3>
            <p className="text-muted-foreground mb-4 sm:mb-6 text-base sm:text-lg px-2">
              セットアップ不要、5分で始められる次世代語彙学習
            </p>
            <Link href="/dashboard">
              <button className="gradient-primary text-white font-bold px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl shadow-glow hover:shadow-intense transition-all duration-300 hover:scale-105 inline-flex items-center gap-2 text-sm sm:text-base">
                無料で始める
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}