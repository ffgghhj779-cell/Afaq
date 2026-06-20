export function TopographicLines() {
  return (
    <div className="absolute inset-0 pointer-events-none z-[-1] overflow-hidden opacity-5">
      <svg className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M0,50 Q25,25 50,50 T100,50" fill="none" stroke="currentColor" strokeWidth="0.1" />
        <path d="M0,45 Q25,20 50,45 T100,45" fill="none" stroke="currentColor" strokeWidth="0.1" />
        <path d="M0,55 Q25,30 50,55 T100,55" fill="none" stroke="currentColor" strokeWidth="0.1" />
        <path d="M0,40 Q25,15 50,40 T100,40" fill="none" stroke="currentColor" strokeWidth="0.1" />
        <path d="M0,60 Q25,35 50,60 T100,60" fill="none" stroke="currentColor" strokeWidth="0.1" />
        <path d="M0,35 Q25,10 50,35 T100,35" fill="none" stroke="currentColor" strokeWidth="0.1" />
        <path d="M0,65 Q25,40 50,65 T100,65" fill="none" stroke="currentColor" strokeWidth="0.1" />
        <path d="M0,70 Q25,45 50,70 T100,70" fill="none" stroke="currentColor" strokeWidth="0.1" />
        <path d="M0,30 Q25,5 50,30 T100,30" fill="none" stroke="currentColor" strokeWidth="0.1" />
        <path d="M0,25 Q25,0 50,25 T100,25" fill="none" stroke="currentColor" strokeWidth="0.1" />
        <path d="M0,75 Q25,50 50,75 T100,75" fill="none" stroke="currentColor" strokeWidth="0.1" />
        <path d="M0,80 Q25,55 50,80 T100,80" fill="none" stroke="currentColor" strokeWidth="0.1" />
        {/* Additional lines for more organic feel */}
        <path d="M0,50 Q20,30 60,60 T100,40" fill="none" stroke="currentColor" strokeWidth="0.05" />
        <path d="M0,55 Q30,20 70,50 T100,30" fill="none" stroke="currentColor" strokeWidth="0.05" />
      </svg>
    </div>
  );
}
