import { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import {
    TrendingUp,
    ShieldCheck,
    CreditCard,
    Landmark,
    CheckCircle2,
    ArrowRight,
    Search,
    X,
    Clock,
    MapPin,
    Sparkles,
} from 'lucide-react';

interface Props {
    stats: {
        totalGmv: number;
        escrowFunds: number;
        platformRevenue: number;
        payoutsDisbursed: number;
        totalUsers: number;
        totalGuides: number;
        verifiedGuides: number;
        pendingKycCount: number;
        pendingPaymentsCount: number;
        totalBookingsMonth: number;
        completedBookings: number;
    };
    pendingKycList: Array<{
        id: number;
        name: string;
        email: string;
        phone: string;
        city: string;
        bankName: string;
        bankAccountNumber: string;
        bankAccountHolder: string;
        ktpUrl: string;
        time: string;
        avatar: string | null;
        appId: string;
    }>;
    pendingPaymentsList: Array<{
        id: number;
        bookingCode: string;
        travelerName: string;
        travelerPhone: string;
        guideName: string;
        amount: number;
        hasProof: boolean;
        paymentProof: string | null;
        time: string;
    }>;
    recentBookings: Array<{
        id: number;
        bookingCode: string;
        traveler: string;
        guide: string;
        packageName: string;
        amount: number;
        status: string;
        paymentStatus: string;
        date: string;
    }>;
    badges: {
        pendingKyc: number;
        pendingPayments: number;
        readyPayouts: number;
    };
}

export default function AdminDashboard({
    stats,
    pendingKycList = [],
    pendingPaymentsList = [],
    recentBookings = [],
    badges,
}: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [quickKycModal, setQuickKycModal] = useState<any | null>(null);
    const [quickPaymentModal, setQuickPaymentModal] = useState<any | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formatIDR = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(val);
    };

    const filteredBookings = useMemo(() => {
        return recentBookings.filter((b) => {
            const matchesStatus =
                statusFilter === 'all'
                    ? true
                    : statusFilter === 'confirmed'
                    ? b.status === 'confirmed'
                    : statusFilter === 'pending'
                    ? b.status === 'pending'
                    : statusFilter === 'completed'
                    ? b.status === 'completed'
                    : true;
            const matchesSearch =
                b.bookingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.traveler.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.guide.toLowerCase().includes(searchQuery.toLowerCase()) ||
                b.packageName.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [recentBookings, statusFilter, searchQuery]);

    const handleApproveKyc = (id: number) => {
        setIsSubmitting(true);
        router.post(
            `/admin/kyc/${id}/approve`,
            {},
            {
                onSuccess: () => {
                    setQuickKycModal(null);
                },
                onFinish: () => setIsSubmitting(false),
            },
        );
    };

    const handleVerifyPayment = (paymentId: number, status: 'verified' | 'rejected') => {
        setIsSubmitting(true);
        router.post(
            `/admin/payments/${paymentId}/verify`,
            { status },
            {
                onSuccess: () => {
                    setQuickPaymentModal(null);
                },
                onFinish: () => setIsSubmitting(false),
            },
        );
    };

    return (
        <AdminLayout title="Command Center" activeTab="overview" badges={badges}>
            <Head title="Admin Command Center - IguideU NTB" />

            <div className="space-y-6 sm:space-y-8">
                {/* Executive Welcome & Live Action Bar */}
                <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="rounded-md border border-[#E5B869]/30 bg-[#E5B869]/10 px-2.5 py-0.5 text-[10px] font-extrabold tracking-widest text-[#E5B869] uppercase">
                                EXECUTIVE COMMAND CENTER
                            </span>
                        </div>
                        <h1 className="mt-2 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                            Ringkasan Eksekutif & Analitik
                        </h1>
                        <p className="mt-1 text-xs text-slate-400">
                            Pemantauan verifikasi dokumen pemandu dan alur transaksi tur realtime di Provinsi NTB.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            href="/admin/kyc"
                            className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#111C33] px-4 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:border-[#E5B869]/40 hover:bg-[#16223B]"
                        >
                            <ShieldCheck className="h-4 w-4 text-[#E5B869]" />
                            <span>Tinjau KYC ({badges?.pendingKyc || 0})</span>
                        </Link>
                        <Link
                            href="/admin/payments"
                            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#E5B869] px-4 py-2.5 text-xs font-extrabold text-[#0A1224] shadow-lg shadow-[#C5A059]/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            <CreditCard className="h-4 w-4" />
                            <span>Kliring Pembayaran ({badges?.pendingPayments || 0})</span>
                        </Link>
                    </div>
                </div>

                {/* 1. Executive Bento KPI Cards (4 Cards) */}
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Total GMV */}
                    <div className="admin-card rounded-2xl p-5 shadow-xl transition-all hover:border-[#E5B869]/40">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                    Total Transaksi (GMV)
                                </p>
                                <h3 className="mt-2 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold text-white">
                                    {formatIDR(stats.totalGmv)}
                                </h3>
                            </div>
                            <div className="rounded-xl border border-[#E5B869]/20 bg-[#E5B869]/10 p-2.5 text-[#E5B869]">
                                <TrendingUp className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                            <span>Bulan Ini: <strong className="text-white">{stats.totalBookingsMonth} Pesanan</strong></span>
                            <span>{stats.completedBookings} Selesai</span>
                        </div>
                    </div>

                    {/* Escrow Pool */}
                    <div className="admin-card rounded-2xl p-5 shadow-xl transition-all hover:border-amber-500/40">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                    Dana di Rekening Escrow
                                </p>
                                <h3 className="mt-2 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold text-amber-300">
                                    {formatIDR(stats.escrowFunds)}
                                </h3>
                            </div>
                            <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-2.5 text-amber-400">
                                <Landmark className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                            <span>Pending Kliring: <strong className="text-amber-300">{badges?.pendingPayments || 0}</strong></span>
                            <Link href="/admin/payments" className="font-semibold text-[#E5B869] hover:underline">
                                Kliring →
                            </Link>
                        </div>
                    </div>

                    {/* Platform Net Revenue */}
                    <div className="admin-card rounded-2xl p-5 shadow-xl transition-all hover:border-emerald-500/40">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                    Margin Platform (10%)
                                </p>
                                <h3 className="mt-2 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold text-emerald-400">
                                    {formatIDR(stats.platformRevenue)}
                                </h3>
                            </div>
                            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2.5 text-emerald-400">
                                <Sparkles className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                            <span>Disbursed: {formatIDR(stats.payoutsDisbursed)}</span>
                            <Link href="/admin/treasury" className="font-semibold text-emerald-400 hover:underline">
                                Treasury →
                            </Link>
                        </div>
                    </div>

                    {/* Verified Tour Guides */}
                    <div className="admin-card rounded-2xl p-5 shadow-xl transition-all hover:border-emerald-500/40">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                    Mitra Guide Aktif
                                </p>
                                <h3 className="mt-2 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold text-white">
                                    {stats.verifiedGuides}{' '}
                                    <span className="text-xs font-normal text-slate-400">
                                        / {stats.totalGuides} Guide
                                    </span>
                                </h3>
                            </div>
                            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2.5 text-emerald-400">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                            <span>Pending KYC: <strong className="text-amber-300">{stats.pendingKycCount}</strong></span>
                            <Link href="/admin/kyc" className="font-semibold text-[#E5B869] hover:underline">
                                Buka KYC →
                            </Link>
                        </div>
                    </div>
                </section>

                {/* 2. Priority Action Center (Two-column Grid) */}
                <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {/* Left: Pending KYC Review Queue */}
                    <div className="admin-card flex flex-col rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                    <ShieldCheck className="h-4 w-4" />
                                </div>
                                <div>
                                    <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-bold text-white">
                                        Antrean Verifikasi KYC Guide
                                    </h2>
                                    <p className="text-[11px] text-slate-400">
                                        Pendaftaran calon pemandu lokal NTB yang membutuhkan peninjauan berkas.
                                    </p>
                                </div>
                            </div>
                            <Link
                                href="/admin/kyc"
                                className="flex items-center gap-1 rounded-lg bg-white/5 px-2.5 py-1 text-xs font-semibold text-[#E5B869] hover:bg-white/10 transition-colors"
                            >
                                <span>Meja Verifikasi</span>
                                <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>

                        <div className="mt-4 flex-1 space-y-3">
                            {pendingKycList.length === 0 ? (
                                <div className="flex h-44 flex-col items-center justify-center text-center">
                                    <CheckCircle2 className="h-8 w-8 text-emerald-400/60" />
                                    <p className="mt-2 text-xs font-medium text-white">
                                        Semua Pengajuan Telah Ditinjau
                                    </p>
                                    <p className="text-[11px] text-slate-400">
                                        Tidak ada pendaftar KYC yang menunggu persetujuan saat ini.
                                    </p>
                                </div>
                            ) : (
                                pendingKycList.map((applicant) => (
                                    <div
                                        key={applicant.id}
                                        className="flex items-center justify-between rounded-xl border border-white/5 bg-[#070D1B]/60 p-3.5 transition-colors hover:border-[#E5B869]/30 hover:bg-[#070D1B]"
                                    >
                                        <div className="flex items-center gap-3">
                                            {applicant.avatar ? (
                                                <img
                                                    src={applicant.avatar}
                                                    alt={applicant.name}
                                                    className="h-10 w-10 rounded-xl border border-white/10 object-cover"
                                                />
                                            ) : (
                                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5B869]/15 font-bold text-[#E5B869] border border-[#E5B869]/20">
                                                    {applicant.name.charAt(0)}
                                                </div>
                                            )}
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-xs font-bold text-white">
                                                        {applicant.name}
                                                    </h3>
                                                    <span className="font-mono text-[10px] text-slate-500">
                                                        {applicant.appId}
                                                    </span>
                                                </div>
                                                <div className="mt-0.5 flex items-center gap-2 text-[11px] text-slate-400">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="h-3 w-3 text-[#E5B869]" />
                                                        {applicant.city}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{applicant.time}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => setQuickKycModal(applicant)}
                                            className="rounded-lg border border-[#E5B869]/30 bg-[#E5B869]/10 px-3 py-1.5 text-xs font-bold text-[#E5B869] transition-colors hover:bg-[#E5B869] hover:text-[#0A1224]"
                                        >
                                            Periksa Cepat
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Right: Pending Manual Payments Queue */}
                    <div className="admin-card flex flex-col rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                    <CreditCard className="h-4 w-4" />
                                </div>
                                <div>
                                    <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-bold text-white">
                                        Pembayaran Menunggu Konfirmasi
                                    </h2>
                                    <p className="text-[11px] text-slate-400">
                                        Transfer manual dari wisatawan yang membutuhkan verifikasi struk bank.
                                    </p>
                                </div>
                            </div>
                            <Link
                                href="/admin/payments"
                                className="flex items-center gap-1 rounded-lg bg-white/5 px-2.5 py-1 text-xs font-semibold text-[#E5B869] hover:bg-white/10 transition-colors"
                            >
                                <span>Meja Pembayaran</span>
                                <ArrowRight className="h-3 w-3" />
                            </Link>
                        </div>

                        <div className="mt-4 flex-1 space-y-3">
                            {pendingPaymentsList.length === 0 ? (
                                <div className="flex h-44 flex-col items-center justify-center text-center">
                                    <CheckCircle2 className="h-8 w-8 text-emerald-400/60" />
                                    <p className="mt-2 text-xs font-medium text-white">
                                        Seluruh Pembayaran Bersih
                                    </p>
                                    <p className="text-[11px] text-slate-400">
                                        Tidak ada bukti transfer manual yang tertunda.
                                    </p>
                                </div>
                            ) : (
                                pendingPaymentsList.map((payment) => (
                                    <div
                                        key={payment.id}
                                        className="flex items-center justify-between rounded-xl border border-white/5 bg-[#070D1B]/60 p-3.5 transition-colors hover:border-[#E5B869]/30 hover:bg-[#070D1B]"
                                    >
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs font-bold text-white">
                                                    {payment.bookingCode}
                                                </span>
                                                <span className="rounded bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-extrabold text-amber-300">
                                                    Transfer Bank
                                                </span>
                                            </div>
                                            <p className="mt-1 text-xs text-slate-400">
                                                <strong className="text-slate-200">{payment.travelerName}</strong> → {payment.guideName}
                                            </p>
                                            <p className="mt-0.5 text-[10px] text-slate-500">{payment.time}</p>
                                        </div>

                                        <div className="flex flex-col items-end gap-1.5">
                                            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold text-[#E5B869]">
                                                {formatIDR(payment.amount)}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => setQuickPaymentModal(payment)}
                                                className="rounded-lg bg-[#E5B869] px-3 py-1 text-[11px] font-bold text-[#0A1224] transition-opacity hover:opacity-90"
                                            >
                                                Kliring Cepat
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>

                {/* 3. Live Platform Activity Feed Table */}
                <section className="admin-card overflow-hidden rounded-2xl shadow-2xl">
                    <div className="flex flex-col justify-between gap-4 border-b border-white/10 bg-[#070D1B]/90 p-5 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-bold text-white">
                                Transaksi & Pemesanan Terkini
                            </h2>
                            <p className="text-xs text-slate-400">
                                Aliran pemesanan aktif wisatawan dan pemandu lokal di seluruh destinasi NTB.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Filter Status Chips */}
                            <div className="flex gap-1 rounded-xl border border-white/10 bg-[#111C33] p-1">
                                <button
                                    type="button"
                                    onClick={() => setStatusFilter('all')}
                                    className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                                        statusFilter === 'all'
                                            ? 'bg-[#E5B869] text-[#0A1224] font-bold'
                                            : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    Semua
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStatusFilter('confirmed')}
                                    className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                                        statusFilter === 'confirmed'
                                            ? 'bg-emerald-500 text-white font-bold'
                                            : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    Confirmed
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStatusFilter('pending')}
                                    className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                                        statusFilter === 'pending'
                                            ? 'bg-amber-500 text-[#0A1224] font-bold'
                                            : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    Pending
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setStatusFilter('completed')}
                                    className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                                        statusFilter === 'completed'
                                            ? 'bg-sky-500 text-white font-bold'
                                            : 'text-slate-400 hover:text-white'
                                    }`}
                                >
                                    Completed
                                </button>
                            </div>

                            <div className="relative min-w-[180px]">
                                <Search className="absolute top-2.5 left-2.5 h-3.5 w-3.5 text-slate-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Cari transaksi..."
                                    className="w-full rounded-xl border border-white/10 bg-[#111C33] py-1.5 pr-3 pl-8 text-xs text-white placeholder-slate-500 focus:border-[#E5B869] focus:outline-none"
                                />
                            </div>
                            <Link
                                href="/admin/treasury"
                                className="flex items-center gap-1 text-xs font-bold text-[#E5B869] hover:underline"
                            >
                                <span>Treasury Kas</span>
                                <ArrowRight className="h-3.5 w-3.5" />
                            </Link>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-white/10 bg-[#050A14] text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                    <th className="p-4">Kode Booking</th>
                                    <th className="p-4">Wisatawan</th>
                                    <th className="p-4">Pemandu Mitra</th>
                                    <th className="p-4">Paket Wisata</th>
                                    <th className="p-4 text-right">Nominal</th>
                                    <th className="p-4 text-center">Status Pesanan</th>
                                    <th className="p-4 text-center">Pembayaran</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-xs text-white">
                                {filteredBookings.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-8 text-center text-slate-400">
                                            Belum ada aktivitas transaksi terekam atau sesuai filter.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredBookings.map((b) => (
                                        <tr
                                            key={b.id}
                                            className="transition-colors hover:bg-white/[0.02]"
                                        >
                                            <td className="p-4 font-mono font-bold text-[#E5B869]">
                                                {b.bookingCode}
                                                <span className="block text-[10px] font-normal text-slate-500">
                                                    {b.date}
                                                </span>
                                            </td>
                                            <td className="p-4 font-bold text-white">
                                                {b.traveler}
                                            </td>
                                            <td className="p-4 text-slate-300">
                                                {b.guide}
                                            </td>
                                            <td className="p-4 text-slate-300 max-w-xs truncate">
                                                {b.packageName}
                                            </td>
                                            <td className="p-4 text-right font-['Plus_Jakarta_Sans',sans-serif] font-bold text-white">
                                                {formatIDR(b.amount)}
                                            </td>
                                            <td className="p-4 text-center">
                                                {b.status === 'confirmed' && (
                                                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                                                        Confirmed
                                                    </span>
                                                )}
                                                {b.status === 'pending' && (
                                                    <span className="rounded-full border border-amber-500/30 bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-bold text-amber-400">
                                                        Pending Guide
                                                    </span>
                                                )}
                                                {b.status === 'completed' && (
                                                    <span className="rounded-full border border-sky-500/30 bg-sky-500/15 px-2.5 py-0.5 text-[10px] font-bold text-sky-400">
                                                        Completed
                                                    </span>
                                                )}
                                                {b.status === 'cancelled' && (
                                                    <span className="rounded-full border border-rose-500/30 bg-rose-500/15 px-2.5 py-0.5 text-[10px] font-bold text-rose-400">
                                                        Cancelled
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-center">
                                                {b.paymentStatus === 'paid' || b.paymentStatus === 'verified' || b.paymentStatus === 'forwarded' ? (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                        <span>Lunas (Escrow)</span>
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400">
                                                        <Clock className="h-3.5 w-3.5" />
                                                        <span>Menunggu</span>
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* QUICK KYC MODAL */}
                {quickKycModal && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-150"
                        onClick={() => setQuickKycModal(null)}
                    >
                        <div
                            className="w-full max-w-lg rounded-3xl border border-[#C5A059]/30 bg-[#0E172B] p-6 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#E5B869]/30 bg-[#E5B869]/15 text-[#E5B869]">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-bold text-white">
                                            Peninjauan Cepat KYC Guide
                                        </h3>
                                        <p className="text-xs text-slate-400">
                                            {quickKycModal.appId} • {quickKycModal.city}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setQuickKycModal(null)}
                                    className="text-slate-400 hover:text-white"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="mt-4 space-y-3">
                                <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#16223B]/80 p-3.5">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E5B869]/20 font-bold text-[#E5B869]">
                                        {quickKycModal.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm">{quickKycModal.name}</h4>
                                        <p className="text-xs text-slate-400">{quickKycModal.email} • {quickKycModal.phone}</p>
                                    </div>
                                </div>

                                <div className="h-44 overflow-hidden rounded-2xl border border-white/10 bg-black/50 p-2 flex items-center justify-center">
                                    <img
                                        src={quickKycModal.ktpUrl}
                                        alt="Foto KTP"
                                        className="max-h-full max-w-full rounded-xl object-contain shadow"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-4">
                                <Link
                                    href="/admin/kyc"
                                    className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5"
                                >
                                    Buka Meja Lengkap
                                </Link>
                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() => handleApproveKyc(quickKycModal.id)}
                                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50"
                                >
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>{isSubmitting ? 'Memproses...' : 'Setujui & Verifikasi'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* QUICK PAYMENT MODAL */}
                {quickPaymentModal && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-150"
                        onClick={() => setQuickPaymentModal(null)}
                    >
                        <div
                            className="w-full max-w-lg rounded-3xl border border-white/20 bg-[#111C33] p-6 shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/15 text-amber-300">
                                        <CreditCard className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-bold text-white">
                                            Kliring Pembayaran Cepat
                                        </h3>
                                        <p className="text-xs text-slate-400">
                                            Booking #{quickPaymentModal.bookingCode}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setQuickPaymentModal(null)}
                                    className="text-slate-400 hover:text-white"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="mt-4 space-y-3 text-xs">
                                <div className="flex justify-between items-center rounded-2xl border border-white/10 bg-[#070D1B] p-3.5">
                                    <span className="text-slate-400">Total Nominal:</span>
                                    <strong className="text-base text-[#E5B869] font-['Plus_Jakarta_Sans']">
                                        {formatIDR(quickPaymentModal.amount)}
                                    </strong>
                                </div>

                                <div className="h-44 overflow-hidden rounded-2xl border border-white/10 bg-black/50 p-2 flex items-center justify-center">
                                    {quickPaymentModal.paymentProof ? (
                                        <img
                                            src={`/storage/${quickPaymentModal.paymentProof}`}
                                            alt="Bukti Transfer"
                                            className="max-h-full max-w-full rounded-xl object-contain shadow"
                                        />
                                    ) : (
                                        <p className="text-slate-400">Bukti struk belum diunggah</p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3 border-t border-white/10 pt-4">
                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() => handleVerifyPayment(quickPaymentModal.id, 'rejected')}
                                    className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500/20 disabled:opacity-50"
                                >
                                    Tolak
                                </button>
                                <button
                                    type="button"
                                    disabled={isSubmitting}
                                    onClick={() => handleVerifyPayment(quickPaymentModal.id, 'verified')}
                                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#E5B869] px-5 py-2 text-xs font-extrabold text-[#0A1224] shadow-lg shadow-[#C5A059]/25 hover:scale-[1.02] disabled:opacity-50"
                                >
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>{isSubmitting ? 'Memproses...' : 'Setujui Masuk Escrow'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}