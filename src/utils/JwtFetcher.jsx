import { useEffect, useState, useRef } from 'react';


// Used for Setting the jwt, loggedin state, userstate When you Start the App/ Refresh your page. That's it . That's the only use of this util.
// (If there is Valid refresh token, then generate new JWT from server.
// If no Valid RT, then jwt & user is undefined, loggedin is false - by default)
//

function JwtFetcher({ children, setIsLoggedIn, setJsonWebToken, setUser }) {

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState();
    const isMountedRef = useRef(false);



    useEffect(() => {

        async function fetcher() {

            try {
                const res = await fetch('/api/refresh-auth', {
                    method: "GET",
                    credentials: 'include',
                })


                if (res.ok) {

                    const { accessToken, userDetail } = await res.json();

                    setJsonWebToken(accessToken);
                    setIsLoggedIn(true);
                    setUser(userDetail);

                } else {

                    if (res.status === 401) {
                        const { code } = await res.json();

                    } else if (res.status === 500) {
                        // Error handler default server Error
                        const defaultServerError = await res.text();
                        setError(new Error("Server default error"));
                    } else {
                        // unknown server send error
                        setError(new Error("Server unknown status error"));
                    }
                }

            } catch (err) {
                    setError(new Error("Network error"));

            }
            setIsLoading(false);


        }

        if (!isMountedRef.current) {
            fetcher();
        }
        isMountedRef.current = true;


    }, []);

    //NOTE: When we return Children or Outlet - then they are renders. So only after all the Consecutive renders are done, then only
    // the useEffects are run. This is BAD - if the useEffects has async functions in it. Because those useEffects run asynchronously.
    // Not in a linear manner. Which can play mischief when there are dependent states in those useEffects - thus making race conditions.
    // Eg: in the first useEffect if we had await which decides if the isLoggedIn is true or false. Then as it is await, it jumps to next useEffect
    // which decides another function based on the isLoggedIn.
    // So to PREVENT THIS, Whenever a COMPONENT return a children or outlet or any other <<<DYNAMIC RENDER>>>, then do block it using "...loading"
    // and then run the Component's useEffect in there itself. Then only, return the DYNAMIC RENDER. 
    // Here, in this pattern, we can use localvariables without useState - inside UseEffect where there is no state changers.
    //NOTE:  Even if the Dynamic Renders returned are the SAME, we have to make sure that, useEffects is run here itself, if that useEffects have await.
    // ie; The AWAITS SHOULD BE DONE right here AND WE SHOULD GET THE RESULTS HERE ITSELF. THEN ONLY, WE SHOULD RETURN THE DYNAMIC RENDER. 
    // For no errors down the ROAD.
    // THE THING IS THAT< ONLY AFTER GETTING RESULT FROM AWAIT (error or result), is when WE SHOULD return the DYNAMIC RENDER.

    // We set the if else logic of letting the user in or not - inside the Component itself (using isLoggedIn) - so that
    // I don't clutter this JwtFetcher component - which is for handling REFRESHES only- Good practice for me.

    //Runs this only if we refreshed the page 

    if (error) { throw error; }
    //we made sure that useEffects is run fully in here itself.
    if (isLoading) { 
        return (
            <div className="text-center">
                loading...
            </div>
        )
    }


    // Return children after we made sure that useEffects ran here itself. Here, it returns if isLoggedIn is true NOTE: (In Normal flow)
    return (
        <>{children}</>
        //Render this first in Real DOM, then runs useEfects (only 1 time) - which schedule state change. Then reruns the component.
        // which gives the The main render we need. This all happens fast that you won't see the initial Children (typically, we use "loading.." text) page.
    )

}


export default JwtFetcher;
