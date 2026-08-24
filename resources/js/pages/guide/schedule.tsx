import { Head, Link, router, usePage } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

export default function GuideSchedule() {
    const { auth, bookings } = usePage<{
        auth: any;
        bookings: any[];
    }>().props;

    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedTrip, setSelectedTrip] = useState<any | null>(null);
    const [isSubmittingEndTrip, setIsSubmittingEndTrip] = useState<boolean>(false);

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

    // Basic native date math for calendar
    const getDaysInMonth = (year: number, month: number) =>
        new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) =>
        new Date(year, month, 1).getDay();

    const daysInMonth = getDaysInMonth(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
    );
    const firstDay = getFirstDayOfMonth(
        currentMonth.getFullYear(),
        currentMonth.getMonth(),
    );

    const prevMonth = () =>
        setCurrentMonth(
            new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() - 1,
                1,
            ),
        );
    const nextMonth = () =>
        setCurrentMonth(
            new Date(
                currentMonth.getFullYear(),
                currentMonth.getMonth() + 1,
                1,
            ),
        );

    const monthNames = [
        'Januari',
        'Februari',
        'Maret',
        'April',
        'Mei',
        'Juni',
        'Juli',
        'Agustus',
        'September',
        'Oktober',
        'November',
        'Desember',
    ];
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    // Map bookings to dates
    const bookingMap: Record<string, any[]> = {};
    bookings.forEach((b) => {
        const dateStr = new Date(b.booking_date).toISOString().split('T')[0];
        if (!bookingMap[dateStr]) bookingMap[dateStr] = [];
        bookingMap[dateStr].push(b);
    });

    const isToday = (d: number) => {
        const today = new Date();
        return (
            currentMonth.getFullYear() === today.getFullYear() &&
            currentMonth.getMonth() === today.getMonth() &&
            d === today.getDate()
        );
    };

    return (
        <>
            <Head title="Jadwal Tur - IguideU" />

            <div className="flex min-h-screen bg-[#0d182e] font-['Inter',sans-serif] text-[#e2e2e2] selection:bg-[#e9c176] selection:text-[#0d182e]">
                {/* Sidebar Navigation */}
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
                            className="flex items-center gap-3 rounded-r-lg px-4 py-3 text-sm font-semibold text-[#77819c] transition-all hover:bg-white/5 hover:text-[#e9c176]"
                        >
                            <span className="material-symbols-outlined text-xl">
                                dashboard
                            </span>
                            <span>Dashboard</span>
                        </Link>
                        <Link
                            href="/guide/schedule"
                            className="nav-item-active flex items-center gap-3 rounded-r-lg px-4 py-3 text-sm font-semibold transition-all"
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

                    {/* Profile Card */}
                    <div className="mt-auto border-t border-white/10 p-5">
                        <div className="mb-3 flex items-center gap-3">
                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[#e9c176]/40">
                                <img
                                    className="h-full w-full object-cover"
                                    src={
                                        auth?.user?.avatar ||
                                        'https://ui-avatars.com/api/?name=' +
                                            auth?.user?.name +
                                            '&background=e9c176&color=0d182e'
                                    }
                                    alt="Profile Avatar"
                                />
                            </div>
                            <div className="overflow-hidden">
                                <p className="truncate text-sm font-bold text-white">
                                    {auth?.user?.name}
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
                    {/* Mobile Top App Bar */}
                    <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-white/10 bg-[#0d182e]/90 px-6 py-4 backdrop-blur-md md:hidden">
                        <Link
                            href="/"
                            className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-bold text-[#e9c176]"
                        >
                            IguideU
                        </Link>
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 overflow-hidden rounded-full border border-[#e9c176]/30">
                                <img
                                    className="h-full w-full object-cover"
                                    src={
                                        auth?.user?.avatar ||
                                        'https://ui-avatars.com/api/?name=' +
                                            auth?.user?.name
                                    }
                                    alt="Guide Profile"
                                />
                            </div>
                        </div>
                    </header>

                    <div className="mx-auto w-full max-w-[1440px] flex-1 px-6 py-8 md:px-12 md:py-10">
                        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                            <div>
                                <h2 className="mb-2 font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-bold text-white">
                                    Jadwal Tur
                                </h2>
                                <p className="text-sm text-[#77819c]">
                                    Atur jadwal panduan Anda dan lihat pesanan
                                    yang akan datang.
                                </p>
                            </div>
                            <div className="flex rounded-xl border border-white/10 bg-[#16223B]/60 p-1">
                                <button className="rounded-lg bg-[#e9c176] px-4 py-2 text-xs font-bold text-[#0d182e] shadow-sm">
                                    Kalender
                                </button>
                                <button className="rounded-lg px-4 py-2 text-xs font-bold text-[#77819c] transition-colors hover:text-white">
                                    Daftar (List)
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 gap-8 xl:grid-cols-3">
                            {/* Calendar Section */}
                            <div className="xl:col-span-2">
                                <div className="glass-panel ambient-shadow overflow-hidden rounded-2xl">
                                    {/* Calendar Header */}
                                    <div className="flex items-center justify-between border-b border-white/10 bg-[#16223B]/40 p-6">
                                        <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-bold text-white">
                                            {
                                                monthNames[
                                                    currentMonth.getMonth()
                                                ]
                                            }{' '}
                                            {currentMonth.getFullYear()}
                                        </h3>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={prevMonth}
                                                className="rounded-lg border border-white/10 p-2 text-white transition-colors hover:bg-white/10"
                                            >
                                                <span className="material-symbols-outlined text-sm">
                                                    chevron_left
                                                </span>
                                            </button>
                                            <button
                                                onClick={nextMonth}
                                                className="rounded-lg border border-white/10 p-2 text-white transition-colors hover:bg-white/10"
                                            >
                                                <span className="material-symbols-outlined text-sm">
                                                    chevron_right
                                                </span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Calendar Grid */}
                                    <div className="p-6">
                                        <div className="mb-4 grid grid-cols-7 gap-4">
                                            {dayNames.map((day) => (
                                                <div
                                                    key={day}
                                                    className="text-center text-xs font-bold tracking-wider text-[#77819c] uppercase"
                                                >
                                                    {day}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-7 gap-2 md:gap-4">
                                            {Array.from({
                                                length: firstDay,
                                            }).map((_, i) => (
                                                <div
                                                    key={`empty-${i}`}
                                                    className="aspect-square opacity-20"
                                                ></div>
                                            ))}
                                            {Array.from({
                                                length: daysInMonth,
                                            }).map((_, i) => {
                                                const d = i + 1;
                                                const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
                                                const dayBookings =
                                                    bookingMap[dateStr] || [];
                                                const isTodayDate = isToday(d);

                                                return (
                                                    <div
                                                        key={d}
                                                        className={`flex aspect-square cursor-pointer flex-col rounded-xl border p-2 transition-all hover:border-[#e9c176]/50 ${isTodayDate ? 'border-[#e9c176] bg-[#e9c176]/10' : 'border-white/5 bg-[#16223B]/30'}`}
                                                    >
                                                        <div
                                                            className={`mb-1 text-right text-xs font-bold ${isTodayDate ? 'text-[#e9c176]' : 'text-[#77819c]'}`}
                                                        >
                                                            {d}
                                                        </div>
                                                        {dayBookings.length >
                                                            0 && (
                                                            <div className="mt-auto space-y-1">
                                                                {dayBookings
                                                                    .slice(0, 2)
                                                                    .map(
                                                                        (
                                                                            b,
                                                                            idx,
                                                                        ) => (
                                                                            <div
                                                                                key={
                                                                                    idx
                                                                                }
                                                                                className="truncate rounded border border-emerald-500/20 bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400 md:text-[10px]"
                                                                            >
                                                                                {
                                                                                    b.start_time
                                                                                }{' '}
                                                                                -{' '}
                                                                                {
                                                                                    b
                                                                                        .traveler
                                                                                        ?.name
                                                                                }
                                                                            </div>
                                                                        ),
                                                                    )}
                                                                {dayBookings.length >
                                                                    2 && (
                                                                    <div className="pl-1 text-[9px] font-semibold text-[#77819c]">
                                                                        +
                                                                        {dayBookings.length -
                                                                            2}{' '}
                                                                        lagi
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Upcoming Tours Sidebar */}
                            <div className="space-y-6 xl:col-span-1">
                                <div className="glass-panel flex h-full flex-col rounded-2xl p-6">
                                    <h3 className="mb-6 flex items-center gap-2 font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold text-white">
                                        <span className="material-symbols-outlined text-[#e9c176]">
                                            event_upcoming
                                        </span>
                                        Tur Mendatang
                                    </h3>

                                    <div className="no-scrollbar flex-1 space-y-4 overflow-y-auto pr-2">
                                        {bookings
                                            .filter(
                                                (b) =>
                                                    new Date(b.booking_date) >=
                                                    new Date(
                                                        new Date().setHours(
                                                            0,
                                                            0,
                                                            0,
                                                            0,
                                                        ),
                                                    ),
                                            )
                                            .slice(0, 5)
                                            .map((booking: any) => (
                                                <div
                                                    key={booking.id}
                                                    onClick={() => setSelectedTrip(booking)}
                                                    className="group rounded-xl border border-white/10 bg-[#16223B]/40 p-4 transition-colors hover:border-[#e9c176]/40 cursor-pointer"
                                                >
                                                    <div className="mb-3 flex items-start justify-between">
                                                        <div className="flex gap-3">
                                                            <div className="flex min-w-[50px] flex-col items-center justify-center rounded-lg bg-[#e9c176]/10 p-2.5 text-[#e9c176]">
                                                                <span className="text-[10px] font-bold uppercase">
                                                                    {new Date(
                                                                        booking.booking_date,
                                                                    ).toLocaleDateString(
                                                                        'id-ID',
                                                                        {
                                                                            month: 'short',
                                                                        },
                                                                    )}
                                                                </span>
                                                                <span className="text-lg leading-none font-black">
                                                                    {new Date(
                                                                        booking.booking_date,
                                                                    ).getDate()}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-bold text-white group-hover:text-[#e9c176] transition-colors">
                                                                    {
                                                                        booking
                                                                            .traveler
                                                                            ?.name
                                                                    }
                                                                </p>
                                                                <p className="text-[11px] text-[#77819c]">
                                                                    {booking
                                                                        .package
                                                                        ?.max_persons ||
                                                                        1}{' '}
                                                                    Pax •{' '}
                                                                    {
                                                                        booking.start_time
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="border-t border-white/5 pt-3 flex items-center justify-between">
                                                        <p className="flex items-center gap-1.5 truncate text-xs text-[#c6c6ce]">
                                                            <span className="material-symbols-outlined text-[14px] text-[#e9c176]">
                                                                map
                                                            </span>
                                                            {
                                                                booking.package
                                                                    ?.title
                                                            }
                                                        </p>
                                                        <span className="text-[10px] font-bold text-[#e9c176] group-hover:underline">
                                                            Detail
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}

                                        {bookings.filter(
                                            (b) =>
                                                new Date(b.booking_date) >=
                                                new Date(),
                                        ).length === 0 && (
                                            <div className="flex flex-col items-center py-10 text-center opacity-50">
                                                <span className="material-symbols-outlined mb-2 text-4xl text-[#77819c]">
                                                    event_busy
                                                </span>
                                                <p className="text-sm text-[#77819c]">
                                                    Belum ada jadwal tur ke
                                                    depannya.
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <button className="mt-6 w-full rounded-xl border border-[#e9c176]/30 py-2.5 text-xs font-bold text-[#e9c176] transition-colors hover:bg-[#e9c176] hover:text-[#0d182e]">
                                        Lihat Semua Jadwal
                                    </button>
                                </div>
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
