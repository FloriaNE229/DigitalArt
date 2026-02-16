import { useNavigate } from 'react-router-dom';

export default function SearchSection() {
  const navigate = useNavigate();

  return (
    <section className="relative py-16">
      <div className="w-full max-w-5xl px-4 mx-auto">
        <div className="p-8 shadow-2xl bg-gradient-to-br from-white to-gray-50 rounded-2xl md:p-12" style={{ border: '1px solid var(--gray-dark)' }}>
          <div className="max-w-3xl mx-auto mb-10 text-center">
            <h2 className="mb-6 text-3xl font-black md:text-4xl" style={{ color: 'var(--dark)' }}>
              Trouvez votre artisan
              <span className="text-transparent bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text" style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {' '}en quelques clics
              </span>
            </h2>
            <p className="mb-8 text-lg" style={{ color: 'var(--dark)', opacity: 0.7 }}>
              Recherchez parmi des milliers de professionnels qualifiés
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <button
              onClick={() => navigate('/artisans?category=plomberie')}
              className="px-6 py-3 text-sm font-semibold transition-all rounded-full cursor-pointer md:text-base hover:scale-105 hover:shadow-md"
              style={{ backgroundColor: 'rgba(255, 126, 95, 0.1)', color: '#ff7e5f' }}
            >
              Plombiers
            </button>
            <button
              onClick={() => navigate('/artisans?category=electricite')}
              className="px-6 py-3 text-sm font-semibold transition-all rounded-full cursor-pointer md:text-base hover:scale-105 hover:shadow-md"
              style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)' }}
            >
              Électriciens
            </button>
            <button
              onClick={() => navigate('/artisans?category=menuiserie')}
              className="px-6 py-3 text-sm font-semibold transition-all rounded-full cursor-pointer md:text-base hover:scale-105 hover:shadow-md"
              style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', color: 'green' }}
            >
              Menuisiers
            </button>
            <button
              onClick={() => navigate('/artisans?category=peinture')}
              className="px-6 py-3 text-sm font-semibold transition-all rounded-full cursor-pointer md:text-base hover:scale-105 hover:shadow-md"
              style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', color: 'purple' }}
            >
              Peintres
            </button>
            <button
              onClick={() => navigate('/artisans?category=maconnerie')}
              className="px-6 py-3 text-sm font-semibold transition-all rounded-full cursor-pointer md:text-base hover:scale-105 hover:shadow-md"
              style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'orange' }}
            >
              Maçons
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}