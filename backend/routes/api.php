<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\GoogleController;

Route::get('api/auth/google/callback', [GoogleController::class, 'handleGoogleCallback']);




// Route::get('auth/google', [GoogleController::class, 'redirectToGoogle']);
// web.php (or api.php based on your setup)

// Route::get('auth/google/callback', [GoogleController::class, 'handleGoogleCallback']);

// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');
