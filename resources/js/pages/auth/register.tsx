import { Form, Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import {
    User,
    Mail,
    Lock,
    Eye,
    EyeOff,
    Sparkles,
    ShieldCheck,
    Compass,
    CalendarCheck,
    ArrowRight,
    AlertCircle,
    Check,
} from 'lucide-react';
import TextLink from '@/components/text-link';
import { Spinner } from '@/components/ui/spinner';
import { login, home } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules?: string;
};

export default function Register({ passwordRules }: Props) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
    const [agreeTerms, setAgreeTerms] = useState(true);

    const isPasswordLengthValid = passwordInput.length >= 8;
    const isPasswordMatching =
        confirmPasswordInput.length > 0 && passwordInput === confirmPasswordInput;
    const isPasswordMismatch =
        confirmPasswordInput.length > 0 && passwordInput !== confirmPasswordInput;

    return (
        <>
            <Head title="Daftar Akun Wisatawan - IguideU" />

            <div className="relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-[#070e1b] font-body-md text-on-surface antialiased selection:bg-[#C5A059] selection:text-[#070e1b]">
                {/* 100% VH Viewport Container */}
                <main className="relative z-10 flex h-full w-full items-center justify-center p-3 sm:p-5 md:p-6">
                    {/* Immersive Cinematic Background Image */}
                    <div
                        className="pointer-events-none absolute inset-0 z-0 scale-105 bg-cover bg-center opacity-25"
                        style={{
                            backgroundImage:
                                "url('https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1920&q=80')",
                        }}
                    />

                    {/* Dark Gradient Overlay & Glows */}
                    <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-[#070e1b]/95 via-[#09152a]/92 to-[#050a14]/98 backdrop-blur-[6px]" />
                    <div className="pointer-events-none absolute -top-28 -left-28 z-0 h-80 w-80 rounded-full bg-[#C5A059]/10 blur-[100px]" />
                    <div className="pointer-events-none absolute -right-28 -bottom-28 z-0 h-80 w-80 rounded-full bg-[#1e3a8a]/20 blur-[100px]" />

                    {/* Floating Glass Card (Strictly 100vh fitted) */}
                    <div className="relative z-10 my-auto flex max-h-[calc(100vh-1.5rem)] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0a1424]/85 shadow-[0_25px_60px_rgba(0,0,0,0.75)] backdrop-blur-2xl lg:max-h-[92vh] lg:max-w-4xl xl:max-w-5xl lg:flex-row">
                        {/* ============================================================== */}
                        {/* LEFT COLUMN: Clean Branding & Highlights                       */}
                        {/* ============================================================== */}
                        <div className="relative hidden w-full flex-col justify-between overflow-hidden border-b border-white/10 bg-gradient-to-b from-white/[0.04] via-transparent to-black/30 p-6 sm:p-8 lg:flex lg:w-5/12 lg:border-r lg:border-b-0 lg:p-8">
                            <div className="pointer-events-none absolute -top-20 -left-20 h-56 w-56 rounded-full bg-[#C5A059]/15 blur-3xl" />

                            <div className="relative z-10">
                                {/* Brand Logo */}
                                <div className="mb-6">
                                    <Link
                                        href={home()}
                                        className="group inline-flex items-center gap-3"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#C5A059]/30 bg-[#C5A059]/10 shadow-md shadow-[#C5A059]/10 backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
                                            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-lg font-bold text-[#C5A059]">
                                                iU
                                            </span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-extrabold tracking-tight text-white">
                                                Iguide
                                                <span className="text-[#C5A059]">
                                                    U
                                                </span>
                                            </span>
                                        </div>
                                    </Link>
                                </div>

                                {/* Headline */}
                                <div className="mb-6">
                                    <div className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-[#C5A059]/30 bg-[#C5A059]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#C5A059]">
                                        <Sparkles className="h-3 w-3" />
                                        <span>Registrasi Wisatawan</span>
                                    </div>
                                    <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-bold tracking-tight text-white xl:text-[28px] xl:leading-snug">
                                        Mulai Petualangan <br />
                                        <span className="bg-gradient-to-r from-white via-amber-100 to-[#C5A059] bg-clip-text text-transparent">
                                            Autentik Indonesia.
                                        </span>
                                    </h1>
                                    <p className="mt-2 text-xs leading-relaxed text-[#c6c6ce]">
                                        Jelajahi keindahan nusantara bersama pemandu lokal berlisensi dan ulasan terpercaya.
                                    </p>
                                </div>

                                {/* Simple Feature List */}
                                <div className="space-y-2.5">
                                    <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-2.5 backdrop-blur-sm">
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#C5A059]/15 text-[#C5A059]">
                                            <Compass className="h-3.5 w-3.5" />
                                        </div>
                                        <span className="text-xs font-medium text-[#e2e8f0]">
                                            Pemandu Lokal Berlisensi & Terverifikasi
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-2.5 backdrop-blur-sm">
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
                                            <ShieldCheck className="h-3.5 w-3.5" />
                                        </div>
                                        <span className="text-xs font-medium text-[#e2e8f0]">
                                            Pemesanan Aman & Tarif Transparan
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.03] p-2.5 backdrop-blur-sm">
                                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/15 text-blue-400">
                                            <CalendarCheck className="h-3.5 w-3.5" />
                                        </div>
                                        <span className="text-xs font-medium text-[#e2e8f0]">
                                            Itinerary Fleksibel & Kustom
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Guide Recruitment Link */}
                            <div className="relative z-10 mt-6 border-t border-white/10 pt-4">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-[#8f9097]">Ingin jadi pemandu?</span>
                                    <Link
                                        href="/join-guide"
                                        className="inline-flex items-center gap-1 font-semibold text-[#C5A059] transition-colors hover:text-white"
                                    >
                                        <span>Daftar Guide</span>
                                        <ArrowRight className="h-3 w-3" />
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* ============================================================== */}
                        {/* RIGHT COLUMN: Streamlined Registration Form                    */}
                        {/* ============================================================== */}
                        <div className="relative flex w-full flex-col justify-center overflow-y-auto p-5 sm:p-7 lg:w-7/12 lg:p-8">
                            <div className="mx-auto w-full max-w-sm sm:max-w-md">
                                {/* Mobile Header Logo (visible only on small screens) */}
                                <div className="mb-4 flex items-center justify-between lg:hidden">
                                    <Link href={home()} className="flex items-center gap-2">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#C5A059]/30 bg-[#C5A059]/10">
                                            <span className="text-xs font-bold text-[#C5A059]">iU</span>
                                        </div>
                                        <span className="text-base font-bold text-white">
                                            Iguide<span className="text-[#C5A059]">U</span>
                                        </span>
                                    </Link>
                                    <Link
                                        href="/join-guide"
                                        className="text-xs font-semibold text-[#C5A059] hover:underline"
                                    >
                                        Daftar Guide →
                                    </Link>
                                </div>

                                {/* Form Title */}
                                <div className="mb-4">
                                    <h2 className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-bold tracking-tight text-white sm:text-2xl">
                                        Buat Akun Wisatawan
                                    </h2>
                                    <p className="mt-0.5 text-xs text-[#c6c6ce]">
                                        Daftar akun untuk mulai memesan perjalanan.
                                    </p>
                                </div>

                                {/* Registration Form */}
                                <Form
                                    {...store.form()}
                                    resetOnSuccess={['password', 'password_confirmation']}
                                    disableWhileProcessing
                                    className="flex w-full flex-col gap-3"
                                >
                                    {({ processing, errors }) => (
                                        <>
                                            {/* General Error Alert if any */}
                                            {Object.keys(errors).length > 0 && (
                                                <div className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 p-2.5 text-xs text-red-300">
                                                    <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                                                    <span>Mohon periksa kembali isian formulir Anda.</span>
                                                </div>
                                            )}

                                            {/* Full Name Field */}
                                            <div className="relative">
                                                <label
                                                    className="mb-1 ml-0.5 block font-label-md text-[10px] font-bold tracking-wider text-on-surface-variant uppercase"
                                                    htmlFor="name"
                                                >
                                                    Nama Lengkap <span className="text-[#C5A059]">*</span>
                                                </label>
                                                <div className="group relative flex items-center">
                                                    <User className="pointer-events-none absolute left-3 z-10 h-4 w-4 text-on-surface-variant opacity-60 transition-colors group-focus-within:text-[#C5A059] group-focus-within:opacity-100" />
                                                    <input
                                                        id="name"
                                                        name="name"
                                                        type="text"
                                                        required
                                                        autoFocus
                                                        tabIndex={1}
                                                        autoComplete="name"
                                                        placeholder="Nama lengkap Anda"
                                                        className={`w-full rounded-xl border border-white/10 bg-[#050a14]/60 py-2 pr-3 pl-9 text-xs text-on-surface placeholder-on-surface-variant/40 transition-all duration-200 outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 sm:text-sm ${
                                                            errors.name
                                                                ? 'border-red-500/80 ring-2 ring-red-500/30'
                                                                : ''
                                                        }`}
                                                    />
                                                </div>
                                                {errors.name && (
                                                    <p className="mt-0.5 ml-1 text-[11px] text-red-400">{errors.name}</p>
                                                )}
                                            </div>

                                            {/* Email Address Field */}
                                            <div className="relative">
                                                <label
                                                    className="mb-1 ml-0.5 block font-label-md text-[10px] font-bold tracking-wider text-on-surface-variant uppercase"
                                                    htmlFor="email"
                                                >
                                                    Alamat Email <span className="text-[#C5A059]">*</span>
                                                </label>
                                                <div className="group relative flex items-center">
                                                    <Mail className="pointer-events-none absolute left-3 z-10 h-4 w-4 text-on-surface-variant opacity-60 transition-colors group-focus-within:text-[#C5A059] group-focus-within:opacity-100" />
                                                    <input
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        required
                                                        tabIndex={2}
                                                        autoComplete="email"
                                                        placeholder="traveler@example.com"
                                                        className={`w-full rounded-xl border border-white/10 bg-[#050a14]/60 py-2 pr-3 pl-9 text-xs text-on-surface placeholder-on-surface-variant/40 transition-all duration-200 outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 sm:text-sm ${
                                                            errors.email
                                                                ? 'border-red-500/80 ring-2 ring-red-500/30'
                                                                : ''
                                                        }`}
                                                    />
                                                </div>
                                                {errors.email && (
                                                    <p className="mt-0.5 ml-1 text-[11px] text-red-400">{errors.email}</p>
                                                )}
                                            </div>

                                            {/* Two Column Grid for Passwords on Tablets/Desktops */}
                                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                {/* Password Field */}
                                                <div className="relative">
                                                    <label
                                                        className="mb-1 ml-0.5 block font-label-md text-[10px] font-bold tracking-wider text-on-surface-variant uppercase"
                                                        htmlFor="password"
                                                    >
                                                        Kata Sandi <span className="text-[#C5A059]">*</span>
                                                    </label>
                                                    <div className="group relative flex items-center">
                                                        <Lock className="pointer-events-none absolute left-3 z-10 h-4 w-4 text-on-surface-variant opacity-60 transition-colors group-focus-within:text-[#C5A059] group-focus-within:opacity-100" />
                                                        <input
                                                            id="password"
                                                            name="password"
                                                            type={showPassword ? 'text' : 'password'}
                                                            required
                                                            tabIndex={3}
                                                            autoComplete="new-password"
                                                            placeholder="Min. 8 karakter"
                                                            passwordrules={passwordRules}
                                                            value={passwordInput}
                                                            onChange={(e) => setPasswordInput(e.target.value)}
                                                            className={`w-full rounded-xl border border-white/10 bg-[#050a14]/60 py-2 pr-9 pl-9 text-xs text-on-surface placeholder-on-surface-variant/40 transition-all duration-200 outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 sm:text-sm ${
                                                                errors.password
                                                                    ? 'border-red-500/80 ring-2 ring-red-500/30'
                                                                    : ''
                                                            }`}
                                                        />
                                                        <button
                                                            type="button"
                                                            tabIndex={-1}
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            className="absolute right-2 z-10 p-1 text-on-surface-variant opacity-60 transition-opacity hover:opacity-100"
                                                            aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                                                        >
                                                            {showPassword ? (
                                                                <EyeOff className="h-3.5 w-3.5" />
                                                            ) : (
                                                                <Eye className="h-3.5 w-3.5" />
                                                            )}
                                                        </button>
                                                    </div>
                                                    {errors.password && (
                                                        <p className="mt-0.5 ml-1 text-[11px] text-red-400">{errors.password}</p>
                                                    )}
                                                </div>

                                                {/* Confirm Password Field */}
                                                <div className="relative">
                                                    <label
                                                        className="mb-1 ml-0.5 block font-label-md text-[10px] font-bold tracking-wider text-on-surface-variant uppercase"
                                                        htmlFor="password_confirmation"
                                                    >
                                                        Konfirmasi Sandi <span className="text-[#C5A059]">*</span>
                                                    </label>
                                                    <div className="group relative flex items-center">
                                                        <Lock className="pointer-events-none absolute left-3 z-10 h-4 w-4 text-on-surface-variant opacity-60 transition-colors group-focus-within:text-[#C5A059] group-focus-within:opacity-100" />
                                                        <input
                                                            id="password_confirmation"
                                                            name="password_confirmation"
                                                            type={showConfirmPassword ? 'text' : 'password'}
                                                            required
                                                            tabIndex={4}
                                                            autoComplete="new-password"
                                                            placeholder="Ulangi sandi"
                                                            passwordrules={passwordRules}
                                                            value={confirmPasswordInput}
                                                            onChange={(e) => setConfirmPasswordInput(e.target.value)}
                                                            className={`w-full rounded-xl border border-white/10 bg-[#050a14]/60 py-2 pr-9 pl-9 text-xs text-on-surface placeholder-on-surface-variant/40 transition-all duration-200 outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 sm:text-sm ${
                                                                errors.password_confirmation || isPasswordMismatch
                                                                    ? 'border-red-500/80 ring-2 ring-red-500/30'
                                                                    : isPasswordMatching
                                                                      ? 'border-emerald-500/80 ring-2 ring-emerald-500/20'
                                                                      : ''
                                                            }`}
                                                        />
                                                        <button
                                                            type="button"
                                                            tabIndex={-1}
                                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                            className="absolute right-2 z-10 p-1 text-on-surface-variant opacity-60 transition-opacity hover:opacity-100"
                                                            aria-label={showConfirmPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
                                                        >
                                                            {showConfirmPassword ? (
                                                                <EyeOff className="h-3.5 w-3.5" />
                                                            ) : (
                                                                <Eye className="h-3.5 w-3.5" />
                                                            )}
                                                        </button>
                                                    </div>
                                                    {errors.password_confirmation && (
                                                        <p className="mt-0.5 ml-1 text-[11px] text-red-400">{errors.password_confirmation}</p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Live Validation Match Indicator */}
                                            {(passwordInput.length > 0 || confirmPasswordInput.length > 0) && (
                                                <div className="flex flex-wrap items-center gap-3 px-0.5 text-[11px]">
                                                    {passwordInput.length > 0 && (
                                                        <span
                                                            className={`flex items-center gap-1 ${
                                                                isPasswordLengthValid
                                                                    ? 'text-emerald-400'
                                                                    : 'text-slate-400'
                                                            }`}
                                                        >
                                                            <Check className="h-3 w-3" /> Min. 8 karakter
                                                        </span>
                                                    )}
                                                    {confirmPasswordInput.length > 0 && (
                                                        <span
                                                            className={
                                                                isPasswordMatching
                                                                    ? 'text-emerald-400'
                                                                    : 'text-amber-400'
                                                            }
                                                        >
                                                            {isPasswordMatching
                                                                ? '✓ Sandi cocok'
                                                                : '⚠ Sandi belum cocok'}
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {/* Terms Agreement */}
                                            <div className="mt-0.5 flex items-center gap-2 px-0.5">
                                                <input
                                                    type="checkbox"
                                                    id="terms"
                                                    checked={agreeTerms}
                                                    onChange={(e) => setAgreeTerms(e.target.checked)}
                                                    className="h-3.5 w-3.5 rounded border-white/20 bg-[#050a14] text-[#C5A059] focus:ring-[#C5A059]/40"
                                                />
                                                <label htmlFor="terms" className="cursor-pointer select-none text-[11px] text-[#8f9097]">
                                                    Saya menyetujui Syarat & Ketentuan serta Kebijakan Privasi IguideU.
                                                </label>
                                            </div>

                                            {/* Primary Action Button */}
                                            <button
                                                type="submit"
                                                tabIndex={5}
                                                disabled={processing || !agreeTerms}
                                                data-test="register-user-button"
                                                className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#C5A059] to-[#b38b32] py-2.5 px-4 font-label-md text-xs font-bold tracking-widest text-[#070e1b] uppercase shadow-lg shadow-[#C5A059]/20 transition-all duration-200 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {processing ? (
                                                    <div className="flex items-center gap-2">
                                                        <Spinner className="h-4 w-4 text-[#070e1b]" />
                                                        <span>Mendaftarkan...</span>
                                                    </div>
                                                ) : (
                                                    <span>Buat Akun Wisatawan</span>
                                                )}
                                            </button>
                                        </>
                                    )}
                                </Form>

                                {/* Footer Links */}
                                <div className="mt-4 text-center">
                                    <p className="text-xs text-on-surface-variant">
                                        Sudah memiliki akun?{' '}
                                        <TextLink
                                            href={login()}
                                            tabIndex={6}
                                            className="font-semibold text-[#C5A059] transition-all hover:text-white"
                                        >
                                            Masuk di sini
                                        </TextLink>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}

Register.layout = (page: React.ReactNode) => page;

