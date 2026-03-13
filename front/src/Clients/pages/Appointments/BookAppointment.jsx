import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, FileText, CheckCircle, Loader } from 'lucide-react';
import { atelierAPI, rendezVousAPI } from '../../../../services/api';

export default function BookAppointment() {
  const { artisanId } = useParams(); // = atelier_id
  const navigate      = useNavigate();

  const [loading,       setLoading]       = useState(false);
  const [success,       setSuccess]       = useState(false);
  const [errors,        setErrors]        = useState({});
  const [apiError,      setApiError]      = useState('');
  const [atelierInfo,   setAtelierInfo]   = useState(null);
  const [disponibilite, setDisponibilite] = useState([]);

  const [formData, setFormData] = useState({
    date_rdv:      '',
    duree_minutes: 60,
    message:       '',
  });

  // ── GET /ateliers/:id + GET /ateliers/:id/disponibilite ───
  useEffect(() => {
    if (!artisanId) return;

    const fetchInfo = async () => {
      try {
        const [dataAtelier, dataDisp] = await Promise.allSettled([
          atelierAPI.show(artisanId),
          atelierAPI.disponibilite(artisanId),
        ]);

        if (dataAtelier.status === 'fulfilled') {
          const d = dataAtelier.value;
          setAtelierInfo(d.atelier ?? d);
        }

        if (dataDisp.status === 'fulfilled') {
          const d = dataDisp.value;
          setDisponibilite(d.disponibilites ?? d.slots ?? []);
        }
      } catch { /* ignore — page fonctionne sans ces infos */ }
    };

    fetchInfo();
  }, [artisanId]);

  const validate = () => {
    const e = {};
    if (!formData.date_rdv) e.date_rdv = 'Date et heure requises';
    return e;
  };

  // ── POST /rendez-vous ──────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setLoading(true);
    setApiError('');

    try {
      await rendezVousAPI.store({
        atelier_id:    Number(artisanId),
        date_rdv:      formData.date_rdv,
        duree_minutes: Number(formData.duree_minutes) || 60,
        message:       formData.message || undefined,
      });

      setSuccess(true);
      setTimeout(() => navigate('/my-appointments'), 2000);

    } catch (err) {
      if (err.errors) {
        const mapped = {};
        Object.entries(err.errors).forEach(([k, v]) => {
          mapped[k] = Array.isArray(v) ? v[0] : v;
        });
        setErrors(mapped);
      } else {
        setApiError(err.message || 'Erreur lors de la réservation.');
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

  const artisanName = atelierInfo?.nom ?? 'Artisan';

  // ── Succès ─────────────────────────────────────────────────
  if (success) return (
    <div className="flex items-center justify-center min-h-screen pt-24 pb-20" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="w-full max-w-md p-12 text-center bg-white shadow-xl rounded-2xl">
        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full"
          style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)' }}>
          <CheckCircle className="w-12 h-12" style={{ color: '#22c55e' }} />
        </div>
        <h2 className="mb-4 text-3xl font-black" style={{ color: '#2b2d42' }}>Rendez-vous demandé !</h2>
        <p className="mb-6 text-sm" style={{ color: '#6c757d' }}>
          Votre demande a été envoyée. L'artisan confirmera dans les plus brefs délais.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm" style={{ color: '#4a6fa5' }}>
          <Loader className="w-4 h-4 animate-spin" /> Redirection...
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="max-w-5xl px-4 mx-auto sm:px-6 lg:px-8">

        <button onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 mb-6 text-sm font-bold"
          style={{ color: '#4a6fa5' }}>
          <ArrowLeft className="w-4 h-4" /> Retour
        </button>

        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-semibold rounded-full"
            style={{ backgroundColor: 'rgba(74,111,165,0.1)', color: '#4a6fa5' }}>
            <Calendar className="w-4 h-4" /> Nouveau rendez-vous
          </div>
          <h1 className="mb-2 text-4xl font-black md:text-5xl" style={{ color: '#2b2d42' }}>
            Prendre un{' '}
            <span className="text-transparent bg-clip-text"
              style={{ background: 'linear-gradient(90deg, #4a6fa5, #6b8fc7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              rendez-vous
            </span>
          </h1>
          <p className="text-lg" style={{ color: '#6c757d' }}>Réservez votre créneau avec {artisanName}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* Formulaire */}
          <div className="lg:col-span-2">
            <div className="p-8 bg-white shadow-lg rounded-2xl">

              {apiError && (
                <div className="p-4 mb-6 text-sm font-semibold text-red-700 border-2 border-red-200 bg-red-50 rounded-xl">
                  ⚠️ {apiError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Date et heure */}
                <div>
                  <label className="block mb-2 text-sm font-bold" style={{ color: '#2b2d42' }}>
                    Date et heure <span style={{ color: '#ff7e5f' }}>*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="absolute w-5 h-5 -translate-y-1/2 left-4 top-1/2"
                      style={{ color: '#4a6fa5', opacity: 0.5 }} />
                    <input type="datetime-local" name="date_rdv" value={formData.date_rdv}
                      onChange={handleChange}
                      min={new Date(Date.now() + 60000).toISOString().slice(0, 16)}
                      className={`w-full h-12 pl-12 pr-4 border-2 rounded-xl outline-none transition-all ${
                        errors.date_rdv ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-400'
                      }`}
                      style={{ color: '#2b2d42' }} />
                  </div>
                  {errors.date_rdv && <p className="mt-1 text-xs text-red-500">{errors.date_rdv}</p>}

                  {/* Créneaux disponibles */}
                  {disponibilite.length > 0 && (
                    <div className="mt-3">
                      <p className="mb-2 text-xs font-semibold" style={{ color: '#6c757d' }}>Créneaux disponibles :</p>
                      <div className="flex flex-wrap gap-2">
                        {disponibilite.map((slot, i) => (
                          <button key={i} type="button"
                            onClick={() => setFormData(prev => ({ ...prev, date_rdv: slot }))}
                            className="px-3 py-1 text-xs font-bold transition-all border-2 rounded-lg"
                            style={{
                              borderColor:     formData.date_rdv === slot ? '#4a6fa5' : '#e9ecef',
                              backgroundColor: formData.date_rdv === slot ? 'rgba(74,111,165,0.1)' : 'white',
                              color: '#2b2d42',
                            }}>
                            {new Date(slot).toLocaleString('fr-FR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Durée */}
                <div>
                  <label className="block mb-2 text-sm font-bold" style={{ color: '#2b2d42' }}>
                    Durée estimée
                  </label>
                  <div className="relative">
                    <Clock className="absolute w-5 h-5 -translate-y-1/2 left-4 top-1/2"
                      style={{ color: '#4a6fa5', opacity: 0.5 }} />
                    <select name="duree_minutes" value={formData.duree_minutes} onChange={handleChange}
                      className="w-full h-12 pl-12 pr-4 border-2 border-gray-200 outline-none appearance-none rounded-xl focus:border-blue-400"
                      style={{ color: '#2b2d42' }}>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 heure</option>
                      <option value={90}>1h30</option>
                      <option value={120}>2 heures</option>
                      <option value={180}>3 heures</option>
                      <option value={240}>4 heures</option>
                      <option value={480}>Journée complète</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block mb-2 text-sm font-bold" style={{ color: '#2b2d42' }}>
                    Message pour l'artisan <span className="font-normal text-gray-400">(optionnel)</span>
                  </label>
                  <div className="relative">
                    <FileText className="absolute w-5 h-5 pointer-events-none left-4 top-4"
                      style={{ color: '#4a6fa5', opacity: 0.5 }} />
                    <textarea name="message" value={formData.message} onChange={handleChange}
                      placeholder="Décrivez brièvement votre besoin…"
                      rows={4} maxLength={1000}
                      className="w-full py-3 pl-12 pr-4 border-2 border-gray-200 outline-none resize-none rounded-xl focus:border-blue-400"
                      style={{ color: '#2b2d42' }} />
                  </div>
                  <span className="text-xs text-gray-400">{formData.message.length}/1000</span>
                </div>

                <div className="flex gap-4 pt-6 border-t" style={{ borderColor: '#e9ecef' }}>
                  <button type="button" onClick={() => navigate(-1)}
                    className="flex-1 py-3 font-bold border-2 border-gray-200 rounded-xl hover:bg-gray-50"
                    style={{ color: '#2b2d42' }}>
                    Annuler
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-1 py-3 font-bold text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ background: 'linear-gradient(135deg, #4a6fa5, #3a5784)' }}>
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                        Envoi...
                      </div>
                    ) : 'Confirmer le rendez-vous'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky p-6 bg-white shadow-lg rounded-2xl top-24">
              <h3 className="mb-4 text-lg font-bold" style={{ color: '#2b2d42' }}>Atelier sélectionné</h3>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center justify-center w-16 h-16 text-2xl font-black text-white rounded-xl"
                  style={{ background: 'linear-gradient(135deg, #4a6fa5, #3a5784)' }}>
                  {artisanName.charAt(0)}
                </div>
                <div>
                  <div className="mb-1 font-bold" style={{ color: '#2b2d42' }}>{artisanName}</div>
                  {atelierInfo?.domaine && (
                    <div className="text-sm" style={{ color: '#ff7e5f' }}>{atelierInfo.domaine}</div>
                  )}
                </div>
              </div>

              {atelierInfo?.description && (
                <p className="mb-4 text-sm" style={{ color: '#6c757d' }}>{atelierInfo.description}</p>
              )}

              <div className="p-4 space-y-3 rounded-xl" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4" style={{ color: '#4a6fa5' }} />
                  <span style={{ color: '#2b2d42' }}>Réponse sous 24h</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4" style={{ color: '#22c55e' }} />
                  <span style={{ color: '#2b2d42' }}>Professionnel vérifié</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" style={{ color: '#4a6fa5' }} />
                  <span style={{ color: '#2b2d42' }}>Annulation gratuite</span>
                </div>
              </div>

              <div className="p-4 mt-6 text-xs rounded-xl"
                style={{ backgroundColor: 'rgba(251,146,60,0.1)', color: '#fb923c' }}>
                Votre demande sera envoyée à l'artisan pour confirmation.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}