package com.expensetracker.expense_tracker.dto.expense;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ExpenseResponse {
    private Long id;
    private String name;
    private String category;
    private double cost;
    private LocalDateTime date;
}