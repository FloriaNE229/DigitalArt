import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Store, MapPin, Briefcase, FileText, Image,
  ChevronLeft, Loader, CheckCircle, Trash2, AlertTriangle
} from 'lucide-react';
import { atelierAPI } from '../../../../services/api';

const DOMAINES = [
  'Plomberie', 'Électricité', 'Menuiserie', 'Peinture', 'Maçonnerie',
  'Couture', 'Coiffure', 'Mécanique', 'Électronique', 'Jardinage',
  'Nettoyage', 'Cuisine', 'Photographie', 'Informatique', 'Autre',
];

function StatusBadge({ status }) {
  if (!status) return null;
  const config = {
    approved: { label: '✓ Approuvé',   cls: 'bg-green-100 text-green-700'   },
    rejected: { label: '✗ Rejeté',     cls: 'bg-red-100 text-red-700'       },
    pending:  { label: '⏳ En attente', cls: 'bg-yellow-100 text-yellow-700' },
  };
  const c = config[status] ?? config.pending;
  return <span className={`px-3 py-1 text-sm font-bold rounded-full ${c.cls}`}>{c.label}</span>;
}

export default function EditAtelier() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nom:          '',
    domaine:      '',
    localisation: '',
    description:  '',
  });

  const [imageFile,    setImageFile]    = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading,      setLoading]      = useState(false);
  const [fetching,     setFetching]     = useState(true);
  const [success,      setSuccess]      = useState(false);
  const [errors,       setErrors]       = useState({});
  const [apiError,     setApiError]     = useState(null);
  const [showDelete,   setShowDelete]   = useState(false);
  const [deleting,     setDeleting]     = useState(false);
  const [statusBadge,  setStatusBadge]  = useState(null);

  // ── GET /mon-atelier ───────────────────────────────────────
  useEffect(() => {
    const fetchAtelier = async () => {
      setFetching(true);
      try {
        const data    = await atelierAPI.monAtelier();
        const atelier = data.atelier ?? data;

        setForm({
          nom:          atelier.nom          ?? '',
          domaine:      atelier.domaine      ?? '',
          localisation: atelier.localisation ?? '',
          description:  atelier.description  ?? '',
        });
        setImagePreview(atelier.image_url ?? atelier.image_principale ?? null);
        setStatusBadge(atelier.verification_status ?? null);
      } catch (e) {
        setApiError(e.message || 'Atelier introuvable.');
      } finally {
        setFetching(false);
      }
    };
    fetchAtelier();
  }, []);

  const validate = () => {
    const e = {};
    if (!form.nom.trim())          e.nom          = 'Le nom est requis';
    if (!form.domaine)             e.domaine      = 'Le domaine est requis';
    if (!form.localisation.trim()) e.localisation = 'La localisation est requise';
    if (!form.description.trim())  e.description  = 'La description est requise';
    else if (form.description.trim().length < 20)
      e.description = 'Description trop courte (min 20 caractères)';
    return e;
  };

  // ── POST /mon-atelier/update (FormData) ───────────────────
  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    setLoading(true);
    setApiError(null);

    try {
      const formData = new FormData();
      formData.append('nom',          form.nom.trim());
      formData.append('domaine',      form.domaine);
      formData.append('localisation', form.localisation.trim());
      formData.append('description',  form.description.trim());
      if (imageFile) formData.append('image_principale', imageFile);

      await atelierAPI.update(formData); // POST /mon-atelier/update

      setSuccess(true);
      setTimeout(() => navigate('/profile'), 2000);

    } catch (err) {
      if (err.errors) {
        const mapped = {};
        Object.entries(err.errors).forEach(([k, v]) => {
          mapped[k] = Array.isArray(v) ? v[0] : v;
        });
        setErrors(mapped);
      } else {
        setApiError(err.message || 'Une erreur est survenue.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Suppression — non disponible côté back ─────────────────
  const handleDelete = async () => {
    setDeleting(true);
    try {
      setApiError('La suppression d\'atelier n\'est pas encore disponible. Contactez un administrateur.');
      setShowDelete(false);
    } finally {
      setDeleting(false);
    }
  };

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // ── États de rendu ─────────────────────────────────────────
  if (fetching) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader className="w-10 h-10 animate-spin" style={{ color: '#4a6fa5' }} />
    </div>
  );

  if (apiError && !form.nom) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <p className="font-semibold text-red-600">⚠️ {apiError}</p>
      <Link to="/profile" className="px-6 py-3 font-bold text-white rounded-xl"
        style={{ background: 'linear-gradient(135deg, #4a6fa5, #3a5784)' }}>
        Retour au profil
      </Link>
    </div>
  );

  if (success) return (
    <div className="flex items-center justify-center min-h-screen"
      style={{ background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)' }}>
      <div className="max-w-sm p-10 mx-4 text-center bg-white shadow-xl rounded-2xl">
        <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full"
          style={{ backgroundColor: 'rgba(34,197,94,0.1)' }}>
          <CheckCircle className="w-10 h-10" style={{ color: '#22c55e' }} />
        </div>
        <h2 className="mb-2 text-2xl font-black" style={{ color: '#2b2d42' }}>Atelier mis à jour !</h2>
        <p className="mb-4 text-gray-500">
          Vos modifications sont en attente de validation par un administrateur.
        </p>
        <div className="flex items-center justify-center gap-2 text-sm" style={{ color: '#4a6fa5' }}>
          <Loader className="w-4 h-4 animate-spin" /> Redirection...
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-20"
      style={{ background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)' }}>
      <div className="max-w-2xl px-4 mx-auto sm:px-6">

        <div className="mb-6">
          <Link to="/profile" className="inline-flex items-center gap-2 text-sm font-bold"
            style={{ color: '#4a6fa5' }}>
            <ChevronLeft className="w-4 h-4" /> Retour au profil
          </Link>
        </div>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="mb-2 text-3xl font-black" style={{ color: '#2b2d42' }}>
              Modifier mon atelier
            </h1>
            <div className="flex items-center gap-3">
              <p className="text-gray-500">Mettez à jour les informations de votre atelier</p>
              <StatusBadge status={statusBadge} />
            </div>
          </div>
        </div>

        {statusBadge === 'approved' && (
          <div className="flex items-start gap-3 p-4 mb-6 border-2 rounded-xl"
            style={{ backgroundColor: 'rgba(251,191,36,0.05)', borderColor: 'rgba(251,191,36,0.3)' }}>
            <AlertTriangle className="flex-shrink-0 w-5 h-5 mt-0.5 text-yellow-500" />
            <p className="text-sm text-yellow-700">
              Toute modification repassera votre atelier en attente de validation.
            </p>
          </div>
        )}

        {apiError && form.nom && (
          <div className="p-4 mb-6 text-sm font-semibold text-red-700 border-2 border-red-200 bg-red-50 rounded-xl">
            ⚠️ {apiError}
          </div>
        )}

        <div className="p-8 bg-white shadow-xl rounded-2xl">
          <div className="space-y-6">

            {/* Nom */}
            <div>
              <label className="block mb-2 text-sm font-bold" style={{ color: '#2b2d42' }}>
                Nom de l'atelier <span style={{ color: '#ff7e5f' }}>*</span>
              </label>
              <div className="relative">
                <Store className="absolute w-5 h-5 -translate-y-1/2 pointer-events-none left-4 top-1/2"
                  style={{ color: '#4a6fa5', opacity: 0.5 }} />
                <input type="text" value={form.nom}
                  onChange={(e) => handleChange('nom', e.target.value)}
                  placeholder="Ex: Atelier Kouassi Plomberie" maxLength={255}
                  className={`w-full h-12 pl-12 pr-4 border-2 rounded-xl outline-none transition-all ${
                    errors.nom ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-400'
                  }`}
                  style={{ color: '#2b2d42' }} />
              </div>
              {errors.nom && <p className="mt-1 text-xs text-red-500">{errors.nom}</p>}
            </div>

            {/* Domaine */}
            <div>
              <label className="block mb-2 text-sm font-bold" style={{ color: '#2b2d42' }}>
                Domaine <span style={{ color: '#ff7e5f' }}>*</span>
              </label>
              <div className="relative">
                <Briefcase className="absolute w-5 h-5 -translate-y-1/2 pointer-events-none left-4 top-1/2"
                  style={{ color: '#4a6fa5', opacity: 0.5 }} />
                <select value={form.domaine} onChange={(e) => handleChange('domaine', e.target.value)}
                  className={`w-full h-12 pl-12 pr-4 border-2 rounded-xl outline-none appearance-none transition-all ${
                    errors.domaine ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-400'
                  }`}
                  style={{ color: form.domaine ? '#2b2d42' : '#9ca3af' }}>
                  <option value="">Sélectionnez un domaine</option>
                  {DOMAINES.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              {errors.domaine && <p className="mt-1 text-xs text-red-500">{errors.domaine}</p>}
            </div>

            {/* Localisation */}
            <div>
              <label className="block mb-2 text-sm font-bold" style={{ color: '#2b2d42' }}>
                Localisation <span style={{ color: '#ff7e5f' }}>*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute w-5 h-5 -translate-y-1/2 pointer-events-none left-4 top-1/2"
                  style={{ color: '#4a6fa5', opacity: 0.5 }} />
                <input type="text" value={form.localisation}
                  onChange={(e) => handleChange('localisation', e.target.value)}
                  placeholder="Ex: Cotonou, Bénin" maxLength={255}
                  className={`w-full h-12 pl-12 pr-4 border-2 rounded-xl outline-none transition-all ${
                    errors.localisation ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-400'
                  }`}
                  style={{ color: '#2b2d42' }} />
              </div>
              {errors.localisation && <p className="mt-1 text-xs text-red-500">{errors.localisation}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 text-sm font-bold" style={{ color: '#2b2d42' }}>
                Description <span style={{ color: '#ff7e5f' }}>*</span>
              </label>
              <div className="relative">
                <FileText className="absolute w-5 h-5 pointer-events-none left-4 top-4"
                  style={{ color: '#4a6fa5', opacity: 0.5 }} />
                <textarea value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Décrivez vos services, votre expérience..." rows={5}
                  className={`w-full pl-12 pr-4 py-3 border-2 rounded-xl outline-none resize-none transition-all ${
                    errors.description ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-400'
                  }`}
                  style={{ color: '#2b2d42' }} />
              </div>
              <div className="flex items-center justify-between mt-1">
                {errors.description
                  ? <p className="text-xs text-red-500">{errors.description}</p>
                  : <span />}
                <span className="text-xs text-gray-400">{form.description.length} caractères</span>
              </div>
            </div>

            {/* Image */}
            <div>
              <label className="block mb-2 text-sm font-bold" style={{ color: '#2b2d42' }}>
                Image principale <span className="font-normal text-gray-400">(optionnel)</span>
              </label>
              <label className="flex items-center gap-2 px-4 py-3 text-sm font-bold transition-all border-2 border-dashed cursor-pointer rounded-xl hover:border-blue-400"
                style={{ borderColor: '#d1d5db', color: '#4a6fa5' }}>
                <Image className="w-5 h-5" />
                {imageFile ? imageFile.name : 'Changer l\'image'}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
              {imagePreview && (
                <div className="h-40 mt-3 overflow-hidden rounded-xl">
                  <img src={imagePreview} alt="Aperçu" className="object-cover w-full h-full"
                    onError={(e) => { e.target.style.display = 'none'; }} />
                </div>
              )}
              <p className="mt-1 text-xs text-gray-400">Formats acceptés : JPG, PNG, WEBP (max 4 Mo)</p>
            </div>

          </div>

          <div className="flex gap-4 mt-8">
            <Link to="/profile" className="flex-1">
              <button className="w-full py-3 font-bold transition-all border-2 border-gray-200 rounded-xl hover:bg-gray-50"
                style={{ color: '#2b2d42' }}>
                Annuler
              </button>
            </Link>
            <button onClick={handleSubmit} disabled={loading}
              className="flex items-center justify-center flex-1 gap-2 py-3 font-bold text-white transition-all rounded-xl hover:shadow-lg hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{ background: 'linear-gradient(135deg, #ff7e5f, #feb47b)' }}>
              {loading
                ? <><Loader className="w-5 h-5 animate-spin" /> Enregistrement...</>
                : <><Store className="w-5 h-5" /> Enregistrer</>}
            </button>
          </div>
        </div>

        {/* Zone danger */}
        <div className="p-6 mt-6 bg-white border-2 border-red-100 shadow-lg rounded-2xl">
          <h3 className="mb-2 text-lg font-bold text-red-600">Zone de danger</h3>
          <p className="mb-4 text-sm text-gray-500">
            Pour supprimer votre atelier, veuillez contacter un administrateur.
          </p>
          {!showDelete ? (
            <button onClick={() => setShowDelete(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 transition-all border-2 border-red-200 rounded-xl hover:bg-red-50">
              <Trash2 className="w-4 h-4" /> Supprimer mon atelier
            </button>
          ) : (
            <div className="p-4 border-2 border-red-200 bg-red-50 rounded-xl">
              <p className="mb-4 text-sm font-semibold text-red-700">
                ⚠️ Cette action est irréversible. Êtes-vous sûr ?
              </p>
              <div className="flex gap-3">
                <button onClick={() => setShowDelete(false)}
                  className="flex-1 py-2 text-sm font-bold transition-all border-2 border-gray-200 rounded-xl hover:bg-gray-50"
                  style={{ color: '#2b2d42' }}>
                  Annuler
                </button>
                <button onClick={handleDelete} disabled={deleting}
                  className="flex items-center justify-center flex-1 gap-2 py-2 text-sm font-bold text-white transition-all bg-red-500 rounded-xl hover:bg-red-600 disabled:opacity-60">
                  {deleting
                    ? <><Loader className="w-4 h-4 animate-spin" /> Suppression...</>
                    : <><Trash2 className="w-4 h-4" /> Confirmer</>}
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}