<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class PerfilController extends Controller
{
public function getById($id)
{
    $user = User::find($id);

    if (!$user) {
        return response()->json([
            'success' => false,
            'message' => 'Usuario no encontrado'
        ], 404);
    }

    return response()->json([
        'success' => true,
        'data' => $user
    ]);
}

    /**
     * GET /api/perfil
     */
    public function show(Request $request)
    {
        return response()->json([
            'success' => true,
            'data' => $request->user(),
        ]);
    }

    /**
     * PUT /api/perfil
     */
  public function update(Request $request, $id)
{
    $user = User::find($id);

    if (!$user) {
        return response()->json([
            'message' => 'Usuario no encontrado'
        ], 404);
    }

    $user->update($request->all());

    return response()->json([
        'data' => $user
    ]);
}
public function uploadAvatar(Request $request)
{
    $request->validate([
        'imagen_perfil' => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
    ]);

    $user = $request->user();

    // delete old
    if ($user->imagen_perfil) {
        Storage::disk('public')->delete($user->imagen_perfil);
    }

    $file = $request->file('imagen_perfil');

    $filename = 'avatar.' . $file->getClientOriginalExtension();

    $path = $file->storeAs(
        "uploads/{$user->id}",
        $filename,
        'public'
    );

    $user->imagen_perfil = $path;
    $user->save();

    return response()->json([
        'success' => true,
        'url' => asset('storage/' . $path),
        'path' => $path,
    ]);
}
public function uploadBanner(Request $request)
{
    $request->validate([
        'imagen_banner' => 'required|image|mimes:jpg,jpeg,png,webp|max:5120',
    ]);

    $user = $request->user();

    if ($user->imagen_banner) {
        Storage::disk('public')->delete($user->imagen_banner);
    }

    $file = $request->file('imagen_banner');

    $filename = 'banner.' . $file->getClientOriginalExtension();

    $path = $file->storeAs(
        "uploads/{$user->id}",
        $filename,
        'public'
    );

    $user->imagen_banner = $path;
    $user->save();

    return response()->json([
        'success' => true,
        'url' => asset('storage/' . $path),
        'path' => $path,
    ]);
}

    /**
     * PUT /api/perfil/password
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (!Hash::check(
            $request->current_password,
            $user->password
        )) {
            throw ValidationException::withMessages([
                'current_password' => [
                    'La contraseña actual es incorrecta.'
                ],
            ]);
        }

        $user->password = Hash::make(
            $request->new_password
        );

        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'Contraseña actualizada correctamente.',
        ]);
    }
}