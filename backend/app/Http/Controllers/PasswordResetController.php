<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Mail\ResetPasswordMail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class PasswordResetController extends Controller
{
    /**
     * Enviar email con enlace de recuperación
     */
    public function sendResetLink(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        // Por seguridad, no revelamos si el email existe o no
        if (!$user) {
            return response()->json([
                'message' => 'Si el email existe, recibirás un correo con instrucciones.',
            ]);
        }

        $token = Str::random(64);

        DB::table('password_reset_tokens')->where('email', $user->email)->delete();
        DB::table('password_reset_tokens')->insert([
            'email'      => $user->email,
            'token'      => Hash::make($token),
            'created_at' => now(),
        ]);

        $resetUrl = rtrim(config('app.frontend_url'), '/')
            . '/reset-password?token=' . $token
            . '&email=' . urlencode($user->email);

        Mail::to($user->email)->send(new ResetPasswordMail($resetUrl, $user->nombre));

        return response()->json([
            'message' => 'Si el email existe, recibirás un correo con instrucciones.',
        ]);
    }

    /**
     * Validar token (opcional, para comprobar antes de mostrar el form)
     */
    public function validateToken(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string',
        ]);

        $record = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$record || !Hash::check($request->token, $record->token)) {
            return response()->json(['valid' => false], 400);
        }

        if (now()->diffInMinutes($record->created_at) > 60) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json(['valid' => false, 'message' => 'El enlace ha expirado'], 400);
        }

        return response()->json(['valid' => true]);
    }

    /**
     * Cambiar la contraseña usando el token
     */
    public function reset(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'token'    => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $record = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->first();

        if (!$record || !Hash::check($request->token, $record->token)) {
            return response()->json(['message' => 'Token inválido o expirado'], 400);
        }

        if (now()->diffInMinutes($record->created_at) > 60) {
            DB::table('password_reset_tokens')->where('email', $request->email)->delete();
            return response()->json(['message' => 'El enlace ha expirado, solicita uno nuevo'], 400);
        }

        $user = User::where('email', $request->email)->firstOrFail();
        $user->password = Hash::make($request->password);
        $user->save();

        // invalidar tokens de sesión activos
        $user->tokens()->delete();

        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Contraseña actualizada correctamente']);
    }
}
