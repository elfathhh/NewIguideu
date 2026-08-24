<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentVerificationController extends Controller
{
    public function index()
    {
        // Get payments with full relationships
        $payments = Payment::with(['booking.traveler', 'booking.guide', 'booking.package'])
            ->latest()
            ->get();

        $allPayments = $payments->map(function ($p) {
            $booking = $p->booking;
            return [
                'id' => $p->id,
                'amount' => (string) $p->amount,
                'numericAmount' => (float) $p->amount,
                'platformFee' => (float) $p->amount * 0.10,
                'guideNet' => (float) $p->amount * 0.90,
                'payment_status' => $p->payment_status ?? 'pending',
                'payment_proof' => $p->payment_proof,
                'created_at' => $p->created_at ? $p->created_at->format('d M Y, H:i') : '-',
                'paid_at' => $p->paid_at ? $p->paid_at->format('d M Y, H:i') : null,
                'timeAgo' => $p->created_at ? $p->created_at->diffForHumans() : 'Baru saja',
                'booking' => [
                    'id' => $booking ? $booking->id : 0,
                    'booking_code' => $booking ? $booking->booking_code : 'IGU-000',
                    'booking_date' => $booking ? ($booking->booking_date ? $booking->booking_date->format('d M Y') : '-') : '-',
                    'traveler' => [
                        'name' => $booking && $booking->traveler ? $booking->traveler->name : 'Wisatawan',
                        'email' => $booking && $booking->traveler ? $booking->traveler->email : '-',
                        'phone' => $booking && $booking->traveler ? ($booking->traveler->phone ?? '-') : '-',
                    ],
                    'guide' => [
                        'name' => $booking && $booking->guide ? $booking->guide->name : 'Pemandu',
                        'phone' => $booking && $booking->guide ? ($booking->guide->phone ?? '-') : '-',
                    ],
                    'package' => [
                        'title' => $booking && $booking->package ? $booking->package->title : ($booking->notes ?? 'Paket Wisata Lombok'),
                        'duration' => $booking ? ($booking->duration_days . ' Hari') : '1 Hari',
                    ]
                ]
            ];
        });

        $counts = [
            'all' => $allPayments->count(),
            'pending' => $allPayments->where('payment_status', 'pending')->count(),
            'verified' => $allPayments->where('payment_status', 'verified')->count(),
            'forwarded' => $allPayments->where('payment_status', 'forwarded')->count(),
            'rejected' => $allPayments->where('payment_status', 'rejected')->count(),
        ];

        return Inertia::render('admin/payments', [
            'payments' => $allPayments,
            'counts' => $counts,
        ]);
    }
}
