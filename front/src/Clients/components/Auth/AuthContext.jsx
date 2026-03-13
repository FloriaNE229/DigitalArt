import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../../../../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user,    setUser]    = useState(null);
    const [token,   setToken]   = useState(() => localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    // Au montage : si un token existe en localStorage, on recharge l'utilisateur
    useEffect(() => {
        const restoreSession = async () => {
            const savedToken = localStorage.getItem('token');
            if (!savedToken) {
                setLoading(false);
                return;
            }
            try {
                const data = await authAPI.me();   // GET /auth/me
                setUser(data.user ?? data);
                setToken(savedToken);
            } catch {
                // Token invalide ou expiré → on nettoie
                localStorage.removeItem('token');
                setUser(null);
                setToken(null);
            } finally {
                setLoading(false);
            }
        };

        restoreSession();
    }, []);

    /** Appelé après login ou register */
    const login = (userData, accessToken) => {
        localStorage.setItem('token', accessToken);
        setToken(accessToken);
        setUser(userData);
    };

    /** Déconnexion */
    const logout = async () => {
        try {
            await authAPI.logout();   // POST /auth/logout
        } catch {
            // On déconnecte côté client même si l'API échoue
        } finally {
            localStorage.removeItem('token');
            setUser(null);
            setToken(null);
        }
    };

    const value = {
        user,
        token,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
        isClient:  user?.role === 'CLIENT',
        isArtisan: user?.role === 'ARTISAN',
        isAdmin:   user?.role === 'ADMIN',
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}