import { useState, memo } from 'react';
import {
    ShieldCheck,
    HelpCircle,
    ChevronDown,
    CheckCircle2,
    Heart,
} from 'lucide-react';

const FAQS = [
    {
        q: 'Bagaimana cara IguideU menjamin keamanan dan legalitas pemandu?',
        a: 'Semua pemandu wajib melalui verifikasi identitas resmi (KTP/Passport), pemeriksaan latar belakang, serta sertifikasi keahlian dari BNSP atau asosiasi resmi seperti HPI (Himpunan Pramuwisata Indonesia).',
    },
    {
        q: 'Apakah pembayaran disimpan dalam sistem escrow aman?',
        a: 'Ya, dana Anda disimpan dengan aman di sistem garansi escrow IguideU. Pembayaran baru diteruskan kepada pemandu setelah tur berhasil diselesaikan sesuai kesepakatan.',
    },
    {
        q: 'Bagaimana jika cuaca buruk atau pemandu tidak hadir?',
        a: 'Sistem IguideU menyediakan kebijakan pengembalian dana 100% (Full Refund) atau opsi penjadwalan ulang tanpa biaya penalti apabila ada pembatalan karena faktor cuaca ekstrem atau kendala dari pemandu.',
    },
];

function TestimonialFAQComponent() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    return (
        <section
            id="faq"
            className="cv-auto relative mx-auto max-w-[1440px] scroll-mt-20 px-6 py-20 md:px-16"
        >
            {/* Features & Guarantees Banner */}
            <div className="glass-panel mb-24 rounded-3xl p-8 md:p-12">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#e9c176]/15 text-[#e9c176]">
                            <ShieldCheck className="h-6 w-6" />
                        </div>
                        <div>
                            <h4 className="mb-1 text-base font-bold text-white">
                                Garansi Escrow Safepay
                            </h4>
                            <p className="text-xs leading-relaxed text-[#c6c6ce]">
                                Dana transaksi tersimpan aman di rekening
                                penampung resmi sampai tur selesai dengan
                                sukses.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#e9c176]/15 text-[#e9c176]">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div>
                            <h4 className="mb-1 text-base font-bold text-white">
                                Pemandu Bersertifikat BNSP
                            </h4>
                            <p className="text-xs leading-relaxed text-[#c6c6ce]">
                                Pemandu terverifikasi memiliki sertifikasi
                                kompetensi resmi kepramuwisataan nasional.
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[#e9c176]/15 text-[#e9c176]">
                            <Heart className="h-6 w-6" />
                        </div>
                        <div>
                            <h4 className="mb-1 text-base font-bold text-white">
                                Dukungan Komunitas Lokal
                            </h4>
                            <p className="text-xs leading-relaxed text-[#c6c6ce]">
                                Pemberdayaan ekonomi warga lokal NTB dengan
                                transparansi harga tanpa perantara tersembunyi.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* FAQ Section */}
            <div className="mx-auto max-w-3xl">
                <div className="mb-10 text-center">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-md">
                        <HelpCircle className="h-4 w-4 text-[#e9c176]" />
                        <span className="text-xs font-semibold text-[#e9c176]">
                            FAQ & Bantuan
                        </span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-white md:text-4xl">
                        Pertanyaan Sering Diajukan
                    </h2>
                </div>

                <div className="space-y-4">
                    {FAQS.map((faq, index) => {
                        const isOpen = openFaq === index;
                        return (
                            <div
                                key={index}
                                className={`glass-card overflow-hidden rounded-2xl border transition-all duration-300 ${
                                    isOpen
                                        ? 'border-[#e9c176]/30 bg-white/[0.07] shadow-lg shadow-black/20'
                                        : 'border-white/10 hover:border-white/20'
                                }`}
                            >
                                <button
                                    type="button"
                                    onClick={() =>
                                        setOpenFaq(isOpen ? null : index)
                                    }
                                    className="flex w-full cursor-pointer items-center justify-between p-5 text-left transition-colors hover:bg-white/5 focus:outline-none"
                                    aria-expanded={isOpen}
                                >
                                    <span
                                        className={`pr-4 text-sm font-bold transition-colors duration-300 md:text-base ${
                                            isOpen
                                                ? 'text-[#e9c176]'
                                                : 'text-white'
                                        }`}
                                    >
                                        {faq.q}
                                    </span>
                                    <div
                                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                                            isOpen
                                                ? 'rotate-180 bg-[#e9c176]/15'
                                                : 'bg-white/5'
                                        }`}
                                    >
                                        <ChevronDown
                                            className={`h-4 w-4 transition-colors duration-300 ${
                                                isOpen
                                                    ? 'text-[#e9c176]'
                                                    : 'text-[#8f9097]'
                                            }`}
                                        />
                                    </div>
                                </button>
                                <div
                                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
                                        isOpen
                                            ? 'grid-rows-[1fr] opacity-100'
                                            : 'grid-rows-[0fr] opacity-0'
                                    }`}
                                >
                                    <div className="overflow-hidden">
                                        <div className="border-t border-white/10 p-5 pt-3 text-xs leading-relaxed text-[#c6c6ce] md:text-sm">
                                            {faq.a}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Interactive Inquiry / WhatsApp Support CTA */}
                <div className="mt-10 flex flex-col items-center justify-between gap-4 rounded-2xl border border-[#e9c176]/30 bg-gradient-to-r from-[#e9c176]/15 via-white/[0.03] to-[#e9c176]/10 p-6 text-center sm:flex-row sm:text-left backdrop-blur-md">
                    <div>
                        <h4 className="text-sm font-bold text-white">
                            Punya Pertanyaan Lain Seputar IguideU?
                        </h4>
                        <p className="text-xs text-[#c6c6ce]">
                            Kami siap membantu merencanakan perjalanan impian Anda di Nusa Tenggara Barat!
                        </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                        <a
                            href="https://wa.me/6281915775728?text=Halo%20IguideU%2C%20saya%20ingin%20tanya%20seputar%20pemandu%20wisata%20NTB"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 rounded-xl bg-[#e9c176] px-5 py-2.5 text-xs font-bold text-[#0D182E] shadow-md transition-all hover:bg-[#f3ce87] active:scale-95"
                        >
                            <span>Chat WhatsApp</span>
                        </a>
                        <a
                            href="mailto:iguideutravel@gmail.com"
                            className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-white/10 hover:border-white/30"
                        >
                            <span>Kirim Email</span>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}

export const TestimonialFAQ = memo(TestimonialFAQComponent);
