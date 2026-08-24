<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    public function handle(Request $request, \Closure $next)
    {
        // Save the intended URL for redirecting back after manual login
        if ($request->method() === 'GET' && 
            $request->route() && 
            ! $request->routeIs('login', 'register', 'password.*', 'verification.*', 'logout', 'passkey.*', 'two-factor.*', 'admin.*', 'api.*')) {
            $request->session()->put('url.intended', $request->fullUrl());
        }

        return parent::handle($request, $next);
    }

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $activeBookingsCount = 0;

        if ($user && $user->role === 'traveler') {
            $activeBookingsCount = \App\Models\Booking::where('traveler_id', $user->id)
                ->whereIn('status', ['pending', 'accepted', 'confirmed', 'ongoing'])
                ->count();
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $user,
                'activeBookingsCount' => $activeBookingsCount,
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
            'flash' => [
                'success' => $request->session()->get('success'),
                'error' => $request->session()->get('error'),
                'warning' => $request->session()->get('warning'),
                'info' => $request->session()->get('info'),
            ],
        ];
    }
}
