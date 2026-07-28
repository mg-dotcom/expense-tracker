package com.expensetracker.expense_tracker.service;

import com.expensetracker.expense_tracker.exception.ResourceNotFoundException;
import com.expensetracker.expense_tracker.model.Expense;
import com.expensetracker.expense_tracker.model.Role;
import com.expensetracker.expense_tracker.model.User;
import com.expensetracker.expense_tracker.repository.ExpenseRepository;
import com.expensetracker.expense_tracker.repository.UserRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.TestingAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ExpenseServiceTest {

    @Mock
    private ExpenseRepository expenseRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ExpenseService expenseService;

    private User owner;
    private User intruder;

    @BeforeEach
    void setUp() {
        owner = User.builder().id("user-1").username("owner").role(Role.VIEWER).build();
        intruder = User.builder().id("user-2").username("intruder").role(Role.VIEWER).build();

        SecurityContextHolder.getContext()
                .setAuthentication(new TestingAuthenticationToken(owner, null));
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void deleteExpense_whenCallerIsOwner_deletesSuccessfully() {
        Expense expense = new Expense();
        expense.setId(1L);
        expense.setUser(owner);
        when(expenseRepository.findById(1L)).thenReturn(Optional.of(expense));

        expenseService.deleteExpense(1L);

        verify(expenseRepository).delete(expense);
    }

    @Test
    void deleteExpense_whenCallerIsNotOwner_throwsNotFound() {
        Expense expense = new Expense();
        expense.setId(1L);
        expense.setUser(intruder);
        when(expenseRepository.findById(1L)).thenReturn(Optional.of(expense));

        assertThrows(ResourceNotFoundException.class,
                () -> expenseService.deleteExpense(1L));

        verify(expenseRepository, never()).delete(any());
    }

    @Test
    void getExpenseSummary_whenSpendingExceedsBudget_flagsOverBudget() {
        owner.setMonthlyBudget(1000.0);

        Expense food = new Expense();
        food.setCategory("Food");
        food.setCost(700);
        food.setDate(LocalDateTime.now());

        Expense transport = new Expense();
        transport.setCategory("Transport");
        transport.setCost(500);
        transport.setDate(LocalDateTime.now());

        when(expenseRepository.findByUser(owner)).thenReturn(List.of(food, transport));

        var summary = expenseService.getExpenseSummary();

        assertThat(summary.getTotalThisMonth()).isEqualTo(1200.0);
        assertThat(summary.isOverBudget()).isTrue();
    }
}