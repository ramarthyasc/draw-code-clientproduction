import { useEffect } from 'react';
import googleSvg from "../assets/google.svg";

function Signin({ setIsLoggedIn, setJsonWebToken, setUser }) {
    // const navId = useId();

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
            document.getElementById("google-hidden-btn"),
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
            <div className='flex'>
                {/* <div className='mt-1'>Sign in</div> */}
                <div id="google-hidden-btn" className='hidden' />
                <img src={googleSvg} alt="signin" onClick={() => {
                    document.querySelector("#google-hidden-btn div[role=button]").click()}}
                    className='w-8 h-8 ml-2 mr-4 cursor-pointer' />
            </div>
        </>
    )



}


export default Signin;

