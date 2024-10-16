// DoctorModal.jsx
import React from 'react';

export default function DoctorModal({ doctor, handleChange, handleSubmit, handleCancel, isEditing }) {
    const fields = [
        { label: 'Doctor Name', placeholder: 'Enter name', name: 'name', type: 'text' },
        { label: 'Specialty', placeholder: 'Enter specialty', name: 'specialty', type: 'text' },
        { label: 'Fees', placeholder: 'Enter fees', name: 'fees', type: 'number' },
        { label: 'Location', placeholder: 'Enter location', name: 'location', type: 'text' },
    ];

    return (
        <div className='absolute z-30 w-screen h-screen top-0 left-0 bg-white bg-opacity-70 flex items-center justify-center animate__animated animate__fadeInDown animate__fast'>
            <form className='border grid grid-cols-1 w-[36vw] bg-white grid-flow-row gap-3 rounded-2xl p-6' onSubmit={handleSubmit}>
                <h2 className='font-bold text-3xl text-blue-500 text-transparent bg-clip-text bg-gradient-to-b from-sky-500 to-blue-600'>
                    {isEditing ? 'Edit Doctor' : 'Enter Doctor Details'}
                </h2>
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
                            value={doctor[field.name]}
                            onChange={handleChange}
                            required
                        />
                    </div>
                ))}
                <div className='flex justify-between items-center'>
                    <button className='outline-none w-fit px-4 py-1.5 bg-gradient-to-bl hover:shadow-lg transition-all duration-200 from-sky-500 to-blue-600 text-white rounded-lg' type="submit">
                        {isEditing ? 'Update Doctor' : 'Add Doctor'}
                    </button>
                    <button className='bg-gradient-to-bl from-rose-500 to-red-600 text-white w-fit px-4 py-1.5 rounded-lg' onClick={handleCancel}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
