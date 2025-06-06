package com.example.simple_task_management_system.DTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectInfoDTO {
    private Integer id;
    private String title;
    private String description;
//    private List<TaskInfoDTO> tasks = new ArrayList<>();
}
