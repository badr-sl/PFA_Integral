package com.example.gestiondestash.models;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentTransaction;

import com.example.gestiondestash.R;

public class HomeFragment extends Fragment {

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.fragment_home, container, false);

        Button btn = view.findViewById(R.id.button_view_tasks);
        btn.setOnClickListener(v -> navigateToTasksFragment());

        return view;
    }

    private void navigateToTasksFragment() {
        Fragment tasksFragment = new TasksFragment();
        FragmentTransaction transaction = getParentFragmentManager().beginTransaction();
        transaction.replace(R.id.fragment_container, tasksFragment);
        transaction.addToBackStack(null); // This adds the transaction to the back stack, so the user can navigate back
        transaction.commit();
    }
}
