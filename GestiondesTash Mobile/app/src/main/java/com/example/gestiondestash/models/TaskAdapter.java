package com.example.gestiondestash.models;

import android.app.AlertDialog;
import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.EditText;
import android.widget.SeekBar;
import android.widget.Spinner;
import android.widget.TableRow;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.example.gestiondestash.ApiService;
import com.example.gestiondestash.R;
import com.example.gestiondestash.RetrofitClient;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class TaskAdapter extends RecyclerView.Adapter<TaskAdapter.TaskViewHolder> {

    private List<TaskResponse> taskList;
    private Context context;
    private int expandedPosition = -1; // Position of the currently expanded card
    private static final String TAG = "TaskAdapter";

    public TaskAdapter(List<TaskResponse> taskList, Context context) {
        this.taskList = taskList;
        this.context = context;
    }

    @NonNull
    @Override
    public TaskViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.item_task, parent, false);
        return new TaskViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull TaskViewHolder holder, int position) {
        TaskResponse task = taskList.get(position);
        holder.title.setText(task.getTitle());
        holder.status.setText(task.getStatus());
        holder.description.setText(task.getDescription());
        holder.priority.setText(String.valueOf(task.getPriority()));
        holder.dueDate.setText(task.getDueDate());
        holder.progress.setText(String.valueOf(task.getProgress()) + "%");

        // Set color based on status
        switch (task.getStatus()) {
            case "todo":
                holder.status.setTextColor(ContextCompat.getColor(holder.itemView.getContext(), R.color.colorToDo));
                break;
            case "in-progress":
                holder.status.setTextColor(ContextCompat.getColor(holder.itemView.getContext(), R.color.colorInProgress));
                break;
            case "completed":
                holder.status.setTextColor(ContextCompat.getColor(holder.itemView.getContext(), R.color.colorCompleted));
                break;
        }

        // Expand/Collapse button click listener
        holder.expandCollapseButton.setOnClickListener(v -> {
            if (expandedPosition == holder.getAdapterPosition()) {
                // Collapse the currently expanded card
                expandedPosition = -1;
                notifyItemChanged(holder.getAdapterPosition());
            } else {
                // Expand the clicked card and collapse the previously expanded card
                int previousExpandedPosition = expandedPosition;
                expandedPosition = holder.getAdapterPosition();
                notifyItemChanged(previousExpandedPosition);
                notifyItemChanged(expandedPosition);
            }
        });

        // Show or hide additional information based on the expanded position
        if (expandedPosition == position) {
            holder.descriptionRow.setVisibility(View.VISIBLE);
            holder.priorityRow.setVisibility(View.VISIBLE);
            holder.dueDateRow.setVisibility(View.VISIBLE);
            holder.progressRow.setVisibility(View.VISIBLE);
            holder.expandCollapseButton.setVisibility(View.GONE); // Hide the button after expanding
            holder.editButton.setVisibility(View.VISIBLE); // Show the edit button after expanding
        } else {
            holder.descriptionRow.setVisibility(View.GONE);
            holder.priorityRow.setVisibility(View.GONE);
            holder.dueDateRow.setVisibility(View.GONE);
            holder.progressRow.setVisibility(View.GONE);
            holder.expandCollapseButton.setVisibility(View.VISIBLE); // Show the button if not expanded
            holder.editButton.setVisibility(View.GONE); // Hide the edit button if not expanded
        }

        // Edit button click listener
        holder.editButton.setOnClickListener(v -> showEditDialog(holder.itemView.getContext(), task));
    }

    @Override
    public int getItemCount() {
        return taskList.size();
    }

    private void showEditDialog(Context context, TaskResponse task) {
        AlertDialog.Builder builder = new AlertDialog.Builder(context);
        View dialogView = LayoutInflater.from(context).inflate(R.layout.dialog_edit_task, null);
        builder.setView(dialogView);

        EditText titleEditText = dialogView.findViewById(R.id.edit_task_title);
        EditText descriptionEditText = dialogView.findViewById(R.id.edit_task_description);
        Spinner statusSpinner = dialogView.findViewById(R.id.edit_task_status);
        TextView progressValueTextView = dialogView.findViewById(R.id.edit_task_progress_value);
        SeekBar progressSeekBar = dialogView.findViewById(R.id.edit_task_progress);
        Button saveButton = dialogView.findViewById(R.id.button_save_task);

        titleEditText.setText(task.getTitle());
        descriptionEditText.setText(task.getDescription());

        // Set up spinner
        ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(context,
                R.array.task_status_array, android.R.layout.simple_spinner_item);
        adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
        statusSpinner.setAdapter(adapter);
        statusSpinner.setSelection(getStatusPosition(task.getStatus()));


        progressSeekBar.setProgress(task.getProgress());
        progressValueTextView.setText(task.getProgress() + "%");

        // Update the TextView as the SeekBar value changes
        progressSeekBar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                progressValueTextView.setText(progress + "%");
            }

            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {

            }

            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {

            }
        });

        AlertDialog dialog = builder.create();

        saveButton.setOnClickListener(v -> {
            String newTitle = titleEditText.getText().toString();
            String newDescription = descriptionEditText.getText().toString();
            String newStatus = statusSpinner.getSelectedItem().toString();
            int newProgress = progressSeekBar.getProgress();

            // Update task object
            task.setTitle(newTitle);
            task.setDescription(newDescription);
            task.setStatus(newStatus);
            task.setProgress(newProgress);

            updateTask(task, dialog);
        });

        dialog.show();
    }

    private int getStatusPosition(String status) {
        switch (status) {
            case "todo":
                return 0;
            case "in-progress":
                return 1;
            case "completed":
                return 2;
            default:
                return 0;
        }
    }

    private void updateTask(TaskResponse task, AlertDialog dialog) {
        SharedPreferences sharedPreferences = context.getSharedPreferences("MyPrefs", Context.MODE_PRIVATE);
        String token = sharedPreferences.getString("token", "");

        ApiService apiService = RetrofitClient.getRetrofitInstance().create(ApiService.class);
        Call<TaskResponse> call = apiService.updateTask(task.getId(), task, "Bearer " + token);

        call.enqueue(new Callback<TaskResponse>() {
            @Override
            public void onResponse(Call<TaskResponse> call, Response<TaskResponse> response) {
                if (response.isSuccessful()) {
                    notifyDataSetChanged();
                    Toast.makeText(context, "Task updated successfully", Toast.LENGTH_SHORT).show();
                    dialog.dismiss();
                } else {
                    Toast.makeText(context, "Failed to update task", Toast.LENGTH_SHORT).show();
                    Log.e(TAG, "API Error: " + response.code() + " - " + response.message());
                    try {
                        Log.e(TAG, "API Error Body: " + response.errorBody().string());
                    } catch (Exception e) {
                        Log.e(TAG, "Error reading error body", e);
                    }
                }
            }

            @Override
            public void onFailure(Call<TaskResponse> call, Throwable t) {
                Toast.makeText(context, "Network error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                Log.e(TAG, "Network Error: ", t);
            }
        });
    }

    public static class TaskViewHolder extends RecyclerView.ViewHolder {
        TextView title, status, description, priority, dueDate, progress;
        TableRow descriptionRow, priorityRow, dueDateRow, progressRow;
        Button expandCollapseButton, editButton;

        public TaskViewHolder(@NonNull View itemView) {
            super(itemView);
            title = itemView.findViewById(R.id.task_title);
            status = itemView.findViewById(R.id.task_status);
            description = itemView.findViewById(R.id.task_description);
            priority = itemView.findViewById(R.id.task_priority);
            dueDate = itemView.findViewById(R.id.task_due_date);
            progress = itemView.findViewById(R.id.task_progress);
            descriptionRow = itemView.findViewById(R.id.row_task_description);
            priorityRow = itemView.findViewById(R.id.row_task_priority);
            dueDateRow = itemView.findViewById(R.id.row_task_due_date);
            progressRow = itemView.findViewById(R.id.row_task_progress);
            expandCollapseButton = itemView.findViewById(R.id.button_expand_collapse);
            editButton = itemView.findViewById(R.id.button_edit_task);
        }
    }
}
