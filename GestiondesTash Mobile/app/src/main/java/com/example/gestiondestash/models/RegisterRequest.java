package com.example.gestiondestash.models;

public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String phoneNumber;

    // Constructeurs
    public RegisterRequest(String name, String email, String password, String PhoneNumber) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.phoneNumber = PhoneNumber;
    }
    @Override
    public String toString() {
        return "RegisterRequest{" +
                "name='" + name + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", PhoneNumber='" + phoneNumber + '\'' +
                '}';
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }


}

