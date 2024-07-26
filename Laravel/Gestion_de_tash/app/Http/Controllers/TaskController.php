<?php

namespace App\Http\Controllers;

use App\Models\Task;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Resources\TaskResource;

class TaskController extends Controller
{
    /**
     * Affiche une liste des ressources.
     */
    public function index()
    {
        $tasks = Task::orderBy('created_at', 'desc')->get();
        return TaskResource::collection($tasks);
    }


    /**
     * Stocke une ressource nouvellement créée dans le stockage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:todo,in-progress,completed',
            'priority' => 'nullable|integer|min:1|max:5',
            'due_date' => 'nullable|date',
            'progress' => 'nullable|integer|min:0|max:100',
        ]);

        $task = Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status,
            'priority' => $request->priority,
            'due_date' => $request->due_date,
            'progress' => $request->progress ?? 0,

        ]);

        return new TaskResource($task);
    }

    /**
     * Affiche la ressource spécifiée.
     */
    public function show($id)
    {
        $task = Task::find($id);

        return response()->json(new TaskResource($task), 200);
    }

    /**
     * Met à jour la ressource spécifiée dans le stockage.
     */
    public function update(Request $request,  $id)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:todo,in-progress,completed',
            'priority' => 'nullable|integer|min:1|max:5',
            'due_date' => 'nullable|date',
            'progress' => 'nullable|integer|min:0|max:100',
        ]);

        $assignment = Task::findOrFail($id);


        $assignment ->update([
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status,
            'priority' => $request->priority,
            'due_date' => $request->due_date,
            'progress' => $request->progress?? 0,
        ]);

        return new TaskResource($assignment );
    }

    /**
     * Supprime la ressource spécifiée du stockage.
     */
    public function destroy( $id)
    {
        $assignment = Task::findOrFail($id);
        $assignment->delete();


        return response()->json(['message' => 'Task deleted'], 200);
    }

    /**
     * Affiche les tâches d'un utilisateur spécifique.
     */
    public function getUserTasks($userId)
{
    $user = User::with('assignedTasks.task')->findOrFail($userId);

    $tasks = $user->assignedTasks->pluck('task');

    $sortedTasks = $tasks->sortByDesc('priority');

    return TaskResource::collection($sortedTasks);
}

}
