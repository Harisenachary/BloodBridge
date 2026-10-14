import React from 'react';
import { formatDistanceToNow, parseISO, differenceInHours } from 'date-fns';
import { Clock, CheckCircle2, AlertTriangle } from 'lucide-react';

interface FreshnessIndicatorProps {
  updatedAt: string;
  showIcon?: boolean;
}

export const FreshnessIndicator: React.FC<FreshnessIndicatorProps> = ({ updatedAt, showIcon = true }) => {
  const date = parseISO(updatedAt);
  const hoursAgo = differenceInHours(new Date(), date);

  let badgeColor = 'bg-emerald-50 text-emerald-800 border-emerald-200';
  let label = 'Verified Fresh';
  let Icon = CheckCircle2;

  if (hoursAgo > 48) {
    badgeColor = 'bg-amber-50 text-amber-800 border-amber-200';
    label = 'Awaiting Refresh';
    Icon = AlertTriangle;
  } else if (hoursAgo > 12) {
    badgeColor = 'bg-blue-50 text-blue-800 border-blue-200';
    label = 'Updated Today';
    Icon = Clock;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${badgeColor}`}
      title={`Last verified on ${date.toLocaleString()}`}
    >
      {showIcon && <Icon className="w-3 h-3" />}
      <span>{label}</span>
      <span className="opacity-70 font-normal">({formatDistanceToNow(date, { addSuffix: true })})</span>
    </span>
  );
};
