import { forwardRef, useRef, useEffect } from "react";
import { QuestionCases } from "./QuestionCases";
import { Result } from "./Result";
import { ActiveOrNotButton } from "./utilityComponents/ActiveOrNotButton";
import { useIsButtonActive } from "./customhooks/useActiveOrNotButton";
import { useLocation, useOutletContext } from "react-router-dom";


export const ResultBox = forwardRef((props, resultBoxRef) => {

    const { activeButtonId, setActiveButtonId, handleMouseDown, handleMouseUp } = useIsButtonActive("0");

    // to know if url change is causing the render (using Link)
    // or due to the state change inside the component itself.
    // location.key changes if url changes (route params or anything else) - any new history entry created
    const location = useLocation();
    const locationKeyRef = useRef(location.key);
    const isLocationChanged = locationKeyRef.current !== location.key;
    useEffect(() => {
        setActiveButtonId("0");
        locationKeyRef.current = location.key;
    }, [isLocationChanged]);

    if (props.result === "") {
        // default - show the cases - when Codespace component rendered initially
        return (
            <div ref={resultBoxRef} className="h-81 text-left overflow-auto">
                <QuestionCases />
            </div>
        )
    } else if (props.result === "signin") {
        // When i get refresh token error (ie' Not logged in), then did setData as "signin" in custom hook. 
        // Displays - signin to submit
        return (
            <div ref={resultBoxRef} className="h-81 text-left overflow-auto">
                <div className="px-2 mx-3 my-3 py-1 border border-yellow-600 rounded-md bg-yellow-300 text-black"
            > Signin to submit your answer ↑ </div>
                <QuestionCases />
            </div>
        )

    } else if (props.result === "Coming soon ...") {
        // Coming soon ... is the output from GNU C COMPILER
        return (
            <div ref={resultBoxRef} className="h-81 text-left overflow-auto">
                <div className="px-2 mx-3 my-3 py-1 border border-blue-600 rounded-md bg-blue-200 text-black"
            > C language coming soon...</div>
                <QuestionCases />
            </div>
        )
    } else if (typeof props.result === "string") {
        // if props.result is string, then it is Error stack trace
        return (
            <div ref={resultBoxRef} className="h-81 text-left overflow-auto">
                <div className="px-2 mx-3 my-3 py-2 border border-red-700 rounded-md bg-red-300 text-red-950" >
                    ERROR:
                </div>
                <div className="px-7 mx-3 my-3 py-4 rounded-md bg-red-100 text-red-950">
                    {props.result ? props.result.split("<br>").map((str, i) => {
                        return <div key={i}>{str}</div>
                    }) : ""}
                </div>
            </div>
        )
    } else {
        //If prop.result is an Array of Arrays, then it's the Case Result


        return (
            <div ref={resultBoxRef} className="mx-3 h-81 text-left overflow-auto">
                {
                    props.result.some((result) => {
                        return result.at(-1).pass === false;
                    }) ?
                        <div className="px-2 mt-3 py-2 rounded-md bg-red-200 text-red-900">
                            OOPS !! You Failed
                        </div> :
                        <div className="px-2 mt-3 py-2 rounded-md bg-green-200  text-green-900">
                            YAY !! You Passed
                        </div>


                }
                <div className="my-2">
                    {props.result.map((result, i) => {
                        //Can be many cases
                        return (
                            <ActiveOrNotButton key={i} interactionFuncs={{
                                onMouseDown: handleMouseDown,
                                onMouseUp: handleMouseUp
                            }}
                                buttonProps={{
                                    id: i,
                                    name: `Case ${i}`,
                                    isActive: activeButtonId === `${i}`,
                                    color: result.at(-1).pass ? "darkgreen" : "darkred"
                                }} />
                        )
                    })
                    }
                </div>
                <Result result={props.result[Number(activeButtonId)]} />

            </div >
        )
    }

})
