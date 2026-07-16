# Expense Tracker Backend

A RESTful API for tracking personal expenses, built with **Spring Boot**, **PostgreSQL**, and powered by **Gemini AI** for intelligent spending analysis.

---

## Tech Stack

| Technology | Version |
|---|---|
| Java | 21 |
| Spring Boot | 3.5.13 |
| Spring Data JPA | - |
| PostgreSQL | 17 |
| Gemini AI | 2.5 Flash |
| Lombok | - |
| Maven | - |

---

## Features

- Full **CRUD** for expense management
- Auto-timestamp on expense creation
- Global API response wrapper
- **AI-powered spending analysis** via Gemini AI
- PostgreSQL persistent storage

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/expenses` | Get all expenses (Supports `?category=` filter) |
| `POST` | `/expenses` | Add new expense |
| `PUT` | `/expenses/{id}` | Update expense |
| `DELETE` | `/expenses/{id}` | Delete expense |
| `GET` | `/expenses/analyze` | AI spending analysis |
| `GET` | `/expenses/summary` | Get expense summary grouped by category |

---

## Request Body (POST / PUT)

```json
{
  "name": "กินข้าว",
  "category": "อาหาร",
  "cost": 80
}
```

---

## Response Format

```json
{
  "status": 200,
  "message": "success",
  "data": [...]
}
```

---

## Setup & Run

### Prerequisites
- Java 21
- PostgreSQL 17
- Maven

### 1. Clone the repository
```bash
git clone https://github.com/mg-dotcom/expense-tracker-backend.git
cd expense-tracker-backend
```

### 2. Create PostgreSQL database
```sql
CREATE DATABASE expense_tracker;
```

### 3. Configure application.properties
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/expense_tracker
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
gemini.api.key=your_gemini_api_key
```

### 4. Run the application
```bash
mvn spring-boot:run
```

API will be available at `http://localhost:8080`

---

## AI Analysis Example

`GET /expenses/analyze`

```json
{
  "status": 200,
  "message": "success",
  "data": "วิเคราะห์รายจ่ายของคุณ: เดือนนี้ใช้จ่ายไปกับหมวดอาหารมากที่สุด..."
}
```
