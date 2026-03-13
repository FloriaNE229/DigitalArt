import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { value: 'Plomberie',   label: 'Plombiers',    color: '#ff7e5f', bg: 'rgba(255, 126, 95, 0.1)'  },
  { value: 'Électricité', label: 'Électriciens', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)'  },
  { value: 'Menuiserie',  label: 'Menuisiers',   color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)'   },
  { value: 'Peinture',    label: 'Peintres',     color: '#a855f7', bg: 'rgba(168, 85, 247, 0.1)'  },
  { value: 'Maçonnerie',  label: 'Maçons',       color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)'  },
  { value: 'Couture',     label: 'Couturiers',   color: '#ec4899', bg: 'rgba(236, 72, 153, 0.1)'  },
  { value: 'Coiffure',    label: 'Coiffeurs',    color: '#14b8a6', bg: 'rgba(20, 184, 166, 0.1)'  },
  { value: 'Mécanique',   label: 'Mécaniciens',  color: '#64748b', bg: 'rgba(100, 116, 139, 0.1)' },
];

export default function SearchSection() {
  const navigate = useNavigate();
  const [counts,  setCounts]  = useState({});
  const [total,   setTotal]   = useState(null);
  const [loading, setLoading] = useState(true);

  // ── GET /ateliers (pour récupérer le total et les domaines) ──
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const BASE  = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
        const token = localStorage.getItem('token');

        // Charge tous les ateliers (sans pagination) pour les compteurs
        const res  = await fetch(`${BASE}/ateliers?par_page=999`, {
          headers: {
            Accept: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) return;
        const json = await res.json();
        const list = json.data ?? json ?? [];

        setTotal(json.total ?? list.length);

        // Compte par domaine
        const c = {};
        list.forEach(a => {
          const d = a.domaine;
          if (d) c[d] = (c[d] ?? 0) + 1;
        });
        setCounts(c);
      } catch { /* silencieux — les compteurs sont optionnels */ }
      finally { setLoading(false); }
    };
    fetchStats();
  }, []);

  return (
    <section className="relative py-16">
      <div className="w-full max-w-5xl px-4 mx-auto">
        <div className="p-8 shadow-2xl bg-gradient-to-br from-white to-gray-50 rounded-2xl md:p-12"
          style={{ border: '1px solid var(--gray-dark)' }}>

          <div className="max-w-3xl mx-auto mb-10 text-center">
            <h2 className="mb-6 text-3xl font-black md:text-4xl" style={{ color: 'var(--dark)' }}>
              Trouvez votre artisan
              <span className="text-transparent bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text"
                style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                {' '}en quelques clics
              </span>
            </h2>
            <p className="text-lg" style={{ color: 'var(--dark)', opacity: 0.7 }}>
              {loading
                ? 'Chargement des professionnels…'
                : total !== null
                  ? `Recherchez parmi ${total.toLocaleString('fr-FR')} professionnel${total > 1 ? 's' : ''} qualifié${total > 1 ? 's' : ''}`
                  : 'Recherchez parmi des milliers de professionnels qualifiés'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {CATEGORIES.map(({ value, label, color, bg }) => {
              const count = counts[value];
              return (
                <button
                  key={value}
                  onClick={() => navigate(`/artisans?category=${encodeURIComponent(value)}`)}
                  className="relative px-6 py-3 text-sm font-semibold transition-all rounded-full cursor-pointer md:text-base hover:scale-105 hover:shadow-md"
                  style={{ backgroundColor: bg, color }}>
                  {label}
                  {!loading && count != null && (
                    <span className="ml-2 text-xs font-bold opacity-70">({count})</span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Lien vers la liste complète */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/artisans')}
              className="text-sm font-bold transition-all hover:no-underline"
              style={{ color: 'var(--primary)' }}>
              Voir tous les artisans →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}