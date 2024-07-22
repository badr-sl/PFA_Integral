<?php

namespace Database\Factories;

use App\Models\TaskAssignment;
use Illuminate\Database\Eloquent\Factories\Factory;

class TaskAssignmentFactory extends Factory
{
    protected $model = TaskAssignment::class;

    public function definition()
    {
        return [
            'task_id' => \App\Models\Task::factory(),
            'user_id' => \App\Models\User::factory(),
            'assigned_at' => now(),
        ];
    }
}
