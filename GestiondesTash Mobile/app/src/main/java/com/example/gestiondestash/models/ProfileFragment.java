package com.example.gestiondestash.models;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import com.bumptech.glide.Glide;
import com.example.gestiondestash.R;

public class ProfileFragment extends Fragment {

    private ImageView profileImage;
    private TextView profileName;
    private TextView profileEmail;
    private TextView profilePhone;
    private Button buttonEditProfile;
    private ImageView backIcon;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        // Inflate the layout for this fragment
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

        loadUserProfile();

        buttonEditProfile.setOnClickListener(v -> {
            // Handle the edit profile action
            if (getActivity() != null) {
                // Replace this fragment with the EditProfileFragment
                getActivity().getSupportFragmentManager().beginTransaction()
                        //.replace(R.id.fragment_container, new EditProfileFragment())
                        .addToBackStack(null)
                        .commit();
            }
        });

        backIcon.setOnClickListener(v -> {
            if (getActivity() != null) {
                if (getActivity().getSupportFragmentManager().getBackStackEntryCount() > 0) {
                    getActivity().getSupportFragmentManager().popBackStack();
                } else {
                    getActivity().onBackPressed();
                }
            }
        });

    }

    private void loadUserProfile() {
        SharedPreferences sharedPreferences = getActivity().getSharedPreferences("MyPrefs", getContext().MODE_PRIVATE);

        String name = sharedPreferences.getString("user_name", "Unknown");
        String email = sharedPreferences.getString("user_email", "Unknown");
        String phone = sharedPreferences.getString("user_phone", "Unknown");
        String profileImageUrl = sharedPreferences.getString("user_profile_image_url", "");

        profileName.setText(name);
        profileEmail.setText(email);
        profilePhone.setText(phone);

        if (!profileImageUrl.isEmpty()) {
            Glide.with(this)
                    .load(profileImageUrl)
                    .placeholder(R.drawable.ic_profile_placeholder)
                    .into(profileImage);
        }
    }
}
