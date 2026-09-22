<?php

namespace App\Http\Controllers;

use App\Models\Severity;
use App\Models\Status;
use App\Models\Ticket;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class WelcomeController extends Controller
{

    public function welcome()
    {
        $status = Status::all()->pluck('name');
        $tickets = Ticket::all()->groupBy('status');
        $severities = Severity::all()->pluck('name');

        // $user = Auth::user();

        // $tickets->where('created_by', $user->name)->groupBy('status');

        return Inertia::render('welcome', [
            'tickets' => $status->mapWithKeys(
                fn($s) => [$s => $tickets->get($s, collect())]
            ),
            'statuses' => $status,
            'severities' => $severities
        ]);
    }
}
