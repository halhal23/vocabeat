import { TrendingUp, Users, Target, Star } from "lucide-react"

export function StatsSection() {
  const stats = [
    {
      icon: Target,
      value: "50K+",
      label: "学習済み単語",
      description: "累計習得語彙数"
    },
    {
      icon: Users,
      value: "2.5K+",
      label: "開発者",
      description: "世界中のエンジニア"
    },
    {
      icon: TrendingUp,
      value: "98%",
      label: "記憶定着率",
      description: "科学的学習メソッド"
    },
    {
      icon: Star,
      value: "4.9",
      label: "満足度",
      description: "ユーザーレビュー平均"
    }
  ]

  return (
    <section className="py-24 px-6">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            数字で見る
            <span className="text-gradient"> Vocabeat</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            世界中の開発者に愛され続ける理由
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="text-center group">
                <div className="card-tech p-6 h-full">
                  <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">
                    {stat.value}
                  </div>
                  <div className="text-lg font-semibold text-foreground mb-1">
                    {stat.label}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.description}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}