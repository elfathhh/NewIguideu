// ──────────────────────────────────────────────────────────────
// IguideU — Shared Guide Search Types
// ──────────────────────────────────────────────────────────────

export type CategoryTab =
    'all' | 'mountain' | 'waterfall' | 'heritage' | 'marine' | 'surf';

export interface GuideLanguage {
    code: string;
    flag: string;
    label: string;
}

export interface GuideBadge {
    text: string;
    type: 'verified' | 'certified' | 'super';
}

export type VehicleType = 'car' | 'motorcycle' | 'none';

export interface MockGuide {
    id: number;
    name: string;
    specialty: string;
    category: Exclude<CategoryTab, 'all'>;
    location: string;
    city: string;
    province: string;
    rating: string;
    reviews: number;
    experience: string;
    hourlyRate: number;
    dailyRate: number;
    priceLabel: string;
    unit: string;
    bio: string;
    badges: GuideBadge[];
    languages: GuideLanguage[];
    image: string;
    verified: boolean;
    // New fields for filter & contextual highlight support:
    availableNow: boolean;
    vehicles: VehicleType[];
    gender: 'male' | 'female';
    maxPax: number;
    extras: string[];
    whatsapp?: string;
    serviceAreas?: string[];
    gallery?: string[];
}

export type SortOption =
    'rating_desc' | 'price_asc' | 'price_desc' | 'reviews_desc' | 'newest';

export interface SearchFiltersState {
    query: string;
    // Tier 1: Paling Atas (Krusial & Selalu Terbuka)
    availableNow: boolean;
    bookingDate: string;
    priceMin: number | '';
    priceMax: number | '';

    // Tier 2: Tengah (Penting & Sangat Relevan)
    vehicles: VehicleType[];
    verifiedOnly: boolean;
    minRating4: boolean;

    // Tier 3: Bawah (Opsional & Spesifik - Default Collapsed)
    languages: string[];
    paxCapacity: 'all' | '1-2' | '3-5' | '6+';
    genderPreference: 'all' | 'male' | 'female';
    extras: string[];

    // Additional / Backwards compatibility
    cities: string[];
    priceRange: [number, number];
    minRating: number | null;
    sortBy: SortOption;
    page: number;
}

/** Available NTB cities for filter */
export const NTB_CITIES = [
    'Lombok Barat',
    'Lombok Tengah',
    'Lombok Timur',
    'Lombok Utara',
    'Kota Mataram',
    'Sumbawa',
    'Sumbawa Barat',
    'Dompu',
    'Bima',
] as const;

/** Available languages for filter */
export const AVAILABLE_LANGUAGES: GuideLanguage[] = [
    { code: 'ID', flag: '🇮🇩', label: 'Indonesia' },
    { code: 'EN', flag: '🇬🇧', label: 'English' },
    { code: 'JP', flag: '🇯🇵', label: 'Japanese' },
    { code: 'DE', flag: '🇩🇪', label: 'German' },
    { code: 'FR', flag: '🇫🇷', label: 'French' },
    { code: 'NL', flag: '🇳🇱', label: 'Dutch' },
    { code: 'AR', flag: '🇸🇦', label: 'Arabic' },
];

/** Available extra facilities for filter */
export const AVAILABLE_EXTRAS = [
    { id: 'documentation', label: 'Dokumentasi (Foto & Video HD)' },
    { id: 'equipment', label: 'Penyewaan Alat (Snorkeling/Trekking)' },
    { id: 'transfer', label: 'Antar-Jemput Hotel / Bandara' },
    { id: 'meals', label: 'Snack & Makan Minum' },
] as const;

/** Default filter state */
export const DEFAULT_FILTERS: SearchFiltersState = {
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
    sortBy: 'rating_desc',
    page: 1,
};

/** Items per page for pagination */
export const ITEMS_PER_PAGE = 9;
