# Service Discovery & Load Balancing

## Concepts Explained (The "Phonebook & Receptionist" Analogy)

In a small village, you know everyone's house address. In a massive, growing city where people move houses every day, you need a dynamic system to find them.

### 1. Service Discovery (The Phonebook)

- **The Problem:** You have code that says `call("192.168.1.5")`. But that server crashed, and a new one started at `192.168.1.10`. Your code is now broken because the address changed.
- **The Solution:** A dynamic **Phonebook** (Service Registry).
  - When a service starts, it calls the Phonebook: "Hi, I am 'Order Service', and I am at `192.168.1.10`."
  - When you want to call the Order Service, you ask the Phonebook: "Where is 'Order Service'?"
  - The Phonebook tells you the current, correct IP address.
- **In Tech:** Tools like **Consul** or **Eureka**. In Kubernetes, this is built-in (DNS). You just call `http://order-service` and K8s figures out the IP.

### 2. Load Balancing (The Receptionist)

- **The Problem:** You have 3 chefs (copies of Order Service). If all requests go to Chef #1, he dies of exhaustion while Chef #2 and #3 are sleeping.
- **The Solution:** A **Receptionist** at the door.
  - Customer 1 -> "Go to Chef 1"
  - Customer 2 -> "Go to Chef 2"
  - Customer 3 -> "Go to Chef 3"
  - Customer 4 -> "Go to Chef 1" (Round Robin)
- **In Tech:**
  - **Server-Side LB:** The Gateway (Nginx) decides where to send the traffic. You just talk to the Gateway.
  - **Client-Side LB:** _You_ look at the list of 3 chefs and pick one yourself randomly.

### 3. Health Checks (The Pulse Check)

- **The Problem:** The Phonebook has an entry for "Chef 1", but Chef 1 has actually had a heart attack and is unconscious. Customers are sent to him but get no food.
- **The Solution:** The Phonebook manager calls every chef every 10 seconds: "Are you okay?".
  - If Chef 1 says "Yes", keep him in the book.
  - If Chef 1 says nothing (or "I'm sick"), **cross him out** of the book immediately so no new customers go there.
- **In Tech:** Every service has a `/health` endpoint that returns `200 OK`. The Registry pings it. If it fails, that IP is removed from the rotation instantly.

## Industry Standard Tools & Services

Here are some of the most popular tools and technologies used to implement these patterns:

| Functionality               | Best Tools / Technologies (Industry Standard)            | Why?                                                                                                                 |
| :-------------------------- | :------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------- |
| **Service Discovery**       | **Consul**, **Eureka** (Spring), **Kubernetes DNS**      | **Consul** is a general-purpose registry. **K8s DNS** handles discovery natively for containers without extra tools. |
| **Load Balancing** (Server) | **Nginx**, **HAProxy**, **AWS ALB**, **Google Cloud LB** | The "Receptionist" at the front door. Handles high traffic and SSL termination before it hits your services.         |
| **Load Balancing** (Client) | **Spring Cloud LoadBalancer**, **gRPC Client**           | The service itself decides which instance to call (e.g., "I'll call instance #3 this time"). Saves a network hop.    |
| **Health Checks**           | **Spring Boot Actuator**, **K8s Probes**                 | **Actuator** exposes `/actuator/health`. **K8s Probes** (Liveness/Readiness) restart containers if they freeze.      |
