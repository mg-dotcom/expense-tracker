package com.expensetracker.expense_tracker.service;

import com.expensetracker.expense_tracker.dto.expense.ExpenseResponse;
import com.expensetracker.expense_tracker.dto.expense.ExpenseSummaryResponse;
import com.expensetracker.expense_tracker.exception.ResourceNotFoundException;
import com.expensetracker.expense_tracker.mapper.ExpenseMapper;
import com.expensetracker.expense_tracker.model.Expense;
import com.expensetracker.expense_tracker.model.User;
import com.expensetracker.expense_tracker.repository.ExpenseRepository;
import com.expensetracker.expense_tracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseService {
    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
    }

    public List<ExpenseResponse> getExpenses(String category, LocalDate from, LocalDate to) {
        LocalDateTime start = from != null ? from.atStartOfDay() : null;
        LocalDateTime end = to != null ? to.atTime(LocalTime.MAX) : null;

        List<Expense> expenses;
        if (category != null && start != null && end != null) {
            expenses = expenseRepository.findByCategoryAndDateBetween(category, start, end);
        } else if (start != null && end != null) {
            expenses = expenseRepository.findByDateBetween(start, end);
        } else if (category != null) {
            expenses = expenseRepository.findByCategory(category);
        } else {
            expenses = expenseRepository.findAll();
        }

        if (expenses.isEmpty() && (category != null || start != null)) {
            throw new ResourceNotFoundException("No expenses found for the given filters");
        }
        return expenses.stream().map(ExpenseMapper::toResponse).toList();
    }

    public void addExpense(Expense expense){
        expenseRepository.save(expense);
    }

    public void deleteExpense(Long id){
        if (!expenseRepository.existsById(id)){
            throw new ResourceNotFoundException("Expense with ID " + id + " does not exist!");
        }
        expenseRepository.deleteById(id);
    }

    public Expense updateExpense(Long id, Expense expense) {
        Expense existing = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense with ID " + id + " does not exist!"));

        existing.setName(expense.getName());
        existing.setCategory(expense.getCategory());
        existing.setCost(expense.getCost());

        return expenseRepository.save(existing);
    }

    public List<Expense> getExpensesByCategory(String category) {
        List<Expense> expenses = expenseRepository.findByCategory(category);
        if(expenses.isEmpty()){
            throw new ResourceNotFoundException("Expense with category " + category + " does not exist!");
        }
        return expenses;
    }

    public ExpenseSummaryResponse getExpenseSummary() {
        List<Expense> expenses = expenseRepository.findAll();
        Map<String, Double> byCategory = expenses.stream()
                .collect(Collectors.groupingBy(Expense::getCategory, Collectors.summingDouble(Expense::getCost)));

        YearMonth currentMonth = YearMonth.now();
        double totalThisMonth = expenses.stream()
                .filter(e -> YearMonth.from(e.getDate()).equals(currentMonth))
                .mapToDouble(Expense::getCost)
                .sum();

        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Double budget = user.getMonthlyBudget();
        boolean isOverBudget = budget != null && totalThisMonth > budget;

        return ExpenseSummaryResponse.builder()
                .byCategory(byCategory)
                .totalThisMonth(totalThisMonth)
                .monthlyBudget(budget)
                .isOverBudget(isOverBudget)
                .build();
    }

    public void setMonthlyBudget(Double amount) {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        user.setMonthlyBudget(amount);
        userRepository.save(user);
    }
}