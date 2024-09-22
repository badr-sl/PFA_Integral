<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:3',
                'phoneNumber' => 'required|string',
            ]);

            $user = User::create([
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'PhoneNumber' => $validatedData['phoneNumber'],
                'role' => 'user',
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'message' => 'User registered successfully lllllllll',
                'user' => $user,
                'token' => $token,
            ], 201);

        } catch (\Exception $e) {
            // Log the error
            \Log::error('Registration error: ' . $e->getMessage());

            return response()->json([
                'message' => 'Registration failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Log in an existing user.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $credentials = $request->only('email', 'password');

        if (!Auth::attempt($credentials)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['message' => 'User logged in successfully', 'token' => $token, 'user' => $user], 200);
    }

    /**
     * Log out the authenticated user.
     */
    public function logout()
    {
        Auth::user()->tokens()->delete();

        return response()->json(['message' => 'User logged out successfully'], 200);
    }
}
