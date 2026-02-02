# Data Management Patterns

## Concepts Explained (The "Travel Booking" Analogy)

Managing data in microservices is hard because you don't have one big database anymore. Here is how we solve it.

### 1. Saga Pattern (Distributed Transactions)

- **The Problem:** You want to book a trip: Flight + Hotel + Cab. In a monolith, you do `SAVE ALL` or `CANCEL ALL`. In microservices, the Flight service might say "OK", but the Hotel service says "Full". Now you have a booked flight but no hotel.
- **The Solution:** A sequence of steps where each step has an "Undo" button (Compensating Transaction).
  1.  Book Flight ✅
  2.  Book Hotel ❌ (Failed!)
  3.  **Run Undo:** Cancel Flight ↩️
- **In Tech:** If the Order Service creates an order but the Payment Service fails, the Saga manager tells the Order Service to "Cancel Order" to revert the change.

### 2. Event Sourcing (Audit Trails)

- **The Problem:** A standard database only remembers the _current_ state. "Balance: $10". You don't know how it got there. Did you deposit $100 and withdraw $90? Or just deposit $10?
- **The Solution:** Instead of storing the "Current State", store **every single thing that happened**.
  1.  Event: `AccountOpened` ($0)
  2.  Event: `Deposited` (+$100)
  3.  Event: `Withdrew` (-$90)
      _Current Balance_ is calculated by replaying these events ($0 + $100 - $90 = $10).
- **In Tech:** You store a log of immutable events (`OrderCreated`, `ItemAdded`, `OrderShipped`). This gives you a perfect audit trail and lets you "time travel" to see the state at any point.

### 3. CQRS (Command Query Responsibility Segregation)

- **The Problem:** The way you _write_ data is complex (lots of rules, validation), but the way you _read_ data needs to be super fast and simple. Using the same database model for both is slow.
- **The Solution:** Split the system into two parts:
  1.  **Command (Write):** "Add Item to Cart" (Complex, validates rules).
  2.  **Query (Read):** "Show Cart" (Fast, simple read).
      They can even use different databases! The "Write" DB syncs to the "Read" DB in the background.
- **In Tech:** You might use a relational DB (Postgres) for writing orders to ensure safety, but sync that data to a fast Search Engine (Elasticsearch) for users to search orders instantly.

### 4. Data Consistency (Eventual vs. Strong)

- **The Problem:** Keeping data perfectly in sync across 5 different services instantly is impossible without freezing the whole system.
- **The Solution:** Accept that things might be out of sync for a few milliseconds (**Eventual Consistency**).
  - **Strong Consistency:** "I won't tell anyone the money is transferred until _both_ banks confirm." (Slow, safe).
  - **Eventual Consistency:** "I'll tell you the transfer started. The other bank will confirm in a second." (Fast, flexible).
- **In Tech:** When you update a User's profile, the "User Service" updates instantly. The "Search Service" might still verify the old name for 1 second until it receives the update event. That is acceptable.

## Industry Standard Tools & Services

Here are some of the most popular tools and frameworks used to address these Data Management challenges:

| Pattern / Challenge  | Best Tools / Frameworks (Industry Standard)                   | Why?                                                                                                                                         |
| :------------------- | :------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------- |
| **Saga Pattern**     | **Temporal**, **Camunda**, **Cadence**, **Netflix Conductor** | These **Orchestrators** manage the state of long-running workflows (Steps 1, 2, 3) and handle retries/compensations automatically.           |
| **Event Sourcing**   | **Apache Kafka**, **AxonIQ**, **EventStoreDB**                | Built for immutable event logs. **Kafka** is the standard for high-throughput event streaming; **EventStoreDB** is specialized for Sourcing. |
| **CQRS**             | **Axon Framework**, **MediatR (.NET)**, **Kafka Streams**     | **Axon** provides built-in Command/Query buses. **Elasticsearch** is often used as the "Read" database for speed.                            |
| **Data Consistency** | **Debezium**, **RabbitMQ / Kafka**                            | **Debezium** captures DB changes (CDC) to keep other services in sync. Message queues ensure eventual consistency.                           |
