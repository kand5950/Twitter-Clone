const express = require("express");
const clientSessions = require("client-sessions");
const path = require("path");

const app = express();

// Middleware Setup
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

// Session Setup
app.use(
  clientSessions({
    cookieName: "session",
    secret: "yourSecretKeyHere", // Replace with a secure random string
    duration: 30 * 60 * 1000, // 30 minutes
    activeDuration: 5 * 60 * 1000, // 5 minutes
  })
);

// Make variables available in templates
app.use((req, res, next) => {
  res.locals.title = "Simple Twitter Clone"; // default title
  res.locals.user = req.session.user;
  next();
});

// Set EJS as the templating engine
app.set("view engine", "ejs");

// Mock User Data
const users = [
  {
    id: 1,
    username: "john",
    password: "password123", // Passwords should be hashed in production
    tweets: [
      {
        content: "Hello World!",
        timestamp: new Date(),
      },
      {
        content: "My second tweet",
        timestamp: new Date(),
      },
    ],
  },
  {
    id: 2,
    username: "jane",
    password: "password456",
    tweets: [
      {
        content: "Hi there!",
        timestamp: new Date(),
      },
      {
        content: "I love tweeting",
        timestamp: new Date(),
      },
    ],
  },
];

// Authentication Middleware
function requireLogin(req, res, next) {
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
}

// Routes

// Home Page
app.get("/", (req, res) => {
  res.render("index", { title: "Home" });
});

app.get("/login", (req, res) => {
    res.render("login", { error: null, title: "Login"});
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;

    const user = users.find(
        (u) => u.username === username && u.password === password
    );

    if (user) {
        //set session
        req.session.user = {
            id: user.id,
            username: user.username,
        };
        res.redirect("/profile");
    } else {
        res.render("login", {
            error: "Invalid username or password",
            title: "Login",
        });
    }
})


// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started at localhost:${PORT}`);
});