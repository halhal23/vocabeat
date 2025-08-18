interface QuestionProgressProps {
  currentQuestionIndex: number
  totalQuestions: number
}

export function QuestionProgress({ currentQuestionIndex, totalQuestions }: QuestionProgressProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          問題 {currentQuestionIndex + 1} / {totalQuestions}
        </h1>
        <div className="w-full bg-secondary rounded-full h-2 mt-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all" 
            style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}