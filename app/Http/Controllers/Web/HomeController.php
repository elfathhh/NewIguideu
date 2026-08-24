<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\GuideProfile;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        // 1. Fetch Verified Featured Guides with Profiles
        $guides = User::where('role', 'guide')
            ->whereHas('guideProfile', function ($query) {
                $query->where('verification_status', 'verified');
            })
            ->with(['guideProfile', 'tourPackages'])
            ->get()
            ->map(function ($user) {
                $profile = $user->guideProfile;
                $serviceAreas = $profile->service_areas ?? [];
                $areasString = implode(' ', $serviceAreas) . ' ' . ($profile->bio ?? '');

                // Category detection
                $category = 'mountain';
                if (preg_match('/gili|marine|diving|snorkeling|moyo|bima/i', $areasString)) {
                    $category = 'marine';
                } elseif (preg_match('/sade|sukarara|mataram|budaya|heritage|ende|etnografi|tenun/i', $areasString)) {
                    $category = 'heritage';
                } elseif (preg_match('/waterfall|air terjun|tiu kelep|sendang gile/i', $areasString)) {
                    $category = 'waterfall';
                } elseif (preg_match('/surf|mandalika|pantai kuta|selong belanak/i', $areasString)) {
                    $category = 'surf';
                }

                $flags = [
                    'ID' => '🇮🇩',
                    'EN' => '🇬🇧',
                    'NL' => '🇳🇱',
                    'FR' => '🇫🇷',
                    'DE' => '🇩🇪',
                    'JP' => '🇯🇵',
                    'AR' => '🇸🇦',
                ];
                $labels = [
                    'ID' => 'Indonesia',
                    'EN' => 'English',
                    'NL' => 'Dutch',
                    'FR' => 'French',
                    'DE' => 'German',
                    'JP' => 'Japanese',
                    'AR' => 'Arabic',
                ];

                $languages = array_map(function ($lang) use ($flags, $labels) {
                    return [
                        'code' => $lang,
                        'flag' => $flags[$lang] ?? '🌐',
                        'label' => $labels[$lang] ?? $lang,
                    ];
                }, $profile->languages ?? ['ID', 'EN']);

                $badges = [
                    ['text' => 'Terverifikasi', 'type' => 'verified'],
                ];
                if ((float) ($profile->rating_avg ?? 0) >= 4.90) {
                    $badges[] = ['text' => 'Super Guide', 'type' => 'super'];
                } else {
                    $badges[] = ['text' => 'Sertifikasi BNSP', 'type' => 'certified'];
                }

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'specialty' => $user->tourPackages->first()?->title ?? ($profile->bio ? substr($profile->bio, 0, 50) . '...' : 'Pemandu Lokal NTB'),
                    'category' => $category,
                    'location' => ($profile->city ?? 'Lombok') . ', NTB',
                    'city' => $profile->city ?? 'Lombok',
                    'province' => $profile->province ?? 'Nusa Tenggara Barat',
                    'rating' => (string) number_format((float) ($profile->rating_avg ?? 4.90), 2),
                    'reviews' => (int) ($profile->review_count ?? 0),
                    'exp' => '5+ Tahun Pengalaman',
                    'experience' => '5+ Tahun',
                    'hourlyRate' => (int) ($profile->hourly_rate ?? 0),
                    'dailyRate' => (int) ($profile->daily_rate ?? 0),
                    'price' => 'Rp ' . number_format((float) ($profile->daily_rate ?? 0), 0, ',', '.'),
                    'priceLabel' => 'Rp ' . number_format((float) ($profile->daily_rate ?? 0), 0, ',', '.'),
                    'unit' => '/ hari',
                    'quote' => $profile->bio ?? 'Pemandu lokal ramah siap menemani perjalanan wisata Anda di Nusa Tenggara Barat.',
                    'bio' => $profile->bio ?? '',
                    'badges' => $badges,
                    'languages' => $languages,
                    'image' => $user->avatar ?: 'https://images.pexels.com/photos/2563681/pexels-photo-2563681.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop',
                    'verified' => true,
                    'availableNow' => true,
                    'serviceAreas' => $serviceAreas,
                    'vehicles' => $profile->vehicles ?? [],
                    'extras' => $profile->extras ?? [],
                ];
            });

        // 2. Compute Category Stats
        $categoryStats = [
            'rinjani' => $guides->filter(fn($g) => in_array('Gunung Rinjani', $g['serviceAreas']) || str_contains($g['location'], 'Lombok Utara') || str_contains($g['location'], 'Lombok Timur'))->count(),
            'tambora' => $guides->filter(fn($g) => in_array('Gunung Tambora', $g['serviceAreas']) || str_contains($g['city'], 'Dompu') || str_contains($g['city'], 'Sumbawa'))->count(),
            'tiu-kelep' => $guides->filter(fn($g) => in_array('Air Terjun Tiu Kelep', $g['serviceAreas']) || in_array('Air Terjun Sendang Gile', $g['serviceAreas']) || $g['category'] === 'waterfall')->count(),
            'sasak-heritage' => $guides->filter(fn($g) => $g['category'] === 'heritage' || str_contains($g['city'], 'Lombok Tengah'))->count(),
            'gili-marine' => $guides->filter(fn($g) => $g['category'] === 'marine' || in_array('Gili Trawangan', $g['serviceAreas']))->count(),
            'totalGuides' => $guides->count(),
        ];

        // 3. User notifications if authenticated
        $user = $request->user();
        $notifications = [];
        if ($user) {
            if ($user->role === 'traveler') {
                $userBookings = Booking::where('traveler_id', $user->id)
                    ->with(['guide', 'package', 'payment'])
                    ->latest()
                    ->take(5)
                    ->get();

                foreach ($userBookings as $b) {
                    $guideName = $b->guide ? $b->guide->name : 'Pemandu';
                    if ($b->status === 'confirmed' && $b->payment && $b->payment->payment_status === 'pending') {
                        $notifications[] = [
                            'id' => 'notif-pay-' . $b->id,
                            'title' => 'Menunggu Verifikasi Pembayaran ⏳',
                            'description' => "Pesanan {$b->booking_code} bersama {$guideName} sedang diverifikasi oleh admin.",
                            'time' => $b->created_at ? $b->created_at->diffForHumans() : 'Baru saja',
                            'unread' => true,
                            'type' => 'booking',
                            'link' => '/dashboard',
                        ];
                    } elseif ($b->status === 'confirmed' && $b->payment && $b->payment->payment_status === 'paid') {
                        $notifications[] = [
                            'id' => 'notif-conf-' . $b->id,
                            'title' => 'Status Pesanan Terkonfirmasi 🎉',
                            'description' => "Pemandu {$guideName} telah mengonfirmasi pesanan wisata Anda ({$b->booking_code}).",
                            'time' => $b->updated_at ? $b->updated_at->diffForHumans() : 'Baru saja',
                            'unread' => false,
                            'type' => 'booking',
                            'link' => '/dashboard',
                        ];
                    }
                }
            }
        }

        return Inertia::render('welcome', [
            'featuredGuides' => $guides->take(6)->values(),
            'categoryStats' => $categoryStats,
            'userNotifications' => $notifications,
        ]);
    }
}
