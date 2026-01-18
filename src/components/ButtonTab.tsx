import { Suspense, useContext } from "react";
import { QuestionContext } from "../context/QuestionContext";
import { useIsButtonActive } from "./customhooks/useActiveOrNotButton";
import type { IActiveOrNotButtonProps } from "./utilityComponents/ActiveOrNotButton";
import { ActiveOrNotButton } from "./utilityComponents/ActiveOrNotButton";
import { OneClickButton } from "./utilityComponents/OneClickButton";
import type { IOneClickButtonProps } from "./utilityComponents/OneClickButton";
import { useOneClickButton } from "./customhooks/useOneClickButton";
import { Link } from "react-router-dom";
import type { OneClickButtonClass } from "./utilityComponents/OneClickButton";

export function ButtonTab() {
    const context = useContext(QuestionContext);
    if (!context) {
        throw new Error("Context shouldn't be null")
    }
    const { isCoding, setIsCoding, qDetailsQNextPrev } = context;
    const { prevNextQuestionsArray } = qDetailsQNextPrev
    const { handleMouseDown: codedrawHandleDown, handleMouseUp: codedrawHandleUp } = useOneClickButton(setIsCoding);
    //don't need this activeButtonId bcs, we are not having 2 or more ActiveOrNotButtons to switch the "isActive" state

    const questionProps: IActiveOrNotButtonProps = {
        id: 0,
        name: "Question",
        isActive: true,
        color: "gray",
    }

    const nextProps: IOneClickButtonProps = {
        id: "next",
        name: ">>",
        color: "gray",
    }
    const previousProps: IOneClickButtonProps = {
        id: "previous",
        name: "<<",
        color: "gray",
    }

    const isCodingProps: IOneClickButtonProps = {
        id: "code-draw",
        name: isCoding ? "<------ DRAW-BOARD" : "CODE-SPACE ------>",
        color: "amber",

    }
    //

    // for Link
    const colorVariants: OneClickButtonClass = {
        gray: {
            normal: "bg-gray-300 text-black hover:bg-gray-200 hover:text-gray-400 active:text-gray-400\
            active:bg-gray-600",
        },
    }

    return (
        <div className="flex mx-2 py-0 px-5 items-center justify-between border border-solid border-black ">
            <div className="flex gap-3">
                <ActiveOrNotButton buttonProps={questionProps} />

                <div className="flex gap-1">
                    {prevNextQuestionsArray[0] === null ?
                        <OneClickButton
                            buttonProps={previousProps} /> :
                        <Link to={`/draw-code/${prevNextQuestionsArray[0].name}`}
                            className={`border border-solid px-1.5 py-0 mx-1 my-1 rounded-sm cursor-pointer transition-colors duration-300 ease-out active:scale-100 ${colorVariants["gray"]?.normal}`}
                        > {`<<`}</Link>
                    }
                    {prevNextQuestionsArray[1] === null ?
                        <OneClickButton
                            buttonProps={nextProps} /> :
                        <Link to={`/draw-code/${prevNextQuestionsArray[1].name}`}
                            className={`border border-solid px-1.5 py-0 mx-1 my-1 rounded-sm cursor-pointer transition-colors duration-300 ease-out active:scale-100 ${colorVariants["gray"]?.normal}`}
                        > {`>>`}</Link>
                    }
                </div>
            </div>
            <div className="ml-5 w-max">
                    <OneClickButton interactionFuncs={{ onMouseDown: codedrawHandleDown, onMouseUp: codedrawHandleUp }}
                        buttonProps={isCodingProps} />
            </div>
        </div>
    )
}


