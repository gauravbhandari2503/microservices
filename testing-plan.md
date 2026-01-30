# Testing Plan

## 1. Register a New User

```bash
curl -X POST http://localhost:8081/users \
  -H "Content-Type: application/json" \
  -d '{"name": "Secure User", "email": "secure@example.com", "password": "securePass123"}'
```

## 2. Login to Get Token

```bash
curl -X POST http://localhost:8081/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "secure@example.com", "password": "securePass123"}'
```

**Response should contain:** `{"token": "..."}`

## 3. Access Protected Route (Orders)

Replace `<TOKEN>` with the token from Step 2.

```bash
curl -X POST http://localhost:8081/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"user_id": 1, "product_name": "Secure Book"}'
```

## 4. Verify Service Isolation

This should FAIL (Connection Refused).

```bash
curl http://localhost:8000/users/1
```
