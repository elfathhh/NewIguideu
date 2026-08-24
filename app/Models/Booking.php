<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'booking_code',
        'traveler_id',
        'guide_id',
        'package_id',
        'booking_date',
        'start_time',
        'duration_days',
        'total_amount',
        'status',
        'guide_ended_at',
        'notes',
    ];

    protected $casts = [
        'booking_date' => 'date',
        'guide_ended_at' => 'datetime',
        'total_amount' => 'decimal:2',
    ];

    public function traveler(): BelongsTo
    {
        return $this->belongsTo(User::class, 'traveler_id');
    }

    public function guide(): BelongsTo
    {
        return $this->belongsTo(User::class, 'guide_id');
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(TourPackage::class, 'package_id');
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }

    public function complaint(): HasOne
    {
        return $this->hasOne(Complaint::class);
    }

    public function review(): HasOne
    {
        return $this->hasOne(Review::class);
    }
}
