import { Search, Calendar, Star, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function HowItWorks() {
  const navigate = useNavigate();

  const steps = [
    {
      icon: Search,
      title: 'Recherchez',
      description: 'Trouvez l\'artisan parfait selon vos besoins et localisation',
      color: 'bg-gradient-to-br from-blue-500 to-blue-600',
      borderColor: 'border-blue-200',
      bgColor: 'rgba(59, 130, 246, 0.1)'
    },
    {
      icon: Calendar,
      title: 'Réservez',
      description: 'Prenez rendez-vous en ligne en quelques clics, sans attente',
      color: 'bg-gradient-to-br from-[#ff7e5f] to-[#ff6b4a]',
      borderColor: 'border-orange-200',
      bgColor: 'rgba(255, 126, 95, 0.1)'
    },
    {
      icon: Star,
      title: 'Évaluez',
      description: 'Partagez votre expérience et aidez la communauté',
      color: 'bg-gradient-to-br from-green-500 to-green-600',
      borderColor: 'border-green-200',
      bgColor: 'rgba(34, 197, 94, 0.1)'
    }
  ];

  return (
    <section className="relative py-20" style={{ backgroundColor: 'var(--light)' }}>
      <div className="w-full max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-semibold rounded-full" style={{ backgroundColor: 'rgba(74, 111, 165, 0.1)', color: 'var(--primary)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)' }}></span>
            Fonctionnement
          </div>

          <h2 className="mb-6 text-4xl font-black leading-tight md:text-5xl" style={{ color: 'var(--dark)' }}>
            Comment
            <span className="text-transparent bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {' '}ça marche ?
            </span>
          </h2>

          <p className="max-w-2xl mx-auto mb-12 text-lg md:text-xl" style={{ color: 'var(--dark)', opacity: 0.7 }}>
            Trois étapes simples pour connecter artisans et clients
          </p>
        </div>

        <div className="relative">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={index} className="relative group">
                <div 
                  className="relative h-full p-8 transition-all duration-300 bg-white shadow-xl rounded-2xl hover:shadow-2xl hover:-translate-y-2"
                  style={{ border: '1px solid var(--gray-dark)' }}
                >
                  <div className="absolute -top-6 left-8">
                    <div className="relative">
                      <div className={`w-14 h-14 ${step.color} rounded-2xl shadow-lg flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}>
                        <step.icon className="text-white w-7 h-7" strokeWidth={2} />
                      </div>
                      <div className="absolute flex items-center justify-center w-8 h-8 text-xs font-bold text-white rounded-full -top-2 -right-2" style={{ backgroundColor: '#ff7e5f' }}>
                        {index + 1}
                      </div>
                    </div>
                  </div>

                  <div className="pt-8">
                    <h3 className="mb-3 text-xl font-bold" style={{ color: 'var(--dark)' }}>
                      {step.title}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--dark)', opacity: 0.7 }}>
                      {step.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t" style={{ borderColor: 'var(--gray-dark)' }}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold" style={{ color: 'var(--dark)', opacity: 0.5 }}>
                        Étape {index + 1}/3
                      </span>
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" style={{ color: '#ff7e5f' }} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center max-w-2xl gap-6 p-8 mx-auto mt-16 bg-white shadow-xl sm:flex-row rounded-2xl" style={{ border: '1px solid var(--gray-dark)' }}>
          <div className="text-center sm:text-left">
            <h3 className="mb-2 text-xl font-bold" style={{ color: 'var(--dark)' }}>Prêt à commencer ?</h3>
            <p className="text-sm" style={{ color: 'var(--dark)', opacity: 0.7 }}>
              Rejoignez des milliers de clients satisfaits
            </p>
          </div>
          <button 
            onClick={() => navigate('/artisans')}
            className="w-full px-6 py-3 text-sm font-bold text-white transition-all shadow-md sm:w-auto rounded-xl whitespace-nowrap hover:shadow-lg" 
            style={{ background: 'linear-gradient(135deg, #ff7e5f, #ff6b4a)' }}
          >
            Trouver un artisan
          </button>
        </div>
      </div>
    </section>
  );
}