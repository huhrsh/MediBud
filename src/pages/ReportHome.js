import React, { useContext, useState, useEffect, useCallback } from 'react';
import searchImage from "../assets/images/magnifying-glass.png";
import { AppContext } from "../AppContext";
import DocumentModal from '../components/DocumentModal';

export default function ReportHome() {
    const { loading, setLoading, apiUrl } = useContext(AppContext);
    const [reports, setReports] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showReportModal, setShowReportModal] = useState(false);
    const [document, setDocument] = useState({
        doctorID: null,
        type: "report",
        file: null,
        date: null,
        injury: null,
        description: null
    })

    // const addReport = async (e) => {
    //     setLoading(true);
    //     e.preventDefault();
    //     const token = localStorage.getItem('jwtToken');
    //     const formData = new FormData();
    //     formData.append('type', document.type || toString("report"));
    //     formData.append('file', document.file);
    //     formData.append('date', new Date(document.date));
    //     if (document.injury) {
    //         formData.append('injury', document.injury);
    //     }
    //     if (document.description) {
    //         formData.append('description', document.description);
    //     }
    //     formData.append('doctorID', document.doctorID || document?.doctor?.id);

    //     try {
    //         if (document.id) {
    //             const response = await fetch(`${apiUrl}documents/${document.id}`, {
    //                 method: 'PUT',
    //                 headers: {
    //                     'Authorization': `Bearer ${token}`
    //                 },
    //                 body: formData
    //             });
    //             const data = await response.json();
    //             console.log(data);
    //         }
    //         else {
    //             const response = await fetch(`${apiUrl}documents`, {
    //                 method: 'POST',
    //                 headers: {
    //                     'Authorization': `Bearer ${token}`,
    //                 },
    //                 body: formData,
    //             });
    //             const addedReport = await response.json();
    //             console.log(addedReport);
    //         }
    //         fetchReports();
    //         setDocument({
    //             doctorID: null,
    //             type: "report",
    //             file: null,
    //             date: null,
    //             injury: null,
    //             description: null
    //         });
    //         setShowReportModal(false);
    //     } catch (error) {
    //         console.error('Error adding report:', error);
    //     }
    //     setLoading(false);
    // };

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
                console.log(await response.text());
                fetchReports(id);
            }
        } catch (error) {
            console.error('Error deleting document:', error);
        }
        setLoading(false);
    }

    const fetchReports = async () => {
        setLoading(true);
        const token = localStorage.getItem('jwtToken');
        try {
            const url = `${apiUrl}documents/reports${searchTerm === '' ? '' : `?searchTerm=${searchTerm}`}`;
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                credentials: 'omit'
            });
            const data = await response.json();
            setReports(data);
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchReports();
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

    function handleUpdateClick(document) {
        setDocument(document);
        setShowReportModal(true);

    }

    const handleChange = (e, field) => {
        const { name, value, files } = e.target;
        if (field === 'file') {
            setDocument((prev) => ({ ...prev, file: files[0] }));
        } else {
            setDocument((prev) => ({ ...prev, [name]: value }));
        }
    };


    const handleCancel = () => {
        setShowReportModal(false);
        setDocument({ doctorID: null, date: '', time: '' });
    }

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('T')[0].split('-');
        return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`;
    };

    return (
        <div className="w-screen flex flex-col px-20 py-5">
            {/* Search Input */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex justify-between items-center px-4 pl-2 rounded-full w-5/12 border border-neutral-300 hover:shadow-md transition-all duration-200">
                    <img className="h-7" src={searchImage} alt="search" />
                    <input
                        type="text"
                        placeholder="Search doctor, location, or injury"
                        value={searchQuery}
                        onChange={onSearchInputChange}
                        className="flex-grow rounded-full pl-2 py-2.5 outline-none text-lg text-neutral-600"
                    />
                </div>
                <button className='outline-none w-fit px-4 py-1.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg shadow hover:shadow-lg transition-all duration-200'
                    onClick={() => setShowReportModal(!showReportModal)}>Add report</button>
            </div>

            {/* Modal to add report */}
            {showReportModal &&
                <DocumentModal
                    document={document}
                    setDocument={setDocument}
                    handleChange={handleChange}
                    postSubmit={fetchReports}
                    setLoading={setLoading}
                    setShowDocumentModal={setShowReportModal}
                    // handleSubmit={addReport}
                    handleCancel={handleCancel}
                    isEditing={false}
                    apiUrl={apiUrl}
                />}

            {/* Report List */}
            <div className="flex flex-col gap-4 pl-4">
                {reports?.map((report, index) => (
                    <div key={index} className="group flex justify-between transition-all duration-300">
                        <div className='w-3/5 flex justify-between border p-2 px-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-300'>
                            <div className="flex flex-col">
                                <p className="text-blue-600 font-semibold text-lg">{formatDate(report.date)}</p>
                                <div>
                                    <div className="flex gap-1 text-neutral-600"><h5 className="text-neutral-700 font-medium">Issue:</h5> {report.injury ?? "Not specified."}</div>
                                    <div className="flex gap-1 text-neutral-600"><h5 className="text-neutral-700 font-medium">Description:</h5> {report.description ?? "Not specified."}</div>
                                </div>
                            </div>
                            <div className='flex justify-end'>
                                <div className='flex flex-col items-end'>
                                    <p className="text-neutral-800 font-normal">{report.doctor.name} ({report.doctor.specialty})</p>
                                    <span>{report.doctor.location}, ₹{report.doctor.fees}</span>
                                </div>
                            </div>
                        </div>
                        <div className='relative w-2/5'>
                            <div className='flex absolute top-0 left-0 transition-all duration-300 justify-center gap-4 items-center bg-opacity-90 group-hover:w-72 w-0 h-full overflow-hidden '>
                                <button onClick={() => window.open(report.fileUrl, '_blank')} className='outline-none w-fit px-4 py-1.5 bg-gradient-to-bl from-sky-500 to-blue-500 text-white rounded-lg shadow hover:shadow-lg transition-all duration-200'>View</button>
                                <button onClick={() => { handleUpdateClick(report) }} className='outline-none w-fit px-4 py-1.5 bg-gradient-to-bl from-sky-600 to-blue-700 text-white rounded-lg shadow hover:shadow-lg transition-all duration-200'>Edit</button>
                                <button onClick={() => deleteDocument(report.id)} className="outline-none w-fit px-4 py-1.5 bg-gradient-to-bl from-rose-500 to-rose-600 text-white rounded-lg shadow hover:shadow-lg transition-all duration-200">Delete</button>
                                {/* <button onClick={()=>{deleteDocument(report.id)}} className="outline-none w-fit px-4 py-1.5 bg-gradient-to-bl hover:shadow-lg transition-all duration-200 hover:text-white rounded-lg hover:bg-rose-600 shadow">Delete</button> */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
