package com.expensetracker.expense_tracker.mapper;

import com.expensetracker.expense_tracker.dto.expense.ExpenseResponse;
import com.expensetracker.expense_tracker.model.Expense;

public final class ExpenseMapper {
    private ExpenseMapper() {}
    public static ExpenseResponse toResponse(Expense e) {
        if (e == null) return null;
        return ExpenseResponse.builder()
                .id(e.getId()).name(e.getName())
                .category(e.getCategory()).cost(e.getCost())
                .date(e.getDate()).build();
    }
}