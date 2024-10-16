import { Mosaic } from "react-loading-indicators";

export default function Loading(){
    return (
        <div className="w-screen h-screen z-40 bg-white bg-opacity-50 fixed top-0 flex items-center justify-center">
            <Mosaic size="large"   color={["#0ea5e9", "#0284c7", "#3b82f6", "#2563eb"]} />
        </div>
    )
}