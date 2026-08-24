import { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';
import {
    Search,
    CheckCircle2,
    XCircle,
    Clock,
    AlertCircle,
    Phone,
    Mail,
    CreditCard,
    MapPin,
    Globe,
    Car,
    ZoomIn,
    ZoomOut,
    X,
    Sparkles,
    Copy,
    Check,
    RotateCw,
    ExternalLink,
    ChevronRight,
    Award,
    Shield,
    ShieldCheck,
    MessageSquare,
    CheckSquare,
    Square,
    Maximize2,
    Users,
} from 'lucide-react';

interface Applicant {
    id: number;
    userId: number | null;
    name: string;
    email: string;
    phone: string;
    avatar: string | null;
    type: string;
    time: string;
    languages: string;
    serviceAreas: string[];
    vehicles: string[];
    dailyRate: number;
    hourlyRate: number;
    bankName: string;
    bankAccountNumber: string;
    bankAccountHolder: string;
    ktpUrl: string;
    certUrl: string | null;
    bio: string;
    appId: string;
    status: 'pending' | 'verified' | 'rejected';
    rejectionReason: string | null;
}

interface Props {
    applicants: Applicant[];
    counts: {
        all: number;
        pending: number;
        verified: number;
        rejected: number;
    };
}

const NTB_REGIONS = [
    'Semua Wilayah',
    'Lombok Utara',
    'Lombok Tengah',
    'Lombok Barat',
    'Lombok Timur',
    'Kota Mataram',
    'Sumbawa',
    'Bima',
];

const PRESET_REASONS = [
    'Foto KTP buram dan NIK tidak terbaca dengan jelas.',
    'Nama pemilik rekening bank tidak sesuai dengan nama KTP terdaftar.',
    'Sertifikat kepemanduan (HPI/BNSP) telah kadaluarsa atau tidak valid.',
    'Deskripsi profil dan cakupan wilayah pemandu tidak memenuhi standar profesional IguideU.',
    'Nomor telepon / WhatsApp tidak dapat dihubungi untuk konfirmasi.',
];

export default function AdminKyc({ applicants = [], counts }: Props) {
    const [selectedId, setSelectedId] = useState<number | null>(
        applicants.length > 0 ? applicants[0].id : null,
    );
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
    const [selectedRegion, setSelectedRegion] = useState('Semua Wilayah');
    const [zoomImage, setZoomImage] = useState<string | null>(null);
    const [imageRotation, setImageRotation] = useState(0);
    const [zoomScale, setZoomScale] = useState(1);
    const [approveModalOpen, setApproveModalOpen] = useState(false);
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [bulkApproveModalOpen, setBulkApproveModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [copiedAccount, setCopiedAccount] = useState(false);
    const [copiedAppId, setCopiedAppId] = useState(false);
    const [selectedIds, setSelectedIds] = useState<number[]>([]);

    // Filter applicants based on status, region & search
    const filteredApplicants = useMemo(() => {
        return applicants.filter((item) => {
            const matchesStatus =
                statusFilter === 'all' ? true : item.status === statusFilter;
            const matchesRegion =
                selectedRegion === 'Semua Wilayah'
                    ? true
                    : item.type.toLowerCase().includes(selectedRegion.toLowerCase());
            const matchesQuery =
                item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.appId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.phone && item.phone.includes(searchQuery));
            return matchesStatus && matchesRegion && matchesQuery;
        });
    }, [applicants, statusFilter, selectedRegion, searchQuery]);

    // Currently selected applicant
    const current =
        applicants.find((a) => a.id === selectedId) ||
        filteredApplicants[0] ||
        applicants[0];

    // Anti-Fraud Name Match Score Checker
    const isNameMatch = useMemo(() => {
        if (!current || !current.bankAccountHolder) return false;
        const n1 = current.name.trim().toLowerCase();
        const n2 = current.bankAccountHolder.trim().toLowerCase();
        if (n1 === n2) return true;
        // Check if words match
        const words1 = n1.split(/\s+/);
        const words2 = n2.split(/\s+/);
        const overlap = words1.filter((w) => words2.includes(w) && w.length > 2);
        return overlap.length > 0;
    }, [current]);

    const handleConfirmApprove = () => {
        if (!current) return;
        setIsSubmitting(true);
        router.post(
            `/admin/kyc/${current.id}/approve`,
            {},
            {
                onSuccess: () => {
                    setApproveModalOpen(false);
                },
                onFinish: () => setIsSubmitting(false),
            },
        );
    };

    const handleBulkApprove = () => {
        if (selectedIds.length === 0) return;
        setIsSubmitting(true);
        router.post(
            '/admin/kyc/bulk-approve',
            { ids: selectedIds },
            {
                onSuccess: () => {
                    setBulkApproveModalOpen(false);
                    setSelectedIds([]);
                },
                onFinish: () => setIsSubmitting(false),
            },
        );
    };

    const handleRejectSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!current) return;
        setIsSubmitting(true);
        router.post(
            `/admin/kyc/${current.id}/reject`,
            {
                reason: rejectReason,
            },
            {
                onSuccess: () => {
                    setRejectModalOpen(false);
                    setRejectReason('');
                },
                onFinish: () => setIsSubmitting(false),
            },
        );
    };

    const toggleSelect = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
        );
    };

    const selectAllPending = () => {
        const pendingIds = filteredApplicants
            .filter((a) => a.status === 'pending')
            .map((a) => a.id);
        if (selectedIds.length === pendingIds.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(pendingIds);
        }
    };

    const handleCopy = (text: string, type: 'account' | 'appId') => {
        navigator.clipboard.writeText(text);
        if (type === 'account') {
            setCopiedAccount(true);
            setTimeout(() => setCopiedAccount(false), 2000);
        } else {
            setCopiedAppId(true);
            setTimeout(() => setCopiedAppId(false), 2000);
        }
    };

    const getWhatsAppUrl = (applicant: Applicant) => {
        const text = `Halo Bpk/Ibu ${applicant.name},\n\nKami dari Tim Verifikasi KYC IguideU NTB (${applicant.appId}). Terkait permohonan pendaftaran Anda sebagai pemandu wisata lokal:\n\n• Wilayah: ${applicant.type}\n• Rekening Pencairan: ${applicant.bankName} - ${applicant.bankAccountNumber} (a.n ${applicant.bankAccountHolder})\n\nMohon konfirmasi kesiapan Anda menerima wisatawan. Terima kasih!\n- Admin IguideU`;
        const phone = applicant.phone?.replace(/[^0-9]/g, '');
        return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    };

    const formatIDR = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(val);
    };

    return (
        <AdminLayout
            title="Verifikasi KYC Guide"
            activeTab="kyc"
            fullWidth={true}
            badges={{
                pendingKyc: counts?.pending || 0,
            }}
        >
            <Head title="Meja Verifikasi KYC Mitra - Admin IguideU" />

            <div className="flex h-[calc(100vh-104px)] overflow-hidden bg-[#0A1224]">
                {/* Left Panel: Master List of Applicants */}
                <div className="flex w-full max-w-[420px] min-w-[320px] shrink-0 flex-col border-r border-white/10 bg-[#070D1B] md:w-1/3">
                    {/* Header with Search & Filter */}
                    <div className="border-b border-white/10 p-4 sm:p-5 space-y-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-extrabold text-white">
                                    Verifikasi Guide
                                </h1>
                                <p className="text-[11px] text-slate-400">
                                    Peninjauan KTP & kredensial pemandu lokal
                                </p>
                            </div>
                            <span className="rounded-full border border-[#E5B869]/30 bg-[#E5B869]/15 px-2.5 py-0.5 text-xs font-bold text-[#E5B869]">
                                Total {counts?.all || applicants.length}
                            </span>
                        </div>

                        {/* Search Input */}
                        <div className="relative">
                            <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari nama, App ID, email, nomor..."
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

                        {/* Status Filter Chips */}
                        <div className="flex flex-wrap gap-1.5 pt-1">
                            <button
                                onClick={() => setStatusFilter('all')}
                                className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                                    statusFilter === 'all'
                                        ? 'border border-[#E5B869]/40 bg-[#E5B869]/20 text-[#E5B869]'
                                        : 'border border-white/5 bg-white/5 text-slate-400 hover:text-white'
                                }`}
                            >
                                Semua ({counts?.all || applicants.length})
                            </button>
                            <button
                                onClick={() => setStatusFilter('pending')}
                                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                                    statusFilter === 'pending'
                                        ? 'border border-amber-500/40 bg-amber-500/20 text-amber-300'
                                        : 'border border-white/5 bg-white/5 text-slate-400 hover:text-white'
                                }`}
                            >
                                <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                                <span>Pending ({counts?.pending || 0})</span>
                            </button>
                            <button
                                onClick={() => setStatusFilter('verified')}
                                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                                    statusFilter === 'verified'
                                        ? 'border border-emerald-500/40 bg-emerald-500/20 text-emerald-400'
                                        : 'border border-white/5 bg-white/5 text-slate-400 hover:text-white'
                                }`}
                            >
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                                <span>Verified ({counts?.verified || 0})</span>
                            </button>
                            <button
                                onClick={() => setStatusFilter('rejected')}
                                className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-all ${
                                    statusFilter === 'rejected'
                                        ? 'border border-rose-500/40 bg-rose-500/20 text-rose-400'
                                        : 'border border-white/5 bg-white/5 text-slate-400 hover:text-white'
                                }`}
                            >
                                <span className="h-1.5 w-1.5 rounded-full bg-rose-400"></span>
                                <span>Ditolak ({counts?.rejected || 0})</span>
                            </button>
                        </div>

                        {/* Region Selector */}
                        <div className="no-scrollbar flex gap-1.5 overflow-x-auto pt-1 text-[11px]">
                            {NTB_REGIONS.map((region) => (
                                <button
                                    key={region}
                                    onClick={() => setSelectedRegion(region)}
                                    className={`whitespace-nowrap rounded-md px-2 py-0.5 font-medium transition-colors ${
                                        selectedRegion === region
                                            ? 'bg-white/15 text-white'
                                            : 'text-slate-400 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    {region}
                                </button>
                            ))}
                        </div>

                        {/* Bulk Action Bar for Pending Items */}
                        {statusFilter === 'pending' && filteredApplicants.length > 0 && (
                            <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#111C33] p-2 text-xs">
                                <button
                                    type="button"
                                    onClick={selectAllPending}
                                    className="flex items-center gap-1.5 text-slate-300 hover:text-white"
                                >
                                    {selectedIds.length > 0 ? (
                                        <CheckSquare className="h-4 w-4 text-[#E5B869]" />
                                    ) : (
                                        <Square className="h-4 w-4 text-slate-500" />
                                    )}
                                    <span>Pilih Semua Pending ({selectedIds.length})</span>
                                </button>

                                {selectedIds.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => setBulkApproveModalOpen(true)}
                                        className="rounded-lg bg-emerald-500 px-3 py-1 text-[11px] font-bold text-white shadow hover:bg-emerald-600 transition-colors"
                                    >
                                        Setujui ({selectedIds.length})
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Applicant Cards Roster */}
                    <div className="flex-1 space-y-2 overflow-y-auto p-3">
                        {filteredApplicants.length === 0 ? (
                            <div className="p-8 text-center text-xs text-slate-400">
                                <AlertCircle className="mx-auto mb-2 h-6 w-6 opacity-40" />
                                Tidak ada pendaftar dalam filter ini.
                            </div>
                        ) : (
                            filteredApplicants.map((item) => {
                                const isSelected = current?.id === item.id;
                                const isChecked = selectedIds.includes(item.id);
                                return (
                                    <div
                                        key={item.id}
                                        onClick={() => setSelectedId(item.id)}
                                        className={`group cursor-pointer rounded-2xl border p-3.5 transition-all ${
                                            isSelected
                                                ? 'border-[#E5B869] bg-[#111C33] shadow-xl shadow-black/50'
                                                : 'border-white/5 bg-[#111C33]/40 hover:border-white/15 hover:bg-[#111C33]/80'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex items-center gap-3">
                                                {statusFilter === 'pending' && (
                                                    <button
                                                        type="button"
                                                        onClick={(e) => toggleSelect(item.id, e)}
                                                        className="text-slate-400 hover:text-white"
                                                    >
                                                        {isChecked ? (
                                                            <CheckSquare className="h-4 w-4 text-[#E5B869]" />
                                                        ) : (
                                                            <Square className="h-4 w-4 text-slate-600" />
                                                        )}
                                                    </button>
                                                )}

                                                {item.avatar ? (
                                                    <img
                                                        src={item.avatar}
                                                        alt={item.name}
                                                        className={`h-11 w-11 rounded-xl border object-cover transition-transform ${
                                                            isSelected
                                                                ? 'border-[#E5B869]'
                                                                : 'border-white/10'
                                                        }`}
                                                    />
                                                ) : (
                                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E5B869]/15 font-['Plus_Jakarta_Sans'] font-bold text-[#E5B869] border border-[#E5B869]/30">
                                                        {item.name.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="text-xs font-bold text-white group-hover:text-[#E5B869] transition-colors">
                                                        {item.name}
                                                    </h3>
                                                    <p className="mt-0.5 flex items-center gap-1 text-[11px] text-slate-400">
                                                        <MapPin className="h-3 w-3 text-[#E5B869]" />
                                                        <span>{item.type.split(' • ')[0]}</span>
                                                    </p>
                                                    <p className="font-mono text-[10px] text-slate-500">
                                                        {item.appId}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex flex-col items-end gap-1.5">
                                                {item.status === 'pending' && (
                                                    <span className="rounded-full border border-amber-500/30 bg-amber-500/15 px-2 py-0.5 text-[10px] font-extrabold text-amber-300">
                                                        Pending
                                                    </span>
                                                )}
                                                {item.status === 'verified' && (
                                                    <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-[10px] font-extrabold text-emerald-400">
                                                        Verified
                                                    </span>
                                                )}
                                                {item.status === 'rejected' && (
                                                    <span className="rounded-full border border-rose-500/30 bg-rose-500/15 px-2 py-0.5 text-[10px] font-extrabold text-rose-400">
                                                        Ditolak
                                                    </span>
                                                )}
                                                <span className="text-[10px] text-slate-500">
                                                    {item.time}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Right Panel: Dossier & Document Inspection Workspace */}
                <div className="relative flex flex-1 flex-col overflow-y-auto bg-[#0A1224] p-6 md:p-8">
                    {current ? (
                        <div className="mx-auto w-full max-w-4xl space-y-6 pb-12">
                            {/* Applicant Hero Header */}
                            <div className="flex flex-col justify-between gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-center">
                                <div className="flex items-center gap-4">
                                    {current.avatar ? (
                                        <img
                                            src={current.avatar}
                                            alt={current.name}
                                            className="h-16 w-16 rounded-2xl border-2 border-[#E5B869] object-cover shadow-2xl"
                                        />
                                    ) : (
                                        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#C5A059] to-[#E5B869] text-2xl font-extrabold text-[#0A1224] shadow-xl">
                                            {current.name.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold text-white">
                                                {current.name}
                                            </h2>
                                            {current.status === 'pending' && (
                                                <span className="rounded-full border border-amber-500/40 bg-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300">
                                                    Menunggu Verifikasi
                                                </span>
                                            )}
                                            {current.status === 'verified' && (
                                                <span className="rounded-full border border-emerald-500/40 bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-400 flex items-center gap-1">
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                    Terverifikasi Aktif
                                                </span>
                                            )}
                                            {current.status === 'rejected' && (
                                                <span className="rounded-full border border-rose-500/40 bg-rose-500/20 px-3 py-1 text-xs font-bold text-rose-400 flex items-center gap-1">
                                                    <XCircle className="h-3.5 w-3.5" />
                                                    Pengajuan Ditolak
                                                </span>
                                            )}
                                        </div>
                                        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="h-3.5 w-3.5 text-[#E5B869]" />
                                                {current.type}
                                            </span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <Globe className="h-3.5 w-3.5 text-[#E5B869]" />
                                                Bahasa: {current.languages}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <a
                                        href={getWhatsAppUrl(current)}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-400 transition-colors hover:bg-emerald-500 hover:text-white"
                                        title="Kirim pesan verifikasi WhatsApp"
                                    >
                                        <MessageSquare className="h-3.5 w-3.5" />
                                        <span>WhatsApp Guide</span>
                                    </a>

                                    <button
                                        onClick={() => handleCopy(current.appId, 'appId')}
                                        className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#111C33] px-3 py-2 text-xs font-mono text-[#E5B869] transition-colors hover:border-[#E5B869]/50"
                                        title="Salin ID Registrasi"
                                    >
                                        <span>{current.appId}</span>
                                        {copiedAppId ? (
                                            <Check className="h-3.5 w-3.5 text-emerald-400" />
                                        ) : (
                                            <Copy className="h-3.5 w-3.5 text-slate-400" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Rejection Alert Box */}
                            {current.status === 'rejected' && current.rejectionReason && (
                                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-300">
                                    <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400">
                                        <XCircle className="h-4 w-4" />
                                        <span>Alasan Penolakan Berkas:</span>
                                    </div>
                                    <p className="mt-1.5 text-sm leading-relaxed">{current.rejectionReason}</p>
                                </div>
                            )}

                            {/* Anti-Fraud Name Matching Matrix */}
                            <div className="admin-card rounded-2xl p-5 shadow-xl">
                                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                    <h3 className="text-xs font-bold uppercase tracking-widest text-[#E5B869] flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4" />
                                        <span>Verifikasi Anti-Fraud Identitas & Rekening</span>
                                    </h3>
                                    {isNameMatch ? (
                                        <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400">
                                            <CheckCircle2 className="h-3 w-3" />
                                            Nama Identitas Sesuai Rekening
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 rounded-full border border-amber-500/30 bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-bold text-amber-300">
                                            <AlertCircle className="h-3 w-3" />
                                            Perhatian: Nama Pemilik Berbeda
                                        </span>
                                    )}
                                </div>

                                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    <div className="rounded-xl border border-white/5 bg-[#070D1B] p-3">
                                        <p className="text-[10px] uppercase font-bold text-slate-400">Nama Terdaftar (KTP)</p>
                                        <p className="mt-1 font-bold text-white text-xs">{current.name}</p>
                                    </div>
                                    <div className="rounded-xl border border-white/5 bg-[#070D1B] p-3">
                                        <p className="text-[10px] uppercase font-bold text-slate-400">Atas Nama Rekening</p>
                                        <p className="mt-1 font-bold text-[#E5B869] text-xs">{current.bankAccountHolder}</p>
                                    </div>
                                    <div className="rounded-xl border border-white/5 bg-[#070D1B] p-3">
                                        <p className="text-[10px] uppercase font-bold text-slate-400">Bank & No Rekening</p>
                                        <p className="mt-1 font-mono font-bold text-white text-xs">{current.bankName} - {current.bankAccountNumber}</p>
                                    </div>
                                </div>
                            </div>

                            {/* 3-Column Info Cards */}
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                {/* Kontak Pemandu */}
                                <div className="admin-card rounded-2xl p-4 shadow-xl">
                                    <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                        Kontak Guide
                                    </p>
                                    <div className="mt-3 space-y-2 text-xs">
                                        <a
                                            href={getWhatsAppUrl(current)}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-2 text-white hover:text-[#E5B869] transition-colors"
                                        >
                                            <Phone className="h-3.5 w-3.5 text-[#E5B869]" />
                                            <span className="font-semibold">{current.phone || '-'}</span>
                                        </a>
                                        <div className="flex items-center gap-2 truncate text-white">
                                            <Mail className="h-3.5 w-3.5 text-slate-400" />
                                            <span className="truncate">{current.email}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Tarif & Fasilitas */}
                                <div className="admin-card rounded-2xl p-4 shadow-xl">
                                    <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                        Tarif & Kendaraan
                                    </p>
                                    <div className="mt-3 space-y-1.5 text-xs text-white">
                                        <p>
                                            <span className="text-slate-400">Tarif Harian:</span>{' '}
                                            <strong className="text-[#E5B869]">
                                                {formatIDR(current.dailyRate)}
                                            </strong>{' '}
                                            / hari
                                        </p>
                                        <p className="truncate">
                                            <span className="text-slate-400">Transport:</span>{' '}
                                            <span>
                                                {current.vehicles && current.vehicles.length > 0
                                                    ? current.vehicles.join(', ')
                                                    : 'Tanpa Kendaraan'}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                {/* Rekening Bank */}
                                <div className="admin-card rounded-2xl p-4 shadow-xl">
                                    <div className="flex items-center justify-between">
                                        <p className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                                            Rekening Pencairan
                                        </p>
                                        <button
                                            onClick={() =>
                                                handleCopy(current.bankAccountNumber, 'account')
                                            }
                                            className="text-[#E5B869] hover:text-white"
                                            title="Salin No Rekening"
                                        >
                                            {copiedAccount ? (
                                                <Check className="h-3.5 w-3.5 text-emerald-400" />
                                            ) : (
                                                <Copy className="h-3.5 w-3.5" />
                                            )}
                                        </button>
                                    </div>
                                    <div className="mt-2 space-y-0.5 text-xs text-white">
                                        <p className="font-bold text-[#E5B869]">{current.bankName}</p>
                                        <p className="font-mono text-slate-200 font-bold tracking-wider">
                                            {current.bankAccountNumber}
                                        </p>
                                        <p className="text-[11px] text-slate-400">
                                            a.n {current.bankAccountHolder}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Bio & Destination Tags */}
                            <div className="admin-card rounded-2xl p-6 shadow-xl">
                                <h3 className="mb-2 text-xs font-bold tracking-widest text-[#E5B869] uppercase">
                                    Bio & Profil Pengalaman
                                </h3>
                                <p className="text-sm leading-relaxed text-white/90">
                                    {current.bio}
                                </p>

                                {current.serviceAreas && current.serviceAreas.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-white/10">
                                        <p className="mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                            Destinasi Wisata Spesialis:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {current.serviceAreas.map((area, i) => (
                                                <span
                                                    key={i}
                                                    className="rounded-lg border border-white/10 bg-[#070D1B] px-3 py-1 text-xs font-medium text-white shadow"
                                                >
                                                    {area}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Document Inspection Bay */}
                            <div>
                                <h3 className="mb-4 text-xs font-bold tracking-widest text-[#E5B869] uppercase">
                                    Inspeksi Dokumen Identitas & Sertifikasi
                                </h3>
                                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                    {/* KTP Document */}
                                    <div className="admin-card overflow-hidden rounded-2xl shadow-xl">
                                        <div className="flex items-center justify-between border-b border-white/10 bg-[#070D1B] p-3.5 text-xs font-bold text-white">
                                            <span>Foto KTP Asli</span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setImageRotation(0);
                                                    setZoomScale(1);
                                                    setZoomImage(current.ktpUrl);
                                                }}
                                                className="flex items-center gap-1 text-[#E5B869] hover:underline"
                                            >
                                                <ZoomIn className="h-3.5 w-3.5" />
                                                <span>Perbesar</span>
                                            </button>
                                        </div>
                                        <div
                                            className="flex h-60 cursor-pointer items-center justify-center bg-black/40 p-4 transition-colors hover:bg-black/60"
                                            onClick={() => {
                                                setImageRotation(0);
                                                setZoomScale(1);
                                                setZoomImage(current.ktpUrl);
                                            }}
                                        >
                                            <img
                                                src={current.ktpUrl}
                                                alt="KTP Document"
                                                className="max-h-full max-w-full rounded-xl border border-white/10 object-contain shadow-lg"
                                            />
                                        </div>
                                    </div>

                                    {/* Profile Avatar / Certification */}
                                    <div className="admin-card overflow-hidden rounded-2xl shadow-xl">
                                        <div className="flex items-center justify-between border-b border-white/10 bg-[#070D1B] p-3.5 text-xs font-bold text-white">
                                            <span>Foto Profil Pemandu</span>
                                            {current.avatar && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setImageRotation(0);
                                                        setZoomScale(1);
                                                        setZoomImage(current.avatar);
                                                    }}
                                                    className="flex items-center gap-1 text-[#E5B869] hover:underline"
                                                >
                                                    <ZoomIn className="h-3.5 w-3.5" />
                                                    <span>Perbesar</span>
                                                </button>
                                            )}
                                        </div>
                                        <div
                                            className="flex h-60 cursor-pointer items-center justify-center bg-black/40 p-4 transition-colors hover:bg-black/60"
                                            onClick={() => {
                                                if (current.avatar) {
                                                    setImageRotation(0);
                                                    setZoomScale(1);
                                                    setZoomImage(current.avatar);
                                                }
                                            }}
                                        >
                                            {current.avatar ? (
                                                <img
                                                    src={current.avatar}
                                                    alt="Profile Avatar"
                                                    className="max-h-full max-w-full rounded-xl border border-white/10 object-contain shadow-lg"
                                                />
                                            ) : (
                                                <div className="text-center text-xs text-slate-400">
                                                    Foto profil bawaan (tanpa kustomisasi)
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Decision Workspace Action Footer */}
                            <div className="sticky bottom-0 z-20 flex items-center justify-end gap-3 rounded-2xl border border-white/15 bg-[#070D1B]/95 p-4 shadow-2xl backdrop-blur-xl">
                                {current.status === 'pending' && (
                                    <>
                                        <button
                                            type="button"
                                            disabled={isSubmitting}
                                            onClick={() => setRejectModalOpen(true)}
                                            className="rounded-xl border border-rose-500/40 bg-rose-500/20 px-5 py-2.5 text-xs font-bold text-rose-300 transition-colors hover:bg-rose-500/30 disabled:opacity-50"
                                        >
                                            Tolak Pengajuan
                                        </button>
                                        <button
                                            type="button"
                                            disabled={isSubmitting}
                                            onClick={() => setApproveModalOpen(true)}
                                            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#C5A059] to-[#E5B869] px-6 py-2.5 text-xs font-extrabold text-[#0A1224] shadow-lg shadow-[#C5A059]/25 transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                                        >
                                            <CheckCircle2 className="h-4 w-4" />
                                            <span>Setujui & Terbitkan Profil (1-Klik)</span>
                                        </button>
                                    </>
                                )}

                                {current.status === 'verified' && (
                                    <button
                                        type="button"
                                        disabled={isSubmitting}
                                        onClick={() => setRejectModalOpen(true)}
                                        className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-5 py-2.5 text-xs font-semibold text-rose-300 transition-colors hover:bg-rose-500/20"
                                    >
                                        Cabut / Nonaktifkan Verifikasi
                                    </button>
                                )}

                                {current.status === 'rejected' && (
                                    <button
                                        type="button"
                                        disabled={isSubmitting}
                                        onClick={() => setApproveModalOpen(true)}
                                        className="rounded-xl bg-[#E5B869] px-6 py-2.5 text-xs font-bold text-[#0A1224] transition-opacity hover:opacity-90"
                                    >
                                        Tinjau Ulang & Setujui
                                    </button>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-full flex-col items-center justify-center text-center text-sm text-slate-400">
                            <ShieldCheck className="h-12 w-12 text-slate-600 mb-3" />
                            <p className="font-semibold text-white">Pilih Pemandu dari Daftar</p>
                            <p className="text-xs text-slate-400 mt-1">
                                Klik nama pemandu di panel kiri untuk meninjau berkas identitas dan kredensial.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Zoom & Lightbox Preview */}
            {zoomImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-150"
                    onClick={() => setZoomImage(null)}
                >
                    <div
                        className="relative flex flex-col items-center max-h-[95vh] max-w-5xl overflow-hidden rounded-3xl border border-white/20 bg-[#0A1224] p-4 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Lightbox Controls */}
                        <div className="flex w-full items-center justify-between border-b border-white/10 pb-3 mb-3">
                            <span className="text-xs font-bold text-white">Inspeksi Dokumen Resolusi Penuh</span>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setZoomScale((s) => Math.min(s + 0.25, 2.5))}
                                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20"
                                    title="Perbesar"
                                >
                                    <ZoomIn className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setZoomScale((s) => Math.max(s - 0.25, 0.5))}
                                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20"
                                    title="Perkecil"
                                >
                                    <ZoomOut className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setImageRotation((prev) => (prev + 90) % 360)}
                                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-white/20"
                                    title="Putar 90 Derajat"
                                >
                                    <RotateCw className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setZoomImage(null)}
                                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-rose-500 transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-center overflow-auto max-h-[80vh] p-2">
                            <img
                                src={zoomImage}
                                alt="Dokumen Zoom"
                                style={{
                                    transform: `rotate(${imageRotation}deg) scale(${zoomScale})`,
                                }}
                                className="max-h-[75vh] w-auto rounded-xl object-contain shadow-2xl transition-transform duration-200"
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Konfirmasi Persetujuan KYC Single */}
            {approveModalOpen && current && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-150">
                    <div className="w-full max-w-lg rounded-3xl border border-[#C5A059]/30 bg-[#0E172B] p-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-400">
                                    <ShieldCheck className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-bold text-white">
                                        Setujui Verifikasi Mitra Guide
                                    </h3>
                                    <p className="text-xs text-slate-400">
                                        Konfirmasi penerbitan kredensial dan aktivasi profil
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setApproveModalOpen(false)}
                                className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="mt-4 rounded-2xl border border-white/10 bg-[#16223B]/80 p-4">
                            <div className="flex items-center gap-3.5">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#C5A059]/20 text-base font-bold text-[#C5A059]">
                                    {current.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-bold text-white text-sm truncate">{current.name}</h4>
                                    <p className="text-xs text-slate-400 mt-0.5 truncate">
                                        {current.type} • {current.bankName} ({current.bankAccountNumber})
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-xs text-slate-300">
                            <p className="font-bold text-emerald-400 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                                <Sparkles className="h-3.5 w-3.5" />
                                Dampak Persetujuan:
                            </p>
                            <div className="space-y-1.5 text-[11px]">
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                    <span>Profil berstatus <strong>VERIFIED</strong> dan langsung tayang di katalog pencarian wisatawan.</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                    <span>Pemandu dapat login, mengatur kalender, dan menerima booking.</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setApproveModalOpen(false)}
                                className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/5 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={handleConfirmApprove}
                                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 transition-all"
                            >
                                {isSubmitting ? 'Memproses...' : 'Setujui & Terbitkan Profil'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Bulk Approve */}
            {bulkApproveModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-150">
                    <div className="w-full max-w-md rounded-3xl border border-emerald-500/30 bg-[#0E172B] p-6 shadow-2xl">
                        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400">
                                <Users className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-bold text-white">
                                    Persetujuan Massal (Bulk Approve)
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Verifikasi {selectedIds.length} pemandu sekaligus
                                </p>
                            </div>
                        </div>

                        <p className="mt-4 text-xs text-slate-300 leading-relaxed">
                            Apakah Anda yakin ingin memverifikasi <strong className="text-white">{selectedIds.length} mitra pemandu</strong> yang dipilih? Semua profil akan otomatis aktif di katalog wisatawan.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setBulkApproveModalOpen(false)}
                                className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/5"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                disabled={isSubmitting}
                                onClick={handleBulkApprove}
                                className="rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-white shadow hover:bg-emerald-600 disabled:opacity-50"
                            >
                                {isSubmitting ? 'Memproses...' : `Ya, Setujui ${selectedIds.length} Pemandu`}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Tolak Pengajuan Berkas */}
            {rejectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-in fade-in duration-150">
                    <div className="w-full max-w-lg rounded-3xl border border-white/15 bg-[#111C33] p-6 shadow-2xl">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <div className="flex items-center gap-2.5">
                                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                    <XCircle className="h-4 w-4" />
                                </div>
                                <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-bold text-white">
                                    Tolak Pengajuan Verifikasi
                                </h3>
                            </div>
                            <button
                                onClick={() => setRejectModalOpen(false)}
                                className="text-slate-400 hover:text-white"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleRejectSubmit} className="mt-4 space-y-4">
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Pilih alasan cepat di bawah atau tuliskan catatan spesifik agar pemandu (
                                <strong className="text-white">{current?.name}</strong>) dapat memperbaiki data pendaftarannya.
                            </p>

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                                    Pilihan Alasan Cepat:
                                </label>
                                <div className="flex flex-wrap gap-1.5">
                                    {PRESET_REASONS.map((preset, idx) => (
                                        <button
                                            key={idx}
                                            type="button"
                                            onClick={() => setRejectReason(preset)}
                                            className="rounded-lg border border-white/10 bg-[#070D1B] p-2 text-left text-[11px] text-slate-300 hover:border-rose-400/50 hover:bg-rose-500/10 hover:text-rose-200 transition-colors"
                                        >
                                            {preset}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                                    Catatan Penolakan untuk Guide
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    placeholder="Tuliskan alasan penolakan secara jelas..."
                                    className="w-full rounded-xl border border-white/10 bg-[#070D1B] p-3 text-xs text-white placeholder-slate-500 focus:border-rose-400 focus:outline-none focus:ring-1 focus:ring-rose-400/30"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setRejectModalOpen(false)}
                                    className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/5"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="rounded-xl bg-rose-500 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-rose-500/25 hover:bg-rose-600 disabled:opacity-50"
                                >
                                    {isSubmitting ? 'Memproses...' : 'Konfirmasi Penolakan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
