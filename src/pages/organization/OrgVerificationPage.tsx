import React, { useState } from 'react';
import { RoleSidebar } from '@/components/layout/RoleSidebar';
import { demoStore } from '@/lib/demo/demoStore';
import { ShieldCheck, FileCheck, Upload, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export const OrgVerificationPage: React.FC = () => {
  const org = demoStore.getOrganizations()[0];
  const [fileUploaded, setFileUploaded] = useState(false);

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setFileUploaded(true);
    toast.success('License document uploaded to state moderation review queue');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <RoleSidebar />

        <div className="flex-1 space-y-8">
          <div>
            <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-charcoal-900">
              Institutional Verification &amp; Compliance
            </h1>
            <p className="text-sm text-slate-muted mt-1 leading-relaxed">
              Submit state drug control licenses and accreditation certificates for verified partner status.
            </p>
          </div>

          <div className="card-surface p-6 sm:p-8 space-y-6 text-xs">
            <div className="flex items-center justify-between border-b border-slate-border pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase text-slate-muted block">Current Status</span>
                <span className="badge-verified mt-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {org.verification_status} — Level 1 Accredited
                </span>
              </div>
              <span className="font-mono text-slate-500">License: {org.license_number}</span>
            </div>

            <div className="space-y-4">
              <h2 className="font-heading font-bold text-sm text-charcoal-900">
                Uploaded Verification Credentials
              </h2>

              <div className="space-y-2">
                <div className="p-3.5 bg-surface-subtle rounded-xl border border-slate-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="font-bold text-charcoal-900">Form 28-C State Blood Bank License.pdf</p>
                      <p className="text-[11px] text-slate-muted">Approved by Central Drugs Standard Control Organisation (CDSCO)</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    APPROVED
                  </span>
                </div>

                <div className="p-3.5 bg-surface-subtle rounded-xl border border-slate-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileCheck className="w-5 h-5 text-emerald-600" />
                    <div>
                      <p className="font-bold text-charcoal-900">NABH Transfusion Accreditation 2026.pdf</p>
                      <p className="text-[11px] text-slate-muted">National Accreditation Board for Hospitals &amp; Healthcare</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    APPROVED
                  </span>
                </div>
              </div>
            </div>

            {/* Document Upload Box */}
            <form onSubmit={handleUpload} className="p-5 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-3 bg-stone-50/50">
              <Upload className="w-8 h-8 text-slate-400 mx-auto" />
              <div>
                <p className="font-bold text-charcoal-900">Upload Renewal or Additional Certification</p>
                <p className="text-slate-muted text-[11px]">PDF, PNG up to 10 MB (State Drug Control, Apheresis License)</p>
              </div>
              <input type="file" className="text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border file:border-slate-border file:text-xs file:font-semibold file:bg-white file:text-charcoal-800 hover:file:bg-slate-100 cursor-pointer" />
              <div>
                <button type="submit" className="btn-primary text-xs py-1.5 px-4 mt-2">
                  Upload Document
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
