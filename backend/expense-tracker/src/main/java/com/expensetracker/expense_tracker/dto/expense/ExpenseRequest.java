package com.expensetracker.expense_tracker.dto.expense;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class ExpenseRequest {
    @NotBlank(message = "Expense name is required")
    private String name;
    @NotBlank(message = "Category is required")
    private String category;
    @Positive(message = "Cost must be greater than 0")
    private double cost;
}
