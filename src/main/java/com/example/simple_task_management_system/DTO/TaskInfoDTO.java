package com.example.simple_task_management_system.DTO;

import com.example.simple_task_management_system.Base.Status;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskInfoDTO {
    private Integer id;
    private String title;
    private Status status;
    private Date dueDate;
}
