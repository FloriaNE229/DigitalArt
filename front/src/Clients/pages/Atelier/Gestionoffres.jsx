import { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Pencil, X, Check } from 'lucide-react';
import { atelierAPI, offreAPI } from '../../../../services/api';

export default function GestionOffres() {
  const [offres,   setOffres]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [success,  setSuccess]  = useState('');
  const [showForm, setShowForm] = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [editId,   setEditId]   = useState(null);

  const emptyForm = { titre: '', description: '', prix: '' };
  const [form, setForm] = useState(emptyForm);

  const notify = (msg, type = 'success') => {
    if (type === 'success') setSuccess(msg); else setError(msg);
    setTimeout(() => { setSuccess(''); setError(''); }, 3000);
  };

  // ── GET /mon-atelier → GET /ateliers/:id/offres ────────────
  useEffect(() => {
    const fetchOffres = async () => {
      try {
        const dataAtelier = await atelierAPI.monAtelier();
        const atelierId   = dataAtelier.atelier?.id ?? dataAtelier.id;

        if (!atelierId) {
          setError('Vous devez d\'abord créer votre atelier.');
          setLoading(false);
          return;
        }

        const data = await offreAPI.index(atelierId); // GET /ateliers/:id/offres
        setOffres(data.offres ?? data.data ?? []);
      } catch {
        setError('Erreur lors du chargement des offres.');
      } finally {
        setLoading(false);
      }
    };
    fetchOffres();
  }, []);

  // ── POST /offres ou PUT /offres/:id ───────────────────────
  const handleSubmit = async () => {
    if (!form.titre) { setError('Le titre est requis.'); return; }
    setSaving(true);
    try {
      const payload = {
        titre:       form.titre,
        description: form.description,
        prix:        form.prix || null,
      };

      if (editId) {
        const data = await offreAPI.update(editId, payload); // PUT /offres/:id
        setOffres(prev => prev.map(o => o.id === editId ? (data.offre ?? data) : o));
        notify('Offre mise à jour !');
      } else {
        const data = await offreAPI.store(payload);          // POST /offres
        setOffres(prev => [...prev, data.offre ?? data]);
        notify('Offre créée !');
      }

      setForm(emptyForm);
      setShowForm(false);
      setEditId(null);
    } catch (e) {
      setError(e.message || 'Erreur lors de l\'enregistrement.');
    } finally {
      setSaving(false);
    }
  };

  // ── DELETE /offres/:id ─────────────────────────────────────
  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette offre ?')) return;
    try {
      await offreAPI.destroy(id);
      setOffres(prev => prev.filter(o => o.id !== id));
      notify('Offre supprimée.');
    } catch {
      setError('Erreur lors de la suppression.');
    }
  };

  const handleEdit = (offre) => {
    setForm({ titre: offre.titre, description: offre.description ?? '', prix: offre.prix ?? '' });
    setEditId(offre.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setShowForm(false);
    setEditId(null);
    setError('');
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-10 h-10 border-4 border-blue-500 rounded-full animate-spin border-t-transparent" />
    </div>
  );

  return (
    <div className="max-w-3xl px-4 py-10 mx-auto mt-20">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Tag className="w-7 h-7" style={{ color: 'var(--primary)' }} />
          <h1 className="text-2xl font-black" style={{ color: 'var(--dark)' }}>Mes Offres</h1>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); }}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white transition-all shadow-md rounded-xl hover:shadow-lg"
          style={{ background: 'linear-gradient(135deg, #ff7e5f, #feb47b)' }}>
          {showForm && !editId ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm && !editId ? 'Annuler' : 'Nouvelle offre'}
        </button>
      </div>

      {error   && <div className="p-3 mb-4 text-sm text-red-700 border border-red-200 bg-red-50 rounded-xl">{error}</div>}
      {success && <div className="p-3 mb-4 text-sm text-green-700 border border-green-200 bg-green-50 rounded-xl">{success}</div>}

      {/* ── Formulaire ── */}
      {showForm && (
        <div className="p-6 mb-8 bg-white shadow-sm rounded-2xl" style={{ border: '1px solid var(--gray-dark)' }}>
          <h2 className="mb-4 text-lg font-bold" style={{ color: 'var(--dark)' }}>
            {editId ? 'Modifier l\'offre' : 'Nouvelle offre'}
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-xs font-semibold text-gray-500">Titre *</label>
              <input type="text" value={form.titre}
                onChange={e => setForm(p => ({ ...p, titre: e.target.value }))}
                placeholder="Ex: Installation électrique complète"
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                style={{ borderColor: 'var(--gray-dark)' }} />
            </div>

            <div>
              <label className="block mb-1 text-xs font-semibold text-gray-500">Description</label>
              <textarea value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="Décrivez votre offre en détail..."
                rows={3}
                className="w-full px-3 py-2 text-sm border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
                style={{ borderColor: 'var(--gray-dark)' }} />
            </div>

            <div>
              <label className="block mb-1 text-xs font-semibold text-gray-500">Prix (FCFA)</label>
              <input type="number" value={form.prix}
                onChange={e => setForm(p => ({ ...p, prix: e.target.value }))}
                placeholder="Laisser vide si sur devis"
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                style={{ borderColor: 'var(--gray-dark)' }} />
            </div>
          </div>

          <div className="flex gap-3 mt-5">
            <button onClick={handleSubmit} disabled={saving || !form.titre}
              className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white rounded-xl shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))' }}>
              <Check className="w-4 h-4" />
              {saving ? 'Enregistrement...' : editId ? 'Mettre à jour' : 'Créer l\'offre'}
            </button>
            <button onClick={handleCancel}
              className="px-5 py-2.5 text-sm font-semibold border rounded-xl hover:bg-gray-50 transition-colors"
              style={{ borderColor: 'var(--gray-dark)', color: 'var(--dark)' }}>
              Annuler
            </button>
          </div>
        </div>
      )}

      {/* ── Liste offres ── */}
      {offres.length === 0 ? (
        <div className="py-16 text-center">
          <Tag className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">Aucune offre créée.</p>
          <p className="text-sm text-gray-400">Créez vos offres pour attirer des clients !</p>
        </div>
      ) : (
        <div className="space-y-3">
          {offres.map(offre => (
            <div key={offre.id} className="flex items-start justify-between p-4 bg-white shadow-sm rounded-xl"
              style={{ border: '1px solid var(--gray-dark)' }}>
              <div className="flex-1 min-w-0 mr-4">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-bold truncate" style={{ color: 'var(--dark)' }}>{offre.titre}</h3>
                  {offre.prix ? (
                    <span className="flex-shrink-0 px-2 py-0.5 text-xs font-bold rounded-full"
                      style={{ backgroundColor: 'rgba(255, 126, 95, 0.1)', color: '#ff7e5f' }}>
                      {Number(offre.prix).toLocaleString('fr-FR')} FCFA
                    </span>
                  ) : (
                    <span className="flex-shrink-0 px-2 py-0.5 text-xs font-bold text-gray-500 bg-gray-100 rounded-full">
                      Sur devis
                    </span>
                  )}
                </div>
                {offre.description && (
                  <p className="text-xs text-gray-500 line-clamp-2">{offre.description}</p>
                )}
              </div>
              <div className="flex items-center flex-shrink-0 gap-2">
                <button onClick={() => handleEdit(offre)}
                  className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(offre.id)}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}