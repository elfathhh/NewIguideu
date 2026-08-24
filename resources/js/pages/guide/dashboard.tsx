import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

export default function GuideDashboard() {
    const {
        auth,
        guideProfile,
        bookings = { pending: [], upcoming: [], completed: [] },
        activeTour,
        stats = {
            newOrdersCount: 0,
            totalPendapatan: 0,
            komisi: 0,
            saldo: 0,
            dicairkan: 0,
        },
    } = usePage<{
        auth: any;
        guideProfile?: {
            verification_status?: 'pending' | 'verified' | 'rejected';
            rejection_reason?: string | null;
        };
        bookings: { pending: any[]; upcoming: any[]; completed: any[] };
        activeTour: any;
        stats: {
            newOrdersCount: number;
            totalPendapatan: number;
            komisi: number;
            saldo: number;
            dicairkan: number;
        };
    }>().props;
    const [activeTab, setActiveTab] = useState<
        'pending' | 'upcoming' | 'completed'
    >('pending');
    const [isAvailable, setIsAvailable] = useState(true);
    const [selectedTrip, setSelectedTrip] = useState<any | null>(null);
    const [isSubmittingEndTrip, setIsSubmittingEndTrip] = useState<boolean>(false);

    const verificationStatus = guideProfile?.verification_status || 'verified';

    const handleEndTrip = (bookingId: number) => {
        if (
            !confirm(
                'Apakah perjalanan tur ini telah selesai Anda pandu? Permintaan penyelesaian akan dikirimkan ke wisatawan untuk mengonfirmasi pelepasan dana escrow.',
            )
        ) {
            return;
        }
        setIsSubmittingEndTrip(true);
        router.post(
            `/guide/bookings/${bookingId}/end-trip`,
            {},
            {
                onSuccess: () => {
                    setIsSubmittingEndTrip(false);
                    setSelectedTrip((prev: any) =>
                        prev
                            ? {
                                  ...prev,
                                  guide_ended_at: new Date().toISOString(),
                              }
                            : null,
                    );
                },
                onError: () => {
                    setIsSubmittingEndTrip(false);
                    alert('Gagal mengakhiri perjalanan. Silakan coba lagi.');
                },
            },
        );
    };

    return (
        <>
            <Head title="Guide Mission Control - IguideU" />

            <div className="flex min-h-screen bg-[#0d182e] font-['Inter',sans-serif] text-[#e2e2e2] selection:bg-[#e9c176] selection:text-[#0d182e]">
                {/* Sidebar Navigation (Desktop Only) */}
                <aside className="glass-panel sticky top-0 z-40 hidden h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-[#0d182e]/95 md:flex">
                    <div className="px-6 py-8">
                        <Link
                            href="/"
                            className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-bold tracking-tight text-[#e9c176]"
                        >
                            IguideU
                        </Link>
                        <p className="mt-1 text-[10px] font-bold tracking-widest text-[#77819c] uppercase">
                            PORTAL PEMANDU
                        </p>
                    </div>

                    <nav className="mt-2 flex-1 space-y-1.5 px-4">
                        <Link
                            href="/guide/dashboard"
                            className="nav-item-active flex items-center gap-3 rounded-r-lg px-4 py-3 text-sm font-semibold transition-all"
                        >
                            <span className="material-symbols-outlined text-xl">
                                dashboard
                            </span>
                            <span>Dashboard</span>
                        </Link>
                        <Link
                            href="/guide/schedule"
                            className="flex items-center gap-3 rounded-r-lg px-4 py-3 text-sm font-semibold text-[#77819c] transition-all hover:bg-white/5 hover:text-[#e9c176]"
                        >
                            <span className="material-symbols-outlined text-xl">
                                calendar_month
                            </span>
                            <span>Jadwal Tur</span>
                        </Link>
                        <Link
                            href="/guide/packages"
                            className="flex items-center gap-3 rounded-r-lg px-4 py-3 text-sm font-semibold text-[#77819c] transition-all hover:bg-white/5 hover:text-[#e9c176]"
                        >
                            <span className="material-symbols-outlined text-xl">
                                settings_applications
                            </span>
                            <span>Layanan & Tarif</span>
                        </Link>
                    </nav>

                    {/* Profile Card at Sidebar Bottom */}
                    <div className="mt-auto border-t border-white/10 p-5">
                        <div className="mb-3 flex items-center gap-3">
                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[#e9c176]/40 bg-white/5">
                                <img
                                    className="h-full w-full object-cover"
                                    src={
                                        auth?.user?.avatar ||
                                        'https://ui-avatars.com/api/?name=' +
                                            encodeURIComponent(auth?.user?.name || 'Guide') +
                                            '&background=e9c176&color=0d182e'
                                    }
                                    alt="Profile Avatar"
                                />
                            </div>
                            <div className="overflow-hidden">
                                <p className="truncate text-sm font-bold text-white">
                                    {auth?.user?.name || 'Expert Guide'}
                                </p>
                                <p className="truncate text-xs text-[#77819c]">
                                    Expert Local Guide
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="flex w-full items-center justify-center gap-2 py-2 text-xs font-semibold text-[#77819c] transition-colors hover:text-rose-400"
                        >
                            <span className="material-symbols-outlined text-base">
                                logout
                            </span>{' '}
                            Keluar
                        </Link>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex h-screen flex-1 flex-col overflow-y-auto">
                    {/* Mobile Top App Bar (Mobile Only) */}
                    <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-white/10 bg-[#0d182e]/90 px-6 py-4 backdrop-blur-md md:hidden">
                        <Link
                            href="/"
                            className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-bold text-[#e9c176]"
                        >
                            IguideU
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <span className="material-symbols-outlined text-white">
                                    notifications
                                </span>
                                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-[#e9c176]"></span>
                            </div>
                            <div className="h-8 w-8 overflow-hidden rounded-full border border-[#e9c176]/30">
                                <img
                                    className="h-full w-full object-cover"
                                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuB81JZoovQYvUPt3qqEh1WiVH-5W617A7OTa4KaArUnUfCGkmDw4Dpqj0X5pyjJGfPWF8kxvhdBE_FupP7LhP6QPbBnArtSaC_A3hQ4KUmRZXzzdSuImMAFP5HYCRxTEOpjJ9sGY-iyH82Ynaa6ZjWuPLb_cCFDhj-uR9enucFAFOM1yKVsQun1jTPnSNco5eWNKS4dYtMe-vjA5P-jbRr0ed5UFEVd3Pa74DW6dqlv8MY-8zpZ9NJE"
                                    alt="Guide Profile"
                                />
                            </div>
                        </div>
                    </header>

                    <div className="mx-auto w-full max-w-[1440px] flex-1 px-6 py-8 md:px-12 md:py-10">
                        {/* KYC Verification Status Banner */}
                        {verificationStatus === 'pending' && (
                            <div className="mb-8 flex items-start gap-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-5 text-amber-200 shadow-xl backdrop-blur-md">
                                <span className="material-symbols-outlined mt-0.5 text-2xl text-amber-400">
                                    hourglass_top
                                </span>
                                <div>
                                    <h4 className="font-bold text-sm text-white">
                                        Akun Sedang Dalam Proses Verifikasi Admin (KYC)
                                    </h4>
                                    <p className="mt-1 text-xs text-amber-200/90 leading-relaxed">
                                        Dokumen KTP dan data keahlian Anda sedang ditinjau tim verifikator IguideU (1x24 jam kerja). Profil Anda akan otomatis tayang di katalog pencarian wisatawan setelah disetujui.
                                    </p>
                                </div>
                            </div>
                        )}

                        {verificationStatus === 'rejected' && (
                            <div className="mb-8 flex items-start gap-4 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-5 text-rose-200 shadow-xl backdrop-blur-md">
                                <span className="material-symbols-outlined mt-0.5 text-2xl text-rose-400">
                                    cancel
                                </span>
                                <div>
                                    <h4 className="font-bold text-sm text-white">
                                        Pengajuan Verifikasi Identitas Ditolak
                                    </h4>
                                    <p className="mt-1 text-xs text-rose-200/90 leading-relaxed">
                                        {guideProfile?.rejection_reason ||
                                            'Dokumen identitas tidak memenuhi ketentuan verifikasi. Silakan hubungi tim bantuan IguideU.'}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Header Section */}
                        <section className="mb-10">
                            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                                <div>
                                    <div className="mb-2 flex items-center gap-3">
                                        <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-bold text-white md:text-4xl">
                                            Halo,{' '}
                                            {auth?.user?.name?.split(' ')[0] ||
                                                'Budi'}
                                            !
                                        </h2>
                                        {/* Availability Switch */}
                                        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-[#16223B] px-3.5 py-1.5">
                                            <span
                                                className={`h-2.5 w-2.5 rounded-full ${isAvailable ? 'animate-pulse bg-emerald-400' : 'bg-rose-500'}`}
                                            ></span>
                                            <span className="text-xs font-semibold text-white">
                                                {isAvailable
                                                    ? 'Status: Aktif'
                                                    : 'Status: Off'}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    setIsAvailable(!isAvailable)
                                                }
                                                className="ml-1 text-xs text-[#e9c176] hover:underline"
                                            >
                                                Ubah
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-sm text-[#77819c] md:text-base">
                                        Siap memandu perjalanan tak terlupakan
                                        hari ini?
                                    </p>
                                </div>

                                <div className="flex gap-4">
                                    <div className="glass-panel flex items-center gap-3 rounded-xl px-5 py-3">
                                        <div className="rounded-full bg-[#e9c176]/10 p-2 text-[#e9c176]">
                                            <span className="material-symbols-outlined text-xl">
                                                event
                                            </span>
                                        </div>
                                        <div>
                                            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl leading-none font-bold text-white">
                                                {bookings.upcoming?.length || 0}
                                            </p>
                                            <p className="text-xs text-[#77819c]">
                                                Jadwal Tur
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Main Bento Grid Layout */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                            {/* Left Column (Wider on Desktop) */}
                            <div className="flex flex-col gap-6 lg:col-span-8">
                                {/* Quick Metrics Overview */}
                                <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                    {/* New Orders */}
                                    <div className="glass-panel group relative overflow-hidden rounded-2xl p-6 transition-colors hover:border-[#e9c176]/40">
                                        <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
                                            <span className="material-symbols-outlined text-5xl text-[#e9c176]">
                                                schedule
                                            </span>
                                        </div>
                                        <h3 className="mb-4 text-xs font-semibold tracking-wider text-[#77819c] uppercase">
                                            Pesanan Baru
                                        </h3>
                                        <div className="flex items-end gap-2">
                                            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-bold text-white">
                                                {stats.newOrdersCount}
                                            </span>
                                            <span className="mb-1 text-xs font-semibold text-[#e9c176]">
                                                Menunggu
                                            </span>
                                        </div>
                                    </div>

                                    {/* Today's Active Tour */}
                                    {activeTour ? (
                                        <div className="glass-panel rounded-2xl border-l-4 border-l-[#e9c176] bg-gradient-to-r from-[#0d182e]/90 to-transparent p-6 md:col-span-2">
                                            <div className="flex h-full flex-col justify-between">
                                                <div className="mb-3 flex items-start justify-between">
                                                    <h3 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-[#e9c176] uppercase">
                                                        <span className="material-symbols-outlined text-base">
                                                            tour
                                                        </span>{' '}
                                                        Tur Hari Ini
                                                    </h3>
                                                    <span className="rounded-full bg-white/10 px-3 py-0.5 text-xs font-medium text-white">
                                                        {activeTour.start_time}{' '}
                                                        WIB
                                                    </span>
                                                </div>
                                                <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
                                                    <div>
                                                        <p className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold text-white">
                                                            {
                                                                activeTour
                                                                    .traveler
                                                                    ?.name
                                                            }{' '}
                                                            (
                                                            {activeTour.package
                                                                ?.max_persons ||
                                                                1}{' '}
                                                            Pax)
                                                        </p>
                                                        <p className="mt-0.5 flex items-center gap-1 text-xs text-[#77819c]">
                                                            <span className="material-symbols-outlined text-sm text-[#e9c176]">
                                                                location_on
                                                            </span>{' '}
                                                            {
                                                                activeTour
                                                                    .package
                                                                    ?.title
                                                            }
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => setSelectedTrip(activeTour)}
                                                        className="flex items-center gap-1.5 rounded-full bg-[#e9c176] px-4 py-2 text-xs font-bold text-[#0d182e] transition-colors hover:bg-[#e9c176]/90 shadow-md active:scale-95 cursor-pointer"
                                                    >
                                                        {activeTour.guide_ended_at ? (
                                                            <>
                                                                <span className="material-symbols-outlined text-sm">hourglass_bottom</span>
                                                                Status Konfirmasi
                                                            </>
                                                        ) : (
                                                            <>
                                                                <span className="material-symbols-outlined text-sm">map</span>
                                                                Detail & Akhiri Tur
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="glass-panel flex items-center justify-center rounded-2xl border-l-4 border-l-gray-600 p-6 md:col-span-2">
                                            <p className="text-[#77819c]">
                                                Tidak ada jadwal tur hari ini.
                                            </p>
                                        </div>
                                    )}
                                </section>

                                {/* Booking Management */}
                                <section className="glass-panel flex flex-1 flex-col rounded-2xl">
                                    <div className="border-b border-white/10 p-6">
                                        <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-bold text-white">
                                            Manajemen Pesanan
                                        </h3>
                                    </div>

                                    {/* Tabs */}
                                    <div className="no-scrollbar flex gap-2 overflow-x-auto border-b border-white/10 px-6 pt-3">
                                        <button
                                            onClick={() =>
                                                setActiveTab('pending')
                                            }
                                            className={`border-b-2 px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all ${activeTab === 'pending' ? 'border-[#e9c176] text-[#e9c176]' : 'border-transparent text-[#77819c] hover:text-white'}`}
                                        >
                                            Menunggu Persetujuan
                                        </button>
                                        <button
                                            onClick={() =>
                                                setActiveTab('upcoming')
                                            }
                                            className={`border-b-2 px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all ${activeTab === 'upcoming' ? 'border-[#e9c176] text-[#e9c176]' : 'border-transparent text-[#77819c] hover:text-white'}`}
                                        >
                                            Akan Datang
                                        </button>
                                        <button
                                            onClick={() =>
                                                setActiveTab('completed')
                                            }
                                            className={`border-b-2 px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all ${activeTab === 'completed' ? 'border-[#e9c176] text-[#e9c176]' : 'border-transparent text-[#77819c] hover:text-white'}`}
                                        >
                                            Selesai
                                        </button>
                                    </div>

                                    {/* Request Cards List */}
                                    <div className="flex-1 space-y-4 p-6">
                                        {bookings[activeTab]?.length === 0 ? (
                                            <div className="py-10 text-center">
                                                <p className="text-[#77819c]">
                                                    Tidak ada pesanan.
                                                </p>
                                            </div>
                                        ) : (
                                            bookings[activeTab]?.map(
                                                (booking: any) => (
                                                    <div
                                                        key={booking.id}
                                                        className="flex flex-col justify-between gap-6 rounded-xl border border-white/10 bg-[#16223B]/60 p-5 transition-all hover:border-[#e9c176]/40 md:flex-row md:items-center"
                                                    >
                                                        <div className="flex-1">
                                                            <div className="mb-2 flex items-center gap-3">
                                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e9c176]/15 text-lg font-bold text-[#e9c176]">
                                                                    {booking.traveler?.name?.charAt(
                                                                        0,
                                                                    ) || 'U'}
                                                                </div>
                                                                <div>
                                                                    <h4 className="text-base font-bold text-white">
                                                                        {booking
                                                                            .traveler
                                                                            ?.name ||
                                                                            'Tamu'}
                                                                    </h4>
                                                                    <p className="text-xs text-[#77819c]">
                                                                        {booking
                                                                            .package
                                                                            ?.max_persons ||
                                                                            1}{' '}
                                                                        Pax
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="mt-3 grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <p className="text-[11px] text-[#77819c]">
                                                                        Paket
                                                                        Tur
                                                                    </p>
                                                                    <p className="text-xs font-medium text-white">
                                                                        {
                                                                            booking
                                                                                .package
                                                                                ?.title
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <div>
                                                                    <p className="text-[11px] text-[#77819c]">
                                                                        Tanggal
                                                                        & Waktu
                                                                    </p>
                                                                    <p className="text-xs font-medium text-white">
                                                                        {new Date(
                                                                            booking.booking_date,
                                                                        ).toLocaleDateString(
                                                                            'id-ID',
                                                                            {
                                                                                day: 'numeric',
                                                                                month: 'short',
                                                                                year: 'numeric',
                                                                            },
                                                                        )}
                                                                        ,{' '}
                                                                        {
                                                                            booking.start_time
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex h-full flex-col items-start justify-between border-t border-white/10 pt-4 md:items-end md:border-t-0 md:border-l md:pt-0 md:pl-6">
                                                            <div className="mb-3 text-left md:text-right">
                                                                <p className="text-[11px] text-[#77819c]">
                                                                    Potensi
                                                                    Pendapatan
                                                                </p>
                                                                <p className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold text-[#e9c176]">
                                                                    Rp{' '}
                                                                    {(
                                                                        Number(
                                                                            booking.total_amount,
                                                                        ) * 0.9
                                                                    ).toLocaleString(
                                                                        'id-ID',
                                                                    )}
                                                                </p>
                                                                <p className="text-[10px] text-[#77819c]">
                                                                    (Net setelah
                                                                    komisi)
                                                                </p>
                                                            </div>
                                                            {activeTab === 'pending' ? (
                                                                booking.status === 'pending' ? (
                                                                    <div className="flex w-full gap-2 md:w-auto">
                                                                        <Link
                                                                            href={`/api/mvp/reject-booking/${booking.id}`}
                                                                            method="post"
                                                                            as="button"
                                                                            className="rounded-full border border-white/20 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:border-rose-400 hover:bg-rose-500/20 hover:text-rose-300"
                                                                        >
                                                                            Tolak
                                                                        </Link>
                                                                        <Link
                                                                            href={`/api/mvp/approve-booking/${booking.id}`}
                                                                            method="post"
                                                                            as="button"
                                                                            className="rounded-full bg-[#e9c176] px-4 py-1.5 text-xs font-bold text-[#0d182e] transition-colors hover:bg-[#e9c176]/90"
                                                                        >
                                                                            Terima
                                                                        </Link>
                                                                    </div>
                                                                ) : (
                                                                    <div className="flex w-full flex-col items-start md:items-end gap-1.5 md:w-auto">
                                                                        {booking.payment?.payment_status === 'pending' ? (
                                                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold text-blue-400">
                                                                                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                                                                                Menunggu Konfirmasi Admin
                                                                            </span>
                                                                        ) : (
                                                                            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-semibold text-amber-400">
                                                                                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse"></span>
                                                                                Menunggu Pembayaran Wisatawan
                                                                            </span>
                                                                        )}
                                                                        <span className="text-[10px] text-[#77819c]">
                                                                            Sudah Anda Setujui
                                                                        </span>
                                                                    </div>
                                                                )
                                                            ) : activeTab === 'upcoming' ? (
                                                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
                                                                    {booking.guide_ended_at ? (
                                                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold text-blue-400">
                                                                            <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                                                                            Menunggu Konfirmasi Wisatawan
                                                                        </span>
                                                                    ) : (
                                                                        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-400">
                                                                            Terkonfirmasi (Lunas)
                                                                        </span>
                                                                    )}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setSelectedTrip(booking)}
                                                                        className="rounded-full border border-white/20 hover:border-[#e9c176]/50 bg-white/5 hover:bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white transition-colors cursor-pointer"
                                                                    >
                                                                        Detail Perjalanan
                                                                    </button>
                                                                    {!booking.guide_ended_at && (
                                                                        <button
                                                                            type="button"
                                                                            disabled={isSubmittingEndTrip}
                                                                            onClick={() => handleEndTrip(booking.id)}
                                                                            className="rounded-full bg-[#e9c176] hover:bg-[#fed488] px-3.5 py-1.5 text-xs font-bold text-[#0d182e] shadow-sm transition-transform active:scale-95 disabled:opacity-50 cursor-pointer"
                                                                        >
                                                                            Akhiri Perjalanan
                                                                        </button>
                                                                    )}
                                                                </div>
                                                             ) : (
                                                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
                                                                    {booking.review ? (
                                                                        <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-400">
                                                                            <span className="material-symbols-outlined text-sm">star</span>
                                                                            {booking.review.rating} / 5 Diulas
                                                                        </span>
                                                                    ) : (
                                                                        <span className="rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-xs font-bold text-[#77819c]">
                                                                            Selesai
                                                                        </span>
                                                                    )}
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setSelectedTrip(booking)}
                                                                        className="rounded-full border border-white/20 hover:border-[#e9c176]/50 bg-white/5 hover:bg-white/10 px-3.5 py-1.5 text-xs font-bold text-white transition-colors cursor-pointer"
                                                                    >
                                                                        Lihat Detail
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                ),
                                            )
                                        )}
                                    </div>
                                </section>
                            </div>

                            {/* Right Column */}
                            <div className="flex flex-col gap-6 lg:col-span-4">
                                {/* Financial Overview Card */}
                                <section
                                    id="keuangan"
                                    className="glass-panel ambient-shadow flex flex-col rounded-2xl p-6"
                                >
                                    <div className="mb-6 flex items-center justify-between">
                                        <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-bold text-white">
                                            Keuangan
                                        </h3>
                                        <button className="text-[#77819c] transition-colors hover:text-white">
                                            <span className="material-symbols-outlined">
                                                more_horiz
                                            </span>
                                        </button>
                                    </div>

                                    {/* Big Balance Card */}
                                    <div className="relative mb-6 overflow-hidden rounded-xl border border-[#e9c176]/30 bg-gradient-to-br from-[#e9c176]/20 to-transparent p-6">
                                        <div className="absolute -top-8 -right-8 h-28 w-28 rounded-full bg-[#e9c176]/20 blur-2xl"></div>
                                        <p className="mb-1 text-xs font-semibold tracking-wider text-[#c6c6ce] uppercase">
                                            Saldo Siap Tarik
                                        </p>
                                        <h4 className="mb-5 font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-bold text-[#e9c176]">
                                            Rp 2.450.000
                                        </h4>
                                        <button className="w-full rounded-full bg-[#e9c176] py-3 text-sm font-bold text-[#0d182e] shadow-lg transition-transform hover:bg-[#e9c176]/90 active:scale-95">
                                            Tarik Dana
                                        </button>
                                    </div>

                                    {/* Ledger Details */}
                                    <div className="space-y-3.5 text-xs">
                                        <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                            <span className="text-[#77819c]">
                                                Total Pendapatan (Bulan Ini)
                                            </span>
                                            <span className="font-bold text-white">
                                                Rp{' '}
                                                {stats.totalPendapatan.toLocaleString(
                                                    'id-ID',
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between border-b border-white/5 pb-3">
                                            <span className="text-[#77819c]">
                                                Potongan Komisi Platform (10%)
                                            </span>
                                            <span className="font-bold text-rose-300">
                                                - Rp{' '}
                                                {stats.komisi.toLocaleString(
                                                    'id-ID',
                                                )}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[#77819c]">
                                                Sudah Dicairkan
                                            </span>
                                            <span className="font-bold text-emerald-400">
                                                Rp{' '}
                                                {stats.dicairkan.toLocaleString(
                                                    'id-ID',
                                                )}
                                            </span>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                </main>
            </div>

            {/* Trip Detail Modal */}
            <Dialog
                open={!!selectedTrip}
                onOpenChange={(open) => !open && setSelectedTrip(null)}
            >
                <DialogContent className="max-w-2xl border border-white/10 bg-[#0d182e] p-0 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
                    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#0d182e]/95 px-6 py-4 backdrop-blur-md">
                        <div>
                            <DialogTitle className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-bold text-white flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#e9c176]">map</span>
                                Detail Perjalanan Tur
                            </DialogTitle>
                            <DialogDescription className="text-xs text-[#77819c] mt-0.5">
                                ID Pesanan:{' '}
                                <span className="font-mono font-bold text-[#e9c176]">
                                    {selectedTrip?.booking_code || selectedTrip?.id}
                                </span>
                            </DialogDescription>
                        </div>
                    </div>

                    {selectedTrip && (
                        <div className="space-y-6 p-6">
                            {/* Status Alert Banner */}
                            {selectedTrip.status === 'completed' ? (
                                <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-300">
                                    <span className="material-symbols-outlined text-2xl text-emerald-400">check_circle</span>
                                    <div>
                                        <p className="font-bold text-sm text-white">Perjalanan Telah Selesai</p>
                                        <p className="text-xs text-emerald-200/90 mt-0.5">
                                            Wisatawan telah mengonfirmasi penyelesaian tur ini. Dana bersih telah masuk ke saldo siap tarik Anda.
                                        </p>
                                    </div>
                                </div>
                            ) : selectedTrip.guide_ended_at ? (
                                <div className="flex items-start gap-3 rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 text-blue-300">
                                    <span className="material-symbols-outlined text-2xl text-blue-400 animate-spin">hourglass_bottom</span>
                                    <div>
                                        <p className="font-bold text-sm text-white">Menunggu Konfirmasi Wisatawan</p>
                                        <p className="text-xs text-blue-200/90 mt-0.5">
                                            Anda telah menandai perjalanan ini berakhir pada{' '}
                                            {new Date(selectedTrip.guide_ended_at).toLocaleTimeString('id-ID', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}{' '}
                                            WIB. Menunggu wisatawan menekan tombol <strong>"Konfirmasi Perjalanan Selesai"</strong> di akun mereka untuk melepaskan dana Escrow.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-300">
                                    <span className="material-symbols-outlined text-2xl text-[#e9c176]">verified_user</span>
                                    <div>
                                        <p className="font-bold text-sm text-white">Pembayaran Terverifikasi & Dana Aman di Escrow</p>
                                        <p className="text-xs text-amber-200/90 mt-0.5">
                                            Pembayaran wisatawan telah diverifikasi oleh Admin. Silakan laksanakan tur sesuai jadwal dan tekan <strong>"Akhiri Perjalanan"</strong> setelah selesai memandu.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Section: Traveler Data */}
                            <div className="rounded-xl border border-white/10 bg-[#16223B]/60 p-5">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-[#77819c] mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm text-[#e9c176]">person</span>
                                    Informasi Wisatawan
                                </h4>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div className="flex items-center gap-3.5">
                                        <div className="h-12 w-12 rounded-full bg-[#e9c176]/20 border border-[#e9c176]/40 flex items-center justify-center font-bold text-lg text-[#e9c176]">
                                            {selectedTrip.traveler?.name?.charAt(0) || 'U'}
                                        </div>
                                        <div>
                                            <h5 className="font-bold text-base text-white">{selectedTrip.traveler?.name || 'Wisatawan'}</h5>
                                            <p className="text-xs text-[#77819c]">{selectedTrip.traveler?.email || '-'}</p>
                                            <p className="text-xs text-[#e9c176] font-mono mt-0.5">{selectedTrip.traveler?.phone || '0812-3456-7890'}</p>
                                        </div>
                                    </div>
                                    <a
                                        href={`https://wa.me/${(selectedTrip.traveler?.phone || '6281234567890').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                                            `Halo ${selectedTrip.traveler?.name || ''}, saya pemandu Anda dari IguideU untuk pesanan #${selectedTrip.booking_code || selectedTrip.id}.`,
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-xs font-bold text-white transition-all shadow-md active:scale-95 cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-base">chat</span>
                                        Hubungi via WhatsApp
                                    </a>
                                </div>
                            </div>

                            {/* Section: Tour Itinerary Details */}
                            <div className="rounded-xl border border-white/10 bg-[#16223B]/60 p-5">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-[#77819c] mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm text-[#e9c176]">tour</span>
                                    Rincian Paket & Jadwal
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                    <div className="rounded-lg bg-black/20 p-3">
                                        <span className="text-[#77819c] block mb-1">Paket Wisata</span>
                                        <span className="font-semibold text-white text-sm">
                                            {selectedTrip.package?.title || selectedTrip.notes || 'Paket Wisata Lombok'}
                                        </span>
                                    </div>
                                    <div className="rounded-lg bg-black/20 p-3">
                                        <span className="text-[#77819c] block mb-1">Jumlah Peserta</span>
                                        <span className="font-semibold text-white text-sm">
                                            {selectedTrip.package?.max_persons || 1} Orang (Pax)
                                        </span>
                                    </div>
                                    <div className="rounded-lg bg-black/20 p-3">
                                        <span className="text-[#77819c] block mb-1">Tanggal Tur</span>
                                        <span className="font-semibold text-white text-sm">
                                            {new Date(selectedTrip.booking_date).toLocaleDateString('id-ID', {
                                                weekday: 'long',
                                                day: 'numeric',
                                                month: 'long',
                                                year: 'numeric',
                                            })}
                                        </span>
                                    </div>
                                    <div className="rounded-lg bg-black/20 p-3">
                                        <span className="text-[#77819c] block mb-1">Waktu Mulai & Durasi</span>
                                        <span className="font-semibold text-white text-sm">
                                            {selectedTrip.start_time} WITA • {selectedTrip.duration_days || 1} Hari
                                        </span>
                                    </div>
                                </div>
                                {selectedTrip.notes && (
                                    <div className="mt-3 rounded-lg border border-white/5 bg-black/30 p-3 text-xs">
                                        <span className="text-[#77819c] block mb-1 font-semibold">Catatan dari Wisatawan:</span>
                                        <p className="text-white italic leading-relaxed">"{selectedTrip.notes}"</p>
                                    </div>
                                )}
                            </div>

                            {/* Section: Financials & Payout */}
                            <div className="rounded-xl border border-white/10 bg-[#16223B]/60 p-5">
                                <h4 className="text-xs font-bold uppercase tracking-wider text-[#77819c] mb-4 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-sm text-[#e9c176]">payments</span>
                                    Rincian Pendapatan Pemandu
                                </h4>
                                <div className="space-y-2.5 text-xs">
                                    <div className="flex justify-between text-[#77819c]">
                                        <span>Total Nilai Booking Wisatawan</span>
                                        <span className="font-medium text-white">
                                            Rp {Number(selectedTrip.total_amount).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-[#77819c]">
                                        <span>Potongan Komisi Platform IguideU (10%)</span>
                                        <span className="font-medium text-rose-400">
                                            - Rp {(Number(selectedTrip.total_amount) * 0.1).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between border-t border-white/10 pt-3 text-sm font-bold">
                                        <span className="text-white">Estimasi Pendapatan Bersih Anda (90%)</span>
                                        <span className="text-[#e9c176] text-base">
                                            Rp {(Number(selectedTrip.total_amount) * 0.9).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Section: Traveler Review & Rating (if exists) */}
                            {selectedTrip.review && (
                                <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
                                    <div className="flex items-center justify-between mb-3">
                                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-sm">reviews</span>
                                            Ulasan & Penilaian Wisatawan
                                        </h4>
                                        <div className="flex items-center gap-0.5 text-amber-400">
                                            {[...Array(Number(selectedTrip.review.rating) || 5)].map((_, i) => (
                                                <span key={i} className="material-symbols-outlined text-sm">star</span>
                                            ))}
                                            <span className="ml-1 text-xs font-bold font-mono">({selectedTrip.review.rating}/5)</span>
                                        </div>
                                    </div>
                                    <p className="text-xs text-white italic leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5">
                                        "{selectedTrip.review.comment || 'Wisatawan memberikan rating bintang tanpa komentar teks.'}"
                                    </p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedTrip(null)}
                                    className="flex-1 rounded-xl border border-white/10 py-3 text-xs font-bold text-white hover:bg-white/10 transition-colors cursor-pointer"
                                >
                                    Tutup
                                </button>
                                {selectedTrip.status !== 'completed' && !selectedTrip.guide_ended_at && (
                                    <button
                                        type="button"
                                        disabled={isSubmittingEndTrip}
                                        onClick={() => handleEndTrip(selectedTrip.id)}
                                        className="flex-1 rounded-xl bg-[#e9c176] hover:bg-[#fed488] py-3 text-xs font-bold text-[#0d182e] shadow-lg transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-base">flag</span>
                                        {isSubmittingEndTrip ? 'Memproses...' : 'Akhiri Perjalanan'}
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}
