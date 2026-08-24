import { memo, useState } from 'react';
import { Compass, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { LegalModal, type LegalModalType } from '@/components/landing/legal-modal';

function LandingFooterComponent() {
    const [legalModalType, setLegalModalType] = useState<LegalModalType>(null);

    const scrollToSection = (
        e: React.MouseEvent<HTMLAnchorElement>,
        targetId: string,
    ) => {
        e.preventDefault();
        const id = targetId.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
            const headerOffset = 80;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition =
                elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
            window.history.pushState(null, '', targetId);
        } else if (window.location.pathname !== '/') {
            window.location.href = `/${targetId}`;
        }
    };

    const scrollToTop = (e: React.MouseEvent) => {
        if (window.location.pathname === '/') {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth',
            });
            window.history.pushState(null, '', '/');
        }
    };

    return (
        <footer className="cv-auto border-t border-white/10 bg-[#081021] text-[#8f9097]">
            <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-16">
                <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
                    {/* Brand Col */}
                    <div className="md:col-span-1">
                        <Link
                            href="/"
                            onClick={scrollToTop}
                            className="mb-4 flex items-center gap-2 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-bold text-[#e9c176]"
                        >
                            <Compass className="h-6 w-6 text-[#e9c176]" />
                            <span>IguideU</span>
                        </Link>
                        <p className="text-xs leading-relaxed text-[#8f9097]">
                            Platform terverifikasi penghubung wisatawan dengan
                            pemandu wisata lokal profesional di Nusa Tenggara
                            Barat.
                        </p>
                    </div>

                    {/* Nav Links */}
                    <div>
                        <h4 className="mb-4 text-xs font-bold tracking-wider text-white uppercase">
                            Navigasi
                        </h4>
                        <ul className="space-y-2.5 text-xs">
                            <li>
                                <a
                                    href="#kategori"
                                    onClick={(e) =>
                                        scrollToSection(e, '#kategori')
                                    }
                                    className="cursor-pointer transition-colors hover:text-[#e9c176]"
                                >
                                    Kategori Destinasi
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#pemandu"
                                    onClick={(e) =>
                                        scrollToSection(e, '#pemandu')
                                    }
                                    className="cursor-pointer transition-colors hover:text-[#e9c176]"
                                >
                                    Pemandu Terverifikasi
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#tentang"
                                    onClick={(e) =>
                                        scrollToSection(e, '#tentang')
                                    }
                                    className="cursor-pointer transition-colors hover:text-[#e9c176]"
                                >
                                    Tentang IguideU
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Links with Interactive Modal */}
                    <div>
                        <h4 className="mb-4 text-xs font-bold tracking-wider text-white uppercase">
                            Syarat & Kebijakan
                        </h4>
                        <ul className="space-y-2.5 text-xs">
                            <li>
                                <button
                                    type="button"
                                    onClick={() => setLegalModalType('terms')}
                                    className="cursor-pointer text-left transition-colors hover:text-[#e9c176]"
                                >
                                    Ketentuan Layanan
                                </button>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    onClick={() => setLegalModalType('privacy')}
                                    className="cursor-pointer text-left transition-colors hover:text-[#e9c176]"
                                >
                                    Kebijakan Privasi
                                </button>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    onClick={() => setLegalModalType('refund')}
                                    className="cursor-pointer text-left transition-colors hover:text-[#e9c176]"
                                >
                                    Garansi Pengembalian Dana
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="mb-4 text-xs font-bold tracking-wider text-white uppercase">
                            Hubungi Kami
                        </h4>
                        <ul className="space-y-2.5 text-xs">
                            <li>
                                <a
                                    href="https://maps.google.com/?q=Mataram,+Nusa+Tenggara+Barat"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 transition-colors hover:text-[#e9c176]"
                                >
                                    <MapPin className="h-4 w-4 text-[#e9c176]" />
                                    <span>Mataram, Nusa Tenggara Barat</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="mailto:iguideutravel@gmail.com"
                                    className="flex items-center gap-2 transition-colors hover:text-[#e9c176]"
                                >
                                    <Mail className="h-4 w-4 text-[#e9c176]" />
                                    <span>iguideutravel@gmail.com</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    href="https://wa.me/6281915775728"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 transition-colors hover:text-[#e9c176]"
                                >
                                    <Phone className="h-4 w-4 text-[#e9c176]" />
                                    <span>+62819-1577-5728</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 border-t border-white/5 pt-8 text-center text-xs text-[#555e75]">
                    <p>
                        &copy; {new Date().getFullYear()} IguideU. All rights
                        reserved.
                    </p>
                </div>
            </div>

            {/* Interactive Legal & Guarantee Policy Modal */}
            <LegalModal
                type={legalModalType}
                isOpen={legalModalType !== null}
                onClose={() => setLegalModalType(null)}
            />
        </footer>
    );
}

export const LandingFooter = memo(LandingFooterComponent);
