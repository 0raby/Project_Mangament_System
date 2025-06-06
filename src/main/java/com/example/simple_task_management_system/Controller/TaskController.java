package com.example.simple_task_management_system.Controller;

import com.example.simple_task_management_system.DTO.Create.TaskCreateDTO;
import com.example.simple_task_management_system.DTO.ProjectInfoDTO;
import com.example.simple_task_management_system.DTO.TaskInfoDTO;
import com.example.simple_task_management_system.DTO.Update.TaskUpdateDTO;
import com.example.simple_task_management_system.Entity.Task;
import com.example.simple_task_management_system.Service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;


    @PostMapping
    public TaskInfoDTO createTask(@RequestBody TaskCreateDTO taskCreateDTO) {
        return taskService.createTask(taskCreateDTO);
    }

    @GetMapping("/project/{projectId}/tasks")
    public Page<TaskInfoDTO> getProjectTasks(
            @PathVariable Integer projectId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size) {
        return taskService.getPaginatedTasksInProject(projectId, page, size);
    }

    @PutMapping
    public TaskInfoDTO updateTask(@RequestBody TaskUpdateDTO taskUpdateDTO) {
        return taskService.updateTask(taskUpdateDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable Integer id) {
        taskService.deleteTask(id);
    }

    @PostMapping("/deleteList")
    public void deleteTasks(@RequestBody List<Integer> taskIds) {
        taskService.deleteTasks(taskIds);
    }
}
