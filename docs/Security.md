# Security Patterns

## Concepts Explained (The "Airport Security" Analogy)

Microservices are like an airport. You have public areas, secure areas, staff-only zones, and critical control towers. Security must be everywhere, not just at the front door.

### 1. API Gateway Authentication (The TSA Checkpoint)

- **The Problem:** You have 50 services. If every single service has to check "Username/Password" against the database, it's slow, inefficient, and unsafe (copying login logic 50 times).
- **The Solution:** A single **TSA Checkpoint** at the entrance (API Gateway).
  - User shows ID (Login).
  - Gateway checks it and gives a **Boarding Pass** (JWT Token).
  - Now the user can go to any gate (Service) just by showing the pass. The services trust the pass; they don't need to check the ID again.
- **In Tech:** The Gateway handles Login/OAuth. It passes a signed JWT to internal services. Internal services just verify the signature.

### 2. Service-to-Service Auth (Staff Badges / mTLS)

- **The Problem:** Even if the front door is locked, what if a thief breaks in through a window (a hacked service)? If "Order Service" trusts _anyone_ who calls it, the hacked service can delete all orders.
- **The Solution:** **Staff Badges** (mTLS / API Keys).
  - To talk to the "Order Service", you don't just need to be inside the building; you need a specific badge that says "I am the Payment Service".
  - The Order Service checks: "Do you have the Payment Service badge? Yes? Okay, come in."
- **In Tech:** Mutual TLS (mTLS). Service A and Service B exchange certificates. "I am A." "I am B." "Okay, we trust each other." If you don't have the cert, you can't even connect.

### 3. Secrets Management (The Bank Vault)

- **The Problem:** Developers accidentally check in passwords like `DB_PASSWORD=secret123` into GitHub. Hackers find it. Game over.
- **The Solution:** A **Bank Vault** (Vault / AWS Secrets Manager).
  - The code never contains the password.
  - The code contains a "Key to part of the Vault".
  - When the app starts, it asks the Bank: "Can I have the DB password please?"
  - The Bank checks the key and whispers the password into the app's memory only.
- **In Tech:** You store secrets in HashiCorp Vault. Your app retrieves them at runtime. No passwords in `config.js` or `.env` files committed to Git.

### 4. Input Validation (Sanitizing the Luggage)

- **The Problem:** A user sends a letter tailored to explode when opened (SQL Injection / XSS). If the service blindly processes it, it crashes or leaks data.
- **The Solution:** **Luggage Scan**.
  - Every bag (Request) is X-Rayed before it gets on the plane.
  - "Is this a valid phone number?" "Is this a real email?"
  - If not, throw it in the trash immediately.
- **In Tech:** Validation libraries (like Joi or Zod). `email: Joi.string().email().required()`. If the user sends `DROP TABLE users`, the validator rejects it before it even reaches your database.

### 5. Network Isolation (The Perimeter Fence)

- **The Problem:** You have a TSA checkpoint (Gateway), but the back door to the "Order Department" is wide open. Anyone who finds the side street (Port 3000) can walk right in without a ticket.
- **The Solution:** **A High Fence**.
  - Remove all outside doors (Port Mappings) for internal buildings.
  - The _only_ way in is through the main TSA Checkpoint.
  - Once inside, staff (Services) can move between buildings using internal tunnels (Docker Network), but outsiders cannot.
- **In Tech:** In `docker-compose.yml`, remove `ports: "3000:3000"` for internal services. Only expose the Gateway (`8081`). Internal services talk via Docker's internal DNS (`http://order-service:3000`).

## Industry Standard Tools & Services

Here are some of the most popular tools and technologies used to implement these Security patterns:

| Functionality                | Best Tools / Technologies (Industry Standard)           | Why?                                                                                                                 |
| :--------------------------- | :------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------- |
| **Authentication (Gateway)** | **Keycloak**, **Auth0**, **Okta**, **AWS Cognito**      | Centralized Identity Providers (IdP). They handle login pages, MFA, and issuing JWTs so your services don't have to. |
| **Service-to-Service Auth**  | **Istio (mTLS)**, **Linkerd**, **Consul Connect**       | Automatically encrypts traffic between services and validates identity certificates (mTLS) without code changes.     |
| **Secrets Management**       | **HashiCorp Vault**, **AWS Secrets Manager**            | Securely stores API keys and DB passwords. Apps retrieve them at runtime, keeping secrets out of Git.                |
| **Input Validation**         | **Joi**, **Zod**, **Hibernate Validator** (Java)        | Libraries that define strict schemas for data. They reject invalid or malicious inputs (SQLi, XSS) early.            |
| **Network Isolation**        | **Calico**, **Cilium**, **Kubernetes Network Policies** | Acts as a firewall inside your cluster. "Allow Order Service to talk to Payment Service, but block everything else." |
