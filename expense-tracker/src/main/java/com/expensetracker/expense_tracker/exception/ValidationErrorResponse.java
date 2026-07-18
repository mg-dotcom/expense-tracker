package com.expensetracker.expense_tracker.exception;

import lombok.Data;

import java.util.List;

@Data
public class ValidationErrorResponse {
    private int status;
    private String message;
    private List<FieldErrorDetail> errors;

    @Data
    public static class FieldErrorDetail {
        private String field;
        private String errorMessage;
    }
}