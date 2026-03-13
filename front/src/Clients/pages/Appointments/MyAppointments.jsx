import { useState, useEffect, useCallback } from 'react';
import { Calendar, Clock, MapPin, Phone, CheckCircle, XCircle, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { rendezVousAPI } from '../../../../services/api';

const STATUS_STYLES = {
  EN_ATTENTE: { bg: 'rgba(251,146,60,0.1)',  color: '#fb923c', icon: Clock,       label: 'En attente' },
  ACCEPTE:    { bg: 'rgba(74,111,165,0.1)',  color: '#4a6fa5', icon: CheckCircle, label: 'Confirmé'   },
  REFUSE:     { bg: 'rgba(239,68,68,0.1)',   color: '#ef4444', icon: XCircle,     label: 'Refusé'     },
  ANNULE:     { bg: 'rgba(107,114,128,0.1)', color: '#6b7280', icon: XCircle,     label: 'Annulé'     },
};

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // ── GET /rendez-vous ───────────────────────────────────────
  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await rendezVousAPI.index(); // GET /rendez-vous
      const list = data.rendez_vous ?? data.data ?? data ?? [];
      setAppointments(Array.isArray(list) ? list : []);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des rendez-vous.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAppointments(); }, [fetchAppointments]);

  // ── PATCH /rendez-vous/{id}/annuler ───────────────────────
  const handleCancel = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) return;
    try {
      await rendezVousAPI.annuler(id);
      fetchAppointments();
    } catch (err) {
      alert(err.message || 'Impossible d\'annuler ce rendez-vous.');
    }
  };

  const getStatusBadge = (status) => {
    const s = STATUS_STYLES[status] ?? STATUS_STYLES.EN_ATTENTE;
    const Icon = s.icon;
    return (
      <div className="inline-flex items-center gap-1 px-3 py-1 text-xs font-bold rounded-full"
        style={{ backgroundColor: s.bg, color: s.color }}>
        <Icon className="w-3 h-3" />{s.label}
      </div>
    );
  };

  const filtered = filterStatus === 'all'
    ? appointments
    : appointments.filter(a => (a.statut ?? a.status) === filterStatus);

  const now      = new Date();
  const upcoming = filtered.filter(a => new Date(a.date_heure ?? a.date) >= now);
  const past     = filtered.filter(a => new Date(a.date_heure ?? a.date) < now);

  const formatDate = (rdv) => {
    const d = rdv.date_heure ? new Date(rdv.date_heure) : null;
    return d
      ? d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })
      : rdv.date ?? '—';
  };
  const formatTime = (rdv) => {
    const d = rdv.date_heure ? new Date(rdv.date_heure) : null;
    return d
      ? d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      : rdv.heure ?? '—';
  };

  return (
    <div className="min-h-screen pt-24 pb-20" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-semibold rounded-full"
            style={{ backgroundColor: 'rgba(74,111,165,0.1)', color: '#4a6fa5' }}>
            <Calendar className="w-4 h-4" />
            {filtered.length} rendez-vous
          </div>
          <h1 className="mb-4 text-4xl font-black md:text-5xl" style={{ color: '#2b2d42' }}>
            Mes <span className="text-transparent bg-clip-text"
              style={{ background: 'linear-gradient(90deg, #4a6fa5, #6b8fc7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              rendez-vous
            </span>
          </h1>
          <Link to="/appointments/book">
            <button className="inline-flex items-center gap-2 px-6 py-3 font-bold text-white rounded-xl"
              style={{ background: 'linear-gradient(135deg, #4a6fa5, #3a5784)' }}>
              <Calendar className="w-5 h-5" /> Prendre un rendez-vous
            </button>
          </Link>
        </div>

        {/* Filtres */}
        <div className="p-4 mb-8 bg-white shadow-md rounded-xl">
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'all',        label: 'Tous',       count: appointments.length },
              { value: 'EN_ATTENTE', label: 'En attente', count: appointments.filter(a => (a.statut ?? a.status) === 'EN_ATTENTE').length },
              { value: 'ACCEPTE',    label: 'Confirmés',  count: appointments.filter(a => (a.statut ?? a.status) === 'ACCEPTE').length },
            ].map(f => (
              <button key={f.value} onClick={() => setFilterStatus(f.value)}
                className="px-4 py-2 text-sm font-bold transition-all rounded-lg"
                style={{
                  backgroundColor: filterStatus === f.value ? '#4a6fa5' : 'white',
                  color:           filterStatus === f.value ? 'white'   : '#2b2d42',
                  border: `2px solid ${filterStatus === f.value ? '#4a6fa5' : '#e9ecef'}`
                }}>
                {f.label} ({f.count})
              </button>
            ))}
          </div>
        </div>

        {/* Erreur */}
        {error && (
          <div className="p-4 mb-6 text-sm font-semibold text-red-700 border-2 border-red-200 bg-red-50 rounded-xl">
            ⚠️ {error}
            <button onClick={fetchAppointments} className="ml-4 underline">Réessayer</button>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">

            {/* À venir */}
            {upcoming.length > 0 && (
              <div>
                <h2 className="flex items-center gap-2 mb-4 text-2xl font-bold" style={{ color: '#2b2d42' }}>
                  <Calendar className="w-6 h-6" style={{ color: '#4a6fa5' }} />
                  À venir ({upcoming.length})
                </h2>
                <div className="space-y-4">
                  {upcoming.map(rdv => {
                    const statut      = rdv.statut ?? rdv.status ?? 'EN_ATTENTE';
                    const artisan     = rdv.artisan ?? {};
                    const artisanName = artisan.prenom && artisan.nom
                      ? `${artisan.prenom} ${artisan.nom}`
                      : artisan.name ?? 'Artisan';

                    return (
                      <div key={rdv.id} className="p-6 bg-white shadow-md rounded-xl"
                        style={{ border: '1px solid #e9ecef' }}>
                        <div className="flex flex-col gap-6 md:flex-row">
                          <div className="flex items-center justify-center flex-shrink-0 w-20 h-20 text-2xl font-black text-white rounded-xl"
                            style={{ background: 'linear-gradient(135deg, #4a6fa5, #3a5784)' }}>
                            {artisanName.charAt(0)}
                          </div>

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="mb-1 text-xl font-bold" style={{ color: '#2b2d42' }}>{artisanName}</h3>
                                <p className="mb-1 text-sm font-semibold" style={{ color: '#ff7e5f' }}>
                                  {artisan.specialite ?? ''}
                                </p>
                                <p className="text-sm" style={{ color: '#6c757d' }}>
                                  {rdv.description ?? rdv.motif ?? ''}
                                </p>
                              </div>
                              {getStatusBadge(statut)}
                            </div>

                            <div className="grid grid-cols-1 gap-4 p-4 mb-4 rounded-lg md:grid-cols-3"
                              style={{ backgroundColor: '#f8f9fa' }}>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4" style={{ color: '#4a6fa5' }} />
                                <div>
                                  <div className="text-xs" style={{ color: '#6c757d' }}>Date</div>
                                  <div className="text-sm font-bold" style={{ color: '#2b2d42' }}>{formatDate(rdv)}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4" style={{ color: '#4a6fa5' }} />
                                <div>
                                  <div className="text-xs" style={{ color: '#6c757d' }}>Heure</div>
                                  <div className="text-sm font-bold" style={{ color: '#2b2d42' }}>{formatTime(rdv)}</div>
                                </div>
                              </div>
                              {rdv.adresse && (
                                <div className="flex items-center gap-2">
                                  <MapPin className="w-4 h-4" style={{ color: '#4a6fa5' }} />
                                  <div>
                                    <div className="text-xs" style={{ color: '#6c757d' }}>Lieu</div>
                                    <div className="text-sm font-bold" style={{ color: '#2b2d42' }}>{rdv.adresse}</div>
                                  </div>
                                </div>
                              )}
                            </div>

                            <div className="flex gap-3">
                              <Link to={`/appointment/${rdv.id}`}>
                                <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold border-2 rounded-xl"
                                  style={{ borderColor: '#4a6fa5', color: '#4a6fa5' }}>
                                  <Eye className="w-4 h-4" /> Détails
                                </button>
                              </Link>
                              {statut === 'ACCEPTE' && (
                                <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white rounded-xl"
                                  style={{ background: 'linear-gradient(135deg, #4a6fa5, #3a5784)' }}>
                                  <Phone className="w-4 h-4" /> Contacter
                                </button>
                              )}
                              {['EN_ATTENTE', 'ACCEPTE'].includes(statut) && (
                                <button onClick={() => handleCancel(rdv.id)}
                                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold border-2 border-red-200 rounded-xl"
                                  style={{ color: '#ef4444' }}>
                                  Annuler
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Passés */}
            {past.length > 0 && (
              <div>
                <h2 className="flex items-center gap-2 mb-4 text-2xl font-bold"
                  style={{ color: '#2b2d42', opacity: 0.7 }}>
                  <Clock className="w-6 h-6" /> Passés ({past.length})
                </h2>
                <div className="space-y-4 opacity-75">
                  {past.map(rdv => {
                    const artisan     = rdv.artisan ?? {};
                    const artisanName = artisan.prenom && artisan.nom
                      ? `${artisan.prenom} ${artisan.nom}`
                      : artisan.name ?? 'Artisan';
                    return (
                      <div key={rdv.id} className="p-6 bg-white shadow-md rounded-xl"
                        style={{ border: '1px solid #e9ecef' }}>
                        <div className="flex items-center gap-6">
                          <div className="flex items-center justify-center flex-shrink-0 text-xl font-black text-white w-14 h-14 rounded-xl"
                            style={{ background: 'linear-gradient(135deg, #4a6fa5, #3a5784)' }}>
                            {artisanName.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <h4 className="mb-1 text-lg font-bold" style={{ color: '#2b2d42' }}>{artisanName}</h4>
                            <p className="text-sm" style={{ color: '#6c757d' }}>
                              {formatDate(rdv)} à {formatTime(rdv)}
                            </p>
                          </div>
                          <Link to={`/reviews/write/${artisan.id ?? rdv.artisan_id}`}>
                            <button className="px-4 py-2 text-sm font-bold border-2 rounded-xl"
                              style={{ borderColor: '#ff7e5f', color: '#ff7e5f' }}>
                              Laisser un avis
                            </button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Aucun */}
            {filtered.length === 0 && (
              <div className="py-20 text-center bg-white shadow-md rounded-xl">
                <div className="flex items-center justify-center w-20 h-20 mx-auto mb-6 rounded-full"
                  style={{ backgroundColor: 'rgba(74,111,165,0.1)' }}>
                  <Calendar className="w-10 h-10" style={{ color: '#4a6fa5' }} />
                </div>
                <h3 className="mb-3 text-2xl font-bold" style={{ color: '#2b2d42' }}>Aucun rendez-vous</h3>
                <p className="mb-6 text-sm" style={{ color: '#6c757d' }}>Vous n'avez pas encore de rendez-vous prévu</p>
                <Link to="/appointments/book">
                  <button className="px-6 py-3 font-bold text-white rounded-xl"
                    style={{ background: 'linear-gradient(135deg, #4a6fa5, #3a5784)' }}>
                    Prendre un rendez-vous
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}