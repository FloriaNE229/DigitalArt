import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from "../../components/Auth/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [searchParams,setSearchParmas] = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        remember: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email requis';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email invalide';
        }

        if (!formData.password) {
            newErrors.password = 'Mot de passe requis';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Minimum 6 caractères';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validate();
        const callbackUrl = searchParams.get('redirect') || '/'
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        if (loading) return;
        setLoading(true);

        try {
            const response = await fetch("/api/login", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            if (!response.ok) {
                // Si l'API renvoie des erreurs de validation (ex: code 422)
                if (response.status === 422 && data.errors) {
                    setErrors({ ...errors, submit: data.errors });
                }
                throw new Error(data.message || `Erreur code: ${response.status}`);
            }
            const data = await response.json();
            if (!data.user || !data.accessToken) {
                throw new Error("User undefined or accessToken invalid");
            }
            console.log(data);
            login(data.user, data.accessToken);
            navigate(callbackUrl);
        } catch (error) {
            console.error("Erreur lors de l'inscription:", error.message);
        }
    };
    return (
        <div className="flex items-center justify-center min-h-screen p-4" style={{ backgroundColor: '#f8f9fa' }}>
            <div className="w-full max-w-sm mx-auto">

                <div className="mb-3 text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-full" style={{
                        backgroundColor: 'rgba(74, 111, 165, 0.1)',
                        color: '#4a6fa5',
                        border: '1px solid rgba(74, 111, 165, 0.2)'
                    }}>
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#ff7e5f' }}></span>
                        Plateforme N°1 des artisans
                    </span>
                </div>

                <div className="mb-4 text-center">
                    <h1 className="mb-1 text-xl font-bold" style={{ color: '#2b2d42' }}>
                        Bon retour
                    </h1>
                    <p className="text-sm" style={{ color: '#2b2d42', opacity: 0.7 }}>
                        Connectez-vous à votre compte
                    </p>
                </div>

                <div className="p-5 shadow-lg rounded-xl" style={{
                    border: '1px solid #e9ecef',
                    backgroundColor: 'white'
                }}>
                    {errors.submit && (
                        <div className="p-4 mb-6 rounded-xl" style={{ backgroundColor: 'rgba(255, 126, 95, 0.1)', borderLeft: '4px solid var(--accent)' }}>
                            <p className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>{errors.submit}</p>
                        </div>
                    )}
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block mb-2 text-sm font-medium" style={{ color: '#2b2d42' }}>
                                Adresse email
                            </label>
                            <div className="relative">
                                <Mail className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2" style={{ color: '#ff7e5f' }} />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="exemple@email.com"
                                    className="w-full py-3 pr-4 text-sm transition-all border rounded-lg outline-none pl-11 focus:ring-2"
                                    style={{
                                        backgroundColor: errors.email ? 'rgba(255, 126, 95, 0.05)' : '#f8f9fa',
                                        borderColor: errors.email ? '#ff7e5f' : '#e9ecef',
                                        color: '#2b2d42',
                                    }}
                                    onFocus={(e) => !errors.email && (e.target.style.borderColor = '#4a6fa5')}
                                    onBlur={(e) => !errors.email && (e.target.style.borderColor = '#e9ecef')}
                                    required
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-2 text-sm font-semibold" style={{ color: '#ff7e5f' }}>{errors.email}</p>
                            )}
                        </div>

                        <div className="mb-5">
                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium" style={{ color: '#2b2d42' }}>
                                    Mot de passe
                                </label>
                                <Link
                                    to="/forgot-password"
                                    className="text-sm font-medium transition-all hover:underline"
                                    style={{ color: '#4a6fa5' }}
                                >
                                    Mot de passe oublié ?
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2" style={{ color: '#ff7e5f' }} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full py-3 pr-12 text-sm transition-all border rounded-lg outline-none pl-11 focus:ring-2"
                                    style={{
                                        backgroundColor: errors.password ? 'rgba(255, 126, 95, 0.05)' : '#f8f9fa',
                                        borderColor: errors.password ? '#ff7e5f' : '#e9ecef',
                                        color: '#2b2d42',
                                    }}
                                    onFocus={(e) => !errors.password && (e.target.style.borderColor = '#4a6fa5')}
                                    onBlur={(e) => !errors.password && (e.target.style.borderColor = '#e9ecef')}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute transition-all -translate-y-1/2 right-3 top-1/2 hover:opacity-70"
                                    style={{ color: '#6b8cba' }}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-2 text-sm font-semibold" style={{ color: '#ff7e5f' }}>{errors.password}</p>
                            )}
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full h-12 text-sm font-semibold text-white rounded-xl transition-all hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                            style={{
                                background: 'linear-gradient(135deg, #4a6fa5, #3a5784)'
                            }}
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                                    Connection...
                                </div>
                            ) : "Se connecter"}
                        </button>
                    </form>

                    <div className="pt-4 mt-4 text-center border-t" style={{ borderColor: '#e9ecef' }}>
                        <p className="text-sm" style={{ color: '#2b2d42', opacity: 0.7 }}>
                            Pas encore de compte ?{" "}
                            <Link
                                to="/register"
                                className="font-semibold transition-all hover:underline"
                                style={{ color: '#ff7e5f' }}
                            >
                                Créer un compte
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="mt-4 text-xs text-center" style={{ color: '#2b2d42', opacity: 0.5 }}>
                    En vous connectant, vous acceptez nos conditions d'utilisation
                </p>
            </div>
        </div>
    );
};

export default Login;