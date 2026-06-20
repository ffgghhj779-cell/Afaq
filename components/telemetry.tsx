'use client';

import { Activity, ShieldCheck, Database, RefreshCw, Cpu } from "lucide-react";

export function TelemetryBar() {
  return (
    <div className="w-full bg-[#030303] border-b border-white/5 py-2 overflow-hidden flex items-center shrink-0">
      <div className="flex w-max animate-marquee items-center gap-10 px-4 text-xs font-mono text-[#666]">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex gap-10 items-center">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>CORE_AGENT: ONLINE (24ms)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>ZATCA_GATEWAY: SYNCED</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>VISION_MODEL: PROCESSING</span>
            </div>
            <div className="flex items-center gap-2 text-[#165DFF]">
              <Database className="w-3 h-3" />
              <span>LOCAL_CACHE: OPTIMAL</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>PDPL_VAULT: SECURE</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
