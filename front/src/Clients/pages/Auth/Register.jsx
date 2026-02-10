import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Eye, EyeOff, Check, UserCircle, Hammer, Briefcase, Plus, X  } from 'lucide-react';
import { useAuth } from '../../components/Auth/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const navigate = useNavigate();
    const [userType, setUserType] = useState("client");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showNewDomainInput, setShowNewDomainInput] = useState(false);
    const [newDomain, setNewDomain] = useState("");
    const [formData, setFormData] = useState({
        nom: "",
        prenom: "",
        email: "",
        phone: "",
        specialty: "",
        role: "",
        password: "",
        password_confirmation: "",
        acceptTerms: false
    });
    const [errors, setErrors] = useState({});

    // Données de domaines et spécialités
    const [domainsData, setDomainsData] = useState({
        "Bâtiment": ["Maçonnerie", "Peinture", "Carrelage", "Plâtrerie", "Coffreur", "Briqueteur", "Façadier", "Chapiste", "Fumiste"],
        "Électricité": ["Installation électrique", "Dépannage", "Tableaux électriques", "Domotique", "Electricien Courant Faible", "Electricien automobile"],
        "Plomberie": ["Installation sanitaire", "Chauffage", "Climatisation", "Dépannage"],
        "Menuiserie": ["Menuiserie bois", "Menuiserie aluminium", "Ébénisterie", "Agencement", "Parquetteur"],
        "Jardin": ["Paysagisme", "Élagage", "Entretien", "Arrosage automatique"],
        "Peinture": ["Peintre Bâtiment", "Peintre Façadier", "Artiste Peintre"]
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
        // Effacer l'erreur quand l'utilisateur commence à taper
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleAddDomain = () => {
        if (newDomain.trim() && !domainsData[newDomain.trim()]) {
            setDomainsData(prev => ({
                ...prev,
                [newDomain.trim()]: []
            }));
            setFormData(prev => ({ ...prev, domain: newDomain.trim(), specialty: "" }));
            setNewDomain("");
            setShowNewDomainInput(false);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.nom.trim()) {
            newErrors.nom = "Le nom est requis";
        }

        if (!formData.prenom.trim()) {
            newErrors.prenom = "Le prenom est requis";
        }

        if (!formData.email.trim()) {
            newErrors.email = "L'email est requis";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email invalide";
        }

        if (userType === "artisan" && !formData.phone.trim()) {
            newErrors.phone = "Le téléphone est requis";
        }

        if (userType === "artisan" && !formData.domain) {
            newErrors.domain = "Le domaine est requis";
        }

        if (userType === "artisan" && !formData.specialty) {
            newErrors.specialty = "La spécialité est requise";
        }

        if (userType === "artisan" && !formData.specialty) {
            newErrors.specialty = "La spécialité est requise";
        }

        if (!formData.password) {
            newErrors.password = "Le mot de passe est requis";
        } else if (formData.password.length < 6) {
            newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
        }

        if (!formData.password_confirmation) {
            newErrors.password_confirmation = "Veuillez confirmer votre mot de passe";
        } else if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = "Les mots de passe ne correspondent pas";
        }

        if (!formData.acceptTerms) {
            newErrors.acceptTerms = "Vous devez accepter les conditions";
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();

        const { login } = useAuth;

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // éviter que l'utilisateur envoi plusieurs requêtes en cliquant sur le bouton 
        if (loading) return;

        setLoading(true);

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'accept': 'application/json'
                },
                body: JSON.stringify({ ...formData, role: userType })
            })
            if (!response.ok) {
                // Si l'API renvoie des erreurs de validation (ex: code 422)
                if (response.status === 422 && data.errors) {
                    setErrors(data.errors);
                }
                throw new Error(data.message || `Erreur code: ${response.status}`);
            }
            const data = await response.json();
            if (!data.user || !data.accessToken) {
                throw new Error("User undefined or accessToken invalid");
            }
            console.log(data);
            login(data.user, data.accessToken);
            navigate('/');
        } catch (error) {
            console.error("Erreur lors de l'inscription:", error.message);
        }
    };

    const availableSpecialties = formData.domain ? domainsData[formData.domain] || [] : [];

    return (
        <div className="flex items-center justify-center min-h-screen p-4" style={{ backgroundColor: '#f8f9fa' }}>
            <div className="w-full max-w-md mx-auto">
                {/* Badge */}
                <div className="mb-4 text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-full" style={{
                        backgroundColor: 'rgba(74, 111, 165, 0.1)',
                        color: '#4a6fa5',
                        border: '1px solid rgba(74, 111, 165, 0.2)'
                    }}>
                        <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#ff7e5f' }}></span>
                        Rejoignez notre communauté
                    </span>
                </div>

                {/* En-tête */}
                <div className="mb-6 text-center">
                    <h1 className="mb-2 text-3xl font-bold" style={{ color: '#2b2d42' }}>
                        Créer un compte
                    </h1>
                    <p className="text-sm" style={{ color: '#2b2d42', opacity: 0.7 }}>
                        Commencez avec DigitalArt
                    </p>
                </div>

                {/* Carte principale */}
                <div className="p-6 rounded-xl shadow-lg" style={{
                    border: '1px solid #e9ecef',
                    backgroundColor: 'white'
                }}>
                    {/* Onglets */}
                    <div className="flex gap-2 p-1 mb-6 rounded-lg" style={{ backgroundColor: '#f8f9fa' }}>
                        <button
                            type="button"
                            onClick={() => { setUserType("client"); setFormData({ ...formData, role: "CLIENT" }); }}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-md transition-all"
                            style={{
                                backgroundColor: userType === "client" ? 'white' : 'transparent',
                                color: userType === "client" ? '#4a6fa5' : '#2b2d42',
                                boxShadow: userType === "client" ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                            }}
                        >
                            <UserCircle className="w-5 h-5" />
                            Client
                        </button>
                        <button
                            type="button"
                            onClick={() => { setUserType("artisan"); setFormData({ ...formData, role: "ARTISAN" }); }}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-semibold rounded-md transition-all"
                            style={{
                                backgroundColor: userType === "artisan" ? 'white' : 'transparent',
                                color: userType === "artisan" ? '#4a6fa5' : '#2b2d42',
                                boxShadow: userType === "artisan" ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
                            }}
                        >
                            <Hammer className="w-5 h-5" />
                            Artisan
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* Prénom et Nom sur la même ligne */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-2 text-sm font-bold" style={{ color: '#2b2d42' }}>
                                    Prénom
                                </label>
                                <div className="relative">
                                    <div className="absolute -translate-y-1/2 left-4 top-1/2" style={{ color: '#ff7e5f' }}>
                                        <User className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        name="prenom"
                                        value={formData.prenom}
                                        onChange={handleChange}
                                        placeholder="Jean"
                                        className="w-full h-12 px-4 pl-12 transition-all border-2 rounded-xl focus:outline-none"
                                        style={{
                                            backgroundColor: errors.prenom ? 'rgba(255, 126, 95, 0.05)' : '#f8f9fa',
                                            borderColor: errors.prenom ? '#ff7e5f' : '#e9ecef',
                                            color: '#2b2d42',
                                        }}
                                        onFocus={(e) => !errors.prenom && (e.target.style.borderColor = '#4a6fa5')}
                                        onBlur={(e) => !errors.prenom && (e.target.style.borderColor = '#e9ecef')}
                                    />
                                </div>
                                {errors.prenom && (
                                    <p className="mt-2 text-sm font-semibold" style={{ color: '#ff7e5f' }}>{errors.prenom}</p>
                                )}
                            </div>

                            <div>
                                <label className="block mb-2 text-sm font-bold" style={{ color: '#2b2d42' }}>
                                    Nom
                                </label>
                                <div className="relative">
                                    <div className="absolute -translate-y-1/2 left-4 top-1/2" style={{ color: '#ff7e5f' }}>
                                        <User className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="text"
                                        name="nom"
                                        value={formData.nom}
                                        onChange={handleChange}
                                        placeholder="Dupont"
                                        className="w-full h-12 px-4 pl-12 transition-all border-2 rounded-xl focus:outline-none"
                                        style={{
                                            backgroundColor: errors.nom ? 'rgba(255, 126, 95, 0.05)' : '#f8f9fa',
                                            borderColor: errors.nom ? '#ff7e5f' : '#e9ecef',
                                            color: '#2b2d42',
                                        }}
                                        onFocus={(e) => !errors.nom && (e.target.style.borderColor = '#4a6fa5')}
                                        onBlur={(e) => !errors.nom && (e.target.style.borderColor = '#e9ecef')}
                                    />
                                </div>
                                {errors.nom && (
                                    <p className="mt-2 text-sm font-semibold" style={{ color: '#ff7e5f' }}>{errors.nom}</p>
                                )}
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block mb-2 text-sm font-bold" style={{ color: '#2b2d42' }}>
                                Adresse email
                            </label>
                            <div className="relative">
                                <div className="absolute -translate-y-1/2 left-4 top-1/2" style={{ color: '#ff7e5f' }}>
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="exemple@email.com"
                                    className="w-full h-12 px-4 pl-12 transition-all border-2 rounded-xl focus:outline-none"
                                    style={{
                                        backgroundColor: errors.email ? 'rgba(255, 126, 95, 0.05)' : '#f8f9fa',
                                        borderColor: errors.email ? '#ff7e5f' : '#e9ecef',
                                        color: '#2b2d42',
                                    }}
                                    onFocus={(e) => !errors.email && (e.target.style.borderColor = '#4a6fa5')}
                                    onBlur={(e) => !errors.email && (e.target.style.borderColor = '#e9ecef')}
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-2 text-sm font-semibold" style={{ color: '#ff7e5f' }}>{errors.email}</p>
                            )}
                        </div>

                        {/* Téléphone (artisans) */}
                        {userType === "artisan" && (
                            <div>
                                <label className="block mb-2 text-sm font-bold" style={{ color: '#2b2d42' }}>
                                    Téléphone
                                </label>
                                <div className="relative">
                                    <div className="absolute -translate-y-1/2 left-4 top-1/2" style={{ color: '#ff7e5f' }}>
                                        <Phone className="w-5 h-5" />
                                    </div>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+229 XX XX XX XX"
                                        className="w-full h-12 px-4 pl-12 transition-all border-2 rounded-xl focus:outline-none"
                                        style={{
                                            backgroundColor: errors.phone ? 'rgba(255, 126, 95, 0.05)' : '#f8f9fa',
                                            borderColor: errors.phone ? '#ff7e5f' : '#e9ecef',
                                            color: '#2b2d42',
                                        }}
                                        onFocus={(e) => !errors.phone && (e.target.style.borderColor = '#4a6fa5')}
                                        onBlur={(e) => !errors.phone && (e.target.style.borderColor = '#e9ecef')}
                                    />
                                </div>
                                {errors.phone && (
                                    <p className="mt-2 text-sm font-semibold" style={{ color: '#ff7e5f' }}>{errors.phone}</p>
                                )}
                            </div>
                        )}

                        {/* Domaine (artisans) */}
                        {userType === "artisan" && (
                            <div>
                                <label className="block mb-2 text-sm font-bold" style={{ color: '#2b2d42' }}>
                                    Domaine d'activité
                                </label>

                                {!showNewDomainInput ? (
                                    <div className="space-y-2">
                                        <div className="relative">
                                            <div className="absolute -translate-y-1/2 left-4 top-1/2" style={{ color: '#ff7e5f' }}>
                                                <Briefcase className="w-5 h-5" />
                                            </div>
                                            <select
                                                name="domain"
                                                value={formData.domain}
                                                onChange={handleChange}
                                                className="w-full h-12 px-4 pl-12 transition-all border-2 rounded-xl focus:outline-none"
                                                style={{
                                                    backgroundColor: errors.domain ? 'rgba(255, 126, 95, 0.05)' : '#f8f9fa',
                                                    borderColor: errors.domain ? '#ff7e5f' : '#e9ecef',
                                                    color: '#2b2d42',
                                                }}
                                                onFocus={(e) => !errors.domain && (e.target.style.borderColor = '#4a6fa5')}
                                                onBlur={(e) => !errors.domain && (e.target.style.borderColor = '#e9ecef')}
                                            >
                                                <option value="">Choisir un domaine</option>
                                                {Object.keys(domainsData).map(domain => (
                                                    <option key={domain} value={domain}>{domain}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setShowNewDomainInput(true)}
                                            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all hover:opacity-80"
                                            style={{
                                                backgroundColor: 'rgba(74, 111, 165, 0.1)',
                                                color: '#4a6fa5',
                                            }}
                                        >
                                            <Plus className="w-4 h-4" />
                                            Ajouter un nouveau domaine
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <div className="absolute -translate-y-1/2 left-4 top-1/2" style={{ color: '#ff7e5f' }}>
                                                <Briefcase className="w-5 h-5" />
                                            </div>
                                            <input
                                                type="text"
                                                value={newDomain}
                                                onChange={(e) => setNewDomain(e.target.value)}
                                                placeholder="Nom du nouveau domaine"
                                                className="w-full h-12 px-4 pl-12 transition-all border-2 rounded-xl focus:outline-none"
                                                style={{
                                                    backgroundColor: '#f8f9fa',
                                                    borderColor: '#4a6fa5',
                                                    color: '#2b2d42',
                                                }}
                                                onKeyPress={(e) => e.key === 'Enter' && handleAddDomain()}
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleAddDomain}
                                            className="h-12 px-4 font-semibold text-white rounded-xl transition-all hover:opacity-90"
                                            style={{ backgroundColor: '#4a6fa5' }}
                                        >
                                            <Check className="w-5 h-5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => { setShowNewDomainInput(false); setNewDomain(""); }}
                                            className="h-12 px-4 font-semibold rounded-xl transition-all hover:opacity-90"
                                            style={{ backgroundColor: '#e9ecef', color: '#2b2d42' }}
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                )}

                                {errors.domain && (
                                    <p className="mt-2 text-sm font-semibold" style={{ color: '#ff7e5f' }}>{errors.domain}</p>
                                )}
                            </div>
                        )}

                        {/* Spécialité (artisans) */}
                        {userType === "artisan" && formData.domain && (
                            <div>
                                <label className="block mb-2 text-sm font-bold" style={{ color: '#2b2d42' }}>
                                    Spécialité
                                </label>
                                <div className="relative">
                                    <div className="absolute -translate-y-1/2 left-4 top-1/2" style={{ color: '#ff7e5f' }}>
                                        <Briefcase className="w-5 h-5" />
                                    </div>
                                    <select
                                        name="specialty"
                                        value={formData.specialty}
                                        onChange={handleChange}
                                        className="w-full h-12 px-4 pl-12 transition-all border-2 rounded-xl focus:outline-none"
                                        style={{
                                            backgroundColor: errors.specialty ? 'rgba(255, 126, 95, 0.05)' : '#f8f9fa',
                                            borderColor: errors.specialty ? '#ff7e5f' : '#e9ecef',
                                            color: '#2b2d42',
                                        }}
                                        onFocus={(e) => !errors.specialty && (e.target.style.borderColor = '#4a6fa5')}
                                        onBlur={(e) => !errors.specialty && (e.target.style.borderColor = '#e9ecef')}
                                    >
                                        <option value="">Choisir une spécialité</option>
                                        {availableSpecialties.length > 0 ? (
                                            availableSpecialties.map(spec => (
                                                <option key={spec} value={spec}>{spec}</option>
                                            ))
                                        ) : (
                                            <option value="general">Généraliste</option>
                                        )}
                                    </select>
                                </div>
                                {errors.specialty && (
                                    <p className="mt-2 text-sm font-semibold" style={{ color: '#ff7e5f' }}>{errors.specialty}</p>
                                )}
                            </div>
                        )}

                        {/* Mot de passe */}
                        <div>
                            <label className="block mb-2 text-sm font-bold" style={{ color: '#2b2d42' }}>
                                Mot de passe
                            </label>
                            <div className="relative">
                                <div className="absolute -translate-y-1/2 left-4 top-1/2" style={{ color: '#ff7e5f' }}>
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full h-12 px-4 pl-12 pr-12 transition-all border-2 rounded-xl focus:outline-none"
                                    style={{
                                        backgroundColor: errors.password ? 'rgba(255, 126, 95, 0.05)' : '#f8f9fa',
                                        borderColor: errors.password ? '#ff7e5f' : '#e9ecef',
                                        color: '#2b2d42',
                                    }}
                                    onFocus={(e) => !errors.password && (e.target.style.borderColor = '#4a6fa5')}
                                    onBlur={(e) => !errors.password && (e.target.style.borderColor = '#e9ecef')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute -translate-y-1/2 right-4 top-1/2"
                                    style={{ color: '#4a6fa5' }}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-2 text-sm font-semibold" style={{ color: '#ff7e5f' }}>{errors.password}</p>
                            )}
                        </div>

                        {/* Confirmer mot de passe */}
                        <div>
                            <label className="block mb-2 text-sm font-bold" style={{ color: '#2b2d42' }}>
                                Confirmer le mot de passe
                            </label>
                            <div className="relative">
                                <div className="absolute -translate-y-1/2 left-4 top-1/2" style={{ color: '#ff7e5f' }}>
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="password_confirmation"
                                    value={formData.password_confirmation}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full h-12 px-4 pl-12 pr-12 transition-all border-2 rounded-xl focus:outline-none"
                                    style={{
                                        backgroundColor: errors.password_confirmation ? 'rgba(255, 126, 95, 0.05)' : '#f8f9fa',
                                        borderColor: errors.password_confirmation ? '#ff7e5f' : '#e9ecef',
                                        color: '#2b2d42',
                                    }}
                                    onFocus={(e) => !errors.password_confirmation && (e.target.style.borderColor = '#4a6fa5')}
                                    onBlur={(e) => !errors.password_confirmation && (e.target.style.borderColor = '#e9ecef')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute -translate-y-1/2 right-4 top-1/2"
                                    style={{ color: '#4a6fa5' }}
                                >
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.password_confirmation && (
                                <p className="mt-2 text-sm font-semibold" style={{ color: '#ff7e5f' }}>{errors.password_confirmation}</p>
                            )}
                        </div>

                        {/* Conditions */}
                        <div>
                            <label className="flex items-start gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="acceptTerms"
                                    checked={formData.acceptTerms}
                                    onChange={handleChange}
                                    className="w-4 h-4 mt-1 rounded cursor-pointer"
                                    style={{ accentColor: '#4a6fa5' }}
                                />
                                <span className="text-sm" style={{ color: '#2b2d42' }}>
                                    J'accepte les{' '}
                                    <a href="#" className="font-bold" style={{ color: '#4a6fa5' }}>
                                        conditions d'utilisation
                                    </a>
                                </span>
                            </label>
                            {errors.acceptTerms && (
                                <p className="mt-2 text-sm font-semibold" style={{ color: '#ff7e5f' }}>{errors.acceptTerms}</p>
                            )}
                        </div>

                        {/* Bouton submit */}
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
                                    Inscription...
                                </div>
                            ) : (
                                userType === "client" ? "Créer mon compte client" : "Créer mon compte artisan"
                            )}
                        </button>
                    </div>

                    {/* Lien connexion */}
                    <div className="pt-4 mt-6 text-center border-t" style={{ borderColor: '#e9ecef' }}>
                        <p className="text-sm" style={{ color: '#2b2d42', opacity: 0.7 }}>
                            Déjà un compte ?{' '}
                            <a
                                href="#"
                                className="font-semibold transition-all hover:underline"
                                style={{ color: '#ff7e5f' }}
                            >
                                Se connecter
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}