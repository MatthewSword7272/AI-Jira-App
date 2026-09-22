<?php

use App\Http\Controllers\TicketController;
use App\Http\Controllers\WelcomeController;
use App\Models\Severity;
use Illuminate\Support\Facades\Route;

Route::get('/', [WelcomeController::class, 'welcome'])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
});

Route::controller(TicketController::class)->group(function () {
    Route::post('/ticket', 'store')->name('ticket.store');
    Route::patch('/ticket/{ticket}', 'update')->name('ticket.update');
    Route::post('/ticket/ai', [TicketController::class, 'storeFromAi'])
        ->name('ticket.ai');
});

require __DIR__ . '/settings.php';
