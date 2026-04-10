# Postman Testing Guide for Backend Ledger

## Base URL
`http://localhost:3000`

## Authentication
The API uses JWT (JSON Web Token) for authentication. After logging in, you will receive a token that must be included in subsequent requests.

Two ways to send the token:
1. **Cookie**: The server sets a cookie named `token` automatically on login/register.
2. **Authorization header**: `Authorization: Bearer <token>`

For Postman, you can use either method. The easiest is to use the **Authorization header**.

## Endpoints Overview

### 1. Authentication

#### Register a new user
- **Method**: POST
- **URL**: `/api/auth/register`
- **Body (JSON)**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```
- **Response**: Returns user details and token.

#### Login
- **Method**: POST
- **URL**: `/api/auth/login`
- **Body (JSON)**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
- **Response**: Returns user details and token.

#### Logout
- **Method**: POST
- **URL**: `/api/auth/logout`
- **Headers**: Include token (cookie or Authorization header)
- **Response**: Success message.

### 2. Accounts

#### Create a new account (for logged‑in user)
- **Method**: POST
- **URL**: `/api/accounts/`
- **Headers**: Authorization token required.
- **Body**: None (account is created with default currency INR and status ACTIVE)
- **Response**: Created account object.

#### Get all accounts of the logged‑in user
- **Method**: GET
- **URL**: `/api/accounts/`
- **Headers**: Authorization token required.
- **Response**: Array of account objects.

#### Get balance of a specific account
- **Method**: GET
- **URL**: `/api/accounts/balance/:accountId`
- **Headers**: Authorization token required.
- **Response**: `{ "accountId": "...", "balance": 0 }`

### 3. Transactions

#### Create a transaction (transfer between accounts)
- **Method**: POST
- **URL**: `/api/transactions/`
- **Headers**: Authorization token required.
- **Body (JSON)**:
```json
{
  "fromAccount": "account_id_1",
  "toAccount": "account_id_2",
  "amount": 100,
  "idempotencyKey": "unique_key_123"
}
```
- **Notes**:
  - `idempotencyKey` must be unique per transaction; repeating the same key will return the previous transaction status.
  - Both accounts must be ACTIVE.
  - Sender must have sufficient balance.

#### Create initial funds transaction (system user only)
- **Method**: POST
- **URL**: `/api/transactions/system/initial-funds`
- **Headers**: Authorization token required (must be a system user).
- **Body (JSON)**:
```json
{
  "toAccount": "account_id",
  "amount": 500,
  "idempotencyKey": "unique_key_456"
}
```
- **Note**: This endpoint is restricted to system users (users with `systemUser: true`). Use it to seed funds into an account.

## Step‑by‑Step Testing Flow

1. **Start the server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Register a new user** using `/api/auth/register`. Save the returned token.

3. **Login** (optional) using `/api/auth/login` to verify credentials.

4. **Create an account** using `/api/accounts/`. Note the `_id` of the created account.

5. **Create a second account** (if you want to test transfers) by repeating step 4.

6. **Get balance** of an account using `/api/accounts/balance/:accountId`. Initially balance will be 0.

7. **Seed funds** (if you have a system user):
   - You need a system user account. The seed data may already exist; otherwise you can manually set `systemUser: true` in the database.
   - Use `/api/transactions/system/initial-funds` to add funds to an account.

8. **Create a transaction** between two accounts using `/api/transactions/`. Ensure you have sufficient balance.

9. **Check balances again** to confirm the transfer worked.

## Example Postman Collection

You can import the existing Postman collections located in the `postman/collections/` folder:
- `New Collection.postman_collection.json`
- `New Collection 1.postman_collection.json`
- `New Collection 2.postman_collection.json`

These collections already contain sample requests; you may need to update variables (like `baseUrl`, `token`, `accountId`).

## Troubleshooting

- **401 Unauthorized**: Token missing, invalid, or blacklisted. Re‑login to get a fresh token.
- **400 Bad Request**: Missing or invalid request body fields. Check the required fields and data types.
- **500 Internal Server Error**: Something went wrong on the server. Check the server logs for details (console output).

## Test Scenarios

### Scenario 1: User Registration and Account Creation
1. Register a new user with a unique email.
2. Log in with the same credentials to obtain a token.
3. Create an account for the user.
4. Retrieve the account list to confirm the account appears.
5. Check the balance of the new account (should be 0).

### Scenario 2: Fund Seeding (System User Required)
1. Identify or create a system user (set `systemUser: true` in the database).
2. Log in as the system user.
3. Use the initial‑funds endpoint to add 1000 units to a target account.
4. Verify the account balance reflects the credited amount.

### Scenario 3: Transfer Between Two Accounts
1. Create two accounts (Account A and Account B) under the same user.
2. Seed funds into Account A (using system user or previous scenario).
3. Initiate a transfer from Account A to Account B with a unique idempotency key.
4. Confirm the transaction returns a "COMPLETED" status.
5. Check that Account A’s balance decreased by the transferred amount and Account B’s balance increased accordingly.

### Scenario 4: Idempotency Protection
1. Attempt a transaction with a specific idempotency key.
2. Repeat the exact same request (same key) within a short time.
3. Verify the second request returns the same transaction details without creating a duplicate transaction.

### Scenario 5: Error Handling
- **Insufficient balance**: Try to transfer an amount larger than the sender’s balance. Expect a 400 error with a descriptive message.
- **Invalid account IDs**: Use non‑existent account IDs in the transaction. Expect a 400 error.
- **Missing required fields**: Omit `idempotencyKey` or `amount` in the request body. Expect a 400 error.
- **Expired/blacklisted token**: Use a token that has been logged out (blacklisted). Expect a 401 error.

### Scenario 6: Concurrent Transactions (Advanced)
Simulate two parallel transfer requests from the same account with the same balance. Observe that the ledger consistency is maintained (no negative balance). This can be tested using Postman’s collection runner or scripting.

## Notes

- The server uses MongoDB Atlas; ensure your internet connection is active.
- Email notifications are sent for transactions; they are logged in the console but not actually sent unless you have configured valid Gmail OAuth credentials in `.env`.
- Idempotency keys are crucial for preventing duplicate transactions. Generate a unique key (e.g., UUID) for each transaction attempt.

Happy testing!