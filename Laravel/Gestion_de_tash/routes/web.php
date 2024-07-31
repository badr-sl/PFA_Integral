<?php

use App\Models\Task;
use App\Models\User;
use App\Mail\TaskAssigned;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/


Route::get('/test-email', function (Request $request) {
    // Retrieve task_id and user_id from the request query parameters
    $task_id = $request->input('task_id');
    $user_id = $request->input('user_id');

    // Find the task and user based on the provided IDs
    $task = Task::find($task_id);
    $user = User::find($user_id);

    if (!$task || !$user) {
        return response()->json(['error' => 'Invalid task or user ID'], 400);
    }

    // Send the email
    Mail::to($user->email)->send(new TaskAssigned($task, $user));

    return response()->json(['message' => 'Email sent!'], 200);
});


