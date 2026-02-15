import { Star, MapPin, Users, Wrench, Zap, Hammer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FeaturedArtisans() {
  const navigate = useNavigate();

  const artisans = [
    {
      name: 'Floriane',
      profession: 'Plombier',
      rating: 4.9,
      reviews: 127,
      location: 'Cotonou',
      icon: Wrench
    },
    {
      name: 'Floriane',
      profession: 'Électricienne',
      rating: 4.8,
      reviews: 89,
      location: 'Porto-Novo',
      icon: Zap
    },
    {
      name: 'Floriane',
      profession: 'Menuisier',
      rating: 5.0,
      reviews: 156,
      location: 'Parakou',
      icon: Hammer
    }
  ];

  return (
    <section className="relative py-20" style={{ backgroundColor: 'var(--light)' }}>
      <div className="w-full max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-semibold rounded-full" style={{ backgroundColor: 'rgba(255, 126, 95, 0.1)', color: '#ff7e5f' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#ff7e5f' }}></span>
            Excellence
          </div>

          <h2 className="mb-6 text-4xl font-black leading-tight md:text-5xl" style={{ color: 'var(--dark)' }}>
            Artisans
            <span className="text-transparent bg-gradient-to-r from-[#ff7e5f] to-[#ff6b4a] bg-clip-text" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {' '}en vedette
            </span>
          </h2>

          <p className="max-w-2xl mx-auto mb-12 text-lg md:text-xl" style={{ color: 'var(--dark)', opacity: 0.7 }}>
            Découvrez nos meilleurs professionnels certifiés
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {artisans.map((artisan, index) => (
            <div 
              key={index} 
              className="relative overflow-hidden transition-all duration-300 bg-white shadow-xl group rounded-2xl hover:shadow-2xl hover:-translate-y-2"
              style={{ border: '1px solid var(--gray-dark)' }}
            >
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className={`p-4 rounded-2xl ${index === 0 ? 'bg-gradient-to-br from-blue-500 to-blue-600' : index === 1 ? 'bg-gradient-to-br from-[#ff7e5f] to-[#ff6b4a]' : 'bg-gradient-to-br from-green-500 to-green-600'}`}>
                        <artisan.icon className="w-6 h-6 text-white" />
                      </div>
                      {/* Placeholder pour photo */}
                      <div className="absolute flex items-center justify-center w-10 h-10 text-xs text-gray-500 bg-gray-200 border-2 border-white rounded-full -bottom-2 -right-2">
                        Photo
                      </div>
                    </div>
                    <div>
                      <h3 className="mb-1 text-xl font-bold" style={{ color: 'var(--dark)' }}>{artisan.name}</h3>
                      <p className="text-sm font-semibold" style={{ color: '#ff7e5f' }}>{artisan.profession}</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 text-xs font-bold text-white rounded-full" style={{ backgroundColor: '#ff7e5f' }}>
                    TOP {index + 1}
                  </div>
                </div>

                <div className="mb-6 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(artisan.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-bold" style={{ color: 'var(--dark)' }}>{artisan.rating}</span>
                    <span className="text-xs" style={{ color: 'var(--dark)', opacity: 0.6 }}>({artisan.reviews} avis)</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--dark)', opacity: 0.8 }}>
                    <MapPin className="w-4 h-4" />
                    <span>{artisan.location}</span>
                  </div>
                </div>

                <button className="w-full py-3 text-sm font-bold text-white transition-all rounded-xl hover:shadow-lg" 
                        style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))' }}>
                  Contacter l'artisan
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center max-w-2xl gap-6 p-8 mx-auto mt-16 bg-white shadow-xl sm:flex-row rounded-2xl" style={{ border: '1px solid var(--gray-dark)' }}>
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl" style={{ backgroundColor: 'rgba(255, 126, 95, 0.1)' }}>
              <Users className="w-6 h-6" style={{ color: '#ff7e5f' }} />
            </div>
            <div>
              <h3 className="mb-1 text-lg font-bold" style={{ color: 'var(--dark)' }}>Rejoindre notre réseau ?</h3>
              <p className="text-sm" style={{ color: 'var(--dark)', opacity: 0.7 }}>
                Devenez artisan certifié DigitalArt
              </p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/register?type=artisan')}
            className="w-full px-6 py-3 text-sm font-bold text-white transition-all shadow-md sm:w-auto rounded-xl whitespace-nowrap hover:shadow-lg" 
            style={{ background: 'linear-gradient(135deg, #ff7e5f, #ff6b4a)' }}
          >
            Devenir artisan
          </button>
        </div>
      </div>
    </section>
  );
}