'use client';

import { Database } from "lucide-react";
import { memo } from "react";

const TICKER = (
  <>
    <div className="flex items-center gap-2">
      <span className="status-dot" />
      <span>CORE_AGENT: ONLINE (24ms)</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="status-dot" />
      <span>ZATCA_GATEWAY: SYNCED</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="status-dot" />
      <span>VISION_MODEL: PROCESSING</span>
    </div>
    <div className="flex items-center gap-2 text-[#165DFF]">
      <Database className="w-3 h-3" />
      <span>LOCAL_CACHE: OPTIMAL</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="status-dot" />
      <span>PDPL_VAULT: SECURE</span>
    </div>
  </>
);

export const TelemetryBar = memo(function TelemetryBar() {
  return (
    <div className="w-full bg-[#030303] border-b border-white/5 py-2 overflow-hidden flex items-center shrink-0">
      <div className="flex w-max animate-marquee items-center gap-10 px-4 text-xs font-mono text-[#666] will-change-transform">
        <div className="flex gap-10 items-center">{TICKER}</div>
        <div className="flex gap-10 items-center" aria-hidden>{TICKER}</div>
      </div>
    </div>
  );
});
