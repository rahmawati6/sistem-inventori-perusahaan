<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\ItemController;
use App\Http\Controllers\Api\StockInController;
use App\Http\Controllers\Api\StockOutController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\ReportController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public routes
Route::post('/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);

    // CRUD Resources
    Route::apiResource('/items', ItemController::class);
    Route::apiResource('/stock-ins', StockInController::class);
    Route::apiResource('/stock-outs', StockOutController::class);
    Route::apiResource('/users', UserController::class);

    // Reports
    Route::get('/reports/items', [ReportController::class, 'items']);
    Route::get('/reports/stock-ins', [ReportController::class, 'stockIns']);
    Route::get('/reports/stock-outs', [ReportController::class, 'stockOuts']);
});
