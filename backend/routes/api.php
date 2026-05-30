<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\CategoriaController;
use App\Http\Controllers\PerfilController;

// ─────────────────────────────────────
// AUTH / USER
// ─────────────────────────────────────

Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::post('/logout', [UserController::class, 'logout']);
Route::get('/user', [UserController::class, 'user']);

// ─────────────────────────────────────
// PRODUCTOS
// ─────────────────────────────────────

Route::apiResource('/productos', ProductoController::class);

// ─────────────────────────────────────
// CATEGORÍAS
// ─────────────────────────────────────

Route::get('/categorias', [CategoriaController::class, 'index']);

// ─────────────────────────────────────
// PERFIL (PROTEGIDO)
// ─────────────────────────────────────

Route::middleware('auth:sanctum')->group(function () {

    Route::get('/perfil/{id}', [PerfilController::class, 'getById']);
    Route::put('/perfil/{id}', [PerfilController::class, 'update']);

    // ✅ AVATAR
    Route::post('/perfil/avatar', [PerfilController::class, 'uploadAvatar']);

    // ✅ BANNER
    Route::post('/perfil/banner', [PerfilController::class, 'uploadBanner']);

    // PASSWORD (MEJOR SIN {id})
    Route::put('/perfil/password', [PerfilController::class, 'changePassword']);
});