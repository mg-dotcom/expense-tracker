package com.expensetracker.expense_tracker.repository;

import com.expensetracker.expense_tracker.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense,Long> {
    List<Expense> findByCategory(String category);
    List<Expense> findByDateBetween(LocalDateTime start, LocalDateTime end);
    List<Expense> findByCategoryAndDateBetween(String category, LocalDateTime start, LocalDateTime end);
}


