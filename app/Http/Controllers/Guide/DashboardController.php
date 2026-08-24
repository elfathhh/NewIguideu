<?php

namespace App\Http\Controllers\Guide;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\TourPackage;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Get bookings for this guide
        $bookings = Booking::where('guide_id', $user->id)
            ->with(['traveler', 'package', 'payment', 'review'])
            ->orderBy('booking_date', 'asc')
            ->get();

        $today = Carbon::today()->toDateString();

        // Separate bookings
        // Pending tab: 'pending' (waiting guide approval) and 'accepted' (waiting traveler payment / admin verification)
        $pendingBookings = $bookings->whereIn('status', ['pending', 'accepted']);
        // Upcoming tab: ALL 'confirmed' bookings (payment verified by admin, awaiting guide end-trip and traveler completion)
        $upcomingBookings = $bookings->where('status', 'confirmed');
        $completedBookings = $bookings->where('status', 'completed');
        
        $activeTour = $bookings->where('status', 'confirmed')->first(function ($b) use ($today) {
            return Carbon::parse($b->booking_date)->toDateString() === $today;
        });

        // Financials (basic calculation)
        $totalPendapatan = $completedBookings->sum('total_amount');
        $komisi = $totalPendapatan * 0.10;
        $saldo = $totalPendapatan - $komisi; // assuming all completed are ready to withdraw

        $guideProfile = $user->guideProfile;

        return Inertia::render('guide/dashboard', [
            'guideProfile' => $guideProfile,
            'bookings' => [
                'pending' => $pendingBookings->values(),
                'upcoming' => $upcomingBookings->values(),
                'completed' => $completedBookings->values(),
            ],
            'activeTour' => $activeTour,
            'stats' => [
                'newOrdersCount' => $bookings->where('status', 'pending')->count(),
                'totalPendapatan' => $totalPendapatan,
                'komisi' => $komisi,
                'saldo' => $saldo,
                'dicairkan' => 0 // Mock for now
            ]
        ]);
    }

    public function schedule(Request $request)
    {
        $user = $request->user();

        $bookings = Booking::where('guide_id', $user->id)
            ->where('status', 'confirmed')
            ->with(['traveler', 'package'])
            ->orderBy('booking_date', 'asc')
            ->get();

        return Inertia::render('guide/schedule', [
            'bookings' => $bookings
        ]);
    }
}
