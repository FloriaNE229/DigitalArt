import { createContext, useContext, useState, useEffect, useRef } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [accesToken, setAccessToken] = useState(null);
    const isRefreshing = useRef(false);


    useEffect(() => {
        const checkSession = async () => {
            // si un refresh est en cours on sort immediatement
            if (isRefreshing.current) return;
            isRefreshing.current = true;

            // on tente de renouveler l'access token de l'user avec le refresh token en cookie
            try {
                await refreshAccessToken();

            } catch (error) {
                setUser(null);
                setLoading(null);
                setLoading(false);
                throw new Error("Une erreur est survenue :", error);
            }
            finally {
                setLoading(false);
                isRefreshing.current = false;
            }
        }
        checkSession();
        // // Vérifier si un token existe dans localStorage au chargement
        // const token = localStorage.getItem('token');
        // const userData = localStorage.getItem('user');

        // if (token && userData) {
        //     // eslint-disable-next-line react-hooks/set-state-in-effect
        //     setUser(JSON.parse(userData));
        // }
        // // // eslint-disable-next-line react-hooks/set-state-in-effect
        // setLoading(false);
    }, []);

    const refreshAccessToken = async () => {
        try {
            const response = await fetch("/api/refresh", {
                method: "GET",
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                }
            });

            if (!response.ok) {
                const errorDetails = await response.json().catch(() => ({}));
                throw new Error(errorDetails.message || `Erreur serveur: ${response.status}`);
            }

            const data = await response.json();

            if (!data.user || !data.accessToken) {
                throw new Error("Réponse du serveur incomplète (user ou accessToken manquant)");
            }

            setUser(data.user);
            setAccessToken(data.accessToken);
        } catch (error) {
            console.error("Échec du rafraîchissement du token :", error.message);

            // Logique de déconnexion si le refresh échoue
            setUser(null);
            setAccessToken(null);

            throw error; // Permet au composant appelant de réagir
        }


    }

    const login = (userData, token) => {
        setAccessToken(token)
        setUser(userData);
    };

    const logout = () => {
        setAccessToken(null);
        setUser(null);
    };

    const value = {
        user,
        login,
        logout,
        isAuthenticated: !!user,
        loading,
        accesToken
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}