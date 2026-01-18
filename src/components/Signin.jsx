import { useEffect, useId } from 'react';
import '../styles/Signin.css';

function Signin({ setIsLoggedIn, setJsonWebToken, setUser }) {
    const navId = useId();

    async function handleCredentialResponse(response) {

        try {
            const loginRes = await fetch("/draw-login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ credential: response.credential }),
            })

            if (loginRes.ok) {

                const { accessToken, userDetail } = await loginRes.json();

                setJsonWebToken(accessToken);
                setIsLoggedIn(true);
                setUser(userDetail);
                return;

            } else {
                if (loginRes.status === 500) {
                    // Error handler default server Error
                    const defaultServerError = await res.text();
                    return;
                } else {
                    //unknown server send errors (if someone changed the status from the server)
                }
            }


        } catch (err) {
            return;
        }

    }



    // 'Mine' Effect
    useEffect(() => {
        google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            ux_mode: "popup",
            callback: handleCredentialResponse
        });

        google.accounts.id.renderButton(
            document.getElementById(navId),
            {
                type: "icon",
                size: "small",
                shape: "circle",
                theme: "filled_blue",
            }

        )

    }, []);

    return (
        <>
            <div className='signin-block'>
                <ul className='signin'>
                    <li>Sign in</li>
                </ul>
                <div className='authorize'>
                    <div id={navId}></div>
                </div>
            </div>
        </>
    )



}


export default Signin;

