const express = require("express")
const cookieParser = require("cookie-parser")
const path = require("path")



const app = express()

// CORS headers for API access
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    if (req.method === "OPTIONS") return res.sendStatus(200)
    next()
})

app.use(express.json())
app.use(cookieParser())

// Serve static files from public directory
app.use(express.static(path.join(__dirname, "..", "public")))

/**
 * - Routes required
 */
const authRouter = require("./routes/auth.routes")
const accountRouter = require("./routes/account.routes")
const transactionRoutes = require("./routes/transaction.routes")

/**
 * - Use Routes
 */

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "public", "index.html"))
})

app.use("/api/auth", authRouter)
app.use("/api/accounts", accountRouter)
app.use("/api/transactions", transactionRoutes)

module.exports = app