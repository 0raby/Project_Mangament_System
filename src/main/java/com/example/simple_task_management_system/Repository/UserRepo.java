package com.example.simple_task_management_system.Repository;

import com.example.simple_task_management_system.Entity.ApplicationUser;
import com.example.simple_task_management_system.Entity.Project;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepo extends JpaRepository<ApplicationUser, Integer> {

    Optional<ApplicationUser> findByEmail(String email);
    Page<ApplicationUser> findAll(Pageable pageable);




}
