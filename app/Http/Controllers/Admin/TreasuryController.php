<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\GuideProfile;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TreasuryController extends Controller
{
    public function index()
    {
        // 1. Financial Overview (Real Database Computations)
        $escrowHeld = (float) Booking::whereIn('status', ['confirmed', 'ongoing'])->sum('total_amount');
        $totalPaid = (float) Payment::whereIn('payment_status', ['paid', 'verified', 'forwarded'])->sum('amount');
        $platformCommission = $totalPaid * 0.10;
        $payoutsProcessed = (float) Payment::where('payment_status', 'forwarded')->sum('amount') * 0.90;

        // 2. Guide Payout Queues (Verified guides with their bank accounts and earnings)
        $guides = GuideProfile::with('user')
            ->where('verification_status', 'verified')
            ->get();

        $payouts = $guides->map(function ($profile, $index) {
            $user = $profile->user;
            $guideId = $user ? $user->id : $profile->id;
            
            // Calculate real earnings from confirmed/completed bookings for this guide
            $completedBookingsTotal = Booking::where('guide_id', $guideId)
                ->whereIn('status', ['confirmed', 'completed'])
                ->whereHas('payment', function ($q) {
                    $q->whereIn('payment_status', ['paid', 'verified']);
                })
                ->sum('total_amount');
            
            $readyBalance = (float) $completedBookingsTotal * 0.90;

            return [
                'id' => 'G-' . str_pad((string) $profile->id, 4, '0', STR_PAD_LEFT),
                'guideProfileId' => $profile->id,
                'name' => $user ? $user->name : 'Pemandu Lokal',
                'avatar' => $user ? $user->avatar : null,
                'city' => $profile->city ?? 'Lombok',
                'bank' => $profile->bank_name ?? 'Belum Diatur',
                'accountNumber' => $profile->bank_account_number ?? '-',
                'accountHolder' => $profile->bank_account_holder ?? ($user ? $user->name : 'Pemandu'),
                'amount' => $readyBalance,
                'status' => $readyBalance > 0 ? 'Ready' : 'Settled',
                'lastPayout' => $profile->updated_at ? $profile->updated_at->format('d M Y') : 'Hari ini',
            ];
        });

        // Filter payouts with balance ready to withdraw or keep list
        $activePayoutQueue = $payouts->filter(fn($p) => $p['amount'] > 0)->values();

        // 3. Real Historical Payout Logs from Forwarded Payments
        $forwardedPayments = Payment::with(['booking.guide', 'booking.traveler'])
            ->where('payment_status', 'forwarded')
            ->latest('updated_at')
            ->take(20)
            ->get();

        $recentDisbursements = $forwardedPayments->map(function ($p) {
            $guide = $p->booking && $p->booking->guide ? $p->booking->guide : null;
            $profile = $guide ? GuideProfile::where('user_id', $guide->id)->first() : null;
            return [
                'trxId' => 'PAY-' . ($p->paid_at ? $p->paid_at->format('Y') : date('Y')) . '-' . str_pad((string) $p->id, 4, '0', STR_PAD_LEFT),
                'recipient' => $guide ? $guide->name : 'Pemandu Mitra',
                'bank' => $profile && $profile->bank_name ? $profile->bank_name : 'Bank Lokal',
                'account' => $profile && $profile->bank_account_number ? $profile->bank_account_number : '-',
                'amount' => (float) $p->amount * 0.90,
                'fee' => 0,
                'status' => 'Success',
                'date' => $p->paid_at ? $p->paid_at->format('d M Y, H:i') : ($p->updated_at ? $p->updated_at->format('d M Y, H:i') : now()->format('d M Y, H:i')),
                'admin' => 'Admin IguideU',
            ];
        });

        return Inertia::render('admin/treasury', [
            'stats' => [
                'escrowHeld' => $escrowHeld,
                'platformCommission' => $platformCommission,
                'payoutsProcessed' => $payoutsProcessed,
                'activeQueueCount' => $activePayoutQueue->count(),
            ],
            'payouts' => $payouts,
            'recentDisbursements' => $recentDisbursements,
        ]);
    }

    public function processPayout(Request $request, string $id)
    {
        $profile = GuideProfile::with('user')->findOrFail($id);
        $guideName = $profile->user ? $profile->user->name : 'Pemandu';
        $userId = $profile->user_id;

        // Disburse payments for this guide
        if ($userId) {
            $bookings = Booking::where('guide_id', $userId)
                ->whereIn('status', ['confirmed', 'completed'])
                ->get();

            foreach ($bookings as $booking) {
                if ($booking->payment && in_array($booking->payment->payment_status, ['paid', 'verified'])) {
                    $booking->payment->update([
                        'payment_status' => 'forwarded',
                        'paid_at' => now(),
                    ]);
                    $booking->update(['status' => 'completed']);
                }
            }
        }

        $bank = $profile->bank_name ?? 'Bank Lokal';
        $acc = $profile->bank_account_number ?? '-';

        return back()->with('success', "Pencairan dana untuk {$guideName} berhasil dieksekusi ke {$bank} ({$acc})!");
    }

    public function bulkPayout(Request $request)
    {
        $guides = GuideProfile::with('user')->where('verification_status', 'verified')->get();
        $processedCount = 0;

        foreach ($guides as $profile) {
            $userId = $profile->user_id;
            if ($userId) {
                $bookings = Booking::where('guide_id', $userId)
                    ->whereIn('status', ['confirmed', 'completed'])
                    ->get();

                foreach ($bookings as $booking) {
                    if ($booking->payment && in_array($booking->payment->payment_status, ['paid', 'verified'])) {
                        $booking->payment->update([
                            'payment_status' => 'forwarded',
                            'paid_at' => now(),
                        ]);
                        $booking->update(['status' => 'completed']);
                        $processedCount++;
                    }
                }
            }
        }

        return back()->with('success', "Berhasil memproses pencairan massal untuk {$guides->count()} mitra pemandu!");
    }
}
