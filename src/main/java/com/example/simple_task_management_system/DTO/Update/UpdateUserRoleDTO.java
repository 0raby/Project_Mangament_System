package com.example.simple_task_management_system.DTO.Update;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateUserRoleDTO {

    private Integer id;
    @NotNull
    private String email;
    @NotNull
    private String role;
}
