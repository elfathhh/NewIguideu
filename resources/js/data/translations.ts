// ──────────────────────────────────────────────────────────────
// IguideU — i18n Translation Dictionary
// ──────────────────────────────────────────────────────────────

export type Language = 'id' | 'en';

export type TranslationKey =
    // Filter sidebar
    | 'filter.title'
    | 'filter.reset'
    | 'filter.availability'
    | 'filter.available_now'
    | 'filter.available_now_desc'
    | 'filter.scheduled_booking'
    | 'filter.select_date'
    | 'filter.price_range'
    | 'filter.price_min'
    | 'filter.price_max'
    | 'filter.price_preset_low'
    | 'filter.price_preset_mid'
    | 'filter.price_preset_high'
    | 'filter.transportation'
    | 'filter.vehicle_car'
    | 'filter.vehicle_motorcycle'
    | 'filter.vehicle_walking'
    | 'filter.vehicle_none'
    | 'filter.quality'
    | 'filter.verified_only'
    | 'filter.rating_4plus'
    | 'filter.more_options'
    | 'filter.language'
    | 'filter.group_details'
    | 'filter.pax_count'
    | 'filter.pax_all'
    | 'filter.pax_1_2'
    | 'filter.pax_3_5'
    | 'filter.pax_6_plus'
    | 'filter.gender'
    | 'filter.gender_all'
    | 'filter.gender_male'
    | 'filter.gender_female'
    | 'filter.extras'
    | 'filter.apply'
    // Sort options
    | 'sort.label'
    | 'sort.top_rated'
    | 'sort.price_low'
    | 'sort.price_high'
    | 'sort.most_reviewed'
    | 'sort.newest'
    // Results
    | 'results.showing'
    | 'results.of'
    | 'results.guides'
    | 'results.active_filters'
    | 'results.clear_all'
    // Empty state
    | 'empty.title'
    | 'empty.description'
    | 'empty.reset_button'
    // Card labels
    | 'card.starting_from'
    | 'card.per_day'
    | 'card.details'
    | 'card.available_now'
    | 'card.verified'
    // Navbar
    | 'nav.search_placeholder'
    | 'nav.filters'
    // Active filter chip labels
    | 'chip.available_now'
    | 'chip.verified'
    | 'chip.rating'
    | 'chip.car'
    | 'chip.motorcycle'
    | 'chip.walking';

export const translations: Record<Language, Record<TranslationKey, string>> = {
    id: {
        // Filter sidebar
        'filter.title': 'Filter',
        'filter.reset': 'Reset',
        'filter.availability': 'Ketersediaan',
        'filter.available_now': 'Tersedia Sekarang',
        'filter.available_now_desc': 'Booking Instan',
        'filter.scheduled_booking': 'Booking Terjadwal',
        'filter.select_date': 'Pilih tanggal...',
        'filter.price_range': 'Harga per Hari',
        'filter.price_min': 'Min',
        'filter.price_max': 'Max',
        'filter.price_preset_low': '< Rp 300rb',
        'filter.price_preset_mid': 'Rp 300rb - 600rb',
        'filter.price_preset_high': '> Rp 600rb',
        'filter.transportation': 'Transportasi',
        'filter.vehicle_car': 'Mobil',
        'filter.vehicle_motorcycle': 'Motor',
        'filter.vehicle_walking': 'Jalan Kaki',
        'filter.vehicle_none': 'Jalan Kaki',
        'filter.quality': 'Kualitas',
        'filter.verified_only': 'Terverifikasi',
        'filter.rating_4plus': 'Rating 4.0+',
        'filter.more_options': 'Opsi Lainnya',
        'filter.language': 'Bahasa Pemandu',
        'filter.group_details': 'Detail Rombongan',
        'filter.pax_count': 'Jumlah Orang',
        'filter.pax_all': 'Semua',
        'filter.pax_1_2': '1-2 Orang',
        'filter.pax_3_5': '3-5 Orang',
        'filter.pax_6_plus': '6+ Orang',
        'filter.gender': 'Gender Pemandu',
        'filter.gender_all': 'Semua',
        'filter.gender_male': 'Laki-laki',
        'filter.gender_female': 'Perempuan',
        'filter.extras': 'Fasilitas Ekstra',
        'filter.apply': 'Terapkan Filter',

        // Sort options
        'sort.label': 'Urutkan',
        'sort.top_rated': 'Rating Tertinggi',
        'sort.price_low': 'Harga Terendah',
        'sort.price_high': 'Harga Tertinggi',
        'sort.most_reviewed': 'Ulasan Terbanyak',
        'sort.newest': 'Terbaru',

        // Results
        'results.showing': 'Menampilkan',
        'results.of': 'dari',
        'results.guides': 'Pemandu',
        'results.active_filters': 'Filter Aktif',
        'results.clear_all': 'Hapus Semua',

        // Empty state
        'empty.title': 'Pemandu Tidak Ditemukan',
        'empty.description':
            'Coba sesuaikan kriteria pencarian atau reset filter.',
        'empty.reset_button': 'Reset Semua Filter',

        // Card labels
        'card.starting_from': 'Mulai dari',
        'card.per_day': '/hari',
        'card.details': 'Detail',
        'card.available_now': 'Tersedia',
        'card.verified': 'Terverifikasi',

        // Navbar
        'nav.search_placeholder': 'Cari destinasi, pemandu...',
        'nav.filters': 'Filter',

        // Active filter chip labels
        'chip.available_now': 'Tersedia Sekarang',
        'chip.verified': 'Terverifikasi',
        'chip.rating': 'Rating 4.0+',
        'chip.car': 'Mobil',
        'chip.motorcycle': 'Motor',
        'chip.walking': 'Jalan Kaki',
    },
    en: {
        // Filter sidebar
        'filter.title': 'Filter',
        'filter.reset': 'Reset',
        'filter.availability': 'Availability',
        'filter.available_now': 'Available Now',
        'filter.available_now_desc': 'Instant Booking',
        'filter.scheduled_booking': 'Scheduled Booking',
        'filter.select_date': 'Select date...',
        'filter.price_range': 'Price per Day',
        'filter.price_min': 'Min',
        'filter.price_max': 'Max',
        'filter.price_preset_low': '< Rp 300K',
        'filter.price_preset_mid': 'Rp 300K - 600K',
        'filter.price_preset_high': '> Rp 600K',
        'filter.transportation': 'Transportation',
        'filter.vehicle_car': 'Car',
        'filter.vehicle_motorcycle': 'Motorcycle',
        'filter.vehicle_walking': 'Walking',
        'filter.vehicle_none': 'Walking',
        'filter.quality': 'Quality',
        'filter.verified_only': 'Verified Only',
        'filter.rating_4plus': 'Rating 4.0+',
        'filter.more_options': 'More Options',
        'filter.language': 'Guide Language',
        'filter.group_details': 'Group Details',
        'filter.pax_count': 'Group Size',
        'filter.pax_all': 'All',
        'filter.pax_1_2': '1-2 People',
        'filter.pax_3_5': '3-5 People',
        'filter.pax_6_plus': '6+ People',
        'filter.gender': 'Guide Gender',
        'filter.gender_all': 'All',
        'filter.gender_male': 'Male',
        'filter.gender_female': 'Female',
        'filter.extras': 'Extra Facilities',
        'filter.apply': 'Apply Filters',

        // Sort options
        'sort.label': 'Sort by',
        'sort.top_rated': 'Top Rated',
        'sort.price_low': 'Price: Low to High',
        'sort.price_high': 'Price: High to Low',
        'sort.most_reviewed': 'Most Reviewed',
        'sort.newest': 'Newest',

        // Results
        'results.showing': 'Showing',
        'results.of': 'of',
        'results.guides': 'Guides',
        'results.active_filters': 'Active Filters',
        'results.clear_all': 'Clear All',

        // Empty state
        'empty.title': 'No Guides Found',
        'empty.description':
            'Try adjusting your search criteria or reset filters.',
        'empty.reset_button': 'Reset All Filters',

        // Card labels
        'card.starting_from': 'Starting from',
        'card.per_day': '/day',
        'card.details': 'Details',
        'card.available_now': 'Available',
        'card.verified': 'Verified',

        // Navbar
        'nav.search_placeholder': 'Search destinations, guides...',
        'nav.filters': 'Filters',

        // Active filter chip labels
        'chip.available_now': 'Available Now',
        'chip.verified': 'Verified',
        'chip.rating': 'Rating 4.0+',
        'chip.car': 'Car',
        'chip.motorcycle': 'Motorcycle',
        'chip.walking': 'Walking',
    },
};
