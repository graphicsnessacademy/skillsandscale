/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'sub-admin' | 'master-admin';
    token: string;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('skillsandscale_user');
        if (storedUser) {
            try {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setUser(JSON.parse(storedUser));
            } catch {
                localStorage.removeItem('skillsandscale_user');
            }
        }
        setLoading(false);
    }, []);

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('skillsandscale_user', JSON.stringify(userData));
    };

    const logout = () => {
        // 1. Check if user has an Admin Role OR is currently on an Admin Path
        const isAdminRole = user?.role === 'master-admin' || user?.role === 'sub-admin';
        const isAdminPath = window.location.pathname.startsWith('/admin');

        // 2. Clear state and storage
        setUser(null);
        localStorage.removeItem('skillsandscale_user');

        // 3. Redirect logic: If they were an admin or are in the admin area, send to admin login
        if (isAdminRole || isAdminPath) {
            window.location.href = '/admin/login';
        } else {
            window.location.href = '/login';
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}