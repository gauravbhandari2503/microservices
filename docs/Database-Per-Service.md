# Database Per Service Pattern

## Concepts Explained (The "Private Diary" Analogy)

In a monolithic family, everyone writes in one big notebook on the kitchen table. In microservices, everyone has a lockable private diary.

### 1. Database Isolation (The Private Diary)

- **The Problem:** In a monolith (Shared DB), if the "Reporting Team" runs a massive query to calculate annual sales, it locks the `orders` table. Now the "Checkout Team" can't save new orders. The website freezes.
- **The Solution:** **Private Diaries**.
  - Order Service has `orders_db`.
  - User Service has `users_db`.
  - User Service CANNOT read `orders_db` directly. It must ask Order Service via API.
  - If Reporting Team crashes `orders_db`, `users_db` works fine.
- **In Tech:** Physically separate databases (or at least schemas) for every service. No cross-database JOINS allowed!

### 2. Tradeoffs: Data Duplication (The Contact List)

- **The Problem:** Since you can't do JOINS, how does Order Service know the user's name?
- **The Solution:** **Copying Data**.
  - When you create an order, you copy `username="John"` into the Order table.
  - **Analogy:** You serve dinner. You don't ask your guest for their name every time you hand them a fork. You remembered it (cached/copied it) in your head at the start of the night.
- **In Tech:** Denormalization. It uses more storage, but storage is cheap. It makes reads much faster.

### 3. Database Migrations (The Home Renovation)

- **The Problem:** You want to change the `address` field from 1 line to 3 lines. But the app is live.
- **The Solution:** **Controlled Renovation**.
  - You use a tool to track changes like code. "Version 1: Create Table". "Version 2: Add Column".
  - This guarantees that all developers and production servers have the explicit same structure.
- **In Tech:** Tools like **Flyway** or **Liquibase**. They run SQL scripts in order (`V1__init.sql`, `V2__add_column.sql`).

### 4. Read Replicas (The Library Photocopies)

- **The Problem:** 1 person is writing a new book (Write), but 1,000 people want to read it (Read) at the same time. The author can't work with people looking over their shoulder.
- **The Solution:** **Photocopies**.
  - **Master DB (The Author):** Only valid for Writing.
  - **Read Replicas ( The Copies):** 5 copies of the book. Readers read the copies.
  - If the Author changes a page, they send a runner to update the 5 copies (milliseconds delay).
- **In Tech:** Send all `INSERT/UPDATE` to the Master DB. Send all `SELECT` to Replica DBs. This scales your performance massively.
