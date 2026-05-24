<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Productos extends Model
{
    protected $fillable = [
        'nombre',
        'info',
        'imagen',
        'precio',
        'categoria_id',
        'stock',
        'sku',
        'activo',
        'peso',
        'descuento',
        'destacado',
        'tiempo_preparacion'
    ];

    protected $casts = [
        'precio' => 'decimal:2',
        'peso' => 'decimal:2',
        'descuento' => 'decimal:2',
        'activo' => 'boolean',
        'destacado' => 'boolean',
    ];
}