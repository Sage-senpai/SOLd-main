import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-sold-gray-900 text-sold-gray-100 flex flex-col">
      <nav className="border-b border-sold-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="text-2xl font-bold text-sold-primary font-eldritch">
            SOLd.
          </span>
          <span className="text-sold-gray-500 text-xs uppercase tracking-wider">
            Operational App
          </span>
        </div>
      </nav>

      <section className="flex-1 flex items-center justify-center px-6 py-16 appear">
        <div className="max-w-3xl text-center">
          <p className="text-sold-gray-500 text-xs uppercase tracking-[0.2em] mb-4">
            Decentralized Sales Guild · Solana
          </p>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 font-eldritch">
            Earn. Prove. Scale.
          </h1>
          <p className="text-sold-gray-400 text-lg mb-10 max-w-xl mx-auto">
            The operational layer of the SOLd. Protocol. Pick your portal to get
            started.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
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

      <footer className="border-t border-sold-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-6 flex justify-between items-center text-sold-gray-500 text-xs uppercase tracking-wider">
          <span>SOLd. Protocol</span>
          <span>v0.1 · Internal</span>
        </div>
      </footer>
    </main>
  );
}
