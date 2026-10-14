import React from 'react';
import { BloodGroup } from '@/types';

interface CompatibilityBadgeProps {
  bloodGroup: BloodGroup;
  size?: 'sm' | 'md' | 'lg';
  showSpecialNotice?: boolean;
}

export const CompatibilityBadge: React.FC<CompatibilityBadgeProps> = ({
  bloodGroup,
  size = 'md',
  showSpecialNotice = false,
}) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1 font-bold',
    lg: 'text-base px-4 py-1.5 font-extrabold',
  };

  const getSubtext = (bg: BloodGroup) => {
    switch (bg) {
      case 'O-':
        return 'Universal Red Cell Donor';
      case 'O+':
        return 'Compatible with all Rh+';
      case 'AB+':
        return 'Universal Red Cell Recipient';
      case 'AB-':
        return 'Universal Plasma Donor';
      default:
        return '';
    }
  };

  const subtext = getSubtext(bloodGroup);

  return (
    <div className="inline-flex items-center gap-2">
      <span
        className={`inline-flex items-center justify-center rounded-lg bg-red-100 text-brand-burgundy border border-red-200 font-mono ${sizeClasses[size]}`}
      >
        {bloodGroup}
      </span>
      {showSpecialNotice && subtext && (
        <span className="text-[11px] text-slate-muted font-medium bg-surface-subtle px-2 py-0.5 rounded-full border border-slate-border">
          {subtext}
        </span>
      )}
    </div>
  );
};
