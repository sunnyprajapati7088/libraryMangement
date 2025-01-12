require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const bcrypt=require('bcrypt')
const mongoose=require('mongoose')
let sessions = new Set();
mongoose.connect("mongodb+srv://kishan95570:kishan@cluster0.xvgle.mongodb.net/")
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

const app = express();
app.use(express.json());


app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        console.log(user)
        if (!user) {
            return res.status(400).json({ message: "Username not registered!" });
        }
        const hashPassword = user.password;
        const isMatch = await bcrypt.compare(password, hashPassword)
        if (!isMatch) {
            return res.status(401).json({ message: "password not correct" })
        }
        const token_data = { user: email ,role:user.role,user_id:user._id};
        console.log(user)
        const token = jwt.sign(token_data, process.env.JWT_SECRET,{expiresIn: '3h'});
        

       
        return res.json({ token: token,});
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message });
    }
});

app.delete("/logout", (req, res) => {
    const refresh_token = req.body.token;
    if (!sessions.has(refresh_token)) {
        res.status(200).json({ message: "No op" });
    }
    sessions.delete(refresh_token);
    return res.status(204).json({ message: "Logged out" });
});

function generateAccessToken(token_data) {
    return jwt.sign(token_data, process.env.JWT_SECRET, { expiresIn: '3h' });
}


app.listen(5001);