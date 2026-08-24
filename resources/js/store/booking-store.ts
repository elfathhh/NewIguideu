import { create } from 'zustand';
import { Booking } from '@/types/booking';

interface BookingState {
    bookings: Booking[];

    // Derived getters
    urgentBookings: () => Booking[];
    getBookingsByStatus: (
        status: 'pending' | 'ongoing' | 'history',
    ) => Booking[];

    // Actions
    cancelBooking: (id: string) => void;
    releaseEscrow: (id: string) => void;
    addBooking: (booking: Booking) => void;
    payBooking: (id: string) => void;
}

export const useBookingStore = create<BookingState>((set, get) => ({
    // Initialize empty
    bookings: [],

    urgentBookings: () => {
        const { bookings } = get();
        // Return pending_guide, pending_payment, and ongoing waiting for confirmation
        return bookings.filter(
            (b) =>
                b.status === 'pending_guide' ||
                b.status === 'pending_payment' ||
                (b.status === 'ongoing' && Boolean(b.guideEndedAt)),
        );
    },

    getBookingsByStatus: (tabStatus) => {
        const { bookings } = get();
        if (tabStatus === 'pending') {
            return bookings.filter(
                (b) =>
                    b.status === 'pending_guide' ||
                    b.status === 'pending_payment',
            );
        }
        if (tabStatus === 'ongoing') {
            return bookings.filter((b) => b.status === 'ongoing');
        }
        // history
        return bookings.filter(
            (b) => b.status === 'completed' || b.status === 'cancelled',
        );
    },

    cancelBooking: (id) => {
        set((state) => ({
            bookings: state.bookings.map((b) =>
                b.id === id ? { ...b, status: 'cancelled' } : b,
            ),
        }));
    },

    releaseEscrow: (id) => {
        set((state) => ({
            bookings: state.bookings.map((b) =>
                b.id === id
                    ? { ...b, status: 'completed', isReviewed: false }
                    : b,
            ),
        }));
    },

    addBooking: (booking) => {
        set((state) => ({
            bookings: [booking, ...state.bookings],
        }));
    },

    payBooking: (id) => {
        set((state) => ({
            bookings: state.bookings.map((b) =>
                b.id === id ? { ...b, status: 'ongoing' } : b,
            ),
        }));
    },
}));
