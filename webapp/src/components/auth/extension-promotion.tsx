import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Chrome } from "lucide-react"

export function ExtensionPromotion() {
  return (
    <Card className="border-dashed">
      <CardContent className="pt-6">
        <div className="text-center space-y-3">
          <Chrome className="mx-auto h-8 w-8 text-muted-foreground" />
          <div>
            <h3 className="font-medium">Chrome拡張機能もお忘れなく</h3>
            <p className="text-sm text-muted-foreground">
              拡張機能をインストールしてGoogle翻訳とDeepLから自動的に単語を取得しましょう
            </p>
          </div>
          <Button variant="outline" size="sm" className="mt-2">
            拡張機能をインストール
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}