// ──────────────────────────────────────────────────────────────
// IguideU — Guide Search Card (Human-Centric & Dark Luxury Style)
// ──────────────────────────────────────────────────────────────

import { Link } from '@inertiajs/react';
import { Star, MapPin, Sparkles, ShieldCheck } from 'lucide-react';
import { MockGuide } from '@/types/guide';

interface GuideSearchCardProps {
    guide: MockGuide;
    searchQuery?: string;
}

export function GuideSearchCard({
    guide,
    searchQuery = '',
}: GuideSearchCardProps) {
    // ─── Format Currency ──────────────────────────────────────────
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    // Calculate subtle reference price for original strike-through
    const originalPrice = Math.round((guide.dailyRate * 1.2) / 10000) * 10000;

    // ─── Contextual Highlight Logic (Search Matching) ─────────────
    const getContextualHighlight = () => {
        const query = searchQuery.trim().toLowerCase();

        if (query) {
            if (guide.serviceAreas && guide.serviceAreas.length > 0) {
                const matchedArea = guide.serviceAreas.find(
                    (area) =>
                        area.toLowerCase().includes(query) ||
                        query.includes(area.toLowerCase()),
                );
                if (matchedArea) {
                    return `Rute ${matchedArea}`;
                }
            }

            if (guide.specialty.toLowerCase().includes(query)) {
                return `Spesialis ${guide.specialty}`;
            }

            if (
                guide.location.toLowerCase().includes(query) ||
                guide.city.toLowerCase().includes(query)
            ) {
                return `Area ${guide.city}`;
            }
        }
        return null;
    };

    const highlightText = getContextualHighlight();

    return (
        <Link
            href={`/guides/${guide.id}`}
            className="group flex flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#16223B] transition-all duration-300 hover:-translate-y-1 hover:border-[#C5A059] hover:shadow-[0_10px_28px_rgba(0,0,0,0.45)]"
        >
            <div>
                {/* ─── Image Container with Aspect Ratio ─── */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#0D182E] sm:aspect-square">
                    <img
                        src={guide.image}
                        alt={guide.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        style={{ objectPosition: 'center 35%' }}
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#16223B]/90 via-transparent to-transparent" />

                    {/* Subtle Status Chip (Top Left) */}
                    <div className="absolute top-2.5 left-2.5 z-10">
                        {guide.availableNow ? (
                            <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-[#0D182E]/85 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 shadow-sm backdrop-blur-md">
                                <span className="relative flex h-1.5 w-1.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                                </span>
                                <span>Tersedia</span>
                            </div>
                        ) : guide.verified ? (
                            <div className="flex items-center gap-1 rounded-full border border-[#C5A059]/40 bg-[#0D182E]/85 px-2 py-0.5 text-[10px] font-semibold text-[#C5A059] shadow-sm backdrop-blur-md">
                                <ShieldCheck className="h-3 w-3" />
                                <span>Verified</span>
                            </div>
                        ) : null}
                    </div>

                    {/* Language Capsule Tag (Top Right) */}
                    <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 rounded-full border border-white/10 bg-black/60 px-2 py-0.5 text-[10px] backdrop-blur-md">
                        {guide.languages.map((lang, idx) => (
                            <span key={idx} title={lang.label}>
                                {lang.flag}
                            </span>
                        ))}
                    </div>
                </div>

                {/* ─── Card Body (Spacious & Clean Typography) ─── */}
                <div className="flex flex-col gap-2 p-3.5 sm:p-4">
                    {/* Name & Service Areas (Destinasi Utama) */}
                    <div>
                        <h3 className="line-clamp-1 font-['Plus_Jakarta_Sans'] text-sm font-bold tracking-tight text-white transition-colors group-hover:text-[#C5A059] sm:text-base">
                            {guide.name}
                        </h3>
                        <p
                            className="mt-0.5 line-clamp-1 text-xs font-medium text-slate-300"
                            title={
                                guide.serviceAreas &&
                                guide.serviceAreas.length > 0
                                    ? guide.serviceAreas.join(', ')
                                    : guide.location
                            }
                        >
                            {guide.serviceAreas && guide.serviceAreas.length > 0
                                ? guide.serviceAreas.join(' • ')
                                : guide.location}
                        </p>
                    </div>

                    {/* Contextual Search Match Highlight Tag (if query active) */}
                    {highlightText && (
                        <div className="flex w-fit items-center gap-1.5 rounded-md border border-[#C5A059]/20 bg-[#C5A059]/10 px-2 py-0.5 text-[11px] font-medium text-[#C5A059]">
                            <Sparkles className="h-3 w-3 text-[#C5A059]" />
                            <span className="truncate">{highlightText}</span>
                        </div>
                    )}

                    {/* Price Section (Clean, Bold Gold + Subtle Strikethrough) */}
                    <div className="flex items-baseline gap-1.5 pt-1">
                        <span className="font-['Plus_Jakarta_Sans'] text-base font-extrabold text-[#C5A059] sm:text-lg">
                            {formatPrice(guide.dailyRate)}
                        </span>
                        <span className="text-[11px] font-normal text-[#79849f]">
                            / hari
                        </span>
                        <span className="ml-1 text-xs font-normal text-[#79849f]/60 line-through">
                            {formatPrice(originalPrice)}
                        </span>
                    </div>
                </div>
            </div>

            {/* ─── Card Footer: Rating & Location Balanced Row ─── */}
            <div className="flex items-center justify-between border-t border-white/5 px-3.5 pt-2 pb-3.5 text-xs sm:px-4">
                {/* Rating & Review Count */}
                <div className="flex items-center gap-1.5">
                    <Star className="h-3.5 w-3.5 fill-[#C5A059] text-[#C5A059]" />
                    <span className="text-xs font-bold text-white">
                        {guide.rating}
                    </span>
                    <span className="text-[11px] font-normal text-[#79849f]">
                        ({guide.reviews})
                    </span>
                </div>

                {/* Location with Pin */}
                <div className="flex max-w-[50%] items-center gap-1 truncate text-[11px] font-medium text-slate-400">
                    <MapPin className="h-3 w-3 shrink-0 text-[#C5A059]" />
                    <span className="truncate">{guide.city}</span>
                </div>
            </div>
        </Link>
    );
}
