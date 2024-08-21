package com.example.gestiondestash.models;

import com.google.gson.annotations.SerializedName;

public class UserProfile {
    private int id;
    private String name;
    private String email;
    @SerializedName("PhoneNumber")
    private String phoneNumber;
    private String role;

    // Getters
    public int getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }


}
