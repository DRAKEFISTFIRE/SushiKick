<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Pedidos;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller
{
    // ───────── USERS ─────────

    public function usuarios()
    {
        $users = User::select(
            'id',
            'nombre',
            'email',
            'rol',
            'activo',
            'created_at'
        )->get();

        // añadimos pedidos SIN withCount (manual y seguro)
        $users->map(function ($user) {
            $user->pedidos_count = Pedidos::where('user_id', $user->id)->count();
            return $user;
        });

        return response()->json($users);
    }

    public function usuario($id)
    {
        $user = User::findOrFail($id);
        $user->pedidos = Pedidos::where('user_id', $id)->get();
        return response()->json($user);
    }

    public function storeUsuario(Request $request)
    {
        $data = $request->validate([
            'nombre'             => 'required|string|max:255',
            'email'              => 'required|email|unique:users',
            'password'           => 'required|string|min:6',
            'rol'                => 'required|string',
            'telefono'           => 'nullable|string|max:20',
            'imagen_perfil'      => 'nullable|string',
            'imagen_banner'      => 'nullable|string',
            'biografia'          => 'nullable|string',
            'direccion'          => 'nullable|string|max:255',
            'fecha_nacimiento'   => 'nullable|date',
            'sueldo'             => 'nullable|numeric',
            'fecha_contratacion' => 'nullable|date',
            'cargo'              => 'nullable|string|max:255',
            'activo'             => 'nullable|boolean',
            'metodos_pago'       => 'nullable|array',
        ]);

        $data['password'] = Hash::make($data['password']);

        $user = User::create($data);

        return response()->json($user->fresh());
    }

    public function updateUsuario(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $data = $request->validate([
            'nombre'             => 'sometimes|string|max:255',
            'email'              => 'sometimes|email|max:255|unique:users,email,' . $id,
            'password'           => 'nullable|string|min:6',
            'rol'                => 'sometimes|string',
            'telefono'           => 'nullable|string|max:20',
            'imagen_perfil'      => 'nullable|string',
            'imagen_banner'      => 'nullable|string',
            'biografia'          => 'nullable|string',
            'direccion'          => 'nullable|string|max:255',
            'fecha_nacimiento'   => 'nullable|date',
            'sueldo'             => 'nullable|numeric',
            'fecha_contratacion' => 'nullable|date',
            'cargo'              => 'nullable|string|max:255',
            'activo'             => 'nullable|boolean',
            'metodos_pago'       => 'nullable|array',
        ]);

        if (!empty($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        } else {
            unset($data['password']);
        }

        $user->update($data);

        return response()->json($user->fresh());
    }

    public function deleteUsuario($id)
    {
        User::findOrFail($id)->delete();

        return response()->json(['ok' => true]);
    }

    // ───────── PEDIDOS ─────────

    public function pedidos()
    {
        $pedidos = Pedidos::with('user')->latest()->get();

        return response()->json($pedidos);
    }

    public function pedido($id)
    {
        return response()->json(
            Pedidos::with('user')->findOrFail($id)
        );
    }

    public function updatePedido(Request $request, $id)
    {
        $pedido = Pedidos::findOrFail($id);
        $pedido->update($request->all());

        return response()->json($pedido);
    }

    // ───────── DASHBOARD ─────────

    public function dashboard()
    {
        return response()->json([
            'users'    => User::count(),
            'pedidos'  => Pedidos::count(),
            'ingresos' => Pedidos::sum('total'),
        ]);
    }
}