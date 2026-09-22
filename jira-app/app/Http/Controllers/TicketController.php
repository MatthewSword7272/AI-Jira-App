<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use App\Services\TicketParser;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Ticket::all();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string|max:500',
            'severity' => 'required|string|in:high,medium,low',
            // 'status' => 'required|string',
            'due_date' => 'required|date'
        ]);

        Ticket::create([...$validated, 'status' => 'Backlog']);

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(Ticket $ticket)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Ticket $ticket)
    {
        $validated = $request->validate([
            'status' => 'required|string',
        ]);

        $ticket->update($validated);

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Ticket $ticket)
    {
        //
    }

    public function storeFromAI(Request $request, TicketParser $ticketParser)
    {
        $request->validate(['message' => 'required|string|max:2000']);

        try {
            $data = $ticketParser->parse($request->input('message'));
        } catch (\Throwable $e) {
            report($e);
            return back()->withErrors(['message' => 'Could not create a ticket from that. Try rephrasing.']);
        }

        $validated = validator($data, [
            'title' => 'required|string|max:500',
            'description' => 'required|string|max:500',
            'severity' => 'required|string|in:high,medium,low',
            'due_date' => 'required|date',
        ])->validate();

        Ticket::create([...$validated, 'status' => 'Backlog']);

        return back();
    }
}
