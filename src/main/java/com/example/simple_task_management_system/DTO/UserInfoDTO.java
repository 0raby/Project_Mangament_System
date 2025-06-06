package com.example.simple_task_management_system.DTO;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserInfoDTO {
        private Integer id;
        private String name;
        private String email;
//        private List<ProjectInfoDTO> projects = new ArrayList<>();
}
