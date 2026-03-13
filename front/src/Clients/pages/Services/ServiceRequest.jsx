import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, CheckCircle, Loader, Store } from 'lucide-react';
import Card   from '../../components/Common/Card';
import Button from '../../components/Common/Button';
import { atelierAPI, serviceAPI } from '../../../../services/api';

export default function ServiceRequest() {
  const { artisanId } = useParams(); // = atelier_id
  const navigate      = useNavigate();

  const [loading,     setLoading]     = useState(false);
  const [success,     setSuccess]     = useState(false);
  const [errors,      setErrors]      = useState({});
  const [atelierInfo, setAtelierInfo] = useState(null);
  const [offres,      setOffres]      = useState([]);

  const [formData, setFormData] = useState({
    offre_id:    '',
    description: '',
  });

  // ── GET /ateliers/:id ──────────────────────────────────────
  useEffect(() => {
    if (!artisanId) return;

    const fetchAtelier = async () => {
      try {
        const data    = await atelierAPI.show(artisanId); // GET /ateliers/:id
        const atelier = data.atelier ?? data;
        setAtelierInfo(atelier);
        setOffres(atelier.offres ?? []);
      } catch {
        // Atelier introuvable → on laisse le form vide
      }
    };

    fetchAtelier();
  }, [artisanId]);

  const validate = () => {
    const e = {};
    if (formData.description.trim().length > 0 && formData.description.trim().length < 5) {
      e.description = 'Description trop courte (min 5 caractères)';
    }
    return e;
  };

  // ── POST /services ─────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setLoading(true);
    try {
      const payload = {
        atelier_id:  Number(artisanId),
        offre_id:    formData.offre_id    ? Number(formData.offre_id)    : undefined,
        description: formData.description.trim() || undefined,
      };

      await serviceAPI.store(payload); // POST /services

      setSuccess(true);
      setTimeout(() => navigate('/my-services'), 2000);

    } catch (err) {
      if (err.errors) {
        const mapped = {};
        Object.entries(err.errors).forEach(([k, msgs]) => {
          mapped[k] = Array.isArray(msgs) ? msgs[0] : msgs;
        });
        setErrors(mapped);
      } else {
        setErrors({ submit: err.message || 'Une erreur est survenue.' });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // ── Succès ─────────────────────────────────────────────────
  if (success) return (
    <div className="flex items-center justify-center min-h-screen pt-24 pb-20"
      style={{ backgroundColor: 'var(--light)' }}>
      <Card className="w-full max-w-md p-12 text-center">
        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full"
          style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
          <CheckCircle className="w-12 h-12" style={{ color: '#22c55e' }} />
        </div>
        <h2 className="mb-4 text-3xl font-black" style={{ color: 'var(--dark)' }}>Demande envoyée !</h2>
        <p className="mb-6 text-sm" style={{ color: 'var(--dark)', opacity: 0.7 }}>
          Votre demande a été transmise. L'artisan vous contactera bientôt.
        </p>
        <Button onClick={() => navigate('/my-services')} className="w-full">
          Voir mes demandes
        </Button>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ backgroundColor: 'var(--light)' }}>
      <div className="max-w-2xl px-4 mx-auto sm:px-6 lg:px-8">

        <button onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 mb-6 text-sm font-bold transition-all"
          style={{ color: 'var(--primary)' }}>
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>

        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-semibold rounded-full"
            style={{ backgroundColor: 'rgba(255, 126, 95, 0.1)', color: 'var(--accent)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)' }} />
            Nouvelle demande
          </div>
          <h1 className="mb-4 text-4xl font-black md:text-5xl" style={{ color: 'var(--dark)' }}>
            Demande de
            <span className="text-transparent bg-clip-text"
              style={{ background: 'linear-gradient(90deg, var(--accent), #ff6b4a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {' '}service
            </span>
          </h1>
          {atelierInfo && (
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--dark)', opacity: 0.7 }}>
              <Store className="w-4 h-4" />
              {atelierInfo.nom} — {atelierInfo.domaine}
            </div>
          )}
        </div>

        <Card className="p-8">
          {errors.submit && (
            <div className="p-4 mb-6 rounded-xl"
              style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid #ef4444' }}>
              <p className="text-sm font-semibold" style={{ color: '#ef4444' }}>{errors.submit}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Offre (optionnel) */}
            {offres.length > 0 && (
              <div>
                <label className="block mb-2 text-sm font-bold" style={{ color: 'var(--dark)' }}>
                  Offre souhaitée <span className="font-normal text-gray-400">(optionnel)</span>
                </label>
                <select name="offre_id" value={formData.offre_id} onChange={handleChange}
                  className="w-full h-12 px-4 transition-all border-2 rounded-xl"
                  style={{ backgroundColor: 'var(--gray)', borderColor: 'var(--gray-dark)', color: 'var(--dark)' }}>
                  <option value="">— Sélectionner une offre (optionnel) —</option>
                  {offres.map(offre => (
                    <option key={offre.id} value={offre.id}>
                      {offre.titre}{offre.prix ? ` — ${offre.prix} FCFA` : ' — Sur devis'}
                    </option>
                  ))}
                </select>

                {formData.offre_id && (
                  <div className="p-3 mt-2 text-sm rounded-lg"
                    style={{ backgroundColor: 'rgba(74,111,165,0.05)', color: 'var(--dark)' }}>
                    {offres.find(o => String(o.id) === String(formData.offre_id))?.description}
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div>
              <label className="block mb-2 text-sm font-bold" style={{ color: 'var(--dark)' }}>
                Description de votre besoin <span className="font-normal text-gray-400">(optionnel)</span>
              </label>
              <div className="relative">
                <FileText className="absolute w-5 h-5 pointer-events-none left-4 top-4"
                  style={{ color: 'var(--primary-light)' }} />
                <textarea name="description" value={formData.description} onChange={handleChange}
                  placeholder="Décrivez précisément ce dont vous avez besoin…"
                  rows={5} maxLength={2000}
                  className="w-full px-4 py-3 pl-12 transition-all border-2 resize-none rounded-xl"
                  style={{
                    backgroundColor: errors.description ? 'rgba(239, 68, 68, 0.05)' : 'var(--gray)',
                    borderColor:     errors.description ? '#ef4444' : 'var(--gray-dark)',
                    color:           'var(--dark)',
                  }} />
              </div>
              <div className="flex items-center justify-between mt-1">
                {errors.description
                  ? <p className="text-sm font-semibold" style={{ color: '#ef4444' }}>{errors.description}</p>
                  : <span />}
                <span className="text-xs text-gray-400">{formData.description.length}/2000</span>
              </div>
            </div>

            <div className="flex gap-4 pt-6 border-t" style={{ borderColor: 'var(--gray-dark)' }}>
              <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">
                Annuler
              </Button>
              <Button type="submit" variant="primary" disabled={loading} className="flex-1">
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader className="w-5 h-5 animate-spin" />
                    Envoi...
                  </div>
                ) : 'Envoyer la demande'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}