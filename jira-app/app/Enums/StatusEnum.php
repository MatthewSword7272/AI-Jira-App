<?php

namespace App\Enums;

enum StatusEnum: string
{
    public const Backlog = "Backlog";
    public const Pending = "Pending";
    public const InProgress = "In Progress";
    public const QA = "QA";
    public const Completed = "Completed";
}
