// import { IconButton, Stack } from "@mui/material"

import { Card, Typography, List, ListItem, ListItemButton, ListItemText, Stack, IconButton } from "@mui/material"
import { useQuestionsStore } from "./store/questions"
import { type Question as QuestionType } from "./types.d"
import SyntaxHighligter from 'react-syntax-highlighter'
import { gradientDark } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material"
import { Footer } from "./Footer"

const getBackgroundColor = (info: QuestionType, answerIndex: number) => {
    const { correctAnswer, userSelectedAnswer } = info
    console.log("🚀 ~ getBackgroundColor ~ userSelectedAnswer:", userSelectedAnswer)

    if (userSelectedAnswer == null || userSelectedAnswer == undefined) return 'transparent'
    if (answerIndex !== correctAnswer && answerIndex !== userSelectedAnswer) return 'transparent'
    if (answerIndex === correctAnswer) return 'green'
    if (answerIndex === userSelectedAnswer) return 'red'

    return 'transparent'
}


const Question = ({ info }: { info: QuestionType }) => {
    console.log("🚀 ~ Question ~ info:", info.userSelectedAnswer)
    const selectAnswer = useQuestionsStore(state => state.selectAnswer)

    const handleClick = (answerIndex: number) => () => {
        selectAnswer(info.id, answerIndex)
    }


    return (
        <Card variant="outlined" sx={{ bgcolor: '#222', p: 2, textAlign: 'left', marginTop: 4 }}>
            <Typography variant="h5" >
                {info.question}
            </Typography>

            <SyntaxHighligter language="javascript" style={gradientDark} >
                {info.code}
            </SyntaxHighligter>

            <List sx={{ bgcolor: '#333' }} disablePadding>
                {info.answers.map((answer, index) => (
                    <ListItem key={index} sx={{ bgcolor: '#333' }} disablePadding divider>
                        <ListItemButton
                            disabled={info.userSelectedAnswer !== undefined}
                            onClick={handleClick(index)} sx={{
                                backgroundColor: getBackgroundColor(info, index)
                            }}>
                            <ListItemText primary={answer} sx={{ textAlign: 'center' }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

        </Card>
    )
}

export const Game = () => {
    const questions = useQuestionsStore(state => state.questions)
    console.log("🚀 ~ Game ~ questions:", questions)
    const currentQuestion = useQuestionsStore(state => state.currentQuestion)
    const goNextQuestion = useQuestionsStore(state => state.goNextQuestion)
    const goPreviousQuestion = useQuestionsStore(state => state.goPreviousQuestion)


    const questionInfo = questions[currentQuestion]

    return (
        <>
            <Stack direction="row" justifyContent="space-between" sx={{ mt: 2 }}>
                <IconButton onClick={goPreviousQuestion} disabled={currentQuestion === 0} >
                    <ArrowBackIosNew />
                </IconButton>

                {currentQuestion + 1} / {questions.length}

                <IconButton onClick={goNextQuestion} disabled={currentQuestion === questions.length - 1} > 
                    <ArrowForwardIos />
                </IconButton>
            </Stack>
            <Question info={questionInfo} />
            <Footer />
        </>
    )
}