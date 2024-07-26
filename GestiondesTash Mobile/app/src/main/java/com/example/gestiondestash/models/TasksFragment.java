// TasksFragment.java
package com.example.gestiondestash.models;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.gestiondestash.ApiService;
import com.example.gestiondestash.R;
import com.example.gestiondestash.RetrofitClient;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class TasksFragment extends Fragment {

    private static final String TAG = "TasksFragment";
    private RecyclerView recyclerView;
    private TaskAdapter taskAdapter;

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_tasks, container, false);

        recyclerView = view.findViewById(R.id.recycler_view);
        recyclerView.setLayoutManager(new LinearLayoutManager(getContext()));

        loadTasks();

        return view;
    }

    private void loadTasks() {
        SharedPreferences sharedPreferences = getActivity().getSharedPreferences("MyPrefs", getContext().MODE_PRIVATE);
        int userId = sharedPreferences.getInt("user_id", -1);
        String token = sharedPreferences.getString("token", "");

        if (userId == -1 || token.isEmpty()) {
            Toast.makeText(getContext(), "User not logged in", Toast.LENGTH_SHORT).show();
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
                    taskAdapter = new TaskAdapter(taskList, getContext());
                    recyclerView.setAdapter(taskAdapter);
                    Log.d(TAG, "Adapter attached to RecyclerView");
                } else {
                    Log.e(TAG, "Failed to load tasks, response code: " + response.code());
                    Toast.makeText(getContext(), "Failed to load tasks", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<TaskResponseContainer> call, Throwable t) {
                Log.e(TAG, "Network error: " + t.getMessage());
                Toast.makeText(getContext(), "Network error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }
}
