import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { passwordAPI } from '../../../../services/api';

export default function ForgotPassword() {
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');
  const [success, setSuccess] = useState(false);

  // ── POST /auth/forgot-password ─────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email)                       { setError('Email requis'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Email invalide'); return; }

    setLoading(true);
    setError('');

    try {
      await passwordAPI.forgotPassword({ email });
      setSuccess(true);
    } catch (err) {
      setError(err.message || "Erreur lors de l'envoi. Vérifiez l'email saisi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4" style={{ backgroundColor: '#f8f9fa' }}>
      <div className="w-full max-w-md mx-auto">

        <div className="mb-4 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-full" style={{
            backgroundColor: 'rgba(74, 111, 165, 0.1)',
            color: '#4a6fa5',
            border: '1px solid rgba(74, 111, 165, 0.2)'
          }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: '#ff7e5f' }} />
            Réinitialisation de mot de passe
          </span>
        </div>

        <div className="p-8 shadow-lg rounded-xl" style={{ border: '1px solid #e9ecef', backgroundColor: 'white' }}>

          {!success ? (
            <>
              <div className="mb-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 mx-auto mb-4 shadow-md rounded-2xl"
                  style={{ background: 'linear-gradient(135deg, #4a6fa5, #3a5784)' }}>
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h2 className="mb-2 text-2xl font-bold" style={{ color: '#ff7e5f' }}>
                  Mot de passe oublié ?
                </h2>
                <p className="text-sm" style={{ color: '#2b2d42', opacity: 0.7 }}>
                  Entrez votre email pour recevoir un lien de réinitialisation
                </p>
              </div>

              {error && (
                <div className="p-3 mb-4 text-sm rounded-lg"
                  style={{ backgroundColor: 'rgba(255, 126, 95, 0.1)', borderLeft: '4px solid #ff7e5f' }}>
                  <p className="font-medium" style={{ color: '#ff7e5f' }}>{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label className="block mb-2 text-sm font-medium" style={{ color: '#2b2d42' }}>
                    Adresse email
                  </label>
                  <div className="relative">
                    <Mail className="absolute w-5 h-5 -translate-y-1/2 left-3 top-1/2" style={{ color: '#ff7e5f' }} />
                    <input type="email" value={email}
                      onChange={(e) => { setEmail(e.target.value); setError(''); }}
                      placeholder="exemple@email.com"
                      className="w-full py-3 pr-4 text-sm transition-all border rounded-lg outline-none pl-11 focus:ring-2"
                      style={{ borderColor: '#e9ecef', backgroundColor: '#f8f9fa', color: '#2b2d42' }}
                      onFocus={(e)  => e.target.style.borderColor = '#4a6fa5'}
                      onBlur={(e)   => e.target.style.borderColor = '#e9ecef'}
                      required />
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-3 text-sm font-semibold text-white rounded-lg disabled:opacity-50 transition-all hover:shadow-lg hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(135deg, #4a6fa5, #3a5784)' }}>
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
                      Envoi en cours...
                    </div>
                  ) : 'Envoyer le lien de réinitialisation'}
                </button>
              </form>

              <div className="pt-5 mt-5 text-center border-t" style={{ borderColor: '#e9ecef' }}>
                <Link to="/login"
                  className="inline-flex items-center gap-2 text-sm font-medium transition-all hover:underline"
                  style={{ color: '#4a6fa5' }}>
                  <ArrowLeft className="w-4 h-4" /> Retour à la connexion
                </Link>
              </div>
            </>
          ) : (
            <div className="py-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-2xl"
                style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)' }}>
                <CheckCircle className="w-8 h-8" style={{ color: '#22c55e' }} />
              </div>
              <h2 className="mb-2 text-2xl font-bold" style={{ color: '#2b2d42' }}>Email envoyé !</h2>
              <p className="mb-6 text-sm leading-relaxed" style={{ color: '#2b2d42', opacity: 0.7 }}>
                Un lien de réinitialisation a été envoyé à<br />
                <strong className="text-base">{email}</strong>
              </p>
              <Link to="/login">
                <button className="w-full py-3 text-sm font-semibold text-white rounded-lg transition-all hover:shadow-lg hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(135deg, #4a6fa5, #3a5784)' }}>
                  Retour à la connexion
                </button>
              </Link>
            </div>
          )}
        </div>

        <p className="mt-4 text-xs text-center" style={{ color: '#ff7e5f', opacity: 0.5 }}>
          Vous n'avez pas reçu l'email ? Vérifiez vos spams
        </p>
      </div>
    </div>
  );
}