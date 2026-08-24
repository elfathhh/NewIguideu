// ──────────────────────────────────────────────────────────────
// IguideU — Guides Top Navigation Bar (Travel-Relatable & Dark Luxury)
// ──────────────────────────────────────────────────────────────

import { useState, useRef, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    Search,
    Bell,
    Ticket,
    ChevronDown,
    LogOut,
    Compass,
    Sparkles,
    CalendarCheck2,
    Shield,
} from 'lucide-react';
import { useTranslation } from '@/hooks/use-translations';
import { useInitials } from '@/hooks/use-initials';

interface GuidesHeaderProps {
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
    breadcrumbs?: {
        label: string;
        href?: string;
    }[];
}

export function GuidesHeader({
    searchQuery,
    onSearchChange,
    breadcrumbs,
}: GuidesHeaderProps) {
    const { t } = useTranslation();
    const { auth } = usePage().props as {
        auth?: { user?: { name: string; email: string; avatar?: string } };
    };
    const user = auth?.user;
    const getInitials = useInitials();

    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

    const profileDropdownRef = useRef<HTMLDivElement>(null);
    const notifDropdownRef = useRef<HTMLDivElement>(null);
    const [notifTab, setNotifTab] = useState<'promo' | 'pesanan' | 'info'>(
        'pesanan',
    );

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                profileDropdownRef.current &&
                !profileDropdownRef.current.contains(event.target as Node)
            ) {
                setProfileDropdownOpen(false);
            }
            if (
                notifDropdownRef.current &&
                !notifDropdownRef.current.contains(event.target as Node)
            ) {
                setNotifDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside, {
            passive: true,
        });
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const userInitial = user ? getInitials(user.name) : 'U';

    const mockNotifications = {
        pesanan: [
            {
                id: 1,
                title: 'Menunggu Pembayaran',
                desc: 'Selesaikan pembayaran untuk tur "Gunung Rinjani 3H2N" sebelum 23:59 WITA.',
                time: '10 mnt lalu',
                unread: true,
                icon: <Ticket className="h-4 w-4 text-rose-400" />,
                bg: 'bg-rose-500/10',
            },
            {
                id: 2,
                title: 'Pesanan Dikonfirmasi',
                desc: 'Hore! Pemandu Budi telah menerima pesanan Anda untuk tur esok hari.',
                time: '2 jam lalu',
                unread: false,
                icon: <CalendarCheck2 className="h-4 w-4 text-emerald-400" />,
                bg: 'bg-emerald-500/10',
            },
        ],
        promo: [
            {
                id: 3,
                title: 'Diskon 50% Pengguna Baru',
                desc: 'Klaim voucher pengguna baru Anda sekarang dan nikmati liburan hemat!',
                time: '1 hari lalu',
                unread: true,
                icon: <Sparkles className="h-4 w-4 text-[#C5A059]" />,
                bg: 'bg-[#C5A059]/10',
            },
        ],
        info: [
            {
                id: 4,
                title: 'Fitur Baru: Escrow System',
                desc: 'Kini perjalanan Anda lebih aman dengan garansi penahanan dana hingga tur selesai.',
                time: '3 hari lalu',
                unread: false,
                icon: <Shield className="h-4 w-4 text-blue-400" />,
                bg: 'bg-blue-500/10',
            },
        ],
    };

    return (
        <nav className="fixed top-0 z-50 flex h-16 w-full max-w-full items-center justify-between border-b border-[#79849f]/20 bg-[#0D182E]/95 px-4 shadow-lg backdrop-blur-xl sm:px-6">
            {/* ─── Left Section: Logo & Search / Breadcrumbs ─── */}
            <div className="flex min-w-0 flex-1 items-center gap-4 sm:gap-6">
                {/* Luxury Brand Logo */}
                <Link
                    href="/"
                    className="group flex shrink-0 items-center gap-2.5"
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#C5A059]/40 bg-gradient-to-br from-[#C5A059]/25 via-[#C5A059]/10 to-transparent shadow-[0_0_15px_rgba(197,160,89,0.15)] transition-all duration-300 group-hover:border-[#C5A059] group-hover:shadow-[0_0_20px_rgba(197,160,89,0.3)]">
                        <Compass className="h-5 w-5 text-[#C5A059] transition-transform duration-500 group-hover:rotate-45" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-['Plus_Jakarta_Sans'] text-lg leading-none font-extrabold tracking-tight text-[#C5A059] sm:text-xl">
                            IguideU
                        </span>
                        <span className="mt-0.5 text-[9px] font-bold tracking-widest text-[#79849f] uppercase">
                            LOCAL GUIDES
                        </span>
                    </div>
                </Link>

                {/* Search Input (For search page) */}
                {onSearchChange !== undefined && (
                    <div className="hidden w-full max-w-sm items-center rounded-xl border border-white/10 bg-[#16223B]/80 px-3.5 py-1.5 transition-all focus-within:border-[#C5A059] focus-within:shadow-[0_0_15px_rgba(197,160,89,0.15)] hover:bg-[#16223B] md:flex">
                        <Search className="mr-2.5 h-4 w-4 shrink-0 text-[#79849f]" />
                        <input
                            type="text"
                            value={searchQuery || ''}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder={
                                t('nav.search_placeholder') ||
                                'Cari destinasi, gunung, pulau, pemandu...'
                            }
                            className="w-full border-none bg-transparent py-0.5 text-xs text-white placeholder-[#79849f] focus:ring-0 focus:outline-none sm:text-sm"
                        />
                    </div>
                )}

                {/* Breadcrumbs (For show/detail page) */}
                {breadcrumbs && breadcrumbs.length > 0 && (
                    <div className="hidden min-w-0 items-center gap-2 text-xs font-medium text-[#79849f] sm:flex">
                        {breadcrumbs.map((bc, idx) => (
                            <div
                                key={idx}
                                className="flex min-w-0 items-center gap-2"
                            >
                                {idx > 0 && (
                                    <span className="text-[#79849f]/40">/</span>
                                )}
                                {bc.href ? (
                                    <Link
                                        href={bc.href}
                                        className="truncate transition-colors hover:text-[#C5A059]"
                                    >
                                        {bc.label}
                                    </Link>
                                ) : (
                                    <span className="max-w-[220px] truncate font-semibold text-white">
                                        {bc.label}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ─── Right Section: Travel-Oriented Interactive Icons (Umum ➔ Personal) ─── */}
            <div className="ml-auto flex shrink-0 items-center gap-2.5 sm:gap-4">
                {/* 1. My Trips / Pesanan Wisata (Relatable Travel Voucher/Ticket Pill for Logged-in User) */}
                {user && (
                    <Link
                        href="/pesanan"
                        className="group relative flex items-center gap-2 rounded-full border border-white/15 bg-[#16223B]/80 px-3.5 py-1.5 text-white transition-all hover:border-[#C5A059]/60 hover:bg-[#16223B] hover:text-[#C5A059] hover:shadow-[0_0_15px_rgba(197,160,89,0.2)]"
                        title="Pesanan Saya"
                    >
                        <Ticket className="h-4 w-4 text-[#C5A059] transition-transform duration-300 group-hover:rotate-12" />
                        <span className="hidden text-xs font-bold md:inline">
                            Pesanan Saya
                        </span>

                        {/* Active Booking Badge Indicator */}
                        <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#C5A059] px-1 text-[10px] font-black text-[#0D182E] shadow-sm">
                            {(auth as any)?.activeBookingsCount > 0 ? (auth as any).activeBookingsCount : 1}
                        </span>
                    </Link>
                )}

                {/* 4. Notifikasi (Ikon Bell dengan Indikator Pulsasi) & Dropdown */}
                <div className="relative" ref={notifDropdownRef}>
                    <button
                        type="button"
                        onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                        className="group relative flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#16223B]/80 text-slate-300 shadow-sm transition-all hover:border-[#C5A059]/50 hover:bg-[#16223B] hover:text-[#C5A059]"
                        title="Notifikasi Pemesanan & Info Wisata"
                    >
                        <Bell className="h-4 w-4 text-slate-300 transition-colors group-hover:text-[#C5A059]" />
                        {user && (
                            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#C5A059] opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#C5A059]"></span>
                            </span>
                        )}
                    </button>

                    {/* Notifikasi Dropdown */}
                    {notifDropdownOpen && (
                        <div className="absolute top-full right-0 z-50 mt-2 w-[320px] animate-in overflow-hidden rounded-2xl border border-white/15 bg-[#16223B]/95 shadow-2xl backdrop-blur-2xl duration-150 fade-in-50 zoom-in-95 sm:w-[360px]">
                            {/* Header Notifikasi */}
                            <div className="flex items-center justify-between border-b border-white/10 bg-[#0D182E]/50 p-4">
                                <h3 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-white">
                                    Notifikasi
                                </h3>
                                <button className="text-[10px] font-bold tracking-wider text-[#C5A059] uppercase hover:underline">
                                    Tandai Dibaca
                                </button>
                            </div>

                            {/* Tabs Shopee-style */}
                            <div className="flex border-b border-white/10">
                                {[
                                    { id: 'pesanan', label: 'Pesanan' },
                                    { id: 'promo', label: 'Promo' },
                                    { id: 'info', label: 'Info IguideU' },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() =>
                                            setNotifTab(tab.id as any)
                                        }
                                        className={`relative flex-1 py-2.5 text-xs font-bold transition-all ${
                                            notifTab === tab.id
                                                ? 'bg-white/5 text-[#C5A059]'
                                                : 'text-[#79849f] hover:bg-white/5 hover:text-white'
                                        }`}
                                    >
                                        {tab.label}
                                        {notifTab === tab.id && (
                                            <span className="absolute right-0 bottom-0 left-0 h-[2px] bg-[#C5A059]" />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Notification List Content */}
                            <div className="hide-scrollbar flex max-h-[300px] flex-col overflow-y-auto">
                                {mockNotifications[notifTab].length > 0 ? (
                                    mockNotifications[notifTab].map((notif) => (
                                        <Link
                                            key={notif.id}
                                            href="/pesanan"
                                            onClick={() =>
                                                setNotifDropdownOpen(false)
                                            }
                                            className={`flex cursor-pointer gap-3 border-b border-white/5 p-3.5 transition-colors hover:bg-white/5 ${notif.unread ? 'bg-[#0D182E]/40' : ''}`}
                                        >
                                            <div
                                                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${notif.bg}`}
                                            >
                                                {notif.icon}
                                            </div>
                                            <div className="flex flex-1 flex-col gap-1">
                                                <div className="flex items-start justify-between">
                                                    <h4
                                                        className={`text-xs ${notif.unread ? 'font-bold text-white' : 'font-semibold text-slate-200'}`}
                                                    >
                                                        {notif.title}
                                                    </h4>
                                                    {notif.unread && (
                                                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#C5A059]"></span>
                                                    )}
                                                </div>
                                                <p className="line-clamp-2 text-[11px] leading-relaxed text-[#79849f]">
                                                    {notif.desc}
                                                </p>
                                                <span className="mt-0.5 text-[9px] text-[#79849f]/70">
                                                    {notif.time}
                                                </span>
                                            </div>
                                        </Link>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center gap-2 p-8 text-center">
                                        <Bell className="h-8 w-8 text-[#79849f] opacity-30" />
                                        <p className="text-xs text-[#79849f]">
                                            Belum ada notifikasi baru.
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Footer Notifikasi */}
                            <Link
                                href="/pesanan"
                                className="block w-full border-t border-white/10 bg-[#0D182E]/50 py-2.5 text-center text-xs font-bold text-[#C5A059] transition-colors hover:bg-white/5"
                            >
                                Lihat Semua Pesanan
                            </Link>
                        </div>
                    )}
                </div>

                {/* 5. Profil User (Paling Ujung Kanan) */}
                {user ? (
                    /* Logged In: Avatar Chip with Dropdown Menu */
                    <div className="relative" ref={profileDropdownRef}>
                        <button
                            type="button"
                            onClick={() =>
                                setProfileDropdownOpen(!profileDropdownOpen)
                            }
                            className="flex cursor-pointer items-center gap-2 rounded-full border border-white/15 bg-[#16223B]/90 py-1 pr-2.5 pl-1 transition-all hover:border-[#C5A059]/60 hover:shadow-[0_0_15px_rgba(197,160,89,0.15)]"
                        >
                            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#C5A059] to-[#b38e45] text-xs font-black text-[#0D182E] shadow-sm">
                                {userInitial}
                            </div>
                            <span className="hidden max-w-[100px] truncate text-xs font-bold text-white sm:block">
                                {user.name}
                            </span>
                            <ChevronDown
                                className={`h-3.5 w-3.5 text-[#79849f] transition-transform duration-200 ${
                                    profileDropdownOpen
                                        ? 'rotate-180 text-[#C5A059]'
                                        : ''
                                }`}
                            />
                        </button>

                        {/* Profile Dropdown Menu */}
                        {profileDropdownOpen && (
                            <div className="absolute top-full right-0 z-50 mt-2 w-64 animate-in rounded-2xl border border-white/15 bg-[#16223B]/95 p-2 shadow-2xl backdrop-blur-2xl duration-150 fade-in-50 zoom-in-95">
                                {/* User Header */}
                                <div className="mb-1 flex items-center gap-3 border-b border-white/10 p-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#C5A059] to-[#b38e45] text-xs font-black text-[#0D182E] shadow-md">
                                        {userInitial}
                                    </div>
                                    <div className="truncate text-left">
                                        <p className="truncate text-xs font-bold text-white">
                                            {user.name}
                                        </p>
                                        <p className="truncate text-[11px] text-[#79849f]">
                                            {user.email}
                                        </p>
                                    </div>
                                </div>

                                {/* Menu Links */}
                                <div className="space-y-0.5 py-1 text-xs">
                                    <Link
                                        href="/pesanan"
                                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-[#e2e2e2] transition-colors hover:bg-white/10 hover:text-[#C5A059]"
                                        onClick={() =>
                                            setProfileDropdownOpen(false)
                                        }
                                    >
                                        <Ticket className="h-4 w-4 text-[#79849f]" />
                                        <span>Pesanan Saya</span>
                                    </Link>
                                    <Link
                                        href="/join-guide"
                                        className="flex items-center gap-2.5 rounded-xl bg-[#C5A059]/10 px-3 py-2 font-semibold text-[#C5A059] transition-colors hover:bg-[#C5A059]/20"
                                        onClick={() =>
                                            setProfileDropdownOpen(false)
                                        }
                                    >
                                        <Sparkles className="h-4 w-4 text-[#C5A059]" />
                                        <span>Daftar Sebagai Guide</span>
                                    </Link>
                                </div>

                                {/* Logout Action */}
                                <div className="mt-1 border-t border-white/10 pt-1">
                                    <Link
                                        href="/logout"
                                        method="post"
                                        as="button"
                                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-bold text-rose-400 transition-colors hover:bg-rose-500/10"
                                        onClick={() =>
                                            setProfileDropdownOpen(false)
                                        }
                                    >
                                        <LogOut className="h-4 w-4" />
                                        <span>Keluar</span>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    /* Not Logged In: Luxury Auth Action Buttons */
                    <div className="flex items-center gap-2">
                        <Link
                            href="/login"
                            className="px-3 py-1.5 text-xs font-bold text-white transition-colors hover:text-[#C5A059]"
                        >
                            Masuk
                        </Link>
                        <Link
                            href="/register"
                            className="rounded-xl bg-gradient-to-r from-[#C5A059] to-[#d6b574] px-4 py-1.5 text-xs font-extrabold text-[#0D182E] shadow-md shadow-[#C5A059]/10 transition-all hover:from-[#d6b574] hover:to-[#C5A059]"
                        >
                            Daftar
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
