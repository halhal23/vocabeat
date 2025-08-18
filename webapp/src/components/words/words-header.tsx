import { Button } from "@/components/ui/button"
import { BookOpen } from "lucide-react"

export function WordsHeader() {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">マイ単語帳</h1>
        <p className="text-muted-foreground">
          あなたの語彙コレクションを管理・復習
        </p>
      </div>
      <Button>
        <BookOpen className="mr-2 h-4 w-4" />
        学習モード
      </Button>
    </div>
  )
}