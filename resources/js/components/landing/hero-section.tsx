import { useState } from 'react';
import { MapPin, Search } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function HeroSection() {
    const [location, setLocation] = useState('');

    return (
        <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden px-6 pt-16 pb-28 md:px-16">
            {/* Background Overlay & Cinematic Image */}
            <div className="absolute inset-0 z-0">
                <img
                    className="h-full w-full object-cover opacity-40 mix-blend-overlay"
                    src="https://images.pexels.com/photos/30013786/pexels-photo-30013786.jpeg"
                    alt="IguideU Hero Lombok Sumbawa Destination"
                    fetchPriority="high"
                    decoding="async"
                    width={1920}
                    height={1080}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D182E]/95 via-[#0D182E]/75 to-transparent"></div>
            </div>

            <div className="relative z-10 mx-auto flex w-full max-w-[1440px] flex-col items-center text-center">
                <h1 className="text-shadow-glow mb-6 max-w-4xl font-['Plus_Jakarta_Sans',sans-serif] text-4xl font-extrabold text-white md:text-6xl md:leading-[1.15]">
                    Jelajahi Eksotisme Nusa Tenggara Barat.
                </h1>
                <p className="mb-10 max-w-2xl text-lg text-[#c6c6ce]">
                    Platform terverifikasi untuk mempercepat koneksi Anda dengan
                    pemandu wisata lokal terbaik di Lombok & Sumbawa.
                </p>

                {/* Smart Full-Width Search Bar */}
                <div className="glass-panel ambient-shadow w-full max-w-4xl rounded-2xl p-2.5 md:p-3">
                    <form
                        className="flex w-full items-center gap-2.5 rounded-xl bg-[#16223B]/60 p-2"
                        onSubmit={(e) => {
                            e.preventDefault();
                            const query = location.trim();
                            router.visit(
                                `/guides${query ? `?q=${encodeURIComponent(query)}` : ''}`,
                            );
                        }}
                    >
                        {/* Location / Destination Search Input (Fills remaining space) */}
                        <div className="flex flex-1 items-center gap-3 rounded-xl border border-transparent bg-white/5 px-4 py-3.5 transition-all focus-within:border-[#e9c176]/60 focus-within:bg-white/[0.08] focus-within:ring-2 focus-within:ring-[#e9c176]/20">
                            <MapPin className="h-5 w-5 flex-shrink-0 text-[#e9c176]" />
                            <input
                                className="w-full border-none bg-transparent text-sm font-medium text-[#e2e2e2] placeholder:text-[#8f9097] focus:outline-none md:text-base"
                                placeholder="Ke mana Anda ingin pergi? (Cth: Mandalika, Gili Trawangan, Rinjani)"
                                type="text"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>

                        {/* Submit Search Button */}
                        <button
                            type="submit"
                            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#e9c176] px-6 py-3.5 text-sm font-bold text-[#0D182E] shadow-lg transition-all hover:bg-[#f3ce87] hover:shadow-[#e9c176]/20 active:scale-95 md:px-8 md:text-base"
                        >
                            <Search className="h-5 w-5" />
                            <span>Cari Pemandu</span>
                        </button>
                    </form>
                </div>

                {/* Trending Popular Search Chips */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-[#8f9097]">
                    <span className="font-semibold text-[#e9c176]">
                        🔥 Populer:
                    </span>
                    {[
                        'Rinjani',
                        'Gili Trawangan',
                        'Mandalika',
                        'Sembalun',
                        'Desa Sade',
                        'Tambora',
                    ].map((dest) => (
                        <button
                            key={dest}
                            type="button"
                            onClick={() => {
                                setLocation(dest);
                                router.visit(
                                    `/guides?q=${encodeURIComponent(dest)}`,
                                );
                            }}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-[#c6c6ce] transition-all hover:border-[#e9c176]/50 hover:bg-[#e9c176]/15 hover:text-white"
                        >
                            {dest}
                        </button>
                    ))}
                </div>
            </div>
        </section>
    );
}
