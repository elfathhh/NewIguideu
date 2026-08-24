<?php

use Illuminate\Support\Facades\Route;

Route::get('/', [\App\Http\Controllers\Web\HomeController::class, 'index'])->name('home');
Route::redirect('tentang', '/#tentang')->name('tentang');
Route::redirect('about', '/#tentang')->name('about');
Route::get('guides', [\App\Http\Controllers\Web\GuideController::class, 'search'])->name('guides.search');
Route::get('guides/{id}', [\App\Http\Controllers\Web\GuideController::class, 'show'])->name('guides.show');

// Guide Registration (Public)
Route::get('join-guide', [\App\Http\Controllers\Web\GuideRegistrationController::class, 'create'])->name('join-guide');
Route::post('join-guide', [\App\Http\Controllers\Web\GuideRegistrationController::class, 'store'])->name('join-guide.store');
Route::get('join-guide/success', [\App\Http\Controllers\Web\GuideRegistrationController::class, 'success'])->name('join-guide.success');

Route::middleware(['auth', 'verified'])->group(function () {
    // Traveler Routes
    Route::middleware('role:traveler')->group(function () {
        Route::get('dashboard', [\App\Http\Controllers\DashboardController::class, 'index'])->name('dashboard');
        Route::get('pesanan', [\App\Http\Controllers\DashboardController::class, 'index'])->name('pesanan');
        Route::post('bookings', [\App\Http\Controllers\Api\BookingController::class, 'store'])->name('bookings.store');
        Route::get('bookings', [\App\Http\Controllers\Api\BookingController::class, 'userBookings'])->name('bookings.index');
        Route::post('bookings/{booking}/cancel', [\App\Http\Controllers\Api\BookingController::class, 'cancel'])->name('bookings.cancel');
        Route::post('bookings/{booking}/complete', [\App\Http\Controllers\Api\BookingController::class, 'complete'])->name('bookings.complete');
        Route::post('bookings/{booking}/refund', [\App\Http\Controllers\Api\BookingController::class, 'submitRefund'])->name('bookings.refund');
        Route::post('bookings/{booking}/reviews', [\App\Http\Controllers\Api\BookingController::class, 'submitReview'])->name('bookings.reviews.store');
        Route::post('payments/{payment}/proof', [\App\Http\Controllers\Api\PaymentController::class, 'uploadProof'])->name('payments.proof');
    });

    // Guide Routes
    Route::middleware('role:guide')->group(function () {
        Route::get('guide/dashboard', [\App\Http\Controllers\Guide\DashboardController::class, 'index'])->name('guide.dashboard');
        Route::get('guide/schedule', [\App\Http\Controllers\Guide\DashboardController::class, 'schedule'])->name('guide.schedule');
        Route::get('guide/packages', [\App\Http\Controllers\Guide\ServiceController::class, 'index'])->name('guide.services.index');
        Route::post('guide/packages', [\App\Http\Controllers\Guide\ServiceController::class, 'update'])->name('guide.services.update');
        Route::post('guide/bookings/{booking}/end-trip', [\App\Http\Controllers\Api\BookingController::class, 'endTrip'])->name('guide.bookings.end-trip');
        
        // MVP Helper
        Route::post('api/mvp/approve-booking/{booking}', function (\App\Models\Booking $booking) {
            $booking->update(['status' => 'accepted', 'updated_at' => now()]);
            return back();
        });
        Route::post('api/mvp/reject-booking/{booking}', function (\App\Models\Booking $booking) {
            $booking->update(['status' => 'cancelled', 'updated_at' => now()]);
            return back();
        });
    });

    // Admin Routes
    Route::middleware('role:admin')->group(function () {
        Route::get('admin/dashboard', [\App\Http\Controllers\Admin\DashboardOverviewController::class, 'index'])->name('admin.dashboard');
        Route::redirect('admin', '/admin/dashboard');
        Route::get('admin/kyc', [\App\Http\Controllers\Admin\KycVerificationController::class, 'index'])->name('admin.kyc');
        Route::post('admin/kyc/bulk-approve', [\App\Http\Controllers\Admin\KycVerificationController::class, 'bulkApprove'])->name('admin.kyc.bulk-approve');
        Route::post('admin/kyc/{id}/approve', [\App\Http\Controllers\Admin\KycVerificationController::class, 'approve'])->name('admin.kyc.approve');
        Route::post('admin/kyc/{id}/reject', [\App\Http\Controllers\Admin\KycVerificationController::class, 'reject'])->name('admin.kyc.reject');
        Route::get('admin/treasury', [\App\Http\Controllers\Admin\TreasuryController::class, 'index'])->name('admin.treasury');
        Route::post('admin/treasury/bulk-payout', [\App\Http\Controllers\Admin\TreasuryController::class, 'bulkPayout'])->name('admin.treasury.bulk-payout');
        Route::post('admin/treasury/payout/{id}', [\App\Http\Controllers\Admin\TreasuryController::class, 'processPayout'])->name('admin.treasury.payout');
        Route::get('admin/payments', [\App\Http\Controllers\Admin\PaymentVerificationController::class, 'index'])->name('admin.payments');
        Route::post('admin/payments/{payment}/verify', [\App\Http\Controllers\Api\PaymentController::class, 'verifyPayment'])->name('admin.payments.verify');
        Route::get('admin/complaints', [\App\Http\Controllers\Admin\ComplaintController::class, 'index'])->name('admin.complaints');
        Route::post('admin/complaints/{complaint}/approve', [\App\Http\Controllers\Admin\ComplaintController::class, 'approve'])->name('admin.complaints.approve');
        Route::post('admin/complaints/{complaint}/reject', [\App\Http\Controllers\Admin\ComplaintController::class, 'reject'])->name('admin.complaints.reject');
    });
});

require __DIR__.'/settings.php';
