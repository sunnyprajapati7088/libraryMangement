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
app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (!sessions.has(refreshToken))
    return res.status(403).json({ message: "Forbidden" });

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, data) => {
    if (err)
      return res.status(403).json({ message: "Forbidden", error: err.message });
    const token = generateAccessToken({ user: data });
    res.json({ token });
  });
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
     
        if (!user) {
            return res.status(400).json({ message: "Username not registered!" });
        }
        const hashPassword = user.password;
        const isMatch = await bcrypt.compare(password, hashPassword)
        if (!isMatch) {
            return res.status(401).json({ message: "password not correct" })
        }
        const token_data = { user: email, role: user.role, user_id: user._id };
        console.log(token_data)
      
        const refresh_token = jwt.sign(
          token_data,
          process.env.REFRESH_TOKEN_SECRET
        );
        sessions.add(refresh_token);

        const token = generateAccessToken(token_data);
        return res.json({ token: token, refresh_token: refresh_token });
        

       
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: err.message });
    }
});

app.delete("/logout", (req, res) => {
    const refresh_token = req.body.token;
    if (!sessions.has(refresh_token)) {
        res.status(200).json({ message: "nothing to do" });
    }
    sessions.delete(refresh_token);
    return res.status(204).json({ message: "Logged out" });
});

function generateAccessToken(token_data) {
    console.log(token_data,"hell")
    return jwt.sign(token_data, process.env.JWT_SECRET, { expiresIn: '60m' });
}


app.listen(5001);