// ──────────────────────────────────────────────────────────────
// IguideU — Guide Detail Page (Shopee-Style UX Redesign)
// ──────────────────────────────────────────────────────────────

import { Head, Link, usePage, router } from '@inertiajs/react';
import { useState, useMemo, useEffect } from 'react';
import { MockGuide } from '@/types/guide';
import { GuideSearchCard } from '@/components/search/guide-search-card';
import { LanguageProvider } from '@/contexts/language-context';
import { useTranslation } from '@/hooks/use-translations';
import { GuidesHeader } from '@/components/search/guides-header';
import {
    Star,
    MapPin,
    ShieldCheck,
    CheckCircle2,
    Clock,
    Calendar,
    Users,
    MessageSquare,
    Share2,
    Heart,
    Car,
    Zap,
    Footprints,
    Award,
    Sparkles,
    ChevronRight,
    Check,
    AlertCircle,
    ShoppingBag,
    Send,
    ThumbsUp,
    Camera,
    Utensils,
    Luggage,
    HelpCircle,
} from 'lucide-react';

function GuideShowContent() {
    const { t } = useTranslation();
    const { url, props } = usePage<{
        serverGuide?: any;
        relatedGuides?: MockGuide[];
        serverReviews?: any[];
        auth?: any;
    }>();
    const userRole = props.auth?.user?.role;

    if (!props.serverGuide) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-[#0D182E] px-6 pt-20 text-center text-white font-['Inter',sans-serif]">
                <Head title="Pemandu Tidak Ditemukan - IguideU" />
                <GuidesHeader />
                <div className="flex max-w-md flex-col items-center gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 text-[#e9c176]">
                        <HelpCircle className="h-8 w-8" />
                    </div>
                    <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-white">
                        Profil Pemandu Tidak Ditemukan
                    </h1>
                    <p className="text-sm text-[#8f9097]">
                        Pemandu wisata yang Anda cari tidak ditemukan atau belum terdaftar dalam sistem IguideU.
                    </p>
                    <Link
                        href="/guides"
                        className="mt-2 rounded-xl bg-[#e9c176] px-6 py-2.5 text-sm font-bold text-[#0D182E] shadow-md transition-all hover:bg-[#f3ce87]"
                    >
                        Jelajahi Pemandu Lainnya
                    </Link>
                </div>
            </div>
        );
    }

    const guide: MockGuide = props.serverGuide;

    // ─── State for Shopee-style Interactive Elements ─────────
    const [selectedDestination, setSelectedDestination] = useState<string>(
        guide.serviceAreas?.[0] || guide.location || '',
    );
    const [selectedImage, setSelectedImage] = useState<string>(guide.image || '');
    const [durationVariant, setDurationVariant] = useState<
        'full' | 'half' | 'expedition'
    >('full');
    const [vehicleVariant, setVehicleVariant] = useState<
        'car' | 'motorcycle' | 'none'
    >(guide.vehicles?.[0] || 'car');
    const [selectedExtras, setSelectedExtras] = useState<string[]>([
        'documentation',
    ]);
    const [paxCount, setPaxCount] = useState<number>(1);
    const [bookingDate, setBookingDate] = useState<string>('');
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<
        'details' | 'itinerary' | 'reviews'
    >('details');
    const [reviewFilter, setReviewFilter] = useState<
        'all' | '5' | '4' | '3'
    >('all');
    const [bookingSuccessModal, setBookingSuccessModal] =
        useState<boolean>(false);

    // Review state from server
    const [reviewsList, setReviewsList] = useState<any[]>(
        props.serverReviews || [],
    );

    useEffect(() => {
        if (props.serverReviews) {
            setReviewsList(props.serverReviews);
        }
    }, [props.serverReviews]);

    useEffect(() => {
        setSelectedDestination(guide.serviceAreas?.[0] || guide.location);
        setSelectedImage(guide.image);
        setVehicleVariant(guide.vehicles[0] || 'car');
    }, [guide]);

    // Gallery images list (strictly use actual guide photos, no fake stock photos)
    const galleryImages = useMemo(() => {
        if (guide.gallery && Array.isArray(guide.gallery) && guide.gallery.length > 0) {
            return guide.gallery;
        }
        return guide.image ? [guide.image] : [];
    }, [guide]);

    // Price calculation
    const calculatedPrice = useMemo(() => {
        let base = guide.dailyRate;
        if (durationVariant === 'half')
            base = Math.round(guide.dailyRate * 0.6);
        if (durationVariant === 'expedition') base = guide.dailyRate * 2.5;

        // Vehicle surcharge
        if (vehicleVariant === 'car') base += 150000;
        if (vehicleVariant === 'motorcycle') base += 50000;

        // Extras surcharge
        if (selectedExtras.includes('transfer')) base += 100000;
        if (selectedExtras.includes('equipment')) base += 75000;

        return base * paxCount;
    }, [guide, durationVariant, vehicleVariant, selectedExtras, paxCount]);

    const formatRupiah = (val: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val);
    };

    const toggleExtra = (id: string) => {
        if (selectedExtras.includes(id)) {
            setSelectedExtras(selectedExtras.filter((e) => e !== id));
        } else {
            setSelectedExtras([...selectedExtras, id]);
        }
    };

    // Related guides from database (excluding current)
    const relatedGuides = props.relatedGuides || [];

    return (
        <>
            <Head title={`${guide.name} - ${guide.specialty} | IguideU`} />

            <div className="flex min-h-screen flex-col bg-[#0D182E] pt-16 font-['Inter',sans-serif] text-white antialiased">
                {/* ─── Optimized Top Navigation Bar ─── */}
                <GuidesHeader
                    breadcrumbs={[
                        {
                            label: t('results.guides') || 'Pemandu',
                            href: '/guides',
                        },
                        { label: guide.city },
                        { label: guide.name },
                    ]}
                />

                {/* ─── Main Content Container ─── */}
                <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 p-4 sm:p-6">
                    {/* ─── Shopee Breadcrumb Mobile ─── */}
                    <div className="flex items-center gap-1.5 text-xs text-[#79849f] sm:hidden">
                        <Link href="/" className="hover:text-white">
                            Home
                        </Link>
                        <ChevronRight className="h-3 w-3" />
                        <Link href="/guides" className="hover:text-white">
                            Guides
                        </Link>
                        <ChevronRight className="h-3 w-3" />
                        <span className="truncate font-medium text-[#C5A059]">
                            {guide.name}
                        </span>
                    </div>

                    {/* ═══════════════════════════════════════════════════════ */}
                    {/* SHOPEE MAIN PRODUCT CONTAINER (2-Column Desktop Grid)    */}
                    {/* ═══════════════════════════════════════════════════════ */}
                    <div className="grid grid-cols-1 gap-8 rounded-2xl border border-white/10 bg-[#16223B]/60 p-5 shadow-xl backdrop-blur-md sm:p-7 lg:grid-cols-12">
                        {/* ─── LEFT COLUMN: Gallery & Photo Viewer (5 cols) ─── */}
                        <div className="flex flex-col gap-4 lg:col-span-5">
                            {/* Main Large Image Container */}
                            <div className="group relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-white/10 bg-[#0D182E]">
                                <img
                                    src={selectedImage}
                                    alt={guide.name}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0D182E]/80 via-transparent to-transparent" />

                                {/* Floating Badges Overlay */}
                                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                                    {guide.availableNow && (
                                        <div className="flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                                            <span className="relative flex h-2 w-2">
                                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75"></span>
                                                <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
                                            </span>
                                            <span>Tersedia Sekarang</span>
                                        </div>
                                    )}
                                    {guide.verified && (
                                        <div className="flex w-fit items-center gap-1 rounded-full bg-[#C5A059] px-3 py-1 text-xs font-bold text-[#0D182E] shadow-lg">
                                            <ShieldCheck className="h-4 w-4" />
                                            <span>Pemandu Terverifikasi</span>
                                        </div>
                                    )}
                                </div>

                                {/* Language overlay right top */}
                                <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full border border-white/10 bg-black/70 px-2.5 py-1 text-xs backdrop-blur-md">
                                    {guide.languages.map((l) => (
                                        <span key={l.code} title={l.label}>
                                            {l.flag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Thumbnail Gallery Carousel (Only displayed when guide has multiple photos) */}
                            {galleryImages.length > 1 && (
                                <div className="hide-scrollbar flex gap-2.5 overflow-x-auto py-1">
                                    {galleryImages.map((imgUrl, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImage(imgUrl)}
                                            className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                                                selectedImage === imgUrl
                                                    ? 'scale-95 border-[#C5A059] shadow-md shadow-[#C5A059]/30'
                                                    : 'border-white/10 opacity-70 hover:border-white/40 hover:opacity-100'
                                            }`}
                                        >
                                            <img
                                                src={imgUrl}
                                                alt={`Gallery ${idx + 1}`}
                                                className="h-full w-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Shopee Style Share & Favorite Bar */}
                            <div className="flex items-center justify-between border-t border-white/10 pt-3 text-xs text-[#79849f]">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setIsLiked(!isLiked)}
                                        className={`flex items-center gap-1.5 transition-colors hover:text-rose-400 ${
                                            isLiked
                                                ? 'font-bold text-rose-500'
                                                : ''
                                        }`}
                                    >
                                        <Heart
                                            className={`h-4 w-4 ${isLiked ? 'fill-rose-500 text-rose-500' : ''}`}
                                        />
                                        <span>
                                            Favoritkan (
                                            {isLiked
                                                ? guide.reviews + 1
                                                : guide.reviews}
                                            )
                                        </span>
                                    </button>
                                    <button className="flex items-center gap-1.5 transition-colors hover:text-white">
                                        <Share2 className="h-4 w-4" />
                                        <span>Bagikan</span>
                                    </button>
                                </div>
                                <span className="text-[11px]">
                                    ID Pemandu: #{guide.id}8291
                                </span>
                            </div>
                        </div>

                        {/* ─── RIGHT COLUMN: Info & Variant Purchasing Box (7 cols) ─── */}
                        <div className="flex flex-col gap-5 lg:col-span-7">
                            {/* Guide Title & Specialty */}
                            <div>
                                <div className="mb-1 flex items-center gap-2">
                                    <span className="rounded border border-[#C5A059]/40 bg-[#C5A059]/20 px-2 py-0.5 text-[10px] font-extrabold tracking-wider text-[#C5A059] uppercase">
                                        SUPER GUIDE
                                    </span>
                                    <span className="flex items-center gap-1 text-xs font-medium text-[#79849f]">
                                        <MapPin className="h-3.5 w-3.5 text-[#C5A059]" />
                                        {guide.location}
                                    </span>
                                </div>

                                <h1 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                    {guide.name}
                                </h1>
                                <p className="mt-1 text-sm font-medium text-[#79849f]">
                                    {guide.specialty} • {guide.experience}{' '}
                                    Pengalaman
                                </p>
                            </div>

                            {/* Rating & Transaction Stats Bar (Shopee Rating Bar) */}
                            <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-[#0D182E]/50 px-4 py-2.5 text-xs">
                                <div className="flex items-center gap-1 font-bold text-[#C5A059]">
                                    <span className="text-sm underline decoration-[#C5A059] decoration-2">
                                        {guide.rating}
                                    </span>
                                    <div className="flex">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className="h-3.5 w-3.5 fill-[#C5A059] text-[#C5A059]"
                                            />
                                        ))}
                                    </div>
                                </div>
                                <span className="text-[#79849f]">|</span>
                                <a
                                    href="#reviews"
                                    onClick={() => setActiveTab('reviews')}
                                    className="font-semibold text-white underline hover:text-[#C5A059]"
                                >
                                    {guide.reviews} Ulasan
                                </a>
                                <span className="text-[#79849f]">|</span>
                                <span className="text-[#79849f]">
                                    <strong className="text-white">340+</strong>{' '}
                                    Tur Selesai
                                </span>
                            </div>

                            {/* ─── Shopee Highlighted Price Box ─── */}
                            <div className="relative flex flex-col gap-2 overflow-hidden rounded-xl border border-[#C5A059]/40 bg-gradient-to-r from-[#1E2D4A] via-[#16223B] to-[#1E2D4A] p-4 shadow-inner">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-xs text-[#79849f]">
                                        Harga Layanan:
                                    </span>
                                    <span className="font-['Plus_Jakarta_Sans'] text-2xl font-extrabold text-[#C5A059] sm:text-3xl">
                                        {formatRupiah(calculatedPrice)}
                                    </span>
                                    <span className="text-xs text-[#79849f]">
                                        / {paxCount} pax (
                                        {durationVariant === 'full'
                                            ? '1 Hari'
                                            : durationVariant === 'half'
                                              ? '4 Jam'
                                              : '3H2N'}
                                        )
                                    </span>
                                </div>

                                {/* Shopee Promo Banner Tag */}
                                <div className="mt-1 flex flex-wrap items-center gap-2">
                                    <span className="flex items-center gap-1 rounded bg-[#C5A059] px-2 py-0.5 text-[10px] font-extrabold text-[#0D182E] shadow">
                                        🏷️ DISKON 10% BOOKING AWAL
                                    </span>
                                    <span className="flex items-center gap-1 rounded border border-emerald-500/40 bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                                        ⚡ GARANSI HARGA TERBAIK
                                    </span>
                                </div>
                            </div>

                            {/* ─── Shopee Variant Selectors ─── */}
                            <div className="flex flex-col gap-4 pt-1">
                                {/* Variant 0: Pilihan Destinasi */}
                                {guide.serviceAreas &&
                                    guide.serviceAreas.length > 0 && (
                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                            <span className="shrink-0 text-xs font-semibold text-[#79849f] sm:w-28">
                                                Pilih Destinasi:
                                            </span>
                                            <div className="flex flex-wrap gap-2">
                                                {guide.serviceAreas.map(
                                                    (dest) => (
                                                        <button
                                                            key={dest}
                                                            type="button"
                                                            onClick={() =>
                                                                setSelectedDestination(
                                                                    dest,
                                                                )
                                                            }
                                                            className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                                                                selectedDestination ===
                                                                dest
                                                                    ? 'border-[#C5A059] bg-[#C5A059] font-bold text-[#0D182E] shadow-md'
                                                                    : 'border-white/10 bg-[#0D182E]/60 text-white hover:border-[#C5A059]/40'
                                                            }`}
                                                        >
                                                            <MapPin
                                                                className={`h-3.5 w-3.5 ${selectedDestination === dest ? 'text-[#0D182E]' : 'text-[#C5A059]'}`}
                                                            />
                                                            <span>{dest}</span>
                                                        </button>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {/* Variant 1: Durasi Tur */}
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                    <span className="shrink-0 text-xs font-semibold text-[#79849f] sm:w-28">
                                        Durasi Paket:
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            {
                                                id: 'full',
                                                label: 'Full Day (8 Jam)',
                                                tag: 'Populer',
                                            },
                                            {
                                                id: 'half',
                                                label: 'Half Day (4 Jam)',
                                                tag: '',
                                            },
                                            {
                                                id: 'expedition',
                                                label: 'Ekspedisi (3H2N)',
                                                tag: 'Hemat',
                                            },
                                        ].map((v) => (
                                            <button
                                                key={v.id}
                                                onClick={() =>
                                                    setDurationVariant(
                                                        v.id as any,
                                                    )
                                                }
                                                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                                                    durationVariant === v.id
                                                        ? 'border-[#C5A059] bg-[#C5A059] font-bold text-[#0D182E] shadow-md'
                                                        : 'border-white/10 bg-[#0D182E]/60 text-white hover:border-[#C5A059]/40'
                                                }`}
                                            >
                                                <span>{v.label}</span>
                                                {v.tag && (
                                                    <span
                                                        className={`rounded px-1 text-[9px] ${durationVariant === v.id ? 'bg-[#0D182E] text-[#C5A059]' : 'bg-[#C5A059]/20 text-[#C5A059]'}`}
                                                    >
                                                        {v.tag}
                                                    </span>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Variant 2: Opsi Kendaraan */}
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
                                    <span className="shrink-0 text-xs font-semibold text-[#79849f] sm:w-28">
                                        Transportasi:
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            {
                                                id: 'car',
                                                label: 'Dengan Mobil (+150k)',
                                                icon: (
                                                    <Car className="h-3.5 w-3.5" />
                                                ),
                                            },
                                            {
                                                id: 'motorcycle',
                                                label: 'Dengan Motor (+50k)',
                                                icon: (
                                                    <Zap className="h-3.5 w-3.5" />
                                                ),
                                            },
                                            {
                                                id: 'none',
                                                label: 'Tanpa Kendaraan',
                                                icon: (
                                                    <Footprints className="h-3.5 w-3.5" />
                                                ),
                                            },
                                        ].map((veh) => (
                                            <button
                                                key={veh.id}
                                                onClick={() =>
                                                    setVehicleVariant(
                                                        veh.id as any,
                                                    )
                                                }
                                                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                                                    vehicleVariant === veh.id
                                                        ? 'border-[#C5A059] bg-[#C5A059] font-bold text-[#0D182E] shadow-md'
                                                        : 'border-white/10 bg-[#0D182E]/60 text-white hover:border-[#C5A059]/40'
                                                }`}
                                            >
                                                {veh.icon}
                                                <span>{veh.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Variant 3: Fasilitas Ekstra */}
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:gap-4">
                                    <span className="shrink-0 pt-1 text-xs font-semibold text-[#79849f] sm:w-28">
                                        Fasilitas Ekstra:
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            {
                                                id: 'documentation',
                                                label: '📸 Dokumentasi HD',
                                            },
                                            {
                                                id: 'equipment',
                                                label: '⛺ Alat Trekking (+75k)',
                                            },
                                            {
                                                id: 'transfer',
                                                label: '🚐 Antar-Jemput Hotel (+100k)',
                                            },
                                            {
                                                id: 'meals',
                                                label: '🍱 Snack & Makan',
                                            },
                                        ].map((ext) => {
                                            const isSel =
                                                selectedExtras.includes(ext.id);
                                            return (
                                                <button
                                                    key={ext.id}
                                                    onClick={() =>
                                                        toggleExtra(ext.id)
                                                    }
                                                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all ${
                                                        isSel
                                                            ? 'border-[#C5A059] bg-[#C5A059]/20 text-[#C5A059]'
                                                            : 'border-white/10 bg-[#0D182E]/60 text-[#79849f] hover:text-white'
                                                    }`}
                                                >
                                                    <div
                                                        className={`flex h-3.5 w-3.5 items-center justify-center rounded border ${isSel ? 'border-[#C5A059] bg-[#C5A059]' : 'border-white/30'}`}
                                                    >
                                                        {isSel && (
                                                            <Check className="h-2.5 w-2.5 text-[#0D182E]" />
                                                        )}
                                                    </div>
                                                    <span>{ext.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Quantity Counter (Pax Rombongan) */}
                                <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center sm:gap-4">
                                    <span className="shrink-0 text-xs font-semibold text-[#79849f] sm:w-28">
                                        Jumlah Peserta:
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center overflow-hidden rounded-lg border border-white/20 bg-[#0D182E]">
                                            <button
                                                onClick={() =>
                                                    setPaxCount(
                                                        Math.max(
                                                            1,
                                                            paxCount - 1,
                                                        ),
                                                    )
                                                }
                                                className="px-3 py-1.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
                                            >
                                                -
                                            </button>
                                            <span className="px-4 py-1.5 text-xs font-extrabold text-[#C5A059]">
                                                {paxCount} Orang
                                            </span>
                                            <button
                                                onClick={() =>
                                                    setPaxCount(
                                                        Math.min(
                                                            guide.maxPax || 10,
                                                            paxCount + 1,
                                                        ),
                                                    )
                                                }
                                                className="px-3 py-1.5 text-sm font-bold text-white transition-colors hover:bg-white/10"
                                            >
                                                +
                                            </button>
                                        </div>
                                        <span className="text-[11px] text-[#79849f]">
                                            Maksimal {guide.maxPax} pax per tur
                                        </span>
                                    </div>
                                </div>

                                {/* Booking Date Selector */}
                                <div className="flex flex-col gap-2 pt-1 sm:flex-row sm:items-center sm:gap-4">
                                    <span className="shrink-0 text-xs font-semibold text-[#79849f] sm:w-28">
                                        Tanggal Tur:
                                    </span>
                                    <input
                                        type="date"
                                        value={bookingDate}
                                        onChange={(e) =>
                                            setBookingDate(e.target.value)
                                        }
                                        className="w-full rounded-lg border border-white/20 bg-[#0D182E] px-3 py-2 text-xs text-white focus:border-[#C5A059] focus:outline-none sm:w-56"
                                    />
                                </div>
                            </div>

                            {/* ─── Shopee Primary Action CTA Buttons ─── */}
                            <div className="mt-2 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center">
                                <a
                                    href={`https://wa.me/${guide.whatsapp || '6281234567890'}?text=${encodeURIComponent(`Halo ${guide.name}, saya melihat profil Anda di platform IguideU dan tertarik berkonsultasi mengenai layanan pemandu wisata ke ${selectedDestination || guide.location}.${bookingDate ? ` (Rencana jadwal: ${bookingDate})` : ''} Apakah Anda tersedia?`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#C5A059] bg-[#C5A059]/10 px-5 py-3 text-xs font-bold text-[#C5A059] transition-all hover:bg-[#C5A059]/20 sm:flex-initial cursor-pointer"
                                >
                                    <MessageSquare className="h-4 w-4" />
                                    <span>WhatsApp Pemandu</span>
                                </a>
                                {userRole === 'admin' || userRole === 'guide' ? (
                                    <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-white/10 bg-white/5 px-6 py-2 text-center shadow-lg">
                                        <span className="text-xs font-bold text-[#79849f] uppercase tracking-wider">Akses Dibatasi</span>
                                        <span className="text-[10px] text-[#79849f]">Hanya akun Pelancong (Traveler) yang dapat memesan.</span>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setBookingSuccessModal(true)}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#C5A059] px-6 py-3 text-xs font-extrabold tracking-wider text-[#0D182E] uppercase shadow-lg transition-all hover:bg-[#fed488]"
                                    >
                                        <ShoppingBag className="h-4 w-4" />
                                        <span>Pesan & Bayar Sekarang</span>
                                    </button>
                                )}
                            </div>

                            {/* ─── Shopee Guarantee Badge Bar ─── */}
                            <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-[#0D182E]/80 p-3 text-xs text-[#79849f]">
                                <ShieldCheck className="h-5 w-5 shrink-0 text-[#C5A059]" />
                                <div>
                                    <p className="text-[11px] font-bold text-white">
                                        Garansi Proteksi IguideU Escrow
                                    </p>
                                    <p className="text-[10px]">
                                        Dana disimpan aman. Pemandu baru dibayar
                                        setelah tur selesai sesuai pesanan.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════════════════ */}
                    {/* SHOPEE STORE / GUIDE PROFILE CARD (Shop Header Card)     */}
                    {/* ═══════════════════════════════════════════════════════ */}
                    <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-white/10 bg-[#16223B]/60 p-5 backdrop-blur-md md:flex-row">
                        <div className="flex w-full items-center gap-4 md:w-auto">
                            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-[#C5A059]">
                                <img
                                    src={guide.image}
                                    alt={guide.name}
                                    className="h-full w-full object-cover"
                                />
                                {guide.availableNow && (
                                    <span className="absolute right-0 bottom-0 h-4 w-4 rounded-full border-2 border-[#0D182E] bg-emerald-500"></span>
                                )}
                            </div>
                            <div>
                                <h3 className="flex items-center gap-2 font-['Plus_Jakarta_Sans'] text-base font-bold text-white">
                                    {guide.name}
                                    <CheckCircle2 className="h-4 w-4 text-[#C5A059]" />
                                </h3>
                                <p className="text-xs text-[#79849f]">
                                    {guide.city}, NTB • Aktif 10 menit lalu
                                </p>
                                <div className="mt-1.5 flex items-center gap-2">
                                    <a
                                        href={`https://wa.me/${guide.whatsapp || '6281234567890'}?text=${encodeURIComponent(`Halo, saya tertarik dengan layanan tour guide ${guide.name} di IguideU.`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 rounded-md border border-[#C5A059]/40 bg-[#C5A059]/10 px-3 py-1 text-[11px] font-bold text-[#C5A059] transition-all hover:bg-[#C5A059] hover:text-[#0D182E] cursor-pointer"
                                    >
                                        <MessageSquare className="h-3 w-3" />{' '}
                                        WhatsApp Sekarang
                                    </a>
                                    <button className="rounded-md border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-white transition-all hover:bg-white/10">
                                        Lihat Profil Lengkap
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Shop Stats Grid */}
                        <div className="grid w-full grid-cols-2 gap-4 border-t border-white/10 pt-4 text-xs sm:grid-cols-4 md:w-auto md:border-t-0 md:border-l md:pt-0 md:pl-6">
                            <div className="flex flex-col">
                                <span className="text-[#79849f]">
                                    Total Ulasan
                                </span>
                                <span className="text-sm font-bold text-[#C5A059]">
                                    {guide.reviews}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[#79849f]">
                                    Performa Balas Chat
                                </span>
                                <span className="text-sm font-bold text-emerald-400">
                                    99% (Sangat Cepat)
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[#79849f]">
                                    Pengalaman
                                </span>
                                <span className="text-sm font-bold text-white">
                                    {guide.experience}
                                </span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[#79849f]">
                                    Lisensi BNSP
                                </span>
                                <span className="text-sm font-bold text-[#C5A059]">
                                    Terverifikasi
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════════════════ */}
                    {/* SHOPEE DETAILS & REVIEWS TAB SECTION                     */}
                    {/* ═══════════════════════════════════════════════════════ */}
                    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#16223B]/60 backdrop-blur-md">
                        {/* Tab Headers Bar */}
                        <div className="flex border-b border-white/10 bg-[#0D182E]/50">
                            {[
                                { id: 'details', label: 'Spesifikasi & Bio' },
                                {
                                    id: 'itinerary',
                                    label: 'Rencana Perjalanan (Itinerary)',
                                },
                                {
                                    id: 'reviews',
                                    label: `Ulasan Pemandu (${reviewsList.length})`,
                                },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`relative px-6 py-3.5 text-xs font-bold transition-all sm:text-sm ${
                                        activeTab === tab.id
                                            ? 'bg-[#16223B]/80 text-[#C5A059]'
                                            : 'text-[#79849f] hover:text-white'
                                    }`}
                                >
                                    {tab.label}
                                    {activeTab === tab.id && (
                                        <span className="absolute right-0 bottom-0 left-0 h-0.5 bg-[#C5A059]" />
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Tab Content Body */}
                        <div className="p-6">
                            {/* TAB 1: DETAILS & SPECS */}
                            {activeTab === 'details' && (
                                <div className="flex flex-col gap-6 text-sm">
                                    <div>
                                        <h4 className="mb-3 flex items-center gap-2 font-['Plus_Jakarta_Sans'] text-base font-bold text-white">
                                            <Sparkles className="h-4 w-4 text-[#C5A059]" />{' '}
                                            Profil & Biografi
                                        </h4>
                                        <p className="rounded-xl border border-white/5 bg-[#0D182E]/40 p-4 leading-relaxed text-[#79849f]">
                                            {guide.bio}
                                        </p>
                                    </div>

                                    {/* Specifications Grid (Shopee Product Specs) */}
                                    <div>
                                        <h4 className="mb-3 font-['Plus_Jakarta_Sans'] text-base font-bold text-white">
                                            Spesifikasi & Cakupan Layanan
                                        </h4>
                                        <div className="grid grid-cols-1 gap-3 text-xs sm:grid-cols-2">
                                            <div className="flex justify-between rounded-lg border border-white/5 bg-[#0D182E]/60 p-3">
                                                <span className="text-[#79849f]">
                                                    Kategori Spesialisasi
                                                </span>
                                                <span className="font-semibold text-white uppercase">
                                                    {guide.category}
                                                </span>
                                            </div>
                                            <div className="flex justify-between rounded-lg border border-white/5 bg-[#0D182E]/60 p-3">
                                                <span className="text-[#79849f]">
                                                    Kapasitas Maksimal
                                                </span>
                                                <span className="font-semibold text-white">
                                                    {guide.maxPax} Orang
                                                </span>
                                            </div>
                                            <div className="flex justify-between rounded-lg border border-white/5 bg-[#0D182E]/60 p-3">
                                                <span className="text-[#79849f]">
                                                    Gender Pemandu
                                                </span>
                                                <span className="font-semibold text-white capitalize">
                                                    {guide.gender === 'male'
                                                        ? 'Laki-laki'
                                                        : 'Perempuan'}
                                                </span>
                                            </div>
                                            <div className="flex justify-between rounded-lg border border-white/5 bg-[#0D182E]/60 p-3">
                                                <span className="text-[#79849f]">
                                                    Bahasa Komunikasi
                                                </span>
                                                <span className="font-semibold text-[#C5A059]">
                                                    {guide.languages
                                                        .map((l) => l.label)
                                                        .join(', ')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Service Areas Chips */}
                                    {guide.serviceAreas && (
                                        <div>
                                            <h4 className="mb-3 font-['Plus_Jakarta_Sans'] text-base font-bold text-white">
                                                Area & Destinasi Utama Layanan
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {guide.serviceAreas.map(
                                                    (area, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="flex items-center gap-1.5 rounded-lg border border-[#C5A059]/30 bg-[#C5A059]/10 px-3 py-1 text-xs font-semibold text-[#C5A059]"
                                                        >
                                                            <MapPin className="h-3.5 w-3.5" />{' '}
                                                            {area}
                                                        </span>
                                                    ),
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB 2: ITINERARY */}
                            {activeTab === 'itinerary' && (
                                <div className="flex flex-col gap-4">
                                    <h4 className="mb-2 font-['Plus_Jakarta_Sans'] text-base font-bold text-white">
                                        Contoh Alur Rencana Perjalanan
                                        (Itinerary Standard)
                                    </h4>
                                    <div className="relative ml-3 flex flex-col gap-6 border-l-2 border-[#C5A059]/40 pl-6 text-xs">
                                        <div className="relative">
                                            <span className="absolute top-0 -left-[31px] h-4 w-4 rounded-full border-4 border-[#0D182E] bg-[#C5A059]"></span>
                                            <h5 className="text-sm font-bold text-white">
                                                08:00 - Penjemputan & Briefing
                                            </h5>
                                            <p className="mt-1 text-[#79849f]">
                                                Penjemputan di hotel / titik
                                                kumpul, persiapan alat, dan
                                                penjelasan rute perjalanan.
                                            </p>
                                        </div>
                                        <div className="relative">
                                            <span className="absolute top-0 -left-[31px] h-4 w-4 rounded-full border-4 border-[#0D182E] bg-[#C5A059]"></span>
                                            <h5 className="text-sm font-bold text-white">
                                                09:30 - Eksplorasi Destinasi
                                                Utama
                                            </h5>
                                            <p className="mt-1 text-[#79849f]">
                                                Memulai perjalanan dengan
                                                pemandu lokal. Termasuk foto
                                                dokumentasi di spot terbaik.
                                            </p>
                                        </div>
                                        <div className="relative">
                                            <span className="absolute top-0 -left-[31px] h-4 w-4 rounded-full border-4 border-[#0D182E] bg-[#C5A059]"></span>
                                            <h5 className="text-sm font-bold text-white">
                                                12:30 - Istirahat & Makan Siang
                                                Autentik
                                            </h5>
                                            <p className="mt-1 text-[#79849f]">
                                                Sajian kuliner khas lokal Lombok
                                                bersama pemandu.
                                            </p>
                                        </div>
                                        <div className="relative">
                                            <span className="absolute top-0 -left-[31px] h-4 w-4 rounded-full border-4 border-[#0D182E] bg-[#C5A059]"></span>
                                            <h5 className="text-sm font-bold text-white">
                                                16:00 - Tur Selesai &
                                                Pengantaran Kembali
                                            </h5>
                                            <p className="mt-1 text-[#79849f]">
                                                Pengantaran kembali ke titik
                                                asal dan penyerahan foto/video
                                                tur.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* TAB 3: SHOPEE REVIEWS SECTION */}
                            {activeTab === 'reviews' && (() => {
                                const countAll = reviewsList.length;
                                const count5 = reviewsList.filter((r) => Number(r.rating) === 5).length;
                                const count4 = reviewsList.filter((r) => Number(r.rating) === 4).length;
                                const count3 = reviewsList.filter((r) => Number(r.rating) <= 3).length;

                                const avgRating =
                                    countAll > 0
                                        ? (
                                              reviewsList.reduce(
                                                  (sum, r) => sum + Number(r.rating || 5),
                                                  0,
                                              ) / countAll
                                          ).toFixed(1)
                                        : guide.rating || '5.0';

                                const filteredReviews = reviewsList.filter((rev) => {
                                    if (reviewFilter === '5') return Number(rev.rating) === 5;
                                    if (reviewFilter === '4') return Number(rev.rating) === 4;
                                    if (reviewFilter === '3') return Number(rev.rating) <= 3;
                                    return true;
                                });

                                return (
                                    <div
                                        id="reviews"
                                        className="flex flex-col gap-6"
                                    >
                                        {/* Shopee Rating Overview Box */}
                                        <div className="flex flex-col items-center gap-6 rounded-xl border border-white/10 bg-[#0D182E]/70 p-5 sm:flex-row">
                                            <div className="flex flex-col items-center justify-center border-white/10 sm:border-r sm:pr-8">
                                                <span className="font-['Plus_Jakarta_Sans'] text-4xl font-extrabold text-[#C5A059]">
                                                    {avgRating}
                                                </span>
                                                <div className="my-1 flex text-[#C5A059]">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-4 w-4 ${
                                                                i < Math.round(Number(avgRating))
                                                                    ? 'fill-[#C5A059] text-[#C5A059]'
                                                                    : 'text-white/20'
                                                            }`}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="text-xs text-[#79849f]">
                                                    {countAll} Ulasan Terverifikasi
                                                </span>
                                            </div>

                                            {/* Shopee Review Filter Chips */}
                                            <div className="flex flex-wrap gap-2">
                                                {[
                                                    {
                                                        id: 'all',
                                                        label: `Semua (${countAll})`,
                                                    },
                                                    {
                                                        id: '5',
                                                        label: `5 Bintang (${count5})`,
                                                    },
                                                    {
                                                        id: '4',
                                                        label: `4 Bintang (${count4})`,
                                                    },
                                                    {
                                                        id: '3',
                                                        label: `≤ 3 Bintang (${count3})`,
                                                    },
                                                ].map((rf) => (
                                                    <button
                                                        key={rf.id}
                                                        onClick={() =>
                                                            setReviewFilter(
                                                                rf.id as any,
                                                            )
                                                        }
                                                        className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                                                            reviewFilter === rf.id
                                                                ? 'border-[#C5A059] bg-[#C5A059] text-[#0D182E]'
                                                                : 'border-white/10 bg-[#16223B] text-white hover:border-[#C5A059]/40'
                                                        }`}
                                                    >
                                                        {rf.label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Verified Review Policy Banner */}
                                        <div className="flex items-start gap-3 rounded-xl border border-[#C5A059]/20 bg-[#C5A059]/5 p-4 text-xs">
                                            <ShieldCheck className="h-5 w-5 shrink-0 text-[#C5A059] mt-0.5" />
                                            <div className="flex-1">
                                                <p className="font-bold text-white">Ulasan 100% Terverifikasi Transaksi</p>
                                                <p className="text-[#79849f] mt-0.5 leading-relaxed">
                                                    Semua penilaian di IguideU ditulis oleh wisatawan yang telah memesan dan menyelesaikan tur bersama pemandu ini.
                                                    {userRole === 'traveler' && (
                                                        <> Punya pesanan tur yang telah selesai? Berikan ulasan Anda melalui <Link href="/pesanan" className="text-[#C5A059] font-bold underline hover:text-[#fed488]">Pesanan Saya &rarr;</Link></>
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Reviews List */}
                                        {filteredReviews.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-[#0D182E]/40 p-8 text-center">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-[#79849f] mb-3">
                                                    <Star className="h-6 w-6" />
                                                </div>
                                                <h5 className="font-bold text-sm text-white">Belum Ada Ulasan</h5>
                                                <p className="text-xs text-[#79849f] max-w-sm mt-1">
                                                    {countAll === 0
                                                        ? 'Pemandu ini belum memiliki ulasan. Jadilah wisatawan pertama yang membagikan pengalaman tur bersama pemandu ini!'
                                                        : 'Tidak ada ulasan yang sesuai dengan filter bintang yang dipilih.'}
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col gap-4">
                                                {filteredReviews.map((rev, idx) => (
                                                    <div
                                                        key={rev.id || idx}
                                                        className="flex flex-col gap-2.5 rounded-xl border border-white/5 bg-[#0D182E]/40 p-4 text-xs"
                                                    >
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C5A059]/20 font-bold text-[#C5A059] border border-[#C5A059]/30">
                                                                    {rev.avatar ? (
                                                                        <img
                                                                            src={rev.avatar}
                                                                            alt={rev.name}
                                                                            className="h-full w-full rounded-full object-cover"
                                                                        />
                                                                    ) : (
                                                                        rev.name?.charAt(0) || 'U'
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    <span className="text-sm font-bold text-white block">
                                                                        {rev.name}
                                                                    </span>
                                                                    <div className="my-0.5 flex text-[#C5A059]">
                                                                        {[
                                                                            ...Array(
                                                                                Number(rev.rating) || 5,
                                                                            ),
                                                                        ].map((_, i) => (
                                                                            <Star
                                                                                key={i}
                                                                                className="h-3 w-3 fill-[#C5A059]"
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <span className="text-[#79849f] text-[11px]">
                                                                {rev.date}
                                                            </span>
                                                        </div>

                                                        {rev.variant && (
                                                            <span className="w-fit rounded bg-white/5 px-2 py-0.5 text-[11px] text-[#79849f]">
                                                                Paket: {rev.variant}
                                                            </span>
                                                        )}

                                                        <p className="mt-1 leading-relaxed text-white/90">
                                                            {rev.comment || '(Wisatawan tidak meninggalkan pesan teks)'}
                                                        </p>

                                                        {rev.photo && (
                                                            <div className="mt-2 h-24 w-24 overflow-hidden rounded-lg border border-white/10">
                                                                <img
                                                                    src={rev.photo}
                                                                    alt="Review attachment"
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>
                    </div>

                    {/* ═══════════════════════════════════════════════════════ */}
                    {/* SHOPEE RECOMMENDED / RELATED GUIDES SECTION               */}
                    {/* ═══════════════════════════════════════════════════════ */}
                    <div className="mt-4 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-['Plus_Jakarta_Sans'] text-lg font-bold text-white">
                                Pemandu Lain yang Mungkin Anda Suka
                            </h3>
                            <Link
                                href="/guides"
                                className="text-xs font-bold text-[#C5A059] hover:underline"
                            >
                                Lihat Semua →
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {relatedGuides.map((relGuide) => (
                                <GuideSearchCard
                                    key={relGuide.id}
                                    guide={relGuide}
                                />
                            ))}
                        </div>
                    </div>
                </main>
            </div>

            {/* Booking Success Modal (Shopee Checkout Modal Preview) */}
            {bookingSuccessModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
                    <div className="flex w-full max-w-md flex-col items-center gap-4 rounded-2xl border border-[#C5A059] bg-[#16223B] p-6 text-center shadow-2xl">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#C5A059] bg-[#C5A059]/20 text-[#C5A059]">
                            <CheckCircle2 className="h-10 w-10" />
                        </div>

                        <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-white">
                            Konfirmasi Pesanan Pemandu
                        </h3>

                        <div className="w-full space-y-2 rounded-xl border border-white/10 bg-[#0D182E] p-4 text-left text-xs">
                            <div className="flex justify-between">
                                <span className="text-[#79849f]">Pemandu:</span>
                                <span className="font-bold text-white">
                                    {guide.name}
                                </span>
                            </div>
                            {selectedDestination && (
                                <div className="flex justify-between">
                                    <span className="text-[#79849f]">
                                        Destinasi:
                                    </span>
                                    <span className="font-semibold text-[#C5A059]">
                                        {selectedDestination}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-[#79849f]">Durasi:</span>
                                <span className="font-semibold text-white capitalize">
                                    {durationVariant === 'full'
                                        ? 'Full Day (8 Jam)'
                                        : durationVariant === 'half'
                                          ? 'Half Day (4 Jam)'
                                          : 'Ekspedisi (3H2N)'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-[#79849f]">Peserta:</span>
                                <span className="font-semibold text-white">
                                    {paxCount} Orang
                                </span>
                            </div>
                            <div className="flex justify-between border-t border-white/10 pt-2 text-sm">
                                <span className="font-bold text-white">
                                    Total Tagihan:
                                </span>
                                <span className="font-extrabold text-[#C5A059]">
                                    {formatRupiah(calculatedPrice)}
                                </span>
                            </div>
                        </div>

                        <p className="text-xs text-[#79849f]">
                            Silakan lanjutkan ke halaman pembayaran aman IguideU
                            Escrow.
                        </p>

                        <div className="flex w-full gap-3">
                            <button
                                onClick={() => setBookingSuccessModal(false)}
                                className="flex-1 rounded-xl border border-white/10 bg-white/5 py-2.5 text-xs font-bold text-white hover:bg-white/10"
                            >
                                Kembali
                            </button>
                            <button
                                onClick={() => {
                                    router.post(
                                        '/bookings',
                                        {
                                            guide_id: guide.id,
                                            package_id: null,
                                            booking_date:
                                                bookingDate ||
                                                new Date()
                                                    .toISOString()
                                                    .split('T')[0],
                                            start_time: '08:00',
                                            duration_days:
                                                durationVariant === 'expedition'
                                                    ? 3
                                                    : 1,
                                            total_amount: calculatedPrice,
                                            notes: `${selectedDestination || guide.location} - ${durationVariant === 'full' ? 'Full Day' : durationVariant === 'half' ? 'Half Day' : 'Ekspedisi'}`,
                                        },
                                        {
                                            onSuccess: () => {
                                                window.location.href =
                                                    '/pesanan';
                                            },
                                            onError: (errors) => {
                                                console.error(
                                                    'Booking failed:',
                                                    errors,
                                                );
                                                alert(
                                                    'Gagal membuat pesanan: ' +
                                                        JSON.stringify(errors),
                                                );
                                            },
                                        },
                                    );
                                }}
                                className="flex-1 rounded-xl bg-[#C5A059] py-2.5 text-xs font-extrabold text-[#0D182E] uppercase hover:bg-[#fed488]"
                            >
                                Lanjut Pembayaran
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default function GuideShow() {
    return (
        <LanguageProvider>
            <GuideShowContent />
        </LanguageProvider>
    );
}
