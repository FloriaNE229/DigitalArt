import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star, MapPin, Phone, Mail, Calendar, Clock, Shield,
  MessageCircle, ChevronLeft, Heart, Share2, CheckCircle,
  Edit, Plus, Store, Hammer, AlertCircle, Loader
} from 'lucide-react';
import Button from '../../components/Common/Button';
import Card from '../../components/Common/Card';
import { useAuth } from '../../components/Auth/AuthContext';

export default function ArtisanDetail() {
  const { id }               = useParams();
  const navigate             = useNavigate();
  const { user, accesToken } = useAuth();

  const [atelier,   setAtelier]   = useState(null);
  const [reviews,   setReviews]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [activeTab, setActiveTab] = useState('about');

  // L'artisan connecté consulte-t-il SA propre page ?
  // On compare via l'atelier chargé (artisan.utilisateur_id === user.id)
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  // ── Charger l'atelier (public) OU mon-atelier (artisan connecté)
  useEffect(() => {
    const fetchAtelier = async () => {
      setLoading(true);
      setError(null);
      try {
        // D'abord on charge l'atelier public
        const res = await fetch(`/api/ateliers/${id}`, {
          headers:     { Accept: 'application/json' },
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Atelier introuvable');
        const data    = await res.json();
        const atelierData = data.atelier ?? data;
        setAtelier(atelierData);

        // Déterminer si c'est le propre profil de l'artisan connecté
        const artisanUserId = atelierData?.artisan?.utilisateur_id
          ?? atelierData?.artisan?.utilisateur?.id;
        if (user && artisanUserId && String(artisanUserId) === String(user.id)) {
          setIsOwnProfile(true);
          // Recharger avec les données complètes (mon-atelier inclut galerie, offres, oeuvres)
          const resMine = await fetch('/api/mon-atelier', {
            headers: {
              Accept:        'application/json',
              Authorization: `Bearer ${accesToken}`,
            },
            credentials: 'include',
          });
          if (resMine.ok) {
            const dataMine = await resMine.json();
            setAtelier(dataMine.atelier ?? dataMine);
          }
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAtelier();
  }, [id, user, accesToken]);

  // ── Charger les avis à la demande (onglet avis, vue client)
  useEffect(() => {
    if (isOwnProfile || activeTab !== 'reviews') return;
    const fetchReviews = async () => {
      try {
        // Les avis sont déjà dans atelier.avis (chargé avec le show)
        if (atelier?.avis?.length) {
          setReviews(atelier.avis);
        }
      } catch { /* silencieux */ }
    };
    fetchReviews();
  }, [activeTab, isOwnProfile, atelier]);

  // ── Helpers
  const artisanUser = atelier?.artisan?.utilisateur ?? null;
  const fullName    = artisanUser
    ? `${artisanUser.prenom ?? ''} ${artisanUser.nom ?? ''}`.trim() || atelier?.nom
    : atelier?.nom ?? '';
  const initiale    = fullName.charAt(0).toUpperCase();
  const photo       = artisanUser?.photo_profil ?? atelier?.image_principale ?? null;
  const rating      = atelier?.avis_avg_note ? Number(atelier.avis_avg_note).toFixed(1) : null;
  const avisCount   = atelier?.avis_count ?? atelier?.avis?.length ?? 0;

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader className="w-10 h-10 animate-spin" style={{ color: '#4a6fa5' }} />
    </div>
  );

  if (error || !atelier) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <AlertCircle className="w-12 h-12" style={{ color: '#ff7e5f' }} />
      <p className="text-lg font-bold" style={{ color: '#2b2d42' }}>{error ?? 'Atelier introuvable'}</p>
      <Link to="/artisans">
        <button className="px-6 py-3 font-bold text-white rounded-xl"
          style={{ background: 'linear-gradient(135deg, #4a6fa5, #3a5784)' }}>
          Retour à la liste
        </button>
      </Link>
    </div>
  );

  const tabs = isOwnProfile
    ? [
        { id: 'about',   label: 'Mon profil'    },
        { id: 'atelier', label: 'Mon atelier'   },
      ]
    : [
        { id: 'about',   label: 'À propos'                   },
        { id: 'atelier', label: 'Atelier & Offres'           },
        { id: 'reviews', label: `Avis (${avisCount})`        },
      ];

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ backgroundColor: '#f8fafc' }}>
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">

        <div className="mb-6">
          <Link to="/artisans" className="inline-flex items-center gap-2 text-sm font-bold"
            style={{ color: '#4a6fa5' }}>
            <ChevronLeft className="w-4 h-4" /> Retour aux ateliers
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* ── Colonne principale */}
          <div className="space-y-8 lg:col-span-2">

            {/* Hero Card */}
            <div className="overflow-hidden bg-white shadow-lg rounded-2xl">
              <div className="relative h-64"
                style={{ background: 'linear-gradient(135deg, #4a6fa5 0%, #2d4a7c 100%)' }}>
                {atelier.image_principale && (
                  <img src={atelier.image_principale} alt={fullName}
                    className="object-cover w-full h-full opacity-30" />
                )}

                {!isOwnProfile && (
                  <div className="absolute flex gap-2 top-4 right-4">
                    <button className="flex items-center justify-center w-10 h-10 transition-all bg-white rounded-full shadow hover:scale-110">
                      <Heart className="w-5 h-5" style={{ color: '#ff7e5f' }} />
                    </button>
                    <button className="flex items-center justify-center w-10 h-10 transition-all bg-white rounded-full shadow hover:scale-110">
                      <Share2 className="w-5 h-5" style={{ color: '#4a6fa5' }} />
                    </button>
                  </div>
                )}

                {isOwnProfile && (
                  <div className="absolute top-4 right-4">
                    <Link to="/profile/edit">
                      <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white transition-all border-2 border-white rounded-xl hover:bg-white hover:text-blue-900">
                        <Edit className="w-4 h-4" /> Modifier mon profil
                      </button>
                    </Link>
                  </div>
                )}

                <div className="absolute -bottom-12 left-8">
                  <div className="w-24 h-24 overflow-hidden border-4 border-white rounded-full shadow-xl"
                    style={{ background: 'linear-gradient(135deg, #ff7e5f, #feb47b)' }}>
                    {photo ? (
                      <img src={photo} alt={fullName} className="object-cover w-full h-full" />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-4xl font-black text-white">
                        {initiale}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="px-8 pt-16 pb-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="mb-1 text-3xl font-black" style={{ color: '#2b2d42' }}>{fullName}</h1>
                    <p className="mb-1 text-lg font-bold" style={{ color: '#ff7e5f' }}>{atelier.domaine}</p>
                    {atelier.localisation && (
                      <div className="flex items-center gap-1 text-sm" style={{ color: '#2b2d42', opacity: 0.6 }}>
                        <MapPin className="w-4 h-4" />{atelier.localisation}
                      </div>
                    )}
                  </div>
                  {rating && (
                    <div className="text-right">
                      <div className="text-3xl font-black" style={{ color: '#4a6fa5' }}>{rating}</div>
                      <div className="flex items-center justify-end mb-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <div className="text-xs" style={{ color: '#2b2d42', opacity: 0.5 }}>{avisCount} avis</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Onglets */}
            <div className="overflow-hidden bg-white shadow-lg rounded-2xl">
              <div className="flex overflow-x-auto border-b" style={{ borderColor: '#e9ecef' }}>
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    className="px-6 py-4 text-sm font-bold transition-all whitespace-nowrap"
                    style={{
                      color:        activeTab === tab.id ? '#4a6fa5' : '#2b2d42',
                      borderBottom: activeTab === tab.id ? '3px solid #4a6fa5' : '3px solid transparent',
                    }}>
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-8">

                {/* ── À propos */}
                {activeTab === 'about' && (
                  <div className="space-y-6">
                    {atelier.description ? (
                      <div>
                        <h3 className="mb-3 text-xl font-bold" style={{ color: '#2b2d42' }}>Description</h3>
                        <p className="text-sm leading-relaxed" style={{ color: '#2b2d42', opacity: 0.8 }}>
                          {atelier.description}
                        </p>
                      </div>
                    ) : isOwnProfile ? (
                      <div className="p-4 text-center border-2 border-dashed rounded-xl" style={{ borderColor: '#e9ecef' }}>
                        <p className="mb-3 text-sm" style={{ color: '#2b2d42', opacity: 0.5 }}>
                          Pas encore de description.
                        </p>
                        <button onClick={() => navigate(`/atelier/${atelier.id}/edit`)}
                          className="px-4 py-2 text-sm font-bold text-white rounded-lg"
                          style={{ background: 'linear-gradient(135deg, #4a6fa5, #3a5784)' }}>
                          Compléter mon atelier
                        </button>
                      </div>
                    ) : null}

                    {atelier.domaine && (
                      <div>
                        <h3 className="mb-3 text-xl font-bold" style={{ color: '#2b2d42' }}>Domaine</h3>
                        <span className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-full"
                          style={{ backgroundColor: 'rgba(74,111,165,0.1)', color: '#4a6fa5' }}>
                          <Hammer className="w-4 h-4" />{atelier.domaine}
                        </span>
                      </div>
                    )}
                  </div>
                )}

                {/* ── Atelier & Offres */}
                {activeTab === 'atelier' && (
                  <div>
                    {isOwnProfile && !atelier ? (
                      <div className="py-12 text-center">
                        <Store className="w-10 h-10 mx-auto mb-4" style={{ color: '#ff7e5f' }} />
                        <h3 className="mb-3 text-2xl font-bold" style={{ color: '#2b2d42' }}>
                          Vous n'avez pas encore d'atelier
                        </h3>
                        <button onClick={() => navigate('/atelier/create')}
                          className="inline-flex items-center gap-2 px-8 py-4 font-bold text-white rounded-xl"
                          style={{ background: 'linear-gradient(135deg, #ff7e5f, #feb47b)' }}>
                          <Plus className="w-5 h-5" /> Créer mon atelier
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="mb-1 text-2xl font-black" style={{ color: '#2b2d42' }}>{atelier.nom}</h3>
                            <div className="flex items-center gap-2 mb-2 text-sm" style={{ color: '#2b2d42', opacity: 0.6 }}>
                              <MapPin className="w-4 h-4" />{atelier.localisation}
                            </div>
                            <span className="px-3 py-1 text-xs font-bold rounded-full"
                              style={{ backgroundColor: 'rgba(74,111,165,0.1)', color: '#4a6fa5' }}>
                              {atelier.domaine}
                            </span>
                          </div>
                          {isOwnProfile && (
                            <button onClick={() => navigate(`/atelier/${atelier.id}/edit`)}
                              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-xl"
                              style={{ background: 'linear-gradient(135deg, #4a6fa5, #3a5784)' }}>
                              <Edit className="w-4 h-4" /> Modifier
                            </button>
                          )}
                        </div>

                        {atelier.image_principale && (
                          <div className="h-56 overflow-hidden rounded-xl">
                            <img src={atelier.image_principale} alt={atelier.nom}
                              className="object-cover w-full h-full" />
                          </div>
                        )}

                        {/* Offres */}
                        {atelier.offres?.length > 0 && (
                          <div>
                            <h4 className="mb-4 text-lg font-bold" style={{ color: '#2b2d42' }}>Offres de services</h4>
                            <div className="space-y-3">
                              {atelier.offres.map(offre => (
                                <div key={offre.id}
                                  className="flex items-start justify-between p-4 transition-all border-2 rounded-xl hover:shadow-md"
                                  style={{ borderColor: '#e9ecef' }}>
                                  <div>
                                    <div className="mb-1 font-bold" style={{ color: '#2b2d42' }}>{offre.titre}</div>
                                    <div className="text-sm" style={{ color: '#2b2d42', opacity: 0.6 }}>{offre.description}</div>
                                  </div>
                                  <div className="ml-4 text-right">
                                    <div className="text-lg font-black" style={{ color: '#ff7e5f' }}>
                                      {offre.prix ? `${offre.prix} FCFA` : 'Sur devis'}
                                    </div>
                                    {!isOwnProfile && (
                                      <Link to={`/services/request/${atelier.id}`}>
                                        <button className="px-3 py-1 mt-1 text-xs font-bold text-white rounded-lg"
                                          style={{ backgroundColor: '#4a6fa5' }}>
                                          Commander
                                        </button>
                                      </Link>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* ── Avis (vue client) */}
                {activeTab === 'reviews' && !isOwnProfile && (
                  <div className="space-y-4">
                    {(atelier.avis?.length > 0 ? atelier.avis : reviews).length > 0 ? (
                      (atelier.avis?.length > 0 ? atelier.avis : reviews).map(avis => {
                        const author  = avis.client?.prenom ?? avis.client?.nom ?? 'Client';
                        const note    = avis.note ?? 0;
                        const comment = avis.commentaire ?? '';
                        return (
                          <div key={avis.id} className="flex items-start gap-4 p-4 rounded-xl"
                            style={{ backgroundColor: '#f8f9fa' }}>
                            <div className="flex items-center justify-center flex-shrink-0 w-12 h-12 font-bold text-white rounded-full"
                              style={{ backgroundColor: '#4a6fa5' }}>
                              {author[0]?.toUpperCase() ?? '?'}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-bold" style={{ color: '#2b2d42' }}>{author}</span>
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < note ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                                  ))}
                                </div>
                              </div>
                              <p className="text-sm" style={{ color: '#2b2d42', opacity: 0.7 }}>{comment}</p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="py-10 text-center">
                        <Star className="w-10 h-10 mx-auto mb-3" style={{ color: '#4a6fa5', opacity: 0.3 }} />
                        <p className="text-sm" style={{ color: '#2b2d42', opacity: 0.5 }}>Aucun avis pour l'instant.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Sidebar */}
          <div className="space-y-6 lg:col-span-1">
            {isOwnProfile ? (
              <>
                <div className="p-6 bg-white shadow-lg rounded-2xl">
                  <h3 className="mb-4 text-xl font-bold" style={{ color: '#2b2d42' }}>Mon espace artisan</h3>
                  <div className="space-y-3">
                    <Link to="/profile/edit">
                      <button className="flex items-center w-full gap-3 p-3 transition-all border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50 group">
                        <Edit className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                        <span className="text-sm font-bold" style={{ color: '#2b2d42' }}>Modifier mon profil</span>
                      </button>
                    </Link>
                    <button onClick={() => navigate(`/atelier/${atelier.id}/edit`)}
                      className="flex items-center w-full gap-3 p-3 transition-all border-2 border-gray-200 rounded-xl hover:border-orange-400 hover:bg-orange-50 group">
                      <Store className="w-5 h-5 text-gray-400 group-hover:text-orange-600" />
                      <span className="text-sm font-bold" style={{ color: '#2b2d42' }}>Gérer mon atelier</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="p-6 bg-white shadow-lg rounded-2xl">
                  <h3 className="mb-4 text-xl font-bold" style={{ color: '#2b2d42' }}>Contacter l'artisan</h3>
                  <div className="space-y-3">
                    <Link to={`/appointments/book/${atelier.id}`} className="block">
                      <button className="flex items-center justify-center w-full gap-2 py-3 font-bold text-white transition-all rounded-xl hover:shadow-lg"
                        style={{ background: 'linear-gradient(135deg, #4a6fa5, #3a5784)' }}>
                        <Calendar className="w-5 h-5" /> Prendre rendez-vous
                      </button>
                    </Link>
                    <Link to={`/services/request/${atelier.id}`} className="block">
                      <button className="flex items-center justify-center w-full gap-2 py-3 font-bold transition-all border-2 rounded-xl hover:bg-gray-50"
                        style={{ borderColor: '#4a6fa5', color: '#4a6fa5' }}>
                        <Clock className="w-5 h-5" /> Demande de service
                      </button>
                    </Link>
                    <button className="flex items-center justify-center w-full gap-2 py-3 font-bold transition-all border-2 rounded-xl hover:bg-gray-50"
                      style={{ borderColor: '#e9ecef', color: '#2b2d42' }}>
                      <MessageCircle className="w-5 h-5" /> Envoyer un message
                    </button>
                  </div>
                </div>

                <div className="p-6 bg-white shadow-lg rounded-2xl">
                  <h3 className="mb-4 text-lg font-bold" style={{ color: '#2b2d42' }}>Garanties</h3>
                  <div className="space-y-3">
                    {[
                      { Icon: CheckCircle, color: '#22c55e', title: 'Travail garanti',       sub: 'Satisfaction 30 jours'      },
                      { Icon: Shield,      color: '#4a6fa5', title: 'Professionnel vérifié', sub: 'Identité et qualifications' },
                      { Icon: Star,        color: '#fbbf24', title: 'Service de qualité',    sub: `Note ${rating ?? '–'}/5`   },
                    ].map(({ Icon, color, title, sub }) => (
                      <div key={title} className="flex items-start gap-3">
                        <Icon className="flex-shrink-0 w-5 h-5 mt-0.5" style={{ color }} />
                        <div>
                          <div className="text-sm font-bold" style={{ color: '#2b2d42' }}>{title}</div>
                          <div className="text-xs" style={{ color: '#2b2d42', opacity: 0.6 }}>{sub}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}