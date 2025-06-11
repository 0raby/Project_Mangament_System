package com.example.simple_task_management_system.Service;

import com.example.simple_task_management_system.DTO.Create.TaskCreateDTO;
import com.example.simple_task_management_system.DTO.TaskInfoDTO;
import com.example.simple_task_management_system.DTO.Update.TaskUpdateDTO;
import com.example.simple_task_management_system.Entity.ApplicationUser;
import com.example.simple_task_management_system.Entity.Project;
import com.example.simple_task_management_system.Entity.Task;
import com.example.simple_task_management_system.Exception.CustomException;
import com.example.simple_task_management_system.Mapper.ProjectMapper;
import com.example.simple_task_management_system.Mapper.TaskMapper;
import com.example.simple_task_management_system.Repository.ProjectRepo;
import com.example.simple_task_management_system.Repository.TaskRepo;
import com.example.simple_task_management_system.Repository.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.access.AccessDeniedException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepo taskRepository;
    private final ProjectRepo projectRepository;
    private final TaskMapper taskMapper;
    private final UserRepo userRepository;


    public TaskInfoDTO createTask(TaskCreateDTO taskCreateDTO) {
        Task toCreate = new Task();
        toCreate.setTitle(taskCreateDTO.getTitle());
        toCreate.setStatus(taskCreateDTO.getStatus());
        toCreate.setDueDate(taskCreateDTO.getDueDate());

        Project project = projectRepository.findById(taskCreateDTO.getProjectId()).orElse(null);
        if (project == null) {
            throw new CustomException("Error creating task", HttpStatus.CONFLICT);
        }
        toCreate.setProject(project);
        Task task = taskRepository.save(toCreate);
        project.getTasks().add(task);
        projectRepository.save(project);

        return taskMapper.toInfoDTO(task);
    }
    public Page<TaskInfoDTO> getPaginatedTasksInProject(Integer projectId, int page, int size){
        Project project = projectRepository.findById(projectId).orElse(null);
        if (project == null) {
            throw new CustomException("No project with this id", HttpStatus.NOT_FOUND);
        }

        // ✅ Get current user (assuming username = email or id)
        String email = SecurityContextHolder.getContext().getAuthentication().getName();

        ApplicationUser user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AccessDeniedException("Unauthorized"));
        System.out.println("project email: " + project.getUser().getEmail());
        System.out.println("Requested User's email: " + user.getEmail());
        // ✅ Check ownership
        if (!project.getUser().getEmail().equalsIgnoreCase(user.getEmail())) {
            throw new AccessDeniedException("You don't have access to this project.");
        }


        Pageable pageable = PageRequest.of(page, size, Sort.by("dueDate").ascending());
        Page<Task> TaskPage = taskRepository.findByProjectId(projectId, pageable);
        System.out.println("SENDING PAGABLE TASKSSS");
        return TaskPage.map(taskMapper::toInfoDTO);
    }

    public TaskInfoDTO updateTask (TaskUpdateDTO taskUpdateDTO){
        Task toUpdate = taskRepository.findById(taskUpdateDTO.getId()).orElse(null);
        if (toUpdate == null) {
            throw new IllegalArgumentException("No task with id: " + taskUpdateDTO.getId());
        }
        toUpdate.setTitle(taskUpdateDTO.getTitle());
        toUpdate.setStatus(taskUpdateDTO.getStatus());
        toUpdate.setDueDate(taskUpdateDTO.getDueDate());

        Task updated = taskRepository.save(toUpdate);
        return taskMapper.toInfoDTO(updated);

    }

    public void deleteTask (Integer id){
        Task toDelete = taskRepository.findById(id).orElse(null);
        if (toDelete == null) {
            throw new IllegalArgumentException("No task with id: " + id);
        }
        taskRepository.delete(toDelete);
    }

    public void deleteTasks(List<Integer> ids){
        taskRepository.deleteAllById(ids);
    }


}
