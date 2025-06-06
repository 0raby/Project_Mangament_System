package com.example.simple_task_management_system.Mapper;

import com.example.simple_task_management_system.DTO.Create.ProjectCreateDTO;
import com.example.simple_task_management_system.DTO.ProjectInfoDTO;
import com.example.simple_task_management_system.DTO.Update.ProjectUpdateDTO;
import com.example.simple_task_management_system.Entity.Project;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring", uses = {TaskMapper.class})
public interface ProjectMapper {

    Project fromCreateDTO(ProjectCreateDTO dto);
    Project fromUpdateDTO(ProjectUpdateDTO dto);
    ProjectInfoDTO toInfoDTO(Project project);

    List<ProjectInfoDTO> toInfoDTOList(List<Project> projects);
}
