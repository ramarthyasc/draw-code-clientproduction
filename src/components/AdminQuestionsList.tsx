import { useState, useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import { useNavigate, useOutletContext, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { useSecureDataGetter } from "./customhooks/useSecureDataGetter";
import { colorVariants } from "./AdminQuestionDetail";

export type Difficulty = "easy" | "medium" | "hard";
export interface IQuestionsList {
    id: number;
    name: string;
    difficulty: Difficulty;
}

export interface IUserDetailWithRole {
    userid: string;
    name: string;
    email: string;
    picture: string;
    role: "admin" | "user";
}
export interface IAppContext {
    isLoggedIn: boolean;
    setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
    jsonWebToken: string;
    setJsonWebToken: Dispatch<SetStateAction<string | null>>;
    user: IUserDetailWithRole,
    setUser: Dispatch<SetStateAction<IUserDetailWithRole | null>>;
    setIsAdmin: Dispatch<SetStateAction<boolean>>;
}


function AdminQuestionsList() {
    const [searchParams, setSearchParams] = useSearchParams("?page=0&limit=10");
    const [error, setError] = useState(false);

    const { data, secureDataGetter } = useSecureDataGetter<IQuestionsList[]>();
    const context: IAppContext = useOutletContext();

    const { jsonWebToken, setJsonWebToken, setUser, user, setIsLoggedIn, setIsAdmin } = context;
    const [isButtonLoading, setIsButtonLoading] = useState(false);
    const navigate = useNavigate();
    const prevNextButtonLoadingRef = useRef(false);

    useEffect(() => {

        async function fetcher() {
            const page = searchParams.get("page") ?? "0";
            const limit = searchParams.get("limit") ?? "10";
            const path = `/admin/questions?page=${page}&limit=${limit}`;
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

        // if (!isMountedRef.current || data !== "") {
        prevNextButtonLoadingRef.current = false;
        fetcher();
        // }
        // isMountedRef.current = true;

    }, [searchParams, jsonWebToken]);


    useEffect(() => {
        if (jsonWebToken && user.role === "admin") {
            setIsAdmin(true);

            const lastqid = Number(searchParams.get("page")) * Number(searchParams.get("limit")) + data.length - 1;
            // Id is added + 1 inside AdminQuestionDetail
            window.localStorage.setItem("lastqid", lastqid.toString());
        } else {
            setIsAdmin(false);
        }
    }, [jsonWebToken, data]);


    if (error) {
        throw new Error("Network Error !!")
    }
    if (data === "") {
        // initial data from customhook is ""
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

    function handleAddMouseDown() {
        navigate("/admin/question-detail/create");
    }

    async function deleteMouseDown() {
        if (confirm(`Delete last question ?`)) {

            if (isButtonLoading) { return; }

            const page = searchParams.get("page");
            const limit = searchParams.get("limit");
            const path = `/admin/delete-question?page=${page}&limit=${limit}`;
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
                        content: null,
                        method: "DELETE"
                    }
                );


            } catch (err) {
                setError(true);
            }
            setIsButtonLoading(false);
        }
    }

    function handleOnChange(e: React.ChangeEvent<HTMLInputElement>) {
        prevNextButtonLoadingRef.current = true;
        const page = e.currentTarget.value.toString();
        const limit = searchParams.get("limit") ?? "10";
        setSearchParams([["page", page], ["limit", limit]]);
    }

    const questionList = data;

    return (


        <div className="flex-1 flex flex-col items-center justify-center ">
            <div className="pb-20 text-4xl font-extrabold ">
                Questions
            </div>

            <div className="h-75 w-150 overflow-clip">
                <table className="w-150 table-fixed">
                    <thead className="h-5">
                        <tr className="border-b font-bold">
                            <td className="px-2 border-r text-center w-10">Id</td>
                            <td className="px-2 border-r text-center w-50">Problem</td>
                            <td className="px-2 border-r text-center w-30">Difficulty</td>
                            <td className="px-2 border-r text-center w-30">Detail</td>
                            <td className="pl-2 w-30">Template</td>
                        </tr>
                    </thead>
                    <tbody className="align-top">
                        {questionList.map((obj, i) => {
                            return (
                                <tr className={`${questionList.length - 1 === i ? "" : "border-b"}`} key={obj.id}>
                                    <td className="border-r px-2 h-7 text-center"> {
                                        prevNextButtonLoadingRef.current ?
                                            <span>*</span> :
                                            Number(searchParams.get("page")) * Number(searchParams.get("limit")) + i
                                    }
                                    </td>
                                    <td className="border-r px-2 h-7"> {obj.name} </td>
                                    <td className="border-r px-2 h-7 text-center">{obj.difficulty}</td>
                                    <td className="border-r px-2 h-7 border-black text-blue-700 hover:text-gray-600">
                                        <Link to={`/admin/question-detail/${obj.name}`}>View/Edit</Link>
                                    </td>
                                    <td className="px-2 text-center h-7 text-blue-700 hover:text-gray-600">
                                        <Link to={`/admin/question-template/${obj.name}`}>View/Edit</Link>
                                    </td>
                                </tr>
                            )
                        })
                        }
                        {/* { */}
                        {/*     questionList.length === 0 ? */}
                        {/**/}
                        {/*         <tr> */}
                        {/*             <td className="px-2 border-r text-center w-10"></td> */}
                        {/*             <td className="px-2 border-r text-center w-50"></td> */}
                        {/*             <td className="px-2 border-r text-center w-30"></td> */}
                        {/*             <td className="px-2 border-r text-center w-30"></td> */}
                        {/*             <td className="pl-2 w-30"></td> */}
                        {/*         </tr> : */}
                        {/*         null */}
                        {/* } */}

                    </tbody>
                </table >
            </div>
            <div>
                <div className="flex pl-2 pt-4 justify-center">
                    <button id="prev"
                        onClick={() => {
                            prevNextButtonLoadingRef.current = true;
                            const pageNum = Number(searchParams.get("page"));
                            const limit = searchParams.get("limit") ?? "10";
                            if (pageNum) {
                                const prevPage = pageNum - 1;
                                setSearchParams([["page", prevPage.toString()], ["limit", limit]]);
                            }
                        }}
                        className={`border border-solid px-1.5 py-0 mx-1 my-1 rounded-sm cursor-pointer transition-colors duration-300 ease-out active:scale-100 ${colorVariants["gray"].normal}`}
                    >&lt;</button>

                    <input value={searchParams.get("page") ?? 0} onChange={handleOnChange}
                        className="w-5 text-center border rounded-xl  py-0" />

                    <button id="next"
                        onClick={() => {
                            prevNextButtonLoadingRef.current = true;
                            const nextPage = Number(searchParams.get("page")) + 1;
                            const limit = searchParams.get("limit") ?? "10";
                            setSearchParams([["page", nextPage.toString()], ["limit", limit]]);
                        }}
                        className={`border border-solid px-1.5 py-0 mx-1 my-1 rounded-sm cursor-pointer transition-colors duration-300 ease-out active:scale-100 ${colorVariants["gray"].normal}`}
                    >&gt;</button>
                </div>

                <div>
                    <div className="pl-2 pt-4 text-center">
                        . <br />
                        . <br />
                        . <br />
                        <div className="flex flex-col items-center">
                            <button type="button" onMouseDown={handleAddMouseDown}
                                className={`w-15 mb-2 border border-solid px-1.5 rounded-sm cursor-pointer transition-colors duration-300 ease-out active:scale-100 ${colorVariants.green.normal}`}>
                                Add
                            </button>
                            <button className="w-5 hover:bg-red-200 hover:text-red-400 cursor-pointer px-1 py-0 my-px bg-gray-300 border rounded-sm"
                                onMouseDown={() => { deleteMouseDown() }}
                            >-</button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )

}


export default AdminQuestionsList;
