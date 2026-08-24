import { Booking } from '@/types/booking';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet';
import {
    MapPin,
    Calendar,
    Clock,
    Users,
    QrCode,
    MessageSquare,
    Phone,
    Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    booking: Booking | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function VoucherSheet({ booking, open, onOpenChange }: Props) {
    if (!booking) return null;

    // Format currency
    const formatRupiah = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val);
    };

    const formatDate = (isoString: string) => {
        return new Date(isoString).toLocaleDateString('id-ID', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-full overflow-y-auto border-l border-white/10 bg-[#0D182E] p-0 text-white sm:max-w-md">
                <div className="sticky top-0 z-10 border-b border-white/5 bg-[#0D182E]/90 p-6 backdrop-blur-md">
                    <SheetHeader className="text-left">
                        <SheetTitle className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-white">
                            Detail Pesanan
                        </SheetTitle>
                        <SheetDescription className="text-[#79849f]">
                            ID:{' '}
                            <span className="ml-1 rounded bg-white/5 px-2 py-0.5 font-mono text-white">
                                {booking.id}
                            </span>
                        </SheetDescription>
                    </SheetHeader>
                </div>

                <div className="space-y-6 p-6">
                    {/* E-Ticket / QR Section for paid & ongoing */}
                    {(booking.status === 'ongoing' ||
                        booking.status === 'completed') && (
                        <div className="relative flex flex-col items-center justify-center space-y-4 overflow-hidden rounded-2xl border border-white/10 bg-[#16223B] p-6 text-center shadow-lg">
                            <div className="absolute top-0 left-0 h-1.5 w-full bg-[#C5A059]"></div>
                            <div className="flex h-40 w-40 items-center justify-center rounded-xl border-4 border-[#C5A059]/20 bg-white shadow-inner">
                                <QrCode
                                    className="h-32 w-32 text-black"
                                    strokeWidth={1}
                                />
                            </div>
                            <div>
                                <p className="font-mono text-xl font-bold tracking-widest text-white">
                                    {booking.id}
                                </p>
                                <p className="mx-auto mt-2 max-w-[250px] text-xs leading-relaxed text-[#79849f]">
                                    Tunjukkan QR code ini kepada pemandu wisata
                                    saat tiba di titik pertemuan.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Guide Info */}
                    <div className="flex items-center gap-4 rounded-2xl border border-white/5 bg-gradient-to-r from-[#16223B] to-[#16223B]/50 p-5">
                        <div className="h-14 w-14 overflow-hidden rounded-full border-2 border-[#C5A059] shadow-lg">
                            <img
                                src={booking.guideImage}
                                alt={booking.guideName}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-base font-bold text-white">
                                {booking.guideName}
                            </h4>
                            <p className="mt-0.5 text-xs text-[#79849f]">
                                Pemandu Wisata
                            </p>
                        </div>
                        {(booking.status === 'ongoing' ||
                            booking.status === 'pending_payment') && (
                            <div className="flex gap-2">
                                <Button
                                    size="icon"
                                    variant="outline"
                                    className="h-10 w-10 rounded-full border-white/20 bg-[#0D182E] text-white hover:bg-white/10"
                                >
                                    <Phone className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    className="h-10 w-10 rounded-full bg-[#C5A059] text-[#0D182E] shadow-lg shadow-[#C5A059]/20 hover:bg-[#fed488]"
                                >
                                    <MessageSquare className="h-4 w-4 fill-current" />
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Itinerary Details */}
                    <div>
                        <h3 className="mb-3 px-1 text-xs font-bold tracking-widest text-white uppercase">
                            Rincian Perjalanan
                        </h3>
                        <div className="space-y-4 rounded-2xl border border-white/5 bg-[#16223B]/40 p-5">
                            <div className="flex gap-4">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C5A059]/10">
                                    <MapPin className="h-4 w-4 text-[#C5A059]" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-[#79849f]">
                                        Destinasi / Titik Kumpul
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-white">
                                        {booking.destination}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C5A059]/10">
                                    <Calendar className="h-4 w-4 text-[#C5A059]" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-[#79849f]">
                                        Tanggal Perjalanan
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-white">
                                        {formatDate(booking.bookingDate)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C5A059]/10">
                                    <Clock className="h-4 w-4 text-[#C5A059]" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-[#79849f]">
                                        Waktu Mulai
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-white">
                                        {booking.startTime} WITA
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#C5A059]/10">
                                    <Users className="h-4 w-4 text-[#C5A059]" />
                                </div>
                                <div>
                                    <p className="text-xs font-medium text-[#79849f]">
                                        Paket & Peserta
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-white">
                                        {booking.packageVariant}
                                    </p>
                                    <p className="mt-0.5 text-xs text-white/60">
                                        {booking.paxCount} Orang Peserta
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div>
                        <h3 className="mb-3 px-1 text-xs font-bold tracking-widest text-white uppercase">
                            Rincian Pembayaran
                        </h3>
                        <div className="space-y-4 rounded-2xl border border-white/5 bg-[#16223B]/40 p-5">
                            {booking.paymentMethod && (
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-[#79849f]">
                                        Metode Pembayaran
                                    </span>
                                    <span className="rounded bg-white/5 px-2 py-1 font-semibold text-white">
                                        {booking.paymentMethod}
                                    </span>
                                </div>
                            )}
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[#79849f]">
                                    Harga Paket ({booking.paxCount}x)
                                </span>
                                <span className="font-medium text-white">
                                    {formatRupiah(booking.totalAmount - 50000)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-[#79849f]">
                                    Biaya Layanan
                                </span>
                                <span className="font-medium text-white">
                                    {formatRupiah(50000)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between border-t border-white/10 pt-4 text-base font-bold">
                                <span className="text-white">
                                    Total Keseluruhan
                                </span>
                                <span className="text-xl text-[#C5A059]">
                                    {formatRupiah(booking.totalAmount)}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Meeting Point Info / Escrow Info */}
                    {booking.status === 'ongoing' && (
                        <div className="flex flex-col gap-2 rounded-xl border border-[#C5A059]/20 bg-[#C5A059]/10 p-4 shadow-inner">
                            <div className="flex gap-3">
                                <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#C5A059]" />
                                <p className="text-xs leading-relaxed text-[#C5A059] opacity-90">
                                    {booking.guideEndedAt ? (
                                        <strong>
                                            Pemandu telah menandai tur ini selesai. Anda memiliki waktu 1x24 jam untuk menekan tombol "Konfirmasi Perjalanan Selesai" pada kartu pesanan Anda untuk melepaskan dana aman di Escrow ke pemandu.
                                        </strong>
                                    ) : (
                                        'Pastikan Anda berada di titik kumpul tepat waktu. Dana Anda tersimpan aman di Escrow. Tombol konfirmasi penyelesaian akan muncul setelah pemandu mengakhiri perjalanan wisata.'
                                    )}
                                </p>
                            </div>
                        </div>
                    )}

                    {booking.status === 'completed' && (
                        <div className="flex gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-4 shadow-inner">
                            <Info className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                            <p className="text-xs leading-relaxed text-emerald-300">
                                Perjalanan ini telah selesai sepenuhnya dan dana escrow telah berhasil diteruskan ke pemandu mitra. Terima kasih telah berwisata bersama IguideU!
                            </p>
                        </div>
                    )}

                    {/* Extra padding at bottom for scrolling */}
                    <div className="h-6"></div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
