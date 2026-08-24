import { Head, Link, usePage } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    ShieldCheck,
    CreditCard,
    Landmark,
    Eye,
    LogOut,
    ChevronDown,
    Menu,
    X,
    Search,
    Bell,
    CheckCircle2,
    ArrowUpRight,
    Sparkles,
    Shield,
    Users,
    Compass,
    ExternalLink,
    RefreshCw,
    AlertTriangle,
    LifeBuoy,
} from 'lucide-react';
import { useAdminRealtime } from '@/hooks/use-admin-realtime';

interface FlashProps {
    success?: string | null;
    error?: string | null;
    warning?: string | null;
    info?: string | null;
}

interface AdminLayoutProps {
    title: string;
    activeTab: 'overview' | 'kyc' | 'treasury' | 'payments' | 'complaints';
    children: React.ReactNode;
    fullWidth?: boolean;
    badges?: {
        pendingKyc?: number;
        pendingPayments?: number;
        readyPayouts?: number;
        pendingComplaints?: number;
    };
}

export default function AdminLayout({
    title,
    activeTab,
    children,
    fullWidth = false,
    badges,
}: AdminLayoutProps) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const { auth, flash } = usePage<{ auth: any; flash?: FlashProps }>().props;

    const { isRefreshing, timeAgo, refreshNow, isSupabaseConnected } = useAdminRealtime();

    const [activeToast, setActiveToast] = useState<{
        type: 'success' | 'warning' | 'error' | 'info';
        message: string;
    } | null>(null);

    // Watch for new flash messages from server
    useEffect(() => {
        if (flash?.success) {
            setActiveToast({ type: 'success', message: flash.success });
        } else if (flash?.error) {
            setActiveToast({ type: 'error', message: flash.error });
        } else if (flash?.warning) {
            setActiveToast({ type: 'warning', message: flash.warning });
        } else if (flash?.info) {
            setActiveToast({ type: 'info', message: flash.info });
        }
    }, [flash]);

    // Auto dismiss toast after 5 seconds
    useEffect(() => {
        if (!activeToast) return;
        const timer = setTimeout(() => {
            setActiveToast(null);
        }, 5000);
        return () => clearTimeout(timer);
    }, [activeToast]);

    const navTabs = [
        {
            key: 'overview',
            name: 'Command Center',
            href: '/admin/dashboard',
            icon: LayoutDashboard,
            badge: null,
        },
        {
            key: 'kyc',
            name: 'Verifikasi KYC Guide',
            href: '/admin/kyc',
            icon: ShieldCheck,
            badge: badges?.pendingKyc,
            badgeVariant: 'amber',
        },
        {
            key: 'payments',
            name: 'Kliring Pembayaran',
            href: '/admin/payments',
            icon: CreditCard,
            badge: badges?.pendingPayments,
            badgeVariant: 'amber',
        },
        {
            key: 'treasury',
            name: 'Treasury & Payouts',
            href: '/admin/treasury',
            icon: Landmark,
            badge: badges?.readyPayouts,
            badgeVariant: 'gold',
        },
        {
            key: 'complaints',
            name: 'Keluhan & Refund',
            href: '/admin/complaints',
            icon: LifeBuoy,
            badge: badges?.pendingComplaints,
            badgeVariant: 'rose',
        },
    ];

    // Close dropdowns on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.profile-dropdown-container')) {
                setIsProfileOpen(false);
            }
            if (!target.closest('.notification-dropdown-container')) {
                setIsNotificationOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <Head title={`${title} - IguideU Admin`} />

            <div className="flex min-h-screen flex-col bg-[#0A1224] font-['Inter',sans-serif] text-[#E2E8F0] antialiased selection:bg-[#E5B869] selection:text-[#0A1224]">
                {/* Global Custom CSS */}
                <style>{`
                    .admin-card {
                        background: #111C33;
                        border: 1px solid rgba(255, 255, 255, 0.08);
                    }
                    .admin-tab-active {
                        color: #FFFFFF;
                        border-bottom: 2px solid #E5B869;
                    }
                    .admin-tab-inactive {
                        color: #94A3B8;
                        border-bottom: 2px solid transparent;
                    }
                    .admin-tab-inactive:hover {
                        color: #E2E8F0;
                        border-bottom: 2px solid rgba(255, 255, 255, 0.2);
                    }
                    .no-scrollbar::-webkit-scrollbar {
                        display: none;
                    }
                    .no-scrollbar {
                        -ms-overflow-style: none;
                        scrollbar-width: none;
                    }
                `}</style>

                {/* 2-TIER ENTERPRISE HEADER */}
                <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#070D1B]/95 shadow-2xl backdrop-blur-xl">
                    {/* TIER 1: BRAND, CONTEXT, TELEMETRY & ADMIN PROFILE (Height: 58px) */}
                    <div className="mx-auto flex h-[58px] max-w-[1440px] items-center justify-between px-4 sm:px-6 md:px-8 border-b border-white/5">
                        {/* Brand & Workspace Context */}
                        <div className="flex items-center gap-3">
                            <Link
                                href="/admin/dashboard"
                                className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#E5B869] via-[#C5A059] to-[#A8823B] text-xs font-black text-[#0A1224] shadow-md shadow-[#E5B869]/20">
                                    IU
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-extrabold tracking-tight text-white">
                                        IguideU
                                    </span>
                                    <span className="hidden sm:inline-block text-slate-600 font-light">/</span>
                                    <span className="hidden sm:inline-flex items-center gap-1 rounded bg-[#E5B869]/10 px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-[#E5B869] border border-[#E5B869]/20 uppercase">
                                        ADMIN CONSOLE
                                    </span>
                                </div>
                            </Link>
                        </div>

                        {/* Right Area: Realtime Telemetry, Notifications & Admin Menu */}
                        <div className="flex items-center gap-2.5 sm:gap-3">
                            {/* Realtime Live Sync Status & Instant Refresh */}
                            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#111C33]/80 px-2.5 py-1 text-xs shadow-inner">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                                </span>
                                <span className="hidden sm:inline-block font-semibold text-slate-300 text-[11px]">
                                    {isSupabaseConnected ? 'Live Supabase' : 'Realtime'}
                                </span>
                                <span className="hidden md:inline-block text-[10px] text-slate-500">• {timeAgo}</span>
                                <button
                                    type="button"
                                    onClick={() => refreshNow()}
                                    disabled={isRefreshing}
                                    className="text-slate-400 hover:text-[#E5B869] transition-colors disabled:opacity-50 p-0.5 rounded hover:bg-white/5"
                                    title="Sinkronisasi Data Realtime Sekarang"
                                >
                                    <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin text-[#E5B869]' : ''}`} />
                                </button>
                            </div>

                            {/* Notifications Trigger */}
                            <div className="relative notification-dropdown-container">
                                <button
                                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                    className="relative flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-[#111C33]/60 text-slate-400 transition-colors hover:border-white/20 hover:text-white"
                                    title="Notifikasi Sistem"
                                >
                                    <Bell className="h-4 w-4" />
                                    {(badges?.pendingKyc || 0) + (badges?.pendingPayments || 0) > 0 && (
                                        <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#E5B869] ring-2 ring-[#070D1B]"></span>
                                    )}
                                </button>

                                {isNotificationOpen && (
                                    <div className="absolute right-0 z-50 mt-2 w-80 animate-in rounded-2xl border border-white/15 bg-[#111C33] p-4 shadow-2xl duration-150 zoom-in-95">
                                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                            <h4 className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-white uppercase tracking-wider">
                                                Notifikasi Penting
                                            </h4>
                                            <span className="text-[10px] text-slate-400">Realtime</span>
                                        </div>
                                        <div className="mt-3 space-y-2 text-xs">
                                            <Link
                                                href="/admin/kyc"
                                                onClick={() => setIsNotificationOpen(false)}
                                                className="flex items-start gap-2.5 rounded-xl p-2.5 hover:bg-white/5 transition-colors"
                                            >
                                                <ShieldCheck className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                                                <div>
                                                    <p className="font-semibold text-white">
                                                        {badges?.pendingKyc || 0} Pendaftar KYC Menunggu
                                                    </p>
                                                    <p className="text-[11px] text-slate-400">
                                                        Verifikasi berkas calon pemandu lokal NTB.
                                                    </p>
                                                </div>
                                            </Link>
                                            <Link
                                                href="/admin/payments"
                                                onClick={() => setIsNotificationOpen(false)}
                                                className="flex items-start gap-2.5 rounded-xl p-2.5 hover:bg-white/5 transition-colors"
                                            >
                                                <CreditCard className="h-4 w-4 text-[#E5B869] mt-0.5 shrink-0" />
                                                <div>
                                                    <p className="font-semibold text-white">
                                                        {badges?.pendingPayments || 0} Pembayaran Manual Pending
                                                    </p>
                                                    <p className="text-[11px] text-slate-400">
                                                        Cek struk transfer bank wisatawan.
                                                    </p>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* User Profile Menu */}
                            <div className="relative profile-dropdown-container">
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center gap-2 rounded-lg border border-white/10 bg-[#111C33]/80 p-1 pl-2 pr-2.5 transition-all hover:border-white/20 hover:bg-[#111C33]"
                                >
                                    <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#E5B869] text-[11px] font-black text-[#0A1224]">
                                        AD
                                    </div>
                                    <div className="hidden sm:flex flex-col text-left">
                                        <span className="text-xs font-bold text-white leading-tight">
                                            {auth?.user?.name || 'Administrator'}
                                        </span>
                                    </div>
                                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                                </button>

                                {isProfileOpen && (
                                    <div className="absolute right-0 z-50 mt-2 w-56 animate-in rounded-2xl border border-white/15 bg-[#111C33] p-2 shadow-2xl duration-150 zoom-in-95">
                                        <div className="border-b border-white/10 px-3 py-2.5">
                                            <p className="text-xs font-bold text-white">
                                                {auth?.user?.name || 'Administrator'}
                                            </p>
                                            <p className="mt-0.5 text-[11px] text-slate-400 truncate">
                                                {auth?.user?.email || 'admin@iguideu.com'}
                                            </p>
                                            <span className="mt-2 inline-block rounded bg-[#E5B869]/15 px-2 py-0.5 text-[9px] font-extrabold tracking-wider text-[#E5B869] uppercase border border-[#E5B869]/30">
                                                SUPER ADMIN
                                            </span>
                                        </div>

                                        <div className="py-1">
                                            <Link
                                                href="/dashboard"
                                                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-200 transition-colors hover:bg-white/5 hover:text-white"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Eye className="h-3.5 w-3.5 text-[#E5B869]" />
                                                    <span>Portal Wisatawan</span>
                                                </div>
                                                <ArrowUpRight className="h-3 w-3 text-slate-500" />
                                            </Link>
                                            <Link
                                                href="/guide/dashboard"
                                                className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-slate-200 transition-colors hover:bg-white/5 hover:text-white"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <Compass className="h-3.5 w-3.5 text-[#E5B869]" />
                                                    <span>Portal Pemandu (Guide)</span>
                                                </div>
                                                <ArrowUpRight className="h-3 w-3 text-slate-500" />
                                            </Link>
                                        </div>

                                        <div className="border-t border-white/10 pt-1">
                                            <Link
                                                href="/logout"
                                                method="post"
                                                as="button"
                                                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold text-rose-400 transition-colors hover:bg-rose-500/10"
                                            >
                                                <LogOut className="h-3.5 w-3.5" />
                                                <span>Keluar dari Akun</span>
                                            </Link>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Mobile Hamburger Toggle */}
                            <button
                                onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
                                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-[#111C33] text-slate-400 hover:text-white md:hidden"
                                aria-label="Toggle menu"
                            >
                                {isMobileNavOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    {/* TIER 2: STRUCTURED HORIZONTAL TABS (Height: 46px) */}
                    <div className="mx-auto hidden md:flex h-[46px] max-w-[1440px] items-center justify-between px-4 sm:px-6 md:px-8">
                        <nav className="flex items-center gap-6 h-full">
                            {navTabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.key;
                                return (
                                    <Link
                                        key={tab.key}
                                        href={tab.href}
                                        className={`flex items-center gap-2 h-full px-1 text-xs font-semibold tracking-wide transition-all ${
                                            isActive
                                                ? 'admin-tab-active'
                                                : 'admin-tab-inactive'
                                        }`}
                                    >
                                        <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-[#E5B869]' : 'text-slate-400'}`} />
                                        <span>{tab.name}</span>
                                        {tab.badge !== undefined && tab.badge !== null && tab.badge > 0 && (
                                            <span
                                                className={`flex h-4 min-w-4 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
                                                    tab.badgeVariant === 'amber'
                                                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                                        : 'bg-[#E5B869]/20 text-[#E5B869] border border-[#E5B869]/30'
                                                }`}
                                            >
                                                {tab.badge}
                                            </span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>

                        {/* Page Context Breadcrumb / Live Status */}
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                            <span>Admin</span>
                            <span>/</span>
                            <span className="text-white font-medium capitalize">{activeTab}</span>
                        </div>
                    </div>

                    {/* Mobile Navigation Drawer */}
                    {isMobileNavOpen && (
                        <div className="border-t border-white/10 bg-[#070D1B] p-4 md:hidden animate-in slide-in-from-top-2 duration-150">
                            <div className="space-y-1">
                                {navTabs.map((tab) => {
                                    const Icon = tab.icon;
                                    const isActive = activeTab === tab.key;
                                    return (
                                        <Link
                                            key={tab.key}
                                            href={tab.href}
                                            onClick={() => setIsMobileNavOpen(false)}
                                            className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-colors ${
                                                isActive
                                                    ? 'bg-[#E5B869]/15 text-[#E5B869] border border-[#E5B869]/30'
                                                    : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                            }`}
                                        >
                                            <div className="flex items-center gap-2.5">
                                                <Icon className="h-4 w-4" />
                                                <span>{tab.name}</span>
                                            </div>
                                            {tab.badge !== undefined && tab.badge !== null && tab.badge > 0 && (
                                                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                                                    {tab.badge}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </header>

                {/* FLOATING TOAST NOTIFICATION BANNER */}
                {activeToast && (
                    <div className="fixed top-20 right-6 z-[9999] max-w-md animate-in fade-in slide-in-from-top-4 duration-200">
                        <div
                            className={`flex items-start gap-3 rounded-2xl border p-4 shadow-2xl backdrop-blur-xl ${
                                activeToast.type === 'success'
                                    ? 'border-emerald-500/40 bg-[#0E1F1A]/95 text-emerald-300 shadow-emerald-500/10'
                                    : activeToast.type === 'warning'
                                    ? 'border-amber-500/40 bg-[#261D10]/95 text-amber-300 shadow-amber-500/10'
                                    : activeToast.type === 'error'
                                    ? 'border-rose-500/40 bg-[#261114]/95 text-rose-300 shadow-rose-500/10'
                                    : 'border-[#E5B869]/40 bg-[#16223B]/95 text-[#E5B869] shadow-[#E5B869]/10'
                            }`}
                        >
                            <div className="mt-0.5 shrink-0">
                                {activeToast.type === 'success' && (
                                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                )}
                                {activeToast.type === 'warning' && (
                                    <Shield className="h-5 w-5 text-amber-400" />
                                )}
                                {activeToast.type === 'error' && (
                                    <X className="h-5 w-5 text-rose-400" />
                                )}
                                {activeToast.type === 'info' && (
                                    <Sparkles className="h-5 w-5 text-[#E5B869]" />
                                )}
                            </div>
                            <div className="flex-1 pr-2">
                                <p className="text-xs font-bold capitalize">
                                    {activeToast.type === 'success'
                                        ? 'Aksi Berhasil'
                                        : activeToast.type === 'warning'
                                        ? 'Perhatian'
                                        : activeToast.type === 'error'
                                        ? 'Terjadi Kesalahan'
                                        : 'Informasi'}
                                </p>
                                <p className="mt-0.5 text-xs font-normal text-slate-200 leading-relaxed">
                                    {activeToast.message}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveToast(null)}
                                className="rounded-lg p-1 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* MAIN CONTENT AREA */}
                <main
                    className={`mx-auto w-full flex-grow ${
                        fullWidth
                            ? 'p-0'
                            : 'max-w-[1440px] px-4 py-6 sm:px-6 md:px-8 sm:py-8'
                    }`}
                >
                    {children}
                </main>

                {/* ENTERPRISE FOOTER */}
                <footer className="mt-auto w-full border-t border-white/10 bg-[#050A14] py-4">
                    <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between gap-3 px-4 text-xs text-slate-500 sm:flex-row sm:px-6 md:px-8">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-[#E5B869]">
                                IguideU Admin Console
                            </span>
                            <span className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] font-mono text-slate-400">
                                v2.5.2-prod
                            </span>
                        </div>
                        <div className="flex gap-5 text-[11px]">
                            <Link href="/admin/dashboard" className="hover:text-[#E5B869] transition-colors">
                                Command Center
                            </Link>
                            <Link href="/admin/kyc" className="hover:text-[#E5B869] transition-colors">
                                Verifikasi KYC
                            </Link>
                            <Link href="/admin/payments" className="hover:text-[#E5B869] transition-colors">
                                Kliring Pembayaran
                            </Link>
                            <Link href="/admin/treasury" className="hover:text-[#E5B869] transition-colors">
                                Treasury
                            </Link>
                        </div>
                        <div className="text-[11px]">
                            © 2026 IguideU NTB. All rights reserved.
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
