import { EmptyStatement } from "typescript";

export enum QuestionType {
    SINGLE_ANSWER = "SINGLE_ANSWER",
    TRUE_FALSE = "TRUE_FALSE",
    SURVEY = "SURVEY",
    DESCRIPTIVE = "DESCRIPTIVE",
    MULTI_ANSWER = "MULTI_ANSWER",
    SHORT_ANSWER = "SHORT_ANSWER"
}

export interface AnswerInterface {
    hasLatex: boolean,
    description: string,
    id: number,
}


export interface QuestionInterface {
    id: number,
    type: QuestionType,
    isRequired: boolean,
    //To Do emergency exit
    hasLatex: boolean,
    question: string,
    answers: Array<AnswerInterface>,
}


export interface TestInterface {
    id: number,
    numberOfQuestions: number,
    questions: Array<QuestionInterface>
}