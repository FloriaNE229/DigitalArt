import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Input from '../Common/Input';
import Button from '../Common/Button';

export default function LoginForm() {
  const navigate = useNavigate();
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
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    
    try {
      // TODO: Remplacer par appel API Laravel
      // const response = await fetch('http://localhost:8000/api/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(formData)
      // });
      
      setTimeout(() => {
        console.log('Connexion:', formData);
        setLoading(false);
        navigate('/');
      }, 1500);
      
    } catch (error) {
      setLoading(false);
      setErrors({ submit: 'Erreur de connexion' });
      console.error('Login error:', error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto"  >
      <div className="p-8 bg-white shadow-2xl rounded-2xl" style={{ border: '1px solid var(--gray-dark)' }}>
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-black" style={{ color: 'var(--dark)' }}>
            Connexion
          </h2>
          <p className="text-sm" style={{ color: 'var(--dark)', opacity: 0.6 }}>
            Accédez à votre compte ArtisanConnect
          </p>
        </div>

        {errors.submit && (
          <div className="p-4 mb-6 rounded-xl" style={{ backgroundColor: 'rgba(255, 126, 95, 0.1)', borderLeft: '4px solid var(--accent)' }}>
            <p className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>{errors.submit}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            icon={Mail}
            placeholder="exemple@email.com"
            error={errors.email}
          />

          <div>
            <label className="block mb-2 text-sm font-bold" style={{ color: 'var(--dark)' }}>
              Mot de passe
            </label>
            <div className="relative">
              <div className="absolute -translate-y-1/2 left-4 top-1/2" style={{ color: 'var(--primary-light)' }}>
                <Lock className="w-5 h-5" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full h-12 px-4 pl-12 pr-12 transition-all border-2 rounded-xl focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: errors.password ? 'rgba(255, 126, 95, 0.05)' : 'var(--gray)',
                  borderColor: errors.password ? 'var(--accent)' : 'var(--gray-dark)',
                  color: 'var(--dark)',
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute -translate-y-1/2 right-4 top-1/2"
                style={{ color: 'var(--primary-light)' }}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-2 text-sm font-semibold" style={{ color: 'var(--accent)' }}>{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                className="w-4 h-4 rounded cursor-pointer"
                style={{ accentColor: 'var(--primary)' }}
              />
              <span className="text-sm font-medium" style={{ color: 'var(--dark)' }}>
                Se souvenir de moi
              </span>
            </label>
            <Link to="/forgot-password" className="text-sm font-bold" style={{ color: 'var(--primary)' }}>
              Mot de passe oublié ?
            </Link>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin"></div>
                Connexion...
              </div>
            ) : 'Se connecter'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm" style={{ color: 'var(--dark)', opacity: 0.7 }}>
            Pas encore de compte ?{' '}
            <Link to="/register" className="font-bold" style={{ color: 'var(--primary)' }}>
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}