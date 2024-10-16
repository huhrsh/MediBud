import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Error from './pages/Error';
import SignUp from './pages/SignUp';
import { AppProvider } from './AppContext';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SignIn from './pages/SignIn';
import { useContext } from 'react';
import Home from './pages/Home';
import DoctorHome from './pages/DoctorHome';
import 'animate.css';
import DoctorDetails from './pages/DoctorDetails';
import AppointmentHome from './pages/AppointmentHome';
import AppointmentDetails from './pages/AppointmentDetails';
import PrescriptionHome from './pages/PrescriptionHome';
import ReportHome from './pages/ReportHome';

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Header/>,
      children: [
        {
          index:true,
          element: <Home />,
        },
        {
          path:"/sign-up",
          element:<SignUp/>
        },
        {
          path:"/sign-in",
          element:<SignIn/>
        },        
        {
          path:"/doctors",
          element:<DoctorHome/>,
        },        
        {
          path:"/doctors/:id",
          element:<DoctorDetails/>
        },
        {
          path:"/appointments",
          element:<AppointmentHome/>,
        },        
        {
          path:"/appointments/:id",
          element:<AppointmentDetails/>
        },
        {
          path:"/prescriptions",
          element:<PrescriptionHome/>
        },
        {
          path:"/reports",
          element:<ReportHome/>
        },
        {
          path:"*",
          element:<Error/>
        }
      ],
    },    
  ]);

  return (
      <>
      <AppProvider>
        <RouterProvider router={router} />
        <ToastContainer autoClose={3000}/>
      </AppProvider>
      </>
  );
}

export default App;
