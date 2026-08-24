import AdminLayout from '@/layouts/admin-layout';
import { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import {
    Search,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Clock,
    User,
    MessageSquare,
    Phone,
    Mail,
    Landmark,
    Copy,
    Check,
    ArrowUpRight,
    Sparkles,
    Shield,
    ExternalLink,
    Filter,
    FileText,
    HelpCircle,
    LifeBuoy,
} from 'lucide-react';

interface ComplaintItem {
    id: number;
    booking_id: number;
    booking_code: string;
    booking_date: string;
    total_amount: number;
    package_title: string;
    reason_category: string;
    details: string;
    bank_name: string;
    bank_account_number: string;
    bank_account_holder: string;
    status: 'pending' | 'approved' | 'rejected';
    admin_notes?: string | null;
    created_at: string;
    timeAgo: string;
    resolved_at?: string | null;
    traveler: {
        id: number;
        name: string;
        email: string;
        phone: string;
        avatar?: string | null;
    };
    guide: {
        id: number;
        name: string;
        email: string;
        phone: string;
        avatar?: string | null;
        city: string;
    };
}

interface Props {
    complaints: ComplaintItem[];
    counts: {
        all: number;
        pending: number;
        approved: number;
        rejected: number;
    };
    badges: {
        pendingKyc?: number;
        pendingPayments?: number;
        readyPayouts?: number;
        pendingComplaints?: number;
    };
    stats: {
        totalComplaints: number;
        pendingCount: number;
        approvedCount: number;
        totalRefundApproved: number;
        resolutionRate: number;
    };
}

export default function AdminComplaints({
    complaints = [],
    counts,
    badges,
    stats,
}: Props) {
    const [selectedComplaint, setSelectedComplaint] = useState<ComplaintItem | null>(null);
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [adminNote, setAdminNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const filteredComplaints = useMemo(() => {
        return complaints.filter((item) => {
            const matchesStatus =
                statusFilter === 'all' ? true : item.status === statusFilter;
            const matchesQuery =
                item.booking_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.traveler.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.guide.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.reason_category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.details.toLowerCase().includes(searchQuery.toLowerCase());

            return matchesStatus && matchesQuery;
        });
    }, [complaints, statusFilter, searchQuery]);

    const handleCopy = (text: string, key: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(key);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const handleApproveRefund = (complaintId: number) => {
        if (!confirm('Apakah Anda yakin ingin menyetujui pengajuan refund ini? Dana akan dikembalikan ke rekening wisatawan dan pesanan dibatalkan.')) {
            return;
        }

        setIsSubmitting(true);
        router.post(
            `/admin/complaints/${complaintId}/approve`,
            { admin_notes: adminNote },
            {
                onSuccess: () => {
                    setIsSubmitting(false);
                    setSelectedComplaint(null);
                    setAdminNote('');
                },
                onError: () => {
                    setIsSubmitting(false);
                    alert('Gagal menyetujui refund. Coba lagi.');
                },
            }
        );
    };

    const handleRejectRefund = (complaintId: number) => {
        if (!adminNote || adminNote.trim().length < 5) {
            alert('Wajib mengisi catatan admin / alasan penolakan minimal 5 karakter.');
            return;
        }

        if (!confirm('Apakah Anda yakin ingin menolak pengajuan refund ini? Dana escrow akan diteruskan ke saldo pemandu.')) {
            return;
        }

        setIsSubmitting(true);
        router.post(
            `/admin/complaints/${complaintId}/reject`,
            { admin_notes: adminNote },
            {
                onSuccess: () => {
                    setIsSubmitting(false);
                    setSelectedComplaint(null);
                    setAdminNote('');
                },
                onError: () => {
                    setIsSubmitting(false);
                    alert('Gagal menolak refund. Coba lagi.');
                },
            }
        );
    };

    const formatRupiah = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val);
    };

    return (
        <AdminLayout
            title="Keluhan & Pengajuan Refund"
            activeTab="complaints"
            badges={badges}
            fullWidth={true}
        >
            <div className="space-y-6">
                {/* Header Title */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-bold tracking-tight text-white sm:text-3xl">
                            Pusat Resolusi Keluhan & Refund
                        </h1>
                        <p className="mt-1 text-sm text-[#79849f]">
                            Kelola sengketa pesanan, mediasi wisatawan & pemandu, serta verifikasi pengembalian dana escrow.
                        </p>
                    </div>
                </div>

                {/* Metrics Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="admin-card relative overflow-hidden rounded-2xl p-5 shadow-lg">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-[#79849f]">
                                Menunggu Peninjauan
                            </span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400">
                                <Clock className="h-5 w-5 animate-pulse" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-extrabold text-white">
                                {stats.pendingCount}
                            </span>
                            <span className="text-xs font-medium text-rose-400">Kasus Aktif</span>
                        </div>
                    </div>

                    <div className="admin-card relative overflow-hidden rounded-2xl p-5 shadow-lg">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-[#79849f]">
                                Total Refund Disetujui
                            </span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                                <CheckCircle2 className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold text-emerald-400">
                                {formatRupiah(stats.totalRefundApproved)}
                            </span>
                        </div>
                    </div>

                    <div className="admin-card relative overflow-hidden rounded-2xl p-5 shadow-lg">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-[#79849f]">
                                Total Laporan Masuk
                            </span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-500/20 bg-blue-500/10 text-blue-400">
                                <LifeBuoy className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-extrabold text-white">
                                {stats.totalComplaints}
                            </span>
                            <span className="text-xs font-medium text-[#79849f]">Sepanjang Waktu</span>
                        </div>
                    </div>

                    <div className="admin-card relative overflow-hidden rounded-2xl p-5 shadow-lg">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-[#79849f]">
                                Tingkat Penyelesaian
                            </span>
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E5B869]/20 bg-[#E5B869]/10 text-[#E5B869]">
                                <Shield className="h-5 w-5" />
                            </div>
                        </div>
                        <div className="mt-3 flex items-baseline gap-2">
                            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-extrabold text-[#E5B869]">
                                {stats.resolutionRate}%
                            </span>
                            <span className="text-xs font-medium text-emerald-400">Selesai</span>
                        </div>
                    </div>
                </div>

                {/* Filter Tabs & Search */}
                <div className="admin-card flex flex-col gap-4 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setStatusFilter('all')}
                            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                                statusFilter === 'all'
                                    ? 'bg-[#E5B869] text-[#0A1224] shadow-md shadow-[#E5B869]/20'
                                    : 'bg-white/5 text-[#79849f] hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            Semua ({counts.all})
                        </button>
                        <button
                            onClick={() => setStatusFilter('pending')}
                            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                                statusFilter === 'pending'
                                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                                    : 'bg-white/5 text-rose-400 hover:bg-rose-500/10'
                            }`}
                        >
                            <span className="h-1.5 w-1.5 rounded-full bg-current animate-pulse"></span>
                            Menunggu Peninjauan ({counts.pending})
                        </button>
                        <button
                            onClick={() => setStatusFilter('approved')}
                            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                                statusFilter === 'approved'
                                    ? 'bg-emerald-500 text-[#0A1224] shadow-md shadow-emerald-500/20'
                                    : 'bg-white/5 text-[#79849f] hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            Refund Disetujui ({counts.approved})
                        </button>
                        <button
                            onClick={() => setStatusFilter('rejected')}
                            className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                                statusFilter === 'rejected'
                                    ? 'bg-gray-700 text-white shadow-md'
                                    : 'bg-white/5 text-[#79849f] hover:bg-white/10 hover:text-white'
                            }`}
                        >
                            Ditolak ({counts.rejected})
                        </button>
                    </div>

                    <div className="relative w-full sm:w-72">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-[#79849f]" />
                        <input
                            type="text"
                            placeholder="Cari ID, nama, keluhan..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-[#0A1224] py-2 pr-4 pl-9 text-xs text-white placeholder:text-[#79849f] focus:border-[#E5B869] focus:outline-none"
                        />
                    </div>
                </div>

                {/* Complaints List Cards */}
                <div className="space-y-4">
                    {filteredComplaints.length === 0 ? (
                        <div className="admin-card flex flex-col items-center justify-center rounded-2xl py-16 text-center">
                            <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/5 text-[#79849f]">
                                <CheckCircle2 className="h-8 w-8 opacity-40 text-emerald-400" />
                            </div>
                            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold text-white">
                                Tidak Ada Keluhan Ditemukan
                            </h3>
                            <p className="mt-1 max-w-sm text-xs text-[#79849f]">
                                Semua sengketa telah ditinjau atau tidak ada data yang cocok dengan kriteria pencarian Anda.
                            </p>
                        </div>
                    ) : (
                        filteredComplaints.map((item) => (
                            <div
                                key={item.id}
                                className="admin-card group relative overflow-hidden rounded-2xl p-5 transition-all hover:border-[#E5B869]/40 hover:shadow-xl"
                            >
                                <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="font-mono text-sm font-extrabold text-[#E5B869]">
                                                {item.booking_code}
                                            </span>
                                            <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#79849f]">
                                                {item.created_at} ({item.timeAgo})
                                            </span>
                                            {item.status === 'pending' && (
                                                <span className="flex items-center gap-1 rounded-md border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-rose-400">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400 animate-pulse"></span>
                                                    Menunggu Peninjauan
                                                </span>
                                            )}
                                            {item.status === 'approved' && (
                                                <span className="flex items-center gap-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                                                    <CheckCircle2 className="h-3 w-3" /> Refund Disetujui
                                                </span>
                                            )}
                                            {item.status === 'rejected' && (
                                                <span className="flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#79849f]">
                                                    <XCircle className="h-3 w-3" /> Ditolak
                                                </span>
                                            )}
                                        </div>

                                        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-300">
                                            <div className="flex items-center gap-1.5 font-bold text-white mb-1">
                                                <AlertTriangle className="h-4 w-4 text-rose-400" />
                                                <span>Kategori: {item.reason_category}</span>
                                            </div>
                                            <p className="line-clamp-2 text-rose-200/90 leading-relaxed italic">
                                                "{item.details}"
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 pt-1">
                                            <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#0A1224]/60 p-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500/10 font-bold text-sm text-blue-400">
                                                    {item.traveler.name.charAt(0)}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#79849f]">
                                                        Wisatawan (Pelapor)
                                                    </p>
                                                    <h5 className="truncate text-xs font-bold text-white">
                                                        {item.traveler.name}
                                                    </h5>
                                                    <p className="truncate text-[11px] font-mono text-[#E5B869]">
                                                        {item.traveler.phone}
                                                    </p>
                                                </div>
                                                <a
                                                    href={`https://wa.me/${item.traveler.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Halo ${item.traveler.name}, saya Admin IguideU terkait pengajuan refund pesanan #${item.booking_code}.`)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    title="Hubungi Wisatawan via WhatsApp"
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors"
                                                >
                                                    <MessageSquare className="h-4 w-4" />
                                                </a>
                                            </div>

                                            <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#0A1224]/60 p-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E5B869]/10 font-bold text-sm text-[#E5B869]">
                                                    {item.guide.name.charAt(0)}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#79849f]">
                                                        Pemandu Terlapor
                                                    </p>
                                                    <h5 className="truncate text-xs font-bold text-white">
                                                        {item.guide.name}
                                                    </h5>
                                                    <p className="truncate text-[11px] font-mono text-[#79849f]">
                                                        {item.guide.city} • {item.guide.phone}
                                                    </p>
                                                </div>
                                                <a
                                                    href={`https://wa.me/${item.guide.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Halo ${item.guide.name}, saya Admin IguideU ingin meminta konfirmasi terkait sengketa pesanan #${item.booking_code}.`)}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    title="Hubungi Pemandu via WhatsApp"
                                                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors"
                                                >
                                                    <MessageSquare className="h-4 w-4" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-start justify-between border-t border-white/10 pt-4 lg:w-56 lg:items-end lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
                                        <div className="mb-4 text-left lg:text-right">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-[#79849f]">
                                                Nilai Transaksi (Escrow)
                                            </p>
                                            <p className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-extrabold text-[#E5B869]">
                                                {formatRupiah(item.total_amount)}
                                            </p>
                                            <p className="text-[10px] text-[#79849f] mt-0.5">
                                                Paket: {item.package_title}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => {
                                                setSelectedComplaint(item);
                                                setAdminNote(item.admin_notes || '');
                                            }}
                                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E5B869] py-2.5 px-4 text-xs font-bold text-[#0A1224] shadow-md transition-all hover:bg-[#fed488] active:scale-95 cursor-pointer lg:w-auto"
                                        >
                                            <FileText className="h-4 w-4" />
                                            Tinjau & Proses
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Resolution Modal */}
            {selectedComplaint && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
                    <div className="admin-card relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/15 bg-[#111C33] text-white shadow-2xl max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between border-b border-white/10 bg-[#0A1224] p-5">
                            <div>
                                <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold text-white flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-rose-400" />
                                    Peninjauan Sengketa & Refund #{selectedComplaint.booking_code}
                                </h3>
                                <p className="text-xs text-[#79849f] mt-0.5">
                                    Dilaporkan pada {selectedComplaint.created_at} ({selectedComplaint.timeAgo})
                                </p>
                            </div>
                            <button
                                onClick={() => setSelectedComplaint(null)}
                                className="rounded-lg p-1.5 text-[#79849f] hover:bg-white/10 hover:text-white"
                            >
                                <XCircle className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-5">
                            {selectedComplaint.status !== 'pending' && (
                                <div className={`flex items-start gap-3 rounded-xl border p-4 text-xs ${
                                    selectedComplaint.status === 'approved'
                                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                                        : 'border-white/10 bg-white/5 text-[#79849f]'
                                }`}>
                                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
                                    <div>
                                        <p className="font-bold text-white">
                                            Status: {selectedComplaint.status === 'approved' ? 'Refund Telah Disetujui' : 'Pengajuan Refund Ditolak'}
                                        </p>
                                        <p className="mt-0.5">
                                            Catatan Admin: {selectedComplaint.admin_notes || '-'}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <div className="rounded-xl border border-white/10 bg-[#0A1224] p-4 space-y-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">
                                    Kronologi & Detail Keluhan Wisatawan
                                </span>
                                <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3 text-xs font-medium text-white leading-relaxed">
                                    <p className="font-bold text-rose-300 mb-1">
                                        Kategori: {selectedComplaint.reason_category}
                                    </p>
                                    <p className="italic text-[#E2E8F0] whitespace-pre-wrap">
                                        "{selectedComplaint.details}"
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-[#0A1224] p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#E5B869] flex items-center gap-1.5">
                                        <Landmark className="h-4 w-4" />
                                        Rekening Tujuan Pengembalian Dana (Refund)
                                    </span>
                                </div>
                                <div className="grid grid-cols-3 gap-3 text-xs">
                                    <div className="rounded-lg bg-white/5 p-3">
                                        <span className="text-[#79849f] block text-[10px] mb-1">Bank / E-Wallet</span>
                                        <span className="font-bold text-white">{selectedComplaint.bank_name}</span>
                                    </div>
                                    <div className="rounded-lg bg-white/5 p-3">
                                        <span className="text-[#79849f] block text-[10px] mb-1">Nomor Rekening</span>
                                        <div className="flex items-center justify-between">
                                            <span className="font-mono font-bold text-[#E5B869]">{selectedComplaint.bank_account_number}</span>
                                            <button
                                                onClick={() => handleCopy(selectedComplaint.bank_account_number, 'acc')}
                                                className="text-[#79849f] hover:text-white ml-2"
                                            >
                                                {copiedField === 'acc' ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="rounded-lg bg-white/5 p-3">
                                        <span className="text-[#79849f] block text-[10px] mb-1">Atas Nama</span>
                                        <span className="font-bold text-white truncate block">{selectedComplaint.bank_account_holder}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="rounded-xl border border-white/10 bg-[#0A1224] p-4 space-y-3">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#79849f]">
                                    Mediasi & Konfirmasi Para Pihak
                                </span>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                    <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                                        <div>
                                            <span className="text-[#79849f] block text-[10px]">Wisatawan (Traveler)</span>
                                            <span className="font-bold text-white">{selectedComplaint.traveler.name}</span>
                                            <p className="text-[11px] font-mono text-[#E5B869]">{selectedComplaint.traveler.phone}</p>
                                        </div>
                                        <a
                                            href={`https://wa.me/${selectedComplaint.traveler.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Halo ${selectedComplaint.traveler.name}, saya Admin IguideU terkait pengajuan refund pesanan #${selectedComplaint.booking_code}.`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500"
                                        >
                                            <MessageSquare className="h-3.5 w-3.5" /> WA
                                        </a>
                                    </div>
                                    <div className="flex items-center justify-between rounded-lg bg-white/5 p-3">
                                        <div>
                                            <span className="text-[#79849f] block text-[10px]">Pemandu (Guide)</span>
                                            <span className="font-bold text-white">{selectedComplaint.guide.name}</span>
                                            <p className="text-[11px] font-mono text-[#79849f]">{selectedComplaint.guide.phone}</p>
                                        </div>
                                        <a
                                            href={`https://wa.me/${selectedComplaint.guide.phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Halo ${selectedComplaint.guide.name}, saya Admin IguideU ingin meminta konfirmasi terkait sengketa pesanan #${selectedComplaint.booking_code}.`)}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500"
                                        >
                                            <MessageSquare className="h-3.5 w-3.5" /> WA
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {selectedComplaint.status === 'pending' && (
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold uppercase tracking-wider text-white">
                                        Catatan Keputusan Admin / Alasan <span className="text-rose-400">*</span>
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={adminNote}
                                        onChange={(e) => setAdminNote(e.target.value)}
                                        placeholder="Tuliskan catatan verifikasi atau alasan penolakan refund..."
                                        className="w-full rounded-xl border border-white/10 bg-[#0A1224] p-3 text-xs text-white placeholder:text-[#79849f] focus:border-[#E5B869] focus:outline-none"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10 bg-[#0A1224] p-5">
                            <button
                                type="button"
                                onClick={() => setSelectedComplaint(null)}
                                className="w-full sm:w-auto rounded-xl border border-white/10 px-5 py-2.5 text-xs font-bold text-white hover:bg-white/10 transition-colors"
                            >
                                Tutup
                            </button>

                            {selectedComplaint.status === 'pending' && (
                                <div className="flex w-full sm:w-auto gap-3">
                                    <button
                                        type="button"
                                        disabled={isSubmitting}
                                        onClick={() => handleRejectRefund(selectedComplaint.id)}
                                        className="flex-1 sm:flex-initial rounded-xl border border-rose-500/40 bg-rose-500/10 px-5 py-2.5 text-xs font-bold text-rose-300 hover:bg-rose-500/20 disabled:opacity-50 transition-colors cursor-pointer"
                                    >
                                        {isSubmitting ? 'Memproses...' : 'Tolak Pengajuan'}
                                    </button>
                                    <button
                                        type="button"
                                        disabled={isSubmitting}
                                        onClick={() => handleApproveRefund(selectedComplaint.id)}
                                        className="flex-1 sm:flex-initial rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg hover:bg-emerald-500 disabled:opacity-50 transition-colors cursor-pointer"
                                    >
                                        {isSubmitting ? 'Memproses...' : 'Setujui Refund Dana'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}