import { memo } from 'react';
import { Link } from '@inertiajs/react';
import {
    Sparkles,
    Lightbulb,
    Zap,
    Users,
    ShieldCheck,
    ArrowRight,
    Compass,
    Quote,
    MapPin,
    Heart,
    Award,
} from 'lucide-react';

function AboutSectionComponent() {
    const storyPoints = [
        {
            number: '01',
            icon: Lightbulb,
            iconColor: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
            title: 'Masalah di Lapangan',
            quote: 'Semuanya berawal dari sebuah masalah sederhana: bagaimana membantu guide pangkalan mendapatkan pelanggan dengan lebih mudah?',
        },
        {
            number: '02',
            icon: Zap,
            iconColor: 'text-[#e9c176] bg-[#e9c176]/10 border-[#e9c176]/20',
            title: 'Inspirasi On-Demand',
            quote: 'Terinspirasi dari cara Gojek menghubungkan pengemudi dengan pelanggan, kami mencoba membawa konsep serupa ke dunia pariwisata.',
        },
        {
            number: '03',
            icon: Users,
            iconColor: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
            title: 'Rasa Penasaran & Inovasi',
            quote: 'Berawal dari rasa penasaran, kami berdua mencoba mengubah sebuah ide menjadi inovasi digital yang dapat membantu mempertemukan guide dengan wisatawan.',
        },
        {
            number: '04',
            icon: ShieldCheck,
            iconColor: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
            title: 'Solusi Nyata untuk NTB',
            quote: 'Sebuah ide sederhana, untuk menjawab masalah yang nyata.',
        },
    ];

    return (
        <section
            id="tentang"
            className="cv-auto relative mx-auto max-w-[1440px] scroll-mt-20 overflow-hidden px-6 py-20 md:px-16"
        >
            {/* Ambient Background Glows */}
            <div className="pointer-events-none absolute top-1/3 -left-32 z-0 h-[500px] w-[500px] rounded-full bg-[#e9c176]/8 blur-[140px]" />
            <div className="pointer-events-none absolute bottom-10 right-0 z-0 h-[400px] w-[400px] rounded-full bg-emerald-500/5 blur-[120px]" />

            {/* Section Header */}
            <div className="relative z-10 mb-16 text-center">
                <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-[#e9c176]/30 bg-gradient-to-r from-[#e9c176]/20 to-[#e9c176]/5 px-4 py-1.5 shadow-sm shadow-[#e9c176]/10 backdrop-blur-md">
                    <Compass className="h-4 w-4 text-[#e9c176]" />
                    <span className="text-xs font-semibold tracking-wider text-[#e9c176] uppercase">
                        Tentang IguideU • Cerita Kami
                    </span>
                </div>
                <h2 className="mb-4 font-['Plus_Jakarta_Sans',sans-serif] text-3xl font-extrabold tracking-tight text-white md:text-5xl">
                    Dari Masalah Nyata Menjadi{' '}
                    <span className="bg-gradient-to-r from-[#f3ce87] via-[#e9c176] to-amber-300 bg-clip-text text-transparent">
                        Inovasi Digital
                    </span>
                </h2>
                <p className="mx-auto max-w-2xl text-sm leading-relaxed text-[#c6c6ce] md:text-base">
                    Kisah perjalanan dua pemuda lokal yang bertekad menghubungkan pemandu wisata pangkalan di Nusa Tenggara Barat langsung dengan para wisatawan.
                </p>
            </div>

            {/* Main Content Grid: Duo Founder Hook Visual + Storyline Cards */}
            <div className="relative z-10 grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-14">
                {/* Left Column: Visual Hook (Duo Founder Showcase) */}
                <div className="lg:col-span-5">
                    <div className="glass-card group relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-b from-[#16223B]/90 via-[#0D182E]/95 to-[#091122] p-6 shadow-2xl transition-all duration-500 hover:border-[#e9c176]/40 hover:shadow-[#e9c176]/10">
                        {/* Top Floating Badge */}
                        <div className="relative z-20 mb-4 flex items-center justify-between">
                            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-bold text-emerald-400 backdrop-blur-md">
                                <Sparkles className="h-3.5 w-3.5" />
                                <span>Inisiator & Pengembang</span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] font-medium text-[#8f9097]">
                                <MapPin className="h-3.5 w-3.5 text-[#e9c176]" />
                                <span>Lombok, NTB</span>
                            </div>
                        </div>

                        {/* Duo Photos Hook Presentation */}
                        <div className="relative mx-auto flex h-[380px] w-full items-end justify-center overflow-hidden rounded-2xl bg-gradient-to-t from-[#0D182E] via-[#16223B]/60 to-transparent sm:h-[420px]">
                            {/* Radial Glow Behind Portraits */}
                            <div className="pointer-events-none absolute top-12 h-64 w-64 rounded-full bg-gradient-to-tr from-[#e9c176]/20 via-emerald-400/15 to-transparent blur-2xl" />

                            {/* Left Founder Photo */}
                            <div className="group/f1 relative -mr-6 z-10 flex h-full w-1/2 items-end justify-center transition-transform duration-500 hover:z-20 hover:scale-105">
                                <img
                                    src="/images/about/founder-1.png"
                                    alt="Founder IguideU 1"
                                    className="h-full max-h-[380px] object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] sm:max-h-[410px]"
                                    loading="lazy"
                                />
                            </div>

                            {/* Right Founder Photo */}
                            <div className="group/f2 relative -ml-6 z-10 flex h-full w-1/2 items-end justify-center transition-transform duration-500 hover:z-20 hover:scale-105">
                                <img
                                    src="/images/about/founder-2.png"
                                    alt="Founder IguideU 2"
                                    className="h-full max-h-[380px] object-contain drop-shadow-[0_15px_25px_rgba(0,0,0,0.8)] sm:max-h-[410px]"
                                    loading="lazy"
                                />
                            </div>

                            {/* Bottom Fade Gradient Overlay */}
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-24 bg-gradient-to-t from-[#0D182E] via-[#0D182E]/80 to-transparent" />
                        </div>

                        {/* Bottom Quote & Founder Tag */}
                        <div className="relative z-20 mt-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md">
                            <div className="mb-2 flex items-center gap-2">
                                <Quote className="h-4 w-4 text-[#e9c176]" />
                                <span className="text-xs font-bold text-white">
                                    Inovasi Gen Z Lombok
                                </span>
                            </div>
                            <p className="text-xs leading-relaxed text-[#c6c6ce]">
                                Menjawab tantangan nyata para pemandu lokal melalui sentuhan teknologi digital yang inklusif, aman, dan transparan.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: 4 Story Cards */}
                <div className="flex flex-col justify-between space-y-4 lg:col-span-7">
                    {storyPoints.map((item, idx) => {
                        const IconComponent = item.icon;
                        return (
                            <div
                                key={idx}
                                className="glass-card group relative overflow-hidden rounded-2xl border border-white/10 bg-[#16223B]/60 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#e9c176]/40 hover:bg-[#16223B]/90 hover:shadow-lg hover:shadow-black/30"
                            >
                                <div className="flex items-start gap-4">
                                    {/* Icon Badge */}
                                    <div
                                        className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border ${item.iconColor} shadow-md transition-transform duration-300 group-hover:scale-110`}
                                    >
                                        <IconComponent className="h-5 w-5" />
                                    </div>

                                    {/* Content Text */}
                                    <div className="flex-1">
                                        <div className="mb-1 flex items-center justify-between">
                                            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-xs font-bold tracking-wider text-[#e9c176] uppercase">
                                                {item.title}
                                            </h3>
                                            <span className="font-mono text-xs font-bold text-white/30">
                                                {item.number}
                                            </span>
                                        </div>
                                        <p className="font-['Plus_Jakarta_Sans',sans-serif] text-sm font-semibold leading-relaxed text-white md:text-base">
                                            "{item.quote}"
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {/* Action Call To Actions */}
                    <div className="flex flex-wrap items-center gap-4 pt-2">
                        <Link
                            href="/guides"
                            className="inline-flex items-center gap-2 rounded-xl bg-[#e9c176] px-6 py-3 text-xs font-bold text-[#0D182E] shadow-md shadow-[#e9c176]/20 transition-all duration-300 hover:scale-105 hover:bg-[#f3ce87] active:scale-95"
                        >
                            <Compass className="h-4 w-4" />
                            <span>Jelajahi Pemandu Wisata</span>
                            <ArrowRight className="h-4 w-4" />
                        </Link>

                        <Link
                            href="/join-guide"
                            className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-xs font-semibold text-white backdrop-blur-md transition-all duration-300 hover:border-[#e9c176]/60 hover:bg-[#e9c176]/10 hover:text-[#e9c176]"
                        >
                            <Sparkles className="h-4 w-4 text-[#e9c176]" />
                            <span>Daftar Menjadi Mitra Guide</span>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Special Acknowledgement / Ucapan Terima Kasih Banner */}
            <div className="relative z-10 mt-16 overflow-hidden rounded-3xl border border-[#e9c176]/30 bg-gradient-to-br from-[#16223B]/90 via-[#0D182E]/95 to-[#16223B]/80 p-8 shadow-2xl backdrop-blur-xl md:p-10">
                {/* Background Glow */}
                <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#e9c176]/10 blur-3xl" />

                <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
                    {/* Text Acknowledgement */}
                    <div className="flex-1">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#e9c176]/30 bg-[#e9c176]/10 px-3.5 py-1.5">
                            <Heart className="h-4 w-4 text-[#e9c176]" />
                            <span className="text-xs font-bold tracking-wide text-[#e9c176] uppercase">
                                Ucapan Terima Kasih & Apresiasi
                            </span>
                        </div>

                        <h3 className="mb-4 font-['Plus_Jakarta_Sans',sans-serif] text-xl font-extrabold text-white md:text-2xl">
                            Apresiasi untuk UKM CCC & Trunojoyo Creative Competition
                        </h3>

                        <div className="space-y-3.5 text-xs leading-relaxed text-[#c6c6ce] md:text-sm">
                            <p>
                                Terima kasih kepada <strong>UKM CCC (Creative Computer Club) Universitas Trunojoyo Madura</strong> yang telah menyelenggarakan <em>Trunojoyo Creative Competition</em> sebagai wadah bagi mahasiswa untuk menyalurkan ide, kreativitas, dan inovasi melalui karya digital.
                            </p>
                            <p>
                                Bagi kami, kesempatan ini bukan sekadar tentang mengikuti sebuah kompetisi, tetapi juga menjadi ruang untuk belajar, mencoba hal baru, bertukar gagasan, dan mengembangkan ide menjadi sebuah karya yang nyata.
                            </p>
                            <p>
                                Terima kasih telah membuka ruang bagi kami untuk berkarya dan menjadi bagian dari pengalaman yang berharga ini.
                            </p>
                        </div>

                        <div className="mt-5 inline-flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-bold text-amber-300">
                            <Award className="h-4 w-4" />
                            <span>"Terus berkarya, terus berinovasi."</span>
                        </div>
                    </div>

                    {/* Logos Showcase */}
                    <div className="flex flex-row items-center justify-center gap-4 self-center rounded-2xl border border-white/10 bg-[#091122]/70 p-5 shadow-inner sm:gap-6 lg:self-auto">
                        <div className="group flex flex-col items-center gap-2">
                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-black/40 p-2 shadow-lg transition-transform duration-300 group-hover:scale-105 sm:h-24 sm:w-24">
                                <img
                                    src="/images/about/ukm-ccc-logo.jpg"
                                    alt="Logo UKM CCC Universitas Trunojoyo Madura"
                                    className="h-full w-full object-contain"
                                    loading="lazy"
                                />
                            </div>
                            <span className="text-center text-[10px] font-semibold text-[#8f9097] group-hover:text-white">
                                UKM CCC UTM
                            </span>
                        </div>

                        <div className="h-16 w-px bg-white/10" />

                        <div className="group flex flex-col items-center gap-2">
                            <div className="flex h-20 w-20 items-center justify-center rounded-2xl border border-white/10 bg-black/40 p-2 shadow-lg transition-transform duration-300 group-hover:scale-105 sm:h-24 sm:w-24">
                                <img
                                    src="/images/about/tcc-logo.jpg"
                                    alt="Logo Trunojoyo Creative Competition"
                                    className="h-full w-full object-contain"
                                    loading="lazy"
                                />
                            </div>
                            <span className="text-center text-[10px] font-semibold text-[#8f9097] group-hover:text-white">
                                TCC Competition
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export const AboutSection = memo(AboutSectionComponent);
