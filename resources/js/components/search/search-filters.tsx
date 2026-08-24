import React, { useState, useCallback } from 'react';
import {
    Clock,
    Calendar,
    ShieldCheck,
    Star,
    Car,
    Bike,
    Footprints,
    ChevronDown,
    Check,
    SlidersHorizontal,
    Users,
    RotateCcw,
    Banknote,
    Truck,
    Award,
    Package,
} from 'lucide-react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import {
    type SearchFiltersState,
    type VehicleType,
    AVAILABLE_LANGUAGES,
    AVAILABLE_EXTRAS,
} from '@/types/guide';
import { useTranslation } from '@/hooks/use-translations';

interface SearchFiltersProps {
    filters: SearchFiltersState;
    onFiltersChange: (filters: SearchFiltersState) => void;
    isOpen: boolean;
    onClose: () => void;
}

// ─── Price formatting helper ──────────────────────────────────
function formatRupiah(value: number | ''): string {
    if (value === '' || value === 0) return '';
    return new Intl.NumberFormat('id-ID').format(value);
}

function parseRupiahInput(raw: string): number | '' {
    const cleaned = raw.replace(/\D/g, '');
    if (cleaned === '') return '';
    return Number(cleaned);
}

// ─── Section Header ───────────────────────────────────────────
function SectionHeader({
    icon,
    title,
}: {
    icon: React.ReactNode;
    title: string;
}) {
    return (
        <div className="mb-2 flex items-center gap-2">
            <span className="text-[#C5A059]">{icon}</span>
            <h3 className="font-['Plus_Jakarta_Sans'] text-xs font-semibold tracking-wide text-white">
                {title}
            </h3>
        </div>
    );
}

// ─── Toggle Switch (accessible) ──────────────────────────────
function ToggleSwitch({
    checked,
    onChange,
    label,
    id,
}: {
    checked: boolean;
    onChange: (v: boolean) => void;
    label: string;
    id: string;
}) {
    return (
        <label
            htmlFor={id}
            className="group flex cursor-pointer items-center justify-between rounded-lg border border-white/5 bg-[#0D182E]/60 px-3 py-2 transition-colors hover:border-[#C5A059]/30"
        >
            <span className="text-xs font-medium text-white transition-colors group-hover:text-[#C5A059]">
                {label}
            </span>
            <div className="relative">
                <input
                    id={id}
                    type="checkbox"
                    role="switch"
                    aria-checked={checked}
                    className="peer sr-only"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <div className="peer h-5 w-9 rounded-full bg-white/10 transition-colors peer-checked:bg-[#C5A059] peer-focus-visible:ring-2 peer-focus-visible:ring-[#C5A059]/50 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform after:content-[''] peer-checked:after:translate-x-4" />
            </div>
        </label>
    );
}

// ─── Pill Button ──────────────────────────────────────────────
function PillButton({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-[11px] font-semibold transition-all duration-200 ${
                active
                    ? 'bg-[#C5A059] text-[#0D182E] shadow-sm shadow-[#C5A059]/20'
                    : 'border border-white/5 bg-[#0D182E]/60 text-[#79849f] hover:border-[#C5A059]/40 hover:text-white'
            }`}
        >
            {children}
        </button>
    );
}

// ─── Collapsible Accordion ────────────────────────────────────
function AccordionItem({
    icon,
    title,
    count,
    children,
    defaultOpen = false,
}: {
    icon: React.ReactNode;
    title: string;
    count?: number;
    children: React.ReactNode;
    defaultOpen?: boolean;
}) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="overflow-hidden rounded-lg transition-all">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="group flex w-full items-center justify-between px-0 py-2.5 text-left"
            >
                <div className="flex items-center gap-2">
                    <span className="text-[#C5A059]">{icon}</span>
                    <span className="font-['Plus_Jakarta_Sans'] text-xs font-semibold text-white">
                        {title}
                    </span>
                    {count !== undefined && count > 0 && (
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#C5A059] text-[9px] font-bold text-[#0D182E]">
                            {count}
                        </span>
                    )}
                </div>
                <ChevronDown
                    className={`h-3.5 w-3.5 text-[#79849f] transition-transform duration-200 group-hover:text-[#C5A059] ${
                        isOpen ? 'rotate-180 text-[#C5A059]' : ''
                    }`}
                />
            </button>
            <div
                className={`overflow-hidden transition-all duration-200 ${
                    isOpen
                        ? 'max-h-[500px] pb-2 opacity-100'
                        : 'max-h-0 opacity-0'
                }`}
            >
                <div className="flex flex-col gap-1.5 pl-0.5">{children}</div>
            </div>
        </div>
    );
}

// ─── Main SearchFilters Component ─────────────────────────────
export function SearchFilters({
    filters,
    onFiltersChange,
    isOpen,
    onClose,
}: SearchFiltersProps) {
    const { t } = useTranslation();

    // ─── Vehicle change handler ───
    const handleVehicleChange = useCallback(
        (v: VehicleType) => {
            const newVehicles = filters.vehicles.includes(v)
                ? filters.vehicles.filter((item) => item !== v)
                : [...filters.vehicles, v];
            onFiltersChange({ ...filters, vehicles: newVehicles });
        },
        [filters, onFiltersChange],
    );

    // ─── Language change handler ───
    const handleLanguageChange = useCallback(
        (code: string) => {
            const newLangs = filters.languages.includes(code)
                ? filters.languages.filter((l) => l !== code)
                : [...filters.languages, code];
            onFiltersChange({ ...filters, languages: newLangs });
        },
        [filters, onFiltersChange],
    );

    // ─── Extra facilities change handler ───
    const handleExtraChange = useCallback(
        (id: string) => {
            const newExtras = filters.extras.includes(id)
                ? filters.extras.filter((e) => e !== id)
                : [...filters.extras, id];
            onFiltersChange({ ...filters, extras: newExtras });
        },
        [filters, onFiltersChange],
    );

    // ─── Price preset handler ───
    const applyPricePreset = useCallback(
        (min: number | '', max: number | '') => {
            onFiltersChange({ ...filters, priceMin: min, priceMax: max });
        },
        [filters, onFiltersChange],
    );

    // ─── Reset Handler ───
    const handleReset = useCallback(() => {
        onFiltersChange({
            query: '',
            availableNow: false,
            bookingDate: '',
            priceMin: '',
            priceMax: '',
            vehicles: [],
            verifiedOnly: false,
            minRating4: false,
            languages: [],
            paxCapacity: 'all',
            genderPreference: 'all',
            extras: [],
            cities: [],
            priceRange: [0, 1500000],
            minRating: null,
            sortBy: filters.sortBy,
            page: 1,
        });
    }, [filters.sortBy, onFiltersChange]);

    // Active filters count
    const activeCount = [
        filters.availableNow,
        filters.bookingDate ? true : false,
        filters.priceMin !== '',
        filters.priceMax !== '',
        filters.vehicles.length > 0,
        filters.verifiedOnly,
        filters.minRating4,
        filters.languages.length > 0,
        filters.paxCapacity !== 'all',
        filters.genderPreference !== 'all',
        filters.extras.length > 0,
    ].filter(Boolean).length;

    // Check if a price preset is active
    const isPricePreset = (min: number | '', max: number | ''): boolean => {
        return filters.priceMin === min && filters.priceMax === max;
    };

    const FilterContent = (
        <div className="hide-scrollbar flex h-full flex-col gap-1 overflow-y-auto pr-1">
            {/* ─── Header ─── */}
            <div className="mb-1 flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-[#C5A059]" />
                    <h2 className="font-['Plus_Jakarta_Sans'] text-sm font-bold text-white">
                        {t('filter.title')}
                    </h2>
                    {activeCount > 0 && (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#C5A059] text-[9px] font-bold text-[#0D182E]">
                            {activeCount}
                        </span>
                    )}
                </div>
                {activeCount > 0 && (
                    <button
                        type="button"
                        onClick={handleReset}
                        className="flex items-center gap-1 text-[11px] font-medium text-[#C5A059] transition-colors hover:text-[#fed488]"
                    >
                        <RotateCcw className="h-3 w-3" />
                        {t('filter.reset')}
                    </button>
                )}
            </div>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* SECTION 1: Ketersediaan (Always Open)                  */}
            {/* ═══════════════════════════════════════════════════════ */}
            <div className="border-b border-white/5 py-3">
                <SectionHeader
                    icon={<Clock className="h-3.5 w-3.5" />}
                    title={t('filter.availability')}
                />

                {/* Available Now Toggle */}
                <div className="mb-2 rounded-lg border border-white/5 bg-[#0D182E]/60 p-3 transition-colors hover:border-emerald-500/30">
                    <div className="flex items-center justify-between">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-1.5">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                                </span>
                                <span className="text-xs font-semibold text-white">
                                    {t('filter.available_now')}
                                </span>
                            </div>
                            <span className="mt-0.5 ml-3.5 text-[10px] text-[#79849f]">
                                {t('filter.available_now_desc')}
                            </span>
                        </div>

                        <label
                            htmlFor="available-now-toggle"
                            className="relative inline-flex cursor-pointer items-center"
                        >
                            <input
                                id="available-now-toggle"
                                type="checkbox"
                                role="switch"
                                aria-checked={filters.availableNow}
                                className="peer sr-only"
                                checked={filters.availableNow}
                                onChange={(e) =>
                                    onFiltersChange({
                                        ...filters,
                                        availableNow: e.target.checked,
                                    })
                                }
                            />
                            <div className="peer h-5 w-9 rounded-full bg-white/10 transition-colors peer-checked:bg-emerald-500 peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-500/50 after:absolute after:top-[2px] after:left-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-transform after:content-[''] peer-checked:after:translate-x-4" />
                        </label>
                    </div>
                </div>

                {/* Scheduled Booking Date */}
                <div className="flex flex-col gap-1">
                    <label className="flex items-center gap-1 text-[11px] font-medium text-[#79849f]">
                        <Calendar className="h-3 w-3" />
                        <span>{t('filter.scheduled_booking')}</span>
                    </label>
                    <input
                        type="date"
                        value={filters.bookingDate}
                        onChange={(e) =>
                            onFiltersChange({
                                ...filters,
                                bookingDate: e.target.value,
                            })
                        }
                        className="rounded-lg border border-white/5 bg-[#0D182E]/60 px-3 py-2 text-xs text-white transition-all focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/30 focus:outline-none"
                    />
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* SECTION 2: Harga (Always Open)                         */}
            {/* ═══════════════════════════════════════════════════════ */}
            <div className="border-b border-white/5 py-3">
                <SectionHeader
                    icon={<Banknote className="h-3.5 w-3.5" />}
                    title={t('filter.price_range')}
                />

                {/* Min / Max Inputs with Rp formatting */}
                <div className="mb-2.5 flex items-center gap-2">
                    <div className="relative flex-1">
                        <span className="absolute top-1/2 left-2.5 -translate-y-1/2 text-[10px] font-medium text-[#79849f]">
                            Rp
                        </span>
                        <input
                            type="text"
                            inputMode="numeric"
                            placeholder={t('filter.price_min')}
                            value={formatRupiah(filters.priceMin)}
                            onChange={(e) =>
                                onFiltersChange({
                                    ...filters,
                                    priceMin: parseRupiahInput(e.target.value),
                                })
                            }
                            className="w-full rounded-lg border border-white/5 bg-[#0D182E]/60 py-2 pr-2 pl-8 text-xs text-white transition-all placeholder:text-[#79849f]/60 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/30 focus:outline-none"
                        />
                    </div>
                    <span className="text-[10px] font-bold text-[#79849f]">
                        —
                    </span>
                    <div className="relative flex-1">
                        <span className="absolute top-1/2 left-2.5 -translate-y-1/2 text-[10px] font-medium text-[#79849f]">
                            Rp
                        </span>
                        <input
                            type="text"
                            inputMode="numeric"
                            placeholder={t('filter.price_max')}
                            value={formatRupiah(filters.priceMax)}
                            onChange={(e) =>
                                onFiltersChange({
                                    ...filters,
                                    priceMax: parseRupiahInput(e.target.value),
                                })
                            }
                            className="w-full rounded-lg border border-white/5 bg-[#0D182E]/60 py-2 pr-2 pl-8 text-xs text-white transition-all placeholder:text-[#79849f]/60 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/30 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1.5">
                    <button
                        type="button"
                        onClick={() => applyPricePreset('', 300000)}
                        className={`rounded-md px-2.5 py-1 text-[10px] font-semibold transition-all ${
                            isPricePreset('', 300000)
                                ? 'bg-[#C5A059] text-[#0D182E]'
                                : 'border border-white/5 bg-[#0D182E]/60 text-[#79849f] hover:border-[#C5A059]/40 hover:text-white'
                        }`}
                    >
                        {t('filter.price_preset_low')}
                    </button>
                    <button
                        type="button"
                        onClick={() => applyPricePreset(300000, 600000)}
                        className={`rounded-md px-2.5 py-1 text-[10px] font-semibold transition-all ${
                            isPricePreset(300000, 600000)
                                ? 'bg-[#C5A059] text-[#0D182E]'
                                : 'border border-white/5 bg-[#0D182E]/60 text-[#79849f] hover:border-[#C5A059]/40 hover:text-white'
                        }`}
                    >
                        {t('filter.price_preset_mid')}
                    </button>
                    <button
                        type="button"
                        onClick={() => applyPricePreset(600000, '')}
                        className={`rounded-md px-2.5 py-1 text-[10px] font-semibold transition-all ${
                            isPricePreset(600000, '')
                                ? 'bg-[#C5A059] text-[#0D182E]'
                                : 'border border-white/5 bg-[#0D182E]/60 text-[#79849f] hover:border-[#C5A059]/40 hover:text-white'
                        }`}
                    >
                        {t('filter.price_preset_high')}
                    </button>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* SECTION 3: Transportasi (Pill Buttons)                 */}
            {/* ═══════════════════════════════════════════════════════ */}
            <div className="border-b border-white/5 py-3">
                <SectionHeader
                    icon={<Truck className="h-3.5 w-3.5" />}
                    title={t('filter.transportation')}
                />
                <div className="flex gap-2">
                    <PillButton
                        active={filters.vehicles.includes('car')}
                        onClick={() => handleVehicleChange('car')}
                    >
                        <Car className="h-3 w-3" />
                        {t('filter.vehicle_car')}
                    </PillButton>
                    <PillButton
                        active={filters.vehicles.includes('motorcycle')}
                        onClick={() => handleVehicleChange('motorcycle')}
                    >
                        <Bike className="h-3 w-3" />
                        {t('filter.vehicle_motorcycle')}
                    </PillButton>
                    <PillButton
                        active={filters.vehicles.includes('none')}
                        onClick={() => handleVehicleChange('none')}
                    >
                        <Footprints className="h-3 w-3" />
                        {t('filter.vehicle_walking')}
                    </PillButton>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* SECTION 4: Kualitas (Compact Toggle Rows)              */}
            {/* ═══════════════════════════════════════════════════════ */}
            <div className="border-b border-white/5 py-3">
                <SectionHeader
                    icon={<Award className="h-3.5 w-3.5" />}
                    title={t('filter.quality')}
                />
                <div className="flex flex-col gap-1.5">
                    <ToggleSwitch
                        id="verified-toggle"
                        checked={filters.verifiedOnly}
                        onChange={(v) =>
                            onFiltersChange({ ...filters, verifiedOnly: v })
                        }
                        label={t('filter.verified_only')}
                    />
                    <ToggleSwitch
                        id="rating-toggle"
                        checked={filters.minRating4}
                        onChange={(v) =>
                            onFiltersChange({ ...filters, minRating4: v })
                        }
                        label={t('filter.rating_4plus')}
                    />
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* SECTION 5: Optional Filters (Accordion)                */}
            {/* ═══════════════════════════════════════════════════════ */}
            <div className="flex flex-col gap-0 py-2">
                {/* Language Accordion */}
                <AccordionItem
                    icon={<span className="text-sm">🌐</span>}
                    title={t('filter.language')}
                    count={filters.languages.length}
                    defaultOpen={false}
                >
                    <div className="flex flex-col gap-0.5">
                        {AVAILABLE_LANGUAGES.map((lang) => {
                            const isChecked = filters.languages.includes(
                                lang.code,
                            );
                            return (
                                <label
                                    key={lang.code}
                                    onClick={() =>
                                        handleLanguageChange(lang.code)
                                    }
                                    className="group flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-white/5"
                                >
                                    <div className="flex items-center gap-2 text-xs">
                                        <span>{lang.flag}</span>
                                        <span
                                            className={`${
                                                isChecked
                                                    ? 'font-semibold text-[#C5A059]'
                                                    : 'text-[#79849f] group-hover:text-white'
                                            } transition-colors`}
                                        >
                                            {lang.label}
                                        </span>
                                    </div>
                                    <div
                                        className={`flex h-3.5 w-3.5 items-center justify-center rounded border transition-colors ${
                                            isChecked
                                                ? 'border-[#C5A059] bg-[#C5A059]'
                                                : 'border-white/20 bg-white/5'
                                        }`}
                                    >
                                        {isChecked && (
                                            <Check className="h-2.5 w-2.5 text-[#0D182E]" />
                                        )}
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                </AccordionItem>

                {/* Divider */}
                <div className="border-t border-white/5" />

                {/* Group Details Accordion */}
                <AccordionItem
                    icon={<Users className="h-3.5 w-3.5" />}
                    title={t('filter.group_details')}
                    count={
                        (filters.paxCapacity !== 'all' ? 1 : 0) +
                        (filters.genderPreference !== 'all' ? 1 : 0)
                    }
                    defaultOpen={false}
                >
                    <div className="flex flex-col gap-3">
                        {/* Pax Count */}
                        <div className="flex flex-col gap-1.5">
                            <span className="text-[11px] font-medium text-[#79849f]">
                                {t('filter.pax_count')}
                            </span>
                            <div className="grid grid-cols-2 gap-1.5">
                                {[
                                    { id: 'all', label: t('filter.pax_all') },
                                    { id: '1-2', label: t('filter.pax_1_2') },
                                    { id: '3-5', label: t('filter.pax_3_5') },
                                    { id: '6+', label: t('filter.pax_6_plus') },
                                ].map((pax) => (
                                    <button
                                        key={pax.id}
                                        type="button"
                                        onClick={() =>
                                            onFiltersChange({
                                                ...filters,
                                                paxCapacity:
                                                    pax.id as SearchFiltersState['paxCapacity'],
                                            })
                                        }
                                        className={`rounded-md px-2 py-1.5 text-[11px] font-semibold transition-all ${
                                            filters.paxCapacity === pax.id
                                                ? 'bg-[#C5A059] text-[#0D182E]'
                                                : 'border border-white/5 bg-[#0D182E]/60 text-[#79849f] hover:text-white'
                                        }`}
                                    >
                                        {pax.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Gender */}
                        <div className="flex flex-col gap-1.5 border-t border-white/5 pt-2">
                            <span className="text-[11px] font-medium text-[#79849f]">
                                {t('filter.gender')}
                            </span>
                            <div className="flex rounded-lg border border-white/5 bg-[#0D182E]/60 p-0.5">
                                {[
                                    {
                                        id: 'all',
                                        label: t('filter.gender_all'),
                                    },
                                    {
                                        id: 'male',
                                        label: t('filter.gender_male'),
                                    },
                                    {
                                        id: 'female',
                                        label: t('filter.gender_female'),
                                    },
                                ].map((g) => (
                                    <button
                                        key={g.id}
                                        type="button"
                                        onClick={() =>
                                            onFiltersChange({
                                                ...filters,
                                                genderPreference:
                                                    g.id as SearchFiltersState['genderPreference'],
                                            })
                                        }
                                        className={`flex-1 rounded-md py-1.5 text-[11px] font-semibold transition-all ${
                                            filters.genderPreference === g.id
                                                ? 'bg-[#C5A059] text-[#0D182E]'
                                                : 'text-[#79849f] hover:text-white'
                                        }`}
                                    >
                                        {g.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </AccordionItem>

                {/* Divider */}
                <div className="border-t border-white/5" />

                {/* Extra Facilities Accordion */}
                <AccordionItem
                    icon={<Package className="h-3.5 w-3.5" />}
                    title={t('filter.extras')}
                    count={filters.extras.length}
                    defaultOpen={false}
                >
                    <div className="flex flex-col gap-0.5">
                        {AVAILABLE_EXTRAS.map((ext) => {
                            const isChecked = filters.extras.includes(ext.id);
                            return (
                                <label
                                    key={ext.id}
                                    onClick={() => handleExtraChange(ext.id)}
                                    className="group flex cursor-pointer items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-white/5"
                                >
                                    <span
                                        className={`pr-2 text-xs ${
                                            isChecked
                                                ? 'font-semibold text-[#C5A059]'
                                                : 'text-[#79849f] group-hover:text-white'
                                        } transition-colors`}
                                    >
                                        {ext.label}
                                    </span>
                                    <div
                                        className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded border transition-colors ${
                                            isChecked
                                                ? 'border-[#C5A059] bg-[#C5A059]'
                                                : 'border-white/20 bg-white/5'
                                        }`}
                                    >
                                        {isChecked && (
                                            <Check className="h-2.5 w-2.5 text-[#0D182E]" />
                                        )}
                                    </div>
                                </label>
                            );
                        })}
                    </div>
                </AccordionItem>
            </div>

            {/* ─── Mobile Apply CTA ─── */}
            <div className="mt-auto pt-3 lg:hidden">
                <button
                    type="button"
                    onClick={onClose}
                    className="w-full rounded-lg bg-[#C5A059] py-2.5 text-xs font-bold text-[#0D182E] shadow-md transition-colors hover:bg-[#fed488]"
                >
                    {t('filter.apply')}
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Fixed SideNavBar */}
            <aside className="fixed top-16 left-0 z-40 hidden h-[calc(100vh-64px)] w-[280px] flex-col border-r border-[#79849f]/20 bg-[#0D182E] p-4 lg:flex">
                {FilterContent}
            </aside>

            {/* Mobile Filter Sheet */}
            <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
                <SheetContent
                    side="left"
                    className="w-[300px] border-r border-white/10 bg-[#0D182E] p-4"
                >
                    <SheetHeader className="mb-2">
                        <SheetTitle className="flex items-center gap-2 text-left font-['Plus_Jakarta_Sans'] text-base text-white">
                            <SlidersHorizontal className="h-4 w-4 text-[#C5A059]" />
                            {t('filter.title')}
                        </SheetTitle>
                    </SheetHeader>
                    {FilterContent}
                </SheetContent>
            </Sheet>
        </>
    );
}
