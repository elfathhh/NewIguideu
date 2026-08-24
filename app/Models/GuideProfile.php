<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GuideProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'bio',
        'languages',
        'city',
        'province',
        'hourly_rate',
        'daily_rate',
        'verification_status',
        'id_card_url',
        'certificate_url',
        'rating_avg',
        'review_count',
        'service_areas',
        'vehicles',
        'extras',
        'bank_name',
        'bank_account_number',
        'bank_account_holder',
        'rejection_reason',
    ];

    protected $casts = [
        'languages' => 'array',
        'service_areas' => 'array',
        'vehicles' => 'array',
        'extras' => 'array',
        'hourly_rate' => 'decimal:2',
        'daily_rate' => 'decimal:2',
        'rating_avg' => 'decimal:2',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
