package com.example.gestiondestash;


import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import com.example.gestiondestash.models.LoginRequest;
import com.example.gestiondestash.models.LoginResponse;
import com.example.gestiondestash.models.User;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class LoginActivity extends AppCompatActivity {
    private EditText inputEmail;
    private EditText inputPassword;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);

        inputEmail = findViewById(R.id.inputEmail);
        inputPassword = findViewById(R.id.inputPassword);
        Button btnLogin = findViewById(R.id.btn);
        TextView btnSignUp = findViewById(R.id.SingUp);

        btnLogin.setOnClickListener(v -> authenticateUser());

        btnSignUp.setOnClickListener(v -> startActivity(new Intent(LoginActivity.this, RegisterActivity.class)));
    }

    private void authenticateUser() {
        String email = inputEmail.getText().toString().trim();
        String password = inputPassword.getText().toString().trim();

        if (email.isEmpty() || password.isEmpty()) {
            Toast.makeText(this, "Please enter email and password", Toast.LENGTH_SHORT).show();
            return;
        }

        LoginRequest loginRequest = new LoginRequest(email, password);

        ApiService apiService = RetrofitClient.getRetrofitInstance().create(ApiService.class);
        Call<LoginResponse> call = apiService.login(loginRequest);

        call.enqueue(new Callback<LoginResponse>() {

            @Override
            public void onResponse(Call<LoginResponse> call, Response<LoginResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    LoginResponse loginResponse = response.body();


                    if (loginResponse.getMessage() != null) {
                        Toast.makeText(LoginActivity.this, loginResponse.getMessage(), Toast.LENGTH_SHORT).show();
                    } else {

                        Toast.makeText(LoginActivity.this, loginResponse.getMessage(), Toast.LENGTH_SHORT).show();
                    }

                    saveUserInfo(loginResponse.getUser(), loginResponse.getToken());

                    Intent intent = new Intent(LoginActivity.this, MainActivity.class);
                    startActivity(intent);
                    finish();
                } else {
                    try {
                        // Si la réponse n'est pas réussie, essayez de lire le corps d'erreur de la réponse
                        String errorBodyString = response.errorBody().string();
                        JSONObject errorJson = new JSONObject(errorBodyString);
                        String errorMessage = errorJson.getString("message");

                        Toast.makeText(LoginActivity.this, errorMessage, Toast.LENGTH_LONG).show();
                    } catch (IOException | JSONException e) {
                        // En cas d'erreur lors de la lecture du corps de l'erreur
                        e.printStackTrace();
                        Toast.makeText(LoginActivity.this, "Registration failed: " + response.message(), Toast.LENGTH_SHORT).show();
                    }
                }
            }

            private void saveUserInfo(User user, String token) {
                // Log the user information to the console
                Log.d("UserInfo", "User ID: " + user.getId());
                Log.d("UserInfo", "User Name: " + user.getName());
                Log.d("UserInfo", "User Email: " + user.getEmail());
                Log.d("UserInfo", "User Phone: " + user.getPhoneNumber());
                Log.d("UserInfo", "User Role: " + user.getRole());
                Log.d("UserInfo", "Token: " + token);

                // Save the user information to SharedPreferences
                SharedPreferences sharedPreferences = getSharedPreferences("MyPrefs", MODE_PRIVATE);
                SharedPreferences.Editor editor = sharedPreferences.edit();
                editor.putInt("user_id", user.getId());
                editor.putString("user_name", user.getName());
                editor.putString("user_email", user.getEmail());
                editor.putString("user_phone", user.getPhoneNumber());
                editor.putString("user_role", user.getRole());
                editor.putString("token", token);
                editor.apply();
            }

            private boolean isUserLoggedIn() {
                SharedPreferences sharedPreferences = getSharedPreferences("MyPrefs", MODE_PRIVATE);
                return sharedPreferences.contains("token");
            }

            @Override
            public void onFailure(Call<LoginResponse> call, Throwable t) {
                Toast.makeText(LoginActivity.this, "Network error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                t.printStackTrace();
            }
            private void saveToken(String token) {
                SharedPreferences sharedPreferences = getSharedPreferences("MyPrefs", MODE_PRIVATE);
                SharedPreferences.Editor editor = sharedPreferences.edit();
                editor.putString("token", token);
                editor.apply();
            }

        });
    }
}
