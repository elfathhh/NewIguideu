<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\GuideProfile;
use App\Models\Review;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ReviewTest extends TestCase
{
    use RefreshDatabase;

    public function test_traveler_can_submit_review_for_completed_booking()
    {
        $traveler = User::factory()->create(['role' => 'traveler']);
        $guide = User::factory()->create(['role' => 'guide']);
        $profile = GuideProfile::create([
            'user_id' => $guide->id,
            'bio' => 'Experienced Lombok guide',
            'city' => 'Mataram',
            'province' => 'Nusa Tenggara Barat',
            'rating_avg' => 0,
            'review_count' => 0,
            'verification_status' => 'verified',
        ]);

        $booking = Booking::create([
            'booking_code' => 'IGU-TEST01',
            'traveler_id' => $traveler->id,
            'guide_id' => $guide->id,
            'booking_date' => now()->toDateString(),
            'start_time' => '08:00',
            'duration_days' => 1,
            'total_amount' => 500000,
            'status' => 'completed',
        ]);

        $response = $this->actingAs($traveler)->post(route('bookings.reviews.store', $booking), [
            'rating' => 5,
            'comment' => 'Pelayanan pemandu sangat luar biasa dan ramah!',
        ]);

        $response->assertSessionHasNoErrors();
        $this->assertDatabaseHas('reviews', [
            'booking_id' => $booking->id,
            'traveler_id' => $traveler->id,
            'guide_id' => $guide->id,
            'rating' => 5,
            'comment' => 'Pelayanan pemandu sangat luar biasa dan ramah!',
        ]);

        $profile->refresh();
        $this->assertEquals(1, $profile->review_count);
        $this->assertEquals(5.00, (float) $profile->rating_avg);
    }

    public function test_cannot_review_pending_or_ongoing_booking()
    {
        $traveler = User::factory()->create(["role" => "traveler"]);
        $guide = User::factory()->create(["role" => "guide"]);

        $booking = Booking::create([
            "booking_code" => "IGU-TEST02",
            "traveler_id" => $traveler->id,
            "guide_id" => $guide->id,
            "booking_date" => now()->toDateString(),
            "start_time" => "08:00",
            "duration_days" => 1,
            "total_amount" => 500000,
            "status" => "confirmed",
        ]);

        $response = $this->actingAs($traveler)->post(route("bookings.reviews.store", $booking), [
            "rating" => 5,
            "comment" => "Tur belum selesai",
        ]);

        $this->assertDatabaseMissing("reviews", [
            "booking_id" => $booking->id,
        ]);
    }

    public function test_duplicate_review_is_prevented()
    {
        $traveler = User::factory()->create(["role" => "traveler"]);
        $guide = User::factory()->create(["role" => "guide"]);
        GuideProfile::create([
            "user_id" => $guide->id,
            "city" => "Mataram",
            "province" => "Nusa Tenggara Barat",
            "verification_status" => "verified",
        ]);

        $booking = Booking::create([
            "booking_code" => "IGU-TEST03",
            "traveler_id" => $traveler->id,
            "guide_id" => $guide->id,
            "booking_date" => now()->toDateString(),
            "start_time" => "08:00",
            "duration_days" => 1,
            "total_amount" => 500000,
            "status" => "completed",
        ]);

        Review::create([
            "booking_id" => $booking->id,
            "traveler_id" => $traveler->id,
            "guide_id" => $guide->id,
            "rating" => 4,
            "comment" => "Ulasan pertama",
        ]);

        $response = $this->actingAs($traveler)->post(route("bookings.reviews.store", $booking), [
            "rating" => 5,
            "comment" => "Ulasan kedua yang duplikat",
        ]);

        $this->assertEquals(1, Review::where("booking_id", $booking->id)->count());
    }
}
