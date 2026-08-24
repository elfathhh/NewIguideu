import { useState, useRef, useEffect } from 'react';
import { ArrowUpDown, Check } from 'lucide-react';
import { SortOption } from '@/types/guide';

interface SortDropdownProps {
    value: SortOption;
    onChange: (value: SortOption) => void;
    totalResults?: number;
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
    { value: 'rating_desc', label: 'Rating Tertinggi' },
    { value: 'reviews_desc', label: 'Ulasan Terbanyak' },
    { value: 'price_asc', label: 'Harga: Rendah ke Tinggi' },
    { value: 'price_desc', label: 'Harga: Tinggi ke Rendah' },
    { value: 'newest', label: 'Terbaru' },
];

export function SortDropdown({
    value,
    onChange,
    totalResults,
}: SortDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const activeLabel =
        SORT_OPTIONS.find((opt) => opt.value === value)?.label ||
        'Rating Tertinggi';

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="flex w-full items-center justify-between gap-4">
            {/* Quick Sort Pills (Stitch Retail Style) */}
            <div className="hide-scrollbar flex items-center gap-2 overflow-x-auto py-1">
                <span className="mr-1 text-xs font-semibold tracking-wider whitespace-nowrap text-[#94A3B8] uppercase">
                    Urutkan:
                </span>
                {SORT_OPTIONS.map((opt) => {
                    const isActive = opt.value === value;
                    return (
                        <button
                            key={opt.value}
                            type="button"
                            onClick={() => onChange(opt.value)}
                            className={`rounded-full px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                                isActive
                                    ? 'border border-[#C5A059] bg-[#101b31] text-[#C5A059] shadow-sm'
                                    : 'border border-white/10 bg-transparent text-white/80 hover:border-[#C5A059]/50 hover:text-white'
                            }`}
                        >
                            {opt.label}
                        </button>
                    );
                })}
            </div>

            {/* Mobile Dropdown fallback */}
            <div className="relative shrink-0 md:hidden" ref={dropdownRef}>
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 rounded-lg border border-[#C5A059]/40 bg-[#16223B] px-3 py-1.5 text-xs font-bold text-[#C5A059]"
                >
                    <ArrowUpDown className="h-3.5 w-3.5" />
                    <span>{activeLabel}</span>
                </button>

                {isOpen && (
                    <div className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border border-white/15 bg-[#16223B] py-1 shadow-2xl">
                        {SORT_OPTIONS.map((option) => {
                            const isActive = option.value === value;
                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`flex w-full items-center justify-between px-3 py-2 text-xs transition-colors ${
                                        isActive
                                            ? 'bg-white/5 font-bold text-[#C5A059]'
                                            : 'text-[#94A3B8] hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    <span>{option.label}</span>
                                    {isActive && (
                                        <Check className="h-3.5 w-3.5 text-[#C5A059]" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
