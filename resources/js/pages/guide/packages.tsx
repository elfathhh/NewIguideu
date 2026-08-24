import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEvent, useState } from 'react';

export default function GuideServices() {
    const { auth, settings } = usePage<{
        auth: any;
        settings: {
            phone?: string;
            daily_rate: number;
            service_areas: string[];
            vehicles: string[];
            extras: string[];
        };
    }>().props;

    const { data, setData, post, processing, errors } = useForm({
        phone: settings.phone || '',
        daily_rate: settings.daily_rate || 0,
        service_areas: settings.service_areas || [],
        vehicles: settings.vehicles || [],
        extras: settings.extras || [],
        newArea: '',
    });

    const [toastMessage, setToastMessage] = useState('');

    const toggleArrayItem = (field: 'vehicles' | 'extras', value: string) => {
        const arr = data[field];
        if (arr.includes(value)) {
            setData(
                field,
                arr.filter((item) => item !== value),
            );
        } else {
            setData(field, [...arr, value]);
        }
    };

    const addArea = () => {
        const val = data.newArea.trim();
        if (val && !data.service_areas.includes(val)) {
            setData('service_areas', [...data.service_areas, val]);
            setData('newArea', '');
        }
    };

    const removeArea = (area: string) => {
        setData(
            'service_areas',
            data.service_areas.filter((a) => a !== area),
        );
    };

    const submit = (e: FormEvent) => {
        e.preventDefault();

        post('/guide/packages', {
            preserveScroll: true,
            onSuccess: () => {
                setToastMessage('Pengaturan layanan berhasil disimpan!');
                setTimeout(() => setToastMessage(''), 3000);
            },
        });
    };

    // UI Helpers
    const ToggleSwitch = ({
        active,
        onClick,
        label,
        icon,
        desc,
    }: {
        active: boolean;
        onClick: () => void;
        label: string;
        icon: string;
        desc?: string;
    }) => (
        <div className="flex items-center justify-between rounded-xl border border-white/5 bg-[#16223B]/60 p-4 transition-colors hover:border-[#e9c176]/30">
            <div className="flex items-center gap-3">
                <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${active ? 'bg-[#e9c176]/20 text-[#e9c176]' : 'bg-white/5 text-[#77819c]'}`}
                >
                    <span className="material-symbols-outlined text-[20px]">
                        {icon}
                    </span>
                </div>
                <div>
                    <h4
                        className={`text-sm font-bold ${active ? 'text-white' : 'text-[#77819c]'}`}
                    >
                        {label}
                    </h4>
                    {desc && (
                        <p className="mt-0.5 text-[11px] text-[#77819c]">
                            {desc}
                        </p>
                    )}
                </div>
            </div>
            <button
                type="button"
                onClick={onClick}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${active ? 'bg-[#e9c176]' : 'bg-gray-600'}`}
            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${active ? 'translate-x-6' : 'translate-x-1'}`}
                />
            </button>
        </div>
    );

    return (
        <>
            <Head title="Pengaturan Layanan - IguideU" />

            <div className="flex min-h-screen bg-[#0d182e] font-['Inter',sans-serif] text-[#e2e2e2] selection:bg-[#e9c176] selection:text-[#0d182e]">
                {/* Sidebar Navigation */}
                <aside className="glass-panel sticky top-0 z-40 hidden h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-[#0d182e]/95 md:flex">
                    <div className="px-6 py-8">
                        <Link
                            href="/"
                            className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-bold tracking-tight text-[#e9c176]"
                        >
                            IguideU
                        </Link>
                        <p className="mt-1 text-[10px] font-bold tracking-widest text-[#77819c] uppercase">
                            PORTAL PEMANDU
                        </p>
                    </div>

                    <nav className="mt-2 flex-1 space-y-1.5 px-4">
                        <Link
                            href="/guide/dashboard"
                            className="flex items-center gap-3 rounded-r-lg px-4 py-3 text-sm font-semibold text-[#77819c] transition-all hover:bg-white/5 hover:text-[#e9c176]"
                        >
                            <span className="material-symbols-outlined text-xl">
                                dashboard
                            </span>
                            <span>Dashboard</span>
                        </Link>
                        <Link
                            href="/guide/schedule"
                            className="flex items-center gap-3 rounded-r-lg px-4 py-3 text-sm font-semibold text-[#77819c] transition-all hover:bg-white/5 hover:text-[#e9c176]"
                        >
                            <span className="material-symbols-outlined text-xl">
                                calendar_month
                            </span>
                            <span>Jadwal Tur</span>
                        </Link>
                        <Link
                            href="/guide/packages"
                            className="nav-item-active flex items-center gap-3 rounded-r-lg px-4 py-3 text-sm font-semibold transition-all"
                        >
                            <span className="material-symbols-outlined text-xl">
                                settings_applications
                            </span>
                            <span>Layanan & Tarif</span>
                        </Link>
                    </nav>

                    {/* Profile Card at Sidebar Bottom */}
                    <div className="mt-auto border-t border-white/10 p-5">
                        <div className="mb-3 flex items-center gap-3">
                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[#e9c176]/40 bg-white/5">
                                <img
                                    className="h-full w-full object-cover"
                                    src={
                                        auth?.user?.avatar ||
                                        'https://ui-avatars.com/api/?name=' +
                                            encodeURIComponent(auth?.user?.name || 'Guide') +
                                            '&background=e9c176&color=0d182e'
                                    }
                                    alt="Profile Avatar"
                                />
                            </div>
                            <div className="overflow-hidden">
                                <p className="truncate text-sm font-bold text-white">
                                    {auth?.user?.name || 'Expert Guide'}
                                </p>
                                <p className="truncate text-xs text-[#77819c]">
                                    Expert Local Guide
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            className="flex w-full items-center justify-center gap-2 py-2 text-xs font-semibold text-[#77819c] transition-colors hover:text-rose-400 cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-base">
                                logout
                            </span>{' '}
                            Keluar
                        </Link>
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="relative flex h-screen flex-1 flex-col overflow-y-auto pb-24 md:pb-8">
                    {/* Mobile Top App Bar */}
                    <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b border-white/10 bg-[#0d182e]/90 px-5 py-4 backdrop-blur-md md:hidden">
                        <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold text-white">
                            Pengaturan Layanan
                        </h1>
                        <div className="h-8 w-8 overflow-hidden rounded-full border border-[#e9c176]/30">
                            <img
                                className="h-full w-full object-cover"
                                src={
                                    auth?.user?.avatar ||
                                    'https://ui-avatars.com/api/?name=' +
                                        auth?.user?.name
                                }
                                alt="Profile"
                            />
                        </div>
                    </header>

                    <div className="mx-auto w-full max-w-3xl flex-1 px-5 py-6 md:px-10 md:py-8">
                        <div className="mb-8 hidden md:block">
                            <h2 className="mb-1 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-bold text-white">
                                Pengaturan Layanan & Tarif
                            </h2>
                            <p className="text-sm text-[#77819c]">
                                Atur tarif dasar, area layanan, kendaraan, dan
                                fasilitas ekstra yang Anda tawarkan ke traveler.
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-8">
                            {/* Section 0: Kontak WhatsApp Pemandu */}
                            <section>
                                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wider text-[#e9c176] uppercase">
                                    <span className="material-symbols-outlined text-base">
                                        chat
                                    </span>{' '}
                                    Nomor WhatsApp Pemandu
                                </h3>
                                <div className="rounded-2xl border border-white/10 bg-[#16223B]/40 p-5">
                                    <label className="mb-2 block text-sm font-semibold text-white">
                                        Nomor WhatsApp Aktif <span className="text-[#e9c176]">*</span>
                                    </label>
                                    <p className="mb-4 text-xs text-[#77819c]">
                                        Nomor WhatsApp ini terintegrasi langsung dengan tombol <strong>"WhatsApp Pemandu"</strong> di katalog pencarian dan halaman profil Anda, sehingga wisatawan dapat langsung berkonsultasi dengan Anda.
                                    </p>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                            <span className="material-symbols-outlined text-lg text-[#77819c]">
                                                call
                                            </span>
                                        </div>
                                        <input
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) =>
                                                setData('phone', e.target.value)
                                            }
                                            className="w-full rounded-xl border border-white/20 bg-[#0d182e]/80 py-3.5 pr-4 pl-12 text-base font-bold text-white transition-colors focus:border-[#e9c176] focus:outline-none"
                                            placeholder="Contoh: 081234567890"
                                            required
                                        />
                                    </div>
                                    {errors.phone && (
                                        <p className="mt-2 text-xs text-rose-400">
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>
                            </section>

                            {/* Section 1: Tarif Dasar */}
                            <section>
                                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wider text-[#e9c176] uppercase">
                                    <span className="material-symbols-outlined text-base">
                                        payments
                                    </span>{' '}
                                    Tarif Dasar Harian
                                </h3>
                                <div className="rounded-2xl border border-white/10 bg-[#16223B]/40 p-5">
                                    <label className="mb-2 block text-sm font-semibold text-white">
                                        Tarif Dasar (Rp) per Orang
                                    </label>
                                    <p className="mb-4 text-xs text-[#77819c]">
                                        Tarif ini akan menjadi acuan dasar
                                        perhitungan harga traveler sebelum
                                        ditambah biaya opsi ekstra.
                                    </p>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                            <span className="font-bold text-[#77819c]">
                                                Rp
                                            </span>
                                        </div>
                                        <input
                                            type="number"
                                            value={data.daily_rate}
                                            onChange={(e) =>
                                                setData(
                                                    'daily_rate',
                                                    Number(e.target.value),
                                                )
                                            }
                                            className="w-full rounded-xl border border-white/20 bg-[#0d182e]/80 py-3.5 pr-4 pl-12 text-lg font-bold text-white transition-colors focus:border-[#e9c176] focus:outline-none"
                                            placeholder="Contoh: 350000"
                                            required
                                        />
                                    </div>
                                    {errors.daily_rate && (
                                        <p className="mt-2 text-xs text-rose-400">
                                            {errors.daily_rate}
                                        </p>
                                    )}
                                </div>
                            </section>

                            {/* Section 2: Area Layanan (Destinasi) */}
                            <section>
                                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wider text-[#e9c176] uppercase">
                                    <span className="material-symbols-outlined text-base">
                                        map
                                    </span>{' '}
                                    Area Layanan
                                </h3>
                                <div className="rounded-2xl border border-white/10 bg-[#16223B]/40 p-5">
                                    <p className="mb-4 text-xs text-[#77819c]">
                                        Tambahkan wilayah atau destinasi wisata
                                        yang Anda kuasai. (Contoh: Sembalun,
                                        Senggigi, Mandalika)
                                    </p>

                                    <div className="mb-4 flex gap-2">
                                        <input
                                            type="text"
                                            value={data.newArea}
                                            onChange={(e) =>
                                                setData(
                                                    'newArea',
                                                    e.target.value,
                                                )
                                            }
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    e.preventDefault();
                                                    addArea();
                                                }
                                            }}
                                            className="flex-1 rounded-xl border border-white/20 bg-[#0d182e]/80 px-4 py-3 text-sm text-white transition-colors focus:border-[#e9c176] focus:outline-none"
                                            placeholder="Ketik nama area..."
                                        />
                                        <button
                                            type="button"
                                            onClick={addArea}
                                            className="rounded-xl bg-white/10 px-5 py-3 font-bold text-white transition-colors hover:bg-white/20"
                                        >
                                            Tambah
                                        </button>
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        {data.service_areas.length === 0 ? (
                                            <p className="py-4 text-center text-sm text-[#77819c] italic">
                                                Belum ada area layanan.
                                            </p>
                                        ) : (
                                            data.service_areas.map(
                                                (area, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex items-center justify-between rounded-xl border border-white/5 bg-[#0d182e]/50 px-4 py-3"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <span className="material-symbols-outlined text-sm text-[#77819c]">
                                                                location_on
                                                            </span>
                                                            <span className="text-sm font-medium text-white">
                                                                {area}
                                                            </span>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeArea(area)
                                                            }
                                                            className="rounded p-1 text-rose-400 hover:bg-rose-400/10"
                                                        >
                                                            <span className="material-symbols-outlined block text-lg">
                                                                delete
                                                            </span>
                                                        </button>
                                                    </div>
                                                ),
                                            )
                                        )}
                                    </div>
                                </div>
                            </section>

                            {/* Section 3: Kendaraan */}
                            <section>
                                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wider text-[#e9c176] uppercase">
                                    <span className="material-symbols-outlined text-base">
                                        directions_car
                                    </span>{' '}
                                    Kendaraan
                                </h3>
                                <div className="space-y-3">
                                    <ToggleSwitch
                                        active={data.vehicles.includes('car')}
                                        onClick={() =>
                                            toggleArrayItem('vehicles', 'car')
                                        }
                                        label="Mobil Pribadi"
                                        icon="directions_car"
                                        desc="Sediakan opsi mobil (+Rp150.000 otomatis pada harga)"
                                    />
                                    <ToggleSwitch
                                        active={data.vehicles.includes(
                                            'motorcycle',
                                        )}
                                        onClick={() =>
                                            toggleArrayItem(
                                                'vehicles',
                                                'motorcycle',
                                            )
                                        }
                                        label="Sepeda Motor"
                                        icon="two_wheeler"
                                        desc="Sediakan opsi motor (+Rp50.000 otomatis pada harga)"
                                    />
                                </div>
                            </section>

                            {/* Section 4: Ekstra */}
                            <section>
                                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold tracking-wider text-[#e9c176] uppercase">
                                    <span className="material-symbols-outlined text-base">
                                        stars
                                    </span>{' '}
                                    Fasilitas Ekstra
                                </h3>
                                <div className="space-y-3">
                                    <ToggleSwitch
                                        active={data.extras.includes(
                                            'documentation',
                                        )}
                                        onClick={() =>
                                            toggleArrayItem(
                                                'extras',
                                                'documentation',
                                            )
                                        }
                                        label="Dokumentasi HD"
                                        icon="photo_camera"
                                    />
                                    <ToggleSwitch
                                        active={data.extras.includes(
                                            'equipment',
                                        )}
                                        onClick={() =>
                                            toggleArrayItem(
                                                'extras',
                                                'equipment',
                                            )
                                        }
                                        label="Alat Trekking / Camping"
                                        icon="camping"
                                        desc="+Rp75.000 ke harga akhir"
                                    />
                                    <ToggleSwitch
                                        active={data.extras.includes(
                                            'transfer',
                                        )}
                                        onClick={() =>
                                            toggleArrayItem(
                                                'extras',
                                                'transfer',
                                            )
                                        }
                                        label="Antar-Jemput Hotel"
                                        icon="airport_shuttle"
                                        desc="+Rp100.000 ke harga akhir"
                                    />
                                    <ToggleSwitch
                                        active={data.extras.includes('meals')}
                                        onClick={() =>
                                            toggleArrayItem('extras', 'meals')
                                        }
                                        label="Snack & Makan Siang"
                                        icon="restaurant"
                                    />
                                </div>
                            </section>

                            {/* Floating Save Button / Bottom Action */}
                            <div className="fixed right-0 bottom-0 left-0 z-40 border-t border-white/10 bg-[#0d182e] p-4 md:relative md:mt-8 md:border-none md:bg-transparent md:p-0">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#e9c176] py-3.5 text-sm font-extrabold text-[#0d182e] shadow-[0_0_20px_rgba(233,193,118,0.2)] transition-colors hover:bg-[#e9c176]/90 disabled:opacity-50"
                                >
                                    {processing
                                        ? 'Menyimpan...'
                                        : 'Simpan Pengaturan Layanan'}
                                </button>
                            </div>
                        </form>
                    </div>
                </main>
            </div>

            {/* Toast Notification */}
            {toastMessage && (
                <div className="fixed top-20 right-4 z-[100] flex animate-in items-center gap-3 rounded-xl bg-emerald-500 px-6 py-3 text-white shadow-2xl slide-in-from-right md:right-8">
                    <span className="material-symbols-outlined">
                        check_circle
                    </span>
                    <p className="text-sm font-bold">{toastMessage}</p>
                </div>
            )}
        </>
    );
}
