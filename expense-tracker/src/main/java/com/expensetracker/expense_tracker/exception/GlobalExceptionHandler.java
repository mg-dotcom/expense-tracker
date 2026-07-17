package com.expensetracker.expense_tracker.exception;

import com.expensetracker.expense_tracker.dto.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiResponse<Void>> handleBadCredentials(BadCredentialsException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(ApiResponse.error(401, "Invalid username or password"));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ValidationErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex) {
        var errorDetails = ex.getBindingResult().getFieldErrors().stream()
                .map(err -> {
                    var d = new ValidationErrorResponse.FieldErrorDetail();
                    d.setField(err.getField());
                    d.setErrorMessage(err.getDefaultMessage());
                    return d;
                }).collect(Collectors.toList());
        var response = new ValidationErrorResponse();
        response.setStatus(400);
        response.setMessage("Validation Failed");
        response.setErrors(errorDetails);
        return ResponseEntity.status(400).body(response);
    }
}
