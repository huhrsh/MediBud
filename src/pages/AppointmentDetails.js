import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../AppContext";

export default function AppointmentDetails() {
    const { id } = useParams();
    const { loading, setLoading, apiUrl } = useContext(AppContext);
    const [reports, setReports] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [doctorDetails, setDoctorDetails] = useState(null);
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');

    const navigate = useNavigate();

    const fetchAppointmentDetails = async (appointmentId) => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}appointments/${appointmentId}`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                navigate(-1);
                return;
            }

            const data = await response.json();
            console.log(data);
            setReports(data.reports);
            setPrescriptions(data.prescriptions);
            setDoctorDetails(data.doctor);
            setAppointmentDate(data.date);
            setAppointmentTime(data.time);
        } catch (error) {
            console.error('Error fetching appointment details:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchAppointmentDetails(id);
    }, [id]);

    async function deleteAppointment() {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}appointments/${id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) throw new Error('Failed to delete appointment');
            const data = await response.text();
            console.log(data);
            navigate(-1);
        } catch (error) {
            console.error('Error deleting appointment:', error);
        }
        setLoading(false);
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


    return (
        <>
            {
                !loading &&
                <div className="w-screen flex justify-between items-start px-20 py-5">
                    <div className="flex flex-col gap-2">
                        <div>
                            <h2 className="text-blue-600 font-semibold text-lg">{formatDate(appointmentDate)} | {formatTime(appointmentTime)}</h2>
                            {doctorDetails && (
                                <div>
                                    <div className="flex gap-2">
                                        <h3 className="text-neutral-700 ">{doctorDetails.name}</h3>
                                        <p className="text-neutral-700"> | </p>
                                        <p className="text-neutral-700 ">{doctorDetails.specialty}</p>
                                    </div>
                                    <p className="text-neutral-600">{doctorDetails.location}</p>
                                    <p className="text-neutral-600">₹{doctorDetails.fees}</p>
                                </div>
                            )}
                        </div>

                        <div>
                            <h3 className="leading-snug font-semibold text-2xl text-blue-500 text-transparent bg-clip-text bg-gradient-to-b from-sky-500 to-blue-600">Associated prescriptions</h3>
                            <div>
                                {
                                    prescriptions?.map((prescriptions) => (
                                        <div>prescription</div>
                                    ))
                                }
                            </div>
                        </div>
                        <div>
                            <h3 className="leading-snug font-semibold text-2xl text-blue-500 text-transparent bg-clip-text bg-gradient-to-b from-sky-500 to-blue-600">Associated reports</h3>
                            <div>
                                {
                                    reports?.map((prescriptions) => (
                                        <div>prescription</div>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                    <button className="outline-none w-fit px-4 py-1.5 bg-gradient-to-bl hover:shadow-lg transition-all duration-200 hover:text-white rounded-lg hover:bg-rose-600 shadow" onClick={deleteAppointment}>Delete</button>
                </div>

            }
        </>
    );
}
