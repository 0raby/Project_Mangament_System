package com.example.simple_task_management_system.DTO.Update;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectUpdateDTO {
    private Integer id;
    @NotBlank
    @Size(min = 2, max = 50, message = "Title must be between 2 and 50 characters")
    private String title;
    @NotBlank
    private String description;

}
