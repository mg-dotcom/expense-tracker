package com.expensetracker.expense_tracker.service;

import com.expensetracker.expense_tracker.exception.ResourceNotFoundException;
import com.expensetracker.expense_tracker.model.Expense;
import com.expensetracker.expense_tracker.repository.ExpenseRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExpenseService {
    private final ExpenseRepository expenseRepository;

    public List<Expense> getAllExpenses() {
        return expenseRepository.findAll();
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

    public Map<String, Double> getExpenseSummary() {
        List<Expense> expenses = expenseRepository.findAll();
        return expenses.stream()
                .collect(Collectors.groupingBy(
                        Expense::getCategory,
                        Collectors.summingDouble(Expense::getCost)
                ));
    }
}