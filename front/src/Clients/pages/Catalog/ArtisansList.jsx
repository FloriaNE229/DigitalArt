import { useState, useEffect, useCallback } from 'react';
import { Search, MapPin, Star, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import Card   from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Input  from '../../components/Common/Input';
//import { atelierAPI } from '../../../../services/api'; // adapte le chemin

const CATEGORIES = [
  { value: 'all',         label: 'Toutes catégories' },
  { value: 'Plomberie',   label: 'Plomberie'         },
  { value: 'Électricité', label: 'Électricité'       },
  { value: 'Menuiserie',  label: 'Menuiserie'        },
  { value: 'Peinture',    label: 'Peinture'          },
  { value: 'Maçonnerie',  label: 'Maçonnerie'        },
  { value: 'Couture',     label: 'Couture'           },
  { value: 'Coiffure',    label: 'Coiffure'          },
  { value: 'Mécanique',   label: 'Mécanique'         },
];

const ITEMS_PER_PAGE = 9;

function AtelierCard({ atelier }) {
  const name      = atelier.nom          ?? '';
  const domaine   = atelier.domaine      ?? '';
  const location  = atelier.localisation ?? '';
  const photo     = atelier.image_url    ?? atelier.image_principale ?? null;
  const rating    = atelier.avis_avg_note ? Number(atelier.avis_avg_note).toFixed(1) : null;
  const avisCount = atelier.avis_count   ?? 0;
  const initiale  = name.charAt(0).toUpperCase();

  return (
    <Link to={`/artisan/${atelier.id}`}>
      <Card hover className="h-full group">
        <div className="relative mb-4">
          <div className="w-full h-48 overflow-hidden rounded-xl" style={{ backgroundColor: 'var(--gray)' }}>
            {photo ? (
              <img src={photo} alt={name}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-5xl font-black text-white"
                style={{ background: 'linear-gradient(135deg, #4a6fa5, #2d4a7c)' }}>
                {initiale}
              </div>
            )}
          </div>
        </div>

        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="mb-1 text-xl font-bold" style={{ color: 'var(--dark)' }}>{name}</h3>
              <p className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>{domaine}</p>
            </div>
            {atelier.verification_status === 'approved' && (
              <div className="px-2 py-1 text-xs font-bold rounded-full"
                style={{ backgroundColor: 'rgba(74, 111, 165, 0.1)', color: 'var(--primary)' }}>
                ✓ Vérifié
              </div>
            )}
          </div>

          {location && (
            <div className="flex items-center gap-2 mb-3 text-sm" style={{ color: 'var(--dark)', opacity: 0.7 }}>
              <MapPin className="w-4 h-4" /><span>{location}</span>
            </div>
          )}

          {rating && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="text-sm font-bold" style={{ color: 'var(--dark)' }}>{rating}</span>
              <span className="text-xs" style={{ color: 'var(--dark)', opacity: 0.6 }}>({avisCount} avis)</span>
            </div>
          )}
        </div>

        <Button variant="primary" className="w-full">Voir l'atelier</Button>
      </Card>
    </Link>
  );
}

export default function ArtisansList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlSearch   = searchParams.get('search')    || '';
  const urlLocation = searchParams.get('location')  || '';
  const urlCategory = searchParams.get('category')  || 'all';
  const urlRating   = Number(searchParams.get('minRating') || 0);
  const urlTri      = searchParams.get('tri')        || 'recent';
  const urlPage     = Number(searchParams.get('page') || 1);

  const [inputSearch,   setInputSearch]   = useState(urlSearch);
  const [inputLocation, setInputLocation] = useState(urlLocation);
  const [ateliers,      setAteliers]      = useState([]);
  const [totalCount,    setTotalCount]    = useState(0);
  const [loading,       setLoading]       = useState(true);
  const [error,         setError]         = useState(null);
  const [showFilters,   setShowFilters]   = useState(false);
  const [retryCount,    setRetryCount]    = useState(0);

  useEffect(() => {
    setInputSearch(urlSearch);
    setInputLocation(urlLocation);
  }, [urlSearch, urlLocation]);

  // ── GET /ateliers?params ───────────────────────────────────
  useEffect(() => {
    const controller = new AbortController();

    const fetchAteliers = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (urlSearch)             params.set('recherche',    urlSearch);
        if (urlLocation)           params.set('localisation', urlLocation);
        if (urlCategory !== 'all') params.set('domaine',      urlCategory);
        if (urlRating)             params.set('note_min',     String(urlRating));
        params.set('tri',      urlTri);
        params.set('par_page', String(ITEMS_PER_PAGE));
        if (urlPage > 1)           params.set('page',         String(urlPage));

        // Utilise http() de api.js via fetch direct avec AbortController
        // (atelierAPI.index ne supporte pas les params ni AbortController)
        const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
        const token = localStorage.getItem('token');
        const res = await fetch(`${BASE}/ateliers?${params}`, {
          headers: {
            Accept: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`Erreur serveur ${res.status}`);
        const json = await res.json();

        if (Array.isArray(json.data)) {
          setAteliers(json.data);
          setTotalCount(json.total ?? json.data.length);
        } else if (Array.isArray(json)) {
          setAteliers(json);
          setTotalCount(json.length);
        } else {
          setAteliers([]);
          setTotalCount(0);
        }
      } catch (err) {
        if (err.name === 'AbortError') return;
        setError(err.message);
        setAteliers([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchAteliers();
    return () => controller.abort();
  }, [urlSearch, urlLocation, urlCategory, urlRating, urlTri, urlPage, retryCount]);

  const pushParams = useCallback((overrides = {}) => {
    const next = {
      search: inputSearch, location: inputLocation,
      category: urlCategory, minRating: String(urlRating),
      tri: urlTri, page: '1', ...overrides,
    };
    const p = {};
    if (next.search)             p.search    = next.search;
    if (next.location)           p.location  = next.location;
    if (next.category !== 'all') p.category  = next.category;
    if (Number(next.minRating))  p.minRating = next.minRating;
    if (next.tri !== 'recent')   p.tri       = next.tri;
    if (Number(next.page) > 1)   p.page      = next.page;
    setSearchParams(p);
  }, [inputSearch, inputLocation, urlCategory, urlRating, urlTri, setSearchParams]);

  const handleSearch       = () => pushParams();
  const handleSelectChange = (key, val) => pushParams({ [key]: val });
  const goToPage           = (p) => pushParams({ page: String(p) });
  const clearFilters       = () => { setInputSearch(''); setInputLocation(''); setSearchParams({}); };
  const handleRetry        = () => setRetryCount(c => c + 1);

  const totalPages       = Math.max(1, Math.ceil(totalCount / ITEMS_PER_PAGE));
  const hasActiveFilters = urlSearch || urlLocation || urlCategory !== 'all' || urlRating > 0;

  const paginationPages = () => {
    const pages = [];
    const delta = 2;
    for (let i = Math.max(1, urlPage - delta); i <= Math.min(totalPages, urlPage + delta); i++) pages.push(i);
    return pages;
  };

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ backgroundColor: 'var(--light)' }}>
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">

        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-semibold rounded-full"
            style={{ backgroundColor: 'rgba(74, 111, 165, 0.1)', color: 'var(--primary)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)' }} />
            {loading ? 'Chargement…' : `${totalCount} atelier${totalCount > 1 ? 's' : ''} trouvé${totalCount > 1 ? 's' : ''}`}
          </div>

          <h1 className="mb-4 text-4xl font-black md:text-5xl" style={{ color: 'var(--dark)' }}>
            Trouvez votre
            <span className="text-transparent bg-clip-text"
              style={{ background: 'linear-gradient(90deg, var(--primary), var(--primary-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {' '}artisan idéal
            </span>
          </h1>

          {urlCategory !== 'all' && (
            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1 text-sm font-semibold rounded-full"
                style={{ backgroundColor: 'rgba(74, 111, 165, 0.15)', color: 'var(--primary)' }}>
                {CATEGORIES.find(c => c.value === urlCategory)?.label ?? urlCategory}
              </span>
              <button onClick={() => handleSelectChange('category', 'all')}
                className="text-sm hover:underline" style={{ color: 'var(--accent)' }}>
                ✕ Supprimer
              </button>
            </div>
          )}
        </div>

        {/* Barre de recherche */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <Input icon={Search} placeholder="Rechercher un atelier, un domaine…"
                value={inputSearch} onChange={(e) => setInputSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
            </div>
            <div className="flex-1">
              <Input icon={MapPin} placeholder="Ville ou localisation"
                value={inputLocation} onChange={(e) => setInputLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
            </div>
            <button onClick={handleSearch}
              className="px-6 py-3 font-bold text-white transition-all rounded-xl"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-light))' }}>
              Rechercher
            </button>
            <button onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 font-bold transition-all border-2 rounded-xl"
              style={{
                backgroundColor: showFilters ? 'var(--primary)' : 'white',
                color:           showFilters ? 'white' : 'var(--dark)',
                borderColor:     'var(--gray-dark)',
              }}>
              <SlidersHorizontal className="w-5 h-5" />
              Filtres
              {hasActiveFilters && !showFilters && (
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--accent)' }} />
              )}
              {showFilters && <X className="w-4 h-4 ml-2" />}
            </button>
          </div>

          {showFilters && (
            <div className="pt-6 mt-6 border-t" style={{ borderColor: 'var(--gray-dark)' }}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <label className="block mb-2 text-sm font-bold" style={{ color: 'var(--dark)' }}>Catégorie</label>
                  <div className="relative">
                    <select value={urlCategory} onChange={(e) => handleSelectChange('category', e.target.value)}
                      className="w-full h-12 px-4 pr-10 transition-all border-2 appearance-none rounded-xl"
                      style={{ backgroundColor: 'var(--gray)', borderColor: 'var(--gray-dark)', color: 'var(--dark)' }}>
                      {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                    <ChevronDown className="absolute w-5 h-5 -translate-y-1/2 right-4 top-1/2"
                      style={{ color: 'var(--primary-light)' }} />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-bold" style={{ color: 'var(--dark)' }}>Note minimale</label>
                  <select value={urlRating} onChange={(e) => handleSelectChange('minRating', e.target.value)}
                    className="w-full h-12 px-4 transition-all border-2 rounded-xl"
                    style={{ backgroundColor: 'var(--gray)', borderColor: 'var(--gray-dark)', color: 'var(--dark)' }}>
                    <option value={0}>Toutes notes</option>
                    <option value={3}>3+ étoiles</option>
                    <option value={4}>4+ étoiles</option>
                    <option value={4.5}>4.5+ étoiles</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-2 text-sm font-bold" style={{ color: 'var(--dark)' }}>Trier par</label>
                  <select value={urlTri} onChange={(e) => handleSelectChange('tri', e.target.value)}
                    className="w-full h-12 px-4 transition-all border-2 rounded-xl"
                    style={{ backgroundColor: 'var(--gray)', borderColor: 'var(--gray-dark)', color: 'var(--dark)' }}>
                    <option value="recent">Plus récents</option>
                    <option value="note_desc">Meilleure note</option>
                    <option value="note_asc">Note croissante</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button onClick={clearFilters} className="px-6 py-2 text-sm font-bold rounded-lg"
                  style={{ color: 'var(--accent)' }}>
                  Réinitialiser les filtres
                </button>
              </div>
            </div>
          )}
        </Card>

        {/* Erreur */}
        {error && (
          <Card className="py-10 mb-8 text-center">
            <p className="mb-4 font-semibold" style={{ color: '#e74c3c' }}>⚠️ {error}</p>
            <button onClick={handleRetry}
              className="px-6 py-2 text-sm font-bold text-white rounded-lg"
              style={{ backgroundColor: 'var(--primary)' }}>
              Réessayer
            </button>
          </Card>
        )}

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 rounded-full border-t-transparent animate-spin"
              style={{ borderColor: 'var(--primary)' }} />
          </div>
        )}

        {/* Grille */}
        {!loading && !error && ateliers.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ateliers.map(a => <AtelierCard key={a.id} atelier={a} />)}
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button onClick={() => goToPage(urlPage - 1)} disabled={urlPage <= 1}
              className="px-4 py-2 font-bold transition-all rounded-lg disabled:opacity-40"
              style={{ backgroundColor: 'white', color: 'var(--dark)', border: '1px solid var(--gray-dark)' }}>
              Précédent
            </button>
            {paginationPages().map(p => (
              <button key={p} onClick={() => goToPage(p)}
                className="px-4 py-2 font-bold transition-all rounded-lg"
                style={{
                  backgroundColor: p === urlPage ? 'var(--primary)' : 'white',
                  color:           p === urlPage ? 'white' : 'var(--dark)',
                  border: `1px solid ${p === urlPage ? 'var(--primary)' : 'var(--gray-dark)'}`,
                }}>
                {p}
              </button>
            ))}
            <button onClick={() => goToPage(urlPage + 1)} disabled={urlPage >= totalPages}
              className="px-4 py-2 font-bold transition-all rounded-lg disabled:opacity-40"
              style={{ backgroundColor: 'white', color: 'var(--dark)', border: '1px solid var(--gray-dark)' }}>
              Suivant
            </button>
          </div>
        )}

        {/* Aucun résultat */}
        {!loading && !error && ateliers.length === 0 && (
          <Card className="py-20 text-center">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full"
              style={{ backgroundColor: 'rgba(255, 126, 95, 0.1)' }}>
              <Search className="w-10 h-10" style={{ color: 'var(--accent)' }} />
            </div>
            <h3 className="mb-3 text-2xl font-bold" style={{ color: 'var(--dark)' }}>Aucun atelier trouvé</h3>
            <p className="mb-6 text-sm" style={{ color: 'var(--dark)', opacity: 0.7 }}>
              Essayez de modifier vos critères de recherche
            </p>
            <Button onClick={clearFilters}>Réinitialiser les filtres</Button>
          </Card>
        )}
      </div>
    </div>
  );
}