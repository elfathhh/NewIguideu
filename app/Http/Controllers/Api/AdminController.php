<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\GuideProfile;
use App\Models\Booking;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class AdminController extends Controller
{
    /**
     * Get overview statistics for the Admin Command Center.
     */
    public function stats(): JsonResponse
    {
        $totalUsers = User::count();
        $totalGuides = User::where('role', 'guide')->count();
        $pendingVerifications = GuideProfile::where('verification_status', 'pending')->count();
        $totalRevenue = Payment::where('payment_status', 'paid')->sum('amount');
        $escrowFunds = Booking::where('status', 'confirmed')->sum('total_amount');

        return response()->json([
            'success' => true,
            'data' => [
                'total_users' => $totalUsers,
                'total_guides' => $totalGuides,
                'pending_verifications' => $pendingVerifications,
                'total_revenue' => $totalRevenue,
                'escrow_funds' => $escrowFunds,
            ]
        ]);
    }

    /**
     * List guide verification applications.
     */
    public function verifications(): JsonResponse
    {
        $verifications = GuideProfile::where('verification_status', 'pending')
            ->with('user')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => $verifications
        ]);
    }

    /**
     * Approve or reject guide verification application.
     */
    public function updateVerificationStatus(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:verified,rejected',
        ]);

        $profile = GuideProfile::findOrFail($id);
        $profile->update([
            'verification_status' => $validated['status']
        ]);

        return response()->json([
            'success' => true,
            'message' => "Status verifikasi berhasil diperbarui menjadi {$validated['status']}!",
            'data' => $profile
        ]);
    }
}
