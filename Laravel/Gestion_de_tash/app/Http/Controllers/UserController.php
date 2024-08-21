<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Hash;


class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
{
    $users = User::orderBy('created_at', 'desc')->get();
    return response()->json(UserResource::collection($users));
}





    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|unique:users,email',
        'password' => 'required|string|min:3',
        'PhoneNumber' => 'required|string',
        'role' => 'string|in:admin,user'
    ]);

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
        'PhoneNumber' => $request->PhoneNumber,
        'role' => $request->role
    ]);

    return response()->json([
        'user' => new UserResource($user),
        'message' => 'User created successfully',
    ], 201);
}



    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $user = User::find($id);

        return response()->json(new UserResource($user), 200);
    }



    /**
     * Update the specified resource in storage.
     */
   public function update(Request $request, $id)
    {
        try {
            // Validation des données entrantes
            $request->validate([
                'name' => 'string|max:255',
                'password' => 'string|min:3|nullable',
                'PhoneNumber' => 'string',
                'role' => 'string|in:admin,user'
            ]);

            $user = User::find($id);

            // Mise à jour des champs
            if ($request->filled('name')) {
                $user->name = $request->name;
            }

            if ($request->filled('password')) {
                $user->password = Hash::make($request->password);
            }

            if ($request->filled('PhoneNumber')) {
                $user->PhoneNumber = $request->PhoneNumber;
            }

            if ($request->filled('role')) {
                $user->role = $request->role;
            }

            $user->save();

            return response()->json([
                'user' => $user,
                'message' => 'User updated successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Something went wrong',
                'message' => $e->getMessage(),
            ], 500);
        }
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        //
    }
}
