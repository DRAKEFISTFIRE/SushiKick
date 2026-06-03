<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resena extends Model
{
    protected $fillable = [
        'user_id',
        'tipo',
        'product_id',
        'order_id',
        'puntuacion',
        'comentario',
        'titulo',
        'imagenes',
    ];

    protected $casts = [
        'imagenes' => 'array',
        'puntuacion' => 'integer',
    ];
}