import {Socket } from "socket.io";

export enum ServerCallbacks {
    OK = 'ok',
    ERROR = 'Error'
}

export enum ServerReasons {
    USEREXIST = "Username taken",
    TESTEXIST = "This test name exist"
}

export enum ServerMode {
    PRIVATE = "PRIVATE",
    PUBLIC = "PUBLIC"
}

export interface CustomSocket extends Socket {
    username?: string;
}

export interface User {
    name: string;
    socketId: string;
}

export interface Call {
    status: ServerCallbacks
    reason?: ServerReasons;
}

export enum QuestionType {
    SINGLE_ANSWER = 'SINGLE_ANSWER',
    TRUE_FALSE = 'TRUE_FALSE',
    SURVEY = 'SURVEY',
    DESCRIPTIVE = 'DESCRIPTIVE',
    MULTI_ANSWER = 'MULTI_ANSWER',
    SHORT_ANSWER = 'SHORT_ANSWER',
}

export enum TestType {
    MATH = 'MATH',
    HISTORY = 'HISTORY',
    LANGUAGE = 'LANGUAGE',
    UNKNOWN = 'UNKNOWN',
}

export interface AnswerInterface {
    description: string;
    id: number;
}

export interface QuestionInterface {
    id: number;
    type: QuestionType;
    isRequired: boolean;
    hasLatex: boolean;
    question: string;
    answers: Array<AnswerInterface>;
    UsersAnswers: Array<UserAnswer>
}

export interface TestInterface {
    id: string;
    users: number
    numberOfQuestions: number;
    questions: Array<QuestionInterface>;
}

export interface UserAnswer {
    username: string,
    answer: Array<AnswerInterface | string>
}