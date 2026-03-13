import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, CheckCircle, Loader } from 'lucide-react';
import Card   from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import { avisAPI, atelierAPI } from '../../../../services/api';

export default function WriteReview() {
  const { artisanId } = useParams(); // = atelier_id
  const navigate      = useNavigate();

  const [loading,     setLoading]     = useState(false);
  const [success,     setSuccess]     = useState(false);
  const [errors,      setErrors]      = useState({});
  const [artisan,     setArtisan]     = useState(null);
  const [artisanLoad, setArtisanLoad] = useState(true);

  const [rating,      setRating]      = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment,     setComment]     = useState('');

  // ── GET /ateliers/:id ──────────────────────────────────────
  useEffect(() => {
    if (!artisanId) return;
    const fetchArtisan = async () => {
      setArtisanLoad(true);
      try {
        const data = await atelierAPI.show(artisanId);
        setArtisan(data.atelier ?? data);
      } catch {
        setArtisan(null);
      } finally {
        setArtisanLoad(false);
      }
    };
    fetchArtisan();
  }, [artisanId]);

  // ── POST /avis ─────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (rating === 0) newErrors.rating = 'Veuillez sélectionner une note';
    if (!comment || comment.trim().length < 10)
      newErrors.comment = 'Commentaire requis (min 10 caractères)';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setLoading(true);
    try {
      await avisAPI.store({
        artisan_id:  artisanId,
        note:        rating,
        commentaire: comment.trim(),
      });

      setSuccess(true);
      setTimeout(() => navigate('/my-reviews'), 2000);

    } catch (err) {
      if (err.errors) {
        const mapped = {};
        Object.entries(err.errors).forEach(([k, v]) => {
          mapped[k] = Array.isArray(v) ? v[0] : v;
        });
        setErrors(mapped);
      } else {
        setErrors({ submit: err.message || 'Une erreur est survenue.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const artisanName     = artisan
    ? (artisan.nom ?? artisan.name ?? '—')
    : '—';
  const artisanPhoto    = artisan?.image_url ?? artisan?.image_principale ?? null;
  const artisanSpecialty = artisan?.domaine ?? artisan?.specialite ?? '';

  // ── Succès ─────────────────────────────────────────────────
  if (success) return (
    <div className="flex items-center justify-center min-h-screen pt-24 pb-20"
      style={{ backgroundColor: 'var(--light)' }}>
      <Card className="w-full max-w-md p-12 text-center">
        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full"
          style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
          <CheckCircle className="w-12 h-12" style={{ color: '#22c55e' }} />
        </div>
        <h2 className="mb-4 text-3xl font-black" style={{ color: 'var(--dark)' }}>Avis publié !</h2>
        <p className="mb-6 text-sm" style={{ color: 'var(--dark)', opacity: 0.7 }}>
          Merci pour votre retour. Il aide la communauté à faire les meilleurs choix.
        </p>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ backgroundColor: 'var(--light)' }}>
      <div className="max-w-3xl px-4 mx-auto sm:px-6 lg:px-8">

        <button onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 mb-6 text-sm font-bold transition-all"
          style={{ color: 'var(--primary)' }}>
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>

        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-semibold rounded-full"
            style={{ backgroundColor: 'rgba(251, 191, 36, 0.1)', color: '#fbbf24' }}>
            <Star className="w-4 h-4" /> Laisser un avis
          </div>
          <h1 className="mb-4 text-4xl font-black md:text-5xl" style={{ color: 'var(--dark)' }}>
            Votre
            <span className="text-transparent bg-clip-text"
              style={{ background: 'linear-gradient(90deg, #fbbf24, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {' '}avis compte
            </span>
          </h1>
          <p className="text-lg" style={{ color: 'var(--dark)', opacity: 0.7 }}>
            Partagez votre expérience avec la communauté
          </p>
        </div>

        <Card className="p-8">
          {/* Info atelier */}
          <div className="flex items-center gap-4 p-6 mb-8 rounded-xl" style={{ backgroundColor: 'var(--gray)' }}>
            {artisanLoad ? (
              <div className="flex items-center gap-3">
                <Loader className="w-5 h-5 animate-spin" style={{ color: 'var(--primary)' }} />
                <span className="text-sm" style={{ color: 'var(--dark)', opacity: 0.6 }}>Chargement...</span>
              </div>
            ) : (
              <>
                <div className="flex-shrink-0 w-16 h-16 overflow-hidden rounded-xl"
                  style={{ backgroundColor: 'var(--gray-dark)' }}>
                  {artisanPhoto ? (
                    <img src={artisanPhoto} alt={artisanName} className="object-cover w-full h-full" />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-2xl font-black text-white"
                      style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-light))' }}>
                      {artisanName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h3 className="mb-1 text-lg font-bold" style={{ color: 'var(--dark)' }}>{artisanName}</h3>
                  {artisanSpecialty && (
                    <p className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>{artisanSpecialty}</p>
                  )}
                </div>
              </>
            )}
          </div>

          {errors.submit && (
            <div className="p-4 mb-6 rounded-xl"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid #ef4444' }}>
              <p className="text-sm font-semibold" style={{ color: '#ef4444' }}>{errors.submit}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">

            {/* Notation */}
            <div>
              <label className="block mb-4 text-lg font-bold text-center" style={{ color: 'var(--dark)' }}>
                Comment évaluez-vous cette prestation ?
              </label>
              <div className="flex items-center justify-center gap-3 mb-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button key={star} type="button"
                    onClick={() => { setRating(star); setErrors(prev => ({ ...prev, rating: '' })); }}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110">
                    <Star className="w-12 h-12 transition-colors cursor-pointer"
                      fill={(hoverRating || rating) >= star ? '#fbbf24' : 'none'}
                      stroke={(hoverRating || rating) >= star ? '#fbbf24' : '#d1d5db'}
                      strokeWidth={2} />
                  </button>
                ))}
              </div>
              {rating > 0 && (
                <p className="text-sm font-bold text-center" style={{ color: '#fbbf24' }}>
                  {['', 'Très insatisfait', 'Insatisfait', 'Satisfait', 'Très satisfait', 'Excellent !'][rating]}
                </p>
              )}
              {errors.rating && (
                <p className="mt-2 text-sm font-semibold text-center" style={{ color: '#ef4444' }}>
                  {errors.rating}
                </p>
              )}
            </div>

            {/* Commentaire */}
            <div>
              <label className="block mb-2 text-sm font-bold" style={{ color: 'var(--dark)' }}>
                Partagez votre expérience *
              </label>
              <textarea value={comment}
                onChange={(e) => {
                  setComment(e.target.value);
                  if (errors.comment) setErrors(prev => ({ ...prev, comment: '' }));
                }}
                placeholder="Décrivez votre expérience avec cet artisan : qualité du travail, ponctualité, professionnalisme..."
                rows={6}
                className="w-full px-4 py-3 transition-all border-2 resize-none rounded-xl"
                style={{
                  backgroundColor: errors.comment ? 'rgba(239, 68, 68, 0.05)' : 'var(--gray)',
                  borderColor:     errors.comment ? '#ef4444' : 'var(--gray-dark)',
                  color:           'var(--dark)',
                }} />
              <div className="flex items-center justify-between mt-2">
                {errors.comment && (
                  <p className="text-sm font-semibold" style={{ color: '#ef4444' }}>{errors.comment}</p>
                )}
                <p className="ml-auto text-xs" style={{ color: 'var(--dark)', opacity: 0.6 }}>
                  {comment.length} caractères
                </p>
              </div>
            </div>

            {/* Conseils */}
            <div className="p-4 rounded-xl"
              style={{ backgroundColor: 'rgba(74, 111, 165, 0.1)', border: '1px solid rgba(74, 111, 165, 0.2)' }}>
              <h4 className="mb-2 text-sm font-bold" style={{ color: 'var(--primary)' }}>
                💡 Conseils pour un bon avis
              </h4>
              <ul className="space-y-1 text-xs" style={{ color: 'var(--dark)', opacity: 0.8 }}>
                <li>• Soyez honnête et constructif</li>
                <li>• Mentionnez ce qui vous a plu ou déplu</li>
                <li>• Parlez de la qualité du travail et du service</li>
                <li>• Respectez la courtoisie et évitez les propos offensants</li>
              </ul>
            </div>

            <div className="flex gap-4 pt-6 border-t" style={{ borderColor: 'var(--gray-dark)' }}>
              <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">
                Annuler
              </Button>
              <Button type="submit" variant="primary" disabled={loading} className="flex-1">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                    Publication...
                  </div>
                ) : (
                  <><Star className="w-5 h-5" /> Publier l'avis</>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}