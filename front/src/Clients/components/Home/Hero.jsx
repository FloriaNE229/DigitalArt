export default function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center pt-24" style={{ background: 'linear-gradient(135deg, var(--gray) 0%, var(--light) 50%, var(--gray) 100%)' }}>
      <div className="w-full max-w-6xl px-4 py-16 mx-auto sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-sm font-semibold rounded-full" style={{ backgroundColor: 'rgba(74, 111, 165, 0.1)', color: 'var(--primary)' }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--accent)' }}></span>
            Plateforme N°1 des artisans locaux
          </div>

          <h1 className="mb-6 text-4xl font-black leading-tight md:text-5xl lg:text-6xl" style={{ color: 'var(--dark)' }}>
            L'excellence de l'artisanat
            <br />
            <span className="text-transparent bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text" style={{ background: 'linear-gradient(90deg, var(--primary), var(--primary-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              à portée de main
            </span>
          </h1>

          <p className="max-w-2xl mx-auto mb-12 text-lg md:text-xl" style={{ color: 'var(--dark)', opacity: 0.7 }}>
            La plateforme de confiance qui connecte les particuliers aux meilleurs professionnels du bâtiment pour des projets réussis.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 mb-12 text-sm" style={{ color: 'var(--dark)' }}>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" style={{ color: '#ff7e5f' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Artisans vérifiés</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" style={{ color: '#ff7e5f' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Paiement sécurisé</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" style={{ color: '#ff7e5f' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <span>Service 5 étoiles</span>
            </div>
          </div>


        </div>
      </div>
    </section>
  );
}