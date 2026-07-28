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

import java.io.PrintWriter;
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

    private User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public List<Expense> getAllExpenses() {
        return expenseRepository.findByUser(getCurrentUser());
    }

    public List<ExpenseResponse> getExpenses(String category, LocalDate from, LocalDate to) {
        LocalDateTime start = from != null ? from.atStartOfDay() : null;
        LocalDateTime end = to != null ? to.atTime(LocalTime.MAX) : null;
        User currentUser = getCurrentUser();

        List<Expense> expenses;
        if (category != null && start != null && end != null) {
            expenses = expenseRepository.findByUserAndCategoryAndDateBetween(currentUser, category, start, end);
        } else if (start != null && end != null) {
            expenses = expenseRepository.findByUserAndDateBetween(currentUser, start, end);
        } else if (category != null) {
            expenses = expenseRepository.findByUserAndCategory(currentUser, category);
        } else {
            expenses = expenseRepository.findByUser(currentUser);
        }

        if (expenses.isEmpty() && (category != null || start != null)) {
            throw new ResourceNotFoundException("No expenses found for the given filters");
        }
        return expenses.stream().map(ExpenseMapper::toResponse).toList();
    }

    public void addExpense(Expense expense){
        expense.setUser(getCurrentUser());
        expenseRepository.save(expense);
    }


    public void deleteExpense(Long id){
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense with ID " + id + " does not exist!"));
        if (!expense.getUser().getId().equals(getCurrentUser().getId())) {
            throw new ResourceNotFoundException("Expense with ID " + id + " does not exist!");
        }
        expenseRepository.delete(expense);
    }

    public Expense updateExpense(Long id, Expense expense) {
        Expense existing = expenseRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Expense with ID " + id + " does not exist!"));
        if (!existing.getUser().getId().equals(getCurrentUser().getId())) {
            throw new ResourceNotFoundException("Expense with ID " + id + " does not exist!");
        }
        existing.setName(expense.getName());
        existing.setCategory(expense.getCategory());
        existing.setCost(expense.getCost());
        return expenseRepository.save(existing);
    }

    public List<Expense> getExpensesByCategory(String category) {
        List<Expense> expenses = expenseRepository.findByUserAndCategory(getCurrentUser(), category);
        if (expenses.isEmpty()){
            throw new ResourceNotFoundException("Expense with category " + category + " does not exist!");
        }
        return expenses;
    }

    public ExpenseSummaryResponse getExpenseSummary() {
        List<Expense> expenses = expenseRepository.findByUser(getCurrentUser());
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

    public void exportToCsv(PrintWriter writer) {
        writer.println("id,name,category,cost,date");
        expenseRepository.findByUser(getCurrentUser()).forEach(e ->
                writer.println(String.join(",",
                        String.valueOf(e.getId()),
                        escapeCsv(e.getName()),
                        escapeCsv(e.getCategory()),
                        String.valueOf(e.getCost()),
                        e.getDate().toString())));
    }

    private String escapeCsv(String value) {
        if (value == null) return "";
        if (value.contains(",") || value.contains("\"")) {
            return "\"" + value.replace("\"", "\"\"") + "\"";
        }
        return value;
    }
}