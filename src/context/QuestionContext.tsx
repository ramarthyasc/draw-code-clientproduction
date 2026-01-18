import { createContext } from "react";
import type { IQuestionContext } from "../components/QuestionCases";

export const QuestionContext = createContext<IQuestionContext | null>(null);
