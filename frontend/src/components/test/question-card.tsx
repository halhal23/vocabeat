import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from "lucide-react"

interface Question {
  id: string
  word: { word: string; meaning: string }
  type: "multiple_choice" | "true_false"
  question: string
  options?: string[]
  correctAnswer: string
}

interface QuestionCardProps {
  question: Question
  selectedAnswer: string | null
  showResult: boolean
  isLastQuestion: boolean
  onAnswerSelect: (answer: string) => void
  onSubmitAnswer: () => void
  onNextQuestion: () => void
}

export function QuestionCard({ 
  question, 
  selectedAnswer, 
  showResult, 
  isLastQuestion,
  onAnswerSelect, 
  onSubmitAnswer, 
  onNextQuestion 
}: QuestionCardProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl">{question.question}</CardTitle>
        <CardDescription>
          単語: <span className="font-semibold">{question.word.word}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {question.type === "multiple_choice" && question.options && (
          <div className="grid gap-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => onAnswerSelect(option)}
                disabled={showResult}
                className={`p-4 text-left border rounded-lg transition-colors ${
                  selectedAnswer === option
                    ? showResult
                      ? option === question.correctAnswer
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                      : "border-primary bg-primary/5"
                    : showResult && option === question.correctAnswer
                      ? "border-green-500 bg-green-50"
                      : "border-border hover:bg-accent"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{option}</span>
                  {showResult && selectedAnswer === option && (
                    option === question.correctAnswer ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )
                  )}
                  {showResult && selectedAnswer !== option && option === question.correctAnswer && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {question.type === "true_false" && (
          <div className="grid grid-cols-2 gap-3">
            {["true", "false"].map((option) => (
              <button
                key={option}
                onClick={() => onAnswerSelect(option)}
                disabled={showResult}
                className={`p-4 text-center border rounded-lg transition-colors ${
                  selectedAnswer === option
                    ? showResult
                      ? option === question.correctAnswer
                        ? "border-green-500 bg-green-50"
                        : "border-red-500 bg-red-50"
                      : "border-primary bg-primary/5"
                    : showResult && option === question.correctAnswer
                      ? "border-green-500 bg-green-50"
                      : "border-border hover:bg-accent"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <span className="capitalize font-medium">{option === "true" ? "正しい" : "間違っている"}</span>
                  {showResult && selectedAnswer === option && (
                    option === question.correctAnswer ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )
                  )}
                  {showResult && selectedAnswer !== option && option === question.correctAnswer && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        {showResult && (
          <div className={`p-4 rounded-lg ${
            selectedAnswer === question.correctAnswer 
              ? "bg-green-50 border border-green-200" 
              : "bg-red-50 border border-red-200"
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {selectedAnswer === question.correctAnswer ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <XCircle className="h-5 w-5 text-red-600" />
              )}
              <span className="font-medium">
                {selectedAnswer === question.correctAnswer ? "正解！" : "不正解"}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              正解は: <span className="font-semibold">{question.correctAnswer === "true" ? "正しい" : 
              question.correctAnswer === "false" ? "間違っている" : question.correctAnswer}</span>
            </p>
          </div>
        )}

        <div className="flex justify-end pt-4">
          {!showResult ? (
            <Button 
              onClick={onSubmitAnswer} 
              disabled={!selectedAnswer}
            >
              回答する
            </Button>
          ) : (
            <Button onClick={onNextQuestion}>
              {isLastQuestion ? "テスト終了" : "次の問題"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}