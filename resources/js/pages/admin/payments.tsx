import AdminLayout from '@/layouts/admin-layout';
import { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    Search,
    CreditCard,
    CheckCircle2,
    XCircle,
    Clock,
    AlertCircle,
    ZoomIn,
    ZoomOut,
    X,
    ArrowUpRight,
    Landmark,
    FileText,
    ExternalLink,
    Filter,
    Sparkles,
    User,
    Check,
    RotateCw,
    MessageSquare,
    Copy,
    Phone,
    Mail,
    ArrowRight,
} from 'lucide-react';

interface Payment {
    id: number;
    amount: string;
    numericAmount: number;
    platformFee: number;
    guideNet: number;
    payment_status: 'pending' | 'verified' | 'forwarded' | 'rejected';
    payment_proof: string | null;
    created_at: string;
    paid_at: string | null;
    timeAgo: string;
    booking: {
        id: number;
        booking_code: string;
        booking_date: string;
        traveler: {
            name: string;
            email: string;
            phone: string;
        };
        guide: {
            name: string;
            phone: string;
        };
        package: {
            title: string;
            duration: string;
        };
    };
}

interface Props {
    payments: Payment[];
    counts: {
        all: number;
        pending: number;
        verified: number;
        forwarded: number;
        rejected: number;
    };
}

const REJECT_REASONS = [
    'Nominal transfer tidak sesuai dengan total tagihan pesanan.',
    'Foto bukti struk transfer buram, terpotong, atau tidak terbaca.',
    'Rekening bank tujuan transfer salah atau tidak tercatat di mutasi rekening IguideU.',
    'Tanggal atau jam transaksi pada struk tidak sesuai waktu pemesanan.',
];

export default function AdminPayments({ payments = [], counts }: Props) {
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [statusFilter, setStatusFilter] = useState<
        'all' | 'pending' | 'verified' | 'forwarded' | 'rejected'
    >('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [proofRotation, setProofRotation] = useState(0);
    const [zoomScale, setZoomScale] = useState(1);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const filteredPayments = useMemo(() => {
        return payments.filter((item) => {
            const matchesStatus =
                statusFilter === 'all' ? true : item.payment_status === statusFilter;
            const matchesQuery =
                item.booking.booking_code
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                item.booking.traveler.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                item.booking.guide.name
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase()) ||
                item.booking.package.title
                    .toLowerCase()
                    .includes(searchQuery.toLowerCase());
            return matchesStatus && matchesQuery;
        });
    }, [payments, statusFilter, searchQuery]);

    const handleVerify = (status: 'verified' | 'forwarded' | 'rejected') => {
        if (!selectedPayment) return;
        setIsVerifying(true);

        router.post(
            `/admin/payments/${selectedPayment.id}/verify`,
            {
                status: status,
                reason: rejectReason,
            },
            {
                onSuccess: () => {
                    setIsVerifying(false);
                    setSelectedPayment(null);
                    setRejectModalOpen(false);
                    setRejectReason('');
                },
                onError: (errors) => {
                    console.error(errors);
                    setIsVerifying(false);
                },
            },
        );
    };

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedCode(text);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const getTravelerWhatsAppUrl = (p: Payment) => {
        const text = `Halo Kak ${p.booking.traveler.name},\n\nKami dari Admin IguideU NTB terkait pemesanan tur (#${p.booking.booking_code}) bersama pemandu ${p.booking.guide.name}.\n\nTotal Tagihan: Rp ${Number(p.amount).toLocaleString('id-ID')}\nStatus: Verifikasi Pembayaran\n\nMohon pastikan bukti transfer sudah valid. Jika ada pertanyaan jangan ragu hubungi kami. Terima kasih!`;
        const phone = p.booking.traveler.phone?.replace(/[^0-9]/g, '');
        return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    };

    const formatIDR = (val: number | string) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(Number(val));
    };

    const totalPendingAmount = payments
        .filter((p) => p.payment_status === 'pending')
        .reduce((sum, p) => sum + (p.numericAmount || 0), 0);

    const totalEscrowAmount = payments
        .filter((p) => p.payment_status === 'verified')
        .reduce((sum, p) => sum + (p.numericAmount || 0), 0);

    return (
        <AdminLayout
            title="Kliring Pembayaran"
            activeTab="payments"
            badges={{
                pendingPayments: counts?.pending || 0,
            }}
        >
            <Head title="Kliring Pembayaran Manual - Admin IguideU" />

            <div className="space-y-6 sm:space-y-8">
                {/* Header Section */}
                <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="rounded-md border border-[#E5B869]/30 bg-[#E5B869]/10 px-2.5 py-0.5 text-[10px] font-extrabold tracking-widest text-[#E5B869] uppercase">
                                CLEARING & ESCROW DESK
                            </span>
                            <span className="text-xs text-slate-600">•</span>
                            <span className="text-xs font-medium text-slate-400">
                                Rekonsiliasi Bukti Transfer Bank
                            </span>
                        </div>
                        <h1 className="mt-2 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                            Kliring Pembayaran Wisatawan
                        </h1>
                        <p className="mt-1 text-xs text-slate-400">
                            Validasi struk transfer bank dari wisatawan sebelum dana masuk ke rekening penampungan aman (*escrow*).
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-right">
                            <p className="text-[10px] font-bold tracking-wider text-amber-300 uppercase">
                                Total Pending Kliring
                            </p>
                            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-extrabold text-white">
                                {formatIDR(totalPendingAmount)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 1. Summary KPI Bar */}
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="admin-card rounded-2xl p-4 shadow-xl">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400 uppercase">Menunggu Review</span>
                            <Clock className="h-4 w-4 text-amber-400" />
                        </div>
                        <p className="mt-2 text-2xl font-extrabold text-amber-300">
                            {counts?.pending || 0}{' '}
                            <span className="text-xs font-normal text-slate-400">Transaksi</span>
                        </p>
                        <p className="mt-1 text-[11px] text-slate-400">
                            {formatIDR(totalPendingAmount)}
                        </p>
                    </div>

                    <div className="admin-card rounded-2xl p-4 shadow-xl">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400 uppercase">Dana di Escrow</span>
                            <Landmark className="h-4 w-4 text-emerald-400" />
                        </div>
                        <p className="mt-2 text-2xl font-extrabold text-emerald-400">
                            {counts?.verified || 0}{' '}
                            <span className="text-xs font-normal text-slate-400">Pesanan</span>
                        </p>
                        <p className="mt-1 text-[11px] text-slate-400">
                            {formatIDR(totalEscrowAmount)}
                        </p>
                    </div>

                    <div className="admin-card rounded-2xl p-4 shadow-xl">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400 uppercase">Diteruskan ke Guide</span>
                            <CheckCircle2 className="h-4 w-4 text-[#E5B869]" />
                        </div>
                        <p className="mt-2 text-2xl font-extrabold text-[#E5B869]">
                            {counts?.forwarded || 0}{' '}
                            <span className="text-xs font-normal text-slate-400">Disbursed</span>
                        </p>
                        <p className="mt-1 text-[11px] text-slate-400">
                            Pencairan tuntas
                        </p>
                    </div>

                    <div className="admin-card rounded-2xl p-4 shadow-xl">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-400 uppercase">Bukti Ditolak</span>
                            <XCircle className="h-4 w-4 text-rose-400" />
                        </div>
                        <p className="mt-2 text-2xl font-extrabold text-rose-400">
                            {counts?.rejected || 0}{' '}
                            <span className="text-xs font-normal text-slate-400">Invalid</span>
                        </p>
                        <p className="mt-1 text-[11px] text-slate-400">
                            Struk palsu / tidak valid
                        </p>
                    </div>
                </section>

                {/* 2. Filter Tabs & Instant Search */}
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div className="no-scrollbar flex gap-1.5 overflow-x-auto rounded-xl border border-white/10 bg-[#111C33] p-1">
                        <button
                            onClick={() => setStatusFilter('all')}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                                statusFilter === 'all'
                                    ? 'bg-[#E5B869] text-[#0A1224] shadow font-bold'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            Semua ({counts?.all || payments.length})
                        </button>
                        <button
                            onClick={() => setStatusFilter('pending')}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                                statusFilter === 'pending'
                                    ? 'bg-amber-500 text-[#0A1224] shadow font-bold'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            Menunggu Verifikasi ({counts?.pending || 0})
                        </button>
                        <button
                            onClick={() => setStatusFilter('verified')}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                                statusFilter === 'verified'
                                    ? 'bg-emerald-500 text-[#0A1224] shadow font-bold'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            Terverifikasi / Escrow ({counts?.verified || 0})
                        </button>
                        <button
                            onClick={() => setStatusFilter('forwarded')}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                                statusFilter === 'forwarded'
                                    ? 'bg-[#C5A059] text-[#0A1224] shadow font-bold'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            Diteruskan ({counts?.forwarded || 0})
                        </button>
                        <button
                            onClick={() => setStatusFilter('rejected')}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                                statusFilter === 'rejected'
                                    ? 'bg-rose-500 text-white shadow font-bold'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            Ditolak ({counts?.rejected || 0})
                        </button>
                    </div>

                    <div className="relative min-w-[280px]">
                        <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Cari kode booking, tamu, guide..."
                            className="w-full rounded-xl border border-white/10 bg-[#111C33] py-2 pr-8 pl-9 text-xs text-white placeholder-slate-500 focus:border-[#E5B869] focus:outline-none"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute top-2.5 right-2.5 text-slate-400 hover:text-white"
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* 3. Transaction Data Table */}
                <section className="admin-card overflow-hidden rounded-2xl shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-white/10 bg-[#070D1B] text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                    <th className="p-4">Kode Booking & Waktu</th>
                                    <th className="p-4">Wisatawan</th>
                                    <th className="p-4">Pemandu & Paket</th>
                                    <th className="p-4 text-right">Nominal Transfer</th>
                                    <th className="p-4 text-center">Bukti Struk</th>
                                    <th className="p-4 text-center">Status</th>
                                    <th className="p-4 text-center">Aksi Kliring</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-xs text-white">
                                {filteredPayments.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-12 text-center text-slate-400">
                                            <AlertCircle className="mx-auto mb-2 h-6 w-6 opacity-40" />
                                            Tidak ada data pembayaran yang sesuai dengan kriteria pencarian.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPayments.map((payment) => (
                                        <tr
                                            key={payment.id}
                                            className="transition-colors hover:bg-white/[0.02]"
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center gap-1.5">
                                                    <span className="font-mono font-bold text-[#E5B869]">
                                                        {payment.booking.booking_code}
                                                    </span>
                                                    <button
                                                        onClick={() => handleCopy(payment.booking.booking_code)}
                                                        className="text-slate-400 hover:text-white"
                                                        title="Salin Kode Booking"
                                                    >
                                                        {copiedCode === payment.booking.booking_code ? (
                                                            <Check className="h-3 w-3 text-emerald-400" />
                                                        ) : (
                                                            <Copy className="h-3 w-3" />
                                                        )}
                                                    </button>
                                                </div>
                                                <span className="block text-[10px] text-slate-500 mt-0.5">
                                                    {payment.created_at} ({payment.timeAgo})
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <p className="font-bold text-white">
                                                    {payment.booking.traveler.name}
                                                </p>
                                                <p className="text-[11px] text-slate-400">
                                                    {payment.booking.traveler.phone || payment.booking.traveler.email}
                                                </p>
                                            </td>
                                            <td className="p-4">
                                                <p className="font-semibold text-slate-200">
                                                    {payment.booking.guide.name}
                                                </p>
                                                <p className="text-[11px] text-slate-400 max-w-xs truncate">
                                                    {payment.booking.package.title}
                                                </p>
                                            </td>
                                            <td className="p-4 text-right font-['Plus_Jakarta_Sans',sans-serif]">
                                                <p className="font-extrabold text-white">
                                                    {formatIDR(payment.numericAmount || payment.amount)}
                                                </p>
                                                <p className="text-[10px] text-emerald-400">
                                                    Fee: {formatIDR(payment.platformFee || Number(payment.amount) * 0.1)}
                                                </p>
                                            </td>
                                            <td className="p-4 text-center">
                                                {payment.payment_proof ? (
                                                    <button
                                                        onClick={() => {
                                                            setProofRotation(0);
                                                            setZoomScale(1);
                                                            setSelectedPayment(payment);
                                                        }}
                                                        className="group relative inline-flex h-10 w-14 overflow-hidden rounded-lg border border-white/15 bg-black/40 transition-transform hover:scale-105"
                                                        title="Klik untuk cek bukti transfer"
                                                    >
                                                        <img
                                                            src={`/storage/${payment.payment_proof}`}
                                                            alt="Bukti"
                                                            className="h-full w-full object-cover opacity-80 group-hover:opacity-100"
                                                        />
                                                        <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <ZoomIn className="h-3.5 w-3.5 text-white" />
                                                        </span>
                                                    </button>
                                                ) : (
                                                    <span className="text-[10px] text-slate-500">
                                                        Tanpa Foto
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-center">
                                                {payment.payment_status === 'pending' && (
                                                    <span className="rounded-full border border-amber-500/30 bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-300">
                                                        Pending Review
                                                    </span>
                                                )}
                                                {payment.payment_status === 'verified' && (
                                                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-400">
                                                        Dana di Escrow
                                                    </span>
                                                )}
                                                {payment.payment_status === 'forwarded' && (
                                                    <span className="rounded-full border border-sky-500/30 bg-sky-500/15 px-2.5 py-0.5 text-[10px] font-extrabold text-sky-400">
                                                        Diteruskan ke Guide
                                                    </span>
                                                )}
                                                {payment.payment_status === 'rejected' && (
                                                    <span className="rounded-full border border-rose-500/30 bg-rose-500/15 px-2.5 py-0.5 text-[10px] font-extrabold text-rose-400">
                                                        Bukti Ditolak
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-center">
                                                <button
                                                    onClick={() => {
                                                        setProofRotation(0);
                                                        setZoomScale(1);
                                                        setSelectedPayment(payment);
                                                    }}
                                                    className="rounded-xl border border-[#E5B869]/30 bg-[#E5B869]/10 px-3.5 py-1.5 text-xs font-bold text-[#E5B869] transition-all hover:bg-[#E5B869] hover:text-[#0A1224]"
                                                >
                                                    {payment.payment_status === 'pending'
                                                        ? 'Cek & Verifikasi'
                                                        : payment.payment_status === 'verified'
                                                        ? 'Detail / Teruskan'
                                                        : 'Detail Transaksi'}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            {/* 4. Split Screen Inspection Modal */}
            {selectedPayment && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-150"
                    onClick={() => setSelectedPayment(null)}
                >
                    <div
                        className="relative flex flex-col md:flex-row w-full max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-[#111C33] shadow-2xl max-h-[90vh]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setSelectedPayment(null)}
                            className="absolute top-4 right-4 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white hover:bg-rose-500 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>

                        {/* Left: Transfer Proof Bay */}
                        <div className="flex flex-1 flex-col border-b md:border-b-0 md:border-r border-white/10 bg-[#070D1B] p-6">
                            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                                    <FileText className="h-4 w-4 text-[#E5B869]" />
                                    <span>Bukti Struk Transfer Bank</span>
                                </span>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setZoomScale((s) => Math.min(s + 0.25, 2.5))}
                                        className="text-slate-400 hover:text-white"
                                        title="Perbesar"
                                    >
                                        <ZoomIn className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setZoomScale((s) => Math.max(s - 0.25, 0.5))}
                                        className="text-slate-400 hover:text-white"
                                        title="Perkecil"
                                    >
                                        <ZoomOut className="h-4 w-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setProofRotation((r) => (r + 90) % 360)}
                                        className="text-slate-400 hover:text-white"
                                        title="Putar Gambar"
                                    >
                                        <RotateCw className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex flex-1 items-center justify-center min-h-[260px] max-h-[420px] overflow-hidden rounded-2xl border border-white/10 bg-black/50 p-2">
                                {selectedPayment.payment_proof ? (
                                    <img
                                        src={`/storage/${selectedPayment.payment_proof}`}
                                        alt="Bukti Transfer Bank"
                                        style={{
                                            transform: `rotate(${proofRotation}deg) scale(${zoomScale})`,
                                        }}
                                        className="max-h-full max-w-full rounded-xl object-contain shadow-2xl transition-transform duration-200"
                                    />
                                ) : (
                                    <div className="text-center text-xs text-slate-400">
                                        <AlertCircle className="mx-auto mb-2 h-6 w-6 opacity-40" />
                                        <span>Gambar bukti transfer belum diunggah.</span>
                                    </div>
                                )}
                            </div>
                            <p className="mt-3 text-center text-[10px] text-slate-500">
                                Pastikan nominal transfer, nama bank pengirim, dan tanggal transfer valid.
                            </p>
                        </div>

                        {/* Right: Financial Breakdown & Actions */}
                        <div className="flex flex-1 flex-col justify-between p-6 bg-[#111C33]">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="rounded-md border border-[#E5B869]/30 bg-[#E5B869]/15 px-2 py-0.5 text-[9px] font-extrabold tracking-wider text-[#E5B869] uppercase">
                                        BOOKING #{selectedPayment.booking.booking_code}
                                    </span>

                                    <a
                                        href={getTravelerWhatsAppUrl(selectedPayment)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 hover:underline"
                                    >
                                        <MessageSquare className="h-3 w-3" />
                                        <span>Hubungi Tamu (WA)</span>
                                    </a>
                                </div>

                                <div>
                                    <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-extrabold text-white">
                                        Detail Rekonsiliasi Pembayaran
                                    </h3>
                                </div>

                                {/* Financial Matrix */}
                                <div className="rounded-2xl border border-white/10 bg-[#070D1B] p-4 space-y-2.5 text-xs">
                                    <div className="flex items-center justify-between pb-2 border-b border-white/5">
                                        <span className="text-slate-400">Total Tagihan Masuk:</span>
                                        <strong className="font-['Plus_Jakarta_Sans'] text-base text-white">
                                            {formatIDR(selectedPayment.numericAmount || selectedPayment.amount)}
                                        </strong>
                                    </div>
                                    <div className="flex items-center justify-between text-slate-400">
                                        <span>Potongan Margin Platform (10%):</span>
                                        <span className="font-semibold text-emerald-400">
                                            + {formatIDR(selectedPayment.platformFee || Number(selectedPayment.amount) * 0.1)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-slate-400">
                                        <span>Net Payout untuk Pemandu (90%):</span>
                                        <span className="font-semibold text-[#E5B869]">
                                            {formatIDR(selectedPayment.guideNet || Number(selectedPayment.amount) * 0.9)}
                                        </span>
                                    </div>
                                </div>

                                {/* Booking & Party Info */}
                                <div className="space-y-2 text-xs text-white">
                                    <div className="flex items-center justify-between rounded-xl border border-white/5 bg-[#070D1B]/50 p-3">
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase">Wisatawan (Pembayar)</p>
                                            <p className="font-bold text-white">{selectedPayment.booking.traveler.name}</p>
                                        </div>
                                        <span className="text-[11px] text-slate-400">{selectedPayment.booking.traveler.phone || '-'}</span>
                                    </div>

                                    <div className="flex items-center justify-between rounded-xl border border-white/5 bg-[#070D1B]/50 p-3">
                                        <div>
                                            <p className="text-[10px] text-slate-400 uppercase">Pemandu Lokal</p>
                                            <p className="font-bold text-[#E5B869]">{selectedPayment.booking.guide.name}</p>
                                        </div>
                                        <span className="text-[11px] text-slate-400">{selectedPayment.booking.package.duration}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons Footer */}
                            <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-2.5">
                                {selectedPayment.payment_status === 'pending' && (
                                    <>
                                        <button
                                            type="button"
                                            disabled={isVerifying}
                                            onClick={() => setRejectModalOpen(true)}
                                            className="rounded-xl border border-rose-500/30 bg-rose-500/10 py-3 px-4 text-xs font-bold text-rose-300 hover:bg-rose-500/20 disabled:opacity-50 sm:w-1/3 transition-colors"
                                        >
                                            Tolak Bukti
                                        </button>
                                        <button
                                            type="button"
                                            disabled={isVerifying}
                                            onClick={() => handleVerify('verified')}
                                            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#E5B869] py-3 px-4 text-xs font-extrabold text-[#0A1224] shadow-lg shadow-[#C5A059]/20 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 flex-1 transition-transform"
                                        >
                                            <CheckCircle2 className="h-4 w-4" />
                                            <span>Setujui Pembayaran (Masuk Escrow)</span>
                                        </button>
                                    </>
                                )}

                                {selectedPayment.payment_status === 'verified' && (
                                    <button
                                        type="button"
                                        disabled={isVerifying}
                                        onClick={() => handleVerify('forwarded')}
                                        className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 px-4 text-xs font-extrabold text-[#0A1224] shadow-lg shadow-emerald-500/25 hover:bg-emerald-400 disabled:opacity-50 transition-colors"
                                    >
                                        <CheckCircle2 className="h-4 w-4" />
                                        <span>Konfirmasi Dana Diteruskan ke Guide</span>
                                    </button>
                                )}

                                {selectedPayment.payment_status === 'forwarded' && (
                                    <div className="w-full text-center py-2 text-xs font-semibold text-emerald-400">
                                        ✓ Transaksi telah selesai dan dana telah dicairkan ke pemandu.
                                    </div>
                                )}

                                {selectedPayment.payment_status === 'rejected' && (
                                    <div className="w-full text-center py-2 text-xs font-semibold text-rose-400">
                                        ✕ Bukti pembayaran telah ditolak. Tamu diminta mengunggah ulang.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Tolak Pembayaran */}
            {rejectModalOpen && selectedPayment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-150">
                    <div className="w-full max-w-md rounded-3xl border border-white/15 bg-[#111C33] p-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                    <XCircle className="h-4 w-4" />
                                </div>
                                <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-bold text-white">
                                    Tolak Bukti Pembayaran
                                </h3>
                            </div>
                            <button
                                onClick={() => setRejectModalOpen(false)}
                                className="text-slate-400 hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-4 space-y-4">
                            <p className="text-xs text-slate-300">
                                Pilih alasan cepat penolakan bukti pembayaran booking <strong className="text-white">#{selectedPayment.booking.booking_code}</strong>:
                            </p>

                            <div className="space-y-1.5">
                                {REJECT_REASONS.map((r, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        onClick={() => setRejectReason(r)}
                                        className="w-full text-left rounded-xl border border-white/10 bg-[#070D1B] p-2.5 text-xs text-slate-300 hover:border-rose-400/50 hover:bg-rose-500/10 hover:text-rose-200 transition-colors"
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setRejectModalOpen(false)}
                                    className="rounded-xl border border-white/10 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-white/5"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    disabled={isVerifying}
                                    onClick={() => handleVerify('rejected')}
                                    className="rounded-xl bg-rose-500 px-5 py-2 text-xs font-bold text-white shadow hover:bg-rose-600 disabled:opacity-50"
                                >
                                    {isVerifying ? 'Memproses...' : 'Konfirmasi Penolakan'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
