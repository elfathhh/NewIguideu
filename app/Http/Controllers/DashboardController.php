<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        $bookings = Booking::where('traveler_id', $user->id)
            ->with(['guide.guideProfile', 'package', 'payment', 'complaint', 'review'])
            ->latest()
            ->get();
        
        $paymentAccounts = [
            ['bank' => 'Bank BCA', 'number' => '1234 5678 90', 'name' => 'PT New Iguideu'],
            ['bank' => 'GoPay / OVO', 'number' => '0812 3456 7890', 'name' => 'PT New Iguideu'],
        ];
        
        return Inertia::render('dashboard', [
            'serverBookings' => $bookings,
            'paymentAccounts' => $paymentAccounts,
        ]);
    }
}
