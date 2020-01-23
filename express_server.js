//  ******* Variable declaration and require ******

const express = require("express");
const bcrypt = require("bcrypt")
const app = express();
const PORT = 8080;
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
app.use(cookieParser());
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
  extended: true
}));

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "userRandomID"
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "userRandomID"
  }

};

// *** Global users object ***

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};
// found in the req.params object

//  *** urls homepage ***

app.get("/urls", (req, res) => {
  let obj1 = {};
  const loginID = req.cookies.id
  for (let i in urlDatabase) {
    if (urlDatabase[i].userID === loginID) {
      obj1[i] = urlDatabase[i]
    }
  }
  let templateVars = {
    urls: obj1,
    username: req.cookies["id"]
    // username: users[req.cookies["id"]].email
  };
  res.render("urls_index", templateVars);
});

app.post("/urls", (req, res) => {
  let longURL = req.body.longURL;
  let shortURL = generateRandomString();
  urlDatabase[shortURL] = {
    longURL,
    userID: req.cookies.id
  };
  res.redirect("/urls/" + shortURL);
});

//  *** urls  create a new url ***

app.get("/urls/new", (req, res) => {
  let templateVars = {
    username: users[req.cookies.id]
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = {
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    username: req.cookies["id"]
  };
  res.render("urls_show", templateVars);
});


// *** delete  URL ***

app.post("/urls/:shortURL/delete", (req, res) => {
  let shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

// *** Update URL ***

app.post("/urls/:shortURL", (req, res) => {
  urlDatabase[req.params.shortURL] = req.body.longURL;
  res.redirect("/urls");
});

// *** Login & Logout ***
app.get("/login", (req, res) => {
  let templateVars = {
    username: users[req.cookies.id]
  };
  res.render("urls_login", templateVars);
});

app.post("/login", (req, res) => {
  let email = req.body.email;
  const password = req.body.password;
  console.log(password);
  for (let key in users) {
    if (users[key].email === email && bcrypt.compareSync(password, users[key].password)) {
      res.cookie("id", key);
      res.redirect("/urls");
      return
    }
  }
  res.status(400);
  res.send("Login failed");
});

app.post("/logout", (req, res) => {
  res.clearCookie("id");
  res.redirect("/urls");
});

// *** Registration ***

app.get("/register", (req, res) => {
  let templateVars = {
    username: users[req.cookies.id],

  };
  res.render("urls_registration", templateVars);
});
//  check if  email exists .. give error if true
app.post("/register", (req, res) => {
  let userID = generateRandomString();
  let email = req.body.email;
  let password = req.body.password;
  if (email === "" || password === "") {
    res.status(404);
    res.send("Email and Password cannot be blank");
  } else if (emailLookUp(email, users)) {
    res.status(400).send("Email already exists. Please login!!");
  } else {
    users[userID] = {
      id: userID,
      email: email,
      password: bcrypt.hashSync(password, 10)
    };
    console.log(users);
    res.cookie("id", userID);
    res.redirect("/urls");
    // res.clearCookie("username", username)
  }
});

//  ***function to generate random string***

function generateRandomString() {
  let randomString = Math.random()
    .toString(36)
    .substring(2, 8);
  return randomString;
}

// *** Function - Email lookup  ***

const emailLookUp = (email, users) => {
  for (let key in users) {
    if (users[key].email === email) {
      return true;
    }
  }
  return false;
};

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});