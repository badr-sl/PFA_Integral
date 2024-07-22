package com.example.gestiondestash.models;

public class TaskStatusRequest {
    private String status;

    // Constructeurs
    public TaskStatusRequest(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}

