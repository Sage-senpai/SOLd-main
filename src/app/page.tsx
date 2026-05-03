import Link from 'next/link';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden text-sold-gray-900">
      <div className="nascent-bg" aria-hidden="true" />
      <div className="sigil-field" aria-hidden="true" />

      <nav className="section-shell sticky top-4 z-50 pt-4">
        <div className="ink-panel flex items-center justify-between px-4 py-3 md:px-6">
          <span className="font-eldritch text-xl font-bold">SOLd.</span>
          <span className="hidden font-mono text-xs uppercase text-sold-gray-600 md:inline">
            Operational App
          </span>
        </div>
      </nav>

      <section className="section-shell relative z-10 flex min-h-[calc(100vh-12rem)] items-center justify-center pt-16 pb-24 appear">
        <div className="ink-panel w-full max-w-3xl p-10 md:p-14 text-center">
          <div className="glyph-badge mx-auto mb-6">
            Decentralized Sales Guild · Solana
          </div>
          <h1 className="shadow-word font-eldritch text-5xl font-bold leading-tight md:text-6xl">
            Earn. Prove. Scale.
          </h1>

          <div className="rune-rule my-8" />

          <p className="mx-auto max-w-xl text-base text-sold-gray-700 md:text-lg">
            The operational layer of the SOLd. Protocol. Pick your portal to
            begin.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/driver" className="btn-primary">
              Enter Driver Hub
            </Link>
            <Link href="/client" className="btn-secondary">
              Launch Campaign
            </Link>
            <Link href="/admin" className="btn-secondary">
              Admin Access
            </Link>
          </div>
        </div>
      </section>

      <footer className="section-shell relative z-10 pb-10 pt-8">
        <div className="border-t border-sold-gray-900 pt-6 flex justify-between items-center font-mono text-xs uppercase">
          <span>SOLd. Protocol</span>
          <span>v0.1 · Internal</span>
        </div>
      </footer>
    </main>
  );
}
