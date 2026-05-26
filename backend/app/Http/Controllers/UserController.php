<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class UserController extends Controller
{
    public function register(Request $request)
{
    $validated = $request->validate([
        'name' => ['required', 'string', 'min:2', 'max:255'],
        'email' => ['required', 'email', 'unique:users,email'],
        'password' => ['required', 'min:8'],
    ]);

    $user = User::create([
        'nombre' => $validated['name'],
        'email' => $validated['email'],
        'password' => Hash::make($validated['password']),
    ]);

    $token = $user->createToken('auth_token')->plainTextToken;

    return response()->json([
        'message' => 'Usuario registrado correctamente',
        'token' => $token,
        'user' => $user,
        'redirect' => '/home',
    ], 201);
}
    /**
     * LOGIN (FIXED - SIN Auth::attempt)
     */
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Credenciales incorrectas'],
            ]);
        }

        // borrar tokens antiguos
        $user->tokens()->delete();

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message'  => 'Login correcto',
            'token'    => $token,
            'redirect' => '/home',
            'user'     => $user,
        ]);
    }

    /**
     * USER AUTH
     */
    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    /**
     * LOGOUT
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout correcto',
        ]);
    }
}