// ──────────────────────────────────────────────────────────────
// IguideU — Guide Search Results (3-Tier Filter System)
// ──────────────────────────────────────────────────────────────

import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { SearchFilters } from '@/components/search/search-filters';
import { GuideSearchCard } from '@/components/search/guide-search-card';
import {
    type SearchFiltersState,
    type SortOption,
    type MockGuide,
    DEFAULT_FILTERS,
    ITEMS_PER_PAGE,
} from '@/types/guide';
import {
    Search,
    Bell,
    User,
    SlidersHorizontal,
    SearchX,
    X,
    ChevronDown,
} from 'lucide-react';
import { LanguageProvider } from '@/contexts/language-context';
import { useTranslation } from '@/hooks/use-translations';
import { GuidesHeader } from '@/components/search/guides-header';

function GuidesSearchContent() {
    const { t } = useTranslation();
    const { props } = usePage<{ serverGuides?: MockGuide[] }>();
    const guidesSource = props.serverGuides || [];

    // ─── Read query param from URL ──────────────────────────────
    const urlParams =
        typeof window !== 'undefined'
            ? new URLSearchParams(window.location.search)
            : null;
    const initialQuery = urlParams?.get('q') || '';

    // ─── Filter State ─────────────────────────────────────────────
    const [filters, setFilters] = useState<SearchFiltersState>({
        ...DEFAULT_FILTERS,
        query: initialQuery,
    });
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

    const sortDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                sortDropdownRef.current &&
                !sortDropdownRef.current.contains(event.target as Node)
            ) {
                setSortDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // ─── Filter Logic ─────────────────────────────────────────────
    const filteredGuides = useMemo(() => {
        let result = [...guidesSource];

        // Keyword search (name, specialty, location, bio, service areas)
        if (filters.query) {
            const q = filters.query.toLowerCase();
            result = result.filter(
                (g) =>
                    g.name.toLowerCase().includes(q) ||
                    g.specialty.toLowerCase().includes(q) ||
                    g.location.toLowerCase().includes(q) ||
                    g.bio.toLowerCase().includes(q) ||
                    g.serviceAreas?.some((area) =>
                        area.toLowerCase().includes(q),
                    ),
            );
        }

        // Tier 1: Availability
        if (filters.availableNow) {
            result = result.filter((g) => g.availableNow);
        }

        // Tier 1: Price Range Min - Max
        if (typeof filters.priceMin === 'number') {
            const min = filters.priceMin;
            result = result.filter((g) => g.dailyRate >= min);
        }
        if (typeof filters.priceMax === 'number') {
            const max = filters.priceMax;
            result = result.filter((g) => g.dailyRate <= max);
        }

        // Tier 2: Vehicles & Transportation
        if (filters.vehicles.length > 0) {
            result = result.filter((g) =>
                filters.vehicles.some((v) => g.vehicles.includes(v)),
            );
        }

        // Tier 2: Verified Only
        if (filters.verifiedOnly) {
            result = result.filter((g) => g.verified);
        }

        // Tier 2: Rating 4.0+
        if (filters.minRating4) {
            result = result.filter((g) => parseFloat(g.rating) >= 4.0);
        }

        if (filters.minRating) {
            result = result.filter(
                (g) => parseFloat(g.rating) >= filters.minRating!,
            );
        }

        // Tier 3: Languages
        if (filters.languages.length > 0) {
            result = result.filter((g) =>
                g.languages.some((l) => filters.languages.includes(l.code)),
            );
        }

        // Tier 3: Pax Capacity
        if (filters.paxCapacity && filters.paxCapacity !== 'all') {
            if (filters.paxCapacity === '1-2') {
                result = result.filter((g) => g.maxPax <= 2 || g.maxPax >= 1);
            } else if (filters.paxCapacity === '3-5') {
                result = result.filter((g) => g.maxPax >= 3 && g.maxPax <= 5);
            } else if (filters.paxCapacity === '6+') {
                result = result.filter((g) => g.maxPax >= 6);
            }
        }

        // Tier 3: Gender Preference
        if (filters.genderPreference && filters.genderPreference !== 'all') {
            result = result.filter(
                (g) => g.gender === filters.genderPreference,
            );
        }

        // Tier 3: Extras
        if (filters.extras.length > 0) {
            result = result.filter((g) =>
                filters.extras.every((ext) => g.extras.includes(ext)),
            );
        }

        // City filter
        if (filters.cities.length > 0) {
            result = result.filter((g) => filters.cities.includes(g.city));
        }

        // Sorting
        switch (filters.sortBy) {
            case 'rating_desc':
                result.sort(
                    (a, b) => parseFloat(b.rating) - parseFloat(a.rating),
                );
                break;
            case 'price_asc':
                result.sort((a, b) => a.dailyRate - b.dailyRate);
                break;
            case 'price_desc':
                result.sort((a, b) => b.dailyRate - a.dailyRate);
                break;
            case 'reviews_desc':
                result.sort((a, b) => b.reviews - a.reviews);
                break;
            case 'newest':
                result.sort((a, b) => b.id - a.id);
                break;
        }

        return result;
    }, [filters, guidesSource]);

    // ─── Pagination ───────────────────────────────────────────────
    const paginatedGuides = useMemo(
        () =>
            filteredGuides.slice(
                (filters.page - 1) * ITEMS_PER_PAGE,
                filters.page * ITEMS_PER_PAGE,
            ),
        [filteredGuides, filters.page],
    );

    const updateFilters = useCallback((newFilters: SearchFiltersState) => {
        setFilters(newFilters);
    }, []);

    const handleSortChange = (sortBy: SortOption) => {
        setFilters((prev) => ({ ...prev, sortBy }));
        setSortDropdownOpen(false);
    };

    const sortOptions = [
        { value: 'rating_desc', label: t('sort.top_rated') },
        { value: 'price_asc', label: t('sort.price_low') },
        { value: 'price_desc', label: t('sort.price_high') },
        { value: 'reviews_desc', label: t('sort.most_reviewed') },
        { value: 'newest', label: t('sort.newest') },
    ];

    const currentSortLabel =
        sortOptions.find((opt) => opt.value === filters.sortBy)?.label ||
        sortOptions[0].label;

    return (
        <>
            <Head title="IguideU - Guide Search Results" />

            <div className="flex min-h-screen flex-col bg-[#0D182E] pt-16 font-['Inter',sans-serif] text-white antialiased">
                {/* ─── Optimized TopNavBar Component ─── */}
                <GuidesHeader
                    searchQuery={filters.query}
                    onSearchChange={(q) =>
                        updateFilters({ ...filters, query: q, page: 1 })
                    }
                />

                {/* ─── Main Wrapper ─── */}
                <div className="relative mx-auto flex w-full max-w-[1440px] flex-1">
                    {/* ─── SideNavBar (Fixed Left Sidebar on Desktop) ─── */}
                    <SearchFilters
                        filters={filters}
                        onFiltersChange={updateFilters}
                        isOpen={mobileFiltersOpen}
                        onClose={() => setMobileFiltersOpen(false)}
                    />

                    {/* ─── Main Content Area ─── */}
                    <main className="flex w-full flex-1 flex-col gap-6 p-6 lg:ml-[280px]">
                        {/* Top Sort & Filter Action Bar */}
                        <div className="glass-panel sticky top-16 z-30 flex flex-col gap-3 rounded-xl border border-[#C5A059]/20 bg-[#16223B]/80 p-4 shadow-lg backdrop-blur-md">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="hidden text-sm font-medium text-white sm:block">
                                        {t('results.showing')}{' '}
                                        <span className="text-[#C5A059]">
                                            {paginatedGuides.length}
                                        </span>{' '}
                                        {t('results.of')}{' '}
                                        {filteredGuides.length}{' '}
                                        {t('results.guides')}
                                    </div>

                                    {/* Sort Dropdown */}
                                    <div
                                        className="relative"
                                        ref={sortDropdownRef}
                                    >
                                        <button
                                            onClick={() =>
                                                setSortDropdownOpen(
                                                    !sortDropdownOpen,
                                                )
                                            }
                                            className="flex items-center gap-2 rounded-lg border border-[#79849f]/30 bg-[#16223B] px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:border-[#C5A059]"
                                        >
                                            <span className="font-normal text-[#79849f]">
                                                {t('sort.label')}:
                                            </span>{' '}
                                            {currentSortLabel}
                                            <ChevronDown className="ml-1 h-3.5 w-3.5 text-[#79849f]" />
                                        </button>

                                        {sortDropdownOpen && (
                                            <div className="absolute top-full left-0 z-50 mt-1 min-w-[180px] overflow-hidden rounded-lg border border-[#79849f]/30 bg-[#16223B] shadow-xl">
                                                {sortOptions.map((option) => (
                                                    <div
                                                        key={option.value}
                                                        onClick={() =>
                                                            handleSortChange(
                                                                option.value as SortOption,
                                                            )
                                                        }
                                                        className={`cursor-pointer px-3 py-2 text-xs transition-colors ${
                                                            filters.sortBy ===
                                                            option.value
                                                                ? 'bg-[#C5A059]/10 font-semibold text-[#C5A059]'
                                                                : 'text-white hover:bg-[#C5A059]/10 hover:text-[#C5A059]'
                                                        }`}
                                                    >
                                                        {option.label}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setMobileFiltersOpen(true)
                                        }
                                        className="flex items-center gap-1.5 rounded-lg border border-[#C5A059] bg-[#C5A059]/10 px-3 py-1 text-xs font-bold text-[#C5A059] lg:hidden"
                                    >
                                        <SlidersHorizontal className="h-3.5 w-3.5" />
                                        <span>{t('nav.filters')}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Active Filter Chips Bar */}
                            {(filters.availableNow ||
                                filters.bookingDate ||
                                filters.priceMin !== '' ||
                                filters.priceMax !== '' ||
                                filters.vehicles.length > 0 ||
                                filters.verifiedOnly ||
                                filters.minRating4 ||
                                filters.languages.length > 0 ||
                                filters.paxCapacity !== 'all' ||
                                filters.genderPreference !== 'all' ||
                                filters.extras.length > 0) && (
                                <div className="flex flex-wrap items-center gap-2 border-t border-[#79849f]/30 pt-2 text-xs">
                                    <span className="text-[11px] font-medium text-[#79849f]">
                                        {t('results.active_filters')}:
                                    </span>

                                    {filters.availableNow && (
                                        <span className="inline-flex items-center gap-1.5 rounded-md border border-[#C5A059]/30 bg-[#C5A059]/10 px-2.5 py-1 text-[11px] font-medium text-[#C5A059]">
                                            {t('filter.available_now')}
                                            <button
                                                onClick={() =>
                                                    setFilters({
                                                        ...filters,
                                                        availableNow: false,
                                                    })
                                                }
                                                className="transition-colors hover:text-white"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    )}

                                    {filters.bookingDate && (
                                        <span className="inline-flex items-center gap-1.5 rounded-md border border-[#C5A059]/30 bg-[#C5A059]/10 px-2.5 py-1 text-[11px] font-medium text-[#C5A059]">
                                            {filters.bookingDate}
                                            <button
                                                onClick={() =>
                                                    setFilters({
                                                        ...filters,
                                                        bookingDate: '',
                                                    })
                                                }
                                                className="transition-colors hover:text-white"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    )}

                                    {(filters.priceMin !== '' ||
                                        filters.priceMax !== '') && (
                                        <span className="inline-flex items-center gap-1.5 rounded-md border border-[#C5A059]/30 bg-[#C5A059]/10 px-2.5 py-1 text-[11px] font-medium text-[#C5A059]">
                                            Rp {filters.priceMin || 0} - Rp{' '}
                                            {filters.priceMax || 'Max'}
                                            <button
                                                onClick={() =>
                                                    setFilters({
                                                        ...filters,
                                                        priceMin: '',
                                                        priceMax: '',
                                                    })
                                                }
                                                className="transition-colors hover:text-white"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    )}

                                    {filters.vehicles.map((v) => (
                                        <span
                                            key={v}
                                            className="inline-flex items-center gap-1.5 rounded-md border border-[#C5A059]/30 bg-[#C5A059]/10 px-2.5 py-1 text-[11px] font-medium text-[#C5A059] capitalize"
                                        >
                                            {t(`filter.vehicle_${v}`)}
                                            <button
                                                onClick={() =>
                                                    setFilters({
                                                        ...filters,
                                                        vehicles:
                                                            filters.vehicles.filter(
                                                                (item) =>
                                                                    item !== v,
                                                            ),
                                                    })
                                                }
                                                className="transition-colors hover:text-white"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    ))}

                                    {filters.verifiedOnly && (
                                        <span className="inline-flex items-center gap-1.5 rounded-md border border-[#C5A059]/30 bg-[#C5A059]/10 px-2.5 py-1 text-[11px] font-medium text-[#C5A059]">
                                            {t('filter.verified_only')}
                                            <button
                                                onClick={() =>
                                                    setFilters({
                                                        ...filters,
                                                        verifiedOnly: false,
                                                    })
                                                }
                                                className="transition-colors hover:text-white"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    )}

                                    {filters.minRating4 && (
                                        <span className="inline-flex items-center gap-1.5 rounded-md border border-[#C5A059]/30 bg-[#C5A059]/10 px-2.5 py-1 text-[11px] font-medium text-[#C5A059]">
                                            {t('filter.rating_4plus')}
                                            <button
                                                onClick={() =>
                                                    setFilters({
                                                        ...filters,
                                                        minRating4: false,
                                                    })
                                                }
                                                className="transition-colors hover:text-white"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </span>
                                    )}

                                    <button
                                        onClick={() =>
                                            setFilters({ ...DEFAULT_FILTERS })
                                        }
                                        className="ml-auto text-[11px] font-medium text-[#79849f] transition-colors hover:text-[#C5A059]"
                                    >
                                        {t('results.clear_all')}
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Guide Grid */}
                        {paginatedGuides.length > 0 ? (
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                                {paginatedGuides.map((guide) => (
                                    <GuideSearchCard
                                        key={guide.id}
                                        guide={guide}
                                        searchQuery={filters.query}
                                    />
                                ))}
                            </div>
                        ) : (
                            /* Empty State */
                            <div className="flex flex-col items-center justify-center rounded-xl border border-[#79849f]/30 bg-[#16223B]/50 py-20 text-center">
                                <SearchX className="mb-3 h-10 w-10 text-[#79849f]" />
                                <h3 className="mb-1 font-['Plus_Jakarta_Sans'] text-lg font-bold text-white">
                                    {t('empty.title')}
                                </h3>
                                <p className="mb-4 max-w-sm text-xs text-[#79849f]">
                                    {t('empty.description')}
                                </p>
                                <button
                                    onClick={() =>
                                        setFilters({ ...DEFAULT_FILTERS })
                                    }
                                    className="rounded-lg bg-[#C5A059] px-4 py-2 text-xs font-bold text-[#0D182E] transition-colors hover:bg-[#C5A059]/90"
                                >
                                    {t('empty.reset_button')}
                                </button>
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </>
    );
}

export default function GuidesSearch() {
    return (
        <LanguageProvider>
            <GuidesSearchContent />
        </LanguageProvider>
    );
}
