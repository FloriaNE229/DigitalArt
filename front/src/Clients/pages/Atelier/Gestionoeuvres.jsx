import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../components/Auth/AuthContext';
import { Image, Plus, Trash2, Eye, EyeOff, Upload, X } from 'lucide-react';

export default function GestionOeuvres() {
  const { accesToken } = useAuth();

  const [oeuvres,  setOeuvres]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving,   setSaving]   = useState(false);

  const [form, setForm] = useState({
    titre: '', description: '', prix_indicatif: '', visible: true, image: null,
  });
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();

  // ── Chargement
  useEffect(() => {
    const fetchOeuvres = async () => {
      try {
        const res  = await fetch('/api/mes-oeuvres', {
          headers: { Authorization: `Bearer ${accesToken}`, Accept: 'application/json' },
        });
        const data = await res.json();
        setOeuvres(data.oeuvres ?? []);
      } catch {
        setError('Erreur lors du chargement.');
      } finally {
        setLoading(false);
      }
    };
    fetchOeuvres();
  }, [accesToken]);

  const notify = (msg, type = 'success') => {
    if (type === 'success') setSuccess(msg); else setError(msg);
    setTimeout(() => { setSuccess(''); setError(''); }, 3000);
  };

  // ── Sélection image
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm(p => ({ ...p, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  // ── Ajouter oeuvre
  const handleSubmit = async () => {
    if (!form.titre || !form.image) {
      setError('Le titre et une image sont requis.');
      return;
    }
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('titre',          form.titre);
      fd.append('description',    form.description);
      fd.append('prix_indicatif', form.prix_indicatif);
      fd.append('visible',        form.visible ? '1' : '0');
      fd.append('image',          form.image);

      const res  = await fetch('/api/mes-oeuvres', {
        method: 'POST',
        headers: { Authorization: `Bearer ${accesToken}`, Accept: 'application/json' },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? 'Erreur');

      setOeuvres(prev => [data.oeuvre, ...prev]);
      setForm({ titre: '', description: '', prix_indicatif: '', visible: true, image: null });
      setPreview(null);
      setShowForm(false);
      notify('Œuvre ajoutée avec succès !');
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle visibilité
  const handleToggle = async (id) => {
    try {
      const res  = await fetch(`/api/mes-oeuvres/${id}/visibilite`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${accesToken}`, Accept: 'application/json' },
      });
      const data = await res.json();
      setOeuvres(prev => prev.map(o => o.id === id ? data.oeuvre : o));
    } catch {
      setError('Erreur lors du changement de visibilité.');
    }
  };

  // ── Supprimer
  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette œuvre ?')) return;
    try {
      await fetch(`/api/mes-oeuvres/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accesToken}` },
      });
      setOeuvres(prev => prev.filter(o => o.id !== id));
      notify('Œuvre supprimée.');
    } catch {
      setError('Erreur lors de la suppression.');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-10 h-10 border-4 border-blue-500 rounded-full animate-spin border-t-transparent" />
    </div>
  );

  return (
    <div className="max-w-4xl px-4 py-10 mx-auto mt-20">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Image className="w-7 h-7" style={{ color: 'var(--primary)' }} />
          <h1 className="text-2xl font-black" style={{ color: 'var(--dark)' }}>Mon Portfolio</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white transition-all shadow-md rounded-xl hover:shadow-lg"
          style={{ background: 'linear-gradient(135deg, #ff7e5f, #feb47b)' }}>
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? 'Annuler' : 'Ajouter une œuvre'}
        </button>
      </div>

      {error   && <div className="p-3 mb-4 text-sm text-red-700 border border-red-200 bg-red-50 rounded-xl">{error}</div>}
      {success && <div className="p-3 mb-4 text-sm text-green-700 border border-green-200 bg-green-50 rounded-xl">{success}</div>}

      {/* ── Formulaire ajout ── */}
      {showForm && (
        <div className="p-6 mb-8 bg-white shadow-sm rounded-2xl" style={{ border: '1px solid var(--gray-dark)' }}>
          <h2 className="mb-4 text-lg font-bold" style={{ color: 'var(--dark)' }}>Nouvelle œuvre</h2>

          {/* Upload image */}
          <div className="mb-4">
            <div onClick={() => fileRef.current.click()}
              className="flex flex-col items-center justify-center w-full h-40 transition-colors border-2 border-dashed cursor-pointer rounded-xl hover:bg-gray-50"
              style={{ borderColor: preview ? 'var(--primary)' : 'var(--gray-dark)' }}>
              {preview
                ? <img src={preview} alt="preview" className="object-contain h-full rounded-xl" />
                : <>
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <span className="text-sm text-gray-500">Cliquez pour choisir une image</span>
                  </>}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="col-span-2">
              <label className="block mb-1 text-xs font-semibold text-gray-500">Titre *</label>
              <input type="text" value={form.titre} onChange={e => setForm(p => ({ ...p, titre: e.target.value }))}
                placeholder="Ex: Rénovation salle de bain"
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                style={{ borderColor: 'var(--gray-dark)' }} />
            </div>
            <div className="col-span-2">
              <label className="block mb-1 text-xs font-semibold text-gray-500">Description</label>
              <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Décrivez ce travail..."
                rows={3}
                className="w-full px-3 py-2 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                style={{ borderColor: 'var(--gray-dark)' }} />
            </div>
            <div>
              <label className="block mb-1 text-xs font-semibold text-gray-500">Prix indicatif (FCFA)</label>
              <input type="number" value={form.prix_indicatif} onChange={e => setForm(p => ({ ...p, prix_indicatif: e.target.value }))}
                placeholder="Ex: 50000"
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                style={{ borderColor: 'var(--gray-dark)' }} />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.visible} onChange={e => setForm(p => ({ ...p, visible: e.target.checked }))}
                  className="w-4 h-4 rounded" />
                <span className="text-sm font-semibold" style={{ color: 'var(--dark)' }}>Visible publiquement</span>
              </label>
            </div>
          </div>

          <button onClick={handleSubmit} disabled={saving || !form.titre || !form.image}
            className="px-6 py-2.5 text-sm font-bold text-white rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))' }}>
            {saving ? 'Enregistrement...' : 'Ajouter l\'œuvre'}
          </button>
        </div>
      )}

      {/* ── Grille oeuvres ── */}
      {oeuvres.length === 0 ? (
        <div className="py-16 text-center">
          <Image className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">Aucune œuvre dans votre portfolio.</p>
          <p className="text-sm text-gray-400">Ajoutez des photos de vos réalisations !</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {oeuvres.map(oeuvre => (
            <div key={oeuvre.id} className="overflow-hidden bg-white shadow-sm rounded-xl"
              style={{ border: '1px solid var(--gray-dark)' }}>
              {/* Image */}
              <div className="relative h-48 overflow-hidden bg-gray-100">
                {oeuvre.image_url
                  ? <img src={oeuvre.image_url} alt={oeuvre.titre} className="object-cover w-full h-full" />
                  : <div className="flex items-center justify-center w-full h-full">
                      <Image className="w-10 h-10 text-gray-300" />
                    </div>}
                {!oeuvre.visible && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                    <span className="px-2 py-1 text-xs font-bold text-white bg-gray-700 rounded-lg">Masquée</span>
                  </div>
                )}
              </div>

              {/* Infos */}
              <div className="p-3">
                <h3 className="mb-1 text-sm font-bold truncate" style={{ color: 'var(--dark)' }}>{oeuvre.titre}</h3>
                {oeuvre.prix_indicatif && (
                  <p className="mb-2 text-xs font-semibold" style={{ color: '#ff7e5f' }}>
                    {Number(oeuvre.prix_indicatif).toLocaleString('fr-FR')} FCFA
                  </p>
                )}
                <div className="flex items-center gap-2">
                  <button onClick={() => handleToggle(oeuvre.id)}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-colors hover:bg-gray-50"
                    style={{ border: '1px solid var(--gray-dark)', color: oeuvre.visible ? 'var(--primary)' : 'var(--dark)' }}>
                    {oeuvre.visible ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    {oeuvre.visible ? 'Visible' : 'Masquée'}
                  </button>
                  <button onClick={() => handleDelete(oeuvre.id)}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                    <Trash2 className="w-3 h-3" />
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}