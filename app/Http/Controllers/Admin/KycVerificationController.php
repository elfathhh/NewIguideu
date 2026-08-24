<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GuideProfile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KycVerificationController extends Controller
{
    public function index()
    {
        $profiles = GuideProfile::with('user')
            ->orderByRaw("CASE WHEN verification_status = 'pending' THEN 1 WHEN verification_status = 'rejected' THEN 2 ELSE 3 END")
            ->latest()
            ->get();

        $applicants = $profiles->map(function ($profile) {
            $user = $profile->user;
            $languages = is_array($profile->languages) 
                ? implode(', ', $profile->languages) 
                : ($profile->languages ?? 'Bahasa Indonesia');

            return [
                'id' => $profile->id,
                'userId' => $user ? $user->id : null,
                'name' => $user ? $user->name : 'Unknown Guide',
                'email' => $user ? $user->email : '-',
                'phone' => $user ? ($user->phone ?? '-') : '-',
                'avatar' => $user ? $user->avatar : null,
                'type' => ($profile->city ?? 'NTB') . ' • Nusa Tenggara Barat',
                'time' => $profile->created_at ? $profile->created_at->diffForHumans() : 'Baru saja',
                'languages' => $languages,
                'serviceAreas' => $profile->service_areas ?? [],
                'vehicles' => $profile->vehicles ?? [],
                'dailyRate' => (float) ($profile->daily_rate ?? 0),
                'hourlyRate' => (float) ($profile->hourly_rate ?? 0),
                'bankName' => $profile->bank_name ?? 'Belum diisi',
                'bankAccountNumber' => $profile->bank_account_number ?? '-',
                'bankAccountHolder' => $profile->bank_account_holder ?? '-',
                'ktpUrl' => $profile->id_card_url ?? 'https://via.placeholder.com/600x400?text=KTP+Belum+Tersedia',
                'certUrl' => $profile->certificate_url,
                'bio' => $profile->bio ?? 'Tidak ada deskripsi.',
                'appId' => 'KYC-' . ($profile->created_at ? $profile->created_at->format('Y') : date('Y')) . '-' . str_pad((string) $profile->id, 4, '0', STR_PAD_LEFT),
                'status' => $profile->verification_status ?? 'pending',
                'rejectionReason' => $profile->rejection_reason,
            ];
        });

        $counts = [
            'all' => $applicants->count(),
            'pending' => $applicants->where('status', 'pending')->count(),
            'verified' => $applicants->where('status', 'verified')->count(),
            'rejected' => $applicants->where('status', 'rejected')->count(),
        ];

        return Inertia::render('admin/kyc', [
            'applicants' => $applicants,
            'counts' => $counts,
        ]);
    }

    public function approve(int $id)
    {
        $profile = GuideProfile::with('user')->findOrFail($id);
        $profile->update([
            'verification_status' => 'verified',
            'rejection_reason' => null,
        ]);

        if ($profile->user) {
            $profile->user->update([
                'role' => 'guide',
                'email_verified_at' => $profile->user->email_verified_at ?? now(),
            ]);
        }

        $guideName = $profile->user ? $profile->user->name : 'Pemandu';
        return back()->with('success', "Akun pemandu {$guideName} berhasil diverifikasi dan aktif di katalog pencarian wisatawan!");
    }

    public function bulkApprove(Request $request)
    {
        $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'integer|exists:guide_profiles,id',
        ]);

        $ids = $request->input('ids', []);
        $profiles = GuideProfile::with('user')->whereIn('id', $ids)->get();

        foreach ($profiles as $profile) {
            $profile->update([
                'verification_status' => 'verified',
                'rejection_reason' => null,
            ]);

            if ($profile->user) {
                $profile->user->update([
                    'role' => 'guide',
                    'email_verified_at' => $profile->user->email_verified_at ?? now(),
                ]);
            }
        }

        $count = $profiles->count();
        return back()->with('success', "Berhasil memverifikasi {$count} mitra pemandu secara massal!");
    }

    public function reject(Request $request, int $id)
    {
        $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        $profile = GuideProfile::with('user')->findOrFail($id);
        $reason = $request->input('reason', 'Dokumen identitas tidak memenuhi syarat verifikasi.');
        
        $profile->update([
            'verification_status' => 'rejected',
            'rejection_reason' => $reason,
        ]);

        $guideName = $profile->user ? $profile->user->name : 'Pemandu';
        return back()->with('warning', "Pengajuan verifikasi {$guideName} telah ditolak.");
    }
}
