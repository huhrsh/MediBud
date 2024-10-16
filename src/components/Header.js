import { Link, Outlet, useNavigate } from "react-router-dom";
import logo from "../assets/images/friend.png"
import { useContext } from "react";
import { AppContext } from "../AppContext";
import Loading from "../pages/Loading";
import { toast } from "react-toastify";

export default function Header(){

    const {user, loading, setUser, setLoading, apiUrl} = useContext(AppContext);

    function handleSignOut(){
        toast.success("Signed out!");
        setUser();
        localStorage.removeItem('jwtToken');
    }

    return (
        <>
            <header className="px-12 py-4 w-screen shadow sticky top-0 bg-white flex justify-between items-center z-50">
                <Link to='/' className="flex items-center gap-2">
                    <img className="h-10" src={logo} alt="logo"/>
                    <h1 className="font-bold text-3xl text-blue-500 text-transparent bg-clip-text bg-gradient-to-b from-sky-500 to-blue-600">
                        MediBud
                    </h1>
                </Link>
                <div className="flex gap-6 w-1/4 justify-end items-center">
                    {(!loading && !user) && <Link to="/sign-in" className="text-lg hover:bg-blue-500 hover:text-white border transition-all duration-200 rounded-full  px-3 py-1">Sign In</Link>}
                    {(!loading && !user) && <Link to="/sign-up" className="text-lg hover:bg-blue-500 hover:text-white border transition-all duration-200 rounded-full  px-3 py-1">Sign Up</Link>}
                    {(!loading && user) && <button className="text-lg hover:bg-rose-600 hover:text-white border transition-all duration-200 rounded-full  px-3 py-1" onClick={handleSignOut}>Sign Out</button>}
                </div>
            </header>
            <Outlet/>
            {loading && <Loading/>}
        </>
    )
}