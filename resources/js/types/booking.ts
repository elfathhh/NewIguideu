export type BookingStatus =
    | 'pending_guide'
    | 'pending_payment'
    | 'ongoing'
    | 'completed'
    | 'cancelled'
    | 'disputed';

export interface Booking {
    id: string;
    guideId: number;
    guideName: string;
    guideImage: string;
    destination: string;
    packageVariant: string;
    paxCount: number;
    bookingDate: string;
    startTime: string;
    totalAmount: number;
    status: BookingStatus;
    requestExpiresAt?: string;
    paymentExpiresAt?: string;
    confirmationExpiresAt?: string;
    paymentMethod?: string;
    paymentVirtualAccount?: string;
    isReviewed?: boolean;
    review?: {
        id: number;
        rating: number;
        comment: string;
        created_at: string;
    } | null;
    guideEndedAt?: string | null;
    complaint?: {
        id: number;
        reason_category: string;
        details: string;
        status: 'pending' | 'approved' | 'rejected';
        admin_notes?: string | null;
    } | null;
    _serverId?: number;
    _paymentId?: number | null;
    _paymentStatus?: string;
    _paymentProof?: string | null;
}

export interface ServerBooking {
    id: number;
    booking_code: string;
    traveler_id: number;
    guide_id: number;
    booking_date: string;
    start_time: string;
    duration_days: number;
    total_amount: string;
    status: string;
    guide_ended_at?: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
    guide: {
        id: number;
        name: string;
        avatar: string | null;
        guide_profile?: {
            photo: string | null;
            specialties: string | null;
        } | null;
    };
    package: {
        id: number;
        name?: string;
        title?: string;
    } | null;
    payment: {
        id: number;
        amount: string;
        payment_status: string;
        payment_proof: string | null;
        paid_at: string | null;
    } | null;
    complaint?: {
        id: number;
        reason_category: string;
        details: string;
        status: 'pending' | 'approved' | 'rejected';
        admin_notes?: string | null;
    } | null;
    review?: {
        id: number;
        rating: number;
        comment: string;
        created_at: string;
    } | null;
}

export interface PaymentAccount {
    bank: string;
    number: string;
    name: string;
}
