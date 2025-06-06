package com.example.simple_task_management_system.Mapper;

import com.example.simple_task_management_system.DTO.Create.TaskCreateDTO;
import com.example.simple_task_management_system.DTO.TaskInfoDTO;
import com.example.simple_task_management_system.DTO.Update.TaskUpdateDTO;
import com.example.simple_task_management_system.Entity.Task;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TaskMapper {

    Task fromCreateDTO(TaskCreateDTO dto);
    Task fromUpdateDTO(TaskUpdateDTO dto);
    TaskInfoDTO toInfoDTO(Task task);

    List<TaskInfoDTO> toInfoDTOList(List<Task> tasks);
}