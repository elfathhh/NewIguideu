<?php

namespace Tests\Feature;

use App\Models\User;
use App\Models\GuideProfile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class GuideRegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_view_join_guide_page(): void
    {
        $response = $this->get(route('join-guide'));

        $response->assertStatus(200);
    }

    public function test_guest_cannot_submit_empty_registration(): void
    {
        $response = $this->post(route('join-guide.store'), []);

        $response->assertSessionHasErrors([
            'name',
            'email',
            'phone',
            'password',
            'avatar',
            'id_card',
            'city',
            'bio',
            'languages',
            'daily_rate',
            'bank_name',
            'bank_account_number',
            'bank_account_holder',
        ]);
    }

    public function test_guest_can_register_as_guide_with_valid_data(): void
    {
        Storage::fake('public');

        $avatar = UploadedFile::fake()->image('profile.jpg', 400, 400);
        $idCard = UploadedFile::fake()->image('ktp.jpg', 800, 600);

        $payload = [
            'name' => 'Ahmad Rinjani',
            'email' => 'ahmad.rinjani@example.com',
            'phone' => '081234567890',
            'password' => 'password123',
            'password_confirmation' => 'password123',
            'avatar' => $avatar,
            'id_card' => $idCard,
            'city' => 'Lombok Utara (Gili, Senaru)',
            'bio' => 'Pemandu pendakian berpengalaman lebih dari 7 tahun di kawasan Gunung Rinjani dan Senaru.',
            'languages' => ['ID', 'EN'],
            'vehicles' => ['car'],
            'service_areas' => ['Gunung Rinjani', 'Tiu Kelep'],
            'daily_rate' => 750000,
            'bank_name' => 'Bank Central Asia (BCA)',
            'bank_account_number' => '8820192831',
            'bank_account_holder' => 'Ahmad Rinjani',
        ];

        $response = $this->post(route('join-guide.store'), $payload);

        $response->assertRedirect(route('join-guide.success'));

        // Assert User is created with role 'guide'
        $this->assertDatabaseHas('users', [
            'name' => 'Ahmad Rinjani',
            'email' => 'ahmad.rinjani@example.com',
            'phone' => '081234567890',
            'role' => 'guide',
        ]);

        $user = User::where('email', 'ahmad.rinjani@example.com')->first();
        $this->assertNotNull($user);

        // Assert GuideProfile is created with status 'pending'
        $this->assertDatabaseHas('guide_profiles', [
            'user_id' => $user->id,
            'verification_status' => 'pending',
            'city' => 'Lombok Utara (Gili, Senaru)',
            'daily_rate' => 750000,
            'bank_name' => 'Bank Central Asia (BCA)',
            'bank_account_number' => '8820192831',
            'bank_account_holder' => 'Ahmad Rinjani',
        ]);

        // Assert files are stored
        $profile = $user->guideProfile;
        $this->assertNotNull($profile->id_card_url);
        $this->assertNotNull($user->avatar);
    }

    public function test_pending_guide_is_not_displayed_in_public_search(): void
    {
        // 1. Create Verified Guide
        $verifiedUser = User::factory()->create([
            'name' => 'Verified Guide',
            'role' => 'guide',
        ]);
        GuideProfile::create([
            'user_id' => $verifiedUser->id,
            'city' => 'Kota Mataram',
            'province' => 'Nusa Tenggara Barat',
            'daily_rate' => 500000,
            'verification_status' => 'verified',
        ]);

        // 2. Create Pending Guide
        $pendingUser = User::factory()->create([
            'name' => 'Pending Guide',
            'role' => 'guide',
        ]);
        GuideProfile::create([
            'user_id' => $pendingUser->id,
            'city' => 'Lombok Tengah',
            'province' => 'Nusa Tenggara Barat',
            'daily_rate' => 600000,
            'verification_status' => 'pending',
        ]);

        $response = $this->get(route('guides.search'));
        $response->assertStatus(200);

        // Check props returned by Inertia
        $serverGuides = $response->viewData('page')['props']['serverGuides'] ?? [];
        $guideNames = collect($serverGuides)->pluck('name')->all();

        $this->assertContains('Verified Guide', $guideNames);
        $this->assertNotContains('Pending Guide', $guideNames);
    }

    public function test_non_admin_cannot_access_admin_kyc(): void
    {
        $traveler = User::factory()->create(['role' => 'traveler']);

        $response = $this->actingAs($traveler)->get(route('admin.kyc'));
        $response->assertRedirect(route('dashboard'));
    }

    public function test_admin_can_view_and_approve_kyc_application(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $guide = User::factory()->create([
            'name' => 'Calon Guide Sembalun',
            'role' => 'guide',
        ]);
        $profile = GuideProfile::create([
            'user_id' => $guide->id,
            'city' => 'Lombok Timur',
            'province' => 'Nusa Tenggara Barat',
            'daily_rate' => 650000,
            'verification_status' => 'pending',
        ]);

        // Admin visits KYC index
        $response = $this->actingAs($admin)->get(route('admin.kyc'));
        $response->assertStatus(200);

        // Admin approves KYC
        $approveResponse = $this->actingAs($admin)->post(route('admin.kyc.approve', $profile->id));
        $approveResponse->assertSessionHas('success');

        $this->assertDatabaseHas('guide_profiles', [
            'id' => $profile->id,
            'verification_status' => 'verified',
        ]);

        // Guide now appears in public search
        $searchResponse = $this->get(route('guides.search'));
        $serverGuides = $searchResponse->viewData('page')['props']['serverGuides'] ?? [];
        $guideNames = collect($serverGuides)->pluck('name')->all();

        $this->assertContains('Calon Guide Sembalun', $guideNames);
    }

    public function test_admin_can_reject_kyc_application_with_reason(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $guide = User::factory()->create([
            'name' => 'Calon Guide Buram',
            'role' => 'guide',
        ]);
        $profile = GuideProfile::create([
            'user_id' => $guide->id,
            'city' => 'Lombok Barat',
            'province' => 'Nusa Tenggara Barat',
            'daily_rate' => 550000,
            'verification_status' => 'pending',
        ]);

        // Admin rejects KYC with reason
        $rejectResponse = $this->actingAs($admin)->post(route('admin.kyc.reject', $profile->id), [
            'reason' => 'Foto KTP tidak terbaca jelas.',
        ]);

        $rejectResponse->assertSessionHas('warning');

        $this->assertDatabaseHas('guide_profiles', [
            'id' => $profile->id,
            'verification_status' => 'rejected',
            'rejection_reason' => 'Foto KTP tidak terbaca jelas.',
        ]);

        // Rejected guide does NOT appear in search
        $searchResponse = $this->get(route('guides.search'));
        $serverGuides = $searchResponse->viewData('page')['props']['serverGuides'] ?? [];
        $guideNames = collect($serverGuides)->pluck('name')->all();

        $this->assertNotContains('Calon Guide Buram', $guideNames);
    }

    public function test_guide_can_login_and_access_guide_dashboard(): void
    {
        $password = 'secret12345';
        $user = User::factory()->create([
            'email' => 'guide.rinjani@example.com',
            'password' => \Illuminate\Support\Facades\Hash::make($password),
            'role' => 'guide',
            'email_verified_at' => now(),
        ]);
        GuideProfile::create([
            'user_id' => $user->id,
            'city' => 'Lombok Utara',
            'province' => 'Nusa Tenggara Barat',
            'daily_rate' => 700000,
            'verification_status' => 'verified',
        ]);

        $response = $this->post(route('login.store'), [
            'email' => 'guide.rinjani@example.com',
            'password' => $password,
        ]);

        $this->assertAuthenticatedAs($user);
        $response->assertRedirect(route('guide.dashboard'));

        $dashboardResponse = $this->actingAs($user)->get(route('guide.dashboard'));
        $dashboardResponse->assertStatus(200);
    }

    public function test_guide_can_update_whatsapp_number_and_reflects_in_catalog(): void
    {
        $guide = User::factory()->create([
            'name' => 'Faisal Guide',
            'role' => 'guide',
            'phone' => '081234567890',
            'email_verified_at' => now(),
        ]);
        GuideProfile::create([
            'user_id' => $guide->id,
            'city' => 'Lombok Tengah',
            'province' => 'Nusa Tenggara Barat',
            'daily_rate' => 500000,
            'verification_status' => 'verified',
        ]);

        // Guide updates services and new WhatsApp number
        $response = $this->actingAs($guide)->post(route('guide.services.update'), [
            'phone' => '087788990011',
            'daily_rate' => 600000,
            'service_areas' => ['Sirkuit Mandalika'],
            'vehicles' => ['car'],
            'extras' => ['documentation'],
        ]);

        $response->assertSessionHas('success');

        $this->assertDatabaseHas('users', [
            'id' => $guide->id,
            'phone' => '087788990011',
        ]);

        // Show endpoint in catalog formats WhatsApp as 6287788990011
        $showResponse = $this->get(route('guides.show', $guide->id));
        $serverGuide = $showResponse->viewData('page')['props']['serverGuide'] ?? [];

        $this->assertEquals('6287788990011', $serverGuide['whatsapp']);
    }
}
