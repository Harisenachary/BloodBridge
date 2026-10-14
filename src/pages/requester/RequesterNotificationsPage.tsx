import React from 'react';
import { RoleSidebar } from '@/components/layout/RoleSidebar';
import { useNotifications } from '@/context/NotificationContext';
import { Bell, Check, ArrowRight } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';

export const RequesterNotificationsPage: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col lg:flex-row gap-8">
        <RoleSidebar />

        <div className="flex-1 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-border pb-6">
            <div>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-charcoal-900">
                Requester Notifications
              </h1>
              <p className="text-sm text-slate-muted mt-1">
                Real-time alerts regarding case verification, donor responses, and request closure.
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="btn-secondary text-xs gap-1.5 self-start sm:self-auto"
              >
                <Check className="w-4 h-4 text-emerald-600" />
                Mark all as read
              </button>
            )}
          </div>

          <div className="card-surface p-6 space-y-4">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-muted">
                No notifications logged for your account yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                      !n.is_read ? 'bg-red-50/30 -mx-6 px-6 rounded-lg' : ''
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-charcoal-900">{n.title}</span>
                        {!n.is_read && (
                          <span className="w-2 h-2 rounded-full bg-brand-red flex-shrink-0" />
                        )}
                        <span className="text-[10px] text-slate-muted">
                          &bull; {formatDistanceToNow(parseISO(n.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-slate-muted leading-relaxed">{n.message}</p>
                    </div>

                    {n.link_url && (
                      <Link
                        to={n.link_url}
                        onClick={() => markAsRead(n.id)}
                        className="btn-secondary text-xs px-3 py-1 font-semibold text-brand-red hover:underline shrink-0"
                      >
                        View &rarr;
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
