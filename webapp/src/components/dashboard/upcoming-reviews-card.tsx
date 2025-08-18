import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const mockUpcomingReviews = [
  { word: "asynchronous", nextReview: "2時間" },
  { word: "middleware", nextReview: "4時間" },
  { word: "polymorphism", nextReview: "1日" },
]

export function UpcomingReviewsCard() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>復習予定の単語</CardTitle>
        <CardDescription>
          もうすぐ復習が必要な単語
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockUpcomingReviews.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">{item.word}</p>
                <p className="text-xs text-muted-foreground">{item.nextReview}後</p>
              </div>
            </div>
          ))}
        </div>
        <Button className="w-full mt-4" variant="outline">
          復習セッション開始
        </Button>
      </CardContent>
    </Card>
  )
}