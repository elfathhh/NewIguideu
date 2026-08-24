import { Head, Link } from '@inertiajs/react';
import {
    Compass,
    CheckCircle2,
    Clock,
    ShieldCheck,
    Search,
    ArrowRight,
} from 'lucide-react';

export default function JoinGuideSuccess() {
    return (
        <div className="min-h-screen bg-[#070D18] text-slate-100 selection:bg-[#e9c176] selection:text-[#0D182E]">
            <Head title="Pendaftaran Berhasil Dikirim - IguideU NTB" />

            {/* Header */}
            <header className="border-b border-white/10 bg-[#0D182E]/90 backdrop-blur-xl">
                <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2.5 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-bold tracking-tight text-[#e9c176]"
                    >
                        <Compass className="h-7 w-7 text-[#e9c176]" />
                        <span>IguideU</span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
                <div className="rounded-3xl border border-white/10 bg-[#16223B]/80 p-8 text-center shadow-2xl backdrop-blur-2xl sm:p-12">
                    {/* Badge Icon */}
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-[#e9c176]/40 bg-[#e9c176]/10 text-[#e9c176] shadow-xl shadow-[#e9c176]/10">
                        <CheckCircle2 className="h-10 w-10" />
                    </div>

                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1 text-xs font-bold text-amber-400">
                        <Clock className="h-3.5 w-3.5" />
                        <span>Status: Menunggu Verifikasi Administrator</span>
                    </div>

                    <h1 className="mt-5 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-bold text-white sm:text-3xl">
                        Pendaftaran Berhasil Dikirim
                    </h1>

                    <p className="mx-auto mt-3 max-w-xl text-xs leading-relaxed text-slate-300 sm:text-sm">
                        Data identitas KTP dan spesifikasi layanan Anda telah tercatat dan sedang dalam proses peninjauan oleh administrator platform.
                    </p>

                    {/* Timeline / Alur Selanjutnya */}
                    <div className="mt-10 rounded-2xl border border-white/10 bg-[#0D182E]/80 p-6 text-left">
                        <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-[#e9c176]">
                            Tahapan Verifikasi
                        </h3>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4">
                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[#e9c176] bg-[#e9c176]/20 text-xs font-bold text-[#e9c176]">
                                    1
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">
                                        Pemeriksaan Kelayakan Dokumen
                                    </h4>
                                    <p className="mt-0.5 text-xs text-slate-400">
                                        Administrator memverifikasi kejelasan foto KTP, foto profil, dan kesesuaian data rekening bank (estimasi 1x24 jam kerja).
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 text-xs font-bold text-white/60">
                                    2
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">
                                        Aktivasi Akun & Katalog
                                    </h4>
                                    <p className="mt-0.5 text-xs text-slate-400">
                                        Setelah disetujui, status akun menjadi <span className="font-semibold text-emerald-400">Terverifikasi</span> dan profil Anda langsung tampil di katalog pencarian wisatawan.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/5 text-xs font-bold text-white/60">
                                    3
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-white">
                                        Pengelolaan Jadwal & Paket Wisata
                                    </h4>
                                    <p className="mt-0.5 text-xs text-slate-400">
                                        Anda dapat masuk ke portal pemandu untuk mengatur kalender ketersediaan dan rincian paket perjalanan.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link
                            href="/"
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#e9c176] px-6 py-3 text-xs font-bold text-[#0D182E] shadow-lg shadow-[#e9c176]/20 transition-all hover:bg-[#f3ce87] sm:w-auto"
                        >
                            <span>Kembali ke Beranda</span>
                            <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                            href="/guides"
                            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-3 text-xs font-semibold text-white transition-all hover:bg-white/10 sm:w-auto"
                        >
                            <Search className="h-4 w-4 text-[#e9c176]" />
                            <span>Lihat Katalog Pemandu</span>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
