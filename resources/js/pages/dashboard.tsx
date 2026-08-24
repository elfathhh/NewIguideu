import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

import { BookingCard } from '@/components/traveler-dashboard/booking-card';
import { VoucherSheet } from '@/components/traveler-dashboard/voucher-sheet';
import { Booking, ServerBooking, PaymentAccount } from '@/types/booking';
import {
    Map,
    Ticket,
    Clock,
    CheckCircle2,
    Compass,
    ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { GuidesHeader } from '@/components/search/guides-header';
import { LanguageProvider } from '@/contexts/language-context';

// Convert ServerBooking to the shape BookingCard expects
function serverToDisplayBooking(sb: ServerBooking): Booking {
    // Map backend status to frontend status
    let frontendStatus: Booking['status'];
    const paymentStatus = sb.payment?.payment_status || 'unpaid';

    if (sb.status === 'cancelled') {
        frontendStatus = 'cancelled';
    } else if (sb.status === 'completed') {
        frontendStatus = 'completed';
    } else if (sb.status === 'disputed') {
        frontendStatus = 'disputed';
    } else if (sb.status === 'pending') {
        frontendStatus = 'pending_guide';
    } else if (sb.status === 'accepted') {
        frontendStatus = 'pending_payment';
    } else if (sb.status === 'confirmed') {
        if (paymentStatus === 'unpaid' || paymentStatus === 'rejected') {
            frontendStatus = 'pending_payment';
        } else if (paymentStatus === 'pending') {
            frontendStatus = 'pending_payment'; // Waiting for admin verification
        } else {
            frontendStatus = 'ongoing';
        }
    } else {
        frontendStatus = 'pending_payment';
    }

    // 15 minute countdown for guide approval
    const requestExpiresAt = new Date(
        new Date(sb.created_at).getTime() + 15 * 60000,
    ).toISOString();
    // 10 minute countdown for payment (starts from when guide approved, which updates the booking, so we use updated_at)
    const paymentExpiresAt = new Date(
        new Date(sb.updated_at).getTime() + 10 * 60000,
    ).toISOString();
    // 24 hour (1 day) countdown for traveler confirmation after guide ended trip
    const confirmationExpiresAt = sb.guide_ended_at
        ? new Date(
              new Date(sb.guide_ended_at).getTime() + 24 * 60 * 60 * 1000,
          ).toISOString()
        : undefined;

    return {
        id: sb.booking_code,
        guideId: sb.guide_id,
        guideName: sb.guide?.name || 'Pemandu',
        guideImage:
            sb.guide?.guide_profile?.photo ||
            sb.guide?.avatar ||
            '/images/default-avatar.png',
        destination: sb.notes?.split(' - ')[0] || 'Lombok',
        packageVariant:
            sb.package?.name || sb.notes?.split(' - ')[1] || 'Custom Tour',
        paxCount: 1,
        bookingDate: sb.booking_date,
        startTime: sb.start_time,
        totalAmount: parseFloat(sb.total_amount),
        status: frontendStatus,
        requestExpiresAt,
        paymentExpiresAt,
        confirmationExpiresAt,
        isReviewed: Boolean(sb.review),
        review: sb.review || null,
        guideEndedAt: sb.guide_ended_at || null,
        complaint: sb.complaint || null,
        // Attach server data for real API calls
        _serverId: sb.id,
        _paymentId: sb.payment?.id || null,
        _paymentStatus: sb.payment?.payment_status || 'unpaid',
        _paymentProof: sb.payment?.payment_proof || null,
    } as Booking & {
        _serverId?: number;
        _paymentId?: number | null;
        _paymentStatus?: string;
        _paymentProof?: string | null;
    };
}

export function DashboardContent() {
    const { props } = usePage<{
        serverBookings?: ServerBooking[];
        paymentAccounts?: PaymentAccount[];
    }>();
    const [activeTab, setActiveTab] = useState<
        'pending' | 'ongoing' | 'history'
    >('pending');
    const [selectedBooking, setSelectedBooking] = useState<Booking | null>(
        null,
    );

    const paymentAccounts = props.paymentAccounts || [
        { bank: 'Bank BCA', number: '1234 5678 90', name: 'PT New Iguideu' },
        {
            bank: 'GoPay / OVO',
            number: '0812 3456 7890',
            name: 'PT New Iguideu',
        },
    ];

    const allBookings: Booking[] = props.serverBookings
        ? props.serverBookings.map(serverToDisplayBooking)
        : [];

    const getByTab = (tab: 'pending' | 'ongoing' | 'history') => {
        if (tab === 'pending') {
            return allBookings.filter(
                (b) =>
                    b.status === 'pending_guide' ||
                    b.status === 'pending_payment',
            );
        }
        if (tab === 'ongoing') {
            return allBookings.filter(
                (b) => b.status === 'ongoing' || b.status === 'disputed',
            );
        }
        return allBookings.filter(
            (b) => b.status === 'completed' || b.status === 'cancelled',
        );
    };

    const bookings = getByTab(activeTab);
    const pendingCount = getByTab('pending').length;
    const ongoingCount = getByTab('ongoing').length;
    const historyCount = getByTab('history').length;

    return (
        <div className="min-h-screen bg-[#0D182E] pt-16 font-['Inter',sans-serif] text-white">
            <Head title="Pesanan Saya" />
            <GuidesHeader
                breadcrumbs={[{ label: 'Pesanan Saya', href: '/pesanan' }]}
            />

            <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 p-4 md:p-6 lg:p-8">
                {/* Header Section */}
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                            Pesanan Saya
                        </h1>
                        <p className="mt-1 text-xs text-[#79849f]">
                            Kelola jadwal perjalanan, verifikasi layanan, dan tiket e-voucher Anda.
                        </p>
                    </div>
                </div>

                {/* Metrics Overview Cards */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div
                        onClick={() => setActiveTab('pending')}
                        className={cn(
                            'group relative flex cursor-pointer items-center gap-3.5 overflow-hidden rounded-2xl border p-4 transition-all duration-200',
                            activeTab === 'pending'
                                ? 'border-[#C5A059]/60 bg-[#C5A059]/10 shadow-[0_0_20px_rgba(197,160,89,0.12)]'
                                : 'border-white/5 bg-[#16223B]/60 hover:border-[#C5A059]/30 hover:bg-[#16223B]/80',
                        )}
                    >
                        <div
                            className={cn(
                                'rounded-xl p-2.5 transition-colors',
                                activeTab === 'pending'
                                    ? 'bg-[#C5A059] text-[#0D182E]'
                                    : 'bg-white/5 text-[#79849f] group-hover:text-white',
                            )}
                        >
                            <Clock className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold tracking-wider text-[#79849f] uppercase">
                                Butuh Tindakan
                            </p>
                            <span className="font-['Plus_Jakarta_Sans'] text-xl leading-tight font-extrabold text-white">
                                {pendingCount} Pesanan
                            </span>
                        </div>
                    </div>

                    <div
                        onClick={() => setActiveTab('ongoing')}
                        className={cn(
                            'group relative flex cursor-pointer items-center gap-3.5 overflow-hidden rounded-2xl border p-4 transition-all duration-200',
                            activeTab === 'ongoing'
                                ? 'border-emerald-500/60 bg-emerald-500/10 shadow-[0_0_20px_rgba(16,185,129,0.12)]'
                                : 'border-white/5 bg-[#16223B]/60 hover:border-emerald-500/30 hover:bg-[#16223B]/80',
                        )}
                    >
                        <div
                            className={cn(
                                'rounded-xl p-2.5 transition-colors',
                                activeTab === 'ongoing'
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-white/5 text-[#79849f] group-hover:text-white',
                            )}
                        >
                            <Ticket className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold tracking-wider text-[#79849f] uppercase">
                                Perjalanan Aktif
                            </p>
                            <span className="font-['Plus_Jakarta_Sans'] text-xl leading-tight font-extrabold text-white">
                                {ongoingCount} Jadwal
                            </span>
                        </div>
                    </div>

                    <div
                        onClick={() => setActiveTab('history')}
                        className={cn(
                            'group relative flex cursor-pointer items-center gap-3.5 overflow-hidden rounded-2xl border p-4 transition-all duration-200',
                            activeTab === 'history'
                                ? 'border-white/30 bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.06)]'
                                : 'border-white/5 bg-[#16223B]/60 hover:border-white/20 hover:bg-[#16223B]/80',
                        )}
                    >
                        <div
                            className={cn(
                                'rounded-xl p-2.5 transition-colors',
                                activeTab === 'history'
                                    ? 'bg-white text-[#0D182E]'
                                    : 'bg-white/5 text-[#79849f] group-hover:text-white',
                            )}
                        >
                            <CheckCircle2 className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold tracking-wider text-[#79849f] uppercase">
                                Riwayat Selesai
                            </p>
                            <span className="font-['Plus_Jakarta_Sans'] text-xl leading-tight font-extrabold text-white">
                                {historyCount} Selesai
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex min-h-[600px] w-full flex-1 flex-col gap-6">
                    <div className="w-full">
                        {bookings.length === 0 ? (
                            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-[#16223B]/30 p-8 text-center backdrop-blur-sm sm:p-12">
                                <div className="mb-6 flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-white/5 bg-white/5">
                                    <Compass className="h-10 w-10 text-[#79849f] opacity-50" />
                                </div>
                                <h3 className="mb-2 font-['Plus_Jakarta_Sans'] text-xl font-bold text-white">
                                    Belum Ada Pesanan
                                </h3>
                                <div className="flex h-12 items-center justify-center">
                                    <p className="max-w-sm text-center text-sm leading-relaxed text-[#79849f]">
                                        {activeTab === 'pending' &&
                                            'Anda tidak memiliki pesanan yang membutuhkan pembayaran atau konfirmasi.'}
                                        {activeTab === 'ongoing' &&
                                            'Belum ada jadwal perjalanan aktif. Rencanakan liburan Anda selanjutnya!'}
                                        {activeTab === 'history' &&
                                            'Anda belum menyelesaikan perjalanan apa pun bersama pemandu kami.'}
                                    </p>
                                </div>
                                <div className="mt-8">
                                    <Link
                                        href="/guides"
                                        className="flex items-center gap-2 rounded-xl bg-[#C5A059] px-6 py-3 text-sm font-bold text-[#0D182E] shadow-lg shadow-[#C5A059]/20 transition-all hover:scale-105 hover:bg-[#fed488] active:scale-95"
                                    >
                                        Cari Pemandu Wisata{' '}
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-5">
                                {bookings.map((booking) => (
                                    <BookingCard
                                        key={booking.id}
                                        booking={booking}
                                        paymentAccounts={paymentAccounts}
                                        onViewVoucher={(b) =>
                                            setSelectedBooking(b)
                                        }
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <VoucherSheet
                booking={selectedBooking}
                open={!!selectedBooking}
                onOpenChange={(open) => !open && setSelectedBooking(null)}
            />
        </div>
    );
}

export default function Dashboard() {
    return (
        <LanguageProvider>
            <DashboardContent />
        </LanguageProvider>
    );
}
