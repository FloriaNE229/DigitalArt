import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Check, Briefcase, Phone, UserCircle, Hammer } from "lucide-react";

const Register = () => {
  const [searchParams] = useSearchParams();
  
  // Initialiser directement userType avec la valeur de l'URL (lazy initialization)
  const [userType, setUserType] = useState(() => {
    const type = searchParams.get('type');
    return type === 'artisan' ? 'artisan' : 'client';
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialty: "",
    acceptTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Register:", { ...formData, userType });
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="w-full max-w-sm mx-auto">
        
        <div className="mb-3 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full" style={{ 
            backgroundColor: 'rgba(74, 111, 165, 0.1)', 
            color: '#4a6fa5',
            border: '1px solid rgba(74, 111, 165, 0.2)'
          }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: '#ff7e5f' }}></span>
            Rejoignez notre communauté
          </span>
        </div>

        <div className="mb-4 text-center">
          <h1 className="mb-1 text-xl font-bold" style={{ color: '#2b2d42' }}>
            Créer un compte
          </h1>
          <p className="text-xs" style={{ color: '#2b2d42', opacity: 0.7 }}>
            Commencez avec DigitalArt
          </p>
        </div>

        <div className="p-5 rounded-lg shadow-md" style={{ 
          border: '1px solid #e9ecef',
          backgroundColor: 'white'
        }}>
          {/* Onglets Client / Artisan */}
          <div className="flex gap-2 p-1 mb-5 rounded-lg" style={{ backgroundColor: '#f8f9fa' }}>
            <button
              type="button"
              onClick={() => setUserType("client")}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-md transition-all"
              style={{
                backgroundColor: userType === "client" ? 'white' : 'transparent',
                color: userType === "client" ? '#4a6fa5' : '#2b2d42',
                boxShadow: userType === "client" ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <UserCircle className="w-4 h-4" />
              Client
            </button>
            <button
              type="button"
              onClick={() => setUserType("artisan")}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold rounded-md transition-all"
              style={{
                backgroundColor: userType === "artisan" ? 'white' : 'transparent',
                color: userType === "artisan" ? '#4a6fa5' : '#2b2d42',
                boxShadow: userType === "artisan" ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
              }}
            >
              <Hammer className="w-4 h-4" />
              Artisan
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Nom complet */}
            <div className="mb-3">
              <label className="block mb-1.5 text-xs font-medium" style={{ color: '#2b2d42' }}>
                Nom complet
              </label>
              <div className="relative">
                <User className="absolute w-4 h-4 -translate-y-1/2 left-2.5 top-1/2" style={{ color: '#ff7e5f' }} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nom et prénoms"
                  className="w-full py-2 pr-3 text-xs transition-all border rounded-md outline-none pl-9 focus:ring-2"
                  style={{ 
                    borderColor: '#e9ecef',
                    backgroundColor: '#f8f9fa',
                    color: '#2b2d42'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4a6fa5'}
                  onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="block mb-1.5 text-xs font-medium" style={{ color: '#2b2d42' }}>
                Adresse email
              </label>
              <div className="relative">
                <Mail className="absolute w-4 h-4 -translate-y-1/2 left-2.5 top-1/2" style={{ color: '#ff7e5f' }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="exemple@email.com"
                  className="w-full py-2 pr-3 text-xs transition-all border rounded-md outline-none pl-9 focus:ring-2"
                  style={{ 
                    borderColor: '#e9ecef',
                    backgroundColor: '#f8f9fa',
                    color: '#2b2d42'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4a6fa5'}
                  onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                  required
                />
              </div>
            </div>

            {/* Téléphone (pour les artisans) */}
            {userType === "artisan" && (
              <div className="mb-3">
                <label className="block mb-1.5 text-xs font-medium" style={{ color: '#2b2d42' }}>
                  Téléphone
                </label>
                <div className="relative">
                  <Phone className="absolute w-4 h-4 -translate-y-1/2 left-2.5 top-1/2" style={{ color: '#ff7e5f' }} />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+229 XX XX XX XX"
                    className="w-full py-2 pr-3 text-xs transition-all border rounded-md outline-none pl-9 focus:ring-2"
                    style={{ 
                      borderColor: '#e9ecef',
                      backgroundColor: '#f8f9fa',
                      color: '#2b2d42'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#4a6fa5'}
                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    required
                  />
                </div>
              </div>
            )}

            {/* Spécialité (pour les artisans) */}
            {userType === "artisan" && (
              <div className="mb-3">
                <label className="block mb-1.5 text-xs font-medium" style={{ color: '#2b2d42' }}>
                  Spécialité
                </label>
                <div className="relative">
                  <Briefcase className="absolute w-4 h-4 -translate-y-1/2 left-2.5 top-1/2" style={{ color: '#ff7e5f' }} />
                  <select
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                    className="w-full py-2 pr-3 text-xs transition-all border rounded-md outline-none pl-9 focus:ring-2"
                    style={{ 
                      borderColor: '#e9ecef',
                      backgroundColor: '#f8f9fa',
                      color: '#2b2d42'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#4a6fa5'}
                    onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                    required
                  >
                    <option value="">Choisir une spécialité</option>
                    <option value="plomberie">Plomberie</option>
                    <option value="electricite">Électricité</option>
                    <option value="menuiserie">Menuiserie</option>
                    <option value="maconnerie">Maçonnerie</option>
                    <option value="peinture">Peinture</option>
                    <option value="climatisation">Climatisation</option>
                    <option value="carrelage">Carrelage</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>
              </div>
            )}

            {/* Mot de passe */}
            <div className="mb-3">
              <label className="block mb-1.5 text-xs font-medium" style={{ color: '#2b2d42' }}>
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute w-4 h-4 -translate-y-1/2 left-2.5 top-1/2" style={{ color: '#ff7e5f' }} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full py-2 text-xs transition-all border rounded-md outline-none pl-9 pr-9 focus:ring-2"
                  style={{ 
                    borderColor: '#e9ecef',
                    backgroundColor: '#f8f9fa',
                    color: '#2b2d42'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4a6fa5'}
                  onBlur={(e) => e.target.style.borderColor = '#e9ecef'}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute -translate-y-1/2 right-2.5 top-1/2 hover:opacity-70 transition-all"
                  style={{ color: '#6b8cba' }}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Conditions */}
            <label className="flex items-start gap-2 mb-4 cursor-pointer group">
              <div className="relative mt-0.5">
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                  className="sr-only"
                  required
                />
                <div className="flex items-center justify-center w-4 h-4 transition-all border-2 rounded group-hover:border-opacity-80"
                  style={{ 
                    borderColor: formData.acceptTerms ? '#4a6fa5' : '#e9ecef',
                    backgroundColor: formData.acceptTerms ? '#4a6fa5' : 'white'
                  }}
                >
                  {formData.acceptTerms && <Check className="w-3 h-3" style={{ color: 'white' }} />}
                </div>
              </div>
              <span className="text-xs leading-relaxed" style={{ color: '#2b2d42', opacity: 0.7 }}>
                J'accepte les conditions d'utilisation
              </span>
            </label>

            {/* Bouton */}
            <button 
              type="submit" 
              className="w-full py-2 text-xs font-semibold text-white rounded-md transition-all hover:shadow-lg hover:scale-[1.02]"
              style={{ 
                background: 'linear-gradient(135deg, #4a6fa5, #3a5784)'
              }}
            >
              {userType === "client" ? "Créer mon compte client" : "Créer mon compte artisan"}
            </button>
          </form>

          {/* Lien connexion */}
          <div className="pt-3 mt-4 text-center border-t" style={{ borderColor: '#e9ecef' }}>
            <p className="text-xs" style={{ color: '#2b2d42', opacity: 0.7 }}>
              Déjà un compte ?{" "}
              <Link 
                to="/login" 
                className="font-semibold transition-all hover:underline"
                style={{ color: '#ff7e5f' }}
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;