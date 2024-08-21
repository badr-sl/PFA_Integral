package com.example.gestiondestash.models;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import com.bumptech.glide.Glide;
import com.example.gestiondestash.ApiService;
import com.example.gestiondestash.R;
import com.example.gestiondestash.RetrofitClient;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;

public class ProfileFragment extends Fragment {

    private ImageView profileImage;
    private TextView profileName;
    private TextView profileEmail;
    private TextView profilePhone;
    private Button buttonEditProfile;
    private ImageView backIcon;
    private ApiService apiService;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        return inflater.inflate(R.layout.fragment_profile, container, false);
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

        profileImage = view.findViewById(R.id.profile_image);
        profileName = view.findViewById(R.id.profile_name);
        profileEmail = view.findViewById(R.id.profile_email);
        profilePhone = view.findViewById(R.id.profile_phone);
        buttonEditProfile = view.findViewById(R.id.button_edit_profile);
        backIcon = view.findViewById(R.id.back_icon);

        // Initialisation de Retrofit
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("http://10.0.2.2:8000/api/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        apiService = retrofit.create(ApiService.class);

        buttonEditProfile.setOnClickListener(v -> {
            if (getActivity() != null) {
                getActivity().getSupportFragmentManager().beginTransaction()
                        .addToBackStack(null)
                        .commit();
            }
        });

        backIcon.setOnClickListener(v -> {
            if (getActivity() != null) {
                TasksFragment tasksFragment = new TasksFragment();
                getActivity().getSupportFragmentManager().beginTransaction()
                        .replace(R.id.fragment_container, tasksFragment)
                        .addToBackStack(null)
                        .commit();
            }
        });
    }

    @Override
    public void onResume() {
        super.onResume();

        loadUserProfile();
    }

    private void loadUserProfile() {
        SharedPreferences sharedPreferences = getActivity().getSharedPreferences("MyPrefs", getContext().MODE_PRIVATE);
        int userId = sharedPreferences.getInt("user_id", -1);
        String token = sharedPreferences.getString("token", "");

        Log.d("ProfileFragment", "User ID from SharedPreferences: " + userId);
        Log.d("ProfileFragment", "Token from SharedPreferences: " + token);

        if (userId == -1 || token.isEmpty()) {
            Toast.makeText(getContext(), "User not logged in", Toast.LENGTH_SHORT).show();
            return;
        }



        Call<UserProfile> call = apiService.getUserProfile(userId, "Bearer " + token);
        call.enqueue(new Callback<UserProfile>() {
            @Override
            public void onResponse(@NonNull Call<UserProfile> call, @NonNull Response<UserProfile> response) {
                Log.d("ProfileFragment", "API response received with code: " + response.code());

                if (response.isSuccessful() && response.body() != null) {
                    UserProfile userProfile = response.body();
                    Log.d("ProfileFragment", "User profile retrieved: " + userProfile.toString());

                    profileName.setText(userProfile.getName());
                    profileEmail.setText(userProfile.getEmail());
                    profilePhone.setText(userProfile.getPhoneNumber());

                    // Remplacez par une vraie URL si disponible
                    String profileImageUrl = "http://example.com/path/to/image.jpg";
                    Glide.with(ProfileFragment.this)
                            .load(profileImageUrl)
                            .placeholder(R.drawable.ic_profile_placeholder)
                            .into(profileImage);

                } else {
                    Log.d("ProfileFragment", "Response body is null or request not successful");
                    Toast.makeText(getContext(), "Failed to load user profile", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(@NonNull Call<UserProfile> call, @NonNull Throwable t) {
                Log.d("ProfileFragment", "API call failed: " + t.getMessage());
                Toast.makeText(getContext(), "Network error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

}
