import AdminLayout from '@/layouts/admin-layout';
import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    Landmark,
    Coins,
    TrendingUp,
    CheckCircle2,
    Clock,
    Download,
    Filter,
    Search,
    ArrowUpRight,
    ArrowRight,
    ShieldCheck,
    CreditCard,
    AlertCircle,
    Building2,
    Copy,
    Check,
    X,
    Sparkles,
    Printer,
    FileText,
    Users,
} from 'lucide-react';

interface PayoutItem {
    id: string;
    guideProfileId: number;
    name: string;
    avatar: string | null;
    city: string;
    bank: string;
    accountNumber: string;
    accountHolder: string;
    amount: number;
    status: 'Ready' | 'Processing' | 'Hold';
    lastPayout: string;
}

interface DisbursementLog {
    trxId: string;
    recipient: string;
    bank: string;
    account: string;
    amount: number;
    fee: number;
    status: string;
    date: string;
    admin: string;
}

interface Props {
    stats: {
        escrowHeld: number;
        platformCommission: number;
        payoutsProcessed: number;
        activeQueueCount: number;
    };
    payouts: PayoutItem[];
    recentDisbursements: DisbursementLog[];
}

export default function AdminTreasury({
    stats = {
        escrowHeld: 45000000,
        platformCommission: 8500000,
        payoutsProcessed: 124500000,
        activeQueueCount: 3,
    },
    payouts = [],
    recentDisbursements = [],
}: Props) {
    const [selectedPayout, setSelectedPayout] = useState<PayoutItem | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [bulkPayoutModalOpen, setBulkPayoutModalOpen] = useState(false);
    const [voucherLog, setVoucherLog] = useState<DisbursementLog | null>(null);

    const formatIDR = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(val);
    };

    const handleCopy = (acc: string) => {
        navigator.clipboard.writeText(acc);
        setCopiedAccount(acc);
        setTimeout(() => setCopiedAccount(null), 2000);
    };

    const handleProcessPayout = () => {
        if (!selectedPayout) return;
        setIsProcessing(true);

        router.post(
            `/admin/treasury/payout/${selectedPayout.guideProfileId}`,
            {},
            {
                onSuccess: () => {
                    setIsProcessing(false);
                    setSelectedPayout(null);
                },
                onError: () => {
                    setIsProcessing(false);
                },
            },
        );
    };

    const handleBulkPayout = () => {
        setIsProcessing(true);
        router.post(
            '/admin/treasury/bulk-payout',
            {},
            {
                onSuccess: () => {
                    setIsProcessing(false);
                    setBulkPayoutModalOpen(false);
                },
                onError: () => {
                    setIsProcessing(false);
                },
            },
        );
    };

    const handleExportCSV = () => {
        const headers = ['ID Guide', 'Nama Pemandu', 'Bank', 'No Rekening', 'Atas Nama', 'Saldo Siap Cair', 'Status'];
        const rows = payouts.map((p) => [
            p.id,
            `"${p.name}"`,
            p.bank,
            `"${p.accountNumber}"`,
            `"${p.accountHolder}"`,
            p.amount,
            p.status,
        ]);

        const csvContent =
            'data:text/csv;charset=utf-8,' +
            [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `iguideu_payout_report_${new Date().toISOString().slice(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const filteredPayouts = payouts.filter(
        (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.bank.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.id.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const totalQueueAmount = payouts.reduce((sum, p) => sum + (p.amount || 0), 0);

    return (
        <AdminLayout
            title="Treasury & Payouts"
            activeTab="treasury"
            badges={{
                readyPayouts: stats.activeQueueCount,
            }}
        >
            <Head title="Treasury & Payouts - Admin IguideU" />

            <div className="space-y-6 sm:space-y-8">
                {/* Header Section */}
                <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 md:flex-row md:items-center">
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="rounded-md border border-[#E5B869]/30 bg-[#E5B869]/10 px-2.5 py-0.5 text-[10px] font-extrabold tracking-widest text-[#E5B869] uppercase">
                                ENTERPRISE TREASURY & ESCROW
                            </span>
                            <span className="text-xs text-slate-600">•</span>
                            <span className="text-xs font-medium text-slate-400">
                                Manajemen Likuiditas & Payout Pemandu
                            </span>
                        </div>
                        <h1 className="mt-2 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                            Treasury & Monitoring Kas Pemandu
                        </h1>
                        <p className="mt-1 text-xs text-slate-400">
                            Live financial overview, rekening penampungan aman (*escrow pool*), dan pusat kontrol pencairan dana pemandu mitra.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {payouts.length > 0 && (
                            <button
                                type="button"
                                onClick={() => setBulkPayoutModalOpen(true)}
                                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
                            >
                                <Users className="h-4 w-4" />
                                <span>Cairkan Semua ({payouts.length} Guide)</span>
                            </button>
                        )}

                        <button
                            onClick={handleExportCSV}
                            className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#111C33] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:border-[#E5B869]/40 hover:bg-[#16223B]"
                        >
                            <Download className="h-4 w-4 text-[#E5B869]" />
                            <span>Ekspor Laporan (CSV)</span>
                        </button>
                    </div>
                </div>

                {/* 1. KPI Financial Bento Cards */}
                <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {/* Escrow Funds */}
                    <div className="admin-card group relative overflow-hidden rounded-2xl p-5 shadow-xl transition-all hover:border-amber-500/40">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                    Escrow Funds Pool
                                </p>
                                <h3 className="mt-2 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold text-white">
                                    {formatIDR(stats.escrowHeld)}
                                </h3>
                            </div>
                            <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-2.5 text-amber-400">
                                <Landmark className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                            <span className="flex items-center">
                                <ArrowUpRight className="h-3.5 w-3.5" /> +2.4%
                            </span>
                            <span className="text-[11px] font-normal text-slate-400">
                                dari minggu lalu
                            </span>
                        </div>
                    </div>

                    {/* Platform Commission */}
                    <div className="admin-card group relative overflow-hidden rounded-2xl p-5 shadow-xl transition-all hover:border-[#E5B869]/40">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                    Platform Margin (10%)
                                </p>
                                <h3 className="mt-2 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold text-[#E5B869]">
                                    {formatIDR(stats.platformCommission)}
                                </h3>
                            </div>
                            <div className="rounded-xl border border-[#E5B869]/20 bg-[#E5B869]/10 p-2.5 text-[#E5B869]">
                                <Coins className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                            <span className="flex items-center">
                                <ArrowUpRight className="h-3.5 w-3.5" /> +1.1%
                            </span>
                            <span className="text-[11px] font-normal text-slate-400">
                                margin laba bersih
                            </span>
                        </div>
                    </div>

                    {/* Payouts Processed */}
                    <div className="admin-card group relative overflow-hidden rounded-2xl p-5 shadow-xl transition-all hover:border-emerald-500/40">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                    Payouts Disbursed
                                </p>
                                <h3 className="mt-2 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold text-emerald-400">
                                    {formatIDR(stats.payoutsProcessed)}
                                </h3>
                            </div>
                            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2.5 text-emerald-400">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-400">
                            <span>Ke Bank Partner (BCA, Mandiri, BRI, BNI)</span>
                        </div>
                    </div>

                    {/* Active Queue */}
                    <div className="admin-card group relative overflow-hidden rounded-2xl p-5 shadow-xl transition-all hover:border-[#E5B869]/40">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                    Antrean Siap Cair
                                </p>
                                <h3 className="mt-2 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold text-white">
                                    {stats.activeQueueCount}{' '}
                                    <span className="text-sm font-normal text-slate-400">Guide</span>
                                </h3>
                            </div>
                            <div className="rounded-xl border border-[#E5B869]/20 bg-[#E5B869]/10 p-2.5 text-[#E5B869]">
                                <Sparkles className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-1.5 text-xs text-amber-300">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Total {formatIDR(totalQueueAmount)}</span>
                        </div>
                    </div>
                </section>

                {/* 2. Payout Queue Table */}
                <section className="admin-card overflow-hidden rounded-2xl shadow-2xl">
                    <div className="flex flex-col justify-between gap-4 border-b border-white/10 bg-[#070D1B] p-5 sm:flex-row sm:items-center">
                        <div>
                            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-bold text-white">
                                Antrean Pencairan Dana (Payout Queue)
                            </h2>
                            <p className="text-xs text-slate-400">
                                Pemandu mitra terverifikasi yang memiliki saldo tur siap cair.
                            </p>
                        </div>

                        <div className="relative min-w-[240px]">
                            <Search className="absolute top-2.5 left-3 h-3.5 w-3.5 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari nama guide, bank..."
                                className="w-full rounded-xl border border-white/10 bg-[#111C33] py-1.5 pr-4 pl-8 text-xs text-white placeholder-slate-500 focus:border-[#E5B869] focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left">
                            <thead>
                                <tr className="border-b border-white/10 bg-[#050A14] text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                    <th className="p-4">Guide ID & Nama</th>
                                    <th className="p-4">Destinasi</th>
                                    <th className="p-4">Rekening Tujuan (Payout)</th>
                                    <th className="p-4 text-right">Saldo Siap Cair</th>
                                    <th className="p-4 text-center">Status</th>
                                    <th className="p-4 text-center">Aksi Pencairan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-xs text-white">
                                {filteredPayouts.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-12 text-center text-slate-400">
                                            <AlertCircle className="mx-auto mb-2 h-6 w-6 opacity-40" />
                                            Tidak ada antrean pencairan dana.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredPayouts.map((row) => (
                                        <tr
                                            key={row.id}
                                            className="transition-colors hover:bg-white/[0.02]"
                                        >
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E5B869]/15 font-bold text-[#E5B869] border border-[#E5B869]/30">
                                                        {row.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-white">{row.name}</p>
                                                        <p className="font-mono text-[10px] text-slate-500">
                                                            {row.id}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 text-slate-300">
                                                {row.city}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="rounded-md border border-[#E5B869]/30 bg-[#E5B869]/15 px-2 py-0.5 font-bold text-[11px] text-[#E5B869]">
                                                        {row.bank}
                                                    </span>
                                                    <span className="font-mono text-slate-200">
                                                        {row.accountNumber}
                                                    </span>
                                                    <button
                                                        onClick={() => handleCopy(row.accountNumber)}
                                                        className="text-slate-400 hover:text-white"
                                                        title="Salin No Rekening"
                                                    >
                                                        {copiedAccount === row.accountNumber ? (
                                                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                                                        ) : (
                                                            <Copy className="h-3.5 w-3.5" />
                                                        )}
                                                    </button>
                                                </div>
                                                <span className="text-[10px] text-slate-500 block mt-0.5">
                                                    a.n {row.accountHolder}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right font-['Plus_Jakarta_Sans',sans-serif]">
                                                <span className="text-sm font-extrabold text-emerald-400">
                                                    {formatIDR(row.amount)}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                {row.amount > 0 ? (
                                                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-400">
                                                        Ready to Pay
                                                    </span>
                                                ) : (
                                                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-medium text-slate-400">
                                                        Tuntas (Nihil)
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4 text-center">
                                                {row.amount > 0 ? (
                                                    <button
                                                        onClick={() => setSelectedPayout(row)}
                                                        className="rounded-xl bg-gradient-to-r from-[#C5A059] to-[#E5B869] px-4 py-1.5 text-xs font-extrabold text-[#0A1224] shadow-lg shadow-[#C5A059]/20 transition-transform hover:scale-105 active:scale-95"
                                                    >
                                                        Proses Payout
                                                    </button>
                                                ) : (
                                                    <span className="text-xs text-slate-500 italic">
                                                        Tidak ada saldo
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

                {/* 4. Historical Payout Logs */}
                <section className="admin-card overflow-hidden rounded-2xl shadow-2xl">
                    <div className="border-b border-white/10 bg-[#070D1B] p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                        <div>
                            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-bold text-white">
                                Log Riwayat Pencairan Dana Terakhir
                            </h2>
                            <p className="text-xs text-slate-400">
                                Arsip bukti transfer dan disbursement yang telah berhasil diselesaikan. Klik transaksi untuk mencetak voucher.
                            </p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-left text-xs">
                            <thead>
                                <tr className="border-b border-white/10 bg-[#050A14] text-[11px] font-bold tracking-wider text-slate-400 uppercase">
                                    <th className="p-4">ID Transaksi & Waktu</th>
                                    <th className="p-4">Penerima Pemandu</th>
                                    <th className="p-4">Bank Tujuan</th>
                                    <th className="p-4 text-right">Nominal Dicairkan</th>
                                    <th className="p-4 text-center">Status</th>
                                    <th className="p-4 text-center">Voucher</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-white">
                                {recentDisbursements.map((log) => (
                                    <tr
                                        key={log.trxId}
                                        onClick={() => setVoucherLog(log)}
                                        className="transition-colors hover:bg-white/[0.04] cursor-pointer group"
                                    >
                                        <td className="p-4">
                                            <span className="font-mono font-bold text-[#E5B869] group-hover:underline">
                                                {log.trxId}
                                            </span>
                                            <span className="block text-[10px] text-slate-500">
                                                {log.date}
                                            </span>
                                        </td>
                                        <td className="p-4 font-bold">{log.recipient}</td>
                                        <td className="p-4">
                                            <span className="rounded bg-white/5 px-2 py-0.5 text-xs text-slate-200">
                                                {log.bank} • {log.account}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right font-['Plus_Jakarta_Sans'] font-extrabold text-emerald-400">
                                            {formatIDR(log.amount)}
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                                                {log.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                type="button"
                                                className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-semibold text-[#E5B869] hover:bg-white/10"
                                            >
                                                <FileText className="h-3 w-3" />
                                                <span>Cetak</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>

            {/* Payout Processing Modal (Single) */}
            {selectedPayout && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-150"
                    onClick={() => setSelectedPayout(null)}
                >
                    <div
                        className="w-full max-w-md rounded-3xl border border-white/15 bg-[#111C33] p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#C5A059] to-[#E5B869] text-[#0A1224]">
                                    <Landmark className="h-4 w-4" />
                                </div>
                                <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-bold text-white">
                                    Konfirmasi Pencairan Dana Pemandu
                                </h3>
                            </div>
                            <button
                                onClick={() => setSelectedPayout(null)}
                                className="text-slate-400 hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-4 space-y-4">
                            <div className="rounded-2xl border border-white/10 bg-[#070D1B] p-4 text-center">
                                <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                    Nominal Pencairan (Net Guide)
                                </p>
                                <h4 className="mt-1 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold text-emerald-400">
                                    {formatIDR(selectedPayout.amount)}
                                </h4>
                                <span className="mt-1 inline-block rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                                    Bebas Biaya Transfer
                                </span>
                            </div>

                            <div className="space-y-2.5 text-xs text-white">
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-slate-400">Penerima:</span>
                                    <span className="font-bold">{selectedPayout.name} ({selectedPayout.id})</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-slate-400">Bank Tujuan:</span>
                                    <span className="font-bold text-[#E5B869]">{selectedPayout.bank}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-slate-400">Nomor Rekening:</span>
                                    <span className="font-mono font-bold text-white">{selectedPayout.accountNumber}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-400">Atas Nama:</span>
                                    <span className="font-bold text-white">{selectedPayout.accountHolder}</span>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setSelectedPayout(null)}
                                    className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/5"
                                >
                                    Batal
                                </button>
                                <button
                                    type="button"
                                    disabled={isProcessing}
                                    onClick={handleProcessPayout}
                                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#E5B869] px-5 py-2.5 text-xs font-extrabold text-[#0A1224] shadow-lg shadow-[#C5A059]/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-transform"
                                >
                                    <CheckCircle2 className="h-4 w-4" />
                                    <span>{isProcessing ? 'Mengirim...' : 'Eksekusi Transfer Payout'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Bulk Payout Confirmation Modal */}
            {bulkPayoutModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-150"
                    onClick={() => setBulkPayoutModalOpen(false)}
                >
                    <div
                        className="w-full max-w-md rounded-3xl border border-emerald-500/30 bg-[#0E172B] p-6 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-bold text-white">
                                    Pencairan Massal Seluruh Pemandu
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Eksekusi {payouts.length} instruksi transfer ke bank mitra
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 rounded-2xl border border-white/10 bg-[#070D1B] p-4 text-center">
                            <p className="text-[10px] font-bold uppercase text-slate-400">Total Dana Dikeluarkan</p>
                            <h4 className="mt-1 text-2xl font-extrabold text-emerald-400 font-['Plus_Jakarta_Sans']">
                                {formatIDR(totalQueueAmount)}
                            </h4>
                            <p className="mt-1 text-xs text-slate-400">Untuk {payouts.length} pemandu lokal terverifikasi</p>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setBulkPayoutModalOpen(false)}
                                className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/5"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                disabled={isProcessing}
                                onClick={handleBulkPayout}
                                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-600 disabled:opacity-50"
                            >
                                <CheckCircle2 className="h-4 w-4" />
                                <span>{isProcessing ? 'Memproses...' : 'Ya, Eksekusi Semua Payout'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Printable Payout Receipt Voucher Modal */}
            {voucherLog && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-150"
                    onClick={() => setVoucherLog(null)}
                >
                    <div
                        className="w-full max-w-lg rounded-3xl border border-white/20 bg-white text-slate-900 p-8 shadow-2xl font-['Inter',sans-serif]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Voucher Header */}
                        <div className="flex items-center justify-between border-b pb-4">
                            <div>
                                <div className="flex items-center gap-2">
                                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#0A1224] text-xs font-bold text-[#E5B869]">
                                        IU
                                    </div>
                                    <h3 className="font-['Plus_Jakarta_Sans'] font-extrabold text-lg tracking-tight text-slate-900">
                                        IguideU NTB
                                    </h3>
                                </div>
                                <p className="text-[10px] text-slate-500 mt-0.5">Bukti Resmi Pencairan Dana (Disbursement Voucher)</p>
                            </div>
                            <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-800">
                                STATUS: {voucherLog.status.toUpperCase()}
                            </span>
                        </div>

                        {/* Voucher Body */}
                        <div className="mt-5 space-y-4 text-xs">
                            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                                <div className="flex justify-between items-center">
                                    <span className="text-slate-500">Nomor Transaksi:</span>
                                    <span className="font-mono font-bold text-slate-800">{voucherLog.trxId}</span>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-slate-500">Waktu Eksekusi:</span>
                                    <span className="font-semibold text-slate-700">{voucherLog.date}</span>
                                </div>
                                <div className="flex justify-between items-center mt-2">
                                    <span className="text-slate-500">Otorisator:</span>
                                    <span className="font-semibold text-slate-700">{voucherLog.admin}</span>
                                </div>
                            </div>

                            <div className="space-y-2 border-t border-b py-3">
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Penerima Pemandu:</span>
                                    <span className="font-bold text-slate-900">{voucherLog.recipient}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Bank Tujuan:</span>
                                    <span className="font-bold text-slate-900">{voucherLog.bank}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500">Nomor Rekening:</span>
                                    <span className="font-mono font-semibold text-slate-800">{voucherLog.account}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-1">
                                <span className="font-bold text-slate-700 text-sm">Total Nominal Bersih:</span>
                                <span className="font-['Plus_Jakarta_Sans'] text-xl font-extrabold text-emerald-600">
                                    {formatIDR(voucherLog.amount)}
                                </span>
                            </div>
                        </div>

                        {/* Voucher Footer Controls */}
                        <div className="mt-6 flex justify-end gap-3 border-t pt-4">
                            <button
                                type="button"
                                onClick={() => setVoucherLog(null)}
                                className="rounded-xl border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                            >
                                Tutup
                            </button>
                            <button
                                type="button"
                                onClick={() => window.print()}
                                className="flex items-center gap-1.5 rounded-xl bg-[#0A1224] px-5 py-2 text-xs font-bold text-white shadow hover:bg-slate-800"
                            >
                                <Printer className="h-3.5 w-3.5" />
                                <span>Cetak Voucher</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
