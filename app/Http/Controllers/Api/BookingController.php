<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\Complaint;
use App\Models\Review;
use App\Models\GuideProfile;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class BookingController extends Controller
{
    /**
     * Store a newly created booking in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'guide_id' => 'required|integer',
            'package_id' => 'nullable|integer',
            'booking_date' => 'required|date',
            'start_time' => 'required|string',
            'duration_days' => 'required|integer|min:1',
            'total_amount' => 'required|numeric|min:0',
            'notes' => 'nullable|string',
        ]);

        // Auto-create dummy guide if missing (MVP/Mock support)
        if (!\App\Models\User::find($validated['guide_id'])) {
            \App\Models\User::forceCreate([
                'id' => $validated['guide_id'],
                'name' => 'Mock Guide ' . $validated['guide_id'],
                'email' => 'guide' . $validated['guide_id'] . '@mock.com',
                'password' => bcrypt('password'),
                'role' => 'guide',
            ]);
        }

        $booking = Booking::create([
            'booking_code' => 'IGU-' . strtoupper(Str::random(6)),
            'traveler_id' => $request->user()->id,
            'guide_id' => $validated['guide_id'],
            'package_id' => $validated['package_id'] ?? null,
            'booking_date' => $validated['booking_date'],
            'start_time' => $validated['start_time'],
            'duration_days' => $validated['duration_days'],
            'total_amount' => $validated['total_amount'],
            'status' => 'pending',
            'notes' => $validated['notes'] ?? null,
        ]);

        // Create pending payment
        Payment::create([
            'booking_id' => $booking->id,
            'amount' => $booking->total_amount,
            'payment_status' => 'unpaid',
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Pemesanan berhasil dibuat!',
                'data' => $booking->load(['guide', 'package', 'payment'])
            ], 201);
        }

        return redirect()->route('pesanan');
    }

    /**
     * Display a listing of bookings for the authenticated user.
     */
    public function userBookings(Request $request): JsonResponse
    {
        $user = $request->user();

        if ($user->role === 'guide') {
            $bookings = Booking::where('guide_id', $user->id)->with(['traveler', 'package', 'payment'])->latest()->get();
        } else {
            $bookings = Booking::where('traveler_id', $user->id)->with(['guide.guideProfile', 'package', 'payment'])->latest()->get();
        }

        return response()->json([
            'success' => true,
            'data' => $bookings
        ]);
    }

    /**
     * Cancel a booking
     */
    public function cancel(Request $request, Booking $booking)
    {
        if ($booking->traveler_id !== $request->user()->id && $booking->guide_id !== $request->user()->id) {
            abort(403);
        }

        $booking->update(['status' => 'cancelled']);

        return back();
    }

    /**
     * Guide ends the trip (requests traveler confirmation)
     */
    public function endTrip(Request $request, Booking $booking)
    {
        if ($booking->guide_id !== $request->user()->id) {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            abort(403);
        }

        $booking->update([
            'guide_ended_at' => now(),
            'updated_at' => now(),
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Perjalanan telah diakhiri. Menunggu konfirmasi wisatawan untuk melepaskan dana escrow.',
                'data' => $booking
            ]);
        }

        return back()->with('success', 'Perjalanan telah diakhiri oleh pemandu. Menunggu konfirmasi dari wisatawan.');
    }

    /**
     * Complete a booking (release escrow by traveler)
     */
    public function complete(Request $request, Booking $booking)
    {
        if ($booking->traveler_id !== $request->user()->id) {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            abort(403);
        }

        if (!$booking->guide_ended_at) {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Pemandu belum mengakhiri perjalanan ini.'], 422);
            }
            return back()->with('error', 'Pemandu belum mengakhiri perjalanan ini.');
        }

        $booking->update([
            'status' => 'completed',
            'updated_at' => now(),
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Perjalanan selesai! Dana escrow telah dilepaskan ke pemandu.',
                'data' => $booking
            ]);
        }

        return back()->with('success', 'Perjalanan telah selesai! Terima kasih telah menggunakan IguideU.');
    }

    /**
     * Traveler submits a refund request / complaint
     */
    public function submitRefund(Request $request, Booking $booking)
    {
        if ($booking->traveler_id !== $request->user()->id) {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            abort(403);
        }

        if (!$booking->guide_ended_at) {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Pengajuan refund hanya dapat dilakukan setelah pemandu mengakhiri perjalanan.'], 422);
            }
            return back()->with('error', 'Pengajuan refund hanya dapat dilakukan setelah pemandu mengakhiri perjalanan.');
        }

        $validated = $request->validate([
            'reason_category' => 'required|string',
            'details' => 'required|string|min:10',
            'bank_name' => 'nullable|string',
            'bank_account_number' => 'nullable|string',
            'bank_account_holder' => 'nullable|string',
        ]);

        $complaint = Complaint::create([
            'booking_id' => $booking->id,
            'traveler_id' => $request->user()->id,
            'guide_id' => $booking->guide_id,
            'reason_category' => $validated['reason_category'],
            'details' => $validated['details'],
            'bank_name' => $validated['bank_name'] ?? null,
            'bank_account_number' => $validated['bank_account_number'] ?? null,
            'bank_account_holder' => $validated['bank_account_holder'] ?? null,
            'status' => 'pending',
        ]);

        $booking->update([
            'status' => 'disputed',
            'updated_at' => now(),
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Pengajuan refund dan keluhan Anda berhasil dikirim! Tim Admin IguideU akan segera meninjau kasus ini.',
                'data' => $complaint
            ], 201);
        }

        return back()->with('success', 'Pengajuan refund dan keluhan Anda berhasil dikirim! Tim Admin IguideU akan segera meninjau kasus ini.');
    }

    /**
     * Traveler submits a review and rating for a completed booking.
     */
    public function submitReview(Request $request, Booking $booking)
    {
        if ($booking->traveler_id !== $request->user()->id) {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
            abort(403);
        }

        if ($booking->status !== 'completed') {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Ulasan hanya dapat diberikan setelah tur selesai.'], 422);
            }
            return back()->with('error', 'Ulasan hanya dapat diberikan setelah tur selesai.');
        }

        // Check if review already exists for this booking
        if (Review::where('booking_id', $booking->id)->exists()) {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Pesanan ini sudah pernah diulas.'], 422);
            }
            return back()->with('error', 'Pesanan ini sudah pernah diulas.');
        }

        $validated = $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);

        $review = Review::create([
            'booking_id' => $booking->id,
            'traveler_id' => $request->user()->id,
            'guide_id' => $booking->guide_id,
            'rating' => $validated['rating'],
            'comment' => $validated['comment'] ?? '',
        ]);

        // Recalculate guide profile rating and review count
        $guideId = $booking->guide_id;
        $guideReviews = Review::where('guide_id', $guideId);
        $reviewCount = $guideReviews->count();
        $avgRating = $reviewCount > 0 ? round($guideReviews->avg('rating'), 2) : 5.00;

        GuideProfile::where('user_id', $guideId)->update([
            'rating_avg' => $avgRating,
            'review_count' => $reviewCount,
        ]);

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Ulasan dan rating berhasil dikirim! Terima kasih atas ulasan Anda.',
                'data' => $review
            ], 201);
        }

        return back()->with('success', 'Ulasan dan rating berhasil dikirim! Terima kasih atas ulasan Anda.');
    }
}
