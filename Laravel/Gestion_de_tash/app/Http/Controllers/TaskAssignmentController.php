<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\TaskAssignment;
use App\Http\Controllers\Controller;
use App\Http\Resources\TaskResource;

class TaskAssignmentController extends Controller
{
    /**
     * Affiche toutes les affectations de tâches.
     */
    public function index()
    {
        $assignments = TaskAssignment::all();
        return response()->json($assignments, 200);
    }

    /**
     * Affiche les tâches assignées à un utilisateur spécifique.
     */
    public function getUserTasks($userId)
    {
        $user = User::with('assignedTasks.task')->findOrFail($userId);

        $tasks = $user->assignedTasks->pluck('task')->sortByDesc('priority');

        return TaskResource::collection($tasks);
    }


    /**
     * Assigne une tâche à un utilisateur.
     */
    public function store(Request $request)
    {
        $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'user_id' => 'required|exists:users,id',
        ]);

        $assignment = TaskAssignment::create([
            'task_id' => $request->task_id,
            'user_id' => $request->user_id,
            'assigned_at' => now(),
        ]);

        return response()->json($assignment, 201);
    }

    /**
     * Affiche une affectation spécifique.
     */
    public function show($id)
    {
        $assignment = TaskAssignment::findOrFail($id);
        return response()->json($assignment, 200);
    }

    /**
     * Met à jour une affectation spécifique.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'task_id' => 'required|exists:tasks,id',
            'user_id' => 'required|exists:users,id',
        ]);

        $assignment = TaskAssignment::findOrFail($id);
        $assignment->update([
            'task_id' => $request->task_id,
            'user_id' => $request->user_id,
            'assigned_at' => now(),
        ]);

        return response()->json($assignment, 200);
    }

    /**
     * Supprime une affectation spécifique.
     */
    public function destroy($id)
    {
        $assignment = TaskAssignment::findOrFail($id);
        $assignment->delete();

        return response()->json(['message' => 'Task assignment deleted'], 200);
    }
}
