package com.expensetracker.expense_tracker.dto.expense;

import lombok.Builder;
import lombok.Data;

import java.util.Map;

@Data
@Builder
public class ExpenseSummaryResponse {
    private Map<String, Double> byCategory;
    private double totalThisMonth;
    private Double monthlyBudget;
    private boolean isOverBudget;
}
