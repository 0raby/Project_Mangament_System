package com.example.simple_task_management_system.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestPassResetDTO {

    private String email;
    private String password;
    private String code;
}
