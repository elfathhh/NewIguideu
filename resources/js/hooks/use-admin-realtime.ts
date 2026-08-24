import { useState, useEffect, useCallback, useRef } from 'react';
import { router } from '@inertiajs/react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

interface UseAdminRealtimeOptions {
    intervalMs?: number; // Background polling interval (default 8000ms)
    onNewKyc?: () => void;
    onNewPayment?: () => void;
    reloadProps?: string[];
}

export function useAdminRealtime({
    intervalMs = 8000,
    reloadProps = [
        'stats',
        'pendingKycList',
        'pendingPaymentsList',
        'recentBookings',
        'badges',
        'applicants',
        'counts',
        'payments',
        'payouts',
        'recentDisbursements',
    ],
}: UseAdminRealtimeOptions = {}) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
    const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
    const supabaseRef = useRef<SupabaseClient | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isMountedRef = useRef(true);

    const refreshNow = useCallback(
        (showLoadingState = true) => {
            if (showLoadingState) {
                setIsRefreshing(true);
            }

            router.reload({
                only: reloadProps,
                onFinish: () => {
                    if (isMountedRef.current) {
                        setIsRefreshing(false);
                        setLastUpdated(new Date());
                    }
                },
                onError: () => {
                    if (isMountedRef.current) {
                        setIsRefreshing(false);
                    }
                },
            });
        },
        [reloadProps],
    );

    // 1. Supabase Realtime Channels Subscription (if configured)
    useEffect(() => {
        isMountedRef.current = true;
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

        const isRealSupabase =
            supabaseUrl &&
            supabaseAnonKey &&
            !supabaseUrl.includes('[PROJECT-ID]') &&
            !supabaseAnonKey.includes('[KODE-ANON-KEY');

        if (isRealSupabase) {
            try {
                const supabase = createClient(supabaseUrl, supabaseAnonKey);
                supabaseRef.current = supabase;
                setIsSupabaseConnected(true);

                const channel = supabase
                    .channel('admin-realtime-dashboard')
                    .on(
                        'postgres_changes',
                        { event: '*', schema: 'public', table: 'bookings' },
                        () => {
                            refreshNow(false);
                        },
                    )
                    .on(
                        'postgres_changes',
                        { event: '*', schema: 'public', table: 'payments' },
                        () => {
                            refreshNow(false);
                        },
                    )
                    .on(
                        'postgres_changes',
                        { event: '*', schema: 'public', table: 'guide_profiles' },
                        () => {
                            refreshNow(false);
                        },
                    )
                    .subscribe();

                return () => {
                    supabase.removeChannel(channel);
                };
            } catch (err) {
                console.warn('Supabase realtime init error:', err);
            }
        }
    }, [refreshNow]);

    // 2. Adaptive Background Heartbeat / Poller (Pauses when tab hidden)
    useEffect(() => {
        let isRunning = true;

        const scheduleNextPoll = () => {
            if (!isRunning) return;
            timeoutRef.current = setTimeout(() => {
                if (!document.hidden && isRunning) {
                    refreshNow(false);
                }
                scheduleNextPoll();
            }, intervalMs);
        };

        scheduleNextPoll();

        const handleVisibilityChange = () => {
            if (!document.hidden) {
                // Instantly sync when admin returns to this tab
                refreshNow(false);
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            isRunning = false;
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            isMountedRef.current = false;
        };
    }, [intervalMs, refreshNow]);

    // Helper to format time ago
    const getTimeAgo = useCallback(() => {
        const diffSeconds = Math.floor((new Date().getTime() - lastUpdated.getTime()) / 1000);
        if (diffSeconds < 5) return 'Baru saja';
        if (diffSeconds < 60) return `${diffSeconds} dtk lalu`;
        const diffMinutes = Math.floor(diffSeconds / 60);
        return `${diffMinutes} mnt lalu`;
    }, [lastUpdated]);

    return {
        isRefreshing,
        lastUpdated,
        timeAgo: getTimeAgo(),
        refreshNow: () => refreshNow(true),
        isRealtimeActive: true,
        isSupabaseConnected,
    };
}
