<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class TourPackage extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'guide_id',
        'title',
        'description',
        'price',
        'duration_hours',
        'max_persons',
        'includes',
        'excludes',
    ];

    protected $casts = [
        'includes' => 'array',
        'excludes' => 'array',
        'price' => 'decimal:2',
    ];

    public function guide(): BelongsTo
    {
        return $this->belongsTo(User::class, 'guide_id');
    }
}
