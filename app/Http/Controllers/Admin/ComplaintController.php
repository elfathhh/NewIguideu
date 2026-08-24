<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Complaint;
use App\Models\GuideProfile;
use App\Models\Payment;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ComplaintController extends Controller
{
    public function index()
    {
        $complaints = Complaint::with([
            'booking.package',
            'booking.payment',
            'traveler',
            'guide.guideProfile'
        ])
        ->latest()
        ->get();

        $allComplaints = $complaints->map(function ($c) {
            $booking = $c->booking;
            $traveler = $c->traveler;
            $guide = $c->guide;

            return [
                'id' => $c->id,
                'booking_id' => $c->booking_id,
                'booking_code' => $booking ? $booking->booking_code : 'IGU-000',
                'booking_date' => $booking && $booking->booking_date ? $booking->booking_date->format('d M Y') : '-',
                'total_amount' => $booking ? (float) $booking->total_amount : 0,
                'package_title' => $booking && $booking->package ? $booking->package->title : ($booking->notes ?? 'Paket Wisata'),
                'reason_category' => $c->reason_category,
                'details' => $c->details,
                'bank_name' => $c->bank_name ?? '-',
                'bank_account_number' => $c->bank_account_number ?? '-',
                'bank_account_holder' => $c->bank_account_holder ?? '-',
                'status' => $c->status,
                'admin_notes' => $c->admin_notes,
                'created_at' => $c->created_at ? $c->created_at->format('d M Y, H:i') : '-',
                'timeAgo' => $c->created_at ? $c->created_at->diffForHumans() : 'Baru saja',
                'resolved_at' => $c->resolved_at ? $c->resolved_at->format('d M Y, H:i') : null,
                'traveler' => [
                    'id' => $traveler ? $traveler->id : 0,
                    'name' => $traveler ? $traveler->name : 'Wisatawan',
                    'email' => $traveler ? $traveler->email : '-',
                    'phone' => $traveler ? ($traveler->phone ?? '0812-3456-7890') : '0812-3456-7890',
                    'avatar' => $traveler ? $traveler->avatar : null,
                ],
                'guide' => [
                    'id' => $guide ? $guide->id : 0,
                    'name' => $guide ? $guide->name : 'Pemandu',
                    'email' => $guide ? $guide->email : '-',
                    'phone' => $guide ? ($guide->phone ?? '0812-9876-5432') : '0812-9876-5432',
                    'avatar' => $guide ? $guide->avatar : null,
                    'city' => $guide && $guide->guideProfile ? ($guide->guideProfile->city ?? 'Lombok') : 'Lombok',
                ],
            ];
        });

        $counts = [
            'all' => $allComplaints->count(),
            'pending' => $allComplaints->where('status', 'pending')->count(),
            'approved' => $allComplaints->where('status', 'approved')->count(),
            'rejected' => $allComplaints->where('status', 'rejected')->count(),
        ];

        $badges = [
            'pendingKyc' => GuideProfile::where('verification_status', 'pending')->count(),
            'pendingPayments' => Payment::where('payment_status', 'pending')->count(),
            'readyPayouts' => Booking::where('status', 'completed')->count(),
            'pendingComplaints' => $counts['pending'],
        ];

        $totalRefundApproved = $complaints->where('status', 'approved')->sum(function ($c) {
            return $c->booking ? (float) $c->booking->total_amount : 0;
        });

        return Inertia::render('admin/complaints', [
            'complaints' => $allComplaints,
            'counts' => $counts,
            'badges' => $badges,
            'stats' => [
                'totalComplaints' => $counts['all'],
                'pendingCount' => $counts['pending'],
                'approvedCount' => $counts['approved'],
                'totalRefundApproved' => $totalRefundApproved,
                'resolutionRate' => $counts['all'] > 0 ? round((($counts['approved'] + $counts['rejected']) / $counts['all']) * 100) : 100,
            ]
        ]);
    }

    public function approve(Request $request, Complaint $complaint)
    {
        $validated = $request->validate([
            'admin_notes' => 'nullable|string',
        ]);

        $complaint->update([
            'status' => 'approved',
            'admin_notes' => $validated['admin_notes'] ?? 'Pengajuan refund disetujui oleh admin.',
            'resolved_at' => now(),
        ]);

        // Update booking to cancelled/refunded
        if ($complaint->booking) {
            $complaint->booking->update([
                'status' => 'cancelled',
                'updated_at' => now(),
            ]);

            if ($complaint->booking->payment) {
                $complaint->booking->payment->update([
                    'payment_status' => 'refunded',
                    'updated_at' => now(),
                ]);
            }
        }

        return back()->with('success', 'Pengajuan refund berhasil disetujui! Pengembalian dana akan segera diproses ke rekening wisatawan.');
    }

    public function reject(Request $request, Complaint $complaint)
    {
        $validated = $request->validate([
            'admin_notes' => 'required|string|min:5',
        ]);

        $complaint->update([
            'status' => 'rejected',
            'admin_notes' => $validated['admin_notes'],
            'resolved_at' => now(),
        ]);

        // Selesaikan pesanan & lepaskan dana ke guide
        if ($complaint->booking) {
            $complaint->booking->update([
                'status' => 'completed',
                'updated_at' => now(),
            ]);
        }

        return back()->with('success', 'Pengajuan refund ditolak. Transaksi pesanan diselesaikan dan dana diteruskan ke saldo pemandu.');
    }
}
