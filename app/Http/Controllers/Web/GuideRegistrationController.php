<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\GuideProfile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class GuideRegistrationController extends Controller
{
    /**
     * Show the guide registration form.
     */
    public function create()
    {
        $ntbCities = [
            'Lombok Utara (Gili, Senaru)',
            'Lombok Tengah (Mandalika, Sade)',
            'Lombok Timur (Sembalun, Tetebatu)',
            'Lombok Barat (Senggigi, Sekotong)',
            'Kota Mataram',
            'Sumbawa',
            'Sumbawa Barat (Pulau Moyo)',
            'Dompu',
            'Bima',
            'Kota Bima',
        ];

        $popularAreas = [
            [
                'id' => 'rinjani',
                'name' => 'Gunung Rinjani',
                'category' => 'Gunung',
                'location' => 'Lombok',
            ],
            [
                'id' => 'tambora',
                'name' => 'Gunung Tambora',
                'category' => 'Gunung',
                'location' => 'Sumbawa',
            ],
            [
                'id' => 'sembalun',
                'name' => 'Sembalun',
                'category' => 'Gunung',
                'location' => 'Lombok Timur',
            ],
            [
                'id' => 'tiu-kelep',
                'name' => 'Tiu Kelep',
                'category' => 'Air Terjun',
                'location' => 'Lombok Utara',
            ],
            [
                'id' => 'benang-kelambu',
                'name' => 'Benang Kelambu',
                'category' => 'Air Terjun',
                'location' => 'Lombok Tengah',
            ],
            [
                'id' => 'sade',
                'name' => 'Desa Adat Sade',
                'category' => 'Budaya',
                'location' => 'Lombok Tengah',
            ],
            [
                'id' => 'gili-trawangan',
                'name' => 'Gili Trawangan',
                'category' => 'Bahari',
                'location' => 'Lombok Utara',
            ],
            [
                'id' => 'gili-nanggu',
                'name' => 'Gili Nanggu',
                'category' => 'Bahari',
                'location' => 'Lombok Barat',
            ],
            [
                'id' => 'moyo',
                'name' => 'Pulau Moyo',
                'category' => 'Bahari',
                'location' => 'Sumbawa',
            ],
            [
                'id' => 'mandalika',
                'name' => 'Sirkuit Mandalika',
                'category' => 'Pantai',
                'location' => 'Lombok Tengah',
            ],
            [
                'id' => 'pantai-pink',
                'name' => 'Pantai Pink',
                'category' => 'Pantai',
                'location' => 'Lombok Timur',
            ],
            [
                'id' => 'senggigi',
                'name' => 'Senggigi',
                'category' => 'Pantai',
                'location' => 'Lombok Barat',
            ],
            [
                'id' => 'kenawa',
                'name' => 'Pulau Kenawa',
                'category' => 'Bahari',
                'location' => 'Sumbawa Barat',
            ],
        ];

        $languageOptions = [
            ['code' => 'ID', 'label' => 'Bahasa Indonesia'],
            ['code' => 'EN', 'label' => 'English'],
            ['code' => 'JP', 'label' => '日本語 (Japanese)'],
            ['code' => 'NL', 'label' => 'Nederlands (Dutch)'],
            ['code' => 'DE', 'label' => 'Deutsch (German)'],
            ['code' => 'AR', 'label' => 'العربية (Arabic)'],
            ['code' => 'ZH', 'label' => '中文 (Mandarin)'],
        ];

        $vehicleOptions = [
            ['id' => 'car', 'label' => 'Termasuk Mobil / MPV (AC)'],
            ['id' => 'motorcycle', 'label' => 'Termasuk Sepeda Motor'],
            ['id' => 'none', 'label' => 'Tanpa Kendaraan (Pemandu Saja / Walking Tour)'],
        ];

        $bankOptions = [
            'Bank Central Asia (BCA)',
            'Bank Mandiri',
            'Bank Rakyat Indonesia (BRI)',
            'Bank Negara Indonesia (BNI)',
            'Bank NTB Syariah',
            'Bank Syariah Indonesia (BSI)',
            'Bank CIMB Niaga',
            'Bank Permata',
        ];

        return Inertia::render('join-guide', [
            'ntbCities' => $ntbCities,
            'popularAreas' => $popularAreas,
            'languageOptions' => $languageOptions,
            'vehicleOptions' => $vehicleOptions,
            'bankOptions' => $bankOptions,
        ]);
    }

    /**
     * Handle the guide registration submission.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'phone' => 'required|string|max:25',
            'password' => 'required|string|min:8|confirmed',
            'avatar' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
            'id_card' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
            'city' => 'required|string|max:100',
            'bio' => 'required|string|min:20|max:1000',
            'languages' => 'required|array|min:1',
            'languages.*' => 'string',
            'vehicles' => 'nullable|array',
            'service_areas' => 'nullable|array',
            'daily_rate' => 'required|numeric|min:50000',
            'bank_name' => 'required|string|max:100',
            'bank_account_number' => 'required|string|max:50',
            'bank_account_holder' => 'required|string|max:255',
        ], [
            'name.required' => 'Nama lengkap wajib diisi.',
            'email.required' => 'Alamat email wajib diisi.',
            'email.unique' => 'Email ini sudah terdaftar. Silakan gunakan email lain atau masuk ke akun Anda.',
            'phone.required' => 'Nomor WhatsApp wajib diisi.',
            'password.required' => 'Kata sandi wajib diisi.',
            'password.min' => 'Kata sandi minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi kata sandi tidak cocok.',
            'avatar.required' => 'Foto profil profesional wajib diunggah.',
            'id_card.required' => 'Foto KTP asli wajib diunggah untuk verifikasi.',
            'city.required' => 'Pilih kota/kabupaten domisili operasional Anda di NTB.',
            'bio.required' => 'Deskripsi profil dan spesialisasi wajib diisi minimal 20 karakter.',
            'languages.required' => 'Pilih minimal satu bahasa yang Anda kuasai.',
            'daily_rate.required' => 'Estimasi tarif harian wajib diisi.',
            'bank_name.required' => 'Nama bank tujuan pencairan wajib dipilih.',
            'bank_account_number.required' => 'Nomor rekening bank wajib diisi.',
            'bank_account_holder.required' => 'Nama pemilik rekening sesuai buku tabungan/KTP wajib diisi.',
        ]);

        // Upload Profile Avatar
        $avatarPath = null;
        if ($request->hasFile('avatar')) {
            $avatarFile = $request->file('avatar');
            $avatarFilename = 'avatar_' . time() . '_' . uniqid() . '.' . $avatarFile->getClientOriginalExtension();
            $avatarFile->storeAs('avatars', $avatarFilename, 'public');
            $avatarPath = '/storage/avatars/' . $avatarFilename;
        }

        // Upload KTP
        $idCardPath = null;
        if ($request->hasFile('id_card')) {
            $idCardFile = $request->file('id_card');
            $idCardFilename = 'ktp_' . time() . '_' . uniqid() . '.' . $idCardFile->getClientOriginalExtension();
            $idCardFile->storeAs('id_cards', $idCardFilename, 'public');
            $idCardPath = '/storage/id_cards/' . $idCardFilename;
        }

        // Create User with role 'guide'
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'password' => Hash::make($validated['password']),
            'role' => 'guide',
            'avatar' => $avatarPath,
            'email_verified_at' => now(),
        ]);

        // Create GuideProfile with status 'pending'
        GuideProfile::create([
            'user_id' => $user->id,
            'bio' => $validated['bio'],
            'languages' => $validated['languages'],
            'city' => $validated['city'],
            'province' => 'Nusa Tenggara Barat',
            'hourly_rate' => round($validated['daily_rate'] / 8),
            'daily_rate' => $validated['daily_rate'],
            'verification_status' => 'pending',
            'id_card_url' => $idCardPath,
            'rating_avg' => 5.00,
            'review_count' => 0,
            'service_areas' => $validated['service_areas'] ?? [],
            'vehicles' => $validated['vehicles'] ?? [],
            'extras' => ['Air Mineral', 'Dokumentasi Foto Standar'],
            'bank_name' => $validated['bank_name'],
            'bank_account_number' => $validated['bank_account_number'],
            'bank_account_holder' => $validated['bank_account_holder'],
        ]);

        return redirect()->route('join-guide.success')->with([
            'submitted' => true,
            'guide_name' => $user->name,
            'guide_email' => $user->email,
        ]);
    }

    /**
     * Show success registration notice.
     */
    public function success()
    {
        return Inertia::render('join-guide-success');
    }
}
