<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\PerfilController;
use App\Http\Controllers\PedidoController;

// ─────────────────────────────
// AUTH
// ─────────────────────────────

Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);

// ─────────────────────────────
// PROTEGIDAS (SANCTUM)
// ─────────────────────────────

Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [UserController::class, 'logout']);

    // CHECKOUT
    Route::get('/checkout', [PedidoController::class, 'checkout']);

    // PEDIDOS
    Route::post('/pedidos', [PedidoController::class, 'store']);
    Route::get('/pedidos', [PedidoController::class, 'index']);
    Route::get('/pedidos/{id}', [PedidoController::class, 'show']);

    // PERFIL
    Route::get('/perfil/{id}', [PerfilController::class, 'getById']);
    Route::put('/perfil/{id}', [PerfilController::class, 'update']);
    Route::post('/perfil/avatar', [PerfilController::class, 'uploadAvatar']);
    Route::post('/perfil/banner', [PerfilController::class, 'uploadBanner']);
    Route::put('/perfil/password', [PerfilController::class, 'changePassword']);
});

// ─────────────────────────────
// PÚBLICO
// ─────────────────────────────

Route::apiResource('/productos', ProductoController::class);
Route::get('/categorias', [CategoriaController::class, 'index']);