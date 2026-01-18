import { useEffect, useRef, useState } from "react";
import { useSecureDataGetter } from "./customhooks/useSecureDataGetter";
import { useOutletContext, useParams } from "react-router-dom";
import type { IAppContext } from "./AdminQuestionsList";
import { colorVariants } from "./AdminQuestionDetail";

interface ILangTemplates {
    js: string;
    c: string;
}

type CaseAndOutput = {
    case: any,
    output: any
}

interface IQMeta {
    method: string,
    caseAndOutput: CaseAndOutput[],
}

export interface IQuestionTemplate {
    id: string;
    qname: string;
    qmeta: IQMeta;
    langtemplates: ILangTemplates;
}


function AdminQuestionTemplate() {
    const textAreaRef = useRef(null);
    const [qtemplate, setQtemplate] = useState<IQuestionTemplate>();
    const [error, setError] = useState<boolean>(false);
    const { data, secureDataGetter } = useSecureDataGetter<IQuestionTemplate, IQuestionTemplate>();
    const params = useParams();
    const context: IAppContext = useOutletContext();
    const { jsonWebToken, setJsonWebToken, setUser, user, setIsLoggedIn, setIsAdmin } = context;
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const [roughtext, setRoughtext] = useState<string>(`   Write cases here, then copy-paste in the table above

                      //ROUGH AREA`);
    const [language, setLanguage] = useState<keyof ILangTemplates>("js");
    const [created, setCreated] = useState(true);

    useEffect(() => {

        async function fetcher() {
            const path = `/admin/template/${params.qname}`;
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

    }, [jsonWebToken]);

    useEffect(() => {
        if (jsonWebToken && user.role === "admin") {
            setIsAdmin(true);
            // setQuestion detail object as the state
            if (typeof data !== "string") {
                setQtemplate({ ...data });
                if (data.id === "default") {
                    setCreated(false);
                }
            }
        } else {
            setIsAdmin(false);
        }
    }, [jsonWebToken, data]);





    async function handleUpdateSubmit(e: React.MouseEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!qtemplate) { return; }
        if (isButtonLoading) { return; }

        const path = `/admin/template/${params.qname}`;
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
                    content: qtemplate,
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
        if (!qtemplate) { return; }
        if (isButtonLoading) { return; }

        const path = `/admin/new-template/${params.qname}`;
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
                    content: qtemplate,
                    method: "POST"
                }
            );


        } catch (err) {
            setError(true);
        }
        setCreated(true);
        setIsButtonLoading(false);
    }
    function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.currentTarget.value;
        const id = e.currentTarget.id;
        setQtemplate(qtemplate => {
            if (!qtemplate) { return qtemplate; }
            return {
                ...qtemplate,
                qmeta: {
                    ...qtemplate.qmeta,
                    [id]: value
                }
            }
        });
    }

    function handleObjectTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {

        const id = e.currentTarget.id;
        const stringvalue = e.currentTarget.value;

        setQtemplate(qtemplate => {
            if (!qtemplate) { return qtemplate; }

            let value;
            if (id === "caseAndOutput") {
                try {
                    value = JSON.parse(stringvalue);
                } catch (err) {
                    value = qtemplate.qmeta[id];
                }
                return {
                    ...qtemplate,
                    qmeta: {
                        ...qtemplate.qmeta,
                        [id]: value
                    }
                }

            } else if (id === "langtemplates") {
                value = stringvalue;
                return {
                    ...qtemplate,
                    langtemplates: {
                        ...qtemplate.langtemplates,
                        [language]: value
                    }
                }

            }
        })
    }

    function handleRoughTextChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
        const value = e.currentTarget.value;
        setRoughtext(value);
    }
    function qCaseAndOutputStringifier(key: "caseAndOutput") {
        if (!qtemplate) { return; }
        const string = JSON.stringify(qtemplate["qmeta"][key]);
        const stringformatted = string.replace("[{\"", "[\n\n{\n\"")
            .replace(/}(?!.*})/, "\n}")
            .replace(/]$/, "\n\n]")
            .replace(/},{/g, "\n}\n\n,\n\n{\n")
            .replace(/,"/g, ",\n\"");
        return stringformatted;

    }

    function resetQHandleMouseDown() {
        if (typeof data !== "string") {
            // reset to initial fetched Qdetail data
            setQtemplate({ ...data });
            setRoughtext(`   Write cases here, then copy-paste in the table above

                      //ROUGH AREA`);
        }
    }
    function onLangChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const value = e.target.value;
        if (value === "js" || value === "c") {
            setLanguage(value);
        }
    }

    if (error) {
        return (
            <div className="text-center">
                Something went wrong...
            </div>
        )
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

    return (
        <div className="flex-2 flex p-4 text-left overflow-y-auto border-black border-solid border-y border-x  mx-3 mt-0 mb-2">
            <div className="flex-2 flex flex-col  w-100 border px-4 py-4 overflow-y-auto">
                <div className="flex justify-between">
                    <div className="text-lg px-2  bg-green-100 rounded-md">
                        <strong className="text-green-700">Question:</strong> {params.qname}
                    </div>
                    <select name="language" id="drop" onChange={onLangChange} value={language}
                        className="py-px rounded-sm bg-amber-100 border-t border-x border-b border-black hover:cursor-pointer">
                        <option value="js" className="hover:cursor-pointer">Javascript</option>
                        <option value="c" className="hover:cursor-pointer">C</option>
                    </select>
                </div>
                <textarea ref={textAreaRef}
                    value={error ? "Sorry.. Something went wrong !" : qtemplate?.langtemplates[language]}
                    onChange={handleObjectTextChange}
                    name="langtemplates" id="langtemplates"
                    className="flex-10 border border-black bg-gray-100 resize-none pl-3 pt-3"
                ></textarea>
            </div>

            <div className="flex-2 flex flex-col ml-10 w-100 border px-4 py-4 overflow-y-auto">
            <div className="flex items-end">
                <div className="bg-amber-200 px-2 mt-1 rounded-md text-sm">
                    Note: This "Method name" and "Cases" is used for calculation and showing case results
                </div>
            </div>

                <form onSubmit={created ? handleUpdateSubmit : handleCreateSubmit} className="flex-2 flex flex-col mt-4">
                    <div>
                        <label htmlFor="method" className="cursor-pointer font-bold inline-block w-35">Method name: </label>
                        <input id="method" name="method" value={qtemplate?.qmeta.method ?? ""} onChange={handleInputChange}
                            className="border pl-2 bg-gray-100 w-100 mb-2" />
                    </div>
                    <div className="flex">
                        <label htmlFor="caseAndOutput" className="cursor-pointer font-bold inline-block w-35">Cases: </label>
                        <textarea id="caseAndOutput" name="caseAndOutput"
                            value={qCaseAndOutputStringifier("caseAndOutput") ?? ""} onChange={handleObjectTextChange}
                            className="border pl-2 bg-gray-100 w-150 h-70 mb-2">
                        </ textarea>
                    </div>
                    <div className="flex">
                        <label htmlFor="roughtext" className="text-gray-500 cursor-pointer font-bold inline-block w-35"
                        >ROUGH-TEXT: </label>
                        <textarea id="roughtext" name="roughtext"
                            value={roughtext} onChange={handleRoughTextChange}
                            className="border pl-2 bg-gray-300 w-150 h-40 mb-2">
                        </ textarea>
                    </div>

                    {
                        created ?
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
                                </button>
                            ) :
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
                                </button>
                            )
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

export default AdminQuestionTemplate;
