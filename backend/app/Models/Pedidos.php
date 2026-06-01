<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pedidos extends Model
{
    protected $fillable = [
        'user_id',
        'productos',
        'unidades',
        'estado',
        'total',
        'direccion_local',
        'direccion',
        'hora_pedido',
        'tiempo_preparacion',
        'notas',
        'tipo_pago',
        'datos_pago'
    ];

    protected $casts = [
        'productos' => 'array',
        'unidades' => 'array',
        'datos_pago' => 'array',
        'hora_pedido' => 'datetime',
    ];
}