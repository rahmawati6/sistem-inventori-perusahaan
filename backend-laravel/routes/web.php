<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/fix-password', function () {
    $user = \App\Models\User::where('username', 'admin')->first();
    if ($user) {
        $user->password = \Illuminate\Support\Facades\Hash::make('admin123');
        $user->save();
        return 'Password reset success!';
    }
    return 'User not found';
});

Route::get('/{any}', function () {
    $path = public_path('index.html');
    if (file_exists($path)) {
        return file_get_contents($path);
    }
    return view('welcome');
})->where('any', '.*');
