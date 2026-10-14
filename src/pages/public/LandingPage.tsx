import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Droplet,
  Heart,
  ShieldCheck,
  Search,
  Building2,
  ArrowRight,
  Lock,
  PhoneCall,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Activity,
  Users,
  Clock,
  Filter,
  Share2,
  Copy,
  Check,
  X,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  MapPin,
  Send,
  Calendar,
  Radio,
  Zap,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { demoStore } from '@/lib/demo/demoStore';
import { useAuth } from '@/context/AuthContext';
import { BloodGroup, BloodRequest, BloodComponent, UrgencyLevel } from '@/types';
import { CompatibilityBadge } from '@/components/common/CompatibilityBadge';
import { FreshnessIndicator } from '@/components/common/FreshnessIndicator';

// Motion graphics & feature components
import { motion, AnimatePresence } from 'framer-motion';
import { BloodMotionCanvas } from '@/components/motion/BloodMotionCanvas';
import { ECGWaveMonitor } from '@/components/motion/ECGWaveMonitor';
import { EmergencyRadar } from '@/components/motion/EmergencyRadar';
import { EmergencySlider } from '@/components/features/EmergencySlider';
import { ScrollReveal } from '@/components/motion/ScrollReveal';
import { BloodMatrixVisualizer } from '@/components/features/BloodMatrixVisualizer';
import { AITriageCalculator } from '@/components/features/AITriageCalculator';
import { QuickEligibilityWidget } from '@/components/features/QuickEligibilityWidget';
import { BloodAvailabilityDashboard } from '@/components/features/BloodAvailabilityDashboard';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { role, setDemoPersona } = useAuth();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState<
    'feed' | 'radar' | 'matrix' | 'triage' | 'eligibility' | 'banks' | 'donors'
  >('feed');
  const [selectedGroup, setSelectedGroup] = useState<BloodGroup | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [trackingTokenInput, setTrackingTokenInput] = useState('');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [urgencyFilter, setUrgencyFilter] = useState<'ALL' | 'CRITICAL_IMMEDIATE'>('ALL');

  // Fast Intake Card State
  const [quickGroup, setQuickGroup] = useState<BloodGroup>('O-');
  const [quickCity, setQuickCity] = useState('Hyderabad');
  const [quickUnits, setQuickUnits] = useState(2);
  const [quickComponent, setQuickComponent] = useState<BloodComponent>('PACKED_RED_CELLS');
  const [isSubmittingQuick, setIsSubmittingQuick] = useState(false);

  // Modal State
  const [pledgeModalRequest, setPledgeModalRequest] = useState<BloodRequest | null>(null);

  const bloodGroups: BloodGroup[] = ['O-', 'O+', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

  // Live mock store data
  const requests = demoStore.getRequests();
  const inventory = demoStore.getInventory();
  const organizations = demoStore.getOrganizations();
  const donors = demoStore.getDonors();

  const totalVerifiedUnits = inventory.reduce((acc, curr) => acc + curr.units_available, 0);
  const totalVerifiedOrgs = organizations.filter((o) => o.verification_status === 'VERIFIED').length;
  const activeRequestsCount = requests.filter((r) => r.status !== 'FULFILLED' && r.status !== 'CANCELLED').length;
  const readyDonorsCount = donors.filter((d) => d.availability?.status === 'AVAILABLE').length;

  // Filtered requests
  const filteredRequests = requests.filter((req) => {
    const matchesGroup = selectedGroup === 'ALL' || req.blood_group === selectedGroup;
    const matchesUrgency = urgencyFilter === 'ALL' || req.urgency === urgencyFilter;
    const matchesSearch =
      !searchQuery.trim() ||
      req.patient_ref_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.hospital_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.hospital_city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.public_token.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesUrgency && matchesSearch;
  });

  // Filtered blood banks
  const filteredBanks = organizations.filter((org) => {
    return (
      !searchQuery.trim() ||
      org.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.org_type.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Handle Copy Token
  const handleCopyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    toast.success('Tracking token copied to clipboard', {
      description: token,
    });
    setTimeout(() => setCopiedToken(null), 2500);
  };

  // Share case via Web Share API or copy
  const handleShareCase = (req: BloodRequest) => {
    const text = `🚨 URGENT BLOOD NEED: ${req.blood_group} (${req.units_needed} Units) needed for ${req.patient_ref_name} at ${req.hospital_name}, ${req.hospital_city}. Track & Donate securely on BloodBridge: Token ${req.public_token}`;
    if (navigator.share) {
      navigator.share({
        title: `Urgent Blood Need - ${req.blood_group}`,
        text: text,
        url: window.location.origin,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Urgent case broadcast copied to clipboard!', {
        description: 'You can now paste and share this on WhatsApp, Twitter, or hospital groups.',
      });
    }
  };

  // Handle Track Navigation
  const handleTrackSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!trackingTokenInput.trim()) {
      toast.error('Please enter a tracking token');
      return;
    }
    navigate(`/request-status/${encodeURIComponent(trackingTokenInput.trim())}`);
  };

  // Handle Quick Intake Submit
  const handleQuickIntakeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingQuick(true);

    try {
      const created = await demoStore.createRequest({
        patient_ref_name: `Urgent Case #${quickCity.slice(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        blood_group: quickGroup,
        component: quickComponent,
        units_needed: quickUnits,
        urgency: 'CRITICAL_IMMEDIATE',
        required_by_date: new Date(Date.now() + 3600000 * 12).toISOString(),
        hospital_name: `${quickCity} Emergency Hospital`,
        hospital_city: quickCity,
        hospital_state: quickCity === 'Hyderabad' ? 'Telangana' : quickCity === 'Bengaluru' ? 'Karnataka' : 'National',
        hospital_locality: 'Central Trauma Care',
        requester_relationship: 'Emergency Intake Coordinator',
        contact_phone: '+91 98765 43210',
        communication_preference: 'IN_APP',
        verification_notes: 'Rapid intake via Dashboard Command Center.',
        consent_obtained: true,
      });

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });

      toast.success('Emergency Request Dispatched!', {
        description: `Tracking Token: ${created.public_token}`,
      });

      navigate(`/request-status/${created.public_token}`);
    } catch {
      toast.error('Failed to submit emergency request.');
    } finally {
      setIsSubmittingQuick(false);
    }
  };

  // Handle Pledge Response
  const handleConfirmPledge = () => {
    if (!pledgeModalRequest) return;
    confetti({
      particleCount: 90,
      spread: 70,
      origin: { y: 0.5 },
    });
    toast.success('Voluntary Donor Match Confirmed!', {
      description: `Hospital coordinator for ${pledgeModalRequest.patient_ref_name} has been notified.`,
    });
    setPledgeModalRequest(null);
  };

  return (
    <div className="relative min-h-screen">
      {/* 1. BACKGROUND MOTION GRAPHICS: Floating Erythrocyte Canvas */}
      <BloodMotionCanvas />

      <div className="relative z-10 max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {/* 2. TOP ANNOUNCEMENT & TELEMETRY PULSE */}
        <ScrollReveal direction="down">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 px-4 rounded-2xl bg-white/90 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200/80 dark:border-rose-900/40 shadow-xs">
            <div className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-200">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-600"></span>
              </span>
              <span className="font-bold text-rose-700 dark:text-rose-400 tracking-wide uppercase text-[11px]">
                Live Emergency Blood Grid
              </span>
              <span className="hidden md:inline text-slate-300 dark:text-slate-700">|</span>
              <span className="hidden md:inline text-slate-500 dark:text-slate-400 text-[11px]">
                Real-time voluntary matching active across verified hospital nodes
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs">
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50/80 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-200/80 dark:border-emerald-800/60 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                Zero Contact Exposure
              </span>
              <a
                href="tel:108"
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-900 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 px-2.5 py-0.5 rounded-full border border-amber-200/80 dark:border-amber-800/60 transition-colors"
              >
                <PhoneCall className="w-3 h-3 text-amber-700 dark:text-amber-400" />
                Ambulance 108
              </a>
            </div>
          </div>
        </ScrollReveal>

        {/* 3. HERO COMMAND HEADER: LIGHT, CLEAN, MINIMAL & ADAPTIVE */}
        <ScrollReveal direction="up" delay={0.05}>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-rose-50/25 to-slate-50 dark:from-[#0c0f1d] dark:via-[#1c0f2f] dark:to-[#0a1128] border border-slate-200/90 dark:border-rose-500/40 p-8 sm:p-10 text-slate-900 dark:text-white shadow-[0_4px_30px_rgba(15,23,42,0.04)] dark:shadow-[0_25px_60px_-15px_rgba(255,0,85,0.35)] transition-all">
            {/* Ambient luminous glow circles */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 dark:bg-rose-600/30 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-600/25 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-4 max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 dark:bg-rose-950/90 border border-rose-200/80 dark:border-rose-400 text-rose-700 dark:text-rose-300 text-xs font-extrabold tracking-wide shadow-xs">
                  <Droplet className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
                  <span>India&apos;s Verified Life-Saving Coordination Network</span>
                </div>

                <h1 className="font-heading font-extrabold text-3xl sm:text-5xl tracking-tight leading-tight text-slate-900 dark:text-white">
                  Save Lives in Seconds. <br />
                  <span className="bg-gradient-to-r from-rose-600 via-rose-500 to-pink-500 bg-clip-text text-transparent font-black">
                    Every Drop Counts.
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                  Connecting urgent patients with voluntary blood donors and certified hospital blood banks with <strong>zero contact harvesting</strong> and instant real-time telemetry. Simple, safe, and transparent.
                </p>

                {/* 3-Step Simple Flow Explainer */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50/90 dark:bg-white/10 border border-slate-200/80 dark:border-white/15">
                    <span className="w-6 h-6 rounded-lg bg-rose-500 text-white font-extrabold flex items-center justify-center text-xs shadow-sm shadow-rose-500/30">
                      1
                    </span>
                    <span className="text-slate-700 dark:text-white font-medium">Submit Urgent Need</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50/90 dark:bg-white/10 border border-slate-200/80 dark:border-white/15">
                    <span className="w-6 h-6 rounded-lg bg-cyan-600 text-white font-extrabold flex items-center justify-center text-xs shadow-sm shadow-cyan-600/30">
                      2
                    </span>
                    <span className="text-slate-700 dark:text-white font-medium">Live Radar Auto-Match</span>
                  </div>
                  <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50/90 dark:bg-white/10 border border-slate-200/80 dark:border-white/15">
                    <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-extrabold flex items-center justify-center text-xs shadow-sm shadow-emerald-600/30">
                      3
                    </span>
                    <span className="text-slate-700 dark:text-white font-medium">Safe Hospital Transfusion</span>
                  </div>
                </div>
              </div>

              {/* High-Impact Hero Call To Actions */}
              <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                <a
                  href="#blood-availability-engine"
                  className="btn-primary text-sm px-7 py-4 rounded-2xl gap-2.5 font-black shadow-md hover:scale-102 transition-transform flex items-center justify-center text-center"
                >
                  <Search className="w-5 h-5" />
                  <span>🔍 Find Blood &amp; Reserve Units</span>
                </a>

                <Link
                  to="/request-blood"
                  className="btn-secondary text-sm px-7 py-3.5 rounded-2xl gap-2 font-bold hover:scale-102 transition-transform border-slate-200 dark:border-rose-700 flex items-center justify-center text-center"
                >
                  <Droplet className="w-5 h-5 text-rose-500 fill-rose-500" />
                  <span>🚨 Post Emergency Request</span>
                </Link>

                <Link
                  to="/register"
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 hover:bg-emerald-500/20 border border-emerald-400/50 text-xs font-bold text-emerald-700 dark:text-emerald-300 transition-colors shadow-xs"
                >
                  <Heart className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                  <span>❤️ Register as Voluntary Donor</span>
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* 4. REAL-TIME ECG CARDIAC MONITOR BANNER (Motion Graphics) */}
        <ScrollReveal direction="up" delay={0.1}>
          <ECGWaveMonitor />
        </ScrollReveal>

        {/* 4.5 INTERACTIVE ANIMATED EMERGENCY BROADCAST SLIDER */}
        <ScrollReveal direction="up" delay={0.12}>
          <EmergencySlider
            requests={requests}
            onPledge={(req) => setPledgeModalRequest(req)}
          />
        </ScrollReveal>

        {/* 5. CORE BLOOD AVAILABILITY, COMPREHENSIVE STATISTICS & 1-CLICK RESERVATION DASHBOARD */}
        <ScrollReveal direction="up" delay={0.14}>
          <BloodAvailabilityDashboard />
        </ScrollReveal>

        {/* 6. MASTER OPERATION NAVIGATION TABS (Vibrant, Distinct Theme Per Tab) */}
        <div className="bg-white dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-4 border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_12px_rgba(15,23,42,0.03)] space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            {/* Tab navigation pills with animated sliding indicator */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 dark:bg-slate-950/90 rounded-xl overflow-x-auto scrollbar-none border border-slate-200/60 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('feed')}
                className={`relative px-4 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 z-10 ${
                  activeTab === 'feed'
                    ? 'text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {activeTab === 'feed' && (
                  <motion.div
                    layoutId="activeTabSlider"
                    className="absolute inset-0 bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 rounded-lg shadow-sm -z-10"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <Activity className="w-3.5 h-3.5" />
                <span>Live Emergency Feed</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === 'feed'
                      ? 'bg-white/25 text-white'
                      : 'bg-rose-50 dark:bg-red-950 text-rose-600 dark:text-rose-300'
                  }`}
                >
                  {requests.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('radar')}
                className={`relative px-4 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 z-10 ${
                  activeTab === 'radar'
                    ? 'text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {activeTab === 'radar' && (
                  <motion.div
                    layoutId="activeTabSlider"
                    className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg shadow-sm -z-10"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <Radio className="w-3.5 h-3.5 animate-pulse" />
                <span>Live Distress Radar</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    activeTab === 'radar'
                      ? 'bg-white/25 text-white'
                      : 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                  }`}
                >
                  Live
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('matrix')}
                className={`relative px-4 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 z-10 ${
                  activeTab === 'matrix'
                    ? 'text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {activeTab === 'matrix' && (
                  <motion.div
                    layoutId="activeTabSlider"
                    className="absolute inset-0 bg-gradient-to-r from-rose-600 to-pink-600 rounded-lg shadow-sm -z-10"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <Droplet className="w-3.5 h-3.5" />
                <span>Compatibility Visualizer</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('triage')}
                className={`relative px-4 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 z-10 ${
                  activeTab === 'triage'
                    ? 'text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {activeTab === 'triage' && (
                  <motion.div
                    layoutId="activeTabSlider"
                    className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-sm -z-10"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Urgency Triage</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('eligibility')}
                className={`relative px-4 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 z-10 ${
                  activeTab === 'eligibility'
                    ? 'text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {activeTab === 'eligibility' && (
                  <motion.div
                    layoutId="activeTabSlider"
                    className="absolute inset-0 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-lg shadow-sm -z-10"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>30s Eligibility Checker</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('banks')}
                className={`relative px-4 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 z-10 ${
                  activeTab === 'banks'
                    ? 'text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {activeTab === 'banks' && (
                  <motion.div
                    layoutId="activeTabSlider"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg shadow-sm -z-10"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
                <Building2 className="w-3.5 h-3.5" />
                <span>Blood Banks ({organizations.length})</span>
              </button>
            </div>

            {/* Global Search Bar */}
            <div className="relative min-w-[260px]">
              <Search className="w-4 h-4 text-rose-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search hospital, city, case..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs rounded-xl pl-9 pr-8 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950 focus:bg-white dark:focus:bg-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 focus:outline-none transition-all text-charcoal-900 dark:text-white"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-rose-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Group & Urgency Filter Row (for feed tab) */}
          {activeTab === 'feed' && (
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider mr-1">
                  Group:
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedGroup('ALL')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                    selectedGroup === 'ALL'
                      ? 'bg-gradient-to-r from-slate-900 to-slate-800 dark:from-white dark:to-slate-200 text-white dark:text-slate-950 shadow-md scale-105'
                      : 'bg-slate-100 dark:bg-slate-800/90 text-charcoal-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700'
                  }`}
                >
                  All
                </button>
                {bloodGroups.map((bg) => (
                  <button
                    key={bg}
                    type="button"
                    onClick={() => setSelectedGroup(bg)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-black transition-all ${
                      selectedGroup === bg
                        ? 'bg-gradient-to-r from-red-600 via-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/40 scale-110 border-transparent'
                        : 'bg-rose-500/10 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-2 border-rose-300/80 dark:border-rose-900/70 hover:bg-rose-500 hover:text-white dark:hover:bg-rose-600 hover:border-transparent hover:scale-105'
                    }`}
                  >
                    {bg}
                  </button>
                ))}

                <span className="text-slate-300 dark:text-slate-700 mx-1 hidden sm:inline">|</span>

                {/* Urgency Quick Toggle */}
                <button
                  type="button"
                  onClick={() =>
                    setUrgencyFilter((prev) => (prev === 'ALL' ? 'CRITICAL_IMMEDIATE' : 'ALL'))
                  }
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                    urgencyFilter === 'CRITICAL_IMMEDIATE'
                      ? 'bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-md shadow-rose-500/40 border border-rose-500 scale-105'
                      : 'bg-rose-500/10 dark:bg-slate-800 text-rose-700 dark:text-rose-300 border border-rose-300/70 dark:border-slate-700 hover:bg-rose-100 dark:hover:bg-slate-700'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span>Critical Trauma Only</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                Showing <strong className="text-rose-600 dark:text-rose-400 font-black">{filteredRequests.length}</strong> active emergency requirements
              </div>
            </div>
          )}
        </div>

        {/* 7. TAB CONTENT AREA WITH SMOOTH SLIDE/PAGE UP-DOWN MOTION */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            {/* VIEW 1: LIVE EMERGENCY RADAR SIMULATOR */}
            {activeTab === 'radar' && <EmergencyRadar />}

            {/* VIEW 2: COMPATIBILITY MATRIX VISUALIZER */}
            {activeTab === 'matrix' && (
              <BloodMatrixVisualizer
                onSelectGroupForCases={(group) => {
                  setSelectedGroup(group);
                  setActiveTab('feed');
                }}
              />
            )}

            {/* VIEW 3: AI CLINICAL TRIAGE */}
            {activeTab === 'triage' && <AITriageCalculator />}

            {/* VIEW 4: 30-SECOND QUICK ELIGIBILITY CHECKER */}
            {activeTab === 'eligibility' && <QuickEligibilityWidget />}

            {/* VIEW 5: MASTER TWO-COLUMN OPERATIONAL DASHBOARD LAYOUT (FOR FEED & BANKS) */}
            {(activeTab === 'feed' || activeTab === 'banks' || activeTab === 'donors') && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT PRIMARY OPERATIONAL FEED COLUMN (8 Cols) */}
            <div className="lg:col-span-8 space-y-6">
              {/* FEED VIEW */}
              {activeTab === 'feed' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-heading font-extrabold text-xl text-charcoal-900 dark:text-white flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-brand-rose animate-ping" />
                        Live Emergency Patient Intake
                      </h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Verified hospital requests requiring immediate voluntary donor participation.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedGroup('ALL');
                        setUrgencyFilter('ALL');
                        setSearchQuery('');
                      }}
                      className="text-[11px] text-brand-red dark:text-rose-400 hover:underline font-bold"
                    >
                      Reset Filters
                    </button>
                  </div>

                  {filteredRequests.length === 0 ? (
                    <div className="bg-white/90 dark:bg-slate-900/80 rounded-2xl p-12 text-center border border-slate-200/80 dark:border-slate-800 shadow-subtle space-y-3">
                      <Droplet className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                      <p className="text-sm font-bold text-charcoal-800 dark:text-white">
                        No active requests match your filter.
                      </p>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">
                        Try selecting a different blood group or reset the search query to view all national requests.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedGroup('ALL');
                          setUrgencyFilter('ALL');
                          setSearchQuery('');
                        }}
                        className="btn-secondary text-xs px-4 py-2 rounded-xl"
                      >
                        View All Active Cases
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredRequests.map((req) => (
                        <div
                          key={req.id}
                          className="group bg-white dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-5 sm:p-6 border border-slate-200/80 dark:border-rose-900/40 hover:border-rose-300 dark:hover:border-rose-500/80 shadow-[0_2px_12px_rgba(15,23,42,0.03)] hover:shadow-[0_8px_24px_rgba(244,63,94,0.08)] transition-all space-y-4"
                        >
                          {/* Top Header of Card */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              {/* Blood Group Highlight Badge */}
                              <div className="w-13 h-13 rounded-2xl bg-gradient-to-br from-rose-600 via-rose-500 to-pink-600 flex items-center justify-center text-white font-mono font-black text-xl shadow-sm shrink-0">
                                {req.blood_group}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h3 className="font-heading font-extrabold text-base text-slate-900 dark:text-white">
                                    {req.patient_ref_name}
                                  </h3>
                                  <span className="badge-verified text-[11px]">
                                    Verified Case
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 mt-0.5">
                                  <MapPin className="w-3.5 h-3.5 text-rose-500" />
                                  <strong className="text-slate-800 dark:text-slate-100 font-semibold">{req.hospital_name}</strong> &bull; {req.hospital_city}
                                </p>
                              </div>
                            </div>

                            {/* Urgency Badge */}
                            <div className="flex items-center gap-2">
                              {req.urgency === 'CRITICAL_IMMEDIATE' ? (
                                <span className="badge-emergency text-[11px]">
                                  Critical Trauma
                                </span>
                              ) : (
                                <span className="badge-pending text-[11px]">
                                  Urgent Within 12h
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Middle Details Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs bg-slate-50/70 dark:bg-slate-950/80 p-3.5 rounded-xl border border-slate-100 dark:border-rose-950/60">
                            <div>
                              <span className="text-[10px] text-slate-400 dark:text-slate-400 uppercase font-extrabold block tracking-wide">Units Required</span>
                              <span className="font-heading font-black text-rose-600 dark:text-rose-400 text-sm">{req.units_needed} Units</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 dark:text-slate-400 uppercase font-extrabold block tracking-wide">Component</span>
                              <span className="font-heading font-extrabold text-charcoal-900 dark:text-slate-100 text-xs truncate block">
                                {req.component.replace(/_/g, ' ')}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 dark:text-slate-400 uppercase font-extrabold block tracking-wide">Status</span>
                              <span className="font-heading font-extrabold text-amber-600 dark:text-amber-400 text-xs truncate block">
                                {req.status.replace(/_/g, ' ')}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-slate-400 dark:text-slate-400 uppercase font-extrabold block tracking-wide">Freshness</span>
                              <FreshnessIndicator updatedAt={req.updated_at} showIcon={false} />
                            </div>
                          </div>

                          {/* Actions Bar */}
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-2">
                              {/* Token copy */}
                              <button
                                type="button"
                                onClick={() => handleCopyToken(req.public_token)}
                                className="inline-flex items-center gap-1.5 text-[11px] font-mono text-slate-600 dark:text-slate-300 hover:text-charcoal-900 dark:hover:text-white bg-slate-100/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl font-bold transition-colors"
                                title="Click to copy tracking token"
                              >
                                {copiedToken === req.public_token ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                                )}
                                <span>{req.public_token.slice(0, 15)}...</span>
                              </button>

                              {/* Share broadcast button */}
                              <button
                                type="button"
                                onClick={() => handleShareCase(req)}
                                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:text-brand-red bg-slate-100/80 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl transition-colors"
                                title="Broadcast case via WhatsApp / Social"
                              >
                                <Share2 className="w-3.5 h-3.5 text-slate-400" />
                                <span>Share SOS</span>
                              </button>
                            </div>

                            <div className="flex items-center gap-2">
                              <Link
                                to={`/request-status/${req.public_token}`}
                                className="btn-secondary text-xs px-4 py-2 rounded-xl gap-1.5 font-bold"
                              >
                                <span>Track</span>
                                <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                              </Link>

                              <button
                                type="button"
                                onClick={() => setPledgeModalRequest(req)}
                                className="btn-primary text-xs px-5 py-2 rounded-xl gap-2 font-black shadow-[0_4px_16px_rgba(255,0,85,0.35)]"
                              >
                                <Heart className="w-4 h-4 fill-white text-white" />
                                <span>I Can Donate</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* BLOOD BANKS VIEW */}
              {activeTab === 'banks' && (
                <div className="space-y-4">
                  <div>
                    <h2 className="font-heading font-extrabold text-xl text-charcoal-900 dark:text-white">
                      Accredited Blood Banks &amp; Hospital Centres
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      NABH and State Drug Control verified hospital transfusion medicine centres.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {filteredBanks.map((bank) => (
                      <div
                        key={bank.id}
                        className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border-2 border-blue-200/60 dark:border-blue-900/40 hover:border-blue-500/80 shadow-[0_4px_24px_rgba(37,99,235,0.06)] hover:shadow-[0_12px_36px_rgba(37,99,235,0.18)] transition-all space-y-4"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-cyan-500 text-white flex items-center justify-center shrink-0 shadow-md shadow-blue-500/30">
                              <Building2 className="w-6 h-6" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-heading font-extrabold text-base text-charcoal-900 dark:text-white">
                                  {bank.display_name}
                                </h3>
                                <span className="badge-verified text-[10px]">
                                  <ShieldCheck className="w-3 h-3" />
                                  {bank.verification_status}
                                </span>
                              </div>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                {bank.address}, {bank.city}, {bank.state}
                              </p>
                            </div>
                          </div>

                          <div className="text-left sm:text-right">
                            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-800 inline-block">
                              {bank.operating_hours}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                          <span className="text-slate-400 font-mono text-[11px]">
                            Lic: <strong className="text-charcoal-800 dark:text-slate-200">{bank.license_number}</strong>
                          </span>
                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${bank.contact_phone}`}
                              className="btn-secondary text-xs px-3.5 py-1.5 rounded-xl gap-1.5 font-bold"
                            >
                              <PhoneCall className="w-3.5 h-3.5 text-blue-500" />
                              <span>{bank.contact_phone}</span>
                            </a>
                            <Link
                              to={`/blood-banks/${bank.id}`}
                              className="btn-primary text-xs px-4 py-1.5 rounded-xl font-bold"
                            >
                              Inspect Stock
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT QUICK OPERATIONS & TRACKER PANEL (4 Cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* 1. FAST EMERGENCY BLOOD INTAKE CARD */}
              <div className="bg-white dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/80 dark:border-rose-900/80 shadow-[0_2px_12px_rgba(15,23,42,0.03)] dark:shadow-[0_8px_30px_rgba(255,0,85,0.12)] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-600 to-rose-500 text-white flex items-center justify-center shadow-sm">
                      <Droplet className="w-4 h-4 fill-white" />
                    </div>
                    <h3 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white">
                      Instant Emergency Intake
                    </h3>
                  </div>
                  <span className="text-[10px] uppercase font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/80 px-2.5 py-0.5 rounded-full border border-rose-200/80 dark:border-rose-900">
                    Fast Track
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  Dispatch an urgent blood requirement across our verified network in seconds.
                </p>

                <form onSubmit={handleQuickIntakeSubmit} className="space-y-3">
                  <div>
                    <label className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 block mb-1">
                      Blood Group Required
                    </label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {bloodGroups.map((bg) => (
                        <button
                          key={bg}
                          type="button"
                          onClick={() => setQuickGroup(bg)}
                          className={`py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                            quickGroup === bg
                              ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-sm font-black scale-102 border-transparent'
                              : 'bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-rose-300 hover:bg-rose-50/60 dark:hover:bg-slate-700 font-extrabold'
                          }`}
                        >
                          {bg}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 block mb-1">
                        City / Region
                      </label>
                      <select
                        value={quickCity}
                        onChange={(e) => setQuickCity(e.target.value)}
                        className="w-full text-xs rounded-xl border border-slate-200/90 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-bold"
                      >
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Bengaluru">Bengaluru</option>
                        <option value="New Delhi">New Delhi</option>
                        <option value="Pune">Pune</option>
                      </select>
                    </div>

                    {/* Animated Units Slider with Preset Quick-Tap Buttons */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200">
                          Units Needed: <span className="text-rose-600 dark:text-rose-400 font-black">{quickUnits} Unit{quickUnits > 1 ? 's' : ''}</span>
                        </label>
                        <span className="text-[10px] text-slate-400 font-medium">1 - 8 Units</span>
                      </div>
                      <div className="space-y-2">
                        <input
                          type="range"
                          min="1"
                          max="8"
                          value={quickUnits}
                          onChange={(e) => setQuickUnits(parseInt(e.target.value) || 1)}
                          className="w-full h-2 bg-slate-200/80 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-rose-500 transition-all"
                        />
                        <div className="flex justify-between gap-1">
                          {[1, 2, 3, 4, 6].map((num) => (
                            <button
                              key={num}
                              type="button"
                              onClick={() => setQuickUnits(num)}
                              className={`flex-1 py-1 rounded-lg text-[10px] font-bold transition-all ${
                                quickUnits === num
                                  ? 'bg-rose-500 text-white shadow-xs scale-105'
                                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-extrabold text-slate-800 dark:text-slate-200 block mb-1">
                      Component Type
                    </label>
                    <select
                      value={quickComponent}
                      onChange={(e) => setQuickComponent(e.target.value as BloodComponent)}
                      className="w-full text-xs rounded-xl border border-slate-200/90 dark:border-slate-700 p-2.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 font-bold"
                    >
                      <option value="PACKED_RED_CELLS">Packed Red Blood Cells (PRBC)</option>
                      <option value="WHOLE_BLOOD">Whole Blood</option>
                      <option value="PLATELETS">Platelets Concentrate / SDP</option>
                      <option value="PLASMA">Fresh Frozen Plasma (FFP)</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingQuick}
                    className="w-full btn-primary text-xs py-3 rounded-2xl gap-2 font-black shadow-sm mt-2"
                  >
                    {isSubmittingQuick ? (
                      <span>Dispatching Request...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5 fill-white" />
                        <span>Dispatch Emergency Intake &rarr;</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* 2. INSTANT TRACKING SEARCH CARD */}
              <div className="bg-white dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_12px_rgba(15,23,42,0.03)] space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-xs">
                    <Search className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-heading font-extrabold text-sm text-slate-900 dark:text-white">
                    Track Request by Token
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  Every request receives a zero-knowledge tracking code to monitor real-time verification and donor dispatch.
                </p>

                <form onSubmit={handleTrackSubmit} className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="BB-TRK-7A9F-2B4C-8E1D"
                      value={trackingTokenInput}
                      onChange={(e) => setTrackingTokenInput(e.target.value)}
                      className="flex-1 text-xs rounded-xl border border-slate-200 dark:border-slate-700 px-3 py-2 bg-slate-50/70 dark:bg-slate-800 text-slate-900 dark:text-white focus:bg-white focus:border-cyan-500 focus:outline-none font-mono font-bold"
                    />
                    <button
                      type="submit"
                      className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black text-xs px-4 py-2 rounded-xl shrink-0 shadow-sm transition-all"
                    >
                      Track
                    </button>
                  </div>

                  {/* Sample Token Chips */}
                  <div className="pt-1">
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold block mb-1">
                      Quick Sample Tokens:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setTrackingTokenInput('BB-TRK-7A9F-2B4C-8E1D');
                          navigate('/request-status/BB-TRK-7A9F-2B4C-8E1D');
                        }}
                        className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-2.5 py-0.5 rounded-lg transition-colors font-bold"
                      >
                        #Apollo-ER-Sample
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setTrackingTokenInput('BB-TRK-4M1K-9C8A-3X2P');
                          navigate('/request-status/BB-TRK-4M1K-9C8A-3X2P');
                        }}
                        className="text-[10px] font-mono bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-2.5 py-0.5 rounded-lg transition-colors font-bold"
                      >
                        #Manipal-Case
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* 3. EVALUATOR ROLE SWITCHER CARD */}
              <div className="bg-white dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_12px_rgba(15,23,42,0.03)] space-y-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                    Live Demo Persona
                  </span>
                  <span className="text-[10px] uppercase font-mono font-bold bg-purple-50 dark:bg-purple-950 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800 text-purple-800 dark:text-purple-300">
                    {role.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px] font-medium">
                  Explore customized views crafted specifically for different stakeholders:
                </p>

                <div className="grid grid-cols-2 gap-1.5 pt-1">
                  <Link
                    to="/donor/dashboard"
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 hover:border-purple-300 text-slate-800 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-white dark:hover:bg-purple-950/40 transition-all font-bold text-[11px] text-center shadow-xs"
                  >
                    Donor Portal &rarr;
                  </Link>
                  <Link
                    to="/requester/dashboard"
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 hover:border-purple-300 text-slate-800 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-white dark:hover:bg-purple-950/40 transition-all font-bold text-[11px] text-center shadow-xs"
                  >
                    Requester Desk &rarr;
                  </Link>
                  <Link
                    to="/organization/dashboard"
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 hover:border-purple-300 text-slate-800 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-white dark:hover:bg-purple-950/40 transition-all font-bold text-[11px] text-center shadow-xs"
                  >
                    Hospital Portal &rarr;
                  </Link>
                  <Link
                    to="/admin/dashboard"
                    className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 hover:border-purple-300 text-slate-800 dark:text-slate-200 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-white dark:hover:bg-purple-950/40 transition-all font-bold text-[11px] text-center shadow-xs"
                  >
                    Trust Admin &rarr;
                  </Link>
                </div>
              </div>

              {/* 4. PRIVACY & SAFETY ASSURANCES */}
              <div className="bg-white dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_12px_rgba(15,23,42,0.03)] space-y-3 text-xs">
                <span className="font-heading font-extrabold text-slate-900 dark:text-white block text-xs">
                  Trust &amp; Clinical Safety Principles
                </span>
                <div className="space-y-2.5 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
                  <div className="flex items-start gap-2">
                    <Lock className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400 shrink-0 mt-0.5" />
                    <span><strong>No Public Phone Boards:</strong> Direct donor phone numbers are never harvested or displayed publicly.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span><strong>NABH Verified Centres:</strong> Only official registered hospital blood banks handle cross-matching.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Heart className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                    <span><strong>Strictly Voluntary:</strong> Commercial blood trading is legally prohibited and filtered out.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
          </motion.div>
        </AnimatePresence>

        {/* 8. PLEDGE DONOR RESPONSE CONFIRMATION MODAL */}
        {pledgeModalRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/70 backdrop-blur-md animate-in fade-in duration-150">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-7 max-w-lg w-full shadow-2xl border border-slate-100 dark:border-slate-800 space-y-5 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-brand-red flex items-center justify-center font-bold">
                    <Heart className="w-5 h-5 fill-brand-red" />
                  </div>
                  <div>
                    <h3 className="font-heading font-extrabold text-base text-charcoal-900 dark:text-white">
                      Confirm Voluntary Blood Pledge
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Case #{pledgeModalRequest.public_token.slice(0, 15)}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPledgeModalRequest(null)}
                  className="p-1 rounded-full text-slate-400 hover:text-charcoal-900 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 bg-rose-50/80 dark:bg-rose-950/40 rounded-2xl border border-rose-100 dark:border-rose-900/60 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Patient Case:</span>
                  <span className="font-bold text-charcoal-900 dark:text-white">{pledgeModalRequest.patient_ref_name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Hospital Facility:</span>
                  <span className="font-bold text-charcoal-900 dark:text-white">{pledgeModalRequest.hospital_name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Blood Group:</span>
                  <span className="font-mono font-extrabold text-brand-red dark:text-rose-400 text-sm">
                    {pledgeModalRequest.blood_group} ({pledgeModalRequest.units_needed} Units)
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                <p className="leading-relaxed">
                  By confirming, you authorize our hospital coordination desk to contact you securely via in-app alert. Your personal contact number remains shielded.
                </p>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-2 border border-slate-200 dark:border-slate-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Eligibility reminder: 90 days required since last whole blood donation.</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPledgeModalRequest(null)}
                  className="btn-secondary text-xs px-4 py-2.5 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmPledge}
                  className="btn-primary text-xs px-6 py-2.5 rounded-xl gap-2 font-bold shadow-card"
                >
                  <Check className="w-4 h-4 text-white" />
                  Confirm I Can Donate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
