<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use App\Mail\TaskAssigned;
use Illuminate\Http\Request;
use App\Models\TaskAssignment;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use App\Http\Resources\TaskResource;
use Illuminate\Support\Facades\Mail;

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

    try {
        // Créer l'assignation de la tâche
        $assignment = TaskAssignment::create([
            'task_id' => $request->task_id,
            'user_id' => $request->user_id,
            'assigned_at' => now(),
        ]);

        // Récupérer l'utilisateur et la tâche
        $user = User::find($request->user_id);
        $task = Task::find($request->task_id);

        // Envoyer l'email d'assignation
        Mail::to($user->email)->send(new TaskAssigned($task, $user));

        // Retourner une réponse JSON avec un message de succès
        return response()->json([
            'message' => 'Task assigned successfully and email sent.',
            'assignment' => $assignment,
        ], 201);
    } catch (\Exception $e) {
        // Retourner une réponse JSON en cas d'erreur
        return response()->json([
            'message' => 'Failed to send email',
            'error' => $e->getMessage(),
        ], 500);
    }
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
