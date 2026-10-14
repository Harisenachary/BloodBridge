import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Building2,
  MapPin,
  Phone,
  Clock,
  ShieldCheck,
  Calendar,
  AlertCircle,
  QrCode,
  Printer,
  Copy,
  Check,
  PackageCheck,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import { demoStore } from '@/lib/demo/demoStore';
import {
  BloodGroup,
  BloodComponent,
  BloodInventoryItem,
  BloodReservation,
  UrgencyLevel,
} from '@/types';

interface BloodReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  inventoryItem?: BloodInventoryItem | null;
  onReservationComplete?: (reservation: BloodReservation) => void;
}

export const BloodReservationModal: React.FC<BloodReservationModalProps> = ({
  isOpen,
  onClose,
  inventoryItem,
  onReservationComplete,
}) => {
  const [patientName, setPatientName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [unitsToReserve, setUnitsToReserve] = useState(1);
  const [urgency, setUrgency] = useState<UrgencyLevel>('URGENT_WITHIN_12H');
  const [pickupWindow, setPickupWindow] = useState('Within 4 Hours (Standard Emergency)');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedReservation, setConfirmedReservation] = useState<BloodReservation | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen || !inventoryItem) return null;

  const org = inventoryItem.organization || demoStore.getOrganizationById(inventoryItem.organization_id);
  const maxUnits = inventoryItem.units_available;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientName.trim()) {
      toast.error('Please enter patient or attendant name');
      return;
    }
    if (!contactPhone.trim() || contactPhone.length < 8) {
      toast.error('Please enter a valid contact phone number');
      return;
    }
    if (unitsToReserve < 1 || unitsToReserve > maxUnits) {
      toast.error(`Please select between 1 and ${maxUnits} units`);
      return;
    }

    setIsSubmitting(true);
    try {
      const reservation = demoStore.createReservation({
        patient_name: patientName.trim(),
        contact_phone: contactPhone.trim(),
        organization_id: inventoryItem.organization_id,
        blood_group: inventoryItem.blood_group,
        component: inventoryItem.component,
        units_reserved: unitsToReserve,
        urgency,
        pickup_window: pickupWindow,
        notes: notes.trim(),
      });

      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.6 },
      });

      toast.success('Blood Units Successfully Reserved!', {
        description: `Reservation Code: ${reservation.reservation_code}. Held for 12 hours.`,
      });

      setConfirmedReservation(reservation);
      if (onReservationComplete) {
        onReservationComplete(reservation);
      }
    } catch {
      toast.error('Failed to create reservation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    toast.success('Reservation Code Copied to Clipboard!');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleResetAndClose = () => {
    setPatientName('');
    setContactPhone('');
    setUnitsToReserve(1);
    setNotes('');
    setConfirmedReservation(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-6 pb-4 bg-gradient-to-r from-rose-500 to-red-600 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-xl">
              {inventoryItem.blood_group}
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-xl text-white">
                {confirmedReservation ? 'Blood Reservation Confirmed' : 'Reserve & Collect Blood Units'}
              </h2>
              <p className="text-xs text-rose-100">
                {confirmedReservation
                  ? 'Show this digital pass at the blood bank collection counter'
                  : 'Units are immediately placed on cold-chain reserve for patient pickup'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleResetAndClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {confirmedReservation ? (
            /* Confirmation Digital Pass */
            <div className="space-y-6 animate-in zoom-in-95 duration-200">
              {/* Top Success Badge */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-emerald-900 dark:text-emerald-200">
                    Units Held Under Your Name in Cold Storage
                  </h4>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300 mt-0.5">
                    Your {confirmedReservation.units_reserved} unit(s) of{' '}
                    <strong>{confirmedReservation.blood_group}</strong> ({confirmedReservation.component.replace(/_/g, ' ')}) have been reserved at{' '}
                    <strong>{confirmedReservation.organization_name}</strong>.
                  </p>
                </div>
              </div>

              {/* Digital Pickup Voucher Card */}
              <div className="rounded-3xl p-6 bg-gradient-to-br from-slate-900 via-slate-800 to-rose-950 text-white border-2 border-rose-500/40 shadow-xl space-y-5 relative overflow-hidden">
                <div className="absolute -right-16 -top-16 w-48 h-48 bg-rose-600/20 rounded-full blur-2xl pointer-events-none" />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-rose-400">
                      Official Reservation Code
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-mono font-black text-2xl sm:text-3xl text-white tracking-wider">
                        {confirmedReservation.reservation_code}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyCode(confirmedReservation.reservation_code)}
                        className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-rose-300 transition-colors"
                        title="Copy Code"
                      >
                        {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold shrink-0 self-start sm:self-auto">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    CONFIRMED &amp; READY
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-400">Patient / Attendant</span>
                    <p className="font-bold text-white text-sm">{confirmedReservation.patient_name}</p>
                    <p className="text-slate-300">{confirmedReservation.contact_phone}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400">Blood Product &amp; Quantity</span>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-rose-500 font-black text-white text-xs">
                        {confirmedReservation.blood_group}
                      </span>
                      <span className="font-bold text-white text-sm">
                        {confirmedReservation.units_reserved} Unit(s) &bull;{' '}
                        {confirmedReservation.component.replace(/_/g, ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400">Collection Location</span>
                    <p className="font-bold text-white">{confirmedReservation.organization_name}</p>
                    <p className="text-slate-300">{confirmedReservation.organization_address}, {confirmedReservation.organization_city}</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400">Hospital Phone &amp; Window</span>
                    <p className="font-bold text-rose-300">{confirmedReservation.organization_phone}</p>
                    <p className="text-slate-300">{confirmedReservation.pickup_window}</p>
                  </div>
                </div>

                {/* Collection Instructions Warning */}
                <div className="pt-3 border-t border-white/10 text-[11px] text-slate-300 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    Please bring patient hospital registration slip and transfusion doctor requisition form when collecting.
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <Printer className="w-4 h-4 text-slate-600 dark:text-slate-300" />
                  Print / Save Pickup Voucher
                </button>

                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Check className="w-4 h-4" />
                  Done &amp; Return to Dashboard
                </button>
              </div>
            </div>
          ) : (
            /* Reservation Form */
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Facility & Available Blood Overview Card */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                        {org?.display_name || 'Hospital Blood Bank'}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {org?.address}, {org?.city}
                      </p>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 self-start sm:self-auto">
                    Verified Stock Available
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-200/80 dark:border-slate-700/60 text-xs">
                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Blood Group</span>
                    <span className="font-black text-rose-600 dark:text-rose-400 text-base">
                      {inventoryItem.blood_group}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Component</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {inventoryItem.component.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Units in Stock</span>
                    <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                      {maxUnits} Available
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 dark:text-slate-400 block text-[11px]">Hospital Phone</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">
                      {org?.contact_phone || '24x7 Help'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Form Input Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Patient / Attendant Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Patient / Attendant Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Ramesh Reddy (Attendant)"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>

                {/* Contact Phone */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Attendant Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                  />
                </div>
              </div>

              {/* Units & Urgency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Number of Units */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Units to Reserve (Max: {maxUnits}) <span className="text-rose-500">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={unitsToReserve <= 1}
                      onClick={() => setUnitsToReserve((prev) => Math.max(1, prev - 1))}
                      className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold flex items-center justify-center transition-colors disabled:opacity-40"
                    >
                      -
                    </button>
                    <span className="font-mono font-black text-xl text-slate-900 dark:text-white w-10 text-center">
                      {unitsToReserve}
                    </span>
                    <button
                      type="button"
                      disabled={unitsToReserve >= maxUnits}
                      onClick={() => setUnitsToReserve((prev) => Math.min(maxUnits, prev + 1))}
                      className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold flex items-center justify-center transition-colors disabled:opacity-40"
                    >
                      +
                    </button>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Bag(s) of tested blood
                    </span>
                  </div>
                </div>

                {/* Urgency */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Clinical Urgency Level
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as UrgencyLevel)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                  >
                    <option value="CRITICAL_IMMEDIATE">Critical Emergency (Immediate Pickup)</option>
                    <option value="URGENT_WITHIN_12H">Urgent (Within 12 Hours)</option>
                    <option value="PLANNED_WITHIN_24H">Scheduled Surgery (Within 24 Hours)</option>
                    <option value="ROUTINE">Routine Transfusion</option>
                  </select>
                </div>
              </div>

              {/* Pickup Window */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Target Pickup Time Window
                </label>
                <select
                  value={pickupWindow}
                  onChange={(e) => setPickupWindow(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                >
                  <option value="Within 2 Hours (Emergency Dispatch)">Within 2 Hours (Emergency Dispatch)</option>
                  <option value="Within 4 Hours (Standard Emergency)">Within 4 Hours (Standard Emergency)</option>
                  <option value="Today before 8:00 PM">Today before 8:00 PM</option>
                  <option value="Tomorrow Morning (Pre-Op Surgery)">Tomorrow Morning (Pre-Op Surgery)</option>
                </select>
              </div>

              {/* Optional Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  Notes / Hospital Bed / Doctor Name (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. ICU Bed 4, Dr. Rao Requisition #482"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>

              {/* Cold Chain Reserve Guarantee Banner */}
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Cold-Chain Hold Policy:</strong> Upon confirming, {unitsToReserve} unit(s) are held in refrigerated quarantine for up to 12 hours at the hospital blood bank counter. Zero cost for reservation.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-7 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs font-black shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  <PackageCheck className="w-4 h-4" />
                  {isSubmitting ? 'Reserving Units...' : `Confirm & Reserve ${unitsToReserve} Unit(s)`}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
