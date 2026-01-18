import '../styles/Userin.css';


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


    return (

        <>
            <ul className='user'>
                <li className='dropdown'>
                    {/* profile pic is served this way from server as static file */}
                    <img src={'/proPic/' + user.picture} alt="pic" className='profile-pic' />
                    <ul className='profile-menu'>
                        <li onClick={() => { signout({ setIsLoggedIn, setJsonWebToken, setUser }) }}>Signout</li>
                    </ul>
                </li>
            </ul>
        </>
    )
}

export default Userin;
export { signout };
