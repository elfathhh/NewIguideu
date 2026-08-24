import React from 'react';
import { MapPin, SlidersHorizontal, Search } from 'lucide-react';

interface SearchHeroProps {
    query: string;
    onQueryChange: (query: string) => void;
    onSearch: () => void;
    totalResults: number;
    onToggleFilters?: () => void;
}

export function SearchHero({
    query,
    onQueryChange,
    onSearch,
    totalResults,
    onToggleFilters,
}: SearchHeroProps) {
    return (
        <section className="relative flex flex-col items-center justify-center overflow-hidden bg-[#0D182E] pt-24 pb-12">
            {/* Subtle radial gold glow background */}
            <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,_#111d35_0%,_#0D182E_100%)]" />

            <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-6 text-center">
                <h1 className="mb-4 font-['Plus_Jakarta_Sans'] text-3xl font-extrabold text-white md:text-5xl">
                    Temukan Pemandu Wisata Anda
                </h1>
                <p className="mb-8 text-lg text-[#8f9097]">
                    <span className="font-semibold text-[#e9c176]">
                        {totalResults}
                    </span>{' '}
                    pemandu wisata terverifikasi siap menemani perjalanan Anda
                </p>

                {/* Search Bar Container */}
                <div className="glass-panel flex w-full max-w-3xl flex-col items-stretch gap-2 rounded-[2rem] border border-white/10 bg-white/5 p-2 backdrop-blur-xl sm:flex-row sm:items-center">
                    <div className="flex flex-1 items-center rounded-full bg-transparent px-4 py-2 transition-all focus-within:border-[#e9c176]/60 focus-within:ring-2 focus-within:ring-[#e9c176]/20 sm:py-0">
                        <MapPin className="mr-3 h-5 w-5 shrink-0 text-[#8f9097]" />
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => onQueryChange(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                            placeholder="Cari nama pemandu, destinasi, atau keahlian..."
                            className="w-full bg-transparent py-3 text-white placeholder-[#8f9097] focus:outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-2 px-2 sm:px-0">
                        <button
                            onClick={onToggleFilters}
                            className="flex items-center justify-center rounded-full border border-white/10 bg-white/5 p-3 text-white transition-colors hover:bg-white/10 sm:p-4 md:hidden"
                        >
                            <SlidersHorizontal className="h-5 w-5" />
                        </button>

                        <button
                            onClick={onSearch}
                            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#e9c176] px-6 py-3 font-semibold text-[#0D182E] transition-all duration-300 hover:-translate-y-1 hover:bg-[#f3ce87] hover:shadow-[0_4px_20px_rgba(233,193,118,0.3)] sm:flex-none sm:py-4"
                        >
                            <Search className="h-5 w-5" />
                            <span>Cari Pemandu</span>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
