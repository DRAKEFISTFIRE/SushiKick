<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\PerfilController;
use App\Http\Controllers\PedidoController;
use App\Http\Controllers\AdminController;

// ─────────────────────────────
// AUTH
// ─────────────────────────────
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);

// ─────────────────────────────
// PROTEGIDAS (SANCTUM)
// ─────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // DASHBOARD
    Route::get('/dashboard', [AdminController::class, 'dashboard']);

    // LOGOUT
    Route::post('/logout', [UserController::class, 'logout']);

    // ───── USUARIOS (ADMIN) ─────
    Route::get('/usuarios', [AdminController::class, 'usuarios']);
    Route::get('/usuarios/{id}', [AdminController::class, 'usuario']);
    Route::post('/usuarios', [AdminController::class, 'storeUsuario']);
    Route::put('/usuarios/{id}', [AdminController::class, 'updateUsuario']);
    Route::delete('/usuarios/{id}', [AdminController::class, 'deleteUsuario']);

    // ───── PEDIDOS (USUARIO + ADMIN UNIFICADO) ─────

    // usuario
    Route::get('/pedidos', [PedidoController::class, 'index']);
    Route::post('/pedidos', [PedidoController::class, 'store']);
    Route::get('/pedidos/{id}', [PedidoController::class, 'show']);

    // admin (acciones extra)
    Route::prefix('admin')->group(function () {
        Route::get('/pedidos', [AdminController::class, 'pedidos']);
        Route::get('/pedidos/{id}', [AdminController::class, 'pedido']);

        // 👇 IMPORTANTE: aquí se centraliza update
        Route::put('/pedidos/{id}', [AdminController::class, 'updatePedido']);
    });

    // ───── PERFIL ─────
    Route::get('/perfil/{id}', [PerfilController::class, 'getById']);
    Route::put('/perfil/{id}', [PerfilController::class, 'update']);
    Route::post('/perfil/avatar', [PerfilController::class, 'uploadAvatar']);
    Route::post('/perfil/banner', [PerfilController::class, 'uploadBanner']);
    Route::put('/perfil/password', [PerfilController::class, 'changePassword']);
});

// ─────────────────────────────
// PÚBLICAS
// ─────────────────────────────
Route::apiResource('productos', ProductoController::class);
Route::get('/categorias', [CategoriaController::class, 'index']);