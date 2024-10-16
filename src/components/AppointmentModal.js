import React, { useState, useEffect } from 'react';

export default function AppointmentModal({ appointment, setAppointment,setLoading, handleChange, postSubmit, setShowAppointmentModal, handleCancel, apiUrl }) {
    const [doctors, setDoctors] = useState([]);

    let isEditing= !!appointment.id;

    const handleSubmit = async (e) => {
        setLoading(true);
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');
        try {
            if (isEditing) {
                const response = await fetch(`${apiUrl}appointments/${document.id}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(appointment)
                });
                const data = await response.json();
                console.log(data);
            }
            else{
                const response = await fetch(`${apiUrl}appointments`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(appointment),
                });
            }
            postSubmit();
            setAppointment({ doctorID: null, date: '', time: '' });  
            setShowAppointmentModal(false);
        } catch (error) {
            console.error('Error adding appointment:', error);
        }
        setLoading(false);

    };

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                const response = await fetch(`${apiUrl}doctors`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const doctorData = await response.json();
                setDoctors(doctorData);
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        };

        fetchDoctors();
    }, [apiUrl]);

    const fields = [
        { label: 'Date', placeholder: 'Enter date', name: 'date', type: 'date' },
        { label: 'Time', placeholder: 'Enter time', name: 'time', type: 'time' },
    ];

    return (
        <div className='absolute w-screen z-30 h-screen top-0 left-0 bg-white bg-opacity-70 flex items-center justify-center animate__animated animate__fadeInDown animate__fast'>
            <form className='border grid grid-cols-1 w-[36vw] bg-white grid-flow-row gap-3 rounded-2xl p-6' onSubmit={handleSubmit}>
                <h2 className='font-bold text-3xl text-blue-500 text-transparent bg-clip-text bg-gradient-to-b from-sky-500 to-blue-600'>
                    {isEditing ? 'Edit Appointment' : 'Enter Appointment Details'}
                </h2>

                {/* Dropdown for Doctor Selection */}
                <div className="bg-white flex col-span-1 gap-2 items-center rounded-xl px-2 py-2.5 border transition-all duration-300 hover:scale-105 hover:shadow focus-within:scale-105 focus-within:shadow">
                    <h3 className="font-normal text-base flex-shrink-0 text-blue-500 text-transparent bg-clip-text bg-gradient-to-b from-sky-500 to-blue-600">
                        Doctor :
                    </h3>
                    <select
                        className="outline-none text-neutral-700 w-full"
                        name="doctorID"
                        value={appointment.doctorID}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled selected>Select a doctor</option>
                        {doctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                                {doctor.name} - {doctor.specialty}
                            </option>
                        ))}
                    </select>
                </div>

                {fields.map((field) => (
                    <div key={field.name} className="bg-white flex col-span-1 gap-2 items-center rounded-xl px-2 py-2.5 border transition-all duration-300 hover:scale-105 hover:shadow focus-within:scale-105 focus-within:shadow">
                        <h3 className="font-normal text-base flex-shrink-0 text-blue-500 text-transparent bg-clip-text bg-gradient-to-b from-sky-500 to-blue-600">
                            {field.label} :
                        </h3>
                        <input
                            className="outline-none text-neutral-700 w-full"
                            placeholder={field.placeholder}
                            type={field.type}
                            name={field.name}
                            value={appointment[field.name]}
                            onChange={handleChange}
                            required
                        />
                    </div>
                ))}

                <div className='flex justify-between items-center'>
                    <button className='outline-none w-fit px-4 py-1.5 bg-gradient-to-bl hover:shadow-lg transition-all duration-200 from-sky-500 to-blue-600 text-white rounded-lg' type="submit">
                        {isEditing ? 'Update Appointment' : 'Add Appointment'}
                    </button>
                    <button className='bg-gradient-to-bl from-rose-500 to-red-600 text-white w-fit px-4 py-1.5 rounded-lg' onClick={handleCancel}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
