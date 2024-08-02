<?php

use App\Models\Task;
use App\Models\User;
use App\Mail\TaskAssigned;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\TaskAssignmentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and assigned to the "api" middleware group.
|
*/

// Routes publiques accessibles sans authentification
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/find/{id}', [UserController::class, 'show']);


// Routes nécessitant une authentification via Sanctum
Route::middleware('auth:sanctum')->group(function () {
    // Route de déconnexion
    Route::post('/logout', [AuthController::class, 'logout']);

    // Routes accessibles par l'administrateur (admin)
    Route::middleware('admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/tasks', [TaskController::class, 'index']);
        Route::post('/tasks', [TaskController::class, 'store']);
        Route::get('/tasks/{id}', [TaskController::class, 'show']);
        Route::delete('/tasks/{id}', [TaskController::class, 'destroy']);
        // ----------------------------------------------------------------
        Route::post('/user', [UserController::class, 'store']);
        Route::post('/user', [UserController::class, 'store']);
        Route::get('/task-assignments', [TaskAssignmentController::class, 'index']);
        Route::get('/task-assignments/{id}', [TaskAssignmentController::class, 'show']);
        Route::put('/task-assignments/{id}', [TaskAssignmentController::class, 'update']);
        Route::delete('/task-assignments/{id}', [TaskAssignmentController::class, 'destroy']);

    });

    // Routes accessibles par l'utilisateur (user)
    Route::middleware('user')->group(function () {
        Route::put('/user/tasks/{id}', [TaskController::class, 'updateUserTaskStatus']);
    });

    // Routes communes pour tous les utilisateurs authentifiés
    Route::get('/find/{id}', [UserController::class, 'show']);
    Route::post('/task-assignments', [TaskAssignmentController::class, 'store']);
    Route::put('/tasks/{id}', [TaskController::class, 'update']);
    Route::put('/user/{id}', [UserController::class, 'update']);
    Route::get('/user/{userId}/tasks', [TaskAssignmentController::class, 'getUserTasks']);




});
