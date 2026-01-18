import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useSecureDataGetter } from "./customhooks/useSecureDataGetter";
import type { IAppContext } from "./AdminQuestionsList";
import type { IQuestionDetail } from "./QuestionCases";

export const colorVariants = {
    darkred: {
        normal: `bg-red-400 text-black hover:bg-red-300 hover:text-gray-800 active:text-gray-800 
            active:bg-red-600`
    },
    green: {
        normal: `bg-green-300 text-black hover:bg-green-200 hover:text-gray-900 active:text-gray-900
            active:bg-green-400`
    },
    gray: {
        normal: "bg-gray-300 text-black hover:bg-gray-200 hover:text-gray-400 active:text-gray-400\
            active:bg-gray-600",
    },
    blue: {
        normal: `bg-blue-300 text-black hover:bg-blue-200 hover:text-gray-900 active:text-gray-900
            active:bg-blue-400`
    }
}

export const createqDetail: IQuestionDetail = {
    id: -1,
    name: "create",
    title: "change title",
    difficulty: "easy",
    description: "Hey, change the description",
    examples: [
        {
            id: 0,
            title: "Example 1",
            input: "Eg: lalu = ['grambu']",
            output: "Eg: [['grab'],['me...'], ['noooo']]",
            explanation: "Eg: I didn't mean it that way"
        },
        {
            id: 1,
            title: "Example 2",
            input: "Eg: lalu = ['dasan', 'vijayan']",
            output: "Eg: ['cow']",
            explanation: "Eg: Maybe we can become rich by selling milk"
        }
    ],
    constraints: [
        "1 <= milk.quantity <= 2000",
        "2 <= cow.num <= 3",
    ],
    tips: [
        {
            title: "Recommended Time & Space Complexity",
            description: "Get milk faster, add water, sell it for higher price.."
        },

        {
            title: "Hint 1",
            description: "Neighbours or the shopkeeper shouldn't know about the water"
        }
    ]
}

function AdminQuestionDetail() {
    const params = useParams();
    const { data, setData, secureDataGetter } = useSecureDataGetter<IQuestionDetail, IQuestionDetail>();
    const context: IAppContext = useOutletContext();
    const { jsonWebToken, setJsonWebToken, setUser, user, setIsLoggedIn, setIsAdmin } = context;
    const [error, setError] = useState(false);
    const [isButtonLoading, setIsButtonLoading] = useState(false);

    const [created, setCreated] = useState(false);
    const navigate = useNavigate();
    const [qdetail, setQdetail] = useState<IQuestionDetail>();
    const [roughtext, setRoughtext] = useState<string>(`    Write example/constraint/tip here, then copy-paste in the table below ↓

                                  //ROUGH AREA`);

    useEffect(() => {

        // if (!isMountedRef.current || data !== "") {

        // If in the update, the name was changed, then the qdetail 
        // with changed name will get returned. So when navigating to that param name, I don't want it to 
        // fetch once more
        // if (params.qname === qdetail?.name) { return; }
        // end
        //
        // When we are creating new Question 
        if (params.qname === "create") {
            if (window.localStorage.getItem("lastqid")) {
                const nextqid = Number(window.localStorage.getItem("lastqid")) + 1;
                createqDetail.id = nextqid;
                createqDetail.name = Math.random().toString();
                setData({ ...createqDetail }); // qDetail will be set automatically be the next UseEffect
            }
            return;
        }
        //end

        async function fetcher() {
            const path = `/admin/questions/${params.qname}`;
            try {
                await secureDataGetter({
                    setJsonWebToken,
                    jsonWebToken,
                    setUser,
                    setIsLoggedIn
                },
                    path
                );

            } catch (err) {
                setError(true);
            }
        }

        fetcher();
        // }
        // isMountedRef.current = true;

    }, [jsonWebToken]);


    useEffect(() => {
        if (jsonWebToken && user.role === "admin") {
            setIsAdmin(true);
            // setQuestion detail object as the state
            if (typeof data !== "string") {
                setQdetail({ ...data });
                if (params.qname !== "create") {
                    navigate(`/admin/question-detail/${data.name}`, { replace: true });
                }
            }
        } else {
            setIsAdmin(false);
        }
    }, [jsonWebToken, data]);


    const colorMap = {
        easy: "text-green-500",
        medium: "text-orange-600",
        hard: "text-red-700",
        default: "text-black"
    }

    async function handleUpdateSubmit(e: React.MouseEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!qdetail) { return; }
        if (isButtonLoading) { return; }

        const path = `/admin/questions/${params.qname}`;
        try {
            setIsButtonLoading(true);
            await secureDataGetter({
                setJsonWebToken,
                jsonWebToken,
                setUser,
                setIsLoggedIn
            },
                path,
                {
                    content: qdetail,
                    method: "PUT"
                }
            );

        } catch (err) {
            setError(true);
        }
        setIsButtonLoading(false);
    }

    async function handleCreateSubmit(e: React.MouseEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!qdetail) { return; }
        if (isButtonLoading) { return; }

        const path = `/admin/new-question/`;
        try {
            setIsButtonLoading(true);
            await secureDataGetter({
                setJsonWebToken,
                jsonWebToken,
                setUser,
                setIsLoggedIn
            },
                path,
                {
                    content: qdetail,
                    method: "POST"
                }
            );

            // Update the last question id to the current qdetail id - which is the new question
            window.localStorage.setItem("lastqid", `${qdetail.id}`)

        } catch (err) {
            setError(true);
        }
        setCreated(true);
        setIsButtonLoading(false);
        //change the url param
        navigate(`/admin/question-detail/${qdetail.name}`, { replace: true });
    }

    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.currentTarget.value;
        const id = e.currentTarget.id;
        setQdetail(qdetail => {
            if (!qdetail) { return qdetail; }
            return {
                ...qdetail,
                [id]: value
            }
        });
    }
    function handleTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        const id = e.currentTarget.id;
        const value = e.currentTarget.value;
        setQdetail(qdetail => {
            if (!qdetail) { return qdetail; }
            return {
                ...qdetail,
                [id]: value
            }
        })

    }

    function handleObjectTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {

        const id = e.currentTarget.id;
        const stringvalue = e.currentTarget.value;

        setQdetail(qdetail => {
            if (!qdetail) { return qdetail; }
            let value;
            try {
                value = JSON.parse(stringvalue);
            } catch (err) {
                if (id === "examples" || id === "constraints" || id === "tips") {
                    value = qdetail[id];
                }
            }
            return {
                ...qdetail,
                [id]: value
            }
        })
    }
    function handleRoughTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        const value = e.currentTarget.value;
        setRoughtext(value);
    }
    function resetQHandleMouseDown() {
        if (typeof data !== "string") {
            // reset to initial fetched Qdetail data
            setQdetail({ ...data });
            setRoughtext(`    Write example/constraint/tip here, then copy-paste in the table below ↓

                                  //ROUGH AREA`);
        }
    }

    if (error) {
        throw new Error("Something went wrong..");
    }

    if (data === "") {
        return (
            <div className="text-center">
                loading...
            </div>
        )
    }

    if (typeof data === "string") {

        return (
            <div className="flex justify-center">
                {
                    data === "not-admin" ?
                        (
                            <div className="text-4xl text-center mt-20 border p-5">
                                Heyy Bro!! You're not an Admin...
                                <br />
                                <br />
                                Forget it
                            </div>
                        ) : data === "signin" ?
                            (
                                <div className="text-4xl text-center mt-20 border p-5">
                                    Signin as Admin to Access...
                                </div>
                            ) : (
                                <div className="text-4xl text-center mt-20 border p-5">
                                    BAD REQUEST
                                </div>

                            )
                }
            </div>
        )
    }



    function qExamplesTipsStringifier(key: "examples" | "tips") {
        if (!qdetail) { return; }
        const string = JSON.stringify(qdetail[key]);
        const stringformatted = string.replace("[{\"", "[\n\n{\n\"")
            .replace(/}(?!.*})/, "\n}")
            .replace(/]$/, "\n\n]")
            .replace(/},{/g, "\n}\n\n,\n\n{\n")
            .replace(/,"/g, ",\n\"");
        return stringformatted;

    }
    function qConstraintsStringifier() {
        if (!qdetail) { return; }
        const qConstraintsString = JSON.stringify(qdetail.constraints);
        const qConstraintsFormatted = qConstraintsString.replace("[", "[\n\n")
            .replace(/]$/, "\n\n]")
            .replace(/,"/g, ",\n\"");
        return qConstraintsFormatted;

    }
    return (
        <div className="flex-2 flex p-4 text-left overflow-y-auto border-black border-solid border-y border-x  mx-3 mt-0 mb-2">
            <div className="flex-1 border px-4 py-4 overflow-y-auto">
                <h2 className="text-gray-800 font-extrabold text-2xl mb-2">{qdetail?.title}</h2>
                <p className={`${colorMap[qdetail ? qdetail.difficulty : "default"]} font-bold bg-gray-200 inline-block px-2 py-1 rounded-lg mb-2`}
                >{qdetail?.difficulty}</p>
                <br />
                <p className="whitespace-pre-line" >{qdetail?.description}</p>

                {/* Examples */}
                <ul className="my-2">
                    {qdetail?.examples?.length ? qdetail.examples.map((example) => {
                        return (
                            <li key={example.id} >
                                <h4 className="font-bold my-2 ">{example.title}:</h4>
                                <div className="p-2 bg-[#FAFAD2]">
                                    <p><span className="text-green-700">Input</span>: {example.input}</p>
                                    <p><span className="text-green-700">Output</span>: {example.output}</p>
                                </div>
                                {example.explanation.length !== 0 ? <p className="whitespace-pre-line"><span className="text-gray-700">Explanation:</span>{"\n"} {example.explanation}</p> : <p></p>}
                            </li>
                        )
                    }) : <p></p>}
                </ul>

                <h4 className="font-bold mt-8">Constraints:</h4>
                <ul className="mx-6 list-disc">
                    {/* Constraints */}
                    {qdetail?.constraints?.length ? qdetail.constraints.map((constraint, index) => {
                        // here i gave index, because the whole thing will be anyway remounted when i change the qdetail?
                        return (
                            <li key={index}>
                                {constraint}
                            </li>
                        )
                    }) :
                        <p></p>}
                </ul>

                <br />
                {/* Tips */}
                <ul className="mt-12">
                    {qdetail?.tips?.length ? qdetail.tips.map((tip, index) => {
                        return (
                            <li className="border-t border-solid border-black my-2 pt-1" key={index}>
                                <details>
                                    <summary className="hover:text-gray-600 cursor-pointer">{tip.title}</summary>
                                    <p style={{ paddingTop: "10px" }}>{tip.description}</p>
                                </details>
                            </li>
                        )
                    }) :
                        <p></p>}
                </ul>
            </div>

            <div className="flex-2 flex flex-col ml-10 w-100 border px-4 py-4 overflow-y-auto">

            <div className="flex items-end">
                <div className="bg-amber-200 px-2 mb-2 rounded-md text-sm">
                    Note: "Examples" is parsed to be shown as the test cases in the resultbox before submitting the answer
                </div>
            </div>
                <form onSubmit={params.qname !== "create" || created ?
                    handleUpdateSubmit : handleCreateSubmit} className="flex-2 flex flex-col">
                    {/* <textarea ref={textAreaRef} */}
                    {/*     value={error ? "Sorry.. Network error" : JSON.stringify(qdetail)} */}
                    {/*     onChange={onTextChange} */}
                    {/*     cols={130} name="qdetail" id="qdetail" */}
                    {/*     className="flex-2 border border-black resize-none " */}
                    {/* ></textarea> */}
                    {/**/}

                    <div >
                        <label htmlFor="id" className="font-bold inline-block w-35">Id: </label>
                        <input disabled id="id" name="id" value={qdetail?.id ?? ""} onChange={handleInputChange}
                            className="border pl-2 bg-gray-300 w-100 mb-2" />
                    </div>
                    <div>
                        <label htmlFor="name" className="cursor-pointer font-bold inline-block w-35">Name: </label>
                        <input id="name" name="name" value={qdetail?.name ?? ""} onChange={handleInputChange}
                            className="border pl-2 bg-gray-100 w-100 mb-2" />
                    </div>
                    <div>
                        <label htmlFor="title" className="cursor-pointer font-bold inline-block w-35">Title: </label>
                        <input id="title" name="title" value={qdetail?.title ?? ""} onChange={handleInputChange}
                            className="border pl-2 bg-gray-100 w-100 mb-2" />
                    </div>
                    <div>
                        <label htmlFor="difficulty" className="cursor-pointer font-bold inline-block w-35">Difficulty: </label>
                        <input id="difficulty" name="difficulty"
                            value={qdetail?.difficulty ?? ""} onChange={handleInputChange}
                            className="border pl-2 bg-gray-100 w-100 mb-2" />
                    </div>
                    <div className="flex">
                        <label htmlFor="description" className="cursor-pointer font-bold inline-block w-35">Description: </label>
                        <textarea id="description" name="description"
                            value={qdetail?.description ?? ""} onChange={handleTextChange}
                            className="border pl-2 bg-gray-100 w-200 h-40 mb-2">
                        </ textarea>
                    </div>
                    <div className="flex">
                        <label htmlFor="roughtext" className="text-gray-500 cursor-pointer font-bold inline-block w-35"
                        >ROUGH-TEXT: </label>
                        <textarea id="roughtext" name="roughtext"
                            value={roughtext} onChange={handleRoughTextChange}
                            className="border pl-2 bg-gray-300 w-200 h-40 mb-2">
                        </ textarea>
                    </div>
                    <div className="flex">
                        <label htmlFor="examples" className="cursor-pointer font-bold inline-block w-35">Examples: </label>
                        <textarea id="examples" name="examples"
                            value={qExamplesTipsStringifier("examples") ?? ""} onChange={handleObjectTextChange}
                            className="border pl-2 bg-gray-100 w-200 h-70 mb-2">
                        </ textarea>
                    </div>
                    <div className="flex">
                        <label htmlFor="constraints" className="cursor-pointer font-bold inline-block w-35">Constraints: </label>
                        <textarea id="constraints" name="constraints"
                            value={qConstraintsStringifier() ?? ""} onChange={handleObjectTextChange}
                            className="border pl-2 bg-gray-100 w-200 h-40 mb-2">
                        </ textarea>
                    </div>
                    <div className="flex">
                        <label htmlFor="tips" className="cursor-pointer font-bold inline-block w-35">Tips: </label>
                        <textarea id="tips" name="tips"
                            value={qExamplesTipsStringifier("tips") ?? ""} onChange={handleObjectTextChange}
                            className="border pl-2 bg-gray-100 w-200 h-45 mb-2">
                        </ textarea>
                    </div>

                    {
                        params.qname !== "create" || created ?
                            (!isButtonLoading ?

                                <button type="submit"
                                    className={`fixed bottom-11 right-15 border border-solid px-1.5 rounded-sm cursor-pointer transition-colors duration-300 ease-out active:scale-100 ${colorVariants.green.normal}`}
                                >
                                    Update
                                </button> :
                                <button type="button"
                                    className={`fixed bottom-11 right-15 border border-solid px-1.5 rounded-sm cursor-pointer transition-colors duration-300 ease-out active:scale-100 ${colorVariants.green.normal}`}
                                >
                                    🌀
                                </button>) :
                            (!isButtonLoading ?

                                <button type="submit"
                                    className={`fixed bottom-11 right-15 border border-solid px-1.5 rounded-sm cursor-pointer transition-colors duration-300 ease-out active:scale-100 ${colorVariants.blue.normal}`}
                                >
                                    Create
                                </button> :
                                <button type="button"
                                    className={`fixed bottom-11 right-15 border border-solid px-1.5 rounded-sm cursor-pointer transition-colors duration-300 ease-out active:scale-100 ${colorVariants.blue.normal}`}
                                >
                                    🌀
                                </button>)
                    }

                </form>

                <button type="button" onMouseDown={resetQHandleMouseDown}
                    className={`fixed top-21 right-15 border border-solid px-1.5 rounded-sm cursor-pointer transition-colors duration-300 ease-out active:scale-100 ${colorVariants.darkred.normal}`}>
                    Reset
                </button>
            </div>

        </div>
    )
}


export default AdminQuestionDetail;
