export interface Question {
    id: number
    question: string
    code: string
    answers: string[]
    userSelectedAnswer?: number | null
    isCorrectUserAnswer?: boolean
    correctAnswer: number
}