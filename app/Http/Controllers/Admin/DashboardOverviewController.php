<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\GuideProfile;
use App\Models\Payment;
use App\Models\User;
use App\Models\Complaint;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardOverviewController extends Controller
{
    public function index()
    {
        // 1. KPI Aggregates (Real PostgreSQL Aggregates)
        $totalGmv = (float) Payment::whereIn('payment_status', ['paid', 'verified', 'forwarded'])->sum('amount');
        $escrowFunds = (float) Booking::whereIn('status', ['confirmed', 'ongoing'])->sum('total_amount');
        $platformRevenue = $totalGmv * 0.10; // 10% platform net margin
        $payoutsDisbursed = (float) Payment::where('payment_status', 'forwarded')->sum('amount') * 0.90;

        $totalUsers = User::count();
        $totalGuides = User::where('role', 'guide')->count();
        $verifiedGuides = GuideProfile::where('verification_status', 'verified')->count();
        $pendingKycCount = GuideProfile::where('verification_status', 'pending')->count();
        $pendingPaymentsCount = Payment::where('payment_status', 'pending')->count();
        $totalBookingsMonth = Booking::whereMonth('created_at', now()->month)->count();
        $completedBookings = Booking::where('status', 'completed')->count();

        // 2. Action Required Queues (Priority Inbox)
        $pendingKycList = GuideProfile::with('user')
            ->where('verification_status', 'pending')
            ->latest()
            ->take(6)
            ->get()
            ->map(function ($profile) {
                $user = $profile->user;
                return [
                    'id' => $profile->id,
                    'name' => $user ? $user->name : 'Pemandu Baru',
                    'email' => $user ? $user->email : '-',
                    'phone' => $user ? ($user->phone ?? '-') : '-',
                    'city' => $profile->city ?? 'NTB',
                    'bankName' => $profile->bank_name ?? 'Belum diisi',
                    'bankAccountNumber' => $profile->bank_account_number ?? '-',
                    'bankAccountHolder' => $profile->bank_account_holder ?? '-',
                    'ktpUrl' => $profile->id_card_url ?? 'https://via.placeholder.com/600x400?text=KTP+Belum+Tersedia',
                    'time' => $profile->created_at ? $profile->created_at->diffForHumans() : 'Baru saja',
                    'avatar' => $user ? $user->avatar : null,
                    'appId' => 'KYC-' . ($profile->created_at ? $profile->created_at->format('Y') : date('Y')) . '-' . str_pad((string) $profile->id, 4, '0', STR_PAD_LEFT),
                ];
            });

        $pendingPaymentsList = Payment::with(['booking.traveler', 'booking.guide'])
            ->where('payment_status', 'pending')
            ->latest()
            ->take(6)
            ->get()
            ->map(function ($payment) {
                $booking = $payment->booking;
                return [
                    'id' => $payment->id,
                    'bookingCode' => $booking ? $booking->booking_code : 'IGU-000',
                    'travelerName' => $booking && $booking->traveler ? $booking->traveler->name : 'Wisatawan',
                    'travelerPhone' => $booking && $booking->traveler ? ($booking->traveler->phone ?? '-') : '-',
                    'guideName' => $booking && $booking->guide ? $booking->guide->name : 'Pemandu',
                    'amount' => (float) $payment->amount,
                    'hasProof' => !empty($payment->payment_proof),
                    'paymentProof' => $payment->payment_proof,
                    'time' => $payment->created_at ? $payment->created_at->diffForHumans() : 'Baru saja',
                ];
            });

        // 3. Recent Platform Activities
        $recentBookings = Booking::with(['traveler', 'guide', 'package', 'payment'])
            ->latest()
            ->take(10)
            ->get()
            ->map(function ($b) {
                return [
                    'id' => $b->id,
                    'bookingCode' => $b->booking_code,
                    'traveler' => $b->traveler ? $b->traveler->name : 'Tamu',
                    'guide' => $b->guide ? $b->guide->name : 'Guide',
                    'packageName' => $b->package ? $b->package->title : ($b->notes ? explode(' - ', $b->notes)[0] : 'Wisata NTB'),
                    'amount' => (float) $b->total_amount,
                    'status' => $b->status,
                    'paymentStatus' => $b->payment ? $b->payment->payment_status : 'unpaid',
                    'date' => $b->created_at ? $b->created_at->format('d M Y, H:i') : '-',
                ];
            });

        $readyPayoutsCount = Booking::whereIn('status', ['confirmed', 'completed'])
            ->whereHas('payment', function ($q) {
                $q->whereIn('payment_status', ['paid', 'verified']);
            })
            ->distinct('guide_id')
            ->count('guide_id');

        // 4. Counts for layout badges
        $badges = [
            'pendingKyc' => $pendingKycCount,
            'pendingPayments' => $pendingPaymentsCount,
            'readyPayouts' => $readyPayoutsCount,
            'pendingComplaints' => Complaint::where('status', 'pending')->count(),
        ];

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'totalGmv' => $totalGmv,
                'escrowFunds' => $escrowFunds,
                'platformRevenue' => $platformRevenue,
                'payoutsDisbursed' => $payoutsDisbursed,
                'totalUsers' => $totalUsers,
                'totalGuides' => $totalGuides,
                'verifiedGuides' => $verifiedGuides,
                'pendingKycCount' => $pendingKycCount,
                'pendingPaymentsCount' => $pendingPaymentsCount,
                'totalBookingsMonth' => $totalBookingsMonth,
                'completedBookings' => $completedBookings,
            ],
            'pendingKycList' => $pendingKycList,
            'pendingPaymentsList' => $pendingPaymentsList,
            'recentBookings' => $recentBookings,
            'badges' => $badges,
        ]);
    }
}
