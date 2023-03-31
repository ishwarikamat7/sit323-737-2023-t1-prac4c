const express= require("express");
const jwt = require("jsonwebtoken");
const app= express();
app.use(express.json());
const fs = require('fs');
const userData = fs.readFileSync('users.json');
const data = JSON.parse(userData);

const admin_JWT_SECRET = "4n7SQn*5b2ldgX6Oj43%xfL$sf4Wd!QP81ERp7CZYoFZeivYmM";
const user_JWT_SECRET = "ycLMio&sKb&3JEG7zKIb^Dj@!3fHRzp5R20phctTV8q!g^9zOm";
var tokenKey = ""

  // Authenticating with Admin credentials and other User credentials
  app.post("/login", (req, res) => {
    const { username, password } = req.body;
    console.log(`${username} is trying to login ..`);
    const isUserPresent = data.some(obj => obj.name === username && obj.password === password);
  
    if (isUserPresent) {
      tokenKey = username === "admin"? admin_JWT_SECRET: user_JWT_SECRET;
      return res.json({
        token: jwt.sign({ user: username }, tokenKey),
      });
    }  
    return res
      .status(401)
      .json({ message: "The username and password your provided are invalid" });
  });

  // Authorization using jwt.verify
  app.get("/private-resource", (req, res) => {
    if (!req.headers.authorization) {
      return res.status(401).json({ error: "Not Authorized" });
    }
    // Bearer <token>>
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    try {
      // Verify the token is valid
      const { user } = jwt.verify(token, tokenKey);
      return res.status(200).json({
        message: `Congrats ${user}! You can now accesss the private resource`,
      });
    } catch (error) {
      return res.status(401).json({ error: "Not Authorized" });
    }
  });

const port=3040;
app.listen(port,()=> {
    console.log("hello i'm listening to port " +port);
})