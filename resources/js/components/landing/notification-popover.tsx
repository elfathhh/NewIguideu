import { useState } from 'react';
import { Bell, CheckCheck, Compass, Sparkles, Ticket, X } from 'lucide-react';
import { Link } from '@inertiajs/react';

export interface NotificationItem {
    id: string;
    title: string;
    description: string;
    time: string;
    unread: boolean;
    type: 'booking' | 'promo' | 'system';
    link?: string;
}

interface NotificationPopoverProps {
    isOpen: boolean;
    onClose: () => void;
    notifications?: NotificationItem[];
}

export function NotificationPopover({ isOpen, onClose, notifications: propNotifications = [] }: NotificationPopoverProps) {
    const [notifications, setNotifications] = useState<NotificationItem[]>(propNotifications);

    // Sync if prop changes
    useState(() => {
        if (propNotifications.length > 0) {
            setNotifications(propNotifications);
        }
    });

    if (!isOpen) return null;

    const unreadCount = notifications.filter((n) => n.unread).length;

    const markAllAsRead = () => {
        setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    };

    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
        );
    };

    return (
        <div className="absolute top-full right-0 z-50 mt-2 w-80 sm:w-96 animate-in rounded-2xl border border-white/15 bg-[#16223B]/95 p-3 shadow-2xl backdrop-blur-2xl duration-150 fade-in-50 zoom-in-95">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 px-2">
                <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-[#e9c176]" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                        Notifikasi
                    </h3>
                    {unreadCount > 0 && (
                        <span className="rounded-full bg-[#e9c176] px-1.5 py-0.2 text-[10px] font-extrabold text-[#0D182E]">
                            {unreadCount}
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {unreadCount > 0 && (
                        <button
                            type="button"
                            onClick={markAllAsRead}
                            className="flex items-center gap-1 text-[11px] font-semibold text-[#e9c176] transition-colors hover:text-[#f3ce87]"
                        >
                            <CheckCheck className="h-3.5 w-3.5" />
                            <span>Tandai Semua Dibaca</span>
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1 text-[#8f9097] hover:bg-white/5 hover:text-white"
                        aria-label="Tutup"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto py-2 space-y-1.5">
                {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-[#8f9097]">
                        Tidak ada notifikasi saat ini.
                    </div>
                ) : (
                    notifications.map((notif) => (
                        <div
                            key={notif.id}
                            onClick={() => markAsRead(notif.id)}
                            className={`group relative flex items-start gap-3 rounded-xl p-2.5 transition-colors ${
                                notif.unread
                                    ? 'bg-white/[0.07] hover:bg-white/10'
                                    : 'hover:bg-white/5 opacity-80'
                            }`}
                        >
                            <div
                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
                                    notif.type === 'booking'
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : notif.type === 'promo'
                                          ? 'bg-[#e9c176]/20 text-[#e9c176]'
                                          : 'bg-sky-500/20 text-sky-400'
                                }`}
                            >
                                {notif.type === 'booking' && <Ticket className="h-4 w-4" />}
                                {notif.type === 'promo' && <Sparkles className="h-4 w-4" />}
                                {notif.type === 'system' && <Compass className="h-4 w-4" />}
                            </div>

                            <div className="flex-1 overflow-hidden text-left">
                                <div className="flex items-center justify-between gap-1">
                                    <h4 className="truncate text-xs font-bold text-white">
                                        {notif.title}
                                    </h4>
                                    {notif.unread && (
                                        <span className="h-2 w-2 shrink-0 rounded-full bg-[#e9c176]"></span>
                                    )}
                                </div>
                                <p className="mt-0.5 text-[11px] leading-relaxed text-[#c6c6ce] line-clamp-2">
                                    {notif.description}
                                </p>
                                <span className="mt-1 block text-[10px] text-[#8f9097]">
                                    {notif.time}
                                </span>
                            </div>

                            {notif.link && (
                                <Link
                                    href={notif.link}
                                    onClick={onClose}
                                    className="absolute inset-0 z-10"
                                />
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="border-t border-white/10 pt-2 text-center">
                <Link
                    href="/dashboard"
                    onClick={onClose}
                    className="block rounded-lg py-1.5 text-xs font-semibold text-[#e9c176] transition-colors hover:bg-white/5"
                >
                    Buka Dashboard Pesanan
                </Link>
            </div>
        </div>
    );
}
