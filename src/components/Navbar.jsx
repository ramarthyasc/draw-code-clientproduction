import '../styles/Navbar.css';
import Signin from './Signin.jsx';
import Userin from './Userin.jsx';
import { Link } from 'react-router-dom';
import logo from "../assets/logo.webp";

function Navbar({ setIsLoggedIn, isLoggedIn, setJsonWebToken, setUser, user, isAdmin }) {

    // for Link
    const colorVariants = {
        pink: {
            normal: "bg-pink-400 text-black hover:bg-pink-300 hover:text-gray-600 active:text-gray-600\
            active:bg-pink-600",
        },
    }

    let render;
    if (!isLoggedIn) {
        render = <Signin setIsLoggedIn={setIsLoggedIn} setJsonWebToken={setJsonWebToken} setUser={setUser} />
    } else {
        render = <Userin setIsLoggedIn={setIsLoggedIn} setJsonWebToken={setJsonWebToken} setUser={setUser} user={user} />
    }
    return (


        <div>
            <nav className={`flex relative justify-between items-center bg-linear-to-r 
        ${!isAdmin ? "from-[#FFD469] to-[#F9A66C]" : "from-yellow-300 to-pink-400"}  h-13`}>
                <div className='flex'>
                    <Link to='/'><img src={logo} alt="home" className='logo' /></Link>
                    {isAdmin ?
                        "" :
                        <Link to='/admin/question-list' 
                        className='ml-10 flex pt-2 items-center hover:opacity-80' >Admin</Link>
                    }

                </div>
                {isAdmin ?
                    <Link to='/admin/question-list'
                        className={`mt-3 border border-solid px-1.5 py-0 mx-1 my-1 rounded-sm cursor-pointer transition-colors duration-300 ease-out active:scale-100 ${colorVariants["pink"]?.normal}`} 
                    >Admin Panel</Link>
                    : ""
                }
                {render}
            </nav>
        </div>

    )
}

export default Navbar;
