package com.example.gestiondestash;

import com.example.gestiondestash.models.LoginRequest;
import com.example.gestiondestash.models.LoginResponse;
import com.example.gestiondestash.models.LogoutResponse;
import com.example.gestiondestash.models.RegisterRequest;
import com.example.gestiondestash.models.RegisterResponse;
import com.example.gestiondestash.models.TaskAssignmentRequest;
import com.example.gestiondestash.models.TaskAssignmentResponse;
import com.example.gestiondestash.models.TaskRequest;
import com.example.gestiondestash.models.TaskResponse;
import com.example.gestiondestash.models.TaskResponseContainer;
import com.example.gestiondestash.models.TaskStatusRequest;
import com.example.gestiondestash.models.User;
import com.example.gestiondestash.models.UserProfile;
import com.example.gestiondestash.models.UserResponse;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.POST;
import retrofit2.http.PUT;
import retrofit2.http.DELETE;
import retrofit2.http.Path;

public interface ApiService {
    @POST("register")
    Call<RegisterResponse> register(@Body RegisterRequest registerRequest);

    @POST("login")
    Call<LoginResponse> login(@Body LoginRequest loginRequest);

    @POST("logout")
    Call<LogoutResponse> logout();
    @GET("user/Profile/{Id}")
    Call<UserProfile> getUserProfile(@Path("Id") int userId, @Header("Authorization") String token);

    @GET("find/{id}")
    Call<UserResponse> getUserById(@Path("id") int userId);

    @GET("users")
    Call<List<UserResponse>> getAllUsers();

    @GET("tasks")
    Call<List<TaskResponse>> getAllTasks();

    @POST("tasks")
    Call<TaskResponse> createTask(@Body TaskRequest taskRequest);

    @GET("tasks/{id}")
    Call<TaskResponse> getTaskById(@Path("id") int taskId);

    @PUT("tasks/{id}")
    Call<TaskResponse> updateTask(@Path("id") int taskId, @Body TaskRequest taskRequest);

    @DELETE("tasks/{id}")
    Call<Void> deleteTask(@Path("id") int taskId);

    @GET("task-assignments")
    Call<List<TaskAssignmentResponse>> getAllTaskAssignments();

    @GET("task-assignments/{id}")
    Call<TaskAssignmentResponse> getTaskAssignmentById(@Path("id") int taskAssignmentId);

    @PUT("task-assignments/{id}")
    Call<TaskAssignmentResponse> updateTaskAssignment(@Path("id") int taskAssignmentId, @Body TaskAssignmentRequest taskAssignmentRequest);

    @DELETE("task-assignments/{id}")
    Call<Void> deleteTaskAssignment(@Path("id") int taskAssignmentId);

    @GET("user/tasks")
    Call<List<TaskResponse>> getUserTasks();
    @GET("/find/{id}")
    Call<List<User>>getUser(@Path("id") int UserId) ;

    @PUT("user/tasks/{id}")
    Call<TaskResponse> updateUserTaskStatus(@Path("id") int taskId, @Body TaskStatusRequest taskStatusRequest);

    @GET("user/{userId}/tasks")
    Call<TaskResponseContainer> getUserTasksById(@Path("userId") int userId, @Header("Authorization") String token);


    @POST("task-assignments")
    Call<TaskAssignmentResponse> createTaskAssignment(@Body TaskAssignmentRequest taskAssignmentRequest);
    @PUT("tasks/{id}")
    Call<TaskResponse> updateTask(@Path("id") int taskId, @Body TaskResponse taskResponse, @Header("Authorization") String authToken);
}

