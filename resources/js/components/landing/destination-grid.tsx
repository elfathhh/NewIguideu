import { useRef, useState, memo } from 'react';
import { Link } from '@inertiajs/react';
import {
    Sparkles,
    ChevronLeft,
    ChevronRight,
    ArrowRight,
    Compass,
    Mountain,
    Droplets,
    Landmark,
    Waves,
    ShieldCheck,
} from 'lucide-react';

type CategoryTab =
    'all' | 'mountain' | 'waterfall' | 'heritage' | 'marine' | 'surf';

interface DestinationGridProps {
    categoryStats?: Record<string, number>;
}

function DestinationGridComponent({ categoryStats = {} }: DestinationGridProps) {
    const [activeCategoryTab, setActiveCategoryTab] =
        useState<CategoryTab>('all');
    const cardsScrollRef = useRef<HTMLDivElement>(null);

    const scrollCards = (direction: 'left' | 'right') => {
        if (cardsScrollRef.current) {
            const scrollAmount = direction === 'left' ? -380 : 380;
            cardsScrollRef.current.scrollBy({
                left: scrollAmount,
                behavior: 'smooth',
            });
        }
    };

    const destinations = [
        {
            id: 'rinjani',
            title: 'Rinjani & Sembalun',
            category: 'mountain' as CategoryTab,
            badge: `${categoryStats['rinjani'] || 4}+ Pemandu Gunung`,
            tag: 'Trekking 3.726 mdpl',
            desc: 'Jelajahi Gunung Rinjani, Sembalun, dan puncak tertinggi NTB bersama pemandu gunung terverifikasi lisensi BNSP.',
            image: 'https://i.misteraladin.com/blog/2025/07/11164744/WhatsApp-Image-2025-07-11-at-16.37.41-1024x682.jpeg',
            icon: Mountain,
        },
        {
            id: 'tambora',
            title: 'Gunung Tambora',
            category: 'mountain' as CategoryTab,
            badge: `${categoryStats['tambora'] || 2}+ Pemandu Gunung`,
            tag: 'Trekking 2.850 mdpl',
            desc: 'Jelajahi Gunung Tambora di Sumbawa, saksikan kaldera raksasa paling spektakuler di dunia dan keindahan sabana Doro Ncanga.',
            image: 'https://images.pexels.com/photos/35843059/pexels-photo-35843059.jpeg',
            icon: Mountain,
        },
        {
            id: 'gili-marine',
            title: 'Gili Islands',
            category: 'marine' as CategoryTab,
            badge: `${categoryStats['gili-marine'] || 5}+ Pemandu Bahari`,
            tag: 'Snorkeling & Diving',
            desc: 'Jelajahi keindahan bawah laut Gili Trawangan, Meno, Air, dan Moyo Sumbawa bersama instruktur selam bersertifikat.',
            image: 'https://images.pexels.com/photos/34054916/pexels-photo-34054916.jpeg',
            icon: Waves,
        },
        {
            id: 'sasak-heritage',
            title: 'Desa Adat Sade & Sasak',
            category: 'heritage' as CategoryTab,
            badge: `${categoryStats['sasak-heritage'] || 4}+ Pemandu Budaya`,
            tag: 'Tur Budaya & Etnografis',
            desc: 'Selami kebudayaan Desa Adat Sade, Sukarara, kerajinan tenun ikat tradisional, serta sejarah kejayaan Kesultanan Sumbawa.',
            image: 'https://assets.pikiran-rakyat.com/crop/0x0:0x0/720x0/webp/photo/2026/07/30/3081305105.png',
            icon: Landmark,
        },
        {
            id: 'tiu-kelep',
            title: 'Air Terjun Tiu Kelep',
            category: 'waterfall' as CategoryTab,
            badge: `${categoryStats['tiu-kelep'] || 2}+ Pemandu Air Terjun`,
            tag: 'Trekking Air Terjun',
            desc: 'Nikmati kesegaran air terjun alami dan tirai benang kelambu tersembunyi di lereng Rinjani dengan suasana hutan tropis Senaru.',
            image: 'https://images.pexels.com/photos/89100/pexels-photo-89100.jpeg',
            icon: Droplets,
        },
        {
            id: 'mandalika-surf',
            title: 'Kuta Mandalika',
            category: 'surf' as CategoryTab,
            badge: 'Pemandu Surfing & Pantai',
            tag: 'Surfing & Beach Safari',
            desc: 'Eksplorasi ombak selancar kelas dunia Tanjung Aan, Selong Belanak, dan kemegahan Sirkuit Internasional Mandalika.',
            image: 'https://images.pexels.com/photos/1654489/pexels-photo-1654489.jpeg',
            icon: Waves,
        },
    ];

    const filteredDestinations =
        activeCategoryTab === 'all'
            ? destinations
            : destinations.filter(
                  (item) => item.category === activeCategoryTab,
              );

    return (
        <section
            id="kategori"
            className="cv-auto relative mx-auto max-w-[1440px] scroll-mt-20 overflow-hidden px-6 py-24 md:px-16"
        >
            {/* Ambient Radial Blur Light */}
            <div className="pointer-events-none absolute top-1/2 left-1/2 z-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e9c176]/5 blur-[120px]"></div>

            {/* Section Header */}
            <div className="relative z-10 mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
                <div>
                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#e9c176]/30 bg-gradient-to-r from-[#e9c176]/20 to-[#e9c176]/5 px-3.5 py-1.5 shadow-sm shadow-[#e9c176]/10 backdrop-blur-md">
                        <Sparkles className="h-4 w-4 text-[#e9c176]" />
                        <span className="text-xs font-semibold tracking-wide text-[#e9c176] uppercase">
                            Pesona Destinasi NTB
                        </span>
                    </div>
                    <h2 className="mb-3 font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-extrabold tracking-tight text-white md:text-4xl">
                        Jelajahi{' '}
                        <span className="bg-gradient-to-r from-white via-[#f3ce87] to-[#e9c176] bg-clip-text text-transparent">
                            Lombok & Sumbawa
                        </span>
                    </h2>
                    <p className="max-w-xl text-sm leading-relaxed text-[#c6c6ce] md:text-base">
                        Temukan pesona gunung megah, air terjun alami,
                        kebudayaan otentik, serta surga maritim tersembunyi
                        bersama pemandu lokal terverifikasi.
                    </p>
                </div>

                {/* Navigation Arrow Buttons for Horizontal Scroll */}
                <div className="flex items-center gap-3">
                    <div className="hidden items-center gap-2 border-r border-white/10 pr-2 sm:flex">
                        <button
                            type="button"
                            onClick={() => scrollCards('left')}
                            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-all hover:border-[#e9c176] hover:bg-[#e9c176]/20 hover:text-[#e9c176]"
                            title="Geser Kiri"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => scrollCards('right')}
                            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-white/5 text-white transition-all hover:border-[#e9c176] hover:bg-[#e9c176]/20 hover:text-[#e9c176]"
                            title="Geser Kanan"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>

                    <Link
                        href="/guides"
                        className="group relative inline-flex cursor-pointer items-center gap-2.5 rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-xs font-bold text-white backdrop-blur-xl transition-all duration-300 hover:border-[#e9c176]/60 hover:bg-[#e9c176]/15 hover:text-[#e9c176]"
                    >
                        <span>Lihat Semua Destinasi</span>
                        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </div>
            </div>

            {/* Interactive Category Filter Pills */}
            <div className="no-scrollbar relative z-10 mb-8 flex items-center gap-2 overflow-x-auto pb-4 md:gap-3">
                <button
                    type="button"
                    onClick={() => setActiveCategoryTab('all')}
                    className={`flex cursor-pointer items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                        activeCategoryTab === 'all'
                            ? 'border-[#e9c176] bg-[#e9c176] font-bold text-[#0D182E] shadow-md shadow-[#e9c176]/20'
                            : 'border-white/10 bg-white/5 text-[#c6c6ce] hover:border-white/25 hover:bg-white/10 hover:text-white'
                    }`}
                >
                    <Compass className="h-4 w-4" />
                    <span>Semua Kategori</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveCategoryTab('mountain')}
                    className={`flex cursor-pointer items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                        activeCategoryTab === 'mountain'
                            ? 'border-[#e9c176] bg-[#e9c176] font-bold text-[#0D182E] shadow-md shadow-[#e9c176]/20'
                            : 'border-white/10 bg-white/5 text-[#c6c6ce] hover:border-white/25 hover:bg-white/10 hover:text-white'
                    }`}
                >
                    <Mountain className="h-4 w-4" />
                    <span>Mountain</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveCategoryTab('waterfall')}
                    className={`flex cursor-pointer items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                        activeCategoryTab === 'waterfall'
                            ? 'border-[#e9c176] bg-[#e9c176] font-bold text-[#0D182E] shadow-md shadow-[#e9c176]/20'
                            : 'border-white/10 bg-white/5 text-[#c6c6ce] hover:border-white/25 hover:bg-white/10 hover:text-white'
                    }`}
                >
                    <Droplets className="h-4 w-4" />
                    <span>Waterfall</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveCategoryTab('heritage')}
                    className={`flex cursor-pointer items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                        activeCategoryTab === 'heritage'
                            ? 'border-[#e9c176] bg-[#e9c176] font-bold text-[#0D182E] shadow-md shadow-[#e9c176]/20'
                            : 'border-white/10 bg-white/5 text-[#c6c6ce] hover:border-white/25 hover:bg-white/10 hover:text-white'
                    }`}
                >
                    <Landmark className="h-4 w-4" />
                    <span>Budaya</span>
                </button>

                <button
                    type="button"
                    onClick={() => setActiveCategoryTab('marine')}
                    className={`flex cursor-pointer items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                        activeCategoryTab === 'marine'
                            ? 'border-[#e9c176] bg-[#e9c176] font-bold text-[#0D182E] shadow-md shadow-[#e9c176]/20'
                            : 'border-white/10 bg-white/5 text-[#c6c6ce] hover:border-white/25 hover:bg-white/10 hover:text-white'
                    }`}
                >
                    <Waves className="h-4 w-4" />
                    <span>Marine & Gili</span>
                </button>
            </div>

            {/* Horizontal Scroll Cards Container */}
            <div
                ref={cardsScrollRef}
                className="no-scrollbar relative z-10 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pt-1 pb-6"
            >
                {filteredDestinations.map((item) => {
                    const IconComp = item.icon;
                    return (
                        <Link
                            key={item.id}
                            href={`/guides?q=${encodeURIComponent(item.title)}`}
                            className="group glass-card relative flex h-[450px] max-w-[370px] min-w-[300px] flex-shrink-0 cursor-pointer snap-start flex-col justify-between overflow-hidden rounded-3xl border border-white/15 shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:border-[#e9c176]/60 hover:shadow-[#e9c176]/10 sm:min-w-[340px] md:min-w-[370px]"
                        >
                            <img
                                className="absolute inset-0 h-full w-full object-cover opacity-70 transition-transform duration-700 ease-out group-hover:scale-105 group-hover:opacity-85"
                                src={item.image}
                                alt={item.title}
                                loading="lazy"
                                decoding="async"
                                width={370}
                                height={450}
                            />
                            <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#0D182E] via-[#0D182E]/50 to-transparent"></div>

                            {/* Top Floating Badges */}
                            <div className="relative z-20 flex items-center justify-between gap-2 p-6">
                                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e9c176] font-bold text-[#0D182E] shadow-lg shadow-[#e9c176]/20 transition-transform group-hover:scale-110">
                                    <IconComp className="h-5 w-5" />
                                </div>
                                <span className="flex items-center gap-1 rounded-full border border-white/10 bg-[#16223B]/80 px-3 py-1 text-[11px] font-semibold text-[#c6c6ce] backdrop-blur-md">
                                    <ShieldCheck className="h-3.5 w-3.5 text-[#e9c176]" />
                                    {item.badge}
                                </span>
                            </div>

                            {/* Bottom Content */}
                            <div className="relative z-20 flex flex-col justify-end p-6 md:p-7">
                                <h3 className="mb-2 font-['Plus_Jakarta_Sans',sans-serif] text-xl font-bold text-white transition-colors group-hover:text-[#e9c176]">
                                    {item.title}
                                </h3>
                                <p className="mb-5 line-clamp-3 text-xs leading-relaxed text-[#c6c6ce] opacity-90 md:text-sm">
                                    {item.desc}
                                </p>

                                <div className="flex items-center justify-between border-t border-white/10 pt-3.5">
                                    <span className="text-[11px] font-semibold text-[#e9c176]">
                                        {item.tag}
                                    </span>
                                    <div className="inline-flex items-center gap-1 text-xs font-bold text-[#e9c176] transition-transform group-hover:translate-x-1">
                                        <span>Cari Pemandu</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}

export const DestinationGrid = memo(DestinationGridComponent);
