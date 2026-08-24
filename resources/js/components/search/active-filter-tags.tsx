import { X } from 'lucide-react';
import { SearchFiltersState, AVAILABLE_LANGUAGES } from '@/types/guide';

interface ActiveFilterTagsProps {
    filters: SearchFiltersState;
    onRemoveFilter: (key: string, value?: string) => void;
    onClearAll: () => void;
}

export function ActiveFilterTags({
    filters,
    onRemoveFilter,
    onClearAll,
}: ActiveFilterTagsProps) {
    const activeTags: { key: string; value?: string; label: string }[] = [];

    // Query
    if (filters.query) {
        activeTags.push({
            key: 'query',
            label: `Pencarian: "${filters.query}"`,
        });
    }

    // Cities
    filters.cities.forEach((city) => {
        activeTags.push({ key: 'cities', value: city, label: city });
    });

    // Languages
    filters.languages.forEach((langCode) => {
        const langInfo = AVAILABLE_LANGUAGES.find((l) => l.code === langCode);
        if (langInfo) {
            activeTags.push({
                key: 'languages',
                value: langCode,
                label: `Bahasa: ${langInfo.label}`,
            });
        }
    });

    // Minimum Rating
    if (filters.minRating) {
        activeTags.push({
            key: 'minRating',
            label: `Rating: ${filters.minRating}+ Bintang`,
        });
    }

    // Verified Only
    if (filters.verifiedOnly) {
        activeTags.push({ key: 'verifiedOnly', label: 'Hanya Terverifikasi' });
    }

    // Price Range (Only show if not default [0, 1500000])
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1500000) {
        const formatPrice = (val: number) => `Rp${(val / 1000).toFixed(0)}k`;
        activeTags.push({
            key: 'priceRange',
            label: `Harga: ${formatPrice(filters.priceRange[0])} - ${formatPrice(filters.priceRange[1])}`,
        });
    }

    if (activeTags.length === 0) return null;

    return (
        <div className="mb-6 flex flex-wrap items-center gap-2">
            <span className="mr-1 text-sm text-[#8f9097]">Filter aktif:</span>

            {activeTags.map((tag, idx) => (
                <span
                    key={`${tag.key}-${tag.value || idx}`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-[#e9c176]/30 bg-[#e9c176]/15 px-3 py-1.5 text-xs font-semibold text-[#e9c176] shadow-sm backdrop-blur-sm"
                >
                    {tag.label}
                    <button
                        onClick={() => onRemoveFilter(tag.key, tag.value)}
                        className="rounded-full p-0.5 transition-colors hover:bg-[#e9c176]/20 focus:ring-1 focus:ring-[#e9c176] focus:outline-none"
                        aria-label={`Remove filter ${tag.label}`}
                    >
                        <X className="h-3.5 w-3.5" />
                    </button>
                </span>
            ))}

            <button
                onClick={onClearAll}
                className="ml-2 text-xs font-semibold text-red-400 transition-colors hover:text-red-300 focus:outline-none"
            >
                Hapus Semua
            </button>
        </div>
    );
}
