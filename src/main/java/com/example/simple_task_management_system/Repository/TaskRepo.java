package com.example.simple_task_management_system.Repository;

import com.example.simple_task_management_system.Entity.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TaskRepo extends JpaRepository<Task, Integer> {
    Page<Task> findByProjectId(int projectId, Pageable pageable);
}
