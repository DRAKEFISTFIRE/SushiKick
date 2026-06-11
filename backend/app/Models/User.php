<?php

namespace App\Models;
use App\Models\Pedidos;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'nombre',
        'email',
        'password',
        'telefono',
        'imagen_perfil',
        'imagen_banner',
        'biografia',
        'direccion',
        'fecha_nacimiento',
        'rol',
        'activo',
        'metodos_pago',
        'sueldo',
        'cargo',
        'fecha_contratacion',
        'horas_semanales',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'activo' => 'boolean',
        'metodos_pago' => 'array',
        'fecha_nacimiento' => 'date',
        'fecha_contratacion' => 'date',
    ];


public function pedidos()
{
    return $this->hasMany(Pedidos::class, 'user_id');
}
}