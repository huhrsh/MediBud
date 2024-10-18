import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../AppContext";
import DoctorModal from "../components/DoctorModal";
import { toast } from "react-toastify";
import DocumentModal from "../components/DocumentModal";
import AppointmentModal from "../components/AppointmentModal";
import warning from "../assets/images/warning (1).png"

export default function DoctorDetails() {
    const { id } = useParams();
    const { loading, user, setLoading, apiUrl } = useContext(AppContext);
    const [doctorDetails, setDoctorDetails] = useState(null);
    const [reports, setReports] = useState([]);
    const [showDoctorModal, setShowDoctorModal] = useState(false);
    const [prescriptions, setPrescriptions] = useState([]);
    const [pastAppointments, setPastAppointments] = useState([]);
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
    const [deleteDoctorModal, setDeleteDoctorModal] = useState(false);

    const [appointment, setAppointment] = useState(
        {
            doctorID: id,
            issue: '',
            date: '',
            time: ''
        }
    );
    const navigate = useNavigate();


    const [document, setDocument] = useState({
        doctorID: id,
        type: null,
        file: null,
        date: null,
        injury: null,
        description: null
    })
    const [showDocumentModal, setShowDocumentModal] = useState(false);

    const fetchDoctorDetails = async () => {
        setLoading(true);
        try {
            const jwtToken = localStorage.getItem('jwtToken')
            const response = await fetch(`${apiUrl}doctors/${id}`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    "Content-Type": "application/json",
                },
            });

            if (response.status===403) {
                toast.error("Unauthorized.")
                navigate('/');
                setLoading(false);
            }
            else {
                const data = await response.json();
                // if (data && user && data?.doctor?.user?.id !== user?.id) {
                //     toast.error("Unauthorized.");
                //     setLoading(false);
                //     navigate(-1);
                //     return;
                // }
                setReports(data.reports);
                setPastAppointments(data.pastAppointments);
                setUpcomingAppointments(data.upcomingAppointments);
                setPrescriptions(data.prescriptions);
                setDoctorDetails(data.doctor);

            }
        } catch (error) {
            console.error('Error fetching doctor details:', error);
        }
        setLoading(false);
    };

    const handleDoctorUpdate = async (e) => {
        setLoading(true);
        e.preventDefault();
        const token = localStorage.getItem('jwtToken');
        try {
            const response = await fetch(`${apiUrl}doctors/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(doctorDetails),
            });
            if (response.status===403) {
                toast.error("Unauthorized.")
                setLoading(false);
                navigate('/');
            }
            else{
                const updatedDoctor = await response.json();
                setDoctorDetails(updatedDoctor);
                toast.success("Doctor updated.")
            }
            setShowDoctorModal(false);
        } catch (error) {
            console.error('Error updating doctor:', error);
        }
        setLoading(false);
    };

    const deleteDoctor = async () => {
        setLoading(true);
        const token = localStorage.getItem('jwtToken');
        try {
            const response = await fetch(`${apiUrl}doctors/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (response.status===403) {
                toast.error("Unauthorized.")
                navigate('/');
                setLoading(false);
            }
            
            toast.success("Doctor deleted.")
            navigate("/doctors");
            setLoading(false);
        } catch (error) {
            console.error('Error deleting doctor:', error);
        }
        setLoading(false);
    };

    function handleDocumentEditClick(document) {
        setDocument(document);
        setShowDocumentModal(true);
    }

    const handleCancel = () => setShowDoctorModal(false);
    const handleCancelDocument = () => setShowDocumentModal(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDoctorDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleChangeDocument = (e, field) => {
        const { name, value, files } = e.target;
        if (field === 'file') {
            setDocument((prev) => ({ ...prev, file: files[0] }));
        } else {
            setDocument((prev) => ({ ...prev, [name]: value }));
        }
    };

    useEffect(() => {
        fetchDoctorDetails(id);
    }, [id]);

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

    const deleteDocument = async (id) => {
        setLoading(true);
        const token = localStorage.getItem('jwtToken');
        try {
            const response = await fetch(`${apiUrl}documents/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                toast.success("Document deleted.");
                fetchDoctorDetails();
            }
        } catch (error) {
            console.error('Error deleting document:', error);
        }
        setLoading(false);
    }

    const handleChangeAppointment = (e) => {
        const { name, value } = e.target;
        setAppointment((prev) => ({ ...prev, [name]: value }));
    };

    const handleCancelAppointment = () => {
        setShowAppointmentModal(false);
        setAppointment({ doctorID: id, date: '', time: '' });
    }

    function handleDocumentAddition(e) {
        e.preventDefault();
        setDocument((document) => ({ ...document, doctorID: id }));
        setShowDocumentModal(true);
    }

    function handleAppointmentAddition(e) {
        e.preventDefault();
        setAppointment((appointment) => ({ ...appointment, doctorID: id }));
        setShowAppointmentModal(true);
    }

    function handleAppointmentUpdate(appointment) {
        setAppointment((appointment) => ({ ...appointment, doctorID: id }))
        setAppointment(appointment);
        setShowAppointmentModal(true);
    }

    async function deleteAppointment(id) {
        setLoading(true);
        try {
            const response = await fetch(`${apiUrl}appointments/${id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                fetchDoctorDetails();
                toast.success("Appointment deleted.");
            };
        } catch (error) {
            console.error('Error deleting appointment:', error);
        }
        setLoading(false);
    }

    const renderAppointmentList = (appointments, title) => (
        <div className="w-1/2 flex flex-col gap-2 ">
            <h4 className="font-semibold text-2xl text-blue-500 text-transparent bg-clip-text bg-gradient-to-b from-sky-500 to-blue-600">{title}</h4>
            {appointments.length > 0 ?
                <div className="p-2 max-h-96 overflow-y-scroll w-4/5 flex flex-col gap-2">
                    {appointments?.map((appointment) => (
                        <div className="relative group overflow-hidden shadow border flex-col flex rounded-lg py-1.5 px-4" key={appointment.id}>
                            <div className="flex items-center justify-between">
                                <p className="text-blue-600 font-semibold text-lg"> {formatTime(appointment.time)}</p>
                                <p className="text-blue-600 font-semibold text-lg"> {formatDate(appointment.date)}</p>
                            </div>
                            <p>{appointment.issue}</p>
                            <div className='absolute opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:top-0 overflow-hidden  top-[100%] w-full h-full group-hover:left-0 left-[0%] flex justify-center items-center gap-4 bg-neutral-50 bg-opacity-95'>
                                <Link to={`/appointments/${appointment.id}`} className='outline-none w-fit px-4 py-1.5 bg-gradient-to-bl from-sky-500 to-blue-500 text-white rounded-lg shadow hover:shadow-lg transition-all duration-200'>View</Link>
                                <button onClick={() => handleAppointmentUpdate(appointment)} className='outline-none w-fit px-4 py-1.5 bg-gradient-to-bl from-sky-600 to-blue-700 text-white rounded-lg shadow hover:shadow-lg transition-all duration-200'>Edit</button>
                                <button onClick={() => deleteAppointment(appointment.id)} className="outline-none w-fit px-4 py-1.5 bg-gradient-to-bl from-rose-500 to-rose-600 text-white rounded-lg shadow hover:shadow-lg transition-all duration-200">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
                :
                <p className="text-base text-neutral-500">No appointments to show.</p>
            }
        </div>
    );

    const DocumentList = ({ documents, title }) => {
        const formatDate2 = (dateString) => {
            const [year, month, day] = dateString.split('T')[0].split('-');
            return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
        };

        return (
            <div className="flex flex-col gap-2 w-1/2 ">
                <h4 className="font-semibold text-2xl text-blue-500 text-transparent bg-clip-text bg-gradient-to-b from-sky-500 to-blue-600">{title}</h4>
                {documents.length > 0 ?
                    <div className="p-2 max-h-96 overflow-y-scroll w-4/5 flex flex-col gap-2">
                        {documents.map((document, index) => (
                            <div key={index} className="relative group overflow-hidden border p-4 flex justify-between rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="flex flex-col">
                                    <p className="text-blue-600 font-semibold text-lg">{formatDate2(document.date)}</p>
                                    <div>
                                        <div className="flex gap-1 text-neutral-600"><h5 className="text-neutral-700 font-medium">Issue:</h5> {document.injury ?? "Not specified."}</div>
                                        <div className="flex gap-1 text-neutral-600"><h5 className="text-neutral-700 font-medium">Description:</h5> {document.description ?? "Not specified."}</div>
                                    </div>
                                </div>
                                <div className='absolute transition-all duration-300 group-hover:top-0 overflow-hidden  top-[100%] w-0  group-hover:w-full h-full group-hover:left-0 left-[50%] flex justify-center items-center gap-4 bg-neutral-50 bg-opacity-95'>
                                    <button onClick={() => window.open(document.fileUrl, '_blank')} className='outline-none w-fit px-4 py-1.5 bg-gradient-to-bl from-sky-500 to-blue-500 text-white rounded-lg shadow hover:shadow-lg transition-all duration-200'>View</button>
                                    <button onClick={() => handleDocumentEditClick(document)} className='outline-none w-fit px-4 py-1.5 bg-gradient-to-bl from-sky-600 to-blue-700 text-white rounded-lg shadow hover:shadow-lg transition-all duration-200'>Edit</button>
                                    <button onClick={() => deleteDocument(document.id)} className="outline-none w-fit px-4 py-1.5 bg-gradient-to-bl from-rose-500 to-rose-600 text-white rounded-lg shadow hover:shadow-lg transition-all duration-200">Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    : <p className="text-neutral-500">No {title.toLowerCase()} to show</p>
                }
            </div>
        );
    };

    const DeleteDoctorModal = ()=>(
        <div className="bg-white bg-opacity-70 fixed w-screen h-screen top-0 left-0 z-40 flex items-center justify-center">
            <div className="bg-white w-1/3 flex flex-col border p-4 rounded-lg shadow gap-3">
            <div className="flex w-full justify-center items-center gap-2">
                <img className="h-7" src={warning} alt="warning" /> 
                <h5 className="text-amber-500 font-bold text-2xl uppercase">Warning</h5>
                </div>
                <p className="text-neutral-600 text-lg">
                    Deleting the doctor will delete all appointments, reports and prescriptions linked to it.
                    <br/>
                    <br/>
                     Are you sure you want to proceed?
                </p>
                <div className="flex justify-between items-center">
                    <button className="outline-none w-fit px-4 py-1.5 bg-gradient-to-bl from-sky-500 to-blue-600 text-white rounded-lg shadow hover:shadow-lg transition-all duration-200" onClick={()=>deleteDoctor()}>Delete</button>
                    <button className="outline-none w-fit px-4 py-1.5 bg-gradient-to-bl from-rose-500 to-rose-600 text-white rounded-lg shadow hover:shadow-lg transition-all duration-200" onClick={()=>setDeleteDoctorModal(false)}>Cancel</button>
                </div>
            </div>
        </div>
    )


    return (
        <>
            {!loading &&
                <div className="w-screen px-20 py-5">

                    {
                        deleteDoctorModal &&
                        <DeleteDoctorModal/>
                    }

                    {showDocumentModal && (
                        <DocumentModal
                            document={document}

                            setDocument={setDocument}
                            handleChange={handleChangeDocument}
                            postSubmit={fetchDoctorDetails}
                            setLoading={setLoading}
                            setShowDocumentModal={setShowDocumentModal}
                            handleCancel={handleCancelDocument}
                            isEditing={true}
                            apiUrl={apiUrl}
                        />
                    )}
                    {showDoctorModal && (
                        <DoctorModal
                            doctor={doctorDetails}
                            handleChange={handleChange}
                            handleSubmit={handleDoctorUpdate}
                            handleCancel={handleCancel}
                            isEditing={true}
                        />
                    )}

                    {showAppointmentModal &&
                        <AppointmentModal
                            appointment={appointment}
                            setAppointment={setAppointment}
                            handleChange={handleChangeAppointment}
                            handleCancel={handleCancelAppointment}
                            setLoading={setLoading}
                            setShowAppointmentModal={setShowAppointmentModal}
                            postSubmit={fetchDoctorDetails}
                            isEditing={false}
                            apiUrl={apiUrl}
                        />}
                    {doctorDetails && (
                        <section className="flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="leading-snug font-semibold text-xl text-blue-500 text-transparent bg-clip-text bg-gradient-to-b from-sky-500 to-blue-600">
                                        {doctorDetails.name}
                                    </h3>
                                    <p>{doctorDetails.specialty}</p>
                                    <p>{doctorDetails.location}</p>
                                    <p>₹ {doctorDetails.fees}</p>
                                </div>
                                <div className="flex justify-end gap-2 flex-col">
                                    <div className="flex gap-2 justify-end">
                                        <button className="outline-none w-fit px-4 py-1.5 bg-gradient-to-bl from-sky-600 to-blue-600 text-white rounded-lg shadow hover:shadow-lg transition-all duration-200"
                                            onClick={() => setShowDoctorModal(true)}>
                                            Edit Doctor
                                        </button>
                                        <button onClick={(e) => handleDocumentAddition(e)} className='capitalize outline-none w-fit px-4 py-1.5 bg-gradient-to-bl from-sky-500 to-blue-500 text-white rounded-lg shadow hover:shadow-lg transition-all duration-200'>Add report / prescription</button>
                                    </div>
                                    <div className="flex gap-2 justify-end">
                                        <button className="outline-none w-fit px-4 py-1.5 bg-gradient-to-bl from-rose-500 to-rose-600 text-white rounded-lg shadow hover:shadow-lg transition-all duration-200"
                                            onClick={() => setDeleteDoctorModal(true)}>
                                            Delete Doctor
                                        </button>
                                        <button onClick={(e) => handleAppointmentAddition(e)} className='capitalize outline-none w-fit px-4 py-1.5 bg-gradient-to-bl from-sky-500 to-blue-500 text-white rounded-lg shadow hover:shadow-lg transition-all duration-200'>Add appointment</button>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-between gap-0">
                                {renderAppointmentList(upcomingAppointments, "Upcoming Appointments")}
                                {renderAppointmentList(pastAppointments, "Past Appointments")}
                            </div>

                            <div className="flex justify-between gap-0">
                                <DocumentList documents={reports} title="Reports" />
                                <DocumentList documents={prescriptions} title="Prescriptions" />
                            </div>

                        </section>
                    )}
                </div>
            }
        </>
    );
}
