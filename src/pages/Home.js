import doctorImage from "../assets/images/Doctors-rafiki.png"
import appointmentImage from "../assets/images/Date picker-rafiki.png"
import prescriptionImage from "../assets/images/Documents-rafiki.png"
import reportImage from "../assets/images/Documents-amico.png"
import { useNavigate } from "react-router-dom"

export default function Home(){

    const navigate = useNavigate();

    const options = [
        {
            title : "Doctors",
            image : doctorImage
        },
        {
            title : "Appointments",
            image : appointmentImage
        },
        {
            title : "Reports",
            image : reportImage
        },
        {
            title : "Prescriptions",
            image : prescriptionImage
        },
    ]


    function handleClick(title){
        navigate(`${title.toLowerCase()}`);
    }

    return (
        <main className="px-24 py-10 w-screen flex gap-6 justify-evenly items-center h-[85vh] grid-flow-row aspect-square" >
            {options.map((option, index)=>(
                <div onClick={()=>handleClick(option.title)} className="border flex flex-col gap-2 items-center hover:scale-105 p-2 shadow hover:shadow-lg cursor-pointer border-neutral-100 rounded-xl transition-all duration-200 aspect-square" key={index}>
                    <img className="" alt={option.title} src={option.image}/>
                    <h2 className="text-lg text-neutral-500">{option.title}</h2>
                </div>
            ))}
        </main>
    )
}