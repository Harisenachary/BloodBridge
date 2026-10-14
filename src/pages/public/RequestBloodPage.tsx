import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { bloodRequestSchema, BloodRequestFormData } from '@/lib/validation/schemas';
import { demoStore } from '@/lib/demo/demoStore';
import { BloodGroup, BloodComponent, UrgencyLevel } from '@/types';
import { BloodMotionCanvas } from '@/components/motion/BloodMotionCanvas';
import {
  Droplet,
  Building2,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Lock,
  Sparkles,
  Zap,
  Activity,
  HeartHandshake,
  Clock,
  MapPin,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';

export const RequestBloodPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();

  const organizations = demoStore.getOrganizations();
  const [selectedHospitalMode, setSelectedHospitalMode] = useState<'REGISTERED' | 'CUSTOM'>('REGISTERED');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
  } = useForm<BloodRequestFormData>({
    resolver: zodResolver(bloodRequestSchema),
    defaultValues: {
      patient_ref_name: '',
      blood_group: 'O+',
      component: 'PACKED_RED_CELLS',
      units_needed: 2,
      urgency: 'CRITICAL_IMMEDIATE',
      required_by_date: new Date(Date.now() + 3600000 * 12).toISOString().slice(0, 16),
      hospital_name: 'Apollo Hospital — Jubilee Hills',
      hospital_city: 'Hyderabad',
      hospital_state: 'Telangana',
      hospital_locality: 'Jubilee Hills',
      requester_relationship: 'Family Attendant',
      contact_phone: '+91 98765 43210',
      contact_email: '',
      communication_preference: 'IN_APP',
      internal_notes: '',
      consent_obtained: true,
    },
  });

  const formData = watch();

  const handleNextStep1 = async () => {
    const isValid = await trigger(['patient_ref_name', 'required_by_date']);
    if (isValid) {
      setCurrentStep(2);
    } else {
      toast.error('Please enter a patient reference identifier to proceed.');
    }
  };

  const handleNextStep2 = async () => {
    const isValid = await trigger(['hospital_name', 'hospital_city', 'hospital_state']);
    if (isValid) {
      setCurrentStep(3);
    } else {
      toast.error('Please complete facility name and city.');
    }
  };

  const handleNextStep3 = async () => {
    const isValid = await trigger(['requester_relationship', 'contact_phone']);
    if (isValid) {
      setCurrentStep(4);
    } else {
      toast.error('Please provide relationship and a valid contact phone number.');
    }
  };

  const handleOrgSelection = (orgId: string) => {
    const org = organizations.find((o) => o.id === orgId);
    if (org) {
      setValue('hospital_name', org.display_name);
      setValue('hospital_city', org.city);
      setValue('hospital_state', org.state);
      setValue('hospital_locality', org.address.split(',')[0]);
    }
  };

  const onSubmit = async (data: BloodRequestFormData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const created = await demoStore.createRequest({
        patient_ref_name: data.patient_ref_name,
        blood_group: data.blood_group,
        component: data.component,
        units_needed: data.units_needed,
        urgency: data.urgency,
        required_by_date: new Date(data.required_by_date).toISOString(),
        hospital_name: data.hospital_name,
        hospital_city: data.hospital_city,
        hospital_state: data.hospital_state,
        hospital_locality: data.hospital_locality,
        requester_relationship: data.requester_relationship,
        contact_phone: data.contact_phone,
        contact_email: data.contact_email || undefined,
        communication_preference: data.communication_preference,
        internal_notes: data.internal_notes,
        consent_obtained: true,
      });

      toast.success('Blood request registered successfully!', {
        description: `Tracking Token: ${created.public_token}`,
      });

      navigate(`/request-status/${created.public_token}`);
    } catch (err) {
      toast.error('Failed to register blood request. Please check fields.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    { num: 1, title: 'Requirement', subtitle: 'Blood group & urgency' },
    { num: 2, title: 'Hospital Facility', subtitle: 'Location & verification' },
    { num: 3, title: 'Requester Contact', subtitle: 'Privacy-safe relay' },
    { num: 4, title: 'Review & Submit', subtitle: 'Verify & broadcast' },
  ];

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const urgencyOptions: { value: UrgencyLevel; label: string; desc: string; badgeColor: string }[] = [
    {
      value: 'CRITICAL_IMMEDIATE',
      label: 'Critical Immediate',
      desc: 'Transfusion needed in < 4 Hours (ICU / Emergency)',
      badgeColor: 'border-red-500/40 bg-red-500/10 text-red-600 dark:text-red-400',
    },
    {
      value: 'URGENT_WITHIN_12H',
      label: 'Urgent',
      desc: 'Required within 12 Hours (Surgery / Scheduled)',
      badgeColor: 'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
    {
      value: 'PLANNED_WITHIN_24H',
      label: 'Planned Procedure',
      desc: 'Required within 24 Hours (Next Day Protocol)',
      badgeColor: 'border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    {
      value: 'ROUTINE',
      label: 'Routine Transfusion',
      desc: 'Standard maintenance or chronic therapy',
      badgeColor: 'border-slate-500/40 bg-slate-500/10 text-slate-700 dark:text-slate-300',
    },
  ];

  return (
    <div className="relative min-h-screen">
      {/* Dynamic Animated Blood Flow Canvas */}
      <BloodMotionCanvas />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Cosmic Hero Header */}
        <div className="rounded-3xl bg-gradient-to-br from-[#0c0f1d] via-[#1c0f2f] to-[#0a1128] text-white p-6 sm:p-10 relative overflow-hidden shadow-[0_25px_60px_-15px_rgba(255,0,85,0.25)] border border-rose-500/20">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-rose-600/25 rounded-full blur-3xl pointer-events-none animate-pulse" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
              <Droplet className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
              Emergency Blood Intake &bull; Priority Dispatch
            </div>

            <h1 className="font-heading font-extrabold text-3xl sm:text-5xl tracking-tight leading-tight">
              Request{' '}
              <span className="bg-gradient-to-r from-[#FF0055] via-[#FF3366] to-[#FF9100] bg-clip-text text-transparent">
                Blood Coordination
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Broadcast verified clinical requirements directly to voluntary donor networks and accredited hospital blood banks across the metropolitan corridor within seconds.
            </p>

            {/* Quick Guarantee Pills */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-semibold">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-emerald-300 backdrop-blur-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Zero Open Phone Disclosure
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-cyan-300 backdrop-blur-sm">
                <Zap className="w-4 h-4 text-cyan-400" />
                Instant Matching Relay
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/10 text-amber-300 backdrop-blur-sm">
                <Building2 className="w-4 h-4 text-amber-400" />
                Hospital Transfusion Desk Sync
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Step Glass Navigation */}
        <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-slate-200/90 dark:border-slate-800 shadow-xl rounded-2xl p-4 sm:p-5">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative">
            {steps.map((s) => {
              const isActive = currentStep === s.num;
              const isPast = currentStep > s.num;
              return (
                <button
                  key={s.num}
                  type="button"
                  onClick={() => s.num < currentStep && setCurrentStep(s.num)}
                  disabled={s.num > currentStep}
                  className={`flex items-center gap-3 p-2.5 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-rose-500/10 border-2 border-rose-500 dark:bg-rose-950/30'
                      : isPast
                      ? 'bg-emerald-500/10 border border-emerald-500/30 dark:bg-emerald-950/20 hover:bg-emerald-500/20 cursor-pointer'
                      : 'bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 opacity-60'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-transform ${
                      isActive
                        ? 'bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-[0_4px_14px_rgba(244,63,94,0.4)] scale-105'
                        : isPast
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {isPast ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
                  </div>
                  <div className="min-w-0">
                    <p
                      className={`text-xs font-extrabold truncate ${
                        isActive
                          ? 'text-rose-600 dark:text-rose-400'
                          : isPast
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {s.title}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate hidden sm:block">
                      {s.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Form Container */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-slate-200/90 dark:border-slate-800 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.6)] rounded-3xl p-6 sm:p-10 space-y-8"
        >
          {/* STEP 1: REQUIREMENT DETAILS */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-bold uppercase tracking-wider">
                  <Activity className="w-4 h-4" />
                  Step 1 &bull; Clinical Requirement
                </div>
                <h2 className="font-heading font-extrabold text-2xl text-charcoal-900 dark:text-white mt-1">
                  Patient Blood Requirement
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  For privacy protection, please use a patient reference ID or initials instead of full legal names.
                </p>
              </div>

              {/* Patient Case Ref */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal-900 dark:text-slate-200 flex items-center justify-between">
                  <span>
                    Patient Case Reference / Identifier <span className="text-rose-500">*</span>
                  </span>
                  <span className="text-[11px] font-normal text-slate-400">e.g. Case #HYD-842 or Patient K. S.</span>
                </label>
                <input
                  type="text"
                  {...register('patient_ref_name')}
                  placeholder="e.g. Case #HYD-842 or Patient K. Sharma"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-charcoal-900 dark:text-white font-medium focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 text-sm transition-all"
                />
                {errors.patient_ref_name && (
                  <p className="text-xs text-red-500 font-semibold">{errors.patient_ref_name.message}</p>
                )}
              </div>

              {/* Blood Group Clickable Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-charcoal-900 dark:text-slate-200 block">
                  Required Blood Group <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
                  {bloodGroups.map((bg) => {
                    const isSelected = formData.blood_group === bg;
                    return (
                      <button
                        key={bg}
                        type="button"
                        onClick={() => setValue('blood_group', bg)}
                        className={`h-14 rounded-2xl font-black text-base flex flex-col items-center justify-center transition-all ${
                          isSelected
                            ? 'bg-gradient-to-br from-rose-500 to-red-700 text-white shadow-[0_8px_20px_rgba(244,63,94,0.4)] ring-4 ring-rose-500/20 scale-105'
                            : 'bg-slate-100 dark:bg-slate-800 text-charcoal-900 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        <span className="text-base">{bg}</span>
                        <span className="text-[9px] font-normal opacity-80 uppercase">ABO</span>
                      </button>
                    );
                  })}
                </div>
                {errors.blood_group && (
                  <p className="text-xs text-red-500 font-semibold">{errors.blood_group.message}</p>
                )}
              </div>

              {/* Component & Units */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-charcoal-900 dark:text-slate-200">
                    Required Component <span className="text-rose-500">*</span>
                  </label>
                  <select
                    {...register('component')}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-charcoal-900 dark:text-white font-medium focus:outline-none focus:border-rose-500 text-sm"
                  >
                    <option value="PACKED_RED_CELLS">Packed Red Blood Cells (PRBC)</option>
                    <option value="WHOLE_BLOOD">Whole Blood</option>
                    <option value="PLATELETS">Single Donor Platelets (SDP / RDP)</option>
                    <option value="PLASMA">Fresh Frozen Plasma (FFP)</option>
                    <option value="CRYOPRECIPITATE">Cryoprecipitate</option>
                    <option value="OTHER">Other Component</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-charcoal-900 dark:text-slate-200">
                    Number of Units Needed <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    {...register('units_needed', { valueAsNumber: true })}
                    min={1}
                    max={50}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-charcoal-900 dark:text-white font-black text-lg focus:outline-none focus:border-rose-500"
                  />
                  {errors.units_needed && (
                    <p className="text-xs text-red-500 font-semibold">{errors.units_needed.message}</p>
                  )}
                </div>
              </div>

              {/* Urgency Level Cards */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-charcoal-900 dark:text-slate-200 block">
                  Urgency Level <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {urgencyOptions.map((opt) => {
                    const isSelected = formData.urgency === opt.value;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setValue('urgency', opt.value)}
                        className={`p-4 rounded-2xl text-left border-2 transition-all ${
                          isSelected
                            ? 'border-rose-500 bg-rose-50/70 dark:bg-rose-950/30 ring-4 ring-rose-500/10 shadow-md'
                            : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-sm text-charcoal-900 dark:text-white">
                            {opt.label}
                          </span>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${opt.badgeColor}`}>
                            {opt.value === 'CRITICAL_IMMEDIATE' ? '< 4h' : opt.value === 'URGENT_WITHIN_12H' ? '< 12h' : '< 24h'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{opt.desc}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Required By Date */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal-900 dark:text-slate-200">
                  Required By Deadline <span className="text-rose-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  {...register('required_by_date')}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-charcoal-900 dark:text-white font-medium focus:outline-none focus:border-rose-500 text-sm"
                />
                {errors.required_by_date && (
                  <p className="text-xs text-red-500 font-semibold">{errors.required_by_date.message}</p>
                )}
              </div>

              <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleNextStep1}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-bold text-sm shadow-[0_8px_25px_rgba(225,29,72,0.4)] hover:brightness-110 flex items-center gap-2 transition-all cursor-pointer"
                >
                  Proceed to Hospital Details
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: HOSPITAL DETAILS */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-wider">
                  <Building2 className="w-4 h-4" />
                  Step 2 &bull; Facility &amp; Location
                </div>
                <h2 className="font-heading font-extrabold text-2xl text-charcoal-900 dark:text-white mt-1">
                  Hospital &amp; Facility Details
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Requests routed through registered partner hospitals receive instant clinical prioritization.
                </p>
              </div>

              {/* Mode Switcher */}
              <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setSelectedHospitalMode('REGISTERED')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                    selectedHospitalMode === 'REGISTERED'
                      ? 'bg-white dark:bg-slate-900 text-charcoal-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-charcoal-900'
                  }`}
                >
                  Select Registered Partner Hospital
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedHospitalMode('CUSTOM')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-extrabold transition-all ${
                    selectedHospitalMode === 'CUSTOM'
                      ? 'bg-white dark:bg-slate-900 text-charcoal-900 dark:text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-charcoal-900'
                  }`}
                >
                  Enter Unregistered Facility
                </button>
              </div>

              {selectedHospitalMode === 'REGISTERED' && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-charcoal-900 dark:text-slate-200">
                    Select Registered Partner Facility
                  </label>
                  <select
                    onChange={(e) => handleOrgSelection(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-charcoal-900 dark:text-white font-semibold text-sm focus:outline-none focus:border-rose-500"
                  >
                    {organizations.map((org) => (
                      <option key={org.id} value={org.id}>
                        {org.display_name} ({org.city}) &bull; {org.verification_status}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal-900 dark:text-slate-200">
                  Facility Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('hospital_name')}
                  placeholder="e.g. Care Hospital, Banjara Hills"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-charcoal-900 dark:text-white font-medium text-sm focus:outline-none focus:border-rose-500"
                />
                {errors.hospital_name && (
                  <p className="text-xs text-red-500 font-semibold">{errors.hospital_name.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-charcoal-900 dark:text-slate-200">
                    City <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('hospital_city')}
                    placeholder="e.g. Hyderabad"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-charcoal-900 dark:text-white font-medium text-sm focus:outline-none focus:border-rose-500"
                  />
                  {errors.hospital_city && (
                    <p className="text-xs text-red-500 font-semibold">{errors.hospital_city.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-charcoal-900 dark:text-slate-200">
                    State <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('hospital_state')}
                    placeholder="e.g. Telangana"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-charcoal-900 dark:text-white font-medium text-sm focus:outline-none focus:border-rose-500"
                  />
                  {errors.hospital_state && (
                    <p className="text-xs text-red-500 font-semibold">{errors.hospital_state.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal-900 dark:text-slate-200">
                  Hospital Ward / Locality (Optional)
                </label>
                <input
                  type="text"
                  {...register('hospital_locality')}
                  placeholder="e.g. ICU Ward 3, Road No 1"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-charcoal-900 dark:text-white font-medium text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 font-bold text-sm text-charcoal-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNextStep2}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-bold text-sm shadow-[0_8px_25px_rgba(225,29,72,0.4)] hover:brightness-110 flex items-center gap-2 transition-all cursor-pointer"
                >
                  Proceed to Contact Details
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: REQUESTER CONTACT */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-violet-600 dark:text-violet-400 text-xs font-bold uppercase tracking-wider">
                  <Phone className="w-4 h-4" />
                  Step 3 &bull; Requester Contact &amp; Privacy Shield
                </div>
                <h2 className="font-heading font-extrabold text-2xl text-charcoal-900 dark:text-white mt-1">
                  Requester Contact Details
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Your mobile number is securely masked and never shown on public search tables.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal-900 dark:text-slate-200">
                  Your Relationship to Patient <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('requester_relationship')}
                  placeholder="e.g. Attendant, Brother, Doctor, Relative"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-charcoal-900 dark:text-white font-medium text-sm focus:outline-none focus:border-rose-500"
                />
                {errors.requester_relationship && (
                  <p className="text-xs text-red-500 font-semibold">{errors.requester_relationship.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-charcoal-900 dark:text-slate-200">
                    Primary Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('contact_phone')}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-charcoal-900 dark:text-white font-mono font-bold text-sm focus:outline-none focus:border-rose-500"
                  />
                  {errors.contact_phone && (
                    <p className="text-xs text-red-500 font-semibold">{errors.contact_phone.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-charcoal-900 dark:text-slate-200">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    {...register('contact_email')}
                    placeholder="coordinator@gmail.com"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-charcoal-900 dark:text-white font-medium text-sm focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal-900 dark:text-slate-200">
                  Preferred Coordination Channel
                </label>
                <select
                  {...register('communication_preference')}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-charcoal-900 dark:text-white font-semibold text-sm focus:outline-none focus:border-rose-500"
                >
                  <option value="IN_APP">In-App Chat &amp; Token Alerts (Recommended)</option>
                  <option value="PHONE_CALL">Direct Voice Call</option>
                  <option value="WHATSAPP">WhatsApp Coordination</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-charcoal-900 dark:text-slate-200">
                  Additional Clinical Notes (Optional)
                </label>
                <textarea
                  {...register('internal_notes')}
                  rows={3}
                  placeholder="Mention any specific requirements, e.g. Leuko-depleted filter requested, replacement donor card available..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border-2 border-slate-200 dark:border-slate-700 text-charcoal-900 dark:text-white font-medium text-sm focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 font-bold text-sm text-charcoal-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleNextStep3}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-bold text-sm shadow-[0_8px_25px_rgba(225,29,72,0.4)] hover:brightness-110 flex items-center gap-2 transition-all cursor-pointer"
                >
                  Review &amp; Verify
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW & SUBMIT */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  Step 4 &bull; Final Verification &amp; Broadcast Consent
                </div>
                <h2 className="font-heading font-extrabold text-2xl text-charcoal-900 dark:text-white mt-1">
                  Review &amp; Confirm Dispatch
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Confirm submitted clinical data. Upon submission, a live privacy token will be generated.
                </p>
              </div>

              {/* High-tech Summary Ticket */}
              <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/60 border-2 border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-700">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Case Reference
                    </span>
                    <span className="font-heading font-black text-xl text-charcoal-900 dark:text-white">
                      {formData.patient_ref_name || 'Anonymous Patient'}
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-red-700 text-white flex flex-col items-center justify-center font-black shadow-md">
                    <span className="text-base">{formData.blood_group}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 uppercase font-bold text-[10px] block">Units Required</span>
                    <span className="font-extrabold text-charcoal-900 dark:text-white text-base">
                      {formData.units_needed} Units
                    </span>
                    <span className="text-slate-500 block truncate">{formData.component.replace(/_/g, ' ')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase font-bold text-[10px] block">Urgency</span>
                    <span className="font-extrabold text-rose-600 dark:text-rose-400 text-sm">
                      {formData.urgency.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase font-bold text-[10px] block">Facility</span>
                    <span className="font-bold text-charcoal-900 dark:text-white block truncate">
                      {formData.hospital_name}
                    </span>
                    <span className="text-slate-500 text-[11px] block">{formData.hospital_city}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 uppercase font-bold text-[10px] block">Requester Contact</span>
                    <span className="font-bold text-charcoal-900 dark:text-white block">
                      {formData.requester_relationship}
                    </span>
                    <span className="font-mono text-slate-500 text-[11px] block">{formData.contact_phone}</span>
                  </div>
                </div>
              </div>

              {/* Consent Box */}
              <div className="p-5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border-2 border-rose-200 dark:border-rose-900/40 text-xs text-charcoal-800 dark:text-slate-200 space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    {...register('consent_obtained')}
                    className="mt-1 w-4 h-4 rounded border-rose-300 text-rose-600 focus:ring-rose-500"
                  />
                  <span className="leading-relaxed">
                    I confirm that this blood requirement is clinically genuine. I understand that BloodBridge is a voluntary communication network and not an emergency transfusion provider. I consent to secure processing of this coordination request.
                  </span>
                </label>
                {errors.consent_obtained && (
                  <p className="text-xs text-red-500 font-bold pl-7">{errors.consent_obtained.message}</p>
                )}
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-3 rounded-2xl border-2 border-slate-200 dark:border-slate-700 font-bold text-sm text-charcoal-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white font-bold text-sm shadow-[0_8px_25px_rgba(225,29,72,0.4)] hover:brightness-110 flex items-center gap-2 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating Secure Token...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Confirm &amp; Register Blood Request
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
