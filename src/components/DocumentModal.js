import React, { useState, useEffect } from 'react';
import tick from "../assets/images/accept.png"

export default function DocumentModal({ document, handleChange, handleSubmit, handleCancel, apiUrl }) {
    const [doctors, setDoctors] = useState([]);

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

    let fileName = document.fileUrl;

    const fields = [
        { label: 'Issue', placeholder: 'Enter issue (optional)', name: 'injury', type: 'text' },
        { label: 'Description', placeholder: 'Enter description (optional)', name: 'description', type: 'text' },
    ];


    const isEditMode = !!document.id; 

    return (
        <div className='absolute z-20 w-screen h-screen top-0 left-0 bg-white bg-opacity-70 flex items-center justify-center animate__animated animate__fadeInDown animate__fast'>
            <form className='border grid grid-cols-1 w-[36vw] bg-white grid-flow-row gap-3 rounded-2xl p-6' onSubmit={handleSubmit}>
                <h2 className='font-bold text-3xl text-blue-500 text-transparent bg-clip-text bg-gradient-to-b from-sky-500 to-blue-600'>
                    {isEditMode ? 'Edit Document Details' : 'Enter Document Details'}
                </h2>

                {/* Dropdown for Document Type Selection */}
                <div className="bg-white flex col-span-1 gap-2 items-center rounded-xl px-2 py-2.5 border transition-all duration-300 hover:scale-105 hover:shadow focus-within:scale-105 focus-within:shadow">
                    <h3 className="font-normal text-base flex-shrink-0 text-blue-500 text-transparent bg-clip-text bg-gradient-to-b from-sky-500 to-blue-600">
                        Type :
                    </h3>
                    <select
                        className="outline-none text-neutral-700 w-full"
                        name="type"
                        value={document.type || ''}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>Select document type</option>
                        <option value="report">Report</option>
                        <option value="prescription">Prescription</option>
                    </select>
                </div>

                {/* File Upload */}
                <div className="bg-white flex col-span-1 gap-2 items-center rounded-xl px-2 py-2.5 border transition-all duration-300 hover:scale-105 hover:shadow focus-within:scale-105 focus-within:shadow">
                    <h3 className="font-normal text-base flex-shrink-0 text-blue-500 text-transparent bg-clip-text bg-gradient-to-b from-sky-500 to-blue-600">
                        File :
                    </h3>
                    <input
                        className="outline-none text-neutral-700 w-full"
                        type="file"
                        name="file"
                        onChange={(e) => handleChange(e, 'file')}
                        required={!isEditMode} // File is only required for new documents
                    />
                    {!!fileName && <img src={tick} alt='tick' className='h-6 shadow shadow-green-100 rounded-full'/>}
                </div>


                {/* Dropdown for Doctor Selection */}
                <div className="bg-white flex col-span-1 gap-2 items-center rounded-xl px-2 py-2.5 border transition-all duration-300 hover:scale-105 hover:shadow focus-within:scale-105 focus-within:shadow">
                    <h3 className="font-normal text-base flex-shrink-0 text-blue-500 text-transparent bg-clip-text bg-gradient-to-b from-sky-500 to-blue-600">
                        Doctor :
                    </h3>
                    <select
                        className="outline-none text-neutral-700 w-full"
                        name="doctorID"
                        value={document.doctor?.id|| document.doctorID || ''}
                        onChange={handleChange}
                        required
                    >
                        <option value="" disabled>Select a doctor</option>
                        {doctors.map((doctor) => (
                            <option key={doctor.id} value={doctor.id}>
                                {doctor.name} - {doctor.specialty} 
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date Selection */}
                <div className="bg-white flex col-span-1 gap-2 items-center rounded-xl px-2 py-2.5 border transition-all duration-300 hover:scale-105 hover:shadow focus-within:scale-105 focus-within:shadow">
                    <h3 className="font-normal text-base flex-shrink-0 text-blue-500 text-transparent bg-clip-text bg-gradient-to-b from-sky-500 to-blue-600">
                        Date :
                    </h3>
                    <input
                        className="outline-none text-neutral-700 w-full"
                        type="date"
                        name="date"
                        value={document.date?.split('T')[0] || ''}
                        onChange={handleChange}
                        required
                    />
                </div>

                {/* Optional Fields: Injury and Description */}
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
                            value={document[field.name] || ''}
                            onChange={handleChange}
                        />
                    </div>
                ))}

                <div className='flex justify-between items-center'>
                    <button className='outline-none w-fit px-4 py-1.5 bg-gradient-to-bl hover:shadow-lg transition-all duration-200 from-sky-500 to-blue-600 text-white rounded-lg' type="submit">
                        {isEditMode ? 'Update Document' : 'Add Document'}
                    </button>
                    <button className='bg-gradient-to-bl from-rose-500 to-red-600 text-white w-fit px-4 py-1.5 rounded-lg' onClick={handleCancel}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
