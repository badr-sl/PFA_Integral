package com.example.gestiondestash;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.ImageView;
import android.widget.PopupMenu;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.gestiondestash.models.TaskAdapter;
import com.example.gestiondestash.models.TaskResponse;
import com.example.gestiondestash.models.TaskResponseContainer;
import com.google.android.material.navigation.NavigationView;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MainActivity extends AppCompatActivity implements NavigationView.OnNavigationItemSelectedListener {

    private static final String TAG = "MainActivity";
    private DrawerLayout drawerLayout;
    private RecyclerView recyclerView;
    private TaskAdapter taskAdapter;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Toolbar toolbar = findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        ImageView iconProfile = findViewById(R.id.icon_profile);
        iconProfile.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showProfileMenu(v);
            }
        });

        drawerLayout = findViewById(R.id.drawer_layout);
        NavigationView navigationView = findViewById(R.id.nav_view);
        navigationView.setNavigationItemSelectedListener(this);

        recyclerView = findViewById(R.id.recycler_view);
        recyclerView.setLayoutManager(new LinearLayoutManager(this));

        Log.d(TAG, "RecyclerView and LayoutManager initialized");

        loadTasks();
    }

    private void showProfileMenu(View v) {
        PopupMenu popupMenu = new PopupMenu(this, v);
        popupMenu.getMenuInflater().inflate(R.menu.menu_profile, popupMenu.getMenu());
        popupMenu.setOnMenuItemClickListener(new PopupMenu.OnMenuItemClickListener() {
            @Override
            public boolean onMenuItemClick(MenuItem item) {
                int itemId = item.getItemId();
                if (itemId == R.id.nav_profile_details) {
                    Toast.makeText(MainActivity.this, "Profile Details clicked", Toast.LENGTH_SHORT).show();
                    return true;
                } else if (itemId == R.id.nav_logout) {
                    logout();
                    return true;
                } else {
                    return false;
                }
            }
        });
        popupMenu.show();
    }

    public void loadTasks() {
        SharedPreferences sharedPreferences = getSharedPreferences("MyPrefs", MODE_PRIVATE);
        int userId = sharedPreferences.getInt("user_id", -1);
        String token = sharedPreferences.getString("token", "");

        if (userId == -1 || token.isEmpty()) {
            Toast.makeText(this, "User not logged in", Toast.LENGTH_SHORT).show();
            return;
        }

        ApiService apiService = RetrofitClient.getRetrofitInstance().create(ApiService.class);
        Call<TaskResponseContainer> call = apiService.getUserTasksById(userId, "Bearer " + token);

        call.enqueue(new Callback<TaskResponseContainer>() {
            @Override
            public void onResponse(Call<TaskResponseContainer> call, Response<TaskResponseContainer> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<TaskResponse> taskList = response.body().getData();
                    Log.d(TAG, "Tasks loaded successfully, count: " + taskList.size());
                    taskAdapter = new TaskAdapter(taskList, MainActivity.this);
                    recyclerView.setAdapter(taskAdapter);
                    Log.d(TAG, "Adapter attached to RecyclerView");
                } else {
                    Log.e(TAG, "Failed to load tasks, response code: " + response.code());
                    Toast.makeText(MainActivity.this, "Failed to load tasks", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<TaskResponseContainer> call, Throwable t) {
                Log.e(TAG, "Network error: " + t.getMessage());
                Toast.makeText(MainActivity.this, "Network error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    @Override
    public boolean onNavigationItemSelected(@NonNull MenuItem item) {
        int id = item.getItemId();

        if (id == R.id.nav_home) {
            startActivity(new Intent(this, MainActivity.class));
        } else if (id == R.id.nav_tasks) {
            Toast.makeText(this, "Tasks clicked", Toast.LENGTH_SHORT).show();
        } else if (id == R.id.nav_profile_details) {
            Toast.makeText(this, "Profile Details clicked", Toast.LENGTH_SHORT).show();
        } else if (id == R.id.nav_logout) {
            logout();
        }

        drawerLayout.closeDrawer(GravityCompat.START);
        return true;
    }

    private void logout() {
        SharedPreferences sharedPreferences = getSharedPreferences("MyPrefs", MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();
        editor.clear();
        editor.apply();

        startActivity(new Intent(this, LoginActivity.class));
        finish();
    }

    @Override
    public void onBackPressed() {
        if (drawerLayout.isDrawerOpen(GravityCompat.START)) {
            drawerLayout.closeDrawer(GravityCompat.START);
        } else {
            super.onBackPressed();
        }
    }
}
