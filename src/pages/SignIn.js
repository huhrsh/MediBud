import { useContext, useEffect, useState } from "react";
import signInImage from "../assets/images/Welcome aboard-rafiki.png";
import closedEye from "../assets/images/eye (1).png"
import openEye from "../assets/images/eye (2).png"
import { toast } from "react-toastify";
import { AppContext } from "../AppContext";
import { Link, useNavigate } from "react-router-dom";

export default function SignIn() {

    const navigate = useNavigate();
    const {user, setUser, loading, setLoading, apiUrl} = useContext(AppContext);

    const [formData, setFormData] = useState({
        email: "mailtoharshjain@gmail.com",
        password: "12345678",
    });

    useEffect(()=>{
        if(user){
            navigate('/');
        }
    },[loading])

    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const togglePasswordVisibility = () => {
        setShowPassword(prev => !prev);
    };

    const handleSubmit = async(e) => {
        e.preventDefault();
        
        if(loading){
            return;
        }

        // Check for empty fields
        if (!formData.email || !formData.password ) {
            toast.warn("All fields are required.");
            return;
        }
        setLoading(true);
        const response = await fetch(`${apiUrl}auth/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'  
            },
            body: JSON.stringify({
                email: formData.email,
                password: formData.password
            })
        });
        setLoading(false);
        
        if (response.ok) {
            const data = await response.json();
            toast.success("You're in!");
            localStorage.setItem("jwtToken", data.token);
            setUser(data.user)
            console.log("User registered successfully:", data);
            navigate('/');
        } else {
            if(response.status === 401){
                toast.warn("Invalid credentials.")
                return;
            }
            console.error("Error during registration:", response.statusText);
        }
    };

    const fields = [
        { label: "Email:", name: "email", type: "email", placeholder: "johndoe@example.com" },
        { label: "Password:", name: "password", type: showPassword ? "text" : "password", placeholder: "********" },
    ];

    return (
        <main className="w-screen h-full flex items-center justify-center gap-40 px-20 py-10 max-h-[86vh]">
            <img className="w-5/12 p-5" src={signInImage} alt="sign in" />
            
            <div className="flex flex-col w-1/2 h-full gap-4">
                <h2 className="leading-snug font-bold text-4xl text-blue-500 text-transparent bg-clip-text bg-gradient-to-b from-sky-500 to-blue-600">Welcome captain</h2>
                <form className="flex flex-col gap-3 w-9/12" onSubmit={handleSubmit}>
                    {fields.map(field => (
                        <div key={field.name} className="flex gap-2 items-center rounded-xl px-2 py-2.5 border transition-all duration-300 hover:scale-105 hover:shadow focus-within:scale-105 focus-within:shadow">
                            <h3 className="font-normal text-base flex-shrink-0 text-blue-500 text-transparent bg-clip-text bg-gradient-to-b from-sky-500 to-blue-600">{field.label}</h3>
                            <input
                                className="outline-none text-neutral-700 w-full"
                                placeholder={field.placeholder}
                                type={field.type}
                                name={field.name}
                                value={formData[field.name]}
                                onChange={handleChange}
                            />
                            {field.name.includes("password") && (
                                showPassword ? <img className="h-6 transition-all duration-200 cursor-pointer" alt="show password" src={closedEye} onClick={togglePasswordVisibility} />:
                                <img className="h-6 transition-all duration-200 cursor-pointer" alt="show password" src={openEye} onClick={togglePasswordVisibility} />      
                            )}
                        </div>
                    ))}
                    <div className="flex items-center justify-between">
                    <button className="outline-none w-fit px-4 py-1.5 bg-gradient-to-bl hover:shadow-lg transition-all duration-200 from-sky-500 to-blue-600 text-white rounded-lg" type="submit">Submit</button>
                    <Link to='/sign-up' className="text-neutral-600">Don't have an account? Sign up.</Link>
                    </div>
                </form>
            </div>


        </main>
    );
}
