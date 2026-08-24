<?php

namespace App\Listeners;

use Illuminate\Auth\Events\Login;
use Illuminate\Http\Request;

class LogSuccessfulLogin
{
    /**
     * Create the event listener.
     */
    public function __construct(protected Request $request)
    {
    }

    /**
     * Handle the event.
     */
    public function handle(Login $event): void
    {
        if ($event->user) {
            $event->user->forceFill([
                'last_login_at' => now(),
                'last_login_ip' => $this->request->ip(),
            ])->save();
        }
    }
}
