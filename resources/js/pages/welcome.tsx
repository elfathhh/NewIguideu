import { Head } from '@inertiajs/react';
import LandingHeader from '@/components/landing/landing-header';
import HeroSection from '@/components/landing/hero-section';
import { DestinationGrid } from '@/components/landing/destination-grid';
import { GuideShowcase } from '@/components/landing/guide-showcase';
import { AboutSection } from '@/components/landing/about-section';
import { TestimonialFAQ } from '@/components/landing/testimonial-faq';
import { LandingFooter } from '@/components/landing/landing-footer';
import { MessageSquare, Sparkles } from 'lucide-react';

interface WelcomeProps {
    featuredGuides?: any[];
    categoryStats?: Record<string, number>;
    userNotifications?: any[];
}

export default function Welcome({
    featuredGuides = [],
    categoryStats = {},
    userNotifications = [],
}: WelcomeProps) {
    return (
        <>
            <Head title="IguideU - Pemandu Wisata Lokal Terverifikasi Nusa Tenggara Barat" />

            <div className="min-h-screen overflow-x-clip bg-[#0D182E] font-['Inter',sans-serif] text-[#e2e2e2] antialiased selection:bg-[#e9c176] selection:text-[#0D182E]">
                {/* Isolated Subcomponents with GPU Compositing */}
                <LandingHeader notifications={userNotifications} />

                <main>
                    <HeroSection />
                    <DestinationGrid categoryStats={categoryStats} />
                    <GuideShowcase guides={featuredGuides} />
                    <AboutSection />
                    <TestimonialFAQ />
                </main>

                <LandingFooter />

                {/* Floating WhatsApp Support & Concierge Widget */}
                <aside className="fixed bottom-6 right-6 z-40" aria-label="Bantuan Langsung">
                    <a
                        href="https://wa.me/6281915775728?text=Halo%20IguideU%2C%20saya%20tertarik%20mencari%20pemandu%20wisata%20lokal%20di%20NTB"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-3 rounded-full border border-[#e9c176]/40 bg-[#16223B]/90 px-4 py-3 shadow-2xl shadow-black/50 backdrop-blur-xl transition-all duration-300 hover:scale-105 hover:border-[#e9c176] hover:bg-[#16223B]"
                    >
                        <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-[#e9c176] text-[#0D182E] shadow-md shadow-[#e9c176]/30">
                            <MessageSquare className="h-5 w-5" />
                            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500"></span>
                            </span>
                        </div>
                        <div className="hidden text-left sm:block">
                            <p className="flex items-center gap-1 text-xs font-bold text-white group-hover:text-[#e9c176]">
                                <span>Bantuan Wisata NTB</span>
                                <Sparkles className="h-3 w-3 text-[#e9c176]" />
                            </p>
                            <p className="text-[10px] text-[#8f9097]">
                                Chat Langsung via WhatsApp
                            </p>
                        </div>
                    </a>
                </aside>
            </div>
        </>
    );
}
