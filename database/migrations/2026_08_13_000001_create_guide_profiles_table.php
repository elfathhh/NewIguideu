<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('guide_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('bio')->nullable();
            $table->json('languages')->nullable(); // ['ID', 'EN', 'NL']
            $table->string('city');
            $table->string('province');
            $table->decimal('hourly_rate', 12, 2)->default(0);
            $table->decimal('daily_rate', 12, 2)->default(0);
            $table->string('verification_status')->default('pending'); // pending, verified, rejected
            $table->string('id_card_url')->nullable();
            $table->string('certificate_url')->nullable();
            $table->decimal('rating_avg', 3, 2)->default(5.00);
            $table->integer('review_count')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('guide_profiles');
    }
};
