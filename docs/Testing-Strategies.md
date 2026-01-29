# Testing Strategies

## Concepts Explained (The "Car Manufacturing" Analogy)

Building software is like building a car. You don't just assemble the whole car and hope it starts. You test every screw, every engine part, and then the driving experience.

### 1. Unit Tests (The Screw Test)

- **The Problem:** You built a clear function: `calculateTotal(price, tax)`. But did you handle negative numbers? Zero tax?
- **The Solution:** Test the smallest piece in isolation.
  - "If price is 100 and tax is 10, result MUST be 110."
  - "If price is -5, throw Error."
- **In Tech:** Fast, cheap, and run thousands of times per second. Jest, Mocha.

### 2. Integration Tests (The Engine Start)

- **The Problem:** The piston works (Unit Test passed). The cylinder works (Unit Test passed). But when you put them together, they grind and explode.
- **The Solution:** Connect two real parts and test them together.
  - "Does `OrderService` actually save to the `Postgres Database`?"
  - These are slower because they involve real databases or network calls.
- **In Tech:** Supertest, TestContainers.

### 3. Contract Tests (The Handshake)

- **The Problem:** The Car Radio team changes the plug shape from Square to Round. The Dashboard team didn't know. Now the radio doesn't fit in the dashboard.
- **The Solution:** A Legal Contract.
  - **Consumer (Dashboard):** "I expect the plug to be Square."
  - **Provider (Radio):** "I promise to always provide a Square plug."
  - If the Radio team tries to change it to Round, the build fails _before_ they even release it.
- **In Tech:** **Pact**. It ensures that if Service A changes its API, it doesn't break Service B.

### 4. End-to-End (E2E) Tests (The Test Drive)

- **The Problem:** The engine works, the radio works, the wheels work. But the car feels bumpy and steers to the left.
- **The Solution:** Drive the car like a real user.
  - Open Browser -> Click "Buy" -> Check Email.
  - This tests _everything_ (Gateway, Frontend, Backend, DB, Email Service).
- **In Tech:** Playwright, Cypress, Selenium. Very slow and expensive, but necessary.

### 5. Chaos Engineering (The Crash Test)

- **The Problem:** The car drives fine on a sunny day. What if it hits a wall? What if a tire blows out at 100mph?
- **The Solution:** **Intentionally break things**.
  - Go to production and turn off the Database. Does the system show "Maintenance Mode" or does it crash responsibly?
  - Add 5 seconds of latency. Do timeouts work?
- **In Tech:** **Netflix Chaos Monkey**. It randomly kills servers in production to force engineers to build resilient systems.
