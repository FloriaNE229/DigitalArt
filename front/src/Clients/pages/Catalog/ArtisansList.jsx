import { useState, useEffect, useMemo } from 'react';
import { Search, MapPin, Star, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import Card from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import Input from '../../components/Common/Input';

export default function ArtisansList() {
  const [searchParams] = useSearchParams();
  const [artisans, setArtisans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // ✅ Lire les paramètres URL
  const urlSearch = searchParams.get('search') || '';
  const urlLocation = searchParams.get('location') || '';
  const urlCategory = searchParams.get('category') || 'all';
  
  // ✅ SOLUTION PARFAITE : Calculer filters directement avec useMemo
  const filters = useMemo(() => ({
    search: urlSearch,
    location: urlLocation,
    category: urlCategory,
    minRating: 0,
    availability: 'all'
  }), [urlSearch, urlLocation, urlCategory]);

  // Catégories
  const categories = [
    { value: 'all', label: 'Toutes catégories', count: 156 },
    { value: 'plomberie', label: 'Plomberie', count: 45 },
    { value: 'electricite', label: 'Électricité', count: 38 },
    { value: 'menuiserie', label: 'Menuiserie', count: 29 },
    { value: 'peinture', label: 'Peinture', count: 22 },
    { value: 'maconnerie', label: 'Maçonnerie', count: 18 },
    { value: 'couture', label: 'Couture', count: 15 },
    { value: 'coiffure', label: 'Coiffure', count: 12 },
    { value: 'mecanique', label: 'Mécanique', count: 9 }
  ];

  useEffect(() => {
    const fetchArtisans = async () => {
      setLoading(true);
      // TODO: Remplacer par appel API Laravel
      // const response = await fetch(`/api/artisans?search=${filters.search}&location=${filters.location}&category=${filters.category}`);
      
      // Simulation filtrage côté client
      setTimeout(() => {
        let filtered = [...mockArtisans];
        
        // Filtrer par recherche
        if (filters.search) {
          filtered = filtered.filter(a => 
            a.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            a.specialty.toLowerCase().includes(filters.search.toLowerCase())
          );
        }
        
        // Filtrer par localisation
        if (filters.location) {
          filtered = filtered.filter(a => 
            a.location.toLowerCase().includes(filters.location.toLowerCase())
          );
        }
        
        // Filtrer par catégorie
        if (filters.category !== 'all') {
          filtered = filtered.filter(a => 
            a.specialty.toLowerCase().includes(filters.category.toLowerCase())
          );
        }
        
        // Filtrer par note
        if (filters.minRating > 0) {
          filtered = filtered.filter(a => a.rating >= filters.minRating);
        }
        
        // Filtrer par disponibilité
        if (filters.availability === 'immediate') {
          filtered = filtered.filter(a => a.available);
        }
        
        setArtisans(filtered);
        setLoading(false);
      }, 800);
    };

    fetchArtisans();
  }, [filters]);

  // ✅ Pour modifier les filtres localement (sans URL)
  const [localFilters, setLocalFilters] = useState({
    minRating: 0,
    availability: 'all'
  });

  // ✅ Combiner filters URL + local filters
  const combinedFilters = useMemo(() => ({
    ...filters,
    ...localFilters
  }), [filters, localFilters]);

  const handleFilterChange = (key, value) => {
    // Si c'est search, location ou category, on pourrait mettre à jour l'URL
    // Pour l'instant on met à jour local
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setLocalFilters({
      minRating: 0,
      availability: 'all'
    });
    // Optionnel: réinitialiser l'URL aussi
    // navigate('/artisans');
  };

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ backgroundColor: 'var(--light)' }}>
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-semibold rounded-full" style={{ backgroundColor: 'rgba(74, 111, 165, 0.1)', color: 'var(--primary)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)' }}></span>
            {artisans.length} artisan{artisans.length > 1 ? 's' : ''} trouvé{artisans.length > 1 ? 's' : ''}
          </div>
          
          <h1 className="mb-4 text-4xl font-black md:text-5xl" style={{ color: 'var(--dark)' }}>
            Trouvez votre
            <span className="text-transparent bg-clip-text" style={{ background: 'linear-gradient(90deg, var(--primary), var(--primary-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {' '}artisan idéal
            </span>
          </h1>
          <p className="text-lg" style={{ color: 'var(--dark)', opacity: 0.7 }}>
            Des professionnels qualifiés et vérifiés près de chez vous
          </p>
        </div>

        {/* Barre de recherche */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <Input
                icon={Search}
                placeholder="Rechercher un artisan, une spécialité..."
                value={combinedFilters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Input
                icon={MapPin}
                placeholder="Ville ou localisation"
                value={combinedFilters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-6 py-3 font-bold transition-all border-2 rounded-xl"
              style={{
                backgroundColor: showFilters ? 'var(--primary)' : 'white',
                color: showFilters ? 'white' : 'var(--dark)',
                borderColor: 'var(--gray-dark)'
              }}
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filtres
              {showFilters && <X className="w-4 h-4 ml-2" />}
            </button>
          </div>

          {/* Filtres avancés */}
          {showFilters && (
            <div className="pt-6 mt-6 border-t" style={{ borderColor: 'var(--gray-dark)' }}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                {/* Catégorie */}
                <div>
                  <label className="block mb-2 text-sm font-bold" style={{ color: 'var(--dark)' }}>
                    Catégorie
                  </label>
                  <div className="relative">
                    <select
                      value={combinedFilters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full h-12 px-4 pr-10 transition-all border-2 appearance-none rounded-xl"
                      style={{
                        backgroundColor: 'var(--gray)',
                        borderColor: 'var(--gray-dark)',
                        color: 'var(--dark)'
                      }}
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.label} ({cat.count})
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute w-5 h-5 -translate-y-1/2 right-4 top-1/2" style={{ color: 'var(--primary-light)' }} />
                  </div>
                </div>

                {/* Note minimale */}
                <div>
                  <label className="block mb-2 text-sm font-bold" style={{ color: 'var(--dark)' }}>
                    Note minimale
                  </label>
                  <select
                    value={combinedFilters.minRating}
                    onChange={(e) => handleFilterChange('minRating', Number(e.target.value))}
                    className="w-full h-12 px-4 transition-all border-2 rounded-xl"
                    style={{
                      backgroundColor: 'var(--gray)',
                      borderColor: 'var(--gray-dark)',
                      color: 'var(--dark)'
                    }}
                  >
                    <option value={0}>Toutes notes</option>
                    <option value={4}>4+ étoiles</option>
                    <option value={4.5}>4.5+ étoiles</option>
                    <option value={4.8}>4.8+ étoiles</option>
                  </select>
                </div>

                {/* Disponibilité */}
                <div>
                  <label className="block mb-2 text-sm font-bold" style={{ color: 'var(--dark)' }}>
                    Disponibilité
                  </label>
                  <select
                    value={combinedFilters.availability}
                    onChange={(e) => handleFilterChange('availability', e.target.value)}
                    className="w-full h-12 px-4 transition-all border-2 rounded-xl"
                    style={{
                      backgroundColor: 'var(--gray)',
                      borderColor: 'var(--gray-dark)',
                      color: 'var(--dark)'
                    }}
                  >
                    <option value="all">Tous</option>
                    <option value="immediate">Disponible immédiatement</option>
                    <option value="week">Cette semaine</option>
                    <option value="month">Ce mois-ci</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 text-sm font-bold transition-all rounded-lg"
                  style={{ color: 'var(--accent)' }}
                >
                  Réinitialiser les filtres
                </button>
              </div>
            </div>
          )}
        </Card>

        {/* Liste des artisans */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 rounded-full border-t-transparent animate-spin" style={{ borderColor: 'var(--primary)' }}></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {artisans.map((artisan) => (
              <Link key={artisan.id} to={`/artisan/${artisan.id}`}>
                <Card hover className="h-full group">
                  <div className="relative mb-4">
                    {artisan.available && (
                      <div className="absolute z-10 px-3 py-1 text-xs font-bold text-white rounded-full top-3 right-3" style={{ backgroundColor: '#22c55e' }}>
                        Disponible
                      </div>
                    )}
                    
                    <div className="w-full h-48 overflow-hidden rounded-xl" style={{ backgroundColor: 'var(--gray)' }}>
                      <img
                        src={artisan.image}
                        alt={artisan.name}
                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="mb-1 text-xl font-bold" style={{ color: 'var(--dark)' }}>
                          {artisan.name}
                        </h3>
                        <p className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
                          {artisan.specialty}
                        </p>
                      </div>
                      {artisan.verified && (
                        <div className="px-2 py-1 text-xs font-bold rounded-full" style={{ backgroundColor: 'rgba(74, 111, 165, 0.1)', color: 'var(--primary)' }}>
                          ✓ Vérifié
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mb-3 text-sm" style={{ color: 'var(--dark)', opacity: 0.7 }}>
                      <MapPin className="w-4 h-4" />
                      <span>{artisan.location}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${i < Math.floor(artisan.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-bold" style={{ color: 'var(--dark)' }}>
                        {artisan.rating}
                      </span>
                      <span className="text-xs" style={{ color: 'var(--dark)', opacity: 0.6 }}>
                        ({artisan.reviews} avis)
                      </span>
                    </div>

                    <div className="text-sm font-bold" style={{ color: 'var(--primary)' }}>
                      À partir de {artisan.price} FCFA
                    </div>
                  </div>

                  <Button variant="primary" className="w-full">
                    Voir le profil
                  </Button>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && artisans.length > 0 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button className="px-4 py-2 font-bold transition-all rounded-lg" style={{ backgroundColor: 'white', color: 'var(--dark)', border: '1px solid var(--gray-dark)' }}>
              Précédent
            </button>
            {[1, 2, 3, 4, 5].map(page => (
              <button
                key={page}
                className="px-4 py-2 font-bold transition-all rounded-lg"
                style={{
                  backgroundColor: page === 1 ? 'var(--primary)' : 'white',
                  color: page === 1 ? 'white' : 'var(--dark)',
                  border: `1px solid ${page === 1 ? 'var(--primary)' : 'var(--gray-dark)'}`
                }}
              >
                {page}
              </button>
            ))}
            <button className="px-4 py-2 font-bold transition-all rounded-lg" style={{ backgroundColor: 'white', color: 'var(--dark)', border: '1px solid var(--gray-dark)' }}>
              Suivant
            </button>
          </div>
        )}

        {/* Aucun résultat */}
        {!loading && artisans.length === 0 && (
          <Card className="py-20 text-center">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full" style={{ backgroundColor: 'rgba(255, 126, 95, 0.1)' }}>
              <Search className="w-10 h-10" style={{ color: 'var(--accent)' }} />
            </div>
            <h3 className="mb-3 text-2xl font-bold" style={{ color: 'var(--dark)' }}>
              Aucun artisan trouvé
            </h3>
            <p className="mb-6 text-sm" style={{ color: 'var(--dark)', opacity: 0.7 }}>
              Essayez de modifier vos critères de recherche
            </p>
            <Button onClick={clearFilters}>
              Réinitialiser les filtres
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
}

// Mock data
const mockArtisans = [
  {
    id: 1,
    name: 'Jean Kouassi',
    specialty: 'Plomberie',
    location: 'Cotonou, Bénin',
    rating: 4.9,
    reviews: 127,
    price: '15000',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400',
    verified: true,
    available: true
  },
  {
    id: 2,
    name: 'Marie Dossou',
    specialty: 'Électricité',
    location: 'Porto-Novo, Bénin',
    rating: 4.8,
    reviews: 89,
    price: '12000',
    image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400',
    verified: true,
    available: false
  },
  {
    id: 3,
    name: 'Pierre Agbodji',
    specialty: 'Menuiserie',
    location: 'Parakou, Bénin',
    rating: 5.0,
    reviews: 156,
    price: '20000',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    verified: true,
    available: true
  },
  {
    id: 4,
    name: 'Sophie Hounnou',
    specialty: 'Couture',
    location: 'Cotonou, Bénin',
    rating: 4.7,
    reviews: 92,
    price: '8000',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
    verified: false,
    available: true
  },
  {
    id: 5,
    name: 'Thomas Ahoyo',
    specialty: 'Peinture',
    location: 'Abomey-Calavi, Bénin',
    rating: 4.6,
    reviews: 73,
    price: '10000',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
    verified: true,
    available: false
  },
  {
    id: 6,
    name: 'Fatou Bello',
    specialty: 'Coiffure',
    location: 'Cotonou, Bénin',
    rating: 4.9,
    reviews: 201,
    price: '5000',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    verified: true,
    available: true
  }
];