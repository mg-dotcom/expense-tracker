package com.expensetracker.expense_tracker.controller;

import com.expensetracker.expense_tracker.dto.ApiResponse;
import com.expensetracker.expense_tracker.dto.expense.BudgetRequest;
import com.expensetracker.expense_tracker.dto.expense.ExpenseRequest;
import com.expensetracker.expense_tracker.dto.expense.ExpenseResponse;
import com.expensetracker.expense_tracker.dto.expense.ExpenseSummaryResponse;
import com.expensetracker.expense_tracker.mapper.ExpenseMapper;
import com.expensetracker.expense_tracker.model.Expense;
import com.expensetracker.expense_tracker.service.ExpenseService;
import com.expensetracker.expense_tracker.service.GeminiService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/expenses")
@RequiredArgsConstructor
public class ExpenseController {
    private final ExpenseService expenseService;
    private final GeminiService geminiService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ExpenseResponse>>> getAllExpenses(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(ApiResponse.ok(expenseService.getExpenses(category, from, to)));
    }

    @PostMapping
    @CacheEvict(value = "expenseAnalysis", allEntries = true)
    public ResponseEntity<ApiResponse<String>> addExpense(@Valid @RequestBody ExpenseRequest request) {
        Expense expense = new Expense();
        expense.setName(request.getName());
        expense.setCategory(request.getCategory());
        expense.setCost(request.getCost());

        expenseService.addExpense(expense);
        return ResponseEntity.status(201).body(ApiResponse.created("Expense added successfully"));
    }

    @DeleteMapping("/{id}")
    @CacheEvict(value = "expenseAnalysis", allEntries = true)
    public ResponseEntity<ApiResponse<Void>> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.ok(ApiResponse.okMessage("Expense " + id + " has been deleted"));
    }

    @PutMapping("/{id}")
    @CacheEvict(value = "expenseAnalysis", allEntries = true)
    public ResponseEntity<ApiResponse<ExpenseResponse>> updateExpense(
            @PathVariable Long id,
            @Valid @RequestBody ExpenseRequest request
    ) {
        Expense expense = new Expense();
        expense.setName(request.getName());
        expense.setCategory(request.getCategory());
        expense.setCost(request.getCost());

        Expense updated = expenseService.updateExpense(id, expense);
        return ResponseEntity.ok(ApiResponse.ok(ExpenseMapper.toResponse(updated)));
    }

    @Cacheable(value = "expenseAnalysis", key = "'latest'")
    @GetMapping("/analyze")
    public ResponseEntity<ApiResponse<String>> analyzeExpenses() {
        List<Expense> expenses = expenseService.getAllExpenses();
        String analysis = geminiService.analyzeExpenses(expenses);
        return ResponseEntity.ok(ApiResponse.ok(analysis));
    }

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<ExpenseSummaryResponse>> getExpenseSummary(){
        return ResponseEntity.ok(ApiResponse.ok(expenseService.getExpenseSummary()));
    }

    @PutMapping("/budget")
    public ResponseEntity<ApiResponse<Void>> setBudget(@Valid @RequestBody BudgetRequest request) {
        expenseService.setMonthlyBudget(request.getMonthlyBudget());
        return ResponseEntity.ok(ApiResponse.okMessage("Monthly budget updated"));
    }

    @GetMapping("/export")
    public void exportCsv(HttpServletResponse response) throws IOException {
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=expenses.csv");
        expenseService.exportToCsv(response.getWriter());
    }
}