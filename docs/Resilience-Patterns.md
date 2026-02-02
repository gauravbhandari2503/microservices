# Resilience Patterns

## Concepts Explained (The "Electricity Grid" Analogy)

In a distributed system, failure is inevitable. Resilience patterns prevent a single failing lightbulb from burning down the entire house.

### 1. Circuit Breaker

- **The Problem:** Image a toaster short-circuits. If you keep sending electricity to it, you start a fire in the walls.
- **The Solution:** The **Circuit Breaker** in your home panel "trips" (opens). It stops electricity from flowing to the toaster for a while.
  - **Closed (Normal):** Electricity flows.
  - **Open (Tripped):** No electricity. You wait.
  - **Half-Open (Test):** Try flipping it back on. If it sparks, trip again. If it works, stay on.
- **In Tech:** If "Payment Service" fails 5 times in a row, the "Order Service" stops calling it. It instantly returns "Payment System Down" to the user, saving resources and waiting for the Payment Service to recover.

### 2. Retry with Exponential Backoff

- **The Problem:** You call a friend, and they don't answer. If you call them again _instantly_ 100 times, you are annoying and might crash their phone.
- **The Solution:** "Polite Redialing".
  1.  Call 1: No answer. Wait 1 second.
  2.  Call 2: No answer. Wait 2 seconds.
  3.  Call 3: No answer. Wait 4 seconds.
  4.  Call 4: No answer. Give up.
- **In Tech:** If a database query fails, try again. But wait longer each time to give the database a chance to breathe and recover.

### 3. Timeouts

- **The Problem:** You ask a waiter for water. They walk away and never come back. You sit there for 4 hours waiting.
- **The Solution:** "The 5-Minute Rule". If the waiter isn't back in 5 minutes, you leave or ask someone else.
- **In Tech:** NEVER make a request without a stopwatch. "If `User Service` doesn't answer in 2 seconds, cancel the request and throw an error." Don't let your users wait forever.

### 4. Bulkhead

- **The Problem:** A ship hits an iceberg. Water enters the hull. If the whole ship is one big room, it sinks.
- **The Solution:** The ship is divided into **watertight compartments** (Bulkheads). If one room fills with water, the door seals. The rest of the ship stays dry and floats.
- **In Tech:** You allocate resources (threads/connections) separately.
  - 10 threads for "Payment".
  - 10 threads for "User Profile".
  - If "Payment" gets stuck and uses all 10 threads, "User Profile" still works perfectly because it has its own dedicated threads.

## Industry Standard Tools & Services

Here are some of the most popular tools and technologies used to implement these Resilience patterns:

| Functionality       | Best Tools / Technologies (Industry Standard)             | Why?                                                                                                                   |
| :------------------ | :-------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------- |
| **Circuit Breaker** | **Resilience4j**, **Hystrix** (Legacy), **Istio**         | **Resilience4j** is the modern Java standard. **Istio** handles this at the network layer (Mesh) without code changes. |
| **Retry / Backoff** | **Resilience4j**, **Spring Retry**, **Polly** (.NET)      | Automatically retries failed requests with customizable backoff strategies (e.g., wait 1s, then 2s, then 4s).          |
| **Timeouts**        | **Native HTTP Clients** (OkHttp, Axios), **Resilience4j** | Standardize constraints: "If no response in 2s, fail fast." Prevents threads from hanging forever.                     |
| **Bulkhead**        | **Resilience4j**, **K8s Resource Quotas**, **Hystrix**    | Isolates failures. If one service is overloaded, it doesn't consume all threads/memory of the caller.                  |
