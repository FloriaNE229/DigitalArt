import { useState, useEffect } from 'react';
import { useAuth } from '../../components/Auth/AuthContext';
import { Clock, Plus, Trash2, ToggleLeft, ToggleRight, Save } from 'lucide-react';

const JOURS = [
  { id: 1, nom: 'Lundi' },
  { id: 2, nom: 'Mardi' },
  { id: 3, nom: 'Mercredi' },
  { id: 4, nom: 'Jeudi' },
  { id: 5, nom: 'Vendredi' },
  { id: 6, nom: 'Samedi' },
  { id: 0, nom: 'Dimanche' },
];

export default function GestionHoraires() {
  const { accesToken } = useAuth();

  const [horaires,      setHoraires]      = useState({});
  const [indispos,      setIndispos]      = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [saving,        setSaving]        = useState(false);
  const [error,         setError]         = useState('');
  const [success,       setSuccess]       = useState('');
  const [newIndispo,    setNewIndispo]    = useState({ date_debut: '', date_fin: '', motif: '' });
  const [addingIndispo, setAddingIndispo] = useState(false);

  // ── Chargement initial
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const headers = {
          Accept: 'application/json',
          Authorization: `Bearer ${accesToken}`,
        };
        const [resH, resI] = await Promise.all([
          fetch('/api/horaires',       { headers }),
          fetch('/api/indisponibilites', { headers }),
        ]);
        const dataH = await resH.json();
        const dataI = await resI.json();

        // Construire un objet { jour_semaine: horaire }
        const map = {};
        JOURS.forEach(j => {
          map[j.id] = { jour_semaine: j.id, heure_debut: '08:00', heure_fin: '17:00', actif: false };
        });
        (dataH.horaires ?? []).forEach(h => { map[h.jour_semaine] = h; });
        setHoraires(map);
        setIndispos(dataI.indisponibilites ?? []);
      } catch {
        setError('Erreur lors du chargement des horaires.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [accesToken]);

  // ── Sauvegarder les horaires
  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('/api/horaires', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${accesToken}`,
        },
        body: JSON.stringify({ horaires: Object.values(horaires) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? 'Erreur');
      setSuccess('Horaires sauvegardés avec succès !');
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Toggle jour
  const toggleJour = (jour) => {
    setHoraires(prev => ({
      ...prev,
      [jour]: { ...prev[jour], actif: !prev[jour].actif },
    }));
  };

  // ── Modifier heure
  const setHeure = (jour, field, value) => {
    setHoraires(prev => ({
      ...prev,
      [jour]: { ...prev[jour], [field]: value },
    }));
  };

  // ── Ajouter indisponibilité
  const handleAddIndispo = async () => {
    if (!newIndispo.date_debut || !newIndispo.date_fin) return;
    setAddingIndispo(true);
    try {
      const res = await fetch('/api/indisponibilites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${accesToken}`,
        },
        body: JSON.stringify(newIndispo),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? 'Erreur');
      setIndispos(prev => [...prev, data.indisponibilite]);
      setNewIndispo({ date_debut: '', date_fin: '', motif: '' });
      setSuccess('Indisponibilité ajoutée !');
      setTimeout(() => setSuccess(''), 3000);
    } catch (e) {
      setError(e.message);
    } finally {
      setAddingIndispo(false);
    }
  };

  // ── Supprimer indisponibilité
  const handleDeleteIndispo = async (id) => {
    try {
      await fetch(`/api/indisponibilites/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${accesToken}` },
      });
      setIndispos(prev => prev.filter(i => i.id !== id));
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
    <div className="max-w-3xl px-4 py-10 mx-auto mt-20">
      <div className="flex items-center gap-3 mb-8">
        <Clock className="w-7 h-7" style={{ color: 'var(--primary)' }} />
        <h1 className="text-2xl font-black" style={{ color: 'var(--dark)' }}>Mes Horaires</h1>
      </div>

      {error   && <div className="p-3 mb-4 text-sm text-red-700 border border-red-200 bg-red-50 rounded-xl">{error}</div>}
      {success && <div className="p-3 mb-4 text-sm text-green-700 border border-green-200 bg-green-50 rounded-xl">{success}</div>}

      {/* ── Horaires par jour ── */}
      <div className="p-6 mb-8 bg-white shadow-sm rounded-2xl" style={{ border: '1px solid var(--gray-dark)' }}>
        <h2 className="mb-5 text-lg font-bold" style={{ color: 'var(--dark)' }}>Jours et heures de travail</h2>
        <div className="space-y-3">
          {JOURS.map(jour => {
            const h = horaires[jour.id] ?? { actif: false, heure_debut: '08:00', heure_fin: '17:00' };
            return (
              <div key={jour.id} className={`flex items-center gap-4 p-3 rounded-xl transition-colors ${h.actif ? 'bg-blue-50' : 'bg-gray-50'}`}>
                {/* Toggle */}
                <button onClick={() => toggleJour(jour.id)} className="flex-shrink-0">
                  {h.actif
                    ? <ToggleRight className="w-8 h-8" style={{ color: 'var(--primary)' }} />
                    : <ToggleLeft  className="w-8 h-8 text-gray-400" />}
                </button>

                {/* Nom du jour */}
                <span className={`w-24 text-sm font-semibold ${h.actif ? '' : 'text-gray-400'}`}
                  style={h.actif ? { color: 'var(--dark)' } : {}}>
                  {jour.nom}
                </span>

                {/* Heures */}
                {h.actif ? (
                  <div className="flex items-center flex-1 gap-2">
                    <input type="time" value={h.heure_debut}
                      onChange={e => setHeure(jour.id, 'heure_debut', e.target.value)}
                      className="px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                      style={{ borderColor: 'var(--gray-dark)' }} />
                    <span className="text-sm text-gray-400">→</span>
                    <input type="time" value={h.heure_fin}
                      onChange={e => setHeure(jour.id, 'heure_fin', e.target.value)}
                      className="px-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                      style={{ borderColor: 'var(--gray-dark)' }} />
                  </div>
                ) : (
                  <span className="flex-1 text-sm text-gray-400">Fermé</span>
                )}
              </div>
            );
          })}
        </div>

        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 mt-6 text-sm font-bold text-white rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))' }}>
          <Save className="w-4 h-4" />
          {saving ? 'Sauvegarde...' : 'Sauvegarder les horaires'}
        </button>
      </div>

      {/* ── Indisponibilités ── */}
      <div className="p-6 bg-white shadow-sm rounded-2xl" style={{ border: '1px solid var(--gray-dark)' }}>
        <h2 className="mb-5 text-lg font-bold" style={{ color: 'var(--dark)' }}>Indisponibilités</h2>

        {/* Liste */}
        {indispos.length === 0 ? (
          <p className="mb-4 text-sm text-gray-500">Aucune indisponibilité planifiée.</p>
        ) : (
          <div className="mb-4 space-y-2">
            {indispos.map(i => (
              <div key={i.id} className="flex items-center justify-between p-3 border border-red-100 bg-red-50 rounded-xl">
                <div>
                  <span className="text-sm font-semibold text-red-700">
                    {new Date(i.date_debut).toLocaleDateString('fr-FR')} → {new Date(i.date_fin).toLocaleDateString('fr-FR')}
                  </span>
                  {i.motif && <p className="text-xs text-red-500 mt-0.5">{i.motif}</p>}
                </div>
                <button onClick={() => handleDeleteIndispo(i.id)}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Formulaire ajout */}
        <div className="p-4 border-2 border-dashed rounded-xl" style={{ borderColor: 'var(--gray-dark)' }}>
          <h3 className="mb-3 text-sm font-bold" style={{ color: 'var(--dark)' }}>Ajouter une indisponibilité</h3>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block mb-1 text-xs font-semibold text-gray-500">Date début</label>
              <input type="date" value={newIndispo.date_debut}
                onChange={e => setNewIndispo(p => ({ ...p, date_debut: e.target.value }))}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                style={{ borderColor: 'var(--gray-dark)' }} />
            </div>
            <div>
              <label className="block mb-1 text-xs font-semibold text-gray-500">Date fin</label>
              <input type="date" value={newIndispo.date_fin}
                onChange={e => setNewIndispo(p => ({ ...p, date_fin: e.target.value }))}
                className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                style={{ borderColor: 'var(--gray-dark)' }} />
            </div>
          </div>
          <input type="text" placeholder="Motif (optionnel)" value={newIndispo.motif}
            onChange={e => setNewIndispo(p => ({ ...p, motif: e.target.value }))}
            className="w-full px-3 py-2 mb-3 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            style={{ borderColor: 'var(--gray-dark)' }} />
          <button onClick={handleAddIndispo} disabled={addingIndispo || !newIndispo.date_debut || !newIndispo.date_fin}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white transition-all rounded-lg shadow-md hover:shadow-lg disabled:opacity-50"
            style={{ backgroundColor: '#ff7e5f' }}>
            <Plus className="w-4 h-4" />
            {addingIndispo ? 'Ajout...' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  );
}