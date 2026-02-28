<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

// Routes publiques
Route::prefix('auth')->group(function () {
    Route::post('register/client',  [AuthController::class, 'registerClient']);
    Route::post('register/artisan', [AuthController::class, 'registerArtisan']);
    Route::post('login',            [AuthController::class, 'login']);
});


