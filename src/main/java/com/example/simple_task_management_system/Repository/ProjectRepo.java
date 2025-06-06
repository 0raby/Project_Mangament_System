package com.example.simple_task_management_system.Repository;

import com.example.simple_task_management_system.Entity.Project;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;



@Repository
public interface ProjectRepo extends JpaRepository<Project, Integer> {
    Page<Project> findByUserId(Integer userId, Pageable pageable);
}
