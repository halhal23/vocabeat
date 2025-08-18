import { Bot, Smartphone, BarChart3, Zap, ArrowRight, Code2 } from "lucide-react"

export function FeaturesSection() {
  return (
    <section className="py-24 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            なぜエンジニアが
            <br />
            <span className="text-gradient-glow">Vocabeat</span>
            を選ぶのか
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            開発者のワークフローに完璧に統合された、
            次世代の語彙学習エクスペリエンス
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-20">
          {/* Auto Collection Feature */}
          <div className="group">
            <div className="card-tech p-8 h-full">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 animate-tech-pulse transition-transform duration-300">
                  <Bot className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gradient">自動収集</h3>
                <p className="text-muted-foreground text-lg">
                  Chrome拡張で翻訳を自動キャッチ
                </p>
              </div>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  Google翻訳やDeepLでの翻訳を自動検知し、
                  バックグラウンドで語彙データベースを構築。
                  作業を中断することなく、自然に学習コンテンツが蓄積されます。
                </p>
                <div className="flex items-center text-sm text-gradient font-medium">
                  <Code2 className="h-4 w-4 mr-2" />
                  ゼロ設定で即座に開始
                </div>
              </div>
            </div>
          </div>

          {/* Smart Review Feature */}
          <div className="group">
            <div className="card-tech p-8 h-full">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 animate-tech-pulse transition-transform duration-300">
                  <Smartphone className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gradient">AIアダプティブ学習</h3>
                <p className="text-muted-foreground text-lg">
                  記憶科学に基づく個別最適化
                </p>
              </div>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  忘却曲線とあなたの学習パターンを解析し、
                  最適なタイミングで復習を提案。
                  科学的根拠に基づいた効率的な記憶定着を実現します。
                </p>
                <div className="flex items-center text-sm text-gradient font-medium">
                  <Zap className="h-4 w-4 mr-2" />
                  記憶定着率98%達成
                </div>
              </div>
            </div>
          </div>

          {/* Analytics Feature */}
          <div className="group">
            <div className="card-tech p-8 h-full">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 animate-tech-pulse transition-transform duration-300">
                  <BarChart3 className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-gradient">詳細分析</h3>
                <p className="text-muted-foreground text-lg">
                  成長を可視化する高度なダッシュボード
                </p>
              </div>
              <div className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  学習進捗、語彙習得率、弱点分析など、
                  データドリブンなインサイトで学習を最適化。
                  エンジニアが愛する美しい分析ツール。
                </p>
                <div className="flex items-center text-sm text-gradient font-medium">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  リアルタイム学習分析
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="card-tech inline-block p-8">
            <h3 className="text-2xl font-bold mb-4">
              革新的な学習体験を
              <span className="text-gradient">今すぐ体感</span>
            </h3>
            <p className="text-muted-foreground mb-6 text-lg">
              セットアップ不要、5分で始められる次世代語彙学習
            </p>
            <button className="gradient-primary text-white font-bold px-8 py-3 rounded-xl shadow-glow hover:shadow-intense transition-all duration-300 hover:scale-105 inline-flex items-center gap-2">
              無料で始める
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}