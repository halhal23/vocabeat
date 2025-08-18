"use client"

import { useState } from "react"
import { TestStartScreen } from "@/components/test/test-start-screen"
import { TestResultsScreen } from "@/components/test/test-results-screen"
import { QuestionProgress } from "@/components/test/question-progress"
import { QuestionCard } from "@/components/test/question-card"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"

const mockQuestions = [
  {
    id: "1",
    word: { word: "implement", meaning: "実装する" },
    type: "multiple_choice" as const,
    question: "'implement'の意味として正しいものはどれですか？",
    options: ["実装する", "削除する", "更新する", "作成する"],
    correctAnswer: "実装する"
  },
  {
    id: "2", 
    word: { word: "deprecated", meaning: "非推奨" },
    type: "true_false" as const,
    question: "'Deprecated'は「新しいプロジェクトで推奨される」という意味である",
    correctAnswer: "false"
  },
  {
    id: "3",
    word: { word: "scalable", meaning: "拡張可能な" },
    type: "multiple_choice" as const,
    question: "'scalable'の正しい意味を選んでください：",
    options: ["拡張可能な", "削減可能な", "変更可能な", "設定可能な"],
    correctAnswer: "拡張可能な"
  }
]

export default function TestPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [testResults, setTestResults] = useState<{
    questionId: string
    isCorrect: boolean
    userAnswer: string
  }[]>([])
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)

  const currentQuestion = mockQuestions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === mockQuestions.length - 1

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer
    setShowResult(true)
    
    setTestResults(prev => [...prev, {
      questionId: currentQuestion.id,
      isCorrect,
      userAnswer: selectedAnswer
    }])
  }

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setTestCompleted(true)
    } else {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    }
  }

  const handleStartTest = () => {
    setTestStarted(true)
    setCurrentQuestionIndex(0)
    setTestResults([])
    setTestCompleted(false)
    setSelectedAnswer(null)
    setShowResult(false)
  }

  if (!testStarted) {
    return (
      <ProtectedRoute>
        <TestStartScreen 
          questionCount={mockQuestions.length}
          onStartTest={handleStartTest}
        />
      </ProtectedRoute>
    )
  }

  if (testCompleted) {
    return (
      <ProtectedRoute>
        <TestResultsScreen 
          testResults={testResults}
          onStartTest={handleStartTest}
        />
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-6 space-y-6">
        <QuestionProgress 
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={mockQuestions.length}
        />
        
        <QuestionCard
          question={currentQuestion}
          selectedAnswer={selectedAnswer}
          showResult={showResult}
          isLastQuestion={isLastQuestion}
          onAnswerSelect={handleAnswerSelect}
          onSubmitAnswer={handleSubmitAnswer}
          onNextQuestion={handleNextQuestion}
        />
      </div>
    </ProtectedRoute>
  )
}