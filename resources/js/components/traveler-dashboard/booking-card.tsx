import { Booking, PaymentAccount } from '@/types/booking';

import {
    Clock,
    MapPin,
    MoreVertical,
    MessageSquare,
    AlertTriangle,
    ShieldCheck,
    ChevronRight,
    Info,
    CheckCircle2,
    Calendar,
    Users,
    Compass,
    FileText,
    Sparkles,
    Star,
    Send,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Link, router } from '@inertiajs/react';


interface Props {
    booking: Booking & {
        _serverId?: number;
        _paymentId?: number | null;
        _paymentStatus?: string;
        _paymentProof?: string | null;
    };
    paymentAccounts?: PaymentAccount[];
    onViewVoucher: (booking: Booking) => void;
}

export function BookingCard({
    booking,
    paymentAccounts,
    onViewVoucher,
}: Props) {
    const [timeLeft, setTimeLeft] = useState<string>('');
    const [showEscrowModal, setShowEscrowModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showRefundModal, setShowRefundModal] = useState(false);
    const [refundCategory, setRefundCategory] = useState('Pemandu Tidak Kompeten');
    const [refundDetails, setRefundDetails] = useState('');
    const [refundBankName, setRefundBankName] = useState('Bank BCA');
    const [refundBankAccount, setRefundBankAccount] = useState('');
    const [refundAccountHolder, setRefundAccountHolder] = useState('');
    const [isSubmittingRefund, setIsSubmittingRefund] = useState(false);
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewRating, setReviewRating] = useState(5);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        if (!booking._serverId) return;
        if (!reviewComment.trim()) {
            alert('Mohon tulis komentar ulasan Anda mengenai pengalaman tur bersama pemandu.');
            return;
        }

        setIsSubmittingReview(true);
        router.post(
            `/bookings/${booking._serverId}/reviews`,
            {
                rating: reviewRating,
                comment: reviewComment.trim(),
            },
            {
                onSuccess: () => {
                    setIsSubmittingReview(false);
                    setShowReviewModal(false);
                    setReviewComment('');
                    alert('Terima kasih! Ulasan dan rating Anda telah berhasil disimpan.');
                },
                onError: (errors) => {
                    setIsSubmittingReview(false);
                    console.error('Review submission error:', errors);
                    alert('Gagal mengirim ulasan. Silakan periksa kembali formulir Anda.');
                },
            }
        );
    };

    const handleSubmitRefund = (e: React.FormEvent) => {
        e.preventDefault();
        if (!booking._serverId) return;
        if (!refundDetails || refundDetails.trim().length < 10) {
            alert('Mohon jelaskan detail keluhan Anda minimal 10 karakter.');
            return;
        }

        setIsSubmittingRefund(true);
        router.post(
            `/bookings/${booking._serverId}/refund`,
            {
                reason_category: refundCategory,
                details: refundDetails,
                bank_name: refundBankName,
                bank_account_number: refundBankAccount,
                bank_account_holder: refundAccountHolder,
            },
            {
                onSuccess: () => {
                    setIsSubmittingRefund(false);
                    setShowRefundModal(false);
                    setRefundDetails('');
                    setRefundBankAccount('');
                    setRefundAccountHolder('');
                    alert('Pengajuan refund berhasil dikirim! Tim Admin IguideU akan segera meninjau keluhan Anda.');
                },
                onError: (errors) => {
                    setIsSubmittingRefund(false);
                    console.error('Refund submission error:', errors);
                    alert('Gagal mengirim pengajuan refund. Silakan periksa kelengkapan formulir.');
                },
            }
        );
    };

    const handleUploadProof = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!paymentProof) return;

        setIsUploading(true);

        const paymentId = booking._paymentId;

        if (paymentId) {
            // Real API call using Inertia router
            const formData = new FormData();
            formData.append('payment_proof', paymentProof);

            router.post(`/payments/${paymentId}/proof`, formData as any, {
                forceFormData: true,
                onSuccess: () => {
                    alert(
                        'Bukti pembayaran berhasil diunggah! Menunggu verifikasi admin.',
                    );
                    setShowPaymentModal(false);
                    setPaymentProof(null);
                    setIsUploading(false);
                },
                onError: (errors) => {
                    console.error('Upload failed:', errors);
                    alert('Gagal mengunggah bukti pembayaran. Coba lagi.');
                    setIsUploading(false);
                },
            });
        } else {
            alert('Terjadi kesalahan: Data pembayaran tidak ditemukan.');
            setIsUploading(false);
        }
    };

    // Format currency
    const formatRupiah = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val);
    };

    // Calculate countdown
    useEffect(() => {
        let targetTime: string | undefined;

        if (booking.status === 'pending_guide') {
            targetTime = booking.requestExpiresAt;
        } else if (booking.status === 'pending_payment') {
            targetTime = booking.paymentExpiresAt;
        } else if (booking.status === 'ongoing' && booking.guideEndedAt) {
            targetTime =
                booking.confirmationExpiresAt ||
                new Date(
                    new Date(booking.guideEndedAt).getTime() + 24 * 60 * 60 * 1000,
                ).toISOString();
        }

        if (!targetTime) return;

        const updateTimer = () => {
            const difference =
                new Date(targetTime!).getTime() - new Date().getTime();
            if (difference <= 0) {
                setTimeLeft('00:00:00');
                return;
            }

            const hours = Math.floor(difference / (1000 * 60 * 60));
            const minutes = Math.floor((difference / (1000 * 60)) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            if (hours > 0) {
                setTimeLeft(
                    `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
                );
            } else {
                setTimeLeft(
                    `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
                );
            }
        };

        updateTimer();
        const timer = setInterval(updateTimer, 1000);
        return () => clearInterval(timer);
    }, [
        booking.id,
        booking.status,
        booking.requestExpiresAt,
        booking.paymentExpiresAt,
        booking.guideEndedAt,
        booking.confirmationExpiresAt,
    ]);

    const getStatusBadge = () => {
        switch (booking.status) {
            case 'pending_guide':
                return (
                    <span className="rounded-md border border-amber-500/20 bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold tracking-widest text-amber-500 uppercase shadow-sm">
                        Menunggu Pemandu
                    </span>
                );
            case 'pending_payment':
                if (booking._paymentStatus === 'pending') {
                    return (
                        <span className="flex items-center gap-1.5 rounded-md border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold tracking-widest text-blue-400 uppercase shadow-sm">
                            <Clock className="h-3 w-3" /> Menunggu Verifikasi
                        </span>
                    );
                }
                return (
                    <span className="flex items-center gap-1.5 rounded-md border border-rose-500/20 bg-rose-500/10 px-2.5 py-1 text-[10px] font-bold tracking-widest text-rose-500 uppercase shadow-sm">
                        <Clock className="h-3 w-3" /> Menunggu Pembayaran
                    </span>
                );
            case 'ongoing':
                if (booking.guideEndedAt) {
                    return (
                        <span className="flex items-center gap-1.5 rounded-md border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold tracking-widest text-blue-400 uppercase shadow-sm">
                            <Clock className="h-3 w-3 animate-pulse" /> Butuh Konfirmasi
                        </span>
                    );
                }
                return (
                    <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold tracking-widest text-emerald-400 uppercase shadow-sm">
                        Perjalanan Aktif
                    </span>
                );
            case 'completed':
                return (
                    <span className="rounded-md border border-[#C5A059]/20 bg-[#C5A059]/10 px-2.5 py-1 text-[10px] font-bold tracking-widest text-[#C5A059] uppercase shadow-sm">
                        Selesai
                    </span>
                );
            case 'cancelled':
                return (
                    <span className="rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-bold tracking-widest text-[#79849f] uppercase shadow-sm">
                        Dibatalkan
                    </span>
                );
            case 'disputed':
                return (
                    <span className="flex items-center gap-1.5 rounded-md border border-rose-500/30 bg-rose-500/10 px-2.5 py-1 text-[10px] font-bold tracking-widest text-rose-400 uppercase shadow-sm">
                        <AlertTriangle className="h-3 w-3 animate-pulse" /> Sengketa / Refund
                    </span>
                );
        }
    };

    const handleReleaseEscrow = () => {
        if (booking._serverId) {
            router.post(
                `/bookings/${booking._serverId}/complete`,
                {},
                {
                    onSuccess: () => setShowEscrowModal(false),
                },
            );
        }
    };

    const handleCancel = () => {
        if (booking._serverId) {
            router.post(`/bookings/${booking._serverId}/cancel`);
        }
    };

    return (
        <>
            <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#121E36]/90 shadow-xl backdrop-blur-md transition-all hover:border-[#C5A059]/40 hover:shadow-[0_8px_30px_rgba(197,160,89,0.12)]">
                {/* 1. Header Bar: Booking Code + Date + Package Variant + Status Badge + Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 bg-[#0A1224]/70 px-5 py-3 sm:px-6">
                    <div className="flex flex-wrap items-center gap-2.5">
                        <span className="font-mono text-xs font-extrabold tracking-wider text-[#C5A059]">
                            #{booking.id}
                        </span>
                        <span className="text-white/20">•</span>
                        <span className="text-xs text-[#79849f]">
                            Dipesan{' '}
                            {new Date(booking.bookingDate).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                            })}
                        </span>
                        <span className="hidden sm:inline text-white/20">•</span>
                        <span className="hidden sm:inline-flex items-center rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] font-medium text-[#A0AEC0]">
                            {booking.packageVariant}
                        </span>
                    </div>

                    <div className="flex items-center gap-3">
                        {getStatusBadge()}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="rounded-lg p-1.5 text-[#79849f] transition-colors hover:bg-white/10 hover:text-white">
                                    <MoreVertical className="h-4 w-4" />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                align="end"
                                className="w-48 border border-white/10 bg-[#16223B] text-white shadow-xl"
                            >
                                <DropdownMenuItem
                                    onClick={() => onViewVoucher(booking)}
                                    className="cursor-pointer text-xs focus:bg-white/10"
                                >
                                    <FileText className="mr-2 h-3.5 w-3.5 text-[#C5A059]" />
                                    Lihat E-Voucher
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer text-xs focus:bg-white/10">
                                    <MessageSquare className="mr-2 h-3.5 w-3.5 text-blue-400" />
                                    Hubungi Bantuan CS
                                </DropdownMenuItem>
                                {(booking.status === 'ongoing' ||
                                    booking.status === 'completed') && (
                                    <DropdownMenuItem
                                        onClick={() => setShowRefundModal(true)}
                                        className="cursor-pointer text-xs text-rose-400 focus:bg-rose-500/10 focus:text-rose-300"
                                    >
                                        <AlertTriangle className="mr-2 h-3.5 w-3.5 text-rose-400" />
                                        Ajukan Sengketa / Refund
                                    </DropdownMenuItem>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* 2. Main Content Split: Details Grid (Left) + Ticket Price & Action (Right) */}
                <div className="flex flex-col lg:flex-row">
                    {/* Left & Center: Info, Bento Grid & Alert Banner */}
                    <div className="flex-1 p-5 sm:p-6 space-y-4">
                        {/* Guide Info Row */}
                        <div className="flex items-center gap-4">
                            <div className="relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 overflow-hidden rounded-2xl border-2 border-white/10 shadow-md group-hover:border-[#C5A059]/40 transition-colors">
                                <img
                                    src={booking.guideImage}
                                    alt={booking.guideName}
                                    className="h-full w-full object-cover"
                                />
                                <div
                                    className="absolute bottom-1 right-1 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-[#121E36]"
                                    title="Pemandu Terverifikasi"
                                />
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h4 className="truncate font-['Plus_Jakarta_Sans'] text-lg sm:text-xl font-bold tracking-tight text-white group-hover:text-[#C5A059] transition-colors">
                                        {booking.guideName}
                                    </h4>
                                    <span className="inline-flex items-center gap-1 rounded-md bg-[#C5A059]/10 border border-[#C5A059]/30 px-2 py-0.5 text-[10px] font-bold text-[#C5A059]">
                                        <ShieldCheck className="h-3 w-3" /> Pemandu Terverifikasi
                                    </span>
                                </div>

                                <div className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-[#C5A059]">
                                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                                    <span className="truncate">{booking.destination}</span>
                                </div>
                            </div>
                        </div>

                        {/* Bento Grid: 4 Specification Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                            <div className="rounded-xl border border-white/5 bg-[#0A1224]/60 p-2.5">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#79849f] flex items-center gap-1">
                                    <Calendar className="h-3 w-3 text-[#C5A059]" /> Jadwal Wisata
                                </p>
                                <p className="mt-1 text-xs font-bold text-white truncate">
                                    {new Date(booking.bookingDate).toLocaleDateString('id-ID', {
                                        day: 'numeric',
                                        month: 'short',
                                    })}{' '}
                                    • {booking.startTime}
                                </p>
                            </div>

                            <div className="rounded-xl border border-white/5 bg-[#0A1224]/60 p-2.5">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#79849f] flex items-center gap-1">
                                    <Compass className="h-3 w-3 text-blue-400" /> Tipe Paket
                                </p>
                                <p
                                    className="mt-1 text-xs font-bold text-white truncate"
                                    title={booking.packageVariant}
                                >
                                    {booking.packageVariant}
                                </p>
                            </div>

                            <div className="rounded-xl border border-white/5 bg-[#0A1224]/60 p-2.5">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#79849f] flex items-center gap-1">
                                    <Users className="h-3 w-3 text-emerald-400" /> Jumlah Peserta
                                </p>
                                <p className="mt-1 text-xs font-bold text-white truncate">
                                    {booking.paxCount} Orang (Pax)
                                </p>
                            </div>

                            <div className="rounded-xl border border-white/5 bg-[#0A1224]/60 p-2.5">
                                <p className="text-[10px] font-bold uppercase tracking-wider text-[#79849f] flex items-center gap-1">
                                    <ShieldCheck className="h-3 w-3 text-amber-400" /> Proteksi
                                </p>
                                <p className="mt-1 text-xs font-bold text-emerald-400 truncate">
                                    Escrow Terjamin
                                </p>
                            </div>
                        </div>

                        {/* Status Alert Banner (Horizontal & Space-filling) */}
                        {booking.status === 'ongoing' && booking.guideEndedAt && (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-xs text-emerald-300">
                                <div className="flex items-start sm:items-center gap-2.5">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
                                        <CheckCircle2 className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">Pemandu Telah Mengakhiri Tur</p>
                                        <p className="text-[11px] text-emerald-200/80">
                                            Konfirmasi penyelesaian agar dana diteruskan ke pemandu, atau ajukan refund jika terdapat kendala.
                                        </p>
                                    </div>
                                </div>
                                {booking.confirmationExpiresAt && (
                                    <div className="flex items-center gap-1.5 rounded-lg border border-emerald-500/20 bg-black/30 px-3 py-1.5 font-mono text-xs font-bold text-emerald-300 shrink-0">
                                        <Clock className="h-3.5 w-3.5 animate-pulse text-emerald-400" />
                                        <span>Batas Konfirmasi: {timeLeft}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {booking.status === 'ongoing' && !booking.guideEndedAt && (
                            <div className="flex items-center gap-3 rounded-xl border border-blue-500/20 bg-blue-500/10 p-3.5 text-xs text-blue-300">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/20 text-blue-400">
                                    <Clock className="h-4 w-4 animate-pulse" />
                                </div>
                                <div>
                                    <p className="font-bold text-white">Tur Sedang Berlangsung</p>
                                    <p className="text-[11px] text-blue-200/80">
                                        Pemandu sedang memandu perjalanan Anda. Tombol konfirmasi penyelesaian akan muncul setelah pemandu menekan "Akhiri Perjalanan".
                                    </p>
                                </div>
                            </div>
                        )}

                        {booking.status === 'pending_guide' && (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3.5 text-xs text-amber-300">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
                                        <Clock className="h-4 w-4 animate-spin" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">Menunggu Konfirmasi Pemandu</p>
                                        <p className="text-[11px] text-amber-200/80">
                                            Pemandu sedang meninjau ketersediaan jadwal perjalanan Anda.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 rounded-lg border border-amber-500/20 bg-black/30 px-3 py-1.5 font-mono text-xs font-bold text-amber-400 shrink-0">
                                    <Clock className="h-3.5 w-3.5" />
                                    <span>Sisa Waktu: {timeLeft}</span>
                                </div>
                            </div>
                        )}

                        {booking.status === 'pending_payment' && (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs text-rose-300">
                                <div className="flex items-center gap-2.5">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400">
                                        <Clock className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">Menunggu Pembayaran Escrow</p>
                                        <p className="text-[11px] text-rose-200/80">
                                            {booking._paymentStatus === 'pending'
                                                ? 'Bukti transfer telah diunggah. Menunggu verifikasi admin IguideU.'
                                                : 'Selesaikan transfer agar jadwal perjalanan terkunci.'}
                                        </p>
                                    </div>
                                </div>
                                {booking._paymentStatus !== 'pending' && booking.paymentExpiresAt && (
                                    <div className="flex items-center gap-1.5 rounded-lg border border-rose-500/20 bg-black/30 px-3 py-1.5 font-mono text-xs font-bold text-rose-400 shrink-0">
                                        <Clock className="h-3.5 w-3.5" />
                                        <span>Batas Bayar: {timeLeft}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {booking.status === 'disputed' && (
                            <div className="flex items-start gap-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400">
                                    <AlertTriangle className="h-4 w-4 animate-pulse" />
                                </div>
                                <div>
                                    <p className="font-bold text-white">Pengajuan Refund Sedang Ditinjau Admin</p>
                                    <p className="text-[11px] text-rose-200/80 mt-0.5">
                                        Tim Admin IguideU sedang meninjau kronologi keluhan Anda (estimasi 1x24 jam kerja). Dana transaksi di escrow dibekukan aman.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Ticket Price & Actions Column */}
                    <div className="flex flex-col justify-between border-t border-white/10 bg-[#0A1224]/70 p-5 sm:p-6 lg:w-80 lg:border-t-0 lg:border-l lg:border-dashed">
                        {/* Price Block */}
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold tracking-widest uppercase text-[#79849f]">
                                Total Biaya Tur
                            </p>
                            <p className="font-['Plus_Jakarta_Sans'] text-2xl font-black text-[#C5A059]">
                                {formatRupiah(booking.totalAmount)}
                            </p>
                            <p className="text-[11px] text-[#79849f] flex items-center gap-1">
                                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                                Termasuk PPN & Proteksi Escrow
                            </p>
                        </div>

                        {/* Action Buttons Block */}
                        <div className="mt-5 flex flex-col gap-2.5">
                            {booking.status === 'ongoing' && booking.guideEndedAt && (
                                <>
                                    <Button
                                        className="h-10 w-full gap-2 bg-[#C5A059] text-xs font-extrabold text-[#0D182E] shadow-lg shadow-[#C5A059]/20 hover:bg-[#fed488] transition-transform active:scale-98"
                                        onClick={() => setShowEscrowModal(true)}
                                    >
                                        <CheckCircle2 className="h-4 w-4" />
                                        Konfirmasi Selesai
                                    </Button>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            variant="outline"
                                            className="h-9 w-full gap-1.5 border-rose-500/30 text-[11px] font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                                            onClick={() => setShowRefundModal(true)}
                                        >
                                            <AlertTriangle className="h-3.5 w-3.5" />
                                            Ajukan Refund
                                        </Button>
                                        <a
                                            href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                                                `Halo, saya ingin menghubungi pemandu ${booking.guideName} terkait pesanan #${booking.id} di IguideU.`,
                                            )}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex h-9 w-full items-center justify-center gap-1.5 rounded-md border border-white/10 bg-white/5 text-[11px] font-bold text-white hover:bg-white/10 hover:border-[#C5A059]/40 hover:text-[#C5A059] transition-colors"
                                        >
                                            <MessageSquare className="h-3.5 w-3.5" />
                                            WhatsApp
                                        </a>
                                    </div>
                                    <button
                                        onClick={() => onViewVoucher(booking)}
                                        className="text-center text-[11px] font-semibold text-[#79849f] hover:text-[#C5A059] transition-colors pt-1 cursor-pointer"
                                    >
                                        Lihat E-Voucher Pesanan &rarr;
                                    </button>
                                </>
                            )}

                            {booking.status === 'ongoing' && !booking.guideEndedAt && (
                                <>
                                    <Button
                                        className="h-10 w-full gap-2 bg-[#C5A059] text-xs font-extrabold text-[#0D182E] shadow-lg shadow-[#C5A059]/20 hover:bg-[#fed488]"
                                        onClick={() => onViewVoucher(booking)}
                                    >
                                        <FileText className="h-4 w-4" />
                                        Buka E-Voucher & Tiket
                                    </Button>
                                    <a
                                        href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                                            `Halo, saya ingin menghubungi pemandu ${booking.guideName} terkait pesanan #${booking.id} di IguideU.`,
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-9 w-full items-center justify-center gap-1.5 rounded-md border border-white/10 text-[11px] font-bold text-white hover:bg-white/10 hover:border-[#C5A059]/40 hover:text-[#C5A059] transition-colors"
                                    >
                                        <MessageSquare className="h-3.5 w-3.5" />
                                        WhatsApp Pemandu
                                    </a>
                                </>
                            )}

                            {booking.status === 'pending_guide' && (
                                <>
                                    <Button
                                        variant="outline"
                                        className="h-10 w-full border-rose-500/30 text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                                        onClick={handleCancel}
                                    >
                                        Batalkan Pesanan
                                    </Button>
                                    <button
                                        onClick={() => onViewVoucher(booking)}
                                        className="text-center text-[11px] font-semibold text-[#79849f] hover:text-[#C5A059] transition-colors pt-1 cursor-pointer"
                                    >
                                        Lihat Rincian Pesanan &rarr;
                                    </button>
                                </>
                            )}

                            {booking.status === 'pending_payment' && (
                                <>
                                    {booking._paymentStatus === 'pending' ? (
                                        <>
                                            <Button
                                                variant="outline"
                                                onClick={() => setShowPaymentModal(true)}
                                                className="h-10 w-full border-blue-500/30 text-xs font-bold text-blue-400 hover:bg-blue-500/10"
                                            >
                                                <FileText className="mr-1.5 h-4 w-4" /> Upload Ulang Bukti
                                            </Button>
                                            <a
                                                href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                                                    `Halo Admin IguideU, saya ingin konfirmasi pembayaran pesanan #${booking.id}.`,
                                                )}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex h-9 w-full items-center justify-center gap-1.5 rounded-md border border-white/10 text-[11px] font-bold text-white hover:bg-white/10"
                                            >
                                                <MessageSquare className="h-3.5 w-3.5" /> WhatsApp Admin
                                            </a>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                className="h-10 w-full bg-[#C5A059] text-xs font-extrabold text-[#0D182E] shadow-lg shadow-[#C5A059]/20 hover:bg-[#fed488]"
                                                onClick={() => setShowPaymentModal(true)}
                                            >
                                                Bayar Sekarang
                                            </Button>
                                            <div className="grid grid-cols-2 gap-2">
                                                <Button
                                                    variant="outline"
                                                    className="h-9 w-full border-rose-500/30 text-[11px] font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300"
                                                    onClick={handleCancel}
                                                >
                                                    Batalkan
                                                </Button>
                                                <button
                                                    onClick={() => onViewVoucher(booking)}
                                                    className="flex h-9 w-full items-center justify-center rounded-md border border-white/10 text-[11px] font-semibold text-white hover:bg-white/10"
                                                >
                                                    Voucher
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}

                            {booking.status === 'disputed' && (
                                <>
                                    <a
                                        href={`https://wa.me/6281234567890?text=${encodeURIComponent(
                                            `Halo Tim Support IguideU, saya ingin menanyakan perkembangan pengajuan refund untuk pesanan #${booking.id}.`,
                                        )}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex h-10 w-full items-center justify-center gap-2 rounded-md border border-rose-500/30 bg-rose-500/10 text-xs font-bold text-rose-300 hover:bg-rose-500/20"
                                    >
                                        <MessageSquare className="h-4 w-4" /> Hubungi CS / Admin
                                    </a>
                                    <button
                                        onClick={() => onViewVoucher(booking)}
                                        className="text-center text-[11px] font-semibold text-[#79849f] hover:text-[#C5A059] transition-colors pt-1 cursor-pointer"
                                    >
                                        Lihat E-Voucher &rarr;
                                    </button>
                                </>
                            )}

                            {booking.status === 'completed' && (
                                <>
                                    {!booking.isReviewed ? (
                                        <Button
                                            onClick={() => setShowReviewModal(true)}
                                            className="h-10 w-full border border-[#C5A059] bg-[#C5A059]/10 text-xs font-extrabold text-[#C5A059] shadow-md hover:bg-[#C5A059] hover:text-[#0D182E] cursor-pointer"
                                        >
                                            <Sparkles className="mr-1.5 h-4 w-4" /> Beri Ulasan & Rating
                                        </Button>
                                    ) : (
                                        <div className="flex flex-col gap-1.5 w-full rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2.5">
                                            <div className="flex items-center justify-between">
                                                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Sudah Diulas
                                                </span>
                                                {booking.review && (
                                                    <div className="flex items-center gap-0.5 text-amber-400">
                                                        {[...Array(booking.review.rating || 5)].map((_, i) => (
                                                            <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            {booking.review?.comment && (
                                                <p className="text-[11px] italic text-[#79849f] line-clamp-2 mt-0.5">
                                                    "{booking.review.comment}"
                                                </p>
                                            )}
                                        </div>
                                    )}
                                    <button
                                        onClick={() => onViewVoucher(booking)}
                                        className="text-center text-[11px] font-semibold text-[#79849f] hover:text-[#C5A059] transition-colors pt-1 cursor-pointer"
                                    >
                                        Lihat E-Voucher & Bukti &rarr;
                                    </button>
                                </>
                            )}

                            {booking.status === 'cancelled' && (
                                <button
                                    onClick={() => onViewVoucher(booking)}
                                    className="flex h-10 w-full items-center justify-center rounded-md border border-white/10 text-xs font-bold text-white hover:bg-white/10"
                                >
                                    Lihat Rincian Pembatalan
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Escrow Release Warning Modal */}
            <Dialog open={showEscrowModal} onOpenChange={setShowEscrowModal}>
                <DialogContent className="border border-white/10 bg-[#16223B] p-6 shadow-2xl sm:max-w-md">
                    <DialogHeader className="gap-2">
                        <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-500">
                            <AlertTriangle className="h-7 w-7" />
                        </div>
                        <DialogTitle className="text-center font-['Plus_Jakarta_Sans'] text-xl font-bold text-white">
                            Konfirmasi Perjalanan Selesai
                        </DialogTitle>
                        <DialogDescription className="pt-2 text-center text-sm text-[#79849f]">
                            Apakah Anda yakin perjalanan ini telah selesai dan
                            memuaskan?
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-4 flex flex-col gap-2 rounded-xl border border-white/5 bg-[#0D182E] p-4 text-xs">
                        <div className="flex items-start gap-3">
                            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#C5A059]" />
                            <p className="leading-relaxed text-white">
                                Dengan menekan tombol setuju,{' '}
                                <strong className="text-[#C5A059]">
                                    dana akan diteruskan ke pemandu
                                </strong>{' '}
                                dan transaksi ini dianggap selesai sepenuhnya.
                            </p>
                        </div>
                        <div className="flex items-start gap-3 opacity-80">
                            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#79849f]" />
                            <p className="leading-relaxed text-[#79849f]">
                                Jika ada masalah selama tur, silakan batalkan
                                dan ajukan sengketa.
                            </p>
                        </div>
                    </div>

                    <DialogFooter className="mt-6 flex-col gap-3 sm:flex-row">
                        <Button
                            variant="outline"
                            onClick={() => setShowEscrowModal(false)}
                            className="h-11 w-full border-white/10 font-bold text-white hover:bg-white/10 sm:flex-1"
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleReleaseEscrow}
                            className="h-11 w-full bg-[#C5A059] font-extrabold text-[#0D182E] shadow-lg shadow-[#C5A059]/20 hover:bg-[#fed488] sm:flex-1"
                        >
                            Ya, Selesai & Bayar Pemandu
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Payment Proof Upload Modal */}
            <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
                <DialogContent className="border border-white/10 bg-[#16223B] p-6 shadow-2xl sm:max-w-md">
                    <DialogHeader className="gap-2">
                        <DialogTitle className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-white">
                            Pembayaran Manual
                        </DialogTitle>
                        <DialogDescription className="pt-2 text-sm text-[#79849f]">
                            Silakan transfer sejumlah{' '}
                            <strong className="text-[#C5A059]">
                                {formatRupiah(booking.totalAmount)}
                            </strong>{' '}
                            ke rekening berikut:
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-2 flex flex-col gap-3 rounded-xl border border-white/5 bg-[#0D182E] p-4 text-sm text-white">
                        {(paymentAccounts || []).map((acc, idx) => (
                            <div
                                key={idx}
                                className={`flex items-center justify-between ${idx < (paymentAccounts?.length || 0) - 1 ? 'border-b border-white/10 pb-2' : ''}`}
                            >
                                <span className="text-[#79849f]">
                                    {acc.bank}
                                </span>
                                <strong className="tracking-widest">
                                    {acc.number}
                                </strong>
                            </div>
                        ))}
                        {paymentAccounts && paymentAccounts.length > 0 && (
                            <div className="flex items-center justify-between">
                                <span className="text-[#79849f]">
                                    Atas Nama
                                </span>
                                <strong>{paymentAccounts[0].name}</strong>
                            </div>
                        )}
                    </div>

                    <form
                        onSubmit={handleUploadProof}
                        className="mt-4 flex flex-col gap-4"
                    >
                        <div>
                            <label className="mb-2 block text-sm font-medium text-white">
                                Upload Bukti Transfer
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                required
                                onChange={(e) =>
                                    setPaymentProof(e.target.files?.[0] || null)
                                }
                                className="w-full cursor-pointer rounded-md border border-white/10 p-1 text-sm text-[#79849f] file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-[#C5A059]/10 file:px-4 file:py-2.5 file:text-sm file:font-bold file:text-[#C5A059] file:transition-colors hover:file:bg-[#C5A059]/20"
                            />
                        </div>

                        <DialogFooter className="mt-2 flex-col gap-3 sm:flex-row">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowPaymentModal(false)}
                                className="h-11 w-full border-white/10 font-bold text-white hover:bg-white/10 sm:flex-1"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={!paymentProof || isUploading}
                                className="h-11 w-full bg-[#C5A059] font-extrabold text-[#0D182E] shadow-lg shadow-[#C5A059]/20 hover:bg-[#fed488] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-1"
                            >
                                {isUploading
                                    ? 'Mengunggah...'
                                    : 'Konfirmasi & Upload'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Refund & Complaint Form Modal */}
            <Dialog open={showRefundModal} onOpenChange={setShowRefundModal}>
                <DialogContent className="max-w-lg border border-white/10 bg-[#16223B] p-6 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader className="gap-2">
                        <div className="mx-auto mb-1 flex h-12 w-12 items-center justify-center rounded-full border border-rose-500/20 bg-rose-500/10 text-rose-500">
                            <AlertTriangle className="h-6 w-6" />
                        </div>
                        <DialogTitle className="text-center font-['Plus_Jakarta_Sans'] text-xl font-bold text-white">
                            Pengajuan Refund & Keluhan Layanan
                        </DialogTitle>
                        <DialogDescription className="text-center text-xs text-[#79849f]">
                            Pesanan #{booking.id} • Pemandu: {booking.guideName}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmitRefund} className="mt-4 flex flex-col gap-4">
                        {/* Kategori Alasan */}
                        <div>
                            <label className="mb-1.5 block text-xs font-bold text-white uppercase tracking-wider">
                                Kategori Masalah <span className="text-rose-400">*</span>
                            </label>
                            <select
                                value={refundCategory}
                                onChange={(e) => setRefundCategory(e.target.value)}
                                className="w-full rounded-xl border border-white/10 bg-[#0D182E] p-3 text-xs font-semibold text-white focus:border-[#C5A059] focus:outline-none"
                            >
                                <option value="Pemandu Tidak Kompeten / Tidak Ramah">Pemandu Tidak Kompeten / Tidak Ramah</option>
                                <option value="Layanan & Rute Tidak Sesuai Kesepakatan">Layanan & Rute Tidak Sesuai Kesepakatan</option>
                                <option value="Pemandu Tidak Hadir / Terlambat Parah">Pemandu Tidak Hadir / Terlambat Parah</option>
                                <option value="Masalah Keamanan & Fasilitas Tidak Layak">Masalah Keamanan & Fasilitas Tidak Layak</option>
                                <option value="Lainnya">Alasan Lainnya</option>
                            </select>
                        </div>

                        {/* Detail Masalah */}
                        <div>
                            <label className="mb-1.5 block text-xs font-bold text-white uppercase tracking-wider">
                                Detail Kronologi Masalah <span className="text-rose-400">*</span>
                            </label>
                            <textarea
                                rows={4}
                                required
                                value={refundDetails}
                                onChange={(e) => setRefundDetails(e.target.value)}
                                placeholder="Ceritakan secara spesifik kendala yang Anda alami saat tur berlangsung agar tim verifikasi admin dapat memproses pengembalian dana..."
                                className="w-full rounded-xl border border-white/10 bg-[#0D182E] p-3 text-xs text-white placeholder:text-[#79849f] focus:border-[#C5A059] focus:outline-none"
                            />
                            <p className="mt-1 text-[11px] text-[#79849f]">Minimal 10 karakter.</p>
                        </div>

                        {/* Rekening Tujuan Pengembalian Dana */}
                        <div className="rounded-xl border border-white/5 bg-[#0D182E] p-4">
                            <h5 className="mb-3 text-xs font-bold uppercase tracking-wider text-[#C5A059]">
                                Rekening Tujuan Pengembalian Dana (Refund)
                            </h5>
                            <div className="grid grid-cols-1 gap-3">
                                <div>
                                    <label className="mb-1 block text-[11px] text-[#79849f]">
                                        Nama Bank / E-Wallet
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Contoh: BCA / Mandiri / GoPay"
                                        value={refundBankName}
                                        onChange={(e) => setRefundBankName(e.target.value)}
                                        className="w-full rounded-lg border border-white/10 bg-[#16223B] px-3 py-2 text-xs text-white placeholder:text-white/30 focus:border-[#C5A059] focus:outline-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="mb-1 block text-[11px] text-[#79849f]">
                                            Nomor Rekening / HP
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="1234567890"
                                            value={refundBankAccount}
                                            onChange={(e) => setRefundBankAccount(e.target.value)}
                                            className="w-full rounded-lg border border-white/10 bg-[#16223B] px-3 py-2 text-xs font-mono text-white placeholder:text-white/30 focus:border-[#C5A059] focus:outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-[11px] text-[#79849f]">
                                            Atas Nama (Pemilik)
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Nama sesuai rekening"
                                            value={refundAccountHolder}
                                            onChange={(e) => setRefundAccountHolder(e.target.value)}
                                            className="w-full rounded-lg border border-white/10 bg-[#16223B] px-3 py-2 text-xs text-white placeholder:text-white/30 focus:border-[#C5A059] focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-2 text-[11px] text-[#79849f]">
                            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#C5A059]" />
                            <span>
                                Setelah formulir dikirim, dana transaksi di Escrow akan dibekukan sementara hingga Admin mengambil keputusan.
                            </span>
                        </div>

                        <DialogFooter className="mt-2 flex-col gap-3 sm:flex-row">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowRefundModal(false)}
                                className="h-11 w-full border-white/10 font-bold text-white hover:bg-white/10 sm:flex-1"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmittingRefund}
                                className="h-11 w-full bg-rose-600 font-extrabold text-white shadow-lg shadow-rose-600/20 hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-1"
                            >
                                {isSubmittingRefund ? 'Mengirim...' : 'Kirim Pengajuan Refund'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Review & Rating Modal */}
            <Dialog open={showReviewModal} onOpenChange={setShowReviewModal}>
                <DialogContent className="border border-white/10 bg-[#16223B] p-6 shadow-2xl sm:max-w-lg">
                    <DialogHeader className="gap-1.5 text-left">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#C5A059]/30 bg-[#C5A059]/15 text-[#C5A059]">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <div>
                                <DialogTitle className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-white">
                                    Beri Ulasan & Rating Pemandu
                                </DialogTitle>
                                <DialogDescription className="text-xs text-[#79849f]">
                                    Bagikan pengalaman wisata Anda bersama <strong className="text-white">{booking.guideName}</strong>
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <form onSubmit={handleSubmitReview} className="mt-4 flex flex-col gap-5">
                        {/* Rating Star Selection */}
                        <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-[#0D182E] p-4 text-center">
                            <span className="text-xs font-semibold text-[#79849f] mb-2">
                                Berikan Penilaian Bintang:
                            </span>
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => {
                                    const active = (hoverRating || reviewRating) >= star;
                                    return (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setReviewRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                                        >
                                            <Star
                                                className={`h-8 w-8 transition-colors ${
                                                    active
                                                        ? 'fill-[#C5A059] text-[#C5A059] drop-shadow-[0_0_8px_rgba(197,160,89,0.5)]'
                                                        : 'text-white/20 hover:text-white/40'
                                                }`}
                                            />
                                        </button>
                                    );
                                })}
                            </div>
                            <span className="mt-2 text-xs font-bold text-[#C5A059]">
                                {(hoverRating || reviewRating) === 5 && '⭐⭐⭐⭐⭐ Luar Biasa & Sangat Direkomendasikan!'}
                                {(hoverRating || reviewRating) === 4 && '⭐⭐⭐⭐ Sangat Bagus & Memuaskan'}
                                {(hoverRating || reviewRating) === 3 && '⭐⭐⭐ Cukup Baik'}
                                {(hoverRating || reviewRating) === 2 && '⭐⭐ Kurang Memuaskan'}
                                {(hoverRating || reviewRating) === 1 && '⭐ Sangat Kecewa'}
                            </span>
                        </div>

                        {/* Comment Textarea */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-white">
                                Tulis Ulasan & Komentar <span className="text-rose-400">*</span>
                            </label>
                            <textarea
                                required
                                rows={4}
                                placeholder="Ceritakan bagaimana keramahan, ketepatan waktu, dan wawasan pemandu selama menemani perjalanan Anda..."
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                                className="w-full resize-y rounded-xl border border-white/10 bg-[#0D182E] p-3 text-xs text-white placeholder:text-white/30 focus:border-[#C5A059] focus:outline-none"
                            />
                            <p className="mt-1 text-[11px] text-[#79849f]">
                                Ulasan Anda akan ditampilkan secara publik di profil pemandu untuk membantu wisatawan lainnya.
                            </p>
                        </div>

                        <DialogFooter className="mt-2 flex-col gap-3 sm:flex-row">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowReviewModal(false)}
                                className="h-11 w-full border-white/10 font-bold text-white hover:bg-white/10 sm:flex-1 cursor-pointer"
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmittingReview || !reviewComment.trim()}
                                className="h-11 w-full bg-[#C5A059] font-extrabold text-[#0D182E] shadow-lg shadow-[#C5A059]/20 hover:bg-[#fed488] disabled:cursor-not-allowed disabled:opacity-50 sm:flex-1 cursor-pointer"
                            >
                                {isSubmittingReview ? (
                                    'Menyimpan Ulasan...'
                                ) : (
                                    <>
                                        <Send className="mr-1.5 h-4 w-4" /> Kirim Ulasan
                                    </>
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}
