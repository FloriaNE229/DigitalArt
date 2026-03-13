import { useState, useEffect } from 'react';
import { Star, Eye, Trash2, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card   from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import { avisAPI } from '../../../../services/api';

export default function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  // ── GET /avis/mes-avis ─────────────────────────────────────
  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await avisAPI.mesAvis();
      setReviews(data.avis ?? data.reviews ?? data.data ?? data ?? []);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des avis.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  // ── DELETE /avis/:id ───────────────────────────────────────
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet avis ?')) return;
    try {
      await avisAPI.destroy(reviewId);
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch (err) {
      alert(err.message || 'Erreur lors de la suppression.');
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + (r.note ?? r.rating ?? 0), 0) / reviews.length).toFixed(1)
    : 0;

  // ── Helpers multi-formats ──────────────────────────────────
  const getAtelier      = (r) => r.atelier ?? r.artisan ?? {};
  const getArtisanName  = (r) => {
    const a = getAtelier(r);
    return (a.nom ?? a.name ?? `${a.prenom ?? ''} ${a.nom ?? ''}`.trim()) || '—';
  };
  const getArtisanPhoto = (r) => {
    const a = getAtelier(r);
    return a.image_url ?? a.image_principale ?? a.image ?? a.photo ?? null;
  };
  const getSpecialty    = (r) => {
    const a = getAtelier(r);
    return a.domaine ?? a.specialite ?? a.specialty ?? '';
  };
  const getRating  = (r) => r.note ?? r.rating ?? 0;
  const getComment = (r) => r.commentaire ?? r.comment ?? '';
  const getDate    = (r) => {
    const raw = r.created_at ?? r.date;
    if (!raw) return '—';
    return new Date(raw).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ backgroundColor: 'var(--light)' }}>
      <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-semibold rounded-full"
            style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24' }}>
            <Star className="w-4 h-4" />
            {reviews.length} avis laissé{reviews.length > 1 ? 's' : ''}
          </div>
          <h1 className="mb-4 text-4xl font-black md:text-5xl" style={{ color: 'var(--dark)' }}>
            Mes
            <span className="text-transparent bg-clip-text"
              style={{ background: 'linear-gradient(90deg, #fbbf24, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {' '}avis
            </span>
          </h1>
          <p className="text-lg" style={{ color: 'var(--dark)', opacity: 0.7 }}>
            Retrouvez tous les avis que vous avez laissés
          </p>
        </div>

        {/* Erreur */}
        {error && (
          <Card className="py-10 mb-8 text-center">
            <p className="mb-4 font-semibold" style={{ color: '#e74c3c' }}>⚠️ {error}</p>
            <Button onClick={fetchReviews}>Réessayer</Button>
          </Card>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 rounded-full border-t-transparent animate-spin"
              style={{ borderColor: 'var(--primary)' }} />
          </div>
        ) : !error && reviews.length > 0 ? (
          <>
            {/* Statistiques */}
            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
              <Card className="p-6 text-center">
                <div className="mb-2 text-4xl font-black" style={{ color: '#fbbf24' }}>
                  {reviews.length}
                </div>
                <div className="text-sm" style={{ color: 'var(--dark)', opacity: 0.7 }}>Avis publiés</div>
              </Card>

              <Card className="p-6 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                  <div className="text-4xl font-black" style={{ color: '#fbbf24' }}>{averageRating}</div>
                </div>
                <div className="text-sm" style={{ color: 'var(--dark)', opacity: 0.7 }}>Note moyenne donnée</div>
              </Card>

              <Card className="p-6 text-center">
                <div className="mb-2 text-4xl font-black" style={{ color: 'var(--primary)' }}>
                  {reviews.filter(r => getRating(r) >= 4).length}
                </div>
                <div className="text-sm" style={{ color: 'var(--dark)', opacity: 0.7 }}>Notes 4+ étoiles</div>
              </Card>
            </div>

            {/* Liste */}
            <div className="space-y-4">
              {reviews.map(review => {
                const photo   = getArtisanPhoto(review);
                const name    = getArtisanName(review);
                const rating  = getRating(review);
                const atelier = getAtelier(review);

                return (
                  <Card key={review.id} className="p-6">
                    <div className="flex flex-col gap-6 md:flex-row">
                      <div className="flex-shrink-0 w-full h-24 overflow-hidden md:w-24 rounded-xl"
                        style={{ backgroundColor: 'var(--gray)' }}>
                        {photo ? (
                          <img src={photo} alt={name} className="object-cover w-full h-full" />
                        ) : (
                          <div className="flex items-center justify-center w-full h-full text-3xl font-black text-white"
                            style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-light))' }}>
                            {name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="mb-1 text-lg font-bold" style={{ color: 'var(--dark)' }}>{name}</h3>
                            <p className="mb-2 text-sm font-semibold" style={{ color: 'var(--accent)' }}>
                              {getSpecialty(review)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i}
                                className={`w-5 h-5 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>

                        <p className="mb-4 text-sm leading-relaxed" style={{ color: 'var(--dark)', opacity: 0.8 }}>
                          {getComment(review)}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="text-xs" style={{ color: 'var(--dark)', opacity: 0.5 }}>
                            Publié le {getDate(review)}
                          </div>
                          <div className="flex gap-2">
                            <Link to={`/artisan/${atelier.id}`}>
                              <Button variant="outline" className="!px-3 !py-2 !text-xs">
                                <Eye className="w-3 h-3" /> Voir profil
                              </Button>
                            </Link>
                            <Button variant="outline" className="!px-3 !py-2 !text-xs"
                              style={{ color: '#ef4444', borderColor: '#ef4444' }}
                              onClick={() => handleDeleteReview(review.id)}>
                              <Trash2 className="w-3 h-3" /> Supprimer
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        ) : !error && (
          <Card className="py-20 text-center">
            <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full"
              style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)' }}>
              <AlertCircle className="w-10 h-10" style={{ color: '#fbbf24' }} />
            </div>
            <h3 className="mb-3 text-2xl font-bold" style={{ color: 'var(--dark)' }}>Aucun avis</h3>
            <p className="mb-6 text-sm" style={{ color: 'var(--dark)', opacity: 0.7 }}>
              Vous n'avez pas encore laissé d'avis
            </p>
            <Link to="/my-services"><Button>Voir mes services terminés</Button></Link>
          </Card>
        )}
      </div>
    </div>
  );
}