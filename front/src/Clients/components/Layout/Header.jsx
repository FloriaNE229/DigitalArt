import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Menu, X, Search, Hammer, User, UserPlus } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navLinks = [
    { name: 'Accueil', to: '/' },
    { name: 'Trouver un artisan', to: '/artisans' },
    { name: 'Mes demandes', to: '/my-services' },
  ];

  // Fonction de recherche
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/artisans?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery(''); // Réinitialiser après recherche
    } else {
      navigate('/artisans');
    }
  };

  // Recherche avec Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch(e);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b shadow-sm bg-white/95 backdrop-blur-xl" style={{ borderColor: 'var(--gray-dark)' }}>
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 transition-opacity rounded-2xl blur-lg opacity-30 group-hover:opacity-50" style={{ background: 'var(--primary)' }}></div>
              <div className="relative flex items-center justify-center transition-transform duration-300 shadow-xl w-11 h-11 rounded-2xl group-hover:scale-110" style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))' }}>
                <Hammer className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black" style={{ color: 'var(--dark)' }}>
                DigitalArt
              </span>
              <span className="text-xs font-semibold -mt-0.5" style={{ color: 'var(--primary)' }}>
                L'expertise à votre service
              </span>
            </div>
          </Link>

          {/* Navigation Desktop */}
          <nav className="items-center hidden gap-6 ml-12 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className="px-4 py-2 font-semibold transition-colors rounded-lg hover:bg-gray-50"
                style={{ color: 'var(--dark)' }}
                onMouseEnter={(e) => e.target.style.color = '#ff7e5f'}
                onMouseLeave={(e) => e.target.style.color = 'var(--dark)'}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar Desktop */}
          <div className="flex-1 hidden max-w-2xl mx-8 md:flex">
            <form onSubmit={handleSearch} className="relative flex items-center w-full gap-2">
              <div className="relative flex-1">
                <Search className="absolute w-5 h-5 -translate-y-1/2 left-4 top-1/2" style={{ color: 'var(--primary-light)' }} />
                <input
                  type="text"
                  placeholder="Plombier, électricien, menuisier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pr-4 text-sm placeholder-gray-400 transition border h-11 pl-11 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                  style={{ 
                    backgroundColor: 'var(--gray)', 
                    borderColor: 'var(--gray-dark)',
                    color: 'var(--dark)'
                  }}
                />
              </div>
              <button 
                type="submit"
                className="px-4 py-2.5 text-sm font-semibold text-white transition-all shadow-md rounded-xl hover:shadow-lg whitespace-nowrap"
                style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))' }}
              >
                Rechercher
              </button>
            </form>
          </div>

          {/* Boutons Auth Desktop */}
          <div className="items-center hidden gap-3 lg:flex">
            <Link to="/login">
              <button className="px-5 py-2.5 border rounded-xl transition-all font-semibold flex items-center gap-2 hover:shadow-md" style={{ backgroundColor: 'var(--light)', color: '#ff7e5f', borderColor: '#ff7e5f' }}>
                <User className="w-4 h-4" />
              </button>
            </Link>
            <Link to="/register">
              <button className="px-5 py-2.5 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2" style={{ backgroundColor: '#ff7e5f' }}>
                <UserPlus className="w-4 h-4" />
              </button>
            </Link>
            
            {/* Séparateur visuel */}
            <div className="w-px h-8 mx-2" style={{ backgroundColor: 'var(--gray-dark)' }}></div>
            
            {/* Icône Profil */}
            <Link to="/profile">
              <button className="p-2.5 rounded-full transition-all hover:shadow-lg relative group" style={{ backgroundColor: 'var(--primary)' }}>
                <User className="w-5 h-5 text-white" />
                <span className="absolute right-0 hidden px-2 py-1 text-xs font-semibold text-white rounded-lg -bottom-10 group-hover:block whitespace-nowrap" style={{ backgroundColor: 'var(--dark)' }}>
                  Mon Profil
                </span>
              </button>
            </Link>
          </div>

          {/* Menu Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2.5 rounded-xl border transition-colors"
            style={{ backgroundColor: 'var(--gray)', borderColor: 'var(--gray-dark)' }}
          >
            {isOpen ? <X className="w-6 h-6" style={{ color: 'var(--dark)' }} /> : <Menu className="w-6 h-6" style={{ color: 'var(--dark)' }} />}
          </button>
        </div>

        {/* Search Bar Mobile (toujours visible) */}
        <div className="pb-4 md:hidden">
          <form onSubmit={handleSearch} className="flex flex-col gap-2">
            <div className="relative">
              <Search className="absolute w-5 h-5 -translate-y-1/2 left-4 top-1/2" style={{ color: 'var(--primary-light)' }} />
              <input
                type="text"
                placeholder="Rechercher un artisan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pr-4 text-sm placeholder-gray-400 transition border h-11 pl-11 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300"
                style={{ 
                  backgroundColor: 'var(--gray)', 
                  borderColor: 'var(--gray-dark)',
                  color: 'var(--dark)'
                }}
              />
            </div>
            <button 
              type="submit"
              className="w-full py-2.5 text-sm font-semibold text-white transition-all shadow-md rounded-xl hover:shadow-lg"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))' }}
            >
              Rechercher
            </button>
          </form>
        </div>
      </div>

      {/* Menu Mobile */}
      {isOpen && (
        <div className="bg-white border-b lg:hidden" style={{ borderColor: 'var(--gray-dark)' }}>
          <nav className="flex flex-col gap-2 px-4 py-4 mx-auto max-w-7xl sm:px-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.to}
                className="px-4 py-3 font-semibold transition-colors rounded-xl hover:bg-gray-50"
                style={{ color: 'var(--dark)' }}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex flex-col gap-2 pt-4 border-t" style={{ borderColor: 'var(--gray-dark)' }}>
              <Link to="/profile" onClick={() => setIsOpen(false)}>
                <button className="flex items-center justify-center w-full gap-2 px-4 py-3 font-semibold transition-all border rounded-xl hover:shadow-md" style={{ backgroundColor: 'var(--light)', color: 'var(--primary)', borderColor: 'var(--primary)' }}>
                  <User className="w-4 h-4" />
                  <span>Mon Profil</span>
                </button>
              </Link>
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <button className="flex items-center justify-center w-full gap-2 px-4 py-3 font-semibold transition-all border rounded-xl hover:shadow-md" style={{ backgroundColor: 'var(--light)', color: '#ff7e5f', borderColor: '#ff7e5f' }}>
                  <User className="w-4 h-4" />
                  <span>Connexion</span>
                </button>
              </Link>
              <Link to="/register" onClick={() => setIsOpen(false)}>
                <button className="flex items-center justify-center w-full gap-2 px-4 py-3 font-semibold text-white transition-all shadow-md rounded-xl hover:shadow-lg" style={{ backgroundColor: '#ff7e5f' }}>
                  <UserPlus className="w-4 h-4" />
                  <span>S'inscrire</span>
                </button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}