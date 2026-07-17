package com.expensetracker.expense_tracker.controller;

import com.expensetracker.expense_tracker.dto.ApiResponse;
import com.expensetracker.expense_tracker.model.Expense;
import com.expensetracker.expense_tracker.service.ExpenseService;
import com.expensetracker.expense_tracker.service.GeminiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/expenses")
@RequiredArgsConstructor
public class ExpenseController {
    private final ExpenseService expenseService;
    private final GeminiService geminiService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<Expense>>> getAllExpenses(
            @RequestParam(required = false) String category) {
        if (category != null){
            return ResponseEntity.ok(ApiResponse.ok(expenseService.getExpensesByCategory(category)));
        }
        return ResponseEntity.ok(ApiResponse.ok(expenseService.getAllExpenses()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> addExpense(@RequestBody Expense expense) {
        expenseService.addExpense(expense);
        return ResponseEntity.status(201).body(ApiResponse.created("Expense added successfully"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.ok(ApiResponse.okMessage("Expense " + id + " has been deleted"));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Expense>> updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody Expense expense
    ){
        Expense updated = expenseService.updateExpense(id, expense);
        return ResponseEntity.ok(ApiResponse.ok(updated));
    }

    @GetMapping("/analyze")
    public ResponseEntity<ApiResponse<String>> analyzeExpenses() {
        List<Expense> expenses = expenseService.getAllExpenses();
        String analysis = geminiService.analyzeExpenses(expenses);
        return ResponseEntity.ok(ApiResponse.ok(analysis));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<Map<String, Double>>> getExpenseSummary(){
        return ResponseEntity.ok(ApiResponse.ok(expenseService.getExpenseSummary()));
    }
}
