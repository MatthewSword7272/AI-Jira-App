<?php

namespace App\Services;

use Anthropic\Client;
use App\Models\Severity;
use RuntimeException;

class TicketParser
{
    public function parse(string $message): array
    {

        $client = new Client(apiKey: config('services.anthropic.key'));
        $severities = Severity::pluck('name')->all();

        $response = $client->messages->create(
            model: config('services.anthropic.model'),
            maxTokens: 1024,
            system: 'You turn a user\'s description of a problem or task into a ticket. '
                . 'Today is ' . now()->toDateString() . ' (' . now()->format('l') . '). '
                . 'Resolve relative dates like "Friday" or "next week" against today. '
                . 'If no due date is given, use one week from today. '
                . 'Keep the title under 80 characters and the description under 500.',
            messages: [['role' => 'user', 'content' => $message]],
            outputConfig: [
                'format' => [
                    'type' => 'json_schema',
                    'schema' => [
                        'type' => 'object',
                        'properties' => [
                            'title' => ['type' => 'string'],
                            'description' => ['type' => 'string'],
                            'severity' => ['type' => 'string', 'enum' => $severities],
                            'due_date' => ['type' => 'string', 'description' => 'DD-MM-YYYY'],
                        ],
                        'required' => ['title', 'description', 'severity', 'due_date'],
                        'additionalProperties' => false,
                    ]
                ]
            ]

        );

        if ($response->stopReason === 'refusal') {
            throw new RuntimeException('The AI declined to create this ticket.');
        }

        foreach ($response->content as $block) {
            if ($block->type === 'text') {
                return json_decode($block->text, true);
            }
        }

        throw new RuntimeException('No ticket returned');
    }
}
