# Backend Ledger System

A secure and scalable ledger management REST API built with Node.js, Express, and MongoDB. This application provides user authentication, account management, and transaction processing with email notifications.

## 🚀 Live Deployment

**Live API**: https://backend-ledger-8to4.onrender.com

**API Root Endpoint**: `GET /` returns "Ledger Service is up and running"

## 📋 Features

- **User Authentication**: JWT-based authentication with bcrypt password hashing
- **Account Management**: Create, retrieve, and manage user accounts
- **Transaction Processing**: Secure fund transfers between accounts
- **Email Notifications**: Automated emails for registration and transactions
- **Protected Routes**: Middleware-based authorization for sensitive endpoints
- **RESTful API**: Clean, predictable API endpoints following REST conventions

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT), bcrypt for password hashing
- **Email Service**: Nodemailer with Gmail OAuth2
- **Deployment**: Render (PaaS), MongoDB Atlas (Cloud Database)
- **API Testing**: Postman

## 📁 Project Structure

```
backend-ledger/
├── src/
│   ├── app.js              # Express application setup
│   ├── config/
│   │   └── db.js           # MongoDB connection
│   ├── controllers/        # Route controllers
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Authentication middleware
│   └── services/           # Business logic services
├── server.js               # Application entry point
├── package.json            # Dependencies and scripts
└── .env.example            # Environment variables template
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn package manager

### 1. Clone the Repository
```bash
git clone https://github.com/Yashveersir/Backend-Ledger.git
cd Backend-Ledger
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory and add the following variables:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret
REFRESH_TOKEN=your_google_oauth_refresh_token
PORT=3000
```

### 4. Run the Application
**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:3000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

#### Logout User
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### Account Endpoints

#### Create Account (Protected)
```http
POST /api/accounts/
Authorization: Bearer <token>
Content-Type: application/json

{
  "accountName": "Savings Account",
  "initialBalance": 1000
}
```

#### Get User Accounts (Protected)
```http
GET /api/accounts/
Authorization: Bearer <token>
```

#### Get Account Balance (Protected)
```http
GET /api/accounts/balance/:accountId
Authorization: Bearer <token>
```

### Transaction Endpoints

#### Create Transaction (Protected)
```http
POST /api/transactions/
Authorization: Bearer <token>
Content-Type: application/json

{
  "fromAccount": "account_id_1",
  "toAccount": "account_id_2",
  "amount": 500,
  "description": "Monthly rent payment"
}
```

#### System Initial Funds (Protected)
```http
POST /api/transactions/system/initial-funds
Authorization: Bearer <system_token>
Content-Type: application/json

{
  "accountId": "account_id",
  "amount": 10000
}
```

## 🔐 Authentication Flow

1. User registers with email, name, and password
2. Server creates user in database with hashed password
3. User logs in with credentials
4. Server validates credentials and returns JWT token
5. Client includes token in `Authorization: Bearer <token>` header for protected routes
6. Middleware validates token on each protected request

## 🗄️ Database Models

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

### Account Model
```javascript
{
  userId: ObjectId (ref: User),
  accountName: String,
  balance: Number,
  createdAt: Date
}
```

### Transaction Model
```javascript
{
  fromAccount: ObjectId (ref: Account),
  toAccount: ObjectId (ref: Account),
  amount: Number,
  description: String,
  status: String,
  createdAt: Date
}
```

## 🚢 Deployment

This application is deployed on **Render** with the following configuration:

1. **Build Command**: `npm install`
2. **Start Command**: `node server.js`
3. **Environment Variables**: Set in Render dashboard
4. **Database**: MongoDB Atlas with IP whitelist (0.0.0.0/0)

## 🧪 Testing

### Postman Collection
A Postman collection is available in the `postman/` directory for testing all API endpoints.

### Manual Testing
1. Start the server: `npm run dev`
2. Use Postman or curl to test endpoints
3. Verify responses and error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Yashveer Singh**
- GitHub: [@Yashveersir](https://github.com/Yashveersir)
- Project: [Backend Ledger](https://github.com/Yashveersir/Backend-Ledger)

## 🙏 Acknowledgments

- Express.js team for the amazing framework
- MongoDB for the flexible database solution
- Render for the seamless deployment platform
- All contributors and testers