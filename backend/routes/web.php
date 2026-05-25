<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'register']);

// protegidas
Route::middleware('auth:sanctum')->group(function () {

    Route::get('/user', [UserController::class, 'user']);

    Route::post('/logout', [UserController::class, 'logout']);
});