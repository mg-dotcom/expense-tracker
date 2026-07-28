package com.expensetracker.expense_tracker.service;

import com.expensetracker.expense_tracker.model.Expense;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
public class GeminiService {

    private final String apiKey;
    private final String model;
    private final WebClient webClient;
    // Sends HTTP requests to the Gemini API

    public record GeminiRequest(List<Content> contents) {}
    public record Content(List<Part> parts) {}
    public record Part(String text) {}
    public record GeminiResponse(List<Candidate> candidates) {}
    public record Candidate(ContentResponse content) {}
    public record ContentResponse(List<PartResponse> parts) {}
    public record PartResponse(String text) {}

    public GeminiService(
            @Value("${gemini.api.key}") String apiKey,
            @Value("${gemini.api.model}") String model,
            WebClient.Builder webClientBuilder
    ) {
        this.apiKey = apiKey;
        this.model = model;
        this.webClient = webClientBuilder
                .baseUrl("https://generativelanguage.googleapis.com")
                .build();
    }

    public String analyzeExpenses(List<Expense> expenses){
        String prompt = "Analyze the following expenses in Thai and give recommendations: "
                + expenses.toString();

        GeminiRequest requestBody = new GeminiRequest(List.of(new Content(List.of(new Part(prompt)))));

        return webClient.post()
                .uri("/v1beta/models/" + model + ":generateContent?key=" + apiKey)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(GeminiResponse.class).map(response -> {
                    try {
                        return response.candidates().getFirst()
                                .content().parts().getFirst()
                                .text();
                    } catch (Exception e) {
                        return "Analysis failed, or the response format was invalid";
                    }
                })
                .block();
    }
}