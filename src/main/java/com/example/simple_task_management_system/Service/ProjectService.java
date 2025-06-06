package com.example.simple_task_management_system.Service;

import com.example.simple_task_management_system.DTO.Create.ProjectCreateDTO;
import com.example.simple_task_management_system.DTO.ProjectInfoDTO;
import com.example.simple_task_management_system.DTO.Update.ProjectUpdateDTO;
import com.example.simple_task_management_system.Entity.ApplicationUser;
import com.example.simple_task_management_system.Entity.Project;
import com.example.simple_task_management_system.Exception.CustomException;
import com.example.simple_task_management_system.Mapper.ProjectMapper;
import com.example.simple_task_management_system.Repository.ProjectRepo;
import com.example.simple_task_management_system.Repository.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {
    private final ProjectMapper projectMapper;
    private final ProjectRepo projectRepository;
    private final UserRepo userRepository;

    @Autowired
    public ProjectService(ProjectMapper projectMapper, ProjectRepo projectRepository, UserRepo userRepository) {
        this.projectMapper = projectMapper;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
    }

    //Create Project
    public ProjectInfoDTO createProject(ProjectCreateDTO projectCreateDTO) {
        try {
            Project toCreate = new Project();
            toCreate.setDescription(projectCreateDTO.getDescription());
            toCreate.setTitle(projectCreateDTO.getTitle());

            ApplicationUser user = userRepository.findById(projectCreateDTO.getUserId()).get();

            //create relations and save
            toCreate.setUser(user);
            Project created = projectRepository.save(toCreate);
            user.getProjects().add(created);
            userRepository.save(user);
            return projectMapper.toInfoDTO(created);
        }
        catch(Exception e){
            throw new CustomException("There was an error creating the project please try again" , HttpStatus.CONFLICT);
        }
    }
    public ProjectInfoDTO getProjectById(Integer id){
        try {
            Project project = projectRepository.findById(id).orElse(null);
            if (project == null) {
                throw new CustomException("There was an error opening this project", HttpStatus.NOT_FOUND);
            }
            return projectMapper.toInfoDTO(project);
        }
        catch(Exception e) {
            throw new CustomException("Server side error, please try again later", HttpStatus.CONFLICT);
        }
    }

    public Page<ProjectInfoDTO> getPaginatedProjectsByUserId(Integer userId, int page, int size) {
        ApplicationUser user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            return Page.empty(); //return empty page instead of null
        }

        Pageable pageable = PageRequest.of(page, size, Sort.by("id").descending());
        Page<Project> projectPage = projectRepository.findByUserId(userId, pageable);

        return projectPage.map(projectMapper::toInfoDTO); //map each Project to ProjectInfoDTO
    }
    //update project
    public ProjectInfoDTO updateProject(ProjectUpdateDTO projectUpdateDTO) {
        try {
            Project toUpdate = projectRepository.findById(projectUpdateDTO.getId()).orElse(null);

            if (toUpdate == null) {
                throw new CustomException("Cannot update this project", HttpStatus.CONFLICT);
            }

            toUpdate.setDescription(projectUpdateDTO.getDescription());
            toUpdate.setTitle(projectUpdateDTO.getTitle());

            Project updated = projectRepository.save(toUpdate);
            return projectMapper.toInfoDTO(updated);
        }
        catch(Exception e){
            throw new CustomException("Cannot update this project", HttpStatus.CONFLICT);
        }
    }

    //delete 1 project
    public void deleteProject(Integer id) {
        Project project = projectRepository.findById(id).orElse(null);
        if(project == null){
            throw new CustomException(("No project found with id: " + id), HttpStatus.CONFLICT);
        }
        projectRepository.delete(project);
    }

    //delete > 1 projects
    public void deleteProjects(List<Integer> Ids){
        try {
            projectRepository.deleteAllById(Ids);
        }
        catch(Exception e){
            throw new CustomException("Error deleting all projects, try again", HttpStatus.CONFLICT);
        }

    }
}
