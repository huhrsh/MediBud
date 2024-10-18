import { useContext, useEffect, useState } from "react";
import signUpImage from "../assets/images/Hello-cuate.png";
import closedEye from "../assets/images/eye (1).png"
import openEye from "../assets/images/eye (2).png"
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";

export default function SignUp() {

    const navigate = useNavigate()
    const {user, loading, setLoading, apiUrl} = useContext(AppContext);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
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

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleSubmit = async(e) => {
        e.preventDefault();

        if(loading){
            return;
        }
        
        // Check for empty fields
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            toast.warn("All fields are required.");
            return;
        }

        // Validate email
        if (!validateEmail(formData.email)) {
            toast.warn("Please enter a valid email address.");
            return;
        }

        // Check password length
        if (formData.password.length < 8) {
            toast.warn("Password must be at least 8 characters long.");
            return;
        }

        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            toast.warn("Passwords do not match.");
            return;
        }
        
        setLoading(true)
        
        const response = await fetch(`${apiUrl}auth/register`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'  
            },
            credentials:'omit',
            body: JSON.stringify({
                username: formData.name,
                email: formData.email,
                password: formData.password 
            })
        });
        
        if (response.ok) {
            const data = await response.text();
            toast.success("Registration successful!")
            console.log("User registered successfully:", data);
            navigate('/sign-in');
        } else {
            if(response.status === 409){
                toast.warn("Email already taken.")
                setLoading(false);
                return;
            }
            console.error("Error during registration:", response.statusText);
        }      
        setLoading(false);
    };

    const fields = [
        { label: "Name:", name: "name", type: "text", placeholder: "John Doe" },
        { label: "Email:", name: "email", type: "email", placeholder: "johndoe@example.com" },
        { label: "Password:", name: "password", type: showPassword ? "text" : "password", placeholder: "********" },
        { label: "Confirm Password:", name: "confirmPassword", type: "password", placeholder: "********" }
    ];

    return (
        <main className="w-screen h-full flex items-center justify-center gap-40 px-20 py-10 max-h-[86vh]">
            <img className="w-5/12 p-5" src={signUpImage} alt="sign up" />

            <div className="flex flex-col w-1/2 h-full gap-4">
                <h2 className="leading-snug font-bold text-4xl text-blue-500 text-transparent bg-clip-text bg-gradient-to-b from-sky-500 to-blue-600">Let's get started</h2>
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
                    <div className="flex justify-between items-center">
                        <button className="outline-none w-fit px-4 py-1.5 bg-gradient-to-bl hover:shadow-lg transition-all duration-200 from-sky-500 to-blue-600 text-white rounded-lg" type="submit">Submit</button>
                        <Link to='/sign-in' className="text-neutral-600">Already have an account? Sign in.</Link>
                    </div>
                </form>
            </div>
        </main>
    );
}
