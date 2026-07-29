# Expense Tracker
A personal expense tracking application with AI-powered spending analysis, built with Java Spring Boot and Next.js.

## Screenshots

### Dashboard
<img width="700" alt="Dashboard" src="https://github.com/user-attachments/assets/19e81414-deed-455b-944a-ddaf3c19eb4e" />

### Add Expense
<img width="700" alt="Add Expense" src="https://github.com/user-attachments/assets/cca71df2-c2f3-485c-ba7f-a63728d7c2f3" />

### AI Analysis
<img width="700" alt="AI Analysis" src="https://github.com/user-attachments/assets/f09d779d-56d2-43a7-ae5b-277c396540dc" />

### Summary & Budget
<img width="700" alt="Summary" src="https://github.com/user-attachments/assets/3128e3cc-0b32-45a2-bed1-095002da847a" />

---

## Features

- **Expense Management** — full CRUD with category-based filtering
- **AI Spending Analysis** — powered by Gemini 3.1 Flash Lite, analyzes patterns and gives personalized recommendations in Thai
- **Response Caching** — Caffeine in-memory cache on AI analysis endpoint to reduce redundant API calls
- **Monthly Budget Tracker** — set a budget and track remaining balance with a visual progress bar
- **Category Breakdown** — horizontal bar chart showing spending by category
- **Export CSV** — download all expenses as a CSV file
- **JWT Authentication** — secure login with Spring Security

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 15, TypeScript, Tailwind CSS |
| Backend | Java 21, Spring Boot 3, Spring Security (JWT) |
| Database | PostgreSQL 17 |
| Cache | Caffeine (in-memory) |
| AI | Gemini 3.1 Flash Lite API |
| Build | Maven |

---

## Architecture

```text
Next.js (Frontend)
    │
    └── REST API → Spring Boot Backend
                        │
                        ├── PostgreSQL (expenses, users, budget)
                        └── Gemini 2.5 Flash Lite API (spending analysis)
```

---

## Demo Access

| Username | Password |
|---|---|
| demo_admin | demo1234 |

---

## How to Run

### Prerequisites
- Java 21
- PostgreSQL 17
- Maven
- Node.js 18+

### Backend

```bash
# 1. Clone the repo
git clone https://github.com/mg-dotcom/expense-tracker.git
cd expense-tracker/expense-tracker-be

# 2. Create database
psql -U postgres -c "CREATE DATABASE expense_tracker;"

# 3. Configure application.properties
# Fill in your DB credentials and Gemini API key
spring.datasource.url=jdbc:postgresql://localhost:5432/expense_tracker
spring.datasource.username=postgres
spring.datasource.password=your_password
gemini.api.key=your_gemini_api_key
gemini.api.model=gemini-2.5-flash-lite

# 4. Run
mvn spring-boot:run
```

### Frontend

```bash
cd expense-tracker-fe

# Install dependencies
npm install

# Configure .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Run
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Author

**mg-dotcom** — [github.com/mg-dotcom](https://github.com/mg-dotcom)
