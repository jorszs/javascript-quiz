import { create } from 'zustand'
import { type Question } from '../types.d'
import confetti from 'canvas-confetti'
import { devtools, persist } from 'zustand/middleware'
import { getAllQuestions } from '../services/questions'

interface State {
    questions: Question[]
    currentQuestion: number
    fetchQuestions: (limit: number) => Promise<void>
    selectAnswer: (questionId: number, answerIndex: number) => void
    goNextQuestion: () => void
    goPreviousQuestion: () => void
    reset: () => void
}

// const loggerMiddleware = (config: any) => (set: any, get: any, api: any) => {
//     console.log('logging')
//     return config(
//         // set
//         (args: any) => {
//             console.log('  applying', args)
//             set(args)
//             console.log('  new state', get());
            
//         }
//         , get, api)
// }

export const useQuestionsStore = create<State>()(devtools(persist((set, get) => {
    return {
    questions: [],
    currentQuestion: 0,
    fetchQuestions: async (limit: number) => {
        const questions = await getAllQuestions(limit)
        set({ questions })
    },
    selectAnswer: (questionId: number, answerIndex: number) => {
        const { questions } = get()
        // usar el structure clone para clonar el objeto
        const newQuestions = structuredClone(questions)
        const questionIndex = newQuestions.findIndex(q => q.id === questionId)
        const questionInfo = newQuestions[questionIndex]
        const isCorrectUserAnswer = questionInfo.correctAnswer === answerIndex

        if (isCorrectUserAnswer) {
            confetti()
        }

        newQuestions[questionIndex] = {
            ...questionInfo,
            isCorrectUserAnswer,
            userSelectedAnswer: answerIndex
        }

        set({ questions: newQuestions }, false, 'SELECT_ANSWER')
    },
    goNextQuestion: () => {
        const {currentQuestion, questions} = get()
        const nextQuestion = currentQuestion + 1

        if (nextQuestion <= questions.length) {
            set({currentQuestion: nextQuestion}, false, 'GO_NEXT_QUESTION')
        }
    },
    goPreviousQuestion: () => {
        const {currentQuestion} = get()
        const previousQuestion = currentQuestion - 1

        if (previousQuestion >= 0) {
            set({currentQuestion: previousQuestion}, false, 'GO_PREVIOUS_QUESTION')
        }
    },
    reset: () => {
        set({questions: [], currentQuestion: 0}, false, 'RESET')
    }
}}, {
    name: 'questions-storage',
})))