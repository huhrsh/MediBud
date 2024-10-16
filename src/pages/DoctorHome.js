import React, { useState, useEffect, useCallback, useContext } from 'react';
import searchImage from "../assets/images/magnifying-glass.png";
import { AppContext } from '../AppContext';
import { Link } from 'react-router-dom';
import DoctorModal from '../components/DoctorModal';

export default function DoctorHome() {
    const { loading, setLoading, apiUrl } = useContext(AppContext);
    const [doctors, setDoctors] = useState([]);
    const [doctor, setDoctor] = useState({ name: '', specialty: '', fees: '', location: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showDoctorModal, setShowDoctorModal] = useState(false)

    const fetchDoctors = async () => {
        setLoading(true);
        const token = localStorage.getItem('jwtToken');
        try {
            const url = `${apiUrl}doctors${searchTerm === '' ? '' : `?searchTerm=${searchTerm}`}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                credentials: 'omit'
            });
            const data = await response.json();
            setDoctors(data);
        } catch (error) {
            console.error('Error fetching doctors:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchDoctors();
    }, [searchTerm]);

    const addDoctor = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');
        try {
            const response = await fetch(`${apiUrl}doctors`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(doctor),
            });

            const addedDoctor = await response.json();
            setDoctors([...doctors, addedDoctor]);  // Add the new doctor to the list
            setDoctor({ name: '', specialty: '', fees: '', location: '' });  // Reset form
            setShowDoctorModal(!setShowDoctorModal)
        } catch (error) {
            console.error('Error adding doctor:', error);
        }
    };

    const debounce = (func, delay) => {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    };

    const handleSearchChange = useCallback(
        debounce((value) => {
            setSearchTerm(value);
        }, 500),
        []
    );

    const onSearchInputChange = (e) => {
        setSearchQuery(e.target.value);
        handleSearchChange(e.target.value);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDoctor((prev) => ({ ...prev, [name]: value }));
    };

    const handleCancel = () =>{
        setShowDoctorModal(false);
        setDoctor({ name: '', specialty: '', fees: '', location: '' });
    }

    const fields = [
        { label: 'Doctor Name', placeholder: 'Enter name', name: 'name', type: 'text' },
        { label: 'Specialty', placeholder: 'Enter specialty', name: 'specialty', type: 'text' },
        { label: 'Fees', placeholder: 'Enter fees', name: 'fees', type: 'number' },
        { label: 'Location', placeholder: 'Enter location', name: 'location', type: 'text' },
    ];

    return (
        <div className='w-screen flex flex-col px-20 py-5'>
            <div className='flex justify-between items-center mb-6'>
                <div className='flex justify-between items-center px-4 pl-2 rounded-full w-5/12 border border-neutral-300 hover:shadow focus:shadow transition-all duration-200'>
                    <img className='h-7' src={searchImage} alt='search' />
                    <input
                        type="text"
                        placeholder="name, type, venue"
                        value={searchQuery}
                        onChange={onSearchInputChange}
                        className="flex-grow rounded-full pl-2 py-2.5 outline-none text-lg text-neutral-600"
                    />
                </div>
                <button  className='outline-none w-fit px-4 py-1.5 bg-gradient-to-bl hover:shadow-lg transition-all duration-200 from-sky-500 to-blue-600 text-white rounded-lg' onClick={()=>{setShowDoctorModal(!showDoctorModal)}}>Add new doctor</button>
            </div>

            {
                showDoctorModal &&
                <DoctorModal doctor={doctor} handleChange={handleChange} handleSubmit={addDoctor} handleCancel={handleCancel} isEditing={false}/>
                // <div className={`absolute w-screen h-screen top-0 left-0 bg-white bg-opacity-70 flex items-center justify-center animate__animated ${!showDoctorModal? "animate__fadeOutDown" : "animate__fadeInDown"} animate__fast`}>
                //     <form className='border grid grid-cols-1 w-[36vw] bg-white grid-flow-row gap-3 rounded-2xl p-6' onSubmit={addDoctor}>
                //     <h2 className='font-bold text-3xl text-blue-500 text-transparent bg-clip-text bg-gradient-to-b from-sky-500 to-blue-600'>Enter doctor details</h2>
                //         {fields.map(field => (
                //             <div key={field.name} className="bg-white flex col-span-1 gap-2 items-center rounded-xl px-2 py-2.5 border transition-all duration-300 hover:scale-105 hover:shadow focus-within:scale-105 focus-within:shadow">
                //                 <h3 className="font-normal text-base flex-shrink-0 text-blue-500 text-transparent bg-clip-text bg-gradient-to-b from-sky-500 to-blue-600">{field.label} :</h3>
                //                 <input
                //                     className="outline-none text-neutral-700 w-full"
                //                     placeholder={field.placeholder}
                //                     type={field.type}
                //                     name={field.name}
                //                     value={doctor[field.name]}
                //                     onChange={handleChange}
                //                     required
                //                 />
                //             </div>
                //         ))}
                //         <div className='flex justify-between items-center'>
                //             <button className='outline-none w-fit px-4 py-1.5 bg-gradient-to-bl hover:shadow-lg transition-all duration-200 from-sky-500 to-blue-600 text-white rounded-lg' type="submit">Add Doctor</button>
                //             <button className='bg-gradient-to-bl from-rose-500 to-red-600 text-white w-fit px-4 py-1.5 rounded-lg' onClick={()=>{setShowDoctorModal(!showDoctorModal)}}>Cancel</button>
                //         </div>
                //     </form>
                // </div>
            }

            {/* <h2 className="leading-snug font-bold text-2xl text-blue-500 text-transparent bg-clip-text bg-gradient-to-b from-sky-500 to-blue-600 mb-2">Your Doctors</h2> */}
            <div className='grid grid-cols-4 grid-flow-row gap-4'>
                {doctors.map((doctor, index) => (
                    <Link to={`${doctor.id}`} className='border rounded-lg p-2' key={index}>
                        <h3 className="leading-snug font-semibold text-xl text-blue-500 text-transparent bg-clip-text bg-gradient-to-b from-sky-500 to-blue-600" >{doctor.name}</h3>
                        <p>{doctor.specialty}</p>
                        <p>{doctor.location}</p>
                        <p>₹ {doctor.fees}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
