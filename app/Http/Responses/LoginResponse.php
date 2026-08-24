<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Symfony\Component\HttpFoundation\Response;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function toResponse($request): Response
    {
        $user = $request->user();

        if ($user?->role === 'admin') {
            return $request->wantsJson()
                ? response()->json(['two_factor' => false])
                : redirect()->route('admin.dashboard');
        }

        if ($user?->role === 'guide') {
            return $request->wantsJson()
                ? response()->json(['two_factor' => false])
                : redirect()->route('guide.dashboard');
        }

        // For traveler / standard users: return to the intended/last-visited page
        $defaultUrl = route('home');

        return $request->wantsJson()
            ? response()->json(['two_factor' => false])
            : redirect()->intended($defaultUrl);
    }
}
