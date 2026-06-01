<?php

namespace App\Http\Controllers;

use App\Models\Pedidos;
use App\Models\Productos;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PedidoController extends Controller
{
    public function checkout(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'No autenticado'
            ], 401);
        }

        return response()->json([
            'usuario' => [
                'id' => $user->id,
                'nombre' => $user->nombre,
                'email' => $user->email,
                'telefono' => $user->telefono,
                'direccion' => $user->direccion,
                'imagen_perfil' => $user->imagen_perfil,
                'fecha_nacimiento' => $user->fecha_nacimiento,
            ],

            'metodos_pago' => collect($user->metodos_pago ?? [])->map(function ($pm) {

                $detalles = $pm['detalles'] ?? [];
                $numero = $detalles['numero'] ?? null;

                return [
                    'tipo' => $pm['tipo'] ?? 'tarjeta',
                    'detalles' => [
                        'titular' => $detalles['titular'] ?? '',
                        'ultimos4' => $detalles['ultimos4']
                            ?? ($numero ? substr(preg_replace('/\D/', '', $numero), -4) : null),
                        'caducidad' => $detalles['caducidad']
                            ?? ($detalles['exp'] ?? ''),
                    ],
                ];
            })->values(),

            'local' => [
                'nombre' => 'Sushi Restaurant',
                'direccion' => 'Carrer del Drac Roig 27, El Raval',
            ],
        ]);
    }

    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'message' => 'No autenticado'
            ], 401);
        }

        $validated = $request->validate([
            'productos'       => ['required', 'array', 'min:1'],
            'productos.*'     => ['integer', 'exists:productos,id'],

            'unidades'        => ['required', 'array'],

            'direccion'       => ['required', 'string'],
            'direccion_local' => ['nullable', 'string'],

            'tipo_pago'       => ['required', 'in:efectivo,tarjeta,paypal,bizum'],
            'datos_pago'      => ['nullable', 'array'],

            'notas'           => ['nullable', 'string'],

            'hora_pedido'     => ['required', 'date_format:H:i'],
        ]);

        $productos = Productos::whereIn(
            'id',
            $validated['productos']
        )->get();

        if ($productos->isEmpty()) {
            return response()->json([
                'message' => 'No se encontraron productos'
            ], 404);
        }

        $total = 0;
        $cantidadTotal = 0;
        $tiempoPreparacion = 0;

        foreach ($productos as $producto) {

            $cantidad = max(
                1,
                (int) ($validated['unidades'][$producto->id] ?? 1)
            );

            $subtotal = $producto->precio * $cantidad;

            $total += $subtotal;
            $cantidadTotal += $cantidad;

            $tiempoPreparacion +=
                ($producto->tiempo_preparacion ?? 5) * $cantidad;
        }

        if ($cantidadTotal >= 10) {
            $tiempoPreparacion += 10;
        }

        if ($cantidadTotal >= 20) {
            $tiempoPreparacion += 20;
        }

        $tiempoPreparacion = max(10, $tiempoPreparacion);

        $horaPedido = Carbon::today()
            ->setTimeFromTimeString($validated['hora_pedido']);

        $horaEstimada = $horaPedido
            ->copy()
            ->addMinutes($tiempoPreparacion);

        try {

            DB::beginTransaction();

            $pedido = Pedidos::create([
                'user_id' => $user->id,

                'productos' => $validated['productos'],
                'unidades' => $validated['unidades'],

                'direccion' => $validated['direccion'],
                'direccion_local' => $validated['direccion_local'],

                'tipo_pago' => $validated['tipo_pago'],
                'datos_pago' => $validated['datos_pago'],

                'notas' => $validated['notas'],

                'total' => round($total, 2),
                'estado' => 'pendiente',

                'tiempo_preparacion' => $tiempoPreparacion,

                'hora_pedido' => $horaPedido,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Pedido creado correctamente',
                'pedido' => [
                    'id' => $pedido->id,
                    'estado' => $pedido->estado,
                    'total' => $pedido->total,
                    'productos' => $cantidadTotal,
                    'tiempo_preparacion' => $tiempoPreparacion,
                    'hora_pedido' => $horaPedido->format('H:i'),
                    'hora_estimada' => $horaEstimada->format('H:i'),
                ]
            ], 201);

        } catch (\Throwable $e) {

            DB::rollBack();

            report($e);

            return response()->json([
                'message' => 'Error creando pedido',
                'error' => config('app.debug')
                    ? $e->getMessage()
                    : 'Error interno del servidor',
            ], 500);
        }
    }

    public function show($id)
    {
        return Pedidos::with('user')->findOrFail($id);
    }

    public function index(Request $request)
    {
        return Pedidos::where('user_id', $request->user()->id)
            ->latest()
            ->get();
    }
}