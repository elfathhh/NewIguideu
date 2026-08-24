import { useState, useRef, useMemo } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    Compass,
    Sparkles,
    User,
    Mail,
    Phone,
    Lock,
    Upload,
    CheckCircle2,
    ShieldCheck,
    CreditCard,
    MapPin,
    Globe,
    Car,
    Bike,
    Footprints,
    ArrowRight,
    ArrowLeft,
    AlertCircle,
    Info,
    Camera,
    FileCheck,
    Trash2,
    Check,
    BadgeCheck,
    Search,
    X,
    Mountain,
    Droplets,
    Landmark,
    Waves,
    Palmtree,
} from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

export type DestinationItem = {
    id: string;
    name: string;
    category: string;
    location?: string;
};

type Props = {
    ntbCities: string[];
    popularAreas: (string | DestinationItem)[];
    languageOptions: { code: string; label: string }[];
    vehicleOptions: { id: string; label: string }[];
    bankOptions: string[];
};

export default function JoinGuide({
    ntbCities,
    popularAreas,
    languageOptions,
    vehicleOptions,
    bankOptions,
}: Props) {
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [avatarFileName, setAvatarFileName] = useState<string>('');
    const [avatarFileSize, setAvatarFileSize] = useState<string>('');

    const [ktpPreview, setKtpPreview] = useState<string | null>(null);
    const [ktpFileName, setKtpFileName] = useState<string>('');
    const [ktpFileSize, setKtpFileSize] = useState<string>('');

    const [destinationSearch, setDestinationSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [activeSection, setActiveSection] = useState<'account' | 'docs' | 'service' | 'bank'>('account');

    const avatarInputRef = useRef<HTMLInputElement>(null);
    const ktpInputRef = useRef<HTMLInputElement>(null);

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: '',
        avatar: null as File | null,
        id_card: null as File | null,
        city: ntbCities[0] || '',
        bio: '',
        languages: ['ID', 'EN'] as string[],
        vehicles: ['none'] as string[],
        service_areas: ['Gunung Rinjani'] as string[],
        daily_rate: 650000,
        bank_name: bankOptions[0] || 'Bank Central Asia (BCA)',
        bank_account_number: '',
        bank_account_holder: '',
    });

    // Normalize popularAreas array from backend
    const normalizedDestinations = useMemo<DestinationItem[]>(() => {
        return popularAreas.map((item, idx) => {
            if (typeof item === 'string') {
                return {
                    id: `dest-${idx}`,
                    name: item,
                    category: 'Destinasi Populer',
                    location: 'NTB',
                };
            }
            return item as DestinationItem;
        });
    }, [popularAreas]);

    // Extract unique categories
    const categories = useMemo(() => {
        const cats = Array.from(new Set(normalizedDestinations.map((d) => d.category)));
        return ['all', ...cats];
    }, [normalizedDestinations]);

    // Real-time filtered destinations based on search query & category
    const filteredDestinations = useMemo(() => {
        const q = destinationSearch.toLowerCase().trim();
        return normalizedDestinations.filter((d) => {
            const matchesCat = selectedCategory === 'all' || d.category === selectedCategory;
            const matchesQuery =
                !q ||
                d.name.toLowerCase().includes(q) ||
                (d.location && d.location.toLowerCase().includes(q)) ||
                d.category.toLowerCase().includes(q);
            return matchesCat && matchesQuery;
        });
    }, [normalizedDestinations, destinationSearch, selectedCategory]);

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('avatar', file);
            setAvatarFileName(file.name);
            setAvatarFileSize(formatBytes(file.size));
            const reader = new FileReader();
            reader.onload = () => setAvatarPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const removeAvatar = (e: React.MouseEvent) => {
        e.stopPropagation();
        setData('avatar', null);
        setAvatarPreview(null);
        setAvatarFileName('');
        setAvatarFileSize('');
        if (avatarInputRef.current) avatarInputRef.current.value = '';
    };

    const handleKtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('id_card', file);
            setKtpFileName(file.name);
            setKtpFileSize(formatBytes(file.size));
            const reader = new FileReader();
            reader.onload = () => setKtpPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    const removeKtp = (e: React.MouseEvent) => {
        e.stopPropagation();
        setData('id_card', null);
        setKtpPreview(null);
        setKtpFileName('');
        setKtpFileSize('');
        if (ktpInputRef.current) ktpInputRef.current.value = '';
    };

    const toggleLanguage = (code: string) => {
        if (data.languages.includes(code)) {
            if (data.languages.length > 1) {
                setData(
                    'languages',
                    data.languages.filter((l) => l !== code),
                );
            }
        } else {
            setData('languages', [...data.languages, code]);
        }
    };

    const toggleDestinationName = (name: string) => {
        if (data.service_areas.includes(name)) {
            setData(
                'service_areas',
                data.service_areas.filter((a) => a !== name),
            );
        } else {
            setData('service_areas', [...data.service_areas, name]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/join-guide', {
            forceFormData: true,
        });
    };

    const quickRates = [
        { label: 'Rp 500.000', value: 500000 },
        { label: 'Rp 650.000', value: 650000 },
        { label: 'Rp 850.000', value: 850000 },
        { label: 'Rp 1.000.000', value: 1000000 },
        { label: 'Rp 1.500.000', value: 1500000 },
    ];

    const scrollToSection = (id: string, secName: 'account' | 'docs' | 'service' | 'bank') => {
        setActiveSection(secName);
        const element = document.getElementById(id);
        if (element) {
            const yOffset = -90;
            const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };

    const getCategoryIcon = (category: string) => {
        if (category.includes('Gunung')) {
            return <Mountain className="h-4 w-4" />;
        }
        if (category.includes('Air Terjun')) {
            return <Droplets className="h-4 w-4" />;
        }
        if (category.includes('Budaya')) {
            return <Landmark className="h-4 w-4" />;
        }
        if (category.includes('Bahari')) {
            return <Waves className="h-4 w-4" />;
        }
        return <Palmtree className="h-4 w-4" />;
    };

    return (
        <div className="min-h-screen bg-[#070D18] text-slate-100 selection:bg-[#e9c176] selection:text-[#0D182E]">
            <Head title="Pendaftaran Mitra Pemandu Wisata - IguideU NTB" />

            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0D182E]/95 shadow-lg shadow-black/40 backdrop-blur-xl">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-8">
                    {/* Brand Logo & Back to Home */}
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-300 transition-all hover:border-[#e9c176]/40 hover:bg-white/10 hover:text-white"
                        >
                            <ArrowLeft className="h-3.5 w-3.5 text-[#e9c176]" />
                            <span>Beranda</span>
                        </Link>

                        <div className="hidden h-5 w-[1px] bg-white/10 sm:block"></div>

                        <Link
                            href="/"
                            className="flex items-center gap-2 font-['Plus_Jakarta_Sans',sans-serif] text-xl font-bold tracking-tight text-[#e9c176] transition-opacity hover:opacity-90"
                        >
                            <Compass className="h-6 w-6 text-[#e9c176]" />
                            <span>IguideU</span>
                        </Link>
                    </div>

                    {/* Quick Login Link */}
                    <div className="flex items-center gap-3">
                        <span className="hidden text-xs text-slate-400 sm:inline">Sudah memiliki akun?</span>
                        <Link
                            href="/login"
                            className="rounded-full bg-[#e9c176] px-5 py-1.5 text-xs font-bold text-[#0D182E] shadow-md shadow-[#e9c176]/20 transition-all hover:scale-105 hover:bg-[#f3ce87]"
                        >
                            Masuk
                        </Link>
                    </div>
                </div>

                {/* Stepper Navigation */}
                <div className="border-t border-white/5 bg-[#0A1120]/90 px-4 py-2 sm:px-8">
                    <div className="mx-auto flex max-w-4xl items-center justify-between gap-1 overflow-x-auto text-xs font-semibold no-scrollbar">
                        <button
                            type="button"
                            onClick={() => scrollToSection('sec-account', 'account')}
                            className={`flex flex-shrink-0 items-center gap-2 rounded-xl px-3 py-1.5 transition-all ${
                                activeSection === 'account'
                                    ? 'bg-[#e9c176]/20 text-[#e9c176] shadow-sm'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current text-[10px] font-bold">1</span>
                            <span>Akun & Kontak</span>
                        </button>

                        <div className="h-[1px] w-4 bg-white/10"></div>

                        <button
                            type="button"
                            onClick={() => scrollToSection('sec-docs', 'docs')}
                            className={`flex flex-shrink-0 items-center gap-2 rounded-xl px-3 py-1.5 transition-all ${
                                activeSection === 'docs'
                                    ? 'bg-[#e9c176]/20 text-[#e9c176] shadow-sm'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current text-[10px] font-bold">2</span>
                            <span>Identitas & Foto</span>
                        </button>

                        <div className="h-[1px] w-4 bg-white/10"></div>

                        <button
                            type="button"
                            onClick={() => scrollToSection('sec-service', 'service')}
                            className={`flex flex-shrink-0 items-center gap-2 rounded-xl px-3 py-1.5 transition-all ${
                                activeSection === 'service'
                                    ? 'bg-[#e9c176]/20 text-[#e9c176] shadow-sm'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current text-[10px] font-bold">3</span>
                            <span>Wilayah & Destinasi</span>
                        </button>

                        <div className="h-[1px] w-4 bg-white/10"></div>

                        <button
                            type="button"
                            onClick={() => scrollToSection('sec-bank', 'bank')}
                            className={`flex flex-shrink-0 items-center gap-2 rounded-xl px-3 py-1.5 transition-all ${
                                activeSection === 'bank'
                                    ? 'bg-[#e9c176]/20 text-[#e9c176] shadow-sm'
                                    : 'text-slate-400 hover:text-white'
                            }`}
                        >
                            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-current text-[10px] font-bold">4</span>
                            <span>Rekening Bank</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Container */}
            <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
                {/* Hero Header Card */}
                <div className="relative mb-8 overflow-hidden rounded-3xl border border-[#e9c176]/20 bg-gradient-to-b from-[#16223B] via-[#0D182E] to-[#070D18] p-8 text-center shadow-2xl">
                    <div className="pointer-events-none absolute -top-24 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-[#e9c176]/10 blur-3xl"></div>

                    <div className="inline-flex items-center gap-2 rounded-full border border-[#e9c176]/30 bg-[#e9c176]/15 px-4 py-1.5 text-xs font-bold text-[#e9c176] shadow-sm">
                        <Sparkles className="h-4 w-4" />
                        <span>Pendaftaran Mitra Pemandu Wisata NTB</span>
                    </div>

                    <h1 className="mt-4 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-bold tracking-tight text-white sm:text-3xl">
                        Formulir Registrasi Tour Guide
                    </h1>

                    <p className="mx-auto mt-2.5 max-w-2xl text-xs leading-relaxed text-slate-300 sm:text-sm">
                        Lengkapi data identitas, spesifikasi layanan, dan informasi rekening untuk proses verifikasi dan aktivasi profil pemandu wisata di platform IguideU.
                    </p>

                    {/* Highlights Bar */}
                    <div className="mt-6 flex flex-wrap items-center justify-center gap-6 border-t border-white/10 pt-5 text-xs text-slate-400">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-[#e9c176]" />
                            <span>Verifikasi Identitas Resmi</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-[#e9c176]" />
                            <span>Penyaluran Dana Transparan</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <BadgeCheck className="h-4 w-4 text-[#e9c176]" />
                            <span>Integrasi Katalog Pencarian</span>
                        </div>
                    </div>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Error Alert if any */}
                    {Object.keys(errors).length > 0 && (
                        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-5 text-red-300 shadow-xl backdrop-blur-md">
                            <div className="flex items-center gap-2 text-sm font-bold text-red-200">
                                <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-400" />
                                <span>Mohon lengkapi bagian formulir berikut:</span>
                            </div>
                            <ul className="mt-2.5 list-inside list-disc space-y-1 text-xs text-red-200/90">
                                {Object.values(errors).map((err, idx) => (
                                    <li key={idx}>{err}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* SECTION 1: Akun & Informasi Kontak */}
                    <div
                        id="sec-account"
                        className="rounded-3xl border border-white/10 bg-[#16223B]/80 p-6 shadow-xl backdrop-blur-xl transition-all sm:p-8"
                    >
                        <div className="flex items-center gap-3.5 border-b border-white/10 pb-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e9c176]/20 text-[#e9c176] shadow-inner">
                                <User className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-bold text-white sm:text-lg">
                                    1. Informasi Akun & Kontak
                                </h2>
                                <p className="text-xs text-slate-400">
                                    Data kredensial untuk autentikasi sistem dan komunikasi operasional
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                            {/* Nama Lengkap */}
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                    Nama Lengkap (Sesuai KTP) <span className="text-[#e9c176]">*</span>
                                </label>
                                <div className="relative mt-2">
                                    <User className="absolute top-3.5 left-3.5 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        required
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Nama lengkap sesuai kartu identitas"
                                        className="w-full rounded-xl border border-white/10 bg-[#0D182E] py-3 pr-4 pl-10 text-sm text-white placeholder-slate-500 transition-colors focus:border-[#e9c176] focus:ring-1 focus:ring-[#e9c176]/50 focus:outline-none"
                                    />
                                </div>
                                {errors.name && <p className="mt-1 text-xs text-red-400">{errors.name}</p>}
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                    Alamat Email <span className="text-[#e9c176]">*</span>
                                </label>
                                <div className="relative mt-2">
                                    <Mail className="absolute top-3.5 left-3.5 h-4 w-4 text-slate-400" />
                                    <input
                                        type="email"
                                        required
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="nama@domain.com"
                                        className="w-full rounded-xl border border-white/10 bg-[#0D182E] py-3 pr-4 pl-10 text-sm text-white placeholder-slate-500 transition-colors focus:border-[#e9c176] focus:ring-1 focus:ring-[#e9c176]/50 focus:outline-none"
                                    />
                                </div>
                                {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email}</p>}
                            </div>

                            {/* No HP / WhatsApp */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                    Nomor WhatsApp Aktif <span className="text-[#e9c176]">*</span>
                                </label>
                                <div className="relative mt-2">
                                    <Phone className="absolute top-3.5 left-3.5 h-4 w-4 text-slate-400" />
                                    <input
                                        type="tel"
                                        required
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="081234567890"
                                        className="w-full rounded-xl border border-white/10 bg-[#0D182E] py-3 pr-4 pl-10 text-sm text-white placeholder-slate-500 transition-colors focus:border-[#e9c176] focus:ring-1 focus:ring-[#e9c176]/50 focus:outline-none"
                                    />
                                </div>
                                <p className="mt-1 text-[11px] text-slate-400">
                                    Terhubung langsung ke tombol WhatsApp di katalog pencarian wisatawan.
                                </p>
                                {errors.phone && <p className="mt-1 text-xs text-red-400">{errors.phone}</p>}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                    Kata Sandi (Minimal 8 Karakter) <span className="text-[#e9c176]">*</span>
                                </label>
                                <div className="relative mt-2">
                                    <Lock className="absolute top-3.5 left-3.5 h-4 w-4 text-slate-400" />
                                    <input
                                        type="password"
                                        required
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full rounded-xl border border-white/10 bg-[#0D182E] py-3 pr-4 pl-10 text-sm text-white placeholder-slate-500 transition-colors focus:border-[#e9c176] focus:ring-1 focus:ring-[#e9c176]/50 focus:outline-none"
                                    />
                                </div>
                                {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password}</p>}
                            </div>

                            {/* Konfirmasi Password */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                    Konfirmasi Kata Sandi <span className="text-[#e9c176]">*</span>
                                </label>
                                <div className="relative mt-2">
                                    <Lock className="absolute top-3.5 left-3.5 h-4 w-4 text-slate-400" />
                                    <input
                                        type="password"
                                        required
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full rounded-xl border border-white/10 bg-[#0D182E] py-3 pr-4 pl-10 text-sm text-white placeholder-slate-500 transition-colors focus:border-[#e9c176] focus:ring-1 focus:ring-[#e9c176]/50 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 2: Dokumen & Foto Profil */}
                    <div
                        id="sec-docs"
                        className="rounded-3xl border border-white/10 bg-[#16223B]/80 p-6 shadow-xl backdrop-blur-xl transition-all sm:p-8"
                    >
                        <div className="flex items-center gap-3.5 border-b border-white/10 pb-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e9c176]/20 text-[#e9c176] shadow-inner">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-bold text-white sm:text-lg">
                                    2. Dokumen Identitas & Foto
                                </h2>
                                <p className="text-xs text-slate-400">
                                    Dokumen wajib untuk verifikasi keabsahan data oleh administrator platform
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                            {/* Upload Foto Profil */}
                            <div className="flex flex-col">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                    Foto Profil <span className="text-[#e9c176]">*</span>
                                </label>
                                <p className="mt-1 text-[11px] text-slate-400">
                                    Format potret dengan pencahayaan jelas untuk kartu pencarian.
                                </p>

                                <div
                                    onClick={() => avatarInputRef.current?.click()}
                                    className={`group relative mt-3 flex flex-1 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
                                        avatarPreview
                                            ? 'border-[#e9c176] bg-[#0D182E]'
                                            : 'border-white/20 bg-[#0D182E]/60 hover:border-[#e9c176]/60 hover:bg-[#0D182E]'
                                    }`}
                                >
                                    {avatarPreview ? (
                                        <div className="relative flex flex-col items-center">
                                            <img
                                                src={avatarPreview}
                                                alt="Pratinjau Profil"
                                                className="h-28 w-28 rounded-full border-2 border-[#e9c176] object-cover shadow-xl"
                                            />
                                            <p className="mt-3 text-xs font-bold text-white">{avatarFileName}</p>
                                            <p className="text-[10px] text-slate-400">{avatarFileSize}</p>

                                            <div className="mt-3 flex gap-2">
                                                <span className="rounded-lg bg-white/10 px-3 py-1 text-[11px] font-semibold text-[#e9c176]">
                                                    Ganti Berkas
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={removeAvatar}
                                                    className="flex items-center gap-1 rounded-lg bg-red-500/20 px-2.5 py-1 text-[11px] font-semibold text-red-300 hover:bg-red-500/30"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                    <span>Hapus</span>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e9c176]/10 text-[#e9c176] transition-transform group-hover:scale-110">
                                                <Camera className="h-6 w-6" />
                                            </div>
                                            <p className="mt-3 text-xs font-bold text-white">
                                                Pilih Foto Profil
                                            </p>
                                            <p className="mt-1 text-[10px] text-slate-400">
                                                JPG, PNG, WEBP (Maksimal 5MB)
                                            </p>
                                        </>
                                    )}
                                    <input
                                        ref={avatarInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarChange}
                                    />
                                </div>
                                {errors.avatar && <p className="mt-1.5 text-xs text-red-400">{errors.avatar}</p>}
                            </div>

                            {/* Upload Foto KTP */}
                            <div className="flex flex-col">
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                    Kartu Tanda Penduduk (KTP) <span className="text-[#e9c176]">*</span>
                                </label>
                                <p className="mt-1 text-[11px] text-slate-400">
                                    Unggah foto KTP asli. Pastikan NIK dan data terbaca jelas.
                                </p>

                                <div
                                    onClick={() => ktpInputRef.current?.click()}
                                    className={`group relative mt-3 flex flex-1 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center transition-all ${
                                        ktpPreview
                                            ? 'border-[#e9c176] bg-[#0D182E]'
                                            : 'border-white/20 bg-[#0D182E]/60 hover:border-[#e9c176]/60 hover:bg-[#0D182E]'
                                    }`}
                                >
                                    {ktpPreview ? (
                                        <div className="relative flex flex-col items-center">
                                            <img
                                                src={ktpPreview}
                                                alt="Pratinjau KTP"
                                                className="h-28 w-44 rounded-xl border border-white/20 object-contain shadow-xl"
                                            />
                                            <p className="mt-3 text-xs font-bold text-white">{ktpFileName}</p>
                                            <p className="text-[10px] text-slate-400">{ktpFileSize}</p>

                                            <div className="mt-3 flex gap-2">
                                                <span className="rounded-lg bg-white/10 px-3 py-1 text-[11px] font-semibold text-[#e9c176]">
                                                    Ganti Berkas
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={removeKtp}
                                                    className="flex items-center gap-1 rounded-lg bg-red-500/20 px-2.5 py-1 text-[11px] font-semibold text-red-300 hover:bg-red-500/30"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                    <span>Hapus</span>
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e9c176]/10 text-[#e9c176] transition-transform group-hover:scale-110">
                                                <FileCheck className="h-6 w-6" />
                                            </div>
                                            <p className="mt-3 text-xs font-bold text-white">
                                                Pilih Berkas KTP
                                            </p>
                                            <p className="mt-1 text-[10px] text-slate-400">
                                                JPG, PNG, WEBP (Maksimal 5MB)
                                            </p>
                                        </>
                                    )}
                                    <input
                                        ref={ktpInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleKtpChange}
                                    />
                                </div>
                                {errors.id_card && <p className="mt-1.5 text-xs text-red-400">{errors.id_card}</p>}
                            </div>
                        </div>
                    </div>

                    {/* SECTION 3: Spesifikasi Layanan & Wilayah */}
                    <div
                        id="sec-service"
                        className="rounded-3xl border border-white/10 bg-[#16223B]/80 p-6 shadow-xl backdrop-blur-xl transition-all sm:p-8"
                    >
                        <div className="flex items-center gap-3.5 border-b border-white/10 pb-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e9c176]/20 text-[#e9c176] shadow-inner">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-bold text-white sm:text-lg">
                                    3. Spesifikasi Layanan & Wilayah
                                </h2>
                                <p className="text-xs text-slate-400">
                                    Parameter area operasional dan atribut pencarian wisatawan
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 space-y-6">
                            {/* Domisili & Tarif Harian */}
                            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Wilayah Operasional Utama (NTB) <span className="text-[#e9c176]">*</span>
                                    </label>
                                    <div className="relative mt-2">
                                        <select
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            className="w-full rounded-xl border border-white/10 bg-[#0D182E] px-4 py-3 text-sm text-white transition-colors focus:border-[#e9c176] focus:ring-1 focus:ring-[#e9c176]/50 focus:outline-none"
                                        >
                                            {ntbCities.map((city) => (
                                                <option key={city} value={city} className="bg-[#0D182E] text-white">
                                                    {city}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {errors.city && <p className="mt-1 text-xs text-red-400">{errors.city}</p>}
                                </div>

                                {/* Estimasi Tarif Harian */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                        Tarif Standar Harian (IDR) <span className="text-[#e9c176]">*</span>
                                    </label>
                                    <div className="relative mt-2">
                                        <span className="absolute top-3 left-4 text-sm font-bold text-[#e9c176]">
                                            Rp
                                        </span>
                                        <input
                                            type="number"
                                            required
                                            min={50000}
                                            step={25000}
                                            value={data.daily_rate}
                                            onChange={(e) => setData('daily_rate', Number(e.target.value))}
                                            className="w-full rounded-xl border border-white/10 bg-[#0D182E] py-3 pr-4 pl-12 text-sm font-bold text-white transition-colors focus:border-[#e9c176] focus:ring-1 focus:ring-[#e9c176]/50 focus:outline-none"
                                        />
                                    </div>
                                    {/* Quick chips for rates */}
                                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                        <span className="text-[10px] text-slate-400">Pilihan Cepat:</span>
                                        {quickRates.map((r) => (
                                            <button
                                                type="button"
                                                key={r.value}
                                                onClick={() => setData('daily_rate', r.value)}
                                                className={`rounded-lg px-2 py-0.5 text-[10px] font-semibold transition-all ${
                                                    data.daily_rate === r.value
                                                        ? 'bg-[#e9c176] text-[#0D182E]'
                                                        : 'bg-white/5 text-slate-400 hover:text-white'
                                                }`}
                                            >
                                                {r.label}
                                            </button>
                                        ))}
                                    </div>
                                    {errors.daily_rate && <p className="mt-1 text-xs text-red-400">{errors.daily_rate}</p>}
                                </div>
                            </div>

                            {/* Bio & Pengalaman */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                    Deskripsi Profil & Pengalaman <span className="text-[#e9c176]">*</span>
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    value={data.bio}
                                    onChange={(e) => setData('bio', e.target.value)}
                                    placeholder="Tuliskan ringkasan pengalaman memandu, sertifikasi (HPI/APGI jika ada), dan rute spesialisasi Anda..."
                                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#0D182E] p-4 text-sm text-white placeholder-slate-500 transition-colors focus:border-[#e9c176] focus:ring-1 focus:ring-[#e9c176]/50 focus:outline-none"
                                />
                                {errors.bio && <p className="mt-1 text-xs text-red-400">{errors.bio}</p>}
                            </div>

                            {/* Bahasa */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                    Kemampuan Bahasa <span className="text-[#e9c176]">*</span>
                                </label>
                                <div className="mt-2.5 flex flex-wrap gap-2">
                                    {languageOptions.map((lang) => {
                                        const isSelected = data.languages.includes(lang.code);
                                        return (
                                            <button
                                                type="button"
                                                key={lang.code}
                                                onClick={() => toggleLanguage(lang.code)}
                                                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                                                    isSelected
                                                        ? 'border border-[#e9c176] bg-[#e9c176]/20 text-[#e9c176] shadow-sm'
                                                        : 'border border-white/10 bg-[#0D182E] text-slate-400 hover:border-white/20 hover:text-white'
                                                }`}
                                            >
                                                <span>{lang.label}</span>
                                                {isSelected && <CheckCircle2 className="h-3.5 w-3.5 text-[#e9c176]" />}
                                            </button>
                                        );
                                    })}
                                </div>
                                {errors.languages && <p className="mt-1 text-xs text-red-400">{errors.languages}</p>}
                            </div>

                            {/* Transportasi */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                    Fasilitas Transportasi
                                </label>
                                <div className="mt-2.5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    {vehicleOptions.map((v) => {
                                        const isSelected = data.vehicles.includes(v.id);
                                        return (
                                            <button
                                                type="button"
                                                key={v.id}
                                                onClick={() => setData('vehicles', [v.id])}
                                                className={`flex items-center gap-2.5 rounded-2xl border p-4 text-xs font-semibold transition-all ${
                                                    isSelected
                                                        ? 'border-[#e9c176] bg-[#e9c176]/15 text-[#e9c176] shadow-md'
                                                        : 'border-white/10 bg-[#0D182E] text-slate-400 hover:border-white/20 hover:text-white'
                                                }`}
                                            >
                                                {v.id === 'car' && <Car className="h-4 w-4" />}
                                                {v.id === 'motorcycle' && <Bike className="h-4 w-4" />}
                                                {v.id === 'none' && <Footprints className="h-4 w-4" />}
                                                <span>{v.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Destinasi & Rute Spesialisasi (Searchable Grid) */}
                            <div className="rounded-2xl border border-white/10 bg-[#0D182E]/70 p-5">
                                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
                                    <div>
                                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                            Destinasi & Rute Spesialisasi
                                        </label>
                                        <p className="mt-0.5 text-[11px] text-slate-400">
                                            Pilih destinasi yang menjadi fokus layanan Anda
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1.5 self-start sm:self-auto">
                                        <span className="rounded-full bg-[#e9c176]/20 px-2.5 py-0.5 text-[11px] font-bold text-[#e9c176]">
                                            {data.service_areas.length} Terpilih
                                        </span>
                                    </div>
                                </div>

                                {/* Active Selected Destinations Tag Bar */}
                                {data.service_areas.length > 0 && (
                                    <div className="mt-3 flex flex-wrap items-center gap-1.5 border-b border-white/5 pb-3">
                                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                            Pilihan Anda:
                                        </span>
                                        {data.service_areas.map((area) => (
                                            <span
                                                key={area}
                                                className="inline-flex items-center gap-1 rounded-lg border border-[#e9c176]/50 bg-[#e9c176]/15 px-2.5 py-1 text-xs font-semibold text-[#e9c176]"
                                            >
                                                <span>{area}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleDestinationName(area)}
                                                    className="ml-0.5 text-slate-400 hover:text-white"
                                                    title="Hapus"
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Search Bar for Destinations */}
                                <div className="relative mt-4">
                                    <Search className="absolute top-3.5 left-3.5 h-4 w-4 text-slate-400" />
                                    <input
                                        type="text"
                                        value={destinationSearch}
                                        onChange={(e) => setDestinationSearch(e.target.value)}
                                        placeholder="Cari destinasi (contoh: Gunung Rinjani, Gili Trawangan, Desa Adat Sade)..."
                                        className="w-full rounded-xl border border-white/10 bg-[#070D18] py-3 pr-10 pl-10 text-xs text-white placeholder-slate-500 transition-colors focus:border-[#e9c176] focus:ring-1 focus:ring-[#e9c176]/50 focus:outline-none"
                                    />
                                    {destinationSearch && (
                                        <button
                                            type="button"
                                            onClick={() => setDestinationSearch('')}
                                            className="absolute top-3 right-3 text-slate-400 hover:text-white"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>

                                {/* Category Filters */}
                                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                                    {categories.map((cat) => (
                                        <button
                                            type="button"
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={`rounded-full px-3 py-1 text-[11px] font-semibold transition-all ${
                                                selectedCategory === cat
                                                    ? 'border border-[#e9c176]/50 bg-[#e9c176]/20 text-[#e9c176]'
                                                    : 'border border-white/5 bg-white/5 text-slate-400 hover:text-white'
                                            }`}
                                        >
                                            {cat === 'all' ? 'Semua Destinasi' : cat}
                                        </button>
                                    ))}
                                </div>

                                {/* Destination Cards Grid */}
                                <div className="mt-4 grid max-h-[360px] grid-cols-1 gap-2.5 overflow-y-auto pr-1 sm:grid-cols-2">
                                    {filteredDestinations.length > 0 ? (
                                        filteredDestinations.map((dest) => {
                                            const isSelected = data.service_areas.includes(dest.name);
                                            return (
                                                <div
                                                    key={dest.id}
                                                    onClick={() => toggleDestinationName(dest.name)}
                                                    className={`group relative flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition-all ${
                                                        isSelected
                                                            ? 'border-[#e9c176] bg-[#e9c176]/15 shadow-md shadow-[#e9c176]/5'
                                                            : 'border-white/10 bg-[#070D18]/80 hover:border-white/20 hover:bg-[#070D18]'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div
                                                            className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg ${
                                                                isSelected
                                                                    ? 'bg-[#e9c176] text-[#0D182E]'
                                                                    : 'bg-white/5 text-slate-400 group-hover:text-[#e9c176]'
                                                            }`}
                                                        >
                                                            {getCategoryIcon(dest.category)}
                                                        </div>

                                                        <div>
                                                            <h4
                                                                className={`text-xs font-bold ${
                                                                    isSelected ? 'text-[#e9c176]' : 'text-white'
                                                                }`}
                                                            >
                                                                {dest.name}
                                                            </h4>
                                                            {dest.location && (
                                                                <p className="mt-0.5 text-[10px] text-slate-400">
                                                                    {dest.location}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div
                                                        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md border text-xs transition-colors ${
                                                            isSelected
                                                                ? 'border-[#e9c176] bg-[#e9c176] text-[#0D182E]'
                                                                : 'border-white/20 bg-white/5 text-transparent'
                                                        }`}
                                                    >
                                                        <Check className="h-3.5 w-3.5 stroke-[3]" />
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="col-span-full rounded-xl border border-dashed border-white/10 p-6 text-center">
                                            <p className="text-xs text-slate-400">
                                                Destinasi "<span className="font-semibold text-white">{destinationSearch}</span>" tidak ditemukan.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SECTION 4: Rekening Bank */}
                    <div
                        id="sec-bank"
                        className="rounded-3xl border border-white/10 bg-[#16223B]/80 p-6 shadow-xl backdrop-blur-xl transition-all sm:p-8"
                    >
                        <div className="flex items-center gap-3.5 border-b border-white/10 pb-4">
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#e9c176]/20 text-[#e9c176] shadow-inner">
                                <CreditCard className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-bold text-white sm:text-lg">
                                    4. Informasi Rekening Bank
                                </h2>
                                <p className="text-xs text-slate-400">
                                    Rekening bank untuk penyaluran dana (payout) setelah layanan selesai
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
                            {/* Nama Bank */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                    Nama Bank <span className="text-[#e9c176]">*</span>
                                </label>
                                <select
                                    value={data.bank_name}
                                    onChange={(e) => setData('bank_name', e.target.value)}
                                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#0D182E] px-4 py-3 text-sm text-white transition-colors focus:border-[#e9c176] focus:ring-1 focus:ring-[#e9c176]/50 focus:outline-none"
                                >
                                    {bankOptions.map((bank) => (
                                        <option key={bank} value={bank} className="bg-[#0D182E] text-white">
                                            {bank}
                                        </option>
                                    ))}
                                </select>
                                {errors.bank_name && <p className="mt-1 text-xs text-red-400">{errors.bank_name}</p>}
                            </div>

                            {/* Nomor Rekening */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                    Nomor Rekening <span className="text-[#e9c176]">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.bank_account_number}
                                    onChange={(e) => setData('bank_account_number', e.target.value)}
                                    placeholder="Nomor rekening bank"
                                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#0D182E] px-4 py-3 text-sm text-white placeholder-slate-500 transition-colors focus:border-[#e9c176] focus:ring-1 focus:ring-[#e9c176]/50 focus:outline-none"
                                />
                                {errors.bank_account_number && (
                                    <p className="mt-1 text-xs text-red-400">{errors.bank_account_number}</p>
                                )}
                            </div>

                            {/* Atas Nama Pemilik */}
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                                    Nama Pemilik Rekening <span className="text-[#e9c176]">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={data.bank_account_holder}
                                    onChange={(e) => setData('bank_account_holder', e.target.value)}
                                    placeholder="Sesuai buku tabungan"
                                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#0D182E] px-4 py-3 text-sm text-white placeholder-slate-500 transition-colors focus:border-[#e9c176] focus:ring-1 focus:ring-[#e9c176]/50 focus:outline-none"
                                />
                                {errors.bank_account_holder && (
                                    <p className="mt-1 text-xs text-red-400">{errors.bank_account_holder}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Submit Bar Card */}
                    <div className="rounded-3xl border border-[#e9c176]/30 bg-gradient-to-r from-[#16223B] via-[#0D182E] to-[#16223B] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
                        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
                            <div className="space-y-1 text-center sm:text-left">
                                <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-base font-bold text-white">
                                    Konfirmasi & Pengiriman Berkas
                                </h3>
                                <p className="text-xs text-slate-400">
                                    Data pendaftaran akan diverifikasi oleh administrator dalam 1x24 jam kerja.
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-2xl bg-[#e9c176] px-8 py-4 text-sm font-bold text-[#0D182E] shadow-xl shadow-[#e9c176]/20 transition-all hover:scale-105 hover:bg-[#f3ce87] disabled:opacity-50 sm:w-auto"
                            >
                                {processing ? (
                                    <>
                                        <Spinner />
                                        <span>Memproses...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Kirim Pendaftaran</span>
                                        <ArrowRight className="h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </main>
        </div>
    );
}
