<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_code')->unique();
            $table->foreignId('traveler_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('guide_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('package_id')->nullable()->constrained('tour_packages')->onDelete('set null');
            $table->date('booking_date');
            $table->string('start_time')->default('08:00');
            $table->integer('duration_days')->default(1);
            $table->decimal('total_amount', 12, 2);
            $table->string('status')->default('pending'); // pending, confirmed, completed, cancelled
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
