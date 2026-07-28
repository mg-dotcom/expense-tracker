package com.expensetracker.expense_tracker.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApiResponse<T> {
    private int status;
    private String message;
    private T data;

    public static ApiResponse<Void> error(int status, String message) {
        return new ApiResponse<>(status, message , null);
    }

    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(200, "success", data);
    }

    public static ApiResponse<Void> okMessage(String message) {
        return new ApiResponse<>(200, message, null);
    }

    public static <T> ApiResponse<T> created(T data) {
        return new ApiResponse<>(201, "success", data);
    }
}