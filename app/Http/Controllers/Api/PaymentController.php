<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /**
     * Upload payment proof for a manual transfer.
     */
    public function uploadProof(Request $request, Payment $payment)
    {
        // Ensure the user owns this payment via booking
        if ($payment->booking->traveler_id !== $request->user()->id) {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            abort(403);
        }

        $request->validate([
            'payment_proof' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        if ($request->hasFile('payment_proof')) {
            $file = $request->file('payment_proof');
            $path = $file->store('payment_proofs', 'public');

            $payment->update([
                'payment_proof' => $path,
                'payment_status' => 'pending', // Pending admin verification
            ]);

            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Bukti pembayaran berhasil diunggah. Menunggu verifikasi admin.',
                    'data' => $payment
                ]);
            }

            return redirect()->back();
        }

        if ($request->wantsJson()) {
            return response()->json(['message' => 'File tidak ditemukan'], 400);
        }
        
        return redirect()->back()->withErrors(['payment_proof' => 'File tidak ditemukan']);
    }

    /**
     * Admin verifies a payment.
     */
    public function verifyPayment(Request $request, Payment $payment)
    {
        if ($request->user()->role !== 'admin') {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            abort(403);
        }

        $request->validate([
            'status' => 'required|in:verified,forwarded,rejected',
        ]);

        $status = $request->input('status');
        
        $updateData = ['payment_status' => $status];
        if (($status === 'verified' || $status === 'forwarded') && !$payment->paid_at) {
            $updateData['paid_at'] = now();
        }
        
        $payment->update($updateData);

        $bookingCode = $payment->booking ? $payment->booking->booking_code : 'IGU-000';

        if ($payment->booking) {
            if ($status === 'verified') {
                $payment->booking->update(['status' => 'confirmed']);
            } elseif ($status === 'forwarded') {
                $payment->booking->update(['status' => 'completed']);
            } elseif ($status === 'rejected') {
                $payment->update(['payment_proof' => null]);
                $payment->booking->update(['status' => 'accepted']); 
            }
        }

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Pembayaran berhasil diperbarui: ' . $status,
                'data' => $payment
            ]);
        }

        $flashMessage = match($status) {
            'verified' => "Pembayaran booking #{$bookingCode} berhasil dikliring! Dana kini tersimpan aman di rekening Escrow.",
            'forwarded' => "Dana booking #{$bookingCode} telah berhasil diteruskan ke rekening pemandu mitra!",
            'rejected' => "Bukti pembayaran booking #{$bookingCode} ditolak. Wisatawan akan diminta mengunggah ulang.",
            default => "Status pembayaran berhasil diperbarui."
        };

        $flashType = $status === 'rejected' ? 'warning' : 'success';
        return redirect()->back()->with($flashType, $flashMessage);
    }
}

