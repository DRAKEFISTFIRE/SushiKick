<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ProductoController;
use App\Http\Controllers\CategoriaController;


// usuario
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::post('/logout', [UserController::class, 'logout']);
Route::get('/user', [UserController::class, 'user']);


//productos
Route::apiResource('/productos', ProductoController::class);


//categorias
Route::get('/categorias', [CategoriaController::class, 'index']);