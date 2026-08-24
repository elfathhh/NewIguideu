<?php

namespace App\Http\Controllers\Guide;

use App\Http\Controllers\Controller;
use App\Models\GuideProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $profile = GuideProfile::where('user_id', $user->id)->first();
        
        return Inertia::render('guide/packages', [
            'settings' => [
                'phone' => $user->phone ?? '',
                'daily_rate' => $profile->daily_rate ?? 0,
                'service_areas' => $profile->service_areas ?? [],
                'vehicles' => $profile->vehicles ?? [],
                'extras' => $profile->extras ?? []
            ]
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'phone' => 'required|string|max:25',
            'daily_rate' => 'required|numeric|min:0',
            'service_areas' => 'nullable|array',
            'vehicles' => 'nullable|array',
            'extras' => 'nullable|array',
        ], [
            'phone.required' => 'Nomor WhatsApp aktif wajib diisi.',
        ]);

        $request->user()->update([
            'phone' => $validated['phone'],
        ]);

        $profile = GuideProfile::firstOrCreate(
            ['user_id' => $request->user()->id],
            ['daily_rate' => 0]
        );

        $profile->update([
            'daily_rate' => $validated['daily_rate'],
            'service_areas' => $validated['service_areas'] ?? [],
            'vehicles' => $validated['vehicles'] ?? [],
            'extras' => $validated['extras'] ?? [],
        ]);

        return redirect()->back()->with('success', 'Pengaturan layanan dan nomor WhatsApp berhasil disimpan.');
    }
}
