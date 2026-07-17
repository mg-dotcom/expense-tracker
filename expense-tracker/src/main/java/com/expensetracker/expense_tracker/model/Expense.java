package com.expensetracker.expense_tracker.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.Date;

@Data // สร้าง getter, setter, constructor
@Entity
@Table(name = "expenses")
public class Expense {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Expense name is required")
    private String name;

    @NotBlank(message = "Category is required")
    private String category;

    @Positive(message = "Cost must be greater than 0")
    private double cost;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime date;
}
