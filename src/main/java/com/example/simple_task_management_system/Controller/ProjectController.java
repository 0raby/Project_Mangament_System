package com.example.simple_task_management_system.Controller;

import com.example.simple_task_management_system.DTO.Create.ProjectCreateDTO;
import com.example.simple_task_management_system.DTO.ProjectInfoDTO;
import com.example.simple_task_management_system.DTO.Update.ProjectUpdateDTO;
import com.example.simple_task_management_system.Service.ProjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public ProjectInfoDTO createProject(@Valid @RequestBody ProjectCreateDTO projectCreateDTO) {
        return projectService.createProject(projectCreateDTO);
    }
    @GetMapping("/users/{userId}/projects")
    public Page<ProjectInfoDTO> getUserProjects(
            @PathVariable Integer userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return projectService.getPaginatedProjectsByUserId(userId, page, size);
    }

    @GetMapping("/{id}")
    public ProjectInfoDTO getProject(@PathVariable Integer id) {
        return projectService.getProjectById(id);
    }

    @PutMapping
    public ProjectInfoDTO updateProject(@Valid @RequestBody ProjectUpdateDTO projectUpdateDTO) {
        return projectService.updateProject(projectUpdateDTO);
    }

    @DeleteMapping("/{id}")
    public void deleteProject(@PathVariable Integer id) {
        projectService.deleteProject(id);
    }

    @PostMapping("/deleteList")
    public void deleteProjects(@RequestBody List<Integer> projectsToDelete) {
        projectService.deleteProjects(projectsToDelete);
    }



}
