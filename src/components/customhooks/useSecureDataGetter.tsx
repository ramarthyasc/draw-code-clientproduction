import { useState, useCallback } from 'react';
import type { Dispatch, SetStateAction } from 'react';
import type { IBody } from '../types/question';
import type { IUserDetailWithRole } from '../AdminQuestionsList';
//
//
export interface IAuthState {
    jsonWebToken: string;
    setJsonWebToken: Dispatch<SetStateAction<string | null>>;
    setUser: Dispatch<SetStateAction<IUserDetailWithRole | null>>;
    setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

export interface IFetchBody<K> {
    content: FormData | K | null;
    method: "POST" | "PUT" | "DELETE";
}


// a “Custom hook” must call at least one Hook at its top level, otherwise it’s just a normal function.That's it
// Custom hook with side effects for jsonWebToken, user. Returned data ie; data
export function useSecureDataGetter<T = string, K = FormData>() {

    const [data, setData] = useState<string | T>("");

    const secureDataGetter = useCallback(async (authState: IAuthState, path: string,
        body?: IFetchBody<K>) => {
        try {
            let res: Response;
            if (body) {
                if (body.content instanceof FormData) {
                    let bodyObject: IBody = Object.fromEntries(body.content.entries());
                    res = await fetch(path, {
                        method: body.method,
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${authState.jsonWebToken}`
                        },
                        body: JSON.stringify(bodyObject),
                    })
                } else if (body.content === null) {
                    res = await fetch(path, {
                        method: "DELETE",
                        credentials: "include",
                        headers: {
                            "Authorization": `Bearer ${authState.jsonWebToken}`
                        }
                    })
                } else {
                    // Any type can be given -mostly Object or string (type given when calling the hook)
                    res = await fetch(path, {
                        method: body.method,
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${authState.jsonWebToken}`
                        },
                        body: JSON.stringify(body.content),
                    })

                }
            } else {
                res = await fetch(path, {
                    method: "GET",
                    credentials: "include",
                    headers: {
                        "Authorization": `Bearer ${authState.jsonWebToken}`
                    }
                })
            }

            if (res.ok) {

                // server judge service 
                const resJson = await res.json();
                setData(resJson);
                return;

            } else if (res.status === 400 || res.status === 500) {

                const resText = await res.text();

                if (res.status === 400) {
                    // wrong answer submitted. Error got from inside the container or Wrong parameters send(Bad request)
                    setData(resText);
                    return;
                } else {
                    // Server default error
                    throw new Error(resText);
                }

            } else if (res.status === 401) {
                // jwt is expired or none is there, so get the jwt & refresh token using the current RT
                const { code } = await res.json();
                // now fetch the RT & JWT
                //
                const jwtFetch = await fetch("/api/refresh-auth", {
                    method: "GET",
                    credentials: "include"
                })

                if (jwtFetch.ok) {
                    const { accessToken, userDetail } = await jwtFetch.json();
                    authState.setJsonWebToken(accessToken);
                    authState.setUser(userDetail);
                    authState.setIsLoggedIn(true);

                    // call the Function once more to do the function request again
                    try {
                        if (body) {
                            await secureDataGetter({
                                jsonWebToken: accessToken,
                                setJsonWebToken: authState.setJsonWebToken,
                                setUser: authState.setUser,
                                setIsLoggedIn: authState.setIsLoggedIn
                            }, path, body);
                        } else {
                            await secureDataGetter({
                                jsonWebToken: accessToken,
                                setJsonWebToken: authState.setJsonWebToken,
                                setUser: authState.setUser,
                                setIsLoggedIn: authState.setIsLoggedIn
                            }, path);
                        }
                    } catch (err) {
                        throw err;
                    }
                } else if (jwtFetch.status === 401) {
                    //RT is invalid
                    const { code } = await jwtFetch.json();
                    // Show in the ResultBox that You have to signin to submit (Instead of throwing Error)
                    setData("signin");
                    authState.setJsonWebToken(null);
                    authState.setUser(null);
                    authState.setIsLoggedIn(false);
                } else if (jwtFetch.status === 500) {
                    //any server error
                    const defaultServerError = await jwtFetch.text();
                    throw new Error(defaultServerError);
                } else {
                    // unknown error from server (someone changed statuscode from serverside)
                    throw new Error(jwtFetch.status.toString());
                }

            } else if (res.status === 403) {
                /// ADMIN NON AUTHORIZATION - FORBIDDEN IF ROLE IS USER
                const { code } = await res.json();
                setData("not-admin"); // Say forbidden when we get "not-admin" as the setData - but don't logout
                return;

            } else if (res.status === 404) {
                // Path not found

                const resText = await res.text();
                throw new Error(resText);

            } else {
                // unknown error from server (someone changed statuscode from serverside)
                throw new Error(res.status.toString());
            }

        } catch (err) {
            throw err;
        }

    }, []);

    // You can use this result ie; Data state for any Generic use in any component
    return { data, setData, secureDataGetter };

}
