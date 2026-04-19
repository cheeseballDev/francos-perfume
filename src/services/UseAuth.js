import { useState } from "react";

const SESSION_KEYS = ['email', 'accessToken', 'branch', 'trueRole', 'activeRole']

const loadFromSession = () => {
    const token = sessionStorage.getItem('accessToken');
    console.log('Loading from session, token:', token);
    if (!token) return null;

    return {
        email: sessionStorage.getItem('email'),
        accessToken: token,
        branch: sessionStorage.getItem('branch') || null,
        trueRole: sessionStorage.getItem('trueRole'),
        activeRole: sessionStorage.getItem('activeRole') || null, 
    }
}

export const UseAuth = () => {
    const [user, setUser] = useState(loadFromSession);

    const login = (userData) => {
        SESSION_KEYS.forEach(key => {
            if (userData[key]) {
                sessionStorage.setItem(key, userData[key]);
            }
        });
        setUser(userData);
    }

    const logout = () => {
        sessionStorage.clear();
        setUser(null);
    }

    const switchRole = (newActiveRole) => {
        sessionStorage.setItem('activeRole', newActiveRole);
        setUser(prev => ({
            ...prev,
            activeRole: newActiveRole
        }));
    }

    return { user, login, logout, switchRole };
}