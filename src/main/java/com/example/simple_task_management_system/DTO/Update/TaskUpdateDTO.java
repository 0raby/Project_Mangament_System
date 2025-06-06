package com.example.simple_task_management_system.DTO.Update;

import com.example.simple_task_management_system.Base.Status;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskUpdateDTO {
    private Integer id;

    @NotBlank
    @Size(min = 2, max = 50, message = "Title must be between 2 and 50 characters")
    private String title;

    @NotBlank
    private Status status;

    @NotBlank
    @FutureOrPresent(message = "Date cannot be in the past")
    private Date dueDate;
}
