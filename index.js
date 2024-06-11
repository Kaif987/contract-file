const express = require('express')
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const jwt = require("jsonwebtoken")

const User = require("./model/user")

dotenv.config()

const app = express()
app.use(express.json())

const JWT_SECRET = "SECRET"

mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("Connected to mongodb")
    })


app.post("/signup", async (req, res) => {
    const { firstName, email, password } = req.body
    const user = await User.create({ firstName, email, password })
    const token = jwt.sign({ userId: user._id }, JWT_SECRET)
    res.status(200).json({ token })
})


app.post("/login", async (req, res) => {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
        return res.status(404).json({ message: "Error while loggin in" })
    }

    if (user.password !== password) {
        return res.status(403).json({ message: "Error while loggin in" })
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET)
    res.status(200).json({ token: token })

})

app.post("/logout", (req, res) => {
    res.json({ message: "User logged out" })
})

app.listen(3000, () => {
    console.log("server running on port 3000")
})