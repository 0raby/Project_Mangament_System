package com.example.simple_task_management_system.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequestDTO {
    @NotBlank
    private String email;
    @NotBlank
    private String password;
}
