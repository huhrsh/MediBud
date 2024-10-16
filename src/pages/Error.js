import { Link } from "react-router-dom"
import errorImage from "../assets/images/Scared-amico.png"

export default function Error(){
    return(
        <div className="flex flex-col fixed top-0 w-screen h-screen items-center justify-center pt-2">
            <img className="w-1/3" src={errorImage} alt="error"/>
            <div className="flex flex-col gap-2 items-center">
                <h2 className="text-xl text-blue-800">You've reached a dead end!</h2>
                <Link className="bg-blue-800 w-fit rounded text-lg text-white px-3 py-1.5" to='/'>Go back to safety</Link>
            </div>
        </div>
    )
}