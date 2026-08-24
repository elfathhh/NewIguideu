import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-screen w-full items-center justify-center bg-[#0D182E] px-[clamp(1rem,4vw,2.5rem)] py-10 selection:bg-[#e9c176] selection:text-[#0D182E]">
            <div className="w-full max-w-md">
                <div className="flex flex-col items-center gap-6">
                    {/* Header Logo & Title */}
                    <div className="flex flex-col items-center gap-3 text-center">
                        <Link
                            href={home()}
                            className="group flex items-center gap-2 font-bold text-white transition-transform hover:scale-105"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e9c176]/30 bg-[#e9c176]/10 backdrop-blur-md">
                                <AppLogoIcon className="h-6 w-6 text-[#e9c176]" />
                            </div>
                            <span className="font-['Plus_Jakarta_Sans',sans-serif] text-xl font-extrabold tracking-tight">
                                Iguide<span className="text-[#e9c176]">U</span>
                            </span>
                        </Link>

                        {(title || description) && (
                            <div className="mt-1 space-y-1.5 text-center">
                                {title && (
                                    <h1 className="font-['Plus_Jakarta_Sans',sans-serif] text-2xl font-bold text-white">
                                        {title}
                                    </h1>
                                )}
                                {description && (
                                    <p className="text-sm text-[#c6c6ce]">
                                        {description}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Children Container (Login Card / Form) */}
                    <div className="w-full">{children}</div>
                </div>
            </div>
        </div>
    );
}
