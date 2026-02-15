import { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Phone, MapPin, Calendar, Edit, Star, FileText, Clock, Award, Settings, LogOut, Bell, Shield } from 'lucide-react';

export default function ClientProfile() {
  const [user] = useState(mockUser);
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen pt-20" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      {/* Hero Section avec photo de profil */}
      <div className="relative overflow-hidden" style={{ 
        background: 'linear-gradient(135deg, #4a6fa5 0%, #2d4a7c 100%)',
        borderBottom: '4px solid #ff7e5f'
      }}>
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.15) 0%, transparent 50%)'
        }}></div>
        
        <div className="relative px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col items-center gap-8 md:flex-row md:items-end">
            {/* Avatar */}
            <div className="relative group">
              <div className="absolute inset-0 transition-all duration-300 bg-white rounded-full opacity-20 blur-xl group-hover:opacity-30"></div>
              <div className="relative w-40 h-40 overflow-hidden transition-transform duration-300 bg-white border-4 border-white rounded-full shadow-2xl group-hover:scale-105">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="object-cover w-full h-full" />
                ) : (
                  <div className="flex items-center justify-center w-full h-full text-6xl font-black text-white" style={{ background: 'linear-gradient(135deg, #ff7e5f, #feb47b)' }}>
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
              <Link to="/profile/edit">
                <button className="absolute bottom-0 right-0 p-3 text-white transition-all duration-300 rounded-full shadow-lg hover:scale-110" style={{ background: 'linear-gradient(135deg, #ff7e5f, #feb47b)' }}>
                  <Edit className="w-4 h-4" />
                </button>
              </Link>
            </div>

            {/* Info utilisateur */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="mb-2 text-4xl font-black text-white md:text-5xl">
                {user.name}
              </h1>
              <p className="mb-4 text-lg text-white/80">
                Membre DigitalArt • {user.city}, {user.country}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <span className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white rounded-full bg-white/20 backdrop-blur-sm">
                  <Calendar className="w-4 h-4" />
                  Membre depuis {user.memberSince}
                </span>
                {user.emailVerified && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-full bg-green-500/90 text-white">
                    <Shield className="w-4 h-4" />
                    Compte vérifié
                  </span>
                )}
              </div>
            </div>

            {/* Actions rapides */}
            <div className="flex gap-3">
              <Link to="/profile/edit">
                <button className="px-6 py-3 text-sm font-bold text-white transition-all duration-300 border-2 border-white rounded-xl hover:bg-white hover:text-blue-900 backdrop-blur-sm">
                  <Edit className="inline w-4 h-4 mr-2" />
                  Modifier
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques en cartes */}
      <div className="px-4 mx-auto -mt-8 max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="relative p-6 overflow-hidden transition-all duration-300 bg-white shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 rounded-full opacity-10" style={{ background: 'linear-gradient(135deg, #ff7e5f, #feb47b)' }}></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm font-semibold text-gray-500">Services demandés</p>
                <p className="text-4xl font-black" style={{ color: '#ff7e5f' }}>{user.stats.services}</p>
              </div>
              <div className="p-4 rounded-full" style={{ backgroundColor: 'rgba(255, 126, 95, 0.1)' }}>
                <FileText className="w-8 h-8" style={{ color: '#ff7e5f' }} />
              </div>
            </div>
          </div>

          <div className="relative p-6 overflow-hidden transition-all duration-300 bg-white shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 rounded-full opacity-10" style={{ background: 'linear-gradient(135deg, #4a6fa5, #2d4a7c)' }}></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm font-semibold text-gray-500">Rendez-vous</p>
                <p className="text-4xl font-black" style={{ color: '#4a6fa5' }}>{user.stats.appointments}</p>
              </div>
              <div className="p-4 rounded-full" style={{ backgroundColor: 'rgba(74, 111, 165, 0.1)' }}>
                <Calendar className="w-8 h-8" style={{ color: '#4a6fa5' }} />
              </div>
            </div>
          </div>

          <div className="relative p-6 overflow-hidden transition-all duration-300 bg-white shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8 bg-yellow-400 rounded-full opacity-10"></div>
            <div className="relative flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm font-semibold text-gray-500">Avis laissés</p>
                <p className="text-4xl font-black text-yellow-500">{user.stats.reviews}</p>
              </div>
              <div className="p-4 bg-yellow-100 rounded-full">
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation par onglets */}
      <div className="px-4 mx-auto mt-8 max-w-7xl sm:px-6 lg:px-8">
        <div className="flex gap-2 p-2 overflow-x-auto bg-white shadow-md rounded-2xl">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Vue d'ensemble
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`px-6 py-3 font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'info'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Informations
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-6 py-3 font-bold rounded-xl transition-all whitespace-nowrap ${
              activeTab === 'activity'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Activité
          </button>
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="px-4 mx-auto mt-6 mb-16 max-w-7xl sm:px-6 lg:px-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Actions rapides */}
            <div className="p-8 bg-white shadow-lg rounded-2xl">
              <h3 className="mb-6 text-2xl font-black text-gray-900">Actions rapides</h3>
              <div className="space-y-3">
                <Link to="/my-services">
                  <button className="flex items-center w-full gap-4 p-4 transition-all duration-300 border-2 border-gray-200 group rounded-xl hover:border-orange-500 hover:bg-orange-50">
                    <div className="p-3 transition-colors bg-gray-100 rounded-lg group-hover:bg-orange-100">
                      <FileText className="w-6 h-6 text-gray-600 transition-colors group-hover:text-orange-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-gray-900">Mes demandes de services</div>
                      <div className="text-sm text-gray-500">Gérer vos demandes</div>
                    </div>
                  </button>
                </Link>

                <Link to="/my-appointments">
                  <button className="flex items-center w-full gap-4 p-4 transition-all duration-300 border-2 border-gray-200 group rounded-xl hover:border-blue-500 hover:bg-blue-50">
                    <div className="p-3 transition-colors bg-gray-100 rounded-lg group-hover:bg-blue-100">
                      <Calendar className="w-6 h-6 text-gray-600 transition-colors group-hover:text-blue-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-gray-900">Mes rendez-vous</div>
                      <div className="text-sm text-gray-500">Consulter votre agenda</div>
                    </div>
                  </button>
                </Link>

                <Link to="/my-reviews">
                  <button className="flex items-center w-full gap-4 p-4 transition-all duration-300 border-2 border-gray-200 group rounded-xl hover:border-yellow-500 hover:bg-yellow-50">
                    <div className="p-3 transition-colors bg-gray-100 rounded-lg group-hover:bg-yellow-100">
                      <Star className="w-6 h-6 text-gray-600 transition-colors group-hover:text-yellow-600" />
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-gray-900">Mes avis</div>
                      <div className="text-sm text-gray-500">Voir vos évaluations</div>
                    </div>
                  </button>
                </Link>
              </div>
            </div>

            {/* Badge membre */}
            <div className="relative p-8 overflow-hidden text-center text-white shadow-lg rounded-2xl" style={{ background: 'linear-gradient(135deg, #ff7e5f 0%, #feb47b 100%)' }}>
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255, 255, 255, 0.3) 0%, transparent 50%)'
              }}></div>
              <div className="relative">
                <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 bg-white rounded-full shadow-xl">
                  <Award className="w-12 h-12" style={{ color: '#ff7e5f' }} />
                </div>
                <h3 className="mb-3 text-3xl font-black">Membre Actif</h3>
                <p className="text-lg text-white/90">
                  Vous êtes un membre actif de la communauté DigitalArt
                </p>
                <div className="inline-flex items-center gap-2 px-6 py-3 mt-6 font-bold bg-white rounded-full" style={{ color: '#ff7e5f' }}>
                  <Star className="w-5 h-5" />
                  Niveau Expert
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'info' && (
          <div className="p-8 bg-white shadow-lg rounded-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-gray-900">Informations personnelles</h3>
              <Link to="/profile/edit">
                <button className="flex items-center gap-2 px-5 py-2.5 font-bold text-white transition-all rounded-xl shadow-md hover:shadow-lg" style={{ background: 'linear-gradient(135deg, #ff7e5f, #feb47b)' }}>
                  <Edit className="w-4 h-4" />
                  Modifier
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="p-6 transition-all duration-300 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(74, 111, 165, 0.1)' }}>
                    <User className="w-6 h-6" style={{ color: '#4a6fa5' }} />
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 text-sm font-semibold text-gray-500">Nom complet</div>
                    <div className="text-lg font-bold text-gray-900">{user.name}</div>
                  </div>
                </div>
              </div>

              <div className="p-6 transition-all duration-300 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(74, 111, 165, 0.1)' }}>
                    <Mail className="w-6 h-6" style={{ color: '#4a6fa5' }} />
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 text-sm font-semibold text-gray-500">Email</div>
                    <div className="text-lg font-bold text-gray-900">{user.email}</div>
                    {user.emailVerified && (
                      <span className="inline-flex items-center gap-1 mt-2 text-xs font-bold text-green-600">
                        <Shield className="w-3 h-3" />
                        Vérifié
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-6 transition-all duration-300 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(74, 111, 165, 0.1)' }}>
                    <Phone className="w-6 h-6" style={{ color: '#4a6fa5' }} />
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 text-sm font-semibold text-gray-500">Téléphone</div>
                    <div className="text-lg font-bold text-gray-900">{user.phone}</div>
                  </div>
                </div>
              </div>

              <div className="p-6 transition-all duration-300 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(74, 111, 165, 0.1)' }}>
                    <MapPin className="w-6 h-6" style={{ color: '#4a6fa5' }} />
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 text-sm font-semibold text-gray-500">Localisation</div>
                    <div className="text-lg font-bold text-gray-900">{user.city}, {user.country}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="p-8 bg-white shadow-lg rounded-2xl">
            <h3 className="mb-8 text-2xl font-black text-gray-900">Activité récente</h3>
            <div className="space-y-4">
              {user.recentActivity.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-6 p-6 transition-all duration-300 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-md">
                  <div className="flex items-center justify-center flex-shrink-0 rounded-full w-14 h-14" style={{ backgroundColor: activity.iconBg }}>
                    {activity.icon === 'service' && <FileText className="w-7 h-7" style={{ color: activity.iconColor }} />}
                    {activity.icon === 'appointment' && <Calendar className="w-7 h-7" style={{ color: activity.iconColor }} />}
                    {activity.icon === 'review' && <Star className="w-7 h-7" style={{ color: activity.iconColor }} />}
                  </div>
                  <div className="flex-1">
                    <div className="mb-2 text-lg font-bold text-gray-900">{activity.title}</div>
                    <div className="mb-3 text-gray-600">{activity.description}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="w-4 h-4" />
                      {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Mock data
const mockUser = {
  name: 'Sophie Martin',
  email: 'sophie.martin@example.com',
  phone: '+229 97 12 34 56',
  city: 'Cotonou',
  country: 'Bénin',
  memberSince: 'Janvier 2025',
  emailVerified: true,
  avatar: null,
  stats: {
    services: 12,
    appointments: 8,
    reviews: 6
  },
  recentActivity: [
    {
      icon: 'review',
      iconBg: 'rgba(251, 191, 36, 0.1)',
      iconColor: '#fbbf24',
      title: 'Avis laissé',
      description: 'Vous avez évalué Jean Kouassi - Plomberie',
      time: 'Il y a 2 jours'
    },
    {
      icon: 'appointment',
      iconBg: 'rgba(74, 111, 165, 0.1)',
      iconColor: '#4a6fa5',
      title: 'Rendez-vous confirmé',
      description: 'RDV avec Marie Dossou le 22 Jan',
      time: 'Il y a 3 jours'
    },
    {
      icon: 'service',
      iconBg: 'rgba(255, 126, 95, 0.1)',
      iconColor: '#ff7e5f',
      title: 'Demande acceptée',
      description: 'Service d\'installation électrique',
      time: 'Il y a 5 jours'
    }
  ]
};