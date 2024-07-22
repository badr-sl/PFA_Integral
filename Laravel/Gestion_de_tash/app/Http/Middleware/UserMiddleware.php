<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class UserMiddleware
{public function handle(Request $request, Closure $next)
    {
        if ($request->user() && $request->user()->role === 'user') {
            return $next($request);
        }

        abort(403, 'Unauthorized action for user.');
    }
}
