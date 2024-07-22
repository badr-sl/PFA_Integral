<?php

namespace Database\Factories;

use App\Models\Task;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class TaskFactory extends Factory
{
    protected $model = Task::class;

    public function definition()
    {
        $status = $this->faker->randomElement(['todo', 'in-progress', 'completed']);
        $progress = $status === 'in-progress' ? $this->faker->numberBetween(0, 100) : 0;
        return [
            'title' => $this->faker->sentence,
            'description' => $this->faker->paragraph,
            'status' => $status,
            'priority' => $this->faker->numberBetween(1, 5),
            'due_date' => $this->faker->dateTimeBetween('now', '+1 year'),
            'progress' => $progress,

        ];
    }
}
