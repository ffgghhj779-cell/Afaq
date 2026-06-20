export default function Loading() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden">
      <div className="noise-overlay" />

      <div className="flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="text-2xl font-light tracking-[0.3em] uppercase text-white font-[family-name:var(--font-serif)] opacity-60">
          AFAQ
        </div>

        {/* Loader bar */}
        <div className="w-48 h-[1px] bg-white/5 relative overflow-hidden">
          <div
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-transparent via-[#165DFF] to-transparent w-1/3"
            style={{ animation: 'loading-sweep 1.5s ease-in-out infinite' }}
          />
        </div>

        <style>{`
          @keyframes loading-sweep {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(450%); }
          }
        `}</style>
      </div>
    </div>
  );
}
