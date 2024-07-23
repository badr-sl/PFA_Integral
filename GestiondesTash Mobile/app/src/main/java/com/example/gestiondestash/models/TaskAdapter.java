package com.example.gestiondestash.models;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.core.content.ContextCompat;
import androidx.recyclerview.widget.RecyclerView;

import com.example.gestiondestash.R;
import com.example.gestiondestash.models.TaskResponse;

import java.util.List;

public class TaskAdapter extends RecyclerView.Adapter<TaskAdapter.TaskViewHolder> {

    private List<TaskResponse> taskList;

    public TaskAdapter(List<TaskResponse> taskList) {
        this.taskList = taskList;
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
        holder.description.setText(task.getDescription());
        holder.status.setText(task.getStatus());
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
    }

    @Override
    public int getItemCount() {
        return taskList.size();
    }

    public static class TaskViewHolder extends RecyclerView.ViewHolder {
        TextView title, description, status, priority, dueDate, progress;

        public TaskViewHolder(@NonNull View itemView) {
            super(itemView);
            title = itemView.findViewById(R.id.task_title);
            description = itemView.findViewById(R.id.task_description);
            status = itemView.findViewById(R.id.task_status);
            priority = itemView.findViewById(R.id.task_priority);
            dueDate = itemView.findViewById(R.id.task_due_date);
            progress = itemView.findViewById(R.id.task_progress);
        }
    }
}
