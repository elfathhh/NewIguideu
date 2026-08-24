<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (!$request->user() || $request->user()->role !== $role) {
            
            // Allow redirect logic based on their actual role if they hit the wrong dashboard
            if ($request->user()) {
                $actualRole = $request->user()->role;
                if ($actualRole === 'admin') {
                    return redirect()->route('admin.dashboard');
                } elseif ($actualRole === 'guide') {
                    return redirect()->route('guide.dashboard');
                } else {
                    return redirect()->route('dashboard');
                }
            }

            abort(403, 'Unauthorized Access.');
        }

        return $next($request);
    }
}
