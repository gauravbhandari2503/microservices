# Observability Patterns

## Concepts Explained (The "Car Mechanic" Analogy)

When your car breaks down, you need tools to know _what_ happened and _where_. In microservices, "Observability" is that toolkit.

### 1. Distributed Tracing (Jaeger, Zipkin)

- **The Problem:** A user clicks "Buy", and it fails. But "Buy" hits the Gateway -> Order Service -> Payment Service -> Inventory Service. Which one failed? In a monolith, you have one error log. In microservices, you have 5 different log files.
- **The Solution:** Imagine shipping a package. You get a **Tracking Number**.
  1.  Gateway: "Package received at hub."
  2.  Order Service: "Package sorted."
  3.  Payment Service: "Package load... ERROR: Truck full."
      You can see the entire journey of one request across all services in a visual graph.
- **In Tech:** Tools like **Jaeger** show you a timeline bar graph: "Gateway took 10ms, Order Service took 50ms, Payment Service timed out."

### 2. Centralized Logging (ELK Stack, Loki)

- **The Problem:** You have 10 microservices running on 10 different servers. To debug an error, you have to SSH into 10 different machines and grep text files. It's impossible.
- **The Solution:** Data Collection Agency. Every service sends its logs to **one central place**. You don't go to the logs; the logs come to you.
- **In Tech:** You go to one website (like Kibana), type `error_code: 500`, and it shows you every 500 error from _every_ service in one list.

### 3. Metrics (Prometheus + Grafana)

- **The Problem:** Logs tell you "What happened". But they don't tell you "Health status". Is the CPU hot? Are we running out of memory? Is the site slow?
- **The Solution:** The **Car Dashboard**.
  - **Speedometer:** Requests per second (RPM).
  - **Fuel Gauge:** Memory usage.
  - **Engine Temperature:** Error rate.
    You don't read a log to see if you are speeding; you look at the gauge.
- **In Tech:** **Prometheus** scrapes numbers ("CPU is at 80%"). **Grafana** draws pretty charts so you can see spikes instantly.

### 4. Correlation IDs

- **The Problem:** You see an error in the Payment Service log: "Payment Failed". But _who_ was the user? What was the order?
- **The Solution:** The **Case Number**.
  - When a user makes a request, the Gateway generates a random ID: `req-123xyz`.
  - It passes this ID to Order Service.
  - Order Service passes it to Payment Service.
  - Every log line includes `[req-123xyz]`.
- **In Tech:** You copy `req-123xyz` into your log tool, and it shows you the entire story of that specific user request across the whole system.
