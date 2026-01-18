import { useEffect, useState, useRef, forwardRef } from "react";
import { HorizVertSlider } from "./HorizVertSlider.jsx";
import { ResultBox } from "./ResultBox.jsx";
import { useOutletContext } from "react-router-dom";
import { useSecureDataGetter } from "./customhooks/useSecureDataGetter";
import { useParams } from "react-router-dom";
import { OneClickButton } from "./utilityComponents/OneClickButton.js";

// store scrollHeight as localStorage, so that the Height is always there even when changing pages and unmounted


export const CodeSpace = forwardRef((props, codespaceRef) => {

    const textAreaRef = useRef(null);
    const numberAreaRef = useRef(null);
    const pastScrollHeightRef = useRef();
    const maxLineNumberRef = useRef();
    const resultBoxRef = useRef();

    const { jsonWebToken, setJsonWebToken, setUser, setIsLoggedIn } = useOutletContext();
    // custom hook
    const { data: result, setData: setResult, secureDataGetter } = useSecureDataGetter();
    const [language, setLanguage] = useState('js');
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [qTemplate, setQTemplate] = useState();
    //extract from route params
    const params = useParams();
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const { isLoggedIn } = useOutletContext();
    const [reset, setReset] = useState(0);
    const qTemplatesRef = useRef({});
    const [noSubmit, setNoSubmit] = useState(false);

    if (localStorage.getItem("qTemplates") !== null) {
        qTemplatesRef.current = JSON.parse(localStorage.getItem("qTemplates"));
    }
    const [resetMouseDown, setResetMouseDown] = useState(false);


    async function handleSubmit(e) {
        e.preventDefault();

        // Don't send requests when pressing the submit button when loading (ie' it's fetching)
        if (isButtonLoading) { return; }
        // When admin didn't create template -i shouldn't be able to submit
        if (noSubmit) { return; }

        const formData = new FormData(e.target);
        // side effects - changing jsonWebToken, user
        const path = `/api/draw-submit/${params.qname}`;
        try {
            setIsButtonLoading(true);
            await secureDataGetter(
                {
                    jsonWebToken,
                    setJsonWebToken,
                    setUser,
                    setIsLoggedIn
                },
                path,
                {
                    content: formData,
                    method: "POST"
                }
            );
        } catch (err) {
            setError(true);
        }
        setIsButtonLoading(false);

    }

    function handleScroll(e) {
        numberAreaRef.current.scrollTop = e.target.scrollTop;

        const computedStyle = window.getComputedStyle(textAreaRef.current);
        const lineHeight = parseFloat(computedStyle.lineHeight);
        const scrollDiff = textAreaRef.current.scrollHeight - pastScrollHeightRef.current;
        const maxScrollHeight = lineHeight * maxLineNumberRef.current; //maxLineNumber = 300 initially


        if (scrollDiff > 0 && textAreaRef.current.scrollHeight > maxScrollHeight) {
            maxLineNumberRef.current += 1;
            // when i press enter, i only move one line height downwards at a time - so don't need a loop
            numberAreaRef.current.value += "\n" + maxLineNumberRef.current;
        }

        pastScrollHeightRef.current = Math.max(pastScrollHeightRef.current, e.target.scrollHeight);
    }

    // Showing numbers
    useEffect(() => {
        if (textAreaRef.current) {
            // When we full zoomout the browser, it accomodates less than 300 numbers. So we can put 300 as the maximum number.
            maxLineNumberRef.current = 300;
            numberAreaRef.current.value = "";
            for (let i = 1; i <= maxLineNumberRef.current; i++) {
                if (i === maxLineNumberRef.current) {
                    numberAreaRef.current.value += i;
                    break;
                }
                numberAreaRef.current.value += i + "\n";
            }
        }
        pastScrollHeightRef.current = textAreaRef.current.scrollHeight;

        // numbers showing when scrolling - control the scrolling of numberArea programmatically when i scroll the text area = concept
    }, [])

    //get QTemplate 
    useEffect(() => {
        const controller = new AbortController();
        // only on the first fetch of a qtemplate is this function executed
        async function fetcher() {
            try {
                const res = await fetch(`/docs/template/${params.qname}?language=${language}`, {
                    method: "GET",
                    signal: controller.signal,
                })

                if (res.ok) {
                    const qtemplate = await res.text();
                    if (qtemplate === "admin-add-template") {
                        //admin didn't add template
                        setNoSubmit(true);
                    } else {
                        setNoSubmit(false);
                    }
                    setIsLoading(false);
                    setQTemplate(qtemplate);
                    setResult(""); // Reset the Resultbox result

                    if (!qTemplatesRef.current[params.qname]) {
                        qTemplatesRef.current[params.qname] = {};
                    }

                    qTemplatesRef.current[params.qname][language] = qtemplate;
                    window.localStorage.setItem("qTemplates", JSON.stringify(qTemplatesRef.current));


                } else {
                    setError(true);
                }

            } catch (err) {
                if (err.name === "AbortError") {
                    return;
                } else {
                    setError(true);
                }
            }
        }

        if (!qTemplatesRef.current[params.qname]?.[language]
            || qTemplatesRef.current[params.qname][language] === "admin-add-template") {
            fetcher();
        } else {
            setNoSubmit(false);
            setIsLoading(false);
            setQTemplate(qTemplatesRef.current[params.qname][language]);
            setResult(""); // Reset the Resultbox result
        }

        return () => {
            controller.abort();
        }

    }, [params.qname, language, reset]);

    useEffect(() => {
        setResult("");
    }, [isLoggedIn])


    function onLangChange(e) {
        setLanguage(e.target.value);
        setIsLoading(true);
    }
    function onTextChange(e) {
        qTemplatesRef.current[params.qname][language] = e.target.value;
        window.localStorage.setItem("qTemplates", JSON.stringify(qTemplatesRef.current));

        setQTemplate(e.target.value);
    }

    // Reset functionality
    function mouseDownReset() {
        setResetMouseDown(true);
    }
    function mouseUpReset() {
        if (resetMouseDown) {
            qTemplatesRef.current[params.qname][language] = null;
            window.localStorage.setItem("qTemplates", JSON.stringify(qTemplatesRef.current));
            setReset(prev => { return prev + 1; })
        }
        setResetMouseDown(false);
    }
    useEffect(() => {
        function handleMouseUpWindow() {
            setResetMouseDown(false);
        }
        window.addEventListener("mouseup", handleMouseUpWindow);
        return () => {
            window.removeEventListener("mouseup", handleMouseUpWindow);
        }
    }, [])
    //Reset functionality done

    //NOTE: loading & error state given inside textArea element only to show users the fetch error
    //
    const submitProps = {
        id: "submit-button",
        name: "Submit",
        color: "green",
        type: "submit"
    }
    const loadingProps = {
        id: "submit-button",
        name: "🌀",
        color: "green",
        type: "submit"
    }
    const colorVariants = {
        darkred: {
            normal: `bg-red-400 text-black hover:bg-red-300 hover:text-gray-800 active:text-gray-800 
            active:bg-red-600`
        },
    }

    if (error) {
        //make the user reload -so that he can't see the faulty SPA navigation due to error
        return (
            <div className="text-center">
                Something went wrong...
            </div>
        )
    }

    return (
        // implement uneditable numbers along the left side +
        // backend verification
        <div ref={codespaceRef} className="flex flex-col font-jet-brains">

            <form className="flex flex-col flex-2" id="code-form" onSubmit={handleSubmit}>
                {/* change language */}
                <div className="flex justify-between border-t">
                    <div className="text-left">
                        <select name="language" id="drop" onChange={onLangChange} value={language}
                            className="mt-1 py-px rounded-sm bg-amber-100 border-t border-r border-b border-black hover:cursor-pointer">
                            <option value="js" className="hover:cursor-pointer">Javascript</option>
                            <option value="c" className="hover:cursor-pointer">C</option>
                        </select>
                    </div>
                    <button type="button" onMouseDown={mouseDownReset} onMouseUp={mouseUpReset}
                        className={`border border-solid px-1.5 py-0 mx-1 my-1 rounded-sm cursor-pointer transition-colors duration-300 ease-out active:scale-100 ${colorVariants.darkred.normal}`}>
                        Reset
                    </button>

                </div>

                <div className="flex flex-2">
                    <textarea ref={numberAreaRef} disabled id="row-number" cols="1"
                        className=" text-right border-t border-r border-b border-black w-10 overflow-hidden resize-none pt-3"
                    > </textarea>
                    <textarea ref={textAreaRef} onScroll={handleScroll}
                        disabled={noSubmit}
                        value={error ? "Error..." : isLoading ? "...loading" : qTemplate}
                        onChange={onTextChange}
                        cols="130" name="code" id="code"
                        className="flex-2 border border-black resize-none pl-3 pt-3"
                    ></textarea>
                </div>

                <HorizVertSlider resultBoxRef={resultBoxRef} />
                <ResultBox ref={resultBoxRef} result={result} />

                <div className="flex justify-end px-2 border-r border-b border-t border-solid border-amber-300 py-1 min-w-24 bg-amber-100">
                    {isButtonLoading ?
                        <OneClickButton buttonProps={loadingProps} /> :
                        <OneClickButton buttonProps={submitProps} />
                    }
                </div>
            </form>

        </div>
    )
});

