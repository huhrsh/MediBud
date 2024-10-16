import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);  // Loading state
    const [user, setUser] = useState(null);  // User information
    const apiUrl = 'http://localhost:8000/api/';

    async function getUserWithJWT(token) {
        setLoading(true);
        const response = await fetch(`${apiUrl}auth/user`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
        if (response.ok) {
            const user = await response.json();
            setUser(user);
            // console.log("User info:", user);
        } else {
            console.error("Invalid token");
        }
        setLoading(false);
    }

    useEffect(() => {
        const jwtToken = localStorage.getItem("jwtToken");
        if (jwtToken) {
            getUserWithJWT(jwtToken);
        }
    }, [])

    return (
        <AppContext.Provider value={{ loading, setLoading, user, setUser, apiUrl }}>
            {children}
        </AppContext.Provider>
    );
};
