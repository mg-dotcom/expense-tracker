package com.expensetracker.expense_tracker.dto.expense;

import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class BudgetRequest {
    @Positive(message = "Monthly budget must be greater than 0")
    private Double monthlyBudget;
}