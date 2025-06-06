package com.example.simple_task_management_system.Entity;

import com.example.simple_task_management_system.Base.Status;
import io.micrometer.observation.Observation;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.lang.NonNull;

import java.util.Date;
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Entity(name="task")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @NonNull
    @Column(name = "title")
    private String title;

    @NonNull
    @Column(name = "status")
    private Status status;

    @NonNull
    @Temporal(TemporalType.DATE)
    @DateTimeFormat(pattern = "dd/MM/yyyy")
    @Column(name = "dueDate")
    private Date dueDate;

    @ManyToOne
    @JoinColumn(name = "project_id")
    private Project project;
}
