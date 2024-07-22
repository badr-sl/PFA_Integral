package com.example.gestiondestash;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.example.gestiondestash.models.LoginResponse;
import com.example.gestiondestash.models.RegisterRequest;
import com.example.gestiondestash.models.RegisterResponse;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class RegisterActivity extends AppCompatActivity {

    private EditText inputName, inputEmail, inputPassword, inputPhoneNumber;
    private Button btnRegister;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register);

        inputName = findViewById(R.id.inputUsername);
        inputEmail = findViewById(R.id.inputEmail);
        inputPassword = findViewById(R.id.inputPassword);
        inputPhoneNumber = findViewById(R.id.inputTel);
        btnRegister = findViewById(R.id.btnRegister);
        TextView btnAlreadyHaveAccount = findViewById(R.id.alreadyHaveAccount);
        btnAlreadyHaveAccount.setOnClickListener(v -> startActivity(new Intent(RegisterActivity.this, LoginActivity.class)));

        btnRegister.setOnClickListener(v -> {
            String name = inputName.getText().toString();
            String email = inputEmail.getText().toString();
            String password = inputPassword.getText().toString();
            String phoneNumber = inputPhoneNumber.getText().toString();

            if (!name.isEmpty() && !email.isEmpty() && !password.isEmpty() && !phoneNumber.isEmpty()) {
                RegisterRequest registerRequest = new RegisterRequest(name, email, password, phoneNumber);
                registerUser(registerRequest);
            } else {
                Toast.makeText(RegisterActivity.this, "Please fill in all fields", Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void registerUser(RegisterRequest registerRequest) {
        ApiService apiService = RetrofitClient.getRetrofitInstance().create(ApiService.class);
        Call<RegisterResponse> call = apiService.register(registerRequest);

        call.enqueue(new Callback<RegisterResponse>() {

            @Override
            public void onResponse(Call<RegisterResponse> call, Response<RegisterResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    RegisterResponse registerResponse = response.body();

                    // Vérifiez s'il y a une erreur spécifique à afficher
                    if (registerResponse.getError() != null) {
                        Toast.makeText(RegisterActivity.this, registerResponse.getError(), Toast.LENGTH_SHORT).show();
                    } else {
                        // Affichez le message de succès ou d'informations
                        Toast.makeText(RegisterActivity.this, registerResponse.getMessage(), Toast.LENGTH_SHORT).show();
                    }

                    // Redirigez vers une autre activité si nécessaire
                    Intent intent = new Intent(RegisterActivity.this, LoginActivity.class);
                    startActivity(intent);
                    finish();
                } else {
                    try {
                        // Si la réponse n'est pas réussie, essayez de lire le corps d'erreur de la réponse
                        String errorBodyString = response.errorBody().string();
                        JSONObject errorJson = new JSONObject(errorBodyString);
                        String errorMessage = errorJson.getString("error");

                        // Affichez l'erreur à l'utilisateur à l'aide de Toast
                        Toast.makeText(RegisterActivity.this, errorMessage, Toast.LENGTH_LONG).show();
                    } catch (IOException | JSONException e) {
                        // En cas d'erreur lors de la lecture du corps de l'erreur
                        e.printStackTrace();
                        Toast.makeText(RegisterActivity.this, "Registration failed: " + response.message(), Toast.LENGTH_SHORT).show();
                    }
                }
            }






            @Override
            public void onFailure(Call<RegisterResponse> call, Throwable t) {
                Toast.makeText(RegisterActivity.this, t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }


}
