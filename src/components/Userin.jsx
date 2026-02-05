import { useState } from 'react';
// import '../styles/Userin.css';


async function signout({ setIsLoggedIn, setJsonWebToken, setUser }) {

    try {
        //Revoke refresh token
        const res = await fetch('/api/refresh-auth', {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ revokeRefreshToken: true }),
        })


        if (res.ok) {
        } else if (res.status === 401) {
            const { code } = await res.json();

        } else if (res.status === 500) {
            // Error handler default server Error
            const defaultServerError = await res.text();
        } else {
            //unknown server send error (someone changed the status from server)
        }

    } catch (err) {
    }

    setIsLoggedIn(false);
    setJsonWebToken(null);
    setUser(null);

}


function Userin({ setIsLoggedIn, setJsonWebToken, setUser, user }) {
    const [drop, setDrop] = useState(false);

    return (

        <>
            <ul className='px-7'>
                <li className='flex relative cursor-pointer'>
                    {/* profile pic is served this way from server as static file */}
                    <img onClick={() => { setDrop(state => !state); }} src={'/proPic/' + user.picture} alt="pic" className='w-7 h-7 rounded-2xl relative z-10' />
                    <ul className={`${drop ? '' : 'hidden'} absolute bg-[#fcbe6a] rounded-xl border border-amber-700 pl-3 pr-5 top-px -left-21`}>
                        <li onClick={() => { signout({ setIsLoggedIn, setJsonWebToken, setUser }) }} className='hover:text-gray-700'>Signout</li>
                    </ul>
                </li>
            </ul>
        </>
    )
}

export default Userin;
export { signout };
