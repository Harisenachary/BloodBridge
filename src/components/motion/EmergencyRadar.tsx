import React, { useState } from 'react';
import {
  Radio,
  MapPin,
  Clock,
  Heart,
  Droplet,
  Building2,
  Sparkles,
  ShieldCheck,
  Zap,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';

interface RadarNode {
  id: string;
  type: 'REQUEST' | 'DONOR' | 'BANK';
  title: string;
  subtitle: string;
  bloodGroup: string;
  distanceKm: number;
  angleDeg: number; // 0 to 360
  distanceRatio: number; // 0.15 to 0.85
  urgency?: 'CRITICAL' | 'URGENT' | 'NORMAL';
  units?: number;
}

const mockNodes: RadarNode[] = [
  {
    id: 'req-1',
    type: 'REQUEST',
    title: 'Trauma Emergency Case #HYD-999',
    subtitle: 'Apollo Hospital Jubilee Hills',
    bloodGroup: 'O-',
    distanceKm: 2.4,
    angleDeg: 45,
    distanceRatio: 0.35,
    urgency: 'CRITICAL',
    units: 2,
  },
  {
    id: 'req-2',
    type: 'REQUEST',
    title: 'Maternal Emergency Case #HYD-318',
    subtitle: 'Care Hospital Banjara Hills',
    bloodGroup: 'A+',
    distanceKm: 5.1,
    angleDeg: 195,
    distanceRatio: 0.6,
    urgency: 'CRITICAL',
    units: 3,
  },
  {
    id: 'req-3',
    type: 'REQUEST',
    title: 'Cardiac Surgery Case #HYD-772',
    subtitle: 'KIMS Hospital Secunderabad',
    bloodGroup: 'B+',
    distanceKm: 8.7,
    angleDeg: 310,
    distanceRatio: 0.82,
    urgency: 'URGENT',
    units: 1,
  },
  {
    id: 'donor-1',
    type: 'DONOR',
    title: 'Standby Donor #DN-4402',
    subtitle: 'Madhapur Tech Zone',
    bloodGroup: 'O-',
    distanceKm: 1.8,
    angleDeg: 80,
    distanceRatio: 0.28,
  },
  {
    id: 'donor-2',
    type: 'DONOR',
    title: 'Standby Donor #DN-9011',
    subtitle: 'Gachibowli Area',
    bloodGroup: 'O+',
    distanceKm: 3.9,
    angleDeg: 135,
    distanceRatio: 0.48,
  },
  {
    id: 'donor-3',
    type: 'DONOR',
    title: 'Standby Donor #DN-1184',
    subtitle: 'Kondapur Circle',
    bloodGroup: 'AB+',
    distanceKm: 6.4,
    angleDeg: 260,
    distanceRatio: 0.72,
  },
  {
    id: 'bank-1',
    type: 'BANK',
    title: 'Red Cross Central Blood Centre',
    subtitle: 'NABH Accredited &bull; 48 Units',
    bloodGroup: 'ALL',
    distanceKm: 3.2,
    angleDeg: 15,
    distanceRatio: 0.42,
  },
  {
    id: 'bank-2',
    type: 'BANK',
    title: 'Apollo Transfusion Medicine Centre',
    subtitle: 'NABH Certified &bull; 62 Units',
    bloodGroup: 'ALL',
    distanceKm: 4.8,
    angleDeg: 220,
    distanceRatio: 0.55,
  },
];

export const EmergencyRadar: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'REQUEST' | 'DONOR' | 'BANK'>('ALL');
  const [selectedNode, setSelectedNode] = useState<RadarNode | null>(mockNodes[0]);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [maxRadiusKm, setMaxRadiusKm] = useState(15);

  const filteredNodes = mockNodes.filter((node) => {
    const matchesType = activeFilter === 'ALL' || node.type === activeFilter;
    const matchesDistance = node.distanceKm <= maxRadiusKm;
    return matchesType && matchesDistance;
  });

  const handleSimulateSOS = () => {
    setIsBroadcasting(true);
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.7 },
      colors: ['#F43F5E', '#E11D48', '#FDA4AF', '#FFFFFF'],
    });

    toast.success('Emergency Distress Beacon Broadcasted!', {
      description: `Targeting 5 verified standby donors within ${maxRadiusKm} km radius.`,
    });

    setTimeout(() => setIsBroadcasting(false), 3000);
  };

  return (
    <div className="rounded-3xl bg-slate-950 text-white border border-rose-900/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      {/* Background radial gradient aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header telemetry */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-bold">
            <Radio className="w-3.5 h-3.5 animate-pulse text-rose-400" />
            <span>Tactical Live Emergency Grid Radar</span>
          </div>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl tracking-tight text-white">
            Real-Time Distress Beacon &amp; Dispatch Scanner
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            Live interactive telemetry visualizing critical blood requests, standby verified donors, and certified hospital banks within active response radius.
          </p>
        </div>

        {/* SOS Action Button */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSimulateSOS}
            disabled={isBroadcasting}
            className={`btn-primary px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-transform ${
              isBroadcasting ? 'scale-95 brightness-90 animate-pulse' : 'hover:scale-105'
            }`}
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>{isBroadcasting ? 'Broadcasting Grid SOS...' : 'Simulate SOS Distress Beacon'}</span>
          </button>
        </div>
      </div>

      {/* Control bar */}
      <div className="relative z-10 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80">
        {/* Node Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Layer:
          </span>
          <button
            type="button"
            onClick={() => setActiveFilter('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === 'ALL'
                ? 'bg-white text-slate-900 font-extrabold shadow-sm'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
            }`}
          >
            All Active Nodes ({mockNodes.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('REQUEST')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeFilter === 'REQUEST'
                ? 'bg-rose-500 text-white font-extrabold shadow-md shadow-rose-900/40'
                : 'bg-slate-900 text-rose-300 hover:bg-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
            Emergency Cases (3)
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('DONOR')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeFilter === 'DONOR'
                ? 'bg-emerald-500 text-white font-extrabold shadow-md shadow-emerald-900/40'
                : 'bg-slate-900 text-emerald-300 hover:bg-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Standby Donors (3)
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter('BANK')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              activeFilter === 'BANK'
                ? 'bg-blue-500 text-white font-extrabold shadow-md shadow-blue-900/40'
                : 'bg-slate-900 text-blue-300 hover:bg-slate-800'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            Blood Banks (2)
          </button>
        </div>

        {/* Range Slider */}
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-400 text-[11px] font-bold">Scanning Radius:</span>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="5"
              max="25"
              step="5"
              value={maxRadiusKm}
              onChange={(e) => setMaxRadiusKm(Number(e.target.value))}
              className="accent-rose-500 w-24 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span className="font-mono font-bold text-rose-400 text-xs w-12 text-right">
              {maxRadiusKm} km
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Radar Screen & Inspector */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-6">
        {/* Radar Circular Display (7 Cols) */}
        <div className="lg:col-span-7 flex justify-center">
          <div className="relative w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] rounded-full border-2 border-rose-500/30 bg-slate-950/90 shadow-[0_0_50px_rgba(225,29,72,0.2)] flex items-center justify-center overflow-hidden">
            {/* Concentric rings */}
            <div className="absolute w-[80%] h-[80%] rounded-full border border-rose-500/20" />
            <div className="absolute w-[55%] h-[55%] rounded-full border border-rose-500/20" />
            <div className="absolute w-[30%] h-[30%] rounded-full border border-rose-500/25" />

            {/* Distance labels */}
            <span className="absolute top-[10%] text-[10px] font-mono font-bold text-rose-500/60">
              {maxRadiusKm} KM
            </span>
            <span className="absolute top-[23%] text-[9px] font-mono font-bold text-rose-500/50">
              {Math.round(maxRadiusKm * 0.6)} KM
            </span>
            <span className="absolute top-[35%] text-[9px] font-mono font-bold text-rose-500/50">
              {Math.round(maxRadiusKm * 0.3)} KM
            </span>

            {/* Axis crosshairs */}
            <div className="absolute w-full h-[1px] bg-rose-500/15" />
            <div className="absolute h-full w-[1px] bg-rose-500/15" />

            {/* Center Origin Beacon */}
            <div className="absolute w-6 h-6 rounded-full bg-rose-500/20 border border-rose-400 flex items-center justify-center shadow-lg shadow-rose-500/40 z-20">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-400 animate-pulse" />
            </div>

            {/* Rotating 360-degree radar sweep beam */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none origin-center"
              style={{
                background: 'conic-gradient(from 0deg, rgba(244, 63, 94, 0.4) 0deg, rgba(244, 63, 94, 0.05) 45deg, transparent 60deg)',
                animation: 'radarSweep 4s linear infinite',
              }}
            />

            {/* Interactive Node Blips */}
            {filteredNodes.map((node) => {
              // Convert angle and ratio to X, Y coordinates
              const rad = (node.angleDeg * Math.PI) / 180;
              // Normalize distance to radar radius (approx 160px for sm, 210px for lg)
              const maxPx = 180;
              const rPx = node.distanceRatio * maxPx;
              const x = Math.cos(rad) * rPx;
              const y = Math.sin(rad) * rPx;

              const isSelected = selectedNode?.id === node.id;

              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setSelectedNode(node)}
                  className={`absolute z-30 transition-transform -translate-x-1/2 -translate-y-1/2 p-1 rounded-full group focus:outline-none ${
                    isSelected ? 'scale-125 z-40' : 'hover:scale-125'
                  }`}
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                  }}
                  title={`${node.title} (${node.distanceKm} km)`}
                >
                  {/* Blip glow ring */}
                  <span
                    className={`absolute -inset-1.5 rounded-full animate-ping opacity-60 ${
                      node.type === 'REQUEST'
                        ? 'bg-rose-500'
                        : node.type === 'DONOR'
                        ? 'bg-emerald-500'
                        : 'bg-blue-500'
                    }`}
                  />

                  {/* Blip core dot */}
                  <div
                    className={`relative w-4 h-4 rounded-full flex items-center justify-center font-bold text-[9px] shadow-lg border-2 ${
                      node.type === 'REQUEST'
                        ? 'bg-rose-600 border-white text-white'
                        : node.type === 'DONOR'
                        ? 'bg-emerald-500 border-white text-slate-900'
                        : 'bg-blue-500 border-white text-white'
                    }`}
                  >
                    {node.bloodGroup.slice(0, 2)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Node Detail Card & Inspector (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-rose-400" />
              Target Node Telemetry Inspector
            </span>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/40">
              Live Signal 99.4%
            </span>
          </div>

          {selectedNode ? (
            <div className="bg-slate-900/90 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
              {/* Node Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-mono font-extrabold text-base shadow-lg ${
                      selectedNode.type === 'REQUEST'
                        ? 'bg-gradient-to-br from-rose-500 to-red-700 text-white shadow-rose-900/50'
                        : selectedNode.type === 'DONOR'
                        ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 text-slate-950 shadow-emerald-900/50'
                        : 'bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-blue-900/50'
                    }`}
                  >
                    {selectedNode.bloodGroup}
                  </div>
                  <div>
                    <span
                      className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full inline-block mb-1 ${
                        selectedNode.type === 'REQUEST'
                          ? 'bg-rose-950 text-rose-400 border border-rose-800'
                          : selectedNode.type === 'DONOR'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-blue-950 text-blue-400 border border-blue-800'
                      }`}
                    >
                      {selectedNode.type === 'REQUEST'
                        ? 'Emergency Blood Need'
                        : selectedNode.type === 'DONOR'
                        ? 'Standby Voluntary Donor'
                        : 'Accredited Blood Bank'}
                    </span>
                    <h3 className="font-heading font-extrabold text-base text-white">
                      {selectedNode.title}
                    </h3>
                  </div>
                </div>
              </div>

              {/* Node Specs */}
              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-950/70 p-3.5 rounded-xl border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Distance</span>
                  <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    {selectedNode.distanceKm} km away
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Estimated Pace</span>
                  <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    ~{Math.round(selectedNode.distanceKm * 2.8)} mins dispatch
                  </span>
                </div>
                {selectedNode.units && (
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Units Required</span>
                    <span className="font-bold text-rose-400 mt-0.5 block">{selectedNode.units} Units</span>
                  </div>
                )}
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Verification</span>
                  <span className="font-semibold text-emerald-400 flex items-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Clinical Verified
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-400">
                Location: <strong className="text-slate-200">{selectedNode.subtitle}</strong>
              </p>

              {/* Action */}
              <div className="pt-2">
                {selectedNode.type === 'REQUEST' ? (
                  <button
                    type="button"
                    onClick={() => {
                      confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
                      toast.success(`Pledged volunteer response for ${selectedNode.title}!`);
                    }}
                    className="w-full btn-primary text-xs py-2.5 rounded-xl font-bold flex items-center justify-center gap-2"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>I Can Donate Blood Here &rarr;</span>
                  </button>
                ) : selectedNode.type === 'DONOR' ? (
                  <button
                    type="button"
                    onClick={() => toast.success(`Pinging ${selectedNode.title} via secure relay.`)}
                    className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Radio className="w-4 h-4" />
                    <span>Send In-App Emergency Alert</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => toast.success(`Connecting with ${selectedNode.title} dispatch desk.`)}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>Check Live Inventory Units</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/60 rounded-2xl p-8 text-center border border-slate-800 text-slate-400 text-xs">
              Click any glowing radar blip to inspect distance, urgency, and live dispatch options.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
