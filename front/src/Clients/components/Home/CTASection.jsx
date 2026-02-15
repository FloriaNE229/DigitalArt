import { CheckCircle, Shield, Star, Users, Clock, TrendingUp, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CTASection() {
  const navigate = useNavigate();

  const handleCreateWorkshop = () => {
    // Pour l'instant, on redirige vers register en mode artisan
    // Plus tard, on pourra vérifier si l'utilisateur est connecté
    // et le rediriger soit vers register soit vers la page de création d'atelier
    navigate('/register?type=artisan');
  };

  return (
    <section className="relative py-20 overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--gray) 0%, var(--light) 50%, var(--gray) 100%)' }}>
      <div className="relative w-full max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-semibold rounded-full" style={{ backgroundColor: 'rgba(255, 126, 95, 0.1)', color: '#ff7e5f' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#ff7e5f' }}></span>
            Pour les artisans
          </div>

          <h2 className="mb-6 text-4xl font-black leading-tight md:text-5xl lg:text-6xl" style={{ color: 'var(--dark)' }}>
            Développez votre activité
            <br />
            <span className="text-transparent bg-gradient-to-r from-[#ff7e5f] to-[#ff6b4a] bg-clip-text" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              avec DigitalArt
            </span>
          </h2>

          <p className="max-w-2xl mx-auto mb-10 text-lg md:text-xl" style={{ color: 'var(--dark)', opacity: 0.7 }}>
            Rejoignez notre communauté d'artisans qualifiés et multipliez vos opportunités d'affaires.
          </p>

          <div className="flex items-center justify-center mb-16">
            <button 
              onClick={handleCreateWorkshop}
              className="flex items-center justify-center gap-2 px-8 py-3 text-sm font-bold text-white transition-all shadow-md rounded-xl hover:shadow-lg group" 
              style={{ background: 'linear-gradient(135deg, #ff7e5f, #ff6b4a)' }}
            >
              Créer mon atelier
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 mt-20 md:grid-cols-3">
            <div className="p-8 bg-white shadow-xl rounded-2xl" style={{ border: '1px solid var(--gray-dark)' }}>
              <div className="inline-flex items-center justify-center w-12 h-12 mb-6 rounded-xl" style={{ backgroundColor: 'rgba(255, 126, 95, 0.1)' }}>
                <div className="text-2xl font-bold" style={{ color: '#ff7e5f' }}>0€</div>
              </div>
              <h3 className="mb-3 text-xl font-bold" style={{ color: 'var(--dark)' }}>Inscription gratuite</h3>
              <p className="text-sm" style={{ color: 'var(--dark)', opacity: 0.6 }}>
                Créez votre profil professionnel sans frais initiaux
              </p>
            </div>

            <div className="p-8 bg-white shadow-xl rounded-2xl" style={{ border: '1px solid var(--gray-dark)' }}>
              <div className="inline-flex items-center justify-center w-12 h-12 mb-6 rounded-xl" style={{ backgroundColor: 'rgba(255, 126, 95, 0.1)' }}>
                <Clock className="w-6 h-6" style={{ color: '#ff7e5f' }} />
              </div>
              <h3 className="mb-3 text-xl font-bold" style={{ color: 'var(--dark)' }}>Support 24/7</h3>
              <p className="text-sm" style={{ color: 'var(--dark)', opacity: 0.6 }}>
                Assistance technique et client disponible en permanence
              </p>
            </div>

            <div className="p-8 bg-white shadow-xl rounded-2xl" style={{ border: '1px solid var(--gray-dark)' }}>
              <div className="inline-flex items-center justify-center w-12 h-12 mb-6 rounded-xl" style={{ backgroundColor: 'rgba(255, 126, 95, 0.1)' }}>
                <TrendingUp className="w-6 h-6" style={{ color: '#ff7e5f' }} />
              </div>
              <h3 className="mb-3 text-xl font-bold" style={{ color: 'var(--dark)' }}>+30% clients</h3>
              <p className="text-sm" style={{ color: 'var(--dark)', opacity: 0.6 }}>
                Augmentation moyenne du nombre de clients pour nos artisans
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 mt-16 text-sm" style={{ color: 'var(--dark)' }}>
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5" style={{ color: '#ff7e5f' }} />
              <span>Profil professionnel</span>
            </div>
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5" style={{ color: '#ff7e5f' }} />
              <span>Garantie satisfait ou remboursé</span>
            </div>
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5" style={{ color: '#ff7e5f' }} />
              <span>Système d'avis vérifiés</span>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5" style={{ color: '#ff7e5f' }} />
              <span>Communauté active</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}