<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\TourPackage;
use App\Models\Review;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GuideController extends Controller
{
    private function mapGuideData($user)
    {
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
            'verified' => ($profile->verification_status ?? '') === 'verified',
            'availableNow' => true,
            'vehicles' => $profile->vehicles ?? ['car', 'motorcycle'],
            'serviceAreas' => $serviceAreas,
            'gender' => 'male',
            'maxPax' => 8,
            'extras' => $profile->extras ?? ['documentation', 'equipment'],
            'phone' => $user->phone ?? '',
            'whatsapp' => (function() use ($user) {
                $raw = preg_replace('/[^0-9]/', '', $user->phone ?? '');
                if (str_starts_with($raw, '0')) return '62' . substr($raw, 1);
                if (str_starts_with($raw, '62')) return $raw;
                return $raw ? '62' . $raw : '6281234567890';
            })(),
            'packages' => $user->tourPackages->map(function ($pkg) {
                return [
                    'id' => $pkg->id,
                    'title' => $pkg->title,
                    'description' => $pkg->description,
                    'price' => (float) $pkg->price,
                    'durationHours' => $pkg->duration_hours,
                    'maxPersons' => $pkg->max_persons,
                    'includes' => $pkg->includes ?? [],
                    'excludes' => $pkg->excludes ?? [],
                ];
            }),
        ];
    }

    public function search(Request $request)
    {
        $guides = User::where('role', 'guide')
            ->whereHas('guideProfile', function ($query) {
                $query->where('verification_status', 'verified');
            })
            ->with(['guideProfile', 'tourPackages'])
            ->get()
            ->map(function ($user) {
                return $this->mapGuideData($user);
            });

        return Inertia::render('guides/search', [
            'serverGuides' => $guides
        ]);
    }

    public function show($id)
    {
        $user = User::where('role', 'guide')->with(['guideProfile', 'tourPackages'])->find($id);
        
        $guide = null;
        if ($user && $user->guideProfile) {
            $guide = $this->mapGuideData($user);
        }

        $reviews = Review::where('guide_id', $id)
            ->with(['traveler', 'booking.package'])
            ->latest()
            ->get()
            ->map(function ($rev) {
                return [
                    'id' => $rev->id,
                    'name' => $rev->traveler?->name ?? 'Wisatawan IguideU',
                    'avatar' => $rev->traveler?->avatar ?? null,
                    'date' => $rev->created_at ? $rev->created_at->format('d M Y') : '',
                    'rating' => (int) $rev->rating,
                    'variant' => $rev->booking?->package?->title ?? ($rev->booking?->notes ? explode(' - ', $rev->booking->notes)[1] ?? 'Tur Pemandu' : 'Tur Pemandu'),
                    'comment' => $rev->comment ?? '',
                    'photo' => null,
                ];
            });

        $relatedGuides = User::where('role', 'guide')
            ->where('id', '!=', $id)
            ->whereHas('guideProfile', function ($query) {
                $query->where('verification_status', 'verified');
            })
            ->with(['guideProfile', 'tourPackages'])
            ->take(4)
            ->get()
            ->map(function ($u) {
                return $this->mapGuideData($u);
            });

        return Inertia::render('guides/show', [
            'serverGuide' => $guide,
            'guideId' => (int) $id,
            'serverReviews' => $reviews,
            'relatedGuides' => $relatedGuides,
        ]);
    }
}

