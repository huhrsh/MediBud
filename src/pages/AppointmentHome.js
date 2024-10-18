import React, { useState, useEffect, useCallback, useContext } from 'react';
import searchImage from "../assets/images/magnifying-glass.png";
import { AppContext } from '../AppContext';
import { Link } from 'react-router-dom';
import AppointmentModal from '../components/AppointmentModal';

export default function AppointmentHome() {
    const { loading, setLoading, apiUrl } = useContext(AppContext);
    const [pastAppointments, setPastAppointments] = useState([]);
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [appointment, setAppointment] = useState(
        {
            doctorID: null,
            issue: '',
            date: '',
            time: ''
        }
    );
    const [searchQuery, setSearchQuery] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);

    const fetchAppointments = async () => {
        setLoading(true);
        const token = localStorage.getItem('jwtToken');
        try {
            const url = `${apiUrl}appointments${searchTerm === '' ? '' : `?searchTerm=${searchTerm}`}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                credentials: 'omit'
            });
            const data = await response.json();
            setPastAppointments(data.pastAppointments);
            setUpcomingAppointments(data.upcomingAppointments);
        } catch (error) {
            console.error('Error fetching appointments:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAppointments();
    }, [searchTerm]);


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
        setAppointment((prev) => ({ ...prev, [name]: value }));
    };

    const handleCancel = () => {
        setShowAppointmentModal(false);
        setAppointment({ doctorID: null, date: '', time: '' });
    }

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
    };

    const formatTime = (timeString) => {
        const [hours, minutes] = timeString.split(':');
        const period = +hours >= 12 ? 'PM' : 'AM';
        const adjustedHours = (+hours % 12) || 12;
        return `${adjustedHours}:${String(minutes).padStart(2, '0')} ${period}`;
    };

    // Component for listing appointments (both upcoming and past)
    const AppointmentList = ({ title, appointments }) => {
        return (
            <div className='flex-grow'>
                <h3 className='text-2xl font-semibold mb-2 text-blue-500 text-transparent bg-clip-text bg-gradient-to-b from-sky-500 to-blue-600'>{title}</h3>
                <div className='flex flex-col gap-2 max-h-[70vh] overflow-y-scroll px-2'>
                    {appointments.length > 0 ? (
                        appointments.map((appointment, index) => (
                            <Link to={`${appointment.id}`} className='border p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300' key={index}>
                                <div className='flex justify-between'>
                                    <p className="text-blue-600 font-semibold text-lg">{formatDate(appointment.date)} | {formatTime(appointment.time)}</p>
                                    <p className='text-neutral-800 font-normal'>{appointment.doctor.name} ({appointment.doctor.specialty})</p>
                                </div>
                                {appointment.issue}
                                <div className='flex text-base justify-between'>
                                    <span className='text-neutral-600'>{appointment.doctor.location}</span>
                                    <span className='text-neutral-600'>₹{appointment.doctor.fees}</span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="text-neutral-500">No appointments available</p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
        {
            !loading &&
            <div className='w-screen flex flex-col px-20 py-5'>
                {/* Search and Add Appointment Button */}
                <div className='flex justify-between items-center mb-6'>
                    <div className='flex justify-between items-center px-4 pl-2 rounded-full w-5/12 border border-neutral-300 hover:shadow-md transition-all duration-200'>
                        <img className='h-7' src={searchImage} alt='search' />
                        <input
                            type="text"
                            placeholder="Search doctor, location, or specialty"
                            value={searchQuery}
                            onChange={onSearchInputChange}
                            className="flex-grow rounded-full pl-2 py-2.5 outline-none text-lg text-neutral-600"
                        />
                    </div>
                    <button
                        className='outline-none w-fit px-4 py-1.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg shadow hover:shadow-lg transition-all duration-200'
                        onClick={() => setShowAppointmentModal(!showAppointmentModal)}
                    >
                        Add Appointment
                    </button>
                </div>

                {/* Appointment Modal */}
                {showAppointmentModal &&
                    <AppointmentModal
                        appointment={appointment}
                        setAppointment={setAppointment}
                        handleChange={handleChange}
                        setLoading={setLoading}
                        postSubmit={fetchAppointments}
                        setShowAppointmentModal={setShowAppointmentModal}
                        // handleSubmit={addAppointment}
                        handleCancel={handleCancel}
                        apiUrl={apiUrl}
                    />}

                {/* Appointment Lists */}
                <div className='flex justify-between gap-20'>
                    {/* Upcoming Appointments */}
                    <AppointmentList
                        title="Upcoming Appointments"
                        appointments={upcomingAppointments}
                    />

                    {/* Past Appointments */}
                    <AppointmentList
                        title="Past Appointments"
                        appointments={pastAppointments}
                    />
                </div>
            </div>
        }
        </>
    );
}
