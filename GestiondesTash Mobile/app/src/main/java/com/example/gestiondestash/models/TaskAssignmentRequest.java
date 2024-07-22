package com.example.gestiondestash.models;

public class TaskAssignmentRequest {
    private int userId;
    private int taskId;

    // Constructeurs
    public TaskAssignmentRequest(int userId, int taskId) {
        this.userId = userId;
        this.taskId = taskId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getTaskId() {
        return taskId;
    }

    public void setTaskId(int taskId) {
        this.taskId = taskId;
    }
}

