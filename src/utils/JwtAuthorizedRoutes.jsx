import { useOutletContext } from "react-router-dom";
import { useEffect, useLayoutEffect, useState, useContext } from "react";
import { Outlet } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import { ErrorContext } from "../context/ErrorContext";

//NOTE: ANY ROUTE/PATH CHANGE IS DONE, THEN REACT GOES THROUGH THIS COMPONENT FIRST.
//
// This component is only reached after JwtFetcher. So if isLoggedIn==true, then all other states will be true( jsonWebToken, etc..)
function JwtAuthorizedRoutes() {

    const [isLoggedIn, setIsLoggedIn, jsonWebToken, setJsonWebToken, setUser, user] = useOutletContext();
    const setRtError = useContext(ErrorContext);

    // NOTE: When a <Link> is clicked, in that moment, the location is changed (pushed to stack). The react router only walks through the route-tree from root
    // to the parent component who has the outlet as the new component of the new path. Here, the outlet only is rendered. That's it - to increase
    // Performance - in REACT ROUTER V6+.
    //
    //But we need this component to "run" whenever route changes - verify JWT. So we use useLocation here. To Trigger run this component on Route change.
    //So useLocation state is triggered and the component using the useLocation hook rerenders just when you click the <Link> itself.
    const location = useLocation();

    const [jwtIsVerified, setJwtIsVerified] = useState(false);


    useLayoutEffect(() => {
        setJwtIsVerified(false);
    }, [location.pathname]);




    // DO THIS WHEN THE USER TRIES TO GO TO ANY PATH IN THE WEBSITE.
    // if there was no refresh token send to server (as due to expiry) - then server sends rtError.
    // if there was an invalid (revoked/expired/different) refresh token send to server (Hacker) - then server sends a different valued rtError.
    useEffect(() => {

        if (isLoggedIn && !jwtIsVerified) {

            async function jwtVerify() {

                try {

                    const jwtRes = await fetch("/jwt-ui-auth", {
                        method: "GET",
                        credentials: "include",
                        headers: {
                            "Authorization": `Bearer ${jsonWebToken}`
                        }

                    })

                    const { code } = await jwtRes.json();

                    if (jwtRes.ok) {

                        if (code === "VALID_JWT") {
                            setJwtIsVerified(true);
                            // user and isloggedIn is already set by jwtfetcher top wrapper itself. So doesn't matter if give it or not. But good pattern to give it.
                            return;
                        }

                    } else {
                        if (code === "INVALID_OR_EXPIRED_JWT") {
                            // check RT
                            //
                            const rtRes = await fetch("/refresh-auth", {
                                method: "GET",
                                credentials: "include",
                            })

                            if (rtRes.ok) {

                                const { accessToken, userDetail } = await res.json();
                                setJsonWebToken(accessToken);
                                setUser(userDetail);
                                setJwtIsVerified(true);

                            } else {

                                const { code } = await res.json();

                                if (code === "NO_REFRESH_TOKEN" || code === "INVALID_REFRESH_TOKEN") {
                                    setIsLoggedIn(false);
                                    setJsonWebToken(null);
                                    setUser(null);
                                    setRtError(true);
                                    return;
                                }

                            }
                        }
                    }


                } catch (err) {
                    return;
                }


            }
        jwtVerify();
        }



    });

    //NOTE: DYNAMIC RENDERS ARE RETURNED HERE & useEffects have Await in it> So this component's useEffects have to run here itself.

    // For isLoggedIn === false, the useEffects won't run, so you can return the DYNAMIC RENDER directly.
    // if it is isLoggedIn==false (Through JwtFetcher), then: Your navbar doesn't show userprofile. Here you can roam freely b/w pages.
    if (!isLoggedIn) {
        return (
            // returns the Outlet of JwtAuthorizedRoutes component. ie; it's children.
            <Outlet />
        );
    }


    if (isLoggedIn) {
        if (jwtIsVerified) { return <Outlet context={user} /> }

        // loader before verifiying jwt 
        return "loading";
    }


}

export default JwtAuthorizedRoutes;
