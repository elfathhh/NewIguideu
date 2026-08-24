import { useBookingStore } from '@/store/booking-store';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Bell, Clock, ShoppingBag } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { useEffect, useState } from 'react';

export function UrgentBookingPopover() {
    const { urgentBookings } = useBookingStore();
    const [currentTime, setCurrentTime] = useState(Date.now());

    const bookings = urgentBookings();

    // Update time for countdowns every second
    useEffect(() => {
        if (bookings.length > 0) {
            const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
            return () => clearInterval(timer);
        }
    }, [bookings.length]);

    const getCountdown = (targetTime: string) => {
        const difference = new Date(targetTime).getTime() - currentTime;
        if (difference <= 0) return '00:00';
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference / (1000 * 60)) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="group relative h-9 w-9 cursor-pointer rounded-full hover:bg-white/10"
                >
                    <ShoppingBag className="!size-5 text-white opacity-80 group-hover:opacity-100" />
                    {bookings.length > 0 && (
                        <span className="absolute top-1.5 right-1.5 h-2 w-2 animate-pulse rounded-full border border-[#0D182E] bg-rose-500"></span>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                className="w-80 overflow-hidden rounded-xl border-white/10 bg-[#0D182E] p-0 text-white shadow-2xl"
            >
                <div className="flex items-center justify-between border-b border-white/5 bg-[#16223B]/80 p-4 backdrop-blur-md">
                    <h4 className="font-['Plus_Jakarta_Sans'] text-sm font-bold">
                        Pesanan Mendesak
                    </h4>
                    <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-lg">
                        {bookings.length}
                    </span>
                </div>

                <div className="max-h-[300px] overflow-y-auto">
                    {bookings.length === 0 ? (
                        <div className="flex flex-col items-center bg-[#0D182E] p-8 text-center text-[#79849f]">
                            <ShoppingBag className="mb-3 h-10 w-10 opacity-20" />
                            <p className="text-sm">
                                Tidak ada pesanan yang butuh tindakan.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {bookings.slice(0, 3).map((booking) => (
                                <div
                                    key={booking.id}
                                    className="group flex cursor-pointer gap-3 border-b border-white/5 p-4 transition-colors hover:bg-white/5"
                                >
                                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-white/10 transition-colors group-hover:border-[#C5A059]/40">
                                        <img
                                            src={booking.guideImage}
                                            alt={booking.guideName}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex min-w-0 flex-1 flex-col justify-center">
                                        <h5 className="truncate text-sm font-bold transition-colors group-hover:text-[#C5A059]">
                                            {booking.guideName}
                                        </h5>

                                        {booking.status === 'pending_guide' ? (
                                            <div className="mt-1 flex flex-col">
                                                <span className="text-[10px] font-medium text-[#79849f]">
                                                    Menunggu Konfirmasi
                                                </span>
                                                <span className="mt-0.5 flex items-center gap-1.5 font-mono text-xs font-bold text-amber-400">
                                                    <Clock className="h-3 w-3" />
                                                    {getCountdown(
                                                        booking.requestExpiresAt!,
                                                    )}
                                                </span>
                                            </div>
                                        ) : booking.status === 'pending_payment' ? (
                                            <div className="mt-1 flex flex-col">
                                                <span className="text-[10px] font-medium text-[#79849f]">
                                                    Batas Pembayaran
                                                </span>
                                                <span className="mt-0.5 flex items-center gap-1.5 font-mono text-xs font-bold text-rose-400">
                                                    <Clock className="h-3 w-3" />
                                                    {getCountdown(
                                                        booking.paymentExpiresAt!,
                                                    )}
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="mt-1 flex flex-col">
                                                <span className="text-[10px] font-medium text-[#79849f]">
                                                    Batas Konfirmasi Selesai
                                                </span>
                                                <span className="mt-0.5 flex items-center gap-1.5 font-mono text-xs font-bold text-blue-400">
                                                    <Clock className="h-3 w-3" />
                                                    {getCountdown(
                                                        booking.confirmationExpiresAt ||
                                                            new Date(
                                                                new Date(
                                                                    booking.guideEndedAt!,
                                                                ).getTime() +
                                                                    24 *
                                                                        60 *
                                                                        60 *
                                                                        1000,
                                                            ).toISOString(),
                                                    )}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="border-t border-white/5 bg-[#16223B]/40 p-3">
                    <Link href={dashboard()}>
                        <Button className="w-full bg-[#C5A059]/10 text-xs font-bold text-[#C5A059] transition-all hover:bg-[#C5A059] hover:text-[#0D182E]">
                            Lihat Semua Pesanan
                        </Button>
                    </Link>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
