import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../AppContext";
import AppointmentModal from "../components/AppointmentModal";

export default function AppointmentDetails() {
    const { id } = useParams();
    const { loading, setLoading, apiUrl } = useContext(AppContext);
    const [reports, setReports] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [doctorDetails, setDoctorDetails] = useState(null);
    const [appointmentDate, setAppointmentDate] = useState('');
    const [appointmentTime, setAppointmentTime] = useState('');
    const [appointmentIssue, setAppointmentIssue] = useState('');
    const [appointment, setAppointment] = useState({});
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);

    const navigate = useNavigate();

    const fetchAppointmentDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}appointments/${id}`, {
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
            setAppointment({
                id: data.id,
                doctorID: data.doctor.id,
                issue: data.issue,
                date: data.date,
                time: data.time
            });
            setReports(data.reports);
            setPrescriptions(data.prescriptions);
            setDoctorDetails(data.doctor);
            setAppointmentDate(data.date);
            setAppointmentIssue(data.issue);
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

    function handleUpdateClick() {
        setShowAppointmentModal(true);
    }

    const handleChangeAppointment = (e) => {
        const { name, value } = e.target;
        setAppointment((prev) => ({ ...prev, [name]: value }));
    };

    const handleCancelAppointment = () => {
        setShowAppointmentModal(false);
        setAppointment({ doctorID: id, date: '', time: '' });
    }

    return (
        <>
            {
                !loading &&
                <div className="w-screen flex justify-between items-start px-20 py-5">
                    {showAppointmentModal &&
                        <AppointmentModal
                            appointment={appointment}
                            setAppointment={setAppointment}
                            handleChange={handleChangeAppointment}
                            handleCancel={handleCancelAppointment}
                            setLoading={setLoading}
                            setShowAppointmentModal={setShowAppointmentModal}
                            postSubmit={fetchAppointmentDetails}
                            isEditing={false}
                            apiUrl={apiUrl}
                        />}
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
                                    <p className="text-neutral-600">{appointmentIssue}</p>
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
                    <div className="flex gap-6 items-center justify-between">
                        <button className="outline-none w-fit px-4 py-1.5 bg-gradient-to-bl from-sky-500 to-blue-500 text-white rounded-lg shadow hover:shadow-lg transition-all duration-200" onClick={() => { handleUpdateClick() }}>Edit</button>
                        <button className="outline-none w-fit px-4 py-1.5 bg-gradient-to-bl from-rose-500 to-rose-600 text-white rounded-lg shadow hover:shadow-lg transition-all duration-200" onClick={deleteAppointment}>Delete</button>
                    </div>
                </div>

            }
        </>
    );
}
