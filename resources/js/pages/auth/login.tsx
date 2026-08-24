import { Form, Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { usePasskeyVerify } from '@laravel/passkeys/react';
import TextLink from '@/components/text-link';
import { Spinner } from '@/components/ui/spinner';
import { register } from '@/routes';
import { store } from '@/routes/login';
import { request } from '@/routes/password';
import { home } from '@/routes';
import { AlertCircle } from 'lucide-react';

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    const [showPassword, setShowPassword] = useState(false);

    const {
        verify,
        isLoading: passkeyLoading,
        isSupported: passkeySupported,
    } = usePasskeyVerify({
        onSuccess: (response) => {
            router.visit(response.redirect ?? '/dashboard');
        },
    });

    return (
        <>
            <Head title="IguideU - Login" />

            <div className="relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-[#070e1b] font-body-md text-on-surface antialiased selection:bg-[#C5A059] selection:text-[#070e1b]">
                {/* 100% VH Viewport Container */}
                <main className="relative z-10 flex h-full w-full items-center justify-center p-4 sm:p-6 md:p-8">
                    {/* Immersive Cinematic Background Image with Professional Vignette */}
                    <div
                        className="pointer-events-none absolute inset-0 z-0 scale-105 bg-cover bg-center opacity-30"
                        style={{
                            backgroundImage:
                                "url('https://lh3.googleusercontent.com/aida/AP1WRLtMkrtYu1JtugpkdJS27D7HyVGWbag6OteJgOBZw2HjQxy-tM0tub5pvlcxk_-4JTzySHbswamIx2rrzzWRur77pqGoMN6Ua8axkJW5LLCYrQYi-w7pgqRf3PBZ-iw_62Vsv_57cwpuqQV9BhKM0S11WtrmaybHt_47Cm_qIV0NjJL79Bzx42AncARyvhiBE1h9L9011vag24VXWMs2Ta0Xaw9ORXZl8Jh1XX2umf-I9056LRzfmM5M67g')",
                        }}
                    />

                    {/* Sophisticated Dark Gradient Overlay & Professional Radial Glows */}
                    <div className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-[#070e1b]/95 via-[#09152a]/90 to-[#050a14]/95 backdrop-blur-[6px]" />
                    <div className="pointer-events-none absolute -top-32 -left-32 z-0 h-[30rem] w-[30rem] rounded-full bg-[#C5A059]/10 blur-[120px]" />
                    <div className="pointer-events-none absolute -right-32 -bottom-32 z-0 h-[30rem] w-[30rem] rounded-full bg-[#1e3a8a]/20 blur-[120px]" />

                    {/* Floating Glass Card (Strictly Fit inside Viewport) */}
                    <div className="relative z-10 my-auto flex max-h-[calc(100vh-2rem)] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#0a1424]/75 shadow-[0_25px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl lg:max-w-5xl lg:flex-row">
                        {/* Left Side: Welcome Message & Luxury Branding */}
                        <div className="relative flex w-full flex-col justify-between overflow-hidden border-b border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent p-6 md:p-8 lg:w-5/12 lg:border-r lg:border-b-0 lg:p-10">
                            {/* Subtle inner glow */}
                            <div className="pointer-events-none absolute -top-20 -left-20 h-56 w-56 rounded-full bg-[#C5A059]/15 blur-3xl" />

                            <div className="relative z-10">
                                {/* Brand Logo */}
                                <div className="mb-6 lg:mb-10">
                                    <Link
                                        href={home()}
                                        className="group inline-flex items-center gap-3"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#C5A059]/30 bg-[#C5A059]/10 shadow-md shadow-[#C5A059]/10 backdrop-blur-md transition-transform duration-300 group-hover:scale-105 md:h-12 md:w-12">
                                            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-bold text-[#C5A059]">
                                                iU
                                            </span>
                                        </div>
                                        <span className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-extrabold tracking-tight text-white">
                                            Iguide
                                            <span className="text-[#C5A059]">
                                                U
                                            </span>
                                        </span>
                                    </Link>
                                </div>

                                <h1 className="mb-3 font-['Plus_Jakarta_Sans',sans-serif] text-2xl leading-snug font-bold tracking-tight text-white md:mb-4 md:text-3xl lg:text-4xl">
                                    Unlock Authentic <br />
                                    <span className="bg-gradient-to-r from-white via-amber-100 to-[#C5A059] bg-clip-text text-transparent">
                                        Indonesia.
                                    </span>
                                </h1>

                                <p className="text-xs leading-relaxed font-light text-[#c6c6ce] sm:text-sm">
                                    Connect with local guides who know the path
                                    less traveled.
                                </p>
                            </div>

                            {/* Trust Badge */}
                            <div className="relative z-10 mt-6 hidden lg:block">
                                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3.5 backdrop-blur-md">
                                    <p className="flex items-center gap-2 text-[11px] text-[#8f9097]">
                                        <span className="text-[#C5A059]">
                                            ✨
                                        </span>{' '}
                                        Premium authentic travel experience with
                                        verified local guides.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Interactive Login Form */}
                        <div className="no-scrollbar relative flex w-full flex-col justify-center overflow-y-auto p-6 md:p-8 lg:w-7/12 lg:p-10">
                            <div className="mx-auto w-full max-w-sm sm:max-w-md">
                                {/* Login Header */}
                                <div className="mb-5 md:mb-6">
                                    <h2 className="mb-1 font-['Plus_Jakarta_Sans',sans-serif] text-xl font-bold tracking-tight text-white md:text-2xl">
                                        Welcome Back
                                    </h2>
                                    <p className="text-xs text-[#c6c6ce] md:text-sm">
                                        Sign in to manage your journeys or
                                        profile.
                                    </p>
                                </div>

                                {status && (
                                    <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center text-xs font-semibold text-emerald-400 backdrop-blur-md">
                                        {status}
                                    </div>
                                )}

                                {/* Login Form */}
                                <Form
                                    {...store.form()}
                                    resetOnSuccess={['password']}
                                    className="flex w-full flex-col gap-3.5 md:gap-4"
                                >
                                    {({ processing, errors }) => {
                                        const hasError = Boolean(
                                            errors.email || errors.password,
                                        );

                                        return (
                                            <>
                                                {hasError && (
                                                    <div className="flex items-center gap-2.5 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs font-semibold text-red-400 backdrop-blur-md">
                                                        <AlertCircle className="h-4 w-4 shrink-0" />
                                                        <span>
                                                            Email atau kata
                                                            sandi tidak cocok.
                                                        </span>
                                                    </div>
                                                )}

                                                {/* Social Login: Google (Ghost Button) */}
                                                <button
                                                    className="group flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold tracking-wider text-on-surface uppercase transition-all duration-300 hover:border-white/20 hover:bg-white/[0.08]"
                                                    type="button"
                                                >
                                                    <svg
                                                        className="h-4 w-4 opacity-90 transition-opacity group-hover:opacity-100"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                            fill="#4285F4"
                                                        />
                                                        <path
                                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                            fill="#34A853"
                                                        />
                                                        <path
                                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                            fill="#FBBC05"
                                                        />
                                                        <path
                                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                            fill="#EA4335"
                                                        />
                                                    </svg>
                                                    Continue with Google
                                                </button>

                                                {/* Divider */}
                                                <div className="relative flex items-center py-0.5">
                                                    <div className="flex-grow border-t border-white/10" />
                                                    <span className="mx-3 flex-shrink-0 font-label-md text-[9px] tracking-widest text-on-surface-variant uppercase opacity-60">
                                                        or sign in with email
                                                    </span>
                                                    <div className="flex-grow border-t border-white/10" />
                                                </div>

                                                {/* Input Fields */}
                                                <div className="flex flex-col gap-3.5">
                                                    {/* Email */}
                                                    <div className="relative">
                                                        <label
                                                            className="mb-1 ml-1 block font-label-md text-[10px] tracking-wider text-on-surface-variant uppercase"
                                                            htmlFor="email"
                                                        >
                                                            Email Address
                                                        </label>
                                                        <div className="group relative flex items-center">
                                                            <span
                                                                className="material-symbols-outlined absolute left-3.5 z-10 text-base text-on-surface-variant opacity-60 transition-colors group-focus-within:text-[#C5A059] group-focus-within:opacity-100"
                                                                data-icon="mail"
                                                            >
                                                                mail
                                                            </span>
                                                            <input
                                                                className={`w-full rounded-xl border border-white/10 bg-[#050a14]/60 py-2.5 pr-4 pl-10 text-xs text-on-surface placeholder-on-surface-variant/40 transition-all duration-300 outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 md:text-sm ${
                                                                    errors.email
                                                                        ? 'border-red-500/80 ring-2 ring-red-500/30'
                                                                        : ''
                                                                }`}
                                                                id="email"
                                                                name="email"
                                                                placeholder="traveler@example.com"
                                                                required
                                                                type="email"
                                                                autoFocus
                                                                autoComplete="email"
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* Password */}
                                                    <div className="relative">
                                                        <label
                                                            className="mb-1 ml-1 block flex justify-between font-label-md text-[10px] tracking-wider text-on-surface-variant uppercase"
                                                            htmlFor="password"
                                                        >
                                                            <span>
                                                                Password
                                                            </span>
                                                            {canResetPassword && (
                                                                <TextLink
                                                                    href={request()}
                                                                    className="text-[#C5A059] transition-colors hover:text-white"
                                                                >
                                                                    Forgot
                                                                    Password?
                                                                </TextLink>
                                                            )}
                                                        </label>
                                                        <div className="group relative flex items-center">
                                                            <span
                                                                className="material-symbols-outlined absolute left-3.5 z-10 text-base text-on-surface-variant opacity-60 transition-colors group-focus-within:text-[#C5A059] group-focus-within:opacity-100"
                                                                data-icon="lock"
                                                            >
                                                                lock
                                                            </span>
                                                            <input
                                                                className={`w-full rounded-xl border border-white/10 bg-[#050a14]/60 py-2.5 pr-10 pl-10 text-xs text-on-surface placeholder-on-surface-variant/40 transition-all duration-300 outline-none focus:border-[#C5A059] focus:ring-2 focus:ring-[#C5A059]/20 md:text-sm ${
                                                                    errors.password
                                                                        ? 'border-red-500/80 ring-2 ring-red-500/30'
                                                                        : ''
                                                                }`}
                                                                id="password"
                                                                name="password"
                                                                placeholder="••••••••"
                                                                required
                                                                type={
                                                                    showPassword
                                                                        ? 'text'
                                                                        : 'password'
                                                                }
                                                                autoComplete="current-password"
                                                            />
                                                            <button
                                                                className="absolute right-3 z-10 p-1 text-on-surface-variant opacity-60 transition-opacity hover:opacity-100"
                                                                onClick={() =>
                                                                    setShowPassword(
                                                                        !showPassword,
                                                                    )
                                                                }
                                                                type="button"
                                                            >
                                                                <span
                                                                    className="material-symbols-outlined text-sm"
                                                                    data-icon="visibility"
                                                                    id="visibility-icon"
                                                                >
                                                                    {showPassword
                                                                        ? 'visibility_off'
                                                                        : 'visibility'}
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Primary Action Button */}
                                                <button
                                                    className="mt-1 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#d4af37] via-[#C5A059] to-[#b38b32] px-4 py-2.5 font-label-md text-xs font-bold tracking-widest text-[#070e1b] uppercase shadow-lg shadow-[#C5A059]/20 transition-all duration-300 hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                                                    type="submit"
                                                    disabled={processing}
                                                    data-test="login-button"
                                                >
                                                    {processing ? (
                                                        <div className="flex items-center gap-2">
                                                            <Spinner className="h-4 w-4 text-[#070e1b]" />
                                                            <span>
                                                                Sign In...
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span>Sign In</span>
                                                    )}
                                                </button>

                                                {/* Passkey Option */}
                                                {passkeySupported && (
                                                    <button
                                                        className="group flex w-full items-center justify-center gap-2 rounded-xl border border-transparent py-2 font-label-md text-xs text-on-surface-variant transition-colors duration-300 hover:border-white/10 hover:bg-white/[0.04] hover:text-white disabled:opacity-50"
                                                        type="button"
                                                        onClick={verify}
                                                        disabled={
                                                            passkeyLoading
                                                        }
                                                    >
                                                        <span
                                                            className="material-symbols-outlined text-base opacity-70 transition-all group-hover:text-[#C5A059] group-hover:opacity-100"
                                                            data-icon="fingerprint"
                                                        >
                                                            fingerprint
                                                        </span>
                                                        {passkeyLoading
                                                            ? 'Authenticating...'
                                                            : 'Sign in with Passkey'}
                                                    </button>
                                                )}
                                            </>
                                        );
                                    }}
                                </Form>

                                {/* Footer Link */}
                                <div className="mt-5 text-center">
                                    <p className="text-xs text-on-surface-variant">
                                        Don't have an account?{' '}
                                        <TextLink
                                            href={register()}
                                            className="font-semibold text-[#C5A059] transition-all hover:text-white"
                                        >
                                            Join IguideU
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

Login.layout = (page: React.ReactNode) => page;
