import { memo } from 'react';
import {
    Star,
    ShieldCheck,
    Award,
    MapPin,
    ArrowRight,
    Sparkles,
    Quote,
    UserCheck,
    Compass,
} from 'lucide-react';
import { Link } from '@inertiajs/react';

export interface GuideLanguage {
    code: string;
    flag: string;
    label: string;
}

export interface GuideBadge {
    text: string;
    type: 'verified' | 'certified' | 'super';
}

export interface ShowcaseGuide {
    id: number;
    name: string;
    specialty: string;
    location: string;
    rating: string;
    reviews: number;
    exp?: string;
    experience?: string;
    price: string;
    unit: string;
    quote?: string;
    bio?: string;
    badges: GuideBadge[];
    languages: GuideLanguage[];
    image: string;
}

interface GuideShowcaseProps {
    guides?: ShowcaseGuide[];
}

function GuideShowcaseComponent({ guides = [] }: GuideShowcaseProps) {
    if (!guides || guides.length === 0) {
        return (
            <section
                id="pemandu"
                className="cv-auto relative mx-auto max-w-[1440px] scroll-mt-20 px-6 py-20 md:px-16"
            >
                <div className="mb-14 text-center">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#e9c176]/30 bg-[#e9c176]/10 px-4 py-1.5 backdrop-blur-md">
                        <Award className="h-4 w-4 text-[#e9c176]" />
                        <span className="text-xs font-semibold tracking-wider text-[#e9c176] uppercase">
                            Pemandu Wisata Terverifikasi
                        </span>
                    </div>
                    <h2 className="mb-4 font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-extrabold text-white md:text-4xl">
                        Jelajahi Bersama Ahlinya
                    </h2>
                    <p className="mx-auto max-w-xl text-sm leading-relaxed text-[#c6c6ce]">
                        Setiap pemandu di IguideU melewati verifikasi identitas resmi, lisensi BNSP/PADI/HPI, serta standar pelayanan profesional lokal NTB.
                    </p>
                </div>

                <div className="glass-panel mx-auto max-w-xl rounded-3xl border border-white/10 p-8 text-center">
                    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e9c176]/15 text-[#e9c176]">
                        <Compass className="h-7 w-7" />
                    </div>
                    <h3 className="mb-2 text-lg font-bold text-white">
                        Pemandu Terverifikasi Segera Hadir
                    </h3>
                    <p className="mb-6 text-xs text-[#c6c6ce] leading-relaxed">
                        Anda pemandu wisata lokal di NTB? Daftarkan diri Anda sekarang untuk mulai menerima pesanan wisatawan secara langsung.
                    </p>
                    <Link
                        href="/join-guide"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#e9c176] px-6 py-2.5 text-xs font-bold text-[#0D182E] shadow-md transition-all hover:bg-[#f3ce87]"
                    >
                        <Sparkles className="h-4 w-4" />
                        <span>Daftar Sebagai Pemandu Wisata</span>
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <section
            id="pemandu"
            className="cv-auto relative mx-auto max-w-[1440px] scroll-mt-20 px-6 py-20 md:px-16"
        >
            {/* Section Title */}
            <div className="mb-14 text-center">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#e9c176]/30 bg-[#e9c176]/10 px-4 py-1.5 backdrop-blur-md">
                    <Award className="h-4 w-4 text-[#e9c176]" />
                    <span className="text-xs font-semibold tracking-wider text-[#e9c176] uppercase">
                        Pemandu Wisata Terverifikasi
                    </span>
                </div>
                <h2 className="mb-4 font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-extrabold text-white md:text-4xl">
                    Jelajahi Bersama Ahlinya
                </h2>
                <p className="mx-auto max-w-xl text-sm leading-relaxed text-[#c6c6ce]">
                    Setiap pemandu di IguideU melewati verifikasi identitas
                    resmi, lisensi BNSP/PADI/HPI, serta standar pelayanan
                    profesional lokal NTB.
                </p>
            </div>

            {/* Guide Cards Grid */}
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {guides.slice(0, 6).map((guide) => (
                    <div
                        key={guide.id}
                        className="glass-card group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/10 bg-[#0D182E]/60 p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#e9c176]/50 hover:shadow-2xl hover:shadow-[#e9c176]/10"
                    >
                        {/* Top Card Body */}
                        <div>
                            {/* 1. Gambar Utama (Human Element Headshot) */}
                            <Link
                                href={`/guides/${guide.id}`}
                                className="relative mb-5 block aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#091122] shadow-inner"
                            >
                                <img
                                    src={guide.image}
                                    alt={`Foto headshot pemandu ${guide.name}`}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    style={{ objectPosition: 'center 35%' }}
                                    loading="lazy"
                                    decoding="async"
                                    width={400}
                                    height={300}
                                />
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0D182E]/80 via-transparent to-transparent opacity-75" />

                                {/* 2. Authority Badges (Symmetrical Top Placement) */}
                                <div className="pointer-events-none absolute inset-x-3 top-3 z-10 flex items-center justify-between gap-2">
                                    {/* Left: Verified Badge */}
                                    {guide.badges.some((b) => b.type === 'verified') && (
                                        <div className="flex items-center gap-1 rounded-full border border-emerald-500/40 bg-[#0D182E]/85 px-2.5 py-1 text-[11px] font-semibold text-emerald-400 shadow-md backdrop-blur-md">
                                            <ShieldCheck className="h-3.5 w-3.5 shrink-0" />
                                            <span>
                                                {guide.badges.find((b) => b.type === 'verified')?.text || 'Terverifikasi'}
                                            </span>
                                        </div>
                                    )}

                                    {/* Right: Secondary Authority Badge (Super Guide / BNSP) */}
                                    {guide.badges.some((b) => b.type !== 'verified') && (
                                        <div
                                            className={`ml-auto flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-semibold shadow-md backdrop-blur-md ${
                                                guide.badges.find((b) => b.type !== 'verified')?.type === 'super'
                                                    ? 'border-[#e9c176]/50 bg-[#0D182E]/85 text-[#e9c176]'
                                                    : 'border-sky-400/40 bg-[#0D182E]/85 text-sky-300'
                                            }`}
                                        >
                                            {guide.badges.find((b) => b.type !== 'verified')?.type === 'super' ? (
                                                <Sparkles className="h-3.5 w-3.5 shrink-0" />
                                            ) : (
                                                <UserCheck className="h-3.5 w-3.5 shrink-0" />
                                            )}
                                            <span>
                                                {guide.badges.find((b) => b.type !== 'verified')?.text}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </Link>

                            {/* Teks Baris 1: Nama Lengkap & Ikon Bahasa */}
                            <div className="mb-1.5 flex items-start justify-between gap-2">
                                <Link
                                    href={`/guides/${guide.id}`}
                                    className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-bold text-white transition-colors hover:text-[#e9c176] group-hover:text-[#e9c176]"
                                >
                                    {guide.name}
                                </Link>
                                {/* Ikon & Tag Bahasa */}
                                <div className="flex shrink-0 items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300">
                                    {guide.languages.map((lang, idx) => (
                                        <span
                                            key={idx}
                                            title={lang.label}
                                            className="cursor-default"
                                        >
                                            {lang.flag}{' '}
                                            <span className="text-[10px] font-medium">
                                                {lang.code}
                                            </span>
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Teks Baris 2: Keahlian Spesifik / Niche Title */}
                            <p className="mb-3 line-clamp-1 text-xs font-semibold tracking-wide text-[#e9c176]">
                                {guide.specialty}
                            </p>

                            {/* Teks Baris 3: Kutipan Personal (Personal Bio Quote) */}
                            <div className="relative mb-4 rounded-xl border-l-2 border-[#e9c176]/60 bg-white/[0.03] p-3 text-xs leading-relaxed text-[#c6c6ce] italic">
                                <Quote className="absolute top-2 right-2 h-3.5 w-3.5 text-white/10" />
                                <p className="relative z-10 line-clamp-2 font-normal">
                                    "{guide.quote || guide.bio || 'Siap mendampingi petualangan Anda di Lombok & Sumbawa.'}"
                                </p>
                            </div>

                            {/* Teks Baris 4: ⭐ Rating & Jumlah Ulasan | Lokasi */}
                            <div className="mb-5 flex items-center justify-between border-t border-white/5 pt-3 text-xs text-[#8f9097]">
                                <div className="flex items-center gap-1.5 font-semibold text-white">
                                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                                    <span>{guide.rating}</span>
                                    <span className="font-normal text-[#8f9097]">
                                        ({guide.reviews} ulasan)
                                    </span>
                                </div>
                                <div className="flex items-center gap-1 text-[#8f9097]">
                                    <MapPin className="h-3.5 w-3.5 text-[#e9c176]" />
                                    <span className="max-w-[130px] truncate">{guide.location}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer Kartu: Transparansi Harga & Action CTA */}
                        <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-4">
                            <div>
                                <span className="block text-[11px] text-[#8f9097]">
                                    Mulai dari
                                </span>
                                <p className="text-base font-bold text-white">
                                    {guide.price}{' '}
                                    <span className="text-xs font-normal text-[#8f9097]">
                                        {guide.unit}
                                    </span>
                                </p>
                            </div>
                            <Link
                                href={`/guides/${guide.id}`}
                                className="flex items-center gap-2 rounded-xl border border-[#e9c176]/40 bg-[#e9c176]/10 px-4 py-2.5 text-xs font-bold text-[#e9c176] shadow-md transition-all hover:border-[#e9c176] hover:bg-[#e9c176] hover:text-[#0D182E] active:scale-95"
                            >
                                <span>Lihat Profil</span>
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom View All Link */}
            <div className="mt-12 text-center">
                <Link
                    href="/guides"
                    className="inline-flex items-center gap-2 rounded-full border border-[#e9c176]/40 bg-[#e9c176]/10 px-8 py-3 text-sm font-bold text-[#e9c176] shadow-lg shadow-[#e9c176]/10 transition-all hover:scale-105 hover:border-[#e9c176] hover:bg-[#e9c176] hover:text-[#0D182E]"
                >
                    <Compass className="h-4 w-4" />
                    <span>Jelajahi Semua Pemandu NTB</span>
                    <ArrowRight className="h-4 w-4" />
                </Link>
            </div>
        </section>
    );
}

export const GuideShowcase = memo(GuideShowcaseComponent);

