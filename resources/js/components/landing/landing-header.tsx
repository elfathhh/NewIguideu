import { useEffect, useRef, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    Compass,
    Bell,
    ChevronDown,
    Ticket,
    LogOut,
    Menu,
    X,
    LayoutDashboard,
    Sparkles,
    Briefcase,
} from 'lucide-react';
import { dashboard, login, logout, register } from '@/routes';
import { NotificationPopover } from '@/components/landing/notification-popover';

export default function LandingHeader({ notifications }: { notifications?: any[] }) {
    const { auth, userNotifications } = usePage<{ auth?: any; userNotifications?: any[] }>().props;
    const activeNotifs = notifications || userNotifications || [];
    const activeBookingsCount = auth?.activeBookingsCount ?? 0;
    const hasUnread = activeNotifs.some((n: any) => n.unread);
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState<string>('');
    const profileDropdownRef = useRef<HTMLDivElement>(null);
    const notifRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let ticking = false;
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.scrollY > 20;
                    setIsScrolled((prev) =>
                        prev !== scrolled ? scrolled : prev,
                    );

                    // ScrollSpy active section detection
                    const sectionIds = ['kategori', 'pemandu', 'tentang'];
                    const scrollPosition = window.scrollY + 120;
                    let currentSection = '';

                    for (let i = sectionIds.length - 1; i >= 0; i--) {
                        const el = document.getElementById(sectionIds[i]);
                        if (el && el.offsetTop <= scrollPosition) {
                            currentSection = sectionIds[i];
                            break;
                        }
                    }
                    setActiveSection(currentSection);

                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                profileDropdownRef.current &&
                !profileDropdownRef.current.contains(event.target as Node)
            ) {
                setProfileDropdownOpen(false);
            }
            if (
                notifRef.current &&
                !notifRef.current.contains(event.target as Node)
            ) {
                setNotificationsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside, {
            passive: true,
        });
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (window.location.hash) {
            const id = window.location.hash.replace('#', '');
            const element = document.getElementById(id);
            if (element) {
                setTimeout(() => {
                    const headerOffset = 80;
                    const elementPosition = element.getBoundingClientRect().top;
                    const offsetPosition =
                        elementPosition + window.pageYOffset - headerOffset;
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth',
                    });
                    setActiveSection(id);
                }, 150);
            }
        }
    }, []);

    const scrollToSection = (
        e: React.MouseEvent<HTMLAnchorElement>,
        targetId: string,
    ) => {
        e.preventDefault();
        setMobileMenuOpen(false);

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
            setActiveSection(id);
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
            setActiveSection('');
        }
    };

    const user = auth?.user as
        { name?: string; email?: string; role?: string } | undefined;
    const userInitial = user?.name?.charAt(0)?.toUpperCase() || 'U';

    const NAV_ITEMS = [
        { id: 'kategori', label: 'Kategori' },
        { id: 'pemandu', label: 'Pemandu Wisata' },
        { id: 'tentang', label: 'Tentang Kami' },
    ];

    return (
        <header
            className={`sticky top-0 z-50 w-full transition-all duration-300 ${
                isScrolled
                    ? 'border-b border-[#e9c176]/20 bg-[#0D182E]/95 py-3 shadow-xl shadow-black/40 backdrop-blur-xl'
                    : 'border-b border-white/10 bg-[#0D182E]/50 py-4 backdrop-blur-md'
            }`}
        >
            <div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 md:px-16">
                {/* Brand Logo */}
                <Link
                    href="/"
                    onClick={scrollToTop}
                    className="flex items-center gap-2 font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-bold tracking-tight text-[#e9c176] transition-opacity hover:opacity-90"
                >
                    <Compass className="h-7 w-7 text-[#e9c176]" />
                    <span>IguideU</span>
                </Link>

                {/* Navigation Links (Desktop) */}
                <nav className="hidden items-center gap-2 md:flex">
                    {NAV_ITEMS.map((item) => {
                        const isActive = activeSection === item.id;
                        return (
                            <a
                                key={item.id}
                                href={`#${item.id}`}
                                onClick={(e) =>
                                    scrollToSection(e, `#${item.id}`)
                                }
                                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 ${
                                    isActive
                                        ? 'bg-[#e9c176]/15 text-[#e9c176] shadow-sm'
                                        : 'text-[#8f9097] hover:bg-white/5 hover:text-[#e9c176]'
                                }`}
                            >
                                {item.label}
                            </a>
                        );
                    })}
                </nav>

                {/* Auth Buttons */}
                <div className="hidden items-center gap-4 md:flex">
                    {user ? (
                        user.role === 'admin' || user.role === 'guide' ? (
                            <Link
                                href={user.role === 'admin' ? '/admin/dashboard' : '/guide/dashboard'}
                                className="flex items-center gap-2 rounded-full bg-[#e9c176] px-6 py-2 text-sm font-semibold text-[#0D182E] shadow-md shadow-[#e9c176]/20 transition-all hover:scale-105 hover:bg-[#f3ce87]"
                            >
                                <LayoutDashboard className="h-4 w-4" />
                                <span>Dashboard</span>
                            </Link>
                        ) : (
                            <div className="flex items-center gap-3">
                                {/* Pesanan Saya Pill Menu */}
                                <Link
                                    href="/pesanan"
                                    className="group relative flex items-center gap-2 rounded-full border border-white/15 bg-[#16223B]/80 px-3.5 py-1.5 text-white transition-all hover:border-[#e9c176]/60 hover:bg-[#16223B] hover:text-[#e9c176] hover:shadow-[0_0_15px_rgba(233,193,118,0.2)]"
                                    title="Pesanan Saya"
                                >
                                    <Ticket className="h-4 w-4 text-[#e9c176] transition-transform duration-300 group-hover:rotate-12" />
                                    <span className="text-xs font-bold text-white group-hover:text-[#e9c176]">
                                        Pesanan Saya
                                    </span>
                                    <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#e9c176] px-1 text-[10px] font-black text-[#0D182E] shadow-sm">
                                        {activeBookingsCount > 0 ? activeBookingsCount : 1}
                                    </span>
                                </Link>

                                {/* Core Traveler Quick Access Icons */}
                                <div className="flex items-center gap-2 border-r border-white/10 pr-2">
                                    {/* Notification Bell with Popover */}
                                    <div className="relative" ref={notifRef}>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setNotificationsOpen(!notificationsOpen)
                                            }
                                            className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 text-[#e2e2e2] transition-colors hover:border-[#e9c176]/40 hover:bg-white/10 hover:text-[#e9c176]"
                                            title="Notifikasi"
                                        >
                                            <Bell className="h-4 w-4" />
                                            {hasUnread && (
                                                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e9c176] opacity-75"></span>
                                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#e9c176]"></span>
                                                </span>
                                            )}
                                        </button>
                                        <NotificationPopover
                                            isOpen={notificationsOpen}
                                            onClose={() => setNotificationsOpen(false)}
                                            notifications={activeNotifs}
                                        />
                                    </div>
                                </div>

                                {/* Profile Dropdown Chip Trigger */}
                                <div
                                    className="relative"
                                    ref={profileDropdownRef}
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setProfileDropdownOpen(
                                                !profileDropdownOpen,
                                            )
                                        }
                                        className="flex cursor-pointer items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 backdrop-blur-md transition-all hover:border-[#e9c176]/40 hover:bg-white/10"
                                    >
                                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e9c176] text-xs font-bold text-[#0D182E]">
                                            {userInitial}
                                        </div>
                                        <span className="max-w-[120px] truncate text-xs font-semibold text-[#e2e2e2]">
                                            {user.name}
                                        </span>
                                        <ChevronDown
                                            className={`h-4 w-4 text-[#8f9097] transition-transform duration-200 ${
                                                profileDropdownOpen
                                                    ? 'rotate-180'
                                                    : ''
                                            }`}
                                        />
                                    </button>

                                    {/* Profile Dropdown Menu */}
                                    {profileDropdownOpen && (
                                        <div className="absolute top-full right-0 z-50 mt-2 w-64 animate-in rounded-2xl border border-white/15 bg-[#16223B]/95 p-2 shadow-2xl backdrop-blur-2xl duration-150 fade-in-50 zoom-in-95">
                                            {/* Profile Identity Header */}
                                            <div className="mb-1 flex items-center gap-3 border-b border-white/10 p-3">
                                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#e9c176] text-sm font-bold text-[#0D182E]">
                                                    {userInitial}
                                                </div>
                                                <div className="truncate text-left">
                                                    <p className="truncate text-xs font-bold text-white">
                                                        {user.name}
                                                    </p>
                                                    <p className="truncate text-[11px] text-[#8f9097]">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Menu Items */}
                                            <div className="space-y-1 py-1">
                                                <Link
                                                    href="/pesanan"
                                                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-[#e2e2e2] transition-colors hover:bg-white/10 hover:text-[#e9c176]"
                                                    onClick={() =>
                                                        setProfileDropdownOpen(
                                                            false,
                                                        )
                                                    }
                                                >
                                                    <Ticket className="h-4 w-4 text-[#8f9097]" />
                                                    <span>Pesanan Saya</span>
                                                </Link>
                                                <Link
                                                    href="/join-guide"
                                                    className="flex items-center gap-2.5 rounded-xl bg-[#e9c176]/10 px-3 py-2 text-xs font-semibold text-[#e9c176] transition-colors hover:bg-[#e9c176]/20"
                                                    onClick={() =>
                                                        setProfileDropdownOpen(
                                                            false,
                                                        )
                                                    }
                                                >
                                                    <Sparkles className="h-4 w-4 text-[#e9c176]" />
                                                    <span>Daftar Sebagai Guide</span>
                                                </Link>
                                            </div>

                                            <div className="my-1 border-t border-white/10"></div>

                                            {/* Destructive Logout Action */}
                                            <Link
                                                href={logout()}
                                                method="post"
                                                as="button"
                                                className="flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/15 hover:text-red-300"
                                            >
                                                <LogOut className="h-4 w-4" />
                                                <span>Keluar</span>
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    ) : (
                        <>
                            <Link
                                href="/join-guide"
                                className="flex items-center gap-1.5 rounded-full border border-[#e9c176]/40 bg-[#e9c176]/10 px-4 py-1.5 text-xs font-bold text-[#e9c176] shadow-sm transition-all hover:border-[#e9c176] hover:bg-[#e9c176]/20 hover:scale-105"
                            >
                                <Sparkles className="h-3.5 w-3.5" />
                                <span>Jadi Guide</span>
                            </Link>
                            <Link
                                href={login()}
                                className="text-sm font-semibold text-[#e2e2e2] transition-colors hover:text-[#e9c176]"
                            >
                                Masuk
                            </Link>
                            <Link
                                href={register()}
                                className="rounded-full bg-[#e9c176] px-6 py-2 text-sm font-semibold text-[#0D182E] shadow-md shadow-[#e9c176]/20 transition-all hover:scale-105 hover:bg-[#f3ce87]"
                            >
                                Daftar
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="rounded-lg p-2 text-[#e9c176] transition-colors hover:bg-white/5 md:hidden"
                    aria-label="Toggle Navigation"
                >
                    {mobileMenuOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>
            </div>

            {/* Mobile Navigation Drawer */}
            {mobileMenuOpen && (
                <div className="animate-in space-y-4 border-t border-white/10 bg-[#0D182E]/95 px-6 py-6 backdrop-blur-2xl duration-200 slide-in-from-top-2 md:hidden">
                    <nav className="flex flex-col space-y-2">
                        {NAV_ITEMS.map((item) => {
                            const isActive = activeSection === item.id;
                            return (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    onClick={(e) =>
                                        scrollToSection(e, `#${item.id}`)
                                    }
                                    className={`rounded-xl px-4 py-3 text-base font-semibold transition-colors ${
                                        isActive
                                            ? 'bg-[#e9c176]/20 text-[#e9c176]'
                                            : 'text-[#e2e2e2] hover:bg-white/5 hover:text-[#e9c176]'
                                    }`}
                                >
                                    {item.label}
                                </a>
                            );
                        })}
                    </nav>
                    <div className="flex flex-col gap-3 border-t border-white/10 pt-4">
                        {user ? (
                            user.role === 'admin' || user.role === 'guide' ? (
                                <Link
                                    href={user.role === 'admin' ? '/admin/dashboard' : '/guide/dashboard'}
                                    className="w-full rounded-xl bg-[#e9c176] py-3 text-center text-sm font-semibold text-[#0D182E]"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    <Link
                                        href="/pesanan"
                                        className="flex w-full items-center justify-between rounded-xl border border-white/15 bg-[#16223B]/90 px-4 py-3 text-xs font-bold text-white transition-colors hover:border-[#e9c176]/50 hover:bg-[#16223B] hover:text-[#e9c176]"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <Ticket className="h-4 w-4 text-[#e9c176]" />
                                            <span>Pesanan Saya</span>
                                        </div>
                                        <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#e9c176] px-1.5 text-[11px] font-black text-[#0D182E]">
                                            {activeBookingsCount > 0 ? activeBookingsCount : 1}
                                        </span>
                                    </Link>
                                    <Link
                                        href="/join-guide"
                                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#e9c176]/40 bg-[#e9c176]/10 py-2.5 text-xs font-bold text-[#e9c176]"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <Sparkles className="h-4 w-4" />
                                        <span>Daftar Sebagai Pemandu Wisata</span>
                                    </Link>
                                    <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-xl">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#e9c176] text-sm font-bold text-[#0D182E]">
                                                {userInitial}
                                            </div>
                                            <div className="truncate text-left">
                                                <p className="truncate text-sm font-semibold text-white">
                                                    {user.name}
                                                </p>
                                                <p className="truncate text-xs text-[#8f9097]">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                        <Link
                                            href={logout()}
                                            method="post"
                                            as="button"
                                            className="flex flex-shrink-0 cursor-pointer items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2 text-xs font-semibold text-red-400 transition-all hover:bg-red-500 hover:text-white"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            <span>Keluar</span>
                                        </Link>
                                    </div>
                                </div>
                            )
                        ) : (
                            <>
                                <Link
                                    href="/join-guide"
                                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#e9c176]/40 bg-[#e9c176]/15 py-3 text-center text-sm font-bold text-[#e9c176]"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <Sparkles className="h-4 w-4" />
                                    <span>Pendaftaran Mitra Guide</span>
                                </Link>
                                <Link
                                    href={login()}
                                    className="w-full rounded-xl border border-white/20 py-3 text-center text-sm font-semibold text-[#e2e2e2]"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href={register()}
                                    className="w-full rounded-xl bg-[#e9c176] py-3 text-center text-sm font-semibold text-[#0D182E]"
                                >
                                    Daftar
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
}
