import { X, ShieldCheck, FileText, Lock } from 'lucide-react';
import { useEffect } from 'react';

export type LegalModalType = 'terms' | 'privacy' | 'refund' | null;

interface LegalModalProps {
    type: LegalModalType;
    isOpen: boolean;
    onClose: () => void;
}

export function LegalModal({ type, isOpen, onClose }: LegalModalProps) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleKeyDown);
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen || !type) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity animate-in fade-in-50"
                onClick={onClose}
            />

            {/* Modal Card */}
            <div className="relative z-10 flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/15 bg-[#16223B] shadow-2xl animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#e9c176]/15 text-[#e9c176]">
                            {type === 'terms' && <FileText className="h-5 w-5" />}
                            {type === 'privacy' && <Lock className="h-5 w-5" />}
                            {type === 'refund' && <ShieldCheck className="h-5 w-5" />}
                        </div>
                        <div>
                            <h3 className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold text-white">
                                {type === 'terms' && 'Ketentuan Layanan (Terms of Service)'}
                                {type === 'privacy' && 'Kebijakan Privasi (Privacy Policy)'}
                                {type === 'refund' && 'Garansi Pengembalian Dana & Escrow'}
                            </h3>
                            <p className="text-xs text-[#8f9097]">
                                Platform IguideU • Pembaruan Terakhir: Agustus 2026
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-xl border border-white/10 p-2 text-[#8f9097] transition-colors hover:border-white/20 hover:bg-white/5 hover:text-white"
                        aria-label="Tutup"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body Content */}
                <div className="overflow-y-auto px-6 py-6 text-xs leading-relaxed text-[#c6c6ce] space-y-4">
                    {type === 'terms' && (
                        <>
                            <div>
                                <h4 className="mb-1 text-sm font-bold text-white">1. Penerimaan Ketentuan</h4>
                                <p>
                                    Dengan mengakses dan menggunakan platform <strong>IguideU</strong>, Anda menyetujui untuk terikat dengan seluruh syarat, ketentuan, serta kebijakan yang berlaku di wilayah hukum Negara Kesatuan Republik Indonesia.
                                </p>
                            </div>
                            <div>
                                <h4 className="mb-1 text-sm font-bold text-white">2. Peran IguideU</h4>
                                <p>
                                    IguideU adalah platform marketplace digital terkurasi yang memfasilitasi pertemuan dan transaksi antara Wisatawan (*Traveler*) dengan Pemandu Wisata Lokal NTB (*Tour Guide*) berlisensi resmi HPI/BNSP.
                                </p>
                            </div>
                            <div>
                                <h4 className="mb-1 text-sm font-bold text-white">3. Tanggung Jawab Pengguna</h4>
                                <p>
                                    Traveler wajib memberikan informasi reservasi yang benar dan mematuhi panduan keselamatan serta etika adat lokal (Sasak, Samawa, Mbojo) selama kegiatan tur berlangsung.
                                </p>
                            </div>
                            <div>
                                <h4 className="mb-1 text-sm font-bold text-white">4. Transaksi & Biaya Layanan</h4>
                                <p>
                                    Seluruh transaksi wajib dilakukan melalui sistem pembayaran resmi IguideU demi perlindungan asuransi dan jaminan dana aman (*Escrow*).
                                </p>
                            </div>
                        </>
                    )}

                    {type === 'privacy' && (
                        <>
                            <div>
                                <h4 className="mb-1 text-sm font-bold text-white">1. Pengumpulan Informasi</h4>
                                <p>
                                    Kami mengumpulkan data yang Anda berikan saat pendaftaran akun, verifikasi identitas (KYC untuk pemandu), serta detail pemesanan seperti nama, email, nomor kontak, dan preferensi wisata.
                                </p>
                            </div>
                            <div>
                                <h4 className="mb-1 text-sm font-bold text-white">2. Keamanan Data Pengguna</h4>
                                <p>
                                    Data sensitif Anda dienkripsi dengan standar keamanan tinggi (SSL 256-bit) dan autentikasi token modern (Sanctum/Passkey). Kami tidak menjual data pribadi kepada pihak ketiga untuk kepentingan iklan.
                                </p>
                            </div>
                            <div>
                                <h4 className="mb-1 text-sm font-bold text-white">3. Komunikasi Terlindungi</h4>
                                <p>
                                    Fitur pesan instan di dalam aplikasi dirancang agar nomor telepon dan informasi kontak pribadi Anda tetap terlindungi hingga pemesanan resmi terkonfirmasi.
                                </p>
                            </div>
                        </>
                    )}

                    {type === 'refund' && (
                        <>
                            <div className="rounded-2xl border border-[#e9c176]/30 bg-[#e9c176]/10 p-4">
                                <div className="flex items-center gap-2 mb-1.5 font-bold text-[#e9c176]">
                                    <ShieldCheck className="h-4 w-4" />
                                    <span>Jaminan Perlindungan Transaksi 100% Escrow</span>
                                </div>
                                <p className="text-[11px] text-[#e2e2e2]">
                                    Uang pembayaran Anda ditampung di rekening penampung resmi IguideU dan HANYA diteruskan ke pemandu setelah tur selesai diselenggarakan dengan memuaskan.
                                </p>
                            </div>
                            <div>
                                <h4 className="mb-1 text-sm font-bold text-white">1. Pembatalan Akibat Cuaca Ekstrem / Force Majeure</h4>
                                <p>
                                    Jika terjadi penutupan jalur pendakian Gunung Rinjani, cuaca buruk penyeberangan Gili, atau bencana alam, traveler berhak mendapatkan <strong>100% Full Refund</strong> atau opsi penjadwalan ulang gratis.
                                </p>
                            </div>
                            <div>
                                <h4 className="mb-1 text-sm font-bold text-white">2. Pemandu Tidak Hadir (*No-Show*)</h4>
                                <p>
                                    Apabila pemandu yang terkonfirmasi tidak hadir di titik kumpul tanpa pemberitahuan sah, traveler akan segera mendapatkan pengembalian dana penuh dan kompensasi voucher perjalanan.
                                </p>
                            </div>
                            <div>
                                <h4 className="mb-1 text-sm font-bold text-white">3. Proses Klaim & Pencairan Dana</h4>
                                <p>
                                    Klaim pengembalian dana diproses dalam waktu 1x24 jam kerja langsung ke rekening bank atau dompet digital asal.
                                </p>
                            </div>
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end border-t border-white/10 bg-[#0D182E]/50 px-6 py-4">
                    <button
                        onClick={onClose}
                        className="rounded-xl bg-[#e9c176] px-6 py-2.5 text-xs font-bold text-[#0D182E] shadow-md transition-all hover:bg-[#f3ce87] active:scale-95"
                    >
                        Saya Mengerti
                    </button>
                </div>
            </div>
        </div>
    );
}
