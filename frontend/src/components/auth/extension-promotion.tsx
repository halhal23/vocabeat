import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Chrome } from "lucide-react"

export function ExtensionPromotion() {
  return (
    <Card className="border-2 border-dashed border-gray-200 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50">
      <CardContent className="p-4">
        <div className="text-center space-y-3">
          <Chrome className="mx-auto h-6 w-6 text-gray-400 dark:text-gray-500" />
          <div>
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Chrome拡張機能</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Google翻訳とDeepLから自動的に単語を取得
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs h-8 border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            拡張機能をインストール
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}